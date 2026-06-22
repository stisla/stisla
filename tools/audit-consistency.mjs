#!/usr/bin/env node
// Cross-component CONSISTENCY audit (complements audit-tokens.mjs).
//
// audit-tokens checks each token against grammar rules in isolation. It can't
// see that --card-border and --popover-border-width express the SAME concept
// two different ways. This script aggregates every component custom property,
// buckets them by property concept, and reports where components DIVERGE in
// the shape they expose — the class of inconsistency we keep finding by hand.
//
// Two reports:
//   A. Token-SHAPE divergence — per concept (border / radius / shadow / …),
//      the distinct token shapes and which components use each.
//   B. Hardcoded structural props — border / box-shadow / border-radius written
//      as literals with no var() knob (the property can't be themed per-comp).
//
// Run: node tools/audit-consistency.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const COMPONENTS = join(process.cwd(), 'src/scss/components');
const files = readdirSync(COMPONENTS).filter((f) => f.endsWith('.scss'));

// Component names, longest-first so "list-group" wins over "list" when we
// strip the owning block prefix off a token name.
const COMP_NAMES = files
  .map((f) => basename(f, '.scss').replace(/^_/, ''))
  .sort((a, b) => b.length - a.length);

function ownerOf(tokenBody) {
  for (const c of COMP_NAMES) {
    if (tokenBody === c || tokenBody.startsWith(c + '-')) return c;
  }
  return null;
}

const STATES = ['hover', 'active', 'focus', 'focus-visible', 'disabled',
  'checked', 'selected', 'current', 'open', 'closed', 'invalid', 'danger',
  'highlighted', 'pressed', 'visited', 'alt'];

// Property concepts to check for shape consistency. Each is matched as a whole
// segment inside the token's local suffix (after the owning block prefix).
// color/bg are intentionally excluded — their many -hover/-active forms are
// expected state variation, not shape divergence.
const CONCEPTS = [
  { id: 'border', re: /(^|-)border(?!-radius)/ },
  { id: 'radius', re: /(^|-)(border-)?radius\b/ },
  { id: 'shadow', re: /(^|-)(box-)?shadow\b/ },
  { id: 'padding', re: /(^|-)padding\b/ },
  { id: 'margin', re: /(^|-)margin\b/ },
  { id: 'gap', re: /(^|-)gap\b/ },
  { id: 'motion', re: /(^|-)(transition|duration|ease)\b/ },
  { id: 'size', re: /(^|-)(size|width|height)\b/ },
  { id: 'offset/inset', re: /(^|-)(offset|inset)\b/ },
  { id: 'opacity', re: /(^|-)opacity\b/ },
  { id: 'font', re: /(^|-)font-(size|weight)\b/ },
];

// ── Collect every component custom-property name (decls + reads) ───────────
const tokenOwners = new Map(); // token -> owner component
const TOKEN_RE = /--[a-z][a-z0-9-]*/g;

