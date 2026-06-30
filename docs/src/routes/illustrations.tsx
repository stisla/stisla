import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbar } from "~/site-navbar";
import { ILLUSTRATIONS, type Illustration } from "~/illustrations";

/* Illustration gallery. Ported from the legacy gallery page (src/site/pages/illustration.njk):
 * the recolorable spot-illustration set with accent swatches and per-card copy / SVG / PNG export.
 * The theme toggle moved to the shared navbar (one theme mechanism, the docs cookie); the page
 * keeps the accent controls. Tokens converted --st-* → --color-*. */
export const Route = createFileRoute("/illustrations")({
  component: Gallery,
});

const ACCENTS: { value: string; title: string; muted?: boolean }[] = [
  { value: "var(--color-primary)", title: "Primary" },
  { value: "var(--color-success)", title: "Success" },
  { value: "var(--color-danger)", title: "Danger" },
  { value: "var(--color-warning)", title: "Warning" },
  { value: "var(--color-muted-foreground)", title: "Grayscale", muted: true },
];

/* ── Flatten: bake computed CSS colours into a standalone SVG ──────────────────
 * The on-page art shades from CSS custom properties; an exported file must carry
 * the colours inline. We clone the node, copy the resolved paint of every shape,
 * and convert the CSS drop-shadow into a portable SVG filter. This pipeline is
 * inherently DOM-based (getComputedStyle / canvas), so it reads straight off the
 * live SVG node a card hands it. */
const NS = "http://www.w3.org/2000/svg";
const SHAPE = [
  "fill",
  "stroke",
  "fill-opacity",
  "stroke-opacity",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "opacity",
  "font-size",
  "font-weight",
  "font-family",
  "text-anchor",
];
const STOP = ["stop-color", "stop-opacity"];
let fid = 0;

function buildStandalone(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const src = svg.querySelectorAll("*");
  const dst = clone.querySelectorAll("*");
  let defs = clone.querySelector("defs");

  for (let i = 0; i < src.length; i++) {
    const cs = getComputedStyle(src[i]);
    const d = dst[i] as Element;
    const tag = src[i].tagName.toLowerCase();
    const props = tag === "stop" ? STOP : SHAPE;
    for (const p of props) {
      const v = cs.getPropertyValue(p);
      if (v && v.trim() && v !== "normal") d.setAttribute(p, v.trim());
    }
    const f = cs.filter;
    if (f && f.includes("drop-shadow")) {
      const inner = f.slice(f.indexOf("(") + 1, f.lastIndexOf(")"));
      const lens = inner.match(/-?[\d.]+px/g) || ["0px", "4px", "6px"];
      const color = inner.replace(/-?[\d.]+px/g, "").trim() || "rgba(0,0,0,.2)";
      if (!defs) {
        defs = document.createElementNS(NS, "defs");
        clone.insertBefore(defs, clone.firstChild);
      }
      const id = "sh-" + fid++;
      const filt = document.createElementNS(NS, "filter");
      filt.setAttribute("id", id);
      filt.setAttribute("x", "-40%");
      filt.setAttribute("y", "-40%");
      filt.setAttribute("width", "180%");
      filt.setAttribute("height", "180%");
      const fe = document.createElementNS(NS, "feDropShadow");
      fe.setAttribute("dx", String(parseFloat(lens[0]) || 0));
      fe.setAttribute("dy", String(parseFloat(lens[1]) || 0));
      fe.setAttribute("stdDeviation", String((parseFloat(lens[2]) || 0) / 2));
      fe.setAttribute("flood-color", color);
      filt.appendChild(fe);
      defs.appendChild(filt);
      d.setAttribute("filter", "url(#" + id + ")");
    }
    d.removeAttribute("class");
    d.removeAttribute("style");
  }

  clone.removeAttribute("class");
  clone.removeAttribute("style");
  clone.setAttribute("xmlns", NS);
  clone.setAttribute("width", "200");
  clone.setAttribute("height", "200");
  return clone;
}

