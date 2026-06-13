# cdn-html

No build, no package manager. Plain HTML pulling Stisla from jsDelivr.

## What this tests

- The CDN-published `dist/stisla.css` and `dist/stisla.js` URLs exist and serve
  the right content type
- The vanilla bundle works as a `<script type="module">` with an `importmap`
  for its peer ESM deps (`@floating-ui/dom`, `focus-trap`, `tabbable`)
- Auto-init runs on `DOMContentLoaded` (no manual `Stisla.init()` call)

## Run

Open `index.html` directly in a browser, or:

```bash
npx serve .
```

Click the dialog and dropdown triggers. If they open, close, trap focus, and
dismiss on `Escape`, the bundle is wired up.

## Notes

- The `<link>` and `<script>` URLs pin `@3.0.0-beta.1` so the example doesn't
  drift when a new beta lands. Switch to `@3` once 3.0.0 is stable.
- Lucide is loaded for the icons — Stisla doesn't depend on it.
