import { defineConfig } from 'vite';
import nunjucksDev from './tools/vite-plugin-nunjucks.mjs';

const SITE_ROOT = 'src/site';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [nunjucksDev({ siteRoot: SITE_ROOT })],
      server: { open: true },
      css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
    };
  }

  // Build: compile CSS+JS bundles into site-dist/assets/.
  // Static HTML is rendered separately by tools/render-site.mjs.
  return {
    css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
    build: {
      outDir: 'site-dist/assets',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          'stisla-full': 'src/scss/bundles/stisla-full.scss',
          stisla: 'src/js/index.js',
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
