import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/tabs")({
  component: TabsDocs,
});

function TabsDocs() {
  return (
    <>
      <header>
        <h1>Tabs</h1>
        <p className="lead">A content-panel switcher: the active trigger paints with the highlight over a muted rail.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          State lives in <code>data-state="active|inactive"</code> on triggers and panels. Add{" "}
          <code>data-stisla-tabs</code> to the root and the <code>@stisla/vanilla</code> layer wires
          the ARIA, roving tabindex, and arrow-key navigation from your <code>data-value</code>s. Pair
          each <code>.tabs__trigger</code> with a <code>.tabs__panel</code> by <code>data-value</code>.
          The active trigger rises out of the rail as a pill; only the active panel shows. The demos
          below are live.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="tabs tabs--block" data-stisla-tabs>
  <div class="tabs__list" role="tablist">
    <button class="tabs__trigger" data-state="active" data-value="overview">Overview</button>
    <button class="tabs__trigger" data-state="inactive" data-value="activity">Activity</button>
    <button class="tabs__trigger" data-state="inactive" data-value="settings">Settings</button>
  </div>
  <div class="tabs__panel" data-state="active" data-value="overview"><p>The overview pane gives you the big picture: at-a-glance metrics and recent changes.</p></div>
  <div class="tabs__panel" data-state="inactive" data-value="activity"><p>Activity log lists every recent event in reverse chronological order.</p></div>
  <div class="tabs__panel" data-state="inactive" data-value="settings"><p>Settings content lives here: name, preferences, integrations.</p></div>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          Tabs follow the WAI-ARIA tabs pattern with a roving <code>tabindex</code>. Only the active
          trigger is in the tab order; arrow keys move focus along the list.
        </p>
        <ul>
          <li><kbd>Tab</kbd>: focus the active trigger (or leave the list if a trigger is already focused)</li>
          <li><kbd>ArrowRight</kbd> / <kbd>ArrowLeft</kbd>: move focus through enabled triggers (wraps). <kbd>ArrowDown</kbd> / <kbd>ArrowUp</kbd> in vertical mode.</li>
          <li><kbd>Home</kbd> / <kbd>End</kbd>: focus the first / last enabled trigger</li>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd>: activate the focused trigger (only needed in manual activation mode)</li>
        </ul>
        <p>
          Automatic activation (the default) commits the focused trigger as soon as arrow keys move
          focus. Manual mode decouples them; see the Manual activation section below.
        </p>
      </section>

      <section>
        <h2>With icons</h2>
        <p>
          Drop an <code>&lt;i&gt;</code> next to the label. Icons scale with the trigger's font-size
          (1em).
        </p>
        <Demo
          layout="stack"
          html={`
<div class="tabs tabs--block" data-stisla-tabs>
  <div class="tabs__list" role="tablist">
    <button class="tabs__trigger" data-state="active" data-value="inbox"><i data-lucide="inbox"></i> Inbox</button>
    <button class="tabs__trigger" data-state="inactive" data-value="drafts"><i data-lucide="file-text"></i> Drafts</button>
    <button class="tabs__trigger" data-state="inactive" data-value="sent"><i data-lucide="send"></i> Sent</button>
  </div>
  <div class="tabs__panel" data-state="active" data-value="inbox"><p>3 unread messages.</p></div>
  <div class="tabs__panel" data-state="inactive" data-value="drafts"><p>1 draft saved.</p></div>
  <div class="tabs__panel" data-state="inactive" data-value="sent"><p>Last sent 2 hours ago.</p></div>
</div>`}
        />
      </section>

      <section>
        <h2>Vertical</h2>
        <p>
          Add <code>.tabs--vertical</code> to flip the layout: the rail becomes a column on the
          inline-start side and panels fill the remaining row.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="tabs tabs--vertical tabs--block" data-stisla-tabs>
  <div class="tabs__list" role="tablist">
    <button class="tabs__trigger" data-state="active" data-value="account"><i data-lucide="user"></i> Account</button>
    <button class="tabs__trigger" data-state="inactive" data-value="billing"><i data-lucide="credit-card"></i> Billing</button>
    <button class="tabs__trigger" data-state="inactive" data-value="team"><i data-lucide="users"></i> Team</button>
  </div>
  <div class="tabs__panel" data-state="active" data-value="account"><p>Your account details and profile.</p></div>
  <div class="tabs__panel" data-state="inactive" data-value="billing"><p>Plan, invoices, and payment methods.</p></div>
  <div class="tabs__panel" data-state="inactive" data-value="team"><p>Members and their roles.</p></div>
</div>`}
        />
      </section>

      <section>
        <h2>Disabled trigger</h2>
        <p>
          Add <code>data-disabled</code> (or a native <code>disabled</code> on a button) to fade a
          trigger and block it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="tabs tabs--block" data-stisla-tabs>
  <div class="tabs__list" role="tablist">
    <button class="tabs__trigger" data-state="active" data-value="general">General</button>
    <button class="tabs__trigger" data-state="inactive" data-value="advanced">Advanced</button>
    <button class="tabs__trigger" data-state="inactive" data-value="beta" data-disabled disabled>Beta</button>
  </div>
  <div class="tabs__panel" data-state="active" data-value="general"><p>General settings.</p></div>
  <div class="tabs__panel" data-state="inactive" data-value="advanced"><p>Advanced settings.</p></div>
  <div class="tabs__panel" data-state="inactive" data-value="beta"><p>Beta features (locked).</p></div>
</div>`}
        />
      </section>

      <section>
        <h2>Manual activation</h2>
        <p>
          Set <code>data-stisla-tabs-activation-mode="manual"</code> to decouple focus from selection.
          Arrow keys move focus only; <kbd>Space</kbd> or <kbd>Enter</kbd> commits via native button
          click.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="tabs tabs--block" data-stisla-tabs data-stisla-tabs-activation-mode="manual">
  <div class="tabs__list" role="tablist">
    <button class="tabs__trigger" data-value="one">One</button>
    <button class="tabs__trigger" data-value="two">Two</button>
    <button class="tabs__trigger" data-value="three">Three</button>
  </div>
  <div class="tabs__panel" data-value="one"><p>Pane one. Arrow keys move focus without changing the active panel.</p></div>
  <div class="tabs__panel" data-value="two"><p>Pane two.</p></div>
  <div class="tabs__panel" data-value="three"><p>Pane three.</p></div>
</div>`}
        />
      </section>

      <section>
        <h2>Programmatic control</h2>
        <p>
          Resolve an instance via <code>Stisla.Tabs.getOrCreate(el)</code> and drive it with{" "}
          <code>setValue(value)</code>. The instance fires <code>stisla:tabs:changing</code>{" "}
          (cancelable) and <code>stisla:tabs:changed</code> on every flip.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-3 w-full">
  <div id="tabs-programmatic" class="tabs" data-stisla-tabs>
    <div class="tabs__list" role="tablist">
      <button class="tabs__trigger" data-value="alpha">Alpha</button>
      <button class="tabs__trigger" data-value="beta">Beta</button>
      <button class="tabs__trigger" data-value="gamma">Gamma</button>
    </div>
    <div class="tabs__panel" data-value="alpha"><p>Alpha pane.</p></div>
    <div class="tabs__panel" data-value="beta"><p>Beta pane.</p></div>
    <div class="tabs__panel" data-value="gamma"><p>Gamma pane.</p></div>
  </div>
  <div class="flex flex-wrap items-center gap-2">
    <button type="button" class="button button--outline button--neutral button--sm" data-tabs-demo="alpha">Open Alpha</button>
    <button type="button" class="button button--outline button--neutral button--sm" data-tabs-demo="beta">Open Beta</button>
    <button type="button" class="button button--outline button--neutral button--sm" data-tabs-demo="gamma">Open Gamma</button>
  </div>
  <pre id="tabs-programmatic-log" class="block">Listening for stisla:tabs:changed…</pre>
</div>
<script>
  (function () {
    var root = document.getElementById('tabs-programmatic');
    var log = document.getElementById('tabs-programmatic-log');
    if (!root || !log) return;
    var inst = Stisla.Tabs.getOrCreate(root);
    document.querySelectorAll('[data-tabs-demo]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        inst.setValue(btn.dataset.tabsDemo);
      });
    });
    root.addEventListener('stisla:tabs:changed', function (e) {
      log.textContent = 'changed -> ' + e.detail.value + ' (from ' + e.detail.previousValue + ')';
    });
  })();
</script>`}
        />
      </section>

      <section>
        <h2>External triggers</h2>
        <p>
          Any element on the page can drive a tabs instance declaratively. Carry{" "}
          <code>aria-controls="&lt;tabsRootId&gt;"</code> +{" "}
          <code>data-stisla-tabs-value="&lt;value&gt;"</code> on the trigger; the click delegate flips
          the matching panel without imperative JS. The tabs root needs an explicit <code>id</code> for
          the wire-up.
        </p>
        <p>
          Useful for sidebar links, toolbar buttons, command-palette entries, even a{" "}
          <code>.toggle-group</code> member that doubles as a tab switcher. Native click semantics
          carry, so buttons fire on click + Enter + Space, and anchors fire on click + Enter.
        </p>
        <p>
          The <code>.tabs__list</code> is optional. Drop it entirely and the tabs run on external
          triggers alone. The instance resolves each value against its panels and reflects the active
          state back onto the triggers (<code>data-state="active"</code> +{" "}
          <code>aria-current="page"</code>), so a <code>.sidebar</code> used as a section nav lights its
          own row with no extra script. The active panel still comes from <code>opts.value</code>, an
          existing active trigger/panel, or the first panel.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 w-full">
  <div class="flex flex-wrap items-center gap-2">
    <button type="button" class="button button--outline button--neutral button--sm" aria-controls="tabs-external" data-stisla-tabs-value="overview">Jump to Overview</button>
    <button type="button" class="button button--outline button--neutral button--sm" aria-controls="tabs-external" data-stisla-tabs-value="activity">Jump to Activity</button>
    <button type="button" class="button button--outline button--neutral button--sm" aria-controls="tabs-external" data-stisla-tabs-value="settings">Jump to Settings</button>
  </div>
  <div id="tabs-external" class="tabs" data-stisla-tabs>
    <div class="tabs__list" role="tablist">
      <button class="tabs__trigger" data-value="overview">Overview</button>
      <button class="tabs__trigger" data-value="activity">Activity</button>
      <button class="tabs__trigger" data-value="settings">Settings</button>
    </div>
    <div class="tabs__panel" data-value="overview"><p>Overview pane. Open me from the external buttons above.</p></div>
    <div class="tabs__panel" data-value="activity"><p>Activity pane.</p></div>
    <div class="tabs__panel" data-value="settings"><p>Settings pane.</p></div>
  </div>
