import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import nunjucksDev from './tools/vite-plugin-nunjucks.mjs';

const SITE_ROOT = 'src/site';

// Let template/site Sass resolve `@stisla/css/scss/...` against the live
// source tree, so consumer-facing `@use "@stisla/css/scss/..."` lines (e.g.
// in the shipped dashboard starter) compile in this monorepo exactly as they
// will for a consumer who `npm i @stisla/css`. Maps only the `scss` subpath
// to src/scss; the package's runtime CSS is still linked separately.
const resolveConfig = {
  alias: {
    '@stisla/css/scss': fileURLToPath(new URL('./src/scss', import.meta.url)),
  },
};

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
      resolve: resolveConfig,
      css,
    };
  }

  // Build: compile CSS+JS bundles into site-dist/assets/.
  // Static HTML is rendered separately by tools/render-site.mjs.
  //
  // Four shipped bundles (vanilla impl, see SPEC.md §10 + V3.md §3.12):
  //   stisla.css        + stisla.js        — vanilla core only
  //   stisla-full.css   + stisla-full.js   — vanilla core + every optional
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
  // Per-component à-la-carte bundles land under `components/<name>.{css,js}`
  // so the same shape works for CDN + zip distribution. Each new component
  // with an à-la-carte entry adds one CSS + one JS entry to the inputs map
  // and two lines to the renames map.
  const renames = {
    'js-core': 'stisla.js',
    'js-full': 'stisla-full.js',
    'css-core.css': 'stisla.css',
    'css-full.css': 'stisla-full.css',
    'css-utilities.css': 'utilities.css',
    'component-js-carousel': 'components/carousel.js',
    'component-css-carousel.css': 'components/carousel.css',
    'component-js-scroll-area': 'components/scroll-area.js',
    'component-css-scroll-area.css': 'components/scroll-area.css',
    'component-js-combobox': 'components/combobox.js',
    'component-css-combobox.css': 'components/combobox.css',
  };
  const finalNames = new Set(Object.values(renames));

  return {
    resolve: resolveConfig,
    css,
    build: {
      outDir: 'site-dist/assets',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          'css-core': 'src/scss/bundles/stisla.scss',
          'css-full': 'src/scss/bundles/stisla-full.scss',
          'css-utilities': 'src/scss/bundles/utilities.scss',
          'js-core': 'src/js/index.js',
          'js-full': 'src/js/index-full.js',
          'component-css-carousel': 'src/scss/bundles/components/carousel.scss',
          'component-js-carousel': 'src/js/components/carousel.js',
          'component-css-scroll-area': 'src/scss/bundles/components/scroll-area.scss',
          'component-js-scroll-area': 'src/js/components/scroll-area.js',
          'component-css-combobox': 'src/scss/bundles/components/combobox.scss',
          'component-js-combobox': 'src/js/components/combobox.js',
          site: 'src/site/scripts/site.js',
          'site-styles': 'src/site/styles/site.scss',
        },
        output: {
          entryFileNames: (chunk) => renames[chunk.name] ?? '[name].js',
          // Shared chunks (e.g. Component class shared by stisla.js and
          // components/carousel.js) land at the same level as the entry
          // bundles so the dist tree stays flat: `chunks/<name>-<hash>.js`.
          // Hash + path are stable across versions, suitable for CDN
          // immutable cache headers.
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            if (!name) return 'chunks/[name]-[hash][extname]';
            if (finalNames.has(name)) return name;
            if (renames[name]) return renames[name];
            if (name.endsWith('.css')) return '[name][extname]';
            return 'chunks/[name]-[hash][extname]';
          },
        },
      },
    },
  };
});
