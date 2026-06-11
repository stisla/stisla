// Stisla public JS entry (core bundle).
//
// Ships every Phase 2 JS-coordinated component except carousel — that's an
// integration component (V3.md §3.12) and lives in `index-full.js` or the
// à-la-carte `integrations/carousel.js` path. The interim delegated
// handler at the bottom stays until app-shell is promoted to its own
// Stisla.AppShell class.

import { Component, getInstance } from './core/component.js';
import { register, init } from './core/init.js';
import { Dialog } from './components/dialog.js';
import { Drawer } from './components/drawer.js';
import { Dropdown } from './components/dropdown.js';
import { Tooltip } from './components/tooltip.js';
import { Popover } from './components/popover.js';
import { Toast, toast } from './components/toast.js';
import { Toggle } from './components/toggle.js';
import { ToggleGroup } from './components/toggle-group.js';
import { Collapsible } from './components/collapsible.js';
import { Accordion } from './components/accordion.js';
import { Sidebar } from './components/sidebar.js';
import { Navbar } from './components/navbar.js';

register('dialog', Dialog);
register('drawer', Drawer);
register('dropdown', Dropdown);
register('tooltip', Tooltip);
register('popover', Popover);
register('toast', Toast);
register('toggle', Toggle);
register('toggle-group', ToggleGroup);
register('collapsible', Collapsible);
register('accordion', Accordion);
register('sidebar', Sidebar);
register('navbar', Navbar);

// Auto-init runs in a microtask so that an importer (e.g. index-full.js)
// can register additional components synchronously after this module
// finishes evaluating but before the scanner walks the DOM. In the
// readyState !== 'loading' branch we'd otherwise call init() immediately
// at module load and miss anything registered later in the same tick.
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    queueMicrotask(() => init());
  }
}

export const Stisla = {
  version: '3.0.0-alpha.0',
  Component,
  Dialog,
  Drawer,
  Dropdown,
  Tooltip,
  Popover,
  Toast,
  toast,
  Toggle,
  ToggleGroup,
  Collapsible,
  Accordion,
  Sidebar,
  Navbar,
  register,
  init,
  get: getInstance,
};

if (typeof window !== 'undefined') {
  window.Stisla = Stisla;
}

// === Interim delegated handler ===========================================
// App-shell is the last interim handler — promotion to Stisla.AppShell
// lands in its own session. The window sentinel prevents Vite HMR from
// double-binding when the module re-executes after a hot reload.

if (typeof document !== 'undefined' && !window.__stislaAppShellBound) {
  window.__stislaAppShellBound = true;

  // App shell — data-app-shell-toggle="collapse|visibility" flips the
  // matching state class on the closest .app-shell. "collapse" also
  // flips .is-collapsed on the descendant .sidebar so its internal
  // rail visuals follow.
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-app-shell-toggle]');
    if (!target) return;
    const shell = target.closest('.app-shell');
    if (!shell) return;
    const mode = target.dataset.appShellToggle;
    if (mode === 'collapse') {
      shell.classList.toggle('is-sidebar-collapsed');
      shell.querySelector('.sidebar')?.classList.toggle('is-collapsed');
    } else if (mode === 'visibility') {
      shell.classList.toggle('is-sidebar-visible');
    }
  });

  // App shell — backdrop dismiss. The mobile drawer's backdrop is a
  // ::before on .app-shell, so clicks on it bubble up with the shell
  // as the event target. Close on any click outside the sidebar; skip
  // toggle buttons so the open-click doesn't double-fire into a close
  // on the same event.
  document.addEventListener('click', (e) => {
    const shell = e.target.closest('.app-shell.is-sidebar-visible');
    if (!shell) return;
    if (e.target.closest('.sidebar')) return;
    if (e.target.closest('[data-app-shell-toggle]')) return;
    shell.classList.remove('is-sidebar-visible');
  });
}

if (import.meta.hot) import.meta.hot.accept();

export default Stisla;
