import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/customization")({
  component: CustomizationDocs,
});

function CustomizationDocs() {
  return (
    <>
      <header>
        <h1>Customization</h1>
        <p className="lead">Everything you need to make Stisla yours. The token surface, how overrides flow through the cascade, escape hatches for state derivation, recipes, and the pattern for building your own component.</p>
      </header>

      <section>
        <h2>Tokens</h2>
        <p>Every visual decision lives in a small set of CSS custom properties named with the <code>--st-*</code> prefix. Set one on <code>:root</code> to retheme the whole app. Scope the override to a wrapper class to retheme only that subtree. Components read their tokens via <code>var()</code>, so they pick up new values without a rebuild.</p>
        <p>The values ship as OKLCH literals because hover and active states derive at runtime via <code>color-mix(in oklch, &hellip;)</code>. OKLCH mixing stays vivid through the midpoints, where sRGB mixing tends to muddy the brand colors you would pick. Your overrides can use any color representation (HSL, hex, sRGB), but the defaults are OKLCH so the derivation curves stay clean.</p>
        <p>Every background-providing token has a paired <code>-foreground</code>. If you override one, override the other. The pairing keeps text contrast safe when a base hue changes.</p>

        <h3>Intent</h3>
        <p>Five paired tokens for semantic color. Foregrounds flip per-intent so text contrast survives a base swap. <code>--st-warning-foreground</code> stays dark in both themes (yellow stays yellow, text on it stays dark).</p>
        <table>
          <thead><tr><th>Token</th><th>Pair</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td><code>--st-primary</code></td><td><code>--st-primary-foreground</code></td><td>Brand color. Drives <code>--st-ring</code> and the <code>--st-highlight</code> tint</td></tr>
            <tr><td><code>--st-success</code></td><td><code>--st-success-foreground</code></td><td>Positive state</td></tr>
            <tr><td><code>--st-warning</code></td><td><code>--st-warning-foreground</code></td><td>Caution</td></tr>
            <tr><td><code>--st-danger</code></td><td><code>--st-danger-foreground</code></td><td>Destructive or error</td></tr>
            <tr><td><code>--st-info</code></td><td><code>--st-info-foreground</code></td><td>Informational</td></tr>
          </tbody>
        </table>

        <h3>Surface tier</h3>
        <p>Page background, primary text, and three stacked surface levels. Every surface tier flips per theme; foregrounds flip with them so contrast holds (see <a className="link" href="#dark-mode">Dark mode</a>). <code>--st-muted-foreground</code> is the secondary text color paired with every surface.</p>
        <table>
          <thead><tr><th>Token</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td><code>--st-background</code></td><td>Page background</td></tr>
            <tr><td><code>--st-foreground</code></td><td>Primary text</td></tr>
            <tr><td><code>--st-surface</code></td><td>Default raised surface (cards, dialogs)</td></tr>
            <tr><td><code>--st-surface-2</code></td><td>Slightly elevated surface</td></tr>
            <tr><td><code>--st-surface-3</code></td><td>Most elevated surface</td></tr>
            <tr><td><code>--st-border</code></td><td>Hairline borders between surfaces</td></tr>
            <tr><td><code>--st-muted-foreground</code></td><td>Secondary text on any surface</td></tr>
          </tbody>
        </table>

        <h3>Interactional</h3>
        <p>Three pairs for stateful neutral surfaces.</p>
        <table>
          <thead><tr><th>Token</th><th>Pair</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td><code>--st-neutral</code></td><td><code>--st-neutral-foreground</code></td><td>Rest fill for filled-neutral elements (<code>.btn--neutral</code>, default badge, kbd, input-group addons)</td></tr>
            <tr><td><code>--st-accent</code></td><td><code>--st-accent-foreground</code></td><td>Transient hover bg over neutral or transparent surfaces</td></tr>
            <tr><td><code>--st-highlight</code></td><td><code>--st-highlight-foreground</code></td><td>Persistent selected-or-current bg, a soft primary tint that derives from <code>--st-primary</code></td></tr>
          </tbody>
        </table>

        <h3>Overlay</h3>
        <p>One pair for chrome that sits on top of imagery (carousel controls, indicators, and captions today, more media surfaces later). Theme-independent on purpose so slide photos read consistently in both light and dark.</p>
        <table>
          <thead><tr><th>Token</th><th>Pair</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td><code>--st-overlay</code></td><td><code>--st-overlay-foreground</code></td><td>Backdrop scrim and chrome foreground for surfaces that ride imagery</td></tr>
          </tbody>
        </table>

        <h3>Focus</h3>
        <p>One token for focus rings. Tracks <code>--st-primary</code> by default so a brand swap repaints every focus ring at the same time.</p>
        <table>
          <thead><tr><th>Token</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td><code>--st-ring</code></td><td>Focus-visible ring color. Components add their own 2&nbsp;px outline using it</td></tr>
          </tbody>
        </table>

        <h3>Geometry</h3>
        <p>Three radius tiers, three shadow tiers, a global border-width knob, and a single spacing base. The radius and shadow tiers are independent literals; components opt into the tier that matches their visual weight. See the <a className="link" href="#brutalist">Brutalist</a> and <a className="link" href="#density">Density</a> recipes below for complete presets that push multiple axes at once.</p>
        <table>
          <thead><tr><th>Token</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td><code>--st-radius-sm</code></td><td>Small radius tier. Inline chips and tight surfaces (kbd, tooltip, icon-box, breadcrumb, sidebar buttons, checkbox)</td></tr>
            <tr><td><code>--st-radius</code></td><td>Default radius tier. Everyday surfaces (button, alert, input-group, pagination, tabs)</td></tr>
            <tr><td><code>--st-radius-lg</code></td><td>Large radius tier. Elevated surfaces (card, accordion, dialog, popover, toast, list-group)</td></tr>
            <tr><td><code>--st-shadow-sm</code></td><td>Soft floating elevation. Tooltip-class surfaces</td></tr>
            <tr><td><code>--st-shadow-md</code></td><td>Default elevation (aliased as <code>--st-shadow</code>). Cards, menus, popovers, toasts, accordion</td></tr>
            <tr><td><code>--st-shadow-lg</code></td><td>Modal elevation. Dialog and drawer (modal surfaces)</td></tr>
            <tr><td><code>--st-shadow-xl</code></td><td>Highest elevation. Unassigned by default, for the most-lifted surfaces</td></tr>
            <tr><td><code>--st-border-width</code></td><td>Width of the shape outline on every bordered component. Internal dividers (card section rules, list-group separators) stay a literal hairline</td></tr>
            <tr><td><code>--st-spacing</code></td><td>Spacing base (0.25rem). Every component padding, gap, and height is a multiple of it via the <code>space()</code> helper, as are the spacing utilities. Raise it for a roomier system, lower it for compact</td></tr>
          </tbody>
        </table>
        <p>Theming runs on two tiers, with nothing in between. Override one of these scale tokens and it cascades into every component that defaults to it, so a whole-system retune is a handful of lines. To retune one component instead, set its own variable (covered next). There is no per-family middle token: a component reads its own <code>--&lt;name&gt;-radius</code> / <code>-shadow</code> / <code>-border-width</code>, whose default chains straight to the scale token above. To pill every button, set <code>--btn-radius: 9999px</code> at <code>:root</code>; to make dialogs heavier, set <code>--dialog-shadow</code>.</p>

        <h3>Type</h3>
        <table>
          <thead><tr><th>Token</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td><code>--st-font-sans</code></td><td>Default body font stack</td></tr>
            <tr><td><code>--st-font-mono</code></td><td>Monospace font stack for code, kbd, and table data</td></tr>
          </tbody>
        </table>

        <h3>Source</h3>
        <p>The shipped defaults live in <code>src/scss/tokens/_theme.scss</code>. Read that file when you want a starting copy with current values. Override the names you care about in your own stylesheet, loaded after the framework bundle.</p>
      </section>

      <section>
        <h2>Override scopes</h2>
        <p>The cascade gives you four scopes for any token override. Same mechanism (CSS variable plus inheritance) at every level. Specificity never fights you because variables inherit; selectors don&rsquo;t.</p>
        <p>The scenario below is the same in each example. Turn the primary brand color green. Pick the smallest scope that covers what you actually need.</p>

        <h3>Global</h3>
        <p>Set the token on <code>:root</code> in a stylesheet that loads after <code>stisla.css</code>. The change applies to the whole app.</p>
        <Code lang="css" code={`
:root {
  --st-primary: oklch(0.65 0.18 149);
}
`} />

        <h3>Theme variant</h3>
        <p>Same write, scoped to a theme attribute. Toggle <code>data-theme="brand"</code> on <code>&lt;html&gt;</code> or any wrapper to switch in.</p>
        <Code lang="css" code={`
[data-theme="brand"] {
  --st-primary: oklch(0.65 0.18 149);
}
`} />

        <h3>Scoped wrapper</h3>
        <p>Define the token on a wrapper class. Every primary-tinted component inside the wrapper picks up the new value, because the variable inherits down the tree. Hover the buttons below to see hover and focus derivations track the override.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Default primary</button>
  <div class="demo-row" style="--st-primary: oklch(0.65 0.18 149); --st-primary-foreground: oklch(1 0 0)">
    <button type="button" class="btn btn--primary">Wrapper override</button>
    <button type="button" class="btn btn--ghost btn--primary">Ghost retints too</button>
  </div>
</div>
`} />

        <h3>Single element</h3>
        <p>Write the variable inline on the element. Inline always wins on specificity, no <code>!important</code> needed.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Default primary</button>
  <button type="button" class="btn btn--primary" style="--st-primary: oklch(0.65 0.18 149); --st-primary-foreground: oklch(1 0 0)">Inline override</button>
</div>
`} />

        <p>Pick the smallest scope that still covers what you need. A one-off brand button doesn&rsquo;t need a whole-app retheme. A multi-section dashboard doesn&rsquo;t need an inline write on every element.</p>

        <p>Two other override paths live alongside the token surface:</p>
        <ul>
          <li><strong>Component-scoped variables.</strong> Every component exposes its own knobs that fall back to global tokens (<code>--btn-radius</code>, <code>--dialog-bg</code>, <code>--alert-tone</code>). Set a component variable when you want one shape&rsquo;s knob to differ from the global default. See each component&rsquo;s Customization section.</li>
          <li><strong>Utility classes.</strong> Single-property tweaks (color, spacing, typography, sizing). For one-off changes to existing components. See <a className="link" href="/utilities">Utilities</a>.</li>
        </ul>
        <p>Reach for Sass only for things tokens and utilities can&rsquo;t cover: changing breakpoints (media queries can&rsquo;t read CSS variables), forking a bundle entry to drop components, or rewriting a component from scratch. The <Link to="/docs/optimization" className="link">Optimization</Link> page walks the fork-and-drop recipe with byte counts.</p>
      </section>

      <section>
        <h2>Tweaking a knob that exists</h2>
        <p>The everyday case looks like this. You like the button, you just want the icon a bit larger. <code>--btn-icon-size</code> defaults to <code>1em</code> on every <code>.btn</code>. Three escalation levels from least invasive to most. Stop at the one that matches how broad the change really is.</p>

        <h3>Option A. Inline override</h3>
        <p>Bumps the icon size inside this one button. Tone, padding, height all stay default.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">
    <i data-lucide="upload"></i>
    Default icon
  </button>
  <button type="button" class="btn btn--primary" style="--btn-icon-size: 1.25em">
    <i data-lucide="upload"></i>
    Larger icon
  </button>
</div>
`} />

        <h3>Option B. Your own scoped class</h3>
        <p>You want the icon-prominent treatment in more than one place. Write a modifier class once, apply it where you want it.</p>
        <Demo html={`
<style>
  .btn--prominent-icon { --btn-icon-size: 1.25em; }
</style>
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary btn--prominent-icon">
    <i data-lucide="upload"></i>
    Upload
  </button>
  <button type="button" class="btn btn--neutral btn--prominent-icon">
    <i data-lucide="download"></i>
    Download
  </button>
</div>
`} />
        <p>Specificity matches Stisla&rsquo;s own rule (one class). Your stylesheet loads after <code>stisla.css</code>, so cascade order resolves it. No <code>!important</code>.</p>

        <h3>Option C. Wrap a region</h3>
        <p>Every button inside a region gets the bigger icon. Useful for toolbars and command bars where the icon is the dominant read.</p>
        <Code lang="css" title="app.css" code={`
.toolbar .btn { --btn-icon-size: 1.25em; }
`} />
        <p>Higher specificity (two classes beat one), so this wins even if your stylesheet loads before Stisla&rsquo;s. Reach for it when you can&rsquo;t control load order, or when the change really belongs to a region rather than a button modifier.</p>
      </section>

      <section>
        <h2>Tweaking when there&rsquo;s no knob</h2>
        <p>Plenty of properties in Stisla aren&rsquo;t exposed as variables (see <a className="link" href="#what-to-expose">What to expose</a> below for why). You still have a clean path. Same three escalation options, only now you&rsquo;re targeting the property directly.</p>
        <p>Scenario: the gap between icon and label inside <code>.btn</code> is hardcoded to <code>0.5rem</code>. No <code>--btn-gap</code> variable exists. You want it tighter.</p>

        <h3>Option A. Inline style</h3>
        <Demo html={`
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">
    <i data-lucide="check"></i>
    Default gap
  </button>
  <button type="button" class="btn btn--primary" style="gap: 0.25rem">
    <i data-lucide="check"></i>
    Tight gap
  </button>
</div>
`} />
        <p>Inline always wins. No specificity battle.</p>

        <h3>Option B. Your own scoped class</h3>
        <Demo html={`
<style>
  .btn--tight { gap: 0.25rem; }
</style>
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">
    <i data-lucide="check"></i>
    Default
  </button>
  <button type="button" class="btn btn--primary btn--tight">
    <i data-lucide="check"></i>
    Tight
  </button>
</div>
`} />
        <p>Same specificity as Stisla&rsquo;s <code>.btn</code> rule. Your stylesheet loads after, so cascade order resolves it.</p>

        <h3>Option C. Region-scoped</h3>
        <Code lang="css" title="app.css" code={`
.toolbar .btn { gap: 0.25rem; }
`} />
        <p>Two classes beat one. Wins regardless of load order.</p>

        <p>There&rsquo;s a feedback loop here. If you find yourself overriding the same property in three or more places (one specific <code>gap</code>, one specific <code>padding</code>, one specific <code>font-weight</code>), that&rsquo;s the signal it should become a Stisla variable. File an issue. The user-side overrides are the input to the public knob surface. That&rsquo;s how <code>--btn-rim-mix</code> got exposed when <code>.btn-group</code> needed to lift it.</p>
        <p>Skip the issue when your override is genuinely one-off, project-specific, or just personal preference. Leave those on the project side. Variables are for shared, recurring tunes.</p>
      </section>

      <section>
        <h2>State derivation and escape hatches</h2>
        <p>Stisla derives hover, active, and focus colors from a single source via <code>color-mix(in oklch, &hellip;)</code>. Change one variable and every state recomputes. This is the easy path. It&rsquo;s also escapable at three levels when you want hand-tuned states.</p>
        <p>The reference is <code>.btn</code>. The same pattern shows up in alert, badge, dialog, kbd, list-group, scroll-area, table, and a dozen other components.</p>

        <h3>Level 1. Keep color-mix, swap the source</h3>
        <p>You like the derivation curve, you want a different brand color. Two paths.</p>
        <p>Override <code>--btn-tone</code> when you want the new hue on this button only. The change stops at the button.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Default tone</button>
  <button type="button" class="btn btn--primary" style="--btn-tone: oklch(0.6 0.2 30); --btn-color: oklch(1 0 0)">--btn-tone override</button>
  <button type="button" class="btn btn--primary" style="--btn-tone: oklch(0.68 0.2 142); --btn-color: oklch(1 0 0)">Another tone</button>
</div>
`} />
        <p>Override <code>--st-primary</code> when you want every primary-toned component (buttons, links, focus rings, soft highlights) to follow. The change cascades to the whole subtree under the wrapper.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Default tone</button>
  <button type="button" class="btn btn--primary" style="--st-primary: oklch(0.6 0.2 30); --st-primary-foreground: oklch(1 0 0)">--st-primary override</button>