function svgString(svg: SVGSVGElement) {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    new XMLSerializer().serializeToString(buildStandalone(svg))
  );
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function toPng(svg: SVGSVGElement, scale = 3) {
  const str = svgString(svg);
  const url = URL.createObjectURL(
    new Blob([str], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });
    const vb = svg.viewBox.baseVal;
    const w = (vb.width || 200) * scale,
      h = (vb.height || 200) * scale;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    return await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  } finally {
    URL.revokeObjectURL(url);
  }
}

type Action = "copy" | "svg" | "png";

function Card({
  illustration,
  onToast,
}: {
  illustration: Illustration;
  onToast: (msg: string) => void;
}) {
  const { name, label, Component } = illustration;
  const artRef = useRef<HTMLDivElement>(null);

  const run = async (act: Action) => {
    const svg = artRef.current?.querySelector("svg");
    if (!svg) return;
    const file = "stisla-" + name;
    try {
      if (act === "copy") {
        await navigator.clipboard.writeText(svgString(svg));
        onToast("SVG copied to clipboard");
      } else if (act === "svg") {
        download(
          new Blob([svgString(svg)], { type: "image/svg+xml;charset=utf-8" }),
          file + ".svg",
        );
        onToast("Downloaded " + file + ".svg");
      } else if (act === "png") {
        const blob = await toPng(svg, 3);
        if (blob) download(blob, file + ".png");
        onToast("Downloaded " + file + ".png");
      }
    } catch (err) {
      console.error(err);
      onToast("Sorry, that failed");
    }
  };

  return (
    <figure className="gcard">
      <div className="gcard__art" ref={artRef}>
        <Component />
      </div>
      <figcaption className="gcard__bar">
        <span className="gcard__name">{label}</span>
        <span className="gcard__actions">
          <button
            type="button"
            className="button button--sm button--ghost button--neutral"
            title="Copy SVG"
            onClick={() => run("copy")}
          >
            Copy
          </button>
          {/* <button
            type="button"
            className="button button--sm button--ghost button--neutral"
            title="Download SVG"
            onClick={() => run("svg")}
          >
            SVG
          </button>
          <button
            type="button"
            className="button button--sm button--ghost button--neutral"
            title="Download PNG"
            onClick={() => run("png")}
          >
            PNG
          </button> */}
        </span>
      </figcaption>
    </figure>
  );
}

function Gallery() {
  const [accent, setAccent] = useState<string>("var(--color-primary)");
  const [toast, setToast] = useState("");
  const [toastShown, setToastShown] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setToastShown(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShown(false), 1600);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <>
      <SiteNavbar />

      <main
        className="gallery"
        style={{ ["--illus-accent" as string]: accent }}
      >
        <div className="gallery__inner">
          <header className="gallery__head">
            <div>
              <h1 className="gallery__title">Illustrations</h1>
              <p className="gallery__lead">
                Recolorable spot illustrations for empty states, dialogs,
                onboarding, and status moments. Pick a color, then copy the SVG
                or download.
              </p>
            </div>

            <div
              className="gallery__tools"
              role="group"
              aria-label="Gallery controls"
            >
              <div className="tool">
                <span className="tool__label">Accent</span>
                <div className="swatches">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      className={"swatch" + (a.muted ? " swatch--muted" : "")}
                      style={a.muted ? undefined : { background: a.value }}
                      title={a.title}
                      aria-label={a.title}
                      aria-pressed={accent === a.value}
                      onClick={() => setAccent(a.value)}
                    />
                  ))}
                  <label className="swatch swatch--pick" title="Custom color">
                    <input
                      type="color"
                      defaultValue="#3b82f6"
                      aria-label="Custom accent color"
                      onInput={(e) => setAccent(e.currentTarget.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </header>

          <div className="gallery__grid">
            {ILLUSTRATIONS.map((il) => (
              <Card key={il.name} illustration={il} onToast={showToast} />
            ))}
          </div>

          <p className="gallery__foot">
            Every illustration is one SVG shaded from a single{" "}
            <code>--illus-accent</code>. Exports bake the current color in.
          </p>
        </div>

        <div
          className="gallery__toast"
          role="status"
          aria-live="polite"
          data-show={toastShown || undefined}
        >
          {toast}
        </div>
      </main>
    </>
  );
}
