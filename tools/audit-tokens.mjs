// Stisla v3 — token-naming auditor.
//
// Greps every component + foundation SCSS for the token-grammar rules in
// V3-ARCHITECTURE.md and reports violations. Two severities:
//   ERROR    — a hard grammar violation (state-in-middle, padding-x/y,
//              reversed property order, physical margins, density leftover,
//              dropped mirror, abbreviation). Exit code 1 if any.
//   ADVISORY — a judgment call worth a human look (e.g. the -bg/-background
//              choice, rare property-segment spellings). Never fails the build.
//
// Usage:
//   node tools/audit-tokens.mjs            # full report
//   node tools/audit-tokens.mjs --errors   # errors only (CI gate)
//   node tools/audit-tokens.mjs <glob...>  # limit to specific files
//
// Reads files directly (no shell grep) so it's immune to the RTK grep hook
// and zsh word-splitting that bit the manual audits.

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const COMPONENTS = join(ROOT, 'src/scss/components');
const MIXINS = join(ROOT, 'src/scss/foundation/_mixins.scss');

// Components migrated in the token sweep (Part 4 of V3-ARCHITECTURE.md).
// Unmigrated files (prose, carousel, placeholders, scroll-area, link, …) are
// excluded so their pending state doesn't drown the signal. Add names here as
// they migrate.
const MIGRATED = new Set([
  'btn', 'input', 'select', 'textarea', 'checkbox', 'radio', 'switch',
  'alert', 'badge', 'progress', 'meter', 'spinner', 'kbd', 'icon-box',
  'indicator', 'toggle', 'toggle-group', 'button-group', 'tabs', 'pagination',
  'card', 'table', 'list-group', 'media', 'tooltip', 'breadcrumb', 'avatar',
  'avatar-group', 'slider', 'accordion', 'field', 'combobox', 'autocomplete',
  'input-group', 'navbar', 'app-shell', 'sidebar', 'menu', 'dialog',
  'drawer', 'popover', 'toast', 'page',
  'carousel', 'scroll-area', 'placeholders', 'link', 'separator', 'collapsible',
]);

const argFiles = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const errorsOnly = process.argv.includes('--errors');

function targetFiles() {
  if (argFiles.length) return argFiles.map((f) => (f.startsWith('/') ? f : join(process.cwd(), f)));
  const comp = readdirSync(COMPONENTS)
    .filter((f) => f.endsWith('.scss'))
    .filter((f) => MIGRATED.has(basename(f, '.scss').replace(/^_/, '')))
    .map((f) => join(COMPONENTS, f));
  return [...comp, MIXINS];
}

