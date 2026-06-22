// Stisla.Popover — V3.md §3.7. Third Floating UI consumer (dropdown 4.3 shipped
// the dep, tooltip 4.4 reused it); no new packages.
//
// Anatomy:
//   <button data-stisla-popover-trigger="my-popover" aria-haspopup="dialog"
//           aria-expanded="false" aria-controls="my-popover">…</button>
//
//   <div class="popover" id="my-popover" data-stisla-popover
//        role="dialog" data-state="closed"
//        data-placement="top" aria-labelledby="my-popover-title">
//     <div class="popover__arrow"></div>
//     <h3 class="popover__title" id="my-popover-title">…</h3>
//     <div class="popover__body">…</div>
//     <button class="popover__close" data-stisla-popover-dismiss>…</button>
//   </div>
//
// Events (bubbling on the popover surface, detail: { popover: this }):
//   stisla:popover:opening — cancelable, before show
//   stisla:popover:opened  — after open + position
//   stisla:popover:closing — cancelable, before hide
//   stisla:popover:closed  — after hide
//
// Opts (defaults below):
//   placement: 'top'             FUI placement (top/right/bottom/left + -start/-end)
//   offset: 8                    gap from trigger
//   autoClose: 'outside'         'outside' | 'inside' | 'both' | false
//   focus: true                  trap focus inside popover on open (click trigger only)
//   returnFocus: true            move focus back to the trigger on close
//   triggerMode: 'click'             'click' | 'hover focus' | 'manual'
//   delay: 0                     open delay (ms) — hover trigger only
//   closeDelay: 100              close delay (ms) — hover trigger only; bridges cursor → surface
//
// Markup-first: popover content lives in the DOM as real children (titles,
// links, buttons, forms). The imperative path can rewrite content via
// setContent({ title, body }) — see the demo's "Imperative" section.

import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
} from '@floating-ui/dom';
import { createFocusTrap } from 'focus-trap';
import { Component, getInstance } from '../core/component.js';
import { readOpts } from '../core/init.js';
import { waitForTransition } from '../core/transition.js';

const OPEN = 'open';
const CLOSED = 'closed';

export class Popover extends Component {
  static eventNamespace = 'popover';
  static defaults = {
    placement: 'top',
    offset: 8,
    autoClose: 'outside',
    focus: true,
    returnFocus: true,
    triggerMode: 'click',
    delay: 0,
    closeDelay: 100,
  };

