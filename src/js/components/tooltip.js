// Stisla.Tooltip — V3.md §3.7. Second Floating UI consumer (dropdown shipped
// the dep in 4.3); no new packages.
//
// Anatomy:
//   <button data-stisla-tooltip data-stisla-tooltip-title="hint">…</button>
//
//   (created by JS, appended to <body>)
//   <div class="tooltip" role="tooltip" id="stisla-tooltip-N"
//        data-state="open|closed" data-placement="top|right|...">
//     <div class="tooltip__arrow"></div>
//     <div class="tooltip__inner">hint</div>
//   </div>
//
// Events (bubbling on the trigger, detail: { tooltip: this }):
//   stisla:tooltip:opening — cancelable, before show
//   stisla:tooltip:opened  — after open + position
//   stisla:tooltip:closing — cancelable, before hide
//   stisla:tooltip:closed  — after hide
//
// Opts:
//   placement: 'top'              FUI placement (top/right/bottom/left + -start/-end)
//   offset: 8                     gap from trigger
//   delay: 600                    open delay (ms); prevents flash on incidental hover
//   closeDelay: 0                 close delay (ms); non-interactive so 0 is fine
//   trigger: 'hover focus'        space-separated: 'hover' | 'focus' | 'manual'
//   html: false                   render title as innerHTML (sparingly — popover for more)
//   title: null                   explicit content; otherwise read from attrs / [title]
//
// Title resolution (in order):
//   1. opts.title (imperative)
//   2. data-stisla-tooltip-title attr
//   3. [title] attr — migrated and stripped so native tooltip doesn't flash.
//      Restored on destroy().

import { computePosition, autoUpdate, offset, flip, shift, arrow } from '@floating-ui/dom';
import { Component } from '../core/component.js';

const OPEN = 'open';
const CLOSED = 'closed';

let idCounter = 0;

export class Tooltip extends Component {
  static eventNamespace = 'tooltip';
  static defaults = {
    placement: 'top',
    offset: 8,
    delay: 600,
    closeDelay: 0,
    trigger: 'hover focus',
    html: false,
    title: null,
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
    this.opts.html = this.opts.html === true || this.opts.html === 'true';

    this._trigger = el;

    // Resolve title. data-stisla-tooltip-title wins over native [title]; an
    // imperative opts.title overrides both.
    this._title =
      this.opts.title ??
      el.getAttribute('data-stisla-tooltip-title') ??
      el.getAttribute('title') ??
      '';

    // Strip native [title] so the browser tooltip doesn't double-fire next to
    // ours. Save the original for destroy().
    this._originalTitle = null;
    if (el.hasAttribute('title')) {
      this._originalTitle = el.getAttribute('title');
      el.removeAttribute('title');
    }

    // Build tooltip DOM up front. Appended to <body> on first show; stays
    // there until destroy() removes it.
    this._tooltipEl = document.createElement('div');
    this._tooltipEl.className = 'tooltip';
    this._tooltipEl.id = `stisla-tooltip-${++idCounter}`;
    this._tooltipEl.setAttribute('role', 'tooltip');
    this._tooltipEl.dataset.state = CLOSED;
    // Seed [data-placement] from opts so the resting transform direction
    // tracks the requested side before the first position pass runs.
    this._tooltipEl.dataset.placement = this.opts.placement;

    this._arrowEl = document.createElement('div');
    this._arrowEl.className = 'tooltip__arrow';
    this._tooltipEl.appendChild(this._arrowEl);

    this._innerEl = document.createElement('div');
    this._innerEl.className = 'tooltip__inner';
    this._writeContent();
    this._tooltipEl.appendChild(this._innerEl);

    this._cleanupAutoUpdate = null;
    this._openTimer = 0;
    this._closeTimer = 0;
    this._mounted = false;

    // Wire trigger listeners per opts.trigger. 'manual' wires nothing; the
    // consumer drives show()/hide() directly.
    const triggers = String(this.opts.trigger).split(/\s+/).filter(Boolean);
    if (triggers.includes('hover')) {
      this.on(el, 'mouseenter', () => this._scheduleShow());
      this.on(el, 'mouseleave', () => this._scheduleHide());
    }
    if (triggers.includes('focus')) {
      this.on(el, 'focusin', () => this._scheduleShow());
      this.on(el, 'focusout', () => this._scheduleHide());
    }
  }

  show() {
    if (!this.el || !this._tooltipEl) return;
    if (this._tooltipEl.dataset.state === OPEN) return;
    if (!this._title) return; // nothing to show — bail silently
    if (!this.emit('opening')) return;

    if (!this._mounted) {
      document.body.appendChild(this._tooltipEl);
      this._mounted = true;
    }

    // Force display: block before position so getBoundingClientRect runs
    // against a measurable element. Without this Floating UI reads 0×0 and
    // hands back top/left = NaN (same trap as dropdown).
    this._tooltipEl.style.display = 'block';
    void this._tooltipEl.offsetWidth;

    this._cleanupAutoUpdate = autoUpdate(this._trigger, this._tooltipEl, () =>
      this._position(),
    );

    // aria-describedby set on open, cleared on close. Avoids verbose SR
    // announcements when the tooltip isn't visible; matches BS5 / Radix.
    this._trigger.setAttribute('aria-describedby', this._tooltipEl.id);

    requestAnimationFrame(() => {
      if (!this.el || !this._tooltipEl) return;
      this._tooltipEl.dataset.state = OPEN;
      this._waitForTransition(this._tooltipEl).then(() => {
        if (!this.el) return;
        this.emit('opened', {}, { cancelable: false });
      });
    });
  }