// Each rule: { id, severity, test(line) → matched substring | null, note }.
// `skipComment` drops `//`-comment lines (most rules want code only).
const RULES = [
  {
    id: 'density',
    severity: 'ERROR',
    re: /var\(--st-density\)/,
    note: 'density removed — use space() / --st-spacing',
  },
  {
    id: 'component-mirror',
    severity: 'ERROR',
    re: /var\(--st-[a-z-]+-(radius|shadow)\b(?!.*\bfamily\b)/,
    // allow the three family knobs
    allow: /--st-(input-radius|surface-radius|overlay-shadow)\b/,
    note: 'redundant --st-<comp>-{radius,shadow} mirror — use the component knob or a family knob',
  },
  {
    id: 'state-in-middle',
    severity: 'ERROR',
    re: /--[a-z-]+-(hover|active|focus|disabled|checked|selected)-(bg|color|border)/,
    note: 'state must be the trailing segment: --x-bg-hover, not --x-hover-bg',
  },
  {
    id: 'padding-xy',
    severity: 'ERROR',
    re: /--[a-z-]+-padding-[xy]\b/,
    note: 'use logical --x-padding-inline / -block, not -x / -y',
  },
  {
    id: 'short-dimension',
    severity: 'ERROR',
    re: /--[a-z][a-z-]*-(h|w|z)[,):; ]/,
    note: 'spell out: -height / -width / -z-index, not -h / -w / -z',
  },
  {
    id: 'reversed-property-order',
    severity: 'ERROR',
    re: /--[a-z-]+-(width|height|padding|margin)-(min|max|start|end|top|bottom|left|right)\b/,
    note: 'token segment must mirror the CSS property: --x-min-width, --x-padding-inline-start',
  },
  {
    id: 'physical-margin',
    severity: 'ERROR',
    re: /^\s*margin-(top|bottom|left|right)\s*:/,
    note: 'use logical margin-block-start/-end, margin-inline-start/-end',
  },
  {
    id: 'physical-padding',
    severity: 'ERROR',
    re: /^\s*padding-(top|bottom|left|right)\s*:/,
    note: 'use logical padding-block-start/-end, padding-inline-start/-end',
  },
  // The three universal abbreviations are MANDATORY (decision: keep -bg /
  // -radius / -shadow, matching Tailwind/design-token norms). The full CSS
  // property names on a COMPONENT token are therefore violations. --st-*
  // theme tokens are exempt (--st-background / --st-foreground are semantic
  // color-role names, a different namespace).
  {
    id: 'background-full',
    severity: 'ERROR',
    re: /--(?!st-)[a-z-]+-background\b/,
    note: 'use the -bg abbreviation on component tokens (--st-background is the theme role, exempt)',
  },
  {
    id: 'border-radius-full',
    severity: 'ERROR',
    re: /--[a-z-]+-border-radius\b/,
    note: 'use the -radius abbreviation, not -border-radius',
  },
  {
    id: 'box-shadow-full',
    severity: 'ERROR',
    re: /--[a-z-]+-box-shadow\b/,
    note: 'use the -shadow abbreviation, not -box-shadow',
  },
  {
    id: 'color-variant',
    severity: 'ERROR',
    re: /--[a-z-]+-(colour|fg|text-color)\b/,
    note: 'use -color (and -foreground only as a theme role name)',
  },
];

function isCommentLine(line) {
  return /^\s*\/\//.test(line);
}

