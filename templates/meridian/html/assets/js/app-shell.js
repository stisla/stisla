// Meridian app-shell coordinator. The framework dropped the app-shell primitive, so the template
// owns the page-level layout behavior, driven by the topbar hamburger ([data-stisla-app-shell-toggle]).
//
//   collapse   — desktop rail / full panel (.is-sidebar-collapsed on the shell + [data-collapsed]
//                on the .sidebar; the @stisla/style sidebar component animates its own rail width
//                off that attribute).
//   visibility — mobile off-canvas drawer (.is-sidebar-visible; dashboard.css slides the fixed
//                sidebar in over the ::before backdrop).
//   auto       — picks per viewport: drawer below `lg`, rail above. The single-button pattern the
//                topbar uses.
//
// Backdrop click and Escape dismiss the drawer. Opt-in auto-collapse
// (data-stisla-app-shell-auto-collapse="true") collapses the rail across the `lg` band and expands
// at `xl`+. Guarded so the one entry serves the dashboard, auth, and error layouts alike.

const SHELL = "[data-stisla-app-shell]";
const TOGGLE = "[data-stisla-app-shell-toggle]";
const SIDEBAR = ":scope > .sidebar";
const MOBILE = "(max-width: 63.99rem)"; // below the lg (64rem) breakpoint
const RAIL_BAND = "(min-width: 64rem) and (max-width: 79.99rem)"; // the lg band, up to just below xl

const isMobile = () => window.matchMedia(MOBILE).matches;
const isCollapsed = (shell) => shell.classList.contains("is-sidebar-collapsed");
const isVisible = (shell) => shell.classList.contains("is-sidebar-visible");

function setCollapsed(shell, next) {
  shell.classList.toggle("is-sidebar-collapsed", next);
  shell.querySelector(SIDEBAR)?.toggleAttribute("data-collapsed", next);
  syncTriggers(shell);
}

function setVisible(shell, next) {
  shell.classList.toggle("is-sidebar-visible", next);
  syncTriggers(shell);
}

// aria-expanded reads as the natural UX state (full panel / drawer open), bound to whichever mode
// the current viewport drives.
function syncTriggers(shell) {
  const expanded = isMobile() ? isVisible(shell) : !isCollapsed(shell);
  shell.querySelectorAll(TOGGLE).forEach((t) => t.setAttribute("aria-expanded", String(expanded)));
}

function toggleAuto(shell) {
  if (isMobile()) setVisible(shell, !isVisible(shell));
  else setCollapsed(shell, !isCollapsed(shell));
}

function shellFor(trigger) {
  const id = trigger.getAttribute("aria-controls");
  return (id && document.getElementById(id)) || trigger.closest(SHELL);
}

// Delegated click: the hamburger toggle, plus backdrop dismiss.
document.addEventListener("click", (e) => {
  const trigger = e.target.closest(TOGGLE);
  if (trigger) {
    const shell = shellFor(trigger);
    if (!shell || !shell.matches(SHELL)) return;
    const mode = trigger.dataset.stislaAppShellToggle;
    if (mode === "collapse") setCollapsed(shell, !isCollapsed(shell));
    else if (mode === "visibility") setVisible(shell, !isVisible(shell));
    else toggleAuto(shell);
    return;
  }
  // Backdrop = the .app-shell::before pseudo, so a backdrop click lands on the shell itself.
  const openShell = e.target.closest(`${SHELL}.is-sidebar-visible`);
  if (openShell && !e.target.closest(".sidebar") && !e.target.closest(TOGGLE)) {
    setVisible(openShell, false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll(`${SHELL}.is-sidebar-visible`).forEach((shell) => setVisible(shell, false));
});

// Growing past the drawer breakpoint closes any open drawer and re-syncs the triggers' aria state.
window.matchMedia(MOBILE).addEventListener("change", (e) => {
  document.querySelectorAll(SHELL).forEach((shell) => {
    if (!e.matches) setVisible(shell, false);
    syncTriggers(shell);
  });
});

// Opt-in responsive rail: collapsed inside the `lg` band, expanded at `xl`+. A manual toggle still
// works within a band; the next crossing re-asserts the default. setCollapsed no-ops when the state
// already matches, so this is safe on mount and on every crossing.
const railMql = window.matchMedia(RAIL_BAND);
function applyAutoCollapse() {
  document.querySelectorAll(SHELL).forEach((shell) => {
    if (shell.dataset.stislaAppShellAutoCollapse !== "true" || isMobile()) return;
    setCollapsed(shell, railMql.matches);
  });
}
railMql.addEventListener("change", applyAutoCollapse);

function init() {
  document.querySelectorAll(SHELL).forEach(syncTriggers);
  applyAutoCollapse();
}
if (document.readyState !== "loading") init();
else document.addEventListener("DOMContentLoaded", init);
