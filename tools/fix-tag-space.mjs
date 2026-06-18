// Fixup for the migrate-shape script bug. The reconstruction dropped the
// space between an opening tag and its first attribute when the attribute
// list happened to start with whitespace inside the regex capture.
// Pattern: <tag<attr=...> → <tag <attr=...>

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function fix(src) {
  // Match an opening tag immediately followed by a known HTML attribute
  // name (no separating space). Insert the missing space.
  const attrName = 'class|style|href|id|src|alt|type|name|value|placeholder|target|rel|disabled|checked|selected|readonly|required|role|tabindex|title|for|action|method|aria-[a-z-]+|data-[a-z-]+';
  const re = new RegExp(`<([a-zA-Z][a-zA-Z0-9]*)(${attrName})=`, 'g');
  return src.replace(re, '<$1 $2=');
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
  const after = fix(before);
  if (before !== after) {
    writeFileSync(file, after);
    changed++;
    changedFiles.push(file.replace(root + '/', ''));
  }
}

console.log(`Files: ${files.length} total, ${changed} changed.\n`);
for (const f of changedFiles) console.log('  ' + f);
