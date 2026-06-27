import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/select")({
  component: SelectDocs,
});

function SelectDocs() {
  return (
    <>
      <header>
        <h1>Select</h1>
        <p className="lead">
          A select styled to match the input — native by default, or a styled
          popup on demand.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.select</code> to a <code>&lt;select&gt;</code> for the
          no-JS baseline: the input field shape plus a themed chevron in the
          inline-end padding well, shared with <code>.input</code> and{" "}
          <code>.textarea</code>. Pair with a label via <code>for</code>/
          <code>id</code>. Add <code>data-stisla-select</code> and the behavior
          layer hides the native control and renders a styled trigger and
          listbox popup (type-to-jump, a single-line multi summary, keyboard
          nav) while the original <code>&lt;select&gt;</code> stays in the DOM
          so form submission and validation work as authored. The two halves of
          this page cover each surface in turn. For typing-ahead search see
          Combobox; for a free-form input that suggests options see
          Autocomplete.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="basicSelect" class="field__label">Country</label>
  <select class="select" id="basicSelect" name="country">
    <option value="" selected>Pick one</option>
    <option value="id">Indonesia</option>
    <option value="my">Malaysia</option>
    <option value="sg">Singapore</option>
    <option value="th">Thailand</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Three sizes match the input scale. Add <code>.select--sm</code> or{" "}
          <code>.select--lg</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-3 max-w-96">
  <select class="select select--sm" aria-label="Small select">
    <option>Small</option><option>One</option><option>Two</option>
  </select>
  <select class="select" aria-label="Default select">
    <option>Default</option><option>One</option><option>Two</option>
  </select>
  <select class="select select--lg" aria-label="Large select">
    <option>Large</option><option>One</option><option>Two</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Option groups</h2>
        <p>
          Wrap related options in <code>&lt;optgroup&gt;</code> to label
          sections in the native dropdown.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="groupedSelect" class="field__label">City</label>
  <select class="select" id="groupedSelect">
    <option value="" selected>Pick a city</option>
    <optgroup label="Indonesia">
      <option value="jkt">Jakarta</option>
      <option value="bdg">Bandung</option>
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
        <h2>Multiple</h2>
        <p>
          A <code>multiple</code> (or <code>size</code> &gt; 1) select opts out
          of the single-line shape: it drops the chevron and renders as a native
          inline list, the same as a textarea grows.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="multiSelect" class="field__label">Tags</label>
  <select class="select" id="multiSelect" multiple size="5">
    <option value="bug">Bug</option>
    <option value="docs" selected>Docs</option>
    <option value="feat" selected>Feature</option>
    <option value="qa">QA</option>
    <option value="perf">Performance</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Size attribute</h2>
        <p>
          A <code>size</code> greater than 1 renders a fixed-height scrolling
          list (no chevron), the same multi-line shape as <code>multiple</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="sizeSelect" class="field__label">Priority</label>
  <select class="select" id="sizeSelect" size="4">
    <option value="low">Low</option>
    <option value="med" selected>Medium</option>
    <option value="high">High</option>
    <option value="urgent">Urgent</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Helper text</h2>
        <p>
          Pair a <code>.field__description</code> with the select and wire it
          via <code>aria-describedby</code> so assistive tech announces the
          hint.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="helpSelect" class="field__label">Region</label>
  <select class="select" id="helpSelect" aria-describedby="helpSelectHint">
    <option value="" selected>Pick a region</option>
    <option value="sea">Southeast Asia</option>
    <option value="eu">Europe</option>
    <option value="na">North America</option>
  </select>
  <div id="helpSelectHint" class="field__description">Sets the default data residency for new projects.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Disabled</h2>
        <p>
          Add <code>disabled</code> to block interaction and dim the field.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="disabledSelect" class="field__label">Plan</label>
  <select class="select" id="disabledSelect" disabled>
    <option value="free" selected>Free</option>
    <option value="pro">Pro</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Browser validation</h2>
        <p>
          Pair <code>required</code> with a placeholder{" "}
          <code>&lt;option value=""&gt;</code> and the form blocks submit until
          a real value is picked, painting the native <code>:user-invalid</code>{" "}
          state. Pair with a <code>.field__error</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<form class="field max-w-96" onsubmit="event.preventDefault(); alert('submitted')">
  <label for="reqSelect" class="field__label">Plan</label>
  <select class="select" id="reqSelect" name="plan" required>
    <option value="" selected>Pick a plan</option>
    <option value="free">Free</option>
    <option value="pro">Pro</option>
    <option value="team">Team</option>
  </select>
  <div class="field__description">Hit Submit without picking — the field reports invalid until you choose.</div>
  <button type="submit" class="button button--primary mt-1 self-start">Submit</button>
</form>`}
        />
      </section>

      <section>
        <h2>Server validation</h2>
        <p>
          Set <code>aria-invalid="true"</code> from your form library for sticky
          server errors. The danger border paints; pair with a{" "}
          <code>.field__error</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-96">
  <label for="srvSelect" class="field__label">Plan</label>
  <select class="select" id="srvSelect" aria-invalid="true" aria-describedby="srvSelectError">
    <option value="free">Free</option>
    <option value="pro">Pro</option>
    <option value="team">Team</option>
  </select>
  <div id="srvSelectError" class="field__error">This plan isn't available in your region.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Custom popup</h2>
        <p>
          Add <code>data-stisla-select</code> to a{" "}
          <code>&lt;select class="select"&gt;</code> to hydrate. The native
          control is hidden (still in the DOM, so form submission and validation
          work as authored) and a styled trigger plus a listbox popup take over.
          The trigger reuses the same <code>.select</code> shell, so sizes,
          density, and validation all carry over. Set{" "}
          <code>data-placeholder</code> for the empty-state label.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm pb-20">
  <label for="customSelect" class="field__label">Country</label>
  <select class="select" id="customSelect" name="country" data-stisla-select data-placeholder="Pick one">
    <option value=""></option>
    <option value="id">Indonesia</option>
    <option value="my">Malaysia</option>
    <option value="sg">Singapore</option>
    <option value="ph">Philippines</option>
    <option value="th">Thailand</option>
    <option value="vn">Vietnam</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          The trigger behaves like a native <code>&lt;select&gt;</code>.
        </p>
        <ul>
          <li>
            <kbd>Space</kbd> / <kbd>Enter</kbd> / <kbd>ArrowDown</kbd>: open
          </li>
          <li>
            <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd>: move the highlight (loops
            at the ends)
          </li>
          <li>
            <kbd>Home</kbd> / <kbd>End</kbd>: first / last enabled option
          </li>
          <li>
            <kbd>Enter</kbd> / <kbd>Space</kbd>: select the highlighted option
            (toggles in multi)
          </li>
          <li>
            <kbd>Escape</kbd>: close
          </li>
          <li>
            <kbd>Tab</kbd>: close and move on
          </li>
          <li>
            Type a letter to jump to the first option that starts with it (keep
            typing within 500&nbsp;ms to extend the buffer)
          </li>
        </ul>
      </section>

      <section>
        <h2>Multiple</h2>
        <p>
          Add the native <code>multiple</code> attribute and the trigger shows
          the first chosen label plus <code>+N more</code> so the field stays on
          one line. Click a selected option in the popup to toggle it off.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm pb-20">
  <label for="customMulti" class="field__label">Tags</label>
  <select class="select" id="customMulti" name="tags" multiple data-stisla-select data-placeholder="Add tags">
    <option value="bug">Bug</option>
    <option value="docs" selected>Docs</option>
    <option value="feat" selected>Feature</option>
    <option value="qa">QA</option>
    <option value="perf">Performance</option>
    <option value="a11y">Accessibility</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Option groups</h2>
        <p>
          Wrap related options in <code>&lt;optgroup&gt;</code> to label
          sections inside the popup.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm pb-20">
  <label for="customGroups" class="field__label">City</label>
  <select class="select" id="customGroups" data-stisla-select data-placeholder="Pick a city">
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
        <h2>Disabled and invalid</h2>
        <p>
          <code>disabled</code> on the source dims the trigger and blocks
          opening; <code>aria-invalid="true"</code> paints the danger border.
          Both states mirror from the hidden source onto the trigger, so a form
          library keeps treating the <code>&lt;select&gt;</code> as the field.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm">
  <label for="customDisabled" class="field__label">Plan</label>
  <select class="select" id="customDisabled" data-stisla-select disabled>
    <option value="free" selected>Free</option>
    <option value="pro">Pro</option>
  </select>
</div>
<div class="field max-w-sm">
  <label for="customInvalid" class="field__label">Region</label>
  <select class="select" id="customInvalid" data-stisla-select aria-invalid="true" aria-describedby="customInvalidErr">
    <option value="sea" selected>Southeast Asia</option>
    <option value="eu">Europe</option>
  </select>
  <div id="customInvalidErr" class="field__error">Not available on your plan.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Listen for <code>stisla:select:change</code> to react to selection
          changes; <code>detail.value</code> is a string for single and an array
          for multi. The underlying <code>&lt;select&gt;</code> also fires its
          native <code>change</code> event, so existing form code keeps working.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm">
  <label for="eventSelect" class="field__label">Theme</label>
  <select class="select" id="eventSelect" data-stisla-select>
    <option value="light" selected>Light</option>
    <option value="dark">Dark</option>
    <option value="auto">Auto</option>
  </select>
  <div id="eventSelectOut" class="field__description">Current: light</div>
</div>
<script>
  (function () {
    var el = document.getElementById('eventSelect');
    var out = document.getElementById('eventSelectOut');
    el.addEventListener('stisla:select:change', function (e) { out.textContent = 'Current: ' + e.detail.value; });
  })();
</script>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.select</code> without touching component
          CSS, under the same field surface as <code>.input</code> /{" "}
          <code>.textarea</code>. Override on the select, a parent scope, or{" "}
          <code>:root</code>. The custom popup adds its own{" "}
          <code>--select-*</code> variables on the shared menu surface (Menu,
          Combobox, Autocomplete).
        </p>
        <p>
          On touch devices (<code>@media (pointer: coarse)</code>){" "}
          <code>--select-font-size</code> is bumped to <code>1rem</code> so iOS
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
                <code>--select-radius</code>
              </td>
              <td>Corner radius; the sm and lg variants reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--select-height</code>
              </td>
              <td>Single-line height; the sm and lg variants reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--select-padding-inline</code>
              </td>
              <td>Horizontal padding; the sm and lg variants reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--select-padding-block</code>
              </td>
              <td>
                Vertical padding; defaults to <code>0</code> (height owns the
                rhythm)
              </td>
            </tr>
            <tr>
              <td>
                <code>--select-font-size</code>
              </td>
              <td>Text size; the sm and lg variants reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--select-indicator</code>
              </td>
              <td>
                Chevron SVG; a <code>data:</code> URL with a literal stroke per
                theme (the dark scope swaps to a lighter chevron)
              </td>
            </tr>
            <tr>
              <td>
                <code>--select-bg</code>
              </td>
              <td>
                Background; <code>readonly</code> shifts a tier
              </td>
            </tr>
            <tr>
              <td>
                <code>--select-color</code>
              </td>
              <td>Text color</td>
            </tr>
            <tr>
              <td>
                <code>--select-border-width</code>
              </td>
              <td>Border thickness</td>
            </tr>
            <tr>
              <td>
                <code>--select-border-color</code>
              </td>
              <td>
                Border color; validation hooks flip this to the danger token
              </td>
            </tr>
            <tr>
              <td>
                <code>--select-shadow</code>
              </td>
              <td>Custom popup elevation</td>
            </tr>
            <tr>
              <td>
                <code>--select-popup-border-color</code>
              </td>
              <td>
                Popup rim (defaults a tier lighter than the trigger border)
              </td>
            </tr>
            <tr>
              <td>
                <code>--select-item-min-height</code> /{" "}
                <code>-item-padding-block</code> /{" "}
                <code>-item-padding-inline</code>
              </td>
              <td>Option row layout</td>
            </tr>
            <tr>
              <td>
                <code>--select-item-bg-hover</code> /{" "}
                <code>-item-color-hover</code>
              </td>
              <td>Highlighted row paint (mouse hover and keyboard cursor)</td>
            </tr>
            <tr>
              <td>
                <code>--select-item-bg-active</code> /{" "}
                <code>-item-color-active</code>
              </td>
              <td>Selected row paint</td>
            </tr>
            <tr>
              <td>
                <code>--select-group-label-color</code>
              </td>
              <td>Optgroup label color inside the popup</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
