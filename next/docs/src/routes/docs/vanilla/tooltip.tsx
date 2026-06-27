import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/tooltip")({
  component: TooltipDocs,
});

function TooltipDocs() {
  return (
    <>
      <header>
        <h1>Tooltip</h1>
        <p className="lead">
          A small inverse-surface chip that labels the control it points at.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>data-stisla-tooltip</code> +{" "}
          <code>data-stisla-tooltip-title</code> to any control and the{" "}
          <code>@stisla/vanilla</code> layer builds the chip, shows it on hover
          or focus, and positions it with Floating UI (flipping to the opposite
          side when there's no room). The chip shows after a short hover and
          tracks the trigger. The demos below are live: hover or tab to a
          button.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex justify-center py-10">
  <button class="button button--neutral" data-stisla-tooltip data-stisla-tooltip-title="Saved to your library" data-stisla-tooltip-delay="150">Hover me</button>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          Tooltip activation is tied to focus when <code>focus</code> is in the
          trigger list (the default). Blurring the trigger closes it.
        </p>
        <ul>
          <li>
            <kbd>Tab</kbd>: focus the trigger and open the tooltip
          </li>
          <li>
            <kbd>Escape</kbd>: close the open tooltip without taking focus off
            the trigger
          </li>
        </ul>
      </section>

      <section>
        <h2>Placements</h2>
        <p>
          <code>data-stisla-tooltip-placement</code> picks the resting side.
          Floating UI flips it if the chip would overflow the frame; the{" "}
          <code>-start</code> and <code>-end</code> variants align the tooltip
          to the corresponding edge of the trigger.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-wrap items-center justify-center gap-3 py-12">
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-placement="top" data-stisla-tooltip-title="Anchored above" data-stisla-tooltip-delay="150">Top</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-placement="right" data-stisla-tooltip-title="Anchored right" data-stisla-tooltip-delay="150">Right</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-placement="bottom" data-stisla-tooltip-title="Anchored below" data-stisla-tooltip-delay="150">Bottom</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-placement="left" data-stisla-tooltip-title="Anchored left" data-stisla-tooltip-delay="150">Left</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-placement="top-start" data-stisla-tooltip-title="Top, aligned to the trigger's start edge" data-stisla-tooltip-delay="150">Top start</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-placement="top-end" data-stisla-tooltip-title="Top, aligned to the trigger's end edge" data-stisla-tooltip-delay="150">Top end</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-placement="bottom-start" data-stisla-tooltip-title="Bottom, aligned to the trigger's start edge" data-stisla-tooltip-delay="150">Bottom start</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-placement="bottom-end" data-stisla-tooltip-title="Bottom, aligned to the trigger's end edge" data-stisla-tooltip-delay="150">Bottom end</button>
</div>`}
        />
      </section>

      <section>
        <h2>Triggers</h2>
        <p>
          The default is <code>hover focus</code>, which opens on either. Pass{" "}
          <code>data-stisla-tooltip-trigger</code> to opt for one.{" "}
          <code>manual</code> wires nothing and leaves <code>show()</code> /{" "}
          <code>hide()</code> to a consumer script.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-wrap items-center justify-center gap-3 py-10">
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-trigger="hover" data-stisla-tooltip-title="Hover only. Keyboard focus skips this.">Hover only</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-trigger="focus" data-stisla-tooltip-title="Focus only. Try Tab to reach this.">Focus only</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-title="Default. Opens on hover or focus.">Hover and focus</button>
</div>`}
        />
      </section>

      <section>
        <h2>Delay</h2>
        <p>
          The 600ms default <code>delay</code> prevents flash on incidental
          pointer crossings. Drop to <code>0</code> for instant feedback or
          raise it for chips that should only show on deliberate hover.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-wrap items-center justify-center gap-3 py-10">
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-delay="0" data-stisla-tooltip-title="Instant. No open delay.">Instant</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-delay="600" data-stisla-tooltip-title="Default. 600ms before opening.">Default</button>
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-delay="1200" data-stisla-tooltip-title="Lazy. 1.2s before opening.">Lazy</button>
</div>`}
        />
      </section>

      <section>
        <h2>On a link</h2>
        <p>
          Tooltips work on any element. Inline anchors are the common case for
          jargon, acronyms, or external pointers.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="prose py-10">
  <p class="m-0">
    The release pipeline runs on
    <a class="link" href="#" data-stisla-tooltip data-stisla-tooltip-title="GitHub Actions">CI</a>
    and announces the cut in
    <a class="link" href="#" data-stisla-tooltip data-stisla-tooltip-title="#releases on Slack">the release channel</a>.
  </p>
</div>`}
        />
      </section>

      <section>
        <h2>Icon-only triggers</h2>
        <p>
          Icon buttons rely on tooltips for their label. Always pair the tooltip
          with an <code>aria-label</code> on the trigger so screen readers
          without hover get the same name.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-wrap items-center justify-center gap-3 py-10">
  <button class="button button--outline button--neutral button--icon-only" data-stisla-tooltip data-stisla-tooltip-title="Edit" aria-label="Edit"><i data-lucide="pencil"></i></button>
  <button class="button button--outline button--neutral button--icon-only" data-stisla-tooltip data-stisla-tooltip-title="Duplicate" aria-label="Duplicate"><i data-lucide="copy"></i></button>
  <button class="button button--outline button--neutral button--icon-only" data-stisla-tooltip data-stisla-tooltip-title="Archive" aria-label="Archive"><i data-lucide="archive"></i></button>
  <button class="button button--outline button--danger button--icon-only" data-stisla-tooltip data-stisla-tooltip-title="Delete" aria-label="Delete"><i data-lucide="trash-2"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>HTML content</h2>
        <p>
          Pass <code>data-stisla-tooltip-html="true"</code> to render the title
          as HTML. Keep it short. Anything beyond a chip or two belongs in a
          popover.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex justify-center py-10">
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-html="true" data-stisla-tooltip-title="Press <kbd>Cmd</kbd>+<kbd>K</kbd> to search">Search</button>
</div>`}
        />
      </section>

      <section>
        <h2>Long content</h2>
        <p>
          Content past <code>--tooltip-max-width</code> wraps. Two lines is the
          practical ceiling. Anything longer belongs in a popover.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex justify-center py-10">
  <button class="button button--outline button--neutral" data-stisla-tooltip data-stisla-tooltip-title="Only workspace owners can change billing details and downgrade the plan">Hover for the rule</button>
</div>`}
        />
      </section>

      <section>
        <h2>Disabled trigger</h2>
        <p>
          Disabled buttons don't fire pointer events, so the tooltip attributes
          go on a focusable wrapper that takes the hover and focus instead.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex justify-center py-10">
  <span tabindex="0" data-stisla-tooltip data-stisla-tooltip-title="Upgrade to enable exports" class="inline-block">
    <button class="button button--primary" disabled style="pointer-events: none;">Export CSV</button>
  </span>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Four events fire on the trigger element. The <code>opening</code> and{" "}
          <code>closing</code> events are cancelable.
        </p>
        <p>
          <code>stisla:tooltip:opening</code> fires before the tooltip appears.
          Call <code>preventDefault()</code> to keep it hidden.
        </p>
        <p>
          <code>stisla:tooltip:opened</code> fires once the tooltip is
          positioned and visible.
        </p>
        <p>
          <code>stisla:tooltip:closing</code> fires before the tooltip
          dismisses. Call <code>preventDefault()</code> to keep it open.
        </p>
        <p>
          <code>stisla:tooltip:closed</code> fires once the tooltip is removed
          from the DOM.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the chip. Override on the root or any wrapper.
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
                <code>--tooltip-z-index</code>
              </td>
              <td>Overlay stacking order</td>
            </tr>
            <tr>
              <td>
                <code>--tooltip-max-width</code>
              </td>
              <td>Width cap before the text wraps</td>
            </tr>
            <tr>
              <td>
                <code>--tooltip-padding-block</code> /{" "}
                <code>-padding-inline</code>
              </td>
              <td>Chip interior padding</td>
            </tr>
            <tr>
              <td>
                <code>--tooltip-font-size</code> / <code>-line-height</code>
              </td>
              <td>Label type</td>
            </tr>
            <tr>
              <td>
                <code>--tooltip-color</code> / <code>-bg</code>
              </td>
              <td>Chip text and fill (inverse surface by default)</td>
            </tr>
            <tr>
              <td>
                <code>--tooltip-radius</code> / <code>-shadow</code>
              </td>
              <td>Chip corner radius and elevation</td>
            </tr>
            <tr>
              <td>
                <code>--tooltip-arrow-size</code>
              </td>
              <td>Caret square size</td>
            </tr>
            <tr>
              <td>
                <code>--tooltip-transition-duration</code>
              </td>
              <td>Fade and slide timing; zeroed under reduced-motion</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