  hide() {
    if (!this.el || !this._tooltipEl) return;
    if (this._tooltipEl.dataset.state !== OPEN) return;
    if (!this.emit('closing')) return;

    this._tooltipEl.dataset.state = CLOSED;
    this._trigger.removeAttribute('aria-describedby');

    this._waitForTransition(this._tooltipEl).then(() => {
      if (!this.el || !this._tooltipEl) return;
      this._tooltipEl.style.display = '';
      if (this._cleanupAutoUpdate) {
        this._cleanupAutoUpdate();
        this._cleanupAutoUpdate = null;
      }
      this.emit('closed', {}, { cancelable: false });
    });
  }

  toggle() {
    if (!this.el || !this._tooltipEl) return;
    this._tooltipEl.dataset.state === OPEN ? this.hide() : this.show();
  }

  setContent(title) {
    this._title = title ?? '';
    if (this._innerEl) this._writeContent();
  }

  destroy() {
    clearTimeout(this._openTimer);
    clearTimeout(this._closeTimer);
    this._openTimer = 0;
    this._closeTimer = 0;
    if (this._cleanupAutoUpdate) {
      this._cleanupAutoUpdate();
      this._cleanupAutoUpdate = null;
    }
    if (this._trigger) {
      this._trigger.removeAttribute('aria-describedby');
      if (this._originalTitle !== null) {
        this._trigger.setAttribute('title', this._originalTitle);
      }
    }
    if (this._tooltipEl?.parentNode) {
      this._tooltipEl.parentNode.removeChild(this._tooltipEl);
    }
    this._tooltipEl = null;
    this._arrowEl = null;
    this._innerEl = null;
    super.destroy();
  }

  // === Internal ============================================================

  _writeContent() {
    if (this.opts.html) {
      this._innerEl.innerHTML = this._title;
    } else {
      this._innerEl.textContent = this._title;
    }
  }

  _scheduleShow() {
    clearTimeout(this._closeTimer);
    this._closeTimer = 0;
    if (this._tooltipEl?.dataset.state === OPEN) return;
    if (this._openTimer) return;
    this._openTimer = setTimeout(() => {
      this._openTimer = 0;
      this.show();
    }, this.opts.delay);
  }

  _scheduleHide() {
    clearTimeout(this._openTimer);
    this._openTimer = 0;
    if (this._tooltipEl?.dataset.state !== OPEN) return;
    if (this._closeTimer) return;
    this._closeTimer = setTimeout(() => {
      this._closeTimer = 0;
      this.hide();
    }, this.opts.closeDelay);
  }

  async _position() {
    if (!this._trigger || !this._tooltipEl) return;
    const { x, y, placement, middlewareData } = await computePosition(
      this._trigger,
      this._tooltipEl,
      {
        // 'fixed' so any ancestor with overflow: hidden can't crop the
        // tooltip. CSS matches with position: fixed.
        strategy: 'fixed',
        placement: this.opts.placement,
        middleware: [
          offset(this.opts.offset),
          flip({ padding: 8 }),
          shift({ padding: 8 }),
          arrow({ element: this._arrowEl, padding: 4 }),
        ],
      },
    );

    Object.assign(this._tooltipEl.style, {
      left: `${Math.round(x)}px`,
      top: `${Math.round(y)}px`,
    });
    this._tooltipEl.dataset.placement = placement;

    // Position the arrow along the cross-axis. arrow() returns x for
    // top/bottom placements and y for left/right (FUI's standard shape).
    if (middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow;
      Object.assign(this._arrowEl.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
      });
    }
  }

  _waitForTransition(el) {
    return new Promise((resolve) => {
      if (!el) return resolve();
      const reduced =
        typeof matchMedia === 'function' &&
        matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        requestAnimationFrame(() => resolve());
        return;
      }
      const cs = getComputedStyle(el);
      const durations = cs.transitionDuration
        .split(',')
        .map((s) => parseFloat(s) || 0);
      const total = durations.length ? Math.max(...durations) : 0;
      if (total === 0) {
        requestAnimationFrame(() => resolve());
        return;
      }
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        el.removeEventListener('transitionend', onEnd);
        clearTimeout(fallback);
        resolve();
      };
      const onEnd = (e) => {
        if (e.target === el) finish();
      };
      el.addEventListener('transitionend', onEnd);
      const fallback = setTimeout(finish, total * 1000 * 1.5 + 50);
    });
  }
}

// No module-level delegated handler — tooltip listeners are wired per-instance
// on the trigger (mouseenter/mouseleave/focusin/focusout). HMR is safe because
// the Component base re-init path destroys the old instance (which detaches
// its recorded listeners) before the new one binds.
