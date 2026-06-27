// Stisla.AppShell — page-level layout coordinator (V3.md §3.7).
//
// Owns the .app-shell root and coordinates two state hooks defined in
// _app-shell.scss: .is-sidebar-collapsed (desktop rail) and
// .is-sidebar-visible (mobile drawer). For the rail flip, AppShell
// delegates to the descendant .sidebar's Stisla.Sidebar instance —
// that class already owns the rail visuals, ARIA sync, and submenu
// close-on-collapse. AppShell only owns the .app-shell paint class
// itself. When the panel isn't a Stisla.Sidebar (no data-stisla-sidebar
// attr), AppShell falls back to flipping .is-collapsed directly.
//
// Anatomy:
//   <div class="app-shell" data-stisla-app-shell>
//     <aside class="sidebar" data-stisla-sidebar>…</aside>
//     <main class="app-shell__main">
//       <nav>
//         <button data-stisla-app-shell-toggle="collapse"
//                 aria-expanded="true">Collapse</button>
//         <button data-stisla-app-shell-toggle="visibility"
//                 aria-expanded="false">Open menu</button>
//         <button data-stisla-app-shell-toggle="auto"
//                 aria-expanded="…">Menu</button>
//       </nav>
//       …
//     </main>
//   </div>
//
// Toggle modes:
//   collapse   — desktop rail / full-width (.is-sidebar-collapsed)
//   visibility — mobile drawer open / closed (.is-sidebar-visible)
//   auto       — picks per viewport: visibility below `lg`, collapse above.
//                The single-button pattern most dashboards want.
//
// Options:
//   dismissOnBackdrop — close the mobile drawer when the backdrop is
//                       clicked (default true). Backdrop is the
//                       .app-shell::before pseudo, so backdrop clicks
//                       arrive on this.el with .sidebar / toggle
//                       descendants excluded.
//   dismissOnEscape   — close the mobile drawer on Escape (default true).
//   autoCollapse      — drive the rail from the viewport (default false):
//                       collapsed across the `lg` band (1024–1279px),
//                       expanded at `xl`+, full panel inside the drawer
//                       below `lg`. A manual collapse toggle still works
//                       within a band; the next breakpoint crossing
//                       re-asserts the responsive default.
//
// Events (bubbling):
//   stisla:app-shell:sidebar-collapse-changing    cancelable  detail: { collapsed }
//   stisla:app-shell:sidebar-collapse-changed                 detail: { collapsed }
//   stisla:app-shell:sidebar-visibility-changing  cancelable  detail: { visible }
//   stisla:app-shell:sidebar-visibility-changed               detail: { visible }

import { Component, getInstance } from '../core/component.js';
import { readOpts } from '../core/init.js';

const TOGGLE_SELECTOR = '[data-stisla-app-shell-toggle]';
// Both layout structures from _app-shell.scss: direct-child .sidebar
// (no top navbar), or .sidebar wrapped under .app-shell__body
// (with top navbar — :has() flips the shell to flex-column).
const SIDEBAR_SELECTOR = ':scope > .sidebar, :scope > .app-shell__body > .sidebar';
// Mirrors @include media-down(lg) in _app-shell.scss — 1024px breakpoint
// minus 0.02px (forked BS5 grid convention; see
// foundation/_breakpoints.scss). Auto-mode triggers and ARIA sync read
// this to decide which sidebar state they bind to.
const MOBILE_QUERY = '(max-width: 1023.98px)';
// Mirrors @include media-only(lg) — the `lg` band from the drawer
// breakpoint (1024px) up to just below `xl` (1280px). Opt-in autoCollapse
// drives the rail off this: collapsed inside the band, expanded at `xl`+.
// Keep in sync with the Sass breakpoints alongside MOBILE_QUERY above.
const RAIL_QUERY = '(min-width: 1024px) and (max-width: 1279.98px)';

export class AppShell extends Component {
  static eventNamespace = 'app-shell';
  static defaults = {
    dismissOnBackdrop: true,
    dismissOnEscape: true,
    autoCollapse: false,
  };

