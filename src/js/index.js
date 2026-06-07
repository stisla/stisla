// Stisla public JS entry.
//
// Phase 0 + framework auto-init. Phase 3 will formalize the
// class+destroy+events contract; until then this file hosts simple
// declarative handlers — same shape as Bootstrap's data-bs-* scanners —
// so consumers get working framework behavior now and a non-breaking
// upgrade later.

import * as bs from 'bootstrap';

export const Stisla = {
  version: '3.0.0-alpha.0',
  bs,
  init() {
    // Declarative re-scan API lands in Phase 3. Today the handlers below
    // auto-attach at module load.
  },
};

if (typeof window !== 'undefined') {
  window.Stisla = Stisla;
}

// === Framework auto-init =================================================
// SSR-safe: skip when document is unavailable. ES module scripts are
// deferred by default, so querySelectorAll at module load runs after
// the DOM is parsed; UMD consumers should load this script at the end
// of <body> or inside DOMContentLoaded.

if (typeof document !== 'undefined') {
  // Popover + Tooltip — BS5 ships both opt-in (Popper is heavy to mount
  // on every node). Stisla auto-scans markup so [data-bs-toggle="popover"]
  // and [data-bs-toggle="tooltip"] light up without a manual init call.
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => {
    new bs.Popover(el);
  });
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    new bs.Tooltip(el);
  });

  // App shell — data-app-shell-toggle="collapse|visibility" flips the
  // matching state class on the closest .app-shell. "collapse" also
  // flips .is-collapsed on the descendant .sidebar so its internal
  // rail visuals follow.
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-app-shell-toggle]');
    if (!target) return;
    const shell = target.closest('.app-shell');
    if (!shell) return;
    const mode = target.dataset.appShellToggle;
    if (mode === 'collapse') {
      shell.classList.toggle('is-sidebar-collapsed');
      shell.querySelector('.sidebar')?.classList.toggle('is-collapsed');
    } else if (mode === 'visibility') {
      shell.classList.toggle('is-sidebar-visible');
    }
  });

  // App shell — backdrop dismiss. The mobile drawer's backdrop is a
  // ::before on .app-shell, so clicks on it bubble up with the shell
  // as the event target. Close on any click outside the sidebar; skip
  // toggle buttons so the open-click doesn't double-fire into a close
  // on the same event.
  document.addEventListener('click', (e) => {
    const shell = e.target.closest('.app-shell.is-sidebar-visible');
    if (!shell) return;
    if (e.target.closest('.sidebar')) return;
    if (e.target.closest('[data-app-shell-toggle]')) return;
    shell.classList.remove('is-sidebar-visible');
  });
}

export default Stisla;
