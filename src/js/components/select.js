// Stisla.Select — hand-rolled native-feel select with a custom popup.
//
// Authored markup is a plain <select class="select" data-stisla-select>.
// After hydration the element is hidden (still in DOM for form
// participation) and a sibling <button> trigger + <ul role="listbox">
// popup are inserted. State syncs both ways via change events on the
// source <select>.
//
// Anatomy after hydration:
//   <select class="select" hidden tabindex="-1" aria-hidden="true">
//     <option …>
//   <button class="select select__trigger" type="button"
//           aria-haspopup="listbox" aria-expanded="false"
//           aria-controls="…">
//     <span class="select__value">…</span>
//     <span class="select__more">+N more</span>     (multi only, when extra > 0)
//   <ul class="select__popup" role="listbox" hidden>
//     <li class="select__item" role="option" data-value="…">…</li>
//     …
//
// Events (bubbling, detail: { select: this, value }):
//   stisla:select:opening    — before open  (cancelable)
//   stisla:select:open       — after open
//   stisla:select:closing    — before close (cancelable)
//   stisla:select:close      — after close
//   stisla:select:change     — after value change
//
// Opts (defaults below — read from data-stisla-select-<key>):
//   placement: 'bottom-start'  — Floating UI placement
//   offset: 8                  — distance from trigger
//   placeholder: null          — null reads data-placeholder on the <select>
//
// Behaviors:
//   Click / Enter / Space / ArrowDown on trigger → open
//   ArrowDown / ArrowUp → move highlight (looping at the ends)
//   Home / End → first / last
//   Enter / Space on highlighted → select (toggle in multi)
//   Click on option → select (toggle in multi)
//   Escape → close
//   Tab → close, focus follows native order
//   Type letters → native-select type-to-jump (no filter)
//   Click outside → close
//
// Multi:
//   Trigger shows "{first label} +N more" when >1 selected.
//   Clicking an already-selected option toggles it off.

import {
  computePosition,
  autoUpdate,
  offset as offsetMw,
  flip,
  shift,
  size,
} from '@floating-ui/dom';
import { Component } from '../core/component.js';

const TYPE_BUFFER_MS = 500;
let __idCounter = 0;

export class Select extends Component {
  static eventNamespace = 'select';
  static defaults = {
    placement: 'bottom-start',
    offset: 8,
    placeholder: null,
  };

