import { useEffect, useRef, useState } from "react";
// `?inline` runs this through the docs app's own @tailwindcss/vite pipeline and returns the
// COMPILED css as a string — HMR-tracked, so editing theme.css / a component's css live-reloads
// the demo. (No separate Tailwind CLI; the iframe just needs the css as text to inline.)
import vanillaCss from "./demo.css?inline";

// lucide loaded from a CDN inside the iframe — exactly like a no-build consumer's page
// (`<i data-lucide="…">` + lucide.createIcons()). Not bundled into the docs. (Needs network;
// icons won't render offline.)
const LUCIDE_CDN = "https://unpkg.com/lucide@1.21.0/dist/umd/lucide.min.js";

/* Sandboxed vanilla-demo harness: raw HTML against the compiled vanilla @stisla/css,
 * isolated from the React docs shell, auto-sized. `layout` controls how the demo children
 * lay out — "row" (default, inline controls like buttons) or "stack" (full-width blocks
 * like alerts/cards). */
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

  const demoCss =
    layout === "stack"
      ? "display:flex;flex-direction:column;gap:.5rem;align-items:stretch"
      : "display:flex;flex-wrap:wrap;gap:.75rem;align-items:center";

  const srcDoc = `<!doctype html>
<html${theme === "dark" ? ' data-theme="dark"' : ""}>
<head>
<meta charset="utf-8">
<style>${vanillaCss}</style>
<style>
  body { margin: 0; padding: 1rem; background: var(--color-background); color: var(--color-foreground); }
  .demo { ${demoCss}; }
</style>
</head>
<body>
<div class="demo">${html}</div>
<script src="${LUCIDE_CDN}"></script>
<script>
  if (window.lucide) window.lucide.createIcons();
  function post(){ parent.postMessage({ type:"stisla-demo-height", height: document.documentElement.scrollHeight }, "*"); }
  new ResizeObserver(post).observe(document.documentElement);
  window.addEventListener("load", post); post();
</script>
</body>
</html>`;

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (
        e.source === ref.current?.contentWindow &&
        e.data?.type === "stisla-demo-height"
      ) {
        setHeight(e.data.height as number);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      title="Stisla vanilla demo"
      sandbox="allow-scripts"
      srcDoc={srcDoc}
      className="demo-frame"
      style={{
        display: "block",
        width: "100%",
        height,
        border: 0,
        background: "var(--color-surface)",
      }}
    />
  );
}
