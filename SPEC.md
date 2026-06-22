# Stisla — Spec

> The cross-implementation contract. The spec defines *what* a Stisla
> component is; an implementation defines *how* one environment realises it.
> Implementations conform to this document; this document does not describe
> any one of them.

V3.md is the build journal for the current reference implementation. SPEC.md
is the contract every implementation must satisfy. Update this file when the
contract changes; update V3.md when an implementation milestone changes.

---

## 1. What Stisla is

Stisla is a design specification. It defines a visual identity (tokens,
shapes, motion), a class system (BEM), a runtime state contract (data
attributes + a small `.is-*` set), and per-component anatomy + a11y
requirements. The spec is framework-agnostic.

Stisla is **not** a Bootstrap skin, a Radix/Base UI port, or a
component library tied to one framework. Stisla *uses* primitive libraries
to deliver interactive behaviour in each environment, but the spec is
sovereign: Stisla decides what its components are; primitive libraries
decide how a given JS environment satisfies the behaviour pieces.

The inversion vs other libraries:

- **shadcn** styles Radix. Radix is the contract; shadcn ships good
  defaults you copy in.
- **Stisla** styles itself. Stisla is the contract; each implementation
  picks the primitive library that fits its environment (vanilla code, Base
  UI for React, Reka UI for Vue, bits-ui for Svelte) and wires it to satisfy
  the spec.

A consequence: Stisla implementations expose **Stisla's anatomy**, not the
backing primitive's. An implementation may wrap a backing primitive's
anatomy internally, but the exported component surfaces Stisla's parts
per the per-component contract in `spec/components/`. Consumers learn
Stisla's anatomy once and carry it across implementations.

A second consequence: an implementation ships only what the spec defines.
A primitive library may offer a much larger catalogue than Stisla's spec;
the implementation does not expose a primitive just because it exists.
Stisla uses the subset of any primitive library that backs spec'd
components, and nothing more.

## 2. Spec vs implementation

The spec describes **what** a Stisla component is and (sometimes) **why**
it is that way. The **how** belongs to each implementation. If a spec
file ever describes the way one implementation realises something — a
specific library, a prop name, an event mechanism — it has overstepped.

| Lives in the spec | Lives in an implementation |
| --- | --- |
| The `--st-*` token surface and what each token means | Token loading (CSS file shipped, CDN URL, npm path) |
| BEM class names and the visual styling those classes produce | DOM emission (JSX, templates, hand-written markup) |
| State attribute conventions (`[data-state]`, `.is-*`) | How state is toggled (own code, a primitive library, signals, hooks) |
| Per-component anatomy (parts, classes, parent-child relationships) | Component composition surface (slots, sub-components, props) |
| Per-component required behaviour (open, close, dismiss, scroll lock, focus trap) | Mechanism choice for that behaviour (which focus-trap library, which dismiss API) |
| Per-component knobs (which options exist, what they control) | Option naming and API shape (`keyboard` vs `onEscapeKeyDown`, hook vs class API) |
| Per-component lifecycle events (which phases must be observable) | Event mechanism (DOM CustomEvent, prop callback, signal, store) |
| A11y requirements (roles, ARIA, keyboard interactions) | A11y wiring (own code attaching ARIA; primitive library doing it) |
| Browser support targets | Polyfills, build-tool support, SSR considerations |

The spec does **not** prescribe:

- Which primitive library backs each component in each implementation
- File names, npm package names, or module paths
- Whether components are class-based or hooks-based, controlled or
  uncontrolled, slotted or composed
- Bundle splitting decisions (core vs optional) — those are per-impl

Implementations are free where the spec is silent.

## 3. Implementations

Each implementation is a separately-released package that conforms to this
spec for a specific environment. Implementations are peers; none is
canonical. Today there is one (vanilla); others are roadmap.

The spec is silent on which primitive library each implementation picks,
what its API surface looks like, and how it wires the contract internally.
The roster below names the planned implementations and their package
identifiers so readers can find them; what each one uses to satisfy the
contract is documented in that implementation's README, not here.

| Environment | Package |
| --- | --- |
| Vanilla (plain HTML / Rails / Django / Laravel / similar) | `@stisla/vanilla` |
| React | `@stisla/base-ui` |
| Vue | `@stisla/reka` (future) |
| Svelte | `@stisla/bits` (future) |

