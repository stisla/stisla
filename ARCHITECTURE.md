# Stisla Architecture — Constraint + Tailwind-scale era

> **Status:** CANONICAL as of 2026-06-25. This file is the source of truth for the
> token system, the build/scale engine, the component authoring model, the
> framework API, distribution, and the public "why" narrative.
>
> **Supersedes** the token / scale / build / distribution decisions in
> `V3-ARCHITECTURE.md`. That file described the *pre-Tailwind* era where the scale
> system was hand-rolled in Sass (`_scales.scss`). **Do not follow its build/scale
> decisions.** Its component-anatomy, state-hook, and a11y notes (and everything in
> `spec/`) remain valid.
>
> **How to read this file:** every line is a *decision already made*, not an option to
> reconsider. Do the work; don't re-derive it. Where you see `⚠️ CHECK`, stop and
> verify the named current state before acting. If a decision looks wrong, surface it
> to the maintainer — do **not** silently diverge.

---

## 0. Thesis — the "why" (this is the product, memorize it)

Stisla is a **framework-agnostic design system whose core value is constraint**. The
constraint lives in **tokens** (the single source of design decisions) and **knobs**
(per-component variables you tune instead of guess). Everything else — Bootstrap in
v2, Tailwind in v3-framework, plain CSS in vanilla — is an *implementation substrate*,
not the point.

The market reality we are designing around (decided in discussion, do not relitigate):

- Framework users (React/Vue/etc.) overwhelmingly use Tailwind and have a build step.
  Fighting that muscle memory is a losing fight.
- No-build users (classic Laravel, Django, Rails, CakePHP, CDN) have no build step and
  are the audience for the **vanilla** distribution.
- Raw Tailwind is *fast to prototype, bad at constraint at scale* — `bg-blue-500` in one
  place, a different blue in another, no governance. **Stisla is the governance layer
  Tailwind deliberately doesn't ship.**

We are **not anti-Tailwind**. We adopt Tailwind as the scale engine and add the layer it
omits: constrained tokens + constrained components.

---

## 1. The constraint = tokens

Tokens are the constraint, and there is **ONE token layer: the Tailwind `@theme`** — it emits
the CSS variables our component CSS reads AND generates the utilities. No parallel system.

| Kind | Form | Notes |
|------|------|-------|
| Semantic colors | `--color-*` (in `@theme`) | intents / surfaces / overlay / interactional / ring. Dark mode overrides them in `[data-theme="dark"], .dark`. |
| Tuned scales | `--radius-*`, `--shadow-*` (in `@theme`) | override Tailwind's defaults with our values. |
| Borrowed scales | `--spacing`, `--text-*`, `--leading-*`, `--font-weight-*`, `--tracking-*`, `--ease-*` | Tailwind's defaults, kept as-is. |
| No-namespace custom | `--st-border-width` (plain `:root`) | the lone global border thickness — not a scale, so no Tailwind namespace fits; read directly. z-index + duration instead ride Tailwind namespaces (`--z-index-*`, `--transition-duration-*`, `@theme static`). |
| Component knobs | `--<component>-*` | per-component tuning; default to theme tokens. |

`⚠️ CHECK` before adding a token: confirm it isn't already in
`next/packages/tokens/src/theme.css` (or a Tailwind default). That file is the source of truth.

### 1.1 Semantic colors (`--color-*`, defined in `@theme`)

**Intent (5 pairs):** `--color-primary(-foreground)` · `--color-success(-foreground)` ·
`--color-warning(-foreground)` · `--color-danger(-foreground)` · `--color-info(-foreground)`

**Surface (8):** `--color-background` `--color-foreground` `--color-surface` `--color-surface-2`
`--color-surface-3` `--color-border` `--color-border-strong` `--color-muted-foreground`

**Overlay:** `--color-overlay` `--color-overlay-foreground`

**Interactional:** `--color-neutral(-foreground)` · `--color-accent(-foreground)` ·
`--color-highlight(-foreground)`

**Focus:** `--color-ring`

