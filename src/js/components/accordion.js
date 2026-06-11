// Stisla.Accordion — a stack of collapsible panels (V3.md §3.7).
//
// Composes one Stisla.Collapsible per .accordion__item. The state hook
// lives on the item (where the chip / chevron / divider styles read it);
// the height transition runs on the body. The header button drives both.
//
// Anatomy:
//   <div class="accordion" data-stisla-accordion
//        data-stisla-accordion-type="single|multiple">
//     <div class="accordion__item" data-state="closed">
//       <h3>
//         <button class="accordion__header"
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
    this._buildItems();

    this._onClick = this._onClick.bind(this);
    this.on(el, 'click', this._onClick);
  }

  // === public API ========================================================

  getItems() {
    return this._items.map(({ item }) => item);
  }

  openItem(target) {
    const entry = this._resolve(target);
    if (!entry || entry.collapsible.isOpen()) return this;
    this._commit(entry, true);
    return this;
  }

  closeItem(target) {
    const entry = this._resolve(target);
    if (!entry || !entry.collapsible.isOpen()) return this;
    this._commit(entry, false);
    return this;
  }

  toggleItem(target) {
    const entry = this._resolve(target);
    if (!entry) return this;
    this._commit(entry, !entry.collapsible.isOpen());
    return this;
  }

  closeAll() {
    for (const entry of this._items) {
      if (entry.collapsible.isOpen()) entry.collapsible.close();
    }
    this._emitChange();
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

  _onClick(e) {
    const trigger = e.target.closest('[data-stisla-accordion-trigger]');
    if (!trigger) return;
    // Only own triggers — nested accordions inside a body manage themselves.
    const entry = this._items.find((x) => x.trigger === trigger);
    if (!entry) return;
    e.preventDefault();
    if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') {
      return;
    }
    const opening = !entry.collapsible.isOpen();
    if (!opening && this.opts.type === 'single' && !this.opts.collapsible) {
      // Radix-style: in single mode with collapsible: false, the current
      // item can't close itself — there's no value-less state.
      return;
    }
    this._commit(entry, opening);
  }

  _commit(entry, opening) {
    if (opening && this.opts.type === 'single') {
      for (const other of this._items) {
        if (other !== entry && other.collapsible.isOpen()) {
          other.collapsible.close();
        }
      }
    }
    const action = opening ? entry.collapsible.open() : entry.collapsible.close();
    Promise.resolve(action).then(() => this._emitChange());
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

  _emitChange() {
    const value = this._value();
    const previous = this._lastValue ?? [];
    if (value.length === previous.length && value.every((v, i) => v === previous[i])) {
      return;
    }
    this._lastValue = value;
    this.emit(
      'value-change',
      { value, previousValue: previous, openItems: this.getItems().filter((_, i) => this._items[i].collapsible.isOpen()) },
      { cancelable: false },
    );
  }
}
