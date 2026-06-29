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
        <h2>The token surface</h2>
        <p>Every visual decision lives in a small set of CSS custom properties. Colors are <code>--color-*</code>, geometry is <code>--radius-*</code> and <code>--shadow-*</code>, spacing is <code>--spacing</code>, and type is <code>--font-*</code>; a few customs with no Tailwind namespace stay on <code>--st-*</code>. The <Link to="/docs/specification" hash="tokens" className="link">Specification</Link> catalogs every token and what it controls. This page is about changing them.</p>
        <p>Components read their tokens through <code>var()</code>, so an override takes effect with no rebuild. Change a token and every component that reads it repaints, including the hover, active, and focus states that derive from it.</p>
        <p>Two practical rules carry over from the catalog. The shipped values are OKLCH literals because states derive at runtime via <code>color-mix(in oklch, &hellip;)</code>, and OKLCH mixing stays vivid through the midpoints where sRGB tends to muddy a brand color; your own overrides can use any representation (HSL, hex, sRGB). And every background-providing token has a paired <code>-foreground</code>, so if you override one, override the other and text contrast survives the base change.</p>

      </section>

      <section>
        <h2>Setting up overrides</h2>
        <p>An override is just a token you redeclare after the framework loads. There are two setups depending on whether you run a build step; both end at the same place, with your value winning over the shipped default.</p>

        <h3>No build step</h3>
        <p>Write a plain stylesheet, load it after the framework bundle, and declare the tokens you want to change on <code>:root</code>. Nothing to compile.</p>
        <Code lang="html" code={`
<link rel="stylesheet" href="stisla.css">
<link rel="stylesheet" href="overrides.css">
`} />
        <Code lang="css" title="overrides.css" code={`
:root {
  --color-primary: oklch(0.58 0.22 285);
  --color-primary-foreground: oklch(1 0 0);
  --radius-md: 0.5rem;
}
`} />
        <p>Load order is the whole trick. Your file comes after <code>stisla.css</code>, so at equal specificity your <code>:root</code> wins. No <code>!important</code>, no build.</p>

        <h3>With Tailwind</h3>
        <p>If you compile your own CSS with Tailwind, import the source theme rather than the precompiled bundle, then redeclare the tokens inside <code>@theme</code> so they land in the same layer as the shipped ones and regenerate any matching utilities. Tailwind comes in once, at the top. For the dark delta, use the registered <code>dark</code> variant instead of hand-writing the selector (see <a className="link" href="#dark-mode">Dark mode</a>).</p>
        <Code lang="css" title="app.css" code={`
@import "tailwindcss";
@import "@stisla/style/theme.css";   /* the @theme foundation */
/* + the component styles you use */

@theme {
  --color-primary: oklch(0.58 0.22 285);
  --color-primary-foreground: oklch(1 0 0);
  --radius-md: 0.5rem;
}
`} />
        <p>Either way, pick the smallest scope that covers what you need; the next section breaks the scopes down. The result is the same no matter which setup you use:</p>
        <Demo html={`
<div class="flex flex-wrap items-start gap-6">
  <div class="flex flex-col gap-2">
    <span class="text-xs uppercase tracking-[0.05em] text-muted-foreground">Shipped defaults</span>
    <div class="flex items-center gap-3">
      <button type="button" class="button button--primary">Primary</button>
      <button type="button" class="button button--soft button--primary">Soft</button>
    </div>
  </div>
  <div class="flex flex-col gap-2" style="--color-primary: oklch(0.58 0.22 285); --color-primary-foreground: oklch(1 0 0); --radius-md: 0.5rem">
    <span class="text-xs uppercase tracking-[0.05em] text-muted-foreground">After the token override</span>
    <div class="flex items-center gap-3">
      <button type="button" class="button button--primary">Primary</button>
      <button type="button" class="button button--soft button--primary">Soft</button>
    </div>
  </div>
</div>
`} />
        <p>The override here is scoped to a wrapper so both states sit side by side on the page, but a real <code>:root</code> or <code>@theme</code> override repaints exactly the same way, app-wide. Hover the buttons to confirm the derived hover and active states track the new brand color too.</p>

        <h3>Source</h3>
        <p>The shipped defaults live in <code>next/packages/style/src/theme.css</code>. Read that file when you want a starting copy with the current values to paste and edit.</p>
      </section>

      <section>
        <h2>Override scopes</h2>
        <p>The cascade gives you four scopes for any token override. Same mechanism (CSS variable plus inheritance) at every level. Specificity never fights you because variables inherit; selectors don&rsquo;t.</p>
        <p>The scenario below is the same in each example. Turn the primary brand color green. Pick the smallest scope that covers what you actually need.</p>

        <h3>Global</h3>
        <p>Set the token on <code>:root</code> in a stylesheet that loads after <code>stisla.css</code>. The change applies to the whole app.</p>
        <Code lang="css" code={`
:root {
  --color-primary: oklch(0.65 0.18 149);
}
`} />

        <h3>Theme variant</h3>
        <p>Same write, scoped to a theme attribute. Toggle <code>data-theme="brand"</code> on <code>&lt;html&gt;</code> or any wrapper to switch in.</p>
        <Code lang="css" code={`
[data-theme="brand"] {
  --color-primary: oklch(0.65 0.18 149);
}
`} />

        <h3>Scoped wrapper</h3>
        <p>Define the token on a wrapper class. Every primary-tinted component inside the wrapper picks up the new value, because the variable inherits down the tree. Hover the buttons below to see hover and focus derivations track the override.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default primary</button>
  <div class="flex flex-wrap items-center gap-3" style="--color-primary: oklch(0.65 0.18 149); --color-primary-foreground: oklch(1 0 0)">
    <button type="button" class="button button--primary">Wrapper override</button>
    <button type="button" class="button button--ghost button--primary">Ghost retints too</button>
  </div>
