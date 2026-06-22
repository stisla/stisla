# Stisla v3 — Architecture Decisions & Refactor Plan

Living record of the token / customization / naming rewrite. Captures both the
**issues** we came in with and the **decisions** that resolve them, so the
refactor can be implemented consistently and nothing gets lost.

## How to read this

- **Part 1 — Decisions:** the target system. Implement against this.
- **Part 2 — Issue → resolution:** original `notes` entries mapped to their fix.
- **Part 3 — Freeze before refactor:** the public API to lock first.
- **Part 4 — Order of work:** the sequence.
- **Part 5 — Open questions.**

**Legend**
- Type: `FIX` = localized bug · `REWRITE` = architectural change.
- Status: `- [ ]` not started · `- [~]` in progress · `- [x]` done.

---

## Part 1 — Decisions

### 1. Token foundation `REWRITE`

One Sass map per scale is the single source of truth. A generator emits
`--st-*` custom properties at `:root` (in `@layer theme`); a function reads the
var and validates the step against the same map. Edit the map, everything
derives.

- **Spacing** is a single base, not a map: `--st-spacing: 0.25rem` (matches
  Tailwind), `space(n) = calc(n * var(--st-spacing))`. Half-steps allowed
  (`space(2.5)`).
- **Per-step scales** (map → `:root` → function): `radius`, `text`, `shadow`,
  `z`, `leading`, `tracking`, `weight`, `duration`, `ease`.
- **Colors** get light + dark maps emitted into `:root` / `[data-theme="dark"]`;
  read via `tone(name)` (no scale segment, top-level token).
