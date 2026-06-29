# @stisla/style

The framework-agnostic style layer for [Stisla](https://github.com/stisla/stisla): the Tailwind `@theme` foundation (`theme.css`), the per-component BEM CSS source, and a pure-JS class composer. `@stisla/css` is built from this, and the framework wrappers (`@stisla/react`, …) consume the composer.

## Install

```sh
npm install @stisla/style
```

```js
import { composer, button } from "@stisla/style";
import "@stisla/style/theme.css"; // the @theme foundation — compile with Tailwind v4
```

Docs and source: https://github.com/stisla/stisla
