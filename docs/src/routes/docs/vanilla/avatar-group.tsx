import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/avatar-group")({
  component: AvatarGroupDocs,
});

function AvatarGroupDocs() {
  return (
    <>
      <header>
        <h1>Avatar group</h1>
        <p className="lead">A row of overlapping avatars that reads as a single cluster.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          For the single portrait, sizes, and indicator, see Avatar. <code>.avatar-group</code> is
          purely visual stacking, and lets every member keep its own paint. Wrap two or more{" "}
          <code>.avatar</code> children in <code>.avatar-group</code>. Members overlap via a negative
          inline margin, and the group turns the per-avatar ring on so adjacent shapes read as separate
          objects.
        </p>
        <Demo
          html={`
<div class="avatar-group">
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=1" alt=""><span class="avatar__fallback">A</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=2" alt=""><span class="avatar__fallback">B</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=3" alt=""><span class="avatar__fallback">C</span></span>
  <span class="avatar avatar--circle avatar-group__more">+2</span>
</div>`}
        />
      </section>

      <section>
        <h2>Composition with avatar modifiers</h2>
        <p>
          The group is shape- and size-agnostic. Mix in any <code>.avatar</code> modifier
          (<code>--sm</code>, <code>--lg</code>, <code>--circle</code>) and the stack composes flat.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="avatar-group">
  <span class="avatar avatar--sm" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=11" alt=""><span class="avatar__fallback">A</span></span>
  <span class="avatar avatar--sm" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=12" alt=""><span class="avatar__fallback">B</span></span>
  <span class="avatar avatar--sm" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=13" alt=""><span class="avatar__fallback">C</span></span>
  <span class="avatar avatar--sm avatar-group__more">+8</span>
</div>
<div class="avatar-group">
  <span class="avatar avatar--lg avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=21" alt=""><span class="avatar__fallback">A</span></span>
  <span class="avatar avatar--lg avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=22" alt=""><span class="avatar__fallback">B</span></span>
  <span class="avatar avatar--lg avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=23" alt=""><span class="avatar__fallback">C</span></span>
  <span class="avatar avatar--lg avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=24" alt=""><span class="avatar__fallback">D</span></span>
</div>`}
        />
      </section>

      <section>
        <h2>Overflow tail</h2>
        <p>
          Add <code>.avatar-group__more</code> as the final child to summarize the rest. It's a regular
          <code>.avatar</code>, so size and shape modifiers compose; the modifier just retints the
          paint to read as "more."
        </p>
        <Demo
          html={`
<div class="avatar-group">
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=31" alt=""><span class="avatar__fallback">A</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=32" alt=""><span class="avatar__fallback">B</span></span>
  <span class="avatar avatar--circle avatar-group__more">+12</span>
</div>`}
        />
        <p>
          Retint the tail to a brand color by overriding <code>--avatar-bg</code> /{" "}
          <code>--avatar-color</code> on the element. Same vars the base <code>.avatar</code> reads.
        </p>
        <Demo
          html={`
<div class="avatar-group">
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=41" alt=""><span class="avatar__fallback">A</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=42" alt=""><span class="avatar__fallback">B</span></span>
  <span class="avatar avatar--circle avatar-group__more" style="--avatar-bg: var(--color-primary); --avatar-color: var(--color-primary-foreground);">+9</span>
</div>`}
        />
      </section>

      <section>
        <h2>Overlap density</h2>
        <p>
          Tighten or loosen the stack by overriding <code>--avatar-group-overlap</code> on the group —
          the negative inline margin per neighbor. Set it to zero for a non-overlapping strip with the
          ring still applied, or to half the avatar size for a tight stack.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="avatar-group" style="--avatar-group-overlap: 1.25rem;">
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=51" alt=""><span class="avatar__fallback">A</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=52" alt=""><span class="avatar__fallback">B</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=53" alt=""><span class="avatar__fallback">C</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=54" alt=""><span class="avatar__fallback">D</span></span>
</div>
<div class="avatar-group" style="--avatar-group-overlap: 0.25rem;">
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=61" alt=""><span class="avatar__fallback">A</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=62" alt=""><span class="avatar__fallback">B</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=63" alt=""><span class="avatar__fallback">C</span></span>
  <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=64" alt=""><span class="avatar__fallback">D</span></span>
</div>`}
        />
      </section>

      <section>
        <h2>On a tinted surface</h2>
        <p>
          The per-member ring tracks the page background by default. On a tinted surface, publish a
          matching <code>--avatar-group-ring-color</code> on the group so the ring blends with the host
          instead of punching through it.
        </p>
        <Demo
          html={`
<div class="card p-5" style="--card-bg: var(--color-surface-3);">
  <div class="avatar-group" style="--avatar-group-ring-color: var(--color-surface-3);">
    <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=14" alt=""><span class="avatar__fallback">A</span></span>
    <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=25" alt=""><span class="avatar__fallback">B</span></span>
    <span class="avatar avatar--circle" data-status="loaded"><img class="avatar__image" src="https://i.pravatar.cc/96?img=36" alt=""><span class="avatar__fallback">C</span></span>
    <span class="avatar avatar--circle avatar-group__more" style="--avatar-bg: var(--color-surface); --avatar-color: var(--color-muted-foreground);">+4</span>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          Three variables retune <code>.avatar-group</code>. Per-member paint comes from the avatar's
          own variables (see Avatar).
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--avatar-group-overlap</code></td><td>Negative inline margin per member; rides the spacing scale so the overlap retunes with the avatar size</td></tr>
            <tr><td><code>--avatar-group-ring-width</code></td><td>Outline width published into each member's <code>--avatar-ring-width</code></td></tr>
            <tr><td><code>--avatar-group-ring-color</code></td><td>Outline color published into each member's <code>--avatar-ring-color</code></td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
