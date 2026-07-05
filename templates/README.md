# Stisla templates — maintainer guide

How the template system works end to end: **developing → building → deploying**.

This is the pipeline doc for maintainers. It is **not** the doc site, and it is
not the README that ships inside a template's download (that one —
`meridian/html/README.md` — is written for the person who unzips the starter).

---

## What's here

```
templates/
  deploy.mjs              # builds every template + assembles + deploys to Cloudflare Pages
  dist-site/              # assembled deploy folder (gitignored build artifact)
  meridian/
    html/                 # the Meridian template (Nunjucks → static HTML)
      pages/*.njk         # one file per page (index = the Dashboard screen)
      _partials/*.njk     # sidebar, topbar
      layouts/*.njk       # app / auth / error page shells
      assets/css/app.css  # the single CSS compile unit (Tailwind entry)
      assets/css/meridian/ # the template's own component styles (imported by app.css)
      assets/js/*.js       # plain, no-build scripts (charts, theme, drawer, forms)
      nunjucks.mjs        # dev-server middleware + the `icon` filter + env factory
      build.mjs           # the zip build (render pages, compile CSS, pack)
      vite.config.js      # dev server (Tailwind + the nunjucks middleware)
      package.json        # @stisla-template/meridian-html (private, workspace pkg)
```

Each template is a workspace package under `templates/*/*` (see
`pnpm-workspace.yaml`). It consumes the framework through **bare specifiers**
(`@stisla/style`, `@stisla/vanilla`) that resolve to the workspace packages via
`node_modules` — exactly how a real consumer imports Stisla.

### One naming rule

A template is named by its **name**, not its kind. Meridian's identity is
`meridian` everywhere: the folder, the URL path `/meridian/`, the zip
`meridian.zip`, the package `@stisla-template/meridian-html`, the CSS folder
`assets/css/meridian/`.

The one exception is the word "Dashboard" where it means the **overview page** —
`pages/index.njk`, its sidebar label, and its `nav_active == "dashboard"` token.
That's a screen inside the product, not the product's identity, so it stays. Using
"dashboard" as a generic kind-word in prose is fine ("a Stisla dashboard template").

---

## Prerequisites

Once, from the repo root:

```bash
pnpm install
```

This links the workspace packages into every template's `node_modules`. The
templates build against `@stisla/style` source, so no package build is needed
first — but if you've never built the framework, `pnpm build:packages` doesn't
hurt.

---

## Developing

Run the dev server from the template folder:

```bash
cd templates/meridian/html
pnpm dev            # vite → http://localhost:5173
```

- **Routing.** `nunjucks.mjs` is a Vite middleware. A request for
  `/meridian/orders.html` (or `/meridian/orders`, or `/meridian/`) renders
  `pages/orders.njk` (or `pages/index.njk`). The `.html` links written for the
  zip resolve in dev too.
- **HMR.** Editing any `.njk` triggers a full reload; CSS/JS hot-update through
  Vite. The framework loads from workspace **source**, so changes to
  `@stisla/style` show up live.
- **`dev` flag.** The Nunjucks env has a `dev` global. `dev: true` (this server)
  wires the framework from source and loads vendors for HMR; `dev: false` (the
  build) switches the layout to CDN vendors + the compiled `style.css`. A page
  renders identically either way — only the asset wiring flips.
- **Icons.** Solar icons are inlined at build time via the `| icon` filter
  (`{{ "solar:bag-4-linear" | icon }}` → an inline `<svg>`). No icon font, no
  runtime fetch.

### Two layers, two rules

| Layer | Build step? | Why |
|---|---|---|
| **CSS** | Yes — Tailwind compiles it | `app.css` imports the theme + components + the `meridian/` styles, and Tailwind must scan the markup to generate utilities. |
| **JS** | No | `assets/js/*.js` are plain scripts loaded with `<script>`. Edit in place, reload. Vendors (`@stisla/vanilla`, ApexCharts) come from a CDN in the shipped zip. |

---

## Building

From the template folder:

```bash
pnpm build          # → node build.mjs
```

`build.mjs` (see its header comment for the full manifest):

