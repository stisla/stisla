// Stisla.Slider — V3.md §3.7 JS-driven range input.
//
// Anatomy:
//   .slider[data-stisla-slider]
//     .slider__track > .slider__range
//     .slider__thumb (role=slider, tabindex=0)
//     .slider__input (type=hidden, form participation)
//
// Pointer:
//   - pointerdown on track → jump to that position, start drag
//   - pointerdown on thumb → start drag without jump (avoids step-snap flicker)
//   - subsequent move/up bind on document so dragging keeps tracking when
//     the cursor leaves the host
//
// Keyboard (on thumb):
//   - Arrow Left/Down   → -step
//   - Arrow Right/Up    → +step
//   - Shift + arrow     → ±(step × 10)
//   - Home / End        → min / max
//   - PageDown / PageUp → ±(step × 10)
//
// Events (bubbling, detail: { slider, value }):
//   stisla:slider:input   — every value change (drag, key, click)
//   stisla:slider:change  — pointerup, or after a key step (mirrors native)
//
// Opts (defaults are null so attribute sources can fall through):
//   min   — opts → data-min → hidden input min → 0
//   max   — opts → data-max → hidden input max → 100
//   step  — opts → data-step → hidden input step → 1
//   value — opts → data-value → hidden input value → min
//
// Authoring uses data-min / data-max / data-step / data-value on the host
// for the cleanest markup. data-stisla-slider-<key> still works (e.g.
// for opts that don't map to a single attribute).
//
// CSS contract: JS writes --slider-fraction (0..1) on the host; the CSS
// in slider.css positions thumb + range from it.

import { Component } from '../core/component.js';

const STEP_MULT = 10;

export class Slider extends Component {
  static eventNamespace = 'slider';
  static defaults = {
    min: null,
    max: null,
    step: null,
    value: null,
    valueText: null,
  };

  constructor(el, opts) {
    super(el, opts);

    this._track = el.querySelector('.slider__track');
    this._range = el.querySelector('.slider__range');
    this._thumb = el.querySelector('.slider__thumb');
    this._input = el.querySelector('.slider__input');

    const pick = (key, fallback) =>
      this._num(
        this.opts[key] ??
          el.getAttribute('data-' + key) ??
          this._input?.getAttribute(key),
        fallback,
      );

    this.min = pick('min', 0);
    this.max = pick('max', 100);
    this.step = pick('step', 1);
    if (this.max < this.min) [this.min, this.max] = [this.max, this.min];

    const initial =
      this.opts.value ??
      el.getAttribute('data-value') ??
      this._input?.getAttribute('value') ??
      this.min;
    this._value = this._clamp(this._snap(this._num(initial, this.min)));

    this._disabled =
      this._input?.disabled === true ||
      el.getAttribute('data-disabled') === 'true';

    if (this._thumb) {
      this._thumb.setAttribute('role', 'slider');
      if (!this._thumb.hasAttribute('tabindex')) {
        this._thumb.setAttribute('tabindex', this._disabled ? '-1' : '0');
      }
      this._thumb.setAttribute('aria-orientation', 'horizontal');
      this._thumb.setAttribute('aria-valuemin', String(this.min));
      this._thumb.setAttribute('aria-valuemax', String(this.max));
      if (this._disabled) this._thumb.setAttribute('aria-disabled', 'true');

      // Name the thumb. role="slider" is an ARIA input field that needs an
      // accessible name, but the documented <label for="…"> targets the
      // .slider host <div> (a label can't associate to a non-labelable
      // element), so the thumb would ship nameless (axe: aria-input-field-name).
      // Mirror the host's name onto the thumb: an explicit aria-label /
      // aria-labelledby on the host wins, else the associated <label for=hostId>.
      if (
        !this._thumb.hasAttribute('aria-label') &&
        !this._thumb.hasAttribute('aria-labelledby')
      ) {
        if (el.getAttribute('aria-label')) {
          this._thumb.setAttribute('aria-label', el.getAttribute('aria-label'));
        } else {
          let labelledBy = el.getAttribute('aria-labelledby');
          if (!labelledBy && el.id) {
            const label = document.querySelector(`label[for="${el.id}"]`);
            if (label) {
              if (!label.id) label.id = `${el.id}-label`;
              labelledBy = label.id;
            }
          }
          if (labelledBy) {
            this._thumb.setAttribute('aria-labelledby', labelledBy);
          }
        }
      }
    }

    if (this._disabled) el.setAttribute('data-disabled', 'true');

    // Optional aria-valuetext template. On a value change a screen reader
    // re-reads only aria-valuenow (the bare number), not the label — so a
    // brightness slider announces "56", not "56 brightness". A template such
    // as data-value-text="{value}%" or "{value} of {max}" gives every change a
    // spoken form with context. {value}/{min}/{max} are substituted on render;
    // when unset, aria-valuenow alone is used (native slider behaviour).
    this._valueTextTemplate =
      this.opts.valueText ?? el.getAttribute('data-value-text') ?? null;

    this._activePointerId = null;
    this._dragStartValue = this._value;

    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onKeydown = this._onKeydown.bind(this);

    this.on(el, 'pointerdown', this._onPointerDown);
    if (this._thumb) this.on(this._thumb, 'keydown', this._onKeydown);

    this._render();
  }

