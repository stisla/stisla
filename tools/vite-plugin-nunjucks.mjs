import nunjucks from 'nunjucks';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dedent, getHighlighter, makeHighlightFilter, icon } from './nunjucks-filters.mjs';
import { injectToc } from './toc.mjs';
import { wrapProseTables } from './wrap-tables.mjs';

// Dev-only middleware: maps URLs to .njk files under siteRoot,
// renders them, and lets Vite inject HMR + asset URL rewriting.
export default function nunjucksDevPlugin({ siteRoot }) {
  const root = path.resolve(siteRoot);
  const env = nunjucks.configure(root, {
    autoescape: false,
    noCache: true,
  });
  env.addGlobal('dev', true);
  env.addFilter('dedent', dedent);
  env.addFilter('icon', icon);

  // Shiki init runs in parallel with Vite startup; we await per-request below
  // so the first render waits without blocking server boot.
  const highlighterReady = getHighlighter().then((hl) => {
    env.addFilter('highlight', makeHighlightFilter(hl));
  });

  return {
    name: 'stisla:nunjucks-dev',
    apply: 'serve',

    configureServer(server) {
      // Watch the entire site directory rather than a glob — chokidar's
      // glob-at-startup model skips files created after the server boots,
      // which silently breaks HMR for new pages until restart.
      server.watcher.add(root);
      const reload = (file) => {
        if (file.endsWith('.njk')) {
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      };
      server.watcher.on('change', reload);
      server.watcher.on('add', reload);
      server.watcher.on('unlink', reload);

      server.middlewares.use(async (req, res, next) => {
        try {
          const url = (req.url || '/').split('?')[0];
          const ext = path.extname(url);
          if (ext && ext !== '.html') return next(); // let Vite handle assets

          // Mirror the built output's .html routes: a request for
          // /dashboard/orders.html resolves to the same template as the clean
          // /dashboard/orders, so links written with .html (for the zip) work
          // in dev too.
          const route = ext === '.html' ? url.slice(0, -ext.length) : url;

          await highlighterReady;
          const candidates = urlToCandidates(route);
          let template = null;
          for (const c of candidates) {
            try {
              await fs.access(path.join(root, c));
              template = c;
              break;
            } catch {}
          }
          if (!template) return next();

          let html = wrapProseTables(injectToc(env.render(template)));
          html = await server.transformIndexHtml(req.url, html);
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(
            `<pre style="padding:16px;font:14px/1.4 monospace;color:#b00">${escapeHtml(
              err.stack || err.message
            )}</pre>`
          );
        }
      });
    },
  };
}

function urlToCandidates(url) {
  const clean = url.replace(/\/$/, '') || '/';
  if (clean === '/') return ['pages/index.njk'];
  const slug = clean.replace(/^\//, '');
  return [
    `pages/${slug}.njk`,
    `pages/${slug}/index.njk`,
    `templates/${slug}.njk`,
    `templates/${slug}/index.njk`,
  ];
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