The CSS source library is shared across implementations (§11). Each
implementation curates which component partials it ships (§12).

## 4. Token surface — `--st-*`

The customisation API. 30 root tokens, all OKLCH literals, no Sass colour
ramps anywhere. Every token usable as a `background` has a paired
`-foreground` — without this, hardcoding `color: #fff` on a primary surface
breaks the moment someone overrides `--st-primary`.

```
// Intent (10) — 5 pairs
--st-primary               --st-primary-foreground
--st-success               --st-success-foreground
--st-warning               --st-warning-foreground   (dark text — yellow stays yellow)
--st-danger                --st-danger-foreground
--st-info                  --st-info-foreground

// Surface tier (7)
--st-background            page bg
--st-foreground            body text
--st-surface               cards, dialogs, popovers, dropdowns
--st-surface-2             alt rows, card footers, accordion headers
--st-surface-3             deepest tier
--st-border
--st-muted-foreground      muted body text

// Interactional (6) — 3 pairs
--st-neutral               --st-neutral-foreground     rest fill for filled-neutral elements
--st-accent                --st-accent-foreground      hover bg (over neutral / transparent)
--st-highlight             --st-highlight-foreground   selected / current bg

// Focus (1)
--st-ring                  focus outline; defaults to --st-primary

// Geometry
--st-radius / --st-radius-sm / --st-radius-lg    0 brutalist · 0.75rem default
--st-shadow / --st-shadow-light / --st-shadow-heavy
--st-border-width                                hairline frame width; bump for heavier
--st-spacing                                     0.25rem base; space(n) = n × this

// Type (2)
--st-font-sans
--st-font-mono
```

Spacing rides one base, `--st-spacing` (0.25rem, matching Tailwind), through
the `space(n)` helper (`calc(n * var(--st-spacing))`). Padding and gaps are
component-local multiples of it; raise `--st-spacing` for a roomier system,
lower it for compact. See §10 for how component knobs read these (§5 covers
colour).

## 5. Colour model

Three systems, kept separate:

- **Intent.** Genuinely colourful. One token per intent, one paired
  foreground. State derives via `color-mix(in oklch, …)` (§6).
- **Surface / neutral.** Pure gray (`oklch(L 0 0)`) by default. Layered
  (`--st-surface`, `--st-surface-2`, `--st-surface-3`). Retint warm or cool
  by overriding tokens in a parent scope — components inherit via `var()`.
  No runtime math; new tints are new OKLCH literals.
- **Interactional trio.** `--st-neutral` for rest fill of filled neutral
  surfaces (filled neutral button, kbd, default badge, input-group addon).
  `--st-accent` for transient hover bg over neutral or transparent
  surfaces. `--st-highlight` for the persistent selected state (soft
  primary tint by default).

No colour ramps. No `$blue-100..900`. If a value is one-off, it lives as
an OKLCH literal in the component file; if it belongs to the design
language, it becomes a named root token.

"Secondary" is **not** a concept. Three distinct things deserve three
names:

| Concept | Class | Meaning |
| --- | --- | --- |
| Quieter button next to primary | `.btn--neutral` | Neutral-derived button |
| Muted body text | `.text-muted` | Reads `--st-muted-foreground` |
| Neutral alert / badge | no modifier | Intent is opt-in |

## 6. State derivation

States derive from base tokens via `color-mix(in oklch, …)`. No per-state
tokens at `:root`.

```css
.btn--primary           { background: var(--st-primary); color: var(--st-primary-foreground); }
.btn--primary:hover     { background: color-mix(in oklch, var(--st-primary) 88%, black); }
.btn--primary:active    { background: color-mix(in oklch, var(--st-primary) 78%, black); }
.btn--primary:disabled  { background: color-mix(in oklch, var(--st-primary) 50%, transparent); }

.alert--primary {
  background:   color-mix(in oklch, var(--st-primary) 7%, transparent);
  border-color: color-mix(in oklch, var(--st-primary) 40%, transparent);
  color:        var(--st-foreground);
}
```

Component families tune their own percentages. Bake them into the
component CSS. Do not surface as tokens.

`oklch` is mandatory — sRGB mixing muddies mid-saturation hues exactly
where brand colours live. Hover states for primary/info/danger look
visibly worse in sRGB.

## 7. Preflight (bare HTML by default)

