// Stisla's Sass tree still uses `@import` (it'll migrate to `@use` ahead of
// Dart Sass 3.0). Silence the noisy deprecation stream so the dev console
// stays readable in this example.
export default {
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'global-builtin', 'if-function'],
      },
    },
  },
};