// ── Selector-context analysis (for the two context-aware checks) ───────────
// Walks the file char-by-char, tracking a stack of the selector / at-rule that
// opened each `{`. For every `--token: value;` custom-property DECLARATION (not
// a var() read), records the innermost SELECTOR it sits under, classified as:
//   base       plain `.btn` / `.card__body` — declaring a token here is the
//              fallback-default violation (blocks scope/inline override)
//   modifier   `.btn--sm`, `&.is-x`         — declaring is correct
//   state      `:hover`, `[data-state]`, `&:focus`
//   scope      `.card .list-group`, `.app-shell > .sidebar` (descendant/child)
//   theme      @include color-mode(dark) / [data-theme]
//   media      @media/@supports (transparent — uses the parent selector)
//   mixin      inside an @mixin body
// Classification is best-effort (regex, not a real parser) — meant to surface
// candidates for human review, not to auto-fail.
function classifySelector(sel) {
  if (!sel) return 'unknown';
  if (sel.startsWith('@')) {
    if (/color-mode|data-theme/.test(sel)) return 'theme';
    if (/^@(media|supports|container)/.test(sel)) return 'media';
    if (/^@mixin/.test(sel)) return 'mixin';
    if (/^@(each|if|else|for|while|include)/.test(sel)) return 'control';
    return 'at-rule';
  }
  // Split comma-grouped selectors; if ANY part is base, the block declares on a
  // base element. Strip ONLY :is()/:where() (pure grouping). Keep :has()/:not()
  // — they make the selector conditional, i.e. NOT the plain base.
  const parts = sel.split(',').map((s) => s.replace(/:(is|where)\([^)]*\)/g, '').trim());
  let sawBase = false;
  for (const p of parts) {
    if (!p) continue;
    if (/[>+~]/.test(p) || /\S\s+[.#\[&a-z*]/i.test(p)) continue; // descendant/child → scope
    if (p.includes('--')) continue; // BEM modifier
    if (/[:\[]/.test(p)) continue; // pseudo or attribute (incl :has/:not) → state/variant
    if (p.includes('&')) continue; // nested & (resolve conservatively as non-base)
    sawBase = true; // a lone compound selector: .btn / .card__body / div
  }
  return sawBase ? 'base' : 'scope';
}

// The innermost selector frame — BUT a declaration is exempt from the
// base-declaration check if ANY ancestor is a theme scope (color-mode /
// [data-theme]) or a @media/@supports conditional: those are intentional
// conditional overrides, not unconditional base declarations.
// The component block a selector belongs to: first class, minus __element and
// --modifier suffixes. `.avatar-group__more` → `avatar-group`; `.card__body` →
// `card`; `.btn--sm` → `btn`. null for element-only selectors.
function blockOf(sel) {
  const m = sel.match(/\.([a-z][a-z0-9-]*)/i);
  if (!m) return null;
  return m[1].split('__')[0].split('--')[0];
}

function innermostSelector(stack) {
  for (const f of stack) {
    if (f.kind === 'theme' || f.kind === 'media') return { ...f, conditional: true };
  }
  for (let i = stack.length - 1; i >= 0; i--) {
    return stack[i];
  }
  return null;
}

function analyzeBlocks(src, file) {
  const out = [];
  const stack = [];
  let buf = '';
  let line = 1;
  let inLineComment = false;
  let inBlockComment = false;
  let quote = ''; // '"' or "'" when inside a string (e.g. data: URLs with http://)
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];
    if (ch === '\n') { line++; inLineComment = false; buf += ch; continue; }
    if (inLineComment) continue;
    if (inBlockComment) { if (ch === '*' && next === '/') { inBlockComment = false; i++; } continue; }
    if (quote) { buf += ch; if (ch === quote) quote = ''; continue; } // inside string: pass through
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === '/' && next === '/') { inLineComment = true; i++; continue; }
    if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
    if (ch === '{') {
      const sel = buf.trim().replace(/\s+/g, ' ');
      stack.push({ sel, kind: classifySelector(sel) });
      buf = '';
    } else if (ch === '}') {
      stack.pop();
      buf = '';
    } else if (ch === ';') {
      const decl = buf.trim();
      const m = decl.match(/^(--[a-z][a-z0-9-]*)\s*:\s*(.+)$/is);
      if (m) {
        const ctx = innermostSelector(stack);
        out.push({ line, name: m[1], value: m[2].trim(), ctx });
      }
      buf = '';
    } else {
      buf += ch;
    }
  }
  return out;
}

const files = targetFiles();
const findings = [];
const counts = {}; // for summarize rules

