# @stisla/css

Precompiled CSS for [Stisla](https://github.com/stisla/stisla) — tokens + components, no utilities. Framework-agnostic; works with any stack.

## Install

```sh
npm install @stisla/css
```

```js
import "@stisla/css"; // every component
```

Or via CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/stisla.css" />
```

This single bundle ships every component. Want only a subset? Compile from source with [`@stisla/style`](https://www.npmjs.com/package/@stisla/style): pull `@stisla/style/theme.css` plus the `@stisla/style/<name>/<name>.css` you need through your own Tailwind build.

Pairs with [`@stisla/vanilla`](https://www.npmjs.com/package/@stisla/vanilla) for interactivity. Docs and source: https://github.com/stisla/stisla
