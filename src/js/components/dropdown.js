// Stisla.Dropdown — V3.md §3.7 reference implementation.
//
// Anatomy:
//   .dropdown
//     <button data-stisla-dropdown-trigger="menuId" aria-haspopup="menu"
//             aria-expanded="false" aria-controls="menuId">…</button>
//     .dropdown-menu#menuId[data-stisla-dropdown][role="menu"]
//                  [data-state="open|closed"]
//       .dropdown-menu__item[role="menuitem|menuitemcheckbox|menuitemradio"]
//                  [data-highlighted]  [data-state="checked|active"]
//                  [aria-current]      [aria-disabled]
//
// Events (bubbling, detail: { dropdown: this }):
//   stisla:dropdown:opening   — before open  (cancelable)
//   stisla:dropdown:opened    — after open + position
//   stisla:dropdown:closing   — before close (cancelable)
//   stisla:dropdown:closed    — after close
//
// Opts (defaults below):
//   placement: 'bottom-start'           — Floating UI placement
//   offset: 8                           — distance from trigger
//   autoClose: 'both'                   — 'outside' | 'inside' | 'both' | false
//   focus: true                         — move focus to first item on open
//
// Per-item opt-outs (on the .dropdown-menu__item):
//   data-stisla-dropdown-auto-close="false"  — clicking this item keeps menu open
//
// Floating UI positions absolutely; the trigger must be a sibling under
// .dropdown for default flow. For portal usage, set the menu's position
// strategy via opts (not implemented in 3.0 — defer).

import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
} from '@floating-ui/dom';
import { Component, getInstance } from '../core/component.js';
import { readOpts } from '../core/init.js';

const OPEN = 'open';
const CLOSED = 'closed';
const TYPEAHEAD_WINDOW_MS = 500;
const SCROLL_LOCK_CLASS = 'is-dropdown-open';

// Body scroll is locked while any dropdown is open. Matches the Dialog +
// Drawer convention and sidesteps the visible repositioning lag Floating
// UI would otherwise produce on every scroll frame (the menu is
// position: fixed; the trigger isn't). Counter tracks stacked dropdowns
// so the last one to close releases the lock.
let openCount = 0;

export class Dropdown extends Component {
  static eventNamespace = 'dropdown';
  static defaults = {
    placement: 'bottom-start',
    offset: 8,
    autoClose: 'both',
    focus: true,
  };

  constructor(el, opts) {
    super(el, opts);

    // Normalize: attribute parser may hand us numeric strings.
    if (typeof this.opts.offset === 'string') {
      const n = Number(this.opts.offset);
      if (!Number.isNaN(n)) this.opts.offset = n;
    }

    this._menu = el;
    // Trigger is matched by id — works whether the trigger sits inside or
    // outside the .dropdown wrapper. A consumer without an id on the menu
    // can't reach this component; the dev warning makes that visible.
    if (!el.id) {
      console.warn(
        '[stisla] .dropdown-menu needs an id so its trigger can target it',
        el,
      );
    }
    this._trigger = el.id
      ? document.querySelector(`[data-stisla-dropdown-trigger="${el.id}"]`)
      : null;

    this._cleanupAutoUpdate = null;
    this._returnFocusEl = null;
    this._typeaheadBuffer = '';
    this._typeaheadTimer = 0;

    this._onDocKeydown = this._onDocKeydown.bind(this);
    this._onDocPointerDown = this._onDocPointerDown.bind(this);

    // Menu container is focusable via JS (tabindex=-1) so document keydown
    // sees the menu in the focus chain after open. Roving tabindex on items
    // lands focus inside the menu lazily — only after the user presses Down
    // or any keyboard nav key. Mouse hover never moves focus or highlight,
    // matching native menus (not the auto-tracking <select> model).
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');

    if (!el.dataset.state) el.dataset.state = CLOSED;
    if (this._trigger && !this._trigger.hasAttribute('aria-expanded')) {
      this._trigger.setAttribute('aria-expanded', 'false');
    }
  }

