import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/toggle-group")({
  component: ToggleGroupDocs,
});

function ToggleGroupDocs() {
  return (
    <>
      <header>
        <h1>Toggle group</h1>
        <p className="lead">A pill container hosting a row of toggles pressed inside its padded interior.</p>
      </header>

      <section>
        <h2>Single-select (segmented)</h2>
        <p>
          The container owns the frame; members go ghost-rest so the cluster reads as one segmented
          control. Click and arrow-key wiring (<code>data-stisla-toggle-group</code>) ships with the
          behavior layer. Use <code>role="radiogroup"</code> on the wrapper and <code>role="radio"</code> +{" "}
          <code>aria-checked</code> on each member; the CSS hook is <code>data-state="active"</code> on
          the current one. The type autodetects from <code>role="radiogroup"</code>.
        </p>
        <Demo
          html={`
<div class="toggle-group" data-stisla-toggle-group role="radiogroup" aria-label="Text alignment">
  <button type="button" class="toggle toggle--icon-only" role="radio" aria-checked="false" aria-label="Align left" data-value="left"><i data-lucide="align-left"></i></button>
  <button type="button" class="toggle toggle--icon-only" role="radio" data-state="active" aria-checked="true" aria-label="Align center" data-value="center"><i data-lucide="align-center"></i></button>
  <button type="button" class="toggle toggle--icon-only" role="radio" aria-checked="false" aria-label="Align right" data-value="right"><i data-lucide="align-right"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          Roving tabindex keeps one member in the tab order at a time, so Tab leaves the group
          naturally. Arrow keys move focus along the group's orientation. In single-select mode focus
          is selection (WAI-ARIA radio-group); multi-select decouples them.
        </p>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Single-select</th>
              <th>Multi-select</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <kbd>→</kbd> / <kbd>↓</kbd>
              </td>
              <td>Focus next enabled member, auto-select.</td>
              <td>Focus next enabled member.</td>
            </tr>
            <tr>
              <td>
                <kbd>←</kbd> / <kbd>↑</kbd>
              </td>
              <td>Focus previous enabled member, auto-select.</td>
              <td>Focus previous enabled member.</td>
            </tr>
            <tr>
              <td>
                <kbd>Home</kbd>
              </td>
              <td>Focus first enabled, auto-select.</td>
              <td>Focus first enabled member.</td>
            </tr>
            <tr>
              <td>
                <kbd>End</kbd>
              </td>
              <td>Focus last enabled, auto-select.</td>
              <td>Focus last enabled member.</td>
            </tr>
            <tr>
              <td>
                <kbd>Space</kbd> / <kbd>Enter</kbd>
              </td>
              <td>Select focused (no-op if already selected).</td>
              <td>
                Flip <code>aria-pressed</code> on focused member.
              </td>
            </tr>
            <tr>
              <td>
                <kbd>Tab</kbd>
              </td>
              <td colSpan={2}>Leaves the group. Only the tabbable member is in the tab order.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Multi-select</h2>
        <p>
          Each member is an independent press toggle: <code>role="group"</code> on the wrapper,{" "}
          <code>aria-pressed</code> on each member. The type autodetects to <code>multiple</code> when
          no radio role is present.
        </p>
        <Demo
          html={`
<div class="toggle-group" data-stisla-toggle-group role="group" aria-label="Text style">
  <button type="button" class="toggle toggle--icon-only" aria-pressed="true" aria-label="Bold" data-value="bold"><i data-lucide="bold"></i></button>
  <button type="button" class="toggle toggle--icon-only" aria-pressed="false" aria-label="Italic" data-value="italic"><i data-lucide="italic"></i></button>
  <button type="button" class="toggle toggle--icon-only" aria-pressed="true" aria-label="Underline" data-value="underline"><i data-lucide="underline"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>Text labels and icon + label</h2>
        <p>Members can carry text instead of, or alongside, icons. The group's width grows to fit.</p>
        <Demo
          layout="stack"
          html={`
<div class="toggle-group" data-stisla-toggle-group role="radiogroup" aria-label="Calendar view">
  <button type="button" class="toggle" role="radio" data-state="active" aria-checked="true" data-value="day">Day</button>
  <button type="button" class="toggle" role="radio" aria-checked="false" data-value="week">Week</button>
  <button type="button" class="toggle" role="radio" aria-checked="false" data-value="month">Month</button>
</div>
<div class="toggle-group" data-stisla-toggle-group role="radiogroup" aria-label="View mode">
  <button type="button" class="toggle" role="radio" data-state="active" aria-checked="true" data-value="list"><i data-lucide="list"></i> List</button>
  <button type="button" class="toggle" role="radio" aria-checked="false" data-value="grid"><i data-lucide="layout-grid"></i> Grid</button>
  <button type="button" class="toggle" role="radio" aria-checked="false" data-value="kanban"><i data-lucide="columns-3"></i> Kanban</button>
</div>`}
        />
      </section>

      <section>
        <h2>Form data (radio set)</h2>
        <p>
          For single-select that submits with a form, use native radios: a hidden{" "}
          <code>.toggle-input</code> drives each paired <code>.toggle</code> label. Fully interactive,
          no JS.
        </p>
        <Demo
          html={`
<div class="toggle-group">
  <input type="radio" name="planRange" class="toggle-input" id="tgDay" value="day" checked>
  <label class="toggle" for="tgDay">Day</label>
  <input type="radio" name="planRange" class="toggle-input" id="tgWeek" value="week">
  <label class="toggle" for="tgWeek">Week</label>
  <input type="radio" name="planRange" class="toggle-input" id="tgMonth" value="month">
  <label class="toggle" for="tgMonth">Month</label>
</div>`}
        />
      </section>

      <section>
        <h2>Form data (checkbox set)</h2>
        <p>
          For multi-select form data, use native checkboxes the same way. Multiple labels can be
          active at once.
        </p>
        <Demo
          html={`
<div class="toggle-group">
  <input type="checkbox" name="tools" class="toggle-input" id="toolBold" value="bold" checked>
  <label class="toggle toggle--icon-only" for="toolBold" aria-label="Bold"><i data-lucide="bold"></i></label>
  <input type="checkbox" name="tools" class="toggle-input" id="toolItalic" value="italic">
  <label class="toggle toggle--icon-only" for="toolItalic" aria-label="Italic"><i data-lucide="italic"></i></label>
  <input type="checkbox" name="tools" class="toggle-input" id="toolUnderline" value="underline" checked>
  <label class="toggle toggle--icon-only" for="toolUnderline" aria-label="Underline"><i data-lucide="underline"></i></label>
</div>`}
        />
      </section>

      <section>
        <h2>Vertical</h2>
        <p>
          Add <code>.toggle-group--vertical</code> to stack members as a menu list (full-width,
          start-aligned, compact row height).
        </p>
        <Demo
          html={`
<div class="toggle-group toggle-group--vertical max-w-3xs" data-stisla-toggle-group role="radiogroup" aria-label="Mailbox">
  <button type="button" class="toggle" role="radio" data-state="active" aria-checked="true" data-value="inbox"><i data-lucide="inbox"></i> Inbox</button>
  <button type="button" class="toggle" role="radio" aria-checked="false" data-value="archive"><i data-lucide="archive"></i> Archive</button>
  <button type="button" class="toggle" role="radio" aria-checked="false" data-value="trash"><i data-lucide="trash-2"></i> Trash</button>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Add <code>.toggle-group--sm</code> or <code>.toggle-group--lg</code>; the container and its
          members scale together.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="toggle-group toggle-group--sm" data-stisla-toggle-group role="radiogroup" aria-label="Small">
  <button type="button" class="toggle" role="radio" data-state="active" aria-checked="true">Day</button>
  <button type="button" class="toggle" role="radio" aria-checked="false">Week</button>
  <button type="button" class="toggle" role="radio" aria-checked="false">Month</button>
</div>
<div class="toggle-group" data-stisla-toggle-group role="radiogroup" aria-label="Default">
  <button type="button" class="toggle" role="radio" data-state="active" aria-checked="true">Day</button>
  <button type="button" class="toggle" role="radio" aria-checked="false">Week</button>
  <button type="button" class="toggle" role="radio" aria-checked="false">Month</button>
</div>
<div class="toggle-group toggle-group--lg" data-stisla-toggle-group role="radiogroup" aria-label="Large">
  <button type="button" class="toggle" role="radio" data-state="active" aria-checked="true">Day</button>
  <button type="button" class="toggle" role="radio" aria-checked="false">Week</button>
  <button type="button" class="toggle" role="radio" aria-checked="false">Month</button>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>Two events fire on the group's root.</p>
        <p>
          <code>stisla:toggle-group:changing</code> fires before a flip and is cancelable. In
          single-select mode <code>detail</code> carries <code>value</code>, <code>member</code>,{" "}
          <code>previousValue</code>, and <code>previousMember</code>. In multi-select mode{" "}
          <code>detail</code> carries the proposed <code>value</code> array, the <code>member</code>{" "}
          being toggled, and <code>action</code> (<code>'pressed'</code> or <code>'unpressed'</code>).
          Call <code>preventDefault()</code> to abort the flip.
        </p>
        <p>
          <code>stisla:toggle-group:changed</code> fires after the flip lands with the same{" "}
          <code>detail</code> shape (final values). Not cancelable.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.toggle-group</code>; member chips read the <code>--toggle-*</code>
          {" "}variables (see Toggle).
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--toggle-group-height</code></td><td>Outer container height; size modifiers reassign this</td></tr>
            <tr><td><code>--toggle-group-radius</code></td><td>Outer corner radius; members derive a concentric inner radius from it</td></tr>
            <tr><td><code>--toggle-group-padding-block</code> / <code>-padding-inline</code></td><td>Interior padding around the members</td></tr>
            <tr><td><code>--toggle-group-gap</code></td><td>Gap between members</td></tr>
            <tr><td><code>--toggle-group-bg</code></td><td>Container background</td></tr>
            <tr><td><code>--toggle-group-border-color</code> / <code>-border-width</code></td><td>Container rim color / thickness</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
