#!/usr/bin/env node
// Scaffold a vanilla component port: creates the CSS + docs-page skeletons and wires the shared
// files (demo.css @import, nav <Link>). Removes the mechanical/boilerplate steps so the port is
// just: fill in the real CSS, write the demos, verify. See ARCHITECTURE.md §11.
//
//   node scripts/scaffold-component.mjs <name>      # name is kebab-case, e.g. badge, input-group
//
// Idempotent: existing files are left untouched (skipped with a notice).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const NEXT = dirname(dirname(fileURLToPath(import.meta.url)));

const name = (process.argv[2] || "").trim();
if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error("Usage: node scripts/scaffold-component.mjs <kebab-name>");
  process.exit(1);
}
const pascal = name.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
const title = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
const navLabel = name.replace(/(^|-)([a-z])/g, (_, sep, c) => (sep ? " " : "") + c.toUpperCase());

const log = (s) => console.log(s);
const created = [];
const skipped = [];

// 1. component CSS skeleton -------------------------------------------------
const cssDir = join(NEXT, "packages/style/src", name);
const cssFile = join(cssDir, `${name}.css`);
if (existsSync(cssFile)) {
  skipped.push(`packages/style/src/${name}/${name}.css`);
} else {
  mkdirSync(cssDir, { recursive: true });
  writeFileSync(
    cssFile,
    `/* @stisla/style — ${title}. Ported from src/scss/components/_${name}.scss. References the @theme
 * tokens: colors var(--color-*), spacing --spacing(n), type var(--text-*) / var(--leading-*) /
 * var(--font-weight-*), radius var(--radius-*). Only no-namespace customs use --st-*
 * (border-width, duration, z). Knobs are --${name}-* (fallback-default). @layer components.
 * Authoring rules: ../../../../ARCHITECTURE.md §11 */

@layer components {
  .${name} {
    /* TODO: port from src/scss/components/_${name}.scss — token refs only, --${name}-* knobs.
       State via attributes / ARIA (never is-*); sizes sm/md(base)/lg/xl. */
  }
}
`
  );
  created.push(`packages/style/src/${name}/${name}.css`);
}

// 2. demo.css @import (idempotent append) -----------------------------------
const demoCssFile = join(NEXT, "docs/src/demo/demo.css");
const importLine = `@import "../../../packages/style/src/${name}/${name}.css";`;
let demoCss = readFileSync(demoCssFile, "utf8");
if (demoCss.includes(importLine)) {
  skipped.push("docs/src/demo/demo.css (@import already present)");
} else {
  demoCss = demoCss.replace(/\n*$/, "\n") + importLine + "\n";
  writeFileSync(demoCssFile, demoCss);
  created.push("docs/src/demo/demo.css (+@import)");
}

// 3. docs page skeleton -----------------------------------------------------
const pageFile = join(NEXT, "docs/src/routes/docs/vanilla", `${name}.tsx`);
if (existsSync(pageFile)) {
  skipped.push(`docs/src/routes/docs/vanilla/${name}.tsx`);
} else {
  const page = [
    `import { createFileRoute } from "@tanstack/react-router";`,
    `import { Demo } from "~/demo/Demo";`,
    ``,
    `export const Route = createFileRoute("/docs/vanilla/${name}")({`,
    `  component: ${pascal}Docs,`,
    `});`,
    ``,
    `function ${pascal}Docs() {`,
    `  return (`,
    `    <>`,
    `      <header>`,
    `        <h1>${title}</h1>`,
    `        <p className="lead">TODO: one short line — what it is, nothing more.</p>`,
    `      </header>`,
    ``,
    `      <section>`,
    `        <h2>Basic</h2>`,
    `        <p>TODO.</p>`,
    "        <Demo layout=\"stack\" html={`<div class=\"" + name + "\">TODO</div>`} />",
    `      </section>`,
    ``,
    `      {/* TODO: one <section> per variant/state from src/site/pages/${name}.njk.`,
    `          State = attributes / ARIA, never is-* (ARCHITECTURE.md §11).`,
    `          End with <h2>Customization</h2> tabling the --${name}-* knobs (see button.tsx). */}`,
    `    </>`,
    `  );`,
    `}`,
    ``,
  ].join("\n");
  writeFileSync(pageFile, page);
  created.push(`docs/src/routes/docs/vanilla/${name}.tsx`);
}

// 4. nav <Link> in route.tsx (alphabetical) ---------------------------------
const routeFile = join(NEXT, "docs/src/routes/docs/route.tsx");
let route = readFileSync(routeFile, "utf8");
// Scope to the "Vanilla" group only: the region from its <p className="nav-group"> up to (but not
// including) the next group title or </nav>. Robust to other groups (e.g. a React group) coexisting.
const vanillaGroupRe =
  /<p className="nav-group">Vanilla<\/p>[\s\S]*?(?=<p className="nav-group">|<\/nav>)/;
const region = route.match(vanillaGroupRe);
if (route.includes(`to="/docs/vanilla/${name}"`)) {
  skipped.push("docs/src/routes/docs/route.tsx (nav link already present)");
} else if (!region) {
  log('\n⚠ No "Vanilla" nav group found; add this <Link> manually:');
  log(`            <Link to="/docs/vanilla/${name}" activeProps={{ className: "active" }}>\n              ${navLabel}\n            </Link>`);
} else {
  const linkRe = /<Link\s+to="\/docs\/vanilla\/([a-z0-9-]+)"[\s\S]*?>\s*([\s\S]*?)\s*<\/Link>/g;
  const entries = new Map();
  let m;
  while ((m = linkRe.exec(region[0]))) entries.set(m[1], m[2].trim());
  entries.set(name, navLabel);
  const sorted = [...entries.entries()].sort((a, b) =>
    a[1].toLowerCase().localeCompare(b[1].toLowerCase())
  );
  const rebuilt =
    `<p className="nav-group">Vanilla</p>\n` +
    sorted
      .map(
        ([slug, label]) =>
          `            <Link to="/docs/vanilla/${slug}" activeProps={{ className: "active" }}>\n              ${label}\n            </Link>`
      )
      .join("\n") +
    `\n            `;
  route = route.replace(vanillaGroupRe, rebuilt);
  writeFileSync(routeFile, route);
  created.push(`docs/src/routes/docs/route.tsx (+nav link, alphabetical)`);
}

// summary -------------------------------------------------------------------
log(`\nScaffolded "${name}":`);
created.forEach((c) => log(`  + ${c}`));
skipped.forEach((s) => log(`  · ${s} (skipped)`));
log(`\nNext:`);
log(`  1. Port the CSS in packages/style/src/${name}/${name}.css (see _${name}.scss).`);
log(`  2. Write the demos + prose in docs/src/routes/docs/vanilla/${name}.tsx (cover ${name}.njk).`);
log(`  3. node scripts/check-tokens.mjs  &&  pnpm --filter docs build`);
log(`  (Framework wrapper later: add packages/style/src/${name}/config.ts + export it.)`);
