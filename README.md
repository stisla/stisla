<p align="center">
  <img src="https://avatars2.githubusercontent.com/u/45754626?s=75&v=4" alt="Stisla logo" width="75" height="75">
</p>

<h1 align="center">Stisla</h1>

<p align="center">
A design specification for admin interfaces, shipped as a vanilla CSS + JS implementation.
</p>

<p align="center">
<a href="https://github.com/stisla/stisla"><img src="https://img.shields.io/github/tag/stisla/stisla.svg" alt="tag"></a>
<a href="https://github.com/stisla/stisla/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
<a href="https://github.com/stisla/stisla/stargazers"><img src="https://img.shields.io/github/stars/stisla/stisla" alt="Stars"></a>
</p>

---

Docs, live demos, and downloadable templates: **[stisla.dev](https://stisla.dev)**.

## What's new in v3

- Clean break from Stisla 2.x. Bootstrap is gone — no jQuery, no Bootstrap JS bundle, no `--bs-*` Sass vars.
- 30 OKLCH `--st-*` tokens. One root override recolors the whole system; brutalist / dense / branded presets ship as one-line wrappers.
- Dark mode via `[data-theme="dark"]` or `.dark`.
- Vanilla JS built on Floating UI + focus-trap. BEM classes + Radix-aligned `[data-state]` so the same CSS layer can back future React / Vue / Svelte implementations.
- Small core; optional components (carousel today, more later) can be added individually.

v2 stays at [getstisla.com](https://getstisla.com) and is not migrated.

## Quick start

Install snippets and the customization guide live on [stisla.dev](https://stisla.dev).

To run this repo locally:

```bash
git clone https://github.com/stisla/stisla.git
cd stisla
npm install
npm run dev
```

`npm run build` produces a static site under `site-dist/`.

## Browser support

Safari 16.4+, Chrome 111+, Firefox 121+. No polyfills.

## License

MIT — see [LICENSE](LICENSE).

### Third-party notices

Stisla v3 includes code adapted from the following MIT-licensed projects. Full license texts live under [`LICENSES/`](LICENSES/).

- **Bootstrap 5.3** ([twbs/bootstrap](https://github.com/twbs/bootstrap), MIT) — `src/scss/foundation/_grid.scss`, `_containers.scss`, and `src/scss/tokens/_breakpoints.scss` are forks of `bootstrap/scss/_grid.scss`, `_containers.scss`, and `mixins/_breakpoints.scss`. See [`LICENSES/bootstrap-MIT.txt`](LICENSES/bootstrap-MIT.txt).
- **modern-normalize 3.0.1** ([sindresorhus/modern-normalize](https://github.com/sindresorhus/modern-normalize), MIT) — vendored verbatim into `src/scss/foundation/_normalize.scss`. See [`LICENSES/modern-normalize-MIT.txt`](LICENSES/modern-normalize-MIT.txt).

---

Stisla is created by [Nauval](http://nauv.al) ([Twitter](https://twitter.com/mhdnauvalazhar)). Support the author [here](https://www.buymeacoffee.com/mhd).
