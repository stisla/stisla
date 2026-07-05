import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/collapsible")({
  component: CollapsibleDocs,
});

function CollapsibleDocs() {
  return (
    <>
      <header>
        <h1>Collapsible</h1>
        <p className="lead">A region that opens and closes from a trigger.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          The primitive that <code>.accordion</code>, <code>.sidebar</code>{" "}
          submenus, and <code>.navbar</code> mobile menu compose for their own
          collapse behavior. A trigger button and a content region tied by id.
          The trigger points at the region via{" "}
          <code>data-stisla-collapsible-trigger</code>; the region carries{" "}
          <code>data-stisla-collapsible</code> and{" "}
          <code>data-state="open"</code> or <code>"closed"</code> driving the
          paint. The height transition runs around every state flip.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col items-center">
  <button type="button" class="button button--neutral" data-stisla-collapsible-trigger="collapsible-basic" aria-controls="collapsible-basic" aria-expanded="false">Toggle details</button>
  <div id="collapsible-basic" class="collapsible" data-stisla-collapsible data-state="closed" role="region">
    <div class="rounded-md border border-border bg-(--color-surface) p-4 mt-2">A collapsible is a region whose visibility flips between open and closed. The state lives on the element itself; the height transition runs around the flip so the panel does not jump.</div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          The trigger is whatever element you wire to the region. The
          collapsible itself adds no key bindings beyond the trigger's native
          ones. When the trigger is a native <code>&lt;button&gt;</code>, the
          browser handles focus and activation.
        </p>
        <ul>
          <li>
            <kbd>Tab</kbd>: focus the trigger
          </li>
          <li>
            <kbd>Enter</kbd> / <kbd>Space</kbd>: toggle the panel
          </li>
        </ul>
      </section>

      <section>
        <h2>Open by default</h2>
        <p>
          Render the region with <code>data-state="open"</code> to start open.
          The trigger's <code>aria-expanded</code> follows on construction.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col items-center">
  <button type="button" class="button button--neutral" data-stisla-collapsible-trigger="collapsible-open" aria-controls="collapsible-open" aria-expanded="true">Toggle details</button>
  <div id="collapsible-open" class="collapsible" data-stisla-collapsible data-state="open" role="region">
    <div class="rounded-md border border-border bg-(--color-surface) p-4 mt-2">This region started open. Click the trigger to close it. The opening transition is the same one the trigger fires.</div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Inside a card</h2>
        <p>
          A common shape: a card with extra detail hidden behind a trigger. The
          region's content owns its own surface so the card body doesn't paint
          inside the collapsed footprint.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card max-w-96">
  <div class="card__body">
    <h4 class="card__title">API token</h4>
    <p class="card__text text-muted-foreground">Created two weeks ago. Last used yesterday.</p>
    <div class="mt-3 flex flex-wrap items-center gap-2">
      <button type="button" class="button button--sm button--ghost button--neutral button--flush-start" data-stisla-collapsible-trigger="collapsible-card" aria-controls="collapsible-card" aria-expanded="false">Show permissions</button>
    </div>
    <div id="collapsible-card" class="collapsible" data-stisla-collapsible data-state="closed" role="region">
      <ul class="m-0 text-muted-foreground">
        <li>read:repo</li>
        <li>write:issues</li>
        <li>read:user</li>
      </ul>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Programmatic control</h2>
        <p>
          Build a <code>Stisla.Collapsible</code> directly to drive a region
          from code. The buttons below call <code>open()</code>,{" "}
          <code>close()</code>, and <code>toggle()</code> on an instance from{" "}
          <code>Stisla.Collapsible.getOrCreate(el)</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col items-center">
  <div class="flex flex-wrap items-center gap-2">
    <button type="button" class="button button--sm button--neutral" data-demo-collapsible="open">Open</button>
    <button type="button" class="button button--sm button--neutral" data-demo-collapsible="close">Close</button>
    <button type="button" class="button button--sm button--neutral" data-demo-collapsible="toggle">Toggle</button>
  </div>
  <div id="collapsible-programmatic" class="collapsible" data-stisla-collapsible data-state="closed" role="region">
    <div class="rounded-md border border-border bg-(--color-surface) p-4 mt-2">This region is opened and closed by the buttons above through the imperative API.</div>
  </div>
</div>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('collapsible-programmatic');
    if (!el || !window.Stisla) return;
    var inst = window.Stisla.Collapsible.getOrCreate(el);
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-demo-collapsible]');
      if (!btn) return;
      var action = btn.dataset.demoCollapsible;
      if (action === 'open') inst.open();
      else if (action === 'close') inst.close();
      else if (action === 'toggle') inst.toggle();
    });
  });
</script>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Four events bubble from the region element. The <code>opening</code>{" "}
          and <code>closing</code> events are cancelable.
        </p>
        <p>
          <code>stisla:collapsible:opening</code> fires before the open
          transition starts. Call <code>preventDefault()</code> to abort.
        </p>
        <p>
          <code>stisla:collapsible:opened</code> fires after the open transition
          ends.
        </p>
        <p>
          <code>stisla:collapsible:closing</code> fires before the close
          transition starts. Call <code>preventDefault()</code> to keep it open.
        </p>
        <p>
          <code>stisla:collapsible:closed</code> fires after the close
          transition ends.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          One variable retunes the animation. Override on the root, a wrapper,
          or a single region.
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
                <code>--collapsible-transition-duration</code>
              </td>
              <td>Height tween timing; zeroed under reduced-motion</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