</div>
`} />
        <p>Either way, hover, active, rim, and bevel all recompute through the same recipe (hover at 88%, active at 78%, rim at 85%). One write, full state machinery intact. Hover the buttons to see it.</p>

        <h3>Level 2. Keep the variable surface, bypass color-mix per state</h3>
        <p>You want hand-picked swatches at each state instead of the derived progression. Set each state&rsquo;s background directly. <code>color-mix</code> never runs because you&rsquo;re writing the final value.</p>
        <Demo html={`
<style>
  .btn--brand        { --btn-bg: oklch(0.60 0.22 30); --btn-color: oklch(1 0 0); --btn-tone: oklch(0.60 0.22 30); }
  .btn--brand:hover  { --btn-bg: oklch(0.55 0.22 30); }
  .btn--brand:active { --btn-bg: oklch(0.50 0.24 30); }
</style>
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Derived states</button>
  <button type="button" class="btn btn--brand">Hand-tuned states</button>
</div>
`} />
        <p>Reach for this when the auto-derived progression doesn&rsquo;t match a designer&rsquo;s hand-picked swatch, or when the perceptual ramp isn&rsquo;t right for an unusual hue.</p>

        <h3>Level 3. Skip the variable layer entirely</h3>
        <p>Plain CSS. Cascade and specificity resolve it. The variable layer isn&rsquo;t involved at all. Reach for this when you&rsquo;re styling something that doesn&rsquo;t belong in Stisla&rsquo;s tone model (a designer-supplied gradient CTA, for instance).</p>
        <Demo html={`
