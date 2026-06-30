// Stisla.Autocomplete — hand-rolled input + suggestions popup.
//
// Authored markup is an <input> with either list="…" referencing a
// <datalist>, or data-options='[…]' carrying the option set inline.
// After hydration the native datalist UI is suppressed and a custom
// popup renders below the input. Picking a suggestion replaces the
// typed text with the chosen value.
//
// Anatomy after hydration:
//   <input class="autocomplete" role="combobox" aria-autocomplete="list"
//          aria-expanded="false" aria-controls="…">
//   <ul class="autocomplete__popup" role="listbox" hidden>
//     <li class="autocomplete__item" role="option" data-value="…">…</li>
//
// Events (bubbling, detail: { autocomplete, value }):
//   stisla:autocomplete:open   — popup opens
//   stisla:autocomplete:close  — popup closes
//   stisla:autocomplete:select — user picks an option (detail.value)
//
// Opts (read from data-stisla-autocomplete-<key>):
//   minLength: 1            chars before the popup opens
//   placement: 'bottom-start'
//   offset: 8

import {
  computePosition,
  autoUpdate,
  offset as offsetMw,
  flip,
  shift,
  size,
} from '@floating-ui/dom';
import { Component } from '../core/component.js';

let __idCounter = 0;

export class Autocomplete extends Component {
  static eventNamespace = 'autocomplete';
  static defaults = {
    minLength: 1,
    placement: 'bottom-start',
    offset: 8,
  };

  constructor(el, opts) {
    super(el, opts);

    if (el.tagName !== 'INPUT') {
      throw new Error(
        'Stisla.Autocomplete must be initialized on an <input> element',
      );
    }

    if (typeof this.opts.offset === 'string') {
      const n = Number(this.opts.offset);
      if (!Number.isNaN(n)) this.opts.offset = n;
    }
    if (typeof this.opts.minLength === 'string') {
      const n = Number(this.opts.minLength);
      if (!Number.isNaN(n)) this.opts.minLength = n;
    }

    this._input = el;
    this._isOpen = false;
    this._activeIndex = -1;
    this._cleanupPos = null;

    // Resolve options: inline JSON via data-options wins, then <datalist>.
    this._options = this._readOptions(el);

    // Build popup.
    const id = ++__idCounter;
    this._popupId = `stisla-autocomplete-${id}-popup`;
    el.setAttribute('role', 'combobox');
    el.setAttribute('aria-autocomplete', 'list');
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('aria-controls', this._popupId);
    el.setAttribute('autocomplete', 'off');

    this._popup = document.createElement('ul');
    this._popup.className = 'autocomplete__popup';
    this._popup.id = this._popupId;
    this._popup.setAttribute('role', 'listbox');
    this._popup.hidden = true;

    el.insertAdjacentElement('afterend', this._popup);

    this._onInput = this._onInput.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onPopupClick = this._onPopupClick.bind(this);
    this._onPopupMousedown = this._onPopupMousedown.bind(this);
    this._onDocPointerdown = this._onDocPointerdown.bind(this);

    this.on(el, 'input', this._onInput);
    this.on(el, 'keydown', this._onKeydown);
    this.on(el, 'focus', this._onFocus);
    this.on(this._popup, 'click', this._onPopupClick);
    this.on(this._popup, 'mousedown', this._onPopupMousedown);
  }

  // === Option source =====================================================

  _readOptions(el) {
    // data-options wins — most explicit.
    const inline = el.getAttribute('data-options');
    if (inline) {
      try {
        const arr = JSON.parse(inline);
        return arr.map((o) => this._normalizeOption(o));
      } catch (e) {
        console.warn('[stisla] Autocomplete: invalid data-options JSON', e);
      }
    }
    // <datalist> via list="…". Removing the list attribute suppresses the
    // browser's native autocomplete UI; the datalist stays in the DOM as
    // a data source and a no-JS fallback.
    const listId = el.getAttribute('list');
    if (listId) {
      const datalist = document.getElementById(listId);
      if (datalist?.tagName === 'DATALIST') {
        el.removeAttribute('list');
        return Array.from(datalist.options).map((o) => {
          // o.label and o.text both default to "" when the <option> has
          // no inner text. o.textContent can include the whitespace
          // between sibling tags (truthy but invisible), so trim before
          // falling through to the value attribute.
          const label = (o.label || o.text || '').trim() || o.value;
          return { value: o.value, label };
        });
      }
    }
    return [];
  }

