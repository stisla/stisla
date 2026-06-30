import { defineConfig } from "tsup";

// @stisla/style — pure-JS composer + per-component configs. ESM + .d.ts only.
// Component CSS is copied verbatim (raw, Tailwind-dependent) by scripts/copy-css.mjs;
// theme.css ships straight from src/ via the package exports.
export default defineConfig({
  entry: {
    index: "src/index.ts",
    "button/index": "src/button/config.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  outDir: "dist",
});
