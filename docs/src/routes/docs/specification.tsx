import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/specification")({
  component: SpecificationDocs,
});

function SpecificationDocs() {
  return (
    <>
      <header>
        <h1>Specification</h1>
        <p className="lead">
          The decisions every Stisla implementation agrees on. Names, anatomy,
          states, and scales that stay stable across ports.
        </p>
      </header>

      <section>
        <h2>What this page is</h2>
        <p>
          Stisla is a design specification. The{" "}
          <Link to="/docs/introduction" className="link">
            Introduction
          </Link>{" "}
          covers why this is the shape. This page covers what is in it. The
          contract every implementation honors for the components it ships. The
          vanilla bundle is the first implementation, and the React + Base UI
          and Vue ports come against the same surface. Coverage varies per port;
          see{" "}
          <a className="link" href="#implementations">
            Implementations
          </a>{" "}
          at the bottom for status.
        </p>
        <p>
          The component pages (
          <Link to="/docs/vanilla/button" className="link">
            Button
          </Link>
          ,{" "}
          <Link to="/docs/vanilla/card" className="link">
            Card
          </Link>
          ,{" "}
          <Link to="/docs/vanilla/dialog" className="link">
            Dialog
          </Link>
          ) show each component in use, with its markup, parts, variants, and
          the knobs it exposes. This page documents what is fixed for every
          implementation. The default values those knobs ship with are
          implementation detail and live on the component pages.
        </p>
      </section>

      <section>
        <h2>Coverage</h2>
        <p>
          The spec describes the full design language, and each implementation
          ships a subset of it. CSS and HTTP work the same way. The spec
          catalogs features, and the implementations cover what they cover.
        </p>
        <p>
          One guardrail keeps the spec honest: a component lands here only when
          at least one implementation has committed to shipping it. The spec is
          not a wishlist.
        </p>
        <p>
          Token, state, scale, and theming surfaces are foundational and apply
          equally to every implementation. Only component coverage varies, and
          that lives on the{" "}
          <a className="link" href="#implementations">
            Implementations
          </a>{" "}
          table below.
        </p>
      </section>

      <section>
        <h2>Tokens</h2>
        <p>
          The token surface is one Tailwind <code>@theme</code> layer. Every
          component reads it directly through <code>var()</code>: colors from{" "}
          <code>--color-*</code>, radius from <code>--radius-*</code>, shadow
          from <code>--shadow-*</code>, spacing from <code>--spacing</code>, and
          type from <code>--font-*</code>, <code>--text-*</code>,{" "}
          <code>--leading-*</code>, and <code>--font-weight-*</code>. A handful
          of tokens that Tailwind has no namespace for stay on{" "}
          <code>--st-*</code>. Every override flows through hover, active, and
          focus because state derivations run at runtime through{" "}
          <code>color-mix(in oklch, …)</code>. The names below are the spec;
          the default values are an implementation detail that lives in each
          impl&rsquo;s theme file.{" "}
          <Link to="/docs/theming" className="link">
            Theming
          </Link>{" "}
          covers how to override them.
        </p>

        <h3>Intent</h3>
        <p>
          Five paired tokens for semantic color. Each pairs a base with a
          foreground so text contrast survives a base swap.
        </p>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Pair</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--color-primary</code>
              </td>
              <td>
                <code>--color-primary-foreground</code>
              </td>
              <td>
                Brand color. Drives the default <code>--color-ring</code> and
                the <code>--color-highlight</code> tint
              </td>
            </tr>
            <tr>
              <td>
                <code>--color-success</code>
              </td>
              <td>
                <code>--color-success-foreground</code>
              </td>
              <td>Positive state</td>
            </tr>
            <tr>
              <td>
                <code>--color-warning</code>
              </td>
              <td>
                <code>--color-warning-foreground</code>
              </td>
              <td>Caution. Foreground stays dark across themes</td>
            </tr>
            <tr>
              <td>
                <code>--color-danger</code>
              </td>
              <td>
                <code>--color-danger-foreground</code>
              </td>
              <td>Destructive or error</td>
            </tr>
            <tr>
              <td>
                <code>--color-info</code>
              </td>
              <td>
                <code>--color-info-foreground</code>
              </td>
              <td>Informational</td>
            </tr>
          </tbody>
        </table>

        <h3>Surface tier</h3>
        <p>
          Background, foreground, and the surface levels for stacked panels.{" "}
          <code>--color-muted-foreground</code> is the secondary text color
          paired with every surface.
        </p>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--color-background</code>
              </td>
              <td>Page background</td>
            </tr>
            <tr>
              <td>
                <code>--color-foreground</code>
              </td>
              <td>Primary text color</td>
            </tr>
            <tr>
              <td>
                <code>--color-surface</code>
              </td>
              <td>Default raised surface (cards, dialogs)</td>
            </tr>
            <tr>
              <td>
                <code>--color-surface-2</code>
              </td>
              <td>
                Second-tier surface stacked on <code>--color-surface</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--color-surface-3</code>
              </td>
              <td>Third-tier surface for the densest stacks</td>
            </tr>
            <tr>
              <td>
                <code>--color-border</code>
              </td>
              <td>Hairline borders between surfaces</td>
            </tr>
            <tr>
              <td>
                <code>--color-border-strong</code>
              </td>
              <td>Higher-contrast border for emphasized edges</td>
            </tr>
            <tr>
              <td>
                <code>--color-muted-foreground</code>
              </td>
              <td>Secondary text on any surface</td>
            </tr>
          </tbody>
        </table>
        <p>
          Two more tokens, <code>--color-overlay</code> and{" "}
          <code>--color-overlay-foreground</code>, paint theme-independent
          chrome (dark surfaces that stay dark in both themes, like an image
          overlay). They do not flip per theme.
        </p>

        <h3>Interactional</h3>
        <p>Tokens that paint interactive states regardless of intent.</p>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--color-neutral</code>
              </td>
              <td>
                Rest fill for filled-neutral controls. Paired with{" "}
                <code>--color-neutral-foreground</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--color-accent</code>
              </td>
              <td>
                Hover background over neutral or transparent surfaces. Paired
                with <code>--color-accent-foreground</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--color-highlight</code>
              </td>
              <td>
                Persistent selected or current background, a soft primary tint.
                Paired with <code>--color-highlight-foreground</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--color-ring</code>
              </td>
              <td>
                Focus ring color. Defaults to <code>--color-primary</code> so
                brand swaps repaint focus
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Geometry</h3>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--radius</code>
              </td>
              <td>
                Radius base. The tiers below are multiples of it, so one
                override scales every corner in the system at once
              </td>
            </tr>
            <tr>
              <td>
                <code>--radius-sm</code>
              </td>
              <td>Small radius tier, for chips and inline shapes</td>
            </tr>
            <tr>
              <td>
                <code>--radius-md</code>
              </td>
              <td>Default radius tier for everyday surfaces</td>
            </tr>
            <tr>
              <td>
                <code>--radius-lg</code>
              </td>
              <td>Large radius tier for elevated surfaces</td>
            </tr>
            <tr>
              <td>
                <code>--shadow-sm</code>
              </td>
              <td>Soft floating elevation, for tooltip-class surfaces</td>
            </tr>
            <tr>
              <td>
                <code>--shadow-md</code>
              </td>
              <td>
                Default elevation, for cards, dropdowns, popovers, toasts,
                accordion
              </td>
            </tr>
            <tr>
              <td>
                <code>--shadow-lg</code>
              </td>
              <td>Modal elevation, for dialog and drawer</td>
            </tr>
            <tr>
              <td>
                <code>--shadow-xl</code>
              </td>
              <td>
                Highest elevation, unassigned by default, for the most-lifted
                surfaces
              </td>
            </tr>
            <tr>
              <td>
                <code>--spacing</code>
              </td>
              <td>
                Spacing base. Every padding, gap, and height is a multiple of it
                via <code>--spacing(n)</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--st-border-width</code>
              </td>
              <td>
                Width of every bordered shape's outline. Internal dividers stay
                literal 1&nbsp;px
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          The table lists the tiers the components use. The full Tailwind scale
          (<code>--radius-xs</code> through <code>--radius-4xl</code>) is
          overridden too, each a multiple of <code>--radius</code>, so utilities
          like <code>rounded-xl</code> stay on the same ramp and one override
          scales every tier together; you can still override a single tier on
          its own. The shadow tiers stay independent values, so a theme that
          wants every shadow flat overrides each tier.
        </p>

        <h3>Type</h3>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--font-sans</code>
              </td>
              <td>Default UI font stack</td>
            </tr>
            <tr>
              <td>
                <code>--font-mono</code>
              </td>
              <td>Monospace stack for code and kbd</td>
            </tr>
          </tbody>
        </table>
        <p>
          Font size (<code>--text-*</code>), line height (
          <code>--leading-*</code>), weight (<code>--font-weight-*</code>),
          letter spacing, and easing are Tailwind&rsquo;s default scales. Stisla
          keeps them as-is and references them directly.
        </p>

        <h3>Z-index and duration</h3>
        <p>
          The z-index scale (<code>--z-index-dropdown</code> through{" "}
          <code>--z-index-tooltip</code>) and the duration scale (
          <code>--transition-duration-fast</code>,{" "}
          <code>--transition-duration-normal</code>,{" "}
          <code>--transition-duration-slow</code>) ride Tailwind&rsquo;s own
          namespaces, so each entry also generates a utility (
          <code>z-modal</code>, <code>duration-fast</code>). Components reference
          the variables directly; the values are force-emitted so those raw
          references resolve even where no utility is used.
        </p>

        <h3>No-namespace tokens</h3>
        <p>
          Only <code>--st-border-width</code> has no matching Tailwind
          namespace. It is a single global default thickness rather than a
          scale, so it lives on <code>:root</code> and components read it
          directly.
        </p>

        <h3>Per-component tokens</h3>
        <p>
          Every component exposes a <code>--&lt;block&gt;-*</code> surface that
          falls back to the global tokens above. <code>--button-radius</code>{" "}
          falls back to <code>--radius-md</code>, <code>--card-bg</code> falls
          back to <code>--color-surface</code>, and so on. The names of those
          per-component tokens are part of the spec, but the defaults are set by
          each implementation. See the Customization section at the bottom of
          each component page for the catalog.
        </p>
        <p>
          Because each knob falls back to a global token, you can retheme one
          component by setting its <code>--&lt;block&gt;-*</code> variables on a
          wrapper, or shift the whole system by changing the global token
          underneath. The fallback resolves at the component element, so wrapper
          overrides flow through correctly.
        </p>
      </section>

      <section>
        <h2>Component anatomy</h2>
        <p>
          Every component is a BEM block with a fixed set of element slots.{" "}
          <code>.card</code> has <code>__header</code>, <code>__body</code>, and{" "}
          <code>__footer</code>; <code>.dialog</code> has{" "}
          <code>__backdrop</code>, <code>__panel</code>, and{" "}
          <code>__content</code>. A port can render those slots with any tag or
          framework primitive it likes, but the slot names are the contract. A
          user who learns Card on one implementation should find the same parts
          on the next.
        </p>

        <h3>Naming</h3>
        <p>
          Block, element, modifier. The block is the component root (
          <code>.card</code>). Elements are its parts, joined with{" "}
          <code>__</code> (<code>.card__header</code>). Modifiers are variants,
          joined with <code>--</code> (<code>.card--flat</code>). The full slot
          list for each block lives on its{" "}
          <Link to="/docs/vanilla/card" className="link">
            component page
          </Link>
          , next to the live demos, so it cannot drift from the implementation.
          Treat the component pages as the source of truth for slot names; this
          page fixes the rules they all follow.
        </p>

        <h3>Intent over appearance</h3>
        <p>
          Variants that carry meaning are named for the meaning, never the
          paint. A control is <code>--primary</code> or <code>--danger</code>,
          not <code>--blue</code> or <code>--red</code>. The name says what the
          variant is for, so it survives a brand swap and reads the same on
          every component that offers it. The intent set is fixed:{" "}
          <code>primary</code>, <code>success</code>, <code>warning</code>,{" "}
          <code>danger</code>, <code>info</code>, and the toned-down{" "}
          <code>neutral</code> and <code>tertiary</code>.
        </p>
        <p>
          Emphasis is a separate axis, and it takes a name for what it renders
          because rendering is all it is. <code>--soft</code> is a tinted fill,{" "}
          <code>--outline</code> a bordered transparent one, and{" "}
          <code>--ghost</code> a fill that surfaces only on interaction, with
          solid as the unmodified default. No intent hides under these. A fill
          that appears on hover is only a rendering, so the visual
          name is the honest one. The two axes are orthogonal and compose on the
          root. <code>.button--danger.button--outline</code> reads as danger
          intent in outline emphasis, and neither rule reaches into the other.
        </p>
        <p>
          Everything else a modifier expresses follows the same test. Size,
          structure, and orientation take descriptive names (<code>--sm</code>,{" "}
          <code>--vertical</code>, <code>--block</code>) because there is no
          meaning underneath them to name instead. The size names are a shared
          vocabulary. <code>--sm</code> means the small step
          on every component that has one, while the actual width or height each
          step resolves to is the component&rsquo;s own. A modifier reads as
          intent only when there is intent to read.
        </p>

        <h3>Flat, never nested</h3>
        <p>
          Modifiers stay flat on the root and compose. A button can be{" "}
          <code>.button--primary.button--lg</code> without either rule reaching
          into the other. Parts stay flat on the root&rsquo;s descendants. No
          modifier nests inside another, and no rule reaches into a bare HTML
          tag, so a component&rsquo;s CSS expresses only what the component
          contributes and nothing leaks in from the surrounding document.
        </p>

        <h3>Flush</h3>
        <p>
          A few modifier names carry one fixed meaning across every block they
          land on, and <code>--flush</code> is the one worth stating outright. It
          closes the gap between a component and the edge it sits against, so the
          block reads as part of its container instead of a thing set on top of
          it. What closes that gap depends on what the component has: a bordered
          block drops its border, a raised block drops its shadow, a block with
          its own background drops the background and radius. The intent stays
          fixed while the mechanics follow the component.
        </p>
        <p>
          Symmetric cases take a plain <code>--flush</code> (
          <code>.accordion--flush</code>, <code>.list-group--flush</code>,{" "}
          <code>.media--flush</code>). When only one edge flushes, the modifier
          takes a side suffix and cancels that side&rsquo;s padding with a
          negative margin (<code>.button--flush-start</code>,{" "}
          <code>.button--flush-end</code>). Read the suffix as the same modifier
          aimed at one edge.
        </p>

        <h3>Knobs, and what isn&rsquo;t one</h3>
        <p>
          Every visual decision a consumer might reasonably tune reads a{" "}
          <code>--&lt;block&gt;-*</code> custom property whose fallback default
          chains to a global token. The Per-component tokens note above covers
          the fallback mechanics; reading each knob through a <code>var()</code>{" "}
          fallback is what keeps it overridable from an ancestor scope.
        </p>
        <Code
          lang="css"
          code={`
.card {
  background:     var(--card-bg, var(--color-surface));
  border-radius:  var(--card-radius, var(--radius-lg));
  box-shadow:     var(--card-shadow, var(--shadow-md));
}
.card--flat { --card-shadow: none; }   /* a modifier reassigns one knob */
`}
        />
        <p>
          Not every declaration is a knob, and the restraint is deliberate. A
          property becomes a variable when a designer would tune it per project
          (color, radius, spacing, type), when it is a meaningful per-instance
          override (a button tone, a dialog width), or when several components
          share one recipe (the focus ring, an overlay scrim). It stays a
          literal when it is internal tuning that only reads as part of a recipe
          (the state-derivation percentages), when it only changes sensibly
          alongside other internals, or when no one can articulate a reason to
          change it. A smaller public surface means fewer accidental breakages
          and less to document. Adding a knob later is cheap; removing one is a
          breaking change, so each implementation starts conservative.
        </p>

        <h3>Paired foregrounds</h3>
        <p>
          Every background-providing token ships a paired{" "}
          <code>-foreground</code>. If a component introduces a new background
          variable, it introduces the paired foreground at the same time, so a
          token override never strands a text color against an unreadable
          backdrop.
        </p>

        <p>
          Component classes ship in <code>@layer components</code>. Utility
          classes ship in <code>@layer utilities</code>, a later cascade layer,
          so a utility always wins over a component without{" "}
          <code>!important</code>. Stisla does not ship its own grid; layout is
          plain CSS and Tailwind utilities.
        </p>
      </section>

      <section>
        <h2>States</h2>
        <p>
          Interactive surfaces answer to a fixed vocabulary. Implementations
          choose how each state paints (the tokens decide that), but the state
          names and the runtime hooks below are part of the contract.
        </p>

        <h3>Interactive states</h3>
        <p>
          Every interactive component supports the same six states.
          Pseudo-classes drive the first four, and the rest are explicit.
        </p>
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Trigger</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rest</td>
              <td>default</td>
              <td>The base painted by the component's tokens</td>
            </tr>
            <tr>
              <td>Hover</td>
              <td>
                <code>:hover</code>
              </td>
              <td>
                Derives at runtime from the base via{" "}
                <code>color-mix(in oklch, …)</code>. The exact curve is an
                implementation default
              </td>
            </tr>
            <tr>
              <td>Active</td>
              <td>
                <code>:active</code>
              </td>
              <td>Derives at runtime, a step beyond hover</td>
            </tr>
            <tr>
              <td>Focus</td>
              <td>
                <code>:focus-visible</code>
              </td>
              <td>
                Ring derives from <code>--color-ring</code>. Never{" "}
                <code>:focus</code> for the visible ring
              </td>
            </tr>
            <tr>
              <td>Disabled</td>
              <td>
                <code>:disabled</code> on form controls,{" "}
                <code>aria-disabled="true"</code> on link buttons
              </td>
              <td>Tone reduces; pointer events block</td>
            </tr>
            <tr>
              <td>Loading</td>
              <td>
                <code>aria-busy="true"</code>
              </td>
              <td>
                Spinner replaces or augments content. Click is blocked while
                applied
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Runtime state hooks</h3>
        <p>
          Two prefixes, split by origin. Primitive-library-aligned states use{" "}
          <code>[data-state]</code>. Stisla-original states use data attributes
          named for the specific concept.
        </p>
        <table>
          <thead>
            <tr>
              <th>Hook</th>
              <th>Components</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>data-state="open"</code> / <code>"closed"</code>
              </td>
              <td>
                Accordion, Collapsible, Dialog, Drawer, Menu, Popover, Tooltip
              </td>
              <td>Disclosure open or closed</td>
            </tr>
            <tr>
              <td>
                <code>data-state="active"</code> / <code>"inactive"</code>
              </td>
              <td>Tabs, Toggle, Toggle group</td>
              <td>Selected / current vs. not</td>
            </tr>
            <tr>
              <td>
                <code>data-state="checked"</code>
              </td>
              <td>Checkbox, Radio, Switch</td>
              <td>On state of a binary control</td>
            </tr>
            <tr>
              <td>
                <code>aria-busy="true"</code>
              </td>
              <td>Button, Input</td>
              <td>Async work in flight</td>
            </tr>
            <tr>
              <td>
                <code>[data-collapsed]</code>
              </td>
              <td>Sidebar</td>
              <td>Persistent rail-collapsed state</td>
            </tr>
            <tr>
              <td>
                <code>[data-indeterminate]</code>
              </td>
              <td>Checkbox, Progress</td>
              <td>Tri-state or unknown</td>
            </tr>
            <tr>
              <td>
                <code>[aria-invalid]</code>, <code>:user-invalid</code>
              </td>
              <td>Form controls</td>
              <td>Validation failure</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interactivity</h2>
        <p>
          Components that open, close, select, or toggle expose their state
          through the runtime hooks above. How that state gets set is the
          implementation&rsquo;s job. Each implementation drives interactivity
          through a primitive layer suited to its framework, and the same CSS
          paints the result, so a <code>data-state="open"</code> dialog looks
          identical no matter what set the attribute.
        </p>
        <table>
          <thead>
            <tr>
              <th>Implementation</th>
              <th>Interactivity layer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vanilla</td>
              <td>
                A small runtime drives <code>data-stisla-*</code> markup, backed
                by a few vendored primitives for positioning and focus
                containment
              </td>
            </tr>
            <tr>
              <td>React</td>
              <td>Base UI headless primitives</td>
            </tr>
            <tr>
              <td>Vue</td>
              <td>Reka (planned)</td>
            </tr>
          </tbody>
        </table>
        <p>
          The contract is the state vocabulary and the behavior, whatever library
          sits underneath. A port may also ship a different set of interactive
          components; see{" "}
          <a className="link" href="#coverage">
            Coverage
          </a>
          . The runtime details for the vanilla implementation live on the{" "}
          <Link to="/docs/vanilla/javascript" className="link">
            JavaScript
          </Link>{" "}
          page.
        </p>
      </section>

      <section>
        <h2>Scales</h2>
        <p>
          Three knobs reshape the system. Implementations expose them as global
          tokens, and per-component overrides ride on top.
        </p>
        <table>
          <thead>
            <tr>
              <th>Knob</th>
              <th>Token</th>
              <th>Range</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Radius</td>
              <td>
                <code>--radius-sm</code> / <code>--radius-md</code> /{" "}
                <code>--radius-lg</code>
              </td>
              <td>
                Three independent tiers, from 0 (square) to roomy. Components
                pick a tier; override the tier to reshape rounding
              </td>
            </tr>
            <tr>
              <td>Spacing</td>
              <td>
                <code>--spacing</code>
              </td>
              <td>
                0.25rem base. Every padding, gap, and height is a multiple of
                it. Raise for roomier, lower for compact
              </td>
            </tr>
            <tr>
              <td>Brand</td>
              <td>
                <code>--color-primary</code>
              </td>
              <td>
                Any OKLCH (or any color), repaints every primary-toned surface,
                hover, active, focus, and highlight
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Theming</h2>
        <p>
          Light and dark are deltas on the same token surface rather than
          separate themes. A port honors them by writing two blocks. A base, and
          a dark override scoped to <code>[data-theme="dark"]</code> or{" "}
          <code>.dark</code>.
        </p>

        <h3>Flips per theme</h3>
        <ul>
          <li>
            Surface tier: <code>--color-background</code>,{" "}
            <code>--color-foreground</code>, <code>--color-surface</code>,{" "}
            <code>--color-surface-2</code>, <code>--color-surface-3</code>,{" "}
            <code>--color-border</code>, <code>--color-border-strong</code>,{" "}
            <code>--color-muted-foreground</code>
          </li>
          <li>
            Interactional pairs: <code>--color-neutral</code>,{" "}
            <code>--color-neutral-foreground</code>, <code>--color-accent</code>
            , <code>--color-accent-foreground</code>
          </li>
        </ul>

        <h3>Stays put</h3>
        <ul>
          <li>
            Intents and their foregrounds: <code>--color-primary</code>,{" "}
            <code>--color-success</code>, <code>--color-warning</code>,{" "}
            <code>--color-danger</code>, <code>--color-info</code>
          </li>
          <li>
            Overlay chrome: <code>--color-overlay</code>,{" "}
            <code>--color-overlay-foreground</code>
          </li>
          <li>
            Geometry, spacing, and type: <code>--radius-*</code>,{" "}
            <code>--shadow-*</code>, <code>--spacing</code>,{" "}
            <code>--font-sans</code>, <code>--font-mono</code>
          </li>
        </ul>

        <p>
          Per-component <code>-foreground</code> pairings are mandatory. If a
          component introduces a new background variable, it introduces the
          paired foreground at the same time, so a token override never strands
          a text color.
        </p>
      </section>

      <section>
        <h2>Accessibility</h2>
        <p>
          Accessibility is part of the contract. Every
          implementation operates the same way from the keyboard, exposes the
          same roles and relationships to assistive technology, and keeps the
          painted state and the announced state in sync. The mechanics differ by
          framework; the guarantees do not.
        </p>

        <h3>Keyboard</h3>
        <p>
          Every interactive component is fully operable without a pointer. Enter
          and Space activate controls, Escape dismisses overlays, and arrow keys
          move within composites like Menu, Tabs, and Radio group. Tab order
          follows the document, and a composite is a single tab stop with
          arrow-key movement inside it rather than one stop per child. The exact
          keys each component binds live on its{" "}
          <Link to="/docs/vanilla/button" className="link">
            component page
          </Link>
          , next to the demos, so they cannot drift from the implementation.
        </p>

        <h3>Roles and relationships</h3>
        <p>
          A port may render a slot with any tag, but it lands on the role the
          spec fixes for that slot. A Dialog is a dialog to assistive technology
          whether it is built from a <code>div</code> or a framework primitive.
          Labels and descriptions are wired through the matching aria
          attributes. A dialog points at its title and description, a field
          points at its error, and a control that shows only an icon carries an
          accessible name.
        </p>

        <h3>State is announced, not just painted</h3>
        <p>
          The runtime hooks in{" "}
          <a className="link" href="#states">
            States
          </a>{" "}
          double as the accessibility surface. The attribute that paints a state
          is the one that announces it. Open and closed ride{" "}
          <code>aria-expanded</code>, selection rides <code>aria-selected</code>{" "}
          or <code>aria-checked</code>, async work rides <code>aria-busy</code>,
          and a failed field rides <code>aria-invalid</code>. Assistive
          technology and the stylesheet read one source of truth, so they cannot
          disagree.
        </p>

        <h3>Focus management</h3>
        <p>
          The visible ring is covered under{" "}
          <a className="link" href="#focus">
            Focus
          </a>
          . Beyond paint, overlays manage focus. Opening a Dialog or Drawer
          moves focus inside and contains it there, and closing returns focus to
          the trigger. This is behavior the interactivity layer owns, and every
          port honors it however its primitives express it.
        </p>

        <h3>Contrast and motion</h3>
        <p>
          Paired foregrounds are an accessibility mechanism as much as a theming
          one. Because every background token ships a foreground tuned against
          it, a token swap repaints text and surface together and never strands
          one against the other.{" "}
          <a className="link" href="#motion">
            Motion
          </a>{" "}
          collapses under <code>prefers-reduced-motion</code> while leaving the
          start and end states intact, so a reduced-motion user still lands on a
          settled, addressable state.
        </p>

        <p>
          System-wide guarantees live here. The specifics each component adds,
          the exact keys it binds, the roles its slots take, and the labels it
          requires, live on the component page so they stay next to the markup
          that has to deliver them.
        </p>
      </section>

      <section>
        <h2>Focus</h2>
        <p>
          One ring rule across the system. The visible ring derives from{" "}
          <code>--color-ring</code>, which defaults to{" "}
          <code>--color-primary</code> so a brand swap repaints every focus. The
          ring is rendered with <code>box-shadow</code> or <code>outline</code>,
          but not both. Only <code>:focus-visible</code> paints the ring.{" "}
          <code>:focus</code> on its own is invisible because it fires on mouse
          clicks too.
        </p>
      </section>

      <section>
        <h2>Motion</h2>
        <p>
          Disclosure components (Accordion, Collapsible, Dialog, Drawer, Menu,
          Popover, Toast, Tooltip) transition between{" "}
          <code>data-state="open"</code> and <code>data-state="closed"</code>.
          The shape of that transition is up to the implementation. The contract
          is that both states are settled and addressable.{" "}
          <code>prefers-reduced-motion</code> collapses the transition to zero
          duration but keeps the start and end states intact.
        </p>
      </section>

      <section>
        <h2>Implementations</h2>
        <p>
          One spec, many implementations. Status as of <code>3.0.0-beta.1</code>
          .
        </p>
        <table>
          <thead>
            <tr>
              <th>Implementation</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vanilla CSS + JS</td>
              <td>
                Ships in <code>3.0.0-beta.1</code>
              </td>
              <td>
                Reference implementation.{" "}
                <Link to="/docs/vanilla/installation" className="link">
                  Installation
                </Link>
              </td>
            </tr>
            <tr>
              <td>React</td>
              <td>In progress</td>
              <td>
                Same tokens, same class names, headless interactions via Base UI
              </td>
            </tr>
            <tr>
              <td>Vue</td>
              <td>Planned</td>
              <td>Same tokens, same class names</td>
            </tr>
          </tbody>
        </table>
        <p>
          Every implementation reads from the same Tailwind <code>@theme</code>{" "}
          token surface and ships the same BEM class names. A page authored
          against one implementation should swap to another without rewriting
          markup.
        </p>
      </section>
    </>
  );
}
