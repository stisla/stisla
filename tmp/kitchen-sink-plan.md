# Kitchen sink page — planning doc

A scratchpad for a bare `/kitchen-sink` page that renders every Stisla
component in one frame. Delete this file once the page lands.

## What it is

One page, no prose, no navigation chrome. Every component, every variant,
every state, packed into compact rows under one root wrapper. Reads as a
giant pattern board.

## Why we need it

Theme tuning is the use case. When we change `--st-primary`, `--st-radius`,
`--st-shadow`, `--st-border-width`, or apply a preset like `.preset-brutalist`,
we want to see the result against the whole system in one scroll. Today
that means visiting fifty component pages and remembering what each one
looked like before. The kitchen-sink page makes regression visual and
instant.

Concrete cases:

- **Preset previews.** Wrap the whole page in `.preset-brutalist` (or any
  other preset class) and confirm every surface picks the look up. Today
  the `/customization` brutalist showcase covers a handful of components;
  the kitchen sink covers all of them.
- **Brand color swaps.** Set `--st-primary` at `:root` (or via inline
  override) and confirm every primary-toned surface retints together
  through `color-mix`.
- **Density and radius sweeps.** Toggle `--st-density` between 0.875 /
  1 / 1.125 and `--st-radius` between 0 / 0.75rem / 1rem. Catch padding
  collapses, hard-coded heights, and corner mismatches across the whole
  set.
- **Dark mode regressions.** Flip the theme toggle. Spot any surface still
  reading a literal color, any focus ring without contrast, any shadow
  that disappears against the dark surface.
- **Cross-component visual rhythm.** Stack components that usually live
  apart (alert above card above input above table) and check the spacing,
  type scale, and border weight read as one family.

## What it isn't

Not a docs page. No headings explaining the components, no usage prose,
no API tables. The component pages already do that. This page is a
stress-test board.

Not a Storybook replacement. Storybook isolates one component per panel
with controls. The kitchen sink is the opposite: every component side by
side under one shared scope so the theme reads as a whole.

## Suggested layout

One section per component family, dense rows of variants. Rough order:

1. **Buttons.** Every tone × every shape × every size, side by side. Plus
   loading, disabled, pressed states.
2. **Form controls.** Input, textarea, select, checkbox, radio, switch,
   toggle, toggle-group, slider. Each at sm / default / lg, with focused
   / invalid / disabled states.
3. **Surfaces.** Card, alert (every intent), badge (every intent), kbd,
   item, list-group, separator, link.
4. **Navigation.** Navbar, sidebar (a short version), breadcrumb,
   pagination, tabs, dropdown (rendered open).
5. **Overlays.** Dialog, drawer, popover, tooltip, toast. All rendered
   inline with `data-state="open"` and `position: static` where needed
   so they sit in document flow.
6. **Media and data.** Avatar, avatar-group, carousel (small), table,
   accordion, progress, meter, spinner, placeholders.
7. **Typography and prose.** `<h1>`-`<h6>`, `.prose` block with paragraphs,
   lists, blockquote, inline code, `<kbd>`, table.
8. **Utilities sanity row.** A short strip showing `.fs-*`, `.fw-*`,
   `.gap-*`, `.bg-surface-*`, `.rounded-*` so we catch breakage there too.

Each section should fit in one or two compact rows. Goal is the whole
page is scrollable in under thirty seconds.

## How it differs from the existing pages

| Page | What it does |
| --- | --- |
| `/customization` | Token reference, override worked examples, three preset demos |
| `/typography`, `/utilities` | Per-surface reference |
| `/button`, `/card`, ... | Per-component reference, full demos, API tables |
| `/kitchen-sink` (new) | Every component, no prose, theme stress-test |

## URL and visibility

Route at `/kitchen-sink`. Linked from the Prologue group in the sidebar
(or near the bottom, between Contributing and the component groups).
Public, not behind a flag. Useful enough to deploy with the site.

## Implementation

One `.njk` template at `src/site/pages/kitchen-sink.njk`. No new
components. Every demo block uses the canonical markup from the existing
component pages, just packed denser. Should compile to a single
self-contained page in well under 500 lines.

Optional: a small controls strip pinned to the top of the page with
buttons for "Default / Brutalist / Soft" preset wrappers and a density
slider, so the reader can flip presets without leaving the page. This is
a nice-to-have; the page is useful with or without it.

## Open questions

- Single page or one page per family with anchor jumps? Single page is
  the point (everything at once), but it might be heavy. Start single,
  split if scroll perf is a problem.
- Include optional components (carousel, scroll-area) inline or behind a
  toggle? Include inline. They're loaded on the docs anyway.
- Include `.preset-brutalist` as a default wrapper or leave the page
  bare? Leave bare. Presets become a top-strip control later if we want
  one-click switching.
