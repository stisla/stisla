// Site-only behaviors for stisla.dev demos. Not part of the framework bundle.
// Pattern: declarative `data-demo-*` attributes; one event-delegated handler per behavior.

// Site-sidebar active-state — mark the link whose pathname matches the
// current URL with aria-current="page". Done in JS (not Nunjucks) so the
// menu lives in one partial without needing a per-page key plumbed through.
(function markActiveSidebarItem() {
  const here = window.location.pathname.replace(/\/$/, "") || "/";
  document
    .querySelectorAll(".site-sidebar a.sidebar__button")
    .forEach((link) => {
      const href = (link.getAttribute("href") || "").replace(/\/$/, "") || "/";
      if (href === here) link.setAttribute("aria-current", "page");
    });
})();

// data-theme-toggle — flip [data-theme] on <html>, persist to localStorage.
// FOUC prevention runs synchronously in base.njk's <head>.
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-theme-toggle]");
  if (!target) return;
  const html = document.documentElement;
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  localStorage.setItem("stisla-theme", next);
});

// Mobile sidebar drawer. The top bar's [data-site-sidebar-trigger] opens
// it; the backdrop or any sidebar link click closes it. We don't watch
// resize → the off-canvas state only matters below md; if the viewport
// grows past md the CSS unsets transform regardless of [data-state].
(function wireMobileSidebar() {
  const sidebar = document.getElementById("site-sidebar");
  const trigger = document.querySelector("[data-site-sidebar-trigger]");
  const backdrop = document.querySelector(".site-backdrop");
  if (!sidebar || !trigger) return;

  const setOpen = (open) => {
    sidebar.dataset.state = open ? "open" : "closed";
    trigger.setAttribute("aria-expanded", String(open));
    if (backdrop) backdrop.hidden = !open;
    document.body.dataset.siteSidebar = open ? "open" : "";
  };

  trigger.addEventListener("click", () => {
    setOpen(sidebar.dataset.state !== "open");
  });
  if (backdrop) backdrop.addEventListener("click", () => setOpen(false));
  // Tapping a nav link inside the drawer dismisses it so the destination
  // page paints without the drawer overlaying it.
  sidebar.addEventListener("click", (e) => {
    if (e.target.closest("a.sidebar__button")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.dataset.state === "open") setOpen(false);
  });
})();

// Mobile ToC auto-close on link click. The sticky drawer would otherwise
// cover the heading the user just jumped to. Defer one tick so the anchor
// scroll fires first, then ask the framework's Collapsible to close.
document.addEventListener("click", (e) => {
  const link = e.target.closest(".site-toc-mobile a.site-toc__link");
  if (!link) return;
  const region = document.getElementById("site-toc-mobile-body");
  if (!region || !window.Stisla?.Collapsible) return;
  setTimeout(() => {
    window.Stisla.Collapsible.getOrCreate(region).close();
  }, 0);
});

// ToC active-section highlight. Watch every heading[id] inside the main
// content; the one closest to the top of the viewport (within a band that
// reaches a third of the way down) gets aria-current="true" on its ToC
// link. The page renders the same ToC twice — desktop rail + mobile
// &lt;details&gt; — so we collect links from every .site-toc on the page.
// Skip silently if the page has no ToC nav (e.g. short pages).
(function wireTocHighlight() {
  const tocs = document.querySelectorAll(".site-toc");
  if (!tocs.length) return;
  const headings = document.querySelectorAll(
    ".main-container h2[id], .main-container h3[id]",
  );
  if (!headings.length) return;

  const linksFor = new Map();
  tocs.forEach((toc) => {
    toc.querySelectorAll("a.site-toc__link").forEach((a) => {
      const id = decodeURIComponent((a.getAttribute("href") || "").slice(1));
      if (!id) return;
      if (!linksFor.has(id)) linksFor.set(id, []);
      linksFor.get(id).push(a);
    });
  });

  let activeId = null;
  const setActive = (id) => {
    if (id === activeId) return;
    if (activeId) linksFor.get(activeId)?.forEach((a) => a.removeAttribute("aria-current"));
    activeId = id;
    if (activeId) linksFor.get(activeId)?.forEach((a) => a.setAttribute("aria-current", "true"));
  };

  // Track which headings are above the trigger line (~ top third of the
  // viewport). The last one above wins — that's the section currently being
  // read. Falls back to the first heading when the page is scrolled to the
  // very top.
  const visible = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      // Pick the topmost visible heading; if none visible, pick the
      // closest one above the viewport.
      const ids = Array.from(headings, (h) => h.id);
      let pick = ids.find((id) => visible.has(id));
      if (!pick) {
        const above = ids.filter((id) => {
          const el = document.getElementById(id);
          return el && el.getBoundingClientRect().top < 0;
        });
        pick = above[above.length - 1] || ids[0];
      }
      setActive(pick);
    },
    { rootMargin: "0px 0px -66% 0px", threshold: 0 },
  );
  headings.forEach((h) => io.observe(h));
})();

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

// data-demo-select-rows — wire a checkbox column into a working row-selection
// pattern. The header <thead>'s checkbox is the bulk toggle (with indeterminate
// state when the selection is partial); each tbody checkbox flips
// data-state="active" on its row (V3.md §3.6, matches the .table CSS hook). A
// descendant [data-demo-select-count] gets its text replaced with the current
// selection count, so the "<n> of <total> selected" headline ticks live
// without a per-demo handler.
// <table data-demo-select-rows>…<tbody>… <tr><td><input class="checkbox" type="checkbox" …></td>… </tr> …</tbody></table>
document.addEventListener("change", (e) => {
  const input = e.target.closest(".checkbox");
  if (!input || input.type !== "checkbox") return;
  const root = input.closest("[data-demo-select-rows]");
  if (!root) return;

  const head = root.querySelector("thead .checkbox");
  const bodyBoxes = Array.from(
    root.querySelectorAll("tbody .checkbox"),
  );

  const setRowActive = (tr, on) => {
    if (!tr) return;
    if (on) tr.dataset.state = "active";
    else delete tr.dataset.state;
  };

  if (input === head) {
    bodyBoxes.forEach((cb) => {
      cb.checked = head.checked;
      setRowActive(cb.closest("tr"), head.checked);
    });
  } else {
    setRowActive(input.closest("tr"), input.checked);
  }

  const selected = bodyBoxes.filter((cb) => cb.checked).length;
  if (head && head !== input) {
    head.checked = selected === bodyBoxes.length && bodyBoxes.length > 0;
    head.indeterminate = selected > 0 && selected < bodyBoxes.length;
  }

  // Update an associated count in a sibling/ancestor — typically a toolbar
  // outside the table, so search from the table's parent .card or section.
  const scope = root.closest(".card, section") || root.parentElement;
  scope?.querySelectorAll("[data-demo-select-count]").forEach((el) => {
    el.textContent = String(selected);
  });
});

// data-demo-loading="<ms>" — toggle .btn-loading on click, auto-clear after the given duration.
// <button class="btn btn-primary" data-demo-loading="2000">Click to save</button>
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-demo-loading]");
  if (!target || target.classList.contains("is-loading")) return;
  const ms = parseInt(target.dataset.demoLoading, 10) || 1500;
  target.classList.add("is-loading");
  target.setAttribute("aria-busy", "true");
  target.setAttribute("disabled", "true");
  setTimeout(() => {
    target.classList.remove("is-loading");
    target.removeAttribute("aria-busy");
    target.removeAttribute("disabled");
  }, ms);
});
