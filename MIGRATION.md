# Stisla v3 — BS5 → vanilla migration

> Transient. Tracks the refactor of the existing BS5-based v3 codebase to the V3.md spec.
> Delete this file once the migration ships (3.0.0).

**Spec:** V3.md (locked).
**Branch:** v3.
**Approach:** Option A — snapshot the BS5 version once, rewrite in place. See §3 step 0.

---

## Status

_Latest entry first. One line per session: ISO date — step completed / current — blockers._

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

| Surface | Counts | Notes |
| --- | --- | --- |
| `src/scss/components/` | 30 files (~100 KB) | Largest: `_sidebar.scss` 22 K, `_buttons.scss` 11 K, `_app-shell.scss` 6 K. `_progress.scss` is 0 B (placeholder). |
| `src/scss/tokens/` | 5 files (~50 KB) | `_colors.scss`, `_maps.scss`, `_root.scss`, `_variables.scss`, `_variables-dark.scss` — all tightly coupled to BS5. |
| `src/scss/bundles/` | `stisla-full.scss` | Canonical BS5 customization workflow with Stisla overlays. |
| `src/js/` | `index.js` (2.7 K) | Re-exports `bootstrap`, auto-inits Popover/Tooltip, app-shell handlers. |
| `src/site/pages/` | 40 njk demos | All use BS5 class hooks (`.fade`, `.show`), `data-bs-toggle`, `data-bs-target`. |
| `package.json` | `bootstrap: ^5.3.3` | Plus none of the new deps yet. |
| Foundation files | — | `foundation/` directory doesn't exist; build pipeline relies on `@import 'bootstrap/scss/reboot'` etc. |

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

### Step 1 — Foundation rewrite (no visible UI change)
- [ ] Install deps: `@floating-ui/dom`, `focus-trap`, `tabbable`, `embla-carousel`. Vendor `modern-normalize.css` (don't depend on the package; copy the file).
- [ ] Remove `bootstrap` from `package.json`.
- [ ] Create `src/scss/foundation/` with:
  - `_normalize.scss` — vendored modern-normalize
  - `_reboot.scss` — Stisla opinions (~30 lines, reads `--st-*`)
  - `_grid.scss` + `_containers.scss` — forked from BS5 (`bootstrap/scss/_grid.scss`, `_containers.scss`, `mixins/_grid.scss`). Rename gutter vars to `--st-grid-gutter-*`. Strip RTL, `_root` emits, deprecated `.no-gutters`, `$enable-cssgrid` branch.
  - `_breakpoints.scss` — forked from `bootstrap/scss/mixins/_breakpoints.scss`. Rename `media-breakpoint-up` → `media-up`, etc.
  - `_mixins.scss` — `color-mode` helper (~3 lines) + any other tiny helpers.
- [ ] Add `LICENSES/bootstrap-MIT.txt` (full BS5 MIT text). Add credit header to each forked file. Add NOTICE line to README.
- [ ] Verify: site still builds (component files break — that's fine, fixed in step 2/3); a spot-check `index.njk` renders with the new reboot/grid.

### Step 2 — Token rewrite
- [ ] Delete `tokens/_colors.scss`, `_maps.scss`, `_root.scss`, `_variables.scss`, `_variables-dark.scss`.
- [ ] Create `tokens/_theme.scss` — 28 OKLCH tokens, light + dark blocks. Single source of truth for color literals.
- [ ] Create `tokens/_breakpoints.scss` — `$breakpoints` Sass map + `media-up/down/between` mixins (or move from `foundation/_breakpoints.scss` and re-export — pick one location).
- [ ] Update `bundles/stisla-full.scss` to the new import order: `foundation/normalize → foundation/reboot → tokens/theme → @layer foundation, theme, components, utilities → components/* → utilities/*`.
- [ ] All component files break here. That's intentional — fixed in step 3.

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

| Component | Size | Action | Notes |
| --- | --- | --- | --- |
| accordion | 4.5 K | rewrite | BS5 collapse JS dependency; new height-transition impl or native `<details>` |
| alert | 4.1 K | rewrite | color-mix on `--st-*` intents; new BEM (`__icon`, `__heading`, `__description`, `__action`) |
| app-shell | 6.1 K | port | Stisla original; low BS5 coupling. Retoken + BEM verify |
| badge | 2.5 K | rewrite | color-mix variant model; opt-out of radius (pill) |
| breadcrumb | 1.9 K | port | Mostly clean; retoken |
| button-group | 1.1 K | rewrite | Now also serves as tabs/segmented control with `data-state="active"`. Expanded scope |
| buttons | 11.2 K | rewrite | Largest BS5 override pile (button-variant mixin); v3 BEM + color-mix from scratch |
| card | 1.9 K | rewrite | Surface tokens; BEM (`__header`, `__body`, `__footer`) |
| carousel | 3.0 K | rewrite | Now wraps Embla; styling minimal |
| dropdown | 2.2 K | rewrite | Floating UI + `[data-state="open"]` + `[data-highlighted]` |
| form-check | 3.2 K | rewrite | Native `<input>` styling; cross-browser pass |
| form-control | 3.4 K | rewrite | Hairiest BS5 forms override pile; v3 base + `:focus-visible` ring |
| form-select | 1.8 K | rewrite | Native select first; custom-select is a Phase 7 component |
| icon-box | 2.2 K | port | Stisla original; retoken |
| input-group | 3.6 K | rewrite | Adopts new form-control tokens |
| kbd | 670 B | port | Tiny; retoken |
| list-group | 1.5 K | rewrite | `[data-state="active"]`; accent (hover) + highlight (active) |
| modal | 4.7 K | rewrite | New JS impl (focus-trap + inert + `[data-state="open"]`) |
| nav | 2.6 K | **delete** | Family cut. See V3.md §4 Phase 2 |
| navbar | 4.0 K | port | Stisla original; retoken |
| offcanvas | 2.5 K | rewrite | Same primitives as modal |
| page | 4.0 K | port | Stisla original |
| pagination | 1.6 K | rewrite | `[data-state="active"]` for current page |
| placeholders | 328 B | port | Tiny |
| popover | 1.1 K | rewrite | Floating UI |
| progress | 0 B | **write** | File is empty. Build from scratch |
| sidebar | 22.1 K | rewrite | Largest file. Many custom features (collapse, sub-menus, footer). Core logic carries; tokens + state attrs are the new surface |
| table | 3.7 K | rewrite | Surface tokens; hover/highlight on rows |
| toast | 3.2 K | rewrite | New JS impl |
| tooltip | 856 B | rewrite | Floating UI |

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
- [ ] Step 1 — Foundation rewrite (deps swap, `foundation/` files, `LICENSES/`)
- [ ] Step 2 — Token rewrite (`_theme.scss` + `_breakpoints.scss`)
- [ ] Step 3 — Component rewrite (per §4 table, in order from §3 step 3)
- [ ] Step 4 — JS rewrite (interleaved with step 3 JS-coordinated components)
- [ ] Step 5 — Demo pages (.njk class + attr + delete pass)
- [ ] Step 6 — Cleanup, README/CHANGELOG, `3.0.0-beta.1` tag
- [ ] **After 3.0.0 final:** delete `bs5-snapshot/`, delete this file.
