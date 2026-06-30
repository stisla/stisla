import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/breadcrumb")({
  component: BreadcrumbDocs,
});

function BreadcrumbDocs() {
  return (
    <>
      <header>
        <h1>Breadcrumb</h1>
        <p className="lead">A trail of links showing where the user is inside the page hierarchy.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Wrap an ordered list in a <code>&lt;nav&gt;</code>. Mark the current page with{" "}
          <code>aria-current="page"</code> — it takes the full body color while the trail stays muted.
        </p>
        <Demo
          layout="stack"
          html={`
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb__item"><a href="#">Home</a></li>
    <li class="breadcrumb__item" aria-current="page">Library</li>
  </ol>
</nav>`}
        />
      </section>

      <section>
        <h2>Multiple levels</h2>
        <p>Any number of crumbs work; the default chevron sits between each item.</p>
        <Demo
          layout="stack"
          html={`
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb__item"><a href="#">Home</a></li>
    <li class="breadcrumb__item"><a href="#">Library</a></li>
    <li class="breadcrumb__item" aria-current="page">Data</li>
  </ol>
</nav>`}
        />
      </section>

      <section>
        <h2>With icon</h2>
        <p>
          Drop an <code>&lt;svg&gt;</code> or <code>&lt;i&gt;</code> inside a crumb. It pins to{" "}
          <code>--breadcrumb-icon-size</code> and tracks the crumb's color through hover.
        </p>
        <Demo
          layout="stack"
          html={`
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb__item"><a href="#"><i data-lucide="house"></i><span>Home</span></a></li>
    <li class="breadcrumb__item"><a href="#">Library</a></li>
    <li class="breadcrumb__item" aria-current="page">Data</li>
  </ol>
</nav>`}
        />
      </section>

      <section>
        <h2>String divider</h2>
        <p>
          Override <code>--breadcrumb-divider</code> on the wrapper to swap the chevron for any
          string. Any <code>content</code> value works (string, <code>url()</code>, counter).
        </p>
        <Demo
          layout="stack"
          html={`
<nav style="--breadcrumb-divider: '/';" aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb__item"><a href="#">Home</a></li>
    <li class="breadcrumb__item"><a href="#">Library</a></li>
    <li class="breadcrumb__item" aria-current="page">Data</li>
  </ol>
</nav>`}
        />
      </section>

      <section>
        <h2>Embedded SVG divider</h2>
        <p>
          Use a URL-encoded SVG to drop in any glyph. Bake the stroke or fill tone in hex. Browsers
          parse data-URL SVGs in their own context, so <code>currentColor</code> and CSS vars inside
          the SVG don't track the trail color. Pick a tone that reads in both themes, or use a
          Unicode glyph instead.
        </p>
        <Demo
          layout="stack"
          html={`
<nav style="--breadcrumb-divider: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%228%22 height=%228%22%3E%3Cpath d=%22M0 4h8M5 1l3 3-3 3%22 fill=%22none%22 stroke=%22%23999%22 stroke-width=%221%22/%3E%3C/svg%3E');" aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb__item"><a href="#">Home</a></li>
    <li class="breadcrumb__item"><a href="#">Library</a></li>
    <li class="breadcrumb__item" aria-current="page">Data</li>
  </ol>
</nav>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.breadcrumb</code>. Override on the element, a parent scope, or{" "}
          <code>:root</code>. Set <code>--breadcrumb-bg</code> + padding + radius to wrap the trail in
          a chip.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--breadcrumb-padding-block</code></td><td>Vertical padding around the trail</td></tr>
            <tr><td><code>--breadcrumb-padding-inline</code></td><td>Horizontal padding around the trail</td></tr>
            <tr><td><code>--breadcrumb-gap</code></td><td>Space between crumbs and between divider and text</td></tr>
            <tr><td><code>--breadcrumb-font-size</code></td><td>Crumb text size</td></tr>
            <tr><td><code>--breadcrumb-bg</code></td><td>Background fill (with padding + radius for a chip wrap)</td></tr>
            <tr><td><code>--breadcrumb-radius</code></td><td>Outer corner radius (opt-in for chip wrap)</td></tr>
            <tr><td><code>--breadcrumb-color</code></td><td>Trail color (also paints the divider via currentColor)</td></tr>
            <tr><td><code>--breadcrumb-color-hover</code></td><td>Trail link hover color</td></tr>
            <tr><td><code>--breadcrumb-color-active</code></td><td>Current page color (<code>aria-current="page"</code>)</td></tr>
            <tr><td><code>--breadcrumb-divider</code></td><td>Glyph between crumbs; override on the wrapper or any ancestor</td></tr>
            <tr><td><code>--breadcrumb-icon-size</code></td><td>Leading / trailing icon width and height</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
