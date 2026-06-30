// Stisla.Dialog — V3.md §3.7 reference implementation.
//
// Anatomy:
//   .dialog[data-stisla-dialog][data-state="open|closed"]
//     .dialog__backdrop[data-stisla-dialog-dismiss]
//     .dialog__panel
//       .dialog__content
//         .dialog__close[data-stisla-dialog-dismiss]
//         .dialog__header > .dialog__title
//         .dialog__body
//         .dialog__footer
//
// Events (bubbling, detail: { dialog: this }):
//   stisla:dialog:opening   — before open  (cancelable)
//   stisla:dialog:opened    — after open transition
//   stisla:dialog:closing   — before close (cancelable)
//   stisla:dialog:closed    — after close transition
//
// Opts (defaults below):
//   backdrop: true | false | 'static'  — false = no backdrop dismiss; 'static' = shake instead
//   keyboard: true                      — ESC closes
//   focus: true                         — move focus into dialog on open (via focus-trap)
//   returnFocus: true                   — restore focus to opener on close

import { createFocusTrap } from 'focus-trap';
import { Component, getInstance } from '../core/component.js';
import { readOpts } from '../core/init.js';
import { waitForTransition } from '../core/transition.js';
import { inertSiblings } from '../core/inert.js';

// Scroll lock + shake are attribute hooks (the CSS reads html[data-dialog-open] and
// .dialog__panel[data-shaking]); recast from the legacy is-* classes per the no-is-* convention.
const SCROLL_LOCK_ATTR = 'data-dialog-open';
const SHAKING_ATTR = 'data-shaking';
const OPEN = 'open';
const CLOSED = 'closed';

let openCount = 0;

export class Dialog extends Component {
  static eventNamespace = 'dialog';
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

    this._panel = el.querySelector('.dialog__panel');
    this._content = el.querySelector('.dialog__content');
    // Make the trap container focusable. Without this, a mousedown on text
    // inside .dialog__body walks up to .dialog[tabindex=-1] for focus — which
    // is outside the trap — and focus-trap yanks focus back, canceling the
    // browser's pending text selection.
    if (this._content && !this._content.hasAttribute('tabindex')) {
      this._content.setAttribute('tabindex', '-1');
    }
    this._returnFocusEl = null;
    this._trap = null;
    this._releaseInert = null;
    this._onKeydown = this._onKeydown.bind(this);

    // Initial state defaults to closed.
    if (!el.dataset.state) el.dataset.state = CLOSED;
    el.setAttribute('aria-hidden', el.dataset.state === OPEN ? 'false' : 'true');
  }

  open() {
    if (!this.el || this.el.dataset.state === OPEN) return;
    if (!this.emit('opening')) return;

    this._returnFocusEl = document.activeElement;
    this._releaseInert = inertSiblings(this.el);

    if (openCount === 0) document.documentElement.setAttribute(SCROLL_LOCK_ATTR, '');
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

      waitForTransition(this._panel).then(() => {
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

    waitForTransition(this._panel).then(() => {
      if (!this.el) return;
      this.el.style.display = '';
      this._releaseInert?.();
      this._releaseInert = null;
      openCount = Math.max(0, openCount - 1);
      if (openCount === 0) document.documentElement.removeAttribute(SCROLL_LOCK_ATTR);

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
    if (!this._panel) return;
    this._panel.removeAttribute(SHAKING_ATTR);
    void this._panel.offsetWidth;
    this._panel.setAttribute(SHAKING_ATTR, '');
    setTimeout(() => this._panel?.removeAttribute(SHAKING_ATTR), 250);
  }

  destroy() {
    if (this.el?.dataset.state === OPEN) {
      if (this._trap) { try { this._trap.deactivate(); } catch (e) { /* noop */ } this._trap = null; }
      if (this.opts.keyboard) document.removeEventListener('keydown', this._onKeydown);
      this._releaseInert?.();
      this._releaseInert = null;
      openCount = Math.max(0, openCount - 1);
      if (openCount === 0) document.documentElement.removeAttribute(SCROLL_LOCK_ATTR);
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

}

// Global delegated click handler — bound once per page load. Sentinel mirrors the HMR-safe pattern.
if (typeof document !== 'undefined' && typeof window !== 'undefined' && !window.__stislaDialogBound) {
  window.__stislaDialogBound = true;

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-stisla-dialog-trigger]');
    if (opener) {
      const id = opener.getAttribute('data-stisla-dialog-trigger');
      const dialogEl = id && document.getElementById(id);
      if (dialogEl && dialogEl.classList.contains('dialog')) {
        e.preventDefault();
        // Read per-attr opts from the element. If an instance already exists, replace it (constructor
        // auto-destroys + dev-warns) so opts always reflect the current DOM. Belt-and-braces over the
        // Stisla.init() scan in case it ran with an empty registry, an HMR cycle preserved a stale
        // instance, or the dialog was added after init.
        const opts = readOpts(dialogEl, 'dialog', Dialog);
        const existing = getInstance(dialogEl);
        const inst = existing ?? new Dialog(dialogEl, opts);
        if (existing) Object.assign(existing.opts, opts);
        inst.open();
      }
      return;
    }

    const dismiss = e.target.closest('[data-stisla-dialog-dismiss]');
    if (dismiss) {
      const dialogEl = dismiss.closest('.dialog');
      const inst = dialogEl && getInstance(dialogEl);
      if (!inst) return;
      // Static backdrop: a click on the backdrop element shakes the panel instead of closing.
      // Explicit dismiss controls (like .dialog__close) always close, even on static.
      if (inst.opts.backdrop === 'static' && dismiss.classList.contains('dialog__backdrop')) {
        inst.shake();
        return;
      }
      inst.close();
    }
  });
}
