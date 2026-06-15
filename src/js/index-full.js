// Stisla v3 — stisla-full JS entry (vanilla impl, SPEC.md §10 / V3.md §3.12).
//
// Re-exports the vanilla core bundle and adds every vanilla-optional
// component. Use this entry when you want every component available with
// one import. À la carte consumers import the core entry + the optional
// components they need from `components/*`.
//
// The microtask-deferred auto-init in `./index.js` walks the DOM after
// this module's body finishes, so the carousel registration below lands
// before the scanner runs.

import { Stisla } from './index.js';
import { Carousel } from './components/carousel.js';

Stisla.register('carousel', Carousel);
Stisla.Carousel = Carousel;

export { Stisla };
export default Stisla;
