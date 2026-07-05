// Stisla.Toggle — two-state press button.
//
// Anatomy:
//   <button class="toggle" data-stisla-toggle aria-pressed="false">…</button>
//
// Scope: the JS-driven press-button path only. The form-data path
//   <input class="toggle-input"> + <label class="toggle">
// is native — the browser owns checkbox/radio state, the sibling combinator owns paint, no JS
// instance attaches.
//
// Events (bubbling, detail: { toggle: this, pressed }):
//   stisla:toggle:changing  — before flip (cancelable; preventDefault aborts)
//   stisla:toggle:changed   — after flip
//
// Opts:
//   pressed: null | boolean    null = read initial aria-pressed; explicit boolean writes it on init.

import { Component } from '../core/component.js';

export class Toggle extends Component {
  static eventNamespace = 'toggle';
  static defaults = {
    pressed: null,
  };

  constructor(el, opts) {
    super(el, opts);

    // Initial state. An explicit opt wins; otherwise read what markup declared. Default to false so
    // the attribute is always set on the host post-init.
    let initial;
    if (this.opts.pressed === true || this.opts.pressed === 'true') {
      initial = true;
    } else if (this.opts.pressed === false || this.opts.pressed === 'false') {
      initial = false;
    } else {
      initial = el.getAttribute('aria-pressed') === 'true';
    }
    el.setAttribute('aria-pressed', String(initial));

    this._onClick = this._onClick.bind(this);
    this.on(el, 'click', this._onClick);
  }

  get pressed() {
    return this.el?.getAttribute('aria-pressed') === 'true';
  }

  set pressed(next) {
    this._set(Boolean(next));
  }

  toggle() {
    this._set(!this.pressed);
  }

  press() {
    this._set(true);
  }

  unpress() {
    this._set(false);
  }

  _onClick(e) {
    if (this._isDisabled()) {
      e.preventDefault();
      return;
    }
    this.toggle();
  }

  _isDisabled() {
    return (
      this.el.disabled === true ||
      this.el.getAttribute('aria-disabled') === 'true'
    );
  }

  _set(next) {
    if (!this.el) return;
    if (next === this.pressed) return;
    const ok = this.emit('changing', { pressed: next });
    if (!ok) return;
    this.el.setAttribute('aria-pressed', String(next));
    this.emit('changed', { pressed: next }, { cancelable: false });
  }
}