  // === Public API ========================================================

  get value() {
    return this._value;
  }

  set value(next) {
    this._setValue(next, { emitChange: true });
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(next) {
    const v = Boolean(next);
    if (v === this._disabled) return;
    this._disabled = v;
    if (v) {
      this.el.setAttribute('data-disabled', 'true');
      this._thumb?.setAttribute('aria-disabled', 'true');
      this._thumb?.setAttribute('tabindex', '-1');
    } else {
      this.el.removeAttribute('data-disabled');
      this._thumb?.removeAttribute('aria-disabled');
      this._thumb?.setAttribute('tabindex', '0');
    }
    if (this._input) this._input.disabled = v;
  }

  setRange(min, max, step) {
    if (typeof min === 'number') this.min = min;
    if (typeof max === 'number') this.max = max;
    if (typeof step === 'number') this.step = step;
    if (this.max < this.min) [this.min, this.max] = [this.max, this.min];
    this._thumb?.setAttribute('aria-valuemin', String(this.min));
    this._thumb?.setAttribute('aria-valuemax', String(this.max));
    this._setValue(this._value, { emitChange: false });
  }

  // === Pointer handling ==================================================

  _onPointerDown(e) {
    if (this._disabled) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    this._thumb?.focus();

    this._activePointerId = e.pointerId;
    this._dragStartValue = this._value;

    // Track-down jumps; thumb-down starts a drag from the current value
    // (avoids a step-snap flicker if the click lands on the thumb's edge).
    const onThumb = this._thumb && this._thumb.contains(e.target);
    if (!onThumb) this._updateFromPointer(e);

    document.addEventListener('pointermove', this._onPointerMove);
    document.addEventListener('pointerup', this._onPointerUp);
    document.addEventListener('pointercancel', this._onPointerUp);
  }

  _onPointerMove(e) {
    if (e.pointerId !== this._activePointerId) return;
    this._updateFromPointer(e);
  }

  _onPointerUp(e) {
    if (e.pointerId !== this._activePointerId) return;
    this._activePointerId = null;
    document.removeEventListener('pointermove', this._onPointerMove);
    document.removeEventListener('pointerup', this._onPointerUp);
    document.removeEventListener('pointercancel', this._onPointerUp);
    if (this._value !== this._dragStartValue) {
      this.emit('change', { value: this._value }, { cancelable: false });
    }
  }

  _updateFromPointer(e) {
    if (!this.el) return;
    const rect = this.el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const thumbW = this._thumb?.getBoundingClientRect().width || 0;
    const gap = this._gapPx();
    // Mirror the CSS travel range: thumb center lives in
    // [thumb-w/2 + gap, width - thumb-w/2 - gap].
    const inset = thumbW / 2 + gap;
    const span = Math.max(1, rect.width - thumbW - 2 * gap);
    const isRtl = getComputedStyle(this.el).direction === 'rtl';
    const offset = isRtl
      ? rect.right - e.clientX - inset
      : e.clientX - rect.left - inset;
    const fraction = Math.min(1, Math.max(0, offset / span));
    const next = this.min + fraction * (this.max - this.min);
    this._setValue(next, { emitChange: false });
  }

  // Pixel width of --slider-thumb-gap. CSS-var lengths can be in any
  // unit (rem, em, px), so we let the browser resolve it via a hidden
  // probe element rather than parsing the string ourselves.
  _gapPx() {
    const probe = document.createElement('div');
    probe.style.cssText =
      'position:absolute;visibility:hidden;pointer-events:none;width:var(--slider-thumb-gap);height:0;';
    this.el.appendChild(probe);
    const w = probe.getBoundingClientRect().width;
    this.el.removeChild(probe);
    return w;
  }

  // === Keyboard ==========================================================

  _onKeydown(e) {
    if (this._disabled) return;
    const step = this.step || 1;
    const big = step * STEP_MULT;
    let next = this._value;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next += e.shiftKey ? big : step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next -= e.shiftKey ? big : step;
        break;
      case 'PageUp':
        next += big;
        break;
      case 'PageDown':
        next -= big;
        break;
      case 'Home':
        next = this.min;
        break;
      case 'End':
        next = this.max;
        break;
      default:
        return;
    }
    e.preventDefault();
    const before = this._value;
    this._setValue(next, { emitChange: false });
    if (this._value !== before) {
      this.emit('change', { value: this._value }, { cancelable: false });
    }
  }