1. Renders every `pages/*.njk` to static HTML (`dev: false` branch).
2. Compiles `app.css` → one minified `assets/css/style.css` via the Tailwind CLI.
3. Copies the JS verbatim, and ships the CSS **source** (`app.css` +
   `meridian/`) so the download can be recustomized.
4. Packs everything into a single **`meridian/`** folder and zips it to
   `dist/meridian.zip`. The rendered folder is left at `dist/meridian/` for
   inspection.

### The mount-folder convention

The output folder is named **`meridian`** because the template's nav links are
**absolute** (`/meridian/orders.html`). Drop the `meridian/` folder at a web
root and every link resolves. This is why the folder name, the URL path, and the
`mount` value in `deploy.mjs` must all match: they're the same string.

---

## Deploying

Templates are hosted on their **own** Cloudflare Pages project, separate from the
docs site — see the rationale below. Everything goes through one script:

```bash
node templates/deploy.mjs          # build every template, assemble, deploy
node templates/deploy.mjs --dry    # build + assemble only (no upload)
```

`deploy.mjs` builds each template, gathers the outputs into `dist-site/` (each
template at its mount path, its zip alongside, plus a root `index.html` that
redirects `/` to the docs templates gallery), then runs
`wrangler pages deploy` as a **direct upload** — Cloudflare builds nothing.

### Live layout

```
stisla-templates.pages.dev/
  index.html                     → redirects to stisla.dev/templates
  meridian/                      → the template pages + assets
  meridian/meridian.zip          → the download
```

Unmatched paths fall through to the root redirect (Pages serves the root
`index.html` for 404s), so stale links land on the gallery rather than a hard 404.

### First-time Cloudflare setup (once per machine / project)

```bash
pnpm dlx wrangler login                                              # global, one time
pnpm dlx wrangler pages project create stisla-templates \
  --production-branch main                                          # once, if the project doesn't exist
```

### Gotchas baked into `deploy.mjs`

- **`--branch main` is mandatory.** This repo works on the `v3` branch. Without
  forcing the production branch, Wrangler infers `v3` and the deploy lands on a
  `v3.stisla-templates.pages.dev` **preview alias**, leaving production empty.
- **`--commit-dirty=true`** silences the uncommitted-changes warning — the deploy
  dir is a build artifact, so a dirty tree is expected.
- **HTML edge cache is 7 days** (`s-maxage`). When you rename a path, the old URL
  can serve stale for up to a week; it self-heals as nothing links to it.
  Compiled CSS is served `must-revalidate`, so it updates immediately.

### Config to know (top of `deploy.mjs`)

- `PROJECT` — the Cloudflare Pages project name (`stisla-templates`).
- `DOCS_URL` — where `/` redirects (`https://stisla.dev/templates`).

---

## How the docs site references a template

The docs template page (`docs/src/data/templates/meridian.tsx`) is **decoupled**
from hosting:

- `previewUrl` / `downloadUrl` are absolute cross-origin URLs into the templates
  deploy (`…/meridian/` and `…/meridian/meridian.zip`).
- The hero shows a **static poster** (`docs/public/templates/meridian/preview.png`,
  a committed screenshot), not a live iframe — so nothing in docs is coupled to
  where or how the template is hosted.

Docs does not build, copy, or host any template output.

### Why templates are a separate deploy

The build is monorepo-coupled (it needs the pnpm workspace + `@stisla/style`), so
a Cloudflare git-build would have to check out and install the whole repo. The
**output** is pure static, so we build locally and direct-upload the result. That
also lets the docs site stop hosting templates entirely.

---

## Adding a new template

1. Scaffold `templates/<name>/html/` with the same shape as `meridian/html/`
   (workspace package, `build.mjs`, `nunjucks.mjs`, `vite.config.js`).
2. Make its nav links absolute under `/<name>/` — the mount folder, URL path, and
   `deploy.mjs` `mount` value must all be `<name>`.
3. Have `build.mjs` output `dist/<name>/` and `dist/<name>.zip`.
4. Add an entry to the `TEMPLATES` array in `deploy.mjs`
   (`{ slug, dir, mount, zip }`).
5. Add its metadata file under `docs/src/data/templates/` and register it in that
   folder's `index.ts`; capture a poster screenshot into `docs/public/templates/<name>/`.
6. `node templates/deploy.mjs` and verify the new `/<name>/` URLs.