  constructor(el, opts) {
    super(el, opts);

    this._onBackdropClick = this._onBackdropClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onViewportChange = this._syncAutoTriggers.bind(this);
    this._escapeBound = false;

    this.on(this.el, 'click', this._onBackdropClick);
    if (this.isSidebarVisible()) this._bindEscape();

    // Re-sync auto triggers when the user resizes across the mobile
    // breakpoint so aria-expanded reflects whichever state the trigger
    // now binds to. Cheap (one MQL per shell, GC'd in destroy()).
    this._mql =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia(MOBILE_QUERY)
        : null;
    this._mql?.addEventListener('change', this._onViewportChange);

    // Opt-in responsive rail. A second MQL tracks the `lg` band; each
    // crossing re-collapses / re-expands the panel. Only wired when
    // autoCollapse is on, so default shells pay nothing.
    this._onRailChange = this._applyAutoCollapse.bind(this);
    this._railMql =
      this.opts.autoCollapse && typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia(RAIL_QUERY)
        : null;
    this._railMql?.addEventListener('change', this._onRailChange);

    this._syncCollapseTriggers();
    this._syncVisibilityTriggers();
    this._syncAutoTriggers();

    // Apply the viewport-driven rail state once on mount.
    this._applyAutoCollapse();
  }

  // === public API ========================================================

  isSidebarCollapsed() {
    return this.el.classList.contains('is-sidebar-collapsed');
  }

  collapseSidebar() {
    return this._setCollapsed(true);
  }

  expandSidebar() {
    return this._setCollapsed(false);
  }

  toggleSidebarCollapse() {
    return this._setCollapsed(!this.isSidebarCollapsed());
  }

  isSidebarVisible() {
    return this.el.classList.contains('is-sidebar-visible');
  }

  showSidebar() {
    return this._setVisible(true);
  }

  hideSidebar() {
    return this._setVisible(false);
  }

  toggleSidebarVisibility() {
    return this._setVisible(!this.isSidebarVisible());
  }

  // Picks the right action per viewport — drawer visibility below `lg`,
  // rail collapse above. The single-button pattern most dashboards want.
  toggleSidebarAuto() {
    return this._isMobile()
      ? this.toggleSidebarVisibility()
      : this.toggleSidebarCollapse();
  }

  // Returns the Stisla.Sidebar instance hosted in this shell, or null.
  getSidebar() {
    const sidebarEl = this.el.querySelector(SIDEBAR_SELECTOR);
    return sidebarEl ? getInstance(sidebarEl) ?? null : null;
  }

  destroy() {
    this._unbindEscape();
    this._mql?.removeEventListener('change', this._onViewportChange);
    this._railMql?.removeEventListener('change', this._onRailChange);
    super.destroy();
  }

  // === internals =========================================================

  _setCollapsed(next) {
    if (next === this.isSidebarCollapsed()) return this;
    if (!this.emit('sidebar-collapse-changing', { collapsed: next })) return this;

    this.el.classList.toggle('is-sidebar-collapsed', next);

    // Delegate the panel's rail flip + submenu close + ARIA sync to its
    // own Sidebar instance. Fallback to direct classList for unmanaged
    // panels (no data-stisla-sidebar) — preserves the interim handler's
    // no-JS-on-sidebar behavior for static demos.
    const sidebar = this.getSidebar();
    if (sidebar) {
      if (next) sidebar.collapse();
      else sidebar.expand();
    } else {
      const sidebarEl = this.el.querySelector(SIDEBAR_SELECTOR);
      sidebarEl?.classList.toggle('is-collapsed', next);
    }

    this._syncCollapseTriggers();
    this._syncAutoTriggers();
    this.emit('sidebar-collapse-changed', { collapsed: next }, { cancelable: false });
    return this;
  }

  _setVisible(next) {
    if (next === this.isSidebarVisible()) return this;
    if (!this.emit('sidebar-visibility-changing', { visible: next })) return this;

    this.el.classList.toggle('is-sidebar-visible', next);

    // Escape listener attaches only while visible so a closed shell isn't
    // paying for a document keydown listener for the rest of the page.
    if (next) this._bindEscape();
    else this._unbindEscape();

    this._syncVisibilityTriggers();
    this._syncAutoTriggers();
    this.emit('sidebar-visibility-changed', { visible: next }, { cancelable: false });
    return this;
  }

  // Backdrop is .app-shell::before (inset: 0, z-index just below the
  // sidebar's fixed layer). Clicks on the backdrop arrive with
  // e.target === this.el; clicks inside the sidebar or on a toggle
  // bubble through and are excluded explicitly.
  _onBackdropClick(e) {
    if (!this.opts.dismissOnBackdrop) return;
    if (!this.isSidebarVisible()) return;
    if (e.target.closest('.sidebar')) return;
    if (e.target.closest(TOGGLE_SELECTOR)) return;
    this.hideSidebar();
  }

