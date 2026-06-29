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
> too (Alert CSS + page; `Demo` gained `layout="stack"` for block components like alerts).
> **`/docs/vanilla/badge`** ported (Badge CSS + page; nav now lists Alert + Badge + Button):
> filled intents + `--soft` tinted variant + leading-icon convention + pill default; soft tint
> uses `color-mix` on the dynamic `--badge-tone` (the `.button--soft` precedent, not compile-time
> `--alpha()` which alert reserves for static per-modifier colors). Build clean (client + SSR).
> State convention: no `is-*` — attributes instead
> (`[aria-busy]`, `:disabled`/`[aria-disabled]`, `data-*`). **Token model corrected:** ONE Tailwind
> `@theme` layer — semantic colors are `--color-*` (+ tuned `--radius-*`/`--shadow-*`; spacing/type
> from Tailwind defaults), components reference theme vars directly (no `--st-*` colors, no magic
> numbers; `--alpha()` for tints; `--leading-*`/`--font-weight-*`/`--spacing()`); z-index + duration
> ride Tailwind namespaces (`--z-index-*`/`--transition-duration-*`), `--st-border-width` the lone custom; dark via `.dark` override. `tokens.css` removed.
> All builds clean (client + SSR). **ARCHITECTURE.md** token sections (§1–§7, §9, §11–§12) were
> rewritten to match this corrected model (no stale `@theme inline` / `tokens.css` text remains).
>
> **Porting tooling (new):** `next/PORTING.md` is the repeatable recipe (output files, wire-up
> points, the lessons: token refs, no `is-*`, attribute/ARIA state, docs shape, verify steps).
> `pnpm scaffold <name>` generates CSS + docs-page skeletons and wires `demo.css` + the nav link
> (alphabetical). `pnpm check` (`scripts/check-tokens.mjs`) greps for forbidden patterns (`--bs-*`,
> `@theme inline`, non-custom `--st-*`, `is-*`, scale-literal fallbacks) — it already caught + we
> fixed stale `var(--st-*)` color refs in `button.tsx`/`alert.tsx` docs tables.
>
> **Done:** Card ported — `packages/style/src/card/card.css` (token refs only; `--st-foreground`→
> `--color-foreground` etc., `radius(lg)`→`var(--radius-lg)`, `space(n)`→`--spacing(n)`, internal
> dividers `var(--st-border-width)`, overlay text `var(--color-overlay-foreground)`, title leading
> `--leading-tight`) + `docs/src/routes/docs/vanilla/card.tsx` (8 sections + Customization table).
> `.card > .media--flush` OMITTED (deferred to Media port). `check` clean, docs build clean.
>
> **Done:** Deleted the throwaway `next/playground/` (Phase 3 React spike, superseded by the docs
> app as the React+vanilla proof). It had bit-rotted onto the old `--st-*` color names and carried a
> forked, stale copy of `Demo`/`DemoFrame` + an inlined `iframe.css`. Removing it resolved BOTH
> former next items (no playground tokens to re-point, no harness to dedupe). Dropped `playground`
> from `pnpm-workspace.yaml`; root `dev` script now `--filter docs`; lockfile re-synced; docs build
> + token check clean.
>
> Also: default body copy set to 14px (`theme.css` `@layer base { body { font-size: var(--text-sm) } }`),
> keeping 1rem = 16px so spacing stays anchored. Propagates to vanilla, framework, and demo iframes.
>
> **PIVOT (2026-06-26): vanilla-HTML-only sweep, React paused.** Maintainer wants ONE track — port
> every component's CSS + docs first, defer ALL React wrappers AND the `@stisla/vanilla` behavior layer
> to a later pass. Don't interleave React work into the sweep. Interactive components (dialog, drawer,
> accordion, popover, tabs, select, toast, …) get CSS + **static-state demos** now (states shown via
> attributes, e.g. submenu open/closed); their click behavior waits for the deferred behavior pass.
>
> Sidebar's React work (config.ts + `@stisla/react` compound wrappers + `/docs/react/sidebar`) is DONE
> and stays as the framework reference — do not delete. The vanilla pipeline is proven (Button, Alert,
> Badge, Card, Sidebar all through `scaffold`→port→`check`→build), so the sweep is low-risk.
>
> **Active track = Phase 7 sweep, vanilla only.** Per-component: `pnpm scaffold <name>` → port CSS
> (token refs, `is-*`→attributes, sizes→sm/md/lg) → port docs (cover the `.njk`, Customization table) →
> `pnpm check` → batch-build. Deferred: React wrappers, `@stisla/vanilla` behavior, Phase 6 gate sign-off.
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
- [x] **§10.4 Vanilla utility subset** — RESOLVED (2026-06-28): **no utilities shipped** in
  `@stisla/css`. Layout + utilities are the consumer's job (bring your own Tailwind / plain CSS).
  `@stisla/css` ships exactly two bundles — `stisla.css` (tokens + all core components) and
  `stisla-full.css` (core + carousel/combobox/scroll-area). No utilities bundle, no per-component
  files, no `base` entry; smaller-than-core builds compile from source with Tailwind.
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
- [x] Port `src/scss/components/_sidebar.scss` → `style/src/sidebar/sidebar.css` (stage 1, vanilla).
      Token refs only; `.is-collapsed`→`[data-collapsed]`, `--compact`/`--roomy`→`--sm`/`--lg`,
      `.btn`→`.button` + `--btn-*`→`--button-*`, dropped `.disabled` (→ `:disabled`/`[aria-disabled]`),
      `.is-collapsing`→`[data-collapsing]` (JS hook, ready for the behavior layer). Literal animation
      durations preserved (hand-tuned choreography; no matching duration token). `pnpm check` clean,
      docs build clean (sidebar chunk 36.9KB).
