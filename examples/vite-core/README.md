# vite-core

Vite consumer importing Stisla's **core** bundles from npm.

## What this tests

- `@stisla/css` and `@stisla/vanilla` install cleanly from npm at
  `3.0.0-beta.1` with no peer-dep warnings
- The bare `import '@stisla/css'` + `import '@stisla/vanilla'` entry points
  resolve via the `exports` map
- Pre-compiled `dist/stisla.{css,js}` chunks load without extra Vite config
- Auto-scan runs on `DOMContentLoaded` after the bundle initializes

This is the **default path** for app authors. If this example fails, the
publish pipeline is broken.

## Run

```bash
npm install
npm run dev
```

Open the printed URL. Click the dialog and dropdown triggers — they should
open, trap focus, and dismiss on `Escape`.
