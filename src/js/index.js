// Stisla public JS entry.
// Phase 0 placeholder. The contract (class-based, .destroy(), custom events)
// gets wired in Phase 3.

import * as bs from 'bootstrap';

export const Stisla = {
  version: '3.0.0-alpha.0',
  bs,
  init() {
    // Declarative auto-init scanner. Filled in Phase 3.
  },
};

if (typeof window !== 'undefined') {
  window.Stisla = Stisla;
}

export default Stisla;