<style>
  .my-cta        { background: linear-gradient(135deg, oklch(0.7 0.2 290), oklch(0.65 0.22 350)); color: oklch(1 0 0); border: 0; padding: 0 1rem; height: 2.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
  .my-cta:hover  { filter: brightness(1.05); }
  .my-cta:active { filter: brightness(0.95); }
</style>
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Stisla button</button>
  <button type="button" class="my-cta">Custom CTA</button>
</div>
`} />

        <p>Here&rsquo;s the framing behind these three. Most design systems pick one mode (forced derivation, or fully manual). Stisla offers both, and you pick per situation. The level you reach for is the level you need. Don&rsquo;t over-commit. Level 1 for a color change, Level 2 for a curve change, Level 3 for leaving the system.</p>
      </section>

      <section>
        <h2>Why you don&rsquo;t need <code>!important</code></h2>
        <p>With scoped variables plus BEM plus cascade order, you can override anything in Stisla without <code>!important</code>. Four common scenarios, each shown live. Hover the buttons to see hover and focus derivations track.</p>

        <h3>Change a token globally or in a region</h3>
        <p>Set the variable on a wrapper. Every descendant component inherits it. No fight at all because variables inherit. The cascade isn&rsquo;t even involved in the <em>use</em> of the variable.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Default primary</button>
  <div class="demo-row" style="--st-primary: oklch(0.65 0.18 149); --st-primary-foreground: oklch(1 0 0)">
    <button type="button" class="btn btn--primary">Green via wrapper</button>
    <button type="button" class="btn btn--soft btn--primary">Soft retints</button>
  </div>
</div>
`} />

        <h3>Override a component property on a single element</h3>
        <p>Inline style. Wins because inline-style specificity beats any class.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Default radius</button>
  <button type="button" class="btn btn--primary" style="border-radius: 0">Square (inline)</button>