  _normalizeOption(o) {
    if (typeof o === 'string') return { value: o, label: o };
    return {
      value: String(o.value ?? o.label ?? ''),
      label: String(o.label ?? o.value ?? ''),
    };
  }

  // === Public API ========================================================

  get value() {
    return this._input.value;
  }

  set value(next) {
    this._input.value = String(next ?? '');
  }

  open() {
    if (this._isOpen || this._input.disabled) return;
    if (this._input.value.trim().length < this.opts.minLength) return;
    const matches = this._filter(this._input.value);
    this._render(matches);
    this._isOpen = true;
    this._popup.hidden = false;
    this._input.setAttribute('aria-expanded', 'true');
    this._cleanupPos = autoUpdate(this._input, this._popup, () =>
      this._position(),
    );
    document.addEventListener('pointerdown', this._onDocPointerdown, true);
    this._setActiveIndex(0);
    this.emit('open', {}, { cancelable: false });
  }

  close() {
    if (!this._isOpen) return;
    this._isOpen = false;
    this._popup.hidden = true;
    this._input.setAttribute('aria-expanded', 'false');
    this._input.removeAttribute('aria-activedescendant');
    for (const li of this._optionEls || []) li.removeAttribute('data-highlighted');
    this._activeIndex = -1;
    this._cleanupPos?.();
    this._cleanupPos = null;
    document.removeEventListener('pointerdown', this._onDocPointerdown, true);
    this.emit('close', {}, { cancelable: false });
  }

  // === Filtering + rendering =============================================

  _filter(query) {
    const q = query.trim().toLowerCase();
    if (q.length < this.opts.minLength) return [];
    // q === '' (only reachable when minLength is 0) includes() everything.
    return this._options.filter((o) => o.label.toLowerCase().includes(q));
  }

