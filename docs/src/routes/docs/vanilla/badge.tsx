import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/badge")({
  component: BadgeDocs,
});

function BadgeDocs() {
  return (
    <>
      <header>
        <h1>Badge</h1>
        <p className="lead">
          A compact label for status, counts, and categories.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          A bare <code>.badge</code> is the neutral filled chip. Add an intent
          modifier like <code>.badge--primary</code>,{" "}
          <code>.badge--success</code>, <code>.badge--warning</code>,{" "}
          <code>.badge--danger</code>, or <code>.badge--info</code> to color it.
          Sizing is intrinsic to the content, so a badge is as wide as its
          label.
        </p>
        <Demo
          html={`
<span class="badge">Neutral</span>
<span class="badge badge--primary">Primary</span>
<span class="badge badge--success">Success</span>
<span class="badge badge--warning">Warning</span>
<span class="badge badge--danger">Danger</span>
<span class="badge badge--info">Info</span>`}
        />
      </section>

      <section>
        <h2>Soft</h2>
        <p>
          Add <code>.badge--soft</code> for a tinted fill with solid tone text,
          a quieter look than the filled chip. It composes with an intent
          modifier and reads its tone. On its own, <code>.badge--soft</code>{" "}
          falls back to the muted foreground.
        </p>
        <Demo
          html={`
<span class="badge badge--soft">Neutral</span>
<span class="badge badge--soft badge--primary">Primary</span>
<span class="badge badge--soft badge--success">Success</span>
<span class="badge badge--soft badge--warning">Warning</span>
<span class="badge badge--soft badge--danger">Danger</span>
<span class="badge badge--soft badge--info">Info</span>`}
        />
      </section>

      <section>
        <h2>With icon</h2>
        <p>
          There's no icon wrapper class. Any direct <code>&lt;svg&gt;</code> or{" "}
          <code>&lt;i&gt;</code> child scales to the badge's font size, the same
          convention as <code>.button</code>. Drop it before or after the label.
        </p>
        <Demo
          html={`
<span class="badge badge--success"><i data-lucide="check"></i> Verified</span>
<span class="badge badge--soft badge--warning"><i data-lucide="clock"></i> Pending</span>
<span class="badge badge--soft badge--danger"><i data-lucide="circle-x"></i> Failed</span>
<span class="badge badge--primary"><i data-lucide="star"></i> Featured</span>
<span class="badge badge--info">12 <i data-lucide="arrow-up"></i></span>`}
        />
      </section>

      <section>
        <h2>Loading</h2>
        <p>
          Slot a <code>.spinner.spinner--sm</code> in to signal in-flight work.
          It inherits the badge's text color and shrinks to the badge's font
          size.
        </p>
        <Demo
          html={`
<span class="badge badge--soft badge--primary">
  <span class="spinner spinner--sm" role="status" aria-hidden="true"></span>
  Syncing
</span>
<span class="badge badge--soft">
  <span class="spinner spinner--sm" role="status" aria-hidden="true"></span>
  Loading
</span>
<span class="badge badge--info">
  <span class="spinner spinner--sm" role="status" aria-hidden="true"></span>
  Uploading
</span>`}
        />
      </section>

      <section>
        <h2>Count</h2>
        <p>
          A badge sits inside other components through the font-size cascade.
          Inside a <code>.button</code> it inherits the button's text size and
          packs alongside the label.
        </p>
        <Demo
          html={`
<button type="button" class="button button--neutral">
  Inbox <span class="badge badge--primary">24</span>
</button>
<button type="button" class="button button--soft button--primary">
  Notifications <span class="badge badge--soft badge--primary">9</span>
</button>
<button type="button" class="button button--outline button--neutral">
  Alerts <span class="badge badge--danger">12</span>
</button>`}
        />
      </section>

      <section>
        <h2>Flattened</h2>
        <p>
          Pill is the default shape. Set <code>--badge-radius</code> to flatten
          the corners, on a single badge or on a parent scope to flatten every
          badge inside it at once.
        </p>
        <Demo
          html={`
<span class="badge badge--primary" style="--badge-radius: var(--radius-sm)">Primary</span>
<span class="badge badge--soft badge--success" style="--badge-radius: var(--radius-sm)">Success</span>
<span class="badge" style="--badge-radius: 0">Squared</span>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.badge</code> without touching component
          CSS. Override on the badge itself, on a parent scope, or on{" "}
          <code>:root</code>. The cascade scopes the change.
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
                <code>--badge-radius</code>
              </td>
              <td>Corner radius; defaults to a full pill</td>
            </tr>
            <tr>
              <td>
                <code>--badge-min-height</code>
              </td>
              <td>Minimum height of the chip</td>
            </tr>
            <tr>
              <td>
                <code>--badge-padding-block</code>
              </td>
              <td>Top and bottom padding</td>
            </tr>
            <tr>
              <td>
                <code>--badge-padding-inline</code>
              </td>
              <td>Left and right padding</td>
            </tr>
            <tr>
              <td>
                <code>--badge-font-size</code>
              </td>
              <td>
                Label text size; icons track it via <code>1em</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--badge-font-weight</code>
              </td>
              <td>Label weight</td>
            </tr>
            <tr>
              <td>
                <code>--badge-bg</code>
              </td>
              <td>
                Background; intents set the tone, <code>--soft</code> sets a 15%
                tint
              </td>
            </tr>
            <tr>
              <td>
                <code>--badge-color</code>
              </td>
              <td>Text and icon color</td>
            </tr>
            <tr>
              <td>
                <code>--badge-tone</code>
              </td>
              <td>
                The intent color an intent modifier publishes;{" "}
                <code>--soft</code> reads it for its tint and text
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
