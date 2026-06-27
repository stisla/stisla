import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/icon-box")({
  component: IconBoxDocs,
});

function IconBoxDocs() {
  return (
    <>
      <header>
        <h1>Icon box</h1>
        <p className="lead">A square, tinted container for a single icon.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          A bare <code>.icon-box</code> renders a muted neutral tile. Use for non-semantic icons in a
          list or row.
        </p>
        <Demo html={`<span class="icon-box"><i data-lucide="zap"></i></span>`} />
      </section>

      <section>
        <h2>Intent variants</h2>
        <p>
          Add an intent modifier like <code>.icon-box--primary</code> for a tinted tile in the
          matching color. The background sits at a 15% tint, the icon holds the solid intent color.
        </p>
        <Demo
          html={`
<span class="icon-box icon-box--primary"><i data-lucide="zap"></i></span>
<span class="icon-box icon-box--success"><i data-lucide="check"></i></span>
<span class="icon-box icon-box--warning"><i data-lucide="clock"></i></span>
<span class="icon-box icon-box--danger"><i data-lucide="triangle-alert"></i></span>
<span class="icon-box icon-box--info"><i data-lucide="info"></i></span>`}
        />
      </section>

      <section>
        <h2>Shape</h2>
        <p>
          Add <code>.icon-box--round</code> for a circle, or <code>.icon-box--square</code> for hard
          corners that ignore the radius token.
        </p>
        <Demo
          html={`
<span class="icon-box icon-box--primary"><i data-lucide="bell"></i></span>
<span class="icon-box icon-box--primary icon-box--round"><i data-lucide="bell"></i></span>
<span class="icon-box icon-box--primary icon-box--square"><i data-lucide="bell"></i></span>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Three sizes. Add <code>.icon-box--sm</code> or <code>.icon-box--lg</code>.
        </p>
        <Demo
          html={`
<span class="icon-box icon-box--primary icon-box--sm"><i data-lucide="zap"></i></span>
<span class="icon-box icon-box--primary"><i data-lucide="zap"></i></span>
<span class="icon-box icon-box--primary icon-box--lg"><i data-lucide="zap"></i></span>`}
        />
      </section>

      <section>
        <h2>Custom color</h2>
        <p>
          For one-off colors outside the shipped intents, set <code>--icon-box-tone</code> inline. The
          bg and icon color both derive from it.
        </p>
        <Demo
          html={`
<span class="icon-box" style="--icon-box-tone: oklch(0.62 0.20 295);"><i data-lucide="sparkles"></i></span>
<span class="icon-box" style="--icon-box-tone: oklch(0.62 0.21 0);"><i data-lucide="heart"></i></span>
<span class="icon-box" style="--icon-box-tone: oklch(0.65 0.13 175);"><i data-lucide="leaf"></i></span>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.icon-box</code> without touching component CSS. Override on
          the element, a parent scope, or <code>:root</code>.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--icon-box-size</code></td><td>Outer square dimension; size modifiers reassign this</td></tr>
            <tr><td><code>--icon-box-icon-size</code></td><td>Inner icon size</td></tr>
            <tr><td><code>--icon-box-radius</code></td><td>Corner radius; <code>--round</code> forces a circle, <code>--square</code> hard corners</td></tr>
            <tr><td><code>--icon-box-tone</code></td><td>Color source the bg and icon derive from; intents reassign this</td></tr>
            <tr><td><code>--icon-box-bg</code></td><td>Background tint</td></tr>
            <tr><td><code>--icon-box-color</code></td><td>Icon color</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
