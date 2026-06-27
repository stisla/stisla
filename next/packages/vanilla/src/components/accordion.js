// Stisla.Accordion — a stack of collapsible panels (V3.md §3.7).
//
// Composes one Stisla.Collapsible per .accordion__item. The state hook
// lives on the item (where the chip / chevron / divider styles read it);
// the height transition runs on the body. The header button drives both
// through the Collapsible primitive — Accordion doesn't bind its own
// click handler. Single-mode coordination happens via the bubbling
// stisla:collapsible:opening event, which catches every open path
// (click, keyboard, programmatic API) at one point.
//
// Anatomy:
//   <div class="accordion" data-stisla-accordion
//        data-stisla-accordion-type="single|multiple">
//     <div class="accordion__item" data-state="closed">
//       <h3 class="accordion__heading">
//         <button class="accordion__trigger"
//                 data-stisla-accordion-trigger
//                 aria-expanded="false" aria-controls="acc-1-body">…</button>
//       </h3>
//       <div id="acc-1-body" class="accordion__body" role="region">…</div>
//     </div>
//   </div>
//
// Options:
//   type — 'single' or 'multiple'. Autodetected from
//          data-stisla-accordion-type, with back-compat for the legacy
//          data-stisla-accordion-single boolean attribute.
//   collapsible — single mode only: allow closing the currently-open item
//                 (Radix-aligned name). Default true.
//   duration — transition duration override, propagated to each Collapsible.
//
// Events (bubbling, detail: { accordion: this, value, previousValue }):
//   stisla:accordion:value-change — after a successful open/close
//
// Each item's Collapsible still emits stisla:collapsible:* — useful for
// per-item hooks that don't care which accordion they live in.

import { Component } from '../core/component.js';
import { Collapsible } from './collapsible.js';

export class Accordion extends Component {
  static eventNamespace = 'accordion';
  static defaults = {
    type: null,
    collapsible: true,
    duration: null,
  };

  constructor(el, opts) {
    super(el, opts);

    if (!this.opts.type) {
      this.opts.type =
        el.dataset.stislaAccordionType === 'single' ||
        el.hasAttribute('data-stisla-accordion-single')
          ? 'single'
          : 'multiple';
    }

    this._items = [];
    this._suppressClosingGuard = false;
    this._lastValue = [];
    this._buildItems();
    this._lastValue = this._value();

    this._onOpening = this._onOpening.bind(this);
    this._onClosing = this._onClosing.bind(this);
    this._onSettled = this._onSettled.bind(this);
    this.on(el, 'stisla:collapsible:opening', this._onOpening);
    this.on(el, 'stisla:collapsible:closing', this._onClosing);
    this.on(el, 'stisla:collapsible:opened', this._onSettled);
    this.on(el, 'stisla:collapsible:closed', this._onSettled);
  }

  // === public API ========================================================

  getItems() {
    return this._items.map(({ item }) => item);
  }

  openItem(target) {
    const entry = this._resolve(target);
    if (!entry) return this;
    entry.collapsible.open();
    return this;
  }

  closeItem(target) {
    const entry = this._resolve(target);
    if (!entry) return this;
    entry.collapsible.close();
    return this;
  }

  toggleItem(target) {
    const entry = this._resolve(target);
    if (!entry) return this;
    entry.collapsible.toggle();
    return this;
  }

  closeAll() {
    this._suppressClosingGuard = true;
    for (const entry of this._items) {
      if (entry.collapsible.isOpen()) entry.collapsible.close();
    }
    this._suppressClosingGuard = false;
    return this;
  }

  destroy() {
    for (const entry of this._items) entry.collapsible.destroy();
    this._items = [];
    super.destroy();
  }

  // === internals =========================================================

  _buildItems() {
    const items = this.el.querySelectorAll(':scope > .accordion__item');
    for (const item of items) {
      const trigger = item.querySelector('[data-stisla-accordion-trigger]');
      const body = item.querySelector('.accordion__body');
      if (!trigger || !body) continue;
      const collapsible = new Collapsible(body, {
        stateEl: item,
        triggers: [trigger],
        open: item.dataset.state === 'open',
        duration: this.opts.duration,
      });
      this._items.push({ item, trigger, body, collapsible });
    }
  }

  _onOpening(e) {
    const entry = this._items.find(({ body }) => body === e.target);
    if (!entry) return;
    if (this.opts.type !== 'single') return;
    // Auto-close every other open item in parallel. Suppress the closing
    // guard so the collapsible: false rule doesn't fire here — it should
    // only block user-driven close attempts on the only-open item, not
    // the auto-close that single mode does as part of opening a new one.
    this._suppressClosingGuard = true;
    for (const other of this._items) {
      if (other !== entry && other.collapsible.isOpen()) {
        other.collapsible.close();
      }
    }
    this._suppressClosingGuard = false;
  }

  _onClosing(e) {
    if (this._suppressClosingGuard) return;
    if (this.opts.type !== 'single' || this.opts.collapsible) return;
    const entry = this._items.find(({ body }) => body === e.target);
    if (!entry) return;
    // Block the close if this is the only open item AND no other item is
    // currently opening — i.e. the user is trying to close the value-
    // less state in a non-collapsible single accordion.
    const otherOpen = this._items.some(
      (x) => x !== entry && x.collapsible.isOpen(),
    );
    if (!otherOpen) e.preventDefault();
  }

  _onSettled() {
    const value = this._value();
    const previous = this._lastValue;
    if (value.length === previous.length && value.every((v, i) => v === previous[i])) {
      return;
    }
    this._lastValue = value;
    this.emit(
      'value-change',
      {
        value,
        previousValue: previous,
        openItems: this._items
          .filter(({ collapsible }) => collapsible.isOpen())
          .map(({ item }) => item),
      },
      { cancelable: false },
    );
  }

  _resolve(target) {
    if (target == null) return null;
    if (typeof target === 'number') return this._items[target] ?? null;
    if (typeof target === 'string') {
      return (
        this._items.find(
          ({ item, trigger }) =>
            item.dataset.value === target ||
            trigger.dataset.value === target ||
            item.id === target,
        ) ?? null
      );
    }
    return this._items.find(({ item }) => item === target || item.contains(target)) ?? null;
  }

  _value() {
    return this._items
      .filter(({ collapsible }) => collapsible.isOpen())
      .map(({ item, trigger }, i) => {
        return (
          item.dataset.value ?? trigger.dataset.value ?? item.id ?? String(i)
        );
      });
  }
}
