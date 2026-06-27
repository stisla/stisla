// Stisla.Combobox — Tom Select adapter (stisla-full bundle).
//
// A searchable trigger backed by Tom Select. Authored as a regular
// <select class="combobox" data-stisla-combobox>; multi-select via the
// native `multiple` attribute; tagging mode via `data-stisla-combobox-
// create="true"`. Tom Select handles search/filter, chip rendering
// (remove_button plugin), keyboard nav, and remote loading if a `load`
// callback is provided.
//
// Events (bubbling, detail: { combobox, value }):
//   stisla:combobox:change   — after value change
//   stisla:combobox:open     — dropdown opens
//   stisla:combobox:close    — dropdown closes
//
// Opts (read from data-stisla-combobox-<key>):
//   placeholder   — string; falls back to data-placeholder on the <select>
//   create        — true | false; tagging mode (lets users add unknown values)
//   maxItems      — number; null = unlimited in multi mode
//   plugins       — extra plugin names appended to the defaults

import TomSelect from 'tom-select/popular';
import { Component } from '../core/component.js';

export class Combobox extends Component {
  static eventNamespace = 'combobox';
  static defaults = {
    placeholder: null,
    create: false,
    maxItems: null,
    plugins: null,
  };

  constructor(el, opts) {
    super(el, opts);

    if (el.tagName !== 'SELECT') {
      throw new Error(
        'Stisla.Combobox must be initialized on a <select> element',
      );
    }

    const isMulti = el.multiple;
    const placeholder =
      this.opts.placeholder ?? el.getAttribute('data-placeholder') ?? null;

    const plugins = isMulti
      ? ['remove_button', ...(this.opts.plugins || [])]
      : this.opts.plugins || [];

    this._source = el;

    this._ts = new TomSelect(el, {
      hideSelected: isMulti,
      maxItems: this.opts.maxItems ?? (isMulti ? null : 1),
      placeholder,
      plugins,
      create: this.opts.create === true || this.opts.create === 'true',
      onChange: (value) => {
        // Browser-side aria-invalid auto-clears once the new value
        // passes constraint validation. Manual aria-invalid (server
        // errors set by a form library) survives because it predates
        // this flag and the CSS still keys off the source attribute.
        if (this._browserInvalid && this._source.checkValidity()) {
          this._browserInvalid = false;
          this._source.removeAttribute('aria-invalid');
        }
        this.emit('change', { value }, { cancelable: false });
      },
      onDropdownOpen: () => this.emit('open', {}, { cancelable: false }),
      onDropdownClose: () => this.emit('close', {}, { cancelable: false }),
    });

    // Native browser validation — same wiring as Stisla.Select. The
    // source <select> still gates form submission via required/pattern/
    // setCustomValidity; the browser's tooltip can't anchor to the
    // hidden source though, so we suppress it, mark aria-invalid (the
    // adjacent-sibling CSS paints the wrapper), and focus the typing
    // input so the user can correct the field.
    this._browserInvalid = false;
    this._onSourceInvalid = this._onSourceInvalid.bind(this);
    this.on(el, 'invalid', this._onSourceInvalid);
  }

  _onSourceInvalid(e) {
    e.preventDefault();
    this._browserInvalid = true;
    this._source.setAttribute('aria-invalid', 'true');
    this._ts?.focus();
  }

  get value() {
    return this._ts?.getValue();
  }

  set value(next) {
    this._ts?.setValue(next, true);
  }

  open() {
    this._ts?.open();
  }

  close() {
    this._ts?.close();
  }

  refresh() {
    this._ts?.sync();
  }

  destroy() {
    try {
      this._ts?.destroy();
    } catch {
      /* noop */
    }
    this._ts = null;
    super.destroy();
  }
}
