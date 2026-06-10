// Stisla.Modal — V3.md §3.7 reference implementation.
//
// Anatomy:
//   .modal[data-stisla-modal][data-state="open|closed"]
//     .modal__backdrop[data-stisla-modal-dismiss]
//     .modal__dialog
//       .modal__content
//         .modal__close[data-stisla-modal-dismiss]
//         .modal__header > .modal__title
//         .modal__body
//         .modal__footer
//
// Events (bubbling, detail: { modal: this }):
//   stisla:modal:opening   — before open  (cancelable)
//   stisla:modal:opened    — after open transition
//   stisla:modal:closing   — before close (cancelable)
//   stisla:modal:closed    — after close transition
//
// Opts (defaults below):
//   backdrop: true | false | 'static'  — false = no backdrop dismiss; 'static' = shake instead
//   keyboard: true                      — ESC closes
//   focus: true                         — move focus into modal on open (via focus-trap)
//   returnFocus: true                   — restore focus to opener on close

import { createFocusTrap } from 'focus-trap';
import { Component, getInstance } from '../core/component.js';
import { readOpts } from '../core/init.js';

const SCROLL_LOCK_CLASS = 'is-modal-open';
const OPEN = 'open';
const CLOSED = 'closed';

let openCount = 0;

export class Modal extends Component {
  static eventNamespace = 'modal';
  static defaults = {
    backdrop: true,
    keyboard: true,
    focus: true,
    returnFocus: true,
  };

  constructor(el, opts) {
    super(el, opts);

    // Normalize backdrop: only 'static' or false are special; anything else → true.
    if (this.opts.backdrop !== 'static' && this.opts.backdrop !== false) {
      this.opts.backdrop = true;
    }

    this._dialog = el.querySelector('.modal__dialog');
    this._content = el.querySelector('.modal__content');
    this._returnFocusEl = null;
    this._trap = null;
    this._inertCleanup = null;
    this._onKeydown = this._onKeydown.bind(this);

    // Initial state defaults to closed.
    if (!el.dataset.state) el.dataset.state = CLOSED;
    el.setAttribute('aria-hidden', el.dataset.state === OPEN ? 'false' : 'true');
  }

  open() {
    if (!this.el || this.el.dataset.state === OPEN) return;
    if (!this.emit('opening')) return;

    this._returnFocusEl = document.activeElement;
    this._inertSiblings(true);

    if (openCount === 0) document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    openCount++;

    // Force layout in 'flex' before flipping state so opacity/transform transitions run.
    this.el.style.display = 'flex';
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

      this._waitForTransition(this._dialog).then(() => {
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

    this._waitForTransition(this._dialog).then(() => {
      if (!this.el) return;
      this.el.style.display = '';
      this._inertSiblings(false);
      openCount = Math.max(0, openCount - 1);
      if (openCount === 0) document.documentElement.classList.remove(SCROLL_LOCK_CLASS);

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

  // Visual nudge used when a static backdrop is clicked.
  shake() {
    if (!this._dialog) return;
    this._dialog.classList.remove('is-shaking');
    void this._dialog.offsetWidth;
    this._dialog.classList.add('is-shaking');
    setTimeout(() => this._dialog?.classList.remove('is-shaking'), 250);
  }

  destroy() {
    if (this.el?.dataset.state === OPEN) {
      if (this._trap) { try { this._trap.deactivate(); } catch (e) { /* noop */ } this._trap = null; }
      if (this.opts.keyboard) document.removeEventListener('keydown', this._onKeydown);
      this._inertSiblings(false);
      openCount = Math.max(0, openCount - 1);
      if (openCount === 0) document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
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

  // Walks from modal up to <body>, inerting siblings at each level so the
  // modal's ancestor chain stays interactive and everything outside it
  // drops out of the focus + AT tree.
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
// Sentinel mirrors the HMR-safe pattern from src/js/index.js (Step 4.0 prelude).
if (typeof document !== 'undefined' && typeof window !== 'undefined' && !window.__stislaModalBound) {
  window.__stislaModalBound = true;

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-stisla-modal-trigger]');
    if (opener) {
      const id = opener.getAttribute('data-stisla-modal-trigger');
      const modalEl = id && document.getElementById(id);
      if (modalEl && modalEl.classList.contains('modal')) {
        e.preventDefault();
        // Read per-attr opts from the element. If an instance already
        // exists, replace it (constructor auto-destroys + dev-warns) so
        // opts always reflect the current DOM. Belt-and-braces over the
        // Stisla.init() scan in case it ran with an empty registry, an
        // HMR cycle preserved a stale instance, or the modal was added
        // after init.
        const opts = readOpts(modalEl, 'modal', Modal);
        const existing = getInstance(modalEl);
        const inst = existing ?? new Modal(modalEl, opts);
        if (existing) Object.assign(existing.opts, opts);
        inst.open();
      }
      return;
    }

    const dismiss = e.target.closest('[data-stisla-modal-dismiss]');
    if (dismiss) {
      const modalEl = dismiss.closest('.modal');
      const inst = modalEl && getInstance(modalEl);
      if (!inst) return;
      // Static backdrop: a click on the backdrop element shakes the dialog
      // instead of closing. Explicit dismiss controls (like .modal__close)
      // always close, even on static.
      if (inst.opts.backdrop === 'static' && dismiss.classList.contains('modal__backdrop')) {
        inst.shake();
        return;
      }
      inst.close();
    }
  });
}
