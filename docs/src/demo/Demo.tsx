import { Suspense, lazy, useEffect, useState } from "react";
import ShikiHighlighter from "react-shiki/web";
import { useTheme } from "~/theme";

/* DemoFrame is loaded LAZILY and CLIENT-ONLY. It pulls in the compiled @stisla/css surface +
 * the ~700KB vanilla IIFE; rendering it during SSR/hydration is what flashed demo-heavy pages.
 * Gating it behind mount keeps it out of the server render AND the first client render (so no
 * hydration mismatch), and `lazy` keeps its weight out of every docs route's initial chunk. */
const DemoFrame = lazy(() =>
  import("./DemoFrame").then((m) => ({ default: m.DemoFrame })),
);

/* Reserves the frame box (height + min-height via .demo-block__frame) and paints the surface
 * color, so the page doesn't shift and dark mode shows no white gap before the iframe arrives. */
function FramePlaceholder() {
  return (
    <div
      className="demo-block__frame"
      style={{ background: "var(--color-background)" }}
      aria-hidden="true"
    />
  );
}

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
      <Suspense fallback={<FramePlaceholder />}>
        <DemoFrame html={html} theme={theme ?? docsTheme} layout={layout} />
      </Suspense>
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
