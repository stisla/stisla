import { defineConfig, type Plugin } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin as EsbuildPlugin } from "esbuild";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const fromHere = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// esbuild has no `?raw` loader (it's a Vite-ism). Teach the IIFE bundler to honor it: resolve the
// bare specifier, then re-emit the target file's text as a default-exported string. A component uses
// this to inline a dependency's stylesheet (scroll-area pulls in overlayscrollbars' base CSS as raw
// text and injects it under @layer foundation). Without it, esbuild errors on the `?raw` import.
function rawQueryPlugin(): EsbuildPlugin {
  return {
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
      build.onLoad({ filter: /.*/, namespace: "raw-query" }, async (args) => {
        const { readFile } = await import("node:fs/promises");
        const contents = await readFile(args.path, "utf8");
        return {
          contents: `export default ${JSON.stringify(contents)};`,
          loader: "js",
        };
      });
    },
  };
}

// Bundle @stisla/vanilla's full entry to an IIFE string, exposed as a virtual module. DemoFrame
// imports it and inlines it into the demo iframe as a <script>, so every demo (optionals included)
// runs the real behavior layer. esbuild's iife format gives a classic, side-effect-only script:
// the entry sets window.Stisla and auto-inits. Mirrors how demo.css?inline works for CSS: bundled
// on the fly (dev + build), no separate build step. Watched inputs invalidate it on edit.
function stislaVanillaIife(): Plugin {
  const virtualId = "virtual:stisla-vanilla-iife";
  const resolvedId = "\0" + virtualId;
  const entry = fromHere("../packages/vanilla/src/index-full.js");
  return {
    name: "stisla-vanilla-iife",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    async load(id) {
      if (id !== resolvedId) return;
      const esbuild = await import("esbuild");
      const result = await esbuild.build({
        entryPoints: [entry],
        bundle: true,
        format: "iife",
        write: false,
        metafile: true,
        legalComments: "none",
        plugins: [rawQueryPlugin()],
      });
      for (const file of Object.keys(result.metafile?.inputs ?? {})) {
        // esbuild keys plugin-namespaced inputs as "namespace:realpath" (our raw-query loader does
        // this for the inlined overlayscrollbars stylesheet). Strip the namespace back to the real
        // fs path before watching — otherwise the dev server gets a bogus "<cwd>/raw-query:/…" path
        // and fails to resolve it as a module.
        this.addWatchFile(resolve(file.replace(/^raw-query:/, "")));
      }
      return `export default ${JSON.stringify(result.outputFiles[0].text)};`;
    },
  };
}

// Plugin order matters: tanstackStart() before viteReact() (per the TanStack docs).
// @stisla/* resolve to workspace source so docs track the live components (dev, no build).
export default defineConfig({
  server: { port: 3001 },
  plugins: [stislaVanillaIife(), tailwindcss(), tanstackStart(), viteReact()],
  resolve: {
    alias: {
      "~": fromHere("./src"),
      "@stisla/react": fromHere("../packages/react/src/index.ts"),
      "@stisla/style": fromHere("../packages/style/src/index.ts"),
      "@stisla/vanilla": fromHere("../packages/vanilla/src/index.js"),
    },
  },
  // react-shiki's component bundle does `import './style.css'`. SSR externalizes it by default, so
  // Node's ESM loader hits the bare .css and throws "Unknown file extension". Forcing it through
  // Vite's transform pipeline lets Vite handle the CSS import on the server too.
  ssr: { noExternal: ["react-shiki"] },
});
