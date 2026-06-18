// Reverse migration: drop .stack / .inline layout primitives from the
// vanilla impl. Replace with the equivalent d-flex + flex-* + gap-* +
// align-items-* + justify-content-* utility composition.
//
// Mapping:
//   stack                    → d-flex flex-column
//   inline                   → d-flex flex-wrap align-items-center
//   stack/inline--gap-N      → gap-N
//   stack/inline--{bp}-gap-N → gap-{bp}-N
//   stack/inline--align-X    → align-items-X
//   stack/inline--justify-X  → justify-content-X
//   inline--nowrap           → flex-nowrap (and skip flex-wrap default)
//   stack/inline--block      → w-100
//   stack--{bp}-inline       → flex-{bp}-row

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function transformClassList(list) {
  const hasInlineNowrap = list.includes('inline--nowrap');
  const hasInlineAlign  = list.some((c) => /^inline--(?:[a-z]+-)?align-/.test(c));
  const out = [];

  for (const c of list) {
    if (c === 'stack')  { out.push('d-flex', 'flex-column'); continue; }
    if (c === 'inline') {
      out.push('d-flex');
      if (!hasInlineNowrap) out.push('flex-wrap');
      if (!hasInlineAlign)  out.push('align-items-center');
      continue;
    }

    let m;
    m = c.match(/^(?:stack|inline)--gap-(\d+)$/);
    if (m) { out.push(`gap-${m[1]}`); continue; }
    m = c.match(/^(?:stack|inline)--(sm|md|lg|xl|xxl)-gap-(\d+)$/);
    if (m) { out.push(`gap-${m[1]}-${m[2]}`); continue; }

    m = c.match(/^(?:stack|inline)--align-(start|end|center|baseline|stretch)$/);
    if (m) { out.push(`align-items-${m[1]}`); continue; }
    m = c.match(/^(?:stack|inline)--(sm|md|lg|xl|xxl)-align-(start|end|center|baseline|stretch)$/);
    if (m) { out.push(`align-items-${m[1]}-${m[2]}`); continue; }

    m = c.match(/^(?:stack|inline)--justify-(start|end|center|between|around|evenly)$/);
    if (m) { out.push(`justify-content-${m[1]}`); continue; }
    m = c.match(/^(?:stack|inline)--(sm|md|lg|xl|xxl)-justify-(start|end|center|between|around|evenly)$/);
    if (m) { out.push(`justify-content-${m[1]}-${m[2]}`); continue; }

    if (c === 'stack--block' || c === 'inline--block') { out.push('w-100'); continue; }
    if (c === 'inline--nowrap') { out.push('flex-nowrap'); continue; }

    m = c.match(/^stack--(sm|md|lg|xl|xxl)-inline$/);
    if (m) { out.push(`flex-${m[1]}-row`); continue; }

    out.push(c);
  }

  const seen = new Set();
  return out.filter((c) => seen.has(c) ? false : (seen.add(c), true));
}

function transformContent(src) {
  return src.replace(/class=(["'])((?:(?!\1).)*)\1/g, (_full, q, classStr) => {
    const list = classStr.split(/\s+/).filter(Boolean);
    if (list.length === 0) return `class=${q}${q}`;
    const out = transformClassList(list);
    return `class=${q}${out.join(' ')}${q}`;
  });
}

function walkNjk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkNjk(p, out);
    else if (p.endsWith('.njk')) out.push(p);
  }
  return out;
}

const root = '/Users/nauval/ui/stisla/src/site';
const files = walkNjk(root);
let changed = 0;
const changedFiles = [];

for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const after = transformContent(before);
  if (before !== after) {
    writeFileSync(file, after);
    changed++;
    changedFiles.push(file.replace(root + '/', ''));
  }
}

console.log(`Files: ${files.length} total, ${changed} changed.\n`);
for (const f of changedFiles) console.log('  ' + f);
