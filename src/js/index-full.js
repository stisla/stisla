// Stisla v3 — stisla-full JS entry (vanilla impl, SPEC.md §10 / V3.md §3.12).
//
// Re-exports the vanilla core bundle and adds every vanilla-optional
// component. Use this entry when you want every component available with
// one import. Individual consumers import the core entry + the optional
// components they need from `components/*`.
//
// The microtask-deferred auto-init in `./index.js` walks the DOM after
// this module's body finishes, so the carousel registration below lands
// before the scanner runs.

import { Stisla } from './index.js';
import { Carousel } from './components/carousel.js';
import { ScrollArea } from './components/scroll-area.js';
import { Combobox } from './components/combobox.js';

Stisla.register('carousel', Carousel);
Stisla.Carousel = Carousel;

Stisla.register('scroll-area', ScrollArea);
Stisla.ScrollArea = ScrollArea;

Stisla.register('combobox', Combobox);
Stisla.Combobox = Combobox;

export { Stisla };
export default Stisla;
