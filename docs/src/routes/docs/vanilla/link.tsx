import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/link")({
  component: LinkDocs,
});

function LinkDocs() {
  return (
    <>
      <header>
        <h1>Link</h1>
        <p className="lead">
          An inline anchor with the primary color, underline, and hover tint.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.link</code> to an <code>&lt;a&gt;</code> in app UI. Reboot
          strips anchor styling globally so a bare <code>&lt;a&gt;</code>{" "}
          renders as inherited text; <code>.link</code> opts back into the
          primary-colored underline.
        </p>
        <Demo
          layout="row"
          html={`<p>Settings have moved under <a class="link" href="#">Workspace preferences</a>.</p>`}
        />
      </section>

      <section>
        <h2>With icon</h2>
        <p>
          The link is an inline flex row, so a leading or trailing icon lines up
          with the label and picks up the link color.
        </p>
        <Demo
          html={`
<a class="link" href="#">Documentation <i data-lucide="arrow-up-right"></i></a>
<a class="link" href="#"><i data-lucide="external-link"></i> Open in new tab</a>`}
        />
      </section>

      <section>
        <h2>Retune color</h2>
        <p>
          Override <code>--link-color</code> on the element, a parent scope, or{" "}
          <code>:root</code>. The hover color derives from{" "}
          <code>--link-color</code> by default, so a single override moves both
          states. Set <code>--link-color-hover</code> directly to break that
          derivation.
        </p>
        <Demo
          layout="stack"
          html={`
<p>
  Pair tone with intent.
  <a class="link" style="--link-color: var(--color-success);" href="#">Backup succeeded</a>,
  <a class="link" style="--link-color: var(--color-danger);" href="#">three checks failed</a>,
  <a class="link" style="--link-color: var(--color-warning);" href="#">two queued</a>.
</p>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.link</code>. The hover color resolves
          from <code>--link-color</code> at component definition, so overriding
          the color auto-moves the hover.
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
                <code>--link-color</code>
              </td>
              <td>Resting text color and the source for the hover mix</td>
            </tr>
            <tr>
              <td>
                <code>--link-gap</code>
              </td>
              <td>Space between the label and a leading or trailing icon</td>
            </tr>
            <tr>
              <td>
                <code>--link-decoration-offset</code>
              </td>
              <td>Distance between the baseline and the underline</td>
            </tr>
            <tr>
              <td>
                <code>--link-decoration-thickness</code>
              </td>
              <td>Underline weight</td>
            </tr>
            <tr>
              <td>
                <code>--link-color-hover</code>
              </td>
              <td>
                Hover color; derives from <code>--link-color</code> by default,
                override to pin a literal
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
