import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/menu")({
  component: MenuDocs,
});

function MenuDocs() {
  return (
    <>
      <header>
        <h1>Menu</h1>
        <p className="lead">
          A floating list of actions anchored to a trigger.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          The <code>.menu</code> wrapper holds a trigger and a{" "}
          <code>.menu__popup</code> surface of <code>.menu__item</code> rows.
          Give the popup an <code>id</code> + <code>data-stisla-menu</code>,
          point a <code>data-stisla-menu-trigger="id"</code> button at it, and
          the <code>@stisla/vanilla</code> layer positions it with Floating UI
          and wires arrow-key navigation, typeahead, and outside-click / ESC
          dismiss. Navigable rows are matched by <code>role</code>, the keyboard
          cursor is <code>data-highlighted</code>, and a checkable row flips{" "}
          <code>data-state="checked"</code>. The demos below are live. Rows take
          a leading icon and an optional trailing <code>.menu__shortcut</code>.
          A <code>.menu__separator</code> splits groups, and{" "}
          <code>.menu__item--danger</code> marks a destructive action.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="menu">
  <button class="button button--neutral" data-stisla-menu-trigger="menu-basic" aria-haspopup="menu" aria-expanded="false">Actions</button>
  <div class="menu__popup" id="menu-basic" data-stisla-menu role="menu" data-state="closed">
    <button class="menu__item" role="menuitem"><i data-lucide="pencil"></i> Edit <span class="menu__shortcut">⌘E</span></button>
    <button class="menu__item" role="menuitem"><i data-lucide="copy"></i> Duplicate <span class="menu__shortcut">⌘D</span></button>
    <button class="menu__item" role="menuitem"><i data-lucide="share-2"></i> Share</button>
    <hr class="menu__separator" role="separator" />
    <button class="menu__item menu__item--danger" role="menuitem"><i data-lucide="trash-2"></i> Delete <span class="menu__shortcut">⌫</span></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          The trigger behaves like a menu button. Open it with <kbd>Enter</kbd>,{" "}
          <kbd>Space</kbd>, or <kbd>ArrowDown</kbd>; the first enabled item
          takes focus.
        </p>
        <ul>
          <li>
            <kbd>ArrowDown</kbd> / <kbd>ArrowUp</kbd>: move focus through
            enabled items (wraps at the ends)
          </li>
          <li>
            <kbd>Home</kbd> / <kbd>End</kbd>: focus the first / last enabled
            item
          </li>
          <li>
            <kbd>Enter</kbd> / <kbd>Space</kbd>: activate the focused item
          </li>
          <li>
            <kbd>Escape</kbd>: close the menu and return focus to the trigger
          </li>
          <li>
            <kbd>Tab</kbd>: close the menu and move focus to the next element on
            the page
          </li>
        </ul>
      </section>

      <section>
        <h2>With icons</h2>
        <p>
          Drop an <code>&lt;i data-lucide&gt;</code> as the first child of an
          item. The icon pins to 1rem and inherits the row color on hover so it
          tracks the surface naturally.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-icons" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-icons">Account</button>
  <div class="menu__popup" id="menu-icons" data-stisla-menu role="menu" data-state="closed">
    <a href="#" class="menu__item" role="menuitem"><i data-lucide="user"></i><span>Profile</span></a>
    <a href="#" class="menu__item" role="menuitem"><i data-lucide="settings"></i><span>Settings</span></a>
    <a href="#" class="menu__item" role="menuitem"><i data-lucide="bell"></i><span>Notifications</span></a>
    <hr class="menu__separator" role="separator" />
    <a href="#" class="menu__item" role="menuitem"><i data-lucide="log-out"></i><span>Sign out</span></a>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Headers and dividers</h2>
        <p>
          Use <code>.menu__group-label</code> to label a section and{" "}
          <code>.menu__separator</code> to separate groups. Wrap rows in a{" "}
          <code>role="group"</code> with <code>aria-labelledby</code> pointing
          at the header so screen readers announce the grouping.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-groups" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-groups">Workspace</button>
  <div class="menu__popup" id="menu-groups" data-stisla-menu role="menu" data-state="closed">
    <div class="menu__group" role="group" aria-labelledby="menu-groups-account">
      <h3 class="menu__group-label" id="menu-groups-account">Account</h3>
      <a href="#" class="menu__item" role="menuitem">Profile</a>
      <a href="#" class="menu__item" role="menuitem">Billing</a>
    </div>
    <hr class="menu__separator" role="separator" />
    <div class="menu__group" role="group" aria-labelledby="menu-groups-workspace">
      <h3 class="menu__group-label" id="menu-groups-workspace">Workspace</h3>
      <a href="#" class="menu__item" role="menuitem">Members</a>
      <a href="#" class="menu__item" role="menuitem">Settings</a>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Active and disabled</h2>
        <p>
          Mark the user's currently-applied choice with{" "}
          <code>aria-current="true"</code> or <code>data-state="active"</code>.
          Both paint the persistent selected fill. Disabled rows take{" "}
          <code>aria-disabled="true"</code> on anchors or the native{" "}
          <code>disabled</code> attribute on buttons.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-sort" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-sort">Sort by</button>
  <div class="menu__popup" id="menu-sort" data-stisla-menu role="menu" data-state="closed">
    <button class="menu__item" role="menuitem" aria-current="true">Newest first</button>
    <button class="menu__item" role="menuitem">Oldest first</button>
    <button class="menu__item" role="menuitem">Alphabetical</button>
    <button class="menu__item" role="menuitem" disabled>By owner (Pro)</button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Destructive items</h2>
        <p>
          Add <code>.menu__item--danger</code> for actions that delete data or
          sign the user out. The color flips to the danger token and hover
          paints a soft danger tint instead of the standard accent fill so the
          row never reads like a routine choice.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-danger" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-danger">Manage project</button>
  <div class="menu__popup" id="menu-danger" data-stisla-menu role="menu" data-state="closed">
    <button class="menu__item" role="menuitem"><i data-lucide="pencil"></i><span>Rename</span></button>
    <button class="menu__item" role="menuitem"><i data-lucide="copy"></i><span>Duplicate</span></button>
    <button class="menu__item" role="menuitem"><i data-lucide="archive"></i><span>Archive</span></button>
    <hr class="menu__separator" role="separator" />
    <button class="menu__item menu__item--danger" role="menuitem"><i data-lucide="trash-2"></i><span>Delete project</span></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Checkbox items</h2>
        <p>
          Items with <code>role="menuitemcheckbox"</code> toggle between checked
          and unchecked on click. The framework flips <code>data-state</code>{" "}
          and <code>aria-checked</code>; the leading{" "}
          <code>.menu__indicator</code> slot paints the check glyph when
          checked. The menu stays open between toggles via{" "}
          <code>data-stisla-menu-auto-close="outside"</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-check" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-check">View</button>
  <div class="menu__popup" id="menu-check" data-stisla-menu data-stisla-menu-auto-close="outside" role="menu" data-state="closed">
    <button class="menu__item" role="menuitemcheckbox" data-state="checked" aria-checked="true"><span class="menu__indicator"><i data-lucide="check"></i></span><span>Show grid</span></button>
    <button class="menu__item" role="menuitemcheckbox" data-state="unchecked" aria-checked="false"><span class="menu__indicator"><i data-lucide="check"></i></span><span>Show ruler</span></button>
    <button class="menu__item" role="menuitemcheckbox" data-state="checked" aria-checked="true"><span class="menu__indicator"><i data-lucide="check"></i></span><span>Snap to pixels</span></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Radio items</h2>
        <p>
          Items with <code>role="menuitemradio"</code> inside a{" "}
          <code>role="group"</code> behave like a radio group. Clicking one item
          checks it and unchecks every sibling in the same group. They use the
          same indicator slot as checkbox items.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-radio" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-radio">Theme</button>
  <div class="menu__popup" id="menu-radio" data-stisla-menu data-stisla-menu-auto-close="outside" role="menu" data-state="closed">
    <div role="group" aria-labelledby="menu-radio-header" class="flex flex-col gap-0.5">
      <h3 class="menu__group-label" id="menu-radio-header">Appearance</h3>
      <button class="menu__item" role="menuitemradio" data-state="checked" aria-checked="true"><span class="menu__indicator"><i data-lucide="check"></i></span><span>Light</span></button>
      <button class="menu__item" role="menuitemradio" data-state="unchecked" aria-checked="false"><span class="menu__indicator"><i data-lucide="check"></i></span><span>Dark</span></button>
      <button class="menu__item" role="menuitemradio" data-state="unchecked" aria-checked="false"><span class="menu__indicator"><i data-lucide="check"></i></span><span>System</span></button>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Item shortcuts</h2>
        <p>
          Append a <code>.menu__shortcut</code> chip after the label and
          auto-margin pushes it to the trailing edge of the row. Pair with{" "}
          <code>&lt;kbd&gt;</code> for the keystroke glyphs. The chip color
          inherits in hover and active paint so it stays readable on the
          highlight surface.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-shortcut" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-shortcut">File</button>
  <div class="menu__popup max-w-56" id="menu-shortcut" data-stisla-menu role="menu" data-state="closed">
    <button class="menu__item" role="menuitem"><span>New file</span><span class="menu__shortcut"><kbd>⌘</kbd><kbd>N</kbd></span></button>
    <button class="menu__item" role="menuitem"><span>Open…</span><span class="menu__shortcut"><kbd>⌘</kbd><kbd>O</kbd></span></button>
    <button class="menu__item" role="menuitem"><span>Save</span><span class="menu__shortcut"><kbd>⌘</kbd><kbd>S</kbd></span></button>
    <hr class="menu__separator" role="separator" />
    <button class="menu__item" role="menuitem"><span>Print</span><span class="menu__shortcut"><kbd>⌘</kbd><kbd>P</kbd></span></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Media rows</h2>
        <p>
          Borrow the <code>.media</code> row for notification or message menus
          that pair an avatar or icon with a title and supporting lines. Give
          each row <code>role="menuitem"</code> and the menu folds it into
          keyboard navigation. The menu matches items by their role, so
          hover and arrow-key highlight paint the same as a plain item and round
          to the same row corners.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-media" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-media">Notifications</button>
  <div class="menu__popup w-80" id="menu-media" data-stisla-menu role="menu" data-state="closed">
    <a href="#" class="media media--seamless items-start" role="menuitem">
      <div class="media__figure mt-1"><span class="icon-box icon-box--primary"><i data-lucide="shopping-bag"></i></span></div>
      <div class="media__content">
        <div class="media__title">New order #10428</div>
        <div class="media__description">Acme Corp placed an order for 12 items.</div>
        <div class="media__meta">2 minutes ago</div>
      </div>
    </a>
    <a href="#" class="media media--seamless items-start" role="menuitem">
      <div class="media__figure mt-1"><span class="icon-box icon-box--warning"><i data-lucide="triangle-alert"></i></span></div>
      <div class="media__content">
        <div class="media__title">Low stock</div>
        <div class="media__description">Headphone Blitz is down to 4 units.</div>
        <div class="media__meta">1 hour ago</div>
      </div>
    </a>
    <a href="#" class="media media--seamless items-start" role="menuitem">
      <div class="media__figure mt-1"><span class="icon-box icon-box--success"><i data-lucide="user-plus"></i></span></div>
      <div class="media__content">
        <div class="media__title">12 new customers</div>
        <div class="media__description">Sign-ups climbed this week.</div>
        <div class="media__meta">Today</div>
      </div>
    </a>
    <hr class="menu__separator" role="separator" />
    <a href="#" class="menu__item justify-center" role="menuitem">View all notifications</a>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Placement</h2>
        <p>
          Set <code>data-stisla-menu-placement</code> on the menu to override
          the default <code>bottom-start</code>. Floating UI flips the menu
          automatically when it would overflow the viewport, so the value is a
          preference.
        </p>
        <Demo
          layout="row"
          html={`
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-top" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-top">Top</button>
  <div class="menu__popup" id="menu-top" data-stisla-menu data-stisla-menu-placement="top" role="menu" data-state="closed">
    <button class="menu__item" role="menuitem">Action</button>
    <button class="menu__item" role="menuitem">Another action</button>
  </div>
</div>
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-right" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-right">Right</button>
  <div class="menu__popup" id="menu-right" data-stisla-menu data-stisla-menu-placement="right-start" role="menu" data-state="closed">
    <button class="menu__item" role="menuitem">Action</button>
    <button class="menu__item" role="menuitem">Another action</button>
  </div>
</div>
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-left" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-left">Left</button>
  <div class="menu__popup" id="menu-left" data-stisla-menu data-stisla-menu-placement="left-start" role="menu" data-state="closed">
    <button class="menu__item" role="menuitem">Action</button>
    <button class="menu__item" role="menuitem">Another action</button>
  </div>
</div>
<div class="menu">
  <button class="button button--outline button--neutral" data-stisla-menu-trigger="menu-bottom-end" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-bottom-end">Bottom-end</button>
  <div class="menu__popup" id="menu-bottom-end" data-stisla-menu data-stisla-menu-placement="bottom-end" role="menu" data-state="closed">
    <button class="menu__item" role="menuitem">Action</button>
    <button class="menu__item" role="menuitem">Another action</button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Four events fire on the <code>.menu</code> root. The{" "}
          <code>opening</code> and <code>closing</code> events are cancelable.
        </p>
        <p>
          <code>stisla:menu:opening</code> fires before the menu mounts. Call{" "}
          <code>preventDefault()</code> to abort.
        </p>
        <p>
          <code>stisla:menu:opened</code> fires once the menu is positioned and
          focus has moved to the first item.
        </p>
        <p>
          <code>stisla:menu:closing</code> fires before the menu dismisses. Call{" "}
          <code>preventDefault()</code> to keep it open.
        </p>
        <p>
          <code>stisla:menu:closed</code> fires once the menu is hidden and
          focus has returned to the trigger.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the menu. Override on the root or any wrapper.
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
                <code>--menu-z-index</code>
              </td>
              <td>Overlay stacking order</td>
            </tr>
            <tr>
              <td>
                <code>--menu-min-width</code>
              </td>
              <td>Popup minimum width</td>
            </tr>
            <tr>
              <td>
                <code>--menu-gap</code>
              </td>
              <td>Gap between rows</td>
            </tr>
            <tr>
              <td>
                <code>--menu-padding-block</code> / <code>-padding-inline</code>
              </td>
              <td>
                Popup interior padding; the inline value also feeds the
                concentric item radius
              </td>
            </tr>
            <tr>
              <td>
                <code>--menu-bg</code> / <code>-color</code> /{" "}
                <code>-border-color</code>
              </td>
              <td>Popup fill, text, and rim</td>
            </tr>
            <tr>
              <td>
                <code>--menu-radius</code> / <code>-shadow</code>
              </td>
              <td>Popup corner radius and elevation</td>
            </tr>
            <tr>
              <td>
                <code>--menu-item-gap</code> / <code>-item-min-height</code> /{" "}
                <code>-item-padding-block</code> /{" "}
                <code>-item-padding-inline</code>
              </td>
              <td>Row layout</td>
            </tr>
            <tr>
              <td>
                <code>--menu-item-bg-hover</code> /{" "}
                <code>-item-color-hover</code>
              </td>
              <td>Hover and keyboard-highlight paint (accent)</td>
            </tr>
            <tr>
              <td>
                <code>--menu-item-bg-active</code> /{" "}
                <code>-item-color-active</code>
              </td>
              <td>Selected-row paint (highlight)</td>
            </tr>
            <tr>
              <td>
                <code>--menu-item-color-disabled</code>
              </td>
              <td>Disabled row text</td>
            </tr>
            <tr>
              <td>
                <code>--menu-item-color-danger</code> /{" "}
                <code>-item-bg-danger-hover</code>
              </td>
              <td>Destructive row text and hover tint</td>
            </tr>
            <tr>
              <td>
                <code>--menu-item-icon-size</code> /{" "}
                <code>-item-icon-color</code>
              </td>
              <td>Leading icon size and color (tracks row text by default)</td>
            </tr>
            <tr>
              <td>
                <code>--menu-shortcut-font-size</code> /{" "}
                <code>-shortcut-color</code>
              </td>
              <td>Trailing shortcut chip type</td>
            </tr>
            <tr>
              <td>
                <code>--menu-group-label-*</code>
              </td>
              <td>Section label padding, type, and color</td>
            </tr>
            <tr>
              <td>
                <code>--menu-separator-color</code> /{" "}
                <code>-separator-margin-block</code>
              </td>
              <td>Divider stroke and spacing</td>
            </tr>
            <tr>
              <td>
                <code>--menu-transition-duration</code>
              </td>
              <td>Open fade timing; zeroed under reduced-motion</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
