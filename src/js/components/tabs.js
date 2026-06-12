// Stisla.Tabs — V3.md §3.7 content-panel switcher.
//
// Anatomy:
//   <div class="tabs" data-stisla-tabs>
//     <div class="tabs__list">
//       <button class="tabs__trigger" data-value="overview">Overview</button>
//       <button class="tabs__trigger" data-value="activity">Activity</button>
//     </div>
//     <div class="tabs__panel" data-value="overview">…</div>
//     <div class="tabs__panel" data-value="activity">…</div>
//   </div>
//
// Author writes data-value on triggers + panels; the class wires every
// ARIA attr (role, aria-selected, aria-controls, aria-labelledby, tabindex)
// on init so the markup stays minimal. IDs auto-generated when missing.
//
// Orientation autodetect: .tabs--vertical → 'vertical'; else 'horizontal'.
// Initial value: opts.value → existing [data-state="active"] → first enabled.
//
// Activation mode:
//   'automatic' (default) — focus = activate (WAI-ARIA APG auto-mode)
//   'manual'              — arrows move focus only; click/Enter/Space commits
//
// Events (bubble):
//   stisla:tabs:changing  (cancelable) — detail { value, previousValue }
//   stisla:tabs:changed   (post-flip)  — detail { value, previousValue }

import { Component } from '../core/component.js';

const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const AUTO = 'automatic';

let counter = 0;

export class Tabs extends Component {
  static eventNamespace = 'tabs';
  static defaults = {
    value: null,
    orientation: null,
    activationMode: AUTO,
  };

  constructor(el, opts) {
    super(el, opts);

    this._list = el.querySelector(':scope > .tabs__list');
    if (!this._list) return;

    this.opts.orientation = this._resolveOrientation(this.opts.orientation);

    this._id = ++counter;
    this._activeValue = null;

    this._wireA11y();

    const initial =
      this._resolveValue(this.opts.value) ??
      this._existingActiveValue() ??
      this._firstEnabledValue();
    if (initial != null) this._activate(initial, true);

    this._onClick = this._onClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this.on(this._list, 'click', this._onClick);
    this.on(this._list, 'keydown', this._onKeydown);
  }

  // === Public API ========================================================

  get value() {
    return this._activeValue;
  }

  setValue(value) {
    const target = this._resolveValue(value);
    if (target == null || target === this._activeValue) return;
    if (this._isDisabled(this._triggerFor(target))) return;
    this._activate(target, false);
  }

  getTriggers() {
    return this._triggers();
  }

  getPanels() {
    return this._panels();
  }

  // === Internals =========================================================

  _resolveOrientation(value) {
    if (value === HORIZONTAL || value === VERTICAL) return value;
    return this.el.classList.contains('tabs--vertical')
      ? VERTICAL
      : HORIZONTAL;
  }

  _triggers() {
    return Array.from(this._list.querySelectorAll(':scope > .tabs__trigger'));
  }

  _panels() {
    return Array.from(this.el.querySelectorAll(':scope > .tabs__panel'));
  }

  _triggerFor(value) {
    return this._triggers().find((t) => t.dataset.value === value) ?? null;
  }

  _panelFor(value) {
    return this._panels().find((p) => p.dataset.value === value) ?? null;
  }

  _isDisabled(trigger) {
    if (!trigger) return true;
    return (
      trigger.disabled === true ||
      trigger.hasAttribute('data-disabled') ||
      trigger.getAttribute('aria-disabled') === 'true'
    );
  }

  _resolveValue(value) {
    if (value == null) return null;
    return this._triggerFor(String(value)) ? String(value) : null;
  }

  _existingActiveValue() {
    const t = this._triggers().find(
      (t) => t.getAttribute('data-state') === 'active',
    );
    return t?.dataset.value ?? null;
  }

  _firstEnabledValue() {
    const t = this._triggers().find((t) => !this._isDisabled(t));
    return t?.dataset.value ?? null;
  }

