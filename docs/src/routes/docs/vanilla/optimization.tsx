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
        <p className="lead">The precompiled bundle ships every component, and for most apps that is the right default. When you need to ship less, there are two ways to get there: purge the classes you never use, or compile a custom build that contains only the components you import.</p>
      </header>

      <section>
        <h2>Starting point</h2>
        <p>What you link from <code>@stisla/css</code> and <code>@stisla/vanilla</code> is precompiled and ready to use. The stylesheet is plain CSS with no build step, and the runtime is already bundled. These are approximate gzipped sizes for the single bundle each ships.</p>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Gzip</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>stisla.css</code> (every component)</td>
              <td>~27 KB</td>
            </tr>
            <tr>
              <td><code>stisla.js</code> (every component)</td>
              <td>~90 KB</td>
            </tr>
          </tbody>
        </table>
        <p>Most of the JS weight comes from three components that carry a third-party library (Carousel uses Embla, Combobox uses Tom Select, Scroll area uses OverlayScrollbars). The CSS is small enough that most apps can take the whole bundle without concern. Both approaches below trade the no-build convenience for a smaller result, so each one adds a build step.</p>
      </section>

      <section>
        <h2>PurgeCSS</h2>
        <p>PurgeCSS scans your rendered HTML and templates, then deletes the CSS selectors you never reference. You keep linking the precompiled <code>stisla.css</code> and run a purge pass over it as a build step, so the output is the same bundle with the unreached rules stripped out.</p>
        <p>Reach for it when you don&rsquo;t know up front which components you use, which is most teams. It is the cheapest win. A typical app references 30 to 40 percent of the BEM classes Stisla ships, and the rest drops away. Point it at your content and the bundle, and safelist the classes that only appear at runtime.</p>
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
        <p>The <code>safelist</code> is the part that matters. Stisla uses data attributes for runtime state (<code>data-state="open"</code>, <code>data-state="active"</code>) and BEM children that JavaScript adds to the DOM after load. PurgeCSS only sees what is in your static templates, so those attribute selectors and runtime-added children have to be listed by pattern or they get purged with everything else. Measure before and after, since the win depends on how many components your app actually touches.</p>
      </section>

      <section id="custom-build">
        <h2>Custom build</h2>
        <p>Instead of linking the precompiled bundle, you compile your own stylesheet from <code>@stisla/style</code> and import only the components you use. Where <code>@stisla/css</code> is precompiled, <code>@stisla/style</code> ships the <strong>raw</strong> CSS source for every component (Tailwind-dependent, so it has to be compiled) alongside the Tailwind <code>@theme</code> foundation. Anything you don&rsquo;t import never enters the output and never enters your dependency tree, so this is not a purge of dead rules but an absence of them.</p>
        <p>This is the only way to ship a subset, since the precompiled bundle is everything. It also lets you bake token values into the cascade at compile time instead of resolving them through <code>var()</code> at runtime, which shrinks the token surface for a single locked theme. The cost is that runtime overrides no longer flow through, so a <code>--color-primary</code> set on a wrapper stops cascading once the theme is frozen at build time.</p>
        <p>Install Tailwind and the style source.</p>
        <Code lang="bash" code={`
npm install -D tailwindcss @tailwindcss/cli
npm install @stisla/style
`} />
        <p>Author one input stylesheet. Pull in Tailwind, then the token theme, then the components you want. List them individually for a subset, or use the <code>components.css</code> barrel to pull in every component behind one line.</p>
        <Code lang="css" title="app.css" code={`
@import "tailwindcss";
@import "@stisla/style/theme.css";

/* Only the components you use: */
@import "@stisla/style/button.css";
@import "@stisla/style/input.css";
@import "@stisla/style/field.css";
@import "@stisla/style/card.css";

/* ...or every component in one line: */
/* @import "@stisla/style/components.css"; */
`} />
        <p>Compile it with the Tailwind CLI, watching for changes during development.</p>
        <Code lang="bash" code={`
npx @tailwindcss/cli -i app.css -o dist/app.css --watch
`} />
        <p>Link the compiled output the same way you would the bundle.</p>
        <Code lang="html" code={`
<link rel="stylesheet" href="dist/app.css">
`} />
        <p>Pulling Tailwind in here also brings the utility classes you arrange components with, so this one build covers both the components and the layout surface. The <Link to="/docs/vanilla/utilities" className="link">Utilities</Link> page walks through that setup, and it is the same build path the <Link to="/docs/theming" hash="setting-up-overrides" className="link">Theming</Link> and <Link to="/docs/styling" className="link">Styling</Link> pages refer to. Pair it with PurgeCSS on top if you also want to drop unreached BEM children inside the components you kept.</p>
      </section>

      <section>
        <h2>Custom build for the runtime</h2>
        <p>The same idea applies to <code>@stisla/vanilla</code>. The default entry registers every component, which is what pulls in the three third-party libraries whether you use them or not. The package also ships each component as a <strong>raw</strong> ESM module, so from the same <code>@stisla/vanilla</code> install you can skip the default entry, import only the components you use, register them, and run the scan once. Your bundler compiles and tree-shakes the result.</p>
        <Code lang="js" title="stisla-runtime.js" code={`
import { register, init } from '@stisla/vanilla/core/init.js';
import { Dialog } from '@stisla/vanilla/components/dialog.js';
import { Tabs } from '@stisla/vanilla/components/tabs.js';
import { Toast } from '@stisla/vanilla/components/toast.js';

register('dialog', Dialog);
register('tabs', Tabs);
register('toast', Toast);

init(); // walk the DOM and wire up [data-stisla-*] markup
`} />
        <p>Each module name matches the <code>data-stisla-&lt;name&gt;</code> attribute it drives. Leaving out the three library-backed components (carousel, combobox, scroll-area) keeps their libraries out of the bundle, which is where most of the runtime weight lives.</p>
      </section>

      <section>
        <h2>Which one</h2>
        <ul>
          <li><strong>PurgeCSS if you don&rsquo;t know which components you use.</strong> Most teams don&rsquo;t. Keep a precompiled bundle and ship what your markup reaches.</li>
          <li><strong>Custom build if you do, or if the defaults are wrong for you.</strong> It removes component code from the build entirely, and it is the only path that ships a subset or bakes tokens at compile time.</li>
        </ul>
        <p>Most apps need at most one. Framework apps (React, Vue) almost always land on a custom build, because they already run a build and import Tailwind once at the root, so the components and the utility surface come from the same step.</p>
      </section>
    </>
  );
}
