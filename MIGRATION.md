# Stisla v3 — BS5 → vanilla migration

> Transient. Tracks the refactor of the existing BS5-based v3 codebase to the V3.md spec.
> Delete this file once the migration ships (3.0.0).

**Spec:** V3.md (locked).
**Branch:** v3.
**Approach:** Option A — snapshot the BS5 version once, rewrite in place. See §3 step 0.

---

Prompt for each session:

"Let's continue the v3 migration. Read V3.md + MIGRATION.md, check git, and tell me what step we're on and what to do next."

---

## Status

_Latest entry first. One line per session: ISO date — step completed / current — blockers._

- 2026-06-08 — Prose follow-ups: expanded demo, vars-table cleanup, consolidation. **Demo expansion**: `/typography` prose article grew from a third-of-the-elements showcase to a full element sweep (h1+h2+h3, paragraphs with inline `<a>`/`<strong>`/`<em>`/`<code>`/`<kbd>`/`<small>`, ul with nested ul, ol, dl, blockquote, `<pre><code>` block, hr, `<img>` via data-URI SVG banner, `<figure>` with inline `<svg>` type-scale chart + figcaption, 6-row table). Lead copy above the demo lists every covered element so readers know what they're seeing. **Vars table cleanup**: `/typography` customization vars table dropped its `ui.demo()` wrapper and inline-styled `<td>` padding hack — it's reference content, not a demo. Wrapped in `<div class="prose">` so it picks up the prose table treatment, consistent with the article above. **Consolidation**: the site shipped its own 90-line `.prose` block in `site.scss` that styled every docs page (`base.njk` wraps content in `<div class="main-container prose">`) — and the framework shipped a separate `.prose` for long-form content. Two `.prose` definitions, name collision, only sort-of coexisting via `.not-prose` opt-out on demo viewers. Now the framework owns `.prose` and the site adds docs-context cascade overrides on `.main-container.prose`. One definition, two contexts. **`_prose.scss` refactor**: selectors moved from direct-child (`> h1`, `> p`, etc.) to descendant (`:where(h1)`, `:where(p)`) with the `.not-prose` opt-out gate (`:not(:where(.not-prose, .not-prose *))`) on every rule. `:where()` keeps prose-rule specificity at (0,1,0) so consumer overrides like `.main-container.prose h2 { … }` at (0,2,1) win cleanly without `!important`. Direct-child was wrong for the page-wrapper use case: docs pages structure content as `<header><h1>…</h1></header><section><h2>…</h2></section>` and headings aren't direct children of the wrapper. Descendant + `.not-prose` is the Tailwind Typography pattern; demos that need to escape prose styling drop `.not-prose` on the wrapper element. **`_demo.njk` macro arg**: `demo(prose=false)` accepts a `prose` arg; when `true`, omits `.not-prose` from the `.demo` wrapper so the inner content renders with framework prose. Used by `/typography`'s long-form article demo (the only demo whose preview IS prose content). **Architectural limit to remember**: nested `.prose` inside `.not-prose` cannot reactivate — the opt-out gate trips on the inner elements because they still have `.not-prose` as an ancestor. Tailwind Typography has the same limitation. The `prose=true` macro arg is the escape hatch. Any future docs page that needs to demo `.prose` content inside a demo viewer uses the same arg. **`site.scss` cuts**: deleted the 90-line custom `.prose` block, replaced with ~50-line `.main-container.prose` overrides — tighter docs heading sizes (1.75rem / 1.125rem / 1rem in fixed rem so they don't scale with prose em scale), muted body paragraph color (page chrome stays quiet, demos pop), section/header structure spacing (3rem inter-section). Same `:where()` + `.not-prose` opt-out pattern as the framework prose. **Bordered + rounded prose table**: framework prose `<table>` gains `border: 1px solid var(--st-border)` + `border-radius: var(--st-radius)` + `border-collapse: separate` + `border-spacing: 0` + `overflow: hidden`. `border-collapse: separate` is needed for `border-radius` to render cleanly (Preflight defaults to `collapse` which fights the radius at corners). `overflow: hidden` clips any consumer-added cell backgrounds (`thead { background: … }`) to the rounded outer shape. Bundle 45 → 47 KB raw (+2 KB across `.not-prose` gate selectors + table border rules), site stylesheet stable (~3.4 KB), 0 `--bs-*` leaks, build green. Pages to spot-check in light + dark: `/typography` (article reads as long-form, customization table reads as bordered rounded reference data, page chrome stays quiet), any other docs page (heading scale + muted paragraphs match the previous rhythm). Visual verification pending. Next: Step 3.3b (form-check + input-group).
- 2026-06-08 — Step 3.x done (Preflight + `.prose` foundation). `_reboot.scss` rewritten Preflight-style — universal `* { margin: 0; padding: 0; border: 0 solid }` kills default spacing; `h1`–`h6` `font-size: inherit; font-weight: inherit`; `<a>` `color: inherit; text-decoration: inherit`; `b/strong/em/i/small` lose visual treatment (semantics preserved, visuals stripped); `ol/ul/menu` `list-style: none`; form controls inherit font/color/letter-spacing; `<img>/<svg>/<video>/<canvas>/<audio>/<iframe>/<embed>/<object>` `display: block`; `img/video` `max-width: 100%; height: auto`. Kept v3 chrome: `<mark>` highlight, `<abbr[title]>` dotted underline, `<hr>` via `--st-border`, `:focus-visible` outline at `--st-ring`, `<sub>/<sup>` defaults, code-family inherits `--st-font-mono`. Fetched current Tailwind Preflight verbatim and adapted — the universal-`*` reset is the heavy lifter (kills `<p>/<h1-6>/<ul>/<ol>/<dl>/<blockquote>/<figure>` margins in one rule instead of one rule per element). **`_typography.scss` cuts**: dropped `.list-unstyled` (Preflight makes it redundant), `.list-inline` + `.list-inline-item` (BS5 layout shortcut, v3 equivalent is flex + gap), `.blockquote` + `.blockquote-footer` (long-form treatment, moved to `.prose`). Kept `.h1`–`.h6`, `.lead`, `.display-*` — app-level typographic patterns. **New `components/_prose.scss` (~210 lines)** — long-form treatment for article/CMS content. Element-level restoration for headings (em-based scale, density-scaled margins), paragraphs, lists with markers, dl, blockquote (left border + italic), hr, inline code (chip), pre (code block), images, figures, table. Inline `:not(pre) > code` is chip-style (bg + border + radius); `pre > code` resets to bare mono. Table inside prose is reading-table look (header underline only, no zebra/hover) — explicitly NOT shared with the `.table` component because dashboard table and reading table are different jobs. 5 customization vars: `--st-prose-line-height` 1.625 / `--st-prose-link-color` `var(--st-primary)` / `--st-prose-marker-color` `var(--st-muted-foreground)` / `--st-prose-quote-border` `var(--st-border)` / `--st-prose-headings-color` `var(--st-foreground)`. **Cascade-only nested overrides** — `.prose` doesn't invent prose-specific vars for nested components (no `--st-prose-kbd-padding-y`); instead `.prose { --st-kbd-padding-y: ... }` retunes the kbd component via the cascade. V3.md §3.4 component-scoped fallback pattern carries the customization for free. `.prose` does NOT set `max-width` — typography is treatment, parent is layout box; pattern is `<article style="max-width: 65ch"><div class="prose">…</div></article>`. **New `.link` utility** in `utilities/_text.scss` — Reboot strips `<a>` color + underline globally; `.link` opts back in for inline app-UI links (`color: var(--st-primary)` + `text-decoration: underline` + hover mix). **`/typography` page rewritten**: top reframed (two contexts — utilities for app UI, `.prose` for long-form); Headings demo uses `<p class="h1">…<p class="h6">` to show that `<h1>` element is now blank by default and the `.h1` class carries the visual; cut sections — inline elements (small/strong/em demos relied on auto-treatment now stripped), weight (`.fw-*`), size (`.fs-*`), color (`.text-*`), lists (`.list-*` utilities dropped), blockquote (utilities dropped); added long-form (`.prose`) section with full article showcase + customization vars table. **`/typography` doesn't demo single-property text utilities anymore** (`.fw-*`, `.fs-*`, `.text-*`, `.lh-*`) — they belong on a future `/text-utilities` page or similar. Page scope = source-file scope (V3.md §3.10 added). **Demo sweep**: `customization.njk` + `cards.njk` footer notes switched from `<small style="color: var(--st-muted-foreground)">` to `<span class="small text-muted-foreground">`; `spinners.njk` + `form-control.njk` bare `<a href>` cross-references gained `class="link"`. BS5-era demo pages (offcanvas, list-group, tooltips, breadcrumb, tabs, navs) carry `.list-unstyled` / bare `<a>` / `<small>` uses too but left untouched — their components are still pending wholesale rewrite, and a partial Preflight fix there would mask the BS5-isms in place. **V3.md updates**: §3.1 Reset row rewritten to describe the Preflight scope; new "Visual treatment — three layers, no gaps" paragraph at §3.1 close stating the rule (Preflight handles global reset → `.prose` handles long-form restoration → app UI composes from utilities + patterns + components; no utilities live in the gap); §3.10 "Pages mirror the source tree" bullet added (the typography/utilities split rule). Bundle 40 → 45 KB raw (+5 KB for `.prose`), 42 `.prose` selectors, 0 `--bs-*` leaks, all 5 `--st-prose-*` vars present. Verified: build green, 38 pages rendered. The card footer flex fix from the prior commit retires its motivating bug (inline strut leak) — Preflight stops the `<small>` 80% inheritance at the root, so flex on `.card__footer` becomes nice-to-have rather than load-bearing (left in place — it's a legitimate layout pattern for footer content rows). Next: Step 3.3b (form-check + input-group).
- 2026-06-08 — Card footer flex + diagnostic surfaced a foundation gap. `.card__footer` gained `display: flex; align-items: center; gap: 0.5rem` (keeping its existing y-padding). The fix breaks the **inline strut leak**: a bare `<span class="text-xs …">` inside the footer was inheriting `.card__footer`'s block `line-height: 1.5` strut because CSS computes a block container's line-box height as `max(strut, tallest-inline-line-height)` — the span's tighter `text-xs` line-height had zero effect, so any short label read low in the band as font-size shrank (Photoshop-style "anchored to the bottom" when scaling text down). Flex children get their own formatting context, so the span's own line-height applies. **Glue code reverted from earlier in the session**: the speculative `.text-xs/.text-sm/.text-base/.text-lg` utilities in `_text.scss`, the `<small>` → `<span class="text-sm …">` swaps in `/cards` and `/customization`, the prior `.card__footer` asymmetric padding patch, and a flex+min-height+`text-box-trim` attempt — all reverted before the flex fix landed. **🚧 NEXT — Preflight + prose foundation (architectural shift, do BEFORE more component PRs).** The diagnostic dug into Inter's metric imbalance (typoAscender ≈0.99em vs typoDescender ≈0.25em, ~4:1), then `<small>`'s 80% browser default, then the `<span>` strut leak — different faces of the same root cause: **HTML-element defaults leak into v3 components and the foundation doesn't intercept them**. Per-component padding/line-height patches never converge. Reference is Tailwind's Preflight: aggressive reset so every element starts as a blank canvas. Concretely: `<p>/<h1-6>/<ul>/<ol>/<dl>` lose margins + font-size diffs; `<small>/<b>/<strong>/<em>/<i>` lose visual treatment (no auto-italic, no auto-bold, no shrink); `<button>` inherits font + cursor; `<img>` becomes `display: block; max-width: 100%`; `<a>` drops default color/underline; root `font-size` unifies. Class-based styling becomes the only path to visual treatment — the existing `.h1`–`.h6` / `.lead` / `.display-*` / `.fw-*` / `.fs-*` utilities are already the destination, Preflight just removes the elements-doing-it-by-default fallback. Pair with a new `components/_prose.scss` (`.prose` / `.content`, ~500 lines, equivalent to `@tailwindcss/typography`) as the escape hatch where semantic typographic defaults are wanted — long-form pages, CMS body, markdown output; everything inside `.prose` gets the heading scale, paragraph margins, list markers, blockquote styling, etc. back. Why now: (a) aligns with the framework-agnostic vision in V3.md — porting v3 to React/Vue means porting a blank canvas, not a cascade of browser defaults; (b) solves an entire class of "element X misbehaving inside component Y" bugs (today's card footer is one face, future ones avoided wholesale); (c) clarifies the rule that visual treatment = utility/component class, not element identity. Files: `_reboot.scss` (expand aggressively — current reboot is small typographic resets, not yet Preflight-level), `_typography.scss` (heading-as-class utilities become the only path — comment update to reflect that), new `components/_prose.scss`, demos audit (`/typography` first — every `<small>` use needs the genuine-small-print-vs-muted-text-shorthand call; `<p>` paragraphs in demos that relied on default margins; `<ul>`/`<ol>` in feature lists that relied on default bullets and indent — those move inside `.prose` or get utility classes). Risks: bigger PR than today's bug; demo migration is wide but mechanical; `.prose` scope is the design question — what nests, how components inside prose behave (a `<button>` in prose stays a button), how it composes with `.card__body` (no, prose is the parent, card is content — sort it out in design). Scope as **Step 3.x — Preflight + prose foundation**, ship as one PR. The today's flex fix is tactical; the full strut/defaults bug retires when Preflight ships. Next: design `.prose` scope + draft the Preflight reset diff before any more component ports — and resume Step 3.3b (form-check + input-group) only after Preflight lands.
- 2026-06-08 — Height architecture amendment landed. `.btn` and `.form-control` (single-line) switch from `min-height` floor + padding tuning to hard `height: calc(var(--*-height) * var(--st-density))` with `padding-block: 0`. Native vertical centering handles the label/value. Sizes (`--sm` 28 / default 36 / `--lg` 44) get a per-size `--*-height` literal; the density multiplier on the base resolves them. **Multi-line opt-outs**: `textarea.form-control`, `select[multiple]`, `select[size]:not([size="1"])` flip to `height: auto` + `min-height` floor + their own `padding-block` — same shape; the textarea also keeps `line-height: 1.5` for multi-line leading. **`.btn--wrap` opt-out** for the rare multi-line button case (full-width form-submit with helper text inside, mostly): restores `height: auto` + `min-height` floor + `padding-block` + `white-space: normal` + `line-height: 1.25`. Documented as "opt-in flexibility, strict default" per the design-system convention (Radix/shadcn/Material). **`.btn` default contract** is now single-line, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis` — over-constrained widths truncate instead of breaking the hard-height box. **`--btn-bevel` knob** lifts the inset top highlight off a hardcoded literal — `--btn-bevel: none` on `:root` ships a flat-button look; outline/ghost/soft already null it (was `box-shadow: none`; now `--btn-bevel: none` for consistency). **`--st-density` is now a real structural lever** — at `0.875` produces a 31.5px button + 31.5px input, not a 36px shell with shrunk inner padding. The 28.2px `.form-control--sm` band-aid (line-height 1.2 to pin natural box below min-height) is gone — line-height 1.2 stays because native input vertical centering is unaffected by it, but the band-aid framing is retired. Surface audit: `.icon-box` already used `calc(size * density)`; `.spinner` now does the same (compact dashboards compress spinners too); `.badge` stays on `min-height` (pill is intrinsic and adapts to text content — that's V3.md §3.4 opt-out behavior, not a height contract). `.form-control--plaintext` switches to `display: inline-flex` + `align-items: center` + hard `height` so it aligns with sibling fields at every density (was using a magic line-height that didn't track density). V3.md §3.2 density paragraph updated with the height-aware-component pattern. Files touched: `_btn.scss`, `_form-control.scss`, `_spinner.scss`, `V3.md`. Bundle delta to confirm at build verification. Next: build + grep verify (zero `--bs-*` leaks, sanity-check `/buttons` + `/form-control` + `/customization` at densities 0.875 / 1 / 1.125), then Step 3.3b (form-check + input-group) inherits this pattern.
- 2026-06-08 — Step 3.3a done (form-control). `_form-select.scss` **deleted**; `.form-select` removed from the public API entirely. `.form-control` now covers `<input>`, `<select>`, `<textarea>` via element/attribute selectors — `select.form-control` paints the chevron + sets `appearance: none` + adds inline-end padding for the chevron well; `select.form-control[multiple]` / `[size]:not([size="1"])` drops the chevron and restores native list rendering with `appearance: auto`; `textarea.form-control` drops the min-height clamp and gains `resize: vertical`; `.form-control[type="file"]` uses `display: flex` with `::file-selector-button` stretched edge-to-edge. Sizes 28 / 36 / 44 match `.btn`; `.form-control--{sm,lg}` pull `--st-radius-{sm,lg}` so corners scale proportionally with `--st-radius`. State derivation via `color-mix(in oklch, ...)` over `--st-*` tokens (no BS5 vars touched). Focus is a 3px transparent halo via `box-shadow` — different vocabulary from `.btn`'s opaque `outline`: fields already wear a 1px rim, so an opaque outline+offset reads aggressive on a continuously-bordered shape; the halo says "you're here" without competing. Documented in the file. **Validation drops BS5 entirely** — no `.is-valid`, no `.is-invalid`, no `.was-validated` wrapper. v3 hooks: `[aria-invalid="true"]` (server / JS / explicit) + `:user-invalid` (native validation after first interaction, not on initial render). Same a11y semantic for free (screen readers announce "invalid entry"), one declarative attribute instead of a class, and the same selector pair covers every input type. `/validation` page **deleted** (it documented the dropped BS5 patterns end-to-end — `.was-validated`, `.valid-feedback`, `.is-valid` on form-check, etc.); validation now demoed on `/form-control` as a section. Sidebar entry removed. Modifiers: `.form-control--{sm,lg,plaintext,color}`. **Color picker folded in** — `.form-control--color` on `<input type="color">`; swatch wears `(radius - padding)` so chip and frame share a center (V3.md §3.4 inner-radius rule). **Label + helper** ship in the same file as siblings (not BEM children): `.form-label`, `.form-text`, `.form-text--error`. Token surface stays at 30 — the only exception to the "literal colors only in `_theme.scss`" rule is the chevron SVG, which has two literals (one per theme) because `data:` URLs can't read CSS vars; documented in the file. Bundle 34.4 → 39.96 KB raw (+5.6 KB) / 6.8 → 7.80 KB gz. `0` `--bs-*` in compiled CSS (verified via grep). `/form-control` rewritten on v3 BEM (added Validation + Color picker sections; Plain text section pairs with `readonly` per native semantics); `/select` rewritten to `<select class="form-control">` (URL kept — the page now legitimately demos "the form control on a `<select>`", lead copy clarifies the same-class point). Side fixes: `app-shell.njk` and `list-group.njk` picked up the `.form-control-sm` → `.form-control--sm` rename (one-line bug fix each — size modifier was silently missing). `input-group.njk`, `offcanvas.njk`, and `_input-group.scss` / `_form-check.scss` still reference `.form-select` / `.form-control-sm` — left for **Step 3.3b** (input-group port rewrites the page; offcanvas leaves it for the offcanvas session) and `_form-check.scss` rewrites on its own port. Visual verification pending — agent grepped clean, build green; maintainer to eyeball `/form-control` and `/select` in light + dark (chevron stroke contrast, focus halo, color-picker swatch radius, `color-mix` invalid border). **Late-session band-aid:** `.form-control--sm` rendered at 28.2px (not 28) because the base `line-height: 1.4` pushed the natural box past the `min-height` floor. Patched to `line-height: 1.2` matching `.btn`; this is a band-aid, not the fix — see "next" below. **🚧 NEXT — height architecture amendment (do BEFORE Step 3.3b).** Every height-aware v3 component (`.btn`, `.form-control`, and the height-via-min-height surface bits — `.icon-box`, `.spinner`, `.badge`) sets `min-height` as a floor and tunes padding × line-height × font-size × border so the natural box lands at-or-below it. Two real pains: (1) brittle — adjusting any of those values risks overshooting the floor, which is exactly how the 28.2px miss happened; (2) **`--st-density` doesn't actually shrink components at <1** because `min-height` is a floor, not a clamp — only the padding shrinks, so the "compact" preset on `/customization` is cosmetic, not structural. Fix: switch `.btn` + `.form-control` to hard `height: calc(var(--*-height) * var(--st-density))` with `padding-block: 0` for single-line shapes (input/select/btn — native vertical centering handles content). Multi-line cases (`textarea`, `<select multiple>`, `<select size>`) opt out via `height: auto` + `min-height` floor + their own padding-block. Density then becomes a real lever: density 0.875 → 31.5px default form-control, truly compact. Touches `.btn` (Step 3.1), `.form-control` (this session), a once-over on `.icon-box` / `.spinner` / `.badge` height usage, and the V3.md §3.2 density-token doc (note that density multiplies `height`, not just padding). Must land BEFORE Step 3.3b so `_input-group.scss` sizing inherits the new pattern instead of porting the old one. Next: **height amendment**, then Step 3.3b (form-check + input-group).
- 2026-06-08 — Card follow-up to Step 3.1. Default `.card` now carries a one-pixel `--st-border` so the card reads as a card even with shadow turned off — matches the BS5 original (Stisla v2's `card_base` mixin had explicitly removed it, but with v3's new elevation values that left bare elevation-only cards looking unframed in dark mode and against `--st-surface-2` backdrops). `.card--bordered` → `.card--flat` rename: the modifier now only zeroes the shadow (border inherits from default) and the name describes the *result* rather than the redundantly-restated border. V3.md §3 BEM table + `/cards` demo updated; demo section renamed `Bordered` → `Flat` with copy explaining the default border. No new tokens, no bundle delta beyond the modifier rename.
- 2026-06-08 — Step 3 #2 done (surface family). Six components landed on the v3 model: `_alert.scss`, `_badge.scss`, `_icon-box.scss`, `_kbd.scss`, `_spinner.scss` (new file — was 0 B), `_placeholders.scss`. All BEM with intent modifiers composing flat (`.alert--primary`, `.badge--soft.badge--primary`, `.icon-box--danger`, `.spinner--grow.spinner--sm`, `.placeholder--glow`), all states via `color-mix(in oklch)`, all padding wrapped in `calc(X * var(--st-density))`. **Alert** requires a tone modifier — bare `.alert` renders transparent, same contract as `.btn`. Tones: `.alert--neutral` (surface bg + neutral border) + the five intents. Parts: `__heading` / `__description` / `__action` / `__link`; layout switches via `:has(.alert__description)` (single-line row → grid with row-span action). Leading icon is any direct `<svg>`/`<i>` child (matches `.btn`). `--alert-link-color` lives separate from `--alert-icon-color` so a neutral alert's inline link stays primary while intents flip both to the intent color. Dismiss is a plain `.btn--ghost.btn--neutral.btn--icon-only.btn--sm`, not a special control — `.btn-close` is gone, `/close-button` demo page deleted (sidebar entry removed). JS to actually close the alert lands in Step 4. **Badge** is pill-by-default (opts out of `--st-radius`, V3.md §3.4), 1.375rem (22px) min-height clamp, neutral filled with no modifier, `.badge--soft` mixes 15% over `--badge-tone` for tinted chips. `--badge-tone` defaults to `--st-muted-foreground` on the base class so the soft modifier reads the tone the intent published — order-independent cascade (`.badge--soft.badge--primary` and `.badge--primary.badge--soft` both render correctly). **Btn** picked up the rename `.btn--light` → `.btn--soft` for cross-component naming consistency — soft is now the only filled-tinted shape across `.btn` and `.badge`. **Icon-box** keeps the 36×36 tile (`--sm` 28, `--lg` 48); `--icon-box-tone` is the single knob for one-off colors. **Kbd** styles the native element directly — every `<kbd>` picks up the chip without a class (resolves the typography step's deferred styling). **Spinner** ships border (default) + `.spinner--grow`, three sizes, slow-spin under `prefers-reduced-motion: reduce` rather than freezing. **Placeholders** keeps the BS5 currentColor approach (wrap in `.text-muted-foreground` for the muted gray), `--glow` + `--wave` animations, both honor reduced-motion. **Utility:** `.visually-hidden` added to `utilities/_text.scss` under an Accessibility section — was missing from the v3 utility set, which caused spinner "Loading…" labels to render visibly and rotate with the spinner. Token surface stays at 30 — no new tokens added; everything composes from existing intents + interactional trio. Bundle 26.24 → 34.4 KB raw (+8.1 KB) / ~6.8 KB gz. `0` `--bs-*` in compiled CSS (verified via grep); demo HTMLs grep clean for BS5-ism leaks (no `data-bs-*`, no `text-bg-*`, no `badge-light-*`, no `.btn-close`, no `spinner-border`, no `text-body-secondary`). `.demo-stack` lost its `align-items: flex-start` so alert children stretch full-width (typography's stack uses still render correctly — block-level `<p>` children fill regardless); `.demo-preview > .alert` and `.demo-preview > .demo-stack:has(>.alert)` pin alerts to 100% width (the demo viewer's `justify-content: center` shrink-fits children by default, same opt-out pattern as `.table`). Demo pages rewritten on v3 BEM: `/alerts` (tones + heading/desc layout + action slot + dismiss + inline link), `/badge` (default + filled intents + soft + icon + loading + in-button), `/icon-box` (default + intents + shape + sizes + custom tone), `/spinners` (border + grow + colors + sizes + alignment + in-button), `/placeholders` (example card + sizes + colors + animation + buttons). Visual verification pending — maintainer eyeballed `/badge` (soft cascade), `/spinners` (visually-hidden), `/alerts` (full-width, tone contract); rest still to confirm in light + dark. Next: Step 3 #3 (form family — form-control, form-select, form-check, input-group; largest cluster, do as one block per MIGRATION.md §3 step 3).
- 2026-06-08 — Typography landed ahead of Step 3 #2 (surface family) since it's a foundation concern the surface components inherit from. **Baseline 14px** via `body { font-size: 0.875rem }`; `html` untouched so `1rem` stays = 16px and every rem-based component keeps its pixel meaning. Heading scale tuned for the 14px context: h1 2 / h2 1.5 / h3 1.25 / h4 1.125 / h5 1 / h6 0.875rem (32/24/20/18/16/14). `_reboot.scss` gained `<p>` / `<ul>` / `<ol>` / `<dl>` / `<dt>` / `<dd>` / `<blockquote>` / `<b>` / `<strong>` / `<abbr[title]>` / `<code>` resets — the small slice of BS5 reboot that's typography rather than layout. New `foundation/_typography.scss`: `.h1`–`.h6`, `.lead`, `.display-1`–`.display-6`, `.list-unstyled`, `.list-inline` / `.list-inline-item`, `.blockquote`, `.blockquote-footer`. New `utilities/_text.scss` bootstraps the `utilities/` layer: `.text-foreground`, `.text-muted-foreground`, `.text-{primary,success,warning,danger,info}`, `.fw-{light,normal,medium,semibold,bold}`, `.fs-1`–`.fs-6`, `.small`, `.lh-{1,sm,base,lg}`, `.text-{start,end,center}`, `.text-{lowercase,uppercase,capitalize}`, `.text-{nowrap,truncate,break}`. **BS5-ism cull:** the typography demo dropped `.text-body` / `.text-body-secondary` / `.text-body-tertiary` (BS5 names) for v3-named `.text-foreground` / `.text-muted-foreground`; tertiary was cut entirely since the token surface has only one muted tier. Token surface still 30 — no `--st-font-size-*` ramp added (same discipline as no `--st-space-*` ramp, V3.md §3.4). Bundle 24.6 → 26.24 KB raw (+1.6 KB) / 5.36 KB gz. `/typography` renders the full demo on v3 styles; `<kbd>` in the inline-elements + in-context demos stays unstyled until Step 3 #2 lands `_kbd.scss`. Visual verification pending — agent compiled + grepped (0 `--bs-*` leaks, all classes emitted, baseline confirmed); maintainer to eyeball `/typography` in light + dark. Next: Step 3 #2 (surface family — alert, badge, icon-box, kbd, spinner, placeholders).
- 2026-06-08 — Step 3.1 done (btn + card architecture proof). `_btn.scss` ships BEM v3 buttons — 4 curated tones (primary, neutral, tertiary, danger) × shapes (filled/outline/ghost/light) composing flat at the root via `--btn-tone`, plus sizes/icon shapes/loading/flush. Success/warning/info dropped as first-class button tones (rare in practice, WCAG-contrast hassle with white text); a "Custom color" section on `/buttons` documents the `--btn-bg` / `--btn-color` inline-override pattern for one-offs with a promotion-to-class guideline. Rim border + inset top highlight live on `.btn` base reading `--btn-bg`, so custom-color buttons inherit the bevel for free. Neutral filled gets an asymmetric rim via `color-mix(in oklch, var(--st-neutral) 85%, var(--st-muted-foreground))` so the border reads as recessed in light and rim-lit in dark. `_card.scss` ships BEM v3 cards — root + `__header/__body/__footer/__title/__subtitle/__text/__link/__image/__overlay`, `--card-bordered` modifier, position-aware image radii. `_buttons.scss` removed (renamed `_btn.scss` for singular consistency). Token surface bumped 28 → 30: added `--st-neutral` / `--st-neutral-foreground` interactional pair so neutral has a rest fill distinct from accent's hover semantic — V3.md §3.2/§3.3 + rule 3 updated. All states via `color-mix(in oklch)`; zero `--bs-*` in compiled CSS (verified via grep). Bundle 16 KB → 24.6 KB raw. New `/customization` smoke-test page replays btn + card under default, brutalist, soft, dense, violet, warm-neutrals, and per-component-radius presets — all via root-scoped inline `--st-*` overrides, zero CSS edits. `site.scss` retokened (`--bs-*` → `--st-*`) and gained `.demo-row` / `.demo-stack` / `.demo-grid` helpers used across demo pages. Sidebar theme-toggle button now uses v3 BEM. Buttons + cards demo pages rewritten — BS5 utilities (`.d-flex.gap-2`, etc.) replaced with `.demo-row`; nav-tabs/pills, list-group, `.text-bg-*`, and the btn-light/btn-dark explainer sections dropped (covered by future component PRs or cut entirely). Visual verification pending — agent can compile + grep but cannot eyeball; maintainer to confirm at /buttons, /cards, /customization in light + dark. Next: Step 3 #2 (surface family — alert, badge, icon-box, kbd, spinner, placeholders).
- 2026-06-08 — Step 2 done. 5 BS5-coupled token files deleted (`_colors`, `_maps`, `_root`, `_variables`, `_variables-dark`). `tokens/_theme.scss` ships the 28 `--st-*` OKLCH tokens (light + dark, `--st-base: 258` hue-locked to primary). Breakpoints moved `foundation/` → `tokens/` per V3.md §3.9. Bundle rebuilt with `@layer foundation, theme, components, utilities`; every BS5 `@import` gone; component imports commented out (Step 3 PRs uncomment as they land). `index.js` stripped of `import 'bootstrap'` + Popover/Tooltip auto-init; app-shell handlers kept. `bootstrap` + `@popperjs/core` deps removed. `stisla-full.css` 16 kB / 3.2 kB gz (down from 283 kB), site renders 39 pages with unstyled component markup — strict approach as designed. Mono stack is JetBrains Mono first. Next: Step 3 (btn + card — V3.md Phase 1 architecture proof). Blockers: none. OKLCH conversions for neutrals are estimates, validate during Step 3.
- 2026-06-08 — Step 2 approach locked: **strict.** Gut the BS5 token files, accept a broken bundle, let each Step 3 component PR heal the build incrementally. No interim BS5 shim. Trade: docs site renders broken between Step 2 and the end of Step 3.
- 2026-06-08 — Theme selector renamed `data-bs-theme` → `data-theme` + `.dark` class. V3.md §3.8 reworked to spec both conventions. `foundation/_mixins.scss` color-mode mixin emits `[data-theme="dark"], .dark`; overrides BS5's mixin so BS5's `_root.scss` dark block now flips on the Stisla selectors (no `data-bs-theme` shim needed). Compiled CSS has 4 paired dark blocks; zero `data-bs-theme` in rendered HTML. Spec, site CSS/JS, layout, and tools/nunjucks-filters all updated. The 3 residual `data-bs-theme` references in `tokens/_variables*.scss` + `components/_tooltip.scss` are dead comments in files slated for delete/rewrite — left alone.
- 2026-06-08 — Step 1 done. `src/scss/foundation/` lands with normalize, reboot, grid, containers, breakpoints, mixins. `LICENSES/` carries BS5 + modern-normalize MIT text. Bundle swap leaves the BS5 reboot/grid/containers behind. Reboot reads `--st-*` directly — no `--bs-*` fallbacks (V3.md §3: no --bs in v3 code). Bare surfaces (body fg/bg, link, hr, focus ring) until tokens land in Step 2; intended trade. **Scope shift:** `bootstrap` dep removal moved to Step 2 (tokens/* and components/* still reference BS5 vars and mixins — pulling the dep now would un-build the bundle). Next: Step 2 (token rewrite). No blockers.
- 2026-06-07 — Step 0 done. BS5 build snapshotted to `bs5-snapshot/` (44 files, 3.7 MB). Tagged `v3-bs5-snapshot` at commit `eba7fc1`. Next: Step 1 (foundation rewrite). No blockers.
- 2026-06-07 — V3.md spec locked. MIGRATION.md drafted. Step 0 (snapshot) not started. No blockers.

---

## Working in sessions

Every migration step is its own session — long-running work doesn't fit in one conversation. Each session should be self-bootstrapping from this file + V3.md + git history. No conversation context required.

### Maintainer: how to start a session

Open Claude Code in this repo and paste:

> "Let's continue the v3 migration. Read V3.md + MIGRATION.md, check git, and tell me what step we're on and what to do next."

That's it. Don't pre-load assumptions; the agent re-derives state from the docs + git.

### Agent: what to do on cold start

1. **Read V3.md.** The spec. Agent workflow rules at the top still apply — no writes until the maintainer says "go".
2. **Read MIGRATION.md.** Status (top) first, then the §3 step relevant to today's work, then the §4 disposition row if working on a component.
3. **Verify against git.** Don't trust Status blindly. Run `git log --oneline -20`, `git status`, `git tag --list 'v3-*'` to see what actually shipped. If the doc and git disagree, the doc is stale — flag it and propose an update.
4. **Identify next work.** §7 running checklist is the authoritative source for "what step are we on". Within a step, §3 has the sub-bullets; §4 has the per-component table.
5. **Confirm with the maintainer** what to do before touching code. Default proposal: "next unchecked box in §7" — but the maintainer may want to skip ahead, revisit, or branch off.
6. **At session end:** add one new line to the Status section (top of file). Format: `ISO date — what changed — blockers if any`. Commit as part of the session's final commit, or as a standalone `docs(v3): update migration status`.

### When in doubt

- Spec questions (token names, naming rules, what's in/out of scope) → V3.md.
- Migration questions (order, per-component action, comparison workflow) → MIGRATION.md.
- "Is this thing actually built?" → git, not the docs.

---

## 1. What exists today (BS5 v3, the thing we're migrating)

| Surface                | Counts              | Notes                                                                                                               |
| ---------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `src/scss/components/` | 30 files (~100 KB)  | Largest: `_sidebar.scss` 22 K, `_buttons.scss` 11 K, `_app-shell.scss` 6 K. `_progress.scss` is 0 B (placeholder).  |
| `src/scss/tokens/`     | 5 files (~50 KB)    | `_colors.scss`, `_maps.scss`, `_root.scss`, `_variables.scss`, `_variables-dark.scss` — all tightly coupled to BS5. |
| `src/scss/bundles/`    | `stisla-full.scss`  | Canonical BS5 customization workflow with Stisla overlays.                                                          |
| `src/js/`              | `index.js` (2.7 K)  | Re-exports `bootstrap`, auto-inits Popover/Tooltip, app-shell handlers.                                             |
| `src/site/pages/`      | 40 njk demos        | All use BS5 class hooks (`.fade`, `.show`), `data-bs-toggle`, `data-bs-target`.                                     |
| `package.json`         | `bootstrap: ^5.3.3` | Plus none of the new deps yet.                                                                                      |
| Foundation files       | —                   | `foundation/` directory doesn't exist; build pipeline relies on `@import 'bootstrap/scss/reboot'` etc.              |

---

## 2. Target

See V3.md. No re-litigation here. Token surface (§3.2), foundation (§3.1), naming (§3.6), spec-vs-impl split (§3.11) are all locked there.

---

## 3. Migration order

Each step lands and merges before the next starts. No "step 3 partial PR" overlapping step 4.

### Step 0 — Snapshot the BS5 version ✅

- [x] `npm run build` → captures current built site.
- [x] Copy build output to `bs5-snapshot/` at repo root (HTML, CSS, JS — no source).
- [x] Commit `bs5-snapshot/` with message `chore: snapshot v3 BS5 build before rewrite`.
- [x] Tag the commit: `git tag v3-bs5-snapshot`. Push tag with `git push origin v3-bs5-snapshot` when you next push the branch.
- [x] Verify: `npx serve bs5-snapshot` renders. Bookmark a few key pages (sidebar, modal, dropdowns, forms) for visual reference during rewrite.

**Comparison workflow after step 0:**

- Visual: open `bs5-snapshot/<page>.html` in one tab; live `npm run dev` of new build in another.
- Source: `git show v3-bs5-snapshot:src/scss/components/_btn.scss` next to your new `_btn.scss` in a split editor pane.
- Run-the-old-thing: `git worktree add ../stisla-bs5 v3-bs5-snapshot` for a parallel checkout if needed.

### Step 1 — Foundation rewrite (no visible UI change) ✅

- [x] Install deps: `@floating-ui/dom@1.7.6`, `focus-trap@8.2.1`, `tabbable@6.4.0`, `embla-carousel@8.6.0`. Vendor `modern-normalize@3.0.1` (don't depend on the package; copy the file).
- [ ] ~~Remove `bootstrap` from `package.json`.~~ **Moved to Step 2.** Tokens (`tokens/_variables.scss`) and components (`components/_app-shell.scss`, `_navbar.scss`) still reference BS5 vars (`$grid-breakpoints`) and the `bootstrap/scss/*` import chain in `stisla-full.scss` is the source of those vars. Removing `bootstrap` now un-builds the bundle. Step 2 (token rewrite) replaces the var surface and pulls the dep then.
- [x] Create `src/scss/foundation/` with:
  - `_normalize.scss` — vendored modern-normalize 3.0.1
  - `_reboot.scss` — Stisla opinions (~75 lines). Reads `--st-*` directly. No `--bs-*` references (V3.md §3). Affected surfaces (body fg/bg, link, focus ring, hr) sit on browser initial values until tokens land in Step 2.
  - `_grid.scss` + `_containers.scss` — forked from BS5. `--bs-gutter-*` renamed to `--st-grid-gutter-*`. RTL flips, `_root` emits, `.no-gutters`, `$enable-cssgrid` stripped. Mixins inlined (no separate `mixins/_grid.scss`).
  - `_breakpoints.scss` — forked from `bootstrap/scss/mixins/_breakpoints.scss`. `media-breakpoint-up/down/between/only` renamed to `media-up/down/between/only`. **Shim** at the bottom re-exports the old names so existing component files keep building until Step 3.
  - `_mixins.scss` — `color-mode` helper.
- [x] Add `LICENSES/bootstrap-MIT.txt` (full BS5 MIT text) + `LICENSES/modern-normalize-MIT.txt`. Each forked foundation file carries a credit header. README NOTICE block lists both.
- [x] Verify: `npm run build` is green. `stisla-full.css` 283 KB / 38 KB gz. modern-normalize banner present in output, `--st-grid-gutter-x` emits 44×, zero `--bs-gutter-x` in foundation-emitted CSS, `.container-{sm..xxl}` + `.col-md-{1..12}` all emit. 39 static pages render via `npm run build:site`.

### Step 2 — Token rewrite ✅

- [x] Delete `tokens/_colors.scss`, `_maps.scss`, `_root.scss`, `_variables.scss`, `_variables-dark.scss`.
- [x] Create `tokens/_theme.scss` — 28 OKLCH tokens, light + dark blocks. Single source of truth for color literals.
- [x] Move `foundation/_breakpoints.scss` → `tokens/_breakpoints.scss` (V3.md §3.9 puts it under `tokens/`). Bundle import path updated; `media-breakpoint-*` shim kept for the two components (`_navbar`, `_app-shell`) that still use BS5 names — retire during Step 3.
- [x] Update `bundles/stisla-full.scss` to the `@layer foundation, theme, components, utilities` order; every BS5 `@import` deleted; all components commented out (Step 3 PRs uncomment as they land).
- [x] Strip `import * as bs from 'bootstrap'` + Popover/Tooltip auto-init from `src/js/index.js`. Step 4 reintroduces via `@floating-ui/dom`.
- [x] `npm uninstall bootstrap @popperjs/core` — deps gone, lockfile refreshed.
- [x] All component files break here. That's intentional — fixed in step 3.

### Step 3 — Component rewrite (per-component, in dependency order)

See §4 disposition table for action per component.

Build order respects token + foundation dependencies:

1. **Tokens proof:** btn + card (V3.md Phase 1 architecture proof). Done before any other component.
2. **Surface family:** alert, badge, icon-box, kbd, spinner, placeholders (all use intent + surface tokens).
3. **Form family:** form-control (covers `<input>`, `<select>`, `<textarea>` — one class, element/attribute selectors layer on type-specific concerns), form-check, input-group, form-range. Originally planned as one block; split in practice because `_form-select.scss` collapsed into `_form-control.scss` (one concept, one class — V3.md §3.6) and the remaining three each have their own substantive surfaces. Foundation amendments — `height` vs `min-height`, then Preflight + `.prose` — interleaved between 3.3a and 3.3b; see §7 checklist for the canonical landing order. Sub-steps:
   - 3.3a — form-control (✓ done; also covers `<select>` + `<textarea>` and absorbs the dropped `_form-select.scss`)
   - 3.3b — form-check + input-group
   - 3.3c — form-range
4. **Layout:** app-shell, page, navbar, sidebar (sidebar last — biggest file).
5. **Display:** card, table, list-group, breadcrumb, pagination, progress, toast, accordion.
6. **JS-coordinated:** button-group, carousel (Embla), dropdown, modal, offcanvas, tooltip, popover. Each blocked by its step 4 JS component.

Per-component PRs land independently after the token rewrite (step 2) merges. Each PR updates the SCSS + the matching `.njk` demo page.

### Step 4 — JS rewrite (interleaved with step 3 JS-coordinated components)

- [ ] `src/js/components/` directory created.
- [ ] `Stisla.init()` declarative scanner (`[data-stisla-*]` attrs → instantiate matching class).
- [ ] Modal: `inert` on siblings + `focus-trap` + `data-state="open"` toggling + custom events.
- [ ] Offcanvas: same primitives as modal with transform animation.
- [ ] Dropdown: `@floating-ui/dom` + roving tabindex + `focus-trap` + outside-click + Escape.
- [ ] Tooltip: `@floating-ui/dom` + hover/focus delay state.
- [ ] Popover: `@floating-ui/dom` + `focus-trap` + outside-click + Escape.
- [ ] Accordion: native `<details>` or thin height-transition helper. Stay close to native.
- [ ] Tabs / segmented control: `data-state="active"` toggle on `.btn-group` items + arrow-key nav.
- [ ] Toast: queueing + dismiss + transitions.
- [ ] Carousel: thin Embla wrapper exposing Stisla class hooks.
- [ ] Bundle size check: ~25–30 KB gz total (deps + Stisla code).
- [ ] Replace `import * as bs from 'bootstrap'` and all `data-bs-*` scanners in `index.js`.

### Step 5 — Demo pages (`src/site/pages/`)

- [ ] Class name pass: `.btn-primary` → `.btn--primary`, `.modal-dialog` stays, `.modal-content` becomes `.modal__inner` (TBD per-component during step 3 rewrite).
- [ ] State attribute pass: `.fade.show` → `[data-state="open"]`. `.collapse.show` → `[data-state="open"]` or `<details open>`.
- [ ] Toggle attribute pass: `data-bs-toggle="modal"` → `data-stisla-toggle="modal"`. `data-bs-target` → `data-stisla-target`. Per-component conventions defined during step 3.
- [ ] Delete `navs.njk` (component family removed). Repurpose its content into `button-group.njk` as the tabs/segmented examples.
- [ ] Delete `scrollspy.njk` and `collapse.njk` if their content folds into other pages. Confirm before deleting.
- [ ] Add customization smoke-test page: brutalist preset, soft preset, dense preset, violet primary preset, warm-tinted neutrals preset — all via root token overrides only.

### Step 6 — Cleanup + 3.0.0-beta.1

- [ ] Remove `bs5-snapshot/` dir? Or keep until 3.0.0 final? Decision: keep until final; comparison value is still real during beta.
- [ ] Update README, CHANGELOG.
- [ ] Update `.github/workflows/authors.yml` (V3.md §5 known break).
- [ ] Tag `3.0.0-beta.1` for community review.
- [ ] After 3.0.0 final ships: `git rm -r bs5-snapshot/`; `git tag v3-bs5-snapshot-deleted` for posterity; delete this `MIGRATION.md`.

---

## 4. Per-component disposition

Action key:

- **port** — visual + behavior carry over with minimal change; just retoken and BEM-rename
- **rewrite** — start fresh on the v3 model; old file is reference only
- **write** — file is empty or doesn't exist; build from scratch
- **delete** — component family cut

| Component    | Size   | Action     | Notes                                                                                                                          |
| ------------ | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| accordion    | 4.5 K  | rewrite    | BS5 collapse JS dependency; new height-transition impl or native `<details>`                                                   |
| alert        | 4.1 K  | rewrite    | color-mix on `--st-*` intents; new BEM (`__icon`, `__heading`, `__description`, `__action`)                                    |
| app-shell    | 6.1 K  | port       | Stisla original; low BS5 coupling. Retoken + BEM verify                                                                        |
| badge        | 2.5 K  | rewrite    | color-mix variant model; opt-out of radius (pill)                                                                              |
| breadcrumb   | 1.9 K  | port       | Mostly clean; retoken                                                                                                          |
| button-group | 1.1 K  | rewrite    | Now also serves as tabs/segmented control with `data-state="active"`. Expanded scope                                           |
| buttons      | 11.2 K | rewrite    | Largest BS5 override pile (button-variant mixin); v3 BEM + color-mix from scratch                                              |
| card         | 1.9 K  | rewrite    | Surface tokens; BEM (`__header`, `__body`, `__footer`)                                                                         |
| carousel     | 3.0 K  | rewrite    | Now wraps Embla; styling minimal                                                                                               |
| dropdown     | 2.2 K  | rewrite    | Floating UI + `[data-state="open"]` + `[data-highlighted]`                                                                     |
| form-check   | 3.2 K  | rewrite    | Native `<input>` styling; cross-browser pass                                                                                   |
| form-control | 3.4 K  | rewrite ✅ | Hairiest BS5 forms override pile; v3 base + `:focus-visible` halo. Now covers `<input>` + `<select>` + `<textarea>` via element/attribute selectors. |
| form-select  | 1.8 K  | **delete** ✅ | Merged into `.form-control` — one concept, one class (V3.md §3.6). `<select class="form-control">` is the v3 select.        |
| icon-box     | 2.2 K  | port       | Stisla original; retoken                                                                                                       |
| input-group  | 3.6 K  | rewrite    | Adopts new form-control tokens                                                                                                 |
| kbd          | 670 B  | port       | Tiny; retoken                                                                                                                  |
| list-group   | 1.5 K  | rewrite    | `[data-state="active"]`; accent (hover) + highlight (active)                                                                   |
| modal        | 4.7 K  | rewrite    | New JS impl (focus-trap + inert + `[data-state="open"]`)                                                                       |
| nav          | 2.6 K  | **delete** | Family cut. See V3.md §4 Phase 2                                                                                               |
| navbar       | 4.0 K  | port       | Stisla original; retoken                                                                                                       |
| offcanvas    | 2.5 K  | rewrite    | Same primitives as modal                                                                                                       |
| page         | 4.0 K  | port       | Stisla original                                                                                                                |
| pagination   | 1.6 K  | rewrite    | `[data-state="active"]` for current page                                                                                       |
| placeholders | 328 B  | port       | Tiny                                                                                                                           |
| popover      | 1.1 K  | rewrite    | Floating UI                                                                                                                    |
| progress     | 0 B    | **write**  | File is empty. Build from scratch                                                                                              |
| sidebar      | 22.1 K | rewrite    | Largest file. Many custom features (collapse, sub-menus, footer). Core logic carries; tokens + state attrs are the new surface |
| table        | 3.7 K  | rewrite    | Surface tokens; hover/highlight on rows                                                                                        |
| toast        | 3.2 K  | rewrite    | New JS impl                                                                                                                    |
| tooltip      | 856 B  | rewrite    | Floating UI                                                                                                                    |

Demo pages (`src/site/pages/`) follow the matching component PR. Pages that exist without a backing component (e.g. typography, images) are port-only.

---

## 5. Risks / blockers

- **`_progress.scss` is 0 B.** No reference to port from. Build from scratch in step 3.
- **`navs.njk` deletion.** Component family cut; demo page content folds into `button-group.njk`. Confirm before deleting any user-visible URL.
- **BS5 JS hooks across .njk.** `data-bs-toggle`, `data-bs-target`, `.fade`, `.show`, `.collapsing` need a sed-replace pass per component during step 5. Easy to miss one.
- **`.github/workflows/authors.yml`** references deleted `dev/update-authors.js` (V3.md §5). Fix during step 6.
- **Dark mode regression risk.** Every component PR in step 3 must verify dark mode (V3.md Phase 2 checklist requires this).
- **Customization smoke test.** V3.md Phase 1 requires brutalist/soft/dense/violet/warm presets via root-only overrides. This is the architecture proof; if any preset doesn't work, the token model has a hole.

---

## 6. Don't migrate — these are additions, not migrations

Phase 7 (v3 stable, post-3.0) components from V3.md §4 are net-new. Don't bundle them with the migration:

- avatar
- otp
- custom-select
- autocomplete
- combobox
- preview-card
- command (spotlight)
- date-picker

Build them on top of the rewritten foundation after 3.0 ships.

---

## 7. Running checklist

- [x] Step 0 — Snapshot BS5 build, tag `v3-bs5-snapshot` ✅
- [x] Step 1 — Foundation rewrite (deps swap, `foundation/` files, `LICENSES/`) ✅
- [x] Step 2 — Token rewrite (`_theme.scss` + `_breakpoints.scss`) + remove `bootstrap` dep ✅
- [ ] Step 3 — Component rewrite (per §4 table, in order from §3 step 3)
  - [x] 3.1 — btn + card architecture proof (V3.md Phase 1) ✅
  - [x] 3.2 — surface family: alert, badge, icon-box, kbd, spinner, placeholders ✅
  - [x] 3.3a — form-control (covers `<input>` + `<select>` + `<textarea>`; absorbs the dropped `_form-select.scss`) ✅
  - [x] Height amendment — controls use `height` not `min-height` ✅ (`.btn`, `.form-control` single-line, `.icon-box`, `.spinner` all density-multiplied; `.btn--wrap` + textarea/multi-select opt out; `--btn-bevel` knob added)
  - [x] Preflight + `.prose` foundation ✅ (`_reboot.scss` Preflight-style; `_typography.scss` cut `.blockquote*` + `.list-*`; new `components/_prose.scss` + 5 `--st-prose-*` vars; `.link` utility added; `/typography` page rewritten; cascade-only nested-component overrides; V3.md §3.1 + §3.10 updated)
  - [ ] 3.3b — form-check + input-group
  - [ ] 3.3c — form-range
- [ ] Step 4 — JS rewrite (interleaved with step 3 JS-coordinated components)
- [ ] Step 5 — Demo pages (.njk class + attr + delete pass)
- [ ] Step 6 — Cleanup, README/CHANGELOG, `3.0.0-beta.1` tag
- [ ] **After 3.0.0 final:** delete `bs5-snapshot/`, delete this file.