  constructor(el, opts) {
    super(el, opts);

    // Normalize: attribute parser may hand us numeric strings.
    for (const key of ['offset', 'delay', 'closeDelay']) {
      if (typeof this.opts[key] === 'string') {
        const n = Number(this.opts[key]);
        if (!Number.isNaN(n)) this.opts[key] = n;
      }
    }
    if (this.opts.focus === 'false') this.opts.focus = false;
    if (this.opts.returnFocus === 'false') this.opts.returnFocus = false;
    if (this.opts.autoClose === 'false') this.opts.autoClose = false;

    this._surface = el;

    if (!el.id) {
      console.warn(
        '[stisla] .popover needs an id so its trigger can target it',
        el,
      );
    }
    this._trigger = el.id
      ? document.querySelector(`[data-stisla-popover-trigger="${el.id}"]`)
      : null;

    // Resolve / build the arrow element. Authored markup wins; otherwise the
    // class injects one so FUI's arrow() middleware has a target. Either way
    // the constructor leaves the popover ready for first open().
    this._arrowEl = el.querySelector('.popover__arrow');
    if (!this._arrowEl) {
      this._arrowEl = document.createElement('div');
      this._arrowEl.className = 'popover__arrow';
      el.insertBefore(this._arrowEl, el.firstChild);
    }

    if (!el.dataset.state) el.dataset.state = CLOSED;
    if (!el.hasAttribute('role')) el.setAttribute('role', 'dialog');
    if (this._trigger && !this._trigger.hasAttribute('aria-expanded')) {
      this._trigger.setAttribute('aria-expanded', 'false');
    }
    // Seed [data-placement] from opts so the resting transform direction
    // tracks the requested side before the first position pass runs.
    if (!el.dataset.placement) el.dataset.placement = this.opts.placement;

    this._cleanupAutoUpdate = null;
    this._trap = null;
    this._returnFocusEl = null;
    this._originalParent = null;
    this._originalNextSibling = null;
    this._openTimer = 0;
    this._closeTimer = 0;

    this._onDocKeydown = this._onDocKeydown.bind(this);

    // Hover/focus trigger wiring. Mouseenter/leave on BOTH trigger and surface
    // so cursor can bridge into the popover without dismissing.
    const triggers = String(this.opts.triggerMode).split(/\s+/).filter(Boolean);
    this._hoverMode = triggers.includes('hover') || triggers.includes('focus');
    if (this._trigger && triggers.includes('hover')) {
      this.on(this._trigger, 'mouseenter', () => this._scheduleShow());
      this.on(this._trigger, 'mouseleave', () => this._scheduleHide());
      this.on(this._surface, 'mouseenter', () => this._cancelHide());
      this.on(this._surface, 'mouseleave', () => this._scheduleHide());
    }
    if (this._trigger && triggers.includes('focus')) {
      this.on(this._trigger, 'focusin', () => this._scheduleShow());
      this.on(this._trigger, 'focusout', () => this._scheduleHide());
    }
  }

  open() {
    if (!this.el) return;
    if (this.el.dataset.state === OPEN) return;
    if (!this._trigger) return;
    if (!this.emit('opening')) return;

    clearTimeout(this._closeTimer);
    this._closeTimer = 0;

    this._returnFocusEl = document.activeElement;

    // Portal to <body> so the offset parent is the document root. This makes
    // position: absolute scroll with the page alongside the trigger (same
    // containing block) and prevents ancestor overflow: hidden from cropping
    // the popover. Original DOM position is restored on close so the
    // markup-first authoring is preserved.
    if (this.el.parentNode !== document.body) {
      this._originalParent = this.el.parentNode;
      this._originalNextSibling = this.el.nextSibling;
      document.body.appendChild(this.el);
    }

    // Force display: block before position so getBoundingClientRect runs
    // against a measurable element. Without this FUI reads 0×0 and hands back
    // top/left = NaN (same trap as dropdown + tooltip).
    this.el.style.display = 'block';
    void this.el.offsetWidth;

    this._cleanupAutoUpdate = autoUpdate(this._trigger, this.el, () =>
      this._position(),
    );

    requestAnimationFrame(() => {
      if (!this.el) return;
      this.el.dataset.state = OPEN;
      if (this._trigger) this._trigger.setAttribute('aria-expanded', 'true');

      // Focus trap only for click/manual triggers. Hover-trigger popovers
      // stay read-only — moving the trap would yank focus from the trigger,
      // which breaks the hover-to-read flow.
      if (this.opts.focus && !this._hoverMode) {
        try {
          this._trap = createFocusTrap(this.el, {
            initialFocus: () =>
              this.el.querySelector('[autofocus]') ||
              this._firstTabbable() ||
              this.el,
            escapeDeactivates: false,
            returnFocusOnDeactivate: false,
            allowOutsideClick: true,
            clickOutsideDeactivates: false,
            fallbackFocus: this.el,
          });
          // Surface must be focusable for fallbackFocus.
          if (!this.el.hasAttribute('tabindex')) {
            this.el.setAttribute('tabindex', '-1');
          }
          this._trap.activate();
        } catch (e) {
          this.el.focus?.({ preventScroll: true });
        }
      }

      document.addEventListener('keydown', this._onDocKeydown, true);

      waitForTransition(this.el).then(() => {
        if (!this.el) return;
        this.emit('opened', {}, { cancelable: false });
      });
    });
  }

