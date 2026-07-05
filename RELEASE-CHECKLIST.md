# Release Checklist — what's left for the maintainer (human-only)

> Companion to `RELEASE-READINESS.md`. That doc is the full plan; this is the short, actionable
> to-do list of things **tools can't do** — the human a11y passes and the release mechanics.
> Everything on the automated side is done and green. Work top to bottom.
>
> Last updated: 2026-07-04 · Branch: `v3`

---

## Status snapshot (already done — no action needed)

- ✅ Automated a11y/keyboard suite complete and green **cross-browser**: `292 passed / 0 failed /
  2 skipped` on Chromium + Firefox + WebKit. (The 2 skips are the WebKit focus-trap tests — a known
  macOS "Full Keyboard Access" quirk, deliberately deferred to the Safari pass in A2 below.)
  - Tier-1 (RC): dialog, drawer, popover, menu, select, tabs
  - Static-only (31 components): axe-only
  - Tier-2 (Stable): slider, toggle, toggle-group, accordion, collapsible, tooltip, combobox,
    autocomplete, carousel, toast, sidebar, navbar, scroll-area
- ✅ 5 real a11y bugs the gate caught are fixed + committed (select, slider, autocomplete, carousel,
  scroll-area — see `RELEASE-READINESS.md` §6.5).
- ✅ Playwright browser binaries installed; token guardrails (`pnpm check`) clean.

### How to re-run the suite yourself at any time
```bash
pnpm build:packages     # REQUIRED first (fixtures load the built dist/; rebuild after any packages/* edit)
pnpm test               # all tiers, all 3 browsers  → expect 292 passed / 2 skipped
# faster loop:
pnpm test:rc            # Chromium only
npx playwright show-report   # full per-test breakdown after a run
```

---

## Part A — Accessibility passes only a human can do

These verify what axe/Playwright cannot: that a screen reader **announces** the right thing, and
that the UI holds up under real assistive settings. Log anything that reads wrong — each is a real
bug to fix before Stable. Do these **before** cutting the RC (A findings may need code changes; the
RC freezes the API).

### A1 — VoiceOver pass (macOS) — REQUIRED for Stable
Toggle VoiceOver with **Cmd+F5**. Open the docs site (or the fixtures) and, using **keyboard only**,
walk each component below. Confirm the *announcement*, not just that focus moves.

- [x] **dialog / drawer** — on open, VO announces the dialog name + role; on close, focus lands back
      on the trigger and VO says so.
- [x] **menu** — option count announced; moving the active item reads the new item; selected state read.
- [x] **select** — collapsed value announced; on open, "listbox, N items"; arrowing reads each option;
      selected option announced.
- [x] **tabs** — VO says "tab, selected, N of M"; arrowing moves and re-announces.
- [x] **slider** — thumb reads its **name + value** (e.g. "Brightness, slider, 40"). *(This is the
      thumb-name fix — worth an explicit check.)*
- [x] **tooltip** — description is read when the trigger receives focus; Escape dismisses.
- [x] **accordion** — header reads "button, collapsed/expanded"; toggling re-announces.
- [x] **combobox / autocomplete** — role announced; typing/arrowing reads the active option;
      selecting reads the choice. *(combobox is third-party Tom Select — note issues but they're an
      accepted limitation, not a Stisla blocker; see RELEASE-READINESS §9.)*
- [x] **toast** — announced automatically when it appears (live region).

### A2 — Real Safari spot check — REQUIRED for Stable
WebKit ≈ Safari but not identical. In **actual Safari**, Tab through the Tier-1 components once
(dialog, drawer, popover, menu, select, tabs).
- [x] Focus stays trapped inside open dialog/drawer and returns to the trigger on close. *(This
      specifically covers the 2 skipped WebKit focus-trap tests.)* Found + fixed a Safari-only
      return-focus bug: mouse-open didn't restore focus to the trigger because Safari/Firefox don't
      focus a `<button>` on click, so `document.activeElement` was `<body>`. `open()` now takes the
      trigger explicitly (dialog.js / drawer.js). Requires enabling Keyboard navigation (below).
- [x] Tip: if Tab seems to skip buttons/links, enable **System Settings → Keyboard → Keyboard
      navigation** (macOS "Full Keyboard Access") first — off by default, and its absence is exactly
      why those 2 tests are skipped in automation.

### A3 — Reduced-motion + zoom sanity — REQUIRED for Stable
- [x] **System Settings → Accessibility → Display → Reduce Motion = on:** carousel and animated bits
      should calm down (no autoplay / instant transitions). Verified in Chrome + Safari. Found + fixed a
      carousel gap (Embla slide still eased / cached the setting once); now jumps instantly and reacts to
      live OS toggles, covered by `tests/keyboard/carousel.spec.ts` (`carousel — reduced motion`).
- [x] **Browser zoom to 200%:** layouts shouldn't break or clip; text stays readable. Verified — content
      scales uniformly, no clipping / overflow / overlap; all controls stay reachable and behave the same.

---

## Part B — Release mechanics (maintainer-only)

Agents can't publish; `dist/` is gitignored and `pnpm release` is manual and gated to you.

### B1 — Cut the release candidate `3.0.0-rc.1` ✅ (2026-07-05)
- [x] Re-run the gate green once more: `pnpm build:packages && pnpm test && pnpm check`.
- [x] Bump the workspace version to `3.0.0-rc.1` (all shipping packages; react/vue private).
- [x] `pnpm release` — rewrote `workspace:*` → real versions and published `css`/`style`/`vanilla`
      under the npm `rc` dist-tag. (Also carried the `@stisla/vanilla` peer-dep removal; no `beta.11`.)
- [x] Delete the stale peer-dep entry from the `notes` file once `rc.1` is published.

### B2 — Freeze the API ✅ (2026-07-05)
- [x] After `rc.1` is out, declare the public surface frozen: no `--color-*` token, `--st-border-width`,
      component class, or modifier (`--seamless`, `--grid`, `--pill`, `--soft`, …) renames. Any rename
      after this resets the RC clock. Noted in CHANGELOG (`3.0.0-rc.1`) + RELEASE-READINESS (§2.1, §7).

### B3 — Promote to `3.0.0` (after the RC window, all A items green)
- [ ] Confirm Stable gate (RELEASE-READINESS §7): Part A done + issues fixed, API held unchanged.
- [ ] Bump to `3.0.0`, `pnpm release`.
- [ ] Merge `v3` → `master` (independent of publishing; branch is merge-safe today — confirm before
      merging).

---

## Optional (nice-to-have, not blocking)

- [ ] Meridian-template axe supplement (RELEASE-READINESS §4.5): an axe pass over the built dashboard
      pages for real-composition coverage. An agent can do this — just ask.
- [~] Fix the advisory (non-blocking) carousel notes in RELEASE-READINESS §6.5. Done 2026-07-05:
      off-screen slides now `aria-hidden` + `inert`; polite live region announces slide changes
      (silent during autoplay). Still open (low value): aria-disabled end-of-track controls stay
      focusable.

---

## Quick reference — where things live

- Full plan + rationale: `RELEASE-READINESS.md`
- Findings / bugs fixed: `RELEASE-READINESS.md` §6.5
- Tests: `tests/keyboard/*.spec.ts` (behavior) · `tests/a11y/static.spec.ts` (static axe) ·
  `tests/fixtures/*.html` (one per component)
- Test config: `playwright.config.ts` · fixture server: `scripts/serve-fixtures.mjs`
