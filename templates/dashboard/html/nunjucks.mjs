// Meridian dev pipeline — renders the Nunjucks pages on the fly and lets Vite
// inject HMR + asset/module URL rewriting. A lean descendant of the original
// site's tools/vite-plugin-nunjucks.mjs: only the `icon` filter (no shiki, toc,
// or prose-table helpers, which were docs-site concerns).
//
// Routing mirrors the built output's /dashboard/<page>.html URLs: a request for
// /dashboard/orders.html (or /dashboard/orders, or /dashboard/) resolves to
// pages/orders.njk (or pages/index.njk), so links written with .html for the
// zip work in dev too.
import nunjucks from "nunjucks";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from "@iconify/utils";
import { icons as solar } from "@iconify-json/solar";

// Build-time icon filter: `{{ "solar:bag-4-linear" | icon }}` emits an inline
// <svg> in currentColor — same shape the runtime icon libs produce, so the
// component CSS (.icon-box svg, .badge svg) sizes it with no vendor selector,
// and the zip ships offline with no runtime icon fetch.
const COLLECTIONS = { solar };
export function icon(name, opts = {}) {
  const [prefix, ...rest] = String(name ?? "").split(":");
  const set = COLLECTIONS[prefix];
  const data = set && getIconData(set, rest.join(":"));
  if (!data) throw new Error(`icon(): unknown icon "${name}"`);
  const built = iconToSVG(data, { height: "1em" });
  const attrs = {
    ...built.attributes,
    "aria-hidden": "true",
    ...(opts.class ? { class: opts.class } : {}),
    ...(opts.style ? { style: opts.style } : {}),
  };
  return iconToHTML(replaceIDs(built.body), attrs);
}

// Shared Nunjucks env factory — the dev plugin (dev: true) and the zip build
// (build.mjs, dev: false) configure it identically, so a page renders the same
// either way; only the `dev` global flips the layout's asset wiring.
export function createEnv({ root, dev }) {
  const env = nunjucks.configure(path.resolve(root), { autoescape: false, noCache: true });
  env.addGlobal("dev", dev);
  env.addFilter("icon", icon);
  return env;
}

export default function meridianNunjucks({ root }) {
  const siteRoot = path.resolve(root);
  const env = createEnv({ root: siteRoot, dev: true });

  return {
    name: "meridian:nunjucks",
    apply: "serve",

    configureServer(server) {
      server.watcher.add(siteRoot);
      const reload = (file) => {
        if (file.endsWith(".njk")) server.ws.send({ type: "full-reload", path: "*" });
      };
      server.watcher.on("change", reload);
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);

      server.middlewares.use(async (req, res, next) => {
        try {
          const url = (req.url || "/").split("?")[0];
          const ext = path.extname(url);
          if (ext && ext !== ".html") return next(); // let Vite serve assets/modules

          // Strip an optional .html, then the /dashboard mount prefix, leaving the slug.
          let route = ext === ".html" ? url.slice(0, -ext.length) : url;
          route = route.replace(/^\/dashboard/, "");
          const slug = route.replace(/^\/+/, "").replace(/\/+$/, "") || "index";
          const template = `pages/${slug}.njk`;

          try {
            await fs.access(path.join(siteRoot, template));
          } catch {
            return next();
          }

          let html = env.render(template);
          html = await server.transformIndexHtml(req.url, html);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(
            `<pre style="padding:16px;font:14px/1.5 monospace;color:#b00">${escapeHtml(
              err.stack || err.message
            )}</pre>`
          );
        }
      });
    },
  };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}
