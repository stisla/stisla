# @stisla/vanilla

The vanilla-JS behavior layer for [Stisla](https://github.com/stisla/stisla). Drives interactive components from `data-stisla-*` markup. Pairs with `@stisla/css` at the matching version.

## Install

```sh
npm install @stisla/css @stisla/vanilla
```

```js
import "@stisla/css";
import "@stisla/vanilla"; // every component
```

Or via CDN (classic script, exposes `window.Stisla`, auto-inits):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@3/dist/stisla.css" />
<script src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@3/dist/stisla.js"></script>
```

This single entry registers every component. Want only a subset? Import the individual modules from `@stisla/vanilla/components/<name>.js` and `register()` them yourself.

Docs and source: https://github.com/stisla/stisla
