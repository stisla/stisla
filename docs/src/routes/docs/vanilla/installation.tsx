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
        <p className="lead">
          Stisla ships in two pieces. A stylesheet and a small JS runtime. Drop
          them in from a CDN, or install from a package manager. Each is one file
          with every component; for a smaller subset, the{" "}
          <Link to="/docs/vanilla/optimization" className="link">
            Optimization
          </Link>{" "}
          page compiles from source.
        </p>
      </header>

      <section>
        <h2>The two pieces</h2>
        <p>
          The stylesheet, <code>@stisla/css</code>, is precompiled and
          framework-agnostic. The runtime, <code>@stisla/vanilla</code>, drives
          the interactive components from <code>data-stisla-*</code> markup. Each
          is a single file that ships every component, <code>stisla.css</code>{" "}
          and <code>stisla.js</code>. Install both pieces at the same version.
        </p>
        <p>
          Three components (carousel, combobox, scroll-area) carry a third-party
          library. They ship in the bundle like everything else, so nothing extra
          is needed to use them. If you want their libraries left out, the{" "}
          <Link to="/docs/vanilla/optimization" className="link">
            Optimization
          </Link>{" "}
          page compiles a subset from source.
        </p>
      </section>

      <section>
        <h2>Using CDN</h2>
        <p>
          No build step. Drop the two files into a plain HTML page: the
          stylesheet in the <code>&lt;head&gt;</code>, the runtime at the end of
          the <code>&lt;body&gt;</code>. They cover every component.
        </p>
        <Code
          title="index.html"
          code={`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Stisla starter</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@3/dist/stisla.css">
  </head>
  <body>
    <button type="button" class="button button--primary">Hello</button>

    <script src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@3/dist/stisla.js"></script>
  </body>
</html>
`}
        />
        <p>
          The runtime is a classic script. It exposes{" "}
          <code>window.Stisla</code> and auto-initializes any{" "}
          <code>data-stisla-*</code> markup already in the page, so it carries
          no <code>type="module"</code>.
        </p>

        <p>
          The <code>@3</code> tag tracks the latest 3.x release. Pin an exact
          version instead for fully reproducible builds.
        </p>
      </section>

      <section>
        <h2>Using package manager</h2>
        <p>The same pieces, resolved and bundled by your build tool.</p>
        <Code
          lang="bash"
          code={`
npm install @stisla/css @stisla/vanilla
`}
        />

        <p>
          Import the stylesheet and the runtime once at your app entry. That
          covers every component.
        </p>
        <Code
          lang="js"
          title="main.js"
          code={`
import '@stisla/css';
import '@stisla/vanilla';
`}
        />
        <p>
          Once the runtime is loaded, the{" "}
          <Link to="/docs/vanilla/javascript" className="link">
            JavaScript
          </Link>{" "}
          page covers driving components from markup or from JS.
        </p>
      </section>

      <section>
        <h2>Components that carry a library</h2>
        <p>
          Three components pull in a third-party library, which is most of the
          runtime&rsquo;s weight. They ship in the bundle like everything else, so
          nothing extra is needed to use them. If you don&rsquo;t use them and want
          their libraries left out, compile a subset from the{" "}
          <Link to="/docs/vanilla/optimization" className="link">
            style source
          </Link>
          .
        </p>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th width="30%">Library</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link to="/docs/vanilla/carousel" className="link">
                  Carousel
                </Link>
              </td>
              <td>Embla</td>
            </tr>
            <tr>
              <td>
                <Link to="/docs/vanilla/combobox" className="link">
                  Combobox
                </Link>{" "}
                (searchable, multi-select, tagging)
              </td>
              <td>Tom Select</td>
            </tr>
            <tr>
              <td>
                <Link to="/docs/vanilla/scroll-area" className="link">
                  Scroll area
                </Link>{" "}
                (custom scrollbars)
              </td>
              <td>OverlayScrollbars</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Browser support</h2>
        <p>
          Safari 16.4 or newer, Chrome 111 or newer, and Firefox 121 or newer.
          No polyfills. The features Stisla relies on (OKLCH,{" "}
          <code>color-mix</code>, <code>:has()</code>, <code>@layer</code>,
          container queries, <code>inert</code>) are stable across that range.
          If you need to support older browsers, falling back to an earlier
          version of the framework won&rsquo;t help, because the runtime token
          surface is what makes Stisla what it is.
        </p>
      </section>

      <section>
        <h2>What&rsquo;s next</h2>
        <p>
          Learn how{" "}
          <Link to="/docs/vanilla/javascript" className="link">
            JavaScript
          </Link>{" "}
          wires up components, pick a{" "}
          <Link to="/docs/theming" hash="brand-color" className="link">
            primary color
          </Link>
          , or jump straight into the{" "}
          <Link to="/docs/vanilla/button" className="link">
            component pages
          </Link>
          .
        </p>
      </section>
    </>
  );
}
