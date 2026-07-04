# Release Readiness — a11y / keyboard / cross-browser gate to RC and Stable

> **Purpose.** This is the execution plan to take `@stisla/*` from `3.0.0-beta.10` → `3.0.0-rc.1`
> → `3.0.0`. The decisions are already made here. The next agent should **execute and check
> state**, not re-litigate the strategy. If reality contradicts a fact below, fix the fact and
> keep going — don't redesign the plan.
>
> Author: release-readiness pass, 2026-07-03. Branch: `v3`.

---

## 0. TL;DR — what "done" means

- **RC (`3.0.0-rc.1`)** = API frozen + packaging clean + automated a11y/keyboard suite green on
  Chromium for the focus-critical components. Cut it, publish, invite breaking feedback.
- **Stable (`3.0.0`)** = the same suite green across Chromium + Firefox + WebKit, **plus** a human
  VoiceOver pass and a real-Safari spot check, with the API held unchanged through the whole RC
  window (no token/class/modifier renames).

The blocker to RC is **not** unfinished code. The behaviors exist. The blocker is (a) the public
surface only just stopped moving, (b) a queued packaging fix, and (c) **zero verification infra**.
This doc closes (c) and sequences (a)/(b).

### ▶ Where we are / where to resume (2026-07-04)
- **DONE:** test harness + fixture model proven (dialog: 3 keyboard tests green). See §4.
- **DONE (2026-07-03):** contrast **option (a)** — split intent tokens into a *fill* token and a new
  darker `--color-<intent>-emphasis` token, rewire the text/icon-usage components. Tracked in §6.5.
- **DONE (2026-07-04): all six Tier-1 components have fixture + keyboard + axe specs, green on
  Chromium** (`pnpm test:rc` → **27 passed, 0 failed**). dialog, drawer, popover, menu, select, tabs.
  Two findings caught + resolved this session (see §6.5): a popover axe timing artifact (test-side) and
  a **real select a11y bug** — the generated trigger had no accessible name and used
  `aria-activedescendant` on a plain button role; fixed in `select.js` (role="combobox" + label/listbox
  naming). RC-blocking Tier-1 keyboard gate is met.
- **DONE (2026-07-04): static-only axe gate.** 31 faithful fixtures (§3) + one data-driven
  `tests/a11y/static.spec.ts` — axe-green on all three browsers (93/93). Full suite now **172 passed,
  0 failed, 2 skipped** (the 2 = WebKit focus-trap, §6.5). This completes the RC axe gate.
- **DEFERRED → safe to resume in a FRESH session:** the **Tier-2** keyboard sweep (slider, toggle,
  toggle-group, accordion, collapsible, tooltip, combobox, autocomplete, carousel, toast, sidebar,
  navbar, scroll-area) — §5. Also the optional Meridian axe supplement (§4.5). Copy the Tier-1
  fixtures/specs shape. Tier 2 gates Stable, not RC.

---

## 1. Verified current state (2026-07-03)

Re-verify anything marked ⏱ before trusting it; the rest is structural.

- ✅ `git`: `v3` is 238 commits ahead of `master`, working tree clean.
- ✅ `pnpm build:packages` → all 5 packages (css, style, vanilla, react, vue) build clean.
- ✅ `pnpm smoke` → all 4 published packages pack cleanly.
- ✅ `pnpm check` → token guardrails clean (126 files).
- ✅ **Playwright is already a devDependency** (`playwright@^1.61.1`, root `package.json`). It is
  currently used ONLY by `templates/screenshot.mjs` (a screenshot driver, not tests). There is
  **no** `playwright.config`, **no** test files, **no** `test` script, and **no**
  `@axe-core/playwright`.
- ✅ Behavior layer is real, not stubs. 20 interactive components ship JS under
  `packages/vanilla/src/components/`: `accordion, autocomplete, avatar, carousel, collapsible,
  combobox, dialog, drawer, menu, navbar, popover, scroll-area, select, sidebar, slider, tabs,
  toast, toggle-group, toggle, tooltip`.
