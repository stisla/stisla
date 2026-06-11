// Stisla.Collapsible — height-transition primitive for show/hide regions.
//
// The shared engine behind .accordion (Stisla.Accordion), .sidebar submenus
// (Stisla.Sidebar), .navbar__menu (Stisla.Navbar), and any consumer that
// wants the same Radix-shaped open/closed model. The CSS owns the
// display:none on the closed state; this class measures scrollHeight and
// animates inline height between 0 and that measurement around the state
// flip, so the transition runs cleanly across the display: none / block
// boundary that CSS alone can't bridge until interpolate-size ships
// universally.
//
// Anatomy:
//   <button data-stisla-collapsible-trigger="my-id"
//           aria-expanded="false" aria-controls="my-id">Toggle</button>
//   <div id="my-id" class="collapsible" data-stisla-collapsible
//        data-state="closed" role="region">…</div>
//
// Two attachment patterns:
//   - Self-mounted: the scanner finds [data-stisla-collapsible] and
//     instantiates. Triggers anywhere on the page point at the host via
//     data-stisla-collapsible-trigger="<host-id>".
//   - Composed-internal: a parent class (Accordion, Sidebar, Navbar)
//     constructs Collapsible imperatively over its own children and
//     passes the trigger in via opts.triggers. The host element doesn't
//     need data-stisla-collapsible in that case.
//
// Options:
//   stateEl — where data-state="open|closed" flips. Defaults to el.
//             Accordion / Sidebar pass the parent .accordion__item /
//             .sidebar__item so the existing CSS paint hook works.
//   triggers — explicit trigger element list. Defaults to scanning the
//              document for [data-stisla-collapsible-trigger="<el.id>"].
//   open — initial state if data-state isn't already set.
//   duration — transition duration override in ms. Null reads
//              --collapsible-transition-duration on stateEl (CSS computed
//              style) and falls back to 200ms.
//
// Events (bubbling, detail: { collapsible: this }):
//   stisla:collapsible:opening  — before flip (cancelable; preventDefault aborts)
//   stisla:collapsible:opened   — after transitionend
//   stisla:collapsible:closing  — before flip (cancelable)
//   stisla:collapsible:closed   — after transitionend

import { Component } from '../core/component.js';

