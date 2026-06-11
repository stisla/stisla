// Stisla public JS entry (core bundle).
//
// Ships every Phase 2 JS-coordinated component except carousel — that's an
// integration component (V3.md §3.12) and lives in `index-full.js` or the
// à-la-carte `integrations/carousel.js` path. The interim delegated
// handlers at the bottom stay until each component (app-shell, navbar,
// sidebar, accordion) is promoted to its own Stisla.<Component> class.

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

register('dialog', Dialog);
register('drawer', Drawer);
register('dropdown', Dropdown);
register('tooltip', Tooltip);
register('popover', Popover);
register('toast', Toast);
register('toggle', Toggle);
register('toggle-group', ToggleGroup);

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
  register,
  init,
  get: getInstance,
};

if (typeof window !== 'undefined') {
  window.Stisla = Stisla;
}

// === Interim delegated handlers ==========================================
// Promoted into proper Stisla.<Component> classes in later sessions:
//   - app-shell  → Stisla.AppShell
//   - navbar     → Stisla.Navbar
//   - sidebar    → Stisla.Sidebar (submenu open/close)
//   - accordion  → Stisla.Accordion
//
// The window sentinel prevents Vite HMR from double-binding when the
// module re-executes after a hot reload.

if (typeof document !== 'undefined' && !window.__stislaInterimBound) {
  window.__stislaInterimBound = true;

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

  // Navbar — [data-navbar-toggle] flips data-state on the closest
  // .navbar__menu between "open" and "closed". The CSS keys off
  // data-state to show/hide the folded menu below the collapse
  // breakpoint. Step 4 promotes this into Stisla.Navbar with the full
  // class + destroy + custom-events contract (V3.md §3.7).
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-navbar-toggle]');
    if (!target) return;
    const navbar = target.closest('.navbar');
    if (!navbar) return;
    const menu = navbar.querySelector('.navbar__menu');
    if (!menu) return;
    const open = menu.dataset.state === 'open';
    menu.dataset.state = open ? 'closed' : 'open';
    target.setAttribute('aria-expanded', String(!open));
  });

  // Sidebar submenu — [data-sidebar-submenu-toggle] flips data-state on
  // the closest .sidebar__item between "open" and "closed" + aria-expanded
  // on the trigger. The CSS hides closed submenus via display: none; an
  // animated height transition lands in Step 4 (Stisla.Sidebar).
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-sidebar-submenu-toggle]');
    if (!target) return;
    const item = target.closest('.sidebar__item');
    if (!item) return;
    const open = item.dataset.state === 'open';
    item.dataset.state = open ? 'closed' : 'open';
    target.setAttribute('aria-expanded', String(!open));
  });

  // Accordion — [data-stisla-accordion-trigger] flips data-state on the
  // closest .accordion__item between "open" and "closed" + aria-expanded
  // on the trigger. Add data-stisla-accordion-single on the .accordion
  // root to enforce one-open-at-a-time mode. Step 4 promotes this into
  // Stisla.Accordion with the full class + destroy + custom-events
  // contract (V3.md §3.7) plus a measured-height transition.
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-stisla-accordion-trigger]');
    if (!trigger || trigger.disabled) return;
    const item = trigger.closest('.accordion__item');
    const accordion = trigger.closest('.accordion');
    if (!item || !accordion) return;
    const open = item.dataset.state === 'open';
    if (!open && accordion.hasAttribute('data-stisla-accordion-single')) {
      accordion
        .querySelectorAll('.accordion__item[data-state="open"]')
        .forEach((sibling) => {
          sibling.dataset.state = 'closed';
          sibling
            .querySelector('[data-stisla-accordion-trigger]')
            ?.setAttribute('aria-expanded', 'false');
        });
    }
    item.dataset.state = open ? 'closed' : 'open';
    trigger.setAttribute('aria-expanded', String(!open));
  });
}

if (import.meta.hot) import.meta.hot.accept();

export default Stisla;
