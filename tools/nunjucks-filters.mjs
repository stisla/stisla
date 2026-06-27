// Shared Nunjucks filters used by both the dev plugin and the static renderer.

import { createHighlighter } from 'shiki';
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';
import { icons as solar } from '@iconify-json/solar';

// Shiki: build-time syntax highlighting. Dual-theme output uses CSS variables
// (`--shiki-dark`), so light/dark switching is pure CSS via [data-theme].
// `createHighlighter` is async, but the returned `codeToHtml` is sync — so
// we await once at module load and expose a sync filter for Nunjucks.
const HL_THEMES = { light: 'github-light', dark: 'github-dark' };
const HL_LANGS = ['html', 'css', 'scss', 'javascript', 'jsx', 'bash'];

let highlighterPromise;
export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: Object.values(HL_THEMES),
      langs: HL_LANGS,
    });
  }
  return highlighterPromise;
}

// Returns a sync Nunjucks filter: `{{ src | highlight('html') }}` → Shiki HTML.
// Caller must pre-await getHighlighter() so the filter can run synchronously
// inside Nunjucks's sync render path.
export function makeHighlightFilter(highlighter) {
  return (code, lang = 'html') =>
    highlighter.codeToHtml(String(code ?? ''), { lang, themes: HL_THEMES });
}

// Build-time icon filter: `{{ "solar:archive-bold-duotone" | icon }}` emits an
// inline <svg> drawn in currentColor. Output is a plain <svg> — same shape the
// Lucide runtime produces — so component CSS (.icon-box svg, .badge svg) sizes
// it without any vendor-specific selector, and the zip ships offline with no
// runtime icon fetch. An optional opts object passes through class/style.
//
// Only the `solar` collection is bundled; extend COLLECTIONS to add more.
const COLLECTIONS = { solar };

export function icon(name, opts = {}) {
  const [prefix, ...rest] = String(name ?? '').split(':');
  const set = COLLECTIONS[prefix];
  const data = set && getIconData(set, rest.join(':'));
  if (!data) throw new Error(`icon(): unknown icon "${name}"`);

  const built = iconToSVG(data, { height: '1em' });
  const attrs = {
    ...built.attributes,
    'aria-hidden': 'true',
    ...(opts.class ? { class: opts.class } : {}),
    ...(opts.style ? { style: opts.style } : {}),
  };
  return iconToHTML(replaceIDs(built.body), attrs);
}

// Strip the common leading whitespace from every line of `str`, plus any
// leading/trailing blank lines. Used by partials/_demo.njk so demo bodies
// stay indented to match their surrounding template but render flush-left
// in the code block.
export function dedent(str) {
  if (str == null) return '';
  const lines = String(str).split('\n');
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  if (lines.length === 0) return '';
  let min = Infinity;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const m = line.match(/^[ \t]*/);
    if (m[0].length < min) min = m[0].length;
  }
  if (!isFinite(min) || min === 0) return lines.join('\n');
  return lines.map((l) => l.slice(min)).join('\n');
}
