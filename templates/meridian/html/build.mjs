// Meridian zip build — turns the Nunjucks sources into a self-contained static
// starter and packs it into dist/meridian.zip.
//
// What ships in the zip (a single `meridian/` folder, because every nav link is
// absolute `/meridian/<page>.html` — drop the folder at your web root and the
// links resolve):
//   *.html                  every page, pre-rendered (layout's `dev: false` branch:
//                           CDN vendors for JS, local style.css for CSS)
//   assets/css/style.css    app.css compiled to ONE self-contained stylesheet,
//                           minified — what the pages link, runs with no build
//   assets/css/app.css      the CSS SOURCE, kept so you can re-customize (its
//   assets/css/meridian/    @source is repointed at the rendered *.html)
//   assets/js/*.js          the template scripts, verbatim — plain, editable, no build
//   package.json            one `build:css` script + deps, for recompiling the CSS
//   README.md               usage / customization notes
//
// JS vendors (@stisla/vanilla, ApexCharts) stay on the CDN by design — only the
// CSS is compiled here, because Tailwind must generate the template's utilities.

import { promises as fs } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import { createEnv } from "./nunjucks.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const DIST = path.join(root, "dist");
const OUT = path.join(DIST, "meridian"); // mounts at /meridian/
const ZIP = "meridian.zip";

const rel = (...p) => path.join(root, ...p);
const out = (...p) => path.join(OUT, ...p);

// Clean.
await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(out("assets/css"), { recursive: true });
await fs.mkdir(out("assets/js"), { recursive: true });

// 1. Render every page to static HTML (dev: false → prod layout branch), then
//    run it through Prettier. The Nunjucks control blocks and comments leave
//    stray blank lines and ragged indentation in the raw render; Prettier's
//    html parser collapses that into clean, editable markup (whitespace-safe:
//    the default "css" sensitivity preserves significant whitespace in inline
//    elements, <pre>, <textarea>, so rendering is unchanged).
const env = createEnv({ root, dev: false });
const pages = (await fs.readdir(rel("pages"))).filter(
  (f) => f.endsWith(".njk") && !f.startsWith("_"),
);
for (const file of pages) {
  const html = env.render(`pages/${file}`);
  const pretty = await prettier.format(html, { parser: "html", printWidth: 100 });
  await fs.writeFile(out(file.replace(/\.njk$/, ".html")), pretty);
}
console.log(`render  ${pages.length} pages`);

// 2. Compile app.css → one minified, self-contained stylesheet. The Tailwind CLI
//    resolves the @import "@stisla/style/..." lines through node_modules and
//    scans the @source globs (this template's markup) for utilities.
execFileSync(
  "pnpm",
  ["exec", "tailwindcss", "-i", rel("assets/css/app.css"), "-o", out("assets/css/style.css"), "--minify"],
  { stdio: "inherit", cwd: root },
);
console.log("style   assets/css/style.css");

// 3. Copy the template scripts verbatim — these are the editable, no-build layer.
for (const f of await fs.readdir(rel("assets/js"))) {
  await fs.copyFile(rel("assets/js", f), out("assets/js", f));
}

// 4. Ship the CSS source so the zip can be recustomized. Repoint @source at the
//    rendered HTML (the zip has no .njk): pages sit at meridian/*.html, app.css
//    at meridian/assets/css/app.css, so "../../*.html".
let appCss = await fs.readFile(rel("assets/css/app.css"), "utf8");
appCss = appCss
  .replace(/^@source .*\n/gm, "")
  .replace(/[ \t]*\n{2,}$/g, "\n")
  .trimEnd();
appCss += '\n\n/* Scans the rendered pages for utilities. Repoint at your own views. */\n@source "../../*.html";\n';
await fs.writeFile(out("assets/css/app.css"), appCss);
await fs.cp(rel("assets/css/meridian"), out("assets/css/meridian"), { recursive: true });

// 5. Customization manifest + README go in the zip root.
const pkg = {
  name: "meridian",
  private: true,
  description: "Meridian — Stisla dashboard template (static HTML).",
  scripts: {
    "build:css": "tailwindcss -i assets/css/app.css -o assets/css/style.css --minify",
  },
  devDependencies: {
    "@stisla/style": "beta",
    "@tailwindcss/cli": "^4.0.0",
    tailwindcss: "^4.0.0",
  },
};
await fs.writeFile(out("package.json"), JSON.stringify(pkg, null, 2) + "\n");
await fs.copyFile(rel("README.md"), out("README.md"));
await fs.copyFile(rel("NOTICE"), out("NOTICE")); // third-party attribution (Solar, CC BY 4.0)

// 6. Pack. `zip` ships with macOS/Linux; the rendered folder is also left in
//    dist/meridian/ for inspection.
execFileSync("zip", ["-r", "-q", ZIP, "meridian"], { cwd: DIST });
console.log(`\npacked  dist/${ZIP}`);