  _onKeydown(e) {
    if (e.key !== 'Escape') return;
    if (!this.opts.dismissOnEscape) return;
    if (!this.isSidebarVisible()) return;
    this.hideSidebar();
  }

  _bindEscape() {
    if (this._escapeBound) return;
    document.addEventListener('keydown', this._onKeydown);
    this._escapeBound = true;
  }

  _unbindEscape() {
    if (!this._escapeBound) return;
    document.removeEventListener('keydown', this._onKeydown);
    this._escapeBound = false;
  }

  // Sync aria-expanded on every collapse/visibility trigger so the two
  // states stay coherent whether the change came from a click,
  // programmatic API, or external aria-controls trigger. "Expanded"
  // reads as the natural UX state (sidebar at full width / drawer open).
  _syncCollapseTriggers() {
    const expanded = this.isSidebarCollapsed() ? 'false' : 'true';
    for (const t of this._findTriggers('collapse')) {
      t.setAttribute('aria-expanded', expanded);
    }
  }

  _syncVisibilityTriggers() {
    const expanded = this.isSidebarVisible() ? 'true' : 'false';
    for (const t of this._findTriggers('visibility')) {
      t.setAttribute('aria-expanded', expanded);
    }
  }

  // Auto triggers bind to whichever state matches the current viewport:
  // visibility (drawer open) below `lg`, collapse (rail/full) above.
  // Re-runs on every state change AND on viewport crossings (matchMedia
  // change listener in the constructor) so aria-expanded never lies
  // about the active mode.
  _syncAutoTriggers() {
    const expanded = this._isMobile()
      ? this.isSidebarVisible() ? 'true' : 'false'
      : this.isSidebarCollapsed() ? 'false' : 'true';
    for (const t of this._findTriggers('auto')) {
      t.setAttribute('aria-expanded', expanded);
    }
  }

  _isMobile() {
    return this._mql ? this._mql.matches : false;
  }

  // Drive the rail from the viewport when autoCollapse is on: collapsed
  // while the `lg` band matches, expanded otherwise. _setCollapsed
  // no-ops when the state already matches, so this is safe to call on
  // mount and on every band crossing.
  _applyAutoCollapse() {
    if (!this._railMql) return;
    this._setCollapsed(this._railMql.matches);
  }

  // Internal triggers (inside the shell) plus any external triggers
  // that target it via aria-controls. Mirrors Sidebar's resolution
  // pattern so toggles can live anywhere on the page.
  _findTriggers(mode) {
    const selector = `[data-stisla-app-shell-toggle="${mode}"]`;
    const triggers = Array.from(this.el.querySelectorAll(selector));
    if (this.el.id) {
      const external = document.querySelectorAll(
        `${selector}[aria-controls="${CSS.escape(this.el.id)}"]`,
      );
      for (const t of external) {
        if (!triggers.includes(t)) triggers.push(t);
      }
    }
    return triggers;
  }
}

// Global delegated click handler — bound once per page load.
// Sentinel mirrors the HMR-safe pattern from sidebar.js + dialog.js.
if (typeof document !== 'undefined' && typeof window !== 'undefined' && !window.__stislaAppShellBound) {
  window.__stislaAppShellBound = true;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(TOGGLE_SELECTOR);
    if (!trigger) return;

    // Resolution: aria-controls wins if present (lets the trigger live
    // outside the shell — e.g., a top-level navbar's hamburger);
    // otherwise climb to the nearest .app-shell ancestor. Skips
    // silently when neither resolves.
    const controlsId = trigger.getAttribute('aria-controls');
    const shellEl =
      (controlsId && document.getElementById(controlsId)) ||
      trigger.closest('.app-shell');
    if (!shellEl || !shellEl.matches('[data-stisla-app-shell]')) return;

    // Belt-and-braces: if Stisla.init() hasn't reached this shell yet
    // (e.g., trigger fires during the same tick the DOM was inserted),
    // build the instance now using the same opts pipeline.
    const inst = getInstance(shellEl) ?? new AppShell(shellEl, readOpts(shellEl, 'app-shell', AppShell));
    const mode = trigger.dataset.stislaAppShellToggle;
    if (mode === 'collapse') inst.toggleSidebarCollapse();
    else if (mode === 'visibility') inst.toggleSidebarVisibility();
    else if (mode === 'auto') inst.toggleSidebarAuto();
  });
}
