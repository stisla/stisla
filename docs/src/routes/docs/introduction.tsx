import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/introduction")({
  component: IntroductionDocs,
});

function IntroductionDocs() {
  return (
    <>
      <header>
        <h1>Introduction</h1>
        <p className="lead">
          A quick read of what Stisla is and how you use it.
        </p>
      </header>

      <section>
        <h2>What Stisla is</h2>
        <p>
          Stisla is a component library built on constraint. One set of design
          tokens defines its color, spacing, radius, and type, and every
          component draws from that set.
        </p>
        <p>
          On top of that shared set, each component exposes its own knobs: the
          variables behind a button&rsquo;s color and size, a card&rsquo;s
          padding, an input&rsquo;s radius. Each defaults to a global token, so a
          component you leave alone already fits the page around it, and setting
          one changes just that component.
        </p>
        <p>
          Stisla is also framework-agnostic. The first implementation ships as
          vanilla CSS with a small JavaScript runtime for the interactive
          components, with React and Vue to follow. Each is built from the same
          constraint, so a button is the same button wherever you use it.
        </p>
        <p>
          If you want the exact token names, the anatomy of each component, and
          the states they answer to, the{" "}
          <Link to="/docs/specification" className="link">
            Specification
          </Link>{" "}
          page has the full surface.
        </p>
      </section>

      <section>
        <h2>What Stisla isn&rsquo;t</h2>
        <p>
          It isn&rsquo;t a utility-only library. Stisla ships real components
          with BEM classes like <code>.button</code>,{" "}
          <code>.button--primary</code>, <code>.card</code>, and{" "}
          <code>.card__header</code>, so when you read the HTML you see what the
          page does. Utilities are still there for the one-offs, since Stisla
          runs on Tailwind underneath, but the parts you repeat are already
          assembled into components.
        </p>
        <p>
          It isn&rsquo;t a wrapper around Bootstrap. Stisla v2 was Bootstrap 4.
          The current release dropped Bootstrap and rebuilt every component from
          scratch.
        </p>
        <p>
          And it doesn&rsquo;t come in different flavors or prebuilt themes.
          There&rsquo;s one Stisla. Density, radius, and brand are knobs you
          turn on top of it.
        </p>
      </section>

      <section>
        <h2>Customizing it</h2>
        <p>
          Most customization is a single variable override, with no build step.
          Pick a primary color, set a radius, adjust spacing, or drop a
          brand-tinted preset on a wrapper class. The browser resolves the rest
          with <code>color-mix(in oklch, &hellip;)</code>, so hover, active, and
          focus all follow from the one value you set.{" "}
          <Link to="/docs/theming" className="link">
            Theming
          </Link>{" "}
          walks through the override model with worked examples.
        </p>
        <p>
          If you&rsquo;re wondering how Stisla relates to Bootstrap and
          Tailwind, the{" "}
          <Link to="/docs/why-stisla" className="link">
            Why Stisla
          </Link>{" "}
          page explains why we left Bootstrap and how Stisla builds on Tailwind
          to add the layer it leaves out.
        </p>
      </section>

      <section>
        <h2>Status</h2>
        <p>
          The current version is 3.0.0-beta.1. The token surface, BEM class
          names, component APIs, and vanilla JS behavior are stable as of this
          beta unless a bug forces a change. The React implementation and the
          full docs site are the remaining work before stable.
        </p>
        <p>
          v2, the Bootstrap 4 release, is not getting migrated and lives on the{" "}
          <a
            className="link"
            href="https://github.com/stisla/stisla/tree/v2"
            target="_blank"
            rel="noopener noreferrer"
          >
            v2 branch on GitHub
          </a>
          . The two versions are different enough that there&rsquo;s no
          automatic migration path.
        </p>
      </section>
    </>
  );
}
