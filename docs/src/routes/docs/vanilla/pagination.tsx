import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/pagination")({
  component: PaginationDocs,
});

function PaginationDocs() {
  return (
    <>
      <header>
        <h1>Pagination</h1>
        <p className="lead">
          A row of page chips for moving through a long list or paginated view.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Wrap a list of <code>.pagination__button</code> in{" "}
          <code>.pagination</code>. Mark the current page with{" "}
          <code>data-state="active"</code> and <code>aria-current="page"</code>:
          it paints the highlight, while hover paints the lighter accent.
        </p>
        <Demo
          layout="stack"
          html={`
<nav aria-label="Page navigation">
  <ul class="pagination">
    <li><a class="pagination__button" href="#">Previous</a></li>
    <li><a class="pagination__button" href="#">1</a></li>
    <li><a class="pagination__button" href="#" data-state="active" aria-current="page">2</a></li>
    <li><a class="pagination__button" href="#">3</a></li>
    <li><a class="pagination__button" href="#">Next</a></li>
  </ul>
</nav>`}
        />
      </section>

      <section>
        <h2>With icons</h2>
        <p>
          Drop an <code>&lt;svg&gt;</code> or <code>&lt;i&gt;</code> inside the
          chip. Icons sit at <code>1em</code> so they scale with the chip's font
          size and stay on the label baseline.
        </p>
        <Demo
          layout="stack"
          html={`
<nav aria-label="Page navigation">
  <ul class="pagination">
    <li><a class="pagination__button" href="#" aria-label="Previous"><i data-lucide="chevron-left"></i><span>Previous</span></a></li>
    <li><a class="pagination__button" href="#">1</a></li>
    <li><a class="pagination__button" href="#" data-state="active" aria-current="page">2</a></li>
    <li><a class="pagination__button" href="#">3</a></li>
    <li><a class="pagination__button" href="#" aria-label="Next"><span>Next</span><i data-lucide="chevron-right"></i></a></li>
  </ul>
</nav>`}
        />
      </section>

      <section>
        <h2>Disabled and ellipsis</h2>
        <p>
          Set <code>aria-disabled="true"</code> on a chip (or a bare{" "}
          <code>&lt;span&gt;</code>) to gray it out and drop pointer events —
          use it on the edge chip at the start/end of the range. Drop{" "}
          <code>.pagination__ellipsis</code> in as a truncation marker between
          page ranges; it takes the same footprint with no hover or focus.
        </p>
        <Demo
          layout="stack"
          html={`
<nav aria-label="Page navigation">
  <ul class="pagination">
    <li><span class="pagination__button" aria-label="Previous" aria-disabled="true"><i data-lucide="chevron-left"></i><span>Previous</span></span></li>
    <li><a class="pagination__button" href="#" data-state="active" aria-current="page">1</a></li>
    <li><a class="pagination__button" href="#">2</a></li>
    <li><a class="pagination__button" href="#">3</a></li>
    <li><a class="pagination__button" href="#">4</a></li>
    <li><span class="pagination__ellipsis" aria-hidden="true">…</span></li>
    <li><a class="pagination__button" href="#">12</a></li>
    <li><a class="pagination__button" href="#" aria-label="Next"><span>Next</span><i data-lucide="chevron-right"></i></a></li>
  </ul>
</nav>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Add <code>.pagination--sm</code> or <code>.pagination--lg</code> for
          compact or large chips. Heights match the button scale.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 w-full items-center">
  <ul class="pagination pagination--sm">
    <li><a class="pagination__button" href="#">Previous</a></li>
    <li><a class="pagination__button" href="#">1</a></li>
    <li><a class="pagination__button" href="#" data-state="active" aria-current="page">2</a></li>
    <li><a class="pagination__button" href="#">3</a></li>
    <li><a class="pagination__button" href="#">Next</a></li>
  </ul>
  <ul class="pagination">
    <li><a class="pagination__button" href="#">Previous</a></li>
    <li><a class="pagination__button" href="#">1</a></li>
    <li><a class="pagination__button" href="#" data-state="active" aria-current="page">2</a></li>
    <li><a class="pagination__button" href="#">3</a></li>
    <li><a class="pagination__button" href="#">Next</a></li>
  </ul>
  <ul class="pagination pagination--lg">
    <li><a class="pagination__button" href="#">Previous</a></li>
    <li><a class="pagination__button" href="#">1</a></li>
    <li><a class="pagination__button" href="#" data-state="active" aria-current="page">2</a></li>
    <li><a class="pagination__button" href="#">3</a></li>
    <li><a class="pagination__button" href="#">Next</a></li>
  </ul>
</div>`}
        />
      </section>

      <section>
        <h2>Alignment</h2>
        <p>
          Add <code>.pagination--center</code> or <code>.pagination--end</code>{" "}
          to flip the row's <code>justify-content</code>. Default is start.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-4 w-full">
  <ul class="pagination pagination--center">
    <li><a class="pagination__button" href="#">Previous</a></li>
    <li><a class="pagination__button" href="#">1</a></li>
    <li><a class="pagination__button" href="#" data-state="active" aria-current="page">2</a></li>
    <li><a class="pagination__button" href="#">3</a></li>
    <li><a class="pagination__button" href="#">Next</a></li>
  </ul>
  <ul class="pagination pagination--end">
    <li><a class="pagination__button" href="#">Previous</a></li>
    <li><a class="pagination__button" href="#">1</a></li>
    <li><a class="pagination__button" href="#" data-state="active" aria-current="page">2</a></li>
    <li><a class="pagination__button" href="#">3</a></li>
    <li><a class="pagination__button" href="#">Next</a></li>
  </ul>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.pagination</code>. Override on the
          element, a parent scope, or <code>:root</code>.
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
                <code>--pagination-gap</code>
              </td>
              <td>Space between chips</td>
            </tr>
            <tr>
              <td>
                <code>--pagination-font-size</code>
              </td>
              <td>Chip text size; size modifiers reassign this</td>
            </tr>
            <tr>
              <td>
                <code>--pagination-button-height</code>
              </td>
              <td>
                Chip height and min-width (square single glyph); size modifiers
                reassign this
              </td>
            </tr>
            <tr>
              <td>
                <code>--pagination-button-padding-inline</code>
              </td>
              <td>Horizontal padding on multi-char chips</td>
            </tr>
            <tr>
              <td>
                <code>--pagination-button-padding-block</code>
              </td>
              <td>
                Vertical padding; defaults to <code>0</code> since the chip
                height owns the rhythm
              </td>
            </tr>
            <tr>
              <td>
                <code>--pagination-button-radius</code>
              </td>
              <td>Chip corner radius</td>
            </tr>
            <tr>
              <td>
                <code>--pagination-button-bg</code> / <code>-color</code>
              </td>
              <td>Rest fill / text</td>
            </tr>
            <tr>
              <td>
                <code>--pagination-button-bg-hover</code> /{" "}
                <code>-color-hover</code>
              </td>
              <td>Hover fill / text (accent tier)</td>
            </tr>
            <tr>
              <td>
                <code>--pagination-button-bg-active</code> /{" "}
                <code>-color-active</code>
              </td>
              <td>Current-page fill / text (highlight tier)</td>
            </tr>
            <tr>
              <td>
                <code>--pagination-button-color-disabled</code>
              </td>
              <td>Disabled and ellipsis text color</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
