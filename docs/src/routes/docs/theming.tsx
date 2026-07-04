import { createFileRoute, Link } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/theming")({
  component: ThemingDocs,
});

function ThemingDocs() {
  return (
    <>
      <header>
        <h1>Theming</h1>
        <p className="lead">Every visual decision is a CSS custom property. Redeclare a token after the framework loads and every component that reads it repaints, including the hover, active, and focus states that derive from it.</p>
      </header>

      <section>
        <h2>The token surface</h2>
        <p>Colors are <code>--color-*</code>, geometry is <code>--radius-*</code> and <code>--shadow-*</code>, spacing is <code>--spacing</code>, and type is <code>--font-*</code>; a few customs with no Tailwind namespace stay on <code>--st-*</code>. Components read these through <code>var()</code>, so an override takes effect with no rebuild. The <Link to="/docs/specification" hash="tokens" className="link">Specification</Link> catalogs every token and what it controls; this page is about changing them.</p>
        <p>Two rules carry over from that catalog. The shipped values are OKLCH literals because states derive at runtime via <code>color-mix(in oklch, &hellip;)</code>, and OKLCH mixing stays vivid through the midpoints where sRGB tends to muddy a brand color; your own overrides can use any representation (HSL, hex, sRGB). And every background-providing token has a paired <code>-foreground</code>, so if you override one, override the other and text contrast survives the base change.</p>
      </section>

      <section id="setting-up-overrides">
        <h2>Setting up overrides</h2>
        <p>An override is just a token you redeclare after the framework loads. There are two setups depending on whether you run a build step; both end at the same place, with your value winning over the shipped default. The same two setups recur across these pages, so it&rsquo;s worth fixing them once here.</p>

        <h3>Without a build step</h3>
        <p>Write a plain stylesheet, load it after the framework bundle, and declare the tokens you want to change on <code>:root</code>. Nothing to compile.</p>
        <Code lang="html" code={`
<link rel="stylesheet" href="stisla.css">
<link rel="stylesheet" href="overrides.css">
`} />
        <Code lang="css" title="overrides.css" code={`
:root {
  --color-primary: oklch(0.58 0.22 285);
  --color-primary-foreground: oklch(1 0 0);
  --radius-md: 0.5rem;
}
`} />
        <p>Load order is the whole trick. Your file comes after <code>stisla.css</code>, so at equal specificity your <code>:root</code> wins. No <code>!important</code>, no build.</p>

        <h3>With Vite and Tailwind</h3>
        <p>If you compile your own CSS with Tailwind, import the source theme rather than the precompiled bundle, then redeclare the tokens inside <code>@theme</code> so they land in the same layer as the shipped ones and regenerate any matching utilities. Tailwind comes in once, at the top. For the dark delta, use the registered <code>dark</code> variant instead of hand-writing the selector (see <a className="link" href="#dark-mode">Dark mode</a>).</p>
        <Code lang="css" title="app.css" code={`
@import "tailwindcss";
@import "@stisla/style/theme.css";   /* the @theme foundation */
/* + the component styles you use */

@theme {
  --color-primary: oklch(0.58 0.22 285);
  --color-primary-foreground: oklch(1 0 0);
  --radius-md: 0.5rem;
}
`} />
        <p>Either way, the result is the same. Pick the smallest scope that covers what you need; the next section breaks the scopes down.</p>
        <Demo html={`
<div class="flex flex-wrap items-start gap-6">
  <div class="flex flex-col gap-2">
    <span class="text-xs uppercase tracking-[0.05em] text-muted-foreground">Shipped defaults</span>
    <div class="flex items-center gap-3">
      <button type="button" class="button button--primary">Primary</button>
      <button type="button" class="button button--soft button--primary">Soft</button>
    </div>
  </div>
  <div class="flex flex-col gap-2" style="--color-primary: oklch(0.58 0.22 285); --color-primary-foreground: oklch(1 0 0); --radius-md: 0.5rem">
    <span class="text-xs uppercase tracking-[0.05em] text-muted-foreground">After the token override</span>
    <div class="flex items-center gap-3">
      <button type="button" class="button button--primary">Primary</button>
      <button type="button" class="button button--soft button--primary">Soft</button>
    </div>
  </div>
</div>
`} />
        <p>The override here is scoped to a wrapper so both states sit side by side, but a real <code>:root</code> or <code>@theme</code> override repaints exactly the same way, app-wide. Hover the buttons to confirm the derived hover and active states track the new brand color too.</p>

        <h3>Source</h3>
        <p>The shipped defaults live in <code>packages/style/src/theme.css</code>. Read that file when you want a starting copy with the current values to paste and edit.</p>
      </section>

      <section>
        <h2>Override scopes</h2>
        <p>The cascade gives you four scopes for any token override. Same mechanism (CSS variable plus inheritance) at every level. Specificity never fights you because variables inherit; selectors don&rsquo;t. The scenario below is the same in each example. Turn the primary brand color green. Pick the smallest scope that covers what you actually need.</p>

        <h3>Global</h3>
        <p>Set the token on <code>:root</code> in a stylesheet that loads after <code>stisla.css</code> (or in <code>@theme</code> with a build). The change applies to the whole app.</p>
        <Code lang="css" code={`
:root {
  --color-primary: oklch(0.65 0.18 149);
}
`} />

        <h3>Theme variant</h3>
        <p>Same write, scoped to a theme attribute. Toggle <code>data-theme="brand"</code> on <code>&lt;html&gt;</code> or any wrapper to switch in.</p>
        <Code lang="css" code={`
[data-theme="brand"] {
  --color-primary: oklch(0.65 0.18 149);
}
`} />

        <h3>Scoped wrapper</h3>
        <p>Define the token on a wrapper class. Every primary-tinted component inside the wrapper picks up the new value, because the variable inherits down the tree. Hover the buttons below to see hover and focus derivations track the override.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default primary</button>
  <div class="flex flex-wrap items-center gap-3" style="--color-primary: oklch(0.65 0.18 149); --color-primary-foreground: oklch(1 0 0)">
    <button type="button" class="button button--primary">Wrapper override</button>
    <button type="button" class="button button--ghost button--primary">Ghost retints too</button>
  </div>
</div>
`} />

        <h3>Single element</h3>
        <p>Write the variable inline on the element. Inline always wins on specificity, no <code>!important</code> needed.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default primary</button>
  <button type="button" class="button button--primary" style="--color-primary: oklch(0.65 0.18 149); --color-primary-foreground: oklch(1 0 0)">Inline override</button>
</div>
`} />

        <p>Pick the smallest scope that still covers what you need. A one-off brand button doesn&rsquo;t need a whole-app retheme. A multi-section dashboard doesn&rsquo;t need an inline write on every element.</p>
        <p>One more override path lives alongside the token surface: component-scoped variables (<code>--button-radius</code>, <code>--dialog-bg</code>, <code>--alert-tone</code>) that fall back to global tokens. Reach for those when you want one shape&rsquo;s knob to differ from the global default. The <Link to="/docs/styling" className="link">Styling</Link> page covers restyling existing components, and the <Link to="/docs/vanilla/optimization" className="link">Optimization</Link> page has the recipes for forking a bundle or building a custom entry.</p>
      </section>

      <section id="brand-color">
        <h2>Brand color</h2>
        <p>The most common change. A single <code>--color-primary</code> override repaints every primary-toned surface. Hover, active, focus ring, and the <code>--color-highlight</code> tint all derive from it via <code>color-mix</code> at runtime, so one value carries the whole brand. No rebuild, no second pass.</p>
        <p>Each intent also ships a paired <code>--color-&lt;intent&gt;-emphasis</code>, a darker, hand-tuned shade for the intent used as foreground marks (text, icons, links, soft chips) on a plain or tinted surface, rather than as a fill. It clears AA contrast where a runtime mix could not. Because it is a separate token, a strong retone of <code>--color-primary</code> should set <code>--color-primary-emphasis</code> too, otherwise those marks on tinted backgrounds can fall below AA contrast.</p>
        <Demo html={`
<style>
  .brand-violet {
    --color-primary: oklch(0.58 0.22 285);
    --color-primary-foreground: oklch(1 0 0);
  }
</style>
<div class="brand-violet">
  <div class="flex flex-wrap items-start gap-4">
    <div class="card w-64">
      <div class="card__header">Card title</div>
      <div class="card__body">
        <p class="card__text">A card with a header, body, and footer to show every padding and surface tier respond to the change.</p>
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" class="button button--primary">Primary</button>
          <button type="button" class="button button--outline button--neutral">Cancel</button>
        </div>
      </div>
      <div class="card__footer">
        <span class="text-sm text-muted-foreground">Footer note</span>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--primary">Primary</button>
        <button type="button" class="button button--neutral">Neutral</button>
        <button type="button" class="button button--tertiary">Tertiary</button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--outline button--primary">Outline</button>
        <button type="button" class="button button--ghost button--primary">Ghost</button>
        <button type="button" class="button button--soft button--primary">Soft</button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--primary button--sm">Small</button>
        <button type="button" class="button button--primary">Default</button>
        <button type="button" class="button button--primary button--lg">Large</button>
      </div>
    </div>
  </div>
</div>
`} />
        <Code lang="css" title="app.css" code={`
:root {
  --color-primary: oklch(0.58 0.22 285);
  --color-primary-foreground: oklch(1 0 0);
}
`} />
        <p>The same shape works for any hue. Picking one is a design decision (perceptual lightness, chroma headroom, accessibility against the foreground). A few starting points to paste and tune:</p>
        <table>
          <thead><tr><th>Brand</th><th><code>--color-primary</code></th></tr></thead>
          <tbody>
            <tr><td>Violet</td><td><code>oklch(0.58 0.22 285)</code></td></tr>
            <tr><td>Teal</td><td><code>oklch(0.65 0.13 195)</code></td></tr>
            <tr><td>Amber</td><td><code>oklch(0.78 0.16 75)</code></td></tr>
            <tr><td>Rose</td><td><code>oklch(0.65 0.21 13)</code></td></tr>
          </tbody>
        </table>
        <p>Change <code>--color-primary-foreground</code> at the same time so text on filled primary surfaces stays readable. Most brand hues pair with <code>oklch(1 0 0)</code> (pure white); a pale yellow brand would pair with a darker foreground.</p>
      </section>

      <section id="density">
        <h2>Density</h2>
        <p>One token shrinks or grows every component proportionally. Component padding, gap, and height are all multiples of the spacing base <code>--spacing</code> through the <code>--spacing()</code> helper, so changing the base reaches every spacing decision in the system at once. Chip-like components (buttons, form fields, pagination chips, navbar buttons, toggles, tabs) read their height the same way, so the box grows on both axes together.</p>
        <table>
          <thead><tr><th>Setting</th><th>Value</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td>Compact</td><td><code>0.2rem</code></td><td>Information-dense apps, admin dashboards, tabular UIs</td></tr>
            <tr><td>Default</td><td><code>0.25rem</code></td><td>General-purpose product UI</td></tr>
            <tr><td>Comfortable</td><td><code>0.28rem</code></td><td>Marketing surfaces, content-first reading flows</td></tr>
          </tbody>
        </table>
        <Demo html={`
<style>
  .compact { --spacing: 0.2rem; }
</style>
<div class="compact">
  <div class="flex flex-wrap items-start gap-4">
    <div class="card w-64">
      <div class="card__header">Card title</div>
      <div class="card__body">
        <p class="card__text">A card with a header, body, and footer to show every padding and surface tier respond to the base.</p>
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" class="button button--primary">Primary</button>
          <button type="button" class="button button--outline button--neutral">Cancel</button>
        </div>
      </div>
      <div class="card__footer">
        <span class="text-sm text-muted-foreground">Footer note</span>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--primary">Primary</button>
        <button type="button" class="button button--neutral">Neutral</button>
        <button type="button" class="button button--tertiary">Tertiary</button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--outline button--primary">Outline</button>
        <button type="button" class="button button--ghost button--primary">Ghost</button>
        <button type="button" class="button button--soft button--primary">Soft</button>
      </div>
    </div>
  </div>
</div>
`} />
        <Code lang="css" title="app.css" code={`
:root {
  --spacing: 0.2rem;
}
`} />
        <p>The base is a single length you can dial freely. <code>0.22rem</code> for a slight squeeze, <code>0.27rem</code> for a slight stretch. The whole system retunes at runtime. For tuning one component&rsquo;s size without touching the global base, see the <Link to="/docs/styling" hash="sizing-model" className="link">sizing model</Link> in Styling.</p>
      </section>

      <section id="brutalist">
        <h2>Changing several tokens at once</h2>
        <p>The changes above move one axis each. Move several together and you get a distinct look; the whole character shifts. This worked example retunes radius, shadow, border weight, border color, and typography at once, shown across a mix of surfaces so it reads as a system. Nothing here is a special &ldquo;preset&rdquo; mechanism; it&rsquo;s the same token overrides, just more of them on one wrapper.</p>
        <Demo html={`
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');
  .brutalist {
    --radius-sm:       0;
    --radius-md:       0;
    --radius-lg:       0;
    --checkbox-radius: 0;
    --shadow-sm:       6px 6px 0 var(--color-foreground);
    --shadow-md:       6px 6px 0 var(--color-foreground);
    --shadow-lg:       6px 6px 0 var(--color-foreground);
    --color-border:    var(--color-foreground);
    --st-border-width: 2px;
    --font-sans:       'Space Grotesk', system-ui, sans-serif;
    font-family: var(--font-sans);
    font-weight: 500;
  }
  .brutalist .card__header,
  .brutalist .dialog__title,
  .brutalist .drawer__title {
    font-weight: 700;
  }
</style>
<div class="brutalist">
  <div class="flex flex-col gap-4 w-full">
    <nav class="navbar w-full" style="border: var(--st-border-width) solid var(--color-border);">
      <a class="navbar__brand" href="#">Acme</a>
      <div class="navbar__menu" data-state="open">
        <ul class="navbar__nav">
          <li><a class="navbar__button" data-state="active" aria-current="page" href="#">Home</a></li>
          <li><a class="navbar__button" href="#">Pricing</a></li>
          <li><a class="navbar__button" href="#">About</a></li>
        </ul>
      </div>
    </nav>

    <div class="alert alert--warning w-full">
      <i data-lucide="alert-triangle"></i>
      <div>Storage is at 89%. Archive old runs to free space.</div>
    </div>

    <div class="flex flex-wrap items-start gap-4 w-full">
      <div class="card flex-1 min-w-48">
        <div class="card__header">Order #ATL-2918</div>
        <div class="card__body">
          <p class="card__text">Out for delivery, arrives today by 6 PM.</p>
        </div>
        <div class="card__footer">
          <button type="button" class="button button--primary button--sm">Track</button>
        </div>
      </div>

      <ul class="menu__popup static min-w-36" data-state="open" role="menu">
        <li><button type="button" class="menu__item" role="menuitem">Edit</button></li>
        <li><button type="button" class="menu__item" data-state="active" role="menuitem">Duplicate</button></li>
        <li><button type="button" class="menu__item" role="menuitem">Share</button></li>
        <li><hr class="menu__separator"></li>
        <li><button type="button" class="menu__item" data-danger role="menuitem">Delete</button></li>
      </ul>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button type="button" class="button button--primary">Confirm</button>
      <button type="button" class="button button--outline button--neutral">Cancel</button>
      <button type="button" class="button button--ghost button--danger">Delete</button>
    </div>
  </div>
</div>
`} />
        <Code lang="css" title="app.css" code={`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

.brutalist {
  --radius-sm:          0;
  --radius-md:          0;
  --radius-lg:          0;
  --checkbox-radius:    0;  /* checkbox keeps its own radius knob */
  --shadow-sm:          6px 6px 0 var(--color-foreground);
  --shadow-md:          6px 6px 0 var(--color-foreground);
  --shadow-lg:          6px 6px 0 var(--color-foreground);
  --color-border:       var(--color-foreground);
  --st-border-width:    2px;
  --font-sans:          'Space Grotesk', system-ui, sans-serif;
  font-family: var(--font-sans);
  font-weight: 500;

  & .card__header,
  & .dialog__title,
  & .drawer__title {
    font-weight: 700;
  }
}
`} />
        <p>The look comes from pushing every axis at once. Radius tiers go to zero; the shadow tiers all step up to a solid 6&nbsp;px offset tracking <code>--color-foreground</code> so it flips per theme; <code>--color-border</code> moves from the soft hairline grey to full-contrast foreground; <code>--st-border-width</code> doubles so every shape outline reads thicker; Space Grotesk replaces the neutral Inter. Typographic weight isn&rsquo;t a global token, so the heading bumps are written by class selector. The wrapper here scopes it to a region; move the same tokens to <code>:root</code> (or <code>@theme</code> with a build) to make it the app-wide default.</p>
      </section>

      <section id="dark-mode">
        <h2>Dark mode</h2>
        <p>Light and dark are deltas on the same token surface. Stisla ships a dark block that flips every surface, neutral, and interactional token; intents stay (a green button is the same green in dark mode). The dark block keys off <code>[data-theme="dark"]</code> or the <code>.dark</code> class on <code>&lt;html&gt;</code>, so React or Vue apps with localStorage-based toggling work out of the box.</p>
        <p>To roll your own dark theme, override the same tokens. You only need to redeclare what you&rsquo;re changing. Pick the way that matches your setup.</p>
        <p><strong className="text-foreground">Without a build step.</strong> Write the override under the dark selectors directly.</p>
        <Code lang="css" code={`
[data-theme="dark"],
.dark {
  --color-background:    /* your dark background */;
  --color-foreground:    /* your dark foreground */;
  --color-surface:       /* ... */;
  /* override any surface, neutral, or interactional token here;
     intents (--color-primary, --color-success, ...) stay across themes */
}
`} />
        <p><strong className="text-foreground">With Vite and Tailwind.</strong> Use the registered <code>dark</code> variant instead of hand-writing the selector. It compiles to the same <code>[data-theme="dark"] / .dark</code> rule.</p>
        <Code lang="css" code={`
:root {
  @variant dark {
    --color-background: /* your dark background */;
    --color-foreground: /* your dark foreground */;
    --color-surface:    /* ... */;
  }
}
`} />
        <p>Two tokens stay theme-independent on purpose. <code>--color-warning-foreground</code> keeps a dark cap because yellow stays yellow and text on it should stay dark in both modes. <code>--color-overlay</code> and <code>--color-overlay-foreground</code> stay constant because they paint chrome on top of imagery, which can be anything.</p>
        <p>To remember the choice and avoid a flash of the wrong theme on load, store the preference and apply it before the stylesheet renders, in a small inline script at the top of <code>&lt;head&gt;</code>.</p>
        <Code lang="html" code={`
<head>
  <script>
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  </script>
  <link rel="stylesheet" href="stisla.css">
</head>
`} />
        <p>Your toggle then sets the same attribute and writes the choice back.</p>
        <Code lang="js" code={`
function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}
`} />
      </section>
    </>
  );
}
