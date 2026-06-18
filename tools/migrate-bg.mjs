// PR 5b continuation: bg-* utility classes → inline style.
// Adapted from migrate-shape.mjs.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BG_CSS = {
  'bg-transparent': 'background-color: transparent',
  'bg-background':  'background-color: var(--st-background)',
  'bg-surface':     'background-color: var(--st-surface)',
  'bg-surface-2':   'background-color: var(--st-surface-2)',
  'bg-surface-3':   'background-color: var(--st-surface-3)',
};

function migrateClassList(list) {
  const styles = [];
  const newList = [];
  for (const c of list) {
    if (BG_CSS[c]) {
      styles.push(BG_CSS[c]);
      continue;
    }
    newList.push(c);
  }
  return { newList, styles };
}

function transformContent(src) {
  return src.replace(/<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^<>"']+(?:=(?:"[^"]*"|'[^']*'|[^\s<>"']+))?)*)\s*(\/?)>/g,
    (full, tag, attrs, slash) => {
      const classMatch = attrs.match(/\sclass=(["'])([^"']*)\1/);
      if (!classMatch) return full;

      const list = classMatch[2].split(/\s+/).filter(Boolean);
      if (list.length === 0) return full;

      const { newList, styles } = migrateClassList(list);
      if (styles.length === 0) return full;

      let newAttrs;
      if (newList.length > 0) {
        const replaced = `class=${classMatch[1]}${newList.join(' ')}${classMatch[1]}`;
        newAttrs = attrs.replace(classMatch[0], ` ${replaced}`).replace(/\s+/g, ' ');
      } else {
        newAttrs = attrs.replace(classMatch[0], '').replace(/\s+/g, ' ');
      }

      const styleMatch = newAttrs.match(/\sstyle=(["'])([^"']*)\1/);
      if (styleMatch) {
        const existing = styleMatch[2].trim().replace(/;$/, '');
        const merged = existing
          ? `${existing}; ${styles.join('; ')}`
          : styles.join('; ');
        const replaced = `style=${styleMatch[1]}${merged}${styleMatch[1]}`;
        newAttrs = newAttrs.replace(styleMatch[0], ` ${replaced}`).replace(/\s+/g, ' ');
      } else {
        newAttrs = `${newAttrs} style="${styles.join('; ')}"`.replace(/\s+/g, ' ');
      }

      // Always emit one separating space after the tag name (the previous
      // version of this script regressed and produced `<divclass=`).
      return `<${tag} ${newAttrs.trim()}${slash ? ' /' : ''}>`;
    }
  );
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