A reset layer that strips default visual treatment from every HTML element before any component CSS loads. Adapted from Tailwind Preflight, applied on top of the vendored `modern-normalize`. Lives in `foundation/_reboot.scss` and reads only `--st-*` tokens.

```
* { margin: 0; padding: 0; border: 0 solid }
h1–h6                    inherit body size + weight
a                        inherits colour + text-decoration
b, strong, em, i, small  lose visual treatment
ul, ol, menu             lose markers
button, input, select…   inherit font, colour
img, svg, video…         display: block; max-width: 100%
```

After Preflight an unstyled `<h1>` is body-sized, `<strong>` reads at the surrounding weight, `<ul>` carries no bullets and no indent. Visual treatment is opt-in via classes (`.h1` for the heading scale, `.fw-semibold` for weight), and via `.prose` for long-form regions that want element defaults back.

The reasoning is structural, not stylistic.

Components start from a known floor. Their CSS expresses only what the component contributes, with no counter-rules to undo a browser default. A card footer using `<small>` does not pick up a surprise font-size. A button containing `<strong>` does not bold.

No global rule collides with a component. Anything that styles an HTML tag at the document scope is a global rule by definition, and a global rule will always reach into every component that contains the element. Preflight removes those colliders so component selectors operate on a blank slate.

Bare-element styling is allowed when scoped. `.prose` restores element defaults inside long-form regions (`.prose h2`, `.prose ul`, `.prose blockquote`). The wrapping class makes the intent explicit and the reach bounded. A future component that needs element-targeting rules does the same and wraps them under its own class. At document scope, element-targeting rules do not exist.

Narrow chrome remains where no class would ever opt in. `<mark>` keeps the highlight tint, `<abbr title>` keeps the dotted underline, `<hr>` keeps a rule in `--st-border`, `:focus-visible` keeps the ring in `--st-ring`. Every other element default is gone.

## 8. BEM + state hooks

```
.block                       component root
.block__element              part of component
.block--modifier             variant (static, set at render time)
.block[data-state="X"]       runtime state — primitive-library aligned
.block.is-state              runtime state — Stisla-original
```

**Static structure: BEM.** Lowercase, hyphen-separated. Element classes
always under the block (`.card__header`, not `.header`). Variants use
`--modifier`. Multiple modifiers compose flat on the root, not nested.

**Scope: BEM governs components only.** Files under `scss/components/`
are strict BEM. Utilities (`scss/utilities/`) and the grid + containers
in `scss/foundation/` follow flat hyphenated naming with an optional
responsive infix:

- Utilities — `.d-flex`, `.text-end`, `.gap-3`, `.mb-md-4`, `.fw-semibold`.
- Grid — `.col-md-6`, `.container-fluid`, `.row-cols-3`, `.offset-md-2`,
  `.g-md-3`, `.gx-0`.

Atomic helpers stay BS5-conventional. Forcing them into BEM
(`.text--end-md`, `.col--md-6`, `.d--flex`) breaks every consumer's
muscle memory from BS5 / Tailwind / Tachyons and models nothing the
flat form doesn't already model. Treat utilities + grid as a separate
naming family that the BEM rule above does not constrain.

**Runtime state: split by origin.**

- `[data-state="open|closed|active"]`, `[data-highlighted]`,
  `[data-disabled]`, `[data-orientation]` for states that map cleanly
  onto what mainstream JS primitive libraries emit. The same CSS then
  works whether the implementation toggles the attribute in its own code
  or inherits it from a backing primitive — no glue layer needed.
- `.is-*` for states without a primitive-library counterpart
  (`.is-loading` on `.btn`, `.is-collapsed` on `.sidebar`,
  `.is-dialog-open` on `<html>` for scroll lock).

Native pseudos win when they apply. `:disabled`, `:hover`,
`:focus-visible` are always preferred. Data-attrs / `.is-*` cover the
JS-driven cases where pseudo-classes don't.

State hook by component family:

| Family | Hook |
| --- | --- |
| Dialog, drawer, dropdown, popover, tooltip, accordion, collapsible | `[data-state="open\|closed"]` |
| Tabs, sidebar item (current page), pagination item, segmented control | `[data-state="active"]` |
| Menu item under keyboard nav | `[data-highlighted]` |
| Tab list, segmented control | `[data-orientation="horizontal\|vertical"]` |
| Button loading | `.is-loading` |
| Sidebar collapsed | `.is-collapsed` |

