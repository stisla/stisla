import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Code } from "~/demo/Code";

export const Route = createFileRoute("/docs/vanilla/javascript")({
  component: JavaScriptDocs,
});

function JavaScriptDocs() {
  return (
    <>
      <header>
        <h1>JavaScript</h1>
        <p className="lead">A small vanilla runtime drives every interactive component. Mark up the HTML, load the bundle, and the runtime does the rest.</p>
      </header>

      <section>
        <h2>How it boots</h2>
        <p>Importing <code>@stisla/vanilla</code> (or loading <code>stisla.js</code> from the CDN snippet on the <Link to="/docs/vanilla/installation" className="link">Installation</Link> page) does three things at startup.</p>
        <ul>
          <li>Registers every component class that ships in the bundle.</li>
          <li>Exposes them on <code>window.Stisla</code>, so any of them is reachable as <code>Stisla.Dialog</code>, <code>Stisla.Toast</code>, and so on.</li>
          <li>Walks the document on the next microtask and wires up anything marked with a <code>data-stisla-*</code> attribute.</li>
        </ul>
        <p>There is no <code>init()</code> call to make at startup. If the markup is already in the page when the bundle loads, the runtime finds it.</p>
      </section>

      <section>
        <h2>What it&rsquo;s built on</h2>
        <p>The runtime is around 600 lines of our own code plus a few vendored primitives for the hard parts. No jQuery, no Bootstrap JS, no framework runtime.</p>
        <table>
          <thead><tr><th>Library</th><th>Used by</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td><a className="link" href="https://floating-ui.com/" target="_blank" rel="noopener noreferrer">Floating UI</a></td><td>menu, popover, tooltip</td><td>Position calculation for floating elements (collision detection, placement flips, arrow rendering)</td></tr>
            <tr><td><a className="link" href="https://focus-trap.github.io/focus-trap/" target="_blank" rel="noopener noreferrer">focus-trap</a></td><td>dialog, drawer</td><td>Keyboard focus containment inside overlays</td></tr>
            <tr><td><a className="link" href="https://www.embla-carousel.com/" target="_blank" rel="noopener noreferrer">Embla</a></td><td>carousel (optional)</td><td>Touch-friendly scroll mechanics. Lives in the optional bundle</td></tr>
            <tr><td><a className="link" href="https://kingsora.github.io/OverlayScrollbars/" target="_blank" rel="noopener noreferrer">OverlayScrollbars</a></td><td>scroll-area (optional)</td><td>Custom-styled scrollbars that overlay the content without taking layout space</td></tr>
            <tr><td><code>tabbable</code></td><td>focus-trap, sidebar dismiss</td><td>Walks the focusable tree. Tiny shared utility</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Declarative usage</h2>
        <p>The runtime is driven mostly from HTML. Mark a component root with <code>data-stisla-&lt;name&gt;</code>, give its triggers and dismissers their matching attributes, and the scanner wires the behavior on first paint.</p>
        <Code code={`
<button type="button" class="btn btn--primary" data-stisla-dialog-trigger="hello">
  Open
</button>

<div class="dialog" id="hello" data-stisla-dialog data-state="closed" role="dialog" aria-modal="true" tabindex="-1">
  <div class="dialog__backdrop" data-stisla-dialog-dismiss></div>
  <div class="dialog__content">
    <div class="dialog__body">Hello.</div>
  </div>
</div>
`} />
        <p>Every component page documents the attributes it understands. Options serialize as per-attribute kebab-case (<code>data-stisla-dialog-close-on-backdrop="false"</code>), or as a single JSON blob on <code>data-stisla-opts</code> for values that don&rsquo;t fit cleanly in an attribute.</p>
      </section>

      <section>
        <h2>Programmatic usage</h2>
        <p>If you need a handle to open from JS, listen for events, or destroy on unmount, construct the class directly. Each component class is also a named export on the bundle.</p>
        <Code lang="js" code={`
const dialog = new Stisla.Dialog(document.getElementById('hello'));
dialog.open();
dialog.el.addEventListener('stisla:dialog:closed', () => {
  // ...
});
`} />
        <p>The same class is what the declarative path constructs under the hood. Instances created either way share the same API and the same event surface.</p>
      </section>

      <section>
        <h2>Re-scanning</h2>
        <p>The initial scan runs once per page load. For dynamic content like SPA route changes, AJAX-injected fragments, or server-streamed HTML, call <code>Stisla.init()</code> against the affected subtree to wire up anything new. The scanner is idempotent, so elements that already have an instance are skipped.</p>
        <Code lang="js" code={`
// After fetching and inserting HTML into a container:
Stisla.init(document.getElementById('panel'));
`} />
        <p>Calling <code>Stisla.init()</code> with no argument re-scans the whole document. Prefer scoping it to the inserted subtree when you can; it&rsquo;s cheaper and avoids touching nodes you didn&rsquo;t change.</p>
      </section>

      <section>
        <h2>React and other SPA frameworks</h2>
        <p>For React apps, use <code>@stisla/react</code>. It exposes components as idiomatic React with props, refs, and controlled state. See the React component pages for usage. When you need the vanilla layer directly (mixed apps, quick integrations, or before a React wrapper exists for a component), the vanilla classes work from inside <code>useEffect</code>: construct on mount, destroy on cleanup.</p>
        <Code lang="jsx" code={`
import { useEffect, useRef } from 'react';
import { Dialog } from '@stisla/vanilla';

function HelloDialog() {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = new Dialog(ref.current);
    const onOpened = (e) => console.log('opened', e.detail);
    ref.current.addEventListener('stisla:dialog:opened', onOpened);
    return () => {
      ref.current?.removeEventListener('stisla:dialog:opened', onOpened);
      dialog.destroy();
    };
  }, []);

  return (
    <div ref={ref} className="dialog" data-state="closed" role="dialog" aria-modal="true" tabIndex={-1}>
      <div className="dialog__backdrop" data-stisla-dialog-dismiss />
      <div className="dialog__content">
        <div className="dialog__body">Hello.</div>
      </div>
    </div>
  );
}
`} />
        <p>There is no <code>onOpened</code>-style prop yet, so attach listeners with <code>addEventListener</code> against the root element and remove them on cleanup. The constructor auto-destroys any prior instance on the same element, which keeps React&rsquo;s StrictMode double-mount safe. Vue, Svelte, and Solid follow the same shape with their own lifecycle hooks.</p>

        <h3>What works</h3>
        <ul>
          <li>Construct, listen, and destroy from a <code>useEffect</code> against a stable ref.</li>
          <li>Pass options to the constructor as a second argument. They replace the per-attribute <code>data-stisla-*</code> path.</li>
          <li>Call <code>Stisla.init(ref.current)</code> after rendering server-fetched HTML that already carries <code>data-stisla-*</code> markup. The scanner skips elements that already have an instance, so it&rsquo;s safe to call repeatedly.</li>
          <li>Render the markup on the server. The runtime guards <code>document</code> access, so importing the bundle is fine in SSR; instances are only constructed once the effect fires on the client.</li>
        </ul>

        <h3>What to watch</h3>
        <ul>
          <li>Some components mutate DOM outside their own subtree. Popover and tooltip portal into <code>body</code>; dialog and drawer set <code>inert</code> on siblings. React does not know about those mutations, so keep the component mounted for its full lifetime rather than toggling it through a parent rerender.</li>
          <li>Open and close state lives on the instance, which toggles <code>data-state</code> on the root. To drive it from React state, call <code>instance.open()</code> and <code>instance.close()</code> from a <code>useEffect</code> keyed on your value. Don&rsquo;t conditionally unmount the root, or the instance dies with it.</li>
          <li>The scanner has no <code>destroyAll(root)</code> counterpart. If you used <code>Stisla.init(root)</code> over a subtree, walk that same subtree on cleanup and call <code>Stisla.get(el).destroy()</code> on each one you wired up.</li>
          <li>This path works for most cases. For new React projects, <code>@stisla/react</code> is the better fit since it exposes components with proper props, refs, and controlled state without the manual wiring.</li>
        </ul>
      </section>
    </>
  );
}
