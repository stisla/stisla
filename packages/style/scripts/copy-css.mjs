// Copy raw component CSS from src → dist, preserving structure: src/<name>/*.css → dist/<name>/*.css,
// plus the hand-written src/components.css barrel → dist/components.css.
//
// These ship RAW (Tailwind-dependent) — no compilation here, just a file copy. A build-from-source
// consumer compiles them in their own Tailwind pass alongside `@import "tailwindcss"` +
// `@stisla/style/theme.css`, so preflight/theme land exactly once. (theme.css itself ships straight
// from src via package exports, so it is not copied here.) Runs after tsup (which cleans dist).
import { cpSync, readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url))); // packages/style
const src = join(root, "src");
const dist = join(root, "dist");

const cssFilesIn = (name) =>
  readdirSync(join(src, name)).filter((f) => f.endsWith(".css")).sort();

const componentDirs = readdirSync(src)
  .filter((n) => statSync(join(src, n)).isDirectory() && cssFilesIn(n).length)
  .sort();

// 1. Copy raw CSS verbatim → dist/<name>/*.css
let count = 0;
for (const name of componentDirs) {
  mkdirSync(join(dist, name), { recursive: true });
  for (const file of cssFilesIn(name)) {
    cpSync(join(src, name, file), join(dist, name, file));
    count++;
  }
}

// 2. Copy the barrel verbatim → dist/components.css (its ./<name>/<file> imports resolve against
//    the dist tree copied above).
if (existsSync(join(src, "components.css"))) {
  cpSync(join(src, "components.css"), join(dist, "components.css"));
}

console.log(`copy-css: ${count} CSS file(s) + components.css → dist/`);
