#!/usr/bin/env node
// Guardrail linter for ported components. Greps component CSS + docs pages for the patterns we
// learned to forbid while porting Button/Alert (see ../PORTING.md + ARCHITECTURE.md §11). Fast
// mechanical pass — run before `pnpm --filter docs build`. Exits 1 on any violation.
//
//   node scripts/check-tokens.mjs            # scan the default set
//   node scripts/check-tokens.mjs <file...>  # scan specific files

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const NEXT = dirname(dirname(fileURLToPath(import.meta.url)));

// Default scan set: component CSS (style + tokens) + docs route pages (where prose drift lives).
const SCAN_DIRS = [
  { dir: join(NEXT, "packages/style/src"), ext: ".css" },
  { dir: join(NEXT, "packages/tokens/src"), ext: ".css" },
  { dir: join(NEXT, "docs/src/routes"), ext: ".tsx" },
];

// Each rule: { id, re, msg }. `re` must be global. Allow-list lives inside the negative lookahead.
const RULES = [
  {
    id: "bs5-var",
    re: /--bs-[a-z-]+/g,
    msg: "Bootstrap 5 variable (--bs-*) — never use, not even as a fallback.",
  },
  {
    id: "theme-inline",
    re: /@theme\s+inline/g,
    msg: "@theme inline — colors must be plain @theme (--color-*) so they emit + flip in dark.",
  },
  {
    // --st-* is ONLY for the no-namespace customs. Anything else (colors, radius, shadow,
    // spacing, type) must use --color-* / a Tailwind facility.
    id: "st-non-custom",
    re: /--st-(?!(?:border-width|z-[a-z]|duration-[a-z]))[a-z][a-z-]*/g,
    msg: "non-custom --st-* token — colors use var(--color-*), scales use Tailwind facilities. Only --st-border-width / --st-z-* / --st-duration-* are allowed.",
  },
  {
    id: "is-modifier",
    re: /(?<=["\s.])is-[a-z][a-z-]*/g,
    msg: "is-* class — dropped. Variants use BEM --modifier, state uses attributes / ARIA.",
  },
  {
    id: "scale-literal-fallback",
    re: /var\(--(?:spacing|text|leading|font-weight|tracking|radius|shadow|ease)[a-z0-9-]*,\s*[-.0-9]/g,
    msg: "literal fallback on a scale token — the token is always defined; drop the fallback.",
  },
];

function walk(dir, ext, out) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, ext, out);
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

const argFiles = process.argv.slice(2);
const files = argFiles.length
  ? argFiles
  : SCAN_DIRS.flatMap(({ dir, ext }) => walk(dir, ext, []));

let violations = 0;
for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(text))) {
      violations++;
      const ln = lineOf(text, m.index);
      console.log(`${relative(NEXT, file)}:${ln}  [${rule.id}]  "${m[0]}"  — ${rule.msg}`);
    }
  }
}

if (violations) {
  console.log(`\n✗ ${violations} violation(s). Fix before building. (rules + rationale: PORTING.md)`);
  process.exit(1);
}
console.log(`✓ token guardrails clean (${files.length} file(s) scanned).`);
