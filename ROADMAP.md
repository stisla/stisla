# Stisla Rewrite — Roadmap & Progress

## ▶ Start a fresh session — copy this prompt

```
Resuming the Stisla v3 rewrite. Read ARCHITECTURE.md and ROADMAP.md (and trust the
auto-loaded memory), then continue from the top item under ROADMAP's "Next". Tell me what
that item is and your plan before you start writing code. Follow the §11 guardrails in
ARCHITECTURE.md; don't bulk-convert components before the Phase 6 slice gate.
```

This prompt is generic on purpose — it works every session without editing, because the
actual next task always lives under **Next** below.

---

> Living tracker for the constraint + Tailwind-scale rewrite. **Decisions** live in
> `ARCHITECTURE.md`; this file is the **ordered plan + status**. Update the checkboxes and
> the "Current focus" line as you go so any session can resume without re-reading the chat.
>
> **Resuming in a fresh session?** Read `ARCHITECTURE.md` (decisions + §11 guardrails) then this
> file's **Current focus → Next**, and trust the auto-loaded memory. The next action is the top
> item under **Next**. Don't bulk-convert components before the slice gate (Phase 6) — see §9.
>
> Status: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked / needs a decision

## Current focus
> **HTML-first (vanilla) + docs.** Vanilla HTML/CSS design system leads; React/Vue are a thin
> later pass. The docs site is TanStack Start (React); vanilla demos render real HTML +
> `@stisla/css` in **sandboxed iframes**, so a `/docs/vanilla/<component>` page's demo IS the
> vanilla proof.
>
> **Done:** tokens + Button style + composer + React wrapper (Phases 1–3); docs app with a nav
> sidebar + **dark toggle** (theme follows into the demo iframes; toggle dogfoods `@stisla`
> Button + lucide-react); `/docs/vanilla/button` — each demo is `Demo` = sandboxed preview +
> react-shiki source; lucide via `<i data-lucide>` + a **CDN** `<script>` in the iframe (not
> bundled — authentic no-build usage); `.prose` (`@tailwindcss/typography`)
> owned by the `/docs` layout; `~/*` alias; file-based routing. **Demo iframe CSS** is the app's
> OWN Tailwind: `DemoFrame` imports `demo.css?inline` (compiled by `@tailwindcss/vite`, HMR-tracked)
> — no separate CLI / `demo:css` / `concurrently`, so editing `theme.css` or a component's CSS
> live-reloads the demos. **`/docs/vanilla/alert`** ported
> too (Alert CSS + page; nav now lists Alert + Button; `Demo` gained `layout="stack"` for
> block components like alerts). State convention: no `is-*` — attributes instead
> (`[aria-busy]`, `:disabled`/`[aria-disabled]`, `data-*`). **Token model corrected:** ONE Tailwind
> `@theme` layer — semantic colors are `--color-*` (+ tuned `--radius-*`/`--shadow-*`; spacing/type
> from Tailwind defaults), components reference theme vars directly (no `--st-*` colors, no magic
> numbers; `--alpha()` for tints; `--leading-*`/`--font-weight-*`/`--spacing()`); `--st-*` only for
> no-namespace customs (z/duration/border-width); dark via `.dark` override. `tokens.css` removed.
> All builds clean (client + SSR). **ARCHITECTURE.md** token sections (§1–§7, §9, §11–§12) were
> rewritten to match this corrected model (no stale `@theme inline` / `tokens.css` text remains).
>
> **Next (do in this order):**
> 1. **Port the next vanilla component** — Card or Badge (config + `*.css` + `/docs/vanilla/<name>`
>    page + nav entry), same pipeline as Button/Alert. This is the live work.
> 2. Align or drop the throwaway **playground** `--st-*` colors (it predates the `--color-*` model).
> 3. Share `Demo`/`DemoFrame` out of the duplicated playground copy.
>
> **Deferred (not blocking):**
> - React Button "feel" pass.
> - **Per-component demo CSS:** `demo.css?inline` is a monolith importing every component's CSS,
>   loaded once per demo page (one copy in the bundle, NOT per-frame — verified). Fine now (~5KB
>   gzip); when the catalog is large, split to per-component `?inline` (DemoFrame takes compiled
>   CSS as a prop) so a page only ships what it demos. Revisit during the Phase 7 sweep.
> - Persist theme without flash; shiki grammar chunking is heavy (react-shiki), revisit if build
>   size matters.

## Guiding rule
Decide → prove on a **slice** (Button + Sidebar, both vanilla + framework outputs) → sweep.
Do NOT bulk-convert components before the slice is verified (ARCHITECTURE §9).