</div>
`} />

        <h3>Single element</h3>
        <p>Write the variable inline on the element. Inline always wins on specificity, no <code>!important</code> needed.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default primary</button>
  <button type="button" class="button button--primary" style="--color-primary: oklch(0.65 0.18 149); --color-primary-foreground: oklch(1 0 0)">Inline override</button>
</div>
`} />

        <p>Pick the smallest scope that still covers what you need. A one-off brand button doesn&rsquo;t need a whole-app retheme. A multi-section dashboard doesn&rsquo;t need an inline write on every element.</p>

        <p>One more override path lives alongside the token surface: component-scoped variables. Every component exposes its own knobs that fall back to global tokens (<code>--button-radius</code>, <code>--dialog-bg</code>, <code>--alert-tone</code>). Set a component variable when you want one shape&rsquo;s knob to differ from the global default. See each component&rsquo;s Customization section.</p>
        <p>For things the token and component-variable surface can&rsquo;t cover (forking a bundle to drop components, building a completely custom entry), the <Link to="/docs/vanilla/optimization" className="link">Optimization</Link> page has the recipes.</p>
      </section>

      <section>
        <h2>Tweaking a knob that exists</h2>
        <p>The everyday case looks like this. You like the button, you just want the icon a bit larger. <code>--button-icon-size</code> defaults to <code>--spacing(4)</code> on every <code>.button</code>. Three escalation levels from least invasive to most. Stop at the one that matches how broad the change really is.</p>

        <h3>Option A. Inline override</h3>
        <p>Bumps the icon size inside this one button. Tone, padding, height all stay default.</p>
        <Demo html={`
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
`} />

        <h3>Option B. Your own scoped class</h3>
        <p>You want the icon-prominent treatment in more than one place. Write a modifier class once, apply it where you want it.</p>
        <Demo html={`
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
`} />
        <p>Specificity matches Stisla&rsquo;s own rule (one class). Your stylesheet loads after <code>stisla.css</code>, so cascade order resolves it. No <code>!important</code>.</p>

        <h3>Option C. Wrap a region</h3>
        <p>Every button inside a region gets the bigger icon. Useful for toolbars and command bars where the icon is the dominant read.</p>
        <Code lang="css" title="app.css" code={`
.toolbar .button { --button-icon-size: 1.25em; }
`} />
        <p>Higher specificity (two classes beat one), so this wins even if your stylesheet loads before Stisla&rsquo;s. Reach for it when you can&rsquo;t control load order, or when the change really belongs to a region rather than a button modifier.</p>
      </section>

      <section>
        <h2>Tweaking when there&rsquo;s no knob</h2>
        <p>Plenty of properties in Stisla aren&rsquo;t exposed as variables, by design. The <Link to="/docs/specification" className="link">Specification</Link> covers which decisions become knobs and which stay literal. You still have a clean path: the same three escalation options, only now you&rsquo;re targeting the property directly.</p>
        <p>Scenario: you want uppercase button labels. <code>.button</code> doesn&rsquo;t set <code>text-transform</code>, and there&rsquo;s no <code>--button-text-transform</code> knob. You add the property directly.</p>

        <h3>Option A. Inline style</h3>
        <Demo html={`
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
`} />
        <p>Inline always wins. No specificity battle.</p>

        <h3>Option B. Your own scoped class</h3>
        <Demo html={`
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
`} />
        <p>Same specificity as Stisla&rsquo;s <code>.button</code> rule. Your stylesheet loads after, so cascade order resolves it.</p>

        <h3>Option C. Region-scoped</h3>
        <Code lang="css" title="app.css" code={`
.toolbar .button { text-transform: uppercase; }
`} />
        <p>Two classes beat one. Wins regardless of load order.</p>

        <p>There&rsquo;s a feedback loop here. If you find yourself overriding the same property in three or more places (one specific <code>text-transform</code>, one specific <code>padding</code>, one specific <code>font-weight</code>), that&rsquo;s the signal it should become a Stisla variable. File an issue. The user-side overrides are the input to the public knob surface. That&rsquo;s how <code>--button-rim-mix</code> got exposed when <code>.button-group</code> needed to lift it.</p>
        <p>Skip the issue when your override is genuinely one-off, project-specific, or just personal preference. Leave those on the project side. Variables are for shared, recurring tunes.</p>
      </section>

      <section>
        <h2>State derivation and escape hatches</h2>
        <p>Stisla derives hover, active, and focus colors from a single source via <code>color-mix(in oklch, &hellip;)</code>. Change one variable and every state recomputes. This is the easy path. It&rsquo;s also escapable at three levels when you want hand-tuned states.</p>
        <p>The reference is <code>.button</code>. The same pattern shows up in alert, badge, dialog, kbd, list-group, scroll-area, table, and a dozen other components.</p>

        <h3>Level 1. Keep color-mix, swap the source</h3>
        <p>You like the derivation curve, you want a different brand color. Two paths.</p>
        <p>Override <code>--button-tone</code> when you want the new hue on this button only. The change stops at the button.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default tone</button>
  <button type="button" class="button button--primary" style="--button-tone: oklch(0.6 0.2 30); --button-color: oklch(1 0 0)">--button-tone override</button>
  <button type="button" class="button button--primary" style="--button-tone: oklch(0.68 0.2 142); --button-color: oklch(1 0 0)">Another tone</button>
