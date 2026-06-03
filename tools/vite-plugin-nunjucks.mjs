import nunjucks from 'nunjucks';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dedent } from './nunjucks-filters.mjs';

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
          if (path.extname(url)) return next(); // let Vite handle assets

          const candidates = urlToCandidates(url);
          let template = null;
          for (const c of candidates) {
            try {
              await fs.access(path.join(root, c));
              template = c;
              break;
            } catch {}
          }
          if (!template) return next();

          let html = env.render(template);
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