Dark mode (`[data-theme="dark"], .dark`) overrides the surface + interactional colors; intents
stay put. Tuned geometry (also `@theme`): `--radius-sm/md/lg`, `--shadow-sm/md/lg/xl`,
`--font-sans/mono`. z-index + duration ride Tailwind namespaces (`--z-index-*`,
`--transition-duration-*`, in a `@theme static` block); the only no-namespace custom is
`--st-border-width`. Borrowed scales (`--spacing`, `--text-*`, `--leading-*`, `--font-weight-*`,
`--tracking-*`, `--ease-*`) are Tailwind's defaults. `tune` value-typing accepts the `--color-*`
names (codegen, §10.2).

### 1.2 Component knobs — convention

- Named `--<component>-<part>-<property>-<state>`, **unprefixed** (e.g. `--sidebar-button-bg-active`,
  `--button-tone`, `--sidebar-padding-inline`). This is the existing convention — see
  `_sidebar.scss` for the canonical example.
- **Fallback-default pattern:** nothing is set on the component base. Every consuming
  rule reads `var(--knob, <default>)` and repeats the default at each site, where the
  default is usually a global token. Example (real, from `_sidebar.scss`):
  ```scss
  background-color: var(--sidebar-button-bg-active, var(--color-highlight));
  ```
- To customize: set the knob in a scope (inline, wrapper, or `tune` prop). CSS
  inheritance distributes it to all inner parts — **you never thread values into child
  elements.** This is what makes complex components no harder than simple ones.

`⚠️ CHECK` before naming a knob: match the nearest finished component; knob defaults point at
theme tokens (`var(--color-*)`, `--spacing()`, …); the override knob is the unprefixed
`--<component>-*`.

---

## 2. Tailwind v4 as the scale engine

**Decision:** stop hand-maintaining a Tailwind clone in Sass. Adopt Tailwind v4 as the
scale/utility engine for the framework path. We adopt the **engine, not the default
values** — our OKLCH palette and tuned radius/shadow stay authoritative.

Mechanics (this is the corrected model — the tokens ARE the `@theme`, one layer):

- **Define semantic colors directly as `--color-*` in `@theme`** (literal OKLCH);
  `--color-*: initial` first to drop Tailwind's default palette. **No `@theme inline`, no
  parallel `--st-*` color layer.**
- **Tuned scales** (`--radius-*`, `--shadow-*`) override Tailwind's defaults in `@theme`.
  **KEEP** Tailwind's `--spacing` / `--text-*` / `--leading-*` / `--font-weight-*` /
  `--tracking-*` / `--ease-*` defaults — don't redefine them.
- **Dark mode:** override `--color-*` in a plain `[data-theme="dark"], .dark` block (literal
  values → flips with no freeze, no var-indirection). Register
  `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *, .dark, .dark *))`
  for utilities. Pure CSS class toggling, no JS.
- **z-index + duration** ride Tailwind namespaces (`--z-index-*`, `--transition-duration-*`) in a
  `@theme static` block, so each also generates a utility. **Border-width** has no namespace slot, so
  `--st-border-width` stays a plain `:root` custom. All read directly via `var()`.
- **Components reference theme vars directly:** `var(--color-*)`, `--spacing(n)`,
  `var(--leading-*)`, `var(--font-weight-*)`, `var(--radius-*)`, `var(--shadow-*)`, and
  `--alpha(var(--color-x) / N%)` for tints. **No magic numbers.**

`⚠️` Do **NOT** use `@theme inline` for colors, and never reference a separate parallel layer
from components. The earlier inline bridge was wrong: inline vars aren't emitted to `:root`, so
components couldn't read the theme and reached around it to a redundant `--st-*` layer. Defining
`--color-*` directly + a `.dark` override gives emitted, themeable, flip-correct vars under one
name (Tailwind colors doc → "Referencing in your CSS"). Reference impl:
`next/packages/tokens/src/theme.css`.

---

## 3. Token distribution — one source, multiple outputs

One source: **`@stisla/tokens/theme.css`** = `@import "tailwindcss"` + `@theme { … }` +
`[data-theme="dark"], .dark { --color-* overrides }` + `@theme static { --z-index-* / --transition-duration-* }` + `:root { --st-border-width }` +
`@custom-variant dark`. Tailwind consumers `@import "@stisla/tokens/theme.css"`.

The vanilla (no-build) bundle is the **compiled output** of this (`@theme static` → a `:root`
dump of all theme vars + the generated utilities), produced by the build — not a hand-authored
second file. (The old hand-authored `tokens.css` is removed.)

---

## 4. Component authoring model