## 9. Utilities

The utility surface alongside components.

**Utilities cover container properties that affect how content renders or
where it sits.** Text styling (colour, size, weight, wrap), text
alignment, margin, display, position, overflow, flex behaviour
(direction, wrap, justify, align-items, gap, fill / grow / shrink,
align-self, order), and max-size all live as utilities. These properties
work on any element and don't depend on the element being a specific
kind of thing. Font-size on a `<div>` cascades into its descendants;
`text-align` positions every form of inline content, not just text.

**Utilities do not cover component-shape properties.** Intent
backgrounds, border, radius, padding, shadow. These build a new look
from scratch. Shipped as free-floating utilities, they let a consumer
assemble a card-shaped thing from prop-shaped classes and call it a
component. The component layer becomes optional and the design system
loses authority over what its surfaces look like.

Component-shape work belongs to:

- A component (write the SCSS for the visual identity)
- A component variant (`.btn--block`, `.card--flush`)
- The `customize` surface (per-component CSS-variable override, §10)
- An honest inline `style` for a deliberate one-off

Kept utility groups:

| Group | Examples |
| --- | --- |
| Margin (logical) | `.m-3`, `.mt-2`, `.ms-md-4`, `.mx-auto` |
| Text styling | `.text-muted-foreground`, `.fs-2`, `.fw-medium`, `.text-truncate` |
| Text alignment | `.text-start`, `.text-end`, `.text-center` |
| Display | `.d-flex`, `.d-block`, `.d-none`, `.d-md-block` |
| Position | `.position-relative`, `.position-sticky` |
| Overflow | `.overflow-auto`, `.overflow-x-hidden` |
| Flex container | `.flex-row`, `.flex-column`, `.flex-wrap`, `.justify-content-between`, `.align-items-center`, `.gap-3` |
| Flex child | `.flex-fill`, `.flex-grow-1`, `.align-self-end`, `.order-md-1` |
| Visibility | `.visually-hidden` |
| Sizing | `.w-100`, `.w-md-50`, `.h-100`, `.mw-100`, `.mh-100` |

Dropped utility groups and their replacement:

| Dropped | Replacement |
| --- | --- |
| `.p-3` / `.pt-2` padding | Component-internal padding, a component variant, inline `style`, or a project-scoped class |
| `.border` / `.border-primary` | Component variant or per-component CSS-variable override (§10) |
| `.rounded-pill` / `.rounded-sm` radius | Component variant or per-component CSS-variable override (§10) |
| `.shadow-sm` / `.shadow-lg` shadow | Component variant or per-component CSS-variable override (§10) |
| `.bg-*` background (neutral and intent) | Component-only. Components that need a filled surface pair their own `--st-{intent}-foreground` for contrast; consumers reach for inline `style` or a project-scoped class when a one-off surface is needed |

**Layout primitives are per-implementation.** Implementations may ship
`Stack`, `Inline`, or similar layout primitives where they add value.
React-style implementations get a typed prop surface and JSX ergonomics
from `<Stack gap={3}>` and `<Inline align="center">`. The vanilla
implementation doesn't ship them: a BEM block with modifiers like
`.stack--gap-3` would only reskin utilities the consumer already
composes directly. Consumers reach for the flex utilities (`.d-flex`,
`.flex-column`, `.justify-content-*`, `.align-items-*`, `.gap-*`) and
get the same result with one fewer abstraction.

**The escape ramp.** When the sanctioned surfaces do not cover a need,
the order is:

1. **Component variant.** A modifier such as `.btn--block` for a
   full-width button. The design system sanctions the deviation.
2. **Per-component CSS-variable override.** Each component exposes a
   scoped `--st-<name>-*` surface (§10) that tunes that one component
   without touching the rest. Implementations may wrap this in a typed
   prop (e.g. React `customize={{ … }}`); the underlying contract is
   the CSS variables.
3. **Inline `style` for a single deliberate one-off.** The consumer
   owns it. One usage, an explicit reason, no shared class quietly
   picking up an edge case.
4. **A real CSS class.** When the same one-off shows up in five places
   it has become a component. Name it, write it, ship it.

Each surface stays in its lane. A utility doing component-shape work
is the wrong tool; an inline `style` doing placement work is the wrong
tool too.

## 10. Component-scoped fallback pattern

