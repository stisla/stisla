// Build-time ToC for stisla.dev. Runs after Nunjucks renders a page:
// finds h2/h3 inside .main-container, injects a slugged id on each heading
// (skipping ones that already have one), and replaces a <!-- TOC --> marker
// in the layout with a nested <nav>. Pages with fewer than two h2s get an
// empty marker — the right rail still reserves space for the sponsor.

const MARKER = /<!--\s*TOC\s*-->/g;

// Scope: anything inside the docs prose wrapper. The opening tag in
// base.njk is `<div class="main-container prose">`; pair it with the
// matching closing `</main>` so we don't pick up headings the sidebar or
// rail might introduce later.
// .main-container.prose is wrapped by .content-card now; the closing match
// allows an intervening </article> before </main>.
const CONTAINER_RE = /(<div class="main-container prose">)([\s\S]*?)(<\/div>\s*<\/article>\s*<\/main>)/;

const HEADING_RE = /<(h[23])([^>]*?)>([\s\S]*?)<\/\1>/g;

export function injectToc(html) {
  const match = html.match(CONTAINER_RE);
  if (!match) return html.replace(MARKER, '');

  const [, openTag, body, closeTag] = match;
  const used = new Set();
  const entries = [];

  const newBody = body.replace(HEADING_RE, (full, tag, attrs, inner) => {
    const text = stripInline(inner);
    if (!text) return full;
    const level = Number(tag[1]);

    const existing = attrs.match(/\bid\s*=\s*['"]([^'"]+)['"]/);
    if (existing) {
      used.add(existing[1]);
      entries.push({ id: existing[1], text, level });
      return full;
    }

    const id = slugify(text, used);
    if (!id) return full;
    entries.push({ id, text, level });
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  const h2Count = entries.filter((e) => e.level === 2).length;
  const tocHtml = h2Count >= 2 ? renderToc(entries) : '';

  // Function form of replace — string form would interpret `$N` / `$&` in
  // the body as backreferences, scrambling any demo cell that contains a
  // dollar amount (e.g. `$182k` → `$1` + `82k`).
  return html
    .replace(CONTAINER_RE, () => openTag + newBody + closeTag)
    .replace(MARKER, () => tocHtml);
}

function slugify(text, used) {
  const base = text
    .toLowerCase()
    .replace(/&[a-z#0-9]+;/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  if (!base) return null;
  let slug = base;
  let n = 2;
  while (used.has(slug)) slug = `${base}-${n++}`;
  used.add(slug);
  return slug;
}

function stripInline(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function renderToc(entries) {
  // Nest h3s under their preceding h2. Stray h3s before any h2 are dropped —
  // they almost always mean the page is mis-structured.
  const groups = [];
  for (const e of entries) {
    if (e.level === 2) groups.push({ ...e, children: [] });
    else if (e.level === 3 && groups.length) {
      groups[groups.length - 1].children.push(e);
    }
  }

  const items = groups
    .map((g) => {
      const sub = g.children.length
        ? `<ul class="site-toc__sublist">${g.children
            .map(
              (c) =>
                `<li><a class="site-toc__link" href="#${c.id}">${escapeHtml(c.text)}</a></li>`
            )
            .join('')}</ul>`
        : '';
      return `<li><a class="site-toc__link" href="#${g.id}">${escapeHtml(g.text)}</a>${sub}</li>`;
    })
    .join('');

  return `<nav class="site-toc" aria-label="On this page">
  <p class="site-toc__title">On this page</p>
  <ul class="site-toc__list">${items}</ul>
</nav>`;
}

function escapeHtml(s) {
  // Leave existing entities (&rsquo;, &amp;, &#39;, etc.) intact — the
  // headings we read have already been escaped by Nunjucks/markdown.
  return String(s)
    .replace(/&(?!#?[a-z0-9]+;)/gi, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
