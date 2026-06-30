import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/why-stisla")({
  component: WhyStislaDocs,
});

function WhyStislaDocs() {
  return (
    <>
      <header>
        <h1>Why Stisla</h1>
        <p className="lead">
          Tailwind gives you a great scale and an escape hatch. It does not give
          you constraint or components. Stisla is the layer that adds them, so
          your team stops drifting.
        </p>
      </header>

      <section>
        <h2>The missing layer</h2>
        <p>
          Tailwind ships a great scale (spacing, color, type) and a set of
          utilities to apply it. What it leaves out, on purpose, is constraint
          and components. There is no built-in way to say &ldquo;this is the
          button, these are its three sizes, this is how it themes.&rdquo; Every
          team rebuilds that layer, and every team rebuilds it a little
          differently. That difference is where a design system drifts.
        </p>
        <p>
          Stisla is that layer, and it has two parts.{" "}
          <strong className="text-foreground">
            Tokens as a single source of truth.
          </strong>{" "}
          Change one token and every component that reads it follows.{" "}
          <strong className="text-foreground">Components with knobs.</strong> The
          decision is already made, so you turn a knob instead of reassembling a
          chain of utilities each time.
        </p>
        <p>
          This is true with or without a build step. The no-build vanilla
          implementation and the framework implementations are the same
          components over the same tokens. The constraint does not depend on
          which one you reach for.
        </p>
      </section>

      <section>
        <h2>What constraint looks like</h2>
        <p>
          A button needs three sizes, ten colors, and several states (hover,
          active, focus, disabled, loading). That is well over a hundred visual
          combinations. Without a single source of truth, each combination gets
          re-decided somewhere, and the copies fall out of sync. With one, a
          single variable drives every state.
        </p>

        <Code
          lang="css"
          title="button.css"
          code={`
.btn {
  --btn-bg: var(--btn-tone);
  background: var(--btn-bg);
}
.btn:hover  { --btn-bg: color-mix(in oklch, var(--btn-tone) 88%, black); }
.btn:active { --btn-bg: color-mix(in oklch, var(--btn-tone) 78%, black); }
`}
        />

        <p>
          Drop a custom color in at the call site and every state recomputes
          against it. No palette config to edit, no regenerated class ramp, no
          rebuild. The whole state machinery follows from one variable.
        </p>

        <Code
          lang="html"
          code={`
<button class="btn" style="--btn-tone: oklch(0.6 0.2 30)">
  Custom brand
</button>
`}
        />

        <p>
          That is the payoff of constraint. The decision lives in one place, so
          you cannot end up with a hover that disagrees with its own base color.
        </p>
      </section>

      <section>
        <h2>We use Tailwind</h2>
        <p>
          Stisla is built on Tailwind. Tailwind v4 is the scale engine
          underneath it: spacing, type, color, and the build that tree-shakes
          what you do not use. We adopt its <code>@theme</code> for tokens and
          its <code>@layer</code> system for everything on top. We keep the parts
          that make Tailwind good, the pre-picked defaults under short names and
          the escape hatch for one-offs, and we add the layer it leaves to you.
        </p>
        <p>
          Tailwind has two layers, <code>@layer components</code> and{" "}
          <code>@layer utilities</code>, and most projects use only the second.
          The official guidance is to extract a component class when you see
          repetition, but the extracting is left to you. Stisla commits to the
          component layer so your team does not have to assemble it by hand on
          every screen.
        </p>

        <h3>No build step</h3>
        <p>
          The vanilla implementation ships precompiled CSS. A Stisla component
          displays with no Tailwind present, which is what lets it work in plain
          HTML, Rails templates, Django pages, and Laravel views. Tokens are
          plain custom properties on the root. Override one in the browser and
          every component repaints, with no recompile. This is also why styles
          live in CSS files rather than inside JavaScript: the design needs to
          render where there is no JavaScript at all.
        </p>

        <h3>With a framework</h3>
        <p>
          React and Vue consumers already run Tailwind, so their build JITs the
          utilities they actually use. Our components sit in{" "}
          <code>@layer components</code> and any utilities you add for overrides
          sit in <code>@layer utilities</code>, which comes later in the cascade.
          Utilities win by layer precedence, so there is nothing to merge.
        </p>
      </section>

      <section>
        <h2>Where this comes from</h2>
        <p>
          Stisla started on Bootstrap. When the rewrite began, the plan was to
          move to the next Bootstrap, so we ported the components onto it to see
          how it would feel.
        </p>
        <p>
          The thing we kept running into was the variable and color system.
          Bootstrap spans two worlds at once. Some values live in Sass and are
          resolved at build time, others live in custom properties and are
          resolved at runtime in the browser. Following one color from its Sass
          source all the way to the variable a component actually reads is more
          involved than it looks. It is a capable system, and honestly a bit more
          machinery than we wanted to carry.
        </p>
        <p>
          By the time the components were finished, customization still was not
          where we wanted it. Because the two systems stayed mixed, a change in
          one place did not always reach the other, so theming never came down to
          turning a single knob. The token surface is different too. Bootstrap
          offers a large, layered set of variables, where Stisla exposes far
          fewer, a small set you can hold in your head and override at runtime.
        </p>
        <p>
          None of this is a knock on Bootstrap. It is a complete design system,
          and that is the point of it. If you want a finished product with
          sensible defaults and less customization to manage, Bootstrap is a
          great choice. Stisla starts somewhere else. We treat the system as a
          starting point you reshape. Bootstrap and
          Stisla just want different things, so we built our own foundation.
        </p>
      </section>

      <section>
        <h2>Common questions</h2>

        <p>
          <strong className="text-foreground">
            Are you violating Tailwind&rsquo;s atomic principle by using BEM
            classes?
          </strong>{" "}
          No. That framing is wrong and defensive. Tailwind ships{" "}
          <code>@layer components</code> and <code>@apply</code> for exactly
          this, and its own guidance is to extract a component class when you see
          repetition. Tailwind has two layers, components and utilities, and most
          people use only one. We use both: constrained components for the
          repeated stuff, atomic utilities for the one-offs. We are committing to
          a layer Tailwind leaves optional, exactly as it is meant to be used.
        </p>

        <p>
          <strong className="text-foreground">
            How do I customize a component?
          </strong>{" "}
          Tune the knobs first, with the <code>tune</code> prop, or by overriding
          the component&rsquo;s <code>--*</code> variables in CSS. Need more
          control? Override with utilities, covered just below.
        </p>

        <p>
          <strong className="text-foreground">
            Will utilities override the component?
          </strong>{" "}
          Yes. Utilities sit in a later cascade layer than components.{" "}
          <code>@layer utilities</code> comes after{" "}
          <code>@layer components</code>, so they win deterministically, by layer
          precedence, regardless of source order.
        </p>

        <Code
          lang="css"
          code={`
@layer components { .btn { border-radius: var(--btn-radius); } }
@layer utilities  { .rounded-none { border-radius: 0; } }

/* <button class="btn rounded-none"> wins, no !important, nothing to merge */
`}
        />

        <p>
          <strong className="text-foreground">
            Isn&rsquo;t assembling utilities the recommended Tailwind approach?
          </strong>{" "}
          For one-offs, yes, and you still can. Utilities are the escape hatch.
          But assembling raw utilities for reused UI means every instance
          re-decides spacing and color, and your team drifts. Our components are
          the pre-assembled, constrained version. Reach for utilities when
          composing or overriding. Reach for a component when you want the
          decision already made.
        </p>

        <p>
          <strong className="text-foreground">
            How do I build a new custom component?
          </strong>{" "}
          Start by assembling Tailwind utilities. When it repeats, abstract it
          into its own component file so you can reuse it. Then add knobs, the{" "}
          <code>--*</code> variables plus <code>tune</code>, if you want stronger
          constraint. This is exactly how Stisla&rsquo;s own components are built.
        </p>

        <p>
          <strong className="text-foreground">
            Isn&rsquo;t the bundle bigger than a utilities-only approach?
          </strong>{" "}
          Yes, the CSS file is larger. But the weight does not disappear, it just
          moves. Utilities push the same visual rules into the markup instead of
          the stylesheet, so the total page weight stays about the same. The
          question is not how to remove the weight, it is where to put it, and we
          put it in the CSS file. A static stylesheet is sent once and cached for
          a long time (fingerprinted filenames make that safe), while bytes
          inside the markup are re-sent on every page request, since HTML is
          cached less aggressively than assets. Keeping the rules in the
          stylesheet also keeps styling out of the render function, where
          utilities tend to mix it back in with behavior. For the server-rendered
          case Stisla targets, the cached file wins across navigations.
        </p>

        <p>
          <strong className="text-foreground">
            Why packages, not shadcn-style copy-paste?
          </strong>{" "}
          shadcn&rsquo;s pitch is &ldquo;own the code.&rdquo; Ours is
          &ldquo;don&rsquo;t think about the code.&rdquo; A versioned design
          system that spans React, Vue, and vanilla cannot have every consumer
          fork and freeze it, because copy-paste can never receive an update. You
          will mostly write <code>&lt;Button size tune className /&gt;</code>, not
          edit our source. Compiled CSS-in-CSS plus JS is not a daily-editable
          file. Updates arrive through a dependency bump, the same way every
          other library you depend on works.
        </p>
      </section>

      <section>
        <h2>What this means</h2>
        <p>
          Stisla is a design specification. The vanilla implementation is what
          exists today. The next one is React on top of a headless behavior
          primitive library, with Vue and Svelte on the roadmap. Every
          implementation follows the same contract over the same tokens.
        </p>
        <p>
          See the{" "}
          <Link to="/docs/specification" className="link">
            Specification
          </Link>{" "}
          for the cross-implementation contract. See{" "}
          <Link to="/docs/theming" className="link">
            Theming
          </Link>{" "}
          for the override model and the worked examples.
        </p>
      </section>
    </>
  );
}