Two tiers, no middle. Every component property reads a component-scoped
variable whose fallback default chains straight to the matching scale /
theme token — nothing is declared on the base element:

```css
.card  { border-radius: var(--card-radius, var(--st-radius-lg)); }
.btn   { border-radius: var(--btn-radius, var(--st-radius)); }
.input { border-radius: var(--input-radius, var(--st-radius)); }
```

- **Theme everything** → override the scale / theme token the defaults read
  (`--st-radius-sm/-/-lg`, `--st-shadow-light/-/-heavy`, `--st-border-width`,
  `--st-border`, `--st-spacing`, the colour palette). It cascades into every
  component default at once. A brutalist theme is a handful of these.
- **Theme one component** → set its `--<comp>-x` (on `:root` for all instances,
  or on a scope / the element for a subtree).
- **Theme a subset** ("all surfaces but not fields") → a short consumer block
  that lists those component tokens. Explicit, not a hidden grouping.

There is **no `--st-<comp>-*` middle rung** (no `--st-card-radius`,
`--st-btn-radius`). The component token *is* the per-component knob; the scale
token is the global knob. An earlier draft shipped per-family `--st-*` knobs
(`--st-surface-radius`, `--st-input-radius`, `--st-overlay-shadow`) — removed,
because the "retune the whole family" argument generalizes to every property ×
every family and the scale already covers the global case.

Border and motion follow the same shape with two knobs each:
`--<comp>-border-width` (→ `--st-border-width`) + `--<comp>-border-color`
(→ `--st-border`); `--<comp>-transition-duration` for transition timing.
Padding and margin are always two axis knobs, never bare:
`--<comp>-padding-inline` / `--<comp>-padding-block` (both → `space()`).

The fallback chain lives INSIDE the component rule, never declared on the base
or at `:root`:

```css
/* Right — the default is in the var() fallback, overridable from any scope */
.card { border-radius: var(--card-radius, var(--st-radius-lg)); }

/* Wrong — declaring the token on the element freezes it; an ancestor scope
   can no longer override it */
.card { --card-radius: var(--st-radius-lg); border-radius: var(--card-radius); }
```

Declaring `--card-radius` on `.card` resolves its value at that element, so a
wrapper scope setting `--card-radius` higher up loses. Keeping the default in
the `var()` fallback leaves the token open for any ancestor to set. (The
`tools/audit-tokens.mjs` base-declaration check enforces this.)

**`--st-radius` is outer-only.** Inner nested items (accordion items
inside a framed accordion, sidebar items inside a padded sidebar) compute
their own radius: `inner = outer - outer-padding`. Otherwise the inner
corner sits inside the outer corner and reads off-centre.

Components that opt out of `--st-radius` (shape is semantic, not stylistic):
`.badge` (pill), `.avatar` (circle), `.spinner` (must stay round), form
check (square / circle), `.slider` track + thumb, `.progress` track,
`.btn--icon-round`.

**Spacing base.** `--st-spacing` (0.25rem) is the unit every component
padding, gap, and hard `height` is built from, through the `space(n)` helper.
Raising it scales the whole system roomier; lowering it compacts. Multi-line
components opt out of a fixed height via `height: auto` + a `min-height` floor +
their own `padding-block`.

## 11. Source organisation

The CSS source library is **shared across implementations**. Each
component has one canonical `_<name>.scss` partial under
`scss/components/`. The flat layout is intentional: every spec'd
component lives in the same folder, regardless of whether an
implementation classifies it as core or optional.

```
scss/
  foundation/      normalize + reboot + grid + breakpoints + mixins
  tokens/          _theme.scss (30 OKLCH tokens — only file with literal colours)
  components/      _btn.scss, _card.scss, _dialog.scss, _carousel.scss, ...
                   _dialog.base-ui.scss      (impl-specific selector wiring)
                   _dialog.reka.scss          (added when Reka impl lands)
  utilities/       small hand-written set
  bundles/         per-impl curation entries
```

**Most partials are truly shared.** Plain BEM on plain elements works for
every implementation because there's no JS-coordinated state to differ on:
btn, badge, kbd, alert, card, link, table, form controls, input-group,
breadcrumb, pagination, progress, spinner, placeholders, list-group,
icon-box, prose, navbar (layout), sidebar (layout), app-shell, page,
slider.