</div>
`} />
        <p>Override <code>--color-primary</code> when you want every primary-toned component (buttons, links, focus rings, soft highlights) to follow. The change cascades to the whole subtree under the wrapper.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default tone</button>
  <button type="button" class="button button--primary" style="--color-primary: oklch(0.6 0.2 30); --color-primary-foreground: oklch(1 0 0)">--color-primary override</button>
</div>
`} />
        <p>Either way, hover, active, rim, and bevel all recompute through the same recipe (hover at 88%, active at 78%, rim at 85%). One write, full state machinery intact. Hover the buttons to see it.</p>

        <h3>Level 2. Keep the variable surface, bypass color-mix per state</h3>
        <p>You want hand-picked swatches at each state instead of the derived progression. Set each state&rsquo;s background directly. <code>color-mix</code> never runs because you&rsquo;re writing the final value.</p>
        <Demo html={`
<style>
  .button--brand        { --button-bg: oklch(0.60 0.22 30); --button-color: oklch(1 0 0); --button-tone: oklch(0.60 0.22 30); }
  .button--brand:hover  { --button-bg: oklch(0.55 0.22 30); }
  .button--brand:active { --button-bg: oklch(0.50 0.24 30); }
</style>
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Derived states</button>
  <button type="button" class="button button--brand">Hand-tuned states</button>
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
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Stisla button</button>
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
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default primary</button>
  <div class="flex flex-wrap items-center gap-3" style="--color-primary: oklch(0.65 0.18 149); --color-primary-foreground: oklch(1 0 0)">
    <button type="button" class="button button--primary">Green via wrapper</button>
    <button type="button" class="button button--soft button--primary">Soft retints</button>
  </div>
</div>
`} />

        <h3>Override a component property on a single element</h3>
        <p>Inline style. Wins because inline-style specificity beats any class.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default radius</button>
  <button type="button" class="button button--primary" style="border-radius: 0">Square (inline)</button>
</div>
`} />

        <h3>Override a component property in a region</h3>
        <p>Wrapper class plus the same selector. Two classes beat one on specificity, so the rule wins regardless of load order.</p>
        <Demo html={`
<style>
  .demo-pill-region .button { border-radius: 9999px; }
