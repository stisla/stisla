import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/field")({
  component: FieldDocs,
});

function FieldDocs() {
  return (
    <>
      <header>
        <h1>Field</h1>
        <p className="lead">
          A wrapper that groups a label, control, and helper text under one
          root.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Wrap a label + control pair in <code>.field</code>. The root is a
          vertical flex column with a small gap, so the label, control, and any
          helper text stack with a consistent rhythm. The field doesn't manage
          state; consumers wire <code>for</code>/<code>id</code> and{" "}
          <code>aria-describedby</code> to the control inside.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="fieldBasicEmail" class="field__label">Email</label>
  <input type="email" class="input" id="fieldBasicEmail" placeholder="you@example.com" />
</div>`}
        />
      </section>

      <section>
        <h2>Description</h2>
        <p>
          Add <code>.field__description</code> below the control for a short
          hint. Pair with <code>aria-describedby</code> on the control so screen
          readers announce it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="fieldDescPwd" class="field__label">Password</label>
  <input type="password" class="input" id="fieldDescPwd" aria-describedby="fieldDescPwdHelp" />
  <p id="fieldDescPwdHelp" class="field__description">At least 12 characters. Mix letters, numbers, and a symbol.</p>
</div>`}
        />
      </section>

      <section>
        <h2>Error</h2>
        <p>
          Add <code>.field__error</code> to surface a validation error. Pair
          with <code>aria-invalid="true"</code> on the control and tie the error
          to it via <code>aria-describedby</code>; the field paints the message
          in danger tone and the control inherits its own invalid border
          treatment.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="fieldErrEmail" class="field__label">Email</label>
  <input type="email" class="input" id="fieldErrEmail" value="not-an-email" aria-invalid="true" aria-describedby="fieldErrEmailMsg" />
  <p id="fieldErrEmailMsg" class="field__error">Please enter a valid email address.</p>
</div>`}
        />
      </section>

      <section>
        <h2>Works with every control</h2>
        <p>
          The wrapper is type-agnostic. Drop in a select, textarea, slider, or
          any other form control and the stack stays the same.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 max-w-96">
  <div class="field">
    <label for="fieldSelPlan" class="field__label">Plan</label>
    <select class="select" id="fieldSelPlan">
      <option selected>Pick a plan</option>
      <option value="free">Free</option>
      <option value="pro">Pro</option>
      <option value="team">Team</option>
    </select>
  </div>
  <div class="field">
    <label for="fieldTxtBio" class="field__label">Bio</label>
    <textarea class="textarea" id="fieldTxtBio" rows="3" aria-describedby="fieldTxtBioHelp"></textarea>
    <p id="fieldTxtBioHelp" class="field__description">A sentence or two. Visible on your public profile.</p>
  </div>
  <div class="field">
    <label for="fieldRange" class="field__label">Brightness</label>
    <div class="slider" id="fieldRange" data-stisla-slider data-value="40">
      <div class="slider__track"><div class="slider__range"></div></div>
      <div class="slider__thumb"></div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Inline label and value</h2>
        <p>
          The first child of <code>.field</code> doesn't have to be a bare
          label. Drop in a row that pairs the label with a side-by-side readout
          (a slider value, a character counter, a unit) and the stack still
          flows.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <div class="flex flex-wrap justify-between items-baseline">
    <label for="fieldOpacity" class="field__label">Opacity</label>
    <output for="fieldOpacity" class="text-muted-foreground">30</output>
  </div>
  <div class="slider" id="fieldOpacity" data-stisla-slider data-value="30">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
  </div>
</div>
<script>
  (function () {
    var el = document.getElementById('fieldOpacity');
    var out = el.closest('.field').querySelector('output');
    el.addEventListener('stisla:slider:input', function (e) { out.value = e.detail.value; });
  })();
</script>`}
        />
      </section>

      <section>
        <h2>Item</h2>
        <p>
          For input + label pairs that sit on one line (checkbox, radio,
          settings row), use <code>.field__item</code>: a flex row with a small
          gap and centered alignment. Inside an item, <code>.field__label</code>{" "}
          picks up the row typography (regular weight, clickable). The checkbox
          styling itself lands in a later batch; the row layout holds now.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="fieldItem1" />
    <label class="field__label" for="fieldItem1">Email me about updates</label>
  </div>
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="fieldItem2" checked />
    <label class="field__label" for="fieldItem2">Email me about security alerts</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Item, inline</h2>
        <p>
          Add <code>.field--inline</code> on the field root to lay items on one
          row with wrap. The modifier flips the root to a flex row and bumps the
          gap so neighbors don't crowd.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field field--inline w-auto">
  <div class="field__item">
    <input class="radio" type="radio" name="fieldItemInline" id="fieldItemInline1" checked />
    <label class="field__label" for="fieldItemInline1">Daily</label>
  </div>
  <div class="field__item">
    <input class="radio" type="radio" name="fieldItemInline" id="fieldItemInline2" />
    <label class="field__label" for="fieldItemInline2">Weekly</label>
  </div>
  <div class="field__item">
    <input class="radio" type="radio" name="fieldItemInline" id="fieldItemInline3" />
    <label class="field__label" for="fieldItemInline3">Never</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Item, reverse</h2>
        <p>
          Add <code>.field__item--reverse</code> to flip the label to the start
          and the input to the end. The input pins to the right edge, the common
          pattern for settings rows.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item field__item--reverse">
    <input class="checkbox" type="checkbox" id="fieldItemReverse1" checked />
    <label class="field__label" for="fieldItemReverse1">Show secondary nav</label>
  </div>
  <div class="field__item field__item--reverse">
    <input class="checkbox" type="checkbox" id="fieldItemReverse2" />
    <label class="field__label" for="fieldItemReverse2">Compact density</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Item, disabled</h2>
        <p>
          When the input inside an item is disabled, the row dims its label and
          shows a <code>not-allowed</code> cursor on hover. The{" "}
          <code>:has()</code> selector covers <code>.checkbox</code>,{" "}
          <code>.radio</code>, and <code>.switch</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field w-auto max-w-96">
  <div class="field__item">
    <input class="checkbox" type="checkbox" id="fieldItemDisabled1" disabled />
    <label class="field__label" for="fieldItemDisabled1">Disabled checkbox</label>
  </div>
  <div class="field__item">
    <input class="radio" type="radio" id="fieldItemDisabled2" disabled />
    <label class="field__label" for="fieldItemDisabled2">Disabled radio</label>
  </div>
  <div class="field__item">
    <input class="switch" type="checkbox" role="switch" id="fieldItemDisabled3" disabled />
    <label class="field__label" for="fieldItemDisabled3">Disabled switch</label>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.field</code> and its parts without
          touching component CSS. Override on the field, a parent scope, or{" "}
          <code>:root</code>.
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
                <code>--field-gap</code>
              </td>
              <td>Vertical gap between label, control, and helper text</td>
            </tr>
            <tr>
              <td>
                <code>--field-label-font-size</code>
              </td>
              <td>Label text size</td>
            </tr>
            <tr>
              <td>
                <code>--field-label-font-weight</code>
              </td>
              <td>Label weight when stacked above a control</td>
            </tr>
            <tr>
              <td>
                <code>--field-label-color</code>
              </td>
              <td>Label color</td>
            </tr>
            <tr>
              <td>
                <code>--field-helper-font-size</code>
              </td>
              <td>Description and error text size</td>
            </tr>
            <tr>
              <td>
                <code>--field-helper-color</code>
              </td>
              <td>Description color</td>
            </tr>
            <tr>
              <td>
                <code>--field-error-color</code>
              </td>
              <td>Error message color</td>
            </tr>
            <tr>
              <td>
                <code>--field-item-gap</code>
              </td>
              <td>Horizontal gap between input and label inside an item</td>
            </tr>
            <tr>
              <td>
                <code>--field-item-padding-block</code>
              </td>
              <td>Vertical breathing room around an item row</td>
            </tr>
            <tr>
              <td>
                <code>--field-item-label-font-weight</code>
              </td>
              <td>Label weight when nested inside an item</td>
            </tr>
            <tr>
              <td>
                <code>--field-item-disabled-opacity</code>
              </td>
              <td>Label dim when the input inside an item is disabled</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
