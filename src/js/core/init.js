// Stisla declarative scanner (V3.md §3.7).
//
// Components register with a kebab-case name (`register('dialog', Dialog)`),
// and `init(root)` walks `[data-stisla-<name>]` to instantiate matching
// classes. Idempotent — elements with an existing instance are skipped.
//
// Opts precedence (lowest → highest):
//   1. Class.defaults
//   2. JSON from data-stisla-opts
//   3. Per-attribute data-stisla-<name>-<key> (kebab → camel, JSON-parsed
//      with raw-string fallback)
//   4. Imperative opts arg from new Class(el, opts)
//
// Per-attribute is canonical; data-stisla-opts is the escape hatch for
// values that don't serialize cleanly as attribute strings.

import { getInstance } from './component.js';

const REGISTRY = new Map();

export function register(name, Class) {
  REGISTRY.set(name, Class);
}

export function init(root = document) {
  for (const [name, Class] of REGISTRY) {
    const selector = `[data-stisla-${name}]`;
    for (const el of root.querySelectorAll(selector)) {
      if (getInstance(el)) continue;
      const opts = readOpts(el, name, Class);
      new Class(el, opts);
    }
  }
}

export function readOpts(el, name, Class) {
  const merged = { ...(Class?.defaults ?? {}) };

  if (el.dataset.stislaOpts) {
    try {
      Object.assign(merged, JSON.parse(el.dataset.stislaOpts));
    } catch (e) {
      console.warn('[stisla] invalid data-stisla-opts JSON on', el, e);
    }
  }

  const prefix = `data-stisla-${name}-`;
  for (const attr of el.attributes) {
    if (!attr.name.startsWith(prefix)) continue;
    const key = kebabToCamel(attr.name.slice(prefix.length));
    merged[key] = tryJsonParse(attr.value);
  }

  return merged;
}

function tryJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function kebabToCamel(s) {
  return s.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}

// Auto-init lives in src/js/index.js, AFTER every register() call, so the
// scanner sees a populated registry. Don't move it back here — module
// top-level code evaluates before the entry's body, and an auto-init at
// the bottom of this file would race with the register() calls.