## Decisions to make before they block a phase (mirror of ARCHITECTURE §10)
- [!] **§10.1 Vanilla during slice** — DEFAULT: build the *new* `@stisla/css` fresh in
  `next/`, leave legacy `packages/vanilla` + `src/scss` untouched until cutover. *Confirm.*
  (Gates Phase 4.)
- [ ] **§10.2 Token-name codegen** — generate a TS union of `--st-*` names from `$tones` +
  the scale maps; backs `tune` autocomplete + composer/SCSS validation. (Gates Phase 2/3.)
- [ ] **§10.3 Dark-mode contract** — pure CSS class toggle (`.dark`/`[data-theme]`) vs an
  optional hook. (Gates Phase 3.)
- [ ] **§10.4 Vanilla utility subset** — which utilities ship in `@stisla/css`. (Gates Phase 4.)
- [ ] **§10.5 Validation guardrail** — thin Sass authoring layer vs a lint rule. (Gates Phase 2.)

---

## Phase 0 — Scaffold workspace
- [x] `next/` workspace root (`package.json`, `tsconfig.base.json`, `.gitignore`)
- [x] Package skeletons: tokens, style, react, css (+ vue stub)
- [x] `cd next && pnpm install` succeeds (pinned `@base-ui/react@^1.6.0` — note: NOT the legacy
      `@base-ui-components/react`, which is frozen at `1.0.0-rc.0`)

## Phase 1 — Tokens (`@stisla/tokens`)  · foundation, everything depends on it
- [x] Port **semantic** `--st-*` from `_theme.scss` → `src/tokens.css` (colors, surfaces,
      interactional, overlay, ring, radius anchors, shadow tiers, border-width, fonts, z,
      duration) + `[data-theme="dark"], .dark`. NOTE: borrowed abstract scales
      (text/leading/tracking/weight/ease) are intentionally NOT ported — see below.
- [x] Author `src/theme.css`: `@import tailwindcss` + `@import ./tokens.css`; reset only the
      owned namespaces (`--color-*`, `--radius-*`, `--shadow-*`) then `@theme inline` bridge
      to `--st-*`; bridge `--spacing` + `--font-*`; **KEEP** Tailwind's borrowed scales
- [x] Register dark variant (`@custom-variant dark …`)
- [x] VERIFY (tw v4.3.1): utilities resolve to our tokens — `.bg-primary`→`var(--st-primary)`,
      `.rounded-md`→`var(--st-radius)`, `.p-4`→`calc(var(--st-spacing)*4)`,
      `.shadow-md`→`var(--st-shadow-md)`; `dark:*` → `&:where([data-theme="dark"], .dark, …)`;
      reset-then-`@theme inline` composes correctly (out.css 9.8KB, no default palette)
- [ ] VERIFY: Tailwind v4's *current* text/leading/weight/ease defaults still match what we
      shipped (they were borrowed at some point; v4 may differ slightly — override only the
      ones that drift, if any)
- [ ] (Phase 4) generate the non-Tailwind `:root` dump for the vanilla bundle (`@theme static`)

## Phase 2 — Composer + Button style (`@stisla/style`)
- [x] `src/composer.ts` — pure `(variantProps, tune) → { className, style }`; `--`-prefix
      token-ref resolver; camelCase→kebab knob keys; zero framework deps
- [x] Port Button CSS → `src/button/button.css` (BEM `.button` + `--button-*` knobs,
      `@layer components`; sizes sm / md=base / lg / xl)
- [x] `src/button/config.ts` — base, variants (tone / shape / size / flags), knob namespace `button`
- [x] `src/index.ts` exports
- [ ] Wire build: Tailwind CLI (CSS) + tsup (ESM, per-component, sideEffects css).
      (Base UI dep resolved: `@base-ui/react@^1.6.0`; `pnpm install` works.)
- [ ] (needs §10.2 / §10.5) token typing + authoring guardrail
- [x] VERIFY: composer outputs correct className/style (tune token-ref + literal, default
      md = no class, className passthrough); `button.css` compiles (tw v4.3.1) using Tailwind
      facilities — `--spacing(n)`→`calc(var(--spacing)*n)` (incl. fractional 2.5), `var(--text-sm)`,
      `var(--radius-md)`, `var(--font-weight-medium)` all emitted to :root; colors via raw `var(--st-*)`

## Phase 3 — Button React wrapper + framework proof (`@stisla/react`)
- [x] `Button.tsx` — thin wrapper over Base UI's `Button` (`@base-ui/react@1.6`: render /
      nativeButton / focusableWhenDisabled) + the `@stisla/style` composer; React 19
      ref-as-prop (no forwardRef). `cn` exported (plain join).
- [x] Minimal playground (`next/playground`: Vite + React 19 + @tailwindcss/vite; consumes
      workspace source via aliases; `styles.css` pulls `theme.css` + `button.css`)
