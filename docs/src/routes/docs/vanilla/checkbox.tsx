import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/checkbox")({
  component: CheckboxDocs,
});

function CheckboxDocs() {
  return (
    <>
      <header>
        <h1>Checkbox</h1>
        <p className="lead">A native checkbox input styled as a small square box.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.checkbox</code> to the input. Wrap each input + label pair in{" "}
          <code>.field__item</code>, and group items inside a <code>.field</code> so the rows pick up
          consistent vertical rhythm. See Radio for the round single-choice variant and Switch for
          the track-and-thumb.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="defaultCheck" />
    <label class="field__label" for="defaultCheck">Default checkbox</label>
  </div>
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="checkedCheck" checked />
    <label class="field__label" for="checkedCheck">Checked by default</label>
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
    <input class="checkbox" type="checkbox" id="inlineCheck1" />
    <label class="field__label" for="inlineCheck1">One</label>
  </div>
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="inlineCheck2" />
    <label class="field__label" for="inlineCheck2">Two</label>
  </div>
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="inlineCheck3" />
    <label class="field__label" for="inlineCheck3">Three</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Indeterminate</h2>
        <p>
          The indeterminate state is set from script; there's no HTML attribute for it. Useful as a
          parent of a partially-selected group.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="indeterminateCheck" />
    <label class="field__label" for="indeterminateCheck">Select all</label>
  </div>
</div>
<script>document.getElementById('indeterminateCheck').indeterminate = true;</script>`}
        />
      </section>

      <section>
        <h2>Reverse</h2>
        <p>
          Add <code>.field__item--reverse</code> to flip the label to the start and the input to the
          end. Useful for settings rows where the affordance sits on the right edge.
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item field__item--reverse">
    <input class="checkbox" type="checkbox" id="reverseCheck" />
    <label class="field__label" for="reverseCheck">Reversed checkbox</label>
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
    <input class="checkbox" type="checkbox" id="disabledCheck" disabled />
    <label class="field__label" for="disabledCheck">Disabled checkbox</label>
  </div>
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="disabledCheckedCheck" checked disabled />
    <label class="field__label" for="disabledCheckedCheck">Disabled, checked</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Browser validation</h2>
        <p>
          Pair <code>required</code> with the native <code>:user-invalid</code> pseudo. The browser
          fires it after a submit attempt, and clears it the moment the constraint is satisfied.
        </p>
        <Demo
          html={`
<form class="flex flex-col gap-3 max-w-96" onsubmit="event.preventDefault()">
  <div class="field">
    <div class="field__item">
      <input class="checkbox" type="checkbox" id="reqTerms" required />
      <label class="field__label" for="reqTerms">Accept the terms</label>
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
          Stisla just paints the red while it's present. The checked variant shows both signals at
          once: primary fill says "selected", red rim says "the server still considers it invalid".
        </p>
        <Demo
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="srvTerms" aria-invalid="true" />
    <label class="field__label" for="srvTerms">Accept the terms</label>
  </div>
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="srvTermsChecked" aria-invalid="true" checked />
    <label class="field__label" for="srvTermsChecked">Accept the terms (checked, still flagged)</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Without labels</h2>
        <p>
          Drop the <code>.field__item</code> wrapper for a bare <code>.checkbox</code>. Always pair
          with an <code>aria-label</code>. Common in tables (row-select) and toolbars.
        </p>
        <Demo
          html={`
<input class="checkbox" type="checkbox" aria-label="Bare checkbox" />
<input class="checkbox" type="checkbox" aria-label="Bare checkbox, checked" checked />`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.checkbox</code> without touching component CSS. Override on
          the input, a parent scope, or <code>:root</code>.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--checkbox-size</code></td><td>Box dimension</td></tr>
            <tr><td><code>--checkbox-radius</code></td><td>Corner radius; raise to round or zero out for sharp edges</td></tr>
            <tr><td><code>--checkbox-bg</code></td><td>Unchecked background</td></tr>
            <tr><td><code>--checkbox-border-width</code></td><td>Border thickness</td></tr>
            <tr><td><code>--checkbox-border-color</code></td><td>Unchecked border; validation hooks flip this to the danger token</td></tr>
            <tr><td><code>--checkbox-bg-checked</code></td><td>Checked or indeterminate background</td></tr>
            <tr><td><code>--checkbox-indicator</code></td><td>Glyph SVG painted over the checked fill. Checked and indeterminate each set their own; the fill is a literal because <code>data:</code> URLs can't read CSS vars, so recolor by replacing the URL</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
