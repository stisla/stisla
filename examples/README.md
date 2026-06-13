# examples

End-to-end consumer smokes for [`@stisla/css`](https://www.npmjs.com/package/@stisla/css)
and [`@stisla/vanilla`](https://www.npmjs.com/package/@stisla/vanilla) at
`3.0.0-beta.1`. Each example is self-contained — its own `package.json`, its
own `node_modules` — and installs the packages **from the npm registry**
(not from the local workspace). Run them after publishing a new version to
confirm the published artifacts behave the way the source tree predicts.

| Example | Tests | Build |
|---|---|---|
| [`cdn-html/`](./cdn-html) | jsDelivr URLs serve the right files; vanilla bundle works as a `<script type="module">` with an importmap | none |
| [`vite-core/`](./vite-core) | bare `@stisla/css` + `@stisla/vanilla` exports resolve; pre-compiled `dist/*` bundles load via a bundler | vite |
| [`vite-full/`](./vite-full) | `/full` subpath ships every integration (carousel today); Embla peer dep resolves through Vite | vite |
| [`vite-sass/`](./vite-sass) | `@stisla/css/scss/*` source tree compiles in a downstream project; `--st-*` token overrides retint every component at runtime | vite + sass |

## How to run all four

```bash
# CDN — no install
open examples/cdn-html/index.html

# The three bundler examples
for ex in vite-core vite-full vite-sass; do
  (cd examples/$ex && npm install && npm run dev)
done
```

A passing smoke means:

- Buttons render with the expected color and corner radius
- The dialog opens, traps focus, and closes on `Escape` / backdrop click
- The dropdown opens, navigates with the arrow keys, and dismisses on outside click
- The carousel (`vite-full` only) drags between slides
- The custom Sass bundle (`vite-sass` only) renders the primary button green
  and uses sharper corners than the default

## When to add a new example

When a new distribution path lands. One example per surface:

- **New entry in the `exports` map** → either fold into an existing example
  or add a new one (e.g. a React package would get `examples/react-vite/`)
- **New integration** → it should already appear in `vite-full`; add a
  dedicated example only if the integration has non-trivial config
- **New peer / runtime requirement** → add an example that proves it resolves
  end-to-end (importmap entry for CDN, install line for bundlers)