  open() {
    if (!this.el || this.el.dataset.state === OPEN) return;
    if (!this._trigger) return;
    if (!this.emit('opening')) return;

    this._returnFocusEl = document.activeElement;

    if (openCount === 0) document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    openCount++;

    // Force display: flex before position so getBoundingClientRect runs
    // against a measurable element. Without this the menu reads 0×0 and
    // Floating UI hands back top/left = NaN.
    this.el.style.display = 'flex';
    void this.el.offsetWidth;

    this._cleanupAutoUpdate = autoUpdate(this._trigger, this.el, () =>
      this._position(),
    );

    requestAnimationFrame(() => {
      if (!this.el) return;
      this.el.dataset.state = OPEN;
      this._trigger.setAttribute('aria-expanded', 'true');

      // No item gets data-highlighted yet — the first keyboard nav keypress
      // seeds it lazily. Focus the menu container so document keydown sees
      // the menu in the focus chain.
      if (this.opts.focus) {
        this.el.focus({ preventScroll: true });
      }

      document.addEventListener('keydown', this._onDocKeydown, true);
      document.addEventListener('pointerdown', this._onDocPointerDown, true);

      this._waitForTransition(this.el).then(() => {
        if (!this.el) return;
        this.emit('opened', {}, { cancelable: false });
      });
    });
  }

  close({ returnFocus = true } = {}) {
    if (!this.el || this.el.dataset.state !== OPEN) return;
    if (!this.emit('closing')) return;

    if (this._cleanupAutoUpdate) {
      this._cleanupAutoUpdate();
      this._cleanupAutoUpdate = null;
    }
    document.removeEventListener('keydown', this._onDocKeydown, true);
    document.removeEventListener('pointerdown', this._onDocPointerDown, true);
    this._clearTypeahead();

    this.el.dataset.state = CLOSED;
    if (this._trigger) this._trigger.setAttribute('aria-expanded', 'false');
    this._clearHighlight();

    this._waitForTransition(this.el).then(() => {
      if (!this.el) return;
      this.el.style.display = '';
      openCount = Math.max(0, openCount - 1);
      if (openCount === 0) document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      if (
        returnFocus &&
        this._returnFocusEl &&
        typeof this._returnFocusEl.focus === 'function'
      ) {
        this._returnFocusEl.focus({ preventScroll: true });
      }
      this._returnFocusEl = null;
      this.emit('closed', {}, { cancelable: false });
    });
  }

  toggle() {
    if (!this.el) return;
    this.el.dataset.state === OPEN ? this.close() : this.open();
  }

  destroy() {
    if (this.el?.dataset.state === OPEN) {
      if (this._cleanupAutoUpdate) {
        this._cleanupAutoUpdate();
        this._cleanupAutoUpdate = null;
      }
      document.removeEventListener('keydown', this._onDocKeydown, true);
      document.removeEventListener('pointerdown', this._onDocPointerDown, true);
      this._clearTypeahead();
      openCount = Math.max(0, openCount - 1);
      if (openCount === 0) document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
    }
    super.destroy();
  }

  // === Positioning ========================================================

