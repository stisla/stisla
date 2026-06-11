// Stisla.Sidebar — submenu open/close coordinator (V3.md §3.7).
//
// Composes one Stisla.Collapsible per [data-stisla-sidebar-submenu-toggle]
// trigger found inside the sidebar. The state hook lives on the
// .sidebar__item (where the chevron rotation and active-route paint read
// it); the height transition runs on the .sidebar__submenu nested inside.
//
// What this class doesn't own:
//   - .sidebar.is-collapsed rail mode. That's an app-shell concern (the
//     shell's collapse toggle flips classes on both the shell and the
//     sidebar). Sidebar is purely about nested submenu open/close.
//
// Anatomy:
//   <aside class="sidebar" data-stisla-sidebar>
//     …
//     <li class="sidebar__item" data-state="closed">
//       <button class="sidebar__button"
//               data-stisla-sidebar-submenu-toggle
//               aria-expanded="false" aria-controls="submenu-1">…</button>
//       <div id="submenu-1" class="sidebar__submenu">…</div>
//     </li>
//   </aside>
//
// Options:
//   duration — transition duration override, propagated to each submenu's
//              Collapsible.
//
// Events (bubbling, detail: { sidebar: this, item, open }):
//   stisla:sidebar:submenu-change — after a submenu's transition settles
//
// Sourced from bubbling stisla:collapsible:opened/closed so user-clicks
// and programmatic calls funnel through the same point — same shape as
// Accordion. Each submenu's Collapsible still emits stisla:collapsible:*.

import { Component } from '../core/component.js';
import { Collapsible } from './collapsible.js';

export class Sidebar extends Component {
  static eventNamespace = 'sidebar';
  static defaults = {
    duration: null,
  };

  constructor(el, opts) {
    super(el, opts);
    this._submenus = [];
    this._buildSubmenus();

    this._onOpened = this._onOpened.bind(this);
    this._onClosed = this._onClosed.bind(this);
    this.on(el, 'stisla:collapsible:opened', this._onOpened);
    this.on(el, 'stisla:collapsible:closed', this._onClosed);
  }

  // === public API ========================================================

  getSubmenus() {
    return this._submenus.map(({ item }) => item);
  }

  openSubmenu(target) {
    const entry = this._resolve(target);
    if (!entry || entry.collapsible.isOpen()) return this;
    entry.collapsible.open();
    return this;
  }

  closeSubmenu(target) {
    const entry = this._resolve(target);
    if (!entry || !entry.collapsible.isOpen()) return this;
    entry.collapsible.close();
    return this;
  }

  toggleSubmenu(target) {
    const entry = this._resolve(target);
    if (!entry) return this;
    return entry.collapsible.isOpen()
      ? this.closeSubmenu(target)
      : this.openSubmenu(target);
  }

  closeAllSubmenus() {
    for (const entry of this._submenus) {
      if (entry.collapsible.isOpen()) entry.collapsible.close();
    }
    return this;
  }

  destroy() {
    for (const entry of this._submenus) entry.collapsible.destroy();
    this._submenus = [];
    super.destroy();
  }

  // === internals =========================================================

  _onOpened(e) {
    const entry = this._submenus.find(({ submenu }) => submenu === e.target);
    if (entry) this._emitChange(entry, true);
  }

  _onClosed(e) {
    const entry = this._submenus.find(({ submenu }) => submenu === e.target);
    if (entry) this._emitChange(entry, false);
  }

  _buildSubmenus() {
    const triggers = this.el.querySelectorAll(
      '[data-stisla-sidebar-submenu-toggle]',
    );
    for (const trigger of triggers) {
      const item = trigger.closest('.sidebar__item');
      const submenu = item?.querySelector(':scope > .sidebar__submenu');
      if (!item || !submenu) continue;
      const collapsible = new Collapsible(submenu, {
        stateEl: item,
        triggers: [trigger],
        open: item.dataset.state === 'open',
        duration: this.opts.duration,
      });
      this._submenus.push({ item, trigger, submenu, collapsible });
    }
  }

  _resolve(target) {
    if (target == null) return null;
    if (typeof target === 'number') return this._submenus[target] ?? null;
    if (typeof target === 'string') {
      return (
        this._submenus.find(
          ({ submenu, item }) => submenu.id === target || item.dataset.value === target,
        ) ?? null
      );
    }
    return (
      this._submenus.find(
        ({ item }) => item === target || item.contains(target),
      ) ?? null
    );
  }

  _emitChange(entry, open) {
    this.emit(
      'submenu-change',
      { item: entry.item, open },
      { cancelable: false },
    );
  }
}
