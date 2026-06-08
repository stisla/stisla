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
3. **Form family:** form-control, form-select, form-check, input-group (largest cluster; do as one block).
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
| form-control | 3.4 K  | rewrite    | Hairiest BS5 forms override pile; v3 base + `:focus-visible` ring                                                              |
| form-select  | 1.8 K  | rewrite    | Native select first; custom-select is a Phase 7 component                                                                      |
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
- [ ] Step 4 — JS rewrite (interleaved with step 3 JS-coordinated components)
- [ ] Step 5 — Demo pages (.njk class + attr + delete pass)
- [ ] Step 6 — Cleanup, README/CHANGELOG, `3.0.0-beta.1` tag
- [ ] **After 3.0.0 final:** delete `bs5-snapshot/`, delete this file.
