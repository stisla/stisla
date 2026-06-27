# Porting a component to `next/` — the repeatable recipe

> This is the **operational playbook** for porting one legacy `src/scss/components/_<name>.scss`
> (+ its `src/site/pages/<name>.njk`) into the `next/` workspace. It encodes what we learned
> porting **Button** and **Alert** so later ports just repeat the pattern instead of re-deriving
> it. Decisions + rationale live in `../ARCHITECTURE.md` (§4 authoring, §11 guardrails); this file
> is the **checklist + conventions + verification**.
>
> Fast path: `node scripts/scaffold-component.mjs <name>` creates the skeletons and wires the
> shared files; then fill in the real CSS + demos; then `node scripts/check-tokens.mjs` and build.

## What a port produces

For a **vanilla** component (the default — CSS only, no JS, no framework wrapper):

| File | What | Created by scaffold? |
|------|------|----------------------|
| `packages/style/src/<name>/<name>.css` | the component CSS (`@layer components`, BEM + knobs) | ✅ skeleton |
| `docs/src/demo/demo.css` | add `@import ".../<name>/<name>.css";` | ✅ appended |
| `docs/src/routes/docs/vanilla/<name>.tsx` | the docs page | ✅ skeleton |
| `docs/src/routes/docs/route.tsx` | add a nav `<Link>` to the component | ✅ inserted (alphabetical) |

**Framework wrapper (later, Phase 3/7 — NOT per vanilla port):** only when a React/Vue wrapper
needs it, add `packages/style/src/<name>/config.ts` (the `composer()` contract) and export it from
`packages/style/src/index.ts`. Most vanilla ports skip this.

## Authoring rules (the lessons — non-negotiable)

These are the mistakes we already made and fixed. `check-tokens.mjs` enforces the greppable ones.

