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
  return {
    css,
    build: {
      outDir: 'site-dist/assets',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          'stisla-full': 'src/scss/bundles/stisla-full.scss',
          stisla: 'src/js/index.js',
          site: 'src/site/scripts/site.js',
          'site-styles': 'src/site/styles/site.scss',
        },
        output: {
          entryFileNames: '[name].js',
          assetFileNames: ({ name }) => {
            if (name && name.endsWith('.css')) return '[name][extname]';
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
  };
});
