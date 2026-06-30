import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/textarea")({
  component: TextareaDocs,
});

function TextareaDocs() {
  return (
    <>
      <header>
        <h1>Textarea</h1>
        <p className="lead">A multi-line text field that grows with its content.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.textarea</code> to any <code>&lt;textarea&gt;</code>. The input's fixed-height
          contract drops, so <code>rows</code> and content drive the height. The resize handle is
          vertical only, so the width tracks the parent.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="basicTextarea" class="field__label">Notes</label>
  <textarea class="textarea" id="basicTextarea" rows="3" placeholder="Anything else we should know?"></textarea>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Three sizes match the input scale so a textarea sits beside an input in the same row. Add{" "}
          <code>.textarea--sm</code> or <code>.textarea--lg</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-3 max-w-96">
  <textarea class="textarea textarea--sm" rows="2" placeholder="Small"></textarea>
  <textarea class="textarea" rows="2" placeholder="Default"></textarea>
  <textarea class="textarea textarea--lg" rows="2" placeholder="Large"></textarea>
</div>`}
        />
      </section>

      <section>
        <h2>Helper text</h2>
        <p>
          Use <code>.field__description</code> below the field for short hints. Wire it to the
          textarea with <code>aria-describedby</code> so screen readers announce it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="bioTextarea" class="field__label">Bio</label>
  <textarea class="textarea" id="bioTextarea" rows="3" aria-describedby="bioHelp"></textarea>
  <div id="bioHelp" class="field__description">A sentence or two. Visible on your public profile.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Browser validation</h2>
        <p>
          Pair native constraint attributes (<code>required</code>, <code>minlength</code>,{" "}
          <code>maxlength</code>) with the <code>:user-invalid</code> pseudo. The browser fires it
          after the user interacts, and clears it once the value satisfies the constraints.
        </p>
        <Demo
          layout="stack"
          html={`
<form class="flex flex-col gap-3 max-w-96" onsubmit="event.preventDefault()">
  <div class="field">
    <label for="reqMessage" class="field__label">Message</label>
    <textarea class="textarea" id="reqMessage" rows="3" required minlength="10" placeholder="At least 10 characters"></textarea>
    <div class="field__description">Submit with fewer than 10 characters to trigger <code>:user-invalid</code>.</div>
  </div>
  <button type="submit" class="button button--primary">Submit</button>
</form>`}
        />
      </section>

      <section>
        <h2>Server validation</h2>
        <p>
          Set <code>aria-invalid="true"</code> from your form library. The attribute is sticky;
          Stisla just paints while it's present. Pair with a <code>.field__error</code> tied via{" "}
          <code>aria-describedby</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="srvFeedback" class="field__label">Feedback</label>
  <textarea class="textarea" id="srvFeedback" rows="3" aria-invalid="true" aria-describedby="srvFeedbackError">Way too short.</textarea>
  <div id="srvFeedbackError" class="field__error">Please write at least 50 characters.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Disabled and readonly</h2>
        <p>
          <code>disabled</code> blocks interaction and dims the field. <code>readonly</code> keeps the
          value selectable for copy but rejects edits; the bg shifts a tier so the state reads.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-3 max-w-96">
  <textarea class="textarea" rows="2" disabled>Disabled</textarea>
  <textarea class="textarea" rows="2" readonly>Readonly</textarea>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.textarea</code> independently of <code>.input</code>.{" "}
          <code>--textarea-height</code> acts as a min-height floor; the field grows past it as
          content fills in.
        </p>
        <p>
          On touch devices (<code>@media (pointer: coarse)</code>) <code>--textarea-font-size</code>{" "}
          is bumped to <code>1rem</code> so iOS Safari doesn't zoom on focus.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--textarea-radius</code></td><td>Corner radius; the sm and lg variants reassign this</td></tr>
            <tr><td><code>--textarea-height</code></td><td>Min-height floor; the field grows past this. The sm and lg variants reassign this</td></tr>
            <tr><td><code>--textarea-padding-inline</code></td><td>Horizontal padding; the sm and lg variants reassign this</td></tr>
            <tr><td><code>--textarea-padding-block</code></td><td>Vertical padding around the text</td></tr>
            <tr><td><code>--textarea-font-size</code></td><td>Text size; the sm and lg variants reassign this</td></tr>
            <tr><td><code>--textarea-line-height</code></td><td>Line height of the wrapped text; defaults to the normal leading scale</td></tr>
            <tr><td><code>--textarea-bg</code></td><td>Background; <code>readonly</code> shifts a tier</td></tr>
            <tr><td><code>--textarea-color</code></td><td>Text color</td></tr>
            <tr><td><code>--textarea-border-width</code></td><td>Border thickness</td></tr>
            <tr><td><code>--textarea-border-color</code></td><td>Border color; validation hooks flip this to the danger token</td></tr>
            <tr><td><code>--textarea-placeholder</code></td><td>Placeholder text color</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
