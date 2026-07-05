// Stisla.Avatar — image-with-fallback root.
//
// Anatomy:
//   <span class="avatar" data-stisla-avatar>
//     <img class="avatar__image" src="…" alt="…">
//     <span class="avatar__fallback">RF</span>
//   </span>
//
// Scope: preload the .avatar__image src via `new Image()` and write
// data-status="idle|loading|loaded|error" onto the root. CSS reveals the
// real <img> only after a confirmed load — until then (and on error) the
// fallback paints underneath. Avoids the broken-image icon flash and
// keeps the fallback as the canonical paint during loading. Initials-only
// avatars (no <img class="avatar__image">) need no JS, so we skip the
// preloader entirely if the element is absent.
//
// Events (bubbling, detail: { avatar: this, status }):
//   stisla:avatar:changed  — after data-status flips
//
// Opts:
//   delay: 0    Hold "loading"/idle for N ms before flipping to "loaded".
//               Useful for tests / FOUC tuning; default 0 = immediate.

import { Component } from '../core/component.js';

export class Avatar extends Component {
  static eventNamespace = 'avatar';
  static defaults = {
    delay: 0,
  };

  constructor(el, opts) {
    super(el, opts);

    this._image = el.querySelector('.avatar__image');
    this._loaderTimer = 0;

    // No <img> at all — fallback-only avatar. Leave the attribute unset
    // so CSS doesn't even try to reveal a non-existent image; bail.
    if (!this._image) return;

    // src may change at runtime; re-preload when it does. MutationObserver
    // is cheaper than a poll and matches the runtime mutation model used
    // by the rest of the framework.
    this._observer = new MutationObserver((records) => {
      for (const r of records) {
        if (r.attributeName === 'src' || r.attributeName === 'srcset') {
          this._preload();
          return;
        }
      }
    });
    this._observer.observe(this._image, {
      attributes: true,
      attributeFilter: ['src', 'srcset'],
    });

    this._preload();
  }

  _preload() {
    if (!this.el || !this._image) return;

    // Cancel any in-flight delay from a previous src.
    if (this._loaderTimer) {
      clearTimeout(this._loaderTimer);
      this._loaderTimer = 0;
    }

    const src = this._image.getAttribute('src');
    if (!src) {
      this._setStatus('error');
      return;
    }

    this._setStatus('loading');

    // `new Image()` runs the load off-DOM. Browsers dedupe the request
    // against the visible <img>, so the real element paints from cache
    // the instant we flip data-status to "loaded".
    const probe = new window.Image();
    const srcset = this._image.getAttribute('srcset');
    const sizes  = this._image.getAttribute('sizes');
    const crossOrigin    = this._image.getAttribute('crossorigin');
    const referrerPolicy = this._image.getAttribute('referrerpolicy');

    // A token to discard stale probes when src changes mid-load.
    const probeId = ++this._probeId || (this._probeId = 1);

    probe.onload = () => {
      if (probeId !== this._probeId) return;
      if (this.opts.delay > 0) {
        this._loaderTimer = setTimeout(() => {
          this._loaderTimer = 0;
          this._setStatus('loaded');
        }, Number(this.opts.delay));
      } else {
        this._setStatus('loaded');
      }
    };

    probe.onerror = () => {
      if (probeId !== this._probeId) return;
      this._setStatus('error');
    };

    if (referrerPolicy) probe.referrerPolicy = referrerPolicy;
    if (crossOrigin)    probe.crossOrigin    = crossOrigin;
    if (sizes)          probe.sizes          = sizes;
    if (srcset)         probe.srcset         = srcset;
    probe.src = src;
  }

  _setStatus(status) {
    if (!this.el) return;
    if (this.el.dataset.status === status) return;
    this.el.dataset.status = status;
    this.emit('changed', { status }, { cancelable: false });
  }

  destroy() {
    if (this._loaderTimer) {
      clearTimeout(this._loaderTimer);
      this._loaderTimer = 0;
    }
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._probeId++;
    super.destroy();
  }
}
