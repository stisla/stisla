import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/accordion")({
  component: AccordionDocs,
});

function AccordionDocs() {
  return (
    <>
      <header>
        <h1>Accordion</h1>
        <p className="lead">
          A stack of collapsible panels where the open item rises as a soft
          chip.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Each <code>.accordion__item</code> carries{" "}
          <code>data-state="open|closed"</code>: a closed item sits transparent
          on the frame, an open one fills with a surface chip and reveals its
          body. The toggling — the measured height transition and single-open
          coordination — comes from the <code>@stisla/vanilla</code> layer via{" "}
          <code>data-stisla-accordion</code> on the root and{" "}
          <code>data-stisla-accordion-trigger</code> on each button. Multiple
          items may stay open at once. The demos below are live: click a header
          to expand it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="accordion" data-stisla-accordion>
  <div class="accordion__item" data-state="open">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="true" aria-controls="acc-default-1" id="acc-default-1-trigger">
        What is a design system?
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-default-1" role="region" aria-labelledby="acc-default-1-trigger">
      <div class="accordion__body-inner">
        A shared vocabulary of tokens, primitives, and patterns that lets every screen in a product look like it was made by the same hand. Stisla is one of them, implemented first as a vanilla CSS + JS layer, with React and Vue layers to follow.
      </div>
    </div>
  </div>
  <div class="accordion__item" data-state="closed">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-default-2" id="acc-default-2-trigger">
        How are corners kept concentric?
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-default-2" role="region" aria-labelledby="acc-default-2-trigger">
      <div class="accordion__body-inner">
        The frame owns a single radius. Each item subtracts the wrapper padding from that radius so the inner arc shares a center with the outer arc. Change <code>--accordion-radius</code> on a parent and every nested item keeps the rhythm.
      </div>
    </div>
  </div>
  <div class="accordion__item" data-state="closed">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-default-3" id="acc-default-3-trigger">
        Does it animate?
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-default-3" role="region" aria-labelledby="acc-default-3-trigger">
      <div class="accordion__body-inner">
        The chevron rotates and the panel slides open and closed. Both transitions follow the standard Stisla motion curve and ease at the same duration.
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          Each <code>.accordion__trigger</code> is a native{" "}
          <code>&lt;button&gt;</code>, so the browser handles focus and
          activation.
        </p>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <kbd>Tab</kbd>
              </td>
              <td>Move focus to the next trigger, or out of the accordion</td>
            </tr>
            <tr>
              <td>
                <kbd>Shift</kbd> + <kbd>Tab</kbd>
              </td>
              <td>Move focus backward</td>
            </tr>
            <tr>
              <td>
                <kbd>Enter</kbd> / <kbd>Space</kbd>
              </td>
              <td>Toggle the focused panel</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Single open</h2>
        <p>
          Add <code>data-stisla-accordion-type="single"</code> on the root to
          enforce one-open-at-a-time. Opening any trigger closes the others.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="accordion" data-stisla-accordion data-stisla-accordion-type="single">
  <div class="accordion__item" data-state="open">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="true" aria-controls="acc-single-1" id="acc-single-1-trigger">
        Section one
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-single-1" role="region" aria-labelledby="acc-single-1-trigger">
      <div class="accordion__body-inner">
        Opening section two will close this panel.
      </div>
    </div>
  </div>
  <div class="accordion__item" data-state="closed">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-single-2" id="acc-single-2-trigger">
        Section two
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-single-2" role="region" aria-labelledby="acc-single-2-trigger">
      <div class="accordion__body-inner">
        Each trigger acts like a radio in a group.
      </div>
    </div>
  </div>
  <div class="accordion__item" data-state="closed">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-single-3" id="acc-single-3-trigger">
        Section three
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-single-3" role="region" aria-labelledby="acc-single-3-trigger">
      <div class="accordion__body-inner">
        Closing the current one without opening another is fine too. Just click an open trigger again.
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Flush in a card</h2>
        <p>
          Add <code>.accordion--flush</code> to drop the outer frame so the
          accordion sits edge-to-edge inside a card or page. Items lose their
          chip inset and a single divider sits between rows.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-full">
  <div class="card__header">
    <h4 class="card__title">Frequently asked</h4>
  </div>
  <div class="accordion accordion--flush" data-stisla-accordion>
    <div class="accordion__item" data-state="open">
      <h4 class="accordion__heading">
        <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="true" aria-controls="acc-flush-1" id="acc-flush-1-trigger">
          Can I deploy to my own domain?
          <i data-lucide="chevron-down" class="accordion__icon"></i>
        </button>
      </h4>
      <div class="accordion__body" id="acc-flush-1" role="region" aria-labelledby="acc-flush-1-trigger">
        <div class="accordion__body-inner">
          Point your domain at the build output. Any static host works.
        </div>
      </div>
    </div>
    <div class="accordion__item" data-state="closed">
      <h4 class="accordion__heading">
        <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-flush-2" id="acc-flush-2-trigger">
          Do you ship a CLI?
          <i data-lucide="chevron-down" class="accordion__icon"></i>
        </button>
      </h4>
      <div class="accordion__body" id="acc-flush-2" role="region" aria-labelledby="acc-flush-2-trigger">
        <div class="accordion__body-inner">
          Not in 3.0. The starter templates download as zips.
        </div>
      </div>
    </div>
    <div class="accordion__item" data-state="closed">
      <h4 class="accordion__heading">
        <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-flush-3" id="acc-flush-3-trigger">
          Is there a React wrapper?
          <i data-lucide="chevron-down" class="accordion__icon"></i>
        </button>
      </h4>
      <div class="accordion__body" id="acc-flush-3" role="region" aria-labelledby="acc-flush-3-trigger">
        <div class="accordion__body-inner">
          Pair <code>@stisla/css</code> with Radix or Base UI today. A first-party wrapper is post-3.0.
        </div>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>With leading icon</h2>
        <p>
          Drop an icon inside the trigger before the label. The chevron stays
          pinned to the end.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="accordion" data-stisla-accordion>
  <div class="accordion__item" data-state="open">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="true" aria-controls="acc-icon-1" id="acc-icon-1-trigger">
        <i data-lucide="truck"></i>
        Shipping
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-icon-1" role="region" aria-labelledby="acc-icon-1-trigger">
      <div class="accordion__body-inner">
        Free standard shipping on orders over $50. Express options at checkout.
      </div>
    </div>
  </div>
  <div class="accordion__item" data-state="closed">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-icon-2" id="acc-icon-2-trigger">
        <i data-lucide="trash-2"></i>
        Returns
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-icon-2" role="region" aria-labelledby="acc-icon-2-trigger">
      <div class="accordion__body-inner">
        30-day window from delivery. Bring your order number.
      </div>
    </div>
  </div>
  <div class="accordion__item" data-state="closed">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-icon-3" id="acc-icon-3-trigger">
        <i data-lucide="clock"></i>
        Order tracking
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-icon-3" role="region" aria-labelledby="acc-icon-3-trigger">
      <div class="accordion__body-inner">
        A tracking link emails out once your package leaves the warehouse.
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Disabled item</h2>
        <p>
          A native <code>disabled</code> on the trigger fades it and blocks the
          toggle.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="accordion" data-stisla-accordion>
  <div class="accordion__item" data-state="closed">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-disabled-1" id="acc-disabled-1-trigger">
        Active section
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-disabled-1" role="region" aria-labelledby="acc-disabled-1-trigger">
      <div class="accordion__body-inner">
        This one opens.
      </div>
    </div>
  </div>
  <div class="accordion__item" data-state="closed">
    <h3 class="accordion__heading">
      <button class="accordion__trigger" data-stisla-accordion-trigger aria-expanded="false" aria-controls="acc-disabled-2" id="acc-disabled-2-trigger" disabled>
        Locked section
        <i data-lucide="chevron-down" class="accordion__icon"></i>
      </button>
    </h3>
    <div class="accordion__body" id="acc-disabled-2" role="region" aria-labelledby="acc-disabled-2-trigger">
      <div class="accordion__body-inner">
        Body sits hidden; the trigger refuses interaction.
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          <code>stisla:accordion:value-change</code> fires on the accordion root
          after a successful open or close. The <code>detail</code> object
          carries the freshly-changed item under <code>value</code>, the prior
          selection under <code>previousValue</code>, and the full set of
          currently-open items under <code>openItems</code>. Use it to sync URL
          hash state, persist the last-open item, or react to user navigation
          through the panels.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the stack. Override on the root or any wrapper.
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
                <code>--accordion-gap</code>
              </td>
              <td>Space between items</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-padding-block</code> /{" "}
                <code>-padding-inline</code>
              </td>
              <td>Frame inset; also feeds the concentric item radius</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-bg</code>
              </td>
              <td>Frame background</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-border-color</code> /{" "}
                <code>-border-width</code>
              </td>
              <td>Frame rim</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-radius</code> / <code>-shadow</code>
              </td>
              <td>Frame corner radius and elevation</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-item-open-bg</code> /{" "}
                <code>-item-open-border-color</code>
              </td>
              <td>Open chip fill and rim</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-trigger-padding-block</code> /{" "}
                <code>-padding-inline</code>
              </td>
              <td>Trigger interior padding</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-trigger-font-size</code> /{" "}
                <code>-font-weight</code>
              </td>
              <td>Trigger label type</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-trigger-color</code> / <code>-bg</code> /{" "}
                <code>-bg-hover</code>
              </td>
              <td>Trigger text, fill, and closed-item hover</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-trigger-divider-color</code>
              </td>
              <td>Line under an open trigger</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-ring</code>
              </td>
              <td>Focus outline color</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-icon-size</code> / <code>-icon-color</code> /{" "}
                <code>-icon-transition-duration</code>
              </td>
              <td>Chevron size, color, and rotation timing</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-body-color</code>
              </td>
              <td>Body text color</td>
            </tr>
            <tr>
              <td>
                <code>--accordion-body-padding-block</code> /{" "}
                <code>-padding-inline</code>
              </td>
              <td>Body interior padding</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
