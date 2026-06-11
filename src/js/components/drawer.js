// Stisla.Drawer — V3.md §3.7 reference implementation.
//
// Anatomy:
//   .drawer[data-stisla-drawer][data-state="open|closed"]
//     .drawer__backdrop[data-stisla-drawer-dismiss]
//     .drawer__content
//       .drawer__header
//         .drawer__title
//         .drawer__close[data-stisla-drawer-dismiss]
//       .drawer__body
//       .drawer__footer
//
// Events (bubbling, detail: { drawer: this }):
//   stisla:drawer:opening   — before open  (cancelable)
//   stisla:drawer:opened    — after open transition
//   stisla:drawer:closing   — before close (cancelable)
//   stisla:drawer:closed    — after close transition
//
// Opts (defaults below):
//   backdrop: true | false | 'static'  — false = no backdrop; 'static' = shake on click
//   keyboard: true                      — ESC closes
//   focus: true                         — move focus into panel on open
//   returnFocus: true                   — restore focus to opener on close
//   scroll: false                       — true = allow page scroll while open

import { createFocusTrap } from 'focus-trap';
import { Component, getInstance } from '../core/component.js';
import { readOpts } from '../core/init.js';
import { waitForTransition } from '../core/transition.js';
import { inertSiblings } from '../core/inert.js';

const SCROLL_LOCK_CLASS = 'is-drawer-open';
const OPEN = 'open';
const CLOSED = 'closed';

let openCount = 0;

export class Drawer extends Component {
  static eventNamespace = 'drawer';
  static defaults = {
    backdrop: true,
    keyboard: true,
    focus: true,
    returnFocus: true,
    scroll: false,
  };

  constructor(el, opts) {
    super(el, opts);

    // Normalize backdrop: only 'static' or false are special; anything else → true.
    if (this.opts.backdrop !== 'static' && this.opts.backdrop !== false) {
      this.opts.backdrop = true;
    }
    // Normalize scroll to boolean (the attribute parser may hand us "true"/"false" strings).
    this.opts.scroll = this.opts.scroll === true || this.opts.scroll === 'true';

    this._content = el.querySelector('.drawer__content');
    // Make the trap container focusable so a mousedown on plain text inside
    // it doesn't walk up to a focusable ancestor outside the trap — which
    // would make focus-trap yank focus back and cancel the text selection.
    if (this._content && !this._content.hasAttribute('tabindex')) {
      this._content.setAttribute('tabindex', '-1');
    }
    this._returnFocusEl = null;
    this._trap = null;
    this._releaseInert = null;
    this._onKeydown = this._onKeydown.bind(this);

    if (!el.dataset.state) el.dataset.state = CLOSED;
    el.setAttribute('aria-hidden', el.dataset.state === OPEN ? 'false' : 'true');
  }

  open() {
    if (!this.el || this.el.dataset.state === OPEN) return;
    if (!this.emit('opening')) return;

    this._returnFocusEl = document.activeElement;
    this._releaseInert = inertSiblings(this.el);

    if (!this.opts.scroll) {
      if (openCount === 0) document.documentElement.classList.add(SCROLL_LOCK_CLASS);
      openCount++;
    }

    // Force layout in 'block' before flipping state so opacity/transform transitions run.
    this.el.style.display = 'block';
    void this.el.offsetWidth;

    requestAnimationFrame(() => {
      if (!this.el) return;
      this.el.dataset.state = OPEN;
      this.el.setAttribute('aria-hidden', 'false');

      if (this.opts.focus && this._content) {
        try {
          this._trap = createFocusTrap(this._content, {
            initialFocus: () =>
              this._content.querySelector('[autofocus]') ||
              this._firstTabbable() ||
              this._content,
            escapeDeactivates: false,
            returnFocusOnDeactivate: false,
            allowOutsideClick: true,
            clickOutsideDeactivates: false,
            fallbackFocus: this._content,
          });
          this._trap.activate();
        } catch (e) {
          this._content.focus?.();
        }
      }

      if (this.opts.keyboard) {
        document.addEventListener('keydown', this._onKeydown);
      }

      waitForTransition(this._content).then(() => {
        if (!this.el) return;
        this.emit('opened', {}, { cancelable: false });
      });
    });
  }

