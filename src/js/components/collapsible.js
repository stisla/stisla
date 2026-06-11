// Stisla.Collapsible — height-transition primitive for show/hide regions.
//
// The shared engine behind .accordion (Stisla.Accordion), .sidebar submenus
// (Stisla.Sidebar), .navbar__menu (Stisla.Navbar), and any consumer that
// wants the same Radix-shaped open/closed model.
//
// Animation pattern follows Bootstrap's .collapsing class: the CSS owns
// the transition (via .is-collapsible-content on the animated element);
// JS toggles the class around a reflow-bracketed height change. Putting
// the transition spec in CSS — instead of writing inline transition
// values from JS — sidesteps the foot-gun where same-task transition +
// property changes can fall through to the previous (none) transition
// computation in some browsers.
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
//   duration — transition duration override in ms. When set, mirrors the
//              value to inline --collapsible-duration so CSS and JS use
//              the same number. Null reads --collapsible-duration from
//              the element's computed style and falls back to 200ms.
//
// Events (bubbling, detail: { collapsible: this }):
//   stisla:collapsible:opening  — before flip (cancelable; preventDefault aborts)
//   stisla:collapsible:opened   — after transitionend
//   stisla:collapsible:closing  — before flip (cancelable)
//   stisla:collapsible:closed   — after transitionend

import { Component } from '../core/component.js';

const COLLAPSING_CLASS = 'is-collapsing';

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

    // Mirror opts.duration to an inline CSS var so the CSS transition
    // and the JS fallback timeout agree on the value.
    if (typeof this.opts.duration === 'number') {
      this.el.style.setProperty(
        '--collapsible-duration',
        `${this.opts.duration}ms`,
      );
    }

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

    // Flip the state hook so CSS removes display:none and the body has
    // a measurable natural height for scrollHeight.
    this._stateEl.dataset.state = 'open';
    this._syncTriggers(true);

    if (REDUCED_MOTION()) {
      this._transitioning = null;
      this.emit('opened', {}, { cancelable: false });
      return this;
    }

    // 1. Pin inline height to 0 as the transition start. Add the
    //    .is-collapsing class so the CSS transition rule applies.
    // 2. Read scrollHeight — accessing it forces layout, committing
    //    the 0 start state to the CSSOM.
    // 3. Set inline height to the measured target. The class's
    //    transition rule is in effect; the browser interpolates.
    this.el.style.height = '0px';
    this.el.classList.add(COLLAPSING_CLASS);
    const target = this._measureHeight();
    this.el.style.height = `${target}px`;

    this._awaitTransition(this._duration(), () => {
      if (!this.el) return;
      this.el.classList.remove(COLLAPSING_CLASS);
      this.el.style.height = '';
      this._transitioning = null;
      this.emit('opened', {}, { cancelable: false });
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

    // 1. Pin the current natural height as the inline starting value
    //    so the next change has a fixed start to interpolate FROM.
    // 2. Add .is-collapsing so the CSS transition rule applies.
    // 3. Read scrollHeight to force the layout commit.
    // 4. Change inline height to 0 — the transition runs.
    const start = this._measureHeight();
    this.el.style.height = `${start}px`;
    this.el.classList.add(COLLAPSING_CLASS);
    void this.el.offsetHeight;
    this.el.style.height = '0px';

    this._awaitTransition(this._duration(), () => {
      if (!this.el) return;
      this.el.classList.remove(COLLAPSING_CLASS);
      this.el.style.height = '';
      this._stateEl.dataset.state = 'closed';
      this._syncTriggers(false);
      this._transitioning = null;
      this.emit('closed', {}, { cancelable: false });
    });
    return this;
  }

  toggle() {
    return this.isOpen() ? this.close() : this.open();
  }

  destroy() {
    this._cancelTransition();
    if (this.el) {
      this.el.classList.remove(COLLAPSING_CLASS);
      this.el.style.height = '';
      this.el.style.removeProperty('--collapsible-duration');
    }
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
    // scrollHeight gives the full content height including padding,
    // which is what `height: auto` would resolve to. Reading it forces
    // layout, which doubles as the reflow that commits the inline
    // start-state height to the CSSOM before the next change.
    return this.el.scrollHeight;
  }

  _duration() {
    if (typeof this.opts.duration === 'number') return this.opts.duration;
    const computed = getComputedStyle(this.el).getPropertyValue(
      '--collapsible-duration',
    );
    if (computed) {
      const parsed = parseFloat(computed);
      if (!Number.isNaN(parsed)) {
        return computed.trim().endsWith('ms') ? parsed : parsed * 1000;
      }
    }
    return 200;
  }

  _awaitTransition(duration, done) {
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
    // Safety net: if transitionend never fires (interrupted by display:
    // none mid-flight, browser quirk, fractional pixel rounding), wake
    // up after duration × 1.5 + 50 ms so we don't strand the instance.
    const fallback = setTimeout(finish, duration * 1.5 + 50);
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
