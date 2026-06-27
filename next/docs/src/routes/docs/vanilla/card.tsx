import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/card")({
  component: CardDocs,
});

const IMG_LANDSCAPE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=70";
const IMG_OVERLAY =
  "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=900&q=60";

function CardDocs() {
  return (
    <>
      <header>
        <h1>Card</h1>
        <p className="lead">A content container with body, optional header and footer, and image regions.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          A card with just <code>.card__body</code>. Drop in a form, a stack of fields, or any
          block of content.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-88">
  <div class="card__body">
    <h5 class="card__title">Sign in</h5>
    <p class="card__text">Welcome back. Enter your details to continue.</p>
    <form class="flex flex-col gap-4 w-full mt-4">
      <div class="field">
        <label for="cardLoginEmail" class="field__label">Email</label>
        <input type="email" class="input" id="cardLoginEmail" placeholder="you@example.com" />
      </div>
      <div class="field">
        <label for="cardLoginPwd" class="field__label">Password</label>
        <input type="password" class="input" id="cardLoginPwd" />
      </div>
      <div class="field__item">
        <input class="checkbox" type="checkbox" id="cardLoginRemember" />
        <label class="field__label" for="cardLoginRemember">Remember me</label>
      </div>
      <button type="submit" class="button button--primary">Sign in</button>
    </form>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Title, subtitle, text, links</h2>
        <p>
          <code>.card__title</code> sits at a fixed font size regardless of the heading tag you
          pick. <code>.card__subtitle</code> reads <code>--color-muted-foreground</code> so the
          muted treatment is baked in and no utility is needed.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-72">
  <div class="card__body">
    <h5 class="card__title">Card title</h5>
    <h6 class="card__subtitle">Card subtitle</h6>
    <p class="card__text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="card__link">Card link</a>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Images</h2>
        <p>
          <code>.card__image</code> is position-aware. As the first child it rounds its top
          corners; as the last child it rounds the bottom. Wrap content in{" "}
          <code>.card__overlay</code> to sit it over the image.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-72">
  <img src="${IMG_LANDSCAPE}" class="card__image" alt="Mountain landscape" />
  <div class="card__body">
    <h5 class="card__title">Image top</h5>
    <p class="card__text">A card with supporting text below.</p>
  </div>
</div>
<div class="card w-72">
  <img src="${IMG_OVERLAY}" class="card__image" alt="Forest path" />
  <div class="card__overlay">
    <h5 class="card__title">Image overlay</h5>
    <p class="card__text">Supporting text laid over the image.</p>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Header, body, footer</h2>
        <p>
          The default header is transparent and inherits the card body background. The footer
          sits on <code>--color-surface-2</code> so the body and footer split reads without a
          heavy border. Wrap trailing controls in a <code>.card__action</code> slot to push them
          to the end of the header row.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-88">
  <div class="card__header">
    Featured
    <div class="card__action">
      <button type="button" class="button button--neutral button--sm">Action</button>
    </div>
  </div>
  <div class="card__body">
    <h5 class="card__title">Special title treatment</h5>
    <p class="card__text">With supporting text below as a natural lead-in to additional content.</p>
    <button type="button" class="button button--primary">Go somewhere</button>
  </div>
  <div class="card__footer">
    <span class="card__subtitle">2 days ago</span>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Heading row</h2>
        <p>
          <code>.card__heading</code> is a section sub-header for use inside the body: a title
          with optional trailing controls. Put the controls in a <code>.card__action</code> slot
          and they sit at the end of the row while the title packs to the start, the same slot the
          header row uses.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-88">
  <div class="card__body">
    <div class="card__heading">
      <span class="card__title">Recent activity</span>
      <div class="card__action">
        <a class="card__link" href="#">See all</a>
      </div>
    </div>
    <p class="card__text">Three new comments and a deploy since your last visit.</p>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Alternate header</h2>
        <p>
          Opt the header onto <code>--color-surface-2</code> with{" "}
          <code>.card__header--alt</code> to mirror the footer's contrast. Composes with{" "}
          <code>.card__header</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-72">
  <div class="card__header">Default header</div>
  <div class="card__body">
    <p class="card__text">Header inherits the card body background.</p>
  </div>
</div>
<div class="card w-72">
  <div class="card__header card__header--alt">Alt header</div>
  <div class="card__body">
    <p class="card__text">Header sits on the alt surface.</p>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Compact header</h2>
        <p>
          The header row defaults to a roomy height. Add <code>.card__header--compact</code> to
          tighten it for dense layouts.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-72">
  <div class="card__header">Default header</div>
  <div class="card__body">
    <p class="card__text">The standard header height.</p>
  </div>
</div>
<div class="card w-72">
  <div class="card__header card__header--compact">Compact header</div>
  <div class="card__body">
    <p class="card__text">A tighter header for dense rows.</p>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Flat</h2>
        <p>
          Cards carry a border by default so they read as cards with or without elevation.{" "}
          <code>.card--flat</code> drops the shadow when the card should read as a frame rather
          than a raised surface.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-72">
  <div class="card__body">
    <h5 class="card__title">Default</h5>
    <p class="card__text">Border and shadow elevation.</p>
  </div>
</div>
<div class="card card--flat w-72">
  <div class="card__body">
    <h5 class="card__title">Flat</h5>
    <p class="card__text">Border, no shadow.</p>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.card</code> without touching component CSS. Override on{" "}
          <code>.card</code> itself, on a parent scope, or on <code>:root</code>. The cascade
          scopes the change.
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
              <td><code>--card-radius</code></td>
              <td>Corner radius</td>
            </tr>
            <tr>
              <td><code>--card-padding-inline</code></td>
              <td>Left and right padding, shared by header, body, and footer so their edges align</td>
            </tr>
            <tr>
              <td><code>--card-padding-block</code></td>
              <td>Top and bottom padding of the body</td>
            </tr>
            <tr>
              <td><code>--card-bg</code></td>
              <td>Background</td>
            </tr>
            <tr>
              <td><code>--card-color</code></td>
              <td>Text color</td>
            </tr>
            <tr>
              <td><code>--card-border-width</code></td>
              <td>Border thickness; set <code>0</code> to drop the border</td>
            </tr>
            <tr>
              <td><code>--card-border-color</code></td>
              <td>Border color</td>
            </tr>
            <tr>
              <td><code>--card-shadow</code></td>
              <td>Drop shadow; <code>.card--flat</code> sets it to <code>none</code></td>
            </tr>
            <tr>
              <td><code>--card-header-height</code></td>
              <td>Minimum height of the header row; <code>.card__header--compact</code> lowers it</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
