# @stisla/css

CSS for the vanilla implementation of [Stisla](https://stisla.dev) v3.
Other implementations (React + Base UI, Vue + Reka UI, Svelte + bits-ui)
ship their own curated bundle exports from this package — see SPEC.md §10.

```bash
npm install @stisla/css
```

## Usage

### Pre-compiled bundle (default)

```js
import '@stisla/css';                     // vanilla core
import '@stisla/css/full';                // vanilla core + every optional
import '@stisla/css/components/carousel'; // à la carte
```

Or as a `<link>` if you're not bundling:

```html
<link rel="stylesheet" href="node_modules/@stisla/css/dist/stisla.css">
```

### Sass source (advanced)

The full SCSS tree ships in this package for users who want to fork
`stisla.scss`, drop unused components, or rebuild with their own breakpoints.

```scss
@use '@stisla/css/scss/bundles/stisla';
```

## Browser support

Safari 16.4+, Chrome 111+, Firefox 121+. No polyfills.

## License

MIT. Includes code adapted from Bootstrap 5.3 and modern-normalize — see
[`LICENSES/`](./LICENSES/) for full attributions.
