// Generate the Stisla brand asset set from the logomark.
//
// The mark is the rounded-square "S" first shipped as the docs favicon
// (docs/src/routes/__root.tsx). It is monochrome, so it can't adapt to the page
// on its own once rasterized — hence explicit light and dark variants:
//
//   logo-light  → dark tile  (#0a0a0a) + light mark (#fafafa)  → sits on LIGHT backgrounds
//   logo-dark   → light tile (#fafafa) + dark mark  (#0a0a0a)  → sits on DARK backgrounds
//
// Output: brand/logo.svg (adaptive canonical), brand/logo-{light,dark}.svg (fixed),
// and brand/png/logo-{light,dark}-{128,256,512,1024}.png (transparent outside the tile).
//
// Run: node scripts/generate-brand.mjs

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = join(ROOT, "brand");
const PNG = join(BRAND, "png");

const INK = "#0a0a0a";
const PAPER = "#fafafa";
const SIZES = [128, 256, 512, 1024];

// The mark geometry, on a 512x512 canvas. `tile` fills the rounded square;
// `mark` strokes the S. Colors are swapped between the two variants.
const mark = (size, tile, stroke) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">` +
  `<rect width="512" height="512" rx="112" fill="${tile}"/>` +
  `<path d="M 392 144 H 200 A 56 56 0 0 0 200 256 H 312 A 56 56 0 0 1 312 368 H 120" ` +
  `fill="none" stroke="${stroke}" stroke-width="76" stroke-linecap="round" stroke-linejoin="round"/>` +
  `</svg>`;

// Adaptive canonical: one file that flips with the OS color scheme (same as the favicon).
const adaptive =
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
  `<style>.t{fill:${INK}}.m{stroke:${PAPER}}` +
  `@media (prefers-color-scheme:dark){.t{fill:${PAPER}}.m{stroke:${INK}}}</style>` +
  `<rect class="t" width="512" height="512" rx="112"/>` +
  `<path class="m" d="M 392 144 H 200 A 56 56 0 0 0 200 256 H 312 A 56 56 0 0 1 312 368 H 120" ` +
  `fill="none" stroke-width="76" stroke-linecap="round" stroke-linejoin="round"/>` +
  `</svg>`;

const variants = {
  light: mark(512, INK, PAPER),
  dark: mark(512, PAPER, INK),
};

await mkdir(PNG, { recursive: true });
await writeFile(join(BRAND, "logo.svg"), adaptive + "\n");

let count = 0;
for (const [name, svg] of Object.entries(variants)) {
  await writeFile(join(BRAND, `logo-${name}.svg`), svg + "\n");
  for (const size of SIZES) {
    const buf = Buffer.from(mark(size, ...(name === "light" ? [INK, PAPER] : [PAPER, INK])));
    await sharp(buf, { density: 384 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(PNG, `logo-${name}-${size}.png`));
    count++;
  }
}

console.log(`Wrote brand/logo.svg, 2 fixed SVGs, and ${count} PNGs to brand/`);
