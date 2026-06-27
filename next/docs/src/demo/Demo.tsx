import ShikiHighlighter from "react-shiki/web";
import { DemoFrame } from "./DemoFrame";
import { useTheme } from "~/theme";

/* A documentation demo: the live preview (sandboxed vanilla iframe) on top, and its exact
 * source highlighted below — one `html` string drives both (ARCHITECTURE §8). The preview
 * follows the docs theme (from ThemeProvider) unless overridden. Wrapped in .not-prose so
 * Tailwind Typography doesn't restyle it.
 *
 * react-shiki highlights client-side (useEffect): code renders plain on the server and
 * highlights on hydration — acceptable for a docs page. */
export function Demo({
  html,
  theme,
  layout,
}: {
  html: string;
  theme?: "light" | "dark";
  layout?: "row" | "stack";
}) {
  const { theme: docsTheme } = useTheme();
  return (
    <div className="not-prose demo-block">
      <DemoFrame html={html} theme={theme ?? docsTheme} layout={layout} />
      <ShikiHighlighter
        language="html"
        theme={{
          light: "github-light",
          dark: "github-dark",
        }}
        className="demo-block__code"
        showLanguage={false}
        defaultColor="light-dark()"
      >
        {html.trim()}
      </ShikiHighlighter>
    </div>
  );
}
