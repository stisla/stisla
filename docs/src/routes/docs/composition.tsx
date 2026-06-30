import { createFileRoute, Link } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/composition")({
  component: CompositionDocs,
});

function CompositionDocs() {
  return (
    <>
      <header>
        <h1>Composition</h1>
        <p className="lead">
          Stisla is built to be composed. Most of what feels like &ldquo;I need
          a new component&rdquo; is really existing components placed together,
          then a knob or a utility to adjust the fit. Writing new CSS is the
          last step.
        </p>
      </header>

      <section>
        <h2>Compose first</h2>
        <p>
          Components are designed to nest. A media row inside a card. A table
          inside a card. A menu inside a popover. An avatar inside a media row,
          with a button as its action. Putting the pieces together is the
          primary way you build UI, and it&rsquo;s usually all you need.
          Everything keeps reading from the same tokens, so a composed surface
          stays coherent with the rest of the system for free.
        </p>
        <Demo
          html={`
<div class="card w-80">
  <div class="card__header">Team</div>
  <div class="card__body flex flex-col gap-3">
    <div class="media">
      <div class="media__figure">
        <span class="avatar" data-stisla-avatar><span class="avatar__fallback">RF</span></span>
      </div>
      <div class="media__content">
        <div class="media__title">Rosa Frias</div>
        <div class="media__description">Owner</div>
      </div>
      <div class="media__action">
        <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="More">
          <i data-lucide="more-horizontal"></i>
        </button>
      </div>
    </div>
    <div class="media">
      <div class="media__figure">
        <span class="avatar" data-stisla-avatar><span class="avatar__fallback">JD</span></span>
      </div>
      <div class="media__content">
        <div class="media__title">Jamal Dean</div>
        <div class="media__description">Editor</div>
      </div>
      <div class="media__action">
        <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="More">
          <i data-lucide="more-horizontal"></i>
        </button>
      </div>
    </div>
  </div>
</div>
`}
        />
        <p>
          That card is four components (<code>card</code>, <code>media</code>,{" "}
          <code>avatar</code>, <code>button</code>) and no custom CSS. Before
          reaching for anything new, ask whether the thing you want is just a
          few of these put together.
        </p>
      </section>

      <section>
        <h2>Tune what you composed</h2>
        <p>
          Composition gets you the structure; the next thing you&rsquo;ll want
          is to adjust a detail. The rows feel cramped, the avatars are a touch
          small. Reach for a knob or a utility before any new CSS. Here the same
          card sets <code>--avatar-size</code> (a component knob) and swaps one
          spacing utility, no stylesheet involved.
        </p>
        <Demo
          html={`
<div class="card w-80" style="--avatar-size: 2.75rem">
  <div class="card__header">Team</div>
  <div class="card__body flex flex-col gap-5">
    <div class="media">
      <div class="media__figure">
        <span class="avatar" data-stisla-avatar><span class="avatar__fallback">RF</span></span>
      </div>
      <div class="media__content">
        <div class="media__title">Rosa Frias</div>
        <div class="media__description">Owner</div>
      </div>
      <div class="media__action">
        <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="More">
          <i data-lucide="more-horizontal"></i>
        </button>
      </div>
    </div>
    <div class="media">
      <div class="media__figure">
        <span class="avatar" data-stisla-avatar><span class="avatar__fallback">JD</span></span>
      </div>
      <div class="media__content">
        <div class="media__title">Jamal Dean</div>
        <div class="media__description">Editor</div>
      </div>
      <div class="media__action">
        <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="More">
          <i data-lucide="more-horizontal"></i>
        </button>
      </div>
    </div>
  </div>
</div>
`}
        />
        <Code
          lang="html"
          code={`
<div class="card" style="--avatar-size: 2.75rem">  <!-- knob: bigger avatars -->
  <div class="card__body flex flex-col gap-5">      <!-- utility: roomier rows -->
    ...
  </div>
</div>
`}
        />
        <p>
          That&rsquo;s the everyday case, and it covers more than it looks. The{" "}
          <Link to="/docs/styling" className="link">
            Styling
          </Link>{" "}
          page is the full story: tuning a knob that exists, overriding a
          property when there&rsquo;s no knob, escaping to hand-tuned states,
          and the per-component variable surface. Exhaust that before writing a
          component.
        </p>
      </section>

      <section>
        <h2>Modifier or new component?</h2>
        <p>
          Compose, then tune. That&rsquo;s most of it. Past that you&rsquo;re
          writing new CSS, and the fork is which kind. Say you&rsquo;re showing
          a product in a card: do you build a <code>product-card</code>{" "}
          component, or a <code>card--product</code> modifier on the card you
          already have?
        </p>
        <p>
          Start specific and don&rsquo;t abstract early. The first time, the
          tuning above is fine. Duplicate the second time. By the third use the
          real shape is visible, and the decision makes itself:
        </p>
        <ul>
          <li>
            <strong>Same component, extra bits.</strong> If it&rsquo;s still
            honestly &ldquo;a card, with a price and a buy button,&rdquo;
            it&rsquo;s a modifier. <code>.card--product</code> adds the
            product-specific parts on top of <code>.card</code>, and you inherit
            every card token, surface tier, and state without re-authoring them.
            Prefer this.
          </li>
          <li>
            <strong>A genuinely different pattern.</strong> If &ldquo;a card
            with extras&rdquo; has stopped being an honest description
            (different anatomy, different behavior, not a card at all),
            it&rsquo;s a new component.
          </li>
        </ul>
        <p>
          The modifier keeps you inside the system. It composes, it inherits, it
          tracks theme and density changes automatically. Author it in the same
          layer as the component it extends.
        </p>
        <Code
          lang="css"
          title="src/components/card.css"
          code={`
@layer components {
  /* product-specific extras on top of .card — the rest is inherited */
  .card--product .card__image img { aspect-ratio: 4 / 3; object-fit: cover; }
  .card--product .price           { font-weight: 600; font-size: 1.125rem; }
}
`}
        />
        <Code
          lang="html"
          code={`
<article class="card card--product">
  <div class="card__image"><img src="/shoe.jpg" alt=""></div>
  <div class="card__body">
    <h3 class="card__title">Trail Runner</h3>
    <p class="price">$129</p>
    <button type="button" class="button button--primary">Add to cart</button>
  </div>
</article>
`}
        />
        <p>
          Reach for a new component only when none of the above is true. The
          next section is what that looks like.
        </p>
      </section>

      <section>
        <h2>Building a new component</h2>
        <p>
          When you do need one, author it the way Stisla authors its components.
          Lean on the shared tokens, derive any tinted part through{" "}
          <code>color-mix</code>, and keep everything inside{" "}
          <code>@layer components</code> so it sits in the same layer as the
          framework&rsquo;s own rules. Say you want a metric tile for a
          dashboard: a label, a value, and a trend delta that goes green up or
          red down. Nothing in the set is that, so it earns its own component.
          Here&rsquo;s <code>.stat</code>, around thirty lines. Layers are
          native CSS, so this is the same file whether or not you run a build.
        </p>
        <Code
          lang="css"
          title="src/components/stat.css"
          code={`
@layer components {
  .stat {
    --stat-radius:  var(--radius-lg);
    --stat-padding: 1rem 1.125rem;

    /* The trend delta is the only tinted part. One tone drives its text and
       its translucent background through color-mix; flip the tone (.stat--down)
       and the chip recolors with no second declaration. */
    --stat-delta-tone: var(--color-success);

    display: grid;
    gap: 0.375rem;
    padding: var(--stat-padding);
    /* Surface tokens keep the tile coherent with cards and panels. */
    background: var(--color-surface);
    color: var(--color-foreground);
    border: 1px solid var(--color-border);
    border-radius: var(--stat-radius);
  }

  .stat__label { font-size: var(--text-sm); color: var(--color-muted-foreground); }
  .stat__value { font-size: 1.5rem; font-weight: 600; line-height: 1.1; }

  .stat__delta {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.1rem 0.45rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--stat-delta-tone);
    background: color-mix(in oklch, var(--stat-delta-tone) 14%, transparent);
    border-radius: 9999px;

    > svg { width: 0.9em; height: 0.9em; }
  }

  /* A downward trend reassigns the tone; the chip recolors through color-mix. */
  .stat--down { --stat-delta-tone: var(--color-danger); }
}
`}
        />
        <Demo
          html={`
<style>
  .stat {
    --stat-delta-tone: var(--color-success);
    display: grid;
    gap: 0.375rem;
    padding: 1rem 1.125rem;
    background: var(--color-surface);
    color: var(--color-foreground);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }
  .stat__label { font-size: var(--text-sm); color: var(--color-muted-foreground); }
  .stat__value { font-size: 1.5rem; font-weight: 600; line-height: 1.1; }
  .stat__delta {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.1rem 0.45rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--stat-delta-tone);
    background: color-mix(in oklch, var(--stat-delta-tone) 14%, transparent);
    border-radius: 9999px;
  }
  .stat__delta > svg { width: 0.9em; height: 0.9em; }
  .stat--down { --stat-delta-tone: var(--color-danger); }
</style>
<div class="grid grid-cols-2 gap-4 w-full">
  <div class="stat">
    <span class="stat__label">Revenue</span>
    <span class="stat__value">$48.2k</span>
    <span class="stat__delta"><i data-lucide="trending-up"></i>12.5%</span>
  </div>
  <div class="stat stat--down">
    <span class="stat__label">Refunds</span>
    <span class="stat__value">$1.9k</span>
    <span class="stat__delta"><i data-lucide="trending-down"></i>3.2%</span>
  </div>
</div>
`}
        />
        <p>
          It composes back into everything else. Drop a stat into a card or a
          grid and it stays on the surface tokens around it. Override{" "}
          <code>--color-success</code> on a parent and every upward delta
          repaints. Set <code>--stat-delta-tone</code> inline for a one-off and
          you get the same machinery without a new modifier.
        </p>
      </section>

      <section>
        <h2>Wiring it in</h2>
        <p>
          Because the file declares its own <code>@layer components</code>, a
          new component or a modifier drops in the same way in both setups from{" "}
          <Link to="/docs/theming" hash="setting-up-overrides" className="link">
            Theming
          </Link>
          . It reads the same tokens the framework already defined, so{" "}
          <code>var(--radius-lg)</code> and the intent colors resolve with
          nothing extra.
        </p>
        <p>
          <strong className="text-foreground">Without a build step.</strong>{" "}
          Save the file and link it after <code>stisla.css</code>.
        </p>
        <Code
          lang="html"
          code={`
<link rel="stylesheet" href="stisla.css">
<link rel="stylesheet" href="components/stat.css">
`}
        />
        <p>
          <strong className="text-foreground">With Vite and Tailwind.</strong>{" "}
          Import it from your <code>app.css</code> after Tailwind and the source
          theme. The layer is already in the file, so there&rsquo;s no wrapper
          to add.
        </p>
        <Code
          lang="css"
          title="app.css"
          code={`
@import "tailwindcss";
@import "@stisla/style/theme.css";
@import "./components/stat.css";
`}
        />
        <p>
          Document a new component the same way every Stisla component is
          documented. A Customization table at the end of its demo page listing
          the <code>--stat-*</code> variables (Variable, Use). The{" "}
          <Link to="/docs/vanilla/button" hash="customization" className="link">
            Button
          </Link>{" "}
          page is the reference shape, and{" "}
          <Link to="/docs/contributing" className="link">
            Contributing
          </Link>{" "}
          covers the table conventions if you&rsquo;re adding it to Stisla
          itself.
        </p>
      </section>
    </>
  );
}
