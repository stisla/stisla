import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/list-group")({
  component: ListGroupDocs,
});

function ListGroupDocs() {
  return (
    <>
      <header>
        <h1>List group</h1>
        <p className="lead">
          A container that stacks rows on one shared rounded surface.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.list-group</code> to the wrapper and drop{" "}
          <code>.list-group__item</code> rows inside. The item is a plain flex row
          for simple content, so compose it freely and push a trailing value to
          the end with a utility such as <code>.ms-auto</code>. The container owns
          the frame and draws a divider between rows, so each row sits flush while
          the end rows round to the container corners. A leading icon lines up on
          its own. Any list element works (<code>&lt;ul&gt;</code>,{" "}
          <code>&lt;ol&gt;</code>, or a <code>&lt;div&gt;</code>).
        </p>
        <Demo
          layout="stack"
          html={`
<ul class="list-group max-w-sm w-full">
  <li class="list-group__item">
    <i data-lucide="phone"></i>
    <span>Phone</span>
    <span class="ms-auto text-muted-foreground">+62 812 3456 789</span>
  </li>
  <li class="list-group__item">
    <i data-lucide="mail"></i>
    <span>Email</span>
    <span class="ms-auto text-muted-foreground">steven@meridian.com</span>
  </li>
  <li class="list-group__item">
    <i data-lucide="map-pin"></i>
    <span>Location</span>
    <span class="ms-auto text-muted-foreground">San Diego, US</span>
  </li>
</ul>`}
        />
      </section>

      <section>
        <h2>Seamless</h2>
        <p>
          Add <code>.list-group--seamless</code> to drop the outer frame and
          radius while keeping the dividers. Reach for it when the list sits
          inside something that already owns a frame, such as a card body, a
          drawer, or a popover, so the rows blend into the parent surface.
        </p>
        <Demo
          layout="stack"
          html={`
<ul class="list-group list-group--seamless max-w-sm w-full">
  <li class="list-group__item"><span>Subtotal</span><span class="ms-auto text-muted-foreground">$248.00</span></li>
  <li class="list-group__item"><span>Shipping</span><span class="ms-auto text-muted-foreground">$12.00</span></li>
  <li class="list-group__item"><span>Estimated tax</span><span class="ms-auto text-muted-foreground">$20.80</span></li>
  <li class="list-group__item"><span class="font-semibold">Total</span><span class="ms-auto font-semibold">$280.80</span></li>
</ul>`}
        />
      </section>

      <section>
        <h2>Media rows</h2>
        <p>
          When a row needs more than a line of text, use a <code>.media</code>{" "}
          object instead of a plain item. It carries a leading glyph, a title and
          helper line, and a trailing action, and the container flattens and
          divides it the same way. Dropped as a direct child of a{" "}
          <code>.card</code>, the list group sheds its own outer chrome and the
          card owns the frame.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card max-w-xl w-full">
  <div class="card__header">Integrations</div>
  <ul class="list-group">
    <li class="media">
      <span class="media__figure"><span class="icon-box"><i data-lucide="github"></i></span></span>
      <span class="media__content">
        <span class="media__title">GitHub</span>
        <span class="media__description">Sync issues and pull requests into your board.</span>
      </span>
      <span class="media__action"><button type="button" class="button button--outline button--neutral button--sm">Disconnect</button></span>
    </li>
    <li class="media">
      <span class="media__figure"><span class="icon-box"><i data-lucide="slack"></i></span></span>
      <span class="media__content">
        <span class="media__title">Slack</span>
        <span class="media__description">Post deploy and incident alerts to a channel.</span>
      </span>
      <span class="media__action"><button type="button" class="button button--outline button--neutral button--sm">Disconnect</button></span>
    </li>
    <li class="media">
      <span class="media__figure"><span class="icon-box"><i data-lucide="hard-drive"></i></span></span>
      <span class="media__content">
        <span class="media__title">Google Drive</span>
        <span class="media__description">Attach files from Drive to any record.</span>
      </span>
      <span class="media__action"><button type="button" class="button button--primary button--sm">Connect</button></span>
    </li>
  </ul>
</div>`}
        />
      </section>

      <section>
        <h2>Single choice</h2>
        <p>
          Give each row <code>.media--selectable</code> and wrap it in a{" "}
          <code>&lt;label&gt;</code> around a native <code>.radio</code>, and the
          whole list becomes a choice group. The selected row fills and rings in
          the accent color; where two selected rows sit next to each other, their
          borders collapse into a single shared divider.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="list-group max-w-md w-full" role="radiogroup" aria-label="Plan">
  <label class="media media--selectable">
    <span class="media__figure"><span class="icon-box"><i data-lucide="sprout"></i></span></span>
    <span class="media__content">
      <span class="media__title">Starter</span>
      <span class="media__description">For a solo project getting off the ground.</span>
    </span>
    <span class="media__action">
      <span class="font-semibold">$0</span>
      <input class="radio" type="radio" name="plan" aria-label="Starter">
    </span>
  </label>
  <label class="media media--selectable">
    <span class="media__figure"><span class="icon-box icon-box--primary"><i data-lucide="rocket"></i></span></span>
    <span class="media__content">
      <span class="media__title">Pro</span>
      <span class="media__description">For a growing team shipping every week.</span>
    </span>
    <span class="media__action">
      <span class="font-semibold">$29</span>
      <input class="radio" type="radio" name="plan" checked aria-label="Pro">
    </span>
  </label>
  <label class="media media--selectable">
    <span class="media__figure"><span class="icon-box"><i data-lucide="building-2"></i></span></span>
    <span class="media__content">
      <span class="media__title">Business</span>
      <span class="media__description">SSO, audit logs, and priority support.</span>
    </span>
    <span class="media__action">
      <span class="font-semibold">$99</span>
      <input class="radio" type="radio" name="plan" aria-label="Business">
    </span>
  </label>
</div>`}
        />
      </section>

      <section>
        <h2>Multiple choice</h2>
        <p>
          Swap the radio for a <code>.checkbox</code> and the same selectable rows
          take many selections at once. A row whose control is{" "}
          <code>disabled</code> dims and stops responding while the rest stay
          live.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="list-group max-w-md w-full" role="group" aria-label="Deploy regions">
  <label class="media media--selectable">
    <span class="media__figure"><span class="icon-box icon-box--success"><i data-lucide="globe"></i></span></span>
    <span class="media__content">
      <span class="media__title">US East</span>
      <span class="media__meta">Virginia · 12 ms</span>
    </span>
    <span class="media__action"><input class="checkbox" type="checkbox" checked aria-label="US East"></span>
  </label>
  <label class="media media--selectable">
    <span class="media__figure"><span class="icon-box icon-box--success"><i data-lucide="globe"></i></span></span>
    <span class="media__content">
      <span class="media__title">EU West</span>
      <span class="media__meta">Ireland · 38 ms</span>
    </span>
    <span class="media__action"><input class="checkbox" type="checkbox" checked aria-label="EU West"></span>
  </label>
  <label class="media media--selectable">
    <span class="media__figure"><span class="icon-box"><i data-lucide="globe"></i></span></span>
    <span class="media__content">
      <span class="media__title">Asia Pacific</span>
      <span class="media__meta">Coming soon</span>
    </span>
    <span class="media__action"><input class="checkbox" type="checkbox" disabled aria-label="Asia Pacific"></span>
  </label>
</div>`}
        />
      </section>

      <section>
        <h2>Horizontal</h2>
        <p>
          Use <code>.list-group--horizontal</code> to lay rows side by side; the
          divider moves from the row top to the row start. Pair it with{" "}
          <code>.media--vertical</code> rows for a divided metric strip. Add a
          breakpoint suffix (<code>-sm</code> through <code>-2xl</code>) to switch
          to the row layout only above that width.
        </p>
        <Demo
          html={`
<ul class="list-group list-group--horizontal w-full">
  <li class="media media--vertical flex-1">
    <span class="media__meta">Revenue</span>
    <span class="media__title text-2xl">$48.2k</span>
    <span class="media__description text-success">+12.4%</span>
  </li>
  <li class="media media--vertical flex-1">
    <span class="media__meta">Orders</span>
    <span class="media__title text-2xl">1,284</span>
    <span class="media__description text-success">+3.1%</span>
  </li>
  <li class="media media--vertical flex-1">
    <span class="media__meta">Refunds</span>
    <span class="media__title text-2xl">27</span>
    <span class="media__description text-danger">+0.8%</span>
  </li>
</ul>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.list-group</code>. Override on the root or
          any wrapper. To keep the frame but drop the rules between rows, set{" "}
          <code>--list-group-divider-color</code> to <code>transparent</code>. Row
          internals belong to the media component, so reach for the{" "}
          <code>--media-*</code> variables to restyle the rows themselves.
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
                <code>--list-group-bg</code>
              </td>
              <td>Frame background</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-border-color</code>
              </td>
              <td>Outer frame border color</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-border-width</code>
              </td>
              <td>Outer frame border thickness</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-radius</code>
              </td>
              <td>Outer corner radius; the end rows round to match</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-divider-color</code>
              </td>
              <td>Rule between adjacent rows</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-gap</code>
              </td>
              <td>Gap between parts of a plain item row</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-icon-size</code>
              </td>
              <td>Size of a leading icon in a plain item row</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-padding-block</code>
              </td>
              <td>Row vertical padding</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-padding-inline</code>
              </td>
              <td>Row horizontal padding</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-bg-active</code>
              </td>
              <td>Fill of the current or selected row</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-disabled-opacity</code>
              </td>
              <td>Dimming applied to a disabled row</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