- [x] `docs/src/routes/docs/vanilla/sidebar.tsx` — 11 demo sections + grouped Customization tables
      (Shell/Brand/Button/Item action/Group/Submenu/Motion). Submenu + rail shown statically (open +
      closed, `[data-collapsed]`); interactive toggle deferred to the JS behavior layer.
- [x] `sidebar/config.ts` — root contract: variants `size` (sm/md=base/lg) + 31 `--sidebar-*` knobs
      (camelCase, typed `as const`). `collapsed` is a STATE (→ `[data-collapsed]` attribute, wrapper
      sets it), NOT a class variant; the item-action `--reveal` belongs to that sub-part. Exported
      from `style/src/index.ts`. tsc clean (strict), token check clean, docs build clean. NOTE: this
      is the first ~30-knob config — exercises the §10.2 token-name codegen question (still open).
- [x] Compound React wrappers (`@stisla/react` `Sidebar` + dot-API: `.Header/.Brand/.Content/.Footer/`
      `.Menu/.Group/.GroupTitle/.GroupAction/.List/.Item/.Button/.ItemAction/.Submenu/.Caret`). THIN:
      each resolves to the same BEM class + `--sidebar-*` vars as vanilla (composer per sub-part, shared
      `sidebarKnobs` typed namespace). `Sidebar.Button` polymorphic (href→`<a>`, else `<button>`);
      `collapsed`→`[data-collapsed]` attr (state, not class); per-instance `tune` on any sub-part
      overrides via cascade. Added `DataAttrs` to prop types (React HTMLAttributes blocks `data-*` on
      custom components). Exported from react `index.ts` + `package.json` `./sidebar`. **Framework proof:**
      `/docs/react/sidebar` route renders `<Sidebar>` INLINE (sidebar.css added to docs shell styles),
      with root-tune + per-item-tune-override + collapsed demos. tsc clean, docs build clean (React
      sidebar chunk 11.4KB + composer chunk). Visual: `pnpm dev` → /docs/react/sidebar.
- [ ] `@stisla/vanilla` sidebar behavior (submenu toggle, collapse) for the vanilla output — first use of the vanilla-JS layer
- [ ] VERIFY: root `tune` themes all items (inheritance); a sub-component `tune` overrides one;
      collapsed + dark; both vanilla + framework outputs

## Phase 6 — Slice gate
- [ ] Review both components × both outputs; confirm the pipeline end-to-end
- [ ] Resolve any remaining §10 decisions, now informed by reality
- [ ] Sign off → unlock the sweep

## Phase 7 — Sweep  · vanilla-only (React/behavior deferred — see PIVOT above)
Order: form primitives → simple display → composite → interactive (CSS + static demos) → layout.
Per component: `pnpm scaffold` → port CSS (token refs, `is-*`→attr, sizes→sm/md/lg) → port docs →
`pnpm check` → batch build. ~52 total; 5 done pre-sweep (button/alert/badge/card/sidebar).