  _wireA11y() {
    const baseId = this.el.id || `stisla-tabs-${this._id}`;
    const orient = this.opts.orientation;

    this.el.setAttribute('data-orientation', orient);
    this._list.setAttribute('role', 'tablist');
    this._list.setAttribute('aria-orientation', orient);
    this._list.setAttribute('data-orientation', orient);

    this._triggers().forEach((trigger, i) => {
      const value = trigger.dataset.value || String(i);
      trigger.dataset.value = value;
      if (!trigger.id) trigger.id = `${baseId}-trigger-${value}`;
      if (!trigger.hasAttribute('type')) trigger.setAttribute('type', 'button');
      trigger.setAttribute('role', 'tab');
      trigger.setAttribute('data-orientation', orient);
      if (this._isDisabled(trigger)) {
        trigger.setAttribute('aria-disabled', 'true');
      }

      const panel = this._panelFor(value);
      if (panel) {
        if (!panel.id) panel.id = `${baseId}-panel-${value}`;
        trigger.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', trigger.id);
        panel.setAttribute('data-orientation', orient);
        if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '0');
      }
    });
  }

  _activate(value, silent) {
    const previousValue = this._activeValue;
    if (value === previousValue) return;

    if (!silent) {
      const ok = this.emit('changing', { value, previousValue });
      if (!ok) return;
    }

    this._triggers().forEach((t) => {
      const isActive = t.dataset.value === value;
      t.setAttribute('data-state', isActive ? 'active' : 'inactive');
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    this._panels().forEach((p) => {
      const isActive = p.dataset.value === value;
      p.setAttribute('data-state', isActive ? 'active' : 'inactive');
    });

    this._activeValue = value;

    if (!silent) {
      this.emit(
        'changed',
        { value, previousValue },
        { cancelable: false },
      );
    }
  }

  // === Listeners =========================================================

  _onClick(e) {
    const trigger = e.target.closest('.tabs__trigger');
    if (!trigger || !this._list.contains(trigger)) return;
    if (this._isDisabled(trigger)) {
      e.preventDefault();
      return;
    }
    this.setValue(trigger.dataset.value);
  }

  _onKeydown(e) {
    const trigger = e.target.closest('.tabs__trigger');
    if (!trigger || !this._list.contains(trigger)) return;

    const horiz = this.opts.orientation === HORIZONTAL;
    const next = horiz ? 'ArrowRight' : 'ArrowDown';
    const prev = horiz ? 'ArrowLeft' : 'ArrowUp';

    let target = null;
    if (e.key === next) target = this._sibling(trigger, +1);
    else if (e.key === prev) target = this._sibling(trigger, -1);
    else if (e.key === 'Home') target = this._edge('first');
    else if (e.key === 'End') target = this._edge('last');
    else return;

    if (!target) return;
    e.preventDefault();
    target.focus();
    if (this.opts.activationMode === AUTO) {
      this.setValue(target.dataset.value);
    }
  }

  _sibling(from, delta) {
    const enabled = this._triggers().filter((t) => !this._isDisabled(t));
    const i = enabled.indexOf(from);
    if (i === -1 || enabled.length === 0) return null;
    const len = enabled.length;
    return enabled[(i + delta + len) % len];
  }

  _edge(which) {
    const enabled = this._triggers().filter((t) => !this._isDisabled(t));
    if (enabled.length === 0) return null;
    return which === 'first' ? enabled[0] : enabled[enabled.length - 1];
  }
}

// === Module-level external trigger handler ==============================
// Lets ANY element on the page drive a Stisla.Tabs instance via
//   aria-controls="<tabsRootId>" + data-stisla-tabs-value="<value>"
// Useful for sidebar items, toolbar buttons, command-palette entries —
// anything that should jump to a tab without imperative JS.
//
// The .tabs root needs an explicit `id` so the consumer can reference it
// via aria-controls. Internal .tabs__trigger elements keep their own
// click path (inside `_onClick`) — this delegate handles externals only.
//
// Sentinel-guards the listener so Vite HMR doesn't double-bind. Gate-
// guards on `data-stisla-tabs` on the resolved target so unrelated
// aria-controls-bearing triggers (Dialog backdrop, Dropdown menu,
// AppShell sidebar toggle, etc.) don't false-positive.
if (typeof document !== 'undefined' && !window.__stislaTabsBound) {
  window.__stislaTabsBound = true;
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-stisla-tabs-value][aria-controls]');
    if (!trigger) return;
    const rootEl = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!rootEl || !rootEl.hasAttribute('data-stisla-tabs')) return;
    Tabs.getOrCreate(rootEl).setValue(trigger.getAttribute('data-stisla-tabs-value'));
  });
}
