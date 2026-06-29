// @stisla/vanilla/carousel — optional add-on. Loads ON TOP of the core runtime, registering
// Carousel into the live global registry and re-scanning the page. Core must load first (that's
// the documented contract). As a CDN IIFE this is a separate bundle from core, so it deliberately
// uses window.Stisla (the live registry) rather than its own bundled register/init — those would
// be a dead, isolated copy. init() is idempotent, so the re-scan only wires new carousel markup.
import { Carousel } from './components/carousel.js';

if (typeof window !== 'undefined') {
  if (window.Stisla) {
    window.Stisla.register('carousel', Carousel);
    window.Stisla.Carousel = Carousel;
    window.Stisla.init();
  } else {
    console.warn('[stisla] load the core runtime (@stisla/vanilla / stisla.js) before the carousel add-on');
  }
}

export { Carousel };
