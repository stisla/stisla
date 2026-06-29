import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/vanilla/scroll-area")({
  component: ScrollAreaDocs,
});

function ScrollAreaDocs() {
  return (
    <>
      <header>
        <h1>Scroll area</h1>
        <p className="lead">
          A clipped, rounded scroll container with themed overlay scrollbars.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          The <code>.scroll-area</code> root is a rounded, clipped box. Its
          vanilla implementation is enhanced by OverlayScrollbars (
          <code>data-stisla-scroll-area</code>), which replaces the native bars
          with thin overlay handles painted from the{" "}
          <code>--scroll-area-*</code> knobs; that binding ships with the JS
          layer. A bordered area with a fixed height; content beyond it scrolls,
          and with the plugin active the handles fade in on interaction.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="scroll-area scroll-area--bordered h-48 w-full max-w-md p-4" data-stisla-scroll-area>
  <div class="flex flex-col gap-3">
    <div class="font-semibold">Release notes</div>
    <div class="text-muted-foreground">3.0.0 — the framework-agnostic rewrite lands: every component reads design tokens, no Bootstrap underneath.</div>
    <div class="text-muted-foreground">2.4.0 — new illustration system with recolorable empty states.</div>
    <div class="text-muted-foreground">2.3.0 — data-grid primitive powers every dashboard table.</div>
    <div class="text-muted-foreground">2.2.0 — drawer gains a floating modifier and four placements.</div>
    <div class="text-muted-foreground">2.1.0 — toast region with six corner placements.</div>
    <div class="text-muted-foreground">2.0.0 — tokens move to the runtime namespace.</div>
    <div class="text-muted-foreground">1.9.0 — accordion, popover, and tooltip join the catalog.</div>
    <div class="text-muted-foreground">1.8.0 — slider, meter, and progress get token knobs.</div>
    <div class="text-muted-foreground">1.7.0 — combobox built on the table-core primitive.</div>
    <div class="text-muted-foreground">1.6.0 — avatar, avatar-group, and indicator land.</div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Installation</h2>
        <p>
          Skip this step if you're on the <code>stisla-full</code> bundle — it
          already ships with Scroll area. On the core bundle, add two extra
          lines.
        </p>
        <Code code={`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/components/scroll-area.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/components/scroll-area.js"></script>`} />
        <Code lang="js" code={`import '@stisla/css/scroll-area';
import '@stisla/vanilla/scroll-area';`} />
        <p>
          OverlayScrollbars rides along as a transitive dependency of{" "}
          <code>@stisla/vanilla</code>, so no extra install is needed.
        </p>
      </section>

      <section>
        <h2>Horizontal</h2>
        <p>
          Set <code>data-stisla-scroll-area-overflow-y="hidden"</code> for a
          track that scrolls along the x axis only. The card row stays one row
          at any width.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="scroll-area scroll-area--bordered w-full max-w-lg" data-stisla-scroll-area data-stisla-scroll-area-overflow-y="hidden">
  <div class="flex gap-3 p-4 min-w-max">
    <div class="card m-0 min-w-56"><div class="card__body"><strong>Acme Inc</strong><div class="text-muted-foreground text-sm">Active project</div></div></div>
    <div class="card m-0 min-w-56"><div class="card__body"><strong>Helix Health</strong><div class="text-muted-foreground text-sm">Active project</div></div></div>
    <div class="card m-0 min-w-56"><div class="card__body"><strong>Northwind Labs</strong><div class="text-muted-foreground text-sm">Active project</div></div></div>
    <div class="card m-0 min-w-56"><div class="card__body"><strong>Forge &amp; Tide</strong><div class="text-muted-foreground text-sm">Paused</div></div></div>
    <div class="card m-0 min-w-56"><div class="card__body"><strong>Quill Press</strong><div class="text-muted-foreground text-sm">Active project</div></div></div>
    <div class="card m-0 min-w-56"><div class="card__body"><strong>Mariner Logistics</strong><div class="text-muted-foreground text-sm">Archived</div></div></div>
    <div class="card m-0 min-w-56"><div class="card__body"><strong>Oryx Systems</strong><div class="text-muted-foreground text-sm">Active project</div></div></div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Both axes</h2>
        <p>
          A bounded box with content larger than its viewport scrolls in both
          directions. The two bars share the same skin.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="scroll-area scroll-area--bordered h-72 w-full max-w-lg" data-stisla-scroll-area>
  <table class="table m-0 min-w-3xl">
    <thead>
      <tr><th>Project</th><th>Owner</th><th>Stage</th><th>Region</th><th>Updated</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>Acme Inc</td><td>Maya Tanaka</td><td>Discovery</td><td>APAC</td><td>2 days ago</td><td><span class="badge badge--success">Active</span></td></tr>
      <tr><td>Helix Health</td><td>Priya Reddy</td><td>Implementation</td><td>EMEA</td><td>4 hours ago</td><td><span class="badge badge--success">Active</span></td></tr>
      <tr><td>Northwind Labs</td><td>Diego Romero</td><td>Discovery</td><td>AMER</td><td>1 week ago</td><td><span class="badge badge--warning">Stalled</span></td></tr>
      <tr><td>Forge &amp; Tide</td><td>Lin Wei</td><td>Onboarding</td><td>APAC</td><td>3 weeks ago</td><td><span class="badge">Paused</span></td></tr>
      <tr><td>Quill Press</td><td>Rafiq Ahmad</td><td>Implementation</td><td>EMEA</td><td>Yesterday</td><td><span class="badge badge--success">Active</span></td></tr>
      <tr><td>Mariner Logistics</td><td>Sofia Costa</td><td>Closeout</td><td>AMER</td><td>2 months ago</td><td><span class="badge">Archived</span></td></tr>
      <tr><td>Oryx Systems</td><td>Ida Pham</td><td>Discovery</td><td>EMEA</td><td>5 hours ago</td><td><span class="badge badge--success">Active</span></td></tr>
      <tr><td>Atlas &amp; Vine</td><td>Theo Becker</td><td>Implementation</td><td>AMER</td><td>1 day ago</td><td><span class="badge badge--success">Active</span></td></tr>
    </tbody>
  </table>
</div>`}
        />
      </section>

      <section>
        <h2>Always visible</h2>
        <p>
          Pass <code>data-stisla-scroll-area-auto-hide="never"</code> for a bar
          that stays painted. Useful when the affordance is more important than
          the chrome budget.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="scroll-area scroll-area--bordered h-56 w-full max-w-md p-4" data-stisla-scroll-area data-stisla-scroll-area-auto-hide="never">
  <div class="flex flex-col gap-3">
    <div>A persistent scrollbar reads more like a native desktop pattern, and pairs well with long content that benefits from a visible position indicator at rest.</div>
    <div>The trade-off is a permanent chrome stripe along the edge, even when the content has nothing to scroll past the fold. Pick based on the surface.</div>
    <div>The cascade still respects per-axis overrides, so a track that hides on x and stays on y is one extra attribute.</div>
    <div>Reduced-motion users skip the fade entirely either way, since the transition runs through the same reduced-motion gate as the rest of the system.</div>
    <div>The handle still grows and shrinks with the viewport-to-content ratio, so the position read stays honest as content updates.</div>
    <div>Click-to-track jumps the handle to the position you clicked. Hold a click on the track to keep paging in that direction.</div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Tinted</h2>
        <p>
          Override the handle vars in a parent scope to retune the bar paint to
          the surface's accent. The cascade scopes the change.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="scroll-area scroll-area--bordered h-56 w-full max-w-md p-4" data-stisla-scroll-area data-stisla-scroll-area-auto-hide="never" style="--scroll-area-bar-size: 0.875rem; --scroll-area-handle-bg: color-mix(in oklch, var(--color-primary) 35%, transparent); --scroll-area-handle-bg-hover: color-mix(in oklch, var(--color-primary) 55%, transparent); --scroll-area-handle-bg-active: var(--color-primary);">
  <div class="flex flex-col gap-3">
    <div>The handle paints from a primary mix at rest, deepens on hover, and lands on the solid intent on active. The track sits transparent so the parent surface reads through.</div>
    <div>The same pattern works for success, danger, info, or any custom token a parent scope publishes. Set the three handle vars once and every scroll-area inside the scope picks the new tone up.</div>
    <div>The bar width here is bumped a notch to make the color read at a glance. Defaults stay narrow so the chrome reads as plumbing rather than decoration.</div>
    <div>Density still applies through the surrounding scale, so a compact view shrinks the surface around the bar without retuning the bar itself.</div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          <code>stisla:scroll-area:destroyed</code> fires on the root when the
          underlying OverlayScrollbars instance is torn down (the component is
          destroyed or unmounted). Use it to detach any consumer-side listeners
          or refs you held against the scroll area.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the area and forward to the overlay scrollbars.
          Override on the root or any wrapper.
        </p>
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>--scroll-area-radius</code>
              </td>
              <td>Corner radius of the clipped box</td>
            </tr>
            <tr>
              <td>
                <code>--scroll-area-border-color</code> /{" "}
                <code>-border-width</code>
              </td>
              <td>
                Rim under the <code>--bordered</code> modifier
              </td>
            </tr>
            <tr>
              <td>
                <code>--scroll-area-bar-size</code>
              </td>
              <td>Scrollbar thickness</td>
            </tr>
            <tr>
              <td>
                <code>--scroll-area-bar-padding</code>
              </td>
              <td>Inset of the bar from the edge</td>
            </tr>
            <tr>
              <td>
                <code>--scroll-area-bar-radius</code>
              </td>
              <td>Handle corner radius</td>
            </tr>
            <tr>
              <td>
                <code>--scroll-area-track-bg</code>
              </td>
              <td>Track background (transparent by default)</td>
            </tr>
            <tr>
              <td>
                <code>--scroll-area-handle-bg</code> /{" "}
                <code>-handle-bg-hover</code> / <code>-handle-bg-active</code>
              </td>
              <td>Handle paint across states</td>
            </tr>
            <tr>
              <td>
                <code>--scroll-area-handle-min-size</code>
              </td>
              <td>Minimum handle length</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
