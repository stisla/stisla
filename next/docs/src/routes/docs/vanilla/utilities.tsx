import { createFileRoute, Link } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/vanilla/utilities")({
  component: UtilitiesDocs,
});

function UtilitiesDocs() {
  return (
    <>
      <header>
        <h1>Utilities</h1>
        <p className="lead">
          Stisla ships components and leaves layout and spacing to you, with
          Tailwind as the intended source. This page sets that up without doubling
          the reset the bundle already gives you, then shows the utilities you
          reach for to arrange components.
        </p>
      </header>

      <section>
        <h2>The component layer</h2>
        <p>
          The precompiled <code>@stisla/css</code> bundle covers the component
          layer alone. It carries no grid system and no spacing, flex, or sizing
          utilities, by design. Every demo on this site arranges its
          components with Tailwind classes (<code>flex</code>, <code>gap-4</code>,{" "}
          <code>grid</code>, <code>w-full</code>), and those work here because the
          docs compile Tailwind. A page that only links <code>stisla.css</code>{" "}
          will not have them.
        </p>
        <p>
          So if you copy a demo and the layout collapses, this is why. You have
          two ways to add the utility surface. Both run the Tailwind CLI as a
          build step. The difference is whether you keep the precompiled bundle or
          compile the components yourself.
        </p>
      </section>

      <section id="build-from-source">
        <h2>Option A. Build from source</h2>
        <p>
          The clean default for a new project. Stop linking the precompiled{" "}
          <code>stisla.css</code> and compile your own stylesheet instead.
          Tailwind comes in once, so the reset, the token theme, and the
          utilities all land exactly once, with no duplication to reason about.
        </p>
        <Code
          lang="bash"
          code={`
npm install -D tailwindcss @tailwindcss/cli
npm install @stisla/style
`}
        />
        <p>
          Author one input stylesheet. Pull in Tailwind, then the token theme,
          then the components. The <code>components.css</code> barrel imports
          every component in one line.
        </p>
        <Code
          lang="css"
          title="app.css"
          code={`
@import "tailwindcss";
@import "@stisla/style/theme.css";
@import "@stisla/style/components.css";   /* every component */

/* Only needed if Tailwind doesn't auto-detect your templates
   (see the note below). Point it at the files that use utilities: */
/* @source "./src"; */
`}
        />
        <p>
          <strong className="text-foreground">Important:</strong> Tailwind only
          generates the utility classes it actually finds in your markup. It
          auto-detects templates in most projects, so this usually needs nothing.
          But if your HTML or components live where it can&rsquo;t reach, your{" "}
          <code>flex</code> and <code>gap-4</code> come out missing and layouts
          collapse. Add the <code>@source</code> line above, pointing at those
          files. The{" "}
          <a className="link" href="#content-sources">
            Telling Tailwind what to scan
          </a>{" "}
          section covers it in full.
        </p>
        <p>Compile it, watching for changes during development.</p>
        <Code
          lang="bash"
          code={`
npx @tailwindcss/cli -i app.css -o dist/app.css --watch
`}
        />
        <Code
          lang="html"
          code={`
<link rel="stylesheet" href="dist/app.css">
`}
        />
        <p>
          The barrel is pure grouping. It re-imports the same raw component files
          you could list one by one, so the output is identical either way. When
          you want only the components you use (a smaller build, or any subset),
          swap the barrel for individual imports like{" "}
          <code>@stisla/style/button.css</code>. The{" "}
          <Link to="/docs/vanilla/optimization" className="link">
            Optimization
          </Link>{" "}
          page covers that subset path, and this is the same setup the{" "}
          <Link to="/docs/theming" hash="setting-up-overrides" className="link">
            Theming
          </Link>{" "}
          and{" "}
          <Link to="/docs/styling" className="link">
            Styling
          </Link>{" "}
          pages call the build path. The JavaScript runtime is separate and
          unchanged; see{" "}
          <Link to="/docs/vanilla/installation" className="link">
            Installation
          </Link>
          .
        </p>
      </section>

      <section id="add-to-bundle">
        <h2>Option B. Add utilities to the precompiled bundle</h2>
        <p>
          Keep the curated <code>stisla.css</code> exactly as it is and generate a
          second stylesheet that holds only the utilities. The bundle already
          carries the reset and the token theme, so you must not pull the whole of
          Tailwind in again next to it, which would emit a second reset and
          re-declare every token. Reference those parts instead of importing them.
        </p>
        <Code
          lang="bash"
          code={`
npm install -D tailwindcss @tailwindcss/cli @stisla/style
`}
        />
        <Code
          lang="css"
          title="utilities.css"
          code={`
@reference "tailwindcss";
@reference "@stisla/style/theme.css";
@import "tailwindcss/utilities.css" layer(utilities);
`}
        />
        <p>
          The two <code>@reference</code> lines load Tailwind and the Stisla theme
          for context only. They teach the generator the spacing scale and the
          semantic colors (so <code>gap-4</code> tracks <code>--spacing</code> and{" "}
          <code>bg-primary</code> resolves to the brand token) while emitting
          nothing themselves. Only the utilities layer is written out, so it
          drops onto the bundle without a second reset or re-declared tokens.
        </p>
        <p>
          The same content rule from Option A applies here. Only the utilities
          Tailwind finds in your markup are generated, so add an{" "}
          <code>@source</code> line if it doesn&rsquo;t auto-detect your templates
          (see{" "}
          <a className="link" href="#content-sources">
            Telling Tailwind what to scan
          </a>
          ).
        </p>
        <Code
          lang="bash"
          code={`
npx @tailwindcss/cli -i utilities.css -o dist/utilities.css --watch
`}
        />
        <p>Link the generated file after the bundle.</p>
        <Code
          lang="html"
          code={`
<link rel="stylesheet" href="stisla.css">
<link rel="stylesheet" href="dist/utilities.css">
`}
        />
        <p>
          Now <code>stisla.css</code> stays untouched and your{" "}
          <code>utilities.css</code> adds only what is missing, with one reset in
          the page and no duplicated tokens.
        </p>
      </section>

      <section id="which-one">
        <h2>Which one</h2>
        <ul>
          <li>
            <strong className="text-foreground">Option A</strong> for a new
            project, or any time you already compile CSS. One file holds
            everything, and it unlocks subsetting and compile-time token baking on
            the same build.
          </li>
          <li>
            <strong className="text-foreground">Option B</strong> when{" "}
            <code>stisla.css</code> is already deployed and you only need to layer
            utilities on top. It is the smaller change and leaves the bundle
            exactly as shipped.
          </li>
        </ul>
        <p>
          Most projects need one. Framework apps (React, Vue) almost always land
          on Option A, because they already run a build and import Tailwind once at
          the root; the utility surface comes for free there and this page is
          really for the no-build path.
        </p>
      </section>

      <section id="content-sources">
        <h2>Telling Tailwind what to scan</h2>
        <p>
          Either option only generates the utility classes it actually finds in
          your markup. Tailwind v4 auto-detects template files in your project, so
          most setups need no configuration. If your HTML or component templates
          live somewhere it does not reach, point at them explicitly in the input
          stylesheet.
        </p>
        <Code
          lang="css"
          code={`
@source "./src";
@source "./templates";
`}
        />
      </section>

      <section id="laying-out">
        <h2>Laying out components</h2>
        <p>
          With utilities available, you arrange components the ordinary Tailwind
          way. A handful of classes covers almost everything. Flex for a row or a
          stack, grid for a matrix, and the spacing scale for the gaps between.
        </p>

        <h3>A row</h3>
        <p>
          <code>flex items-center gap-3</code> lines components up on one axis.{" "}
          <code>flex-wrap</code> lets them spill onto a second line on narrow
          screens, and <code>ml-auto</code> pushes one item to the far edge.
        </p>
        <Demo
          html={`
<div class="flex flex-wrap items-center gap-3">
  <button type="button" class="button button--primary">
    <i data-lucide="plus"></i>
    New
  </button>
  <button type="button" class="button button--outline button--neutral">Filter</button>
  <button type="button" class="button button--outline button--neutral">Export</button>
  <button type="button" class="button button--ghost button--neutral button--icon-only ml-auto" aria-label="More">
    <i data-lucide="more-horizontal"></i>
  </button>
</div>
`}
        />

        <h3>A stack</h3>
        <p>
          <code>flex flex-col gap-3</code> stacks components vertically with even
          spacing. <code>max-w-sm</code> caps the width so a form does not stretch
          across the whole page.
        </p>
        <Demo
          html={`
<div class="flex flex-col gap-3 max-w-sm">
  <input class="input" placeholder="Email" />
  <input class="input" type="password" placeholder="Password" />
  <button type="button" class="button button--primary">Sign in</button>
</div>
`}
        />

        <h3>A grid</h3>
        <p>
          <code>grid grid-cols-2 gap-4</code> lays cards out in a matrix. For a
          layout that reflows by screen size, add responsive prefixes like{" "}
          <code>sm:grid-cols-2 lg:grid-cols-3</code>; the count steps up as the
          viewport widens.
        </p>
        <Demo
          html={`
<div class="grid grid-cols-2 gap-4">
  <div class="card">
    <div class="card__header">Revenue</div>
    <div class="card__body"><p class="card__text">$48.2k this month, up 12 percent.</p></div>
  </div>
  <div class="card">
    <div class="card__header">Orders</div>
    <div class="card__body"><p class="card__text">1,204 placed, 38 awaiting fulfillment.</p></div>
  </div>
  <div class="card">
    <div class="card__header">Customers</div>
    <div class="card__body"><p class="card__text">312 new, 89 percent returning.</p></div>
  </div>
  <div class="card">
    <div class="card__header">Refunds</div>
    <div class="card__body"><p class="card__text">$1.1k across 14 requests.</p></div>
  </div>
</div>
`}
        />

        <h3>A split layout</h3>
        <p>
          Mix grid with <code>col-span-*</code> for a main-and-aside split. The
          components keep reading from the same tokens, so the two regions stay
          coherent for free.
        </p>
        <Demo
          html={`
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="card md:col-span-2">
    <div class="card__header">Activity</div>
    <div class="card__body">
      <p class="card__text">The main column spans two of three tracks on wider screens, and drops to full width when the row can no longer hold both.</p>
    </div>
  </div>
  <div class="card">
    <div class="card__body flex flex-col gap-3">
      <div class="alert alert--success">
        <i data-lucide="check-circle"></i>
        <div>Payout sent</div>
      </div>
      <button type="button" class="button button--primary w-full">View report</button>
    </div>
  </div>
</div>
`}
        />
      </section>

      <section id="tweaking-fit">
        <h2>Tweaking the fit</h2>
        <p>
          Utilities also handle the small adjustments where a component sits a
          little wrong in its context. A full-width button in a narrow column, a
          touch of margin, a one-off corner. Because utilities compile into a
          later cascade layer than components, a utility wins over the
          component&rsquo;s own rule with no specificity fight.
        </p>
        <Demo
          html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default radius</button>
  <button type="button" class="button button--primary rounded-none">rounded-none</button>
</div>
`}
        />
        <p>
          Reach for a utility when the change is about how a component fits the
          layout around it. When the change is about the component itself, a
          different radius for every button in the app, a recurring restyle, set
          its variable instead; the{" "}
          <Link to="/docs/styling" className="link">
            Styling
          </Link>{" "}
          page covers that side, and{" "}
          <Link to="/docs/composition" className="link">
            Composition
          </Link>{" "}
          covers when a recurring pattern should graduate into its own class.
        </p>
        <p>
          One link worth keeping in mind: the spacing utilities (
          <code>gap-*</code>, <code>p-*</code>, <code>m-*</code>) are multiples of{" "}
          <code>--spacing</code>, the same base that drives component density. Dial{" "}
          <code>--spacing</code> for a region and the layout gaps reflow along with
          the components inside it. See{" "}
          <Link to="/docs/theming" hash="density" className="link">
            Density
          </Link>{" "}
          for that token.
        </p>
      </section>
    </>
  );
}
