// Theme toggle for the Stisla dashboard template.
//
// Persists to localStorage under the same key the inline guard in <head>
// reads on first paint, swaps the toggle glyph, and emits `stisla:themechange`
// so charts can re-theme. The sun / moon glyphs are inlined here (Solar, CC BY
// 4.0) so the template ships no runtime icon map — swap the SVG strings to
// change them.

(function () {
  var root = document.documentElement;

  var ICONS = {
    sun: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="6"/><path stroke-linecap="round" d="M12 2v1m0 18v1m10-10h-1M3 12H2m17.07-7.07l-.392.393M5.322 18.678l-.393.393m14.141-.001l-.392-.393M5.322 5.322l-.393-.393"/></g></svg>',
    moon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m21.067 11.857l-.642-.388zm-8.924-8.924l-.388-.642zM21.25 12A9.25 9.25 0 0 1 12 21.25v1.5c5.937 0 10.75-4.813 10.75-10.75zM12 21.25A9.25 9.25 0 0 1 2.75 12h-1.5c0 5.937 4.813 10.75 10.75 10.75zM2.75 12A9.25 9.25 0 0 1 12 2.75v-1.5C6.063 1.25 1.25 6.063 1.25 12zm12.75 2.25A5.75 5.75 0 0 1 9.75 8.5h-1.5a7.25 7.25 0 0 0 7.25 7.25zm4.925-2.781A5.75 5.75 0 0 1 15.5 14.25v1.5a7.25 7.25 0 0 0 6.21-3.505zM9.75 8.5a5.75 5.75 0 0 1 2.781-4.925l-.776-1.284A7.25 7.25 0 0 0 8.25 8.5zM12 2.75a.38.38 0 0 1-.268-.118a.3.3 0 0 1-.082-.155c-.004-.031-.002-.121.105-.186l.776 1.284c.503-.304.665-.861.606-1.299c-.062-.455-.42-1.026-1.137-1.026zm9.71 9.495c-.066.107-.156.109-.187.105a.3.3 0 0 1-.155-.082a.38.38 0 0 1-.118-.268h1.5c0-.717-.571-1.075-1.026-1.137c-.438-.059-.995.103-1.299.606z"/></svg>',
  };

  function apply(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('stisla-theme', theme);

    var glyph = ICONS[theme === 'dark' ? 'sun' : 'moon'];
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.innerHTML = glyph;
    });

    window.dispatchEvent(new CustomEvent('stisla:themechange', { detail: { theme: theme } }));
  }

  document.addEventListener('click', function (event) {
    if (!event.target.closest('[data-theme-toggle]')) return;
    apply(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  // Sync the toggle glyph to whatever the head guard already applied.
  apply(root.dataset.theme || 'light');
})();
