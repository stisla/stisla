import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/toggle")({
  component: ToggleDocs,
});

function ToggleDocs() {
  return (
    <>
      <header>
        <h1>Toggle</h1>
        <p className="lead">A two-state press button: outline-neutral at rest, highlight-filled when active.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Active comes from <code>aria-pressed</code>, <code>data-state="active"</code>, or a checked{" "}
          <code>.toggle-input</code> — all paint identically. A button toggle gets its press wiring
          from <code>@stisla/vanilla</code> via <code>data-stisla-toggle</code> (the demos below are
          live); the native <code>.toggle-input</code> form-data path works with no JS. A{" "}
          <code>&lt;button class="toggle"&gt;</code> with <code>aria-pressed</code>. The active state
          is shown below.
        </p>
        <Demo
          html={`
<button type="button" data-stisla-toggle class="toggle" aria-pressed="true"><i data-lucide="bell"></i> Notifications on</button>
<button type="button" data-stisla-toggle class="toggle" aria-pressed="false"><i data-lucide="bell-off"></i> Off</button>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>The toggle behaves like a native button with a sticky pressed state.</p>
        <ul>
          <li>
            <kbd>Tab</kbd>: focus the toggle
          </li>
          <li>
            <kbd>Space</kbd> / <kbd>Enter</kbd>: flip <code>aria-pressed</code>
          </li>
        </ul>
      </section>

      <section>
        <h2>Form data</h2>
        <p>
          For a toggle whose state submits with a form, pair a hidden{" "}
          <code>&lt;input class="toggle-input"&gt;</code> with a sibling{" "}
          <code>&lt;label class="toggle"&gt;</code>. The browser owns selection, so this is fully
          interactive with no JS.
        </p>
        <Demo
          html={`
<input type="checkbox" class="toggle-input" id="newsletterToggle" name="newsletter" checked>
<label class="toggle" for="newsletterToggle"><i data-lucide="mail"></i> Subscribe to newsletter</label>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Add <code>.toggle--sm</code> or <code>.toggle--lg</code> to match the button size cadence.
        </p>
        <Demo
          html={`
<button type="button" data-stisla-toggle class="toggle toggle--sm" aria-pressed="true">Bold</button>
<button type="button" data-stisla-toggle class="toggle" aria-pressed="true">Bold</button>
<button type="button" data-stisla-toggle class="toggle toggle--lg" aria-pressed="true">Bold</button>`}
        />
      </section>

      <section>
        <h2>Icon-only</h2>
        <p>
          Add <code>.toggle--icon-only</code> for a square slot. Add an <code>aria-label</code> so the
          affordance is named for assistive tech.
        </p>
        <Demo
          html={`
<button type="button" data-stisla-toggle class="toggle toggle--icon-only" aria-pressed="false" aria-label="Bold"><i data-lucide="bold"></i></button>
<button type="button" data-stisla-toggle class="toggle toggle--icon-only" aria-pressed="true" aria-label="Italic"><i data-lucide="italic"></i></button>
<button type="button" data-stisla-toggle class="toggle toggle--icon-only" aria-pressed="false" aria-label="Underline"><i data-lucide="underline"></i></button>`}
        />
      </section>

      <section>
        <h2>Circle</h2>
        <p>
          Add <code>.toggle--circle</code> alongside <code>.toggle--icon-only</code> for a circular
          silhouette.
        </p>
        <Demo
          html={`
<button type="button" data-stisla-toggle class="toggle toggle--icon-only toggle--circle" aria-pressed="false" aria-label="Like"><i data-lucide="thumbs-up"></i></button>
<button type="button" data-stisla-toggle class="toggle toggle--icon-only toggle--circle" aria-pressed="true" aria-label="Love"><i data-lucide="heart"></i></button>
<button type="button" data-stisla-toggle class="toggle toggle--icon-only toggle--circle" aria-pressed="false" aria-label="Star"><i data-lucide="star"></i></button>`}
        />
      </section>

      <section>
        <h2>Disabled</h2>
        <p>
          Native <code>:disabled</code> on the button (or the paired <code>.toggle-input</code>) dims
          the chip and blocks pointer events.
        </p>
        <Demo
          html={`
<button type="button" data-stisla-toggle class="toggle" aria-pressed="false" disabled>Off, disabled</button>
<button type="button" data-stisla-toggle class="toggle" aria-pressed="true" disabled>On, disabled</button>
<input type="checkbox" class="toggle-input" id="toggleDisabledForm" disabled>
<label class="toggle" for="toggleDisabledForm">Form, disabled</label>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Two events fire on the toggle. Both carry the upcoming or new state in{" "}
          <code>detail.pressed</code>.
        </p>
        <p>
          <code>stisla:toggle:changing</code> fires before the flip and is cancelable. Call{" "}
          <code>preventDefault()</code> on the event to keep the current state, useful when an external
          check has to confirm the flip first.
        </p>
        <p>
          <code>stisla:toggle:changed</code> fires after the flip lands. Use it to mirror the state
          somewhere else or to save the choice.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.toggle</code>. Geometry mirrors <code>.button</code>; the
          surface follows the interactional trio (rest, accent hover, highlight active).
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--toggle-radius</code></td><td>Corner radius</td></tr>
            <tr><td><code>--toggle-height</code></td><td>Hard height; sm/lg reassign this</td></tr>
            <tr><td><code>--toggle-padding-inline</code></td><td>Horizontal padding; sm/lg reassign this</td></tr>
            <tr><td><code>--toggle-padding-block</code></td><td>Vertical padding; defaults to <code>0</code> since the height owns the rhythm</td></tr>
            <tr><td><code>--toggle-gap</code></td><td>Space between an icon and its label</td></tr>
            <tr><td><code>--toggle-font-size</code></td><td>Label size</td></tr>
            <tr><td><code>--toggle-font-weight</code></td><td>Label weight</td></tr>
            <tr><td><code>--toggle-bg</code> / <code>-color</code></td><td>Rest fill / text</td></tr>
            <tr><td><code>--toggle-border-color</code> / <code>-border-width</code></td><td>Rim color / thickness</td></tr>
            <tr><td><code>--toggle-bg-hover</code> / <code>-color-hover</code></td><td>Hover fill / text (accent, transient)</td></tr>
            <tr><td><code>--toggle-bg-active</code> / <code>-color-active</code></td><td>Active fill / text (highlight, persistent)</td></tr>
            <tr><td><code>--toggle-border-color-active</code></td><td>Active rim; defaults to the active bg for a clean solid fill</td></tr>
            <tr><td><code>--toggle-ring</code></td><td>Focus outline color</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
