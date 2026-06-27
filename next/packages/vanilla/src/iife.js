// @stisla/vanilla — script-tag / CDN entry. Bundled to an IIFE (no exports), it runs index.js for
// its side effects only: register every component, auto-init on load, and set window.Stisla. This is
// the artifact a no-build consumer drops in via <script src>, and the same one the docs inline into
// the demo iframe (see the stisla-vanilla-iife Vite plugin + DemoFrame).
import './index.js';
