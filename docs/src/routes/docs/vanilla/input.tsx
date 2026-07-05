import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/input")({
  component: InputDocs,
});

function InputDocs() {
  return (
    <>
      <header>
        <h1>Input</h1>
        <p className="lead">A text-like form field for any input.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.input</code> to any <code>&lt;input&gt;</code>. Pair with a{" "}
          <code>&lt;label&gt;</code> tied via <code>for</code>/<code>id</code>.
          The same shape extends to Select and Textarea so they line up in a
          form row.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="basicInput" class="field__label">Email</label>
  <input type="email" class="input" id="basicInput" placeholder="you@example.com" />
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Three sizes match the button scale. Add <code>.input--sm</code> or{" "}
          <code>.input--lg</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<input type="text" class="input input--sm max-w-sm" placeholder="Small" />
<input type="text" class="input max-w-sm" placeholder="Default" />
<input type="text" class="input input--lg max-w-sm" placeholder="Large" />`}
        />
      </section>

      <section>
        <h2>Input types</h2>
        <p>
          The class applies to every text-like input: <code>text</code>,{" "}
          <code>email</code>, <code>password</code>, <code>number</code>,{" "}
          <code>search</code>, <code>tel</code>, <code>url</code>,{" "}
          <code>date</code>, <code>time</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<input type="email" class="input max-w-sm" placeholder="email" />
<input type="password" class="input max-w-sm" placeholder="password" value="hunter2" />
<input type="number" class="input max-w-sm" placeholder="number" />
<input type="search" class="input max-w-sm" placeholder="search" />
<input type="date" class="input max-w-sm" />`}
        />
      </section>

      <section>
        <h2>Helper text</h2>
        <p>
          Use <code>.field__description</code> below the input for short hints.
          Wire it to the input with <code>aria-describedby</code> so screen
          readers announce it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="pwdInput" class="field__label">Password</label>
  <input type="password" class="input" id="pwdInput" aria-describedby="pwdHelp" />
  <div id="pwdHelp" class="field__description">At least 8 characters, one number.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Browser validation</h2>
        <p>
          Pair native constraint attributes (<code>required</code>,{" "}
          <code>type="email"</code>, <code>pattern</code>) with the{" "}
          <code>:user-invalid</code> pseudo. The browser fires it after the user
          interacts, and clears it the moment the value satisfies the
          constraints.
        </p>
        <Demo
          layout="stack"
          html={`
<form class="flex flex-col gap-3 max-w-96" onsubmit="event.preventDefault()">
  <div class="field">
    <label for="reqEmail" class="field__label">Email</label>
    <input type="email" class="input" id="reqEmail" required placeholder="you@example.com" />
    <div class="field__description">Submit to trigger <code>:user-invalid</code>. A valid email clears the red.</div>
  </div>
  <button type="submit" class="button button--primary">Submit</button>
</form>`}
        />
      </section>

      <section>
        <h2>Server validation</h2>
        <p>
          Set <code>aria-invalid="true"</code> from your form library. The
          attribute is sticky; Stisla just paints while it's present. Pair with
          a <code>.field__error</code> tied via <code>aria-describedby</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="srvEmail" class="field__label">Email</label>
  <input type="email" class="input" id="srvEmail" value="not-an-email" aria-invalid="true" aria-describedby="srvEmailError" />
  <div id="srvEmailError" class="field__error">Please enter a valid email address.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Disabled and readonly</h2>
        <p>
          <code>disabled</code> blocks interaction and dims the field.{" "}
          <code>readonly</code> keeps the value selectable for copy but rejects
          edits; the bg shifts a tier to signal it.
        </p>
        <Demo
          layout="stack"
          html={`
<input type="text" class="input max-w-sm" value="Disabled" disabled />
<input type="text" class="input max-w-sm" value="Readonly" readonly />`}
        />
      </section>

      <section>
        <h2>Plain text</h2>
        <p>
          Swap <code>.input</code> for <code>.input--seamless</code> to render
          a readonly value as bare text: no border, no background, but still
          aligned with neighboring inputs. Pair with <code>readonly</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="plainEmail" class="field__label">Email</label>
  <input type="email" readonly class="input--seamless" id="plainEmail" value="you@example.com" />
</div>`}
        />
      </section>

      <section>
        <h2>Color picker</h2>
        <p>
          Add <code>.input</code> to any <code>&lt;input type="color"&gt;</code>
          . The type selector handles the shape, no modifier needed: the field
          collapses to a swatch and the native chip wears the field's inner
          radius.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="brandColor" class="field__label">Brand</label>
  <input type="color" class="input" id="brandColor" value="#3b82f6" />
</div>`}
        />
      </section>

      <section>
        <h2>File input</h2>
        <p>
          The same class styles <code>type="file"</code>. The selector button
          sits as a small inset chip inside the field and the filename trails
          after it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="fileInput" class="field__label">Upload</label>
  <input type="file" class="input" id="fileInput" />
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.input</code> without touching component
          CSS. Override on the field, a parent scope, or <code>:root</code>. The
          same surface appears on <code>.select</code> and{" "}
          <code>.textarea</code> under their own prefix, so each field component
          tunes independently.
        </p>
        <p>
          On touch devices (<code>@media (pointer: coarse)</code>){" "}
          <code>--input-font-size</code> is bumped to <code>1rem</code> so iOS
          Safari doesn't zoom on focus.
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
                <code>--input-radius</code>
              </td>
              <td>Corner radius; the sm and lg variants reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--input-height</code>
              </td>
              <td>Single-line height; the sm and lg variants reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--input-padding-inline</code>
              </td>
              <td>Horizontal padding; the sm and lg variants reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--input-padding-block</code>
              </td>
              <td>
                Vertical padding; defaults to <code>0</code> since the fixed
                height owns the rhythm
              </td>
            </tr>
            <tr>
              <td>
                <code>--input-font-size</code>
              </td>
              <td>Text size; the sm and lg variants reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--input-bg</code>
              </td>
              <td>
                Background; <code>readonly</code> shifts a tier
              </td>
            </tr>
            <tr>
              <td>
                <code>--input-color</code>
              </td>
              <td>Text color</td>
            </tr>
            <tr>
              <td>
                <code>--input-border-width</code>
              </td>
              <td>Border thickness</td>
            </tr>
            <tr>
              <td>
                <code>--input-border-color</code>
              </td>
              <td>
                Border color; validation hooks flip this to the danger token
              </td>
            </tr>
            <tr>
              <td>
                <code>--input-placeholder</code>
              </td>
              <td>Placeholder text color</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
