// Site-only behaviors for stisla.dev demos. Not part of the framework bundle.
// Pattern: declarative `data-demo-*` attributes; one event-delegated handler per behavior.

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
