// @stisla/vanilla/combobox — optional add-on. Loads ON TOP of the core runtime, registering
// Combobox into the live global registry and re-scanning the page. Core must load first (that's
// the documented contract). As a CDN IIFE this is a separate bundle from core, so it deliberately
// uses window.Stisla (the live registry) rather than its own bundled register/init — those would
// be a dead, isolated copy. init() is idempotent, so the re-scan only wires new combobox markup.
import { Combobox } from './components/combobox.js';

if (typeof window !== 'undefined') {
  if (window.Stisla) {
    window.Stisla.register('combobox', Combobox);
    window.Stisla.Combobox = Combobox;
    window.Stisla.init();
  } else {
    console.warn('[stisla] load the core runtime (@stisla/vanilla / stisla.js) before the combobox add-on');
  }
}

export { Combobox };
