# Contributing to Stisla

Thanks for helping improve Stisla. This file covers the mechanics: setup, the
branch and PR flow, and how releases work. For how to actually author a component
(writing the CSS, the behavior layer, the docs page, and customization variables),
follow the in-depth guide at **https://stisla.dev/docs/contributing**.

## Prerequisites

- **Node 24** or newer
- **pnpm 10.30.3** — pinned via the `packageManager` field. Run `corepack enable`
  once and pnpm will match the pinned version automatically.

## Getting started

```bash
git clone https://github.com/stisla/stisla.git
cd stisla
pnpm install
pnpm dev          # docs site at http://localhost:5173
```

CSS rebuilds on save via Tailwind's HMR; the vanilla behavior bundle hot-reloads
into the demo iframes automatically.

## Repo layout

| Path                | Package / role                                                        |
| ------------------- | -------------------------------------------------------------------- |
| `packages/style`    | `@stisla/style` — the `@theme` foundation, per-component CSS, composer |
| `packages/css`      | `@stisla/css` — precompiled zero-build bundle you can `<link>`         |
| `packages/vanilla`  | `@stisla/vanilla` — no-build JavaScript behavior layer                 |
| `packages/react`    | `@stisla/react` — Base UI wrappers (example-only, not published)       |
| `docs/`             | TanStack Start docs site (stisla.dev)                                  |
| `templates/`        | the Meridian dashboard template                                       |
| `spec/`             | cross-implementation component contracts                              |

Architecture and rationale live in `ARCHITECTURE.md`; the cross-impl contract is
`SPEC.md`.

## Commands

Every script lives in the root `package.json`. Run them from the repo root.

**Everyday**

| Command                | What it does / when you need it                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `pnpm dev`             | Docs dev server (Vite, port 5173). Your main loop; CSS and the behavior bundle hot-reload.      |
| `pnpm scaffold <name>` | Creates the files for a new component (CSS skeleton, docs page, nav entry). Start a port with it.|
| `pnpm build`           | Builds every workspace (packages + docs). Full local build.                                     |
| `pnpm build:packages`  | Builds just the publishable packages into `dist/`. Needed before tests and before publishing.   |

**Quality and tests**

| Command       | What it does / when you need it                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------- |
| `pnpm check`  | Token guardrail linter (no `--bs-*`, no stray `--st-*`, no `is-*` classes, etc.). Run before every PR.|
| `pnpm test`   | Full Playwright a11y + keyboard suite across all 3 browsers. Rebuilds packages first.                |
| `pnpm test:rc`| Same suite, Chromium only — the fast loop. See [`TESTING.md`](TESTING.md) for all the test commands.  |

Testing is covered in depth in [`TESTING.md`](TESTING.md): what is tested, every
`test:*` command, and how to add a test for a component.

**Maintainer**

| Command          | What it does / when you need it                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| `pnpm changeset` | Records a version-bump intent for a change (see [Writing a changeset](#writing-a-changeset)). Contributors run this too. |
| `pnpm smoke`     | Dry-run `npm pack` for each package; asserts every `exports` target is actually in the tarball.          |
| `pnpm brand`     | Regenerates the logo assets in `brand/` from the logomark. Run only when the mark changes.               |
| `pnpm release`   | Local publish fallback: `build:packages && smoke && changeset publish`. Normally CI publishes, not you.  |

## Shipping a change

A worked example: nudging the button's padding.

1. **Branch** off `master`.
2. **Edit** the component. A padding or color tweak lives in the CSS, here
   `packages/style/src/button/button.css`. Keep a PR to one component where you can.
3. **Build and test**: `pnpm build:packages`, then `pnpm test:rc` (fast Chromium loop;
   `pnpm test` covers all browsers). Run `pnpm check` too. See [`TESTING.md`](TESTING.md).
4. **Record it with a changeset**: `pnpm changeset` (details below). Commit the file it
   writes together with your code.
5. **Open a PR** into `master` and merge it. CI builds the docs as a required check.

Your edit-and-test loop is the same as always. The one new habit is step 4: a changeset
replaces hand-editing version numbers. You never touch a `version` field yourself, and
you never publish from your laptop — that all happens in [Releasing](#releasing).

### Writing a changeset

`pnpm changeset` is interactive and asks two things:

**Which packages?** Pick by the folder you edited:

- component CSS (`packages/style/src/…`) → `@stisla/style` **and** `@stisla/css`
- component JS behavior (`packages/vanilla/src/…`) → `@stisla/vanilla`
- both → all three

**How big a bump?** Semver, and with the API frozen it's almost always patch:

- **patch** — visual tweak, bug fix (`3.0.0` → `3.0.1`)
- **minor** — new component, variant, or option (`3.0.0` → `3.1.0`)
- **major** — a breaking rename or removal (`3.0.0` → `4.0.0`)

Then type a one-line summary; it becomes the changelog and GitHub Release note. This
writes a small file under `.changeset/` — commit it with your change. Docs-only,
template-only, and internal changes need no changeset.

## Releasing

Publishing is automated. You never run `npm publish` or edit version numbers; a change
reaches npm after **two merges**:

1. When a PR carrying changesets lands on `master`, the release workflow opens a
   **Version Packages** PR that turns those notes into real version bumps and changelog
   entries. (Nothing is published yet.)
2. Merge that PR when you're ready to ship. It publishes to npm and creates the git tags
   and GitHub Releases.

Publishing uses **npm Trusted Publishing (OIDC)**, so no npm token is stored in the repo:
each published package has a one-time Trusted Publisher on npmjs.com pointing at repo
`stisla/stisla`, workflow `release.yml`. Full mechanics and one-time setup are in
[`RELEASE-CHECKLIST.md`](RELEASE-CHECKLIST.md).

## Code of conduct

By participating you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).
