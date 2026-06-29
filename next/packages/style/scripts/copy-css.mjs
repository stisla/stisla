// Copy every component's raw CSS (and lib adapters) from src/<name>/*.css → dist/<name>/*.css,
// preserving structure. These ship raw (Tailwind-dependent); @stisla/css and build-from-source
// consumers compile them. Runs after tsup (which cleans dist) in the package build script.
import { cpSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url))); // packages/style
const src = join(root, "src");
const dist = join(root, "dist");

let count = 0;
for (const name of readdirSync(src)) {
  const dir = join(src, name);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".css")) continue;
    mkdirSync(join(dist, name), { recursive: true });
    cpSync(join(dir, file), join(dist, name, file));
    count++;
  }
}
console.log(`copy-css: ${count} component CSS file(s) → dist/`);
