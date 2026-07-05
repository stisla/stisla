# Meridian dashboard template

A self-contained admin starter built on Stisla. Every page is plain HTML, CSS,
and a little vanilla JS, so it drops into any backend (Laravel Blade, Rails,
Django, plain PHP) by copying the markup.

## Icons

Icons are [Solar](https://icon-sets.iconify.design/solar/) by 480 Design,
licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and
baked into the HTML as inline `<svg>`. There is no icon font, no CDN, and no
runtime library to load. An icon is just markup you can copy. The attribution
travels with the template in the `NOTICE` file — keep it when you redistribute.

### Swapping or adding an icon

1. Open [icon-sets.iconify.design/solar](https://icon-sets.iconify.design/solar/)
   and find an icon.
2. Click "SVG" to copy its markup.
3. Paste it where you want the icon. Drop it inside an `.icon-box` or a `.badge`
   and the existing CSS sizes it, or set `width`/`height` yourself.

```html
<span class="icon-box icon-box--primary">
  <svg width="1em" height="1em" viewBox="0 0 24 24"><!-- paste body --></svg>
</span>
```

Keep `fill="currentColor"` (or `stroke="currentColor"`) on the SVG so the icon
tracks the surrounding text color and theme.

## Tables

The Orders, Products, and Customers tables are plain server-rendered markup — a
loop over your data, with sorting, filtering, pagination, and search expressed
as links and a form (`?sort=`, `?status=`, `?page=`, `?q=`) the backend reads.
Copy the markup and swap the sample loop for your collection. The only client JS
is `assets/js/table-select.js`: row selection reveals the bulk-action bar and
fills the confirm dialogs. There is no data-grid runtime and no CDN table
library.

## Building the downloadable starter

`pnpm build` renders every page to static HTML, compiles the CSS to one
stylesheet, and packs the result into `dist/meridian.zip`. The
unzipped folder is named `meridian/` because the navigation links are absolute
(`/meridian/orders.html`): drop the folder at your web root and the links
resolve. The pages load `@stisla/vanilla` and ApexCharts from the CDN, so the
folder runs without an install.

## Two layers, two rules: CSS compiles, JS does not

Styling and behavior are shipped on purpose under different rules. Knowing which
is which tells you when you need a build step.

### CSS — needs a build, because Tailwind generates it

`assets/css/app.css` is the single compile unit. It pulls in the framework theme
and components from `@stisla/style`, the template styles under
`assets/css/meridian/`, and the Tailwind utilities the markup uses. The zip
ships the compiled result as `assets/css/style.css` (what every page links) and
keeps `app.css` plus the `meridian/` partials beside it so you can recompile.

To customize, edit `app.css` or a partial, then regenerate the stylesheet:

```bash
npm install        # pulls @stisla/style + the Tailwind CLI
npm run build:css  # app.css -> assets/css/style.css
```

One edit is mandatory if you move this CSS into your own project: the `@source`
lines at the top of `app.css` tell Tailwind which files to scan for class names.
Repoint them at wherever your views live (Laravel Blade, Rails ERB, Django,
plain HTML). Skip it and your markup renders unstyled, because the utilities it
uses are never generated.

### JavaScript — no build, edit it in place

The five scripts under `assets/js/` are first-party, hand-written, and loaded as
plain `<script src>` tags. They use no imports, no bundler, and no framework, so
you edit them directly and reload. Theme toggle, chart setup, the order-form
line-item editor, table selection, and the app-shell coordinator each live in
their own file and guard their own hooks, so a script is a no-op on a page that
lacks its elements.

The one piece you do not edit is `@stisla/vanilla`, the framework's behavior
layer. It loads precompiled from the CDN. Treat it as a dependency you consume,
the same as ApexCharts.
