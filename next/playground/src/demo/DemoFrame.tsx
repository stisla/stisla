import { useEffect, useRef, useState } from "react";
import vanillaCss from "./iframe.css?raw";

/* Sandboxed vanilla-demo harness. Renders raw HTML against the compiled vanilla
 * @stisla/css, fully isolated from the React docs shell (no style bleed either way).
 * CSS is inlined; a tiny inline script reports content height so the frame auto-sizes.
 *
 * This is the spike for the docs' /docs/vanilla/<component> demos — the iframe content is
 * exactly what a no-build consumer ships: plain HTML + a <link> to stisla.css. */
export function DemoFrame({
  html,
  theme = "light",
}: {
  html: string;
  theme?: "light" | "dark";
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(96);

  const srcDoc = `<!doctype html>
<html${theme === "dark" ? ' data-theme="dark"' : ""}>
<head>
<meta charset="utf-8">
<style>${vanillaCss}</style>
<style>
  body { margin: 0; padding: 1rem; background: var(--st-background); color: var(--st-foreground); }
  .demo { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }
</style>
</head>
<body>
<div class="demo">${html}</div>
<script>
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
      style={{
        display: "block",
        width: "100%",
        height,
        border: "1px solid var(--st-border)",
        borderRadius: "0.5rem",
        background: "var(--st-surface)",
      }}
    />
  );
}
