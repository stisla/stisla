import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/alert")({
  component: AlertDocs,
});

function AlertDocs() {
  return (
    <>
      <header>
        <h1>Alert</h1>
        <p className="lead">A contextual feedback strip.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Pair <code>.alert</code> with a tone modifier. Use <code>.alert--neutral</code> for the
          plain surface look, or an intent like <code>.alert--primary</code>,{" "}
          <code>.alert--success</code>, <code>.alert--warning</code>, <code>.alert--danger</code>,{" "}
          <code>.alert--info</code> for a tinted variant. A bare <code>.alert</code> renders
          transparent (the same contract as <code>.button</code>), so the tone gives the alert its
          visible chrome.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="alert alert--neutral"><i data-lucide="info"></i><div>Some neutral message here.</div></div>
<div class="alert alert--primary"><i data-lucide="info"></i><div>Heads up, your trial ends in 3 days.</div></div>
<div class="alert alert--success"><i data-lucide="circle-check"></i><div>Your changes have been saved successfully.</div></div>
<div class="alert alert--warning"><i data-lucide="triangle-alert"></i><div>Some features may not work.</div></div>
<div class="alert alert--danger"><i data-lucide="circle-x"></i><div>Payment failed. Check your card details.</div></div>
<div class="alert alert--info"><i data-lucide="info"></i><div>Some useful information here.</div></div>`}
        />
      </section>

      <section>
        <h2>Without icon</h2>
        <p>
          There's no icon wrapper class. The leading icon is any direct <code>&lt;svg&gt;</code> or{" "}
          <code>&lt;i&gt;</code> child. Skip it and the row reflows around the text.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="alert alert--neutral">Heads up, your trial ends in 3 days.</div>
<div class="alert alert--success">Your changes have been saved successfully.</div>`}
        />
      </section>

      <section>
        <h2>With heading and description</h2>
        <p>
          Add <code>.alert__description</code> for a stacked layout. The heading sits above the
          description, the icon aligns with the heading, and the row gains breathing room.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="alert alert--info">
  <i data-lucide="info"></i>
  <div class="alert__title">Heads up</div>
  <div class="alert__description">A new version is available. Refresh to load it.</div>
</div>
<div class="alert alert--warning">
  <i data-lucide="triangle-alert"></i>
  <div class="alert__title">Unsaved changes</div>
  <div class="alert__description">Leaving this page will discard your edits.</div>
</div>
<div class="alert alert--danger">
  <i data-lucide="circle-x"></i>
  <div class="alert__title">Payment failed</div>
  <div class="alert__description">We couldn't charge your card. Update billing details and retry.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Action slot</h2>
        <p>
          <code>.alert__action</code> is the trailing slot. It pushes to the right on single-line
          alerts and centers vertically when a description is present. Drop in a button, link, or
          any control.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="alert alert--warning">
  <i data-lucide="triangle-alert"></i>
  <div>Your session is about to expire.</div>
  <div class="alert__action">
    <button type="button" class="button button--ghost button--neutral button--sm">Stay</button>
    <button type="button" class="button button--neutral button--sm">Extend</button>
  </div>
</div>
<div class="alert alert--info">
  <i data-lucide="info"></i>
  <div class="alert__title">New version available</div>
  <div class="alert__description">Reload to pick up the latest changes.</div>
  <div class="alert__action">
    <button type="button" class="button button--primary button--sm">Reload</button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Dismissible</h2>
        <p>
          Alert ships no special close control. Drop a{" "}
          <code>.button--ghost.button--neutral.button--icon-only.button--sm</code> with an X icon
          inside <code>.alert__action</code> and wire your own dismiss handler.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="alert alert--success">
  <i data-lucide="circle-check"></i>
  <div>Your changes have been saved.</div>
  <div class="alert__action">
    <button type="button" class="button button--ghost button--neutral button--icon-only button--sm" aria-label="Dismiss"><i data-lucide="x"></i></button>
  </div>
</div>
<div class="alert alert--danger">
  <i data-lucide="circle-x"></i>
  <div class="alert__title">Couldn't connect</div>
  <div class="alert__description">We lost contact with the server. Try again in a moment.</div>
  <div class="alert__action">
    <button type="button" class="button button--ghost button--neutral button--icon-only button--sm" aria-label="Dismiss"><i data-lucide="x"></i></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Inline link</h2>
        <p>
          <code>.alert__link</code> reads <code>--alert-link-color</code>. That resolves to primary
          on a neutral alert and to the intent color on tinted alerts, so the link affordance stays
          readable regardless of tone.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="alert alert--neutral"><i data-lucide="info"></i><div>A neutral alert with <a href="#" class="alert__link">a primary link</a>.</div></div>
<div class="alert alert--info"><i data-lucide="info"></i><div>An info alert with <a href="#" class="alert__link">an info-colored link</a>.</div></div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.alert</code> without touching component CSS. Override on{" "}
          <code>.alert</code> itself, on a parent scope, or on <code>:root</code>. The cascade
          scopes the change.
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
              <td><code>--alert-radius</code></td>
              <td>Corner radius</td>
            </tr>
            <tr>
              <td><code>--alert-padding-block</code></td>
              <td>Top and bottom padding; grows when <code>.alert__description</code> is present</td>
            </tr>
            <tr>
              <td><code>--alert-padding-inline</code></td>
              <td>Left and right padding</td>
            </tr>
            <tr>
              <td><code>--alert-bg</code></td>
              <td>Background; <code>--neutral</code> sets <code>--st-surface</code>, intents set a 7% tint</td>
            </tr>
            <tr>
              <td><code>--alert-border-width</code></td>
              <td>Border thickness; set <code>0</code> to drop the border</td>
            </tr>
            <tr>
              <td><code>--alert-border-color</code></td>
              <td>Border color; <code>--neutral</code> sets <code>--st-border</code>, intents a 40% tint</td>
            </tr>
            <tr>
              <td><code>--alert-color</code></td>
              <td>Body text color</td>
            </tr>
            <tr>
              <td><code>--alert-icon-color</code></td>
              <td>Leading icon color; intents flip this to the intent color</td>
            </tr>
            <tr>
              <td><code>--alert-link-color</code></td>
              <td><code>.alert__link</code> color; intents flip this to the intent color</td>
            </tr>
          </tbody>
        </table>
        <p>
          A bare <code>.alert</code> stays transparent because <code>--alert-bg</code> and{" "}
          <code>--alert-border-color</code> default to transparent. The tone modifier provides the
          visible chrome, so an alert without a tone is invisible by design.
        </p>
      </section>
    </>
  );
}