</div>
`} />

        <h3>Override a component property in a region</h3>
        <p>Wrapper class plus the same selector. Two classes beat one on specificity, so the rule wins regardless of load order.</p>
        <Demo html={`
<style>
  .demo-pill-region .btn { border-radius: 9999px; }
</style>
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Default radius</button>
  <div class="demo-pill-region demo-row">
    <button type="button" class="btn btn--primary">Pilled</button>
    <button type="button" class="btn btn--neutral">Pilled too</button>
  </div>
</div>
`} />

        <h3>Override a component knob for a region</h3>
        <p>Set the component&rsquo;s own variable on a wrapper. Stisla components read their knobs via a <code>--&lt;component&gt;-&lt;prop&gt;</code> fallback whose default chains to the scale, so a wrapper override flows through inheritance to every instance inside.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md">
  <button type="button" class="btn btn--primary">Default radius</button>
  <div class="demo-row" style="--btn-radius: 0">
    <button type="button" class="btn btn--primary">Square (wrapper knob)</button>
    <button type="button" class="btn btn--neutral">Square neutral</button>
  </div>
</div>
`} />

        <h3>The one exception: utilities</h3>
        <p>Utility classes (everything in <a className="link" href="/utilities">/utilities</a>) ship with <code>!important</code> on purpose. A utility is a tweak meant to win. If <code>.text-danger</code> is on an element, the user is explicitly saying &ldquo;this color, no matter what.&rdquo; The <code>!important</code> makes that promise reliable.</p>
        <Demo html={`
<div class="demo-stack" style="gap: 0.25rem">
  <p class="lead">A .lead paragraph at its default color.</p>
  <p class="lead text-danger">Same .lead, .text-danger wins via the utility's !important.</p>
</div>
`} />
        <p>The general rule reads like this. <code>!important</code> in component CSS is a smell. <code>!important</code> in utility CSS is a contract.</p>
      </section>

      <section>
        <h2>Utility vs component</h2>
        <p>The utilities file header puts it as a rule. Utilities are tweaks. They aren&rsquo;t building blocks. If you reach for the same utility chain three times, write a component. If you reach for it once or twice, leave it inline.</p>
        <p>The concrete signal is utility-stacking. Stacking <code>.p-4 .rounded .border .bg-surface</code> on a <code>&lt;div&gt;</code> to build something card-shaped means you&rsquo;re using utilities as building blocks. Write the component instead. The component file is small, scoped, deletable, and tells the next reader of the code what the thing actually is.</p>
        <p>The handful of utilities Stisla ships exist for the small set of tweaks that genuinely don&rsquo;t need a component. A heading muted in one place. A button row with extra gap to its neighbor. A card that needs to be flex in a single layout. That&rsquo;s the entire purpose.</p>
      </section>

      <section>
        <h2>Building your own component</h2>
        <p>The teaching frame is the rule of three. Don&rsquo;t abstract until you&rsquo;ve used the same pattern three times. Two uses is duplication. Three is a pattern.</p>

        <h3>First use, second use, third use</h3>
        <p><strong>First use.</strong> Name it specifically. A card showing a product is <code>product-card</code>. Reach for the specific name over a generic guess like <code>media-card</code> or <code>card-with-image</code>. Specific names are honest, and renaming later is cheaper than un-abstracting.</p>
        <p><strong>Second use, same structure, different content.</strong> You have <code>product-card</code> and now need <code>article-card</code>. Look at what&rsquo;s actually shared.</p>
        <ul>
          <li><strong>Same DOM, same visual treatment.</strong> Rename to a content-neutral name that describes structure (<code>media-card</code>), or use the existing <code>.card</code> with a <code>.card__media</code> part. One class, two uses.</li>
          <li><strong>Same visual treatment, different DOM.</strong> Write a small Sass placeholder or mixin (<code>@mixin elevated-surface</code>) and include it in both. Two classes, one source of truth for the shared bit.</li>
          <li><strong>Looks similar but actually diverges.</strong> Duplicate. Premature unification costs more than duplication; you&rsquo;ll regret it the first time one of them needs to evolve independently.</li>
        </ul>
        <p><strong>Third use.</strong> Now you have permission to abstract. The shape of the abstraction reveals itself by then. The class names, the variables, the parts. They&rsquo;re obvious because you&rsquo;ve already written them three times.</p>

        <h3>Worked example: <code>.notice</code></h3>
        <p>A short banner with an icon, a message, and an intent. Forty lines of Sass using Stisla patterns end to end.</p>
        <Code lang="scss" title="src/scss/components/_notice.scss" code={`
.notice {
  // Component-scoped vars. --notice-radius derives from a global token so your
  // radius choice reaches this component; spacing is plain rem you can tune.
  --notice-padding: 0.625rem 0.875rem;
  --notice-radius:  var(--st-radius);
  --notice-gap:     0.625rem;

  // Tone is the single source. bg, border, and icon derive from it via
  // color-mix, so swapping --notice-tone repaints every part. Body text
  // stays on --st-foreground — saturated intent colors make great
  // accents but punishing reading copy. Mix against transparent (not
  // --st-surface) so the result is a translucent tone composited over
  // whatever parent bg the notice sits on; mixing in oklch against pure
  // white shifts the result hue toward red via powerless-hue interp.
  --notice-tone:   var(--st-foreground);
  --notice-bg:     color-mix(in oklch, var(--notice-tone) 10%, transparent);
  --notice-border: color-mix(in oklch, var(--notice-tone) 30%, transparent);

  display: flex;
  align-items: center;
  gap: var(--notice-gap);
  padding: var(--notice-padding);
  font-size: 0.875rem;

  background: var(--notice-bg);
  color: var(--st-foreground);
  border: 1px solid var(--notice-border);
  border-radius: var(--notice-radius);

  > svg {
    flex: none;
    width: 1.125em;
    height: 1.125em;
    color: var(--notice-tone);
  }
}

// Intent modifiers reassign the source. Every derived var follows.
.notice--info    { --notice-tone: var(--st-info); }
.notice--success { --notice-tone: var(--st-success); }
.notice--warning { --notice-tone: var(--st-warning); }
.notice--danger  { --notice-tone: var(--st-danger); }
`} />
        <Demo html={`
<style>
  .notice {
    --notice-padding: 0.625rem 0.875rem;
    --notice-radius:  var(--st-radius);
    --notice-gap:     0.625rem;
    --notice-tone:    var(--st-foreground);
    --notice-bg:      color-mix(in oklch, var(--notice-tone) 10%, transparent);
    --notice-border:  color-mix(in oklch, var(--notice-tone) 30%, transparent);
    display: flex;
    align-items: center;
    gap: var(--notice-gap);
    padding: var(--notice-padding);
    font-size: 0.875rem;
    background: var(--notice-bg);
    color: var(--st-foreground);
    border: 1px solid var(--notice-border);
    border-radius: var(--notice-radius);
  }
  .notice > svg {
    flex: none;
    width: 1.125em;
    height: 1.125em;
    color: var(--notice-tone);
  }
  .notice--info    { --notice-tone: var(--st-info); }
  .notice--success { --notice-tone: var(--st-success); }
  .notice--warning { --notice-tone: var(--st-warning); }
  .notice--danger  { --notice-tone: var(--st-danger); }
</style>
<div class="demo-stack">
  <div class="notice notice--info">
    <i data-lucide="info"></i>
    <span>Saved 2 minutes ago.</span>
  </div>
  <div class="notice notice--success">
    <i data-lucide="check-circle"></i>
    <span>Order #4291 confirmed.</span>
  </div>
  <div class="notice notice--warning">
    <i data-lucide="alert-triangle"></i>
    <span>Storage at 89%. Consider archiving old runs.</span>
  </div>
  <div class="notice notice--danger">
    <i data-lucide="x-circle"></i>
    <span>Payment failed. Update your card to retry.</span>
  </div>
</div>
`} />
        <p>The component composes with the rest of the system for free. Put a <code>.btn</code> inside a notice, and the button still reads from <code>--st-primary</code> as expected. Override <code>--st-info</code> on a parent and the info-toned notice repaints. Override <code>--notice-tone</code> inline for a one-off and you get the same machinery without authoring a new modifier.</p>
        <p>Document the component the same way every Stisla component is documented. A Customization table at the end of its demo page listing the <code>--notice-*</code> variables (Variable, Use). The <Link to="/docs/vanilla/slider" hash="customization" className="link">Slider</Link> page is the reference shape.</p>
      </section>

      <section id="what-to-expose">
        <h2>What to expose, what to hardcode</h2>
        <p>It&rsquo;s tempting to expose every value as a variable, but the cost shows up later. A bloated public API turns every internal tweak into a breaking change, gives users decision fatigue (which knob do I use?), and adds a documentation burden (every var needs a row in the Customization table).</p>

        <h3>Expose a CSS variable when</h3>
        <ul>
          <li>The value is something a designer would tune per project (color, radius, spacing, type scale).</li>
          <li>The value is a meaningful per-instance override (button tone, dialog width, icon size for an icon-prominent UI).</li>
          <li>Multiple components share the same recipe (focus ring color, overlay scrim).</li>
        </ul>

        <h3>Don&rsquo;t expose a CSS variable when</h3>
        <ul>
          <li>The value is internal tuning. State-derivation percentages (the 88% / 78% in the button hover/active mix) are part of the recipe. Exposing them as knobs would let users break the visual progression by accident.</li>
          <li>The value only makes sense to change as a pair with other internal values.</li>
          <li>You can&rsquo;t articulate a use case for changing it.</li>
        </ul>

        <p>Easier to add a variable later than to remove one. Start conservative. The user override patterns are the right input to what becomes public.</p>
      </section>

      <section>
        <h2>Dark mode</h2>
        <p>Light and dark are deltas on the same token surface. Stisla ships a dark block that flips every surface and interactional token; intents stay (a green button is the same green in dark mode). The dark block matches both <code>[data-theme="dark"]</code> on any ancestor and the bare <code>.dark</code> class on <code>&lt;html&gt;</code>, so React or Vue apps with localStorage-based toggling work out of the box.</p>
        <p>To roll your own dark variant, override the same tokens under either selector. You only need to redeclare what you&rsquo;re changing.</p>
        <Code lang="css" code={`
[data-theme="dark"],
.dark {
  --st-background:       /* your dark background */;
  --st-foreground:       /* your dark foreground */;
  --st-surface:          /* ... */;
  /* override any surface or interactional token here;
     intents (--st-primary, --st-success, ...) stay across themes */
}
`} />
        <p>Two tokens stay theme-independent on purpose. <code>--st-warning-foreground</code> keeps a dark cap because yellow stays yellow and text on it should stay dark in both modes. <code>--st-overlay</code> and <code>--st-overlay-foreground</code> stay constant because they paint chrome on top of imagery, which can be anything.</p>
        <p>The vanilla bundle ships a toggle pattern (sync to <code>localStorage</code>, set <code>data-theme</code> on <code>&lt;html&gt;</code> before paint to avoid flash). The site&rsquo;s own theme toggle is the reference; lift the snippet from <code>src/site/scripts/site.js</code>.</p>
      </section>

      <section>
        <h2>Brand color</h2>
        <p>A single <code>--st-primary</code> override repaints every primary-toned surface. Hover, active, focus ring, and the <code>--st-highlight</code> tint derive from it via <code>color-mix</code> at runtime. No rebuild, no second pass.</p>
        <Demo html={`
<div class="preset-violet">
  <div class="demo-row demo-row--top demo-row--gap-md">
    <div class="card" style="width: 16rem;">
      <div class="card__header">Card title</div>
      <div class="card__body">
        <p class="card__text">A card with a header, body, and footer to show every padding and surface tier respond to the preset.</p>
        <div class="demo-row">
          <button type="button" class="btn btn--primary">Primary</button>
          <button type="button" class="btn btn--outline btn--neutral">Cancel</button>
        </div>
      </div>
      <div class="card__footer">
        <span class="fs-2 text-muted-foreground">Footer note</span>
      </div>
    </div>
    <div class="demo-stack">
      <div class="demo-row">
        <button type="button" class="btn btn--primary">Primary</button>
        <button type="button" class="btn btn--neutral">Neutral</button>
        <button type="button" class="btn btn--tertiary">Tertiary</button>
      </div>
      <div class="demo-row">
        <button type="button" class="btn btn--outline btn--primary">Outline</button>
        <button type="button" class="btn btn--ghost btn--primary">Ghost</button>
        <button type="button" class="btn btn--soft btn--primary">Soft</button>
      </div>
      <div class="demo-row">
        <button type="button" class="btn btn--primary btn--compact">Small</button>
        <button type="button" class="btn btn--primary">Default</button>
        <button type="button" class="btn btn--primary btn--roomy">Large</button>
      </div>
    </div>
  </div>
</div>
`} />
        <Code lang="css" title="_customization-presets.scss" code={`
.preset-violet {
  --st-primary: oklch(0.58 0.22 285);
  --st-primary-foreground: oklch(1 0 0);
}
`} />
        <p>The same shape works for any hue. Picking one is a design decision (perceptual lightness, chroma headroom, accessibility against the foreground). A few starting points to paste and tune:</p>
        <table>
          <thead><tr><th>Brand</th><th><code>--st-primary</code></th></tr></thead>
          <tbody>
            <tr><td>Violet</td><td><code>oklch(0.58 0.22 285)</code></td></tr>
            <tr><td>Teal</td><td><code>oklch(0.65 0.13 195)</code></td></tr>
            <tr><td>Amber</td><td><code>oklch(0.78 0.16 75)</code></td></tr>
            <tr><td>Rose</td><td><code>oklch(0.65 0.21 13)</code></td></tr>
          </tbody>
        </table>
        <p>If you change <code>--st-primary</code>, change <code>--st-primary-foreground</code> at the same time so text on filled primary surfaces stays readable. Most brand hues pair with <code>oklch(1 0 0)</code> (pure white); a pale yellow brand would pair with a darker foreground.</p>
      </section>

      <section>
        <h2>Brutalist</h2>
        <p>A complete preset that retunes multiple axes at once. Radius, shadow, border weight, border color, typography. Shown across a mix of surfaces (navbar, alert, card, dropdown menu, item, avatar, buttons) so the look reads as a system rather than a single-component swap.</p>
        <Demo html={`
<div class="preset-brutalist">
  <div class="demo-stack" style="width: 100%; gap: 1rem;">
    <nav class="navbar" style="width: 100%; border: var(--st-border-width) solid var(--st-border);">
      <a class="navbar__brand" href="#">Acme</a>
      <div class="navbar__menu" data-state="open">
        <ul class="navbar__nav">
          <li><a class="navbar__button" data-state="active" aria-current="page" href="#">Home</a></li>
          <li><a class="navbar__button" href="#">Pricing</a></li>
          <li><a class="navbar__button" href="#">About</a></li>
        </ul>
      </div>
    </nav>

    <div class="alert alert--warning" style="width: 100%;">
      <i data-lucide="alert-triangle"></i>
      <div>Storage is at 89%. Archive old runs to free space.</div>
    </div>

    <div class="demo-row demo-row--top demo-row--gap-md" style="width: 100%;">
      <aside class="sidebar" style="width: 11rem; min-height: 18rem; border: var(--st-border-width) solid var(--st-border);">
        <div class="sidebar__content">
          <nav class="sidebar__menu">
            <div class="sidebar__group">
              <ul class="sidebar__list">
                <li class="sidebar__item">
                  <a class="sidebar__button" href="#" aria-current="page">
                    <i data-lucide="home"></i>
                    Dashboard
                  </a>
                </li>
                <li class="sidebar__item">
                  <a class="sidebar__button" href="#">
                    <i data-lucide="package"></i>
                    Orders
                  </a>
                </li>
                <li class="sidebar__item">
                  <a class="sidebar__button" href="#">
                    <i data-lucide="users"></i>
                    Customers
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      <div class="demo-stack" style="flex: 1; min-width: 0; gap: 1rem;">
        <div class="demo-row demo-row--top demo-row--gap-md">
          <div class="card" style="flex: 1; min-width: 12rem;">
            <div class="card__header">Order #ATL-2918</div>
            <div class="card__body">
              <p class="card__text">Out for delivery, arrives today by 6 PM.</p>
            </div>
            <div class="card__footer">
              <button type="button" class="btn btn--primary btn--compact">Track</button>
            </div>
          </div>

          <ul class="menu__popup" data-state="open" style="position: static; min-width: 9rem;" role="menu">
            <li><button type="button" class="menu__item" role="menuitem">Edit</button></li>
            <li><button type="button" class="menu__item" data-state="active" role="menuitem">Duplicate</button></li>
            <li><button type="button" class="menu__item" role="menuitem">Share</button></li>
            <li><hr class="menu__separator"></li>
            <li><button type="button" class="menu__item" data-danger role="menuitem">Delete</button></li>
          </ul>
        </div>

        <div class="demo-row demo-row--top demo-row--gap-md">
          <div class="field" style="flex: 1; min-width: 12rem;">
            <label for="brutalistEmail" class="field__label">Email</label>
            <input type="email" class="input" id="brutalistEmail" placeholder="you@example.com">
          </div>
          <div class="field" style="flex: 1; min-width: 10rem;">
            <label for="brutalistRegion" class="field__label">Region</label>
            <select class="select" id="brutalistRegion">
              <option selected>Pick one</option>
              <option value="id">Indonesia</option>
              <option value="my">Malaysia</option>
              <option value="sg">Singapore</option>
            </select>
          </div>
        </div>

        <div class="demo-row demo-row--gap-md">
          <div class="field__item">
            <input class="checkbox" type="checkbox" id="brutalistTos" checked>
            <label class="field__label" for="brutalistTos">Agree to terms</label>
          </div>
        </div>

        <div class="media">
          <div class="media__figure">
            <span class="avatar" data-stisla-avatar>
              <span class="avatar__fallback">RF</span>
            </span>
          </div>
          <div class="media__content">
            <div class="media__title">Rosa Frias</div>
            <div class="media__description">rosa@acme.co</div>
          </div>
          <div class="media__action">
            <button type="button" class="btn btn--ghost btn--neutral btn--compact btn--icon-only" aria-label="More">
              <i data-lucide="more-horizontal"></i>
            </button>
          </div>
        </div>

        <div class="demo-row demo-row--gap-md">
          <button type="button" class="btn btn--primary">Confirm</button>
          <button type="button" class="btn btn--outline btn--neutral">Cancel</button>
          <button type="button" class="btn btn--ghost btn--danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</div>
`} />
        <Code lang="css" title="_customization-presets.scss" code={`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

.preset-brutalist {
  --st-radius-sm:       0;
  --st-radius:          0;
  --st-radius-lg:       0;
  --checkbox-radius:    0;  /* checkbox keeps its own radius knob */
  --st-shadow:          6px 6px 0 var(--st-foreground);
  --st-border:          var(--st-foreground);
  --st-border-width:    2px;
  --st-font-sans:       'Space Grotesk', system-ui, sans-serif;
  font-family: var(--st-font-sans);
  font-weight: 500;

  .h1, .h2, .h3, .card__header, .dialog__title, .drawer__title {
    font-weight: 700;
  }
}
`} />
        <p>The look comes from pushing every axis at once. Radius tiers go to zero; the shadow steps up to a 6&nbsp;px solid offset tracking <code>--st-foreground</code> so it flips per theme; <code>--st-border</code> moves from the soft hairline grey to full-contrast foreground; <code>--st-border-width</code> doubles to 2&nbsp;px so every shape outline reads thicker; Space Grotesk replaces the neutral Inter and runs at 500 / 700 weight. Heading weights bump to 700 inside the wrapper &mdash; typographic weight isn&rsquo;t a global token, so the preset overrides those by class.</p>
      </section>

      <section>
        <h2>Density</h2>
        <p>One knob shrinks or grows every component proportionally. Component padding, gap, and height are all multiples of the spacing base <code>--st-spacing</code> through the <code>space()</code> helper, so changing the base reaches every spacing decision in the system at once. Chip-like components (buttons, form fields, pagination chips, navbar buttons, toggles, tabs) read their height the same way, so the box grows on both axes together. Utility-class spacing (<code>.mb-4</code>, <code>.p-2</code>, <code>.my-3</code>) rides the same base.</p>
        <table>
          <thead><tr><th>Preset</th><th>Value</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td>Compact</td><td><code>0.2rem</code></td><td>Information-dense apps, admin dashboards, tabular UIs</td></tr>
            <tr><td>Default</td><td><code>0.25rem</code></td><td>General-purpose product UI</td></tr>
            <tr><td>Comfortable</td><td><code>0.28rem</code></td><td>Marketing surfaces, content-first reading flows</td></tr>
          </tbody>
        </table>
        <Demo html={`
<div class="preset-dense">
  <div class="demo-row demo-row--top demo-row--gap-md">
    <div class="card" style="width: 16rem;">
      <div class="card__header">Card title</div>
      <div class="card__body">
        <p class="card__text">A card with a header, body, and footer to show every padding and surface tier respond to the preset.</p>
        <div class="demo-row">
          <button type="button" class="btn btn--primary">Primary</button>
          <button type="button" class="btn btn--outline btn--neutral">Cancel</button>
        </div>
      </div>
      <div class="card__footer">
        <span class="fs-2 text-muted-foreground">Footer note</span>
      </div>
    </div>
    <div class="demo-stack">
      <div class="demo-row">
        <button type="button" class="btn btn--primary">Primary</button>
        <button type="button" class="btn btn--neutral">Neutral</button>
        <button type="button" class="btn btn--tertiary">Tertiary</button>
      </div>
      <div class="demo-row">
        <button type="button" class="btn btn--outline btn--primary">Outline</button>
        <button type="button" class="btn btn--ghost btn--primary">Ghost</button>
        <button type="button" class="btn btn--soft btn--primary">Soft</button>
      </div>
      <div class="demo-row">
        <button type="button" class="btn btn--primary btn--compact">Small</button>
        <button type="button" class="btn btn--primary">Default</button>
        <button type="button" class="btn btn--primary btn--roomy">Large</button>
      </div>
    </div>
  </div>
</div>
`} />
        <Code lang="css" title="_customization-presets.scss" code={`
.preset-dense {
  --st-spacing: 0.2rem;
}
`} />
        <p>The base is a single length you can dial freely. <code>0.22rem</code> for a slight squeeze, <code>0.27rem</code> for a slight stretch. The whole system retunes at runtime.</p>
      </section>

      <section>
        <h2>Sizing model</h2>
        <p>Chip-like components (buttons, form fields, pagination chips, navbar buttons, toggles, tabs) ship three independent knobs. Shape, content, icon. Override any one without touching the others.</p>
        <ul>
          <li><strong><code>--*-height</code></strong> is the shape knob. It defaults to a <code>space()</code> multiple (the button&rsquo;s is <code>space(9)</code>), so it tracks <code>--st-spacing</code> along with the rest of the system. Override with a plain value (<code>3rem</code>) for a rigid shape that ignores the base, or with your own <code>space()</code> multiple to keep it tracking.</li>
          <li><strong><code>--*-font-size</code></strong> is the label knob. Defaults to <code>0.875rem</code>. Doesn&rsquo;t affect shape; text sits centered inside whatever height you set.</li>
          <li><strong><code>--*-icon-size</code></strong> (and similar) is the icon knob. Defaults to <code>1em</code> so the glyph tracks the font. Bump it to <code>1.25em</code> for icon-prominent UIs without touching height or label size.</li>
        </ul>
        <p>Each size variant (<code>--compact</code>, <code>--roomy</code>) reassigns <code>--*-height</code>, <code>--*-padding-inline</code>, and <code>--*-font-size</code> so the sized chip lands on its compact / default / roomy cadence at the default spacing base.</p>

        <h3>Make one element taller or shorter</h3>
        <p>Override <code>--*-height</code> on the element. A plain value gives a rigid shape that doesn&rsquo;t track the spacing base.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md" style="align-items: center">
  <button type="button" class="btn btn--primary">Default</button>
  <button type="button" class="btn btn--primary" style="--btn-height: 3rem">Rigid</button>