- **Borrow vs keep** (see §1a): borrow *values* for abstract scales, keep our
  own *values* for coupled scales. Borrow t-shirt *keys* everywhere. Always our
  own `--st-` prefix and step selection (never Tailwind's bare var names).
- Functions emit `var()` / `calc(... var())`, **never baked values** (preserves
  runtime theming). On bad step, `@error` lists valid steps.

```scss
@function _read($name, $map, $step) {
  @if not map.has-key($map, $step) {
    @error "#{$name}(#{$step}) invalid. Use: #{map.keys($map)}.";
  }
  @return var(--st-#{$name}-#{$step});
}
@function radius($s) { @return _read(radius, $radius, $s); } // etc.
```

**Status: built + verified** — `src/scss/tokens/_scales.scss` is the source of
truth (maps + functions + `emit-scales`), imported in `bundles/stisla.scss` and
emitted via `@include emit-scales` at the end of `_theme.scss`'s `:root`.
Additive: no component consumes the functions yet, nothing breaks. Exact values
live in the file; do not re-derive them.

Reality corrections to earlier sketches:
- **Colors are not Sass maps.** They are OKLCH literals in `_theme.scss` with the
  `-foreground` pairing rule, dark mode via the `color-mode(dark)` mixin
  (`[data-theme="dark"], .dark`). `tone()` reads them; `$tones` in `_scales.scss`
  is a hand-synced validation list.
- **Breakpoints already exist** as a Sass map (`xs/sm/md/lg/xl/xxl`, note `xxl`)
  with BS5-forked `media-up/down/between/only` mixins in `_breakpoints.scss`. No
  `@custom-media` needed; that decision is moot.
- **Radius** keeps the 3 tuned literals as anchors (`sm/md/lg = 0.5/0.75/1rem`),
  extends to t-shirt keys (`none/xs/sm/md/lg/xl/2xl/3xl/full`), and aliases the
  old `--st-radius` → `--st-radius-md`. `xs/xl/2xl/3xl` are scaled proposals to
  tune.
- **Shadow** is unchanged: `shadow(sm|md|lg)` returns the existing
  `--st-shadow-light|--st-shadow|--st-shadow-heavy` (no new vars).

  <a id="shadow-scale"></a>**§shadow-scale — the scale is non-monotonic.** The
  t-shirt keys map mechanically onto the theme's three named shadows:
  `sm → --st-shadow-light`, `md → --st-shadow`, `lg → --st-shadow-heavy`. But
  "light" is the *soft floating* shadow (`0 4px 12px`) and "base" is the *tight
  resting* shadow (`0 1px 3px`), so by visual size **`shadow(sm)` is LARGER than
  `shadow(md)`** — the scale doesn't grow monotonically from sm→lg. This is why
  floating popups (`menu-surface`) default to `shadow(sm)` while resting cards
  default to `shadow(md)`: it reads backwards but matches the intent. Not
  reordered — swapping the keys would silently over-elevate every card that
  asks for `shadow(md)`. Anything reaching for elevation should pick by intent
  (resting vs floating), not by assuming sm<md<lg.
- Build it with `node_modules/.bin/sass` (the `@import` deprecation warnings are
  pre-existing).

#### 1a. Borrow vs keep (the rule)

- **Abstract scales** (value independent of our components) → **borrow values**:
  `text`, `weight`, `tracking`, `leading`, `ease`, and `space` base.
- **Coupled / relational scales** (value only works against our component
  padding / elevation / stacking) → **keep our tuned values**, borrow only keys:
  `radius`, `shadow`, `z`.
- Radius specifically: keep current values (already tuned to component padding),
  adopt t-shirt keys, **add `none: 0` and `full: 9999px`**. Mind concentric
  nesting (inner ≈ outer − padding).

### 2. Token / variable grammar `REWRITE`

- **Fallback-default pattern:** never declare a component's own `--x` on its own
  selector. Defaults live in `var(--x, <default>)`; the default chains to the
  scale. This is what makes a token overridable from an ancestor scope.

  ```scss
  // ✅ overridable from outside        // ❌ blocks ancestor override
  .media { padding: var(--media-padding, space(4)); }
  .media { --media-padding: space(4); padding: var(--media-padding); }
  ```

- **Naming:** `--<block>-<element?>-<property>-<state?>`. State is **always the
  trailing segment**. Logical properties (`padding-inline` / `-block`), never
  `-x` / `-y` or bare `padding`.
- **State suffix only where the property changes** in that state. Structural
  tokens (padding, gap, radius, size) never get a state suffix. Read flat per
  state: `&:hover { background: var(--btn-bg-hover, …) }` (not override-in-state).
- **Fix existing inconsistency:** unify `-hover-bg` / `-bg-hover` → always
  `-bg-hover`.
- **`-active` tracks the `data-state="active"` attribute** (RESOLVED). The
  component family uses `data-state="active"` / `aria-pressed` / `aria-current`
  (Radix convention) as the selection/current state, so the token is named
  `-active` to match the attribute it paints for — *not* `-selected` / `-current`.
  `:active` (transient press) shares `-active` where a component paints press and
  selection identically (e.g. btn's `--btn-bg-active`); only split it out if a
  component needs distinct press vs selected paint. So `--tabs-trigger-bg-active`,
  `--table-bg-active`, etc. are correct as-is.
- **Drop per-component global mirrors** (`--st-btn-radius`, `--st-item-radius`).
  The instance token is now the global knob too (settable at `:root`). Keep only
  the scale primitives (`--st-radius`, etc.).

### 3. Customization & scoping model `REWRITE`

- **Principle: context sets tokens; components only read tokens.** A parent scope
  reassigns child tokens; it never restyles a child via its properties. This
  removes every `:not()` / descendant-restyle / `!important` hack.
- **Scope ladder** (precedence, high → low): inline `style="--x"` → modifier /
  instance on the element → nearest ancestor scope → farther scope → `:root` →
  `var()` fallback. Nearest ancestor wins; a value *declared on the element*
  beats an *inherited* one.
- **An override's blast radius = its subtree.** Set the token at the narrowest
  element covering exactly what you mean; nest tighter scopes for exceptions.
- **Layers:** components live in `@layer components`; **consumer CSS is unlayered**
  so it always wins without `!important` or specificity tricks. Document this.
- **Inline:** setting a **token** inline is blessed (tightest scope, states still
  work). Setting a **raw property** inline is the smell (bypasses states / token
  chain). Promote inline → modifier the moment it earns a name, recurs, or needs
  `:hover` / `@media`.
- **Modifiers / variants retune tokens only**, no new layout.
- **Predict common compositions** in component CSS (e.g. a table inside a card
  drops its outer border), rather than leaving them to consumer utilities.

### 4. Naming & component renames `REWRITE`

- `.item` → **`.media`** (media-object row). Rename the media slot
  `.item__media` → **`.media__figure`** (avoid `.media__media`).
- `.dropdown-menu` → **`.menu`** (standalone, reusable surface) with
  `.menu__item`, `.menu__separator`. `.dropdown` **stays** (the trigger +
  open/close behavior).
- **Contexts are siblings, not a hierarchy under dropdown:** `.dropdown`,
  `.select`, `.combobox` (autocomplete = a combobox behavior, not a 4th block).
  Each opens a shared `.menu`, scopes it via tokens, and applies the correct
  ARIA: dropdown = `menu` / `menuitem` (actions); select / combobox = `listbox` /
  `option` (choices). The shared float/anchor behavior lives below all of them.
- **Rows inside a menu:** simple options = `.menu__item`; rich rows (messages /
  notifications) = drop a `.media` into the `.menu`. **Never fuse**
  `.media.menu__item`. Shared interaction look comes from a recipe mixin both
  `@include`, not from one shared class.
- **New shared empty / error component:** neutral block **`.status`** + variant
  modifiers `--empty` / `--error` / `--no-results` / `--success`. Anatomy:
  `__icon` / `__title` / `__description` / `__action`. The block name never names
  a case; the variant carries it.

### 5. Sizing & density `REWRITE`

- **Breakpoints own `sm/md/lg/xl/2xl`.** Nothing else uses those as bare class
  names.
- **T-shirt letters are fine when namespaced** (inside a function `radius(lg)`,
  or a media query `@media (--lg)`), **banned as a bare component variant**
  (`.btn-lg`). The function / media wrapper is the namespace.
- **Size variants** (whole control scales: height + padding + font):
  `--compact` / default / `--roomy`. Only on components where multiple sizes are
  real (button, input, badge, avatar). Cards / modals / alerts expose padding
  tokens, **no size ladder**.
- **Density variants** (internal spacing only): `--tight` / `--loose` (tables,
  lists, menu row spacing). Keeps `loose` meaning "more internal room"
  consistently.

### 6. Helpers & authoring sugar `REWRITE`

- **Two tiers, different kinds of helper:**
  - **Consumer (read the scale):** value functions `space`, `radius`, `tone`,
    `text`, `text-leading`, `shadow`, `z`, `leading`, `tracking`, `weight`,
    `duration`, `ease` + breakpoints. Small, stable, public.
  - **Author (build the scale):** scale maps/config, recipe mixins
    (`interactive`, `surface`, the shared menu-row look), theme generation,
    token-enforcement. Richer, churnier, separate import
    (`@use 'stisla/authoring'`).
- **Avoid `@include` where possible:** values via functions; defaults via the
  fallback (or a `token()` *function* form); breakpoints via `@custom-media`
  (`@media (--lg)`). `@include` survives only for multi-declaration **recipes**
  (rare, author tier); `:is()` covers library-internal sharing.
- **No bespoke CSS dialect** (`@responsive`, `@blur`). Standards-being-polyfilled
  (`@custom-media`, native nesting, `@property`) are fine because they rent the
  ecosystem and head to native. Inventing at-rules means a forever-maintained,
  tooling-unsupported private language. `@responsive` is also redundant with
  `@media (--lg)`. Reserve bespoke at-rules for a genuine gap you will maintain
  forever.
- **`token()`** (optional): author guardrail that emits the fallback pattern and
  can feed a docs registry (auto-generated Customization tables). Function form =
  no `@include`, no auto-docs; mixin form = `@include`, gets auto-docs.
- **`@property`:** only for tokens that must **animate**. Its `initial-value`
  cannot reference other custom properties, so it **cannot hold chained
  defaults** (`tone()`, `space()`). Not the default mechanism; the `var()`
  fallback is.

### 7. Typography `REWRITE`

Decouple size and line-height, but ship the *paired default* so nobody guesses.

- `$text` map stores `(size, default-line-height)` per step; emit both
  `--st-text-X` and `--st-text-X-lh`. Borrow Tailwind's tuned pairs (abstract
  scale).
- `text(s)` = size · `text-leading(s)` = the paired default · `leading(t)` =
  semantic override (`tight`/`snug`/…). No `@include` required:

  ```scss
  .card__title { font-size: text(lg); line-height: text-leading(lg); } // default
  .hero        { font-size: text(5xl); line-height: leading(tight); }   // override
  ```

- Optional one-line sugar: `@include type(lg)` (sets both). Strictly opt-in.

### 8. Tooling `REWRITE`

- **Stay on Sass**, shrink its footprint to the three things only it does:
  value functions, loops/maps (scale + variant generation), rare mixins. Use
  native CSS for everything the platform now covers (nesting, custom props,
  `@layer`, `color-mix`, `@property`, `@custom-media`).
- **Not** CSS Modules / vanilla-extract / Panda / StyleX: they scope or atomize
  and tie to a JS build, incompatible with shipping public global classes + a
  no-build CSS consumer.
- Lightning CSS optional as transpiler / minifier (complementary, not a
  replacement for the macro layer).
- **Future:** extract token maps into a framework-neutral format (DTCG / Style
  Dictionary) so the CSS, React+Base UI, and Vue impls share one token source.

### Bugs (quick wins)

- [x] `FIX` **Input group 38→36px:** wrapper owns a border-inclusive
  `height: space(9)` (`box-sizing: border-box`), field children drop to
  `height: auto` and stretch into the content box; textarea groups opt back to
  `height: auto` so they grow. No doubled border at the seam.
- [x] `FIX` **Collapsed sidebar:** `.sidebar.is-collapsed` (the real hook, not
  `[data-collapsed]`) trims `--sidebar-padding-inline` to `space(2.5)` so the
  rail hugs the square icon cell; `.sidebar__content` gained `transition:
  padding` so the trim glides with the width, rail recipe + app-shell default
  retuned to 3.625rem. **Skipped `--sidebar-item-justify: center`** — the
  existing design keeps the icon stationary at its left offset (justify-content
  doesn't interpolate, would snap mid-animation, and centering an icon beside
  an opacity-0-but-in-flow label de-centers it). The padding trim keeps the
  icon on the rail's center axis via the recipe instead.
- [x] `FIX` **Menu elevation:** `menu-surface` shadow default raised from
  `shadow(md)` (tight resting) to `shadow(sm)` (soft float). Surfaced the
  non-monotonic shadow scale (sm=light is visually *larger* than md=base) — see
  §shadow-scale; left unreordered to avoid over-elevating cards.
- [x] `FIX` **`.page` container loses gaps:** added `.page__body` as the
  gap-owning flow sharing `--page-section-gap` with `.page`; a `.container` now
  nests between `.page` (frame) and `.page__body` (flow) so section gaps
  survive. `.page` still flows directly for the common no-container case (one
  container child → its gap is a harmless no-op).
- [x] `FIX` **Table last-row hover radius in a card (no `overflow`):** corner
  cells round to the card's inner radius (`calc(--card-radius - border-width)`)
  on `border-end-start/end-radius`, last row drops its bottom border. No
  reliance on `overflow: hidden`.
- [x] `REWRITE` **Predicted table-in-card composition:** a flush table composes
  with the card via its own CSS — drops its trailing margin (no more manual
  `.mb-0`), rounds the corner cells to the card's inner radius at whichever
  edges meet it (top corners as first child, bottom as last), drops the last
  row's bottom border, and for `.table--bordered` drops the whole outer
  perimeter (inline edges direct-child only; responsive tables scroll). Card
  `overflow: hidden` stays off; the card image already rounds its own corners
  the same way (stale "card has overflow:hidden" comment fixed). Demo: bordered
  table as a card's only child added to `table.njk`.

---

## Part 2 — Issue → resolution

| # | Original note | Type | Resolved by |
|---|---|---|---|
| 1 | input group 38 vs 36px | FIX | §Bugs (border-inclusive height) |
| 2 | inconsistent component vars (padding vs padding-x/y, state naming, missing vars) | REWRITE | §2 grammar + §1 token foundation |
| 3 | `dropdown` vs `dropdown-menu` naming | REWRITE | §4 → `.menu` standalone, `.dropdown` = trigger |
| 4 | unpleasant collapsed sidebar (item shrink) | FIX | §Bugs (token-scoped collapsed padding) |
| 5 | no standard way to write a custom modifier (`.card--stat`) | REWRITE | §3 scoping model + §6 helpers |
| 6 | dropdown menu needs more elevation | FIX | §Bugs (`--menu-shadow`) |
| 7 | customized component var pattern (message dropdown) | REWRITE | §3 (context sets tokens — pattern is blessed) |
| 8/17 | `.item` as menu content; `.item.dropdown__item` composition / BEM | REWRITE | §4 → `.media` vs `.menu__item`, recipe mixin, no fusing |
| 15 | unread message bg via `data-state` — semantic? | REWRITE | §3 (state via data-attr / scope is fine) |
| 16 | `.page` + inner container loses section gaps | FIX | §Bugs (`.page` frame vs `.page__body` flow) |
| 18 | `:not(.dropdown-menu .btn)` scoping hack | REWRITE | §2 fallback-default + §3 context-sets-tokens |
| 26 | painful custom-CSS DX; want syntactic sugar | REWRITE | §6 helper functions + `@custom-media`; no bespoke dialect |
| 39 | dropped card `overflow`, last-row radius broke | FIX | §Bugs (round the cells, not overflow) |
| 40 | predict common table compositions (drop last border in card) | REWRITE | §3 + §Bugs (component-owned composition) |

---

## Part 3 — Freeze before refactor

These become public API the moment they ship; lock them first.

- [ ] **Function names** (`space`, `radius`, `tone`, `text`, `text-leading`,
  `shadow`, `z`, `leading`, `tracking`, `weight`, `duration`, `ease`).
- [ ] **Each scale's step keys** (the t-shirt sets) and **`--st-*` token names**.
- [ ] **Density vocabulary** (`compact` / `roomy` size; `tight` / `loose`
  density).
- [x] **State-suffix order** (`-bg-hover`; `-active` tracks `data-state="active"` — resolved).
- [ ] **Spacing half-steps** = allowed.
- [ ] **Component renames** (`item→media`, `dropdown-menu→menu`, `.status`).

---

## Part 4 — Order of work

1. ~~**Lock the catalog** (Part 3).~~ + **Foundation** — DONE:
   `_scales.scss` built, wired, compiles. Values pinned in code.
2. **Density removal (biggest sweep) — DONE.** `--st-density` replaced by
   `space()` across the component set, `form-field-base`, the
   `popup-*`/`menu-*` mixins, **`_page.scss`** (gaps → `space()`, fully
   fallback-default), and the **`_utilities.scss` `.m-*`/`.p-*` spacing map**
   (keys map 1:1 onto `space(n)`). `compact`/`roomy` are `--st-spacing`
   overrides in scope. **`_prose.scss`** kept its em-relative reading rhythm
   (can't move to the rem `space()` scale) but swapped the density multiplier
   for a prose-local **`--prose-rhythm`** knob (default 1, declared at the
   `.prose` root manifest) and converted its vertical margins to logical
   (`margin-block-start/-end`). **`--st-density: 1` is now deleted from
   `_theme.scss`** — zero code references remain (only historical comments).
3. **Grammar sweep:** per component to fallback-default + state suffix + logical
   props; drop per-component `--st-*` mirrors; remove `:not()` / descendant
   restyles. Adopt `space()/radius()/text()/…` while touching each file.
   **Reference: `_btn.scss` is done** — the canonical pattern every other
   component follows. What it demonstrates:
   - density removed (`var(--st-density)` math → `space()` multiples; height
     `space(9)`, padding `space(3)`, both ride `--st-spacing`);
   - fallback-default (no `--btn-*` declared on `.btn`; every read is
     `var(--btn-x, <helper default>)`, defaults repeat where a token is read
     in several places — e.g. `--btn-height`);
   - per-component mirror dropped (`--st-btn-radius` gone; theme all buttons
     via `--btn-radius` at `:root`);
   - logical padding (`--btn-padding-x` → `--btn-padding-inline`);
   - flat per-state hooks: `&:hover { background: var(--btn-bg-hover, <derived
     color-mix>) }` — exposes an override hook while the color-mix derivation
     stays the default (the right shape for a derive-from-one-knob component);
   - helper adoption (`space/radius/text/weight/duration`), interpolated as
     `#{space(3)}` in `var()` fallbacks so Sass evaluates them.
   Defaults verified identical to pre-refactor values (no visual regression).

   **Field family done** (`form-field-base` mixin + `_input` / `_select` /
   `_textarea`): density removed (heights `space(7/9/11)`, paddings
   `space(2/2.5/3.5)`), helpers adopted, `--<prefix>-padding-x` →
   `-padding-inline`. **Fully fallback-default** — nothing is declared on the
   base field; every knob is `var(--<prefix>-x, <default>)` so a scope / inline
   can retune bg, color, border, height, padding, radius, placeholder. Field
   radius chains `var(--<prefix>-radius, var(--st-input-radius, radius(md)))` —
   per-field knob → **field-family knob** → scale (see Family knobs below). The
   default **repeats** at the few cross-file child read sites (input swatches,
   select placeholder / min-height, textarea min-height) — that repetition is
   the accepted cost of overridability (same as btn's `--btn-height`), **not** a
   reason to declare the token on the element. Only *modifiers* (`.input--sm`)
   and *state / call-site* rules declare tokens. (Earlier draft tried a
   "declared interface" shortcut here — wrong: it blocked scope override.
   Reverted.) Sibling field components (`input-group`, `combobox`,
   `autocomplete`) follow the same pattern — migrated in the
   field-family-siblings batch.

   **Nav/shell done** (`navbar`, `app-shell`, `sidebar`): density removed,
   `--st-{navbar,sidebar}-button-radius` mirrors dropped, state-trailing,
   logical padding, `app-shell --sidebar-z` → `--sidebar-z-index` (+ `z(overlay)`).
   sidebar is the biggest (603 lines, ~25 cross-referencing tokens —
   brand-color / button-color chain back through `--sidebar-color`); the opt-in
   `--sidebar-width` / `-width-collapsed` keep their intentional `, auto`
   fallback (loses to an explicit width). app-shell's directional mobile-drawer
   shadow stays its own knob (not the `--st-overlay-shadow` family — it's a
   special-purpose inline-end cast, not a standard elevation).

### Family knobs — DROPPED (two-tier theming instead)

We briefly shipped three "family knobs" (`--st-surface-radius`,
`--st-input-radius`, `--st-overlay-shadow`) — a `--st-*` middle rung shared by a
visually-coupled set: `var(--<comp>-x, var(--st-<family>-x, <scale>))`. **They
are now removed.** The argument that killed them: *"what if a user wants to set
all surfaces' radius to 0"* is the same possibility argument for **every**
property × **every** family (surface-border, surface-padding, field-bg…), so it
generalizes to a combinatorial explosion of `--st-*` tokens. And they're
**redundant** — the scale primitive already IS the global lever, and the
per-component token is the specific lever. The middle rung bought only an
arbitrary grouping at the cost of a third chain level. Collapsed each chain to
`var(--<comp>-x, <scale>)`.

**The model that replaces them — two tiers, no arbitrary middle:**

| property | global lever (theme/scale) | per-component knob |
|---|---|---|
| radius | `--st-radius-sm/-/-lg` | `--<comp>-radius` |
| shadow | `--st-shadow-light/-/-heavy` | `--<comp>-shadow` |
| border | `--st-border-width`, `--st-border` | `--<comp>-border-width` + `--<comp>-border-color` |
| padding | `--st-spacing` (all spacing) | `--<comp>-padding-inline` / `-block` |
| color | `--st-*` palette | `--<comp>-bg` / `-color` |

Each component default chains `var(--<comp>-x, <scale primitive>)`. Override the
scale → theme everything (brutalist = zero the radius/shadow steps + bump
`--st-border-width`); override the component token → theme one thing. A grouped
"all surfaces but not fields" change is a short consumer theme block listing
those component tokens — explicit, not magic.

**Border standardization (consistency audit).** Borders had 3 shapes
(shorthand `--<comp>-border`, color-only, color+width). Standardized ALL on the
**split** `--<comp>-border-width` + `--<comp>-border-color` (both defaulting to
the global `--st-border-width` / `--st-border`) — chosen over the shorthand
because variant/state rules recolor via the `--<comp>-border-color` *token*
(btn variants, alert intents, table rows, toggle), which a shorthand would
break. `--<comp>-border-width: 0` now drops one surface's border; the global
`--st-border-width` flows through the defaults. Remaining `[border-color]`-only
are legit non-box cases (fields get width+color via the mixin; sidebar submenu /
drawer-footer dividers, table cell rules, tab indicators are structural
single-edge borders).

**Motion naming convergence.** Transition timing was named three ways
(`--<comp>-transition` shorthand, `--<comp>-transition-duration`,
`--<comp>-duration`). Converged all *transition* timing onto
**`--<comp>-transition-duration`** (collapsible's JS mirror renamed too).
*Animation* durations stay their own concept (`--spinner-duration`,
`--indicator-pulse-duration`, `--progress-*-duration`) — different property, not
folded in.

All three (family drop, border, motion) verified by **`audit-consistency.mjs`**
(the cross-component shape auditor, distinct from the grammar auditor).

   **Form-check group done** (`form-check-base` mixin + `_checkbox` / `_radio` /
   `_switch`): density removed (`space(4)` boxes; switch track/thumb/inset as
   `space(7/4/3/0.5)`, lg `space(11/6/5/0.5)`). Establishes the **preset-knob
   rule**: a `--st-<component>-*` mirror that exists *only* so a preset scope can
   override (checkbox square corners, switch pill radius + square thumb) is
   dropped and replaced by making the component knob itself **fallback-default**
   — `border-radius: var(--switch-radius, radius(full))`, so a preset scope sets
   `--switch-radius`/`--checkbox-radius`/`--switch-thumb-paint` directly and it
   flows in. `form-check-base` now takes a `$radius` param (radius(xs) checkbox /
   50% radio) as the fallback default. Distinguish from §2's *redundant* mirror
   (`--st-btn-radius`, dropped outright): a preset mirror becomes a
   fallback-default knob; a redundant mirror just goes.

   **Feedback cluster done** (`alert`, `badge`, `progress`, `meter`, `spinner`,
   `kbd`, `icon-box`, `indicator`): density removed, six redundant radius
   mirrors dropped (`--st-{alert,badge,progress,meter,kbd,icon-box}-radius`),
   `padding-x/y` → logical, all helpers adopted. Fully fallback-default —
   including the **root-declares / children-read** shape (progress + meter
   declared ~15 tokens on the root that `__track`/`__bar`/`__label`/`__value`
   read; converted to fallbacks at each read site so a scope override of e.g.
   `--progress-bar-bg` now flows through). Audit confirmed: every remaining
   token assignment is on a modifier / state / media scope, none on a base
   element. (`_prose.scss` re-skins `<kbd>` with its own tokens — minimal mirror
   fix applied; full pass deferred to prose's batch.)

   **Toggles/segmented done** (`toggle`, `toggle-group`, `button-group`, `tabs`,
   `pagination`): density removed (btn-style `calc(X + Y*(density-1))` height
   formulas → `space()` multiples; token×density paddings → plain `space()`),
   four radius mirrors dropped (`--st-{toggle,toggle-group,tabs,pagination-button}-radius`),
   `padding-x` → logical, full fallback-default (incl. tabs/pagination
   root-declares-children-read + the concentric inner-radius calcs in
   toggle-group/tabs). **Caught two real breakages from the btn rename:**
   `button-group` and `sidebar` set `--btn-padding-x` on child buttons, which
   btn no longer reads (renamed to `--btn-padding-inline`) — both fixed. Lesson
   logged: renaming a *shared* token (btn's) means sweeping every component that
   sets it, not just btn itself.

   **Surfaces done** (`card`, `table`, `list-group`, `item`): density removed,
   three radius mirrors dropped (`--st-{card,list-group,item}-radius`) + the
   `--st-card-shadow` mirror, full fallback-default. Two notable cases: (1) the
   **cross-component composition** `.card > .list-group { --list-group-item-padding-x:
   var(--card-padding) }` — since card no longer *declares* `--card-padding` (it's a
   fallback-read), this had to become `var(--card-padding, space(5))` so it resolves to
   card's actual default; same for `.card > .item--flush`. (2) **`table`'s BS5 layered
   paint slots** (`--table-bg-type/-color-type/-bg-state/-color-state: initial`) are
   *kept declared on the base* on purpose — they're the paint mechanism (set by row
   variants/states, consumed via the var() chain in the cell), not user knobs. Geometry
   / head / surface / state colours all went fallback-default around them. `item` keeps
   its class name; `→.media` rename stays in the rename step.
4. **`popup-*` → `.menu`:** the shared popup mixins in `_mixins.scss`
   (`popup-base/item/header`, `ts-popup`) are the `.menu` precursor — formalize
   to `.menu` / `.menu__item`. Then `.item`→`.media`, slot renames. Codemod demos
   + dashboard.
5. **Quick bugs** (Part 1 §Bugs).
6. **New `.status` component.**
7. **Docs:** customization guide (author/end-user peek) + per-component
   Customization tables.

**Migration note (radius/shadow back-compat):** `_scales.scss` keeps
`--st-radius`, `--st-radius-sm`, `--st-radius-lg`, and `--st-shadow*` resolving,
so Steps 2–4 can adopt `radius()`/`shadow()` per component without a
flag-day rename. Drop the legacy `--st-radius` alias only after the last bare
reference is migrated.

---

## Part 4 progress — migrated component log (token sweep)

btn (reference) · form controls (input/select/textarea + form-field-base,
checkbox/radio/switch + form-check-base) · feedback (alert/badge/progress/meter/
spinner/kbd/icon-box/indicator) · toggles (toggle/toggle-group/button-group/tabs/
pagination) · surfaces (card/table/list-group/item) · misc (tooltip/breadcrumb/
avatar/avatar-group/slider/accordion) · field-family siblings (field/
combobox/autocomplete/input-group) · nav/shell (navbar/app-shell/sidebar) ·
**overlays (dropdown/dialog/drawer/popover/toast + popup-* / ts-popup mixins)** ·
page · stragglers (carousel/scroll-area/placeholders/link/separator/collapsible)
— all pass the full Part 4a audit. (`prose` migrated too but exempt from the
audit set — see Straggler pass below; `nav` deleted.)

**TOKEN SWEEP COMPLETE** — every component migrated (btn → overlays), both form
mixins + popup mixins, all under the clean six-axis baseline. Family knobs
(`--st-input-radius`, `--st-surface-radius`, `--st-overlay-shadow`) wired across
their members.

**Straggler pass (verification audit).** A cross-check found the earlier "every
component migrated" was overstated: **8 components were never in the audit's
`MIGRATED` set**, so they'd gone unverified. Closed out:
- **Migrated + added to the audit:** `carousel` (root-declares→fallback-default,
  dropped `--st-carousel-radius` mirror, `-padding-x/-y`→logical,
  `-indicator-active-bg/-width`→`-bg-active`/`-width-active`, helpers, logical
  positioning), `scroll-area` (dropped `--st-scroll-area-radius`, root-declares→
  fallback at the `--os-*` forwarding site), `placeholders` (dropped
  `--st-placeholder-radius`, logical margins, fixed a latent `var(--btn-radius)`
  no-fallback square bug), `link` (`-hover-color`→`-color-hover`,
  fallback-default), `separator` (fallback-default), `collapsible` (no tokens —
  added for coverage).
- **`nav` DELETED** — BS5-style flat `.nav-*` component, already commented out of
  the bundle, zero usage, no demo/spec. Gone.
- **`prose` stays OUT of the audit set** — it deliberately declares its knobs on
  the `.prose` root (documented manifest, an intentional exception to
  fallback-default). Its density→`--prose-rhythm` swap, logical margins, and the
  `--kbd-padding-block/-inline` grammar fix are all done; but auditing it would
  flag its intentional root manifest, so it's exempt by design.
- **Audit tool:** added a third-party plugin-var exemption (`--os-*`/`--ts-*`/
  `--bs-*`/`--embla-*`) so forwarding to OverlayScrollbars / Tom Select APIs
  isn't flagged for Stisla's `-radius`/`-shadow` spelling rules.

Now genuinely every component is migrated + audited (43 → 49 files, 0/0).
Remaining work is NOT token migration: `.status` + docs.

**Renames — progress:**
- [x] **Size variants `--sm/--lg/--xl` → `--compact/--roomy/--spacious`** — DONE.
  459 occurrences codemodded across `src/scss` (25 files) + `src/site` (57) +
  `src/js` (select.js trigger-class propagation, toast.js) + `spec/` (current
  contract). Boundary-safe `perl -pi 's/--sm\b/.../'` — breakpoint infixes
  (`table-responsive-sm`, `--horizontal-sm`, single-dash) untouched. Compile +
  `audit:tokens` clean. **`packages/` is build output — run `npm run
  build:packages` to regenerate** (stale until then). Historical journals
  (MIGRATION-LOG / V3.md / MIGRATION / CHANGELOG) keep old names as record.
- [x] **`.item` → `.media`** — DONE. File `_item.scss`→`_media.scss`; slot
  `.item__media`→**`.media__figure`** (avoids `.media__media`); parts/modifiers/
  tokens (`--item-*`→`--media-*`); bundle import; `_card`/`_page` refs; demo page
  `pages/item.njk`→`media.njk` (route `/item`→`/media`) + nav link + page docs;
  spec `item.md`→`media.md`. **Surgically scoped** — protected (verified intact):
  Tom Select's `.ts-control .item`, and the unrelated `list-group__item` /
  `dropdown-menu__item` / `meter__legend-item` / `sidebar__item` /
  `data-remove-item` / sidebar.js `entry.item`. njk done via class/style-attr
  scoping with `(?<![-\w])` lookbehind (no prose touched). Side benefit: removes
  the global `.item` collision that forced combobox's chip-reset. Site builds
  (`media.html` renders), compile + `audit:tokens` clean.
- [x] **`.dropdown-menu` → `.menu`** — DONE (rename-only). Surface class
  `.dropdown-menu` → `.menu` (+ `.menu__item/__header/__icon/__indicator/
  __shortcut/__divider/__group`); tokens `--dropdown-*` → `--menu-*` (block-name
  match + sets up the shared-menu token namespace). **Kept** (the trigger +
  behavior layer): `.dropdown` wrapper, `data-stisla-dropdown*` hooks,
  `Stisla.Dropdown` JS class, `_dropdown.scss` filename, `/dropdown` route. This
  is the architecture split — `.dropdown` (trigger) opens `.menu` (surface).
  Updated: 4 component scss + 9 njk + dropdown.js + site styles + spec
  `dropdown.md`. Compile + `audit:tokens` clean; site builds (`.menu` renders).
  **Deferred (separate architecture pass):** the shared-`.menu` *extraction* —
  unifying select (`.select__popup` / `popup-*` mixins) and combobox
  (`.ts-dropdown` / `ts-popup`) onto `.menu` + `--menu-*`. Right now `.menu` is
  dropdown-only; select/combobox keep their own surfaces until then.

### Overlay anatomy — Base UI / Radix shared vocabulary (in progress)

**Decision:** every overlay component uses ONE shared part vocabulary so a user
learns it once (Base UI / Radix convention): **root** `.<block>` · **trigger**
`.<block>__trigger` · **popup** `.<block>__popup` (the floating surface) ·
**item** `.<block>__item` (never `__option`) · **indicator** `.<block>__indicator`
· **separator** `.<block>__separator` · **group** `.<block>__group` +
`__group-label`. Each opener stays its own block with its own `--<block>-*`
tokens (impls may differ structurally — the *mixin* is the shared visual recipe,
not the class). This is NOT "unify everything" — it's one consistent naming model.

- [x] **Stage 1 — menu (was dropdown):** full Base UI rename. `.dropdown` (root) →
  `.menu`; the floating surface `.menu` → `.menu__popup`; `.menu__header` →
  `.menu__group-label`; `.menu__divider` → `.menu__separator` (+ tokens). Behavior
  layer fully renamed: `data-stisla-dropdown*` → `data-stisla-menu*`,
  `Stisla.Dropdown` → `Stisla.Menu`, event namespace `stisla:dropdown:*` →
  `stisla:menu:*`, scroll-lock `is-dropdown-open` → `is-menu-open`, files
  `_dropdown.scss`/`dropdown.js`/`dropdown.md` → `menu.*`, route `/dropdown` →
  `/menu`. Order-sensitive renames (surface→popup before root→menu; data-attrs
  longest-first) via class-attr-scoped perl (protected Tom Select `.ts-dropdown`,
  prose, and the Tom Select `onDropdown*` API). Compile + audit + site build clean.
- [x] **Stage 2+3 — comprehensive shared mixin + align all openers.** The REAL
  goal (the rename was just packaging). Built ONE parameterized mixin set in
  `_mixins.scss` — `menu-surface($prefix)`, `menu-item($prefix)`,
  `menu-item-hover/-active/-disabled($prefix)`, `menu-item-danger($prefix)` +
  `-hover`, `menu-icon/-indicator/-shortcut($prefix)`, `menu-group-label($prefix)`,
  `menu-separator($prefix)` — same `$prefix` pattern as `form-field-base`. **Paint
  in the mixin, state-selector at the call site** (a `.menu` uses `[data-highlighted]`,
  Tom Select uses `.is-highlighted`/`.active`). Wired ALL four openers onto it:
  menu (`'menu'`), select (`'select'`), autocomplete (`'autocomplete'`), combobox
  (`'combobox'` via `ts-popup`). Each reads its own `--<prefix>-*` tokens (menu is
  richest — uses icon/indicator/shortcut/danger; select uses a subset). Select also gained the optional .select__indicator check-mark (Base UI parity) via menu-indicator — shows on .is-selected alongside the highlight. **Retired
  `popup-*` mixins + the entire `--popup-*` namespace** (0 left in output). Class
  renames `.<x>__option` → `.<x>__item`, `.select__group` → `.select__group-label`
  across scss + JS (select.js/autocomplete.js render them) + demos + spec. Compile
  (main + full + combobox bundles) + audit (0/0) + site build all clean.
  *(Note: a select's field and popup now share a few `--select-*` tokens — radius/
  bg/color — with matching defaults; coherent, since a select's trigger + dropdown
  should round/colour together.)*

**ALL THREE ORIGINAL DEFERRED RENAMES COMPLETE** (size variants, item→media,
dropdown-menu→menu). Remaining v3 work: overlay Stages 2–3 above, bugs (Part 1
§Bugs), `.status` component, docs.

### z-index (overlay stacking) — kept as literals, NOT routed through z()

The overlay z-values are a hand-tuned cross-component hierarchy
(dropdown 1030, drawer 1045, dialog 1055, popover 1070, toast/region 1090,
tooltip 1050, app-shell mobile-sidebar 1030) that does not match the
independently-authored `$z` scale. Forcing them through `z()` would silently
reorder overlays — a behavior change outside a token refactor. So each overlay
keeps `var(--<comp>-z-index, <literal>)` (fallback-default knob, literal default).
The `z()` helper + `--st-z-*` scale remain for consumers / new code. Reconciling
the two (one principled stacking scale all overlays adopt) is a separate, opt-in
follow-up — flagged so it isn't mistaken for an oversight. The audit's
abbreviation check (`-z` → `-z-index`) still applies and passed.

## Part 4a — Per-component migration checklist

Apply **all** of these to every component, every batch (skipping the naming half
caused a grammar drift that had to be back-fixed across 7 files — toggle / tabs /
pagination / table / list-group / checkbox / radio):

- [ ] **Density → `space()`** — `calc(Xrem * var(--st-density))` and the btn-style
  `calc(X + Y*(density-1))` height formulas become `space(n)` multiples.
- [ ] **Fallback-default** — no token declared on a base element; every read is
  `var(--x, <default>)`, default repeated at every read site (incl. cross-file
  children). Only modifiers / states / scopes declare tokens.
- [ ] **No `--st-<comp>-*` mirrors AND no `--st-<family>-*` knobs** — redundant
  1:1 mirrors deleted (the component knob is the override path); preset mirrors →
  fallback-default knob; **family knobs also dropped** (see "Family knobs —
  DROPPED"). The only `--st-*` tokens are the scale primitives + palette; a
  coupled family is themed via those globals (or a consumer theme block listing
  the component tokens), never a bespoke `--st-<family>-*` middle rung.
- [ ] **Logical padding** — token names `--x-padding-x/-y` → `--x-padding-inline/-block`;
  `padding: a b` → `padding-block` / `padding-inline`.
- [ ] **State trailing** — `--x-<state>-<prop>` → `--x-<prop>-<state>`
  (`-hover-bg` → `-bg-hover`, `-active-color` → `-color-active`,
  `-disabled-color` → `-color-disabled`, `-checked-bg` → `-bg-checked`).
- [ ] **Property names spelled out** — `height` / `width` / `size`, never `-h` /
  `-w`; `z-index` not `-z`. The only accepted abbreviation is `-bg` (background).
  Audit grep: `grep -oE "\-\-[a-z][a-z-]*-(h|w)\b" <file>`.
- [ ] **CSS-property word order in token names** — `--x-min-width` not
  `--x-width-min`; `--x-padding-inline-start` not `--x-padding-start`. The token
  segment after the property mirrors the real CSS property
  (`min-width`, `max-width`, `padding-inline-start`).
  Audit: `grep -oE "\-\-[a-z-]+-(width|height|padding|margin)-(min|max|start|end|top|bottom|left|right)\b"`.
- [ ] **Logical properties, including margins** — `margin-block-start/-end` &
  `margin-inline-start/-end`, never `margin-top/bottom/left/right`; `inset-block/
  -inline` over `top/bottom/left/right` for flow-positioned boxes (JS-positioned
  overlays keep `top:0;left:0` — they're set by JS, not flow). Token names match:
  `--x-margin-block-end` not `--x-margin-bottom`.
  Audit: `grep -E "^\s*margin-(top|bottom|left|right):"`.
- [ ] **Property-segment spelling** — three universal abbreviations are
  MANDATORY: **`-bg`** (not `-background`), **`-radius`** (not `-border-radius`),
  **`-shadow`** (not `-box-shadow`) — they match Tailwind / design-token norms.
  Everything else is the full property word: `-color`, `-gap`, `-font-size`,
  `-font-weight`, `-padding-inline`, etc. `--st-background` / `--st-foreground`
  are exempt — they're semantic color-*role* names (a palette), a different
  namespace from component property-assignment tokens. The `-bg`/`-color`
  visual asymmetry is accepted convention, not a bug (decided; `color`,
  unlike `background`/`border-radius`/`box-shadow`, has no universal short form).
- [ ] **Padding / margin are always two axis tokens — never bare `--x-padding`
  / `--x-margin`** (REVISED — supersedes the earlier "bare padding is
  fit-to-purpose" call). A box gutter exposes BOTH `--x-padding-inline` and
  `--x-padding-block` (same default when uniform: `padding: var(--x-padding-block,
  D) var(--x-padding-inline, D)`), so a consumer can retune either axis. Same for
  margins (`--x-margin-inline` / `-block`). Rationale: "what if a user wants to
  set just the horizontal padding" is the same possibility argument that justifies
  any per-axis knob — a bare `--x-padding` silently denies it. Carve-outs that are
  NOT bare box gutters and stay single-axis: height-driven controls expose only
  `--x-padding-inline` (vertical size comes from `height`, there is no block
  padding); single-edge values stay specific (`--x-margin-block-end`,
  `--table-edge-padding`, sidebar's `-padding-inline-start`); a concentric inner
  radius that subtracts the gutter references `--x-padding-inline` (equals block
  when uniform). The shared `menu-surface` mixin carries the split, so all four
  overlay openers inherit it. Enforced by `audit-consistency.mjs` (the `padding`
  / `margin` concept shows the bare shape as a divergence).
- [ ] **Helpers** — `text() / weight() / radius() / shadow() / duration()` for
  the literals; off-scale values (13px, 0.15s) stay literal with a note.
- [ ] **Audit** — run **`npm run audit:tokens`** (`tools/audit-tokens.mjs`). It
  reads every migrated file directly (no shell grep — immune to the RTK grep
  hook + zsh word-splitting that produced false "clean" results in the manual
  passes) and enforces every ERROR rule above: density, mirrors, state-in-middle,
  padding-x/y, `-h/-w/-z`, reversed property order, physical margins/padding,
  `-bg`/`-radius`/`-shadow` spelling, color variants. Exit 1 on any violation —
  wire into CI. Add a component to the `MIGRATED` set in the script as it
  migrates. (The script caught `padding-bottom: 0` in dialog/drawer that the
  hand greps missed — manual greps are no longer the audit; this is.)
  The script now ALSO does selector-context checks (advisory): **base-declaration**
  (a token set on a base selector — blocks scope override) and **fallback-gap**
  (a `var(--x)` read with no fallback that's never declared). It tracks the
  enclosing selector (string-aware char walker) and suppresses the legitimate
  patterns: modifiers (`.btn--sm`), states (`:hover`, `[data-state]`), scopes
  (`.card .x`), theme (`color-mode`), `@media` conditionals, `initial` resets,
  and **cross-block** sets (a selector retuning *another* component's tokens —
  e.g. `.avatar-group__more { --avatar-* }`). Only a base selector setting its
  OWN block's token is flagged. Verified with a positive-control test. Full
  codebase: **0 errors, 0 advisories** across 43 files — fallback-default is now
  machine-verified, not eyeballed.

**Clean baseline:** as of the misc cluster, all ~30 migrated files
(btn → misc) pass axes 1–6 of the comprehensive audit. Re-run before trusting
"done": `cd src/scss/components && /usr/bin/grep -hoE '<pat>' _{…}.scss`.

## Part 5 — Open questions

- [ ] Radius/shadow step naming: t-shirt keys confirmed; keep our values. Final
  step count?
- [ ] Expose all 9 font-weights or trim to normal/medium/semibold/bold?
- [ ] Ship the optional `type()` mixin, or functions only?
- [ ] Exact breakpoint values for `@custom-media --sm…--2xl`.
- [ ] `.status` vs `.status-view` (collision with status dot/badge)?
- [ ] When to lift token maps into DTCG/Style Dictionary for the React/Vue impls.
