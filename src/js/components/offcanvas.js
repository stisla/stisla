// Stisla.Offcanvas — V3.md §3.7 reference implementation.
//
// Anatomy:
//   .offcanvas[data-stisla-offcanvas][data-state="open|closed"]
//     .offcanvas__backdrop[data-stisla-offcanvas-dismiss]
//     .offcanvas__content
//       .offcanvas__header
//         .offcanvas__title
//         .offcanvas__close[data-stisla-offcanvas-dismiss]
//       .offcanvas__body
//       .offcanvas__footer
//
// Events (bubbling, detail: { offcanvas: this }):
//   stisla:offcanvas:opening   — before open  (cancelable)
//   stisla:offcanvas:opened    — after open transition
//   stisla:offcanvas:closing   — before close (cancelable)
//   stisla:offcanvas:closed    — after close transition
//
// Opts (defaults below):
//   backdrop: true | false | 'static'  — false = no backdrop; 'static' = shake on click
//   keyboard: true                      — ESC closes
//   focus: true                         — move focus into panel on open
//   returnFocus: true                   — restore focus to opener on close
//   scroll: false                       — true = allow page scroll while open

import { createFocusTrap } from 'focus-trap';
import { Component, getInstance } from '../core/component.js';
import { readOpts } from '../core/init.js';

const SCROLL_LOCK_CLASS = 'is-offcanvas-open';
const OPEN = 'open';
const CLOSED = 'closed';

let openCount = 0;

export class Offcanvas extends Component {
  static eventNamespace = 'offcanvas';
  static defaults = {
    backdrop: true,
    keyboard: true,
    focus: true,
    returnFocus: true,
    scroll: false,
  };

  constructor(el, opts) {
    super(el, opts);

    // Normalize backdrop: only 'static' or false are special; anything else → true.
    if (this.opts.backdrop !== 'static' && this.opts.backdrop !== false) {
      this.opts.backdrop = true;
    }
    // Normalize scroll to boolean (the attribute parser may hand us "true"/"false" strings).
    this.opts.scroll = this.opts.scroll === true || this.opts.scroll === 'true';

    this._content = el.querySelector('.offcanvas__content');
    this._returnFocusEl = null;
    this._trap = null;
    this._inertCleanup = null;
    this._onKeydown = this._onKeydown.bind(this);

    if (!el.dataset.state) el.dataset.state = CLOSED;
    el.setAttribute('aria-hidden', el.dataset.state === OPEN ? 'false' : 'true');
  }

  open() {
    if (!this.el || this.el.dataset.state === OPEN) return;
    if (!this.emit('opening')) return;

    this._returnFocusEl = document.activeElement;
    this._inertSiblings(true);

    if (!this.opts.scroll) {
      if (openCount === 0) document.documentElement.classList.add(SCROLL_LOCK_CLASS);
      openCount++;
    }

    // Force layout in 'block' before flipping state so opacity/transform transitions run.
    this.el.style.display = 'block';
    void this.el.offsetWidth;

    requestAnimationFrame(() => {
      if (!this.el) return;
      this.el.dataset.state = OPEN;
      this.el.setAttribute('aria-hidden', 'false');

      if (this.opts.focus && this._content) {
        try {
          this._trap = createFocusTrap(this._content, {
            initialFocus: () =>
              this._content.querySelector('[autofocus]') ||
              this._firstTabbable() ||
              this._content,
            escapeDeactivates: false,
            returnFocusOnDeactivate: false,
            allowOutsideClick: true,
            clickOutsideDeactivates: false,
            fallbackFocus: this._content,
          });
          this._trap.activate();
        } catch (e) {
          this._content.focus?.();
        }
      }

      if (this.opts.keyboard) {
        document.addEventListener('keydown', this._onKeydown);
      }

      this._waitForTransition(this._content).then(() => {
        if (!this.el) return;
        this.emit('opened', {}, { cancelable: false });
      });
    });
  }