</div>
`} />
        <Code lang="html" code={`
<button class="btn btn--primary" style="--btn-height: 3rem">Rigid</button>
`} />
        <p>Leave the height alone if you want the element to keep tracking the base. The two buttons below sit inside a region with a larger <code>--st-spacing</code>. The first one (rigid <code>3rem</code>) stays put; the second one (default height, a <code>space()</code> multiple) grows with the region.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md" style="align-items: center; --st-spacing: 0.34rem">
  <button type="button" class="btn btn--primary" style="--btn-height: 3rem">Rigid</button>
  <button type="button" class="btn btn--primary">Tracks the base</button>
</div>
`} />
        <Code lang="html" code={`
<div style="--st-spacing: 0.34rem">
  <button class="btn btn--primary" style="--btn-height: 3rem">Rigid</button>
  <button class="btn btn--primary">Tracks the base</button>
</div>
`} />

        <h3>Bigger content, same shape</h3>
        <p>Bump <code>--*-icon-size</code> or <code>--*-font-size</code> to grow the content without touching the shape. Content centers inside the height via flex, so it grows toward the box edges without breaking the chip silhouette.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md" style="align-items: center">
  <button type="button" class="btn btn--primary">
    <i data-lucide="upload"></i>
    Default
  </button>
  <button type="button" class="btn btn--primary" style="--btn-icon-size: 1.5em">
    <i data-lucide="upload"></i>
    Big icon
  </button>
