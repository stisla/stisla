import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/vanilla/optimization")({
  component: OptimizationDocs,
});

function OptimizationDocs() {
  return (
    <>
      <header>
        <h1>Optimization</h1>
        <p className="lead">Two ways to shrink what you ship. Purge against rendered HTML, or build from the style source.</p>
      </header>

      <section>
        <h2>Starting point</h2>
        <p>The pre-compiled core bundle is the right default for most apps. These are approximate gzipped sizes for <code>@stisla/css</code> and <code>@stisla/vanilla</code> core.</p>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Gzip</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>stisla.css</code> (core, all standard components)</td>
              <td>~24 KB</td>
            </tr>
            <tr>
              <td><code>stisla-full.css</code> (core + carousel, combobox, scroll-area)</td>
              <td>~27 KB</td>
            </tr>
            <tr>
              <td><code>stisla.js</code> (core runtime)</td>
              <td>~35 KB</td>
            </tr>
            <tr>
              <td><code>stisla-full.js</code> (core + optional components)</td>
              <td>~90 KB</td>
            </tr>
          </tbody>
        </table>
        <p>The JS size difference between core and full is large because the optional components bundle their own 3rd-party libraries (Embla, Tom Select, OverlayScrollbars). If you don&rsquo;t use all three, load core and add optionals individually. The CSS difference is small enough that most apps can take full without concern.</p>
      </section>

      <section>
        <h2>Lever 1. Purge against rendered HTML</h2>
        <p>This is the cheapest win. A typical app uses 30 to 40 percent of the BEM classes Stisla ships. PurgeCSS scans your rendered output, drops the selectors you never reference, and leaves the rest of the cascade intact.</p>

        <Code lang="js" title="purge.config.js" code={`
import { PurgeCSS } from 'purgecss';

const result = await new PurgeCSS().purge({
  content: ['dist/**/*.html', 'src/**/*.{js,ts,jsx,tsx,vue}'],
  css: ['node_modules/@stisla/css/dist/stisla.css'],
  safelist: {
    standard: [/^data-state/, /^data-theme/, /^data-stisla/],
    deep: [/^sidebar__/, /^dialog__/, /^drawer__/, /^menu__/],
    greedy: [/^data-/],
  },
});

await fs.writeFile('dist/stisla.purged.css', result[0].css);
`} />
        <p>The <code>safelist</code> matters. Stisla uses data attributes for runtime state (<code>data-state="open"</code>, <code>data-state="active"</code>) and BEM children that JavaScript adds dynamically. PurgeCSS only sees what&rsquo;s in your static templates, so attribute selectors and BEM children added at runtime need to be listed by pattern.</p>
        <p>Measure before and after. The win depends on how many components your app touches. A dashboard that uses overlays, tables, and forms might purge down to 60 KB raw. A landing page with one button and one card might purge down to 20 KB raw.</p>
      </section>

      <section>
        <h2>Lever 2. Build from source</h2>
        <p>If you know which components you need up front, or your tokens or breakpoints diverge from the defaults, build your own stylesheet from <code>@stisla/style</code>. It ships the raw CSS source for every component alongside the Tailwind <code>@theme</code> foundation, so you import only what you use and the rest never enters the build. This is the only way to drop core components, since the precompiled bundles are core, full, and the optional add-ons.</p>
        <Code lang="css" title="styles/your-app.css" code={`
@import "tailwindcss";
@import "@stisla/style/theme.css";

/* Import only the components you use. */
@import "@stisla/style/src/button/button.css";
@import "@stisla/style/src/input/input.css";
@import "@stisla/style/src/field/field.css";
@import "@stisla/style/src/card/card.css";
@import "@stisla/style/src/alert/alert.css";

/* Optionals are imported from source the same way, if you want them. */
/* @import "@stisla/style/src/carousel/carousel.css"; */
`} />
        <p>Anything you don&rsquo;t import is absent from the output and from your dependency tree, not just purged out of it. Pair it with Lever 1 for a purge pass on top, dropping unreached BEM children inside the components you kept.</p>
        <p>Building from source also lets you bake token values into the cascade at compile time instead of mixing them at runtime. For a single locked theme that can shrink the token surface and remove the runtime <code>var()</code> chain, at the cost of runtime overrides: the theme is frozen at build time, so a <code>--color-primary</code> override on a wrapper no longer flows through.</p>
      </section>

      <section>
        <h2>Which lever, when</h2>
        <ul>
          <li><strong>Lever 1 if you don&rsquo;t know which components you use.</strong> Most teams don&rsquo;t. Start from a precompiled bundle, and the scanner ships what&rsquo;s reached.</li>
          <li><strong>Lever 2 if you do, or if the defaults are wrong for you.</strong> Importing from source removes component code from the build entirely, and it&rsquo;s the only path that drops core components or bakes tokens at compile time.</li>
        </ul>
        <p>Most apps need at most one. If you find yourself reaching for both, the <Link to="/docs/customization" className="link">Customization</Link> page might have a lighter path.</p>
      </section>
    </>
  );
}
