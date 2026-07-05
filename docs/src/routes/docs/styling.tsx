import { createFileRoute, Link } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/styling")({
  component: StylingDocs,
});

function StylingDocs() {
  return (
    <>
      <header>
        <h1>Styling</h1>
        <p className="lead">
          How to restyle a component that already exists. Bump a knob, override
          a property that isn&rsquo;t a knob yet, or hand-tune a state. Scoped
          variables plus BEM plus cascade order mean you never need{" "}
          <code>!important</code>.
        </p>
      </header>

      <section>
        <h2>Where your CSS goes</h2>
        <p>
          Everything on this page is a few lines of CSS you write yourself, and
          they belong in <code>@layer components</code> &mdash; the same cascade
          layer Stisla&rsquo;s own component rules live in. Layers are native
          CSS, so this works whether or not you run a build. Putting your rules
          in that layer lands them beside the framework&rsquo;s, where the
          ordinary cascade decides: higher specificity wins, and at equal
          specificity the rule authored later wins. Your stylesheet loads after
          Stisla&rsquo;s, so an equal-specificity override is yours.
        </p>
        <p>
          <strong className="text-foreground">Without a build step.</strong> Link
          your stylesheet after <code>stisla.css</code> and wrap your rules in
          the layer.
        </p>
        <Code
          lang="html"
          code={`
<link rel="stylesheet" href="stisla.css">
<link rel="stylesheet" href="app.css">
`}
        />
        <Code
          lang="css"
          title="app.css"
          code={`
@layer components {
  .button--prominent-icon { --button-icon-size: 1.25em; }
  /* ...the rest of your component overrides... */
}
`}
        />
        <p>
          <strong className="text-foreground">With Vite and Tailwind.</strong>{" "}
          Same layer. You just pull in Tailwind and the source theme at the top
          first, the same two setups from{" "}
          <Link to="/docs/theming" hash="setting-up-overrides" className="link">
            Theming
          </Link>
          .
        </p>
        <Code
          lang="css"
          title="app.css"
          code={`
@import "tailwindcss";
@import "@stisla/style/theme.css";

@layer components {
  .button--prominent-icon { --button-icon-size: 1.25em; }
  /* ...the rest of your component overrides... */
}
`}
        />
        <p>
          Only the <code>@import</code> lines differ between the two. The rules
          inside the layer are identical, so the examples below show the rule
          alone &mdash; drop it into <code>@layer components</code> either way.
        </p>
      </section>

      <section>
        <h2>Tweaking a knob that exists</h2>
        <p>
          The everyday case. You like the button, you just want the icon a bit
          larger. <code>--button-icon-size</code> defaults to{" "}
          <code>--spacing(4)</code> on every <code>.button</code>. Three
          escalation levels from least invasive to most. Stop at the one that
          matches how broad the change really is.
        </p>

        <h3>Option A. Inline override</h3>
        <p>
          Bumps the icon size inside this one button. Tone, padding, height all
          stay default.
        </p>
        <Demo
          html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">
    <i data-lucide="upload"></i>
    Default icon
  </button>
  <button type="button" class="button button--primary" style="--button-icon-size: 1.25em">
    <i data-lucide="upload"></i>
    Larger icon
  </button>
</div>
`}
        />

        <h3>Option B. Your own scoped class</h3>
        <p>
          You want the icon-prominent treatment in more than one place. Write a
          modifier class once, apply it where you want it.
        </p>
        <Demo
          html={`
<style>
  .button--prominent-icon { --button-icon-size: 1.25em; }
</style>
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary button--prominent-icon">
    <i data-lucide="upload"></i>
    Upload
  </button>
  <button type="button" class="button button--neutral button--prominent-icon">
    <i data-lucide="download"></i>
    Download
  </button>
</div>
`}
        />
        <p>
          Specificity matches Stisla&rsquo;s own rule (one class), and cascade
          order resolves it. No <code>!important</code>.
        </p>

        <h3>Option C. Wrap a region</h3>
        <p>
          Every button inside a region gets the bigger icon. Useful for toolbars
          and command bars where the icon is the dominant read.
        </p>
        <Code
          lang="css"
          title="app.css"
          code={`
.toolbar .button { --button-icon-size: 1.25em; }
`}
        />
        <p>
          Higher specificity (two classes beat one), so this wins even if your
          stylesheet loads before Stisla&rsquo;s. Reach for it when you
          can&rsquo;t control load order, or when the change really belongs to a
          region rather than a button modifier.
        </p>
      </section>

      <section>
        <h2>Tweaking when there&rsquo;s no knob</h2>
        <p>
          Plenty of properties aren&rsquo;t exposed as variables, by design. The{" "}
          <Link to="/docs/specification" className="link">
            Specification
          </Link>{" "}
          covers which decisions become knobs and which stay literal. You still
          have a clean path: the same three escalation options, only now
          you&rsquo;re targeting the property directly.
        </p>
        <p>
          Scenario: you want uppercase button labels. <code>.button</code>{" "}
          doesn&rsquo;t set <code>text-transform</code>, and there&rsquo;s no{" "}
          <code>--button-text-transform</code> knob. You add the property
          directly.
        </p>

        <h3>Option A. Inline style</h3>
        <Demo
          html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">
    <i data-lucide="check"></i>
    Default
  </button>
  <button type="button" class="button button--primary" style="text-transform: uppercase">
    <i data-lucide="check"></i>
    Uppercase
  </button>
</div>
`}
        />
        <p>Inline always wins. No specificity battle.</p>

        <h3>Option B. Your own scoped class</h3>
        <Demo
          html={`
<style>
  .button--caps { text-transform: uppercase; }
</style>
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">
    <i data-lucide="check"></i>
    Default
  </button>
  <button type="button" class="button button--primary button--caps">
    <i data-lucide="check"></i>
    Uppercase
  </button>
</div>
`}
        />
        <p>
          Same specificity as Stisla&rsquo;s <code>.button</code> rule. Your
          stylesheet loads after, so cascade order resolves it.
        </p>

        <h3>Option C. Region-scoped</h3>
        <Code
          lang="css"
          title="app.css"
          code={`
.toolbar .button { text-transform: uppercase; }
`}
        />
        <p>Two classes beat one. Wins regardless of load order.</p>

        <p>
          There&rsquo;s a feedback loop here. If you find yourself overriding
          the same property in three or more places (one specific{" "}
          <code>text-transform</code>, one specific <code>padding</code>, one
          specific <code>font-weight</code>), that&rsquo;s the signal it should
          become a Stisla variable. File an issue. The user-side overrides are
          the input to the public knob surface. That&rsquo;s how{" "}
          <code>--button-rim-mix</code> got exposed when{" "}
          <code>.button-group</code> needed to lift it. Skip the issue when your
          override is genuinely one-off, project-specific, or just personal
          preference.
        </p>
      </section>

      <section>
        <h2>
          No <code>!important</code> needed
        </h2>
        <p>
          You may have noticed none of the options above reach for{" "}
          <code>!important</code>. That&rsquo;s the point of the model, and it
          holds in every case. Token changes inherit, so the cascade isn&rsquo;t
          even involved in the <em>use</em> of a variable. Property overrides
          resolve on the ordinary rules: inline beats any class, two classes
          beat one, and at equal specificity your stylesheet loads after
          Stisla&rsquo;s so it wins. Set the variable on a wrapper and every
          descendant inherits it, no fight at all.
        </p>
        <Demo
          html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default primary</button>
  <div class="flex flex-wrap items-center gap-3" style="--color-primary: oklch(0.65 0.18 149); --color-primary-foreground: oklch(1 0 0)">
    <button type="button" class="button button--primary">Green via wrapper</button>
    <button type="button" class="button button--soft button--primary">Soft retints</button>
  </div>
</div>
`}
        />
      </section>

      <section>
        <h2>State derivation and escape hatches</h2>
        <p>
          Stisla derives hover, active, and focus colors from a single source
          via <code>color-mix(in oklch, &hellip;)</code>. Change one variable
          and every state recomputes. This is the easy path. It&rsquo;s also
          escapable at three levels when you want hand-tuned states. The
          reference is <code>.button</code>, but the same pattern shows up in
          alert, badge, dialog, kbd, list-group, scroll-area, table, and a dozen
          others.
        </p>

        <h3>Level 1. Keep color-mix, swap the source</h3>
        <p>
          You like the derivation curve, you want a different brand color.
          Override <code>--button-tone</code> for this button only, or{" "}
          <code>--color-primary</code> for every primary-toned component
          (buttons, links, focus rings, soft highlights).
        </p>
        <Demo
          html={`
<div class="flex flex-wrap justify-center items-center gap-4">
  <button type="button" class="button button--primary">Default tone</button>
  <button type="button" class="button button--primary" style="--button-tone: oklch(0.6 0.2 30); --button-color: oklch(1 0 0)">--button-tone (this button)</button>
  <div class="flex flex-wrap items-center gap-3" style="--color-primary: oklch(0.6 0.2 30); --color-primary-foreground: oklch(1 0 0)">
    <button type="button" class="button button--primary">--color-primary (subtree)</button>
    <button type="button" class="button button--soft button--primary">Soft follows</button>
  </div>
</div>
`}
        />
        <p>
          Either way, hover, active, rim, and bevel all recompute through the
          same recipe (hover at 88%, active at 78%, rim at 85%). One write, full
          state machinery intact. Hover the buttons to see it.
        </p>

        <h3>Level 2. Keep the variable surface, bypass color-mix per state</h3>
        <p>
          You want hand-picked swatches at each state instead of the derived
          progression. Set each state&rsquo;s background directly.{" "}
          <code>color-mix</code> never runs because you&rsquo;re writing the
          final value. Reach for this when the auto-derived ramp doesn&rsquo;t
          match a designer&rsquo;s hand-picked swatch, or isn&rsquo;t right for
          an unusual hue.
        </p>
        <Demo
          html={`
<style>
  .button--brand        { --button-bg: oklch(0.60 0.22 30); --button-color: oklch(1 0 0); --button-tone: oklch(0.60 0.22 30); }
  .button--brand:hover  { --button-bg: oklch(0.55 0.22 30); }
  .button--brand:active { --button-bg: oklch(0.50 0.24 30); }
</style>
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Derived states</button>
  <button type="button" class="button button--brand">Hand-tuned states</button>
</div>
`}
        />

        <h3>Level 3. Skip the variable layer entirely</h3>
        <p>
          Plain CSS. Cascade and specificity resolve it; the variable layer
          isn&rsquo;t involved at all. Reach for this when you&rsquo;re styling
          something that doesn&rsquo;t belong in Stisla&rsquo;s tone model (a
          designer-supplied gradient CTA, for instance).
        </p>
        <Demo
          html={`
<style>
  .my-cta        { background: linear-gradient(135deg, oklch(0.7 0.2 290), oklch(0.65 0.22 350)); color: oklch(1 0 0); border: 0; padding: 0 1rem; height: 2.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
  .my-cta:hover  { filter: brightness(1.05); }
  .my-cta:active { filter: brightness(0.95); }
</style>
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Stisla button</button>
  <button type="button" class="my-cta">Custom CTA</button>
</div>
`}
        />
        <p>
          Most design systems pick one mode (forced derivation, or fully
          manual). Stisla offers both, and you pick per situation. Level 1 for a
          color change, Level 2 for a curve change, Level 3 for leaving the
          system. The level you reach for is the level you need. Don&rsquo;t
          over-commit.
        </p>
      </section>

      <section id="sizing-model">
        <h2>Sizing model</h2>
        <p>
          Chip-like components (buttons, form fields, pagination chips, navbar
          buttons, toggles, tabs) ship three independent knobs. Shape, content,
          icon. Override any one without touching the others.
        </p>
        <ul>
          <li>
            <strong>
              <code>--*-height</code>
            </strong>{" "}
            is the shape knob. It defaults to a <code>--spacing()</code> multiple
            (the button&rsquo;s is <code>--spacing(9)</code>), so it tracks{" "}
            <code>--spacing</code> along with the rest of the system. Override
            with a plain value (<code>3rem</code>) for a rigid shape that ignores
            the base, or with your own <code>--spacing()</code> multiple to keep
            it tracking.
          </li>
          <li>
            <strong>
              <code>--*-font-size</code>
            </strong>{" "}
            is the label knob. Defaults to <code>var(--text-sm)</code>.
            Doesn&rsquo;t affect shape; text sits centered inside whatever height
            you set.
          </li>
          <li>
            <strong>
              <code>--*-icon-size</code>
            </strong>{" "}
            (and similar) is the icon knob. Defaults to a{" "}
            <code>--spacing()</code> multiple (the button&rsquo;s is{" "}
            <code>--spacing(4)</code>). Bump it to <code>1.25em</code> for an
            icon-prominent UI without touching height or label size.
          </li>
        </ul>
        <p>
          Each size variant (<code>--sm</code>, <code>--lg</code>) reassigns{" "}
          <code>--*-height</code>, <code>--*-padding-inline</code>, and{" "}
          <code>--*-font-size</code> so the sized chip lands on its small /
          default / large cadence at the default spacing base.
        </p>

        <h3>Make one element taller or shorter</h3>
        <p>
          Override <code>--*-height</code> on the element. A plain value gives a
          rigid shape that doesn&rsquo;t track the spacing base.
        </p>
        <Demo
          html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default</button>
  <button type="button" class="button button--primary" style="--button-height: 3rem">Rigid</button>
</div>
`}
        />
        <p>
          Leave the height alone if you want the element to keep tracking the
          base. The two buttons below sit inside a region with a larger{" "}
          <code>--spacing</code>. The first one (rigid <code>3rem</code>) stays
          put; the second one (default height, a <code>--spacing()</code>{" "}
          multiple) grows with the region.
        </p>
        <Demo
          html={`
<div class="flex flex-wrap items-center gap-4" style="--spacing: 0.34rem">
  <button type="button" class="button button--primary" style="--button-height: 3rem">Rigid</button>
  <button type="button" class="button button--primary">Tracks the base</button>
</div>
`}
        />

        <h3>Bigger content, same shape</h3>
        <p>
          Bump <code>--*-icon-size</code> or <code>--*-font-size</code> to grow
          the content without touching the shape. Content centers inside the
          height via flex, so it grows toward the box edges without breaking the
          chip silhouette.
        </p>
        <Demo
          html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">
    <i data-lucide="upload"></i>
    Default
  </button>
  <button type="button" class="button button--primary" style="--button-icon-size: 1.5em">
    <i data-lucide="upload"></i>
    Big icon
  </button>
</div>
`}
        />

        <h3>Resize a region</h3>
        <p>
          Scope <code>--spacing</code> on a wrapper. Every button, field, and
          chip inside scales together. Use this when &ldquo;the form is
          tight&rdquo; or &ldquo;the dashboard is roomy&rdquo; describes a whole
          area. For a single element, the height override above is enough. To
          retune the whole app&rsquo;s density, set <code>--spacing</code>{" "}
          globally instead, covered under{" "}
          <Link to="/docs/theming" hash="density" className="link">
            Density
          </Link>
          .
        </p>
        <Demo
          html={`
<div class="flex flex-wrap items-start gap-4">
  <div class="flex flex-col gap-2 p-4 flex-1 rounded-md border border-border">
    <span class="text-xs uppercase tracking-[0.05em] text-muted-foreground">Default spacing</span>
    <input class="input" placeholder="Email" />
    <div class="flex gap-2 justify-end">
      <button type="button" class="button button--ghost button--neutral">Cancel</button>
      <button type="button" class="button button--primary">Save</button>
    </div>
  </div>
  <div class="flex flex-col gap-2 p-4 flex-1 rounded-md border border-border" style="--spacing: 0.3rem">
    <span class="text-xs uppercase tracking-[0.05em] text-muted-foreground">--spacing: 0.3rem</span>
    <input class="input" placeholder="Email" />
    <div class="flex gap-2 justify-end">
      <button type="button" class="button button--ghost button--neutral">Cancel</button>
      <button type="button" class="button button--primary">Save</button>
    </div>
  </div>
</div>
`}
        />
      </section>

      <section id="per-component-variables">
        <h2>Per-component variables</h2>
        <p>
          Each component exposes its own scoped variables on top of the global
          tokens. Set <code>--button-radius</code> to give buttons a different
          radius from cards. Set <code>--dialog-bg</code> to retune a dialog
          without retinting the rest of the system. Component variables fall
          back through to the matching global token, so leaving them alone gives
          you the global default.
        </p>
        <p>
          Every component page ends with a Customization section that tables its{" "}
          <code>--component-*</code> variables.{" "}
          <Link to="/docs/vanilla/button" hash="customization" className="link">
            Button
          </Link>{" "}
          is the reference shape (Variable, Use). When you find yourself
          overriding the same property across three or more components,
          that&rsquo;s the signal to file an issue for a new knob; the feedback
          loop above covers when to ask and when to leave the override on the
          project side.
        </p>
        <p>
          When a pattern recurs enough that it deserves to be a modifier or its
          own component rather than a pile of overrides, see{" "}
          <Link to="/docs/composition" className="link">
            Composition
          </Link>
          .
        </p>
      </section>
    </>
  );
}