  _render(matches) {
    this._popup.innerHTML = '';
    this._optionEls = [];
    if (matches.length === 0) {
      const li = document.createElement('li');
      li.className = 'autocomplete__empty';
      li.setAttribute('role', 'presentation');
      li.textContent = 'No results';
      this._popup.appendChild(li);
      return;
    }
    const q = this._input.value.trim().toLowerCase();
    matches.forEach((o, idx) => {
      const li = document.createElement('li');
      li.className = 'autocomplete__item';
      li.id = `${this._popupId}-opt-${idx}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.dataset.value = o.value;
      li.innerHTML = this._highlight(o.label, q);
      this._popup.appendChild(li);
      this._optionEls.push(li);
    });
  }

  _highlight(label, query) {
    const escaped = label.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));
    if (!query) return escaped;
    const idx = label.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return escaped;
    // Use the escaped string but match positions in the original. Since
    // escaping shifts indices for special chars, recompute against the
    // escaped string conservatively: re-find the (lower-cased) escaped
    // query in the escaped label.
    const escQuery = query.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));
    const lowerEsc = escaped.toLowerCase();
    const i = lowerEsc.indexOf(escQuery.toLowerCase());
    if (i < 0) return escaped;
    return (
      escaped.slice(0, i) +
      '<mark>' +
      escaped.slice(i, i + escQuery.length) +
      '</mark>' +
      escaped.slice(i + escQuery.length)
    );
  }

  // === Positioning =======================================================

  async _position() {
    if (!this._isOpen) return;
    const { x, y } = await computePosition(this._input, this._popup, {
      strategy: 'absolute',
      placement: this.opts.placement,
      middleware: [
        offsetMw(this.opts.offset),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply: ({ availableHeight, rects }) => {
            Object.assign(this._popup.style, {
              maxHeight: `${Math.max(120, Math.min(availableHeight - 8, 320))}px`,
              minWidth: `${rects.reference.width}px`,
            });
          },
        }),
      ],
    });
    Object.assign(this._popup.style, {
      position: 'absolute',
      left: `${Math.round(x)}px`,
      top: `${Math.round(y)}px`,
    });
  }

  // === Active highlight ==================================================

  _setActiveIndex(idx) {
    if (!this._optionEls?.length) return;
    if (idx < 0 || idx >= this._optionEls.length) return;
    if (this._activeIndex >= 0) {
      this._optionEls[this._activeIndex]?.removeAttribute('data-highlighted');
    }
    this._activeIndex = idx;
    const li = this._optionEls[idx];
    li.setAttribute('data-highlighted', '');
    li.scrollIntoView({ block: 'nearest' });
    this._input.setAttribute('aria-activedescendant', li.id);
  }

  _moveActive(delta) {
    if (!this._optionEls?.length) return;
    const n = this._optionEls.length;
    const next = ((this._activeIndex + delta) % n + n) % n;
    this._setActiveIndex(next);
  }

  // === Selection =========================================================

  _selectIndex(idx) {
    const li = this._optionEls?.[idx];
    if (!li) return;
    const value = li.dataset.value;
    this._input.value = value;
    this._input.dispatchEvent(new Event('input', { bubbles: true }));
    this._input.dispatchEvent(new Event('change', { bubbles: true }));
    this.emit('select', { value }, { cancelable: false });
    this.close();
  }

  // === Events ============================================================

  _onInput() {
    // Below min-length: keep the popup shut (and close it if a deletion
    // dropped us back under the threshold).
    if (this._input.value.trim().length < this.opts.minLength) {
      this.close();
      return;
    }
    if (!this._isOpen) {
      this.open();
    } else {
      // Already open — re-filter, then refresh active item + position.
      this._render(this._filter(this._input.value));
      this._setActiveIndex(0);
      this._position();
    }
  }

  _onFocus() {
    // Open immediately on focus if there's already content.
    if (this._input.value.length >= this.opts.minLength) this.open();
  }

  _onKeydown(e) {
    if (this._input.disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this._isOpen) this.open();
        else this._moveActive(1);
        return;
      case 'ArrowUp':
        e.preventDefault();
        if (!this._isOpen) this.open();
        else this._moveActive(-1);
        return;
      case 'Enter':
        if (this._isOpen && this._activeIndex >= 0 && this._optionEls?.length) {
          e.preventDefault();
          this._selectIndex(this._activeIndex);
        }
        return;
      case 'Escape':
        if (this._isOpen) {
          e.preventDefault();
          this.close();
        }
        return;
      case 'Tab':
        if (this._isOpen) this.close();
        return;
    }
  }

  _onPopupClick(e) {
    const li = e.target.closest('[role="option"]');
    if (!li) return;
    const idx = this._optionEls?.indexOf(li) ?? -1;
    if (idx >= 0) this._selectIndex(idx);
  }

  // Keep input focused when interacting with the popup.
  _onPopupMousedown(e) {
    e.preventDefault();
  }

  _onDocPointerdown(e) {
    if (!this._isOpen) return;
    if (this._input.contains(e.target) || this._popup.contains(e.target)) return;
    this.close();
  }

  destroy() {
    this._cleanupPos?.();
    document.removeEventListener('pointerdown', this._onDocPointerdown, true);
    this._popup?.remove();
    if (this._input) {
      this._input.removeAttribute('role');
      this._input.removeAttribute('aria-autocomplete');
      this._input.removeAttribute('aria-expanded');
      this._input.removeAttribute('aria-controls');
      this._input.removeAttribute('aria-activedescendant');
    }
    super.destroy();
  }
}
