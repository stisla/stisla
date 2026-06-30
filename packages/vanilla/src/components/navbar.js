// Stisla.Navbar — mobile menu collapse (V3.md §3.7).
//
// A thin wrapper around a single Stisla.Collapsible mounted on .navbar__menu, triggered by
// .navbar__toggle. Above the navbar's collapse breakpoint the toggle is display: none in CSS, so
// this class never sees clicks while the menu is permanently visible — no breakpoint gymnastics on
// the JS side.
//
// Anatomy:
//   <nav class="navbar" data-stisla-navbar>
//     <a class="navbar__brand">…</a>
//     <button class="navbar__toggle"
//             data-stisla-navbar-toggle
//             aria-controls="navbar-menu" aria-expanded="false">…</button>
//     <div id="navbar-menu" class="navbar__menu" data-state="closed">…</div>
//   </nav>
//
// Options:
//   duration — transition duration override, propagated to the underlying Collapsible.
//
// Events (bubbling, detail: { navbar: this, open }):
//   stisla:navbar:change — after the menu opens or closes
//
// The underlying Collapsible still emits stisla:collapsible:*.

import { Component } from '../core/component.js';
import { Collapsible } from './collapsible.js';

export class Navbar extends Component {
  static eventNamespace = 'navbar';
  static defaults = {
    duration: null,
  };

  constructor(el, opts) {
    super(el, opts);

    this._menu = el.querySelector('.navbar__menu');
    this._toggle = el.querySelector('[data-stisla-navbar-toggle]');
    if (!this._menu || !this._toggle) return;

    this._collapsible = new Collapsible(this._menu, {
      triggers: [this._toggle],
      open: this._menu.dataset.state === 'open',
      duration: this.opts.duration,
    });

    this._onChange = this._onChange.bind(this);
    this.on(this._menu, 'stisla:collapsible:opened', this._onChange);
    this.on(this._menu, 'stisla:collapsible:closed', this._onChange);
  }

  // === public API ========================================================

  open() {
    return this._collapsible?.open();
  }

  close() {
    return this._collapsible?.close();
  }

  toggle() {
    return this._collapsible?.toggle();
  }

  isOpen() {
    return Boolean(this._collapsible?.isOpen());
  }

  destroy() {
    this._collapsible?.destroy();
    this._collapsible = null;
    super.destroy();
  }

  // === internals =========================================================

  _onChange() {
    this.emit('change', { open: this.isOpen() }, { cancelable: false });
  }
}
