// Stisla.Carousel — vanilla-optional per SPEC.md §10.
//
// Anatomy:
//   .carousel[data-stisla-carousel][data-state="ready"]
//     .carousel__viewport
//       .carousel__track
//         .carousel__slide
//     .carousel__control--prev/next
//     .carousel__indicators > button.carousel__indicator
//
// Embla owns the slide motion (translate3d on .carousel__track); this
// wrapper owns control + indicator wiring, autoplay, keyboard, events,
// and the destroy contract.
//
// Events (bubbling, all non-cancelable — Embla has no pre-change hook):
//   stisla:carousel:ready          { totalSlides }
//   stisla:carousel:selected       { index, previousIndex }
//   stisla:carousel:settled        { index }
//   stisla:carousel:autoplay-paused
//   stisla:carousel:autoplay-resumed
//
// Opts (defaults below):
//   loop: false             — wrap past first/last slide
//   align: 'start'          — 'start' | 'center' | 'end'
//   slidesToScroll: 1
//   duration: 25            — Embla scroll duration (ms-ish, see docs)
//   dragFree: false         — free-scroll vs snap
//   autoplay: false         — true | { delay: 4000, stopOnInteraction: false }
//   keyboard: true          — ← / → / Home / End when root is focused

import EmblaCarousel from 'embla-carousel';
import { Component } from '../core/component.js';

const READY = 'ready';
const AUTOPLAY_DEFAULTS = { delay: 4000, stopOnInteraction: false };

export class Carousel extends Component {
  static eventNamespace = 'carousel';
  static defaults = {
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    duration: 25,
    dragFree: false,
    autoplay: false,
    keyboard: true,
  };

  constructor(el, opts) {
    super(el, opts);

    this._viewport = el.querySelector('.carousel__viewport');
    if (!this._viewport) {
      console.warn('[stisla] .carousel missing .carousel__viewport', el);
      return;
    }

    this._prev = el.querySelector('.carousel__control--prev');
    this._next = el.querySelector('.carousel__control--next');
    this._indicatorsEl = el.querySelector('.carousel__indicators');
    this._indicators = this._indicatorsEl
      ? Array.from(this._indicatorsEl.querySelectorAll('.carousel__indicator'))
      : [];

    this._autoplayTimer = null;
    this._autoplayPaused = false;
    this._autoplayKilled = false;
    this._reducedMotion = false;
    this._reducedMotionMql =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    if (this._reducedMotionMql) this._reducedMotion = this._reducedMotionMql.matches;
    this._previousIndex = 0;

    this._embla = EmblaCarousel(this._viewport, this._normalizeEmblaOpts());

    this._onSelect = this._onSelect.bind(this);
    this._onSettle = this._onSettle.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onVisibility = this._onVisibility.bind(this);
    this._onReducedMotionChange = this._onReducedMotionChange.bind(this);

    this._embla.on('select', this._onSelect);
    this._embla.on('settle', this._onSettle);
    this._embla.on('pointerDown', this._onPointerDown);
    this._embla.on('pointerUp', this._onPointerUp);

    // Track live OS toggles instead of caching once — keeps the carousel in
    // step with the CSS-only components, which react to the media query live.
    if (this._reducedMotionMql) {
      this.on(this._reducedMotionMql, 'change', this._onReducedMotionChange);
    }

    if (this._prev) this.on(this._prev, 'click', () => this._userScroll('prev'));
    if (this._next) this.on(this._next, 'click', () => this._userScroll('next'));

    if (this._indicatorsEl) {
      this.on(this._indicatorsEl, 'click', (e) => {
        const btn = e.target.closest('.carousel__indicator');
        if (!btn || !this._indicatorsEl.contains(btn)) return;
        const i = this._indicators.indexOf(btn);
        if (i >= 0) this._userScroll(i);
      });
    }

    if (this.opts.keyboard) {
      if (el.tabIndex < 0) el.setAttribute('tabindex', '0');
      this.on(el, 'keydown', this._onKeydown);
    }

    // Polite live region (visually hidden) that names the current slide on
    // change. Scoped to the root so it's torn down with the component. Held
    // silent during autoplay — auto-rotation shouldn't narrate (APG carousel).
    this._liveRegion = document.createElement('div');
    this._liveRegion.dataset.stislaCarouselLive = '';
    this._liveRegion.setAttribute('aria-live', 'polite');
    this._liveRegion.setAttribute('aria-atomic', 'true');
    this._liveRegion.style.cssText =
      'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;';
    el.appendChild(this._liveRegion);

    this._updateIndicators();
    this._updateControls();
    this._updateSlideVisibility();

    // Wire pause/resume whenever autoplay is configured; _startAutoplay()
    // self-guards on reduced motion, so the timer stays off while it's on but
    // the listeners are ready if the user toggles it off mid-session.
    if (this._normalizeAutoplay()) {
      this.on(el, 'mouseenter', () => this._pauseAutoplay('hover'));
      this.on(el, 'mouseleave', () => this._resumeAutoplay('hover'));
      this.on(el, 'focusin', () => this._pauseAutoplay('focus'));
      this.on(el, 'focusout', (e) => {
        if (!el.contains(e.relatedTarget)) this._resumeAutoplay('focus');
      });
      this.on(document, 'visibilitychange', this._onVisibility);
      this._startAutoplay();
    }

    el.dataset.state = READY;
    this.emit(
      'ready',
      { totalSlides: this._embla.scrollSnapList().length },
      { cancelable: false },
    );
  }

