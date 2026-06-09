// Stisla public JS entry.
//
// Step 2 status: BS5 is gone. Popover + Tooltip auto-init lived here
// during the BS5 era; Step 4 reintroduces them via @floating-ui/dom +
// the Stisla.JS contract (class + destroy + custom events, V3.md §3.7).
// Until then, popover/tooltip markup renders inert.

export const Stisla = {
  version: '3.0.0-alpha.0',
  init() {
    // Declarative re-scan API lands in Step 4. Today the handler below
    // auto-attaches at module load.
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

  // Navbar — [data-navbar-toggle] flips data-state on the closest
  // .navbar__menu between "open" and "closed". The CSS keys off
  // data-state to show/hide the folded menu below the collapse
  // breakpoint. Step 4 promotes this into Stisla.Navbar with the full
  // class + destroy + custom-events contract (V3.md §3.7).
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-navbar-toggle]');
    if (!target) return;
    const navbar = target.closest('.navbar');
    if (!navbar) return;
    const menu = navbar.querySelector('.navbar__menu');
    if (!menu) return;
    const open = menu.dataset.state === 'open';
    menu.dataset.state = open ? 'closed' : 'open';
    target.setAttribute('aria-expanded', String(!open));
  });
}

export default Stisla;
