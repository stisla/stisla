import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/autocomplete")({
  component: AutocompleteDocs,
});

function AutocompleteDocs() {
  return (
    <>
      <header>
        <h1>Autocomplete</h1>
        <p className="lead">
          An input that suggests options as the user types.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Reach for Autocomplete when users type their own value and you want to
          help them along with suggestions. Picking a suggestion replaces the
          typed text with the chosen value. Single value only. For a
          non-typeable picker, use Select. For multi-select with chips, use
          Combobox. The default authoring style is an <code>&lt;input&gt;</code>{" "}
          with <code>list="…"</code> referencing a <code>&lt;datalist&gt;</code>
          . Without JS the browser shows its native datalist UI; with JS, the
          native UI is suppressed and a styled popup takes over.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm pb-20">
  <label for="basicAuto" class="field__label">Country</label>
  <input type="text" class="autocomplete" id="basicAuto" name="country" list="countries" data-stisla-autocomplete placeholder="Search countries">
  <datalist id="countries">
    <option value="Indonesia">
    <option value="Malaysia">
    <option value="Singapore">
    <option value="Philippines">
    <option value="Thailand">
    <option value="Vietnam">
    <option value="Brunei">
    <option value="Cambodia">
    <option value="Laos">
    <option value="Myanmar">
  </datalist>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          The input behaves like a typing field with suggestions layered on top.
        </p>
        <ul>
          <li>
            <kbd>ArrowDown</kbd>: open the popup or move highlight down
          </li>
          <li>
            <kbd>ArrowUp</kbd>: move highlight up
          </li>
          <li>
            <kbd>Enter</kbd>: pick the highlighted suggestion
          </li>
          <li>
            <kbd>Escape</kbd>: close the popup, keep the typed text
          </li>
          <li>
            <kbd>Tab</kbd>: close and move focus to the next field
          </li>
        </ul>
      </section>

      <section>
        <h2>From inline JSON</h2>
        <p>
          For dynamic option sets, drop a JSON array on{" "}
          <code>data-options</code>. Each entry is either a string (value =
          label) or an object with <code>value</code> and <code>label</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm pb-20">
  <label for="jsonAuto" class="field__label">Framework</label>
  <input type="text" class="autocomplete" id="jsonAuto" name="framework" data-stisla-autocomplete placeholder="Search frameworks" data-options='["React", "Vue", "Svelte", "Solid", "Angular", "Lit", "Qwik", "Astro"]'>
</div>`}
        />
      </section>

      <section>
        <h2>Minimum length</h2>
        <p>
          Set <code>data-stisla-autocomplete-min-length</code> to wait for a few
          characters before showing suggestions. Useful for long lists where
          typing a single letter would dump dozens of rows.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm">
  <label for="minLengthAuto" class="field__label">City (min 2 chars)</label>
  <input type="text" class="autocomplete" id="minLengthAuto" data-stisla-autocomplete data-stisla-autocomplete-min-length="2" placeholder="Type at least 2 characters" data-options='["Jakarta", "Jambi", "Bandung", "Bali", "Surabaya", "Semarang", "Medan", "Makassar"]'>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          <code>.autocomplete--sm</code> and <code>.autocomplete--lg</code>{" "}
          retune height, padding, radius, and type around the default.
        </p>
        <Demo
          layout="stack"
          html={`
<input type="text" class="autocomplete autocomplete--sm max-w-sm" data-stisla-autocomplete placeholder="Small" data-options='["Apple", "Banana", "Cherry"]' aria-label="Small autocomplete">
<input type="text" class="autocomplete max-w-sm" data-stisla-autocomplete placeholder="Default" data-options='["Apple", "Banana", "Cherry"]' aria-label="Default autocomplete">
<input type="text" class="autocomplete autocomplete--lg max-w-sm" data-stisla-autocomplete placeholder="Large" data-options='["Apple", "Banana", "Cherry"]' aria-label="Large autocomplete">`}
        />
      </section>

      <section>
        <h2>Disabled</h2>
        <p>
          Add <code>disabled</code> to block interaction and dim the field. The
          popup won't open.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm">
  <label for="disabledAuto" class="field__label">Country</label>
  <input type="text" class="autocomplete" id="disabledAuto" data-stisla-autocomplete disabled placeholder="Search countries" data-options='["Indonesia", "Malaysia"]'>
</div>`}
        />
      </section>

      <section>
        <h2>Invalid</h2>
        <p>
          Set <code>aria-invalid="true"</code> on the input. The field shape
          inherits the form-field invalid handling, so the border paints red.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm">
  <label for="invalidAuto" class="field__label">Country</label>
  <input type="text" class="autocomplete" id="invalidAuto" data-stisla-autocomplete aria-invalid="true" aria-describedby="invalidAutoError" placeholder="Search countries" data-options='["Indonesia", "Malaysia"]'>
  <div id="invalidAutoError" class="field__error">Pick a country to continue.</div>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Listen for <code>stisla:autocomplete:select</code> to react when the
          user picks a suggestion. The input's native <code>input</code> and{" "}
          <code>change</code> events fire too, so existing form code keeps
          working.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-sm">
  <label for="eventAuto" class="field__label">Tag</label>
  <input type="text" class="autocomplete" id="eventAuto" data-stisla-autocomplete placeholder="Pick a tag" data-options='["Bug", "Docs", "Feature", "Performance"]'>
  <div id="eventAutoOut" class="field__description">Current: (none)</div>
</div>
<script>
  (function () {
    var el = document.getElementById('eventAuto');
    var out = document.getElementById('eventAutoOut');
    el.addEventListener('stisla:autocomplete:select', function (e) {
      out.textContent = 'Current: ' + e.detail.value;
    });
  })();
</script>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the autocomplete. The field shares the
          form-field knobs; the popup adds its own.
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
                <code>--autocomplete-height</code>
              </td>
              <td>Field height (the size modifiers retune it)</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-padding-inline</code>
              </td>
              <td>
                Field interior padding; also feeds the concentric item radius
              </td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-font-size</code>
              </td>
              <td>Field and popup type</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-color</code> / <code>-bg</code> /{" "}
                <code>-border-color</code>
              </td>
              <td>Field text, fill, and rim</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-radius</code>
              </td>
              <td>Field and popup corner radius</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-placeholder</code>
              </td>
              <td>Placeholder color</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-popup-border-color</code> /{" "}
                <code>-shadow</code>
              </td>
              <td>Popup rim and elevation</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-item-gap</code>
              </td>
              <td>Gap between popup rows</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-item-min-height</code> /{" "}
                <code>-item-padding-block</code> /{" "}
                <code>-item-padding-inline</code>
              </td>
              <td>Row layout</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-item-bg-hover</code> /{" "}
                <code>-item-color-hover</code>
              </td>
              <td>Hover and keyboard-highlight paint</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-item-color-disabled</code>
              </td>
              <td>Empty-row text</td>
            </tr>
            <tr>
              <td>
                <code>--autocomplete-mark-font-weight</code>
              </td>
              <td>Weight of the matched run</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
