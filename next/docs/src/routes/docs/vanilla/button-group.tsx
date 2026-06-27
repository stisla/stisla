import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/button-group")({
  component: ButtonGroupDocs,
});

function ButtonGroupDocs() {
  return (
    <>
      <header>
        <h1>Button group</h1>
        <p className="lead">A row of action buttons that share chrome so they read as a single control.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          For press toggles and segmented controls, see Toggle and Toggle group.{" "}
          <code>.button-group</code> is purely visual grouping for action buttons, with no state hooks
          and no JS. Wrap two or more <code>.button</code>s in <code>.button-group</code> with{" "}
          <code>role="group"</code> and an <code>aria-label</code>. Outer corners round, inner corners
          square, adjacent borders dedupe into a single seam.
        </p>
        <Demo
          html={`
<div class="button-group" role="group" aria-label="Basic example">
  <button type="button" class="button button--primary">Left</button>
  <button type="button" class="button button--primary">Middle</button>
  <button type="button" class="button button--primary">Right</button>
</div>`}
        />
      </section>

      <section>
        <h2>Outline</h2>
        <p>Outline members work the same way, with adjacent borders deduping at the seam.</p>
        <Demo
          html={`
<div class="button-group" role="group" aria-label="Outline example">
  <button type="button" class="button button--outline button--neutral">Left</button>
  <button type="button" class="button button--outline button--neutral">Middle</button>
  <button type="button" class="button button--outline button--neutral">Right</button>
</div>`}
        />
      </section>

      <section>
        <h2>Mixed</h2>
        <p>A loud action paired with a quiet alternative, locked together as one chip.</p>
        <Demo
          html={`
<div class="button-group" role="group" aria-label="Mixed example">
  <button type="button" class="button button--primary">Publish</button>
  <button type="button" class="button button--outline button--neutral">Save draft</button>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Add <code>.button-group--sm</code> or <code>.button-group--lg</code> on the wrapper. The
          modifier retunes the child <code>--button-*</code> vars so every member scales together.
        </p>
        <Demo
          html={`
<div class="flex flex-col gap-2 items-start">
  <div class="button-group button-group--sm" role="group" aria-label="Small">
    <button type="button" class="button button--outline button--neutral">Left</button>
    <button type="button" class="button button--outline button--neutral">Middle</button>
    <button type="button" class="button button--outline button--neutral">Right</button>
  </div>
  <div class="button-group" role="group" aria-label="Default">
    <button type="button" class="button button--outline button--neutral">Left</button>
    <button type="button" class="button button--outline button--neutral">Middle</button>
    <button type="button" class="button button--outline button--neutral">Right</button>
  </div>
  <div class="button-group button-group--lg" role="group" aria-label="Large">
    <button type="button" class="button button--outline button--neutral">Left</button>
    <button type="button" class="button button--outline button--neutral">Middle</button>
    <button type="button" class="button button--outline button--neutral">Right</button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>With icons</h2>
        <p>
          Icons compose the same as in standalone buttons. <code>.button--icon-only</code> gives a
          square slot.
        </p>
        <Demo
          html={`
<div class="button-group" role="group" aria-label="Format">
  <button type="button" class="button button--outline button--neutral button--icon-only" aria-label="Cut"><i data-lucide="scissors"></i></button>
  <button type="button" class="button button--outline button--neutral button--icon-only" aria-label="Copy"><i data-lucide="copy"></i></button>
  <button type="button" class="button button--outline button--neutral button--icon-only" aria-label="Paste"><i data-lucide="clipboard"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>Split button</h2>
        <p>
          Pair a primary action with a caret-only trigger. The trigger reuses{" "}
          <code>.button--icon-only</code> with a chevron, so no split-specific class ships. (Menu
          attach behavior lands with the Menu component.)
        </p>
        <Demo
          html={`
<div class="button-group" role="group" aria-label="Save">
  <button type="button" class="button button--primary">Save</button>
  <button type="button" class="button button--primary button--icon-only" aria-label="More save options" aria-haspopup="menu" aria-expanded="false"><i data-lucide="chevron-down"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>Vertical</h2>
        <p>
          Swap <code>.button-group</code> for <code>.button-group--vertical</code> to stack the
          members. Outer corners round on the top and bottom instead of left and right.
        </p>
        <Demo
          html={`
<div class="button-group--vertical" role="group" aria-label="Vertical example">
  <button type="button" class="button button--primary">Top</button>
  <button type="button" class="button button--primary">Middle</button>
  <button type="button" class="button button--primary">Bottom</button>
</div>`}
        />
      </section>

      <section>
        <h2>Toolbar</h2>
        <p>
          Combine multiple groups under <code>.button-toolbar</code>. It carries a default gap between
          groups so they breathe without inline utility classes.
        </p>
        <Demo
          html={`
<div class="button-toolbar" role="toolbar" aria-label="Toolbar with button groups">
  <div class="button-group" role="group" aria-label="First group">
    <button type="button" class="button button--outline button--neutral">1</button>
    <button type="button" class="button button--outline button--neutral">2</button>
    <button type="button" class="button button--outline button--neutral">3</button>
  </div>
  <div class="button-group" role="group" aria-label="Second group">
    <button type="button" class="button button--outline button--neutral">4</button>
    <button type="button" class="button button--outline button--neutral">5</button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          Two variables retune <code>.button-group</code> + <code>.button-toolbar</code>. Sizes retune
          the child <code>--button-*</code> vars in modifier scope rather than adding per-size vars on
          the group. To recolor a cluster, set <code>--button-bg</code> / <code>--button-tone</code> on
          the members, not the wrapper.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--button-group-radius</code></td><td>Outer corner radius; inner corners stay square. The sm and lg variants reassign this</td></tr>
            <tr><td><code>--button-toolbar-gap</code></td><td>Space between groups inside a <code>.button-toolbar</code></td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