1. **Reference `@theme` tokens directly. ONE token layer.**
   - Colors → `var(--color-*)`. Tints → `--alpha(var(--color-x) / N%)`.
   - Spacing → `--spacing(n)` (supports fractions: `--spacing(2.5)`).
   - **Sizes too** — icon `width`/`height`, `background-size`, control dims use `--spacing(n)`, NOT a
     literal rem (Tailwind sizes off the spacing scale: `size-3` = `--spacing(3)` = 0.75rem). e.g.
     `width: var(--x-icon-size, --spacing(4))`, `background-size: --spacing(3) --spacing(3)`.
     EXCEPTION — a glyph/padding meant to scale with its OWN font-size uses `em` on purpose (an icon
     inside `.avatar__fallback` / a pip; `padding: 0 0.25em`), same as button/badge. `em` there is a
     feature (auto-scales across size modifiers), not an oversight — don't "fix" it to rem.
   - Genuinely off-scale values with no token (e.g. an 8px/10px pip font, a `9999px` pill, a `2px`/`3px`
     ring/outline width) stay literal — but map to a token whenever one exists (12px → `var(--text-xs)`,
     1.375 line-height → `var(--leading-snug)`). Note: 12px = `text-xs`, 14px = `text-sm`.
   - **Overlay z-index routes through the `--st-z-*` scale**, never a literal. Map by SEMANTIC tier
     (the scale is purpose-ordered): dropdown/menu → `--st-z-dropdown`, dialog/drawer → `--st-z-modal`,
     popover → `--st-z-popover`, toast → `--st-z-toast`, tooltip → `--st-z-tooltip`. Use the token even
     when the legacy SCSS used an ad-hoc number — the v3 scale fixes the relative ordering. Only LOCAL
     intra-component sibling stacking (`z-index: 1/2/3` for avatar overlap, focus-raise, a close chip
     above content) stays a literal — that's not overlay layering.
   - ⚠️ **Borrowed-scale GOTCHA (token emission):** Tailwind v4 only emits a *default* theme var to
     `:root` when a UTILITY uses it. A component that references `var(--leading-none)` etc. in raw CSS
     does NOT trigger emission — so the var is undefined and `line-height` silently falls back to the
     inherited `1.5`. `--leading-*` are now explicitly re-declared in `theme.css` to force emission.
     Before referencing any borrowed scale not already covered (`--tracking-*`, `--ease-*`, an unused
     `--text-*`/`--font-weight-*`), confirm it's emitted (read the compiled `:root` in the built
     `styles-*.css`) or re-declare it in `theme.css`. (Our own `@theme` colors/radius/shadow are always
     emitted; the risk is only the kept Tailwind defaults.)
   - Type → `var(--text-*)`, `var(--leading-*)`, `var(--font-weight-*)`, `var(--tracking-*)`.
   - Radius → `var(--radius-*)`. Shadow → `var(--shadow-*)`.
   - **Component-local dark overrides** (e.g. swapping a static `data:` URL the theme can't flip) use
     `@variant dark { … }` nested in the rule — NOT a hand-written `[data-theme="dark"]` selector.
     Token-level dark (`--color-*`) stays in `theme.css`; `@variant dark` is for per-component tweaks.
   - **No magic numbers**, no `calc(var(--st-spacing) * n)`, no literal fallbacks like
     `var(--text-sm, 0.875rem)`. No `--st-*` colors. No `@theme inline`. No parallel layer.
2. **`--st-*` is ONLY for no-namespace customs** Tailwind has no theme bucket for:
   `--st-border-width`, `--st-z-*`, `--st-duration-*`. Read those directly. Nothing else is `--st-`.
3. **BEM + knobs.** Block `.<name>`; modifiers `.<name>--variant`; knobs `--<name>-*` with the
   **fallback-default** pattern: `prop: var(--<name>-knob, <theme-token-default>)`. A knob default
   points at a theme token, never a raw literal.
   - **padding-block ⇔ padding-inline symmetry:** if a component exposes a `--x-padding-inline` knob it
     MUST also expose `--x-padding-block` (a `0` default is fine for hard-height controls). Never leave
     `padding-block` a hardcoded literal while `padding-inline` is tunable. A modifier that restores
     vertical padding sets the knob (`--x-padding-block: …`), not a raw `padding-block`. Exception ONLY
     for an addon with NO own height, sized purely by its parent + `align-items: center` (e.g.
     `.input-group__text`). An element that sets its OWN `height` (a navbar brand/button chip, a field)
     still gets the `--x-padding-block` knob (default `0`) — a fixed height is not the exception.
   - **Responsive breakpoints use Tailwind's `@variant <bp>` / `@variant max-<bp>`**, NOT a hand-written
     `@media (width …)`. `@variant lg { … }` → min-width 64rem, `@variant max-lg { … }` → below it; both
     resolve to the theme's breakpoint token instead of a hardcoded rem. (The legacy `@include
     media-up/down($bp)` and per-modifier `@media (min-width: Nrem)` blocks all map onto these.)
4. **Sizes use the t-shirt scale** `sm` / `md` / `lg` / `xl`. Base (unmodified) = `md`; only
   `--sm` / `--lg` / `--xl` emit rules (no `.<name>--md`).
5. **State = attributes / native ARIA, NEVER `is-*` classes** (`is-*` is a dropped SMACSS leftover).
   Use `[aria-busy]` (loading), `:disabled` / `[aria-disabled]`, `[aria-pressed]`, `[aria-current]`,
   `[aria-expanded]`, or `data-*` (`[data-state]`, `[data-collapsed]`). Variants stay BEM `--` classes.
6. **No bare-element styling.** Components are `.<name>` classes on `<div>` by default; don't style
   `h1`/`kbd`/`strong`/etc. globally — that's reboot/`.prose` territory. Landmarks only where unambiguous.
7. **Complex components inherit knobs through the cascade** — set `--<name>-*` on the root; inner
   parts read them. Don't thread props/knobs part-by-part.
8. **Compiled output is plain CSS** reading `var(--color-*)` (+ the `--st-*` customs) — it renders
   with no Tailwind present. Never `@apply` a utility onto a property a knob must win on.
9. **Lib-coupled CSS goes in a `<component>.<lib>.css` adapter, split from the portable contract.** If
   a component's vanilla impl is bound to a specific third-party JS lib's DOM (e.g. combobox ↔ Tom
   Select's `.ts-wrapper`/`.ts-control`/`.option`), keep `<component>.css` as the portable contract
   (the `.<name>` class, `--<name>-*` token knobs, sizes, native baseline — what a React/Vue impl
   reuses) and put the lib's DOM→token mapping in `<component>.<lib>.css` (e.g. `combobox.tomselect.css`),
   loaded AFTER the contract. The third-party lib's own class vocabulary is NOT Stisla state, so the
   no-`is-*` rule (#5) does not apply to those selectors. A component driven by Stisla's OWN BEM classes
   (e.g. autocomplete's `.autocomplete__*`) is NOT lib-coupled — keep it in one file.

## Translating the legacy SCSS → CSS

- Open `src/scss/components/_<name>.scss` for the structure/states, and `src/site/pages/<name>.njk`
  for the variants/examples to cover.
- **IGNORE the legacy site's utility classes AND demo-scaffolding** (`.demo-row`, the
  `{% call ui.demo() %}` macro, layout utilities). They belong to the old site, not the component.
  Carry over ONLY the component's own classes and re-express structure with the docs' primitives.
- Map SCSS vars → `@theme` tokens (rule 1). Map old `is-*` / state classes → attributes (rule 5).
- Map old size names (`compact`/`roomy`/etc.) → `sm`/`md`/`lg`/`xl` (rule 4).

## The docs page (`docs/src/routes/docs/vanilla/<name>.tsx`)

Mirror `button.tsx`. Shape:
- `<header>` with `<h1>` + `<p className="lead">` — a **short** lead (what the component is, nothing
  more). The `/docs` layout already wraps everything in `.prose`, so author content only.
- One `<section>` per variant/state group; each has an `<h2>`, a short `<p>`, and a `<Demo>`.
- Cover all the legacy variants/states the `.njk` showed.
- **End with a `<h2>Customization</h2>` section** that tables the `--<name>-*` knobs
  (Variable / Use). Group the table for high-knob components; a pointer line for shared-surface ones.

### `<Demo>` conventions
- `<Demo html={\`...\`} />` — the one `html` string drives BOTH the live iframe preview and the
  shown source. Don't hand-sync a separate code block.
- `layout="row"` (default) for inline controls (buttons); `layout="stack"` for full-width blocks
  (alerts, cards).
- Icons: lucide via `<i data-lucide="name"></i>` (a CDN script in the iframe calls `createIcons()`).
- Icon-only / ambiguous controls get an `aria-label`.
- Demo CSS comes from the docs app's own Tailwind via `demo.css?inline` — do NOT add a separate
  Tailwind CLI build. (See the `docs-demo-css` memory.)
- **Layout scaffolding uses Tailwind utility classes, NOT inline `style=`** (`<div class="flex flex-col
  gap-3 max-w-96">`, not `style="display:flex;…"`). EXCEPTION: a **component CSS-var override** that
  demonstrates tuning (`style="--avatar-indicator-bg: var(--color-danger)"`, `style="--avatar-group-overlap: 1.25rem"`)
  STAYS inline — that's the customization API being shown, and there's no utility for an arbitrary var
  value. Only convert layout chrome (flex/gap/width/min-width) to utilities. `demo.css` has
  `@source "../routes/docs"`, so
  Tailwind scans the demo HTML strings and emits the utilities into the inlined iframe CSS (bundled,
  no CDN). When you add a new component CSS `@import` to `demo.css`, the `@source` already covers any
  utilities you use in that component's demos.
- **Cap full-viewport-height components in demos.** The iframe auto-sizes to its content's
  `scrollHeight`. An IN-FLOW element sized to the viewport (`min-height: 100vh`, e.g. `.app-shell`)
  resolves that `100vh` against the iframe's own height, and the body padding makes `scrollHeight`
  exceed it every measure cycle → the iframe grows unbounded. Override the height with a `min-h-[Nrem]`
  utility on that element in the demo (utilities beat the component layer). (`position: fixed` overlays
  like dialog/drawer don't hit this — they don't contribute to `scrollHeight`.) DemoFrame also clamps
  the measured height as a backstop.

## Docs prose voice

"Stisla" (never "Stisla v3"). No pixel callouts ("pilled"/"1:1", not "48px"/"999"). No em dashes.
"individual" / "individually" (never "à la carte"). Prefer `.text-muted-foreground` over BS5-isms.
Short lead; fewer "X: Y" colon explanations.

## Verify (mechanical first, then eyeball)

1. `node scripts/check-tokens.mjs` — greps component CSS + docs pages for the forbidden patterns:
   `--bs-*`, `@theme inline`, `--st-*` color tokens (only the customs are allowed), `is-*` classes,
   `var(--st-spacing)` / `calc(var(--st-spacing)`, and scale-token literal fallbacks. Must be clean.
2. `pnpm --filter docs build` — client + SSR must build (batch several ports, then build once).
3. **Eyeball check** (always end here): tell the maintainer the exact URL
   (`/docs/vanilla/<name>`), the variants/states to look at, dark-toggle behavior, and what
   *correct* looks like. Report failures with the actual output, never a bare "it works".

## Don't get ahead of the slice gate

Per ROADMAP §9 / Phase 6: don't bulk-convert components before the Button + Sidebar slice is proven
(both vanilla AND framework outputs). Card/Badge are recipe guinea pigs; the parallel sweep is Phase 7.