  close() {
    if (!this.el || this.el.dataset.state !== OPEN) return;
    if (!this.emit('closing')) return;

    if (this._trap) {
      try { this._trap.deactivate(); } catch (e) { /* noop */ }
      this._trap = null;
    }
    if (this.opts.keyboard) {
      document.removeEventListener('keydown', this._onKeydown);
    }

    this.el.dataset.state = CLOSED;
    this.el.setAttribute('aria-hidden', 'true');

    this._waitForTransition(this._content).then(() => {
      if (!this.el) return;
      this.el.style.display = '';
      this._inertSiblings(false);
      if (!this.opts.scroll) {
        openCount = Math.max(0, openCount - 1);
        if (openCount === 0) document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      }

      if (this.opts.returnFocus && this._returnFocusEl && typeof this._returnFocusEl.focus === 'function') {
        this._returnFocusEl.focus();
      }
      this._returnFocusEl = null;
      this.emit('closed', {}, { cancelable: false });
    });
  }

  toggle() {
    this.el?.dataset.state === OPEN ? this.close() : this.open();
  }

  // Visual nudge used when a static backdrop is clicked. Shake axis is
  // driven by the placement class on the root (CSS picks the keyframe).
  shake() {
    if (!this._content) return;
    this._content.classList.remove('is-shaking');
    void this._content.offsetWidth;
    this._content.classList.add('is-shaking');
    setTimeout(() => this._content?.classList.remove('is-shaking'), 250);
  }

  destroy() {
    if (this.el?.dataset.state === OPEN) {
      if (this._trap) { try { this._trap.deactivate(); } catch (e) { /* noop */ } this._trap = null; }
      if (this.opts.keyboard) document.removeEventListener('keydown', this._onKeydown);
      this._inertSiblings(false);
      if (!this.opts.scroll) {
        openCount = Math.max(0, openCount - 1);
        if (openCount === 0) document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      }
    }
    super.destroy();
  }

  _onKeydown(e) {
    if (e.key === 'Escape' && this.el?.dataset.state === OPEN) {
      e.preventDefault();
      this.close();
    }
  }

  _firstTabbable() {
    return this._content?.querySelector(
      'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
  }

  _inertSiblings(on) {
    if (on) {
      this._inertCleanup = [];
      let cur = this.el;
      while (cur && cur.parentElement) {
        const parent = cur.parentElement;
        for (const sibling of parent.children) {
          if (sibling === cur) continue;
          if (!sibling.hasAttribute('inert')) {
            sibling.setAttribute('inert', '');
            this._inertCleanup.push(sibling);
          }
        }
        if (parent === document.body || parent === document.documentElement) break;
        cur = parent;
      }
    } else if (this._inertCleanup) {
      for (const el of this._inertCleanup) el.removeAttribute('inert');
      this._inertCleanup = null;
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
      const durations = cs.transitionDuration.split(',').map((s) => parseFloat(s) || 0);
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
      const onEnd = (e) => { if (e.target === el) finish(); };
      el.addEventListener('transitionend', onEnd);
      const fallback = setTimeout(finish, total * 1000 * 1.5 + 50);
    });
  }
}

// Global delegated click handler — bound once per page load.
// Sentinel mirrors the HMR-safe pattern from src/js/components/modal.js.
if (typeof document !== 'undefined' && typeof window !== 'undefined' && !window.__stislaOffcanvasBound) {
  window.__stislaOffcanvasBound = true;

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-stisla-offcanvas-trigger]');
    if (opener) {
      const id = opener.getAttribute('data-stisla-offcanvas-trigger');
      const offcanvasEl = id && document.getElementById(id);
      if (offcanvasEl && offcanvasEl.classList.contains('offcanvas')) {
        e.preventDefault();
        const opts = readOpts(offcanvasEl, 'offcanvas', Offcanvas);
        const existing = getInstance(offcanvasEl);
        const inst = existing ?? new Offcanvas(offcanvasEl, opts);
        if (existing) Object.assign(existing.opts, opts);
        inst.open();
      }
      return;
    }

    const dismiss = e.target.closest('[data-stisla-offcanvas-dismiss]');
    if (dismiss) {
      const offcanvasEl = dismiss.closest('.offcanvas');
      const inst = offcanvasEl && getInstance(offcanvasEl);
      if (!inst) return;
      // Static backdrop: a click on the backdrop element shakes the panel
      // instead of closing. Explicit dismiss controls (.offcanvas__close,
      // footer buttons with [data-stisla-offcanvas-dismiss]) always close.
      if (inst.opts.backdrop === 'static' && dismiss.classList.contains('offcanvas__backdrop')) {
        inst.shake();
        return;
      }
      inst.close();
    }
  });
}
