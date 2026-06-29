// Lightweight publish smoke test. For each publishable package, run `npm pack --dry-run` and assert
// every exports target (plus README + LICENSE) is actually in the packed file list. Catches the
// common publish failure: an exports subpath pointing at a dist file the build didn't emit.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(dirname(fileURLToPath(import.meta.url))), "packages");
const PKGS = ["css", "style", "vanilla", "react"];

function exportTargets(exports) {
  const out = [];
  const walk = (e) => {
    if (typeof e === "string") out.push(e.replace(/^\.\//, ""));
    else if (e && typeof e === "object") Object.values(e).forEach(walk);
  };
  walk(exports);
  return out.filter((t) => t !== "package.json");
}

let failed = 0;
for (const name of PKGS) {
  const dir = join(root, name);
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const json = execFileSync("npm", ["pack", "--dry-run", "--json"], { cwd: dir, encoding: "utf8" });
  const files = JSON.parse(json)[0].files.map((f) => f.path);
  const has = (p) => files.includes(p);

  const want = [...exportTargets(pkg.exports), "README.md", "LICENSE"];
  const missing = want.filter((t) => !has(t));
  if (missing.length) {
    failed++;
    console.log(`✗ ${pkg.name}@${pkg.version} — missing from pack: ${missing.join(", ")}`);
  } else {
    console.log(`✓ ${pkg.name}@${pkg.version} — ${want.length} required files present (${files.length} packed)`);
  }
}

if (failed) {
  console.log(`\n✗ ${failed} package(s) would publish broken. Run \`pnpm build:packages\` first.`);
  process.exit(1);
}
console.log("\n✓ all packages pack cleanly.");
