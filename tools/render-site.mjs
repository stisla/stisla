import nunjucks from 'nunjucks';
import fg from 'fast-glob';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dedent, getHighlighter, makeHighlightFilter } from './nunjucks-filters.mjs';
import { injectToc } from './toc.mjs';

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
  const html = injectToc(env.render(rel));
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
