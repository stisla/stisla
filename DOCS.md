# Stisla v3 Docs Site — Plan

Tracking doc for the remaining docs-site work before 3.0.0 stable. Component
demo pages are done; what's left is the chrome, the missing content pages,
and the NPM-package story that the Installation page depends on.

Current docs shell (as of writing):
- `src/site/layouts/base.njk` — sidebar (16rem, sticky) + main (max 48rem, centered)
- `src/site/styles/site.scss` — `.site-layout` flex frame, no responsive rules
- No right rail, no ToC, no sponsor slot, no mobile handling
- Per-component pages: 39 demo pages in `src/site/pages/`
- Missing pages: Home (`index.njk` is a stub), Installation, Contributor

---

## Phase A — Docs shell (responsive + ToC + sponsor)

One layout pass on `base.njk` + `site.scss`. All three items below share the
same grid decision, so doing them separately means re-doing the layout three
times.

- [ ] **Responsive sidebar** — collapse to off-canvas drawer below the
  sidebar breakpoint; hamburger in a top bar; sticky sidebar restored on
  ≥ md. Reuse `.sidebar` + `.drawer` primitives the framework already ships.
- [ ] **Right-rail ToC** — third column on ≥ lg, extracted at build time.
  Approach: enable `markdown-it-anchor` on the markdown plugin so `h2/h3`
  get stable IDs; add an 11ty filter that walks the rendered page HTML and
  emits a nested `<ul>` of `{id, text, level}`. Sticky position, highlights
  active section via IntersectionObserver. Hidden below lg.
- [ ] **Kredibel sponsor slot** — `<aside class="site-sponsor">` directly
  below the ToC in the right rail. Logo + short blurb + outbound link.
  Driven from `site.data.json` (or similar) so the slot is data-not-markup.

Grid sketch (≥ lg): `16rem [sidebar] 1fr [content, max 48rem centered] 16rem [toc + sponsor]`.
Below lg: ToC hidden, sponsor moves to page footer. Below md: sidebar becomes drawer.

**Acceptance:** all 39 component pages render correctly at 320 / 768 / 1024 / 1440.
ToC populates on any page with two or more `h2`s. Sponsor visible at ≥ lg.

---

## Phase B — Content pages (Home + Contributor)

Unblocked by Phase A. Installation lives in Phase D because it depends on the
NPM package shape.

- [ ] **Home (`index.njk`)** — hero, what Stisla is (design spec, many
  impls — see `project_vision_design_spec` memory), v3 status, links to
  Installation / Customization / Components, dark/light toggle visible.
- [ ] **Contributor** — how the repo is structured (`src/scss`, `src/js`,
  `src/site`), running locally (`npm run dev`), how to add a component
  (mirror the demo-page convention — see `feedback_component_pages` memory),
  how to add a customization variable (see `feedback_customization_table`).

---

## Phase C — NPM packages

Biggest engineering item. Blocks Phase D.

- [ ] Decide package layout. Likely options:
  - Single `@stisla/core` with subpath exports (`@stisla/core/button`,
    `@stisla/core/scss/components/button`)
  - Multiple packages under a scope (`@stisla/button`, `@stisla/dialog`, …)
- [ ] Wire `package.json` `exports` map so individual SCSS partials and JS
  modules can be imported standalone. Goal: users can fork `stisla.scss` and
  drop `@use`s to shrink the bundle.
- [ ] Publish workflow (changesets or similar; manual `npm publish` for
  beta.2).
- [ ] Smoke test: a fresh project that installs only what it needs and
  produces a working button + dialog.

See `project_distribution_model` memory: 3.0.0 primary surface is the
pre-compiled `stisla.{css,js}` + `stisla-full.{css,js}` bundles. Per-component
files come *after* the package layout is decided here.

---

## Phase D — Installation + Optimization

Unblocked by Phase C.

- [ ] **Installation page** — CDN snippet, NPM install, both the
  zero-config bundle path and the "fork `stisla.scss`" path. Cross-link the
  Sass advanced guide.
- [ ] **Optimization page** (or a section on the Sass guide) — how to purge
  unused CSS (PurgeCSS / LightningCSS / Tailwind-style content scanning
  against rendered HTML), how to drop unused components by editing
  `stisla.scss`, how to change breakpoint sizes / tokens at the Sass entry
  point. Real before/after byte counts.

---

## Out of scope for this plan

- New components (Phase 2 is complete)
- React / Vue / Base UI ports (post-3.0.0 stable)
- Search (algolia / pagefind) — nice-to-have, not gating beta.2
