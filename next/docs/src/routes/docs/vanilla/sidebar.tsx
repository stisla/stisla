import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/sidebar")({
  component: SidebarDocs,
});

function SidebarDocs() {
  return (
    <>
      <header>
        <h1>Sidebar</h1>
        <p className="lead">
          Vertical navigation panel for app layouts. No fixed positioning,
          width, or background by default; the layout decides where it sits.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          One content slot, one group, one list. The current page is marked with{" "}
          <code>aria-current="page"</code> on the matching button.
        </p>
        <Demo
          html={`
<aside class="sidebar w-64">
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i>Dashboard</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="shopping-bag"></i>Products</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="tags"></i>Categories</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i>Customers</a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>With header and footer</h2>
        <p>
          Use <code>.sidebar__header</code> for the brand mark;{" "}
          <code>.sidebar__brand</code> lines up an icon and a wordmark.{" "}
          <code>.sidebar__footer</code> pins to the bottom via{" "}
          <code>margin-block-start: auto</code>.
        </p>
        <Demo
          html={`
<aside class="sidebar w-64 h-88">
  <header class="sidebar__header">
    <a class="sidebar__brand" href="#"><i data-lucide="hexagon"></i><span>Stisla</span></a>
  </header>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i>Dashboard</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="bar-chart-3"></i>Analytics</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="inbox"></i>Inbox</a></li>
        </ul>
      </div>
    </nav>
  </div>
  <footer class="sidebar__footer">
    <ul class="sidebar__list">
      <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="settings"></i>Settings</a></li>
      <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="log-out"></i>Log out</a></li>
    </ul>
  </footer>
</aside>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Three sizes: <code>.sidebar--sm</code>, the default, and{" "}
          <code>.sidebar--lg</code>. The modifier retunes button height,
          padding, and group gap. Outer panel padding stays the same so gutters
          read identically across sizes.
        </p>
        <Demo
          html={`
<aside class="sidebar sidebar--sm w-56">
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <span class="sidebar__group-title">Small</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i>Dashboard</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="inbox"></i>Inbox</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i>Customers</a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>
<aside class="sidebar w-56">
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <span class="sidebar__group-title">Default</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i>Dashboard</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="inbox"></i>Inbox</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i>Customers</a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>
<aside class="sidebar sidebar--lg w-56">
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <span class="sidebar__group-title">Large</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i>Dashboard</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="inbox"></i>Inbox</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i>Customers</a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Groups and group action</h2>
        <p>
          <code>.sidebar__group-title</code> labels each list. An optional{" "}
          <code>.sidebar__group-action</code> sits to the right of the title,
          useful for an add or filter button. Its contents collapse to a uniform
          square regardless of the button modifiers passed in. Pick a tone via{" "}
          <code>.button--ghost.button--neutral</code> and the slot handles the
          chrome.
        </p>
        <Demo
          html={`
<aside class="sidebar w-68">
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <span class="sidebar__group-title">Workspaces</span>
        <div class="sidebar__group-action">
          <button type="button" class="button button--ghost button--neutral button--icon-only" aria-label="Add workspace"><i data-lucide="plus"></i></button>
        </div>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="briefcase"></i>Acme Co.</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="briefcase"></i>Side Project</a></li>
        </ul>
      </div>
      <div class="sidebar__group">
        <span class="sidebar__group-title">Settings</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="settings"></i>General</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="user"></i>Profile</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="credit-card"></i>Billing</a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Active state</h2>
        <p>
          Two hooks. <code>aria-current="page"</code> marks the current page on
          a navigation link; <code>data-state="active"</code> covers non-link
          rows (a button toggling a panel, say). Both paint the highlight chip.
          The difference is semantic; it looks the same.
        </p>
        <Demo
          html={`
<aside class="sidebar w-64">
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="home"></i>Dashboard</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="inbox"></i>Inbox</a></li>
          <li class="sidebar__item"><button type="button" class="sidebar__button" data-state="active"><i data-lucide="filter"></i>Filters open</button></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i>Customers</a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Item actions</h2>
        <p>
          Place a <code>.sidebar__item-action</code> after the button to drop a
          badge or quiet button into the right edge of the row. The button keeps
          its full click area; the action overlays only its own pixels. Add the{" "}
          <code>--reveal</code> modifier to show the action only on row hover or
          keyboard focus, for dense lists where always-visible actions feel
          noisy.
        </p>
        <Demo
          html={`
<aside class="sidebar w-72" data-stisla-sidebar>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <span class="sidebar__group-title">Always visible</span>
        <ul class="sidebar__list">
          <li class="sidebar__item">
            <a class="sidebar__button" href="#"><i data-lucide="bell"></i>Notifications</a>
            <span class="sidebar__item-action"><span class="badge badge--primary">3</span></span>
          </li>
          <li class="sidebar__item">
            <a class="sidebar__button" href="#"><i data-lucide="inbox"></i>Inbox</a>
            <span class="sidebar__item-action"><span class="badge">12</span></span>
          </li>
        </ul>
      </div>
      <div class="sidebar__group">
        <span class="sidebar__group-title">Hover-reveal</span>
        <ul class="sidebar__list">
          <li class="sidebar__item">
            <a class="sidebar__button" href="#"><i data-lucide="folder"></i>Documents</a>
            <span class="sidebar__item-action sidebar__item-action--reveal">
              <button type="button" class="button button--ghost button--neutral button--icon-only" aria-label="More"><i data-lucide="more-horizontal"></i></button>
            </span>
          </li>
          <li class="sidebar__item">
            <a class="sidebar__button" href="#"><i data-lucide="folder"></i>Projects</a>
            <span class="sidebar__item-action sidebar__item-action--reveal">
              <button type="button" class="button button--ghost button--neutral button--icon-only" aria-label="More"><i data-lucide="more-horizontal"></i></button>
            </span>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Nested submenu</h2>
        <p>
          Wrap a child <code>.sidebar__list</code> in a{" "}
          <code>.sidebar__submenu</code> inside the same{" "}
          <code>.sidebar__item</code>. The item carries{" "}
          <code>data-state="open"</code> or <code>data-state="closed"</code>; an
          empty <code>&lt;span class="sidebar__caret"&gt;</code> inside the
          trigger renders a chevron that rotates when the parent reports{" "}
          <code>aria-expanded="true"</code>. The first item starts open, the
          second closed. Toggling is wired by <code>@stisla/vanilla</code> via{" "}
          <code>data-stisla-sidebar-submenu-toggle</code> — click a parent to
          expand it.
        </p>
        <Demo
          html={`
<aside class="sidebar w-72" data-stisla-sidebar>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i>Dashboard</a></li>
          <li class="sidebar__item" data-state="open">
            <button type="button" class="sidebar__button" data-stisla-sidebar-submenu-toggle aria-expanded="true" aria-controls="reports">
              <i data-lucide="bar-chart-3"></i>Reports<span class="sidebar__caret"></span>
            </button>
            <div class="sidebar__submenu" id="reports">
              <ul class="sidebar__list">
                <li class="sidebar__item"><a class="sidebar__button" href="#">Sales</a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#">Traffic</a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#">Conversion</a></li>
              </ul>
            </div>
          </li>
          <li class="sidebar__item" data-state="closed">
            <button type="button" class="sidebar__button" data-stisla-sidebar-submenu-toggle aria-expanded="false" aria-controls="billing">
              <i data-lucide="credit-card"></i>Billing<span class="sidebar__caret"></span>
            </button>
            <div class="sidebar__submenu" id="billing">
              <ul class="sidebar__list">
                <li class="sidebar__item"><a class="sidebar__button" href="#">Invoices</a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#">Payment methods</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Link parent with submenu</h2>
        <p>
          When the parent also maps to a real page, split the two: keep the
          label as an <code>&lt;a&gt;</code> and move the disclosure into a
          caret button in the <code>.sidebar__item-action</code> slot. The label
          navigates, the caret opens the tree, and each is the right element for
          assistive tech.
        </p>
        <Demo
          html={`
<aside class="sidebar w-72" data-stisla-sidebar>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i>Dashboard</a></li>
          <li class="sidebar__item" data-state="open">
            <a class="sidebar__button" href="#"><i data-lucide="bar-chart-3"></i>Reports</a>
            <button type="button" class="sidebar__item-action" data-stisla-sidebar-submenu-toggle aria-expanded="true" aria-controls="link-reports" aria-label="Toggle Reports submenu"><span class="sidebar__caret"></span></button>
            <div class="sidebar__submenu" id="link-reports">
              <ul class="sidebar__list">
                <li class="sidebar__item"><a class="sidebar__button" href="#">Sales</a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#">Traffic</a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#">Conversion</a></li>
              </ul>
            </div>
          </li>
          <li class="sidebar__item" data-state="closed">
            <a class="sidebar__button" href="#"><i data-lucide="credit-card"></i>Billing</a>
            <button type="button" class="sidebar__item-action" data-stisla-sidebar-submenu-toggle aria-expanded="false" aria-controls="link-billing" aria-label="Toggle Billing submenu"><span class="sidebar__caret"></span></button>
            <div class="sidebar__submenu" id="link-billing">
              <ul class="sidebar__list">
                <li class="sidebar__item"><a class="sidebar__button" href="#">Invoices</a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#">Payment methods</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>As a panel</h2>
        <p>
          The sidebar background is transparent by default. To frame it as a
          standalone panel, set <code>--sidebar-bg</code> to a surface token,
          add a border, and round the corners.
        </p>
        <Demo
          html={`
<aside class="sidebar w-68 border border-border rounded-lg" style="--sidebar-bg: var(--color-surface);">
  <header class="sidebar__header">
    <a class="sidebar__brand" href="#"><i data-lucide="hexagon"></i><span>Stisla</span></a>
  </header>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <span class="sidebar__group-title">Prologue</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page">Introduction</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#">Installation</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#">Customization</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#">Upgrade guide</a></li>
        </ul>
      </div>
      <div class="sidebar__group">
        <span class="sidebar__group-title">Components</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#">Button</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#">Card</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#">Input</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#">Sidebar</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#">Table</a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Recolor</h2>
        <p>
          Every visible part wires to a <code>--sidebar-*</code> variable.
          Override on the panel itself, on a scoped class, or on{" "}
          <code>:root</code>. The example tints the sidebar with the primary
          brand color, paired with <code>--color-primary-foreground</code> for
          the chip text.
        </p>
        <Demo
          html={`
<aside class="sidebar w-68 rounded-lg" data-stisla-sidebar style="
  --sidebar-bg: var(--color-primary);
  --sidebar-color: var(--color-primary-foreground);
  --sidebar-button-bg-hover: color-mix(in oklch, var(--color-primary-foreground) 12%, transparent);
  --sidebar-button-color-hover: var(--color-primary-foreground);
  --sidebar-button-bg-active: color-mix(in oklch, var(--color-primary-foreground) 20%, transparent);
  --sidebar-button-color-active: var(--color-primary-foreground);
  --sidebar-button-icon-color: color-mix(in oklch, var(--color-primary-foreground) 75%, transparent);
  --sidebar-group-title-color: color-mix(in oklch, var(--color-primary-foreground) 70%, transparent);
  --sidebar-submenu-border-color: color-mix(in oklch, var(--color-primary-foreground) 25%, transparent);
">
  <header class="sidebar__header">
    <a class="sidebar__brand" href="#"><i data-lucide="hexagon"></i><span>Stisla</span></a>
  </header>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <span class="sidebar__group-title">Navigation</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i>Dashboard</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="inbox"></i>Inbox</a></li>
          <li class="sidebar__item" data-state="open">
            <button type="button" class="sidebar__button" data-stisla-sidebar-submenu-toggle aria-expanded="true" aria-controls="recolor-reports">
              <i data-lucide="bar-chart-3"></i>Reports<span class="sidebar__caret"></span>
            </button>
            <div class="sidebar__submenu" id="recolor-reports">
              <ul class="sidebar__list">
                <li class="sidebar__item"><a class="sidebar__button" href="#">Sales</a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#">Traffic</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="sidebar__group">
        <span class="sidebar__group-title">Settings</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="settings"></i>General</a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="user"></i>Profile</a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Rail / mini mode</h2>
        <p>
          Add <code>data-collapsed</code> to the panel to shrink it to icons
          only. Each button becomes a square with its icon centered; labels,
          submenus, and chevrons fade out coordinated with whatever width
          transition the layout runs. Wrap label text in a{" "}
          <code>&lt;span&gt;</code> so it can be hidden cleanly. The button size
          follows <code>.sidebar--sm</code> / <code>.sidebar--lg</code>; the
          collapsed panel hugs the icon column on its own.
        </p>
        <p>
          A <code>data-stisla-sidebar-toggle="collapse"</code> button flips the
          state; the panel animates between its full and rail width over{" "}
          <code>--sidebar-transition-duration</code>. Click{" "}
          <strong>Collapse</strong> below.
        </p>
        <Demo
          html={`
<aside class="sidebar border border-border rounded-lg" data-stisla-sidebar style="--sidebar-bg: var(--color-surface);">
  <header class="sidebar__header">
    <a class="sidebar__brand" href="#" aria-label="Stisla"><i data-lucide="hexagon"></i><span>Stisla</span></a>
  </header>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i><span>Dashboard</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="inbox"></i><span>Inbox</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i><span>Customers</span></a></li>
        </ul>
      </div>
    </nav>
  </div>
  <footer class="sidebar__footer">
    <button type="button" class="sidebar__button" data-stisla-sidebar-toggle="collapse" aria-expanded="true"><i data-lucide="panel-left"></i><span>Collapse</span></button>
  </footer>
</aside>`}
        />
        <p>Statically collapsed at each size, for reference:</p>
        <Demo
          html={`
<aside class="sidebar sidebar--sm border border-border rounded-lg" data-collapsed style="--sidebar-bg: var(--color-surface);">
  <header class="sidebar__header">
    <a class="sidebar__brand" href="#" aria-label="Stisla"><i data-lucide="hexagon"></i><span>Stisla</span></a>
  </header>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i><span>Dashboard</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="inbox"></i><span>Inbox</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i><span>Customers</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="settings"></i><span>Settings</span></a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>
<aside class="sidebar border border-border rounded-lg" data-collapsed style="--sidebar-bg: var(--color-surface);">
  <header class="sidebar__header">
    <a class="sidebar__brand" href="#" aria-label="Stisla"><i data-lucide="hexagon"></i><span>Stisla</span></a>
  </header>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i><span>Dashboard</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="inbox"></i><span>Inbox</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i><span>Customers</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="settings"></i><span>Settings</span></a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>
<aside class="sidebar sidebar--lg border border-border rounded-lg" data-collapsed style="--sidebar-bg: var(--color-surface);">
  <header class="sidebar__header">
    <a class="sidebar__brand" href="#" aria-label="Stisla"><i data-lucide="hexagon"></i><span>Stisla</span></a>
  </header>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i><span>Dashboard</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="inbox"></i><span>Inbox</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i><span>Customers</span></a></li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="settings"></i><span>Settings</span></a></li>
        </ul>
      </div>
    </nav>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Collapse toggle</h2>
        <p>
          Add <code>data-stisla-sidebar-toggle="collapse"</code> to any element
          to flip the panel between expanded and rail.{" "}
          <code>@stisla/vanilla</code> toggles <code>[data-collapsed]</code> on
          the closest <code>[data-stisla-sidebar]</code>, or, when the trigger
          lives outside the sidebar, on the panel referenced by{" "}
          <code>aria-controls</code>. The trigger's <code>aria-expanded</code>{" "}
          stays in sync, and a <code>stisla:sidebar:collapse-change</code> event
          bubbles up so you can react to the state in your own code.
        </p>
        <p>
          The width animates pure-CSS on its own (no inline width changes, no
          script). The panel is <code>16rem</code> expanded and the collapsed
          rail derives from the icon cell, so both ends are real lengths the
          transition can interpolate over{" "}
          <code>--sidebar-transition-duration</code>. Set{" "}
          <code>--sidebar-width</code> / <code>--sidebar-width-collapsed</code>{" "}
          only to override those defaults.
        </p>
        <Demo
          html={`
<aside class="sidebar fixed left-0 top-0 h-full border-r border-border" data-stisla-sidebar style="--sidebar-bg: var(--color-surface);">
  <header class="sidebar__header">
    <a class="sidebar__brand" href="#"><i data-lucide="hexagon"></i><span>Acme</span></a>
  </header>
  <div class="sidebar__content">
    <nav class="sidebar__menu">
      <div class="sidebar__group">
        <span class="sidebar__group-title">Workspace</span>
        <div class="sidebar__group-action">
          <button type="button" class="button button--ghost button--neutral button--icon-only" aria-label="Add workspace"><i data-lucide="plus"></i></button>
        </div>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#" aria-current="page"><i data-lucide="home"></i><span>Dashboard</span></a></li>
          <li class="sidebar__item" data-state="open">
            <button type="button" class="sidebar__button" data-stisla-sidebar-submenu-toggle aria-expanded="true" aria-controls="toggleable-analytics">
              <i data-lucide="bar-chart-3"></i><span>Analytics</span><span class="sidebar__caret"></span>
            </button>
            <div class="sidebar__submenu" id="toggleable-analytics">
              <ul class="sidebar__list">
                <li class="sidebar__item"><a class="sidebar__button" href="#"><span>Sales</span></a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#"><span>Traffic</span></a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#"><span>Conversion</span></a></li>
              </ul>
            </div>
          </li>
          <li class="sidebar__item">
            <a class="sidebar__button" href="#"><i data-lucide="inbox"></i><span>Inbox</span></a>
            <span class="sidebar__item-action"><span class="badge badge--primary">12</span></span>
          </li>
        </ul>
      </div>
      <div class="sidebar__group">
        <span class="sidebar__group-title">Library</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="folder"></i><span>Documents</span></a></li>
          <li class="sidebar__item">
            <a class="sidebar__button" href="#"><i data-lucide="folder-open"></i><span>Projects</span></a>
            <span class="sidebar__item-action sidebar__item-action--reveal">
              <button type="button" class="button button--ghost button--neutral button--icon-only" aria-label="More"><i data-lucide="more-horizontal"></i></button>
            </span>
          </li>
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="layout-template"></i><span>Templates</span></a></li>
        </ul>
      </div>
      <div class="sidebar__group">
        <span class="sidebar__group-title">Team</span>
        <ul class="sidebar__list">
          <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="users"></i><span>Members</span></a></li>
          <li class="sidebar__item" data-state="closed">
            <button type="button" class="sidebar__button" data-stisla-sidebar-submenu-toggle aria-expanded="false" aria-controls="toggleable-settings">
              <i data-lucide="settings"></i><span>Settings</span><span class="sidebar__caret"></span>
            </button>
            <div class="sidebar__submenu" id="toggleable-settings">
              <ul class="sidebar__list">
                <li class="sidebar__item"><a class="sidebar__button" href="#"><span>General</span></a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#"><span>Profile</span></a></li>
                <li class="sidebar__item"><a class="sidebar__button" href="#"><span>Billing</span></a></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
  <footer class="sidebar__footer">
    <ul class="sidebar__list">
      <li class="sidebar__item"><a class="sidebar__button" href="#"><i data-lucide="life-buoy"></i><span>Help &amp; support</span></a></li>
      <li class="sidebar__item">
        <button type="button" class="sidebar__button" data-stisla-sidebar-toggle="collapse" aria-expanded="true">
          <i data-lucide="panel-left-close"></i><span>Collapse</span>
        </button>
      </li>
    </ul>
  </footer>
</aside>`}
        />
        <p>
          Any open submenus close in sync with the width transition: the
          framework calls <code>closeAllSubmenus()</code> as part of the
          collapse so each height animation runs alongside the rail shrink.
          Expanding back doesn't reopen them; the user clicks back into
          whichever menu they want. To drive the toggle from outside the sidebar
          (a topbar button, a keyboard shortcut), point at it with{" "}
          <code>aria-controls</code>.
        </p>
        <pre>
          <code>{`<button data-stisla-sidebar-toggle="collapse"
        aria-controls="my-sidebar"
        aria-expanded="true">Toggle sidebar</button>`}</code>
        </pre>
        <p>
          Or call the API directly with{" "}
          <code>Stisla.get(sidebarEl).toggleCollapsed()</code>,{" "}
          <code>.collapse()</code>, <code>.expand()</code>, or{" "}
          <code>.isCollapsed()</code>. Persist the state to{" "}
          <code>localStorage</code> by listening for{" "}
          <code>stisla:sidebar:collapse-change</code>.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.sidebar</code> without touching
          component CSS. Override on the panel, a parent scope, or{" "}
          <code>:root</code>.
        </p>

        <h3>Shell</h3>
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
                <code>--sidebar-bg</code>
              </td>
              <td>Panel background</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-color</code>
              </td>
              <td>Panel foreground (brand and buttons inherit)</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-padding-block</code>
              </td>
              <td>Top and bottom padding on header / footer</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-padding-inline</code>
              </td>
              <td>Panel outer gutter; feeds the rail-width recipe</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-gap</code>
              </td>
              <td>Space between header, content, footer</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-width</code>
              </td>
              <td>
                Expanded panel width. Opt-in; set it to let the sidebar own its
                width and animate the collapse. Loses to inline{" "}
                <code>width</code> or a parent that sizes the panel.
              </td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-width-collapsed</code>
              </td>
              <td>
                Rail width applied under <code>[data-collapsed]</code>. Pair
                with <code>--sidebar-width</code> and the flip animates via{" "}
                <code>--sidebar-transition-duration</code>.
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Brand</h3>
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
                <code>--sidebar-brand-color</code>
              </td>
              <td>Brand text color</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-brand-icon-size</code>
              </td>
              <td>
                Brand icon dimensions; load-bearing for rail re-center math
              </td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-brand-gap</code>
              </td>
              <td>Space between brand icon and wordmark</td>
            </tr>
          </tbody>
        </table>

        <h3>Button (item)</h3>
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
                <code>--sidebar-button-height</code>
              </td>
              <td>Hard height</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-padding-inline</code>
              </td>
              <td>
                Horizontal inset. Load-bearing for rail symmetry:{" "}
                <code>padding + icon-size + padding</code> equals{" "}
                <code>button-height</code> so the icon centers at rail width
                with no <code>justify-content</code> override.
              </td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-padding-block</code>
              </td>
              <td>
                Vertical padding; defaults to <code>0</code> since the row
                height owns the rhythm
              </td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-radius</code>
              </td>
              <td>Corner radius</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-gap</code>
              </td>
              <td>Space between icon and label</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-font-weight</code>
              </td>
              <td>Label weight</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-color</code>
              </td>
              <td>Rest text color</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-bg-hover</code>
              </td>
              <td>Hover chip fill</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-color-hover</code>
              </td>
              <td>Hover text color</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-bg-active</code>
              </td>
              <td>
                Active chip fill (<code>aria-current="page"</code> or{" "}
                <code>data-state="active"</code>)
              </td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-color-active</code>
              </td>
              <td>Active text color</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-icon-size</code>
              </td>
              <td>
                Icon dimensions; load-bearing for the rail recipe and the
                chevron
              </td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-button-icon-color</code>
              </td>
              <td>
                Icon color at rest and hover. Active rows flip the icon to{" "}
                <code>--sidebar-button-color-active</code> so the row reads
                unified.
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Item action</h3>
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
                <code>--sidebar-item-action-size</code>
              </td>
              <td>
                Right-edge slot reserved size (matches button height so the slot
                fills the row vertically). A <code>.button</code> inside still
                collapses to a fixed square via an internal override.
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Group</h3>
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
                <code>--sidebar-group-gap</code>
              </td>
              <td>Space between groups in the menu</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-group-title-font-size</code>
              </td>
              <td>Caption text size</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-group-title-font-weight</code>
              </td>
              <td>Caption weight</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-group-title-color</code>
              </td>
              <td>
                Caption color (also tints <code>.sidebar__group-action</code>)
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Submenu</h3>
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
                <code>--sidebar-submenu-border-color</code>
              </td>
              <td>Guide-line color</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-submenu-padding-inline-start</code>
              </td>
              <td>Space between the guide line and submenu rows</td>
            </tr>
            <tr>
              <td>
                <code>--sidebar-submenu-margin-inline-start</code>
              </td>
              <td>
                Inset from the panel edge; aligns the guide line on the parent
                icon's center axis
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Motion</h3>
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
                <code>--sidebar-transition-duration</code>
              </td>
              <td>
                Rail-mode soft-hide and width transition. Zeroed under{" "}
                <code>prefers-reduced-motion</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
