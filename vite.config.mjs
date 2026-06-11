import { defineConfig } from 'vite';
import nunjucksDev from './tools/vite-plugin-nunjucks.mjs';

const SITE_ROOT = 'src/site';

// BS5 5.3 internals still use deprecated Sass APIs (color-functions,
// global-builtin, @import). Silence warnings from node_modules but keep
// any from our own SCSS. Vite's quietDeps/silenceDeprecations don't pass
// through reliably as of Vite 6.4 + Sass 1.100, so we drop in a logger.
const scssOptions = {
  api: 'modern-compiler',
  logger: {
    warn(message, options) {
      const url = options?.span?.url?.toString() ?? '';
      if (url.includes('node_modules')) return;
      console.warn(message);
    },
    debug() {},
  },
};

export default defineConfig(({ command }) => {
  const css = { preprocessorOptions: { scss: scssOptions } };

  if (command === 'serve') {
    return {
      plugins: [nunjucksDev({ siteRoot: SITE_ROOT })],
      server: { open: true },
      css,
    };
  }

  // Build: compile CSS+JS bundles into site-dist/assets/.
  // Static HTML is rendered separately by tools/render-site.mjs.
  //
  // Four shipped bundles (V3.md §3.12 core / integration split):
  //   stisla.css        + stisla.js        — core only
  //   stisla-full.css   + stisla-full.js   — core + every integration
  //
  // Rollup needs unique input keys, so the keys below ('css-core' etc.)
  // are arbitrary; the entryFileNames / assetFileNames hooks map them to
  // the public filenames.
  // Map from Rollup chunk/asset name → public filename. Two separate JS
  // bundles + two separate CSS bundles need four distinct input keys, but
  // we want the public filenames to overlap (stisla.js + stisla.css share
  // the basename "stisla"). The hooks below run on every emit, including
  // the post-rename Vite re-emit, so they have to be idempotent — pass
  // through any name that already matches a final filename.
  const renames = {
    'js-core': 'stisla.js',
    'js-full': 'stisla-full.js',
    'css-core.css': 'stisla.css',
    'css-full.css': 'stisla-full.css',
  };
  const finalNames = new Set(Object.values(renames));

  return {
    css,
    build: {
      outDir: 'site-dist/assets',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          'css-core': 'src/scss/bundles/stisla.scss',
          'css-full': 'src/scss/bundles/stisla-full.scss',
          'js-core': 'src/js/index.js',
          'js-full': 'src/js/index-full.js',
          site: 'src/site/scripts/site.js',
          'site-styles': 'src/site/styles/site.scss',
        },
        output: {
          entryFileNames: (chunk) => renames[chunk.name] ?? '[name].js',
          assetFileNames: ({ name }) => {
            if (!name) return 'assets/[name]-[hash][extname]';
            if (finalNames.has(name)) return name;
            if (renames[name]) return renames[name];
            if (name.endsWith('.css')) return '[name][extname]';
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
  };
});