const REDUCED_MOTION = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export class Collapsible extends Component {
  static eventNamespace = 'collapsible';
  static defaults = {
    stateEl: null,
    triggers: null,
    open: false,
    duration: null,
  };

  constructor(el, opts) {
    super(el, opts);

    this._stateEl = this.opts.stateEl ?? el;
    this._triggers = this._resolveTriggers();
    this._transitioning = null; // 'open' | 'close' | null

    // Initial state — explicit opt > existing data-state > default false.
    const existing = this._stateEl.dataset.state;
    let initial;
    if (existing === 'open' || existing === 'closed') {
      initial = existing === 'open';
    } else {
      initial = Boolean(this.opts.open);
    }
    this._stateEl.dataset.state = initial ? 'open' : 'closed';
    this._syncTriggers(initial);

    this._onTriggerClick = this._onTriggerClick.bind(this);
    for (const trigger of this._triggers) {
      this.on(trigger, 'click', this._onTriggerClick);
    }
  }

  isOpen() {
    return this._stateEl?.dataset.state === 'open';
  }

  getTriggers() {
    return [...this._triggers];
  }

  async open() {
    if (!this.el || this.isOpen() || this._transitioning === 'open') return this;
    const ok = this.emit('opening');
    if (!ok) return this;

    this._cancelTransition();
    this._transitioning = 'open';

    this._stateEl.dataset.state = 'open';
    this._syncTriggers(true);

    if (REDUCED_MOTION()) {
      this._transitioning = null;
      this.emit('opened', {}, { cancelable: false });
      return this;
    }

    // The CSS just removed display:none — measure the now-natural height,
    // snap to 0, transition to the measured height, then clear inline
    // styles so the element returns to flowing naturally.
    const target = this._measureHeight();
    this._setInline({ height: '0px', overflow: 'hidden', transition: 'none' });
    // Force a reflow so the height:0 starting state lands before the
    // transition kicks in.
    void this.el.offsetHeight;
    requestAnimationFrame(() => {
      if (this._transitioning !== 'open' || !this.el) return;
      this._setInline({
        transition: `height ${this._duration()}ms ease`,
        height: `${target}px`,
      });
      this._awaitTransition(() => {
        if (!this.el) return;
        this._clearInline();
        this._transitioning = null;
        this.emit('opened', {}, { cancelable: false });
      });
    });
    return this;
  }

  async close() {
    if (!this.el || !this.isOpen() || this._transitioning === 'close') return this;
    const ok = this.emit('closing');
    if (!ok) return this;

    this._cancelTransition();
    this._transitioning = 'close';

    if (REDUCED_MOTION()) {
      this._stateEl.dataset.state = 'closed';
      this._syncTriggers(false);
      this._transitioning = null;
      this.emit('closed', {}, { cancelable: false });
      return this;
    }

    // The element is currently display:block at natural height. Pin the
    // measured value, force a reflow, then transition to 0. After the
    // animation completes, flip data-state — CSS re-applies display: none
    // and we clear our inline styles.
    const start = this._measureHeight();
    this._setInline({
      height: `${start}px`,
      overflow: 'hidden',
      transition: 'none',
    });
    void this.el.offsetHeight;
    requestAnimationFrame(() => {
      if (this._transitioning !== 'close' || !this.el) return;
      this._setInline({
        transition: `height ${this._duration()}ms ease`,
        height: '0px',
      });
      this._awaitTransition(() => {
        if (!this.el) return;
        this._clearInline();
        this._stateEl.dataset.state = 'closed';
        this._syncTriggers(false);
        this._transitioning = null;
        this.emit('closed', {}, { cancelable: false });
      });
    });
    return this;
  }

  toggle() {
    return this.isOpen() ? this.close() : this.open();
  }

  destroy() {
    this._cancelTransition();
    super.destroy();
    this._stateEl = null;
    this._triggers = [];
  }

  // === internals =========================================================

  _onTriggerClick(e) {
    const trigger = e.currentTarget;
    if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') {
      e.preventDefault();
      return;
    }
    this.toggle();
  }

  _resolveTriggers() {
    if (Array.isArray(this.opts.triggers)) {
      return this.opts.triggers.filter(Boolean);
    }
    if (!this.el.id) return [];
    const selector = `[data-stisla-collapsible-trigger="${this.el.id}"]`;
    return [...document.querySelectorAll(selector)];
  }

  _syncTriggers(open) {
    for (const trigger of this._triggers) {
      trigger.setAttribute('aria-expanded', String(open));
    }
  }

  _measureHeight() {
    // scrollHeight gives the full content height including padding, which
    // is what `height: auto` would resolve to. Border-box on the element
    // is fine — scrollHeight already accounts for it.
    return this.el.scrollHeight;
  }

  _setInline(styles) {
    for (const [key, value] of Object.entries(styles)) {
      this.el.style[key] = value;
    }
  }

  _clearInline() {
    this.el.style.height = '';
    this.el.style.overflow = '';
    this.el.style.transition = '';
  }

  _duration() {
    if (typeof this.opts.duration === 'number') return this.opts.duration;
    // Read the consumer's CSS knob if it set one. Falls back to 200ms.
    const computed = getComputedStyle(this._stateEl).getPropertyValue(
      '--collapsible-transition-duration',
    );
    if (computed) {
      const parsed = parseFloat(computed);
      if (!Number.isNaN(parsed)) {
        return computed.trim().endsWith('ms') ? parsed : parsed * 1000;
      }
    }
    return 200;
  }

  _awaitTransition(done) {
    const el = this.el;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      el.removeEventListener('transitionend', onEnd);
      clearTimeout(fallback);
      done();
    };
    const onEnd = (e) => {
      if (e.target !== el || e.propertyName !== 'height') return;
      finish();
    };
    el.addEventListener('transitionend', onEnd);
    // Safety net: if the transition never fires (display: none mid-flight,
    // browser quirk, fractional pixel rounding), wake up after duration ×
    // 1.5 + 50 ms so we don't strand the instance in a transitioning state.
    const fallback = setTimeout(finish, this._duration() * 1.5 + 50);
    this._pendingTransition = finish;
  }

  _cancelTransition() {
    if (this._pendingTransition) {
      this._pendingTransition();
      this._pendingTransition = null;
    }
    this._transitioning = null;
  }
}

// Module-level delegated handler for self-mounted triggers
// ([data-stisla-collapsible-trigger="<id>"] outside of a parent class's
// owned subtree). One handler per page, sentinel-guarded against HMR.
if (typeof document !== 'undefined' && !window.__stislaCollapsibleBound) {
  window.__stislaCollapsibleBound = true;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-stisla-collapsible-trigger]');
    if (!trigger) return;
    const id = trigger.dataset.stislaCollapsibleTrigger;
    if (!id) return;
    const el = document.getElementById(id);
    if (!el || !el.hasAttribute('data-stisla-collapsible')) return;
    if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') {
      e.preventDefault();
      return;
    }
    Collapsible.getOrCreate(el).toggle();
  });
}
