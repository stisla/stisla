import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/meter")({
  component: MeterDocs,
});

function MeterDocs() {
  return (
    <>
      <header>
        <h1>Meter</h1>
        <p className="lead">A bar that visualizes a value within a known range.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          The scalar-measurement cousin of Progress: reach for meter when the value just sits at a
          level (storage used, score vs target) and for Progress when work is in motion. Wrap a{" "}
          <code>.meter__bar</code> in a <code>.meter__track</code> inside <code>.meter</code>. The root
          carries <code>role="meter"</code> + aria value attributes (use <code>aria-valuetext</code>{" "}
          when the unit matters). Add <code>.meter__label</code> / <code>.meter__value</code> to caption
          it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="meter meter--block" role="meter" aria-label="Memory" aria-valuenow="14.2" aria-valuemin="0" aria-valuemax="16" aria-valuetext="14.2 GB of 16 GB used">
  <span class="meter__label">Memory</span>
  <span class="meter__value">14.2 GB of 16 GB</span>
  <div class="meter__track"><div class="meter__bar meter__bar--warning" style="width: 89%"></div></div>
</div>`}
        />
      </section>

      <section>
        <h2>Intents</h2>
        <p>
          Recolor the fill with an intent modifier on <code>.meter__bar</code>. Flip the intent at
          thresholds for a quick gauge.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 w-full">
  <div class="meter" role="meter" aria-label="Primary" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="meter__track"><div class="meter__bar meter__bar--primary" style="width: 60%"></div></div></div>
  <div class="meter" role="meter" aria-label="Success" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="meter__track"><div class="meter__bar meter__bar--success" style="width: 60%"></div></div></div>
  <div class="meter" role="meter" aria-label="Warning" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="meter__track"><div class="meter__bar meter__bar--warning" style="width: 60%"></div></div></div>
  <div class="meter" role="meter" aria-label="Danger" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="meter__track"><div class="meter__bar meter__bar--danger" style="width: 60%"></div></div></div>
  <div class="meter" role="meter" aria-label="Info" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="meter__track"><div class="meter__bar meter__bar--info" style="width: 60%"></div></div></div>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Default is a thin strip; <code>--sm</code> a hairline; <code>--lg</code> a label-friendly
          height for hero metrics.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 w-full">
  <div class="meter meter--sm" role="meter" aria-label="Small" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="meter__track"><div class="meter__bar" style="width: 60%"></div></div></div>
  <div class="meter" role="meter" aria-label="Default" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="meter__track"><div class="meter__bar" style="width: 60%"></div></div></div>
  <div class="meter meter--lg" role="meter" aria-label="Large" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="meter__track"><div class="meter__bar" style="width: 60%"></div></div></div>
</div>`}
        />
      </section>

      <section>
        <h2>Stacked</h2>
        <p>
          Drop multiple <code>.meter__bar</code> children into one track to break the value into
          segments. Widths must sum to ≤ 100%; remaining room exposes the track background.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="meter meter--lg meter--block" role="meter" aria-label="Monthly budget" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100" aria-valuetext="$3,120 of $4,000 spent">
  <span class="meter__label">Monthly budget</span>
  <span class="meter__value">$3,120 of $4,000</span>
  <div class="meter__track">
    <div class="meter__bar meter__bar--primary" style="width: 32%"></div>
    <div class="meter__bar meter__bar--info" style="width: 24%"></div>
    <div class="meter__bar meter__bar--success" style="width: 12%"></div>
    <div class="meter__bar meter__bar--warning" style="width: 10%"></div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Legend</h2>
        <p>
          Pair a stacked meter with a <code>.meter__legend</code> row. Each{" "}
          <code>.meter__legend-dot</code> reuses <code>--meter-bar-bg</code>, so the intent modifier
          (or an inline override) colors the swatch to match its bar.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="meter meter--lg meter--block" role="meter" aria-label="Macintosh HD" aria-valuenow="83" aria-valuemin="0" aria-valuemax="100" aria-valuetext="203.95 GB of 245.11 GB used">
  <span class="meter__label">Macintosh HD</span>
  <span class="meter__value">203.95 GB of 245.11 GB used</span>
  <div class="meter__track">
    <div class="meter__bar meter__bar--danger" style="width: 2%"></div>
    <div class="meter__bar meter__bar--warning" style="width: 6%"></div>
    <div class="meter__bar" style="width: 7%; --meter-bar-bg: oklch(0.86 0.18 95);"></div>
    <div class="meter__bar" style="width: 60%; --meter-bar-bg: var(--color-surface-3);"></div>
    <div class="meter__bar" style="width: 8%; --meter-bar-bg: var(--color-muted-foreground);"></div>
  </div>
  <div class="meter__legend">
    <span class="meter__legend-item"><span class="meter__legend-dot meter__legend-dot--danger"></span> Trash</span>
    <span class="meter__legend-item"><span class="meter__legend-dot meter__legend-dot--warning"></span> Music</span>
    <span class="meter__legend-item"><span class="meter__legend-dot" style="--meter-bar-bg: oklch(0.86 0.18 95);"></span> Documents</span>
    <span class="meter__legend-item"><span class="meter__legend-dot" style="--meter-bar-bg: var(--color-surface-3);"></span> Calculating…</span>
    <span class="meter__legend-item"><span class="meter__legend-dot" style="--meter-bar-bg: var(--color-muted-foreground);"></span> macOS</span>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.meter</code>. Override on the element, a parent scope, or{" "}
          <code>:root</code>.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--meter-height</code></td><td>Track height; size modifiers reassign this</td></tr>
            <tr><td><code>--meter-radius</code></td><td>Track corner radius; pilled by default</td></tr>
            <tr><td><code>--meter-header-gap</code></td><td>Space between the caption row and the track</td></tr>
            <tr><td><code>--meter-segment-gap</code></td><td>Gap between adjacent bars in a stacked track</td></tr>
            <tr><td><code>--meter-bg</code></td><td>Track background (unfilled portion)</td></tr>
            <tr><td><code>--meter-bar-bg</code></td><td>Bar fill (intent modifiers retune; also drives the legend dot)</td></tr>
            <tr><td><code>--meter-label-font-size</code></td><td>Caption font size</td></tr>
            <tr><td><code>--meter-label-color</code></td><td>Label text color</td></tr>
            <tr><td><code>--meter-value-color</code></td><td>Value text color</td></tr>
            <tr><td><code>--meter-legend-row-gap</code></td><td>Space between the track and the legend</td></tr>
            <tr><td><code>--meter-legend-item-gap</code></td><td>Horizontal gap between legend items</td></tr>
            <tr><td><code>--meter-legend-dot-size</code></td><td>Diameter of the legend swatch</td></tr>
            <tr><td><code>--meter-legend-font-size</code></td><td>Legend text size</td></tr>
            <tr><td><code>--meter-legend-color</code></td><td>Legend text color</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
