import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/progress")({
  component: ProgressDocs,
});

function ProgressDocs() {
  return (
    <>
      <header>
        <h1>Progress</h1>
        <p className="lead">A horizontal bar that fills as work completes.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Place a <code>.progress__track</code> with a single <code>.progress__bar</code> inside{" "}
          <code>.progress</code>. The wrapper carries <code>role="progressbar"</code> and the aria
          value attributes; the bar paints the fill via inline <code>width</code>. Add{" "}
          <code>.progress__label</code> and <code>.progress__value</code> to caption it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="progress progress--block" role="progressbar" aria-label="Upload" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100">
  <span class="progress__label">Uploading</span>
  <span class="progress__value">72%</span>
  <div class="progress__track"><div class="progress__bar" style="width: 72%"></div></div>
</div>`}
        />
      </section>

      <section>
        <h2>Intents</h2>
        <p>
          Recolor the fill with an intent modifier on <code>.progress__bar</code>. The track stays
          neutral so contrast holds in both themes.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 w-full">
  <div class="progress" role="progressbar" aria-label="Primary" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar progress__bar--primary" style="width: 60%"></div></div></div>
  <div class="progress" role="progressbar" aria-label="Success" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar progress__bar--success" style="width: 60%"></div></div></div>
  <div class="progress" role="progressbar" aria-label="Warning" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar progress__bar--warning" style="width: 60%"></div></div></div>
  <div class="progress" role="progressbar" aria-label="Danger" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar progress__bar--danger" style="width: 60%"></div></div></div>
  <div class="progress" role="progressbar" aria-label="Info" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar progress__bar--info" style="width: 60%"></div></div></div>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Default is a thin strip; <code>--sm</code> compresses to a hairline; <code>--lg</code> grows
          to a label-friendly height.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 w-full">
  <div class="progress progress--sm" role="progressbar" aria-label="Small" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar" style="width: 60%"></div></div></div>
  <div class="progress" role="progressbar" aria-label="Default" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar" style="width: 60%"></div></div></div>
  <div class="progress progress--lg" role="progressbar" aria-label="Large" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar" style="width: 60%"></div></div></div>
</div>`}
        />
      </section>

      <section>
        <h2>Animated</h2>
        <p>
          Add <code>.progress__bar--animated</code> for a soft sheen that sweeps across the fill every
          few seconds — a quiet "still working" signal, not a treadmill. Dropped under
          reduced-motion.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 w-full">
  <div class="progress progress--lg" role="progressbar" aria-label="Animated" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar progress__bar--animated" style="width: 60%"></div></div></div>
  <div class="progress progress--lg" role="progressbar" aria-label="Animated success" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar progress__bar--success progress__bar--animated" style="width: 80%"></div></div></div>
</div>`}
        />
      </section>

      <section>
        <h2>Indeterminate</h2>
        <p>
          Add <code>data-indeterminate</code> on <code>.progress</code> when the duration is unknown.
          A partial bar slides across the track on loop; drop the inline width (the CSS owns it) and
          skip <code>aria-valuenow</code> so assistive tech announces it as indeterminate.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 w-full">
  <div class="progress" data-indeterminate role="progressbar" aria-label="Loading" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar"></div></div></div>
  <div class="progress progress--lg" data-indeterminate role="progressbar" aria-label="Loading large" aria-valuemin="0" aria-valuemax="100"><div class="progress__track"><div class="progress__bar progress__bar--success"></div></div></div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.progress</code>. Override on the element, a parent scope, or{" "}
          <code>:root</code>. The track is pilled by default; set <code>--progress-radius</code> to
          flatten.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--progress-height</code></td><td>Track height; size modifiers reassign this</td></tr>
            <tr><td><code>--progress-radius</code></td><td>Track corner radius; pilled by default</td></tr>
            <tr><td><code>--progress-header-gap</code></td><td>Space between the caption row and the track</td></tr>
            <tr><td><code>--progress-bg</code></td><td>Track background (unfilled portion)</td></tr>
            <tr><td><code>--progress-bar-bg</code></td><td>Bar fill (intent modifiers retune)</td></tr>
            <tr><td><code>--progress-bar-transition-duration</code></td><td>Width tween when the value changes</td></tr>
            <tr><td><code>--progress-label-font-size</code></td><td>Caption font size</td></tr>
            <tr><td><code>--progress-label-font-weight</code></td><td>Label weight</td></tr>
            <tr><td><code>--progress-label-color</code></td><td>Label text color</td></tr>
            <tr><td><code>--progress-value-color</code></td><td>Value text color</td></tr>
            <tr><td><code>--progress-shimmer-color</code></td><td>Animated sheen color</td></tr>
            <tr><td><code>--progress-shimmer-duration</code></td><td>Animated cycle length</td></tr>
            <tr><td><code>--progress-indeterminate-duration</code></td><td>Indeterminate sweep cycle length</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
