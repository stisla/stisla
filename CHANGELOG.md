# Changelog

For Stisla 2.x changes, see [getstisla.com](https://getstisla.com).

## [3.0.0-rc.2] — 2026-07-05

Additive accessibility refinements only. No token, class, or modifier changes, so the `rc.1` API freeze holds and the RC soak window is not reset.

### Fixed

- **carousel** — off-screen slides now carry `aria-hidden` + `inert`, so a screen reader reaches only the active slide and keyboard users can't Tab into hidden content. A visually-hidden polite live region announces the active slide ("Slide N of M") on change, and stays silent during autoplay (per the APG carousel pattern). Covered by `tests/keyboard/carousel.spec.ts`.

## [3.0.0-rc.1] — 2026-07-05

The first release candidate. **The public API is now frozen.** `--color-*` tokens, the lone `--st-border-width` custom, component class names, and the intent-based modifiers (`--seamless`, `--grid`, `--animated`, `--pill`, `--circle`, `--soft`, etc.) are locked for the 3.0 line. Any rename after this point resets the RC clock. The 2026-07-02 modifier sweep was the last allowed breaking rename.

Published packages: `@stisla/css`, `@stisla/style`, `@stisla/vanilla`, under the npm `rc` dist-tag.

### Changed

- Version bumped to `3.0.0-rc.1` across the shipping packages.
- `@stisla/vanilla` no longer declares a hard peer on `@stisla/css`. Vanilla only toggles classes and aria, so the peer fired spurious warnings for CDN and `@stisla/style`-subset consumers. This reconciles npm with the source tree (the removal was committed back at `932f713`; npm forbade republishing over `beta.10`, so this bump carries it).

### Not published

- `@stisla/react` is marked private. It is example-only (`button` + `sidebar`) until the real React sweep (ROADMAP Phase 8). It stays in the workspace so docs build, but is excluded from `pnpm release`, mirroring `@stisla/vue`.

## [3.0.0-beta.7] — 2026-06-18

Drops the `.stack` and `.inline` layout primitives from the vanilla implementation. The modifier surface (`--gap-*`, `--align-*`, `--justify-*`) only reskinned utilities the consumer was already composing directly; in vanilla the abstraction added a layer without adding power. Layout primitives are now a per-implementation choice — the React port will ship `<Stack>` / `<Inline>` because typed props and JSX make them worthwhile.

### Removed

- `_stack.scss`, `_inline.scss` and their imports from `bundles/stisla.scss`.
- `pages/stack.njk` and `pages/inline.njk`. Sidebar Layout entries gone.
- The `Primitive` family in `SPEC.md §13` catalogue (stack and inline were its only members).
- The "Layout primitives carry intent" subsection in `SPEC.md §9`. Replaced with one paragraph noting that primitives are per-impl and that the vanilla impl doesn't ship them.
- `.stack--block` and `.inline--block` modifiers (the primitive shapes themselves are gone, so the modifiers go too). Component `--block` modifiers (`.btn--block`, `.card--block`, etc.) stay.

### Changed

- 30 demo pages and partials reverse-migrated. Stack/inline class compositions become the equivalent flex utility composition: `stack stack--gap-3` → `d-flex flex-column gap-3`, `inline inline--gap-2 inline--align-center` → `d-flex flex-wrap align-items-center gap-2`, `stack--block` → `w-100`, `stack--md-inline` → `flex-md-row`. The `inline` default of `align-items: center` is preserved by adding that class explicitly when no other align modifier was set.
- `utilities.njk` Sizing section drops the `.stack--block` and `.inline--block` references from the component `--block` list.

### Why

Two reasons, both raised explicitly:

1. In vanilla CSS, the primitive modifiers duplicated the utility surface. `<div class="stack stack--gap-3 stack--align-center">` and `<div class="d-flex flex-column gap-3 align-items-center">` describe the same thing; the first form added a BEM facade without adding capability.
2. React still wants the primitives. `<Stack>` and `<Inline>` carry typed props (`gap={3}`, `align="center"`) that the JSX layer can validate, and the component boundary is the natural place to encode intent. That's a per-implementation benefit, not a spec mandate.

## [3.0.0-beta.6] — 2026-06-18

Final cut release. The background group goes too, completing the SPEC.md §9 rule. Also fixes a stale hypothetical in the docs philosophy.

### Removed

- `background` group (`.bg-transparent`, `.bg-background`, `.bg-surface`, `.bg-surface-2`, `.bg-surface-3`). The earlier "neutral background tiers stay alive" carve-out didn't hold up. The actual uses across the demo pages were all surface-chunk wrappers, the same anti-pattern padding and border were dropped for.

### Changed

- 42 `.bg-surface{,-2,-3}` class instances across `inline.njk`, `kitchen-sink.njk`, `stack.njk`, and `utilities.njk` migrated to inline `style="background-color: var(--st-surface-N)"`. Visuals unchanged.
- `utilities.njk` philosophy paragraph rewritten. The previous version read as a hypothetical ("If `.bg-* + .border-* + ...` all ship..."), which was confusing now that the cut has actually landed. The new prose describes what shipped before and why it stopped shipping.
- Surface section deleted from `utilities.njk`. Background section, demo, and the bg-* row in the All groups table all gone.
- `SPEC.md §9` updated: "neutral background tiers" removed from the kept-utilities list. The dropped table now names `.bg-*` as component-only.

### Final utility surface

After this release, the kept utility groups are:

`text-color`, `font-weight`, `font-size`, `text-wrap`, `text-align`, `visually-hidden`, `display`, `position`, `overflow`, `flex-fill`, `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-self`, `order`, `gap`, `margin`, `width`, `height`, `max-size`.

The dropped groups are `padding`, `border`, `rounded`, `background`. All four are component-shape properties per SPEC.md §9.

## [3.0.0-beta.5] — 2026-06-18

Continues the beta.4 reframe. Cuts the component-shape utilities (padding, border, rounded) that beta.4 left in. These are the second half of the rule the new SPEC.md §9 names. Background stays alive because only the neutral surface tiers ship there.

### Removed

- `padding` group (`.p-*`, `.pt-*`, `.pb-*`, `.ps-*`, `.pe-*`, `.px-*`, `.py-*` and their responsive variants). Padding builds a component's shape; it doesn't ship as a free-floating utility.
- `border` group (`.border`, `.border-0`, `.border-top`, `.border-bottom`, `.border-start`, `.border-end`, the `-0` directional variants).
- `rounded` group (`.rounded`, `.rounded-0`, `.rounded-sm`, `.rounded-lg`, `.rounded-pill`, `.rounded-circle`).
- `$padding-axes` Sass map (no consumers after the cut).

### Changed

- 11 demo pages and partials migrated. The cut classes became inline `style` with density-aware padding values (`calc(0.25rem * var(--st-density))` and so on), so the visual rendering stays exactly the same.
- `_utilities.scss` shrinks by ~90 lines as the dropped emission blocks come out. The compiled bundle drops ~1,000 lines (11,117 → 10,051) from the responsive padding variants alone.
- `utilities.njk` Margin section drops the padding row; the Surface section drops the Border and Rounded subsections; the All groups and Responsive variants tables drop the cut rows.

### Migration

For each pattern, the new home:

- A consumer that needs padding on a component → use the component&rsquo;s built-in padding (cards, alerts, items, buttons all pad themselves) or write a project-scoped class.
- A consumer that needs a one-off padded wrapper → inline `style="padding: calc(0.75rem * var(--st-density))"` (or the literal rem value if density-awareness doesn&rsquo;t matter).
- A consumer that needs a bordered region → inline `style="border: var(--st-border-width) solid var(--st-border)"` or a project-scoped class.
- A consumer that needs rounded corners on a non-component element → inline `style="border-radius: var(--st-radius)"`.

The rule in SPEC.md §9 is unchanged from beta.4: utilities cover container properties; component-shape properties belong to a component, a variant, the `customize` surface, or honest inline `style`.

## [3.0.0-beta.4] — 2026-06-18

Reframe release. Walks back the "placement, not appearance" rule from beta.3 because it didn't survive scrutiny. Most utilities come back; a smaller, more honest cut stays on the books for the next release.

### Added (kept from beta.3)

- `.stack` and `.inline` layout primitives ship as additive alternatives to the flex utilities. Same modifier surface as before (`--gap-*`, `--align-*`, `--justify-*`, `--block`, responsive variants, `.stack--{bp}-inline` direction flip).
- Component `--block` modifiers stay: `.btn--block`, `.card--block`, `.list-group--block`, `.tabs--block`, `.navbar--block`, `.meter--block`, `.progress--block`. The canonical replacement for `.w-100` on a known component shell.

### Restored from beta.3

The utility groups dropped in beta.3 are back. The new rule covers them.

> Utilities cover container properties that affect how content renders or where it sits: text styling, alignment, margin, display, position, overflow, flex behaviour, gap, max-size, and neutral background tiers. They don't cover component-shape properties: intent backgrounds, border, radius, padding, shadow.

Restored groups:

- `text-color` (`.text-foreground`, `.text-muted-foreground`, `.text-primary`, `.text-success`, `.text-warning`, `.text-danger`, `.text-info`)
- `font-weight` (`.fw-light`, `.fw-normal`, `.fw-medium`, `.fw-semibold`, `.fw-bold`)
- `font-size` (`.fs-1` through `.fs-7`, with responsive variants)
- `text-wrap` (`.text-nowrap`, `.text-truncate`, `.text-break`)
- `flex-direction`, `flex-wrap`, `justify-content`, `align-items`
- `gap` (with `.row-gap-*` and `.column-gap-*`)
- `.d-flex` and `.d-inline-flex` (the rest of `display` was never cut)

### Removed

- `.text` primitive (`scss/components/_text.scss`). The size, colour, weight, and wrap modifiers it exposed turned out to be category errors. Font-size on a `<div>` cascades into descendants; `text-align` positions every form of inline content; weight and colour are container properties that inherit. Forcing `.text` as a parent class for any of those reads as "the host element is a piece of text," which is wrong for most containers. The utility form (`.fs-2`, `.fw-medium`, `.text-muted-foreground`, `.text-truncate`) ships at the class level, which is where these properties belong.

### Still deferred

The component-shape utilities (`padding`, `border`, `rounded`, intent backgrounds) are still in the bundle. The next release cuts them and migrates the demo pages to component-local padding modifiers, inline `style`, or project-scoped classes.

### Why the walk-back

The beta.3 rule ("placement, not appearance") didn't survive a closer look. Two threads converged:

1. **Text-styling is a container property.** Colour, size, weight, wrap, alignment all apply to the element and inherit through descendants. They work on `<div>`, `<th>`, `<card>`, any container. Forcing them through a `.text` BEM block created category errors everywhere.
2. **Stack and inline don't cover every flex case.** Row-reverse, column-reverse, wrappers around third-party widgets, custom flex setups all need raw utilities. Dropping `.d-flex` and the flex utilities removed legitimate tools.

The new rule replaces "placement, not appearance" and keeps the actual structural distinction: utilities for container properties (which work on any element and don't build a new shape), components for shape (background, border, radius, padding, shadow).

## [3.0.0-beta.3] — 2026-06-18

The "placement, not appearance" release. Three layout primitives ship as the new home for what utilities used to do, and the utility set shrinks to placement-only.

### Added

- `.text` primitive (`scss/components/_text.scss`). Single styled item with size, colour, weight, and wrap modifiers (`.text--xs`/`.text--sm`/`.text--md`/`.text--lg`/`.text--xl`/`.text--2xl`/`.text--3xl`, `.text--foreground`/`.text--muted`/`.text--primary`/`.text--success`/`.text--warning`/`.text--danger`/`.text--info`, `.text--light`/`.text--normal`/`.text--medium`/`.text--semibold`/`.text--bold`, `.text--nowrap`/`.text--truncate`/`.text--break`). Replaces the dropped `.fs-*`, `.fw-*`, `.text-*` colour, and `text-wrap` utilities.
- `.stack` primitive — vertical flex container. `.stack--gap-{0..8}`, `.stack--align-*`, `.stack--justify-*`, `.stack--block`, plus responsive variants (`.stack--md-gap-3`) and a direction-flip modifier (`.stack--md-inline`) for the rare breakpoint that has to become a row.
- `.inline` primitive — horizontal flex container that wraps. Same modifier vocabulary as `.stack` plus `.inline--justify-*` for main-axis distribution and `.inline--nowrap` to opt out of wrapping.
- Component `--block` modifiers — `.btn--block`, `.card--block`, `.list-group--block`, `.tabs--block`, `.navbar--block`, `.meter--block`, `.progress--block`. The canonical replacement for `.w-100` on a known component shell.
- `SPEC.md §9 — Utilities and layout primitives`. Codifies the "placement, not appearance" rule, the kept / dropped utility allowlist, the three primitives, and the four-step escape ramp (component variant → per-component CSS variable → inline `style` → write a real class). The component catalogue gains a `Primitive` family.

### Removed (breaking)

The following utility groups were dropped. Each entry names its replacement.

- `text-color` (`.text-foreground`, `.text-muted-foreground`, `.text-primary`, `.text-success`, `.text-warning`, `.text-danger`, `.text-info`) → `.text--foreground`, `.text--muted`, `.text--primary`, &hellip; on the `.text` primitive.
- `font-weight` (`.fw-light`, `.fw-normal`, `.fw-medium`, `.fw-semibold`, `.fw-bold`) → `.text--light`, `.text--medium`, `.text--bold`, &hellip;
- `font-size` (`.fs-1` &hellip; `.fs-7` and responsive variants) → `.text--xs`, `.text--sm`, `.text--md`, `.text--lg`, `.text--xl`, `.text--2xl`, `.text--3xl`.
- `text-wrap` (`.text-nowrap`, `.text-truncate`, `.text-break`) → `.text--nowrap`, `.text--truncate`, `.text--break`.
- `.d-flex` and `.d-inline-flex` (the rest of the `display` group stays alive) → `.inline` for horizontal, `.stack` for vertical.
- `flex-direction` (`.flex-row`, `.flex-column`, `.flex-row-reverse`, `.flex-column-reverse`) → choose `.stack` or `.inline` at the call site.
- `flex-wrap` (`.flex-wrap`, `.flex-nowrap`, `.flex-wrap-reverse`) → `.inline` wraps by default; opt out with `.inline--nowrap`.
- `justify-content` (`.justify-content-*`) → `.stack--justify-*` or `.inline--justify-*`.
- `align-items` (`.align-items-*`) → `.stack--align-*` or `.inline--align-*`.
- `gap` (`.gap-*`, `.row-gap-*`, `.column-gap-*`) → `.stack--gap-*` or `.inline--gap-*` on the primitive that owns the spacing.

### Changed

- All 36 demo pages and the docs site partials migrated to the new primitives. `utilities.njk` rewritten with the new surface plus a "Where the old utilities went" migration table.
- `$utilities-config` defaults updated to reflect the cut. Flex child-axis helpers (`flex-fill`, `align-self`, `order`) stay alive because they sit on the child and have no primitive equivalent.
- `_utilities.scss` shrinks from 426 to 342 lines as the dropped emission blocks are removed.

### Deferred to a later release

- `.w-100` on bare elements and `.w-100 .w-md-50` responsive sizing still ship as utility classes. Migration to a Box primitive comes later.
- `.d-block`, `.d-inline-block`, `.d-grid`, `.d-inline-grid`, `.d-inline` stay alive for now. They migrate to inline `style` or a Box primitive once the latter lands.
- `.align-self-*` and responsive font-size variants stay alive for the small number of edge-case uses.



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