**JS-coordinated partials may need per-implementation wiring.** When a
primitive library's DOM doesn't map cleanly onto the canonical selectors,
the partial splits:

```
components/
  _dialog.scss              shared visual rules — tokens, padding, colour,
                            motion, mixins, the design itself
  _dialog.vanilla.scss      vanilla DOM wiring — selectors against the
                            vanilla implementation's emitted markup
  _dialog.base-ui.scss      Base UI DOM wiring — selectors against Base UI's
                            emitted markup
```

The shared partial owns visual rules as mixins or extends; impl-suffix
partials are *only* selector wiring that calls into them. Spec changes
edit the mixin once; implementations inherit. No visual drift.

Reach for the split **only** when an impl genuinely can't satisfy the
canonical selectors. Most JS-coordinated components can — primitive
libraries broadly expose `[data-state]` on the styled element, and BEM
classes are agnostic to DOM nesting depth.

Suffix names the **primitive library**, not the framework
(`.base-ui.scss`, not `.react.scss`). Reason: a framework may host more
than one viable implementation (e.g. a `melt-ui` Svelte implementation
alongside `bits-ui`). The DOM differences live in the primitive library,
not the framework. `vanilla` is the exception since it's its own
primitive layer.

## 12. Packaging — bundle exports

One CSS package, multiple curated bundle exports. Each implementation
recommends which entry to install.

```
@stisla/css                              vanilla core bundle (default)
@stisla/css/vanilla-full                 vanilla core + every vanilla optional
@stisla/css/base-ui                      Base UI implementation's bundle
@stisla/css/reka                         Reka UI implementation's bundle (future)
@stisla/css/components/<name>            à-la-carte: any single component
```

What "core" vs "optional" means is **per-implementation**. The vanilla
implementation gates `embla-carousel` out of the default install because
it's a real dependency cost; another implementation may include carousel
in its default bundle because its primitive library backs every Stisla
component at a comparable weight. The line is a bundle decision, not a
spec decision.

The JS implementation packages are separate, one per implementation:

```
@stisla/vanilla                          vanilla JS (default = core)
@stisla/vanilla/full                     core + every optional
@stisla/vanilla/components/<name>        à-la-carte

@stisla/base-ui                          React + Base UI (full set)
@stisla/base-ui/<name>                   per-component imports
```

## 13. Component catalogue

The spec'd components, grouped by family. Optional / core classification
is per-implementation (§12) and lives in each impl's docs, not here.

- **Action.** btn, btn-group, toggle, toggle-group, dropdown, link
- **Display.** card, badge, icon-box, alert, kbd, avatar, preview-card
- **Status.** progress, meter, spinner, placeholders, toast, tooltip
- **Form.** input, select, textarea, checkbox, radio, switch, slider,
  field, input-group, otp, custom-select, autocomplete,
  combobox, command, date-picker, color-picker, file-upload
- **Navigation.** navbar, sidebar, breadcrumb, pagination, tabs, page
- **Overlay.** dialog, drawer, popover
- **Container.** accordion, collapsible, list-group, table
- **Layout.** app-shell
- **Media.** carousel

Each component has its own contract file under `spec/components/<name>.md`.
The contract names anatomy, parts, states, keyboard interactions, a11y
requirements, and token usage. Implementations test against the
per-component contract, not against any reference implementation.

## 14. A11y baseline

The spec's a11y commitments. Implementations must satisfy these; how they
satisfy them is the implementation's choice (vanilla code; Base UI / Reka
UI / bits-ui doing it for them).

- **Keyboard.** Every interactive component is reachable and operable from
  keyboard alone. Standard patterns: Tab moves between widgets; arrow keys
  move within composite widgets (menu, tabs, radio group, segmented
  control, sidebar). Escape dismisses open overlays. Enter/Space activate
  focused triggers. Specific keys per component live in
  `spec/components/<name>.md`.
- **Focus management.** Overlay components (dialog, drawer, dropdown menu)
  trap focus while open and restore focus to the invoking element on
  close. Backdrop is `inert` so AT skips it.
- **Reduced motion.** `prefers-reduced-motion: reduce` disables animated
  transitions on JS-coordinated state changes. CSS-driven transitions
  in component files honour this directly.
- **Forced colours.** `forced-colors: active` keeps borders and focus
  rings visible. No `color-mix` ghosting on outlines.
