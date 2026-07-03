// WCAG contrast audit — reads the LIVE tokens from packages/style/src/theme.css and reports
// intent-fill + text-on-surface ratios, so re-running after an edit reflects your changes.
//   node scripts/contrast-audit.mjs
// Math matches what a browser/axe compute (oklch -> sRGB8 -> WCAG luminance).
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
function oklchToRgb8(L, C, h) {
  const hr = (h * Math.PI) / 180, a = C * Math.cos(hr), b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b,
    m_ = L - 0.1055613458 * a - 0.0638541728 * b,
    s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const R = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    B = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const enc = (v) => { v = clamp(v); return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055; };
  return [enc(R), enc(G), enc(B)].map((v) => Math.round(v * 255));
}
const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const A = lum(a), B = lum(b), hi = Math.max(A, B), lo = Math.min(A, B); return (hi + 0.05) / (lo + 0.05); };
const hex = ([r, g, b]) => "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

const css = await readFile(fileURLToPath(new URL("../packages/style/src/theme.css", import.meta.url)), "utf8");
// Parse `--color-NAME: oklch(L C H);` (first/light-mode occurrence wins).
const tok = {};
for (const m of css.matchAll(/--color-([a-z0-9-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.-]+)\)/g)) {
  if (!(m[1] in tok)) tok[m[1]] = oklchToRgb8(+m[2], +m[3], +m[4]);
}
const g = (n) => tok[n] ?? (() => { throw new Error(`token --color-${n} not found`); })();

let fails = 0;
function row(label, fg, bg, need = 4.5) {
  const r = ratio(fg, bg), pass = r >= need;
  if (!pass) fails++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${r.toFixed(2)}:1  (need ${need})  ${label}   ${hex(fg)} on ${hex(bg)}`);
}

console.log("=== INTENT FILLS — label text on fill (need 4.5, theme-independent) ===");
for (const n of ["primary", "success", "warning", "danger", "info"]) {
  row(`${n} text`, g(`${n}-foreground`), g(n));
}
console.log("\n=== TEXT ON SURFACE (light) ===");
row("foreground on background", g("foreground"), g("background"));
row("muted-foreground on background", g("muted-foreground"), g("background"));
row("primary as text/link on background", g("primary"), g("background"));
console.log("\n=== INTERACTIONAL (light) ===");
row("neutral-foreground on neutral", g("neutral-foreground"), g("neutral"));
row("accent-foreground on accent", g("accent-foreground"), g("accent"));
row("overlay-foreground on overlay (tooltip)", g("overlay-foreground"), g("overlay"));

console.log(`\n${fails === 0 ? "✓ all audited pairs pass AA" : `✗ ${fails} pair(s) fail AA`}`);
process.exit(fails === 0 ? 0 : 1);
