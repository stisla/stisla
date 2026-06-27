import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/vanilla/combobox")({
  component: ComboboxDocs,
});

function ComboboxDocs() {
  return (
    <>
      <header>
        <h1>Combobox</h1>
        <p className="lead">
          A searchable select that filters its options as you type.
        </p>
      </header>

      <section>
        <h2>Single</h2>
        <p>
          Add <code>data-stisla-combobox</code> and Tom Select hydrates the
          native select into a trigger that holds the chosen value and a search
          input; opening it filters the options as you type and marks the
          selected row and the keyboard cursor.
        </p>
        <Demo
          layout="stack"
          html={`
<select class="combobox max-w-sm" data-stisla-combobox data-placeholder="Choose a framework" aria-label="Framework">
  <option value=""></option>
  <option value="react">React</option>
  <option value="vue">Vue</option>
  <option value="svelte">Svelte</option>
  <option value="solid">Solid</option>
</select>`}
        />
      </section>

      <section>
        <h2>Installation</h2>
        <p>
          Skip this step if you're on the <code>stisla-full</code> bundle — it
          already ships with Combobox. On the core bundle, add two extra lines.
        </p>
        <Code code={`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stisla/css@beta/dist/components/combobox.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@beta/dist/components/combobox.js"></script>`} />
        <Code lang="js" code={`import '@stisla/css/components/combobox';
import '@stisla/vanilla/components/combobox';`} />
        <p>
          Tom Select rides along as a transitive dependency of{" "}
          <code>@stisla/vanilla</code>, so no extra install is needed.
        </p>
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          The trigger behaves like a searchable picker. Focus lands in the
          search input as soon as the popup opens.
        </p>
        <ul>
          <li>
            <kbd>ArrowDown</kbd> / <kbd>ArrowUp</kbd>: move highlight through
            the filtered list
          </li>
          <li>
            <kbd>Enter</kbd>: pick the highlighted option (creates a new tag in
            tagging mode)
          </li>
          <li>
            <kbd>Escape</kbd>: close the popup
          </li>
          <li>
            <kbd>Backspace</kbd>: remove the last chip in multi mode when the
            search input is empty
          </li>
          <li>Type any letter: filter the list</li>
        </ul>
      </section>

      <section>
        <h2>Multiple</h2>
        <p>
          Add the native <code>multiple</code> attribute and each chosen value
          becomes a chip with a remove handle; the trigger grows to fit as chips
          wrap.
        </p>
        <Demo
          layout="stack"
          html={`
<select class="combobox max-w-sm" multiple data-stisla-combobox aria-label="Frameworks">
  <option value="react" selected>React</option>
  <option value="vue" selected>Vue</option>
  <option value="svelte" selected>Svelte</option>
  <option value="solid">Solid</option>
  <option value="angular">Angular</option>
  <option value="qwik">Qwik</option>
</select>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          <code>.combobox--sm</code> and <code>.combobox--lg</code> retune
          height, padding, radius, and type around the default.
        </p>
        <Demo
          layout="stack"
          html={`
<select class="combobox combobox--sm max-w-80" data-stisla-combobox data-placeholder="Small" aria-label="Small"><option value=""></option><option>One</option><option>Two</option></select>
<select class="combobox max-w-80" data-stisla-combobox data-placeholder="Default" aria-label="Default"><option value=""></option><option>One</option><option>Two</option></select>
<select class="combobox combobox--lg max-w-80" data-stisla-combobox data-placeholder="Large" aria-label="Large"><option value=""></option><option>One</option><option>Two</option></select>`}
        />
      </section>

      <section>
        <h2>Tagging</h2>
        <p>
          Set <code>data-stisla-combobox-create="true"</code> to let users add
          values that aren't in the list. The new value lands in the options as
          the user presses Enter.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="combobox-tags" class="field__label">Topics</label>
  <select class="combobox" id="combobox-tags" name="topics" multiple data-stisla-combobox data-stisla-combobox-create="true" data-placeholder="Type and press Enter">
    <option value="design" selected>Design</option>
    <option value="frontend">Frontend</option>
    <option value="backend">Backend</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Option groups</h2>
        <p>
          Wrap related options in <code>&lt;optgroup&gt;</code> to label
          sections inside the popup. Search runs against the option labels; the
          group label is just a header.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field pb-64 max-w-96">
  <label for="combobox-grouped" class="field__label">City</label>
  <select class="combobox" id="combobox-grouped" data-stisla-combobox data-placeholder="Search cities">
    <option value=""></option>
    <optgroup label="Indonesia">
      <option value="jkt">Jakarta</option>
      <option value="bdg">Bandung</option>
      <option value="sby">Surabaya</option>
    </optgroup>
    <optgroup label="Malaysia">
      <option value="kul">Kuala Lumpur</option>
      <option value="pen">Penang</option>
    </optgroup>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Disabled</h2>
        <p>
          Add <code>disabled</code> to block interaction. The wrapper picks up{" "}
          <code>.disabled</code> from Tom Select automatically.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="combobox-disabled" class="field__label">Plan</label>
  <select class="combobox" id="combobox-disabled" data-stisla-combobox disabled>
    <option value="free" selected>Free</option>
    <option value="pro">Pro</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Browser validation</h2>
        <p>
          Native HTML constraints gate form submission as they would on a native{" "}
          <code>&lt;select&gt;</code>. Add <code>required</code> with an empty
          placeholder <code>&lt;option value=""&gt;</code> and the form blocks
          until the user picks a real value. The browser's tooltip is suppressed
          because it would anchor to the hidden source, so render the error text
          with <code>.field__error</code>. The wrapper picks up the danger
          border automatically when constraints fail and clears it once the new
          value is valid.
        </p>
        <Demo
          layout="stack"
          html={`
<form class="flex flex-col gap-3 pb-64 max-w-96" onsubmit="event.preventDefault(); alert('submitted');">
  <div class="field">
    <label for="combobox-req" class="field__label">Plan</label>
    <select class="combobox" id="combobox-req" name="plan" required data-stisla-combobox data-placeholder="Pick a plan">
      <option value=""></option>
      <option value="free">Free</option>
      <option value="pro">Pro</option>
      <option value="team">Team</option>
    </select>
    <div class="field__description">Hit Submit without picking. The wrapper paints invalid and the search input takes focus. Pick any option and the red clears on its own.</div>
  </div>
  <button type="submit" class="button button--primary">Submit</button>
</form>`}
        />
      </section>

      <section>
        <h2>Invalid</h2>
        <p>
          Set <code>aria-invalid="true"</code> on the source{" "}
          <code>&lt;select&gt;</code>. The wrapper picks it up via{" "}
          <code>:has()</code> and paints the danger border.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="combobox-invalid" class="field__label">Plan</label>
  <select class="combobox" id="combobox-invalid" data-stisla-combobox aria-invalid="true" aria-describedby="combobox-invalid-error" data-placeholder="Pick a plan">
    <option value=""></option>
    <option value="free">Free</option>
    <option value="pro">Pro</option>
    <option value="team">Team</option>
  </select>
  <div id="combobox-invalid-error" class="field__error">This plan isn't available in your region.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Listen for <code>stisla:combobox:change</code> to react to selection
          changes. The event's <code>detail.value</code> is a string for single,
          an array for multi.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field pb-64 max-w-96">
  <label for="combobox-event" class="field__label">Tag</label>
  <select class="combobox" id="combobox-event" data-stisla-combobox data-placeholder="Pick a tag">
    <option value=""></option>
    <option value="bug">Bug</option>
    <option value="docs">Docs</option>
    <option value="feat">Feature</option>
  </select>
  <div id="combobox-event-out" class="field__description">Current: (none)</div>
</div>
<script>
  (function () {
    var el = document.getElementById('combobox-event');
    var out = document.getElementById('combobox-event-out');
    el.addEventListener('stisla:combobox:change', function (e) {
      out.textContent = 'Current: ' + (e.detail.value || '(none)');
    });
  })();
</script>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the combobox. The field shares the form-field
          knobs; the dropdown reuses the menu surface.
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
                <code>--combobox-height</code>
              </td>
              <td>Trigger height (the size modifiers retune it)</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-padding-inline</code>
              </td>
              <td>
                Trigger interior padding; also feeds the concentric item radius
              </td>
            </tr>
            <tr>
              <td>
                <code>--combobox-font-size</code>
              </td>
              <td>Trigger and dropdown type</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-color</code> / <code>-bg</code> /{" "}
                <code>-border-color</code>
              </td>
              <td>Trigger text, fill, and rim</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-radius</code>
              </td>
              <td>
                Trigger and dropdown corner radius; chips derive a concentric
                radius
              </td>
            </tr>
            <tr>
              <td>
                <code>--combobox-placeholder</code>
              </td>
              <td>Search placeholder color</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-indicator</code>
              </td>
              <td>Chevron SVG (the dark scope swaps a lighter one)</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-popup-border-color</code> /{" "}
                <code>-shadow</code>
              </td>
              <td>Dropdown rim and elevation</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-item-gap</code>
              </td>
              <td>Gap between dropdown rows</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-item-min-height</code> /{" "}
                <code>-item-padding-block</code> /{" "}
                <code>-item-padding-inline</code>
              </td>
              <td>Row layout</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-item-bg-hover</code> /{" "}
                <code>-item-color-hover</code>
              </td>
              <td>Hover and keyboard-highlight paint (accent)</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-item-bg-active</code> /{" "}
                <code>-item-color-active</code>
              </td>
              <td>Selected-row paint (highlight)</td>
            </tr>
            <tr>
              <td>
                <code>--combobox-item-color-disabled</code>
              </td>
              <td>Disabled / no-results row text</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
