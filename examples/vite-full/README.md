# vite-full

Vite consumer importing Stisla's **full** bundles (core + every integration).

## What this tests

- The `/full` exports map subpath resolves on both packages
- Integration CSS chunks (`dist/integrations/carousel.css`) load
- Integration JS chunks (`dist/integrations/carousel.js`) self-register on the
  global `Stisla` instance and the auto-scanner picks them up
- The Embla peer dependency that ships with `@stisla/vanilla` resolves through
  Vite without extra config

## Run

```bash
npm install
npm run dev
```

A working carousel (draggable, prev/next chips) proves the integration loaded.

## When to use the /full subpath in your own app

Reach for `/full` when you don't care about a few extra KB of unused
integration CSS and you want every component available with one import. For
shipping production apps, prefer importing core + the specific integrations
you use (see the `vite-core` example for the core pattern; à la carte
integrations follow the same shape as `import 'X/integrations/carousel'`).
