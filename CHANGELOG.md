# Changelog

For Stisla 2.x changes, see [getstisla.com](https://getstisla.com).

## [3.0.0-beta.2] — 2026-06-15

Incremental release. Six new components, RTL via logical properties, a unified field family, the documentation site, and the npm publish pipeline.

### Added

- Components: `avatar`, `avatar-group`, `meter`, `scroll-area`, `item`, `separator`. `.card > .item--flush` retunes its padding to `--card-padding` so item stacks read flush inside a card.
- RTL via CSS logical properties. `inline-start` / `inline-end` swap automatically under `dir="rtl"`; no `[dir="rtl"]` overrides needed.
- Documentation site at https://stisla.dev: landing, intro, install, optimization, JavaScript, spec, contributing, and a page per component. Build-time table of contents and a partners section.
- `SPEC.md` — the cross-implementation contract every Stisla port must satisfy. Lives alongside per-component `spec/components/<name>.md` files.
- Preflight spec section documenting the modern-normalize + reboot layer.

### Changed

- `.form-label` and `.field-row` unified into the `.field` BEM family. One component owns the label / control / help cluster instead of two cooperating ones.
- `src/scss/integrations/` flattened into `src/scss/components/`. Bundle tier (core vs full) is a per-bundle decision, not a source-tree shape.

### Build

- `@stisla/css` + `@stisla/vanilla` publish pipeline. Pre-compiled bundles ship as the primary install surface; Sass source is the advanced path.

## [3.0.0-beta.1] — 2026-06-13

Stisla v3 is a complete rewrite. No migration path from 2.x.

### Foundation

- Bootstrap dropped. No jQuery, no Bootstrap JS, no `--bs-*` Sass vars. BS5's grid + breakpoint mixins forked and credited under `LICENSES/`; everything else is hand-written.
- modern-normalize vendored; thin Stisla reboot built on top.

### Theme

- 30 OKLCH `--st-*` tokens — the entire customization surface. Every background-providing token has a paired `-foreground`. State derivation via `color-mix(in oklch, …)`; no per-state vars.
- No spacing ramp. Components own padding as `calc(N * var(--st-density))` literals; density is the one global lever.
- Dark mode via `[data-theme="dark"]` or `.dark`.

### Components

33 core components on the v3 model. Forms split into per-element classes (input, select, textarea, checkbox, radio, switch, form-label, field-row, input-group) sharing form-control's surface. Tabs and toggle-group cover the segmented-control / tab-strip space; nav, nav-tabs, nav-pills are gone. Carousel ships as the first integration component.

### JavaScript

- Vanilla impl built on `@floating-ui/dom`, `focus-trap`, `tabbable`, `embla-carousel`. ~28 KB gz core.
- `Stisla.{Component}` classes with `.destroy()` + DOM custom events; declarative `Stisla.init()` walks `[data-stisla-*]`.
- State hooks: `[data-state]` for Radix-aligned concepts, `.is-*` for Stisla-original.

### Distribution

- `stisla.{css,js}` (core), `stisla-full.{css,js}` (core + integrations), `integrations/<name>.{css,js}` (à la carte per integration).
- Pre-compiled bundles are the primary install surface. Sass source is the advanced path for custom builds + breakpoint overrides.

### Browser support

Safari 16.4+, Chrome 111+, Firefox 121+. No polyfills.
