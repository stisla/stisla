# Stisla brand assets

The Stisla logomark: a rounded square with a stroked "S". It is monochrome, so
raster files come in two variants. Pick by the background you're placing it on.

| File                    | Tile          | Mark          | Use on            |
| ----------------------- | ------------- | ------------- | ----------------- |
| `logo-light.*`          | dark `#0a0a0a`| light `#fafafa`| **light** backgrounds |
| `logo-dark.*`           | light `#fafafa`| dark `#0a0a0a` | **dark** backgrounds  |
| `logo.svg`              | adaptive       | adaptive       | anywhere (flips with the OS color scheme) |

## Files

- `logo.svg` — canonical, adaptive. Flips tile/mark with `prefers-color-scheme`.
  Prefer this on the web when the surface can be either theme.
- `logo-light.svg`, `logo-dark.svg` — fixed-color vectors. Use where an adaptive
  SVG isn't wanted (print, embedding, a known-fixed surface).
- `png/logo-{light,dark}-{128,256,512,1024}.png` — raster fallbacks with a
  transparent background outside the rounded tile.

## Regenerating

All files are produced from one script (edit the geometry or colors there, never
hand-edit the outputs):

```bash
node scripts/generate-brand.mjs   # or: pnpm brand
```