</div>`}
        />

        <h3>Without a list</h3>
        <p>
          Drop the <code>.tabs__list</code> entirely and the external triggers become the whole trigger
          set. The instance resolves each value against its panels and writes{" "}
          <code>data-state="active"</code> + <code>aria-current="page"</code> back onto the active
          trigger, so the triggers light themselves with no extra script. Here a{" "}
          <code>.toggle-group</code> of plain toggles (no toggle-group JS) is the nav; the same wiring
          lets a <code>.sidebar</code> drive a settings page. The first panel activates on init.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col items-start gap-3 w-full">
  <div class="toggle-group" role="group" aria-label="Workspace section">
    <button type="button" class="toggle" aria-controls="tabs-listless" data-stisla-tabs-value="general">General</button>
    <button type="button" class="toggle" aria-controls="tabs-listless" data-stisla-tabs-value="members">Members</button>
    <button type="button" class="toggle" aria-controls="tabs-listless" data-stisla-tabs-value="billing">Billing</button>
  </div>
  <div id="tabs-listless" class="tabs" data-stisla-tabs>
    <div class="tabs__panel" data-value="general"><p>General workspace settings.</p></div>
    <div class="tabs__panel" data-value="members"><p>People with access to the workspace.</p></div>
    <div class="tabs__panel" data-value="billing"><p>Plan, payment method, and invoices.</p></div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Two events fire on the tabs root. Both carry <code>value</code> (the new selection) and{" "}
          <code>previousValue</code> (the prior selection) in <code>detail</code>.
        </p>
        <p>
          <code>stisla:tabs:changing</code> fires before the flip and is cancelable. Call{" "}
          <code>preventDefault()</code> on the event to keep the current selection (useful for
          unsaved-changes guards).
        </p>
        <p>
          <code>stisla:tabs:changed</code> fires after the new panel is active. Use it to sync URL hash
          state or persist the last-open tab.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.tabs</code>. Override on the root or any wrapper.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--tabs-gap</code></td><td>Space between the rail and the panel</td></tr>
            <tr><td><code>--tabs-list-height</code></td><td>Rail height (horizontal mode)</td></tr>
            <tr><td><code>--tabs-list-bg</code></td><td>Rail background</td></tr>
            <tr><td><code>--tabs-list-radius</code></td><td>Rail corner radius; triggers derive a concentric inner radius</td></tr>
            <tr><td><code>--tabs-list-padding-block</code> / <code>-padding-inline</code></td><td>Rail interior padding</td></tr>
            <tr><td><code>--tabs-list-gap</code></td><td>Gap between triggers</td></tr>
            <tr><td><code>--tabs-trigger-padding-inline</code></td><td>Trigger horizontal padding</td></tr>
            <tr><td><code>--tabs-trigger-font-size</code> / <code>-font-weight</code></td><td>Trigger label size / weight</td></tr>
            <tr><td><code>--tabs-trigger-color-hover</code></td><td>Hover text color on inactive triggers</td></tr>
            <tr><td><code>--tabs-trigger-bg-active</code> / <code>-color-active</code></td><td>Active trigger fill / text (highlight tier)</td></tr>
            <tr><td><code>--tabs-trigger-border-color-active</code></td><td>Active trigger rim; defaults to the active bg</td></tr>
            <tr><td><code>--tabs-ring</code></td><td>Focus outline color</td></tr>
            <tr><td><code>--tabs-transition-duration</code></td><td>Trigger state change; zeroed under reduced-motion</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
