# @stisla/vanilla

Vanilla JS implementation of the [Stisla](https://stisla.dev) v3 spec. Pairs
with [`@stisla/css`](https://www.npmjs.com/package/@stisla/css). Composed
primitives ([Floating UI](https://floating-ui.com/),
[focus-trap](https://github.com/focus-trap/focus-trap)) plus Stisla's own
component classes.

```bash
npm install @stisla/css @stisla/vanilla
```

## Usage

```js
import '@stisla/css';
import '@stisla/vanilla';            // core
// import '@stisla/vanilla/full';    // core + every integration
```

Importing `@stisla/vanilla` registers every core component and auto-scans the
DOM. Mark up with the standard Stisla classes + `data-stisla-*` attrs and the
scanner takes care of the rest.

### À la carte

```js
import { Dialog } from '@stisla/vanilla/src/components/dialog.js';

const dialog = new Dialog(document.getElementById('confirm'));
```

The `src/` tree is raw, side-effect-tagged ESM — bundlers tree-shake unused
components.

## Browser support

Safari 16.4+, Chrome 111+, Firefox 121+. No polyfills.

## License

MIT.
