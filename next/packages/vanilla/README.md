# @stisla/vanilla

The vanilla-JS behavior layer for [Stisla](https://github.com/stisla/stisla). Drives interactive components from `data-stisla-*` markup. Pairs with `@stisla/css` at the matching version.

## Install

```sh
npm install @stisla/css @stisla/vanilla
```

```js
import "@stisla/css";
import "@stisla/vanilla"; // core; or "@stisla/vanilla/full"
```

Or via CDN (classic script, exposes `window.Stisla`, auto-inits):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/stisla.css" />
<script src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/stisla.js"></script>
```

Optional add-ons drop on top of core (load after it): `@stisla/vanilla/carousel`, `@stisla/vanilla/combobox`, `@stisla/vanilla/scroll-area`.

Docs and source: https://github.com/stisla/stisla