- **BEM classes + knobs.** Components are stable BEM classes (`.sidebar`, `.button`,
  `.sidebar__button`) reading `var(--knob, <token default>)`. This is what makes the
  compiled CSS portable across vanilla/framework/non-Tailwind — the class doesn't care
  where the tokens come from.
- **Author in `@layer components`.** This is non-negotiable and is the reason we do **not
  need `tailwind-merge`**: `@layer utilities` is a *later cascade layer*, so a consumer's
  call-site utility (`px-8`) beats a component's padding **by layer precedence, not source
  order**. (Never describe this as "source order" — that's the pseudo-cascade bug we
  designed around.)
- **How to reference tokens in component CSS** — use Tailwind's facilities; do NOT reach
  around them (this is the rule that bit us once):
  - **Scales** (spacing / radius / shadow / type) come from Tailwind's *plain* `@theme`,
    emitted to `:root`: use `--spacing(n)`, `var(--text-sm)`, `var(--radius-md)`,
    `var(--shadow-md)`, `var(--font-weight-medium)`. NEVER hand-roll
    `calc(var(--st-spacing) * n)` or add literal fallbacks like `var(--text-sm, 0.875rem)`.
  - **Colors** are defined directly as `--color-*` in `@theme` (emitted to `:root`) → reference
    `var(--color-primary)` / `var(--color-surface)`; the dark block overrides them, so they flip.
    Tints come from `--alpha(var(--color-x) / N%)`. No `@theme inline`, no parallel color layer.
  - **z-index + duration** → `--z-index-*` / `--transition-duration-*`, declared in a `@theme static`
    block so each force-emits its var (raw `var()` refs resolve) and generates a utility.
    **border-width** → `--st-border-width` (a single value, not a scale, so no namespace fits).
  - Knobbable properties keep the knob fallback: `background: var(--button-bg, var(--color-x))`.
    Do **not** `@apply` a utility onto a property a knob must win on.
- **Complex components via inheritance, not prop-threading.** Set knobs on the root; inner
  parts read them through the cascade (already true in `_sidebar.scss`).
- Compiled output is **plain CSS reading `var(--color-*)`** (+ the `--st-*` customs) — renders
  in any context. The consumer never needs Tailwind for a Stisla component to display.

---

## 5. Framework API — variants (props) + knobs (`tune`)

Package: **`@stisla/style`** = compiled CSS + a typed runtime composer. We do **not** use
`cva` directly: `cva` maps variants→className only; our composer must also map
knobs→inline CSS vars (the `style` half). It returns `{ className, style }`.

**Litmus test for where anything goes:**
> **Resolves to a class → top-level prop. Resolves to a CSS variable → `tune`.**

- **Variants & states → top-level props.** Variants select BEM **modifier classes** (`tone`
  (button) / `intent`, `size`, `shape` → `.button--primary`, `.sidebar--sm`). States resolve to
  **attributes**, not classes — `loading` → `[aria-busy]`, `collapsed` → `[data-collapsed]`,
  `disabled` → `:disabled` / `[aria-disabled]` (the wrapper sets them; vanilla authors them).
  No `is-*` classes (see §11).
- **Knobs → `tune={{}}` prop.** All arbitrary CSS-var overrides go in ONE object. Never
  expose per-knob props (`padding={}`, `buttonBgActive={}`). Reasons: (1) avoids polluting
  the prop surface / colliding with Base UI + HTML attrs (Sidebar has ~30 knobs); (2) the
  `tune={{}}` shape *reads* as a deliberate off-system override — friction proportional to
  distance off-system; (3) one typed object = one self-documenting customization table per
  component.

**Naming:** the prop is **`tune`** (not `customize` — decided; shorter, and "you tune the
knobs" matches the mental model; pairs against `style` as the constrained vs raw escape
hatch). Same word on every component.

**Knob keys are short + derived; the long var name stays internal.** Mechanical transform:
strip the `--<component>-` namespace, camelCase. `--sidebar-button-bg-active` ⟷
`buttonBgActive`. The consumer types the short typed key (autocompleted); the long name
appears once, in the SCSS, where it is self-documenting.

**Token-reference value convention:** in `tune`, a value starting with `--` is a token
reference, anything else is a literal.
- `tune={{ tone: '--color-highlight' }}` → `--button-tone: var(--color-highlight)`
- `tune={{ tone: 'oklch(70% .2 30)' }}` → `--button-tone: oklch(70% .2 30)`
Resolver: `v.startsWith('--') ? \`var(${v})\` : v`.