**Forms — Batch 1 (input, textarea, field): [x] DONE.** Shared `form-field-base` mixin duplicated
per component with its own `--input-*`/`--textarea-*` knobs (maintainer decision 2026-06-26: faithful
to per-component knob contract; keep the three field bases in sync). sizes compact/roomy→sm/lg.
Tooling fixes this batch: scaffold nav-insert now scopes to the "Vanilla" group (survives the React
group); `check-tokens` scale-literal-fallback regex no longer false-matches `--textarea-*` (the
`--text` prefix collision). field item demos use forward-compatible `.checkbox`/`.radio`/`.switch`
(style up in Batch 2); slider demo dropped. `pnpm check` clean (21 files), docs build clean.
- [x] Forms — Batch 2: checkbox, radio, switch. `form-check-base` duplicated per component
      (`--checkbox-*`/`--radio-*`; switch standalone). Native state only (`:checked`/`:indeterminate`/
      `:disabled`/`:focus-visible`/`[aria-invalid]`/`:user-invalid`), no is-*. switch `--roomy`→`--lg`.
      Two off-scale radii kept as literals (no token in the sm/md/lg scale): checkbox box `0.25rem`,
      switch pill `9999px` (same precedent as `.button--icon-round`); both overridable via their knob.
      Indicator glyphs are literal-white `data:` SVGs (URLs can't read CSS vars). Demos use utility-class
      scaffolding. `pnpm check` clean (27 files), docs build clean.
- [x] Forms — Batch 3: select (NATIVE only), input-group, button-group. **select**: native field base
      (dup `form-field-base` with `--select-*`) + chevron well + `[multiple]`/`[size]` opt-out + dark
      chevron swap (`[data-theme=dark] .select`); JS trigger/popup (`.select__*`, `menu-surface`)
      DEFERRED to the menu + behavior pass. **input-group**: wrapper-owns-chrome, `:has()` focus/
      validation/disabled forwarding, inset `.button` chip; `.btn`→`.button`. **button-group**: renamed
      `.btn-group`→`.button-group` + members `.btn`→`.button` + child knobs `--btn-*`→`--button-*`
      (full-word BEM); seam `-1px`→`calc(-1 * var(--st-border-width))`; `--button-toolbar`. All sizes
      compact/roomy→sm/lg, 13px→`var(--text-xs)`. `pnpm check` clean (33 files), docs build clean.
      ✶ Forms set complete (input, textarea, field, checkbox, radio, switch, select-native, input-group, button-group).
- Conventions tightened (applied + in PORTING.md): (a) icon/control SIZES use `--spacing(n)` not literal
  rem (Tailwind sizes off the spacing scale; normalized button/sidebar/input/input-group/select to match
  alert/switch); (b) component-local dark overrides use `@variant dark {}` (select chevron), not a
  hand-written `[data-theme]` selector. Layout widths (sidebar 16rem) + anim anchors (3rem) stay literal.
- [~] Simple display (in progress):
  - [x] media, avatar, avatar-group. media: row primitive (figure/content/title/desc/meta/action) +
        `--flush`/`--vertical` + interactive `a.media`/`button.media`. **Closed the deferred
        `.card > .media--flush` loose end** (wired into card.css). avatar: initials/image/icon tile +
        indicator; JS image-preloader DEFERRED (demos use `data-status="loaded"`); pill radius literal
        9999px; sizes compact/roomy/spacious→sm/lg/xl. avatar-group: overlap + per-member ring,
        `__more` tail. Demos use ported deps only (icon-box/separator unported → bare icons, no hr).
        `pnpm check` clean (39 files), docs build clean.
  - [x] separator, icon-box, indicator. separator: hairline (h/v), thickness defaults to
        `var(--st-border-width)`. icon-box: tinted icon tile, intent mixins expanded to `--color-*`,
        round/square shapes, sizes sm/lg, fixed icon size via `--spacing()` (not em). indicator: dot
        (::after) + opt-in pulse (::before), intents, sizes, ring halo; pinned via Tailwind absolute
        positioning (`.pin-*` utils deferred to utilities pass). **Backfilled media flush demo with
        `<hr class="separator">` dividers.** `pnpm check` clean (45 files), docs build clean.
  - [x] kbd, link, spinner. kbd: key-cap chip (neutral fill + rim + bottom edge), nested-combo
        wrapper via `:has(> .kbd)`, 13px→`var(--text-xs)`, `line-height: var(--leading-none)` (now
        resolves after the leading-token fix). link: inline anchor (primary underline + derived hover),
        icon sizing. spinner: border-ring + `--grow` pulsing dot, currentColor, sizes sm/lg, reduced-
        motion SLOWS not stops. Demos: `is-loading`→`aria-busy`, `visually-hidden`→`sr-only`. `pnpm
        check` clean (51 files), docs build clean.
  - [x] progress, meter, breadcrumb, pagination. progress: track+bar grid, intents, animated shimmer,
        indeterminate via `[data-indeterminate]` (was `.is-indeterminate`); own keyframes. meter:
        progress's static cousin — segmented stacking + legend, no in-motion modifiers. breadcrumb:
        muted trail, `aria-current` emphasis, Unicode `›` divider via `::before` var-fallback. pagination:
        page chips (hover=accent, active=highlight via `data-state`/`aria-current`), ellipsis, sizes,
        alignment. All sizes compact/roomy→sm/lg, 13px→`var(--text-xs)`, pill→9999px, `line-height: 1`→
        `var(--leading-none)`/`1.4`→`var(--leading-snug)`. `pnpm check` clean (59 files), build clean.
  ✶ SIMPLE-DISPLAY CATEGORY COMPLETE (media, avatar, avatar-group, separator, icon-box, indicator,
    kbd, link, spinner, progress, meter, breadcrumb, pagination).
- Token-emission fix (this session): `--leading-*` re-declared in theme.css (Tailwind tree-shook them
  → all component line-heights were silently falling back to 1.5). Inter now loaded (CDN) in docs shell
  + demo iframe (was rendering in the system fallback font). See PORTING.md "Borrowed-scale GOTCHA".
- [~] Composite:
  - [x] toggle, toggle-group. toggle: two-state press button; active from 3 sources (aria-pressed /
        data-state="active" / .toggle-input:checked + .toggle) paint identically; icon 1em (scales w/
        size); icon-only/icon-round; `.toggle-input` visually-hidden form path (works no-JS). toggle-group:
        pill container, ghost-rest members + concentric inner radius, horizontal (scroll-not-squish) +
        vertical (menu-list) + sizes. compact/roomy→sm/lg, 13px→text-xs, pill→9999px, line-height→leading-none.
        Press/arrow-key behavior deferred to the JS layer; static states shown. `pnpm check` clean (63), build clean.
  - [x] list-group, tabs. list-group: row stack, interactive a/button rows (auto hover/focus), states
        (data-state/aria-current), flush/numbered/horizontal(+responsive `--horizontal-{sm…2xl}` via
        @media rems, `xxl`→`2xl`), contextual intents (oklab 10% mix), card auto-integration; intent
        `@each` loop expanded to 5 `--color-*` rules; divider 1px→`var(--st-border-width)`. tabs: muted
        rail + paper-pill active trigger, data-state="active|inactive" panels, icons, vertical; concentric
        trigger radius; 0.15s→`var(--st-duration-fast)`. Switching behavior deferred to JS; static states
        shown. `pnpm check` clean (67), build clean.
  - [x] table. Dashboard grid: layered per-cell box-shadow paint chain (rest/variant/state) kept
        verbatim; row variants (`@each`→5 `--color-*`, oklab border mix), striped rows/cols, hover,
        active row (`data-state`), bordered/borderless, `--compact`→`--sm`, align-middle, alt head,
        sortable header (CSS-mask caret, `data-state` asc/desc), body divider, responsive wrappers
        (`media-down` loop→`@media (width < Nrem)`, `xxl`→`2xl`), card flush-integration (concentric
        corners). 1px borders→`var(--st-border-width)`, 120ms→`var(--st-duration-fast)`. Sort/select
        behavior deferred to JS; static states shown. `pnpm check` clean (69), build clean.
  ✶ COMPOSITE CATEGORY COMPLETE (list-group, table, tabs, toggle, toggle-group).
- [x] Interactive (CSS + static demos; behavior deferred):
  - [x] tooltip, popover, accordion. tooltip: inverse-surface chip (`bg=--color-foreground`,
        `color=--color-background`), `data-state`/`data-placement` hooks, `__inner`+`__arrow`
        (square→spacing(2)), per-side entrance transforms; `0.8125rem`→`var(--text-xs)`,
        `1.4`→`var(--leading-snug)`, `0.15s`→`var(--st-duration-fast)`, z-index→`var(--st-z-tooltip)`.
        popover: surface-tier panel, plain (title+body) vs panel (`:has(__header)` drops root padding,
        edge-to-edge dividers), per-placement bordered diagonal arrow (square→spacing(3)), close chip
        (999px→9999px), `.popover--menu` feeds `--media-*`; `text(sm)`→`var(--text-sm)`, body 1.5→
        `var(--leading-normal)`, title 1.3→`var(--leading-tight)`, 15px→`var(--text-base)`, widths→
        `--spacing(52/69)`, 0.18s→`var(--st-duration-normal)`, z-index→`var(--st-z-popover)`. accordion: open-chip stack
        (`data-state` open/closed), concentric item radius calc, divider-on-open, chevron rotate,
        `--flush`; `1rem` icon→`--spacing(4)`, 1px borders→`var(--st-border-width)`, 0.12s/0.15s→
        `var(--st-duration-fast)`. Demos reveal overlays via `data-state="open"` + Tailwind
        positioning utilities (utilities layer beats components, so centering wins); behavior deferred
        to JS. `pnpm check` clean (75), build clean.
  - [x] collapsible, dialog, drawer. collapsible: height-animation primitive, `data-state` closed→
        display:none, `.is-collapsing`→`[data-collapsing]` transition flag; 0.2s→`var(--st-duration-normal)`.
        dialog: centered modal, frosted backdrop (scrim oklch + blur kept literal), height-bounded
        `__panel`/`__content`, floating frosted `__close` (dark via nested `@variant dark`), footer seam,
        sizes (`--compact/roomy/spacious/fullscreen/almost-fullscreen`)→`--dialog-width` --spacing,
        position/scrollable modifiers, shake `[data-shaking]`+`st-dialog-shake`; `1.125rem`→`var(--text-lg)`,
        widths→`--spacing`, 1px→`var(--st-border-width)`, 0.2s/0.15s→duration tokens, z-index→`var(--st-z-modal)`.
        drawer: edge-anchored sheet, 4 placements (default `--end`)+`--floating` (gap/radius), RTL
        translateX flips, `--start/--end` width / `--top/--bottom` height (→`--spacing`), inline ghost
        `__close`, backdrop opt-out `[data-stisla-drawer-backdrop=false]`, shake x/y `st-drawer-shake-*`;
        0.25s→`var(--st-duration-normal)`, z-index→`var(--st-z-modal)`. is-* JS flags (`is-shaking`,
        `is-dialog-open`, `is-drawer-open`)→data-attributes per no-is-*; keyframes renamed `st-*`. Demos
        show real open overlays (fixed resolves to each iframe's own viewport) over a faux page-behind
        block; behavior deferred to JS. `pnpm check` clean (81), build clean.
  - [x] toast, menu. toast: 6-corner fixed `.toast-region` (placement modifiers) + `[icon|content|close]`
        grid `.toast` (open by default so markup-first renders no-JS), `@starting-style`+`allow-discrete`
        entrance, single-line `:has()` centering, 5 intent modifiers (icon-color only), timestamp/action
        slots; `1.125rem` icon→`--spacing(4.5)`, widths→`--spacing` (350px→`--spacing(87.5)`), `text(sm)`→
        `var(--text-sm)`, 0.2s/0.15s→duration tokens, z-index→`var(--st-z-toast)`. menu: Base UI anatomy
        (`__popup`/`__item`/`__group`/`__separator`/`__group-label`), shared `menu-*` Sass mixins expanded
        inline with `--menu-*` prefix, concentric item radius, `[data-highlighted]`/`aria-current`/
        `[data-state=checked]` states, danger item (soft oklch tint), icon/indicator/shortcut slots,
        `.media--flush` re-round integration; `1rem` icon→`--spacing(4)`, gap 2px→`--spacing(0.5)`,
        widths→`--spacing`, 0.15s→`var(--st-duration-fast)`, z-index→`var(--st-z-dropdown)`. `is-menu-open`→
        `html[data-menu-open]` per no-is-*. Demos pin overlays open via Tailwind positioning + `pb-*`
        headroom (menu) / inline open toasts + one fixed region (toast); behavior deferred to JS.
        `pnpm check` clean (85), build clean.
  - [x] combobox, autocomplete. Both reuse `form-field-base` (field shape, duplicated with own prefix)
        + the `menu-surface`/`menu-item` recipe (expanded inline) for the popup. combobox is SPLIT into
        the portable contract (`combobox.css`: `.combobox` field + `--combobox-*` tokens + sizes + dark
        chevron + native `<select>` baseline — what a React/Vue impl reuses) and the lib adapter
        (`combobox.tomselect.css`: the `.ts-wrapper`/`.ts-control`/chips/`.ts-dropdown` skin mapping Tom
        Select's DOM onto the tokens; 3rd-party vocab kept: `.focus`/`.has-items`/`.active`/`.selected`/
        `.tomselected`). The ONE lib-coupled stylesheet in the package — convention: lib bindings live in
        `<component>.<lib>.css`, loaded after the contract. multi chip concentric radius, `0.8125rem`→
        `var(--text-xs)`, `1.4`→`var(--leading-snug)`, offset 0.5rem→`--spacing(2)`, 16rem→`--spacing(64)`.
        autocomplete: `<input>` + `.autocomplete__popup` listbox, `.autocomplete__item` (gap:0 for
        `<mark>` runs), `__empty` row, weight-only highlight; `.is-highlighted`→`[data-highlighted]` per
        no-is-*. ALL form fields: `line-height:1.2`→`var(--leading-tight)` (was hardcoded); combobox +
        autocomplete gained the missing `padding-block` knobs (field + ts-control). `--compact/--roomy`→
        `--sm/--lg`; popup z-index→`var(--st-z-dropdown)`; focus `0 0 0 3px` ring kept literal. Demos:
        `<select>` baseline + hand-authored hydrated markup; behavior deferred to JS. `pnpm check` clean
        (90), build clean.
  - [x] carousel, scroll-area, navbar. carousel: Embla-driven (reads our own `.carousel__*` BEM, not
        lib-coupled — one file), `__viewport`/`__track`/`__slide` + `__control` chips + `__indicators`
        (active dot→pill via `[data-state=active]`) + `__caption` gradient, overlay chrome on
        theme-independent `--color-overlay*`, `--no-aspect` opt-out; `radius(full)`→`9999px`, `1.125rem`
        icon→`--spacing(4.5)`, `duration(normal)`→`var(--st-duration-normal)`. scroll-area: SPLIT like
        combobox — portable `scroll-area.css` (`.scroll-area` native clipped container + `--bordered`)
        + `scroll-area.overlayscrollbars.css` adapter (forwards `--scroll-area-*`→OverlayScrollbars'
        `--os-*` on `.os-scrollbar`); `0.625rem`→`--spacing(2.5)`, `radius(full)`→`9999px`. navbar:
        Stisla-native top bar (own JS toggle, one file), brand/toggle/menu/nav/button, `lg` fold via
        Tailwind `@variant lg`/`max-lg` (`media-up/down(lg)`, resolves the theme breakpoint not a raw
        rem), `[data-state=active/open]`; added missing `--navbar-button-padding-block` +
        `--navbar-brand-padding-block` knobs, `line-height:1`→`var(--leading-none)`, 150ms→
        `var(--st-duration-fast)`, `calc(radius(md) - 0.25rem)`→`calc(var(--radius-md) - --spacing(1))`.
        scroll-area `--bar-padding` split into `-perpendicular`/`-axis` (OS axes, shorthand kept as
        fallback). Retrofit: list-group/table responsive `@media` → `@variant <bp>`/`max-<bp>` too.
        Demos: static slide-1 + chrome (carousel), native-scroll stand-in (scroll-area), folded
        menu-open (navbar, frame < lg). `pnpm check` clean (97), build clean.
  ✶ INTERACTIVE CATEGORY COMPLETE (tooltip, popover, accordion, collapsible, dialog, drawer, toast,
    menu, combobox, autocomplete, carousel, scroll-area, navbar).
- [~] Layout / content:
  - [x] page, placeholders, empty-state. page: flex-column flow (gap owns rhythm, zero child margins),
        `__header`/`__headline`/`__title`/`__description`/`__action`/`__section`/`__section-header`/
        `__section-title`, opinionated h3-ish/h5-ish heading cadences; line-heights 1.2/1.4/1.5→
        `var(--leading-tight/snug/normal)`. placeholders: `.placeholder` skeleton bar (font-relative
        `1em` height kept), `--glow`/`--wave` `st-*` keyframes (2s ambient loops + mask `#000` stops
        kept literal), `--compact/--roomy`→`--sm/--lg`. empty-state: centred `__media` (tinted circle,
        oklab tint) + `__title`/`__text`/`__action`, `:has()` shed for richer media (illustration/img/
        icon-box/avatar/spinner — forward ref harmless), 5 tone modifiers (media-only), `--compact`→
        `--sm`, `--bordered` dashed box; `radius(full)`→`9999px`. `pnpm check` clean (103), build clean.
  - [~] ~~app-shell~~ DROPPED as a primitive (2026-06-27, maintainer call). Rationale: static shell
        layout is trivial with flex/Tailwind; the only real behavior (responsive sidebar→drawer fold)
        overlaps the existing `drawer` primitive; the ~340-line app-shell.js was mostly drawer-duplicate
        glue. The design system ships primitives (sidebar/navbar/drawer); the SHELL is the dashboard
        template's concern (app-specific). Removed app-shell.css + docs page + demo.css import + nav
        link + skipped the JS port. Sidebar/navbar stay. See [[project_app_shell_dropped]].
  - [x] illustration (CSS-only port). Single-accent volumetric spot art: `--illus-accent` drives
        gradient stops / disc / long-shadow via `color-mix` (recolour without touching markup),
        `--illus-badge` for the pip, 4 intent modifiers, `--animate` float+pop (reduced-motion gated).
        Kept the deliberate short vocab (`--illus-*` knobs, `.il-*` SVG paint hooks, `il-*` keyframes —
        referenced inside the SVG assets); only `--st-*`→`var(--color-*)`. white-mix targets +
        drop-shadow geometry + ambient loop durations kept literal. Docs use one demonstrative inline
        SVG (unique gradient ids). NOTE: the full metaphor set + recolorable-SVG gallery/export remain
        a separate effort (see [[project_illustration_system]]). `pnpm check` clean (107), build clean.
  ✶ LAYOUT/CONTENT COMPLETE (page, placeholders, empty-state, illustration; prose dropped →
    @tailwindcss/typography; app-shell dropped as a primitive → dashboard template owns the shell).
  - [x] ~~prose~~ DROPPED — docs use `@tailwindcss/typography`'s `.prose` (better at article
        typography than a hand-rolled port); no Stisla `.prose` in @stisla/css. Bare-element stance
        unchanged (reboot only; opt-in classes). Reversible if a no-Tailwind prose surface is needed.
- [x] ~~Utilities~~ DROPPED (2026-06-27, maintainer call). Rationale: shipping a utility layer creates
      an unavoidable convention clash — either it duplicates Tailwind (fragmented responsive prefixes:
      `-md` vs `lg:`) or it requires a Tailwind build step (breaking the no-build promise). The clean
      split: `@stisla/css` owns the **component layer** only; layout + utilities are the consumer's
      concern (Tailwind CLI for most users — no framework, just a build step). A "Tailwind CLI setup"
      guide ships in the docs instead of a utility bundle. No grid system either (same reason: `-md`
      vs `lg:` fragmentation, and native CSS Grid is baseline). `stisla-full` distinction narrows to
      3rd-party adapters only (combobox/scroll-area/carousel) — resolved at cutover.

## Phase 8 — now the ACTIVE track (vanilla-JS behavior before Utilities/React)
- [x] `@stisla/vanilla` — vanilla-JS behavior layer. PORT the legacy `src/js/` (core + 22 components) into
      `next/packages/vanilla/`, JS+JSDoc, updating the `is-*`→data-attribute hooks changed in the CSS sweep
      (`[data-collapsing]`/`[data-dialog-open]`/`[data-menu-open]`/`[data-sidebar-visible]`/`[data-shaking]`/
      `[data-highlighted]`) + size renames. Demos go live: build to an IIFE bundle, DemoFrame injects it
      inline like lucide, flip interactive demos from static `data-state` to trigger-based. Order: slice
      (core + collapsible + accordion end-to-end incl. iframe go-live) → sweep batches (overlays → tabs/
      toggle/sidebar/navbar/app-shell → 3rd-party wrappers combobox/autocomplete/carousel/scroll-area).
      DONE: core/{component,init,transition,inert}.js ported verbatim to `packages/vanilla/src/core/`.
      SLICE PROVEN (collapsible + accordion, end-to-end live): collapsible.js `is-collapsing` class→
      `[data-collapsing]` attr; reconciled the CSS — the `[data-collapsing]` transition rule is now
      GLOBAL (was `.collapsible`-scoped) so it animates a borrowed `.accordion__body`. accordion.js
      verbatim. Entry `src/index.js` (ESM + auto-init + window.Stisla) + `src/iife.js` (side-effect).
      Docs go-live wiring: a `stisla-vanilla-iife` Vite plugin bundles iife.js to a string via esbuild
      (virtual module, HMR via watched inputs, no separate build); DemoFrame imports it + injects
      `<script>` into the iframe (escapes `</script>`, like lucide); accordion demos flipped from static
      `data-state` to live `data-stisla-accordion`/`-trigger` markup. Build clean, token clean (107),
      bundle confirmed inlined in the Demo asset.
      OVERLAYS BATCH DONE — dialog, drawer, tooltip, popover, menu, toast all ported & live.
      dialog/drawer: `focus-trap` (installed + bundles), `is-dialog-open`/`is-drawer-open`→
      `[data-dialog-open]`/`[data-drawer-open]`, `is-shaking`→`[data-shaking]`; demos trigger-based +
      the FULL legacy demo set restored (Sizes/Positioning/Static-backdrop + showcase recipes:
      Confirmation/alert-dialog, Success, Media-hero, Lightbox). tooltip/popover: `@floating-ui/dom`,
      verbatim (no is-*), FUI auto-position + auto-injected arrow. menu: FUI; `is-menu-open`→
      `[data-menu-open]`; arrow-key nav + typeahead. toast: no deps; live via the imperative
      `Stisla.toast()`/`.success`/`.error`/`.promise` API (inline onclick → window.Stisla); action
      btn→`button button--sm`, spinner→`--sm`, lucide names aligned to docs. Demo bundle 96→377kB
      (both deps bundle). check clean (107), build clean.
      BATCH 2 (no deps): tabs, toggle, toggle-group, navbar ported & live — all verbatim (no is-*);
      navbar composes the ported Collapsible. Demos flipped: `data-stisla-tabs` / `data-stisla-toggle`
      (button toggles only, native label path untouched) / `data-stisla-toggle-group` (role-bearing
      groups only, form-data guard skips the rest) / `data-stisla-navbar` + `data-stisla-navbar-toggle`
      (fixed the demo's stale `data-navbar-toggle`). Bundle 399kB, build clean.
      BATCH 2 DONE: + sidebar (`is-collapsed`→`[data-collapsed]`; submenu collapse via the ported
      Collapsible; rail-collapse via `data-stisla-sidebar-toggle="collapse"`; demos live — submenus +
      a live collapse toggle). app-shell DROPPED as a primitive (see layout/content note + memory) —
      not ported. Bundle 405→403kB (app-shell.css removed), check clean (105), build clean.
      WRAPPER BATCH DONE — combobox↔Tom Select, autocomplete (own JS), carousel↔Embla,
      scroll-area↔OverlayScrollbars all ported & live. Deps tom-select/embla-carousel/overlayscrollbars
      added to packages/vanilla as regular `dependencies` and bundled into the SINGLE iife (matches the
      focus-trap/@floating-ui precedent; the stisla vs stisla-full split is deferred to cutover). CSS
      needed no demo.css change — both adapters (combobox.tomselect.css, scroll-area.overlayscrollbars.css)
      were already imported; Tom Select's adapter is self-sufficient (no TS base CSS), OverlayScrollbars'
      base CSS is injected by its own JS (`?raw` import under @layer foundation), Embla needs none.
      autocomplete recast `is-highlighted`→`[data-highlighted]` (3 spots) to match its CSS. Docs flipped
      to live triggers: combobox baseline stays a native `<select>` (no-JS fallback), Single/Multiple/
      Sizes get `data-stisla-combobox` so Tom Select renders the real post-hydration DOM; carousel +
      scroll-area drop their static `data-state`/`overflow-auto` stand-ins; autocomplete uses a live
      `data-options` input (no-results folded into Basic). One build-plumbing fix: a `rawQueryPlugin`
      added to the stisla-vanilla-iife esbuild build in docs/vite.config.ts so esbuild honors Vite's
      `?raw` query (scroll-area inlines overlayscrollbars' stylesheet that way). Demo bundle 403→702kB
      (all three libs bundle), check clean (105), build clean.
      ⇒ Wrapper JS bundles & runs, BUT the port is NOT complete — a full legacy-vs-v3 audit
      (next/DEMO-GAP-AUDIT.md, 2026-06-27, 8 parallel agents over all 49 shared pages) found the docs
      were heavily CLIPPED and 3 behavior components never ported. NOT DONE:
      • Whole components unported [TIER 0 — DONE 2026-06-27]: slider (CSS+JS+docs), timeline (CSS+docs),
        avatar JS (+ live demos), custom select (deferred popup CSS + Stisla.Select + custom-select docs)
        all ported, registered, wired into demo.css + nav. Build + token clean throughout.
      • Demo clipping on ~25 pages: every interactive component lost its Keyboard + Events sections and
        had live demos flattened to static (the CSS-sweep "static demos now" deferral was never undone
        after the JS went live). Worst: carousel 8/10, tooltip 9/11, toast 7/12, menu 8/13, combobox
        7/12, scroll-area 5/6, tabs 5/10, autocomplete 6/9, popover 6/10, collapsible 4/7, table 9/22.
      RESTORATION COMPLETE (2026-06-27): Tier 0 whole components ported; Tiers 1–3 (36 docs pages)
      restored via 8 parallel agents — every dropped section/variant re-added from the authoritative
      .njk, interactive demos re-wired live (data-stisla-*), intentional renames kept. check-tokens
      clean (109), docs build clean, 15-page semantic spot-check passed. See DEMO-GAP-AUDIT.md (now
      marked COMPLETE) for the per-component record. ⇒ @stisla/vanilla behavior layer + its docs DONE.
      NEXT: React wrappers / docs site (TanStack Start). Utilities dropped — see Phase 7 note.
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
