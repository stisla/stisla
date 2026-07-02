import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/avatar")({
  component: AvatarDocs,
});

function AvatarDocs() {
  return (
    <>
      <header>
        <h1>Avatar</h1>
        <p className="lead">A portrait slot with a graceful fallback for missing or broken images.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Tag the root with <code>data-stisla-avatar</code> and the behavior layer preloads the source
          via <code>new Image()</code>, revealing the real <code>&lt;img&gt;</code> only on a confirmed
          load and flipping <code>data-status</code> through <code>loading</code> &rarr;{" "}
          <code>loaded</code> / <code>error</code>. The fallback paints underneath the whole time. For a
          known-good static image with no JS, set <code>data-status="loaded"</code> on the root directly.
          Drop text directly into <code>.avatar</code> for the no-image case: a plain neutral tile with
          the content centered. The default shape is a rounded square.
        </p>
        <Demo
          html={`
<span class="avatar">RF</span>
<span class="avatar">NA</span>
<span class="avatar"><i data-lucide="user"></i></span>`}
        />
      </section>

      <section>
        <h2>Image with fallback</h2>
        <p>
          Add a <code>.avatar__image</code> and a <code>.avatar__fallback</code> inside{" "}
          <code>.avatar</code>, and tag the root with <code>data-stisla-avatar</code>. The JS preloads
          the source and only reveals the real <code>&lt;img&gt;</code> after a confirmed load. The
          fallback paints underneath the whole time, so a slow network shows a styled tile instead of a
          broken-image icon.
        </p>
        <Demo
          html={`
<span class="avatar" data-stisla-avatar>
  <img class="avatar__image" src="https://i.pravatar.cc/96?img=12" alt="Rafiq">
  <span class="avatar__fallback">RF</span>
</span>
<span class="avatar" data-stisla-avatar>
  <img class="avatar__image" src="https://i.pravatar.cc/96?img=32" alt="Nauval">
  <span class="avatar__fallback">NA</span>
</span>
<span class="avatar" data-stisla-avatar>
  <img class="avatar__image" src="https://i.pravatar.cc/96?img=48" alt="Ida">
  <span class="avatar__fallback">ID</span>
</span>`}
        />
      </section>

      <section>
        <h2>Broken source</h2>
        <p>
          If the image fails (404, CORS, blocked domain) the root flips to{" "}
          <code>data-status="error"</code> and the fallback stays visible. The broken{" "}
          <code>&lt;img&gt;</code> never paints because the reveal CSS only fires on{" "}
          <code>data-status="loaded"</code>.
        </p>
        <Demo
          html={`
<span class="avatar" data-stisla-avatar>
  <img class="avatar__image" src="https://example.invalid/nope.png" alt="">
  <span class="avatar__fallback">NA</span>
</span>
<span class="avatar avatar--circle" data-stisla-avatar>
  <img class="avatar__image" src="https://example.invalid/nope.png" alt="">
  <span class="avatar__fallback"><i data-lucide="user"></i></span>
</span>`}
        />
      </section>

      <section>
        <h2>Circle</h2>
        <p>
          Add <code>.avatar--circle</code> for a circle. Default is rounded square to match the
          Stisla surface vocabulary.
        </p>
        <Demo
          html={`
<span class="avatar avatar--circle" data-stisla-avatar>
  <img class="avatar__image" src="https://i.pravatar.cc/96?img=15" alt="">
  <span class="avatar__fallback">RF</span>
</span>
<span class="avatar avatar--circle">NA</span>
<span class="avatar avatar--circle"><i data-lucide="user"></i></span>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Four sizes: <code>.avatar--sm</code>, default, <code>.avatar--lg</code>, and{" "}
          <code>.avatar--xl</code>. Each retunes <code>--avatar-size</code> and{" "}
          <code>--avatar-font-size</code> off the spacing scale.
        </p>
        <Demo
          html={`
<span class="avatar avatar--sm">SM</span>
<span class="avatar">MD</span>
<span class="avatar avatar--lg">LG</span>
<span class="avatar avatar--xl">XL</span>`}
        />
      </section>

      <section>
        <h2>Indicator</h2>
        <p>
          Pin a <code>.avatar__indicator</code> child to a corner for a status dot, unread count, or
          verified mark. Default position is bottom-end; add <code>.avatar__indicator--top</code> for
          top-end. Default tone is success; override <code>--avatar-indicator-bg</code> for any intent.
        </p>
        <Demo
          html={`
<span class="avatar" data-stisla-avatar>
  <img class="avatar__image" src="https://i.pravatar.cc/96?img=22" alt="">
  <span class="avatar__fallback">RF</span>
  <span class="avatar__indicator"></span>
</span>
<span class="avatar" data-stisla-avatar>
  <img class="avatar__image" src="https://i.pravatar.cc/96?img=33" alt="">
  <span class="avatar__fallback">NA</span>
  <span class="avatar__indicator" style="--avatar-indicator-bg: var(--color-muted-foreground);"></span>
</span>
<span class="avatar" data-stisla-avatar>
  <img class="avatar__image" src="https://i.pravatar.cc/96?img=44" alt="">
  <span class="avatar__fallback">ID</span>
  <span class="avatar__indicator avatar__indicator--top avatar__indicator--lg" style="--avatar-indicator-bg: var(--color-danger); --avatar-indicator-color: var(--color-danger-foreground);">3</span>
</span>
<span class="avatar" data-stisla-avatar>
  <img class="avatar__image" src="https://i.pravatar.cc/96?img=55" alt="">
  <span class="avatar__fallback">BS</span>
  <span class="avatar__indicator avatar__indicator--xl" style="--avatar-indicator-bg: var(--color-info); --avatar-indicator-color: var(--color-info-foreground);"><i data-lucide="check"></i></span>
</span>`}
        />
      </section>

      <section>
        <h2>Loading state</h2>
        <p>
          While the source is in flight, the root carries <code>data-status="loading"</code>; the
          fallback paints until the load completes. Set <code>data-stisla-avatar-delay</code> to hold
          that state for a fixed time (here 1.5&nbsp;s) for FOUC tuning or tests.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex items-center gap-3">
  <span class="avatar" data-stisla-avatar data-stisla-avatar-delay="1500">
    <img class="avatar__image" src="https://i.pravatar.cc/96?img=64" alt="">
    <span class="avatar__fallback">…</span>
  </span>
  <p class="m-0 text-muted-foreground">Source reveals after a 1.5 s artificial delay.</p>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          <code>stisla:avatar:changed</code> fires on the avatar root whenever its load status flips.
          The <code>detail.status</code> field carries the new value (<code>"loading"</code>,{" "}
          <code>"loaded"</code>, or <code>"error"</code>). Use it to log image failures, swap to a
          different source on error, or sequence the next step in a load orchestration.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the avatar root and the indicator. Override on the element, a parent
          scope, or <code>:root</code>. For the stacked-cluster variant, see Avatar group.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--avatar-size</code></td><td>Square side length; size modifiers retune this</td></tr>
            <tr><td><code>--avatar-radius</code></td><td>Corner radius; <code>.avatar--circle</code> flips it to a full circle</td></tr>
            <tr><td><code>--avatar-bg</code></td><td>Tile background, the canvas the fallback paints over</td></tr>
            <tr><td><code>--avatar-color</code></td><td>Fallback text color</td></tr>
            <tr><td><code>--avatar-font-size</code></td><td>Fallback font size (icons scale to 1em)</td></tr>
            <tr><td><code>--avatar-font-weight</code></td><td>Fallback font weight</td></tr>
            <tr><td><code>--avatar-ring-width</code></td><td>Outline width; <code>.avatar-group</code> raises this so stacked members separate</td></tr>
            <tr><td><code>--avatar-ring-color</code></td><td>Outline color; the group publishes this</td></tr>
          </tbody>
        </table>
        <p>Indicator variables, defined on <code>.avatar__indicator</code>:</p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--avatar-indicator-size</code></td><td>Pip diameter; size modifiers retune this</td></tr>
            <tr><td><code>--avatar-indicator-bg</code></td><td>Pip fill; override for danger / info / muted</td></tr>
            <tr><td><code>--avatar-indicator-color</code></td><td>Pip text/icon color</td></tr>
            <tr><td><code>--avatar-indicator-font-size</code></td><td>Digit / icon size inside the pip</td></tr>
            <tr><td><code>--avatar-indicator-ring-width</code></td><td>Ring punching the pip out of the avatar surface</td></tr>
            <tr><td><code>--avatar-indicator-ring-color</code></td><td>Ring color; matches the page background</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