</style>
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default radius</button>
  <div class="demo-pill-region flex flex-wrap items-center gap-3">
    <button type="button" class="button button--primary">Pilled</button>
    <button type="button" class="button button--neutral">Pilled too</button>
  </div>
</div>
`} />

        <h3>Override a component knob for a region</h3>
        <p>Set the component&rsquo;s own variable on a wrapper. Stisla components read their knobs via a <code>--&lt;component&gt;-&lt;prop&gt;</code> fallback whose default chains to the scale, so a wrapper override flows through inheritance to every instance inside.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default radius</button>
  <div class="flex flex-wrap items-center gap-3" style="--button-radius: 0">
    <button type="button" class="button button--primary">Square (wrapper knob)</button>
    <button type="button" class="button button--neutral">Square neutral</button>
  </div>
</div>
`} />

      </section>

      <section>
        <h2>Building your own component</h2>
        <p>The teaching frame is the rule of three. Don&rsquo;t abstract until you&rsquo;ve used the same pattern three times. Two uses is duplication. Three is a pattern.</p>

        <h3>First use, second use, third use</h3>
        <p><strong>First use.</strong> Name it specifically. A card showing a product is <code>product-card</code>. Reach for the specific name over a generic guess like <code>media-card</code> or <code>card-with-image</code>. Specific names are honest, and renaming later is cheaper than un-abstracting.</p>
        <p><strong>Second use, same structure, different content.</strong> You have <code>product-card</code> and now need <code>article-card</code>. Look at what&rsquo;s actually shared.</p>
        <ul>
          <li><strong>Same DOM, same visual treatment.</strong> Rename to a content-neutral name that describes structure (<code>media-card</code>), or use the existing <code>.card</code> with a <code>.card__media</code> part. One class, two uses.</li>
          <li><strong>Same visual treatment, different DOM.</strong> Pull the shared bit into one class (<code>.elevated-surface</code>) and apply it to both, or share a small group of custom properties. Two classes, one source of truth for the shared bit.</li>
          <li><strong>Looks similar but actually diverges.</strong> Duplicate. Premature unification costs more than duplication; you&rsquo;ll regret it the first time one of them needs to evolve independently.</li>
        </ul>
        <p><strong>Third use.</strong> Now you have permission to abstract. The shape of the abstraction reveals itself by then. The class names, the variables, the parts. They&rsquo;re obvious because you&rsquo;ve already written them three times.</p>

        <h3>Worked example: <code>.notice</code></h3>
        <p>A short banner with an icon, a message, and an intent. Forty lines of CSS using Stisla patterns end to end.</p>
        <Code lang="css" title="src/components/notice.css" code={`
.notice {
  /* --notice-radius derives from the global token so your radius choice
     reaches this component; spacing is plain rem you can tune. */
  --notice-padding: 0.625rem 0.875rem;
  --notice-radius:  var(--radius-md);
  --notice-gap:     0.625rem;

  /* Tone is the single source. bg, border, and icon derive from it via
     color-mix, so swapping --notice-tone repaints every part. Body text
     stays on --color-foreground. Mix against transparent so the result
     is a translucent tone composited over the parent bg. */
  --notice-tone:   var(--color-foreground);
  --notice-bg:     color-mix(in oklch, var(--notice-tone) 10%, transparent);
  --notice-border: color-mix(in oklch, var(--notice-tone) 30%, transparent);

  display: flex;
  align-items: center;
  gap: var(--notice-gap);
  padding: var(--notice-padding);
  font-size: 0.875rem;

  background: var(--notice-bg);
  color: var(--color-foreground);
  border: 1px solid var(--notice-border);
  border-radius: var(--notice-radius);

  > svg {
    flex: none;
    width: 1.125em;
    height: 1.125em;
    color: var(--notice-tone);
  }
}

/* Intent modifiers reassign the source. Every derived var follows. */
.notice--info    { --notice-tone: var(--color-info); }
.notice--success { --notice-tone: var(--color-success); }
.notice--warning { --notice-tone: var(--color-warning); }
.notice--danger  { --notice-tone: var(--color-danger); }
`} />
        <Demo html={`
<style>
  .notice {
    --notice-padding: 0.625rem 0.875rem;
    --notice-radius:  var(--radius-md);
    --notice-gap:     0.625rem;
    --notice-tone:    var(--color-foreground);
    --notice-bg:      color-mix(in oklch, var(--notice-tone) 10%, transparent);
    --notice-border:  color-mix(in oklch, var(--notice-tone) 30%, transparent);
    display: flex;
    align-items: center;
    gap: var(--notice-gap);
    padding: var(--notice-padding);
    font-size: 0.875rem;
    background: var(--notice-bg);
    color: var(--color-foreground);
    border: 1px solid var(--notice-border);
    border-radius: var(--notice-radius);
  }
  .notice > svg {
    flex: none;
    width: 1.125em;
    height: 1.125em;
    color: var(--notice-tone);
  }
  .notice--info    { --notice-tone: var(--color-info); }
  .notice--success { --notice-tone: var(--color-success); }
  .notice--warning { --notice-tone: var(--color-warning); }
  .notice--danger  { --notice-tone: var(--color-danger); }
</style>
<div class="flex flex-col gap-4">
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
        <p>The component composes with the rest of the system for free. Put a <code>.button</code> inside a notice, and the button still reads from <code>--color-primary</code> as expected. Override <code>--color-info</code> on a parent and the info-toned notice repaints. Override <code>--notice-tone</code> inline for a one-off and you get the same machinery without authoring a new modifier.</p>
        <p>Document the component the same way every Stisla component is documented. A Customization table at the end of its demo page listing the <code>--notice-*</code> variables (Variable, Use). The <Link to="/docs/vanilla/button" hash="customization" className="link">Button</Link> page is the reference shape.</p>
      </section>

      <section>
        <h2>Dark mode</h2>
        <p>Light and dark are deltas on the same token surface. Stisla ships a dark block that flips every surface and interactional token; intents stay (a green button is the same green in dark mode). The dark block keys off <code>[data-theme="dark"]</code> or the <code>.dark</code> class on <code>&lt;html&gt;</code>, so React or Vue apps with localStorage-based toggling work out of the box.</p>
        <p>To roll your own dark theme, override the same tokens. You only need to redeclare what you&rsquo;re changing. There are two ways to write it; pick the one that matches your setup.</p>
        <p><strong className="text-foreground">Plain CSS, no build.</strong> Write the override under the dark selectors directly.</p>
        <Code lang="css" code={`
[data-theme="dark"],
.dark {
  --color-background:    /* your dark background */;
  --color-foreground:    /* your dark foreground */;
  --color-surface:       /* ... */;
  /* override any surface or interactional token here;
     intents (--color-primary, --color-success, ...) stay across themes */
}
`} />
        <p><strong className="text-foreground">With Tailwind.</strong> Use the registered <code>dark</code> variant instead of hand-writing the selector. It compiles to the same <code>[data-theme="dark"] / .dark</code> rule.</p>
        <Code lang="css" code={`
:root {
  @variant dark {
    --color-background: /* your dark background */;
    --color-foreground: /* your dark foreground */;
    --color-surface:    /* ... */;
  }
}
`} />
        <p>Two tokens stay theme-independent on purpose. <code>--color-warning-foreground</code> keeps a dark cap because yellow stays yellow and text on it should stay dark in both modes. <code>--color-overlay</code> and <code>--color-overlay-foreground</code> stay constant because they paint chrome on top of imagery, which can be anything.</p>
        <p>To remember the choice and avoid a flash of the wrong theme on load, store the preference and apply it before the stylesheet renders, in a small inline script at the top of <code>&lt;head&gt;</code>.</p>
        <Code lang="html" code={`
<head>
  <script>
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  </script>
  <link rel="stylesheet" href="stisla.css">
</head>
`} />
        <p>Your toggle then sets the same attribute and writes the choice back.</p>
        <Code lang="js" code={`
function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}
`} />
      </section>

      <section>
        <h2>Brand color</h2>
        <p>A single <code>--color-primary</code> override repaints every primary-toned surface. Hover, active, focus ring, and the <code>--color-highlight</code> tint derive from it via <code>color-mix</code> at runtime. No rebuild, no second pass.</p>
        <Demo html={`