  async _position() {
    if (!this.el || !this._trigger) return;
    const { x, y } = await computePosition(this._trigger, this.el, {
      // 'fixed' strategy positions the menu in viewport coordinates so any
      // ancestor with overflow: hidden (or scroll, clip) can't crop the menu.
      // Matches CSS position: fixed on .dropdown-menu.
      strategy: 'fixed',
      placement: this.opts.placement,
      middleware: [
        offset(this.opts.offset),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply: ({ availableHeight }) => {
            Object.assign(this.el.style, {
              maxHeight: `${Math.max(120, availableHeight - 8)}px`,
              overflowY: 'auto',
            });
          },
        }),
      ],
    });
    Object.assign(this.el.style, {
      left: `${Math.round(x)}px`,
      top: `${Math.round(y)}px`,
    });
  }

  // === Items ==============================================================

  _items() {
    return Array.from(
      this.el.querySelectorAll('.dropdown-menu__item'),
    );
  }

  _enabledItems() {
    return this._items().filter((item) => !this._isDisabled(item));
  }

  _isDisabled(item) {
    return item.disabled || item.getAttribute('aria-disabled') === 'true';
  }

  _firstEnabledItem() {
    return this._enabledItems()[0] ?? null;
  }

  _lastEnabledItem() {
    const list = this._enabledItems();
    return list[list.length - 1] ?? null;
  }

  _highlight(item) {
    if (!item) return;
    this._clearHighlight();
    item.setAttribute('data-highlighted', '');
    item.focus({ preventScroll: false });
  }

  _clearHighlight() {
    this.el
      ?.querySelectorAll('[data-highlighted]')
      .forEach((item) => item.removeAttribute('data-highlighted'));
  }

  // Move keyboard highlight by `delta`. If no item is currently highlighted,
  // the first keypress seeds it: Down/Home/typeahead start at the first
  // enabled item, Up/End start at the last. Mouse hover never lands here —
  // it paints :hover via CSS without touching data-highlighted.
  _moveHighlight(delta) {
    const enabled = this._enabledItems();
    if (enabled.length === 0) return;
    const current = this.el.querySelector('[data-highlighted]');
    if (!current) {
      this._highlight(delta > 0 ? enabled[0] : enabled[enabled.length - 1]);
      return;
    }
    const idx = enabled.indexOf(current);
    const next = enabled[(idx + delta + enabled.length) % enabled.length];
    this._highlight(next);
  }

  // === Keyboard + pointer =================================================

  _onDocKeydown(e) {
    if (!this.el || this.el.dataset.state !== OPEN) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        this.close();
        return;
      case 'Tab':
        // Let the browser advance focus naturally; close the menu so its
        // tabindex=0/-1 roving doesn't trap focus after the menu vanishes.
        this.close({ returnFocus: false });
        return;
      case 'ArrowDown':
        e.preventDefault();
        this._moveHighlight(1);
        return;
      case 'ArrowUp':
        e.preventDefault();
        this._moveHighlight(-1);
        return;
      case 'Home':
        e.preventDefault();
        this._highlight(this._firstEnabledItem());
        return;
      case 'End':
        e.preventDefault();
        this._highlight(this._lastEnabledItem());
        return;
      case 'Enter':
      case ' ': {
        const current = this.el.querySelector('[data-highlighted]');
        if (current) {
          e.preventDefault();
          current.click();
        }
        return;
      }
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          this._typeahead(e.key);
        }
    }
  }

  _onDocPointerDown(e) {
    if (!this.el || this.el.dataset.state !== OPEN) return;
    if (this.el.contains(e.target)) return;
    if (this._trigger && this._trigger.contains(e.target)) return;
    if (this.opts.autoClose === false || this.opts.autoClose === 'inside') return;
    this.close({ returnFocus: false });
  }

  // === Typeahead ==========================================================

  _typeahead(char) {
    this._typeaheadBuffer += char.toLowerCase();
    clearTimeout(this._typeaheadTimer);
    this._typeaheadTimer = setTimeout(
      () => this._clearTypeahead(),
      TYPEAHEAD_WINDOW_MS,
    );

    const enabled = this._enabledItems();
    if (enabled.length === 0) return;

    const current = this.el.querySelector('[data-highlighted]');
    const startIdx = current ? enabled.indexOf(current) : -1;
    const buffer = this._typeaheadBuffer;

    // Scan starting one position after the current highlight, wrapping.
    // When the buffer is a single char and matches the current item, that's
    // a "next match" cycle — start from startIdx + 1.
    const offset = buffer.length === 1 ? 1 : 0;
    for (let i = 0; i < enabled.length; i++) {
      const idx = (startIdx + offset + i + enabled.length) % enabled.length;
      const text = (enabled[idx].textContent || '').trim().toLowerCase();
      if (text.startsWith(buffer)) {
        this._highlight(enabled[idx]);
        return;
      }
    }
  }

  _clearTypeahead() {
    this._typeaheadBuffer = '';
    clearTimeout(this._typeaheadTimer);
    this._typeaheadTimer = 0;
  }

  // === Transition wait ====================================================

  _waitForTransition(el) {
    return new Promise((resolve) => {
      if (!el) return resolve();
      const reduced =
        typeof matchMedia === 'function' &&
        matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        requestAnimationFrame(() => resolve());
        return;
      }
      const cs = getComputedStyle(el);
      const durations = cs.transitionDuration
        .split(',')
        .map((s) => parseFloat(s) || 0);
      const total = durations.length ? Math.max(...durations) : 0;
      if (total === 0) {
        requestAnimationFrame(() => resolve());
        return;
      }
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        el.removeEventListener('transitionend', onEnd);
        clearTimeout(fallback);
        resolve();
      };
      const onEnd = (e) => {
        if (e.target === el) finish();
      };
      el.addEventListener('transitionend', onEnd);
      const fallback = setTimeout(finish, total * 1000 * 1.5 + 50);
    });
  }
}