**`tone` appears in both tiers, deliberately** — the two reach levels:
- `tone="danger"` → enum → class `.button--danger` (blessed, recommended).
- `tune={{ tone: 'oklch(...)' }}` → var → arbitrary color outside the palette (escape hatch).

**Composer shape (target signature):**
```ts
const sidebar = composer({
  base: 'sidebar',
  variants: { size: { sm: 'sidebar--sm', lg: 'sidebar--lg' } },  // base (unmodified) = md
  knobs: 'sidebar',   // namespace prefix; keys typed from the known --sidebar-* list
})
// → const { className, style } = sidebar({ size: 'sm', tune: { buttonBgActive: '--color-highlight' } })
```

**Per-instance override = same mechanism, set lower.** Compound sub-components accept
their own `tune`; setting `--sidebar-button-bg-active` on one `<Sidebar.Button>` beats the
inherited root value (closer in cascade). No second system for "one vs all."

```tsx
<Button tone="primary" size="lg" tune={{ radius: '--radius-lg' }} />
<Sidebar size="sm" collapsed tune={{ buttonBgActive: '--color-highlight' }} />
```

---

## 5B. The composer is the framework-agnostic layer (the linchpin of "many impls")

The composer (§5) is **pure JS/TS with zero framework dependencies**. It is what makes
"one design system, many impls" real on the JS side. Decomposition of a component, with
what is shared vs per-ecosystem:

| Layer | Shared across frameworks? | Where |
|-------|---------------------------|-------|
| Tokens | ✅ shared | `@stisla/tokens` (CSS) |
| Component CSS (BEM + knobs) | ✅ shared | `@stisla/style` (compiled CSS) |
| **Style composer** (variants→class, knobs→vars) | ✅ shared | `@stisla/style` (pure JS) |
| Component **config** (the variant/knob contract) | ✅ shared | `@stisla/style` (one config per component) |
| Headless **behavior** (focus, aria, state machine) | ❌ per-ecosystem | Base UI (React) · Reka/Radix-Vue (Vue) · Melt (Svelte) |
| **Render** (JSX / template) + ref/event wiring | ❌ per-ecosystem | `@stisla/react`, `@stisla/vue`, … |

- The composer resolves `(variantProps, tune) → { className, style }` as a **pure
  function**: no hooks, no context, no `Date.now`/random → **SSR/RSC-safe**, deterministic,
  no hydration mismatch.
- Each component's **config** (`base`/`variants`/`knobs`) is authored **once** in
  `@stisla/style`. Every framework wrapper imports the same config + composer, so the
  variant/knob contract is defined once and never reimplemented per framework.
- The framework package is a **thin wrapper**: call the composer → bind to that ecosystem's
  headless primitive → forward refs/events.

**Correction to the mental model — Base UI is React-only.** The wrapper is "composer +
*the ecosystem's* headless primitive," not "composer + Base UI" everywhere. React wraps
Base UI; Vue wraps Reka/Radix-Vue; Svelte wraps Melt. **Behavior is per-ecosystem; the
composer + CSS + tokens are the shared core.** Do not assume Base UI is portable.

```tsx
// @stisla/react — thin wrapper (React 19: ref is a plain prop, no forwardRef)
import { Button as Base } from '@base-ui/react/button'
import { button } from '@stisla/style'               // shared config + composer
export function Button({ ref, tone, size, shape, tune, className, ...rest }) {
  const { className: cls, style } = button({ tone, size, shape, tune, className })
  return <Base ref={ref} className={cls} style={style} {...rest} />
}
```
Vue/Svelte wrappers call the **same** `button(...)` and bind it to their own primitive +
template. No style or constraint logic is duplicated across ecosystems.

---

## 6. Packages & distribution

```
@stisla/tokens   theme.css (@theme --color-* + dark overrides; --z-index-*/--transition-duration-* static; :root --st-border-width)  ← shared by ALL
@stisla/style    pure-JS composer + per-component configs + compiled component CSS    ← shared by ALL framework impls (zero framework deps)
@stisla/css      vanilla bundle: tokens + compiled components (NO utilities)          ← zero build
@stisla/react    thin wrappers: Base UI (React) + @stisla/style + re-exports theme    ← depends on tokens + style
@stisla/vue      thin wrappers: Reka/Radix-Vue + @stisla/style (LATER — see §9)

# Optional: split the pure-JS composer into @stisla/core if you want it CSS-free; co-packaging
# in @stisla/style is fine since composer and CSS share the same name contract and version together.
```

