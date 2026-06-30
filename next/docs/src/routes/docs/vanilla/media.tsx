import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/media")({
  component: MediaDocs,
});

function MediaDocs() {
  return (
    <>
      <header>
        <h1>Media</h1>
        <p className="lead">A row that pairs media with text and an action.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Drop <code>.media__figure</code>, <code>.media__content</code>, and{" "}
          <code>.media__action</code> as direct children. The row sits on the
          surface fill with a hairline border and a comfortable padding floor.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="media max-w-md">
  <div class="media__figure"><span class="icon-box icon-box--primary"><i data-lucide="package"></i></span></div>
  <div class="media__content">
    <div class="media__title">Order #ATL-2918</div>
    <div class="media__description">Out for delivery, arrives today by 6 PM.</div>
  </div>
  <div class="media__action">
    <button type="button" class="button button--primary button--sm">Track</button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Title, description, meta</h2>
        <p>
          Stack a <code>.media__meta</code> below the description for a
          secondary line at a smaller font in muted-foreground. An avatar in the
          figure reads as an actor.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="media max-w-lg">
  <div class="media__figure">
    <span class="avatar avatar--circle" data-stisla-avatar>
      <img class="avatar__image" src="https://i.pravatar.cc/96?img=12" alt="">
      <span class="avatar__fallback">JC</span>
    </span>
  </div>
  <div class="media__content">
    <div class="media__title">Joseph Cooper</div>
    <div class="media__description">Pushed 3 commits to atlas/main.</div>
    <div class="media__meta">2 minutes ago</div>
  </div>
  <div class="media__action">
    <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="Like"><i data-lucide="heart"></i></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Vertical</h2>
        <p>
          Add <code>.media--vertical</code> to stack the parts top to bottom.
          The action's auto inline-end pin drops and parts align to the row's
          start. Useful for stat tiles.
        </p>
        <Demo
          html={`
<div class="media media--vertical flex-1 min-w-48">
  <div class="media__meta">Monthly revenue</div>
  <div class="media__title text-2xl">$48,210</div>
  <div class="media__description text-success">+12.4% from last month</div>
</div>
<div class="media media--vertical flex-1 min-w-48">
  <div class="media__meta">Churn rate</div>
  <div class="media__title text-2xl">1.8%</div>
  <div class="media__description text-danger">+0.4% from last month</div>
</div>`}
        />
      </section>

      <section>
        <h2>Flush rows in a card</h2>
        <p>
          Stack <code>.media--flush</code> rows inside a <code>.card</code>. The
          flush items shed their own border and background and pick up the card
          padding, so the row edges line up with the card header. Each row stays
          its own row; the card stays one frame; a <code>.separator</code>
          between rows adds the dividing line.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card max-w-md w-full">
  <div class="card__header">Team members</div>
  <div class="media media--flush">
    <div class="media__figure">
      <span class="avatar avatar--circle" data-stisla-avatar><img class="avatar__image" src="https://i.pravatar.cc/96?img=47" alt=""><span class="avatar__fallback">MT</span></span>
    </div>
    <div class="media__content">
      <div class="media__title">Maya Tanaka</div>
      <div class="media__meta">maya@kredibel.com</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--outline button--neutral button--sm">Following</button>
    </div>
  </div>
  <hr class="separator" />
  <div class="media media--flush">
    <div class="media__figure">
      <span class="avatar avatar--circle" data-stisla-avatar><img class="avatar__image" src="https://i.pravatar.cc/96?img=32" alt=""><span class="avatar__fallback">PR</span></span>
    </div>
    <div class="media__content">
      <div class="media__title">Priya Reddy</div>
      <div class="media__meta">priya@kredibel.com</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--primary button--sm">Follow</button>
    </div>
  </div>
  <hr class="separator" />
  <div class="media media--flush">
    <div class="media__figure">
      <span class="avatar avatar--circle" data-stisla-avatar><img class="avatar__image" src="https://i.pravatar.cc/96?img=15" alt=""><span class="avatar__fallback">DR</span></span>
    </div>
    <div class="media__content">
      <div class="media__title">Diego Romero</div>
      <div class="media__meta">diego@kredibel.com</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--primary button--sm">Follow</button>
    </div>
  </div>
  <hr class="separator" />
  <div class="media media--flush">
    <div class="media__figure">
      <span class="avatar avatar--circle" data-stisla-avatar><img class="avatar__image" src="https://i.pravatar.cc/96?img=44" alt=""><span class="avatar__fallback">LW</span></span>
    </div>
    <div class="media__content">
      <div class="media__title">Lin Wei</div>
      <div class="media__meta">lin@kredibel.com</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--primary button--sm">Follow</button>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Notification settings</h2>
        <p>
          Same flush stack, with an <code>.icon-box</code> in the figure and a{" "}
          <code>.switch</code> in the action slot. Each row reads as a setting
          whose state lives in the switch.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card max-w-lg">
  <div class="card__header">Notification preferences</div>
  <div class="media media--flush">
    <div class="media__figure">
      <span class="icon-box icon-box--primary"><i data-lucide="bell"></i></span>
    </div>
    <div class="media__content">
      <div class="media__title">Push notifications</div>
      <div class="media__description">Real-time alerts on this device for mentions and direct replies.</div>
    </div>
    <div class="media__action">
      <input class="switch switch--lg" type="checkbox" role="switch" aria-label="Push notifications" checked>
    </div>
  </div>
  <div class="media media--flush">
    <div class="media__figure">
      <span class="icon-box icon-box--info"><i data-lucide="mail"></i></span>
    </div>
    <div class="media__content">
      <div class="media__title">Email digest</div>
      <div class="media__description">A single recap email each Monday with last week's activity.</div>
    </div>
    <div class="media__action">
      <input class="switch switch--lg" type="checkbox" role="switch" aria-label="Email digest" checked>
    </div>
  </div>
  <div class="media media--flush">
    <div class="media__figure">
      <span class="icon-box icon-box--warning"><i data-lucide="message-square"></i></span>
    </div>
    <div class="media__content">
      <div class="media__title">SMS alerts</div>
      <div class="media__description">Critical-only messages, used for billing and account recovery.</div>
    </div>
    <div class="media__action">
      <input class="switch switch--lg" type="checkbox" role="switch" aria-label="SMS alerts">
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Payment methods</h2>
        <p>
          Brand glyph in the figure, last-four in the title, expiry in the meta.
          The action slot can hold a badge instead of a button, or no action at
          all.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card max-w-lg w-full">
  <div class="card__header">Payment methods</div>
  <div class="media media--flush">
    <div class="media__figure">
      <span class="icon-box"><i data-lucide="credit-card"></i></span>
    </div>
    <div class="media__content">
      <div class="media__title">Visa ending in 4242</div>
      <div class="media__meta">Expires 12 / 2027</div>
    </div>
    <div class="media__action">
      <span class="badge badge--success">Default</span>
    </div>
  </div>
  <div class="media media--flush">
    <div class="media__figure">
      <span class="icon-box"><i data-lucide="credit-card"></i></span>
    </div>
    <div class="media__content">
      <div class="media__title">Mastercard ending in 1908</div>
      <div class="media__meta">Expires 04 / 2026</div>
    </div>
  </div>
  <div class="media media--flush">
    <div class="media__figure">
      <span class="icon-box"><i data-lucide="building-2"></i></span>
    </div>
    <div class="media__content">
      <div class="media__title">Bank transfer · Mandiri</div>
      <div class="media__meta">Account ending in 0073</div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>File list</h2>
        <p>
          Two actions in the action slot work the same as one. The flex gap
          inside <code>.media__action</code> spaces them; both pin to the inline
          end as a single group.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card max-w-lg">
  <div class="card__header">Recent files</div>
  <div class="media media--flush">
    <div class="media__figure">
      <span class="icon-box icon-box--primary"><i data-lucide="file-text"></i></span>
    </div>
    <div class="media__content">
      <div class="media__title">design-brief.pdf</div>
      <div class="media__meta">2.4 MB · Edited yesterday by Maya</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="Download"><i data-lucide="download"></i></button>
      <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="Delete"><i data-lucide="trash-2"></i></button>
    </div>
  </div>
  <hr class="separator">
  <div class="media media--flush">
    <div class="media__figure">
      <span class="icon-box icon-box--success"><i data-lucide="file-spreadsheet"></i></span>
    </div>
    <div class="media__content">
      <div class="media__title">q2-revenue.xlsx</div>
      <div class="media__meta">812 KB · Edited 3 days ago by Diego</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="Download"><i data-lucide="download"></i></button>
      <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="Delete"><i data-lucide="trash-2"></i></button>
    </div>
  </div>
  <hr class="separator">
  <div class="media media--flush">
    <div class="media__figure">
      <span class="icon-box icon-box--info"><i data-lucide="image"></i></span>
    </div>
    <div class="media__content">
      <div class="media__title">launch-hero.png</div>
      <div class="media__meta">5.1 MB · Edited last week by Priya</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="Download"><i data-lucide="download"></i></button>
      <button type="button" class="button button--ghost button--neutral button--sm button--icon-only" aria-label="Delete"><i data-lucide="trash-2"></i></button>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Standalone rows</h2>
        <p>
          Standalone items, with their own border and surface fill, sit well as
          a freestanding list outside a card. Image in the figure, price as the
          meta line, the action pinned to the inline end.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-col gap-3 max-w-lg">
  <div class="media">
    <div class="media__figure">
      <img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&h=200" alt="" width="56" height="56" class="rounded-md object-cover" />
    </div>
    <div class="media__content">
      <div class="media__title">Keychron K2 Pro</div>
      <div class="media__description">75% wireless mechanical with brown switches.</div>
      <div class="media__meta">$179.00</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--primary button--sm">Add to cart</button>
    </div>
  </div>
  <div class="media">
    <div class="media__figure">
      <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&h=200" alt="" width="56" height="56" class="rounded-md object-cover" />
    </div>
    <div class="media__content">
      <div class="media__title">Sony WH-1000XM5</div>
      <div class="media__description">Wireless noise-cancelling over-ear headphones.</div>
      <div class="media__meta">$399.00</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--primary button--sm">Add to cart</button>
    </div>
  </div>
  <div class="media">
    <div class="media__figure">
      <img src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=200&h=200" alt="" width="56" height="56" class="rounded-md object-cover" />
    </div>
    <div class="media__content">
      <div class="media__title">Anglepoise 90 Mini Mini</div>
      <div class="media__description">Articulated desk lamp in warm olive.</div>
      <div class="media__meta">$245.00</div>
    </div>
    <div class="media__action">
      <button type="button" class="button button--primary button--sm">Add to cart</button>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.media</code> without touching component
          CSS. Override on the row, a parent scope, or <code>:root</code>.
          Inside a <code>.card</code>, the flush variant additionally reads the
          card's <code>--card-padding-inline</code> so the row's inline edges
          align with the card header and footer.
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
                <code>--media-radius</code>
              </td>
              <td>
                Corner radius; cleared to <code>0</code> by <code>--flush</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--media-padding-block</code>
              </td>
              <td>Top and bottom padding</td>
            </tr>
            <tr>
              <td>
                <code>--media-padding-inline</code>
              </td>
              <td>
                Left and right padding; a flush row inside a card aligns to the
                card's inline padding
              </td>
            </tr>
            <tr>
              <td>
                <code>--media-gap</code>
              </td>
              <td>Spacing between figure, content, and action</td>
            </tr>
            <tr>
              <td>
                <code>--media-bg</code>
              </td>
              <td>
                Background; cleared to <code>transparent</code> by{" "}
                <code>--flush</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--media-color</code>
              </td>
              <td>Text color</td>
            </tr>
            <tr>
              <td>
                <code>--media-border-width</code>
              </td>
              <td>
                Border thickness; cleared to <code>0</code> by{" "}
                <code>--flush</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--media-border-color</code>
              </td>
              <td>Border color</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
