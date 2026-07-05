// Templates deploy — builds every template, assembles them into ONE static
// folder, and ships it to Cloudflare Pages via Wrangler direct-upload (no git
// build). Cloudflare only stores and serves the output; the build runs here,
// because it needs the pnpm workspace (@stisla/style + `pnpm exec tailwindcss`).
//
//   pnpm --filter . exec node templates/deploy.mjs        # build + assemble + deploy
//   node templates/deploy.mjs --dry                        # build + assemble only (no upload)
//
// First deploy prompts `wrangler login` and auto-creates the Pages project.
//
// Deploy layout (dist-site/ → project root):
//   index.html                  redirects / to the docs templates page
//   meridian/…                  Meridian pages + assets (folder name = the
//                               template's absolute link base, /meridian/*)
//   meridian/meridian.zip       the downloadable starter, served alongside

import { promises as fs } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/* ── Set these ──────────────────────────────────────────────────────────────
 * PROJECT     Cloudflare Pages project name → serves at <PROJECT>.pages.dev
 * DOCS_URL    where `/` redirects to (your docs templates page). Set the real
 *             docs production origin here. */
const PROJECT = "stisla-templates";
const DOCS_URL = "https://stisla.dev/templates";

/* Each template: its build dir, and `mount` = the folder name its markup links
 * to absolutely (Meridian's nav is /meridian/*.html, so it MUST serve at
 * /meridian/). `zip` is the archive build.mjs leaves in dist/. */
const TEMPLATES = [
  {
    slug: "meridian",
    dir: path.join(here, "meridian/html"),
    mount: "meridian",
    zip: "meridian.zip",
  },
];

const SITE = path.join(here, "dist-site");
const dry = process.argv.includes("--dry");

// Clean the deploy dir.
await fs.rm(SITE, { recursive: true, force: true });
await fs.mkdir(SITE, { recursive: true });

for (const t of TEMPLATES) {
  // 1. Build (renders pages + compiles CSS + packs the zip into dist/).
  console.log(`\n[${t.slug}] build`);
  execFileSync("pnpm", ["build"], { cwd: t.dir, stdio: "inherit" });

  // 2. Copy the rendered folder to its mount path, then drop the zip inside it
  //    (the zip was packed from that folder before this copy — no self-nesting).
  const rendered = path.join(t.dir, "dist", t.mount);
  const dest = path.join(SITE, t.mount);
  await fs.cp(rendered, dest, { recursive: true });
  await fs.copyFile(path.join(t.dir, "dist", t.zip), path.join(dest, t.zip));
  console.log(`[${t.slug}] → dist-site/${t.mount}/ (+ ${t.zip})`);
}

// 3. Root index: bounce `/` to docs. The named subfolders are the real content.
await fs.writeFile(
  path.join(SITE, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>Stisla templates</title>` +
    `<meta http-equiv="refresh" content="0; url=${DOCS_URL}">` +
    `<link rel="canonical" href="${DOCS_URL}">` +
    `<p>Redirecting to <a href="${DOCS_URL}">the Stisla templates gallery</a>.</p>\n`,
);
console.log(`\nassembled dist-site/ (index → ${DOCS_URL})`);

// 4. Deploy (unless --dry). Direct-upload: builds nothing on Cloudflare's side.
if (dry) {
  console.log("--dry: skipping wrangler deploy.");
} else {
  console.log(`\ndeploy → ${PROJECT}.pages.dev`);
  // `--branch main` forces the production deployment regardless of the current
  // git branch (this repo works on `v3`, which would otherwise land on a branch
  // preview alias). `--commit-dirty` silences the uncommitted-changes warning —
  // the deploy dir is a build artifact, so a dirty tree is expected.
  execFileSync(
    "pnpm",
    [
      "dlx", "wrangler", "pages", "deploy", SITE,
      "--project-name", PROJECT,
      "--branch", "main",
      "--commit-dirty=true",
    ],
    { cwd: here, stdio: "inherit" },
  );
}
