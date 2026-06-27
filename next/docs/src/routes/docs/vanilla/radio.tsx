import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/radio")({
  component: RadioDocs,
});

function RadioDocs() {
  return (
    <>
      <header>
        <h1>Radio</h1>
        <p className="lead">A native radio input styled as a small round dot.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.radio</code> to the input. Wrap each input + label pair in{" "}
          <code>.field__item</code> inside a <code>.field</code>, and give every radio in the group a
          shared <code>name</code> so the browser handles single-selection.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="radio" type="radio" name="defaultRadio" id="defaultRadio1" checked />
    <label class="field__label" for="defaultRadio1">First option</label>
  </div>
  <div class="field__item">
    <input class="radio" type="radio" name="defaultRadio" id="defaultRadio2" />
    <label class="field__label" for="defaultRadio2">Second option</label>
  </div>
  <div class="field__item">
    <input class="radio" type="radio" name="defaultRadio" id="defaultRadio3" />
    <label class="field__label" for="defaultRadio3">Third option</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Inline</h2>
        <p>
          Add <code>.field--inline</code> on the field root to lay items on one row with wrap.
        </p>
        <Demo
          html={`
<div class="field field--inline w-auto">
  <div class="field__item">
    <input class="radio" type="radio" name="inlineRadio" id="inlineRadio1" checked />
    <label class="field__label" for="inlineRadio1">One</label>
  </div>
  <div class="field__item">
    <input class="radio" type="radio" name="inlineRadio" id="inlineRadio2" />
    <label class="field__label" for="inlineRadio2">Two</label>
  </div>
  <div class="field__item">
    <input class="radio" type="radio" name="inlineRadio" id="inlineRadio3" />
    <label class="field__label" for="inlineRadio3">Three</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Reverse</h2>
        <p>
          Add <code>.field__item--reverse</code> to flip the label to the start and the input to the
          end.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item field__item--reverse">
    <input class="radio" type="radio" name="reverseRadio" id="reverseRadio" checked />
    <label class="field__label" for="reverseRadio">Reversed radio</label>
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
    <input class="radio" type="radio" name="disabledRadio" id="disabledRadio1" disabled />
    <label class="field__label" for="disabledRadio1">Disabled radio</label>
  </div>
  <div class="field__item">
    <input class="radio" type="radio" name="disabledRadio" id="disabledRadio2" checked disabled />
    <label class="field__label" for="disabledRadio2">Disabled, selected</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Browser validation</h2>
        <p>
          Pair <code>required</code> on any radio in the group with <code>:user-invalid</code>. The
          browser fires it after a submit attempt, and clears it once any radio in the group is
          selected.
        </p>
        <Demo
          html={`
<form class="flex flex-col gap-3 max-w-96" onsubmit="event.preventDefault()">
  <div class="field">
    <div class="field__item">
      <input class="radio" type="radio" name="reqPlan" id="reqPlanBasic" required />
      <label class="field__label" for="reqPlanBasic">Basic plan</label>
    </div>
    <div class="field__item">
      <input class="radio" type="radio" name="reqPlan" id="reqPlanPro" required />
      <label class="field__label" for="reqPlanPro">Pro plan</label>
    </div>
  </div>
  <button type="submit" class="button button--primary self-start">Submit</button>
</form>`}
        />
      </section>

      <section>
        <h2>Server validation</h2>
        <p>
          Set <code>aria-invalid="true"</code> from your form library. The attribute is sticky;
          Stisla just paints the red while it's present. The selected variant shows both signals at
          once.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="radio" type="radio" name="srvPlan" id="srvPlanBasic" aria-invalid="true" />
    <label class="field__label" for="srvPlanBasic">Basic plan</label>
  </div>
  <div class="field__item">
    <input class="radio" type="radio" name="srvPlan" id="srvPlanPro" aria-invalid="true" checked />
    <label class="field__label" for="srvPlanPro">Pro plan (selected, still flagged)</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Without labels</h2>
        <p>
          Drop the <code>.field__item</code> wrapper for a bare <code>.radio</code>. Always pair with
          an <code>aria-label</code>.
        </p>
        <Demo
          html={`
<input class="radio" type="radio" name="bareRadio" aria-label="Bare radio" />
<input class="radio" type="radio" name="bareRadio" aria-label="Bare radio, selected" checked />`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.radio</code> without touching component CSS. Override on the
          input, a parent scope, or <code>:root</code>.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--radio-size</code></td><td>Dot diameter</td></tr>
            <tr><td><code>--radio-bg</code></td><td>Unchecked background</td></tr>
            <tr><td><code>--radio-border-width</code></td><td>Border thickness</td></tr>
            <tr><td><code>--radio-border-color</code></td><td>Unchecked border; validation hooks flip this to the danger token</td></tr>
            <tr><td><code>--radio-bg-checked</code></td><td>Selected background</td></tr>
            <tr><td><code>--radio-indicator</code></td><td>Dot SVG painted over the selected fill; the fill is a literal because <code>data:</code> URLs can't read CSS vars, so recolor by replacing the URL</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