<style>
  .preset-violet {
    --color-primary: oklch(0.58 0.22 285);
    --color-primary-foreground: oklch(1 0 0);
  }
</style>
<div class="preset-violet">
  <div class="flex flex-wrap items-start gap-4">
    <div class="card w-64">
      <div class="card__header">Card title</div>
      <div class="card__body">
        <p class="card__text">A card with a header, body, and footer to show every padding and surface tier respond to the preset.</p>
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" class="button button--primary">Primary</button>
          <button type="button" class="button button--outline button--neutral">Cancel</button>
        </div>
      </div>
      <div class="card__footer">
        <span class="fs-2 text-muted-foreground">Footer note</span>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--primary">Primary</button>
        <button type="button" class="button button--neutral">Neutral</button>
        <button type="button" class="button button--tertiary">Tertiary</button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--outline button--primary">Outline</button>
        <button type="button" class="button button--ghost button--primary">Ghost</button>
        <button type="button" class="button button--soft button--primary">Soft</button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--primary button--sm">Small</button>
        <button type="button" class="button button--primary">Default</button>
        <button type="button" class="button button--primary button--lg">Large</button>
      </div>
    </div>
  </div>
</div>
`} />
        <Code lang="css" title="app.css" code={`
.preset-violet {
  --color-primary: oklch(0.58 0.22 285);
  --color-primary-foreground: oklch(1 0 0);
}
`} />
        <p>The same shape works for any hue. Picking one is a design decision (perceptual lightness, chroma headroom, accessibility against the foreground). A few starting points to paste and tune:</p>
        <table>
          <thead><tr><th>Brand</th><th><code>--color-primary</code></th></tr></thead>
          <tbody>
            <tr><td>Violet</td><td><code>oklch(0.58 0.22 285)</code></td></tr>
            <tr><td>Teal</td><td><code>oklch(0.65 0.13 195)</code></td></tr>
            <tr><td>Amber</td><td><code>oklch(0.78 0.16 75)</code></td></tr>
            <tr><td>Rose</td><td><code>oklch(0.65 0.21 13)</code></td></tr>
          </tbody>
        </table>
        <p>If you change <code>--color-primary</code>, change <code>--color-primary-foreground</code> at the same time so text on filled primary surfaces stays readable. Most brand hues pair with <code>oklch(1 0 0)</code> (pure white); a pale yellow brand would pair with a darker foreground.</p>
      </section>

      <section id="brutalist">
        <h2>Brutalist</h2>
        <p>A complete preset that retunes multiple axes at once. Radius, shadow, border weight, border color, typography. Shown across a mix of surfaces (navbar, alert, card, dropdown menu, item, avatar, buttons) so the look reads as a system rather than a single-component swap.</p>
        <Demo html={`
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');
  .preset-brutalist {
    --radius-sm:       0;
    --radius-md:       0;
    --radius-lg:       0;
    --checkbox-radius: 0;
    --shadow-sm:       6px 6px 0 var(--color-foreground);
    --shadow-md:       6px 6px 0 var(--color-foreground);
    --shadow-lg:       6px 6px 0 var(--color-foreground);
    --color-border:    var(--color-foreground);
    --st-border-width: 2px;
    --font-sans:       'Space Grotesk', system-ui, sans-serif;
    font-family: var(--font-sans);
    font-weight: 500;
  }
  .preset-brutalist .card__header,
  .preset-brutalist .dialog__title,
  .preset-brutalist .drawer__title {
    font-weight: 700;
  }
