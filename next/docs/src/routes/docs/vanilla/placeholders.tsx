import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/placeholders")({
  component: PlaceholdersDocs,
});

function PlaceholdersDocs() {
  return (
    <>
      <header>
        <h1>Placeholders</h1>
        <p className="lead">
          Skeleton stand-ins for content that hasn't loaded yet.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Apply <code>.placeholder</code> to any inline element and size it with
          a width utility or inline style; the fill is a muted gray by default.
          Wrap the loading region in <code>aria-hidden="true"</code> so the
          skeleton is skipped by assistive tech. Add{" "}
          <code>.placeholder--glow</code> for a pulse or{" "}
          <code>.placeholder--wave</code> for a shimmer. Stack a few bars of
          varying width to stand in for lines of text.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="max-w-sm w-full" aria-hidden="true">
  <p class="mb-2"><span class="placeholder w-1/2"></span></p>
  <p class="mb-2"><span class="placeholder w-full"></span></p>
  <p class="m-0"><span class="placeholder w-3/4"></span></p>
</div>`}
        />
      </section>

      <section>
        <h2>Colors</h2>
        <p>
          The default is a neutral muted gray. Set <code>--placeholder-bg</code>{" "}
          to tint a bar to any token.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-2 max-w-sm w-full" aria-hidden="true">
  <span class="placeholder w-full"></span>
  <span class="placeholder w-full" style="--placeholder-bg: var(--color-primary)"></span>
  <span class="placeholder w-full" style="--placeholder-bg: var(--color-success)"></span>
  <span class="placeholder w-full" style="--placeholder-bg: var(--color-danger)"></span>
  <span class="placeholder w-full" style="--placeholder-bg: var(--color-warning)"></span>
  <span class="placeholder w-full" style="--placeholder-bg: var(--color-info)"></span>
</div>`}
        />
      </section>

      <section>
        <h2>Animated</h2>
        <p>
          <code>--glow</code> fades the bar in and out; <code>--wave</code>{" "}
          sweeps a highlight across it. They're modifiers on the bar, so put the
          class on each bar you want animated. Both stop under reduced motion.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-2 max-w-sm w-full" aria-hidden="true">
  <span class="placeholder placeholder--glow w-full"></span>
  <span class="placeholder placeholder--glow w-3/4"></span>
</div>`}
        />
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-2 max-w-sm w-full" aria-hidden="true">
  <span class="placeholder placeholder--wave w-full"></span>
  <span class="placeholder placeholder--wave w-3/4"></span>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          The bar height tracks its font-size (<code>1em</code>);{" "}
          <code>--sm</code> and <code>--lg</code> shrink or grow it.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-3 max-w-sm w-full" aria-hidden="true">
  <span class="placeholder placeholder--sm w-full"></span>
  <span class="placeholder w-full"></span>
  <span class="placeholder placeholder--lg w-full"></span>
</div>`}
        />
      </section>

      <section>
        <h2>Composed</h2>
        <p>
          Combine bars with width and shape utilities to skeleton a whole
          component, such as a media row with a round avatar.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card max-w-sm w-full" aria-hidden="true">
  <div class="card__body flex items-center gap-3">
    <span class="placeholder placeholder--glow w-12 h-12 rounded-full shrink-0"></span>
    <div class="flex-1 flex flex-col gap-2 w-full">
      <span class="placeholder placeholder--glow w-1/2"></span>
      <span class="placeholder placeholder--glow w-full"></span>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune a placeholder bar. Override on the bar or any
          wrapper.
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
                <code>--placeholder-height</code>
              </td>
              <td>Bar height (font-relative; the size modifiers retune it)</td>
            </tr>
            <tr>
              <td>
                <code>--placeholder-bg</code>
              </td>
              <td>Fill color</td>
            </tr>
            <tr>
              <td>
                <code>--placeholder-opacity</code>
              </td>
              <td>Fill opacity</td>
            </tr>
            <tr>
              <td>
                <code>--placeholder-radius</code>
              </td>
              <td>Corner radius</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
