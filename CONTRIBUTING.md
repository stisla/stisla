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
| `pnpm changeset` | Records a version-bump intent for a change (see [Changesets](#changesets)). Contributors run this too.   |
| `pnpm smoke`     | Dry-run `npm pack` for each package; asserts every `exports` target is actually in the tarball.          |
| `pnpm brand`     | Regenerates the logo assets in `brand/` from the logomark. Run only when the mark changes.               |
| `pnpm release`   | Local publish fallback: `build:packages && smoke && changeset publish`. Normally CI publishes, not you.  |

## Making a change

1. Branch off `master`.
2. Make your change. Keep it to one component per PR where you can.
3. Run `pnpm check`, and `pnpm build` from `docs/`, and confirm both are clean.
4. If you changed a component's CSS or behavior, run `pnpm test` (or `pnpm test:rc`
   for a fast Chromium-only loop). See [`TESTING.md`](TESTING.md).
5. Add a changeset if you touched a published package (see below).
6. Open a PR into `master`. CI builds the docs as a required check.

## Changesets

Versioning and publishing run on [Changesets](https://github.com/changesets/changesets).
If your change affects any published package (`@stisla/style`, `@stisla/css`,
`@stisla/vanilla`), record it:

```bash
pnpm changeset
```

Pick the affected packages, choose a bump (patch / minor / major), and write a
one-line summary. This writes a file under `.changeset/` — commit it alongside your
change. Docs-only, template-only, and internal changes do not need one.

Each package is versioned independently. Changesets computes dependent bumps for
you: a change to `@stisla/style`, for example, also patches `@stisla/css` because it
depends on it.

## Releases (maintainers)

Releases are automated by `.github/workflows/release.yml`; `RELEASE-CHECKLIST.md`
tracks the human steps for a stable cut.

- Merging changesets into `master` opens a **Version Packages** PR that applies the
  bumps and updates the changelogs.
- Merging that PR publishes to npm and creates the matching git tags and GitHub
  Releases automatically.
- Publishing uses **npm Trusted Publishing (OIDC)**, so no npm token is stored in
  the repo. Each package needs a one-time Trusted Publisher configured on npmjs.com
  (organization `stisla`, repository `stisla/stisla`, workflow `release.yml`) under
  the package's **Settings → Trusted Publisher**.

## Code of conduct

By participating you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).