  close() {
    if (!this.el || this.el.dataset.state !== OPEN) return;
    if (!this.emit('closing')) return;

    if (this._trap) {
      try { this._trap.deactivate(); } catch (e) { /* noop */ }
      this._trap = null;
    }
    if (this.opts.keyboard) {
      document.removeEventListener('keydown', this._onKeydown);
    }

    this.el.dataset.state = CLOSED;
    this.el.setAttribute('aria-hidden', 'true');

    waitForTransition(this._content).then(() => {
      if (!this.el) return;
      this.el.style.display = '';
      this._releaseInert?.();
      this._releaseInert = null;
      if (!this.opts.scroll) {
        openCount = Math.max(0, openCount - 1);
        if (openCount === 0) document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      }

      if (this.opts.returnFocus && this._returnFocusEl && typeof this._returnFocusEl.focus === 'function') {
        this._returnFocusEl.focus();
      }
      this._returnFocusEl = null;
      this.emit('closed', {}, { cancelable: false });
    });
  }

  toggle() {
    this.el?.dataset.state === OPEN ? this.close() : this.open();
  }

  // Visual nudge used when a static backdrop is clicked. Shake axis is
  // driven by the placement class on the root (CSS picks the keyframe).
  shake() {
    if (!this._content) return;
    this._content.classList.remove('is-shaking');
    void this._content.offsetWidth;
    this._content.classList.add('is-shaking');
    setTimeout(() => this._content?.classList.remove('is-shaking'), 250);
  }

  destroy() {
    if (this.el?.dataset.state === OPEN) {
      if (this._trap) { try { this._trap.deactivate(); } catch (e) { /* noop */ } this._trap = null; }
      if (this.opts.keyboard) document.removeEventListener('keydown', this._onKeydown);
      this._releaseInert?.();
      this._releaseInert = null;
      if (!this.opts.scroll) {
        openCount = Math.max(0, openCount - 1);
        if (openCount === 0) document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      }
    }
    super.destroy();
  }

  _onKeydown(e) {
    if (e.key === 'Escape' && this.el?.dataset.state === OPEN) {
      e.preventDefault();
      this.close();
    }
  }

  _firstTabbable() {
    return this._content?.querySelector(
      'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
  }

}

// Global delegated click handler — bound once per page load.
// Sentinel mirrors the HMR-safe pattern from src/js/components/dialog.js.
if (typeof document !== 'undefined' && typeof window !== 'undefined' && !window.__stislaDrawerBound) {
  window.__stislaDrawerBound = true;

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-stisla-drawer-trigger]');
    if (opener) {
      const id = opener.getAttribute('data-stisla-drawer-trigger');
      const drawerEl = id && document.getElementById(id);
      if (drawerEl && drawerEl.classList.contains('drawer')) {
        e.preventDefault();
        const opts = readOpts(drawerEl, 'drawer', Drawer);
        const existing = getInstance(drawerEl);
        const inst = existing ?? new Drawer(drawerEl, opts);
        if (existing) Object.assign(existing.opts, opts);
        inst.open();
      }
      return;
    }

    const dismiss = e.target.closest('[data-stisla-drawer-dismiss]');
    if (dismiss) {
      const drawerEl = dismiss.closest('.drawer');
      const inst = drawerEl && getInstance(drawerEl);
      if (!inst) return;
      // Static backdrop: a click on the backdrop element shakes the panel
      // instead of closing. Explicit dismiss controls (.drawer__close,
      // footer buttons with [data-stisla-drawer-dismiss]) always close.
      if (inst.opts.backdrop === 'static' && dismiss.classList.contains('drawer__backdrop')) {
        inst.shake();
        return;
      }
      inst.close();
    }
  });
}
