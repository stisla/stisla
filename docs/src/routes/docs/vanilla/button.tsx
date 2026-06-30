import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/button")({
  component: ButtonDocs,
});

function ButtonDocs() {
  return (
    <>
      <header>
        <h1>Button</h1>
        <p className="lead">A clickable control that triggers an action.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.button</code> to a <code>&lt;button&gt;</code>, then pair it with a tone
          modifier for the role. <code>.button--primary</code> is the main call to action; use
          one per surface for the action you most want the user to take.
        </p>
        <Demo html={`<button type="button" class="button button--primary">Primary</button>`} />
      </section>

      <section>
        <h2>Neutral</h2>
        <p>
          A quieter button next to primary. Use for actions that should sit alongside primary
          without competing for attention, like Cancel next to Save.
        </p>
        <Demo
          html={`
<button type="button" class="button button--neutral">Neutral</button>
<button type="button" class="button button--outline button--neutral">Outline</button>`}
        />
        <p>The canonical pairing in context.</p>
        <Demo
          html={`
<button type="button" class="button button--primary">Save changes</button>
<button type="button" class="button button--outline button--neutral">Cancel</button>`}
        />
      </section>

      <section>
        <h2>Tertiary</h2>
        <p>
          An alternative to primary when the brand color is already taken on the page. The fill
          flips by theme, dark in light mode and light in dark mode.
        </p>
        <Demo html={`<button type="button" class="button button--tertiary">Tertiary</button>`} />
      </section>

      <section>
        <h2>Danger</h2>
        <p>
          For destructive actions like Delete or Discard. Filled red is the safe default for a
          confirm dialog; outline and soft fit softer surfaces such as row-level deletes.
        </p>
        <Demo
          html={`
<button type="button" class="button button--danger">Danger</button>
<button type="button" class="button button--outline button--danger">Outline</button>
<button type="button" class="button button--soft button--danger">Soft</button>`}
        />
      </section>

      <section>
        <h2>Ghost</h2>
        <p>
          No background, no border, just a colored label. Use for low-stakes actions in toolbars
          or quiet inline triggers. Hover paints a soft tint so the affordance shows on interaction.
        </p>
        <Demo
          html={`
<button type="button" class="button button--ghost button--neutral">Cancel</button>
<button type="button" class="button button--ghost button--primary">View details</button>
<button type="button" class="button button--ghost button--danger">Remove</button>`}
        />
      </section>

      <section>
        <h2>Custom color</h2>
        <p>
          For one-off colors outside the shipped tones, set <code>--button-tone</code> and{" "}
          <code>--button-color</code> inline. The bg, hover, active, rim, and bevel all derive
          from <code>--button-tone</code>, so a one-line override carries every state. If the
          same color appears in three or more places, promote it to a project class.
        </p>
        <Demo
          html={`
<button type="button" class="button" style="--button-tone: oklch(0.55 0.18 149); --button-color: white;">Custom green</button>
<button type="button" class="button" style="--button-tone: oklch(0.55 0.15 285); --button-color: white;">Custom violet</button>
<button type="button" class="button" style="--button-tone: oklch(0.65 0.18 55); --button-color: white;">Custom orange</button>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Heights are pinned across each size regardless of content. Base (unmodified) is{" "}
          <code>md</code>; <code>.button--sm</code>, <code>.button--lg</code>, and{" "}
          <code>.button--xl</code> step it.
        </p>
        <Demo
          html={`
<button type="button" class="button button--primary button--sm">Small</button>
<button type="button" class="button button--primary">Default</button>
<button type="button" class="button button--primary button--lg">Large</button>
<button type="button" class="button button--primary button--xl">XL</button>`}
        />
      </section>

      <section>
        <h2>With icon</h2>
        <p>Icons drop in via flexbox <code>gap</code> and scale to the label's font size.</p>
        <Demo
          html={`
<button type="button" class="button button--primary"><i data-lucide="plus"></i> Leading icon</button>
<button type="button" class="button button--primary">Trailing icon <i data-lucide="arrow-right"></i></button>`}
        />
      </section>

      <section>
        <h2>Icon only</h2>
        <p>
          Add <code>.button--icon-only</code> for a square button at any size. Pair with{" "}
          <code>aria-label</code> so the action stays announced. Add{" "}
          <code>.button--icon-round</code> for a circular silhouette.
        </p>
        <Demo
          html={`
<button type="button" class="button button--primary button--icon-only button--sm" aria-label="Add"><i data-lucide="plus"></i></button>
<button type="button" class="button button--primary button--icon-only" aria-label="Add"><i data-lucide="plus"></i></button>
<button type="button" class="button button--primary button--icon-only button--lg" aria-label="Add"><i data-lucide="plus"></i></button>
<button type="button" class="button button--outline button--danger button--icon-only" aria-label="Delete"><i data-lucide="trash-2"></i></button>
<button type="button" class="button button--outline button--neutral button--icon-only" aria-label="Edit"><i data-lucide="pencil"></i></button>
<button type="button" class="button button--ghost button--neutral button--icon-only button--icon-round" aria-label="Edit"><i data-lucide="pencil"></i></button>`}
        />
      </section>

      <section>
        <h2>States</h2>
        <p>
          <code>aria-pressed="true"</code> applies the pressed-in fill on any tone. Native{" "}
          <code>:disabled</code> applies on form controls; <code>aria-disabled="true"</code>{" "}
          mirrors it on link buttons.
        </p>
        <Demo
          html={`
<button type="button" class="button button--primary" aria-pressed="true">Pressed</button>
<button type="button" class="button button--primary" disabled>Disabled button</button>
<a href="#" role="button" class="button button--primary" aria-disabled="true" tabindex="-1">Disabled link</a>`}
        />
      </section>

      <section>
        <h2>Loading</h2>
        <p>
          Set <code>aria-busy="true"</code> to show a leading spinner. The label stays; leading
          or trailing icons hide so the spinner takes their place. Click is blocked while busy.
          The spinner is pure CSS, no JS in this demo.
        </p>
        <Demo
          html={`
<button type="button" class="button button--primary button--sm" aria-busy="true">Saving</button>
<button type="button" class="button button--primary" aria-busy="true">Saving</button>
<button type="button" class="button button--primary button--lg" aria-busy="true">Saving</button>
<button type="button" class="button button--outline button--neutral" aria-busy="true">Loading</button>
<button type="button" class="button button--danger button--icon-only" aria-busy="true" aria-label="Deleting"></button>`}
        />
        <p>With icons, the spinner replaces them in place.</p>
        <Demo
          html={`
<button type="button" class="button button--primary" aria-busy="true"><i data-lucide="plus"></i> Adding</button>
<button type="button" class="button button--primary" aria-busy="true">Continuing <i data-lucide="arrow-right"></i></button>`}
        />
      </section>

      <section>
        <h2>Works on any element</h2>
        <p>
          <code>.button</code> renders the same on <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>,
          and form inputs.
        </p>
        <Demo
          html={`
<button type="button" class="button button--primary">&lt;button&gt;</button>
<a href="#" role="button" class="button button--primary">&lt;a&gt;</a>
<input type="submit" class="button button--primary" value="<input type=submit>" />`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          Override on <code>.button</code> itself, on a parent scope, or on <code>:root</code>.
          The cascade scopes the change. The variable surface splits into four groups.
        </p>

        <h3>Geometry and sizes</h3>
        <p>
          Shape, height, and text scale. Size modifiers (<code>--sm</code>, <code>--lg</code>,{" "}
          <code>--xl</code>) reassign each row to the corresponding value.
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
              <td><code>--button-radius</code></td>
              <td>Corner radius. Size modifiers step it to a smaller or larger tier</td>
            </tr>
            <tr>
              <td><code>--button-height</code></td>
              <td>Hard single-line height — a <code>--spacing()</code> multiple, so it tracks <code>--spacing</code></td>
            </tr>
            <tr>
              <td><code>--button-padding-inline</code></td>
              <td>Inline padding (left and right)</td>
            </tr>
            <tr>
              <td><code>--button-padding-block</code></td>
              <td>Block padding (top and bottom); defaults to <code>0</code> since the height owns the rhythm. <code>--wrap</code> sets it for multi-line buttons</td>
            </tr>
            <tr>
              <td><code>--button-border-width</code></td>
              <td>Border thickness; set <code>0</code> to drop the rim</td>
            </tr>
            <tr>
              <td><code>--button-font-size</code></td>
              <td>Label size</td>
            </tr>
            <tr>
              <td><code>--button-font-weight</code></td>
              <td>Label weight</td>
            </tr>
            <tr>
              <td><code>--button-icon-size</code></td>
              <td>Width and height of inline icons</td>
            </tr>
          </tbody>
        </table>

        <h3>Color knobs</h3>
        <p>
          The four surface variables that paint each state. Each defaults from{" "}
          <code>--button-tone</code>, so retoning is usually a one-line <code>--button-tone</code>{" "}
          override.
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
              <td><code>--button-bg</code></td>
              <td>Background. <code>:hover</code> mixes 88% over black; <code>:active</code> 78%</td>
            </tr>
            <tr>
              <td><code>--button-color</code></td>
              <td>Label color. Pairs with <code>--button-tone</code> for legibility across overrides</td>
            </tr>
            <tr>
              <td><code>--button-border-color</code></td>
              <td>Rim border — recessed in light, rim-lit in dark</td>
            </tr>
            <tr>
              <td><code>--button-bevel</code></td>
              <td>Inset top highlight. Set <code>none</code> for flat (outline/ghost/soft do this automatically)</td>
            </tr>
          </tbody>
        </table>

        <h3>Tone source</h3>
        <p>
          One variable carries the button's color; the four color knobs derive from it. Tone
          modifiers reassign <code>--button-tone</code> to the matching token.
        </p>
        <table>
          <thead>
            <tr>
              <th>Modifier</th>
              <th>Sets <code>--button-tone</code></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.button--primary</code></td>
              <td><code>var(--color-primary)</code> + <code>--button-color: var(--color-primary-foreground)</code></td>
            </tr>
            <tr>
              <td><code>.button--danger</code></td>
              <td><code>var(--color-danger)</code> + <code>--button-color: var(--color-danger-foreground)</code></td>
            </tr>
            <tr>
              <td><code>.button--neutral</code></td>
              <td><code>var(--color-foreground)</code>; <code>--button-bg</code> forced to <code>--color-neutral</code></td>
            </tr>
            <tr>
              <td><code>.button--tertiary</code></td>
              <td><code>var(--color-foreground)</code> + <code>--button-color: var(--color-background)</code>; flips with theme</td>
            </tr>
          </tbody>
        </table>

        <h3>Shape variants</h3>
        <p>
          Outline, ghost, and soft override the color knobs while leaving{" "}
          <code>--button-tone</code> intact, so a single tone reads three ways. Each sets{" "}
          <code>--button-bevel: none</code>.
        </p>
        <table>
          <thead>
            <tr>
              <th>Modifier</th>
              <th><code>--button-bg</code></th>
              <th><code>--button-border-color</code></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.button--outline</code></td>
              <td>transparent</td>
              <td><code>var(--button-tone)</code></td>
            </tr>
            <tr>
              <td><code>.button--ghost</code></td>
              <td>transparent</td>
              <td>transparent</td>
            </tr>
            <tr>
              <td><code>.button--soft</code></td>
              <td>tone @ 12% over transparent</td>
              <td>transparent</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
