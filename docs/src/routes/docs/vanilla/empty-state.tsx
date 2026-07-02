import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/empty-state")({
  component: EmptyStateDocs,
});

function EmptyStateDocs() {
  return (
    <>
      <header>
        <h1>Empty state</h1>
        <p className="lead">A centred block shown in place of content that is absent.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          The <code>.empty-state</code> stacks a <code>.empty-state__media</code> (a tinted circle
          holding one glyph by default), a <code>.empty-state__title</code>, supporting{" "}
          <code>.empty-state__text</code>, and a trailing <code>.empty-state__action</code>. Tone
          modifiers recolour the media for error or success states; the text stays neutral so the
          message reads as words. Drop an <code>.illustration</code>, <code>&lt;img&gt;</code>,{" "}
          <code>.icon-box</code>, <code>.avatar</code>, or <code>.spinner</code> into the media slot
          and it sheds its circle so the richer art isn't double-framed. A glyph, a title, a line of
          guidance, and a primary action.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="empty-state">
  <span class="empty-state__media"><i data-lucide="inbox"></i></span>
  <h3 class="empty-state__title">No messages</h3>
  <p class="empty-state__text">Your inbox is empty. New messages will show up here.</p>
  <div class="empty-state__action">
    <button class="button button--primary">Compose</button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>With actions</h2>
        <p>
          Add <code>.empty-state__action</code> to move the person forward. The slot centers and wraps
          its controls, so a primary plus a secondary action stacks cleanly on a narrow region.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="empty-state">
  <span class="empty-state__media"><i data-lucide="folder-plus"></i></span>
  <h3 class="empty-state__title">No projects yet</h3>
  <p class="empty-state__text">Create your first project to start organizing your work.</p>
  <div class="empty-state__action">
    <button type="button" class="button button--primary"><i data-lucide="plus"></i> New project</button>
    <button type="button" class="button button--neutral button--outline">Import</button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Tones</h2>
        <p>
          Set a tone with <code>.empty-state--danger</code> (an error) or{" "}
          <code>.empty-state--success</code> (a done state); only the media recolours.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="empty-state empty-state--danger">
  <span class="empty-state__media"><i data-lucide="circle-alert"></i></span>
  <h3 class="empty-state__title">Something went wrong</h3>
  <p class="empty-state__text">We couldn't load your reports. Try again in a moment.</p>
  <div class="empty-state__action">
    <button class="button button--neutral button--outline">Retry</button>
  </div>
</div>
<div class="empty-state empty-state--success">
  <span class="empty-state__media"><i data-lucide="circle-check"></i></span>
  <h3 class="empty-state__title">All caught up</h3>
  <p class="empty-state__text">You've cleared every task on your list.</p>
</div>`}
        />
      </section>

      <section>
        <h2>Small</h2>
        <p>
          <code>.empty-state--sm</code> shrinks the media and tightens the padding for an empty region
          inside a card or table.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card">
  <div class="card__body">
    <div class="empty-state empty-state--sm">
      <span class="empty-state__media"><i data-lucide="search-x"></i></span>
      <h3 class="empty-state__title">No results</h3>
      <p class="empty-state__text">No items match your filters.</p>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Media</h2>
        <p>
          The media slot hosts more than a bare icon. Drop in an <code>.icon-box</code>, an{" "}
          <code>.avatar</code>, or a <code>.spinner</code> and the slot sheds its own circle so the
          media is never double-framed. A spinner suits a region that is loading toward empty.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="flex flex-wrap gap-4">
  <div class="empty-state empty-state--sm">
    <span class="empty-state__media">
      <span class="icon-box icon-box--primary icon-box--circle icon-box--lg"><i data-lucide="users"></i></span>
    </span>
    <h3 class="empty-state__title">No team members</h3>
    <p class="empty-state__text">Invite people to collaborate.</p>
  </div>
  <div class="empty-state empty-state--sm">
    <span class="empty-state__media"><span class="spinner" aria-hidden="true"></span></span>
    <h3 class="empty-state__title">Loading</h3>
    <p class="empty-state__text">Fetching your latest data.</p>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>With an illustration</h2>
        <p>
          For a richer empty state, pair it with an <code>.illustration</code> in the media slot. The
          slot sheds its circle and caps the art width, so the spot art sits on its own. See the
          Illustrations page for the full set and how to re-tone them.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>These variables retune the block. Override on the root or any wrapper.</p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--empty-state-max-width</code></td><td>Measure the block centres within</td></tr>
            <tr><td><code>--empty-state-padding-block</code> / <code>-padding-inline</code></td><td>Block padding</td></tr>
            <tr><td><code>--empty-state-tone</code></td><td>Media fill, tint, and glyph colour (the tone modifiers set this)</td></tr>
            <tr><td><code>--empty-state-media-size</code> / <code>-icon-size</code></td><td>Media circle and glyph size</td></tr>
            <tr><td><code>--empty-state-art-size</code></td><td>Width cap for a richer illustration or image</td></tr>
            <tr><td><code>--empty-state-media-gap</code></td><td>Gap below the media</td></tr>
            <tr><td><code>--empty-state-gap</code></td><td>Gap between the title and the text</td></tr>
            <tr><td><code>--empty-state-action-gap</code></td><td>Gap above the actions</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