for (const f of files) {
  const src = readFileSync(join(COMPONENTS, f), 'utf8');
  const code = src
    .split('\n')
    .filter((l) => !/^\s*\/\//.test(l)) // drop // comment lines
    .join('\n');
  for (const m of code.matchAll(TOKEN_RE)) {
    const name = m[0];
    if (name.startsWith('--st-')) continue; // theme / scale primitive
    if (/^--(os|ts|bs|embla)-/.test(name)) continue; // third-party plugin
    const owner = ownerOf(name.slice(2));
    if (!owner) continue; // e.g. --kbd-* set inside prose, not a component file
    if (!tokenOwners.has(name)) tokenOwners.set(name, owner);
  }
}

// Local suffix of a token, with leading element/part segments and a trailing
// state segment stripped, so the comparable "shape" is the property tail.
function shapeTail(token, owner, concept) {
  let suffix = token.slice(2 + owner.length + 1); // strip "--owner-"
  // strip a trailing state segment (-hover, -active, …)
  const segs = suffix.split('-');
  while (segs.length > 1 && STATES.includes(segs[segs.length - 1])) segs.pop();
  suffix = segs.join('-');
  // tail starting at the concept keyword
  const m = suffix.match(concept.re);
  if (m == null) return suffix;
  const idx = m.index + (m[1] ? m[1].length : 0);
  return suffix.slice(idx);
}

// ── Report A: shape divergence per concept ────────────────────────────────
const lines = [];
lines.push('═══ A. Token-shape divergence (same concept, different shape) ═══\n');

let inconsistentCount = 0;
for (const concept of CONCEPTS) {
  // owner -> Set(shape tails)
  const byOwner = new Map();
  for (const [token, owner] of tokenOwners) {
    const suffix = token.slice(2 + owner.length + 1);
    if (!concept.re.test(suffix)) continue;
    const tail = shapeTail(token, owner, concept);
    if (!byOwner.has(owner)) byOwner.set(owner, new Set());
    byOwner.get(owner).add(tail);
  }
  if (byOwner.size === 0) continue;

  // group owners by their shape-set signature
  const bySig = new Map();
  for (const [owner, tails] of byOwner) {
    const sig = [...tails].sort().join(' + ');
    if (!bySig.has(sig)) bySig.set(sig, []);
    bySig.get(sig).push(owner);
  }

  const flag = bySig.size > 1 ? '  ⚠ DIVERGES' : '  ✓ uniform';
  if (bySig.size > 1) inconsistentCount++;
  lines.push(`● ${concept.id}${flag}  (${bySig.size} shape(s))`);
  for (const [sig, owners] of [...bySig.entries()].sort((a, b) => b[1].length - a[1].length)) {
    lines.push(`    [${sig}]`);
    lines.push(`        ${owners.sort().join(', ')}`);
  }
  lines.push('');
}

// ── Report B: hardcoded structural props (no per-component knob) ───────────
lines.push('═══ B. Hardcoded structural props (literal value, no var() knob) ═══\n');
const HARD = [
  { id: 'border', re: /^\s*border(-(top|right|bottom|left|inline|block)(-(start|end))?)?\s*:\s*([^;]+);/ },
  { id: 'box-shadow', re: /^\s*box-shadow\s*:\s*([^;]+);/ },
  { id: 'border-radius', re: /^\s*border(-[a-z-]+)?-radius\s*:\s*([^;]+);/ },
];
const hardFindings = [];
for (const f of files) {
  // prose is the documented manifest exception (em-based reading skin) — its
  // hairlines / code-chip radius aren't component knobs by design.
  if (basename(f) === '_prose.scss') continue;
  const src = readFileSync(join(COMPONENTS, f), 'utf8');
  src.split('\n').forEach((line, i) => {
    if (/^\s*\/\//.test(line)) return;
    for (const h of HARD) {
      const m = line.match(h.re);
      if (!m) continue;
      const val = m[m.length - 1].trim();
      // knob-exposed if the value reads ANY component var (--<owner>-…); a
      // value that only references --st-* primitives is "global-only" (no
      // per-component override) — also worth surfacing.
      if (/var\(--(?!st-|os-|ts-|bs-|embla-)/.test(val)) continue; // has a component knob → fine
      // ── intentional, non-themable patterns (documented) ──
      if (/^(0|none|inherit|transparent)$/.test(val)) continue; // resets
      if (/\btransparent\b/.test(val)) continue;                // border spacer (state-colored later)
      if (/^(50%|9{3,}px|#\{radius\(full\)\})$/.test(val)) continue; // circle / pill — round by definition
      // single-side / directional border = hairline divider or edge, kept
      // literal on purpose (theme comment: "internal dividers stay literal 1px")
      if (/^\s*border-(top|bottom|left|right|inline|block)/.test(line)) continue;
      // focus / validation ring — themed globally via --st-ring / --st-danger
      if (h.id === 'box-shadow' && /var\(--st-(ring|danger)\)/.test(val)) continue;
      const globalOnly = /var\(--st-/.test(val);
      hardFindings.push({
        file: basename(f),
        line: i + 1,
        prop: h.id,
        kind: globalOnly ? 'global-only (--st-* only)' : 'literal (no var)',
        text: line.trim().slice(0, 76),
      });
    }
  });
}
if (hardFindings.length === 0) {
  lines.push('  none\n');
} else {
  for (const h of hardFindings) {
    lines.push(`  ${h.file}:${h.line}  [${h.prop}] ${h.kind}`);
    lines.push(`      ${h.text}`);
  }
  lines.push('');
}

lines.push(`Summary: ${inconsistentCount} concept(s) diverge · ${hardFindings.length} hardcoded structural prop(s)`);
console.log(lines.join('\n'));
