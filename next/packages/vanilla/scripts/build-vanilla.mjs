// @stisla/vanilla build — CDN IIFE bundles (deps inlined, minified). Role-named outputs:
//   stisla.js (core) · stisla-full.js (core + 3 optionals) · carousel.js / combobox.js /
//   scroll-area.js (add-ons). ESM consumers import the raw src/ entries (deps resolved from
//   node_modules); these dist files are the drop-in <script src> artifacts.
import * as esbuild from "esbuild";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const pkg = dirname(dirname(fileURLToPath(import.meta.url))); // packages/vanilla
const src = join(pkg, "src");
const dist = join(pkg, "dist");

// esbuild has no `?raw` loader (Vite-ism). scroll-area inlines OverlayScrollbars' base CSS as raw
// text; resolve the bare specifier, then re-emit its text as a default-exported string. (Mirrors
// docs/vite.config.ts.)
const rawQueryPlugin = {
  name: "raw-query",
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, async (args) => {
      const resolved = await build.resolve(args.path.replace(/\?raw$/, ""), {
        kind: args.kind,
        resolveDir: args.resolveDir,
        importer: args.importer,
      });
      if (resolved.errors.length) return { errors: resolved.errors };
      return { path: resolved.path, namespace: "raw-query" };
    });
    build.onLoad({ filter: /.*/, namespace: "raw-query" }, async (args) => ({
      contents: `export default ${JSON.stringify(await readFile(args.path, "utf8"))};`,
      loader: "js",
    }));
  },
};

const entries = {
  stisla: "index.js",
  "stisla-full": "index-full.js",
  carousel: "carousel.js",
  combobox: "combobox.js",
  "scroll-area": "scroll-area.js",
};

await esbuild.build({
  entryPoints: Object.fromEntries(
    Object.entries(entries).map(([out, file]) => [out, join(src, file)]),
  ),
  outdir: dist,
  bundle: true,
  format: "iife",
  minify: true,
  legalComments: "none",
  target: ["es2022"],
  // import.meta.env is a Vite-ism the core uses for dev-only logging; in a production CDN IIFE
  // it should be off. Define it so DEV is explicitly false and esbuild doesn't warn.
  define: { "import.meta.env": '{"DEV":false,"PROD":true}' },
  // The core guards dev logging with `typeof import.meta !== 'undefined'`; in IIFE that's a
  // deliberate no-op, so silence esbuild's expected empty-import-meta notice.
  logOverride: { "empty-import-meta": "silent" },
  plugins: [rawQueryPlugin],
  logLevel: "warning",
});

console.log("build-vanilla: 5 IIFE bundles → dist/ (stisla, stisla-full, carousel, combobox, scroll-area).js");