</style>
<div class="preset-brutalist">
  <div class="flex flex-col gap-4 w-full">
    <nav class="navbar w-full" style="border: var(--st-border-width) solid var(--color-border);">
      <a class="navbar__brand" href="#">Acme</a>
      <div class="navbar__menu" data-state="open">
        <ul class="navbar__nav">
          <li><a class="navbar__button" data-state="active" aria-current="page" href="#">Home</a></li>
          <li><a class="navbar__button" href="#">Pricing</a></li>
          <li><a class="navbar__button" href="#">About</a></li>
        </ul>
      </div>
    </nav>

    <div class="alert alert--warning w-full">
      <i data-lucide="alert-triangle"></i>
      <div>Storage is at 89%. Archive old runs to free space.</div>
    </div>

    <div class="flex flex-wrap items-start gap-4 w-full">
      <aside class="sidebar w-44 min-h-72" style="border: var(--st-border-width) solid var(--color-border);">
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

      <div class="flex flex-col gap-4 flex-1 min-w-0">
        <div class="flex flex-wrap items-start gap-4">
          <div class="card flex-1 min-w-48">
            <div class="card__header">Order #ATL-2918</div>
            <div class="card__body">
              <p class="card__text">Out for delivery, arrives today by 6 PM.</p>
            </div>
            <div class="card__footer">
              <button type="button" class="button button--primary button--sm">Track</button>
            </div>
          </div>

          <ul class="menu__popup static min-w-36" data-state="open" role="menu">
            <li><button type="button" class="menu__item" role="menuitem">Edit</button></li>
            <li><button type="button" class="menu__item" data-state="active" role="menuitem">Duplicate</button></li>
            <li><button type="button" class="menu__item" role="menuitem">Share</button></li>
            <li><hr class="menu__separator"></li>
            <li><button type="button" class="menu__item" data-danger role="menuitem">Delete</button></li>
          </ul>
        </div>

        <div class="flex flex-wrap items-start gap-4">
          <div class="field flex-1 min-w-48">
            <label for="brutalistEmail" class="field__label">Email</label>
            <input type="email" class="input" id="brutalistEmail" placeholder="you@example.com">
          </div>
          <div class="field flex-1 min-w-40">
            <label for="brutalistRegion" class="field__label">Region</label>
            <select class="select" id="brutalistRegion">
              <option selected>Pick one</option>
              <option value="id">Indonesia</option>
              <option value="my">Malaysia</option>
              <option value="sg">Singapore</option>
            </select>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-4">
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
            <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="More">
              <i data-lucide="more-horizontal"></i>
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <button type="button" class="button button--primary">Confirm</button>
          <button type="button" class="button button--outline button--neutral">Cancel</button>
          <button type="button" class="button button--ghost button--danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</div>
