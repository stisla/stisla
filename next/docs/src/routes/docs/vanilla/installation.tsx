import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/vanilla/installation")({
  component: InstallationDocs,
});

function InstallationDocs() {
  return (
    <>
      <header>
        <h1>Installation</h1>
        <p className="lead">Stisla ships in two pieces. A stylesheet and a small JS runtime. Drop them in from a CDN, or install from a package manager. For a build smaller than core, the <Link to="/docs/vanilla/optimization" className="link">Optimization</Link> page compiles from source.</p>
      </header>

      <section>
        <h2>The two pieces</h2>
        <p>The stylesheet, <code>@stisla/css</code>, is precompiled and framework-agnostic. The runtime, <code>@stisla/vanilla</code>, drives the interactive components from <code>data-stisla-*</code> markup. Both come in the same three flavors: a <strong>core</strong> bundle with every standard component, a <strong>full</strong> bundle that adds the three optional components, and the three <strong>optionals</strong> as individual add-ons you drop on top of core. Install both pieces at the same version.</p>
        <p>The three optionals (carousel, combobox, scroll-area) are the only components that carry a third-party library, so they stay out of core to keep it light. Pick core and add the ones you need, or take full and get everything.</p>
      </section>

      <section>
        <h2>Using CDN</h2>
        <p>No build step. Drop the bundles into a plain HTML page. Pick the core or full stylesheet (<a className="link" href="#bundle-comparison">Bundle comparison</a> has the difference), then load the matching runtime once.</p>

        <h3>Core</h3>
        <p>The core stylesheet in the <code>&lt;head&gt;</code>, the runtime at the end of the <code>&lt;body&gt;</code>. That covers every component except the optional three.</p>
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
    <button type="button" class="button button--primary">Hello</button>

    <script src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/stisla.js"></script>
  </body>
</html>
`} />
        <p>The runtime is a classic script, not a module. It exposes <code>window.Stisla</code> and auto-initializes any <code>data-stisla-*</code> markup already in the page, so it carries no <code>type="module"</code>.</p>

        <h3>Full</h3>
        <p>Swap both files to the <code>-full</code> names to add the optional components.</p>
        <Code code={`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/stisla-full.css">
<script src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/stisla-full.js"></script>
`} />

        <h3>Core plus individual optionals</h3>
        <p>Load core and add only the optionals you use. Each one ships its own CSS and JS file, so it is two extra tags on top of the core pair.</p>
        <Code code={`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/stisla.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/carousel.css">

<script src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/stisla.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/carousel.js"></script>
`} />
        <p>Order the add-on script after <code>stisla.js</code>. It registers its component and re-scans the page, so the carousel markup wires up the same way it would in the full bundle.</p>

        <p>The <code>@beta</code> tag follows the latest pre-release. Once 3.0 is stable, switch to <code>@3</code> for the latest 3.x, or pin an exact version for reproducible builds.</p>
      </section>

      <section>
        <h2>Using package manager</h2>
        <p>The same pieces, resolved and bundled by your build tool.</p>
        <Code lang="bash" code={`
npm install @stisla/css @stisla/vanilla
`} />

        <h3>Core</h3>
        <p>Import the core stylesheet and the core runtime once at your app entry. That covers every component except the optional three.</p>
        <Code lang="js" title="main.js" code={`
import '@stisla/css';
import '@stisla/vanilla';
`} />

        <h3>Full</h3>
        <p>The same two imports with <code>/full</code> on each, for every component including the optionals.</p>
        <Code lang="js" code={`
import '@stisla/css/full';
import '@stisla/vanilla/full';
`} />

        <h3>Core plus individual optionals</h3>
        <p>Start from core and add one import pair per optional you use. The components you skip stay out of the bundle.</p>
        <Code lang="js" code={`
import '@stisla/css';
import '@stisla/vanilla';

import '@stisla/css/carousel';
import '@stisla/vanilla/carousel';
`} />
        <p>Once the runtime is loaded, the <Link to="/docs/vanilla/javascript" className="link">JavaScript</Link> page covers driving components from markup or from JS.</p>
      </section>

      <section>
        <h2>Bundle comparison</h2>
        <p>Core and full share every standard component (button, input, dialog, drawer, tabs, accordion, slider, select, autocomplete, and the rest). They differ only on the three optional components, the ones that pull in a third-party library. Each optional is also available on its own, as a CSS and a JS file you add on top of core.</p>
        <table>
          <thead>
            <tr>
              <th>Optional component</th>
              <th width="10%">Core</th>
              <th width="10%">Full</th>
              <th width="30%">Library</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><Link to="/docs/vanilla/carousel" className="link">Carousel</Link></td>
              <td>No</td>
              <td>Yes</td>
              <td>Embla</td>
            </tr>
            <tr>
              <td><Link to="/docs/vanilla/combobox" className="link">Combobox</Link> (searchable, multi-select, tagging)</td>
              <td>No</td>
              <td>Yes</td>
              <td>Tom Select</td>
            </tr>
            <tr>
              <td><Link to="/docs/vanilla/scroll-area" className="link">Scroll area</Link> (custom scrollbars)</td>
              <td>No</td>
              <td>Yes</td>
              <td>OverlayScrollbars</td>
            </tr>
          </tbody>
        </table>
        <p>Picking core isn&rsquo;t permanent. Add an optional later with its two extra files, switch to full for all three at once, or compile a stylesheet with exactly the components you use from the <Link to="/docs/vanilla/optimization" className="link">style source</Link> when you want to drop core components too.</p>
      </section>

      <section>
        <h2>Browser support</h2>
        <p>Safari 16.4 or newer, Chrome 111 or newer, and Firefox 121 or newer. No polyfills. The features Stisla relies on (OKLCH, <code>color-mix</code>, <code>:has()</code>, <code>@layer</code>, container queries, <code>inert</code>) are stable across that range. If you need to support older browsers, falling back to an earlier version of the framework won&rsquo;t help, because the runtime token surface is what makes Stisla what it is.</p>
      </section>

      <section>
        <h2>What&rsquo;s next</h2>
        <p>Learn how <Link to="/docs/vanilla/javascript" className="link">JavaScript</Link> wires up components, pick a <Link to="/docs/customization" className="link">primary color</Link>, or jump straight into the <Link to="/docs/vanilla/button" className="link">component pages</Link>.</p>
      </section>
    </>
  );
}