// Global delegated handlers — bound once per page load.
// Sentinel mirrors the HMR-safe pattern from src/js/components/dialog.js.
if (
  typeof document !== 'undefined' &&
  typeof window !== 'undefined' &&
  !window.__stislaDropdownBound
) {
  window.__stislaDropdownBound = true;

  // Trigger click → toggle the matched menu. Per-attr opts re-read on every
  // toggle so HMR / DOM swaps don't strand stale defaults.
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-stisla-dropdown-trigger]');
    if (opener) {
      const id = opener.getAttribute('data-stisla-dropdown-trigger');
      const menuEl = id && document.getElementById(id);
      if (menuEl && menuEl.classList.contains('dropdown-menu')) {
        e.preventDefault();
        const opts = readOpts(menuEl, 'dropdown', Dropdown);
        const existing = getInstance(menuEl);
        const inst = existing ?? new Dropdown(menuEl, opts);
        if (existing) Object.assign(existing.opts, opts);
        inst.toggle();
      }
      return;
    }

    // Item click — handle menuitemcheckbox / menuitemradio state flip and
    // honor opts.autoClose. Disabled rows are filtered by CSS pointer-events
    // already, but check defensively for the disabled attr path.
    const item = e.target.closest('.dropdown-menu__item');
    if (item) {
      const menuEl = item.closest('.dropdown-menu');
      const inst = menuEl && getInstance(menuEl);
      if (!inst) return;
      if (item.disabled || item.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        return;
      }

      const role = item.getAttribute('role');
      if (role === 'menuitemcheckbox') {
        const checked = item.getAttribute('data-state') === 'checked';
        item.setAttribute('data-state', checked ? 'unchecked' : 'checked');
        item.setAttribute('aria-checked', checked ? 'false' : 'true');
      } else if (role === 'menuitemradio') {
        const group = item.closest('[role="group"]') ?? menuEl;
        group
          .querySelectorAll('[role="menuitemradio"]')
          .forEach((sibling) => {
            sibling.setAttribute('data-state', 'unchecked');
            sibling.setAttribute('aria-checked', 'false');
          });
        item.setAttribute('data-state', 'checked');
        item.setAttribute('aria-checked', 'true');
      }

      const optOut =
        item.getAttribute('data-stisla-dropdown-auto-close') === 'false';
      const close =
        !optOut &&
        (inst.opts.autoClose === 'both' || inst.opts.autoClose === 'inside');
      if (close) inst.close();
    }
  });
}
