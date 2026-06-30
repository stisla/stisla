import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/indicator")({
  component: IndicatorDocs,
});

function IndicatorDocs() {
  return (
    <>
      <header>
        <h1>Indicator</h1>
        <p className="lead">A small status dot for presence, liveness, and unread signals.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          An indicator is just the dot. Where a badge labels something with a count or word, an
          indicator only signals. A bare <code>.indicator</code> sits on the muted foreground tone.
          Drop it inline next to a label.
        </p>
        <Demo
          html={`
<span class="inline-flex items-center gap-2"><span class="indicator"></span> Offline</span>`}
        />
      </section>

      <section>
        <h2>Intents</h2>
        <p>
          Add an intent modifier to recolor the dot. Each reads the matching color token, so a runtime
          override retints every indicator of that intent at once.
        </p>
        <Demo
          html={`
<span class="indicator indicator--primary"></span>
<span class="indicator indicator--success"></span>
<span class="indicator indicator--warning"></span>
<span class="indicator indicator--danger"></span>
<span class="indicator indicator--info"></span>`}
        />
      </section>

      <section>
        <h2>Pulse</h2>
        <p>
          Add <code>.indicator--pulse</code> for an expanding halo in the dot's color, for live or
          active signals. Under reduced-motion the halo is dropped and the dot stays.
        </p>
        <Demo
          html={`
<span class="inline-flex items-center gap-2"><span class="indicator indicator--success indicator--pulse"></span> Online</span>
<span class="inline-flex items-center gap-2"><span class="indicator indicator--danger indicator--pulse"></span> Live</span>
<span class="inline-flex items-center gap-2"><span class="indicator indicator--info indicator--pulse"></span> Streaming</span>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Default sits between <code>.indicator--sm</code> and <code>.indicator--lg</code>. For an
          off-scale dot, set <code>--indicator-size</code> directly.
        </p>
        <Demo
          html={`
<span class="indicator indicator--success indicator--sm"></span>
<span class="indicator indicator--success"></span>
<span class="indicator indicator--success indicator--lg"></span>`}
        />
      </section>

      <section>
        <h2>Pinned to a host</h2>
        <p>
          Overlay the dot on a corner with absolute positioning on a relative host — the
          notification-dot pattern for icon buttons and nav items. Raise{" "}
          <code>--indicator-ring-width</code> so the dot reads cleanly over a busy surface. (Dedicated{" "}
          <code>.pin-*</code> utilities land with the utilities pass; until then, Tailwind positioning
          works.) On avatars, reach for the built-in <code>.avatar__indicator</code> instead.
        </p>
        <Demo
          html={`
<span class="relative inline-flex">
  <button type="button" class="button button--outline button--neutral button--icon-only" aria-label="Notifications"><i data-lucide="bell"></i></button>
  <span class="indicator indicator--danger absolute -top-1 -right-1" style="--indicator-ring-width: 2px;"></span>
</span>
<span class="relative inline-flex">
  <button type="button" class="button button--outline button--neutral button--icon-only" aria-label="Messages"><i data-lucide="mail"></i></button>
  <span class="indicator indicator--primary indicator--pulse absolute -top-1 -right-1" style="--indicator-ring-width: 2px;"></span>
</span>`}
        />
      </section>

      <section>
        <h2>Corners</h2>
        <p>
          Pin a dot to any corner of a host. Logical insets (<code>-top-1 -left-1</code> etc.) keep the
          markup simple; flip to physical edges as needed.
        </p>
        <Demo
          html={`
<span class="relative inline-flex size-12 bg-surface-3 rounded-md">
  <span class="indicator indicator--success absolute -top-1 -left-1"></span>
  <span class="indicator indicator--warning absolute -top-1 -right-1"></span>
  <span class="indicator indicator--info absolute -bottom-1 -left-1"></span>
  <span class="indicator indicator--danger absolute -bottom-1 -right-1"></span>
</span>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.indicator</code>. Override on the indicator, a parent scope,
          or <code>:root</code>.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--indicator-size</code></td><td>Dot diameter; size modifiers set this</td></tr>
            <tr><td><code>--indicator-color</code></td><td>Dot fill and pulse halo color; intents reassign it</td></tr>
            <tr><td><code>--indicator-ring-width</code></td><td>Separator halo width; raise above zero to lift the dot off a busy surface</td></tr>
            <tr><td><code>--indicator-ring-color</code></td><td>Halo color; match the surface the dot overhangs</td></tr>
            <tr><td><code>--indicator-pulse-duration</code></td><td>Length of one pulse loop on <code>.indicator--pulse</code></td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
