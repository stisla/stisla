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

- [x] **Package layout** — `@stisla/css` (universal CSS + SCSS source) +
  `@stisla/vanilla` (vanilla JS impl). Two scoped packages, single tree, no
  monorepo tools — matches V3.md §2 row 60 and §3.11. Staged under
  `packages/*` from one root build.
- [x] **`exports` maps** — each package exposes its pre-compiled bundle as
  the default subpath, `./full` for the full kitchen-sink bundle,
  `./components/<name>` per individual optional component, plus raw-source access
  (`./scss/*` for SCSS forking, `./src/*` for tree-shakable ESM).
- [x] **Smoke test** — `npm run smoke:packages` builds, packs, installs both
  tarballs into a temp consumer, and resolves every declared export subpath
  + verifies the dist's internal chunk imports point at real files.
- [ ] **Beta.2 publish** — manual flow (see "Publish workflow" below). No
  changesets yet; lockstep version across both packages means one bump per
  release in each `packages/*/package.json` + root `package.json`.
- [ ] **Working-page smoke** — fresh project that imports both packages and
  renders a working button + dialog in a real browser. Punted from the unit
  smoke; needs CI infra or manual run.

### Publish workflow (beta.2, manual)

```bash
# 1. Bump version in three places (root + both sub-packages):
#    package.json, packages/css/package.json, packages/vanilla/package.json
#    Keep them in lockstep — peerDeps from @stisla/vanilla pin @stisla/css exactly.

# 2. Build + smoke.
npm run smoke:packages   # build → pack → install → resolve every export

# 3. Publish from each subdirectory.
cd packages/css     && npm publish --access public
cd ../vanilla       && npm publish --access public

# 4. Tag the release.
git tag v3.0.0-beta.2 && git push --tags
```

`build:packages` stages `site-dist/assets/*` (Vite output) plus the raw
`src/scss/` and `src/js/` trees into `packages/css/` and `packages/vanilla/`.
The Vite build is the single source of truth for both — no per-package build
configs to drift.

See `project_distribution_model` memory: 3.0.0 primary surface is the
pre-compiled `stisla.{css,js}` + `stisla-full.{css,js}` bundles. Per-component
files come *after* the package layout is decided here.

---

## Phase D — Installation + Optimization

Unblocked by Phase C.

- [x] **Installation page** — `src/site/pages/installation.njk`. npm install
  for `@stisla/css` + `@stisla/vanilla` (peerDep lockstep), pre-compiled
  bundle imports (default, `/full`, `/components/<name>`), CDN snippet,
  Sass-source forking path. Cross-links to `/optimization` for the recipe.
- [x] **Optimization page** — `src/site/pages/optimization.njk`. Three
  levers: PurgeCSS / LightningCSS purge against rendered HTML, fork
  `stisla.scss` and drop component imports, change Sass-level knobs
  (breakpoints, baked tokens). Worked example with real before/after:
  41 → 7 components saves ~64 KB raw / ~13 KB gz.

---

## Out of scope for this plan

- New components (Phase 2 is complete)
- React / Vue / Base UI ports (post-3.0.0 stable)
- Search (algolia / pagefind) — nice-to-have, not gating beta.2