- **One token source (`@stisla/tokens`)** that every package depends on → names cannot
  drift. One `npm install` pulls it transitively; consumer imports the token CSS once at
  root.
- **CSS tree-shaking:** co-locate per-component CSS (`import './button.css'` inside the
  component) and set `"sideEffects": ["**/*.css"]`. CSS follows the JS import graph — use
  20 of 300 components, ship 20 components' CSS. Do **not** ship one monolithic
  `styles.css` for the framework package.
- **JS tree-shaking:** ESM + `exports` map + the `sideEffects` above. Base UI is a
  dependency (bundled), React/react-dom are peers.
- **`@stisla/css` ships exactly two files** (decided 2026-06-28): `stisla.css` (tokens + all
  core components) and `stisla-full.css` (core + the 3 optional components — carousel, combobox,
  scroll-area). **No utilities bundle, no per-component CSS files, no `base` entry.** A consumer
  who wants a smaller-than-core build compiles from source with Tailwind:
  `@import "tailwindcss"; @import "@stisla/tokens/theme.css";` then the chosen `@stisla/style`
  component CSS. Per-component precompiled files are *additive* and can be introduced later
  without a breaking change if demand appears.

**Why packages, not shadcn-style copy-paste** (for the "why" page, §8): shadcn's pitch is
"own the code"; ours is the opposite — **"don't think about the code."** A design system
that must evolve coherently across React/Vue/vanilla can't have every consumer fork and
freeze it; copy-paste cannot receive updates. The two-files / not-daily-editable points
are secondary footnotes, not the headline.

---

## 7. Vanilla vs framework — same components, two deliveries

| Layer | Vanilla (`@stisla/css`) | Framework (`@stisla/react` etc.) |
|-------|-------------------------|----------------------------------|
| Component rules (BEM + knobs) | same compiled CSS | same compiled CSS |
| Tokens | `theme.css` emits `--color-*` + `--st-*` to `:root` | same `theme.css` `@theme` — also drives the consumer's utilities |
| Utilities | **not shipped** — consumer's responsibility | consumer's Tailwind **JITs** on demand |
| Build step (consumer) | none | yes |

- The component CSS is written **once** and shared. Only the token *source* and the
  utility *delivery* differ.
- **Vanilla ships no utilities** (decided 2026-06-28). Layout and utility classes are the
  consumer's responsibility — bring your own Tailwind, or write plain CSS. `@stisla/css` owns
  the component layer only. (The earlier plan to force-generate a curated utility set via
  `@theme static` + `@source inline(...)` is dropped.)
- Framework consumers' Tailwind makes only the utilities they use, as before.

`⚠️ CHECK` before adopting Tailwind in the **vanilla** build: see §9 — vanilla's existing
Sass build may stay as-is for the first slice. Do not rip out working vanilla Sass to
satisfy uniformity until the slice is proven.

---

## 8. The public "why" page — replace "why not Tailwind" with "why constraint"

**Decision:** delete the "why not Tailwind" framing. Do **not** replace it with "why
Tailwind" — that doesn't differentiate us and alienates the no-build audience the vanilla
build exists for. The hero is **constraint**.

**Page thesis (use this, not a paraphrase):**
> Tailwind gives you a great scale and an escape hatch. It does not give you constraint or
> components. Stisla is that missing layer — tokens as a single source of truth, and
> components with knobs — so your team stops drifting.

Structure: lead with the constraint thesis (true with or without a build step → serves
both audiences). Tailwind is one honest *section* inside, not the headline: "we use it,
here's why it's a great scale, here's the governance it omits that we add." A no-build
chapter and a framework chapter.

**Q&A to include (use this exact reasoning — paraphrasing changes the result):**

- **Q: Are we violating Tailwind's atomic principle by using BEM?**
  A: No — that framing is wrong and defensive. Tailwind ships `@layer components` and
  `@apply` *for exactly this*; the official guidance is "extract a component class when you
  see repetition." Tailwind has two layers — components and utilities — and most people use
  only one. **We use both:** constrained components for the repeated stuff, atomic
  utilities for the one-offs. We're committing to a layer Tailwind leaves optional, not
  transgressing it.

