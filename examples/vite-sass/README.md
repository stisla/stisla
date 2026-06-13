# vite-sass

Vite consumer compiling a **custom Stisla bundle from the Sass source**, then
overriding tokens at runtime via CSS.

## What this tests

- The `@stisla/css/scss/*` exports map subpath resolves to the shipped Sass
  tree (Vite + sass need to find `@stisla/css/scss/tokens/breakpoints`,
  `@stisla/css/scss/components/btn`, etc.)
- The bundle compiles when a downstream project picks a subset of components
- Token overrides applied after the bundle (`--st-primary`, `--st-radius`)
  propagate to every component via `var()`
- The vanilla bundle still wires up against a stripped-down CSS bundle
  (no card / accordion / tabs styles shipped)

## Run

```bash
npm install
npm run dev
```

Look for:

- Primary buttons render **green** (not the default blue)
- Buttons have **sharper corners** (--st-radius: 0.375rem instead of 0.75rem)
- Dialog and dropdown still behave correctly

## Why someone would do this

The default `@stisla/css` bundle ships ~24 KB gz of CSS — every component.
Apps that only use three components can trim by forking the bundle entrypoint
and pulling in just what they render. The shipped Sass tree exports per-file
so this works without forking the package.

Token overrides (`--st-*`) are the runtime customization API — no Sass
required. They live in `src/styles/overrides.css` here.

## A note on Sass warnings

Stisla's Sass tree still uses `@import` (it'll migrate to `@use` ahead of
Dart Sass 3.0). To keep the dev console quiet, `vite.config.mjs` sets
`silenceDeprecations: ['import']`. Drop that key once Stisla source is
on `@use`.
