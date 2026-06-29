// @stisla/vanilla — full entry (ESM). Core plus the three optional components (carousel, combobox,
// scroll-area) that carry a third-party dependency. The CDN build emits this as stisla-full.js.
//
// Importing core first runs its side effects (registers ~17 components, queues auto-init in a
// microtask, sets window.Stisla). Registering the optionals synchronously after that import lands
// them before the microtask fires, so a single scan wires every component.

import Stisla from './index.js';
import { register } from './core/init.js';
import { Carousel } from './components/carousel.js';
import { Combobox } from './components/combobox.js';
import { ScrollArea } from './components/scroll-area.js';

register('carousel', Carousel);
register('combobox', Combobox);
register('scroll-area', ScrollArea);

// Same object window.Stisla already points at — augment it so both surfaces expose the optionals.
Object.assign(Stisla, { Carousel, Combobox, ScrollArea });

export { Stisla };
export default Stisla;
