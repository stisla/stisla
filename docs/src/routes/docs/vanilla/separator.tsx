import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/separator")({
  component: SeparatorDocs,
});

function SeparatorDocs() {
  return (
    <>
      <header>
        <h1>Separator</h1>
        <p className="lead">
          A hairline that splits content into groups, horizontally or
          vertically.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.separator</code> to an <code>&lt;hr&gt;</code> for a
          full-width rule. The bare element stays untouched by reboot, so the
          class is the opt-in; the color tracks the border token.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="max-w-md">
  <p class="m-0">Backed up to iCloud just now.</p>
  <hr class="separator my-3" />
  <p class="m-0">Local snapshot on this Mac. 2 days ago.</p>
</div>`}
        />
      </section>

      <section>
        <h2>Vertical</h2>
        <p>
          Drop the <code>--vertical</code> modifier on a{" "}
          <code>&lt;div&gt;</code> inside a flex row. The rule stretches to the
          row's cross axis. Add <code>role="separator"</code> and{" "}
          <code>aria-orientation="vertical"</code> when the divide carries
          meaning.
        </p>
        <Demo
          html={`
<div class="inline-flex items-center gap-3 text-xs text-muted-foreground">
  <span>By Maya Tanaka</span>
  <div class="separator separator--vertical" role="separator" aria-orientation="vertical"></div>
  <span>5 min read</span>
  <div class="separator separator--vertical" role="separator" aria-orientation="vertical"></div>
  <span>Tutorial</span>
</div>`}
        />
      </section>

      <section>
        <h2>Inside a card body</h2>
        <p>
          Use a separator to break a card into thematic blocks without a header
          or footer. The rule reaches the body padding's edge, matching the
          card's cadence.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card max-w-sm w-full">
  <div class="card__body">
    <h5 class="card__title m-0">Invoice #2026-04-118</h5>
    <p class="card__subtitle m-0">Due July 1, 2026</p>
  </div>
  <hr class="separator" />
  <div class="card__body">
    <div class="flex flex-wrap items-center justify-between">
      <span>Annual plan</span><span class="font-medium">$96.00</span>
    </div>
    <div class="flex flex-wrap items-center justify-between">
      <span>Three additional seats</span><span class="font-medium">$36.00</span>
    </div>
    <div class="flex flex-wrap items-center justify-between text-muted-foreground">
      <span>Estimated tax</span><span class="font-medium">$8.40</span>
    </div>
  </div>
  <hr class="separator" />
  <div class="card__body">
    <div class="flex flex-wrap items-center justify-between text-lg font-semibold">
      <span>Total</span><span>$140.40</span>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.separator</code> without touching
          component CSS. Override on the element, a parent scope, or{" "}
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
                <code>--separator-thickness</code>
              </td>
              <td>
                Rule weight; defaults to the border-width custom. Bump for a
                louder split.
              </td>
            </tr>
            <tr>
              <td>
                <code>--separator-color</code>
              </td>
              <td>Rule color; tracks the border token by default</td>
            </tr>
            <tr>
              <td>
                <code>--separator-min-height</code>
              </td>
              <td>
                Floor height for a vertical rule when its flex parent can't
                stretch it
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
