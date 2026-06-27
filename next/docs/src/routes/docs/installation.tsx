import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/installation")({
  component: InstallationDocs,
});

function InstallationDocs() {
  return (
    <>
      <header>
        <h1>Installation</h1>
        <p className="lead">Stisla ships in two pieces. A universal stylesheet and a vanilla JS runtime. Drop them in via CDN, install from a package manager, or fork the Sass source.</p>
      </header>

      <section>
        <h2>Using CDN</h2>
        <p>No build step. Drop the bundles into a plain HTML page. If you&rsquo;re not sure whether to pick Core or Full, <a className="link" href="#bundle-comparison">Bundle comparison</a> has the side-by-side.</p>

        <h3>Core</h3>
        <p>Two tags. One for the core stylesheet in the <code>&lt;head&gt;</code>, one for the runtime at the end of the <code>&lt;body&gt;</code>. That covers every component except the optional ones.</p>
        <Code title="index.html" code={`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Stisla starter</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/stisla.css">
  </head>
  <body>
    <button type="button" class="btn btn--primary">Hello</button>

    <script type="module" src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/stisla.js"></script>
  </body>
</html>
`} />

        <h3>Full</h3>
        <p>The same two tags, swapped to the <code>-full</code> filenames. You get every component, optionals included, with no extra setup.</p>
        <Code code={`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/stisla-full.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/stisla-full.js"></script>
`} />

        <h3>Core plus individual optionals</h3>
        <p>Load the core bundle and tack on the optional components you actually use. Each optional ships its own CSS and JS file under <code>dist/components/</code>, next to the main bundle.</p>
        <Code code={`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/stisla.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/components/carousel.css">

<script type="module" src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/stisla.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/components/carousel.js"></script>
`} />

        <p>The <code>@beta</code> tag follows the latest pre-release. Once 3.0.0 stable ships, swap to <code>@3</code> for the latest 3.x release. Pin to an exact version like <code>@3.0.0-beta.2</code> for reproducible builds.</p>
      </section>

      <section>
        <h2>Using package manager</h2>
        <p>The same two bundles, installed and bundled by your tool of choice. Stisla ships two scoped packages. <code>@stisla/css</code> holds the universal stylesheet, and <code>@stisla/vanilla</code> is the JS runtime that drives it.</p>
        <Code lang="bash" code={`
npm install @stisla/css @stisla/vanilla
`} />
        <p>The two packages share a version. <code>@stisla/vanilla</code> declares <code>@stisla/css</code> as a peer dependency pinned to the matching version, so if the pair doesn&rsquo;t match you find out at install time instead of silently at runtime.</p>

        <h3>Core</h3>
        <p>Import the core CSS and the core runtime once at your app entry. That covers every component except the optional ones. Your bundler resolves both to the pre-compiled files inside each package.</p>
        <Code lang="js" title="main.js" code={`
import '@stisla/css';
import '@stisla/vanilla';
`} />

        <h3>Full</h3>
        <p>The same two imports, with <code>/full</code> on each subpath. You get every component, optionals included, with no extra setup.</p>
        <Code lang="js" code={`
import '@stisla/css/full';
import '@stisla/vanilla/full';
`} />

        <h3>Core plus individual optionals</h3>
        <p>Start from core and add one extra import per optional component you actually use. The bundle stays small for everything you skip, and tree-shaking handles the rest.</p>
        <Code lang="js" code={`
import '@stisla/css';
import '@stisla/vanilla';

import '@stisla/css/components/carousel';
import '@stisla/vanilla/components/carousel';
`} />

        <p>Once you have the bundle loaded, head to the <Link to="/docs/javascript" className="link">JavaScript</Link> page for how to drive components from markup or from JS.</p>
      </section>

      <section>
        <h2>Custom bundle</h2>
        <p>The package ships the raw Sass source alongside the compiled CSS. Compose your own bundle when you want custom breakpoints, want to drop components you never use, or are forking a partial to rewrite it.</p>
        <Code lang="scss" title="your-app.scss" code={`
@layer foundation, theme, components, utilities;

@layer foundation {
  @import '@stisla/css/scss/foundation/reboot';
}
@layer components {
  @import '@stisla/css/scss/components/btn';
  @import '@stisla/css/scss/components/dialog';
  // ...add only what you actually use
}
`} />
        <p>The <Link to="/docs/optimization" className="link">Optimization</Link> page walks through the fork-and-drop recipe with real before/after byte counts.</p>
      </section>

      <section>
        <h2>Bundle comparison</h2>
        <p>Stisla ships two compiled bundles. They share the same package and only differ in which entry file you import. Picking one isn&rsquo;t a permanent choice; if you start with Core and later want an optional component, you add it with two extra imports.</p>

        <h3>Size</h3>
        <table>
          <thead>
            <tr>
              <th>Bundle</th>
              <th width="30%">Gzip CSS + JS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Core.</strong> Every component except the optional ones.</td>
              <td>~29 KB + ~32 KB</td>
            </tr>
            <tr>
              <td><strong>Full.</strong> Core plus every optional component in one drop-in file.</td>
              <td>~32 KB + ~76 KB</td>
            </tr>
          </tbody>
        </table>

        <h3>What&rsquo;s included</h3>
        <p>Both bundles include every standard component (button, input, dialog, drawer, tabs, accordion, slider, select, autocomplete, and the rest). They only differ on the optional ones.</p>
        <table>
          <thead>
            <tr>
              <th>Optional component</th>
              <th width="10%">Core</th>
              <th width="10%">Full</th>
              <th width="25%">Individual (gzip CSS + JS)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><Link to="/docs/vanilla/carousel" className="link">Carousel</Link></td>
              <td>No</td>
              <td>Yes</td>
              <td>~1 KB + ~9 KB</td>
            </tr>
            <tr>
              <td><Link to="/docs/vanilla/combobox" className="link">Combobox</Link> (searchable select with multi-select and tagging)</td>
              <td>No</td>
              <td>Yes</td>
              <td>~2 KB + ~16 KB</td>
            </tr>
            <tr>
              <td><Link to="/docs/vanilla/scroll-area" className="link">Scroll area</Link> (custom-styled scrollbars)</td>
              <td>No</td>
              <td>Yes</td>
              <td>&lt;1 KB + ~18 KB</td>
            </tr>
          </tbody>
        </table>

        <h3>Adding an optional later</h3>
        <p>Each optional ships as its own CSS and JS file under <code>dist/components/</code>. Pulling combobox on top of Core means two extra lines, whether you load via CDN or via a bundler.</p>
        <Code code={`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/components/combobox.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/components/combobox.js"></script>
`} />
        <Code lang="js" code={`
import '@stisla/css/components/combobox';
import '@stisla/vanilla/components/combobox';
`} />
        <p>Every optional follows the same pattern. You don&rsquo;t need to swap bundles or rebuild the rest of your setup. The full Core-plus-optional examples live in <a className="link" href="#using-cdn">Using CDN</a> and <a className="link" href="#using-package-manager">Using package manager</a>.</p>
      </section>

      <section>
        <h2>Browser support</h2>
        <p>Safari 16.4 or newer, Chrome 111 or newer, and Firefox 121 or newer. No polyfills. The features Stisla relies on (OKLCH, <code>color-mix</code>, <code>:has()</code>, <code>@layer</code>, container queries, <code>inert</code>) are stable across that range. If you need to support older browsers, falling back to an earlier version of the framework won&rsquo;t help, because the runtime token surface is what makes Stisla what it is.</p>
      </section>

      <section>
        <h2>What&rsquo;s next</h2>
        <p>Learn how <Link to="/docs/javascript" className="link">JavaScript</Link> wires up components, pick a <Link to="/docs/customization" className="link">primary color</Link>, or jump straight into the <Link to="/docs/vanilla/button" className="link">component pages</Link>.</p>
      </section>
    </>
  );
}
