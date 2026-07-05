// Template screenshots — captures every page of a template at a fixed viewport
// and color scheme, in one command.
//
//   node templates/screenshot.mjs meridian                    # light, 1440x1030
//   node templates/screenshot.mjs meridian --theme both
//   node templates/screenshot.mjs meridian --width 1440 --height 1030 --theme dark
//   node templates/screenshot.mjs meridian --pages index,orders,settings
//   node templates/screenshot.mjs meridian --docs             # publish to the docs site
//
// How it works: spins up the template's own Vite dev server (the same pipeline
// `pnpm dev` uses), drives a headless Chromium through Playwright, and writes one
// PNG per page under templates/screenshots/<template>/. The dev server is started
// and torn down by this script — nothing needs to be running first.
//
// Options
//   <template>        template slug (folder under templates/) — REQUIRED
//   --width  <px>     viewport width,  default 1440
//   --height <px>     viewport height, default 1030
//   --theme  <mode>   light | dark | both, default light
//   --scale  <n>      device pixel ratio, default 1 (2 = retina, doubles output px)
//   --pages  <list>   comma-separated slugs to limit to (default: all pages/*.njk)
//   --out    <dir>    output directory, default templates/screenshots
//   --port   <n>      dev-server port, default 5199
//   --docs            publish straight into the docs site: writes both themes into
//                     docs/public/templates/<template>/shots/ as <slug>-<theme>.png
//                     and sets the hero poster (preview.png) from the dashboard.
//                     Implies --theme both; ignores --out.
//
// With --theme both, each page is written twice with a theme suffix:
//   index-light.png / index-dark.png. A single theme drops the suffix: index.png.

import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));

// ── Parse args ──────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const opts = { width: 1440, height: 1030, theme: "light", scale: 1, port: 5199 };
let template = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--width") opts.width = Number(argv[++i]);
  else if (a === "--height") opts.height = Number(argv[++i]);
  else if (a === "--theme") opts.theme = argv[++i];
  else if (a === "--scale") opts.scale = Number(argv[++i]);
  else if (a === "--port") opts.port = Number(argv[++i]);
  else if (a === "--pages") opts.pages = argv[++i];
  else if (a === "--out") opts.out = argv[++i];
  else if (a === "--docs") opts.docs = true;
  else if (a === "--help" || a === "-h") { printHelp(); process.exit(0); }
  else if (!a.startsWith("--")) template = a;
  else { console.error(`Unknown option: ${a}`); process.exit(1); }
}

if (!template) {
  console.error("Missing template slug.\n");
  printHelp();
  process.exit(1);
}

// --docs feeds the filmstrip, which shows both themes, so it always renders both.
if (opts.docs && opts.theme !== "both") {
  if (argv.includes("--theme")) console.warn("--docs renders both themes; ignoring --theme.");
  opts.theme = "both";
}

const themes = opts.theme === "both" ? ["light", "dark"] : [opts.theme];
if (!themes.every((t) => t === "light" || t === "dark")) {
  console.error(`--theme must be light, dark, or both (got "${opts.theme}")`);
  process.exit(1);
}

const templateDir = path.join(here, template, "html");
const pagesDir = path.join(templateDir, "pages");
// --docs publishes into the docs site; otherwise a scratch folder under templates/.
const docsDir = path.join(here, "..", "docs", "public", "templates", template);
const outDir = opts.docs
  ? path.join(docsDir, "shots")
  : path.resolve(opts.out ? opts.out : path.join(here, "screenshots"), template);
const base = `http://localhost:${opts.port}/${template}/`;

// ── Resolve the page list from pages/*.njk ─────────────────────────────────────
let slugs;
try {
  slugs = (await fs.readdir(pagesDir))
    .filter((f) => f.endsWith(".njk"))
    .map((f) => f.replace(/\.njk$/, ""));
} catch {
  console.error(`No pages found at ${pagesDir} — is "${template}" a valid template?`);
  process.exit(1);
}
// index first, then alphabetical — mirrors nav order well enough for a gallery.
slugs.sort((a, b) => (a === "index" ? -1 : b === "index" ? 1 : a.localeCompare(b)));
if (opts.pages) {
  const want = new Set(opts.pages.split(",").map((s) => s.trim()));
  slugs = slugs.filter((s) => want.has(s));
  if (!slugs.length) { console.error(`None of --pages matched. Available: ${slugs.join(", ")}`); process.exit(1); }
}

