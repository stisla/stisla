// Site-only behaviors for stisla.dev demos. Not part of the framework bundle.
// Pattern: declarative `data-demo-*` attributes; one event-delegated handler per behavior.

// Site-sidebar active-state — mark the link whose pathname matches the
// current URL with aria-current="page". Done in JS (not Nunjucks) so the
// menu lives in one partial without needing a per-page key plumbed through.
(function markActiveSidebarItem() {
  const here = window.location.pathname.replace(/\/$/, "") || "/";
  document
    .querySelectorAll(".site-sidebar a.sidebar-item-button")
    .forEach((link) => {
      const href = (link.getAttribute("href") || "").replace(/\/$/, "") || "/";
      if (href === here) link.setAttribute("aria-current", "page");
    });
})();

// data-theme-toggle — flip [data-bs-theme] on <html>, persist to localStorage.
// FOUC prevention runs synchronously in base.njk's <head>.
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-theme-toggle]");
  if (!target) return;
  const html = document.documentElement;
  const next = html.dataset.bsTheme === "dark" ? "light" : "dark";
  html.dataset.bsTheme = next;
  localStorage.setItem("stisla-theme", next);
});

// data-demo-code-toggle — expand/collapse the closest [data-demo-code] container.
// Pure presentational toggle: state lives in data-expanded + aria-expanded.
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-demo-code-toggle]");
  if (!target) return;
  const container = target.closest("[data-demo-code]");
  if (!container) return;
  const expanded = container.hasAttribute("data-expanded");
  if (expanded) {
    container.removeAttribute("data-expanded");
    target.setAttribute("aria-expanded", "false");
  } else {
    container.setAttribute("data-expanded", "");
    target.setAttribute("aria-expanded", "true");
  }
});

// Auto-init Bootstrap popovers + tooltips. BS5 ships both opt-in (Popper is
// heavy to mount on every node), so demos that use [data-bs-toggle="popover"]
// or [data-bs-toggle="tooltip"] rely on this scan.
(function initPopovers() {
  const Popover = window.Stisla?.bs?.Popover;
  if (!Popover) return;
  document
    .querySelectorAll('[data-bs-toggle="popover"]')
    .forEach((el) => new Popover(el));
})();

(function initTooltips() {
  const Tooltip = window.Stisla?.bs?.Tooltip;
  if (!Tooltip) return;
  document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new Tooltip(el));
})();

// data-demo-toast="<selector>" — show a Bootstrap toast on click. The value is
// a CSS selector pointing at the target .toast element.
// <button class="btn btn-primary" data-demo-toast="#welcome-toast">Show toast</button>
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-demo-toast]");
  if (!target) return;
  const el = document.querySelector(target.dataset.demoToast);
  if (!el) return;
  const Toast = window.Stisla?.bs?.Toast;
  if (!Toast) return;
  Toast.getOrCreateInstance(el, { autohide: true, delay: 4000 }).show();
});

// data-demo-loading="<ms>" — toggle .btn-loading on click, auto-clear after the given duration.
// <button class="btn btn-primary" data-demo-loading="2000">Click to save</button>
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-demo-loading]");
  if (!target || target.classList.contains("btn-loading")) return;
  const ms = parseInt(target.dataset.demoLoading, 10) || 1500;
  target.classList.add("btn-loading");
  target.setAttribute("aria-busy", "true");
  target.setAttribute("disabled", "true");
  setTimeout(() => {
    target.classList.remove("btn-loading");
    target.removeAttribute("aria-busy");
    target.removeAttribute("disabled");
  }, ms);
});
