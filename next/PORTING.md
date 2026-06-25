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
   - Type → `var(--text-*)`, `var(--leading-*)`, `var(--font-weight-*)`, `var(--tracking-*)`.
   - Radius → `var(--radius-*)`. Shadow → `var(--shadow-*)`.
   - **No magic numbers**, no `calc(var(--st-spacing) * n)`, no literal fallbacks like
     `var(--text-sm, 0.875rem)`. No `--st-*` colors. No `@theme inline`. No parallel layer.
2. **`--st-*` is ONLY for no-namespace customs** Tailwind has no theme bucket for:
   `--st-border-width`, `--st-z-*`, `--st-duration-*`. Read those directly. Nothing else is `--st-`.
3. **BEM + knobs.** Block `.<name>`; modifiers `.<name>--variant`; knobs `--<name>-*` with the
   **fallback-default** pattern: `prop: var(--<name>-knob, <theme-token-default>)`. A knob default
   points at a theme token, never a raw literal.
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
