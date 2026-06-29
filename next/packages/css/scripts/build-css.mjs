// @stisla/css build — compile @stisla/style's theme + component CSS into precompiled bundles
// with NO utilities (Tailwind v4 via @tailwindcss/node, build([]) ⇒ zero candidates).
//
//   stisla.css       core   = preflight + theme + every component except the 3 optionals
//   stisla-full.css  full   = core + carousel + combobox + scroll-area
//   <optional>.css   add-on = ONLY that optional's CSS, resolved against the theme via @reference
//                             (no preflight / no :root theme re-emitted — drops on top of core)
import { compile, optimize } from "@tailwindcss/node";
import { readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const pkg = dirname(dirname(fileURLToPath(import.meta.url))); // packages/css
const base = pkg; // @import paths resolve relative to here
const styleRel = "../style/src";
const styleSrc = join(pkg, "..", "style", "src");
const dist = join(pkg, "dist");
mkdirSync(dist, { recursive: true });

const OPTIONAL = new Set(["carousel", "combobox", "scroll-area"]);

const cssFiles = (name) =>
  readdirSync(join(styleSrc, name))
    .filter((f) => f.endsWith(".css"))
    .sort()
    .map((f) => `${styleRel}/${name}/${f}`);

const componentDirs = readdirSync(styleSrc)
  .filter((n) => statSync(join(styleSrc, n)).isDirectory() && cssFiles(n).length)
  .sort();
const coreDirs = componentDirs.filter((n) => !OPTIONAL.has(n));
const optionalDirs = componentDirs.filter((n) => OPTIONAL.has(n));

const importLines = (dirs) => dirs.flatMap(cssFiles).map((p) => `@import "${p}";`).join("\n");

async function build(entryCss, outfile) {
  const compiler = await compile(entryCss, { base, onDependency() {} });
  const css = optimize(compiler.build([]), { minify: true }).code; // build([]) → no utilities
  writeFileSync(join(dist, outfile), css);
  return css.length;
}

const bundleEntry = (dirs) =>
  `@import "tailwindcss";\n@import "${styleRel}/theme.css";\n${importLines(dirs)}\n`;
const addonEntry = (name) =>
  `@reference "tailwindcss";\n@reference "${styleRel}/theme.css";\n${cssFiles(name).map((p) => `@import "${p}";`).join("\n")}\n`;

const results = {};
results["stisla.css"] = await build(bundleEntry(coreDirs), "stisla.css");
results["stisla-full.css"] = await build(bundleEntry([...coreDirs, ...optionalDirs]), "stisla-full.css");
for (const name of optionalDirs) results[`${name}.css`] = await build(addonEntry(name), `${name}.css`);

console.log(`build-css: ${coreDirs.length} core + ${optionalDirs.length} optional components`);
for (const [f, n] of Object.entries(results)) console.log(`  ${f.padEnd(18)} ${(n / 1024).toFixed(1)} KB`);
