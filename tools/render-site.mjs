import nunjucks from 'nunjucks';
import fg from 'fast-glob';
import * as sass from 'sass';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { dedent, getHighlighter, makeHighlightFilter } from './nunjucks-filters.mjs';
import { injectToc } from './toc.mjs';
import { wrapProseTables } from './wrap-tables.mjs';

const SITE_ROOT = 'src/site';
const OUT_DIR = 'site-dist';

const env = nunjucks.configure(SITE_ROOT, {
  autoescape: false,
  noCache: true,
});
env.addGlobal('dev', false);
env.addFilter('dedent', dedent);
env.addFilter('highlight', makeHighlightFilter(await getHighlighter()));

await fs.mkdir(OUT_DIR, { recursive: true });

const files = await fg(['pages/**/*.njk', 'templates/**/*.njk'], { cwd: SITE_ROOT });

for (const rel of files) {
  if (path.basename(rel).startsWith('_')) continue;
  const html = wrapProseTables(injectToc(env.render(rel)));
  const outRel = rel
    .replace(/^pages\//, '')
    .replace(/^templates\//, '')
    .replace(/\.njk$/, '.html');
  const outPath = path.join(OUT_DIR, outRel);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, html);
  console.log(`render  ${rel}  ->  ${outPath}`);
}

console.log(`\nRendered ${files.length} page(s) to ${OUT_DIR}/`);

// === Template assets =======================================================
// Templates ship first-party CSS + JS under templates/<name>/assets/. The
// SCSS compiles to CSS; everything else copies verbatim. Output mirrors the
// source path (minus the templates/ prefix) so a template's rendered folder
// is self-contained — index.html links assets/ with relative paths and the
// whole folder zips into a working starter.

// Mirror the vite dev alias (vite.config.mjs): consumer-facing
// `@use "@stisla/css/scss/..."` lines resolve against the live source tree so
// the shipped starter's Sass compiles here exactly as it will for a consumer
// who `npm i @stisla/css`.
const SCSS_ROOT = pathToFileURL(path.resolve(SITE_ROOT, '../scss') + '/');
const stislaImporter = {
  findFileUrl(url) {
    if (!url.startsWith('@stisla/css/scss/')) return null;
    return new URL(url.replace('@stisla/css/scss/', './'), SCSS_ROOT);
  },
};

const tplStyles = await fg(['templates/**/assets/**/*.scss'], { cwd: SITE_ROOT });
for (const rel of tplStyles) {
  if (path.basename(rel).startsWith('_')) continue;
  const { css } = sass.compile(path.join(SITE_ROOT, rel), {
    style: 'expanded',
    importers: [stislaImporter],
  });
  const outRel = rel.replace(/^templates\//, '').replace(/\.scss$/, '.css');
  const outPath = path.join(OUT_DIR, outRel);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, css);
  console.log(`style   ${rel}  ->  ${outPath}`);
}

const tplAssets = await fg(
  ['templates/**/assets/**/*', '!templates/**/assets/**/*.scss'],
  { cwd: SITE_ROOT },
);
for (const rel of tplAssets) {
  const outRel = rel.replace(/^templates\//, '');
  const outPath = path.join(OUT_DIR, outRel);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.copyFile(path.join(SITE_ROOT, rel), outPath);
  console.log(`asset   ${rel}  ->  ${outPath}`);
}