</div>
`} />
        <Code lang="html" code={`
<button class="btn btn--primary" style="--btn-icon-size: 1.5em">
  <i data-lucide="upload"></i>
  Big icon
</button>
`} />

        <h3>Resize a region</h3>
        <p>Scope <code>--st-spacing</code> on a wrapper. Every button, field, and chip inside scales together. Use this when &ldquo;the form is tight&rdquo; or &ldquo;the dashboard is roomy&rdquo; describes a whole area. For a single element, the height override above is enough.</p>
        <Demo html={`
<div class="demo-row demo-row--gap-md" style="align-items: flex-start">
  <div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; border: 1px solid var(--st-border); border-radius: var(--st-radius); flex: 1">
    <span style="font-size: 0.75rem; color: var(--st-muted-foreground); text-transform: uppercase; letter-spacing: 0.05em">Default spacing</span>
    <input class="input" placeholder="Email" />
    <div style="display: flex; gap: 0.5rem; justify-content: flex-end">
      <button type="button" class="btn btn--ghost btn--neutral">Cancel</button>
      <button type="button" class="btn btn--primary">Save</button>
    </div>
  </div>
  <div style="--st-spacing: 0.3rem; display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; border: 1px solid var(--st-border); border-radius: var(--st-radius); flex: 1">
    <span style="font-size: 0.75rem; color: var(--st-muted-foreground); text-transform: uppercase; letter-spacing: 0.05em">--st-spacing: 0.3rem</span>
    <input class="input" placeholder="Email" />
    <div style="display: flex; gap: 0.5rem; justify-content: flex-end">
      <button type="button" class="btn btn--ghost btn--neutral">Cancel</button>
      <button type="button" class="btn btn--primary">Save</button>
    </div>
  </div>
</div>
`} />
        <Code lang="html" code={`
<form style="--st-spacing: 0.3rem">
  ...
</form>
`} />
      </section>

      <section>
        <h2>Per-component variables</h2>
        <p>Each component exposes its own scoped variables on top of the global tokens. Set <code>--btn-radius</code> to give buttons a different radius from cards. Set <code>--dialog-bg</code> to retune a dialog without retinting the rest of the system. Component variables fall back through to the matching global token, so leaving them alone gives you the global default.</p>
        <p>Every component page ends with a Customization section that tables its <code>--component-*</code> variables. <Link to="/docs/vanilla/slider" hash="customization" className="link">Slider</Link> is the reference shape (Variable, Use). When you find yourself overriding the same property across three or more components, that&rsquo;s the signal to file an issue. The <a className="link" href="#tweaking-when-theres-no-knob">feedback loop above</a> covers when to ask for a new knob and when to leave the override on the project side.</p>
      </section>
    </>
  );
}
