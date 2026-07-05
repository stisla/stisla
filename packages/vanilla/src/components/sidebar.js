// Stisla.Sidebar — submenu + rail-collapse coordinator.
//
// Composes one Stisla.Collapsible per [data-stisla-sidebar-submenu-toggle] trigger found inside the
// sidebar. The state hook lives on the .sidebar__item (where the chevron rotation and active-route
// paint read it); the height transition runs on the .sidebar__submenu nested inside.
//
// Also owns standalone rail collapse — flipping [data-collapsed] on the panel in response to
// [data-stisla-sidebar-toggle="collapse"] triggers (delegated, document-level). For sidebars inside
// an .app-shell consumers wire their own toggle; the sidebar-level handler covers the standalone case
// and exposes a programmatic collapse()/expand()/toggleCollapsed() API.
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
//     …
//     <button data-stisla-sidebar-toggle="collapse" aria-expanded="true">Collapse</button>
//   </aside>
//
// Options:
//   duration — transition duration override, propagated to each submenu's Collapsible.
//
// Events (bubbling):
//   stisla:sidebar:submenu-change   — detail: { sidebar, item, open } after a submenu settles
//   stisla:sidebar:collapse-change  — detail: { sidebar, collapsed } after [data-collapsed] flips
//
// Submenu events source from bubbling stisla:collapsible:opened/closed so user-clicks and
// programmatic calls funnel through the same point — same shape as Accordion.

import { Component, getInstance } from '../core/component.js';
import { readOpts } from '../core/init.js';
import { Collapsible } from './collapsible.js';

const COLLAPSE_TOGGLE_SELECTOR = '[data-stisla-sidebar-toggle="collapse"]';
// Rail-collapse hook — CSS reads .sidebar[data-collapsed]; recast from the legacy is-* class per the
// no-is-* convention.
const COLLAPSED_ATTR = 'data-collapsed';

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

    // Seed any pre-existing collapse triggers' aria-expanded so they match the panel's initial
    // [data-collapsed] state.
    this._syncCollapseTriggers();
  }

  // === public API ========================================================

  getSubmenus() {
    return this._submenus.map(({ item }) => item);
  }

  isCollapsed() {
    return this.el.hasAttribute(COLLAPSED_ATTR);
  }

  collapse() {
    return this._setCollapsed(true);
  }

  expand() {
    return this._setCollapsed(false);
  }

  toggleCollapsed() {
    return this._setCollapsed(!this.isCollapsed());
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

  _setCollapsed(next) {
    if (next === this.isCollapsed()) return this;
    // Close any open submenus before flipping [data-collapsed] so each Collapsible's height
    // transition runs alongside the panel's width transition (instead of snapping shut on the
    // rail-mode display: none). The CSS carve-out for [data-collapsing] keeps the submenu rendered
    // through its close animation; the existing [data-state="closed"] rule takes over once it settles.
    // Expand intentionally does NOT re-open previously-open submenus.
    if (next) this.closeAllSubmenus();
    this.el.toggleAttribute(COLLAPSED_ATTR, next);
    this._syncCollapseTriggers();
    this.emit('collapse-change', { collapsed: next }, { cancelable: false });
    return this;
  }

  // Walks for matching collapse triggers — inside the sidebar plus any external buttons that target
  // it via aria-controls — and updates aria-expanded so triggers stay coherent regardless of which
  // one fired the state change.
  _syncCollapseTriggers() {
    const expanded = this.isCollapsed() ? 'false' : 'true';
    const internal = this.el.querySelectorAll(COLLAPSE_TOGGLE_SELECTOR);
    for (const trigger of internal) trigger.setAttribute('aria-expanded', expanded);
    if (this.el.id) {
      const external = document.querySelectorAll(
        `${COLLAPSE_TOGGLE_SELECTOR}[aria-controls="${CSS.escape(this.el.id)}"]`,
      );
      for (const trigger of external) trigger.setAttribute('aria-expanded', expanded);
    }
  }
}

// Global delegated click handler — bound once per page load. Sentinel mirrors the dialog pattern.
if (typeof document !== 'undefined' && typeof window !== 'undefined' && !window.__stislaSidebarBound) {
  window.__stislaSidebarBound = true;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(COLLAPSE_TOGGLE_SELECTOR);
    if (!trigger) return;

    // Resolution: aria-controls wins if present (lets the trigger live anywhere); otherwise climb to
    // the nearest sidebar ancestor. Skips silently when neither resolves.
    const controlsId = trigger.getAttribute('aria-controls');
    const sidebarEl =
      (controlsId && document.getElementById(controlsId)) ||
      trigger.closest('[data-stisla-sidebar]');
    if (!sidebarEl || !sidebarEl.matches('[data-stisla-sidebar]')) return;

    // Belt-and-braces: if Stisla.init() hasn't reached this panel yet, build the instance now.
    const inst = getInstance(sidebarEl) ?? new Sidebar(sidebarEl, readOpts(sidebarEl, 'sidebar', Sidebar));
    inst.toggleCollapsed();
  });
}