`} />
        <Code lang="css" title="app.css" code={`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

.preset-brutalist {
  --radius-sm:          0;
  --radius-md:          0;
  --radius-lg:          0;
  --checkbox-radius:    0;  /* checkbox keeps its own radius knob */
  --shadow-sm:          6px 6px 0 var(--color-foreground);
  --shadow-md:          6px 6px 0 var(--color-foreground);
  --shadow-lg:          6px 6px 0 var(--color-foreground);
  --color-border:       var(--color-foreground);
  --st-border-width:    2px;
  --font-sans:          'Space Grotesk', system-ui, sans-serif;
  font-family: var(--font-sans);
  font-weight: 500;

  & .card__header,
  & .dialog__title,
  & .drawer__title {
    font-weight: 700;
  }
}
`} />
        <p>The look comes from pushing every axis at once. Radius tiers go to zero; the shadow tiers all step up to a solid 6&nbsp;px offset tracking <code>--color-foreground</code> so it flips per theme; <code>--color-border</code> moves from the soft hairline grey to full-contrast foreground; <code>--st-border-width</code> doubles to 2&nbsp;px so every shape outline reads thicker; Space Grotesk replaces the neutral Inter and runs at 500 / 700 weight. Heading weights bump to 700 inside the wrapper. Typographic weight isn&rsquo;t a global token, so the preset overrides those by class selector.</p>
      </section>

      <section id="density">
        <h2>Density</h2>
        <p>One knob shrinks or grows every component proportionally. Component padding, gap, and height are all multiples of the spacing base <code>--spacing</code> through the <code>--spacing()</code> helper, so changing the base reaches every spacing decision in the system at once. Chip-like components (buttons, form fields, pagination chips, navbar buttons, toggles, tabs) read their height the same way, so the box grows on both axes together.</p>
        <table>
          <thead><tr><th>Preset</th><th>Value</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td>Compact</td><td><code>0.2rem</code></td><td>Information-dense apps, admin dashboards, tabular UIs</td></tr>
            <tr><td>Default</td><td><code>0.25rem</code></td><td>General-purpose product UI</td></tr>
            <tr><td>Comfortable</td><td><code>0.28rem</code></td><td>Marketing surfaces, content-first reading flows</td></tr>
          </tbody>
        </table>
        <Demo html={`
<style>
  .preset-dense { --spacing: 0.2rem; }
</style>
<div class="preset-dense">
  <div class="flex flex-wrap items-start gap-4">
    <div class="card w-64">
      <div class="card__header">Card title</div>
      <div class="card__body">
        <p class="card__text">A card with a header, body, and footer to show every padding and surface tier respond to the preset.</p>
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" class="button button--primary">Primary</button>
          <button type="button" class="button button--outline button--neutral">Cancel</button>
        </div>
      </div>
      <div class="card__footer">
        <span class="fs-2 text-muted-foreground">Footer note</span>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--primary">Primary</button>
        <button type="button" class="button button--neutral">Neutral</button>
        <button type="button" class="button button--tertiary">Tertiary</button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--outline button--primary">Outline</button>
        <button type="button" class="button button--ghost button--primary">Ghost</button>
        <button type="button" class="button button--soft button--primary">Soft</button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="button button--primary button--sm">Small</button>
        <button type="button" class="button button--primary">Default</button>
        <button type="button" class="button button--primary button--lg">Large</button>
      </div>
    </div>
  </div>
</div>
`} />
        <Code lang="css" title="app.css" code={`
