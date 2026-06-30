import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/architecture")({
  component: ArchitectureDocs,
});

function ArchitectureDocs() {
  return (
    <>
      <header>
        <h1>Architecture</h1>
        <p className="lead">
          How Stisla is put together. The packages, the CSS cascade layers, the
          source tree, and how a runtime composes on top of the shared spec.
        </p>
      </header>

      <section>
        <h2>What this page covers</h2>
        <p>
          Stisla is a design specification with multiple implementations. What
          every implementation must honor lives in{" "}
          <Link to="/docs/specification" className="link">
            Specification
          </Link>
          , including the component anatomy and the token contract. The surface
          you tune lives in{" "}
          <Link to="/docs/theming" className="link">
            Theming
          </Link>
          . The reasoning behind avoiding Bootstrap, Tailwind alone, and
          CSS-in-JS lives in{" "}
          <Link to="/docs/why-stisla" className="link">
            Why Stisla
          </Link>
          . This page covers the structure that holds it together: the packages,
          how the CSS bundle is layered, where the source lives, and how a
          runtime composes on top.
        </p>
        <p>
          The structure is shared across implementations. The vanilla
          implementation is the reference, and its runtime specifics live on the{" "}
          <Link to="/docs/vanilla/javascript" className="link">
            JavaScript
          </Link>{" "}
          page; future implementations (React + Base UI, Vue + Reka, Svelte +
          bits-ui) get their own runtime pages as they land.
        </p>
      </section>

      <section>
        <h2>Packages</h2>
        <p>
          Stisla ships as a set of scoped packages. They track the same version
          line, so the stylesheet and runtime stay in sync when you install a
          matched pair.
        </p>
        <table>
          <thead>
            <tr>
              <th>Package</th>
              <th>What it ships</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>@stisla/style</code>
              </td>
              <td>
                The framework-agnostic source of truth: the Tailwind{" "}
                <code>@theme</code> foundation (<code>theme.css</code>), the
                per-component BEM CSS, and the composer (TypeScript). Every
                other package builds from this.
              </td>
            </tr>
            <tr>
              <td>
                <code>@stisla/css</code>
              </td>
              <td>
                The pre-compiled universal stylesheet. Built from{" "}
                <code>@stisla/style</code>. No JavaScript, no build step to
                consume. Works in every implementation.
              </td>
            </tr>
            <tr>
              <td>
                <code>@stisla/vanilla</code>
              </td>
              <td>
                The vanilla JS runtime. Drives <code>data-stisla-*</code>{" "}
                behavior on canonical markup. Ships one entry that registers
                every component, and pairs with <code>@stisla/css</code> at the
                matching version.
              </td>
            </tr>
            <tr>
              <td>
                <code>@stisla/react</code>
              </td>
              <td>
                React component wrappers built on Base UI. Consumes{" "}
                <code>@stisla/style</code> and the shared composer.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          The Tailwind <code>@theme</code> foundation lives inside{" "}
          <code>@stisla/style</code> as its <code>theme.css</code> file. The
          pre-compiled <code>@stisla/css</code> bakes it
          in for zero-build consumers; build-from-source consumers import it
          directly.{" "}
          <Link
            to="/docs/theming"
            hash="setting-up-overrides"
            className="link"
          >
            Setting up overrides
          </Link>{" "}
          covers both paths from the user side.
        </p>
      </section>

      <section>
        <h2>CSS bundle composition</h2>
        <p>
          Tailwind v4 organizes the compiled CSS into cascade layers. The order
          is:
        </p>
        <Code
          lang="css"
          code={`
@layer theme, base, components, utilities;
`}
        />
        <p>
          Order matters. The <code>theme</code> layer holds the tokens. The{" "}
          <code>base</code> layer holds the Preflight reset and base element
          rules. Component rules sit above both. Utilities sit on top, so a
          utility class wins against the component it tweaks. Within a layer,
          normal cascade rules apply.
        </p>

        <h3>What each layer holds</h3>
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Contents</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>theme</strong>
              </td>
              <td>
                The <code>@theme</code> token declarations (
                <code>--color-*</code>, <code>--radius-*</code>, …) and the
                dark-mode delta block
              </td>
              <td>
                <code>next/packages/style/src/theme.css</code>
              </td>
            </tr>
            <tr>
              <td>
                <strong>base</strong>
              </td>
              <td>Tailwind Preflight reset plus the base body rule</td>
              <td>
                Tailwind (<code>@import "tailwindcss"</code>) +{" "}
                <code>theme.css</code>
              </td>
            </tr>
            <tr>
              <td>
                <strong>components</strong>
              </td>
              <td>Every BEM component file. One file per block</td>
              <td>
                <code>
                  next/packages/style/src/&lt;name&gt;/&lt;name&gt;.css
                </code>
              </td>
            </tr>
            <tr>
              <td>
                <strong>utilities</strong>
              </td>
              <td>
                Tailwind utilities (precompiled for the zero-build bundle, JIT
                for build-from-source consumers)
              </td>
              <td>Tailwind</td>
            </tr>
          </tbody>
        </table>

        <h3>The bundle</h3>
        <p>
          <code>@stisla/css</code> ships one precompiled stylesheet,{" "}
          <code>stisla.css</code>, with every component, the tokens, and no
          utilities. To ship a subset instead, compile from source with{" "}
          <code>@stisla/style</code>, which the{" "}
          <Link to="/docs/vanilla/optimization" className="link">
            Optimization
          </Link>{" "}
          page covers. Three components depend on a 3rd-party library: carousel
          (Embla), combobox (Tom Select), scroll-area (OverlayScrollbars). They
          ship in the bundle like everything else.
        </p>
      </section>

      <section>
        <h2>Source layout</h2>
        <p>
          Every Stisla implementation reads from the same source tree. The
          layout is flat by intent. Every spec&rsquo;d component lives next to
          every other, regardless of whether one implementation classifies it as
          core or optional.
        </p>
        <Code
          lang="text"
          title="next/packages/"
          code={`
next/packages/
  style/src/
    theme.css                  (Tailwind @theme foundation, light + dark block)
    <name>/<name>.css          (one CSS file per BEM block, ~53 total)
    <name>/<name>.<lib>.css    (optional lib adapter, e.g. combobox.tomselect.css)
    components.css             (barrel; @import of every component CSS)
    composer.ts                (pure variant+tune → className+style function)
    index.ts                   (re-exports)
  css/
    stisla.css                 (the precompiled-bundle entry; theme + components barrel)
    package.json               (built by the Tailwind CLI into dist/stisla.css)
  vanilla/src/
    core/                      (component.js, init.js, transition.js, inert.js)
    components/                (one .js file per interactive component, 20 total)
    index.js                   (entry; registers every component, auto-inits)
  react/src/
    <name>/index.tsx           (React wrappers, one per component)
    index.ts                   (re-exports)
`}
        />
        <p>
          The repo also carries the cross-implementation contract files at the
          root. <code>SPEC.md</code> holds the shared contract.{" "}
          <code>spec/components/&lt;name&gt;.md</code> holds the per-component
          contract (anatomy, states, behavior, a11y, tokens) that every
          implementation honors. <code>V3.md</code> is the build journal for the
          vanilla impl.
        </p>
      </section>

      <section>
        <h2>The runtime layer</h2>
        <p>
          The CSS is static; behavior comes from a runtime layer that each
          implementation supplies its own way. The reference vanilla runtime
          ships as <code>@stisla/vanilla</code>, around 600 lines of our own
          code plus a few vendored primitives, and drives{" "}
          <code>data-stisla-*</code> markup through a register-then-scan
          lifecycle. The{" "}
          <Link to="/docs/vanilla/javascript" className="link">
            JavaScript
          </Link>{" "}
          page documents how it boots and its full API; the{" "}
          <Link to="/docs/specification" hash="interactivity" className="link">
            Interactivity
          </Link>{" "}
          contract is what any runtime has to satisfy.
        </p>
        <p>
          Other implementations swap the layer wholesale. React leans on Base
          UI&rsquo;s headless primitives, Vue on Reka. The CSS underneath is
          identical, so a <code>data-state="open"</code> dialog paints the same
          regardless of which runtime opened it.
        </p>
      </section>

      <section>
        <h2>How this realizes the spec</h2>
        <p>
          The vanilla impl is one realization of the cross-implementation
          contract. Reading the spec alongside the source shows how each
          requirement lands in practice. A few examples:
        </p>
        <table>
          <thead>
            <tr>
              <th>Spec requirement</th>
              <th>Vanilla solution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Token surface is one Tailwind <code>@theme</code> layer
              </td>
              <td>
                <code>next/packages/style/src/theme.css</code>. Only file with
                literal color values.
              </td>
            </tr>
            <tr>
              <td>
                State derivation via <code>color-mix</code>
              </td>
              <td>
                Every component CSS file. Recipe percentages are CSS custom
                property defaults, e.g.{" "}
                <code>color-mix(in oklch, var(--button-tone) 88%, black)</code>
              </td>
            </tr>
            <tr>
              <td>BEM block names match the spec</td>
              <td>
                <code>.button</code>, <code>.card</code>, <code>.dialog</code>,
                etc. One <code>&lt;name&gt;.css</code> per block under{" "}
                <code>next/packages/style/src/</code>
              </td>
            </tr>
            <tr>
              <td>State attributes match primitive-library conventions</td>
              <td>
                <code>[data-state="open|closed|active"]</code> set by the
                vanilla JS or by future primitive libraries; same CSS serves
                both
              </td>
            </tr>
            <tr>
              <td>Focus, dismiss, scroll-lock, keyboard a11y</td>
              <td>
                focus-trap (dialog, drawer), our own dismiss and scroll-lock,
                Floating UI for floating elements
              </td>
            </tr>
            <tr>
              <td>Dark mode is one delta block</td>
              <td>
                End of <code>theme.css</code>. <code>[data-theme="dark"]</code>{" "}
                and <code>.dark</code> both match
              </td>
            </tr>
            <tr>
              <td>
                Component contract per{" "}
                <code>spec/components/&lt;name&gt;.md</code>
              </td>
              <td>
                Each JS-coordinated component honors the spec&rsquo;s required
                behavior, parts, and events
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Future implementations (React, Vue, Svelte) get their own runtime
          pages with the same shape. Same spec, different runtime, different
          primitive library, same <code>@stisla/css</code> underneath.
        </p>
      </section>

      <section>
        <h2>What&rsquo;s next</h2>
        <p>
          Read the{" "}
          <Link to="/docs/specification" className="link">
            Specification
          </Link>{" "}
          for the cross-impl contract that every implementation honors,
          including the component anatomy and token rules. Read{" "}
          <Link to="/docs/theming" className="link">
            Theming
          </Link>{" "}
          for the override model and the worked recipes. Open any component file
          under <code>next/packages/style/src/</code> for the canonical pattern
          in practice; <code>button/button.css</code>,{" "}
          <code>card/card.css</code>, and <code>alert/alert.css</code> are the
          cleanest references.
        </p>
      </section>
    </>
  );
}
