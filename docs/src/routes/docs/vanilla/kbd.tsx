import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/kbd")({
  component: KbdDocs,
});

function KbdDocs() {
  return (
    <>
      <header>
        <h1>Kbd</h1>
        <p className="lead">A chip that labels a keyboard key or shortcut.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.kbd</code> to a <code>&lt;kbd&gt;</code> (or any inline element) for the key-cap
          look: the neutral fill with a hairline rim and a faint bottom edge.
        </p>
        <Demo html={`<kbd class="kbd">?</kbd>`} />
      </section>

      <section>
        <h2>Combinations</h2>
        <p>
          Nest <code>.kbd</code> elements to spell out a shortcut. The outer wrapper drops its chrome
          and lays each inner cap out as its own chip with a small gap.
        </p>
        <Demo
          layout="row"
          html={`
<kbd class="kbd"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></kbd>
<kbd class="kbd"><kbd class="kbd">Ctrl</kbd><kbd class="kbd">Shift</kbd><kbd class="kbd">P</kbd></kbd>
<kbd class="kbd"><kbd class="kbd">⇧</kbd><kbd class="kbd">Enter</kbd></kbd>`}
        />
        <p>
          Add a <code>+</code> between caps if the shortcut needs spelling out for screen readers.
          The plus sits as a flex item between the chips.
        </p>
        <Demo html={`<kbd class="kbd"><kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">C</kbd></kbd>`} />
      </section>

      <section>
        <h2>In running text</h2>
        <p>
          Inside <code>.prose</code>, bare <code>&lt;kbd&gt;</code> picks up the chip without a class
          so shortcut hints in long-form copy keep semantic markup. The chip's font size scales from
          the surrounding text, so it shrinks in small copy and grows in headings.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="prose">
  <p>Press <kbd>?</kbd> on any docs page to open the shortcut sheet, or hit <kbd><kbd>⌘</kbd><kbd>K</kbd></kbd> to jump to search.</p>
</div>`}
        />
      </section>

      <section>
        <h2>Inside a button</h2>
        <p>
          Pair a chip with a button label so the shortcut sits alongside the action. The chip keeps
          its own background so it stays legible on top of solid intents.
        </p>
        <Demo
          html={`
<button type="button" class="button button--neutral">Search <kbd class="kbd">/</kbd></button>
<button type="button" class="button button--outline button--neutral">Command palette <kbd class="kbd"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></kbd></button>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.kbd</code> without touching component CSS. Override on the
          element, a parent scope, or <code>:root</code>.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--kbd-padding-block</code></td><td>Top and bottom padding</td></tr>
            <tr><td><code>--kbd-padding-inline</code></td><td>Left and right padding</td></tr>
            <tr><td><code>--kbd-gap</code></td><td>Space between the label and a leading or trailing icon</td></tr>
            <tr><td><code>--kbd-font-size</code></td><td>Cap text size</td></tr>
            <tr><td><code>--kbd-font-weight</code></td><td>Cap text weight</td></tr>
            <tr><td><code>--kbd-color</code></td><td>Cap text color</td></tr>
            <tr><td><code>--kbd-bg</code></td><td>Cap background</td></tr>
            <tr><td><code>--kbd-radius</code></td><td>Corner radius</td></tr>
            <tr><td><code>--kbd-rim</code></td><td>Border + bottom-edge color; same recipe as <code>.button--neutral</code> so the rim stays visible in both themes</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
