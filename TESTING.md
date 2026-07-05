# Testing

Stisla's test suite is [Playwright](https://playwright.dev). It checks two things,
and only two: **accessibility** (via [axe](https://github.com/dequelabs/axe-core))
and **keyboard behavior**. There are no unit tests. Components are verified the way a
user meets them: rendered in a real browser and driven by the keyboard.

Tests run against **isolated fixtures**, not the docs site. Each component has a
small standalone HTML page under `tests/fixtures/` that links the built bundles. This
keeps a failure pointed at the component, not at the docs app around it.

## Prerequisites

Two one-time / per-change setup steps:

```bash
npx playwright install     # once — download the browser binaries
pnpm build:packages        # produces dist/, which the fixtures link (it's gitignored)
```

The build step matters: fixtures load `/packages/*/dist/…` over a local server, so a
stale or missing `dist/` tests the wrong thing. `pnpm test` rebuilds automatically
(via a `pretest` hook); the narrower `test:*` scripts below do **not**, so build first
when you use them.

## Commands

| Command          | Runs                                                   | When to use                                                        |
| ---------------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| `pnpm test`      | Whole suite, **all 3 browsers**. Rebuilds first.       | The full gate. Before a release, or to verify a change end to end. |
| `pnpm test:rc`   | Whole suite, **Chromium only**.                        | The fast local loop. Same coverage, one browser.                   |
| `pnpm test:kbd`  | Keyboard specs only, Chromium.                         | Iterating on interactive / focus behavior.                         |
| `pnpm test:a11y` | Accessibility specs only, Chromium.                    | Iterating on axe or contrast.                                      |
| `pnpm test:ui`   | Playwright UI mode (watch, time-travel, all browsers). | Debugging a failing test interactively.                            |

After any run, open the full report with `npx playwright show-report`. You can also
target one file or test the usual Playwright way, for example
`pnpm test:rc dialog` or `npx playwright test tests/keyboard/dialog.spec.ts`.

Remember: only `pnpm test` rebuilds packages. For `test:rc` / `test:kbd` / `test:a11y`,
run `pnpm build:packages` yourself after editing anything under `packages/*`.

## Browsers, and the RC vs Stable gate

Three browser projects are defined: `chromium`, `firefox`, and `webkit` (a Safari
proxy). The `rc` / `stable` naming maps to **how many browsers**, not to which
components:

- **`pnpm test:rc`** runs on **Chromium only**. It is the release-candidate gate and
  the everyday loop: fastest signal, still the entire suite.
- **`pnpm test`** runs on **all three browsers**. It is the stable gate. Cross-browser
  differences (especially WebKit focus behavior) only show up here.

There is no script that filters to a subset of components. Every tier's specs run in
both; the only axis these scripts change is browser coverage.

Some focus-trap assertions `test.skip` on WebKit. That is expected: it reflects
macOS "Full Keyboard Access" being off by default, not a bug. The real Safari pass is
a manual step in `RELEASE-CHECKLIST.md`.

## How it's wired

- **`playwright.config.ts`** — `testDir: tests/`, three browser projects, `retries: 1`
  in CI (0 locally), `trace: "on-first-retry"`, reporters `list` + `html`.
- **`webServer`** — Playwright starts `node scripts/serve-fixtures.mjs`, a tiny static
  server of the **repo root** on `http://127.0.0.1:5273`, and reuses one that's already
  running. Serving the repo root is what lets a fixture reference the built bundles
  same-origin (`/packages/css/dist/stisla.css`, `/packages/vanilla/dist/stisla.js`) so
  axe can inject cleanly. You don't start this server by hand; the runner manages it.

## Layout

```
tests/
  keyboard/<name>.spec.ts   one per interactive component (19): the keyboard contract.
                            Tier-1 specs also assert "no axe violations, closed + open".
  a11y/
    static.spec.ts          axe scan over ~31 non-interactive components (data-driven).
    contrast.spec.ts        color-contrast gate, light AND dark, over intents.html.
  fixtures/<name>.html      one isolated page per component (~51), lifted from the
                            matching docs/src/routes/docs/vanilla/<name> page.
    _fixture.css            shared fixture styling.
    intents.html            aggregate page used by contrast.spec.ts.
  helpers/axe.ts            expectNoA11yViolations(page) — wraps axe with the WCAG tags.
```

Interactive components are axe-scanned inside their own keyboard spec; `static.spec.ts`
covers the non-interactive ones. So every shipped component is checked exactly once.

## Adding a test for a component

1. **Fixture.** Create `tests/fixtures/<name>.html`. Copy the markup from the
   component's docs page (`docs/src/routes/docs/vanilla/<name>.tsx`), link
   `_fixture.css` plus the built CSS/JS bundles. `pnpm scaffold` does not make this for
   you yet, so base it on an existing fixture.
2. **Static component** (no JS): add its name to the `STATIC_COMPONENTS` array in
   `tests/a11y/static.spec.ts`. That's the whole test.
3. **Interactive component**: add `tests/keyboard/<name>.spec.ts`. Assert the keyboard
   contract (open key, focus moves to the right element, focus is trapped where it
   should be, Escape closes, focus returns to the trigger), reading state from the
   `data-state="open|closed"` / `data-state="active"` attributes the behavior layer
   writes. Include an inline axe check in both the closed and open states. Copy the
   nearest existing spec as a template (`dialog.spec.ts` is a good one).
4. **Run it**: `pnpm build:packages` then `pnpm test:kbd` (or `test:a11y`), and
   `pnpm test` once before you open the PR to confirm it holds cross-browser.

## Related: token contrast audit

`node scripts/contrast-audit.mjs` is the static sibling of `contrast.spec.ts`. It reads
the `--color-*` oklch tokens from `packages/style/src/theme.css`, computes WCAG ratios
in pure math (no browser), and fails if an intent fill or text-on-surface pair drops
below 4.5:1. Run it after editing theme tokens for a fast check; `contrast.spec.ts` is
the authoritative browser-measured gate.

## CI

Tests currently run locally and as the pre-release gate (`RELEASE-CHECKLIST.md`); the
CI workflows build and deploy the docs but do not yet run Playwright. Run `pnpm test`
before opening or merging a PR that touches a published package.