- [x] HEADLESS VERIFY: `pnpm install` + `vite build` both pass (59 modules incl. Base UI, 16.5KB CSS). Wrapper,
      composer import, App's variants/tune/utilities, and Tailwind processing of theme.css +
      button.css all compile & bundle.
- [ ] VISUAL VERIFY (browser — `pnpm --filter playground dev`): tones/sizes/shapes paint; `tune`
      radius + arbitrary-tone apply; `className="bg-danger"` beats primary (layer order); dark
      toggle flips surfaces. (Tree-shaking is a build-time property, validated in Phase 6 gate.)

## Phase 4 — Button vanilla proof (`@stisla/css`)  · [!] gated by §10.1 / §10.4
- [ ] Build vanilla bundle: tokens + Button CSS + forced utilities
      (`@theme static` + `@source inline`)
- [ ] Static HTML page, no build / CDN-style
- [ ] VERIFY: Button renders + rethemes via a `:root` override, with no Tailwind present

## Phase 5 — Sidebar through the full pipeline  · the complex proof
- [ ] Port `src/scss/components/_sidebar.scss` → `style/src/sidebar/sidebar.css`
- [ ] `sidebar/config.ts` — variants (size sm/md/lg, collapsed) + ~30 `--sidebar-*` knobs
- [ ] Compound React wrappers (`Sidebar`, `Sidebar.Button`, …) with per-instance `tune`
- [ ] `@stisla/vanilla` sidebar behavior (submenu toggle, collapse) for the vanilla output — first use of the vanilla-JS layer
- [ ] VERIFY: root `tune` themes all items (inheritance); a sub-component `tune` overrides one;
      collapsed + dark; both vanilla + framework outputs

## Phase 6 — Slice gate
- [ ] Review both components × both outputs; confirm the pipeline end-to-end
- [ ] Resolve any remaining §10 decisions, now informed by reality
- [ ] Sign off → unlock the sweep

## Phase 7 — Sweep  · only after Phase 6
- [ ] Inventory all legacy components (`src/scss/components/`)
- [ ] Convert each through the proven pipeline (config + css + wrapper)
- [ ] Port utilities, app-shell, remaining surfaces

## Phase 8 — After the sweep  · parallelizable
- [ ] `@stisla/vanilla` — vanilla-JS behavior layer (dialog, drawer, dropdown, accordion, sidebar). Per-ecosystem sibling to react/vue; needed by interactive vanilla demos. (First partial use lands in Phase 5 for the sidebar.)
- [ ] `@stisla/vue` (Reka/Radix-Vue + the shared composer)
- [ ] **Docs site — TanStack Start** (dogfoods `@stisla/react`)
  - Content authored as **plain HTML** (not markdown) inside `.prose`; start by porting the
    existing `src/site/pages/*.njk` pages, swapping nunjucks macros for React components
  - When porting `.njk`: ignore the legacy site's utility classes AND demo-scaffolding
    (`.demo-row`, `ui.demo()`, layout utilities) — carry over only the component's own classes
    and re-express structure with docs primitives (`Demo`, `.prose`). See ARCHITECTURE §11.
  - Routes per impl: `/docs/vanilla/<component>` (HTML/CSS usage → iframe demos) and
    `/docs/react/<component>` (component usage → inline demos, iframe for overlays); scales to
    `/docs/vue/*`. Shared concept / variant-gallery / token-table are React components reused
    across impls — only the invocation syntax + demo type differ per route.
  - One snippet per demo drives BOTH the live render and the shown/copyable code (no hand-syncing)
  - Vanilla demos → sandboxed **iframe** (real HTML + `@stisla/css` + `@stisla/vanilla`): authenticity + style isolation
  - React demos → **inline** render, EXCEPT overlays (below)
  - Overlay/portal components (dialog, drawer, popover, dropdown, tooltip, toast) → **iframe for BOTH impls**: the overlay is contained to the iframe's own viewport (`fixed`/portal resolves to the iframe), so it can't cover the docs page — the iframe's main win, not a limitation
  - Iframe = a sized **stage**: short auto-height for static components; taller fixed min-height for overlays/large ones; per-demo height
  - **Expand** affordance: parent toggles the iframe to `fixed`/`inset:0`/full-viewport so dialog/drawer show at real scale (reuses the same iframe content)
  - Plumbing: `ResizeObserver`→`postMessage` auto-height; parent posts theme, iframe sets its own `[data-theme]`
- [ ] Rewrite docs "why" page → "why constraint" (ARCHITECTURE §8)
- [ ] Cutover: delete legacy `src/` + old `packages/` + `build-packages.mjs`; promote `next/`