  close({ returnFocus } = {}) {
    if (!this.el) return;
    if (this.el.dataset.state !== OPEN) return;
    if (!this.emit('closing')) return;

    const shouldReturnFocus =
      returnFocus !== undefined ? returnFocus : this.opts.returnFocus;

    clearTimeout(this._openTimer);
    this._openTimer = 0;

    if (this._cleanupAutoUpdate) {
      this._cleanupAutoUpdate();
      this._cleanupAutoUpdate = null;
    }
    if (this._trap) {
      try {
        this._trap.deactivate();
      } catch (e) {
        /* noop */
      }
      this._trap = null;
    }
    document.removeEventListener('keydown', this._onDocKeydown, true);

    this.el.dataset.state = CLOSED;
    if (this._trigger) this._trigger.setAttribute('aria-expanded', 'false');

    waitForTransition(this.el).then(() => {
      if (!this.el) return;
      this.el.style.display = '';
      // Restore original DOM position so the markup author's tree is intact
      // for re-open. The next open() re-portals.
      if (this._originalParent) {
        this._originalParent.insertBefore(this.el, this._originalNextSibling);
        this._originalParent = null;
        this._originalNextSibling = null;
      }
      if (
        shouldReturnFocus &&
        this._returnFocusEl &&
        typeof this._returnFocusEl.focus === 'function'
      ) {
        this._returnFocusEl.focus({ preventScroll: true });
      }
      this._returnFocusEl = null;
      this.emit('closed', {}, { cancelable: false });
    });
  }

  toggle() {
    if (!this.el) return;
    this.el.dataset.state === OPEN ? this.close() : this.open();
  }

  // Imperative content swap. Creates the part if it doesn't yet exist; removes
  // it if value is null. Leaves the close chip and arrow alone.
  setContent({ title, body } = {}) {
    if (!this.el) return;
    if (title !== undefined) this._writePart('popover__title', title, 'h3');
    if (body !== undefined) this._writePart('popover__body', body, 'div');
  }

  destroy() {
    clearTimeout(this._openTimer);
    clearTimeout(this._closeTimer);
    this._openTimer = 0;
    this._closeTimer = 0;
    if (this.el?.dataset.state === OPEN) {
      if (this._cleanupAutoUpdate) {
        this._cleanupAutoUpdate();
        this._cleanupAutoUpdate = null;
      }
      if (this._trap) {
        try {
          this._trap.deactivate();
        } catch (e) {
          /* noop */
        }
        this._trap = null;
      }
      document.removeEventListener('keydown', this._onDocKeydown, true);
      // If destroy() lands mid-open, restore DOM position so the consumer's
      // tree isn't left with a portaled-away popover.
      if (this._originalParent && this.el?.parentNode === document.body) {
        this._originalParent.insertBefore(this.el, this._originalNextSibling);
      }
      this._originalParent = null;
      this._originalNextSibling = null;
    }
    super.destroy();
  }

  // === Internal ============================================================

  _writePart(className, value, tag) {
    let part = this._surface.querySelector(`.${className}`);
    if (value === null || value === '') {
      if (part) part.remove();
      return;
    }
    if (!part) {
      part = document.createElement(tag);
      part.className = className;
      // Insert after title if present, otherwise after arrow; close chip stays
      // anchored to the end via its absolute positioning.
      const anchor =
        className === 'popover__body'
          ? this._surface.querySelector('.popover__title') || this._arrowEl
          : this._arrowEl;
      anchor.after(part);
    }
    part.textContent = value;
  }

  _scheduleShow() {
    clearTimeout(this._closeTimer);
    this._closeTimer = 0;
    if (this.el?.dataset.state === OPEN) return;
    if (this._openTimer) return;
    this._openTimer = setTimeout(() => {
      this._openTimer = 0;
      this.open();
    }, this.opts.delay);
  }

