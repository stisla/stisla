import ShikiHighlighter from "react-shiki/web";

/* A standalone code listing: highlighted source with no live preview. The
 * counterpart to <Demo> for snippets that wouldn't render meaningfully on the
 * page — shell commands, JS, build config, markup examples. Ported from the
 * legacy `ui.code` macro (src/site/partials/_demo.njk). Optional `title` shows
 * a filename/label bar above the code; `lang` picks the Shiki grammar. */
export function Code({
  code,
  lang = "html",
  title,
}: {
  code: string;
  lang?: string;
  title?: string;
}) {
  return (
    <div className="not-prose code-block">
      {title && <div className="code-block__title">{title}</div>}
      <ShikiHighlighter
        language={lang}
        theme={{
          light: "github-light",
          dark: "github-dark",
        }}
        className="code-block__code"
        showLanguage={false}
        defaultColor="light-dark()"
      >
        {code.trim()}
      </ShikiHighlighter>
    </div>
  );
}