- **Q: How do I customize a component?**
  A: Tune the knobs first, via the `tune` prop (or by overriding the component's `--*`
  vars in CSS). Need more control? Override with utilities — see next.

- **Q: Will utilities override the component?**
  A: Yes. Utilities sit in a **later cascade layer** than components (`@layer utilities`
  after `@layer components`), so they win deterministically — **by layer precedence, not
  source order.**

- **Q: Isn't assembling utilities the recommended Tailwind approach?**
  A: For one-offs, yes — and you still can; utilities are the escape hatch. But assembling
  raw utilities for *reused* UI means every instance re-decides spacing and color, and your
  team drifts. Our components are the pre-assembled, constrained version. Reach for
  utilities when composing/overriding; reach for a component when you want the decision
  already made.

- **Q: How do I build a new custom component?**
  A: Start by assembling Tailwind utilities. When it repeats, abstract it into its own
  component file so you can reuse it. Then add knobs (`--*` vars + `tune`) if you want
  stronger constraint. (This is exactly how Stisla's own components are built.)

- **Q: Why packages, not shadcn-style distribution?**
  A: shadcn's pitch is "own the code"; ours is "don't think about the code." A versioned
  design system that spans React/Vue/vanilla can't have every consumer fork and freeze it —
  copy-paste can never receive an update. You'll mostly write `<Button size tune className />`,
  not edit our source. (Compiled CSS-in-CSS + JS isn't a daily-editable file.)

`⚠️ CHECK` before writing any prose on this page: apply the docs-voice rules — say
"Stisla" not "Stisla v3", no pixel callouts, no em dashes, short lead paragraph, say
"individual" not "à la carte". (See maintainer memory / existing pages.)

---

## 9. Sequencing — decide now, prove on a slice, then sweep

The architecture is **decided now** (this file). The no-users window is the cheapest time
to set it; deferring the *decision* is not on the table. What remains is execution order,
to de-risk the *pipeline* before mass-converting components.

1. **Lock the decision** — this file. Done when merged.
2. **Vertical slice (prove the pipeline end-to-end):**
   - Build `@stisla/tokens`: `theme.css` (`@theme` `--color-*` + dark overrides + `--st-*`
     customs) ported from current `_theme.scss`/`_scales.scss`.
   - Convert **Button** (one element) and **Sidebar** (≈30 knobs, compound) onto the model.
   - Stand up the `composer()` + `tune` for both.
   - Verify BOTH outputs: vanilla (tokens + compiled CSS + a utilities slice) AND framework
     (React + Base UI + consumer-Tailwind JIT), plus CSS tree-shaking and dark mode.
3. **Sweep** remaining components onto the proven model only after the slice works.

**Deferrable (and only this):** additional impls (Vue, etc.) — execution of a frozen spec,
not architecture. React + vanilla of the same components first.

`⚠️ CHECK` before step 3: confirm the slice (Button + Sidebar) is merged and both outputs
verified. Do not bulk-convert on an unproven pipeline.

---

## 10. Open questions — resolve before the relevant step (do not guess)

1. **Vanilla build during the slice:** keep vanilla on its current Sass build for the
   first slice (lower risk), or convert vanilla to the Tailwind-built foundation
   immediately? Token *values* are already shared, so the framework package can proceed
   either way. → maintainer decision before step 2's vanilla output.
2. **Token typing / codegen:** generate a TS union of valid `--st-*` token names (from the
   `$tones` list + scale maps) so `tune` autocompletes both keys and `--`-values. This is
   the backbone of the typed-knobs DX — design it explicitly, don't assume it.
3. **Dark-mode contract in framework package:** pure CSS class toggle (`.dark` /
   `[data-theme]`, no JS) is the default instinct — confirm and document; decide whether an
   optional helper/hook ships.
4. **Vanilla utility subset:** the full Tailwind utility set is large. Decide the curated
   list shipped in `@stisla/css` (affects bundle size). `log` what's dropped.
5. **Validation loss:** Sass `space(2)`/`tone(primary)` *error* on a bad step today;
   plain-CSS/Tailwind authoring fails silently on a typo. Decide guardrail: thin Sass
   authoring layer, or a lint rule.

---

## 11. Guardrails / triggers (read before acting)

- `⚠️` Never use `--bs-*`, BS5 Sass vars, or BS5 mixins — not even as fallbacks. Bare
  browser defaults beat a BS5 fallback. (Maintainer rule.)
- `⚠️` Never introduce Tailwind's *default* values (`bg-red-500`, default radius). Our
  tokens are authoritative; `@theme` must reset defaults (§2).
- `⚠️` Never `@theme inline` for colors — define `--color-*` directly in `@theme` so they
  emit to `:root` and flip via the dark-block override (§2). `@theme inline` would freeze them.
- `⚠️` Component base styles go in `@layer components`. Utilities win by layer order — never
  reintroduce `tailwind-merge` or rely on source order.
- `⚠️` The `cn` helper used in wrappers is a plain class-string join (`clsx`-style:
  `(...parts) => parts.filter(Boolean).join(' ')`). Do **not** install `tailwind-merge` /
  use shadcn's merge variant of `cn` — utilities win by layer order (above), so there is
  nothing to merge. Adding `tailwind-merge` re-introduces the dependency our `@layer`
  design exists to avoid.
- `⚠️` Knobs go in `tune`; variants/states go in top-level props. Never add a per-knob prop.
- `⚠️` Component BEM blocks use the full word, never abbreviations: `.button` (not `.button`),
  `.sidebar`, `.card`. Knobs follow the block name: `--button-*`, `--sidebar-*`.
- `⚠️` Component **size** modifiers use the t-shirt scale `sm` / `md` / `lg` / `xl`, base
  (unmodified element) = `md`; only `--sm` / `--lg` / `--xl` emit classes (no `--md` rule).
  This replaces the old `compact` / `roomy` — the Bootstrap-suffix-collision reason is moot,
  since Tailwind breakpoints are prefix variants (`md:`), not size suffixes.
- `⚠️` Component CSS reads the `@theme` tokens **directly** — colors `var(--color-*)`, spacing
  `--spacing(n)`, type `var(--text-*)` / `var(--leading-*)` / `var(--font-weight-*)`, radius
  `var(--radius-*)`, shadow `var(--shadow-*)`, tints `--alpha(var(--color-x) / N%)`. NO magic
  numbers, NO hand-rolled `calc()` over a base, NO literal fallbacks, and NO parallel token
  layer the component bypasses. There is ONE layer (`theme.css`); `--st-*` appears in component
  CSS only for the no-namespace customs (z-index, duration, border-width). No `@theme inline`. See §4.
- `⚠️` Composer config and component CSS are coupled by name: `variants` class strings must match
  the BEM modifiers, and `knobs` namespaces must match the `--*` knob names, in the component
  CSS. Rename in both or drift silently breaks styling — prefer generating / validating the
  config against the CSS. The composer is pure JS (no framework deps, no hooks) so it stays
  SSR/RSC-safe and importable from any ecosystem.
- `⚠️` Before naming a token or knob, check `next/packages/tokens/src/theme.css` / the nearest
  finished component — match the existing convention, don't invent.
- `⚠️` Component CSS must read `var(--color-*)` / a theme facility / `var(--knob)` — never
  hardcode a literal that should be themeable.
- `⚠️` A `@theme` color that **aliases** another color which flips in dark
  (`--color-ring: var(--color-primary)`, `--color-highlight-foreground: var(--color-primary)`)
  resolves live, so it tracks the override — but an alias of a *flipping* surface
  (`--color-x: var(--color-foreground)`) declared only in the base `@theme` **freezes** to the
  light value when dark is applied on a *nested* element (it only "works" when dark sits on
  `<html>`). For those, give the dark block its own literal (as `--color-neutral-foreground`
  does) rather than leaning on the alias — the freeze bit it before.
- `⚠️` Docs prose: "Stisla" not "Stisla v3"; no pixel callouts; no em dashes; "individual"
  not "à la carte"; `.text-muted-foreground` not BS5-isms.
- `⚠️` Porting `.njk` pages: the legacy markup MIXES the old site's **utility classes** and
  **demo-scaffolding** (`.demo-row`, the `{% call ui.demo() %}` macro, site layout utilities).
  IGNORE both — they belong to the old site, not the component. Carry over ONLY the
  component's own classes (`.button`, `--button-*`, …) and re-express structure with the docs'
  own primitives (`Demo`, `.prose`, the layout route). Result: clean ported docs.
- `⚠️` Component **state** uses attributes, never `is-*` classes (dropped — a SMACSS leftover,
  redundant with our attribute hooks). Native ARIA where it fits (`[aria-busy]` loading,
  `:disabled` / `[aria-disabled]`, `[aria-pressed]`, `[aria-current]`, `[aria-expanded]`);
  `data-*` otherwise (`[data-state]`, `[data-collapsed]`) — matching Base UI / Radix. Variants
  stay BEM `--` modifier classes. (Sidebar's `.is-collapsed` → `[data-collapsed]` in Phase 5.)
- `⚠️` After any build / verify / change, end with an **Eyeball check** for the maintainer:
  state what to look at (exact command, file path, URL, or selector) and what *correct*
  looks like (specific values / counts / rules / behavior), so they can confirm visually
  without re-deriving. Report failures with the actual output — never a bare "it works".
- `⚠️` Before anything uncertain or hard to reverse — installing/upgrading a package, choosing
  a version, adopting an unfamiliar API — **verify first** (official docs, the npm registry,
  web search). Never infer a package name or version from memory: `npm view`'s `latest` tag
  can be stale or point at a frozen legacy name (we nearly shipped `@base-ui-components/react@rc`
  when the real package was `@base-ui/react@1.6` — see [[base-ui-package]]). Confirm, then install.
- `⚠️` If a decision in this file looks wrong, surface it to the maintainer. Do not silently
  change architecture mid-task.

---

## 12. Repository layout & migration

**Current tree (legacy — being replaced):**

- `src/{scss,js,site}` — the **source of truth** you edit.
- `packages/css`, `packages/vanilla` — **generated staging output, NOT source.**
  `tools/build-packages.mjs` copies `src/scss → packages/css/scss` and compiles `dist/`;
  `.gitignore` ignores `packages/*/{scss,src,dist}` (only each package's hand-authored
  `package.json` + `README.md` are tracked — 4 files total). **Never edit anything under
  `packages/*/` — it is wiped on every `npm run build:packages`.**
- Root `package.json` is *named* `stisla-monorepo` but is **not** a real npm workspace —
  it's one source tree plus scripted staging.

**New tree (the rewrite — real pnpm workspaces, isolated under `next/`):**

Built under `next/` (rename/promote at cutover) so the legacy build keeps working untouched
until the slice is proven (§9).

```
next/
  package.json            private root, "packageManager": "pnpm@10"
  pnpm-workspace.yaml     workspace globs (packages/*, playground)
  .npmrc                  node-linker=hoisted — flat node_modules, keeps pnpm store dedup
  tsconfig.base.json
  packages/
    tokens/   @stisla/tokens   src/theme.css (@theme --color-* + dark overrides; :root --st-border-width)
    style/    @stisla/style    composer.ts (pure JS) + <component>/{config.ts, *.css}
    react/    @stisla/react    thin Base UI wrappers (dep: base-ui; peer: react)
    css/      @stisla/css      vanilla bundle (Tailwind CLI: @theme static + @source inline)
    vanilla/  @stisla/vanilla  vanilla-JS behavior layer (no-build interactivity); pairs with @stisla/css
    vue/      @stisla/vue      LATER
```

- Real packages with **their own deps** (react needs Base UI; style needs none) — that's
  why we move off the scripted-staging trick to pnpm workspaces (chosen for disk dedup via
  pnpm's global content-addressable store; `.npmrc` sets `node-linker=hoisted` so the
  playground's Vite source-aliases resolve peer deps while keeping that store dedup).
  Internal deps use the `workspace:*` protocol (incl. peerDependencies).
- Build tools: **Tailwind v4 CLI** for CSS; **tsup / vite-lib** for JS (ESM, per-component
  CSS, `"sideEffects": ["**/*.css"]`).
- `@stisla/css` reuses the legacy package name; the two coexist in different dirs during
  transition, only one publishes at cutover.

**Cutover (after slice + sweep, §9):** delete `src/`, legacy `packages/css` +
`packages/vanilla`, `tools/build-packages.mjs`, the legacy Vite config; promote `next/` to
the repo root.

**Live progress is tracked in `ROADMAP.md`** — this file holds *decisions*; `ROADMAP.md`
holds the *ordered task list + status*.
```