for (const file of files) {
  let src;
  try {
    src = readFileSync(file, 'utf8');
  } catch {
    console.error(`! cannot read ${file}`);
    continue;
  }
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    if (isCommentLine(line)) return;
    for (const rule of RULES) {
      const m = line.match(rule.re);
      if (!m) continue;
      if (rule.allow && rule.allow.test(line)) continue;
      // Third-party plugin var names (OverlayScrollbars --os-*, Tom Select
      // --ts-*, Embla, any leftover BS --bs-*) are external APIs Stisla
      // forwards values TO — not Stisla tokens we can rename. Exempt them from
      // the token-name spelling/grammar rules. (Only kicks in when the matched
      // text is such a token; line-level rules like physical-margin are
      // unaffected because their match isn't a --plugin- token.)
      if (/^--(os|ts|bs|embla)-/.test(m[0])) continue;
      if (rule.summarize) {
        counts[rule.id] = (counts[rule.id] || 0) + 1;
        continue;
      }
      findings.push({
        file: basename(file),
        line: i + 1,
        rule: rule.id,
        severity: rule.severity,
        text: m[0],
        note: rule.note,
        snippet: line.trim().slice(0, 80),
      });
    }
  });

  // ── Context-aware checks (advisory — scan, don't fix) ───────────────────
  const decls = analyzeBlocks(src, file);
  const declaredNames = new Set(decls.map((d) => d.name));
  for (const d of decls) {
    if (!d.ctx || d.ctx.kind !== 'base') continue;
    // Exempt: explicit `initial` resets (the BS5 table layered-paint slots are
    // declared-on-base ON PURPOSE — documented exception in V3-ARCHITECTURE §Surfaces).
    if (/^initial$/i.test(d.value)) continue;
    // Cross-block exemption: a selector setting ITS OWN block's tokens on the
    // base is the violation. Setting a DIFFERENT block's tokens is contextual
    // theming — a variant retuning another component (e.g. .avatar-group__more
    // setting --avatar-*). Only flag same-block.
    const block = blockOf(d.ctx.sel);
    if (block && !d.name.slice(2).startsWith(block + '-')) continue;
    findings.push({
      file: basename(file), line: d.line, rule: 'base-declaration', severity: 'ADVISORY',
      note: 'token declared on a BASE selector — blocks scope/inline override (fallback-default §2). Confirm it should be a fallback instead.',
      snippet: `${d.ctx.sel} { ${d.name}: … }`.slice(0, 90),
    });
  }
  // Fallback-default gaps: a var(--comp-x) read with NO comma/fallback, whose
  // token is also never declared anywhere in the file (so it can't be inherited
  // from a modifier/scope). Suppress --st-* (theme tokens, always at :root).
  const readNoFallback = [...src.matchAll(/var\(\s*(--[a-z][a-z0-9-]*)\s*\)/g)];
  const seenGap = new Set();
  for (const m of readNoFallback) {
    const name = m[1];
    if (name.startsWith('--st-')) continue;
    if (declaredNames.has(name)) continue; // set somewhere (modifier/state/scope) → intentional
    if (seenGap.has(name)) continue;
    seenGap.add(name);
    const lineNo = src.slice(0, m.index).split('\n').length;
    findings.push({
      file: basename(file), line: lineNo, rule: 'fallback-gap', severity: 'ADVISORY',
      note: 'var(--x) read with no fallback AND never declared — scope/inline cannot override it. Confirm intended.',
      snippet: m[0],
    });
  }
}

// ── Report ───────────────────────────────────────────────────────────────
const errors = findings.filter((f) => f.severity === 'ERROR');
const advisories = findings.filter((f) => f.severity === 'ADVISORY');

function group(list) {
  const byRule = {};
  for (const f of list) (byRule[f.rule] ||= []).push(f);
  return byRule;
}

console.log(`\n  token audit — ${files.length} files\n`);

const errGroups = group(errors);
if (errors.length === 0) {
  console.log('  ✓ no ERROR-level violations');
} else {
  for (const [rule, list] of Object.entries(errGroups)) {
    console.log(`  ✗ ${rule} (${list.length}) — ${list[0].note}`);
    for (const f of list) console.log(`      ${f.file}:${f.line}  ${f.snippet}`);
  }
}

if (!errorsOnly) {
  console.log('');
  const advGroups = group(advisories);
  const advRuleIds = [...new Set([...Object.keys(advGroups), ...Object.keys(counts)])];
  if (advRuleIds.length === 0) {
    console.log('  · no advisories');
  } else {
    for (const rule of advRuleIds) {
      const ruleDef = RULES.find((r) => r.id === rule);
      if (counts[rule]) {
        console.log(`  · ${rule} (${counts[rule]} uses) — ${ruleDef.note}`);
      } else {
        const list = advGroups[rule];
        console.log(`  · ${rule} (${list.length}) — ${list[0].note}`);
        for (const f of list) console.log(`      ${f.file}:${f.line}  ${f.snippet}`);
      }
    }
  }
}

console.log(`\n  ${errors.length} error(s), ${advisories.length + Object.values(counts).reduce((a, b) => a + b, 0)} advisory item(s)\n`);
process.exit(errors.length > 0 ? 1 : 0);