  _scheduleHide() {
    clearTimeout(this._openTimer);
    this._openTimer = 0;
    if (this.el?.dataset.state !== OPEN) return;
    if (this._closeTimer) return;
    this._closeTimer = setTimeout(() => {
      this._closeTimer = 0;
      this.close();
    }, this.opts.closeDelay);
  }

  _cancelHide() {
    clearTimeout(this._closeTimer);
    this._closeTimer = 0;
  }

  async _position() {
    if (!this._trigger || !this.el) return;
    const { x, y, placement, middlewareData } = await computePosition(
      this._trigger,
      this.el,
      {
        // 'absolute' strategy with the popover portaled to <body>: the
        // offset parent is the document, so x/y are document coordinates.
        // The popover and trigger share that coordinate system, which means
        // scrolling moves them together — no per-frame reposition lag.
        strategy: 'absolute',
        placement: this.opts.placement,
        middleware: [
          offset(this.opts.offset),
          flip({ padding: 8 }),
          shift({ padding: 8 }),
          arrow({ element: this._arrowEl, padding: 8 }),
        ],
      },
    );

    Object.assign(this.el.style, {
      left: `${Math.round(x)}px`,
      top: `${Math.round(y)}px`,
    });
    this.el.dataset.placement = placement;

    if (middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow;
      Object.assign(this._arrowEl.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
      });
    }
  }

  _firstTabbable() {
    return this.el?.querySelector(
      'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
  }

  _onDocKeydown(e) {
    if (!this.el || this.el.dataset.state !== OPEN) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.close();
    }
  }

}

// Global delegated click handler — bound once per page load.
// Sentinel mirrors the HMR-safe pattern from dialog / drawer / dropdown.
if (
  typeof document !== 'undefined' &&
  typeof window !== 'undefined' &&
  !window.__stislaPopoverBound
) {
  window.__stislaPopoverBound = true;

  document.addEventListener('click', (e) => {
    // Trigger click → toggle the matched popover. Per-attr opts re-read on
    // every toggle so HMR / DOM swaps don't strand stale defaults.
    const opener = e.target.closest('[data-stisla-popover-trigger]');
    if (opener) {
      const id = opener.getAttribute('data-stisla-popover-trigger');
      const surface = id && document.getElementById(id);
      if (surface && surface.classList.contains('popover')) {
        e.preventDefault();
        const opts = readOpts(surface, 'popover', Popover);
        const existing = getInstance(surface);
        const inst = existing ?? new Popover(surface, opts);
        if (existing) Object.assign(existing.opts, opts);
        // Skip click toggling for hover/focus triggers — clicking should not
        // fight the hover state. Manual triggers ignore click delegation too.
        const triggers = String(inst.opts.triggerMode).split(/\s+/).filter(Boolean);
        if (triggers.includes('click')) inst.toggle();
      }
      return;
    }

    // Dismiss button inside a popover → close the nearest open popover.
    const dismiss = e.target.closest('[data-stisla-popover-dismiss]');
    if (dismiss) {
      const surface = dismiss.closest('.popover');
      const inst = surface && getInstance(surface);
      if (inst) inst.close();
      return;
    }

    // Auto-close pass for every open popover. Hover/focus triggers skip this
    // path — they close on mouseleave/blur, not on outside click.
    for (const surface of document.querySelectorAll('.popover[data-state="open"]')) {
      const inst = getInstance(surface);
      if (!inst || inst.opts.autoClose === false) continue;
      const triggers = String(inst.opts.triggerMode).split(/\s+/).filter(Boolean);
      if (triggers.includes('hover') || triggers.includes('focus')) continue;
      const insideSurface = surface.contains(e.target);
      if (inst.opts.autoClose === 'inside' && !insideSurface) continue;
      if (inst.opts.autoClose === 'outside' && insideSurface) continue;
      inst.close({ returnFocus: false });
    }
  });
}
