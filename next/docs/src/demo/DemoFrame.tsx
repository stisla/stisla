import { useEffect, useMemo, useRef, useState } from "react";
import vanillaCss from "./demo.css?inline";
import vanillaJs from "virtual:stisla-vanilla-iife";

const LUCIDE_CDN = "https://unpkg.com/lucide@1.21.0/dist/umd/lucide.min.js";

const inlineSafe = (js: string) => js.replace(/<\/script>/gi, "<\\/script>");

/* Rendered CLIENT-ONLY and LAZILY (see Demo.tsx): this module carries the compiled @stisla/css
 * surface (demo.css) + the ~700KB vanilla IIFE, so it must never load during SSR/hydration —
 * that eager weight is what flashed demo pages. By the time it renders, the parent DOM exists. */
export function DemoFrame({
  html,
  theme = "light",
  layout = "row",
}: {
  html: string;
  theme?: "light" | "dark";
  layout?: "row" | "stack";
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(96);

  const srcDoc = useMemo(() => {
    /* Bake the CURRENT theme into the iframe's first paint, read from the live parent DOM (the
     * pre-paint head script already applied it) — not the lagging `theme` prop — so the frame
     * never paints light then flips. Live toggles still arrive via postMessage below. */
    const initialTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    const demoCss =
      layout === "stack"
        ? "display:flex;flex-direction:column;gap:.5rem;align-items:center;justify-content:center;"
        : "display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;justify-content:center;";

    return `<!doctype html>
<html${initialTheme === "dark" ? ' data-theme="dark"' : ""}>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<style>${vanillaCss}</style>
<style>
  body { margin: 0; background: var(--color-background); color: var(--color-foreground); }
  /* The minimum frame height lives ONLY on the iframe element (.demo-block__frame in the docs
     shell). Here the .demo fills whatever the frame actually is via 100vh, so short content
     centers in the frame and scrollHeight can never exceed the viewport — no scrollbar. Padding
     sits inside the 100vh box (border-box) so it doesn't inflate the measured height. */
  .demo { box-sizing: border-box; min-height: 100vh; padding: 1rem; ${demoCss} }
</style>
</head>
<body>
<!-- Behavior layer first: window.Stisla must exist before any inline <script> a demo
     carries (e.g. tabs/popover/collapsible call Stisla.*.getOrCreate at parse time).
     Auto-init still defers to DOMContentLoaded, so it runs after the .demo content parses. -->
<script src="${LUCIDE_CDN}"></script>
<script>${inlineSafe(vanillaJs)}</script>
<div class="demo">${html}</div>
<script>
  if (window.lucide) window.lucide.createIcons();
  // Demos use href="#" as placeholder links; without this they'd navigate the iframe to
  // about:srcdoc# and blank the preview. Let real in-page anchors (#id) through.
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a && (a.getAttribute("href") === "#" || a.getAttribute("href") === "")) e.preventDefault();
  });
  function post(){ parent.postMessage({ type:"stisla-demo-height", height: document.documentElement.scrollHeight }, "*"); }
  new ResizeObserver(post).observe(document.documentElement);
  // Flip theme in place when the parent docs shell toggles — no reload, just the attribute the
  // tokens key off of.
  window.addEventListener("message", function(e){
    if (e.data && e.data.type === "stisla-demo-theme") {
      if (e.data.theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
    }
  });
  window.addEventListener("load", post); post();
</script>
</body>
</html>`;
  }, [html, layout]);

  // Push theme changes into the live iframe instead of rebuilding it. The iframe's listener
  // flips data-theme with no document churn.
  useEffect(() => {
    ref.current?.contentWindow?.postMessage(
      { type: "stisla-demo-theme", theme },
      "*",
    );
  }, [theme]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (
        e.source === ref.current?.contentWindow &&
        e.data?.type === "stisla-demo-height"
      ) {
        setHeight(Math.min(e.data.height as number, 2400));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      title="Stisla vanilla demo"
      sandbox="allow-scripts allow-forms allow-modals"
      srcDoc={srcDoc}
      onLoad={() =>
        ref.current?.contentWindow?.postMessage(
          { type: "stisla-demo-theme", theme },
          "*",
        )
      }
      className="demo-block__frame"
      /* Surface bg on the element itself covers the sub-frame `about:blank` moment before
         srcDoc parses, so dark mode never flashes white as the iframe mounts. */
      style={{ height, background: "var(--color-background)" }}
    />
  );
}
