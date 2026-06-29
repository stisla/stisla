import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/contributing")({
  component: ContributingDocs,
});

function ContributingDocs() {
  return (
    <>
      <header>
        <h1>Contributing</h1>
        <p className="lead">How the repo is laid out, how to run it locally, and how to add a component or a customization variable.</p>
      </header>

      <section>
        <h2>Repo layout</h2>
        <p>Everything lives under <code>next/</code>. The top-level <code>src/</code> tree is the v2 Bootstrap release on the <code>master</code> branch and is not actively maintained.</p>
        <Code lang="text" code={`
next/
  packages/
    tokens/src/
      theme.css          Tailwind @theme tokens (--color-* + --st-border-width)
    style/src/
      theme.css          Tailwind @theme foundation (light + dark block)
      <name>/<name>.css  one BEM CSS file per component block (~52 total)
      <name>/<name>.<lib>.css  lib adapter (e.g. combobox.tomselect.css)
      composer.ts        pure (variantProps, tune) → { className, style }
      index.ts           re-exports
    css/
      package.json       pre-compiled @stisla/css bundle (built from style/)
    vanilla/src/
      core/              component.js, init.js, transition.js, inert.js
      components/        one .js file per interactive component
      index.js           core entry (all except optional 3)
      index-full.js      full entry (core + carousel + combobox + scroll-area)
      carousel.js        optional add-on entry (also combobox.js, scroll-area.js)
    react/src/
      <name>/index.tsx   React wrappers, one per component
      index.ts           re-exports
    vue/                 stub (planned)
  docs/src/              TanStack Start docs site
    routes/docs/
      vanilla/           one .tsx per component
      react/             one .tsx per component (in progress)
    demo/                Demo, Code, DemoFrame, and demo CSS
`} />
      </section>

      <section>
        <h2>Running locally</h2>
        <p>Node 20 or newer, pnpm 9 or newer.</p>
        <Code lang="bash" code={`git clone https://github.com/stisla/stisla.git
cd stisla/next/docs
pnpm install
pnpm dev`} />
        <p>The dev server starts Vite at <code>localhost:5173</code>. CSS rebuilds on save via Tailwind v4&rsquo;s HMR. The vanilla IIFE bundle is built inline by a Vite plugin and hot-reloads into demo iframes automatically.</p>
        <p>To run the token checker across all component files:</p>
        <Code lang="bash" code={`cd next
pnpm check`} />
        <p>This catches undeclared token references, missing <code>--component-*</code> fallbacks, and literal values that should be token refs. Run it before opening a PR.</p>
      </section>

      <section>
        <h2>Adding a component</h2>
        <p>Each component is one CSS file, one optional JS file, and one docs page. The scaffold command sets up the files and wires the nav entry.</p>
        <Code lang="bash" code={`cd next
pnpm scaffold <name>`} />

        <h3>1. Write the CSS</h3>
        <p>The scaffold creates <code>next/packages/style/src/&lt;name&gt;/&lt;name&gt;.css</code>. BEM names follow <code>.block</code>, <code>.block__element</code>, <code>.block--modifier</code>. Lowercase, hyphen-separated. Multiple modifiers stack flat on the root and never nest.</p>
        <p>Read tokens via fallback-default variables. This keeps the knob overridable from any scope without specificity fights.</p>
        <Code lang="css" code={`
.my-thing {
  border-radius: var(--my-thing-radius, var(--radius-md));
  padding: var(--my-thing-padding, --spacing(3) --spacing(4));
  background: var(--my-thing-bg, var(--color-surface));
}
`} />
        <p>Use <code>--spacing(n)</code> for padding, gap, and heights so the component tracks the global density knob. Layout widths and animation anchors can stay as literal <code>rem</code> values.</p>
        <p>Derive states with <code>color-mix(in oklch, &hellip;)</code> so overriding the base hue automatically repaints hover and active.</p>
        <Code lang="css" code={`
.my-thing:hover  { --my-thing-bg: color-mix(in oklch, var(--my-thing-tone) 88%, black); }
.my-thing:active { --my-thing-bg: color-mix(in oklch, var(--my-thing-tone) 78%, black); }
`} />
        <p>Register the component CSS in <code>next/docs/src/demo/demo.css</code> so the demo iframes pick it up. The scaffold adds the import automatically.</p>

        <h3>2. Write the behavior (if any)</h3>
        <p>If the component needs JavaScript, add <code>next/packages/vanilla/src/components/my-thing.js</code>. Export a class with a constructor that takes a root element, a <code>.destroy()</code> method, and DOM custom events for its lifecycle (<code>stisla:my-thing:opened</code>, <code>stisla:my-thing:closed</code>).</p>
        <p>Register it in <code>next/packages/vanilla/src/index.js</code> so <code>Stisla.init()</code> scans for it.</p>
        <p>For state hooks, use <code>[data-state="open"]</code> for open/closed concepts, <code>[data-state="active"]</code> for selected/current, and <code>data-&lt;concept&gt;</code> for Stisla-original states (<code>[data-collapsed]</code>, <code>[data-shaking]</code>). No <code>.is-*</code> classes. The CSS reads from the attribute; the JS writes it.</p>

        <h3>3. Write the docs page</h3>
        <p>Add <code>next/docs/src/routes/docs/vanilla/my-thing.tsx</code>. Cover every variant and every state. Rest, hover (a sentence is enough), focus, active, disabled, and invalid where applicable.</p>
        <p>Use <code>&lt;Demo&gt;</code> for live previews and <code>&lt;Code&gt;</code> for copyable snippets. One snippet per demo drives both the live render and the shown code.</p>
        <Code lang="tsx" code={`
import { Demo } from '~/demo/Demo';
import { Code } from '~/demo/Code';

<Demo html={\`
<button type="button" class="my-thing">Hello</button>
\`} />
`} />
        <p>Page structure: a <code>&lt;header&gt;</code> with <code>&lt;h1&gt;</code> and a short lead, then one <code>&lt;section&gt;</code> per topic. End with a Customization section. The <Link to="/docs/vanilla/slider" className="link">Slider</Link> page is the reference shape.</p>

        <h3>4. Verify</h3>
        <Code lang="bash" code={`cd next
pnpm check     # token linter
pnpm build     # confirm the docs site builds clean`} />
        <p>Check the demo page at 320, 768, and 1280 px under both light and dark.</p>
      </section>

      <section>
        <h2>Adding a customization variable</h2>
        <p>Component-scoped variables open up a knob without touching the spec. Pick a hyphenated name under the block prefix: <code>--button-radius</code>, <code>--slider-thumb-width</code>, <code>--card-padding</code>.</p>
        <p>Default to a global token via fallback when the knob is a global concept. Default to a literal when the knob is component-private.</p>
        <Code lang="css" title="next/packages/style/src/my-thing/my-thing.css" code={`.my-thing {
  /* Component-private default. */
  --my-thing-thumb-width: 0.5rem;

  /* Falls back to the global scale token, so overriding --radius-md
     retunes this component too unless the user sets --my-thing-radius. */
  --my-thing-radius: var(--radius-md);

  border-radius: var(--my-thing-radius);
}`} />
        <p>Document every new knob in the component&rsquo;s Customization section. One row per variable, with columns for Variable, Default, and Use. The <Link to="/docs/vanilla/slider" className="link">Slider</Link> page is the reference shape for how to write that table.</p>
        <p>For components with many variables, group the table by purpose (sizing, surface, interaction). For components that mostly rely on shared tokens, a short pointer paragraph back to <Link to="/docs/customization" className="link">Customization</Link> is enough.</p>
      </section>

      <section>
        <h2>Before opening a PR</h2>
        <ul>
          <li>Run <code>pnpm check</code> from <code>next/</code> and confirm it passes clean.</li>
          <li>Run <code>pnpm build</code> from <code>next/docs/</code> and confirm the site builds without error.</li>
          <li>Open the demo page and walk every state under light and dark at 320, 768, and 1280 px.</li>
        </ul>
        <p>One component per PR keeps reviews scoped. A new customization knob can ride along with the component that introduces it.</p>
      </section>
    </>
  );
}