  // === Public API =====================================================
  scrollPrev() {
    this._embla?.scrollPrev();
  }

  scrollNext() {
    this._embla?.scrollNext();
  }

  scrollTo(index) {
    this._embla?.scrollTo(index);
  }

  selectedIndex() {
    return this._embla?.selectedScrollSnap() ?? 0;
  }

  canScrollPrev() {
    return Boolean(this._embla?.canScrollPrev());
  }

  canScrollNext() {
    return Boolean(this._embla?.canScrollNext());
  }

  play() {
    this._autoplayKilled = false;
    this._autoplayPaused = false;
    this._startAutoplay();
  }

  pause() {
    this._autoplayKilled = true;
    this._stopAutoplay();
  }

  reinit(opts) {
    if (!this._embla) return;
    if (opts) this.opts = { ...this.opts, ...opts };
    this._embla.reInit(this._normalizeEmblaOpts());
    this._updateIndicators();
    this._updateControls();
    this._updateSlideVisibility();
  }

  destroy() {
    this._stopAutoplay();
    if (this._embla) {
      // Drop the a11y state we layered on before Embla forgets its slide nodes.
      for (const slide of this._embla.slideNodes()) {
        slide.removeAttribute('aria-hidden');
        slide.inert = false;
      }
      this._embla.off('select', this._onSelect);
      this._embla.off('settle', this._onSettle);
      this._embla.off('pointerDown', this._onPointerDown);
      this._embla.off('pointerUp', this._onPointerUp);
      this._embla.destroy();
      this._embla = null;
    }
    this._liveRegion?.remove();
    this._liveRegion = null;
    super.destroy();
  }

  // === Embla event handlers ===========================================
  _onSelect() {
    if (!this._embla) return;
    const i = this._embla.selectedScrollSnap();
    const prev = this._previousIndex;
    this._previousIndex = i;
    this._updateIndicators(i);
    this._updateControls();
    this._updateSlideVisibility();
    this._announceSlide(i);
    this.emit('selected', { index: i, previousIndex: prev }, { cancelable: false });
  }

  _onSettle() {
    if (!this._embla) return;
    const i = this._embla.selectedScrollSnap();
    this.emit('settled', { index: i }, { cancelable: false });
  }

  _onPointerDown() {
    this._pauseAutoplay('pointer');
  }

  _onPointerUp() {
    this._resumeAutoplay('pointer');
    if (this._normalizeAutoplay()?.stopOnInteraction) this._autoplayKilled = true;
  }

  _onVisibility() {
    if (document.hidden) this._pauseAutoplay('visibility');
    else this._resumeAutoplay('visibility');
  }

