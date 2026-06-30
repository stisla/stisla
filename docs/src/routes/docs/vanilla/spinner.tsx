import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/spinner")({
  component: SpinnerDocs,
});

function SpinnerDocs() {
  return (
    <>
      <header>
        <h1>Spinner</h1>
        <p className="lead">A lightweight indicator for in-flight work.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Use <code>.spinner</code> with <code>role="status"</code> and a visually hidden label so
          screen readers announce the loading state. The default is a spinning border ring.
        </p>
        <Demo
          html={`<div class="spinner" role="status"><span class="sr-only">Loading…</span></div>`}
        />
      </section>

      <section>
        <h2>Grow</h2>
        <p>
          Add <code>.spinner--grow</code> for a pulsing dot. Same markup, same a11y story.
        </p>
        <Demo
          html={`<div class="spinner spinner--grow" role="status"><span class="sr-only">Loading…</span></div>`}
        />
      </section>

      <section>
        <h2>Colors</h2>
        <p>
          Both spinners inherit from <code>currentColor</code>, so any <code>.text-*</code> utility
          recolors them.
        </p>
        <Demo
          html={`
<div class="spinner text-primary" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner text-success" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner text-danger" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner text-warning" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner text-info" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner text-muted-foreground" role="status"><span class="sr-only">Loading…</span></div>`}
        />
        <p>The grow variant takes the same utilities.</p>
        <Demo
          html={`
<div class="spinner spinner--grow text-primary" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--grow text-success" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--grow text-danger" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--grow text-warning" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--grow text-info" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--grow text-muted-foreground" role="status"><span class="sr-only">Loading…</span></div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Add <code>.spinner--sm</code> for the compact size used inside buttons and badges, or{" "}
          <code>.spinner--lg</code> for an empty-state hero.
        </p>
        <Demo
          html={`
<div class="spinner spinner--sm" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--lg" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--grow spinner--sm" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--grow" role="status"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--grow spinner--lg" role="status"><span class="sr-only">Loading…</span></div>`}
        />
        <p>
          For one-off sizes, override <code>--spinner-size</code> inline.
        </p>
        <Demo
          html={`
<div class="spinner" role="status" style="--spinner-size: 3rem; --spinner-width: 4px;"><span class="sr-only">Loading…</span></div>
<div class="spinner spinner--grow" role="status" style="--spinner-size: 3rem;"><span class="sr-only">Loading…</span></div>`}
        />
      </section>

      <section>
        <h2>Alignment</h2>
        <p>
          Spinners are inline-block, so flex and margin utilities place them like any other inline
          element.
        </p>
        <Demo
          html={`
<span class="inline-flex items-center gap-2">
  <span class="spinner spinner--sm" role="status" aria-hidden="true"></span>
  <span>Syncing inbox</span>
</span>`}
        />
      </section>

      <section>
        <h2>In buttons</h2>
        <p>
          For the canonical icon-aware loading state, set <code>aria-busy="true"</code> on the button.
          It swaps any leading or trailing icon for the spinner without shifting the label. For a
          standalone spinner, slot <code>.spinner.spinner--sm</code> as a leading element.
        </p>
        <Demo
          html={`
<button type="button" class="button button--primary" aria-busy="true">Saving</button>
<button type="button" class="button button--outline button--neutral" aria-busy="true">Loading</button>`}
        />
        <p>
          For a standalone spinner inside a button, slot <code>.spinner.spinner--sm</code> as a
          leading element.
        </p>
        <Demo
          html={`
<button type="button" class="button button--primary" disabled>
  <span class="spinner spinner--sm" role="status" aria-hidden="true"></span>
  Loading
</button>
<button type="button" class="button button--primary" disabled>
  <span class="spinner spinner--grow spinner--sm" role="status" aria-hidden="true"></span>
  Loading
</button>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.spinner</code> without touching component CSS. Color comes
          from <code>currentColor</code>, so any <code>.text-*</code> utility recolors it.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--spinner-size</code></td><td>Diameter; size modifiers reassign this</td></tr>
            <tr><td><code>--spinner-width</code></td><td>Stroke width on <code>.spinner</code>; ignored by <code>.spinner--grow</code></td></tr>
            <tr><td><code>--spinner-duration</code></td><td>One animation cycle; reduced-motion overrides to a longer value</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
