import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/navbar")({
  component: NavbarDocs,
});

function NavbarDocs() {
  return (
    <>
      <header>
        <h1>Navbar</h1>
        <p className="lead">A top bar of brand, navigation, and trailing actions that folds on small screens.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          The <code>.navbar</code> lays out a <code>.navbar__brand</code>, a{" "}
          <code>.navbar__menu</code> wrapping the <code>.navbar__nav</code> link list, and any trailing
          extras in a flex row. The nav sits on the leading edge and the extras (here an action button)
          trail. Mark the current page with <code>data-state="active"</code> on its{" "}
          <code>.navbar__button</code>, and fade an unreachable one with <code>aria-disabled</code>.
          This bar carries <code>.navbar--expand</code>, which keeps it horizontal at every width.
        </p>
        <Demo
          layout="stack"
          html={`
<nav class="navbar navbar--block navbar--expand" aria-label="Main">
  <a class="navbar__brand" href="#">Stisla</a>
  <div class="navbar__menu">
    <ul class="navbar__nav">
      <li><a class="navbar__button" href="#" data-state="active">Dashboard</a></li>
      <li><a class="navbar__button" href="#">Reports</a></li>
      <li><a class="navbar__button" href="#">Settings</a></li>
      <li><a class="navbar__button" aria-disabled="true">Admin</a></li>
    </ul>
    <button class="button button--primary button--sm">New report</button>
  </div>
</nav>`}
        />
      </section>

      <section>
        <h2>Responsive fold</h2>
        <p>
          A plain <code>.navbar</code> folds into a column behind the <code>.navbar__toggle</code>{" "}
          hamburger below the <code>lg</code> breakpoint (64rem), and rides as a horizontal row above
          it. Put <code>data-stisla-navbar</code> on the root and <code>data-stisla-navbar-toggle</code>{" "}
          on the hamburger, and the <code>@stisla/vanilla</code> layer animates the fold. The demo
          frame is narrower than <code>lg</code>, so the bar is folded — click the hamburger to toggle
          the menu.
        </p>
        <Demo
          layout="stack"
          html={`
<nav class="navbar navbar--block" data-stisla-navbar aria-label="Main">
  <a class="navbar__brand" href="#">Stisla</a>
  <button class="navbar__toggle" data-stisla-navbar-toggle aria-label="Toggle menu" aria-expanded="false"><i data-lucide="menu"></i></button>
  <div class="navbar__menu" data-state="closed">
    <ul class="navbar__nav">
      <li><a class="navbar__button" href="#" data-state="active">Dashboard</a></li>
      <li><a class="navbar__button" href="#">Reports</a></li>
      <li><a class="navbar__button" href="#">Settings</a></li>
    </ul>
    <button class="button button--primary button--sm">New report</button>
  </div>
</nav>`}
        />
        <p>
          Move the fold point with the <code>.navbar--expand-*</code> modifiers, named after the width
          at which the bar expands to a row (like a <code>md:</code> utility): <code>--expand-sm</code>,{" "}
          <code>--expand-md</code>, <code>--expand-lg</code>, or <code>--expand-xl</code>. Plain{" "}
          <code>.navbar</code> matches <code>--expand-lg</code>; <code>.navbar--expand</code> never
          folds.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>These variables retune the navbar. Override on the root or any wrapper.</p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--navbar-gap</code></td><td>Gap between brand, menu, and extras</td></tr>
            <tr><td><code>--navbar-padding-block</code> / <code>-padding-inline</code></td><td>Bar interior padding (inline zeroes out when wrapping a <code>.container</code>)</td></tr>
            <tr><td><code>--navbar-bg</code> / <code>-color</code></td><td>Bar background and text</td></tr>
            <tr><td><code>--navbar-button-height</code></td><td>Brand, toggle, and button chip height</td></tr>
            <tr><td><code>--navbar-button-padding-block</code> / <code>-button-padding-inline</code></td><td>Button chip padding</td></tr>
            <tr><td><code>--navbar-button-radius</code></td><td>Button and toggle corner radius</td></tr>
            <tr><td><code>--navbar-button-gap</code></td><td>Gap between nav links</td></tr>
            <tr><td><code>--navbar-button-color</code></td><td>Resting link text</td></tr>
            <tr><td><code>--navbar-button-bg-hover</code> / <code>-button-color-hover</code></td><td>Hover / focus paint (accent)</td></tr>
            <tr><td><code>--navbar-button-bg-active</code> / <code>-button-color-active</code></td><td>Current-page paint (highlight)</td></tr>
            <tr><td><code>--navbar-brand-padding-inline</code></td><td>Brand inline inset (set 0 for a flush brand)</td></tr>
            <tr><td><code>--navbar-toggle-size</code></td><td>Hamburger button size</td></tr>
            <tr><td><code>--navbar-transition-duration</code></td><td>Hover and active timing; near-zeroed under reduced-motion</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
