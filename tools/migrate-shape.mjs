// PR 5b migration: padding / border / rounded utility classes → inline style.
//
// For each element with a class attribute containing dropped utilities,
// strip those classes and emit the equivalent CSS into the element's
// style="" attribute (merging into an existing style if one is there).
//
// Density-aware padding values preserve the original utility behaviour
// (multiplied by --st-density).

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PAD_VALUES = {
  '0': '0',
  '1': 'calc(0.25rem * var(--st-density))',
  '2': 'calc(0.5rem * var(--st-density))',
  '3': 'calc(0.75rem * var(--st-density))',
  '4': 'calc(1rem * var(--st-density))',
  '5': 'calc(1.25rem * var(--st-density))',
  '6': 'calc(1.5rem * var(--st-density))',
  '8': 'calc(2rem * var(--st-density))',
};

const PAD_PROPS = {
  p:  'padding',
  pt: 'padding-block-start',
  pb: 'padding-block-end',
  ps: 'padding-inline-start',
  pe: 'padding-inline-end',
  px: 'padding-inline',
  py: 'padding-block',
};

const SURFACE_CSS = {
  border:           'border: var(--st-border-width) solid var(--st-border)',
  'border-0':       'border: 0',
  rounded:          'border-radius: var(--st-radius)',
  'rounded-sm':     'border-radius: var(--st-radius-sm)',
  'rounded-lg':     'border-radius: var(--st-radius-lg)',
  'rounded-pill':   'border-radius: 9999px',
  'rounded-circle': 'border-radius: 50%',
  'rounded-0':      'border-radius: 0',
};

function migrateClassList(list) {
  const styles = [];
  const newList = [];

  for (const c of list) {
    const m = c.match(/^(p[xytbsep]?)-(\d+)$/);
    if (m && PAD_PROPS[m[1]] && PAD_VALUES[m[2]] !== undefined) {
      styles.push(`${PAD_PROPS[m[1]]}: ${PAD_VALUES[m[2]]}`);
      continue;
    }
    if (SURFACE_CSS[c]) {
      styles.push(SURFACE_CSS[c]);
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

      return `<${tag}${newAttrs.startsWith(' ') ? '' : ' '}${newAttrs.trim()}${slash ? ' /' : ''}>`;
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
