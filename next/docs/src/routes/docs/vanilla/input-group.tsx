import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/input-group")({
  component: InputGroupDocs,
});

function InputGroupDocs() {
  return (
    <>
      <header>
        <h1>Input group</h1>
        <p className="lead">
          An input paired with leading or trailing addons on one continuous
          surface.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Wrap an addon and a field (<code>.input</code>, <code>.select</code>,
          or <code>.textarea</code>) in <code>.input-group</code>. The addon
          sits flush against the input on a shared surface, with a single focus
          state on the wrapper.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <span class="input-group__text">https://</span>
  <input type="text" class="input" placeholder="example.com" />
</div>
<div class="input-group max-w-sm">
  <input type="text" class="input" placeholder="yourname" />
  <span class="input-group__text">@company.com</span>
</div>`}
        />
      </section>

      <section>
        <h2>Icon</h2>
        <p>
          Drop an icon into <code>.input-group__text</code> for a leading or
          trailing glyph. The addon stays transparent so the icon reads against
          the wrapper.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <span class="input-group__text"><i data-lucide="search"></i></span>
  <input type="search" class="input" placeholder="Search" />
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Add <code>.input-group--sm</code> or <code>.input-group--lg</code> on
          the wrapper and the matching size modifier on the field child (e.g.{" "}
          <code>.input--sm</code>) to scale every member together.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group input-group--sm max-w-sm">
  <span class="input-group__text"><i data-lucide="at-sign"></i></span>
  <input type="text" class="input input--sm" placeholder="Small" />
</div>
<div class="input-group max-w-sm">
  <span class="input-group__text"><i data-lucide="at-sign"></i></span>
  <input type="text" class="input" placeholder="Default" />
</div>
<div class="input-group input-group--lg max-w-sm">
  <span class="input-group__text"><i data-lucide="at-sign"></i></span>
  <input type="text" class="input input--lg" placeholder="Large" />
</div>`}
        />
      </section>

      <section>
        <h2>With button</h2>
        <p>
          A button slot sits inset inside the wrapper with its own concentric
          radius, reading as a chip floating in the field rather than chrome
          welded to its edge. Pair the button size with the wrapper size; retune
          the inset with <code>--input-group-inset</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <input type="search" class="input" placeholder="Search" />
  <button type="button" class="button button--primary">Go</button>
</div>
<div class="input-group max-w-sm">
  <button type="button" class="button button--outline button--neutral">Copy</button>
  <input type="text" class="input" value="https://stisla.dev" readonly />
</div>`}
        />
        <p>
          Pair the button size with the wrapper size so the chip's text fits its
          chip: <code>.input-group--sm</code> + <code>.button--sm</code>,
          default + default, <code>.input-group--lg</code> +{" "}
          <code>.button--lg</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group input-group--sm max-w-sm">
  <input type="search" class="input input--sm" placeholder="Small" />
  <button type="button" class="button button--sm button--primary">Go</button>
</div>
<div class="input-group max-w-sm">
  <input type="search" class="input" placeholder="Default" />
  <button type="button" class="button button--primary">Go</button>
</div>
<div class="input-group input-group--lg max-w-sm">
  <input type="search" class="input input--lg" placeholder="Large" />
  <button type="button" class="button button--lg button--primary">Go</button>
</div>`}
        />
      </section>

      <section>
        <h2>Select</h2>
        <p>
          A <code>&lt;select class="select"&gt;</code> stands in for the input.
          The wrapper strips its border the same way it does for{" "}
          <code>.input</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <select class="select max-w-22" aria-label="Currency">
    <option selected>USD</option>
    <option>EUR</option>
    <option>GBP</option>
    <option>JPY</option>
  </select>
  <input type="number" class="input" placeholder="Amount" />
</div>`}
        />
      </section>

      <section>
        <h2>Labelled select</h2>
        <p>
          Lead with a text or icon addon and let the select stand in for the
          input. Reads as a labelled chooser, no separate field needed.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <label class="input-group__text" for="currencyOnly">Currency</label>
  <select class="select" id="currencyOnly">
    <option selected>USD</option>
    <option>EUR</option>
    <option>GBP</option>
    <option>JPY</option>
  </select>
</div>
<div class="input-group max-w-sm">
  <span class="input-group__text"><i data-lucide="globe"></i></span>
  <select class="select" aria-label="Language">
    <option selected>English</option>
    <option>Bahasa Indonesia</option>
    <option>日本語</option>
    <option>Deutsch</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>With select</h2>
        <p>
          Mix a text addon and a select on opposite sides for a labelled, scoped
          input.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <label class="input-group__text" for="amountCurrency">$</label>
  <input type="number" class="input" id="amountCurrency" placeholder="Amount" />
  <select class="select max-w-22" aria-label="Currency">
    <option selected>USD</option>
    <option>EUR</option>
    <option>GBP</option>
  </select>
</div>`}
        />
      </section>

      <section>
        <h2>Multiple addons</h2>
        <p>
          Stack more than one addon on the same side. They share the surface and
          read as one phrase.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <span class="input-group__text">$</span>
  <span class="input-group__text">0.00</span>
  <input type="text" class="input" />
</div>`}
        />
      </section>

      <section>
        <h2>Textarea</h2>
        <p>
          A textarea grows past the default height and the wrapper grows with
          it. Addons hold to their top edge.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <span class="input-group__text"><i data-lucide="message-square"></i></span>
  <textarea class="textarea" rows="3" placeholder="Leave a note"></textarea>
</div>`}
        />
      </section>

      <section>
        <h2>Validation</h2>
        <p>
          An invalid child paints the wrapper red. Set{" "}
          <code>aria-invalid="true"</code> for server-rendered errors, or pair{" "}
          <code>required</code> with <code>:user-invalid</code> for native
          validation after the first touch.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <span class="input-group__text"><i data-lucide="at-sign"></i></span>
  <input type="email" class="input" value="not-an-email" aria-invalid="true" />
</div>`}
        />
      </section>

      <section>
        <h2>Disabled</h2>
        <p>
          Disable the input directly; the wrapper dims with it via its opacity,
          no extra class on the group.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="input-group max-w-sm">
  <span class="input-group__text">https://</span>
  <input type="text" class="input" value="example.com" disabled />
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.input-group</code> without touching
          component CSS. Override on the wrapper, a parent scope, or{" "}
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
                <code>--input-group-radius</code>
              </td>
              <td>
                Wrapper corner radius; the sm and lg variants reassign this
              </td>
            </tr>
            <tr>
              <td>
                <code>--input-group-height</code>
              </td>
              <td>Wrapper height; the sm and lg variants reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--input-group-bg</code>
              </td>
              <td>Wrapper background</td>
            </tr>
            <tr>
              <td>
                <code>--input-group-border-width</code>
              </td>
              <td>Wrapper border thickness</td>
            </tr>
            <tr>
              <td>
                <code>--input-group-border-color</code>
              </td>
              <td>Wrapper border color</td>
            </tr>
            <tr>
              <td>
                <code>--input-group-padding-inline</code>
              </td>
              <td>
                Addon horizontal padding; matches the field child's inline
                padding so an addon's text baseline aligns with the input's
              </td>
            </tr>
            <tr>
              <td>
                <code>--input-group-inset</code>
              </td>
              <td>
                Margin around an inline <code>.button</code> child; its height
                becomes <em>wrapper height − 2 × inset</em> and its radius{" "}
                <em>wrapper radius − inset</em> for concentric corners
              </td>
            </tr>
            <tr>
              <td>
                <code>--input-group-addon-color</code>
              </td>
              <td>Addon text and icon color</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