  constructor(el, opts) {
    super(el, opts);

    if (el.tagName !== 'SELECT') {
      throw new Error(
        'Stisla.Select must be initialized on a <select> element',
      );
    }

    if (typeof this.opts.offset === 'string') {
      const n = Number(this.opts.offset);
      if (!Number.isNaN(n)) this.opts.offset = n;
    }

    this._source = el;
    this._isMulti = el.multiple;
    this._isOpen = false;
    this._activeIndex = -1;
    this._typeBuffer = '';
    this._typeTimer = 0;
    this._cleanupPos = null;

    const id = ++__idCounter;
    const placeholder =
      this.opts.placeholder ?? el.getAttribute('data-placeholder') ?? '';

    // Build trigger button — inherits .select (form-field-base shape) +
    // sub-classes from the source <select> so size variants travel.
    this._trigger = document.createElement('button');
    this._trigger.type = 'button';
    this._trigger.className = `select select__trigger ${
      el.classList.contains('select--compact') ? 'select--compact' : ''
    } ${el.classList.contains('select--roomy') ? 'select--roomy' : ''}`.trim();
    this._popupId = `stisla-select-${id}-popup`;
    this._trigger.setAttribute('aria-haspopup', 'listbox');
    this._trigger.setAttribute('aria-expanded', 'false');
    this._trigger.setAttribute('aria-controls', this._popupId);
    if (el.getAttribute('aria-label')) {
      this._trigger.setAttribute('aria-label', el.getAttribute('aria-label'));
    }
    if (el.getAttribute('aria-labelledby')) {
      this._trigger.setAttribute(
        'aria-labelledby',
        el.getAttribute('aria-labelledby'),
      );
    }
    if (el.getAttribute('aria-describedby')) {
      this._trigger.setAttribute(
        'aria-describedby',
        el.getAttribute('aria-describedby'),
      );
    }
    if (el.disabled) this._trigger.disabled = true;
    if (el.getAttribute('aria-invalid') === 'true') {
      this._trigger.setAttribute('aria-invalid', 'true');
    }

    this._value = document.createElement('span');
    this._value.className = 'select__value';
    if (placeholder) this._value.setAttribute('data-placeholder', placeholder);
    this._trigger.appendChild(this._value);

    // Build popup listbox.
    this._popup = document.createElement('ul');
    this._popup.className = 'select__popup';
    this._popup.id = this._popupId;
    this._popup.setAttribute('role', 'listbox');
    this._popup.hidden = true;
    if (this._isMulti) this._popup.setAttribute('aria-multiselectable', 'true');

    this._renderOptions(id);

    // Mount: hide the source, drop trigger + popup right after it. The
    // source stays in DOM (form participation, label association).
    el.insertAdjacentElement('afterend', this._popup);
    el.insertAdjacentElement('afterend', this._trigger);
    el.hidden = true;
    el.tabIndex = -1;
    el.setAttribute('aria-hidden', 'true');

    // If a <label for=…> targets the source, redirect focus to the
    // trigger when the source receives focus (e.g. label click).
    this._onSourceFocus = () => this._trigger.focus();
    this.on(el, 'focus', this._onSourceFocus);

    this._onTriggerClick = this._onTriggerClick.bind(this);
    this._onTriggerKeydown = this._onTriggerKeydown.bind(this);
    this._onPopupClick = this._onPopupClick.bind(this);
    this._onPopupMousedown = this._onPopupMousedown.bind(this);
    this._onDocPointerdown = this._onDocPointerdown.bind(this);
    this._onSourceChange = this._onSourceChange.bind(this);
    this._onSourceInvalid = this._onSourceInvalid.bind(this);

    this.on(this._trigger, 'click', this._onTriggerClick);
    this.on(this._trigger, 'keydown', this._onTriggerKeydown);
    this.on(this._popup, 'click', this._onPopupClick);
    this.on(this._popup, 'mousedown', this._onPopupMousedown);
    this.on(el, 'change', this._onSourceChange);

    // Native browser validation — the source <select> stays in the DOM
    // so required/pattern/setCustomValidity all gate form submission as
    // they would on a native select. The browser's tooltip can't anchor
    // to the hidden source though, so we suppress it and paint
    // aria-invalid on the trigger instead.
    this._browserInvalid = false;
    this.on(el, 'invalid', this._onSourceInvalid);

    // Mirror aria-invalid changes on the source onto the trigger so
    // form libraries can keep setting it where it belongs (the form
    // field). Initial value was already copied in the trigger build.
    this._attrObserver = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.attributeName === 'aria-invalid') this._mirrorInvalidAttr();
      }
    });
    this._attrObserver.observe(el, {
      attributes: true,
      attributeFilter: ['aria-invalid'],
    });

    this._syncFromSource();
  }

  // === Public API ========================================================

  get value() {
    return this._isMulti
      ? Array.from(this._source.selectedOptions).map((o) => o.value)
      : this._source.value;
  }

  set value(next) {
    if (this._isMulti) {
      const arr = Array.isArray(next) ? next : [next];
      for (const opt of this._source.options) opt.selected = arr.includes(opt.value);
    } else {
      this._source.value = String(next);
    }
    this._syncFromSource();
  }

  get disabled() {
    return this._source.disabled;
  }

  set disabled(next) {
    this._source.disabled = Boolean(next);
    this._trigger.disabled = Boolean(next);
    if (next && this._isOpen) this.close();
  }

  open() {
    if (this._isOpen || this.disabled) return;
    if (!this.emit('opening')) return;
    this._isOpen = true;
    this._popup.hidden = false;
    this._trigger.setAttribute('aria-expanded', 'true');
    this._cleanupPos = autoUpdate(this._trigger, this._popup, () =>
      this._position(),
    );
    document.addEventListener('pointerdown', this._onDocPointerdown, true);
    // Highlight the selected value (or first enabled option) on open.
    const values = this._currentValues();
    const start =
      values.length > 0
        ? this._optionEls.findIndex((li) => li.dataset.value === values[0])
        : this._firstEnabledIndex();
    this._setActiveIndex(start >= 0 ? start : this._firstEnabledIndex());
    this.emit('open', {}, { cancelable: false });
  }

  close() {
    if (!this._isOpen) return;
    if (!this.emit('closing')) return;
    this._isOpen = false;
    this._popup.hidden = true;
    this._trigger.setAttribute('aria-expanded', 'false');
    this._trigger.removeAttribute('aria-activedescendant');
    for (const li of this._optionEls) li.classList.remove('is-highlighted');
    this._activeIndex = -1;
    document.removeEventListener('pointerdown', this._onDocPointerdown, true);
    this._cleanupPos?.();
    this._cleanupPos = null;
    this.emit('close', {}, { cancelable: false });
  }

  toggle() {
    this._isOpen ? this.close() : this.open();
  }

  // === Render ============================================================

  _renderOptions(scopeId) {
    this._popup.innerHTML = '';
    const list = [];
    let idx = 0;
    const mkOption = (opt) => {
      const li = document.createElement('li');
      li.className = 'select__item';
      li.id = `stisla-select-${scopeId}-opt-${idx++}`;
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      // Leading check indicator (shown via .is-selected; the slot is always
      // reserved for column alignment). aria-hidden — aria-selected on the row
      // carries the state for assistive tech.
      const ind = document.createElement('span');
      ind.className = 'select__indicator';
      ind.setAttribute('aria-hidden', 'true');
      ind.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">' +
        '<polyline points="3 8.5 6.5 12 13 5" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round"/></svg>';
      li.appendChild(ind);
      li.appendChild(document.createTextNode(opt.textContent));
      li.setAttribute('aria-selected', 'false');
      if (opt.disabled) li.setAttribute('aria-disabled', 'true');
      return li;
    };
    for (const node of this._source.children) {
      if (node.tagName === 'OPTGROUP') {
        const header = document.createElement('li');
        header.className = 'select__group-label';
        header.setAttribute('role', 'presentation');
        header.textContent = node.label;
        this._popup.appendChild(header);
        for (const opt of node.children) {
          if (opt.tagName !== 'OPTION') continue;
          if (opt.value === '') continue;
          const li = mkOption(opt);
          this._popup.appendChild(li);
          list.push(li);
        }
      } else if (node.tagName === 'OPTION') {
        if (node.value === '') continue; // placeholder option — hidden from list
        const li = mkOption(node);
        this._popup.appendChild(li);
        list.push(li);
      }
    }
    this._optionEls = list;
  }

  _syncFromSource() {
    const values = this._currentValues();
    for (const li of this._optionEls) {
      const sel = values.includes(li.dataset.value);
      li.setAttribute('aria-selected', String(sel));
      li.classList.toggle('is-selected', sel);
    }
    this._renderValue(values);
  }

  _currentValues() {
    if (this._isMulti) {
      return Array.from(this._source.selectedOptions)
        .map((o) => o.value)
        .filter((v) => v !== '');
    }
    return this._source.value && this._source.value !== '' ? [this._source.value] : [];
  }

  _renderValue(values) {
    this._value.textContent = '';
    // Trim any previous +N more node.
    const stale = this._trigger.querySelector('.select__more');
    if (stale) stale.remove();
    if (values.length === 0) return;
    const first = this._optionEls.find((li) => li.dataset.value === values[0]);
    this._value.textContent = first ? first.textContent : values[0];
    const extra = values.length - 1;
    if (extra > 0) {
      const more = document.createElement('span');
      more.className = 'select__more';
      more.textContent = `+${extra} more`;
      this._trigger.insertBefore(more, this._value.nextSibling);
    }
  }

  // === Positioning =======================================================

  async _position() {
    if (!this._isOpen) return;
    const { x, y } = await computePosition(this._trigger, this._popup, {
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

  // === Selection =========================================================

  _selectIndex(idx) {
    const li = this._optionEls[idx];
    if (!li || li.getAttribute('aria-disabled') === 'true') return;
    const value = li.dataset.value;
    if (this._isMulti) {
      const opt = Array.from(this._source.options).find((o) => o.value === value);
      if (!opt) return;
      opt.selected = !opt.selected;
    } else {
      this._source.value = value;
    }
    this._source.dispatchEvent(new Event('change', { bubbles: true }));
    this._syncFromSource();
    if (!this._isMulti) this.close();
  }

  _onSourceChange() {
    // Source may change from external code; reflect into UI + emit.
    this._syncFromSource();
    // If the browser previously fired `invalid` and the new value passes
    // constraint validation, clear the auto-set aria-invalid so the red
    // border lifts. Manual aria-invalid (set by a form library on the
    // source) is preserved via the mutation observer.
    if (this._browserInvalid && this._source.checkValidity()) {
      this._browserInvalid = false;
      this._mirrorInvalidAttr();
    }
    this.emit('change', { value: this.value }, { cancelable: false });
  }

  _onSourceInvalid(e) {
    // The source is hidden, so the browser's validation tooltip would
    // anchor to nothing — suppress it. Apps render the error message
    // via .field__error (see /select).
    e.preventDefault();
    this._browserInvalid = true;
    this._trigger.setAttribute('aria-invalid', 'true');
    // Focus the trigger so the user can see + correct the invalid field.
    // The browser already tried to focus the (invisible) source, so this
    // schedules after that attempt.
    this._trigger.focus();
  }

  _mirrorInvalidAttr() {
    const v = this._source.getAttribute('aria-invalid');
    if (v === 'true' || this._browserInvalid) {
      this._trigger.setAttribute('aria-invalid', 'true');
    } else {
      this._trigger.removeAttribute('aria-invalid');
    }
  }

  // === Active highlight ==================================================

  _firstEnabledIndex() {
    return this._optionEls.findIndex(
      (li) => li.getAttribute('aria-disabled') !== 'true',
    );
  }

  _setActiveIndex(idx) {
    if (idx < 0 || idx >= this._optionEls.length) return;
    if (this._activeIndex >= 0) {
      this._optionEls[this._activeIndex]?.classList.remove('is-highlighted');
    }
    this._activeIndex = idx;
    const li = this._optionEls[idx];
    li.classList.add('is-highlighted');
    li.scrollIntoView({ block: 'nearest' });
    this._trigger.setAttribute('aria-activedescendant', li.id);
  }

  _moveActive(delta) {
    if (!this._optionEls.length) return;
    let i = this._activeIndex;
    for (let n = 0; n < this._optionEls.length; n++) {
      i = (i + delta + this._optionEls.length) % this._optionEls.length;
      if (this._optionEls[i].getAttribute('aria-disabled') !== 'true') {
        this._setActiveIndex(i);
        return;
      }
    }
  }

  // === Events ============================================================

  _onTriggerClick() {
    if (this.disabled) return;
    this.toggle();
  }

  _onTriggerKeydown(e) {
    if (this.disabled) return;
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
      case 'Home':
        if (this._isOpen) {
          e.preventDefault();
          this._setActiveIndex(this._firstEnabledIndex());
        }
        return;
      case 'End':
        if (this._isOpen) {
          e.preventDefault();
          for (let i = this._optionEls.length - 1; i >= 0; i--) {
            if (this._optionEls[i].getAttribute('aria-disabled') !== 'true') {
              this._setActiveIndex(i);
              break;
            }
          }
        }
        return;
      case 'Enter':
      case ' ':
        if (this._isOpen) {
          if (this._activeIndex >= 0) {
            e.preventDefault();
            this._selectIndex(this._activeIndex);
          }
        } else {
          e.preventDefault();
          this.open();
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
    // Type-to-jump (printable keys only).
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      this._onTypeKey(e.key);
    }
  }

  _onTypeKey(key) {
    const ch = key.toLowerCase();
    clearTimeout(this._typeTimer);
    this._typeBuffer += ch;
    this._typeTimer = setTimeout(() => (this._typeBuffer = ''), TYPE_BUFFER_MS);
    if (!this._isOpen) this.open();
    const idx = this._optionEls.findIndex((li) =>
      li.textContent.trim().toLowerCase().startsWith(this._typeBuffer),
    );
    if (idx >= 0) this._setActiveIndex(idx);
  }

  _onPopupClick(e) {
    const li = e.target.closest('[role="option"]');
    if (!li) return;
    const idx = this._optionEls.indexOf(li);
    if (idx < 0) return;
    this._selectIndex(idx);
  }

  // Prevent the trigger from losing focus when clicking inside the popup;
  // keeps keyboard nav workable while the popup is open.
  _onPopupMousedown(e) {
    e.preventDefault();
  }

  _onDocPointerdown(e) {
    if (!this._isOpen) return;
    if (
      this._trigger.contains(e.target) ||
      this._popup.contains(e.target) ||
      this._source.contains(e.target)
    ) {
      return;
    }
    this.close();
  }

  destroy() {
    this._cleanupPos?.();
    document.removeEventListener('pointerdown', this._onDocPointerdown, true);
    this._attrObserver?.disconnect();
    this._attrObserver = null;
    if (this._trigger) this._trigger.remove();
    if (this._popup) this._popup.remove();
    if (this._source) {
      this._source.hidden = false;
      this._source.removeAttribute('tabindex');
      this._source.removeAttribute('aria-hidden');
    }
    super.destroy();
  }
}
