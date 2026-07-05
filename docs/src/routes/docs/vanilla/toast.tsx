import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/toast")({
  component: ToastDocs,
});

function ToastDocs() {
  return (
    <>
      <header>
        <h1>Toast</h1>
        <p className="lead">
          A status message that surfaces briefly at a corner of the screen.
        </p>
      </header>

      <section>
        <h2>Triggering</h2>
        <p>
          Each <code>.toast</code> is a grid of{" "}
          <code>[icon | content | close]</code>, stacked inside a fixed{" "}
          <code>.toast-region</code> at one of six corners. The usual entry
          point is the imperative API — <code>Stisla.toast(…)</code> and its{" "}
          <code>.success</code> / <code>.error</code> / <code>.promise</code>{" "}
          helpers build the node and mount it in a region (auto-creating one if
          needed). The base call takes an options object —{" "}
          <code>
            Stisla.toast({"{ title, description, variant, action, … }"})
          </code>{" "}
          — while the shortcuts take a title first:{" "}
          <code>Stisla.toast.success("Saved")</code>, <code>.error</code>,{" "}
          <code>.warning</code>, <code>.info</code>.{" "}
          <code>Stisla.toast.promise()</code> shows a spinner that swaps to
          success or error when the promise settles. Toasts autohide after a few
          seconds and pause on hover. The Triggering demo below is live; the rest
          render the markup statically so you can read the anatomy.
        </p>
        <Demo
          layout="row"
          html={`
  <button class="button button--neutral" onclick="Stisla.toast({ title: 'Heads up', description: 'Your export is ready to download.' })">Show toast</button>
  <button class="button button--neutral" onclick="Stisla.toast.success('Changes saved')">Success</button>
  <button class="button button--neutral" onclick="Stisla.toast.error('Upload failed')">Error</button>
  <button class="button button--neutral" onclick="Stisla.toast({ title: 'New message', description: 'Priya sent you a message.', action: { label: 'Reply' } })">With action</button>
  <button class="button button--neutral" onclick="Stisla.toast.promise(new Promise(function(res){ setTimeout(res, 1600); }), { loading: 'Saving…', success: 'Saved', error: 'Failed' })">Promise</button>
`}
        />
      </section>

      <section>
        <h2>Basic</h2>
        <p>
          The icon column is required and anchors the layout. The content column
          stacks a <code>.toast__header</code> and an optional{" "}
          <code>.toast__body</code>; the close chip trails the row. A title-only
          toast centers vertically.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="toast" data-state="open" role="status">
  <span class="toast__icon"><i data-lucide="bell"></i></span>
  <div class="toast__content">
    <div class="toast__header">Report ready</div>
    <div class="toast__body">Your weekly export finished and is ready to download.</div>
  </div>
  <button class="toast__close" aria-label="Dismiss"><i data-lucide="x"></i></button>
</div>
<div class="toast" data-state="open" role="status">
  <span class="toast__icon"><i data-lucide="circle-check"></i></span>
  <div class="toast__content">
    <div class="toast__header">Changes saved</div>
  </div>
  <button class="toast__close" aria-label="Dismiss"><i data-lucide="x"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>Intents</h2>
        <p>
          An intent modifier shifts only the icon color; the surface stays
          neutral so a stack of mixed intents still reads as one family.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="toast toast--success" data-state="open" role="status">
  <span class="toast__icon"><i data-lucide="circle-check"></i></span>
  <div class="toast__content"><div class="toast__header">Payment received</div></div>
  <button class="toast__close" aria-label="Dismiss"><i data-lucide="x"></i></button>
</div>
<div class="toast toast--warning" data-state="open" role="status">
  <span class="toast__icon"><i data-lucide="triangle-alert"></i></span>
  <div class="toast__content"><div class="toast__header">Storage almost full</div></div>
  <button class="toast__close" aria-label="Dismiss"><i data-lucide="x"></i></button>
</div>
<div class="toast toast--danger" data-state="open" role="status">
  <span class="toast__icon"><i data-lucide="circle-x"></i></span>
  <div class="toast__content"><div class="toast__header">Upload failed</div></div>
  <button class="toast__close" aria-label="Dismiss"><i data-lucide="x"></i></button>
</div>
<div class="toast toast--info" data-state="open" role="status">
  <span class="toast__icon"><i data-lucide="info"></i></span>
  <div class="toast__content"><div class="toast__header">A new version is available</div></div>
  <button class="toast__close" aria-label="Dismiss"><i data-lucide="x"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>Timestamp and actions</h2>
        <p>
          A <code>.toast__timestamp</code> reads muted next to the title, and a{" "}
          <code>.toast__action</code> row trails the body with follow-up
          buttons.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="toast" data-state="open" role="status">
  <span class="toast__icon"><i data-lucide="user-plus"></i></span>
  <div class="toast__content">
    <div class="toast__header">Priya invited you <span class="toast__timestamp">2 mins ago</span></div>
    <div class="toast__body">You have been added to the Northwind project.</div>
    <div class="toast__action">
      <button class="button button--primary button--sm">Accept</button>
      <button class="button button--ghost button--neutral button--sm">Dismiss</button>
    </div>
  </div>
  <button class="toast__close" aria-label="Dismiss"><i data-lucide="x"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>Placement</h2>
        <p>
          A <code>.toast-region</code> pins the stack to a corner;{" "}
          <code>.toast-region--top-end</code> is the default. Here a real region
          runs inside the frame.
        </p>
        <Demo
          layout="stack"
          html={`
<p class="text-muted-foreground">Page content. The region floats over the top-end corner of this frame.</p>

<div class="toast-region toast-region--top-end" role="region" aria-label="Notifications">
  <div class="toast toast--success" data-state="open" role="status">
    <span class="toast__icon"><i data-lucide="circle-check"></i></span>
    <div class="toast__content"><div class="toast__header">Saved</div></div>
    <button class="toast__close" aria-label="Dismiss"><i data-lucide="x"></i></button>
  </div>
  <div class="toast" data-state="open" role="status">
    <span class="toast__icon"><i data-lucide="bell"></i></span>
    <div class="toast__content">
      <div class="toast__header">Reminder</div>
      <div class="toast__body">Stand-up starts in five minutes.</div>
    </div>
    <button class="toast__close" aria-label="Dismiss"><i data-lucide="x"></i></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the toast and its region. Override on the root
          or any wrapper.
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
                <code>--toast-region-z-index</code>
              </td>
              <td>Overlay stacking order</td>
            </tr>
            <tr>
              <td>
                <code>--toast-region-gap</code> / <code>-region-inset</code> /{" "}
                <code>-region-max-width</code>
              </td>
              <td>Stack spacing, corner inset, and region width</td>
            </tr>
            <tr>
              <td>
                <code>--toast-min-width</code> / <code>-max-width</code>
              </td>
              <td>Toast width bounds</td>
            </tr>
            <tr>
              <td>
                <code>--toast-column-gap</code> / <code>-content-gap</code>
              </td>
              <td>Grid column gap and content stack gap</td>
            </tr>
            <tr>
              <td>
                <code>--toast-padding-block</code> /{" "}
                <code>-padding-inline</code>
              </td>
              <td>Toast interior padding</td>
            </tr>
            <tr>
              <td>
                <code>--toast-bg</code> / <code>-color</code> /{" "}
                <code>-border-color</code>
              </td>
              <td>Surface fill, text, and rim</td>
            </tr>
            <tr>
              <td>
                <code>--toast-radius</code> / <code>-shadow</code>
              </td>
              <td>Corner radius and elevation</td>
            </tr>
            <tr>
              <td>
                <code>--toast-icon-size</code> / <code>-icon-color</code>
              </td>
              <td>
                Leading icon size and color (intent modifiers set the color)
              </td>
            </tr>
            <tr>
              <td>
                <code>--toast-header-font-size</code> /{" "}
                <code>-header-font-weight</code>
              </td>
              <td>Title type</td>
            </tr>
            <tr>
              <td>
                <code>--toast-body-font-size</code> / <code>-body-color</code>
              </td>
              <td>Description type</td>
            </tr>
            <tr>
              <td>
                <code>--toast-close-size</code> / <code>-close-color</code> /{" "}
                <code>-close-bg-hover</code>
              </td>
              <td>Close chip size and paint</td>
            </tr>
            <tr>
              <td>
                <code>--toast-transition-duration</code>
              </td>
              <td>Enter and exit timing; zeroed under reduced-motion</td>
            </tr>
          </tbody>
        </table>
        <p>
          Place the region with{" "}
          <code>
            .toast-region--{"{top|bottom}"}-{"{start|center|end}"}
          </code>
          . Intent modifiers are <code>.toast--primary</code>,{" "}
          <code>.toast--success</code>, <code>.toast--warning</code>,{" "}
          <code>.toast--danger</code>, and <code>.toast--info</code>.
        </p>
      </section>
    </>
  );
}