// A page's dev URL: index → the mount root, everything else → <slug>.html.
const urlFor = (slug) => (slug === "index" ? base : `${base}${slug}.html`);

// ── Boot the dev server ───────────────────────────────────────────────────────
console.log(`▸ starting dev server for "${template}" on :${opts.port}`);
const server = spawn("pnpm", ["exec", "vite", "--port", String(opts.port), "--strictPort"], {
  cwd: templateDir,
  stdio: "ignore",
});
const stopServer = () => { try { server.kill("SIGTERM"); } catch {} };
process.on("exit", stopServer);
process.on("SIGINT", () => { stopServer(); process.exit(130); });

await waitForServer(base, 30000);

// ── Screenshot ─────────────────────────────────────────────────────────────────
// When publishing, wipe the shots folder first so a renamed/removed page can't
// leave a stale image behind. (Only touches shots/, never the poster beside it.)
if (opts.docs) await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
let count = 0;
try {
  for (const theme of themes) {
    const context = await browser.newContext({
      viewport: { width: opts.width, height: opts.height },
      deviceScaleFactor: opts.scale,
    });
    // Seed the saved theme before any page script runs, so the head guard paints
    // the right scheme on first frame (no flash, no toggle click needed).
    await context.addInitScript((t) => {
      try { localStorage.setItem("stisla-theme", t); } catch {}
    }, theme);

    const page = await context.newPage();
    for (const slug of slugs) {
      await page.goto(urlFor(slug), { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await page.waitForTimeout(500); // let charts/animations settle
      const name = themes.length > 1 ? `${slug}-${theme}` : slug;
      const file = path.join(outDir, `${name}.png`);
      await page.screenshot({ path: file });
      count++;
      console.log(`  ✓ ${path.relative(process.cwd(), file)}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  stopServer();
}

// When publishing, the hero poster is the dashboard screen — one per theme, so
// the preview can follow the docs theme like the filmstrip does.
if (opts.docs) {
  const posters = [
    ["index-light.png", "preview.png"],
    ["index-dark.png", "preview-dark.png"],
  ];
  let wrote = 0;
  for (const [from, to] of posters) {
    try {
      await fs.copyFile(path.join(outDir, from), path.join(docsDir, to));
      console.log(`  ✓ ${path.relative(process.cwd(), path.join(docsDir, to))}  (hero poster)`);
      wrote++;
    } catch {}
  }
  if (!wrote) console.warn(`  ! no index screen to use as the poster (did --pages exclude index?)`);
}

console.log(`▸ ${count} screenshot${count === 1 ? "" : "s"} → ${path.relative(process.cwd(), outDir)}  (${opts.width}×${opts.height} @${opts.scale}x)`);
process.exit(0);

// ── Helpers ──────────────────────────────────────────────────────────────────
async function waitForServer(url, timeoutMs) {
  const start = Number(process.hrtime.bigint() / 1000000n);
  for (;;) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    if (Number(process.hrtime.bigint() / 1000000n) - start > timeoutMs) {
      stopServer();
      throw new Error(`Dev server did not become ready at ${url} within ${timeoutMs}ms`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}

function printHelp() {
  console.log(`Usage: node templates/screenshot.mjs <template> [options]

  <template>        template slug under templates/ (required, e.g. meridian)
  --width  <px>     viewport width  (default: 1440)
  --height <px>     viewport height (default: 1030)
  --theme  <mode>   light | dark | both (default: light)
  --scale  <n>      device pixel ratio (default: 1)
  --pages  <list>   comma-separated slugs (default: all pages)
  --out    <dir>    output dir (default: templates/screenshots)
  --docs            publish into docs/public/templates/<template>/ (implies --theme both)
  --port   <n>      dev-server port (default: 5199)`);
}
