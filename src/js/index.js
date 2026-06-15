// Stisla public JS entry (vanilla core bundle).
//
// Ships every Phase 2 JS-coordinated component except carousel — carousel
// is vanilla-optional (SPEC.md §10 / V3.md §3.12) and lives in
// `index-full.js` or the à-la-carte `components/carousel.js` path.

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
import { Tabs } from './components/tabs.js';
import { Collapsible } from './components/collapsible.js';
import { Accordion } from './components/accordion.js';
import { Sidebar } from './components/sidebar.js';
import { Navbar } from './components/navbar.js';
import { AppShell } from './components/app-shell.js';

register('dialog', Dialog);
register('drawer', Drawer);
register('dropdown', Dropdown);
register('tooltip', Tooltip);
register('popover', Popover);
register('toast', Toast);
register('toggle', Toggle);
register('toggle-group', ToggleGroup);
register('tabs', Tabs);
register('collapsible', Collapsible);
register('accordion', Accordion);
register('sidebar', Sidebar);
register('navbar', Navbar);
register('app-shell', AppShell);

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
  version: '3.0.0-beta.1',
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
  Tabs,
  Collapsible,
  Accordion,
  Sidebar,
  Navbar,
  AppShell,
  register,
  init,
  get: getInstance,
};

if (typeof window !== 'undefined') {
  window.Stisla = Stisla;
}

if (import.meta.hot) import.meta.hot.accept();

export default Stisla;
