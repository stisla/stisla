import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/dialog")({
  component: DialogDocs,
});

// A small dialog for the variant demos. rootCls goes on .dialog (size/fullscreen modifiers),
// panelCls on .dialog__panel (position modifiers).
const dlg = (
  id: string,
  rootCls: string,
  panelCls: string,
  title: string,
  body: string,
) => `
<div class="dialog ${rootCls}" id="${id}" data-stisla-dialog>
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__panel ${panelCls}">
    <div class="dialog__content">
      <button class="dialog__close" data-stisla-dialog-dismiss aria-label="Close"><i data-lucide="x"></i></button>
      <div class="dialog__header"><h2 class="dialog__title">${title}</h2></div>
      <div class="dialog__body"><p class="m-0 text-muted-foreground">${body}</p></div>
      <div class="dialog__footer"><button class="button button--ghost button--neutral" data-stisla-dialog-dismiss>Close</button></div>
    </div>
  </div>
</div>`;

function DialogDocs() {
  return (
    <>
      <header>
        <h1>Dialog</h1>
        <p className="lead">
          A centered modal over a frosted backdrop that dims the page.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          The <code>.dialog</code> root holds a <code>.dialog__backdrop</code>{" "}
          and a <code>.dialog__panel</code> wrapping the visible{" "}
          <code>.dialog__content</code> (header, body, footer, and a floating
          close chip). Open and close, focus trapping, scroll lock, and the
          static-backdrop shake come from the <code>@stisla/vanilla</code>{" "}
          layer: put <code>data-stisla-dialog</code> + an <code>id</code> on the
          root, point a <code>data-stisla-dialog-trigger="id"</code> button at
          it, and mark the backdrop and any close controls with{" "}
          <code>data-stisla-dialog-dismiss</code>. A header titles the dialog,
          the body carries the message, and the footer trails its actions. The
          close chip floats over the top-trailing corner. Add{" "}
          <code>autofocus</code> to any control inside the panel to land focus
          there on open. The demos below are live, each contained to its own
          frame.
        </p>
        <Demo
          layout="stack"
          html={`
<button class="button button--primary" data-stisla-dialog-trigger="dlg-basic">Invite a teammate</button>

<div class="dialog" id="dlg-basic" data-stisla-dialog aria-labelledby="dlg-basic-label">
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__panel">
    <div class="dialog__content">
      <button class="dialog__close" data-stisla-dialog-dismiss aria-label="Close"><i data-lucide="x"></i></button>
      <div class="dialog__header">
        <h2 class="dialog__title" id="dlg-basic-label">Invite a teammate</h2>
      </div>
      <div class="dialog__body">
        <p class="mt-0 text-muted-foreground">Send a link by email. The invite expires in seven days.</p>
        <div class="field">
          <label for="dlg-basic-email" class="field__label">Email</label>
          <input type="email" class="input" id="dlg-basic-email" placeholder="name@example.com" autocomplete="email" autofocus />
        </div>
      </div>
      <div class="dialog__footer">
        <button class="button button--ghost button--neutral" data-stisla-dialog-dismiss>Cancel</button>
        <button class="button button--primary" data-stisla-dialog-dismiss>Send invite</button>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          Focus is trapped inside the dialog while it's open. On open, focus
          lands on the first element marked <code>autofocus</code>, falling back
          to <code>.dialog__close</code>; on close, focus returns to the trigger
          that opened it.
        </p>
        <ul>
          <li>
            <kbd>Tab</kbd>: cycle focus forward through focusable controls
            (wraps to the first)
          </li>
          <li>
            <kbd>Shift</kbd> + <kbd>Tab</kbd>: cycle focus backward (wraps to
            the last)
          </li>
          <li>
            <kbd>Escape</kbd>: dismiss the dialog (unless the backdrop is
            static, see Static backdrop below)
          </li>
        </ul>
      </section>

      <section>
        <h2>Scrollable body</h2>
        <p>
          Add <code>.dialog__panel--scrollable</code> so a long body scrolls
          while the header and footer stay pinned. The panel height is bounded
          to the viewport.
        </p>
        <Demo
          layout="stack"
          html={`
<button class="button button--neutral" data-stisla-dialog-trigger="dlg-scroll">Review terms</button>

<div class="dialog" id="dlg-scroll" data-stisla-dialog>
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__panel dialog__panel--scrollable">
    <div class="dialog__content">
      <button class="dialog__close" data-stisla-dialog-dismiss aria-label="Close"><i data-lucide="x"></i></button>
      <div class="dialog__header">
        <h2 class="dialog__title">Terms of service</h2>
      </div>
      <div class="dialog__body">
        <p class="mt-0 text-muted-foreground">Please review the terms before continuing.</p>
        <p class="text-muted-foreground">Membership grants a non-exclusive licence to access the service for personal or business use, subject to the limits described in your plan.</p>
        <p class="text-muted-foreground">You are responsible for activity under your account and for keeping your credentials secure.</p>
        <p class="text-muted-foreground">We may update these terms from time to time; continued use after a change constitutes acceptance.</p>
        <p class="text-muted-foreground">Either party may end the agreement at any time. On termination your data stays available for export for thirty days.</p>
        <p class="mb-0 text-muted-foreground">Questions about these terms can be sent to support at any time.</p>
      </div>
      <div class="dialog__footer">
        <button class="button button--ghost button--neutral" data-stisla-dialog-dismiss>Decline</button>
        <button class="button button--primary" data-stisla-dialog-dismiss>Accept</button>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Fullscreen</h2>
        <p>
          <code>.dialog--fullscreen</code> drops the outer margin and corner
          radius so the panel takes the whole viewport, for immersive flows.
        </p>
        <Demo
          layout="stack"
          html={`
<button class="button button--neutral" data-stisla-dialog-trigger="dlg-full">Compose</button>

<div class="dialog dialog--fullscreen" id="dlg-full" data-stisla-dialog>
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__panel">
    <div class="dialog__content">
      <button class="dialog__close" data-stisla-dialog-dismiss aria-label="Close"><i data-lucide="x"></i></button>
      <div class="dialog__header">
        <h2 class="dialog__title">Compose</h2>
      </div>
      <div class="dialog__body">
        <p class="m-0 text-muted-foreground">A fullscreen surface for focused, long-form tasks such as composing or editing.</p>
      </div>
      <div class="dialog__footer">
        <button class="button button--ghost button--neutral" data-stisla-dialog-dismiss>Discard</button>
        <button class="button button--primary" data-stisla-dialog-dismiss>Save</button>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Width modifiers on the root swap the panel size: the default sits
          mid-scale, with <code>.dialog--sm</code>, <code>.dialog--lg</code>,{" "}
          <code>.dialog--xl</code>, and{" "}
          <code>.dialog--almost-fullscreen</code> (a breathing strip around an
          otherwise full-viewport panel).
        </p>
        <Demo
          layout="row"
          html={`
<button class="button button--neutral button--outline" data-stisla-dialog-trigger="dlg-sm">Small</button>
<button class="button button--neutral button--outline" data-stisla-dialog-trigger="dlg-default">Default</button>
<button class="button button--neutral button--outline" data-stisla-dialog-trigger="dlg-lg">Large</button>
<button class="button button--neutral button--outline" data-stisla-dialog-trigger="dlg-xl">Extra large</button>
<button class="button button--neutral button--outline" data-stisla-dialog-trigger="dlg-afs">Almost fullscreen</button>
${dlg("dlg-sm", "dialog--sm", "", "Small", "A narrow panel for a short prompt.")}
${dlg("dlg-default", "", "", "Default", "The default width sits in the middle of the scale.")}
${dlg("dlg-lg", "dialog--lg", "", "Large", "A wider panel for forms or richer content.")}
${dlg("dlg-xl", "dialog--xl", "", "Extra large", "The widest fixed size, for dense layouts.")}
${dlg("dlg-afs", "dialog--almost-fullscreen", "", "Almost fullscreen", "Fills the viewport but keeps a strip of page around it.")}`}
        />
      </section>

      <section>
        <h2>Positioning</h2>
        <p>
          The panel centers by default. <code>.dialog__panel--top</code> drops
          it in from above and <code>.dialog__panel--bottom</code> anchors it to
          the lower edge.
        </p>
        <Demo
          layout="row"
          html={`
<button class="button button--neutral button--outline" data-stisla-dialog-trigger="dlg-top">Top</button>
<button class="button button--neutral button--outline" data-stisla-dialog-trigger="dlg-center">Center</button>
<button class="button button--neutral button--outline" data-stisla-dialog-trigger="dlg-bottom">Bottom</button>

${dlg("dlg-top", "", "dialog__panel--top", "Pinned to top", "This panel drops in from the top edge.")}
${dlg("dlg-center", "", "", "Centered", "The default vertical position.")}
${dlg("dlg-bottom", "", "dialog__panel--bottom", "Anchored to bottom", "This panel sits against the lower edge.")}`}
        />
      </section>

      <section>
        <h2>Static backdrop</h2>
        <p>
          Set <code>data-stisla-dialog-backdrop="static"</code> (with{" "}
          <code>data-stisla-dialog-keyboard="false"</code> to also block ESC)
          for a deliberate dismiss: a backdrop click shakes the panel instead of
          closing. Explicit dismiss controls still close.
        </p>
        <Demo
          layout="row"
          html={`
<button class="button button--primary" data-stisla-dialog-trigger="dlg-static">Begin setup</button>

<div class="dialog" id="dlg-static" data-stisla-dialog data-stisla-dialog-backdrop="static" data-stisla-dialog-keyboard="false">
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__panel">
    <div class="dialog__content">
      <div class="dialog__header"><h2 class="dialog__title">Finish setup</h2></div>
      <div class="dialog__body"><p class="m-0 text-muted-foreground">Clicking outside won't dismiss this. Choose an action to continue.</p></div>
      <div class="dialog__footer">
        <button class="button button--ghost button--neutral" data-stisla-dialog-dismiss>Skip</button>
        <button class="button button--primary" data-stisla-dialog-dismiss>Done</button>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Confirmation</h2>
        <p>
          The alert-dialog pattern for a destructive action:{" "}
          <code>role="alertdialog"</code>, a tinted
          <code>.icon-box</code> for tone, a centered heading and description,
          and a Cancel / confirm pair. A small width keeps it focused.
        </p>
        <Demo
          layout="row"
          html={`
<button class="button button--outline button--danger" data-stisla-dialog-trigger="dlg-confirm">Delete workspace</button>

<div class="dialog dialog--sm" id="dlg-confirm" data-stisla-dialog role="alertdialog" aria-labelledby="dlg-confirm-label" aria-describedby="dlg-confirm-desc">
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__panel">
    <div class="dialog__content">
      <button class="dialog__close" data-stisla-dialog-dismiss aria-label="Close"><i data-lucide="x"></i></button>
      <div class="dialog__body text-center pt-6">
        <span class="icon-box icon-box--danger icon-box--circle mb-3" style="--icon-box-size: 3rem; --icon-box-icon-size: 1.25rem;"><i data-lucide="trash-2"></i></span>
        <h3 class="dialog__title m-0 mb-1" id="dlg-confirm-label">Delete this workspace?</h3>
        <p class="text-muted-foreground m-0" id="dlg-confirm-desc">This removes every project, file, and member. The action can't be undone.</p>
      </div>
      <div class="dialog__footer justify-center">
        <button class="button button--ghost button--neutral" data-stisla-dialog-dismiss>Cancel</button>
        <button class="button button--danger" data-stisla-dialog-dismiss>Delete</button>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Success</h2>
        <p>
          A celebratory end-of-flow state: the icon on top, the heading and
          description in the middle, and a single block button to the next step.
        </p>
        <Demo
          layout="stack"
          html={`
<button class="button" style="--button-tone: var(--color-success); --button-color: var(--color-success-foreground)" data-stisla-dialog-trigger="dlg-success">Submit order</button>

<div class="dialog dialog--sm" id="dlg-success" data-stisla-dialog aria-labelledby="dlg-success-label">
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__panel">
    <div class="dialog__content">
      <button class="dialog__close" data-stisla-dialog-dismiss aria-label="Close"><i data-lucide="x"></i></button>
      <div class="dialog__body text-center pt-6">
        <span class="icon-box icon-box--success icon-box--circle mb-3" style="--icon-box-size: 3.5rem; --icon-box-icon-size: 1.5rem;"><i data-lucide="check"></i></span>
        <h3 class="dialog__title m-0 mb-1" id="dlg-success-label">Order placed</h3>
        <p class="text-muted-foreground m-0">We've emailed the receipt and a tracking link. Delivery lands in two to three business days.</p>
      </div>
      <div class="dialog__footer">
        <button class="button button--block" style="--button-tone: var(--color-success); --button-color: var(--color-success-foreground)" data-stisla-dialog-dismiss>View order</button>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Media hero</h2>
        <p>
          Drop the header when the leading row is media. The floating close
          still sits at the top-trailing corner and reads against the image.
        </p>
        <Demo
          layout="stack"
          html={`
<button class="button button--primary" data-stisla-dialog-trigger="dlg-hero">What's new</button>

<div class="dialog" id="dlg-hero" data-stisla-dialog aria-labelledby="dlg-hero-label">
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__panel">
    <div class="dialog__content">
      <button class="dialog__close" data-stisla-dialog-dismiss aria-label="Close"><i data-lucide="x"></i></button>
      <img class="block w-full" src="https://picsum.photos/seed/stisla-autumn/1200/520" alt="" />
      <div class="dialog__body">
        <h3 class="dialog__title m-0 mb-1" id="dlg-hero-label">Autumn release</h3>
        <p class="text-muted-foreground m-0">A round-up of what's new this season, with notes on what's still in flight.</p>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Lightbox</h2>
        <p>
          Override the surface variables on a single dialog to turn it into a
          frame for media. The blurred backdrop and the floating close carry the
          affordance.
        </p>
        <Demo
          layout="stack"
          html={`
<a class="inline-block cursor-zoom-in" href="#" data-stisla-dialog-trigger="dlg-lightbox">
  <img src="https://picsum.photos/seed/stisla-shot/480/320" alt="Open image" width="240" height="160" class="rounded-md object-cover" />
</a>

<div class="dialog dialog--xl" id="dlg-lightbox" data-stisla-dialog style="--dialog-bg: transparent; --dialog-border-color: transparent; --dialog-shadow: none;">
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__panel">
    <div class="dialog__content">
      <button class="dialog__close" data-stisla-dialog-dismiss aria-label="Close"><i data-lucide="x"></i></button>
      <img class="block w-full max-h-[calc(100dvh-5rem)] object-contain rounded-md" src="https://picsum.photos/seed/stisla-shot/1600/1066" alt="" />
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Four events fire on the <code>.dialog</code> root. The{" "}
          <code>opening</code> and <code>closing</code> events are cancelable.
        </p>
        <p>
          <code>stisla:dialog:opening</code> fires before the panel mounts and
          the backdrop fades in. Call <code>preventDefault()</code> to abort
          (useful for an external readiness check).
        </p>
        <p>
          <code>stisla:dialog:opened</code> fires once the open transition lands
          and focus is in place.
        </p>
        <p>
          <code>stisla:dialog:closing</code> fires before the close transition
          starts. Call <code>preventDefault()</code> to keep it open (useful for
          unsaved-changes guards).
        </p>
        <p>
          <code>stisla:dialog:closed</code> fires once the panel is fully hidden
          and focus has returned to the trigger.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the dialog. Override on the root or any
          wrapper.
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
                <code>--dialog-z-index</code>
              </td>
              <td>Overlay stacking order</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-width</code>
              </td>
              <td>Panel width cap; the size modifiers retune this</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-margin-block</code> / <code>-margin-inline</code>
              </td>
              <td>Gap between the panel and the viewport edges</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-bg</code> / <code>-color</code> /{" "}
                <code>-border-color</code>
              </td>
              <td>Content fill, text, and rim</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-radius</code> / <code>-shadow</code>
              </td>
              <td>Content corner radius and elevation</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-padding-block</code> /{" "}
                <code>-padding-inline</code>
              </td>
              <td>Header and body interior padding</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-title-font-size</code> /{" "}
                <code>-title-font-weight</code>
              </td>
              <td>Title type</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-footer-bg</code> /{" "}
                <code>-footer-border-color</code> /{" "}
                <code>-footer-padding-block</code>
              </td>
              <td>Footer seam fill, divider, and padding</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-backdrop-bg</code> / <code>-backdrop-blur</code>
              </td>
              <td>Scrim color and blur radius</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-close-size</code> / <code>-close-color</code> /{" "}
                <code>-close-bg</code> / <code>-close-bg-hover</code>
              </td>
              <td>Close chip size and frosted paint</td>
            </tr>
            <tr>
              <td>
                <code>--dialog-transition-duration</code>
              </td>
              <td>Fade and scale timing; zeroed under reduced-motion</td>
            </tr>
          </tbody>
        </table>
        <p>
          Size modifiers set <code>--dialog-width</code>:{" "}
          <code>.dialog--sm</code>, <code>.dialog--lg</code>,{" "}
          <code>.dialog--xl</code>, plus{" "}
          <code>.dialog--almost-fullscreen</code>. Position the panel with{" "}
          <code>.dialog__panel--top</code> or{" "}
          <code>.dialog__panel--bottom</code> instead of the default center.
        </p>
      </section>
    </>
  );
}
