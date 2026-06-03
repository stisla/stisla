// Shared Nunjucks filters used by both the dev plugin and the static renderer.

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