.preset-dense {
  --spacing: 0.2rem;
}
`} />
        <p>The base is a single length you can dial freely. <code>0.22rem</code> for a slight squeeze, <code>0.27rem</code> for a slight stretch. The whole system retunes at runtime.</p>
      </section>

      <section>
        <h2>Sizing model</h2>
        <p>Chip-like components (buttons, form fields, pagination chips, navbar buttons, toggles, tabs) ship three independent knobs. Shape, content, icon. Override any one without touching the others.</p>
        <ul>
          <li><strong><code>--*-height</code></strong> is the shape knob. It defaults to a <code>--spacing()</code> multiple (the button&rsquo;s is <code>--spacing(9)</code>), so it tracks <code>--spacing</code> along with the rest of the system. Override with a plain value (<code>3rem</code>) for a rigid shape that ignores the base, or with your own <code>--spacing()</code> multiple to keep it tracking.</li>
          <li><strong><code>--*-font-size</code></strong> is the label knob. Defaults to <code>var(--text-sm)</code>. Doesn&rsquo;t affect shape; text sits centered inside whatever height you set.</li>
          <li><strong><code>--*-icon-size</code></strong> (and similar) is the icon knob. Defaults to a <code>--spacing()</code> multiple (the button&rsquo;s is <code>--spacing(4)</code>). Bump it to <code>1.25em</code> for an icon-prominent UI without touching height or label size.</li>
        </ul>
        <p>Each size variant (<code>--sm</code>, <code>--lg</code>) reassigns <code>--*-height</code>, <code>--*-padding-inline</code>, and <code>--*-font-size</code> so the sized chip lands on its small / default / large cadence at the default spacing base.</p>

        <h3>Make one element taller or shorter</h3>
        <p>Override <code>--*-height</code> on the element. A plain value gives a rigid shape that doesn&rsquo;t track the spacing base.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="button button--primary">Default</button>
  <button type="button" class="button button--primary" style="--button-height: 3rem">Rigid</button>
</div>
`} />
        <Code lang="html" code={`
<button class="button button--primary" style="--button-height: 3rem">Rigid</button>
`} />
        <p>Leave the height alone if you want the element to keep tracking the base. The two buttons below sit inside a region with a larger <code>--spacing</code>. The first one (rigid <code>3rem</code>) stays put; the second one (default height, a <code>--spacing()</code> multiple) grows with the region.</p>
        <Demo html={`
<div class="flex flex-wrap items-center gap-4" style="--spacing: 0.34rem">
  <button type="button" class="button button--primary" style="--button-height: 3rem">Rigid</button>
  <button type="button" class="button button--primary">Tracks the base</button>
</div>
`} />
        <Code lang="html" code={`
<div style="--spacing: 0.34rem">
  <button class="button button--primary" style="--button-height: 3rem">Rigid</button>
  <button class="button button--primary">Tracks the base</button>
</div>
`} />

        <h3>Bigger content, same shape</h3>
        <p>Bump <code>--*-icon-size</code> or <code>--*-font-size</code> to grow the content without touching the shape. Content centers inside the height via flex, so it grows toward the box edges without breaking the chip silhouette.</p>
        <Demo html={`
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
`} />
        <Code lang="html" code={`
<button class="button button--primary" style="--button-icon-size: 1.5em">
  <i data-lucide="upload"></i>
  Big icon
</button>
`} />

        <h3>Resize a region</h3>
        <p>Scope <code>--spacing</code> on a wrapper. Every button, field, and chip inside scales together. Use this when &ldquo;the form is tight&rdquo; or &ldquo;the dashboard is roomy&rdquo; describes a whole area. For a single element, the height override above is enough.</p>
        <Demo html={`
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
`} />
        <Code lang="html" code={`
<form style="--spacing: 0.3rem">
  ...
</form>
`} />
      </section>

      <section>
        <h2>Per-component variables</h2>
        <p>Each component exposes its own scoped variables on top of the global tokens. Set <code>--button-radius</code> to give buttons a different radius from cards. Set <code>--dialog-bg</code> to retune a dialog without retinting the rest of the system. Component variables fall back through to the matching global token, so leaving them alone gives you the global default.</p>
        <p>Every component page ends with a Customization section that tables its <code>--component-*</code> variables. <Link to="/docs/vanilla/button" hash="customization" className="link">Button</Link> is the reference shape (Variable, Use). When you find yourself overriding the same property across three or more components, that&rsquo;s the signal to file an issue. The <a className="link" href="#tweaking-when-theres-no-knob">feedback loop above</a> covers when to ask for a new knob and when to leave the override on the project side.</p>
      </section>
    </>
  );
}
