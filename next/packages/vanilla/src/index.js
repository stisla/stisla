// @stisla/vanilla — core entry (ESM). The no-build behavior layer that pairs with @stisla/css.
//
// This entry registers every CORE component. The three optional components (carousel, combobox,
// scroll-area) carry a third-party dependency and ship separately: import each as an add-on from
// "@stisla/vanilla/<name>", or use "@stisla/vanilla/full" for all three at once.
//
// Two consumption modes:
//   - ESM:        import { Stisla } from "@stisla/vanilla"
//   - Script tag: <script src=".../stisla.js"> → window.Stisla + auto-init on load
//
// Components register with a kebab-case name; init() walks [data-stisla-<name>] to instantiate.
// Auto-init runs in a microtask so an importer (an add-on, or index-full.js) can register more
// components synchronously after this module evaluates but before the scanner walks the DOM.

import { Component, getInstance } from './core/component.js';
import { register, init } from './core/init.js';
import { Collapsible } from './components/collapsible.js';
import { Accordion } from './components/accordion.js';
import { Dialog } from './components/dialog.js';
import { Drawer } from './components/drawer.js';
import { Tooltip } from './components/tooltip.js';
import { Popover } from './components/popover.js';
import { Menu } from './components/menu.js';
import { Toast, toast } from './components/toast.js';
import { Tabs } from './components/tabs.js';
import { Toggle } from './components/toggle.js';
import { ToggleGroup } from './components/toggle-group.js';
import { Navbar } from './components/navbar.js';
import { Sidebar } from './components/sidebar.js';
import { Autocomplete } from './components/autocomplete.js';
import { Avatar } from './components/avatar.js';
import { Slider } from './components/slider.js';
import { Select } from './components/select.js';

register('collapsible', Collapsible);
register('accordion', Accordion);
register('dialog', Dialog);
register('drawer', Drawer);
register('tooltip', Tooltip);
register('popover', Popover);
register('menu', Menu);
register('toast', Toast);
register('tabs', Tabs);
register('toggle', Toggle);
register('toggle-group', ToggleGroup);
register('navbar', Navbar);
register('sidebar', Sidebar);
register('autocomplete', Autocomplete);
register('avatar', Avatar);
register('slider', Slider);
register('select', Select);

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    queueMicrotask(() => init());
  }
}

export const Stisla = {
  version: '3.0.0-beta.8',
  Component,
  Collapsible,
  Accordion,
  Dialog,
  Drawer,
  Tooltip,
  Popover,
  Menu,
  Toast,
  toast,
  Tabs,
  Toggle,
  ToggleGroup,
  Navbar,
  Sidebar,
  Autocomplete,
  Avatar,
  Slider,
  Select,
  register,
  init,
  get: getInstance,
};

if (typeof window !== 'undefined') {
  window.Stisla = Stisla;
}

export default Stisla;