- **Roles + ARIA.** Per-component contract files name required roles,
  states, and properties. Implementations apply them; if a primitive
  library already does, the implementation does not duplicate.
- **Focus visibility.** `:focus-visible` is the universal hook for focus
  rings. Components do not style `:focus` (mouse + keyboard) since that
  shows a ring on click — only `:focus-visible`.
- **Touch field sizing.** Form-field controls (input, select, textarea,
  combobox) compute font-size ≥ 16px under `@media (pointer: coarse)`.
  iOS Safari zooms the viewport on focus when a field's computed
  font-size is below 16px and never zooms back out; the guard prevents
  the misfire without `user-scalable=no` (which violates WCAG 1.4.4).

Out of scope for the spec at 3.0: print stylesheet, screen-reader
behaviour in legacy AT (NVDA + IE, etc.). RTL is handled at the CSS
layer via logical properties (§17); no implementation work required.

## 15. Dark mode

Two selectors, both supported out of the box:

- `[data-theme="dark"]` on `<html>` — idiomatic for vanilla / Rails /
  Django / Laravel
- `.dark` on `<html>` or a wrapper — idiomatic for React / Vue with
  localStorage + className toggling

The token swap lives in one block in `tokens/_theme.scss`. Components
read tokens; the dark block re-defines tokens. No per-component dark
logic except where a component intentionally inverts (e.g. dialog close
chip flips luminance to read against the deep surface).

Asymmetry: `--st-warning-foreground` stays dark in both themes. Yellow
stays yellow; text on it stays dark.

## 16. Browser support

Evergreen Chromium, Firefox, Safari from mid-2023. Minimum versions:
Safari 16.4+, Chrome 111+, Firefox 121+. No polyfills. Features the
spec relies on — OKLCH, `color-mix`, `:has()`, `@layer`, container
queries, `inert`, `100dvh`, `env(safe-area-inset-*)` — are all
well-supported in those versions.

## 17. Direction-agnostic CSS

Stisla CSS is authored with CSS logical properties throughout. Components
use `padding-inline`, `margin-inline-start`, `inset-inline-end`,
`border-inline-start`, `text-align: start` rather than their physical
counterparts (`padding-left`, `right: 0`, `border-left`, `text-align:
left`). The grid and containers in `foundation/` follow the same rule
(`padding-inline`, `margin-inline: auto`, `margin-inline-start` on
`.offset-*`).

Consequence: applying `dir="rtl"` to any region — the `<html>` root, a
single sidebar, one dialog — flips the layout correctly without RTL
override stylesheets, build-time `rtlcss` postprocessing, or
component-level `[dir="rtl"]` selectors in the common path.

Narrow, principled exceptions:

- **Overlay placement.** Popover, tooltip, and dropdown arrows are
  rendered off the `[data-placement]` attribute set by Floating UI.
  Placement is geometric, not directional — a popover anchored to the
  right of its trigger has its arrow on the left edge regardless of
  writing direction. Selectors driven by `[data-placement]` use
  physical `left` / `right` / `border-left` / `border-right`
  deliberately.

- **Slide-off-screen transforms.** `transform: translateX(-100%)` is a
  physical translation; CSS has no logical-aware equivalent. Components
  that slide off-screen (drawer, mobile app-shell sidebar) author the
  LTR transform inline and a single `[dir="rtl"]` block flips the sign.
  Keep these blocks to the file owning the transform, not in a global
  RTL override sheet.

Sass mixins (`media-up`, `media-down`, `media-between`, `media-only`)
and the breakpoint table are direction-agnostic — viewport size is
independent of writing direction.

## 18. Out of scope for the spec at 3.0

- Print stylesheet — not required
- v2 originals (`.metric`, `.invoice-summary`, etc.) — those become
  recipes, not components
- Wrappers for one framework over another (`@stisla/react` as
  generic wrapper) — each environment gets its own dedicated
  implementation
- A "spec compliance" test suite — implementations validate by eye and
  by the per-component contracts; a formal test suite is a later
  artefact

## 19. Where to look next

- **`spec/components/<name>.md`** — the per-component contract. Anatomy,
  parts, states, keyboard interactions, a11y, tokens.
- **`V3.md`** — build journal for the vanilla reference implementation.
  History, decisions, phase tracking.
- **Each implementation's package README** — install + recommended bundle
  + per-impl optional / core classification.
