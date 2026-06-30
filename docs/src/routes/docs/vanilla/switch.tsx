import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/switch")({
  component: SwitchDocs,
});

function SwitchDocs() {
  return (
    <>
      <header>
        <h1>Switch</h1>
        <p className="lead">A track-and-thumb toggle for on / off settings.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.switch</code> to an <code>&lt;input type="checkbox" role="switch"&gt;</code>.
          Pair with a label the same way as Checkbox or Radio; <code>role="switch"</code> makes
          assistive tech announce the affordance correctly.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="switch" type="checkbox" role="switch" id="defaultSwitch" />
    <label class="field__label" for="defaultSwitch">Notifications</label>
  </div>
  <div class="field__item">
    <input class="switch" type="checkbox" role="switch" id="checkedSwitch" checked />
    <label class="field__label" for="checkedSwitch">Auto-update</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Large</h2>
        <p>
          Add <code>.switch--lg</code> for a larger variant, suited to standalone settings rows where
          the switch is the row's primary affordance.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="switch switch--lg" type="checkbox" role="switch" id="lgSwitch" />
    <label class="field__label" for="lgSwitch">Notifications</label>
  </div>
  <div class="field__item">
    <input class="switch switch--lg" type="checkbox" role="switch" id="lgSwitchOn" checked />
    <label class="field__label" for="lgSwitchOn">Auto-update</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Settings row</h2>
        <p>
          Push the switch to the row's trailing edge with a plain flex row. The label sits on the
          left as row content; the switch pins right as the affordance.
        </p>
        <Demo
          html={`
<div class="flex flex-col gap-2 w-full max-w-96">
  <div class="flex flex-wrap items-center justify-between">
    <label class="field__label" for="settingEmail">Email notifications</label>
    <input class="switch switch--lg" type="checkbox" role="switch" id="settingEmail" checked />
  </div>
  <div class="flex flex-wrap items-center justify-between">
    <label class="field__label" for="settingPush">Push notifications</label>
    <input class="switch switch--lg" type="checkbox" role="switch" id="settingPush" />
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Disabled</h2>
        <p>
          Add <code>disabled</code> to dim the input and its label, and block interaction.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="switch" type="checkbox" role="switch" id="disabledSwitchOff" disabled />
    <label class="field__label" for="disabledSwitchOff">Disabled off</label>
  </div>
  <div class="field__item">
    <input class="switch" type="checkbox" role="switch" id="disabledSwitchOn" checked disabled />
    <label class="field__label" for="disabledSwitchOn">Disabled on</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Without label</h2>
        <p>
          The <code>.switch</code> input stands on its own. Always pair with an <code>aria-label</code>.
        </p>
        <Demo
          html={`
<input class="switch" type="checkbox" role="switch" aria-label="Bare switch off" />
<input class="switch" type="checkbox" role="switch" aria-label="Bare switch on" checked />`}
        />
      </section>

      <section>
        <h2>Browser validation</h2>
        <p>
          Pair <code>required</code> with the native <code>:user-invalid</code> pseudo. The browser
          fires it after the user interacts with the field, and clears it the moment the switch is
          on. Use for inline validation where the affordance owns its own state.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="switch" type="checkbox" role="switch" id="reqSwitch" required />
    <label class="field__label" for="reqSwitch">Enable two-factor (required)</label>
  </div>
</div>`}
        />
        <p>
          The track looks valid until you interact. Click it once then click away to trigger{" "}
          <code>:user-invalid</code>. Toggle it on and the red clears.
        </p>
      </section>

      <section>
        <h2>Server validation</h2>
        <p>
          Set <code>aria-invalid="true"</code> from your form library. The track fill follows the
          on/off semantic; the border carries the invalid signal, so both compose at once.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="switch" type="checkbox" role="switch" id="srvSwitch" aria-invalid="true" />
    <label class="field__label" for="srvSwitch">Two-factor must be enabled</label>
  </div>
  <div class="field__item">
    <input class="switch" type="checkbox" role="switch" id="srvSwitchOn" aria-invalid="true" checked />
    <label class="field__label" for="srvSwitchOn">Enabled (server still flagged)</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.switch</code> without touching component CSS. Override on the
          switch, a parent scope, or <code>:root</code>.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--switch-track-width</code></td><td>Track width; the lg variant reassigns this</td></tr>
            <tr><td><code>--switch-track-height</code></td><td>Track height</td></tr>
            <tr><td><code>--switch-thumb-size</code></td><td>Thumb diameter</td></tr>
            <tr><td><code>--switch-inset</code></td><td>Visible gap between thumb edge and track edge</td></tr>
            <tr><td><code>--switch-radius</code></td><td>Track corner radius; pill by default, set a smaller value to flatten</td></tr>
            <tr><td><code>--switch-off-bg</code></td><td>Off-state track; a mid-gray that adapts per theme so the white thumb stays readable in both modes</td></tr>
            <tr><td><code>--switch-on-bg</code></td><td>On-state track</td></tr>
            <tr><td><code>--switch-thumb-color</code></td><td>Thumb fill (white literal so it reads on both track states in both themes)</td></tr>
            <tr><td><code>--switch-thumb-paint</code></td><td>Thumb shape; default is a radial-gradient circle, swap to a linear-gradient for a square thumb</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