- ⏱ Existing keyboard/focus/ARIA density (grep heuristic — treat as "where to look", not proof):

  | component | keyboard | focus mgmt | aria | note |
  |---|---|---|---|---|
  | dialog | 6 | 17 | 3 | focus trap present |
  | drawer | 6 | 16 | 3 | focus trap present |
  | popover | 6 | 20 | 9 | focus trap present |
  | menu | 14 | 9 | 18 | roving keys + ARIA |
  | select | 15 | 4 | 52 | heavy ARIA |
  | tabs | 15 | 5 | 22 | arrow-key roving |
  | slider | 4 | 6 | 11 | arrow value change |
  | toggle-group | 9 | 3 | 11 | |
  | tooltip | 4 | 0 | 6 | **no focus mgmt — verify keyboard-reachable + Esc-dismiss** |
  | accordion | 0 | 0 | 2 | **verify native `<button>` disclosure works keyboard-only** |
  | combobox | 0 | 1 | 5 | delegates to the Tom Select adapter — verify the adapter's a11y |

- ✅ Test model = **isolated same-origin fixtures**, not the docs site (§4.3). Decided after research
  (every serious kit does per-component fixtures, not docs-scanning) and **proven** — dialog fixture +
  spec run green. The docs demos' sandboxed iframe is irrelevant to testing now; ignore it here.
- ✅ Harness server = `scripts/serve-fixtures.mjs` on IPv4 `127.0.0.1:5273` (a fixed strict port).
  We do NOT use `pnpm dev`: `docs/vite.config.ts` pins `server.port: 3001` without `strictPort` (hops
  to 3002/3003…) and binds IPv6-only, which broke the first healthcheck. Don't reintroduce that path.

---

## 2. The release decision (already made — do not re-open)

1. **Fold the pending `beta.11` fix into `rc.1`.** The `notes` file tracks a deferred
   `@stisla/vanilla` peer-dependency removal (already removed in source, committed in `932f713`;
   npm still carries the peer on the live `beta.10`). Do **not** cut a `beta.11`. The next
   published version is `3.0.0-rc.1`, and it carries that peer fix. Delete the `notes` entry once
   `rc.1` publishes.
2. **`rc.1` declares the API frozen.** After it publishes, `--color-*` tokens, the lone
   `--st-border-width` custom, component class names, and the intent-based modifiers
   (`--seamless`, `--grid`, `--animated`, `--pill`, `--circle`, `--soft`, etc.) **must not change**.
   The 2026-07-02 modifier sweep was the last allowed breaking rename. Any rename after `rc.1`
   resets the RC clock.
3. **Promote to `3.0.0`** only after the RC window passes with no breaking change and the Stable
   gate (§7) is green.
4. **Merging `v3` → `master` is independent** of publishing. The branch is already
   merge-safe today. Recommended order: land the test infra + RC gate on `v3`, cut `rc.1`,
   then merge `v3` → `master` so master reflects the RC. Confirm with the maintainer before merge.

---

## 3. Scope — which components get which test

**Every component gets a fixture + axe.** One `tests/fixtures/<name>.html` per component (§4.4),
axe-scanned via `expectNoA11yViolations(page)`. Static-only components need just the fixture + an
axe spec; interactive ones also get a keyboard spec. (Optional realism supplement: one axe pass over
the built Meridian pages — §4.5.)

**Keyboard/interaction specs — the 20 interactive components only.** Split by priority:

- **Tier 1 — RC-blocking (focus-critical):** `dialog`, `drawer`, `popover`, `menu`, `select`,
  `tabs`. These own focus trap / roving tabindex / Escape / focus-return. If any Tier-1 contract
  fails, RC is blocked until fixed.
- **Tier 2 — Stable-required (nice-to-have for RC):** `slider`, `toggle`, `toggle-group`,
  `accordion`, `collapsible`, `tooltip`, `combobox`, `autocomplete`, `carousel`, `toast`,
  `sidebar`, `navbar`, `scroll-area`. Write these after Tier 1; they gate Stable, not RC.

Static-only components (no keyboard spec, axe only): `alert, avatar, avatar-group, badge,
breadcrumb, button, button-group, card, checkbox, field, icon-box, illustration, indicator, input,
input-group, kbd, link, list-group, media, meter, page, pagination, placeholders, progress, radio,
separator, spinner, switch, table, textarea, timeline`.

---

## 4. Test infrastructure — build this

> **Testing approach (research verdict, 2026-07-03).** How the established kits test a11y/keyboard:
> **Radix** — `<name>.test.tsx` co-located + Cypress real-events; **Base UI** — `.test.tsx` per
> component, real-browser Vitest by default; **HeroUI** — `__tests__/<name>.test.tsx` (jsdom, leans
> on React Aria); **React Aria** (a11y gold standard) — per-pattern tests + `*.browser.test.tsx`,
> axe in a real browser; **Bootstrap** (our vanilla analog) — per-plugin Jasmine specs in a real
> headless browser (Karma, no jsdom), injected HTML `#fixture`, dispatched keyboard events,
> assert on `document.activeElement`. **shadcn ships no component tests** (offloads to Radix).
> Verdict: **isolated per-component fixtures in a real browser is the universal norm; docs-scanning
> is at most a secondary axe layer.** Stisla follows the Bootstrap shape with Playwright as the
> modern real-browser runner. This is why §4.3 uses fixtures, not the docs demos.

