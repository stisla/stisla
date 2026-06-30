import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/popover")({
  component: PopoverDocs,
});

function PopoverDocs() {
  return (
    <>
      <header>
        <h1>Popover</h1>
        <p className="lead">
          A surface-tier panel anchored to a trigger, holding rich content.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          A plain popover is a <code>.popover__title</code> over a{" "}
          <code>.popover__body</code>. Adding a <code>.popover__header</code>{" "}
          turns it into a panel: the root padding drops so header and footer
          dividers run edge to edge, and each part owns its padding. Give the{" "}
          <code>.popover</code> an <code>id</code> +{" "}
          <code>data-stisla-popover</code>, point a{" "}
          <code>data-stisla-popover-trigger="id"</code> button at it, and the{" "}
          <code>@stisla/vanilla</code> layer positions it with Floating UI,
          traps focus, and closes on outside click or ESC. The arrow is injected
          automatically, pointing back at the trigger. The demos below are live.
        </p>
        <Demo
          layout="stack"
          html={`
<button class="button button--neutral" data-stisla-popover-trigger="pop-basic">Details</button>
<div class="popover" id="pop-basic" data-stisla-popover data-stisla-popover-placement="bottom">
  <h3 class="popover__title">Storage almost full</h3>
  <p class="popover__body">You have used 92% of your plan. Archive old projects or upgrade to keep syncing.</p>
</div>
`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          Hover-trigger popovers open on focus too, so keyboard users get the
          same affordance as hover users. Focus is not trapped, so{" "}
          <kbd>Tab</kbd> can leave the panel naturally. Pointer down outside the
          popover also dismisses.
        </p>
        <ul>
          <li>
            <kbd>Enter</kbd> / <kbd>Space</kbd>: open the popover when the
            trigger is focused (click-trigger mode)
          </li>
          <li>
            <kbd>Escape</kbd>: close the popover and return focus to the trigger
          </li>
          <li>
            <kbd>Tab</kbd>: move focus through the panel and out the other side
          </li>
        </ul>
      </section>
      <section>
        <h2>With a close chip</h2>
        <p>
          Drop in <code>.popover__close</code> for a corner dismiss affordance;
          the title clears it automatically.
        </p>
        <Demo
          layout="stack"
          html={`
<button class="button button--neutral" data-stisla-popover-trigger="pop-close">What's new</button>
<div class="popover" id="pop-close" data-stisla-popover data-stisla-popover-placement="bottom">
  <button class="popover__close" data-stisla-popover-dismiss aria-label="Dismiss"><i data-lucide="x"></i></button>
  <h3 class="popover__title">Faster exports</h3>
  <p class="popover__body">Exports now stream in the background so you can keep working while they finish.</p>
</div>
`}
        />
      </section>

      <section>
        <h2>Placements</h2>
        <p>
          <code>data-stisla-popover-placement</code> picks the resting side.
          Floating UI flips automatically when the chosen side would overflow
          the viewport.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-wrap items-center justify-center gap-3 pt-2 pb-48">
  <button class="button button--outline button--neutral" data-stisla-popover-trigger="pop-place-top">Top</button>
  <button class="button button--outline button--neutral" data-stisla-popover-trigger="pop-place-right">Right</button>
  <button class="button button--outline button--neutral" data-stisla-popover-trigger="pop-place-bottom">Bottom</button>
  <button class="button button--outline button--neutral" data-stisla-popover-trigger="pop-place-left">Left</button>
  <div class="popover" id="pop-place-top" data-stisla-popover data-stisla-popover-placement="top">
    <h3 class="popover__title">Top</h3>
    <p class="popover__body">Anchors above the trigger.</p>
  </div>
  <div class="popover" id="pop-place-right" data-stisla-popover data-stisla-popover-placement="right">
    <h3 class="popover__title">Right</h3>
    <p class="popover__body">Anchors to the right of the trigger.</p>
  </div>
  <div class="popover" id="pop-place-bottom" data-stisla-popover data-stisla-popover-placement="bottom">
    <h3 class="popover__title">Bottom</h3>
    <p class="popover__body">Anchors below the trigger.</p>
  </div>
  <div class="popover" id="pop-place-left" data-stisla-popover data-stisla-popover-placement="left">
    <h3 class="popover__title">Left</h3>
    <p class="popover__body">Anchors to the left of the trigger.</p>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Hover trigger</h2>
        <p>
          Add <code>data-stisla-popover-trigger-mode="hover focus"</code> to
          open on hover and keyboard focus. The 100ms close delay bridges the
          cursor from the trigger into the popover so it stays open while you
          read it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex justify-center pt-2 pb-40">
  <button class="button button--outline button--neutral" data-stisla-popover-trigger="pop-hover">Hover or focus me</button>
  <div class="popover" id="pop-hover" data-stisla-popover data-stisla-popover-trigger-mode="hover focus" data-stisla-popover-placement="bottom">
    <h3 class="popover__title">Read-only</h3>
    <p class="popover__body">Members with the viewer role can browse but not edit shared boards.</p>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Rich content</h2>
        <p>
          Author the body with whatever markup the popover needs. Paragraphs,
          links, buttons, and form bits all work. There's no string-content
          opt-in.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex justify-center pt-2 pb-48">
  <button class="button button--primary" data-stisla-popover-trigger="pop-rich">Invite teammate</button>
  <div class="popover" id="pop-rich" data-stisla-popover data-stisla-popover-placement="bottom-start" style="min-width: 17rem;">
    <h3 class="popover__title">Invite by email</h3>
    <div class="popover__body text-foreground">
      <div class="flex flex-col gap-2">
        <input type="email" class="input" placeholder="name@example.com" aria-label="Email address">
        <div class="flex flex-wrap items-center gap-2 justify-end">
          <button class="button button--sm button--ghost button--neutral" data-stisla-popover-dismiss>Cancel</button>
          <button class="button button--sm button--primary">Send invite</button>
        </div>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Panel</h2>
        <p>
          A <code>.popover__header</code> holds the title with a trailing{" "}
          <code>.popover__action</code>, a list sits in the body, and a{" "}
          <code>.popover__footer</code> closes it out. Add{" "}
          <code>.popover--menu</code> when the body is a list of rows so each{" "}
          <code>.media</code> row carries its own hover and the panel reads like
          a menu. Each row's leading slot takes an icon box or an avatar.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex justify-center pt-2 pb-72">
  <button class="button button--outline button--neutral" data-stisla-popover-trigger="pop-notify">Notifications</button>
  <div class="popover popover--menu" id="pop-notify" data-stisla-popover data-stisla-popover-placement="bottom-end" style="width: 20rem; max-width: 100%;">
    <div class="popover__header">
      <h3 class="popover__title">Notifications</h3>
      <div class="popover__action">
        <a class="link" href="#">Mark all as read</a>
      </div>
    </div>
    <div class="popover__body">
      <a href="#" class="media media--unread items-start">
        <div class="media__figure">
          <span class="icon-box icon-box--primary"><i data-lucide="shopping-cart"></i></span>
        </div>
        <div class="media__content">
          <div class="media__title">New order #10428</div>
          <div class="media__description">Acme Corp placed an order for 12 items.</div>
          <div class="media__meta">5 minutes ago</div>
        </div>
      </a>
      <a href="#" class="media items-start">
        <div class="media__figure">
          <span class="icon-box icon-box--danger"><i data-lucide="alert-triangle"></i></span>
        </div>
        <div class="media__content">
          <div class="media__title">Low stock alert</div>
          <div class="media__description">Headphone Blitz is down to 4 units.</div>
          <div class="media__meta">1 hour ago</div>
        </div>
      </a>
      <a href="#" class="media items-start">
        <div class="media__figure">
          <span class="avatar avatar--sm avatar--circle" data-stisla-avatar>
            <span class="avatar__fallback">PP</span>
          </span>
        </div>
        <div class="media__content">
          <div class="media__title">Priya Patel</div>
          <div class="media__description">Started following your store.</div>
          <div class="media__meta">3 hours ago</div>
        </div>
      </a>
    </div>
    <div class="popover__footer">
      <a href="#" class="button button--block button--outline button--neutral">View all notifications</a>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Imperative</h2>
        <p>
          Reach a marked popover via{" "}
          <code>Stisla.get(document.getElementById('id'))</code> and call{" "}
          <code>Stisla.Popover.getOrCreate(el).open()</code> when you need to
          drive it from script without a click trigger.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-wrap items-center justify-center gap-3 pt-2 pb-40">
  <button class="button button--neutral" data-demo-popover-open="pop-imperative">Open via JS</button>
  <button class="button button--outline button--neutral" data-stisla-popover-trigger="pop-imperative">Anchor</button>
  <div class="popover" id="pop-imperative" data-stisla-popover data-stisla-popover-placement="bottom">
    <h3 class="popover__title">Programmatic</h3>
    <p class="popover__body">Opened by a script, anchored to the marked trigger.</p>
  </div>
  <script>
    document.addEventListener('click', function (e) {
      var openBtn = e.target.closest('[data-demo-popover-open]');
      if (!openBtn || !window.Stisla) return;
      var el = document.getElementById(openBtn.getAttribute('data-demo-popover-open'));
      if (!el) return;
      var inst = window.Stisla.get(el) || new window.Stisla.Popover(el);
      inst.open();
      e.stopImmediatePropagation();
    });
  </script>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Four events fire on the <code>.popover</code> root. The{" "}
          <code>opening</code> and <code>closing</code> events are cancelable.
        </p>
        <p>
          <code>stisla:popover:opening</code> fires before the panel mounts.
          Call <code>preventDefault()</code> to abort.
        </p>
        <p>
          <code>stisla:popover:opened</code> fires once the panel is positioned
          and visible.
        </p>
        <p>
          <code>stisla:popover:closing</code> fires before the panel dismisses.
          Call <code>preventDefault()</code> to keep it open.
        </p>
        <p>
          <code>stisla:popover:closed</code> fires once the panel is fully
          hidden and focus has returned to the trigger.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the panel. Override on the root or any wrapper.
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
                <code>--popover-z-index</code>
              </td>
              <td>Overlay stacking order</td>
            </tr>
            <tr>
              <td>
                <code>--popover-min-width</code> / <code>-max-width</code>
              </td>
              <td>Panel width bounds</td>
            </tr>
            <tr>
              <td>
                <code>--popover-padding-block</code> /{" "}
                <code>-padding-inline</code>
              </td>
              <td>Root padding (plain popover only; a panel drops it)</td>
            </tr>
            <tr>
              <td>
                <code>--popover-color</code> / <code>-bg</code> /{" "}
                <code>-border-color</code>
              </td>
              <td>Panel text, fill, and rim</td>
            </tr>
            <tr>
              <td>
                <code>--popover-radius</code> / <code>-shadow</code>
              </td>
              <td>Panel corner radius and elevation</td>
            </tr>
            <tr>
              <td>
                <code>--popover-title-color</code> / <code>-font-size</code> /{" "}
                <code>-font-weight</code>
              </td>
              <td>Title type</td>
            </tr>
            <tr>
              <td>
                <code>--popover-body-color</code> / <code>-font-size</code> /{" "}
                <code>-line-height</code>
              </td>
              <td>Body type (muted by default)</td>
            </tr>
            <tr>
              <td>
                <code>--popover-header-gap</code> /{" "}
                <code>-header-padding-block</code> /{" "}
                <code>-header-padding-inline</code>
              </td>
              <td>Header row layout</td>
            </tr>
            <tr>
              <td>
                <code>--popover-footer-padding-block</code> /{" "}
                <code>-footer-padding-inline</code>
              </td>
              <td>Footer padding</td>
            </tr>
            <tr>
              <td>
                <code>--popover-close-size</code> / <code>-close-color</code> /{" "}
                <code>-close-bg-hover</code>
              </td>
              <td>Close chip size and paint</td>
            </tr>
            <tr>
              <td>
                <code>--popover-arrow-size</code>
              </td>
              <td>Caret square size</td>
            </tr>
            <tr>
              <td>
                <code>--popover-transition-duration</code>
              </td>
              <td>Fade and slide timing; zeroed under reduced-motion</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
