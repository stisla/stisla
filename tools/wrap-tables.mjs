// Build-time wrap for stisla.dev reference tables. Runs after Nunjucks
// renders a page: finds every bare `<table>` inside .main-container.prose
// and wraps it in `<div class="table-responsive">`. Wide customization
// tables would otherwise push the viewport on narrow screens; the wrapper
// scopes horizontal scroll per-table so multi-table sections scroll
// independently. Doing it here (not in the 45+ page templates, not at
// runtime in site.js) keeps source markup clean and avoids the brief
// pre-hydration overflow flash a runtime wrap would cause.
//
// Discriminator: only bare `<table>`. The `<table class="table …">` demos
// on /table show the framework `.table` component — those carry their own
// `.table-responsive` opt-in and must not be re-wrapped here.

// Match container the same way toc.mjs does so the two transforms stay in
// lockstep. Pair the opening `<div class="main-container prose">` with the
// matching `</div></article></main>` to scope the body region.
const CONTAINER_RE = /(<div class="main-container prose">)([\s\S]*?)(<\/div>\s*<\/article>\s*<\/main>)/;

// Bare `<table>` only — negative lookahead skips any `<table class="…">`.
// Whitespace before `>` is tolerated. The match is non-greedy on the body
// to stop at the matching `</table>`; HTML tables don't nest in our pages
// so this is safe.
const BARE_TABLE_RE = /<table(?![^>]*\sclass=)([^>]*)>([\s\S]*?)<\/table>/g;

export function wrapProseTables(html) {
  const match = html.match(CONTAINER_RE);
  if (!match) return html;

  const [, openTag, body, closeTag] = match;
  const newBody = body.replace(
    BARE_TABLE_RE,
    (_, attrs, inner) =>
      `<div class="table-responsive"><table${attrs}>${inner}</table></div>`
  );

  // Function form of replace — string form would interpret `$N` / `$&` in
  // the body as backreferences, and demo data like `$182k` would collapse
  // to `$1` (capture group) + `82k`.
  return html.replace(CONTAINER_RE, () => openTag + newBody + closeTag);
}