### 4.1 Dependencies & browsers

```bash
# from repo root
pnpm add -D -w @axe-core/playwright        # playwright itself is already installed
npx playwright install chromium firefox webkit   # downloads browser binaries (network; see §6)
```

Add to root `package.json` scripts:

```json
"test": "playwright test",
"test:a11y": "playwright test a11y",
"test:kbd": "playwright test keyboard",
"test:rc": "playwright test --project=chromium",
"test:stable": "playwright test"
```

### 4.2 `playwright.config.ts` (repo root) — DONE, already committed

The config exists at repo root. Key decisions baked in (do not "simplify" them back):

- **Dedicated port 5273, `exec vite --port 5273 --strictPort --host 127.0.0.1`.** NOT `pnpm dev`.
  Reasons (learned the hard way, see §1): the docs config pins port 3001 without `strictPort` (hops
  on collision → non-deterministic) and binds IPv6-only (Playwright's IPv4 healthcheck refuses).
  `exec vite` actually forwards the flags (the `dev -- --port` form does **not**); `--strictPort`
  fails loud instead of hopping; `--host 127.0.0.1` matches the healthcheck's address family.
- `reuseExistingServer: true` so a warm harness server is reused between runs.
- Three browser projects (chromium/firefox/webkit); `pnpm test:rc` filters to `--project=chromium`.

> Note: `@playwright/test` (the runner) is separate from `playwright` (the lib the screenshot
> script imports). Both are pinned to matching `1.61`. Browser binaries (chromium/firefox/webkit/
> ffmpeg) are already present in `~/Library/Caches/ms-playwright/`.
>
> **Boot proof:** `tests/boot.spec.ts` passes on Chromium (`pnpm test:rc boot` → 1 passed) —
> Playwright starts the server on 5273 and confirms the dialog route renders a demo iframe. This
> file is scaffolding; fold it into the real suites (or delete) once §5 specs land.

### 4.3 Fixture model — isolated same-origin HTML, NOT the docs site — DECIDED & PROVEN

**This replaces the earlier docs-iframe plan.** After researching how real kits test a11y/keyboard
(Radix, Base UI, HeroUI, React Aria, Bootstrap), the verdict was unanimous: **dedicated
per-component tests with hand-written minimal fixtures, run in a real browser** — never "scan the
docs site" as the primary suite. Bootstrap (vanilla CSS + thin JS, our closest analog) is the
template: per-plugin specs, real headless browser (no jsdom — it fakes focus/`activeElement`), an
injected HTML `#fixture`, dispatched keyboard events, assert on real `document.activeElement`. axe
is a *supplement*, run in the real browser against the isolated fixture. (Research summary lives in
the "Testing approach" note at the top of §4.)

Why fixtures beat the docs demos here:
- **A fixture is the test's INPUT, not a duplicate.** Like `myFunc(3,4)` in a unit test — you write
  one *usage*; the CSS/JS under test stays shared (linked from `packages/*/dist`). Not a "third copy".
- **No sandbox.** The docs demos live in cross-origin sandboxed iframes; fixtures are same-origin, so
  axe injects cleanly and there's zero iframe friction.
- **Isolation + state control + speed.** One component, any starting state, instant load, no docs app.
- **Right home.** Behavior tests sit with the vanilla JS they exercise, not bolted onto the docs.

How it's wired (built & proven 2026-07-03):
- `scripts/serve-fixtures.mjs` — a ~40-line static server over the repo root, IPv4 `127.0.0.1:5273`,
  so a fixture can `<link>`/`<script>` the **built** bundles (`/packages/css/dist/stisla.css`,
  `/packages/vanilla/dist/stisla.js`) same-origin. The vanilla dist is an auto-initing IIFE
  (attaches `window.Stisla`, wires `[data-stisla-*]` on `DOMContentLoaded`) — so a plain HTML
  fixture just works, no manual init.
- `playwright.config.ts` `webServer` runs that script (replaced the docs-vite command).
- **Prereq:** `pnpm build:packages` before `pnpm test` — fixtures reference `dist/` (gitignored).

### 4.4 Fixture authoring convention

One `tests/fixtures/<component>.html` per interactive component. Keep markup **minimal but
faithful** — mirror the documented recommended usage (lift from `docs/src/routes/docs/vanilla/
<component>.tsx`), including the ARIA wiring, so the test exercises the real contract. Link
`stisla.css` + `_fixture.css` (neutral chrome) in `<head>`, put the component markup in `<body>`,
load `stisla.js` last. Add a neutral control *before* the trigger (e.g. a link) so focus-return has
a distinct wrong answer to fail against. `tests/fixtures/dialog.html` is the reference.

### 4.5 Layout (as built)

```
tests/
  fixtures/
    _fixture.css             # shared neutral chrome (NOT the component under test)
    dialog.html              # one minimal same-origin fixture per interactive component
    drawer.html  menu.html  select.html  tabs.html  popover.html  ...
  keyboard/
    dialog.spec.ts           # Tier 1 — DONE (3 keyboard tests green; axe test parked, see Findings)
    drawer.spec.ts  popover.spec.ts  menu.spec.ts  select.spec.ts  tabs.spec.ts
    ...                      # Tier 2 after Tier 1
  helpers/
    axe.ts                   # expectNoA11yViolations(page) — AxeBuilder wrapper, WCAG A/AA
scripts/serve-fixtures.mjs   # static server for the fixtures (webServer command)
```

Optional realism supplement (like React Aria's docs-crawler): a single `tests/a11y/axe-template.
spec.ts` that axe-scans the built Meridian pages (`templates/dist-site/meridian/*.html`, same-origin)
for real-composition coverage. Secondary to the per-component fixtures, not a replacement.

### 4.6 Reference spec — the proven shape (from `tests/keyboard/dialog.spec.ts`)

Same-origin fixture, real browser, assert on `data-state` + real focus. No iframe, no `frameLocator`.

```ts
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/tests/fixtures/dialog.html"); });

test("Escape closes and returns focus to the trigger", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Invite a teammate" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#dlg-basic")).toHaveAttribute("data-state", "open");
  await expect(page.locator("#dlg-basic-email")).toBeFocused();   // [autofocus] target

  await page.keyboard.press("Escape");
  await expect(page.locator("#dlg-basic")).toHaveAttribute("data-state", "closed");
  await expect(trigger).toBeFocused();                            // focus RETURNS to opener
});

// Focus trap: Tab N times, assert document.activeElement stays inside the dialog subtree
// via page.evaluate(() => dialog.contains(document.activeElement)).
```

### 4.7 axe helper

Built at `tests/helpers/axe.ts` — `expectNoA11yViolations(page, { include?, disableRules? })`,
WCAG 2.0/2.1 A + AA, runs against the current same-origin fixture (clean injection, no iframe).
Triage real violations by fixing the component or the fixture; disable a rule only with an explicit
comment. See the "Findings" section for the first real catch.

---

## 5. Per-component keyboard checklist (the contracts to assert)

Each is a WAI-ARIA APG pattern. If a contract fails, that's a real bug to fix in
`packages/vanilla/src/components/<name>.js` before the gate passes — the test is not "make it pass",
it's "confirm the behavior, fix the code if wrong."

### Tier 1 (RC-blocking)
- **dialog / drawer (modal):** trigger opens on Enter/Space · focus moves into the surface on open ·
  `Tab`/`Shift+Tab` cycle stays trapped inside · `Escape` closes · focus **returns to the trigger** ·
  backdrop click closes (non-keyboard, but assert it doesn't strand focus).
- **popover:** opens from keyboard · focus moves in (if it contains focusables) · `Escape` closes and
  returns focus · dismiss on outside click.
- **menu:** `ArrowDown`/`ArrowUp` move a roving tabindex through items · `Home`/`End` jump ·
  `Enter`/`Space` activate · `Escape` closes and returns focus to the trigger · typeahead if implemented.
- **select:** opens on Enter/Space/ArrowDown · arrows move the active option · `aria-activedescendant`
  or roving focus tracks it · Enter selects and closes · `Escape` closes without selecting · selected
  value announced.
- **tabs:** `ArrowLeft`/`ArrowRight` (or Up/Down for vertical) roving between tabs · `Home`/`End` ·
  correct `aria-selected` + `tabindex="0"` on active, `-1` on rest · panel association via
  `aria-controls`/`aria-labelledby`.

### Tier 2 (Stable-required)
- **slider:** arrows change value by step · `Home`/`End` to min/max · `PageUp`/`PageDown` if large-step ·
  `aria-valuenow`/`valuemin`/`valuemax` update.
- **toggle / toggle-group:** Space toggles · group is arrow-navigable · `aria-pressed` correct.
- **accordion:** each header is a keyboard-operable `<button>` · Enter/Space toggles ·
  `aria-expanded` flips · content reachable. (Grep showed no JS keyboard handling — confirm it
  rides native button semantics and isn't a `<div role=button>` without a key handler.)
- **collapsible:** trigger toggles on Enter/Space · `aria-expanded` correct.
- **tooltip:** trigger is keyboard-focusable · tooltip shows on focus · `Escape` dismisses ·
  content referenced by `aria-describedby`. (Grep showed `focus:0` — most likely gap.)
- **combobox / autocomplete:** confirm the Tom Select adapter exposes `role="combobox"`,
  `aria-expanded`, `aria-controls`, arrow navigation of options, Enter to select, Escape to close.
  If the adapter is deficient, note it — this may be an accepted third-party limitation.
- **carousel:** controls keyboard-operable · slides labelled · respects `prefers-reduced-motion`.
- **toast:** dismissible from keyboard · `role="status"`/`aria-live` set so it announces.
- **sidebar / navbar:** collapse/expand toggles keyboard-operable · focus order sane ·
  the Meridian mobile-drawer toggle works keyboard-only.
- **scroll-area:** keyboard-scrollable region has `tabindex="0"` + accessible name if it's a
  focusable scroll container.

---

## 6. What YOU (the maintainer / human) must do — tools can't

1. **Install the browser binaries if the agent's sandbox blocks network.**
   `npx playwright install chromium firefox webkit`. Agents often can't download; if
   `pnpm test` fails with "browser not found", run this yourself once.
2. **VoiceOver pass (macOS, required for Stable).** `Cmd+F5` to toggle VoiceOver. Walk each Tier-1
   component + tooltip/accordion/combobox. Confirm announcements, not just focus:
   - dialog/drawer: on open, does VO announce the dialog name/role? On close, does it land back on
     the trigger?
   - menu/select: is the option count and selected state announced? Does moving the active option
     read the new option?
   - tabs: does VO say "tab, selected, N of M"?
   - tooltip: is the description read when the trigger is focused?
   - toast: is it announced when it appears (live region)?
   Log anything VO gets wrong — those are real bugs axe will not catch.
3. **Real Safari spot check (Stable).** WebKit ≈ Safari but not identical. Open the docs +
   Meridian template in actual Safari, tab through the Tier-1 components once.
4. **Reduced-motion + zoom sanity (Stable).** System Preferences → Reduce Motion on: carousel /
   animated bits should calm down. Browser zoom to 200%: layouts shouldn't break.
5. **Publish gating (maintainer-only).** `dist/` is gitignored and `pnpm release` is manual. Agents
   must not `npm publish`. When the gate is green:
   - bump versions to `3.0.0-rc.1` across the workspace,
   - `pnpm release` (it rewrites `workspace:*` → real versions),
   - later, `3.0.0` the same way.
6. **Final go/no-go.** Approve the RC cut and the Stable promotion. Approve the `v3` → `master`
   merge (§2.4).

---

## 6.5 Findings (things the harness has caught — triage each)

- **[RESOLVED 2026-07-04 · fixed in select.js] Custom select had no accessible name + illegal ARIA.**
  The Tier-1 select axe spec caught two real, shipped bugs (both only visible while open): (1) the
  JS-generated `.select__trigger` button had an empty `.select__value` span (the placeholder is
  CSS-only via `data-placeholder`) and the visible `<label for>` targets the now-hidden native
  `<select>`, so the trigger had **no accessible name** (`button-name`, critical) until a value was
  picked; (2) the trigger carried `aria-activedescendant` (the roving marker) on an implicit
  `role=button`, which forbids it (`aria-allowed-attr`), and the `role="listbox"` popup was nameless
  (`aria-input-field-name`). Fixed by adopting the ARIA 1.2 **select-only combobox** pattern in
  `select.js`: `role="combobox"` on the trigger (legalizes aria-controls/expanded/activedescendant),
  and both trigger and listbox now borrow the source's associated `<label>` (via `el.labels`) — trigger
  name = label + live value span, listbox name = label; falls through to the source's `aria-label`/
  `aria-labelledby` if set, else the placeholder as a last resort. Rebuilt `@stisla/vanilla`; select
  spec green (4/4). No API/class/token change — pure a11y-attribute wiring, safe for RC.

- **[KNOWN 2026-07-04 · WebKit test-env only] Focus-trap Tab test skipped on WebKit.**
  The dialog + drawer "focus is trapped (Tab never escapes)" tests are `test.skip`'d on WebKit. Cause:
  Playwright's WebKit honors the macOS **Full Keyboard Access** setting, which is OFF by default, so
  Tab visits only form fields (never buttons/links) and transiently lands on `<body>` between stops —
  the native tab order isn't representative, so the strict per-Tab assertion false-fails. Manually
  verified the trap still contains focus (input → body → close → input, i.e. it wraps back). The other
  trap-adjacent contracts (open, Escape, focus-return, axe) DO run and pass on WebKit. Real-Safari
  focus containment is the human §6.3 pass. Full cross-browser result after the skip: **79 passed, 0
  failed, 2 skipped** (Chromium + Firefox + WebKit). Not a component bug; no code change.

- **[RESOLVED 2026-07-04 · test-side] Popover axe read washed-out contrast (mid-transition).**
  The popover axe spec failed with every element (title, input, both buttons) at ~2.4:1 — a false
  positive: `data-state="open"` is set at the *start* of the surface's opacity fade-in, so axe measured
  pixels mid-transition (partial opacity composites all colors toward the white backdrop). Fixed in the
  spec by waiting `toHaveCSS("opacity", "1")` before scanning. Also added `text-foreground` to the
  fixture's `.popover__body` — the documented pattern for a body holding interactive children (the
  default `.popover__body` colour is intentionally `--color-muted-foreground` for text-only context;
  popover.css:87-88). No component change. General lesson for other fade-in surfaces: gate the open-state
  axe scan on settled opacity, not just the state attribute. **Applied the same opacity-settle gate to
  menu and dialog** (both fade `.menu__popup` / `.dialog__panel` opacity 0→1) — menu was intermittently
  failing this way in the full parallel run (item text read `#a0a0a0`, 2.61:1, mid-fade); dialog carried
  the same latent flake. Drawer is exempt (its content slides via transform; opacity stays 1).

- **[RESOLVED 2026-07-03 · option (a) implemented + verified] Intent colors failed WCAG AA.**
  Fixed via the fill/emphasis token split: darkened the 4 failing solid fills + added
  `--color-<intent>-emphasis` (light + dark) in `theme.css`, rewired link/alert/badge-soft/card/menu/field
  **and button (outline/ghost/soft, via `--button-tone-emphasis`)** — any variant that paints the intent
  color as a foreground mark on a transparent/tinted bg now uses `-emphasis`. **Icons too:** small intent
  glyphs on tints (`alert`, `toast`, `icon-box`, `empty-state`, `timeline` marker) were moved to
  `-emphasis` — they're text-sized and the raw fill wasn't dark-tuned, so they read poorly on dark tints.
  `indicator` (a solid status dot, not a glyph) stays on the fill. Dual-role tones use a
  `--<comp>-tone-emphasis` companion. **Naming:** `-emphasis` (not `-text`) because it colors icons +
  marks too, not just text; matches Bootstrap 5.3's `-text-emphasis` concept. Subtle/tint backgrounds
  stay runtime `color-mix` (no contrast constraint → keep auto-retone + per-component density; no
  `-subtle` token).
  `tests/a11y/contrast.spec.ts` now passes **light AND dark** on real rendered pixels; the dialog axe
  test is un-parked and green. Notable visual change: warning links/soft-chips read brown (`#a95800`
  light / `#d17d00` dark) — unavoidable for readable yellow text; warning *buttons* stay bright.
  Original analysis (kept for context — each intent is used two ways that pull opposite directions):

  | usage | pair | primary | success | warning | danger | info |
  |---|---|---|---|---|---|---|
  | **Solid** (button, solid badge) | white/dark text on solid intent | 3.43 ❌ | 2.50 ❌ | 7.09 ✅ | 4.13 ❌ | 2.86 ❌ |
  | **Soft badge** (15% tint) | intent as TEXT on tint | 2.89 ❌ | 2.17 ❌ | **1.90 ❌** | 3.31 ❌ | 2.45 ❌ |
  | **Alert link** (7% tint) | intent as TEXT on tint | 3.18 ❌ | 2.33 ❌ | 2.01 ❌ | 3.74 ❌ | 2.67 ❌ |

  **What PASSES (the common reading case is fine):** alert `__title` (foreground) 14:1, alert
  `__description` (muted) ~5:1, body/neutral/accent/tooltip, and ALL of dark mode. So alert *message copy*
  is readable; the failures are the **fills** and the **intent-colored text/links/soft chips**.

  **The tension (this is the real problem):** an intent color can't be BOTH a vivid solid fill AND
  readable as text on a light tint. warning is the proof — it PASSES solid (dark text, 7.09) but is the
  WORST in soft/link (1.90), because there the bright yellow is the text. So "just darken the fill" does
  NOT fix soft/link, and darkening enough to fix text-on-tint turns warning into brown (kills the fill).
  This is why mature systems (Radix, Material) use a **multi-step scale**: a *solid-fill* token AND a
  separate, darker *accessible-text* token per intent — not one color doing both jobs.

  **Fix options — this is now an architecture choice, not a 4-value tweak:**
  - **(a) Split tokens per intent** (recommended, Radix-style): keep `--color-<intent>` for fills
    (darken the 4 that fail white-text) and add `--color-<intent>-emphasis` (darker) used by soft badges,
    alert links/icons, `.text-<intent>`. Most robust; more tokens + wiring the soft/link CSS to the
    new token.
  - **(b) Darken every intent enough to work as text everywhere** — simplest token-wise, but warning/
    success shift a lot (amber→brown); changes the whole palette's vibrancy.
  - **(c) Accept soft/link as a known AA gap**, document it, keep the axe test scoped to solid fills.
    Fastest to RC; leaves real low-contrast text in soft chips + alert links.

  Borders vs background fail 3:1 but are decorative — separate, low priority. NOTE: `scripts/contrast-
  audit.mjs` only covers SOLID pairs (it can't composite the semi-transparent soft tints) — for
  soft/link, trust the axe fixture, which composites real pixels.

  **Which number is authoritative?** `tests/a11y/contrast.spec.ts` — axe measures the actually-rendered
  pixels in Chromium (reference engine). Verified 2026-07-03 that its numbers match `contrast-audit.mjs`
  to within 0.01. When online testers disagree, they're running APCA (WCAG 3 draft — a different scale,
  not "X:1"), feeding a different hex, or assuming the 3:1 large-text threshold. Trust axe.

  **Three tools, one truth (all agree):** `tests/a11y/contrast.spec.ts` (authoritative, in the suite —
  `pnpm test:a11y`, prints a per-intent ratio table; `test.fixme`'d until fixed) · `scripts/contrast-
  audit.mjs` (fast CLI, reads `theme.css` live) · `tests/contrast-lab.html` (double-click — eyeball +
  tune). The dialog axe assertion is also `test.fixme`'d until this resolves.

  **To apply (after choosing a/b/c):** edit `packages/style/src/theme.css` (and, for option a, wire the
  soft/link CSS in `badge.css` + `alert.css` to the new `-text` token) → re-run the axe fixture
  (`pnpm test:a11y`, un-`fixme`'d) until the shipped components pass → `pnpm build:packages` → un-`fixme`
  the dialog axe test too. `contrast-audit.mjs` is a quick CLI pre-check for the SOLID pairs only.

## 7. Definition of done

### RC gate — `3.0.0-rc.1` (all must be ✅)
- [x] Test infra built: `playwright.config.ts` + `scripts/serve-fixtures.mjs`, `@axe-core/playwright`
      added, `pnpm test` runs. (Done 2026-07-03; fixture model proven — dialog spec green on Chromium.)
- [x] Fixture model decided + proven (§4.3): isolated same-origin fixtures, real browser.
      `tests/fixtures/dialog.html` + `tests/keyboard/dialog.spec.ts` (3 keyboard tests green).
- [x] A fixture + axe spec for every component; axe green. **Tier-1** (dialog, drawer, popover, menu,
      select, tabs — axe inside each keyboard spec) **and all 31 static-only** components
      (`tests/a11y/static.spec.ts`) are axe-green on Chromium + Firefox + WebKit. The intent-contrast
      item is resolved (§6.5).
- [ ] Optional: axe pass over the built Meridian pages (realism supplement, §4.5).
- [x] Tier-1 keyboard specs (dialog, drawer, popover, menu, select, tabs) pass on **Chromium**
      (`pnpm test:rc` → 27 passed, 2026-07-04).
- [x] Every real bug the **Tier-1** specs surfaced is fixed in `packages/vanilla/src/components/*` (the
      select accessible-name/combobox fix, §6.5 — not papered over in the test).
- [ ] `beta.11` peer-dep fix folded in; `notes` entry deleted.
- [ ] `pnpm build:packages` + `pnpm smoke` + `pnpm check` still green.
- [ ] Version bumped to `3.0.0-rc.1`; maintainer publishes.
- [ ] API declared frozen (this doc + CHANGELOG note).

### Stable gate — `3.0.0` (all must be ✅, on top of RC)
- [~] Tier-1 **and** Tier-2 keyboard specs pass on **Chromium + Firefox + WebKit**. **Tier-1 done**
      (79 passed / 2 skipped, 2026-07-04 — the skips are the WebKit focus-trap Full-Keyboard-Access
      artifact, §6.5). Tier-2 not yet written.
- [ ] Human VoiceOver pass done, issues fixed (§6.2).
- [ ] Real-Safari spot check done (§6.3).
- [ ] Reduced-motion + 200% zoom sanity done (§6.4).
- [ ] API held unchanged for the entire RC window — no token/class/modifier rename since `rc.1`.
- [ ] No open Tier-1 a11y bug.
- [ ] Maintainer promotes `3.0.0`; `v3` merged to `master`.

---

## 8. Execution order (do this, in order)

Steps 1–2 are **DONE** (2026-07-03): infra built, fixture model decided + proven on dialog.

1. ✅ Deps + `playwright.config.ts` + `scripts/serve-fixtures.mjs` + `test` scripts. `pnpm test` runs.
2. ✅ Fixture model proven: `tests/fixtures/dialog.html` + `tests/keyboard/dialog.spec.ts`
   (3 keyboard tests green; axe test parked on the contrast finding — §6.5).
3. ✅ (2026-07-04) The remaining five Tier-1 fixtures + keyboard specs (drawer, popover, menu, select,
   tabs), copying the dialog shape (§4.4/§4.6/§5). Green on Chromium; the select real bug fixed in JS.
4. ✅ (2026-07-04) Axe per fixture. Tier-1: folded into each keyboard spec as a "static a11y" test.
   Static-only: 31 fixtures + data-driven `tests/a11y/static.spec.ts`, all axe-green on all three
   browsers. Findings triaged/fixed (§6.5). **RC axe gate met.**
5. (Optional) `tests/a11y/axe-template.spec.ts` over the built Meridian pages for realism (§4.5).
6. Fold in the peer-dep fix; re-run `build:packages`/`smoke`/`check`. Bump to `rc.1`.
   **→ hand to maintainer to publish. RC gate met.**
7. Add Tier-2 fixtures + specs. Run the full suite across all three browser projects; fix Firefox/
   WebKit-only failures.
8. Hand to maintainer for the VoiceOver + Safari + reduced-motion passes (§6).
9. Fix what the human passes surface. Hold the API. When §7 Stable is all ✅ →
   **maintainer promotes `3.0.0` + merges `v3` → `master`.**

---

## 9. Open questions with pre-made fallbacks (don't stall on these)

- **Why not test the docs demos directly?** → Settled in §4.3: isolated fixtures are the industry
  norm (Bootstrap/Radix/Base UI/React Aria all do per-component fixtures, not docs-scanning), and
  same-origin fixtures dodge the docs' sandboxed-iframe axe-injection problem entirely. The docs
  demos stay as user-facing proof; they are not the test surface.
- **Fixtures reference `dist/` which is gitignored — CI has nothing to link?** → `pnpm build:packages`
  is a test prereq (documented in `serve-fixtures.mjs` + §4.3). A CI job runs it before `pnpm test`.
- **`@playwright/test` version skew vs the installed `playwright@1.61`?** → Pin `@playwright/test`
  to the same minor. They must match or the runner errors.
- **A Tier-1 component fails a contract deep in the JS?** → That is the point of this gate. Fix it;
  it's an RC blocker. If a fix is large, it's still a blocker — RC means the a11y contract holds.
- **combobox/autocomplete a11y is limited by Tom Select?** → Document the limitation in the
  component's spec/docs as a known third-party constraint; it does NOT block RC (it's Tier 2), but
  note it so it isn't mistaken for a Stisla bug.
- **Port already taken (5273)?** → `--strictPort` makes vite fail loud rather than hop. Kill the
  stray listener (`lsof -nP -iTCP:5273 -sTCP:LISTEN -t | xargs kill`) or change the port in all
  three spots in `playwright.config.ts` (command `--port`, `webServer.url`, `use.baseURL`). Do NOT
  switch back to `pnpm dev`/3001 — it hops ports and binds IPv6-only (see §1/§4.2).
```
