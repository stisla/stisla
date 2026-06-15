# vite-full

Vite consumer importing Stisla's **full** bundles (vanilla core + every
optional component).

## What this tests

- The `/full` exports map subpath resolves on both packages
- Optional component CSS chunks (`dist/components/carousel.css`) load
- Optional component JS chunks (`dist/components/carousel.js`) self-register
  on the global `Stisla` instance and the auto-scanner picks them up
- The Embla peer dependency that ships with `@stisla/vanilla` resolves through
  Vite without extra config

## Run

```bash
npm install
npm run dev
```

A working carousel (draggable, prev/next chips) proves the optional loaded.

## When to use the /full subpath in your own app

Reach for `/full` when you don't care about a few extra KB of unused
optional CSS and you want every component available with one import. For
shipping production apps, prefer importing core + the specific optional
components you use (see the `vite-core` example for the core pattern; à
la carte optionals follow the same shape as
`import 'X/components/carousel'`).