  // === Internals =========================================================

  _setValue(raw, { emitChange = true } = {}) {
    const clamped = this._clamp(this._snap(this._num(raw, this._value)));
    if (clamped === this._value) return;
    this._value = clamped;
    this._render();
    this.emit('input', { value: clamped }, { cancelable: false });
    if (emitChange) {
      this.emit('change', { value: clamped }, { cancelable: false });
    }
  }

  _render() {
    if (!this.el) return;
    const span = this.max - this.min;
    const fraction = span === 0 ? 0 : (this._value - this.min) / span;
    this.el.style.setProperty('--slider-fraction', String(fraction));
    if (this._thumb) {
      this._thumb.setAttribute('aria-valuenow', this._fmt(this._value));
      if (this._valueTextTemplate) {
        this._thumb.setAttribute('aria-valuetext', this._valueText());
      }
    }
    if (this._input) this._input.value = this._fmt(this._value);
  }

  _valueText() {
    return String(this._valueTextTemplate)
      .replace(/\{value\}/g, this._fmt(this._value))
      .replace(/\{min\}/g, this._fmt(this.min))
      .replace(/\{max\}/g, this._fmt(this.max));
  }

  _snap(v) {
    const step = this.step;
    if (!step || step <= 0) return v;
    const n = Math.round((v - this.min) / step);
    const result = this.min + n * step;
    const dp = this._stepDecimals();
    if (!dp) return result;
    const factor = 10 ** dp;
    return Math.round(result * factor) / factor;
  }

  _clamp(v) {
    return Math.min(this.max, Math.max(this.min, v));
  }

  _num(v, fallback) {
    const n = typeof v === 'number' ? v : parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }

  _stepDecimals() {
    const s = String(this.step);
    const i = s.indexOf('.');
    return i < 0 ? 0 : s.length - i - 1;
  }

  _fmt(v) {
    const dp = this._stepDecimals();
    return dp ? v.toFixed(dp) : String(Math.round(v));
  }

  destroy() {
    if (this._activePointerId != null) {
      document.removeEventListener('pointermove', this._onPointerMove);
      document.removeEventListener('pointerup', this._onPointerUp);
      document.removeEventListener('pointercancel', this._onPointerUp);
      this._activePointerId = null;
    }
    super.destroy();
  }
}