  // === Keyboard =======================================================
  _onKeydown(e) {
    // Only intercept when focus is on the root itself — keep native keyboard
    // behavior intact for interactive children (links, buttons inside slides).
    if (e.target !== this.el) return;
    let handled = true;
    switch (e.key) {
      case 'ArrowLeft':
        this._userScroll('prev');
        break;
      case 'ArrowRight':
        this._userScroll('next');
        break;
      case 'Home':
        this._userScroll(0);
        break;
      case 'End': {
        const snaps = this._embla?.scrollSnapList() ?? [];
        if (snaps.length) this._userScroll(snaps.length - 1);
        break;
      }
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  }

  _userScroll(target) {
    if (this._normalizeAutoplay()?.stopOnInteraction) this._autoplayKilled = true;
    if (target === 'prev') this.scrollPrev();
    else if (target === 'next') this.scrollNext();
    else if (typeof target === 'number') this.scrollTo(target);
  }

  // === Indicators / controls ==========================================
  _updateIndicators(index) {
    if (!this._indicators.length) return;
    const i = index ?? this._embla?.selectedScrollSnap() ?? 0;
    for (let k = 0; k < this._indicators.length; k++) {
      const btn = this._indicators[k];
      if (k === i) {
        btn.dataset.state = 'active';
        btn.setAttribute('aria-current', 'true');
      } else {
        delete btn.dataset.state;
        btn.removeAttribute('aria-current');
      }
    }
  }

  _updateControls() {
    if (!this._embla) return;
    if (this._prev) {
      this._prev.toggleAttribute('aria-disabled', !this._embla.canScrollPrev());
    }
    if (this._next) {
      this._next.toggleAttribute('aria-disabled', !this._embla.canScrollNext());
    }
  }

  // Hide the slides that aren't on the active snap from AT and the tab order.
  // `inert` does both, so pairing it with aria-hidden keeps them in sync without
  // tripping the aria-hidden-focus rule (an aria-hidden subtree must hold no
  // focusable node). Uses the snap grouping, not pixel in-view — an edge-touching
  // neighbor counts as "in view" to Embla but shouldn't be exposed as current.
  _updateSlideVisibility() {
    if (!this._embla) return;
    const slides = this._embla.slideNodes();
    // slideRegistry groups slide indices per scroll snap (honours loop /
    // slidesToScroll / align); index it by the selected snap for the current set.
    const registry = this._embla.internalEngine().slideRegistry;
    const active = new Set(registry[this._embla.selectedScrollSnap()] ?? []);
    for (let k = 0; k < slides.length; k++) {
      const hidden = !active.has(k);
      // Explicit "true"/removed — aria-hidden="" (what toggleAttribute emits) is
      // read as false, so it would leave the slide exposed.
      if (hidden) slides[k].setAttribute('aria-hidden', 'true');
      else slides[k].removeAttribute('aria-hidden');
      slides[k].inert = hidden;
    }
  }

  // Name the current slide through the polite live region — but only when the
  // change is user-driven. While autoplay is actively rotating (timer live) we
  // stay silent so the screen reader isn't narrated at every tick.
  _announceSlide(index) {
    if (!this._liveRegion || this._autoplayTimer != null) return;
    const total = this._embla?.scrollSnapList().length ?? 0;
    if (!total) return;
    this._liveRegion.textContent = `Slide ${index + 1} of ${total}`;
  }

  // === Autoplay =======================================================
  _normalizeAutoplay() {
    const a = this.opts.autoplay;
    if (a === true || a === 'true') return { ...AUTOPLAY_DEFAULTS };
    if (a && typeof a === 'object') return { ...AUTOPLAY_DEFAULTS, ...a };
    return null;
  }

  _startAutoplay() {
    if (!this._embla) return;
    const cfg = this._normalizeAutoplay();
    if (!cfg || this._reducedMotion || this._autoplayKilled) return;
    this._stopAutoplay();
    this._autoplayTimer = window.setInterval(() => {
      if (!this._embla) return;
      if (this._embla.canScrollNext()) this._embla.scrollNext();
      else this._embla.scrollTo(0);
    }, cfg.delay);
  }

  _stopAutoplay() {
    if (this._autoplayTimer != null) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  }

  _pauseAutoplay(reason) {
    if (this._autoplayTimer == null) return;
    this._stopAutoplay();
    if (!this._autoplayPaused) {
      this._autoplayPaused = true;
      this.emit('autoplay-paused', { reason }, { cancelable: false });
    }
  }

  _resumeAutoplay(reason) {
    if (!this._autoplayPaused) return;
    this._autoplayPaused = false;
    if (this._autoplayKilled) return;
    this._startAutoplay();
    this.emit('autoplay-resumed', { reason }, { cancelable: false });
  }

  _onReducedMotionChange(e) {
    this._reducedMotion = e.matches;
    // Embla owns the transform in JS, so re-init to pick up the new slide
    // duration (0 vs 25); autoplay is a JS timer, so flip it to match.
    this._embla?.reInit(this._normalizeEmblaOpts());
    if (this._reducedMotion) this._stopAutoplay();
    else this._startAutoplay();
  }

  // === Opts → Embla mapping ===========================================
  _normalizeEmblaOpts() {
    return {
      loop: this._coerceBool(this.opts.loop),
      align: this.opts.align,
      slidesToScroll: Number(this.opts.slidesToScroll) || 1,
      // Embla animates the track transform in JS, so CSS can't flatten it —
      // jump instantly under reduced motion instead of easing over `duration`.
      duration: this._reducedMotion ? 0 : Number(this.opts.duration) || 25,
      dragFree: this._coerceBool(this.opts.dragFree),
    };
  }

  _coerceBool(v) {
    if (v === true || v === 'true') return true;
    if (v === false || v === 'false') return false;
    return Boolean(v);
  }
}
