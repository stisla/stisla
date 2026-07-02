import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/illustration")({
  component: IllustrationDocs,
});

/* A minimal demonstrative spot illustration: a rounded object on a soft disc, a corner badge, shaded
 * from one accent via the .il-* paint hooks. Each instance needs a unique gradient id. The full
 * metaphor set + gallery are a separate effort; this single piece shows the recolouring contract. */
const art = (cls: string, id: string) => `
<svg class="illustration ${cls}" viewBox="0 0 200 200" role="img" aria-label="Spot illustration">
  <defs>
    <linearGradient id="${id}" x1="0.15" y1="0.1" x2="0.85" y2="0.95">
      <stop class="il-g0" offset="0"></stop>
      <stop class="il-g1" offset="0.4"></stop>
      <stop class="il-g2" offset="0.78"></stop>
      <stop class="il-g3" offset="1"></stop>
    </linearGradient>
  </defs>
  <circle class="il-disc-o" cx="100" cy="100" r="86"></circle>
  <circle class="il-disc-i" cx="100" cy="100" r="66"></circle>
  <rect class="il-obj" x="58" y="56" width="84" height="84" rx="19" fill="url(#${id})"></rect>
  <circle class="il-badge" cx="150" cy="52" r="15" fill="var(--_b)"></circle>
</svg>`;

function IllustrationDocs() {
  return (
    <>
      <header>
        <h1>Illustration</h1>
        <p className="lead">
          Soft volumetric spot art shaded from a single accent hue.
        </p>
      </header>

      <section>
        <h2>Intents</h2>
        <p>
          An <code>.illustration</code> is an inline SVG whose gradient stops,
          backing disc, and long shadow all derive from one accent via{" "}
          <code>color-mix</code>, so recolouring never touches the markup: set{" "}
          <code>--illus-accent</code> (and <code>--illus-badge</code> for the
          corner pip) and the whole piece follows. An ancestor or inline accent
          overrides everything. The art below is one demonstrative piece — the
          full metaphor set and gallery are a separate effort. The default is a
          neutral gray. <code>.illustration--primary</code>,{" "}
          <code>--success</code>, <code>--danger</code>, and{" "}
          <code>--warning</code> reshade the whole piece from the matching
          token.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-wrap items-end gap-5">
  <div class="w-28">${art("", "illo-default")}</div>
  <div class="w-28">${art("illustration--primary", "illo-primary")}</div>
  <div class="w-28">${art("illustration--success", "illo-success")}</div>
  <div class="w-28">${art("illustration--danger", "illo-danger")}</div>
  <div class="w-28">${art("illustration--warning", "illo-warning")}</div>
</div>`}
        />
      </section>

      <section>
        <h2>Custom accent</h2>
        <p>
          Set <code>--illus-accent</code> on the SVG or any ancestor for an
          arbitrary hue, and <code>--illus-badge</code> to give the corner pip
          its own colour.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-wrap items-end gap-5">
  <div class="w-28" style="--illus-accent: var(--color-info)">${art("", "illo-info")}</div>
  <div class="w-28" style="--illus-accent: var(--color-primary); --illus-badge: var(--color-success)">${art("", "illo-mix")}</div>
</div>`}
        />
      </section>

      <section>
        <h2>Animated</h2>
        <p>
          Add <code>.illustration--animated</code> for a gentle float on the
          object and a pop on the badge. It is suppressed under reduced motion.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="w-32">${art("illustration--animated illustration--primary", "illo-animate")}</div>`}
        />
      </section>

      <section>
        <h2>In an empty state</h2>
        <p>
          Drop an illustration into an <code>.empty-state__media</code> slot;
          the slot sheds its circle so the art isn't double-framed and caps the
          width.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="empty-state">
  <span class="empty-state__media">${art("illustration--primary size-20", "illo-empty")}</span>
  <h3 class="empty-state__title">Nothing here yet</h3>
  <p class="empty-state__text">Create your first project to get started.</p>
  <div class="empty-state__action">
    <button class="button button--primary">New project</button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the art. Set them on the SVG or any ancestor.
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
                <code>--illus-accent</code>
              </td>
              <td>
                The single hue the whole piece shades from (the intent modifiers
                set this)
              </td>
            </tr>
            <tr>
              <td>
                <code>--illus-badge</code>
              </td>
              <td>Corner pip colour (follows the accent by default)</td>
            </tr>
          </tbody>
        </table>
        <p>
          The SVG markup carries the paint hooks: <code>.il-g0</code>–
          <code>.il-g3</code> (gradient stops), <code>.il-disc-o</code> /{" "}
          <code>.il-disc-i</code> (backing disc), <code>.il-obj</code> (the
          shadowed object), and <code>.il-badge</code> (the pip).
        </p>
      </section>
    </>
  );
}
