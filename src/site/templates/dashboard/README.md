# Meridian dashboard template

A self-contained admin starter built on Stisla. Every page is plain HTML, CSS,
and a little vanilla JS, so it drops into any backend (Laravel Blade, Rails,
Django, plain PHP) by copying the markup.

## Icons

Icons are [Solar](https://icon-sets.iconify.design/solar/) (CC BY 4.0), baked
into the HTML as inline `<svg>`. There is no icon font, no CDN, and no runtime
library to load. An icon is just markup you can copy.

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
