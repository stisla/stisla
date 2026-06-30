import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/drawer")({
  component: DrawerDocs,
});

function DrawerDocs() {
  return (
    <>
      <header>
        <h1>Drawer</h1>
        <p className="lead">
          An edge-anchored panel for side drawers, filters, and quick captures.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          A trigger opens the panel via{" "}
          <code>data-stisla-drawer-trigger="&lt;id&gt;"</code>. The panel itself
          is a <code>.drawer</code> with an optional{" "}
          <code>.drawer__header</code>, a <code>.drawer__body</code>, and an
          optional <code>.drawer__footer</code>. The dismiss control is{" "}
          <code>.drawer__close</code>, an inline ghost icon button at the
          trailing edge of the header row. Default placement is the right edge.
        </p>
        <Demo
          layout="stack"
          html={`
<button type="button" class="button button--primary" data-stisla-drawer-trigger="drawerBasic">New task</button>

<div class="drawer" id="drawerBasic" data-stisla-drawer aria-labelledby="drawerBasicLabel">
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title" id="drawerBasicLabel">New task</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body">
      <div class="field mb-4">
        <label for="taskTitle" class="field__label">Title</label>
        <input type="text" class="input" id="taskTitle" placeholder="Write the launch announcement" />
      </div>
      <div class="field mb-4">
        <label for="taskDesc" class="field__label">Description</label>
        <textarea class="textarea" id="taskDesc" rows="4" placeholder="Anything the assignee should know before they start."></textarea>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="field">
          <label for="taskDue" class="field__label">Due</label>
          <input type="date" class="input" id="taskDue" />
        </div>
        <div class="field">
          <label for="taskPriority" class="field__label">Priority</label>
          <select class="select" id="taskPriority">
            <option>Low</option>
            <option selected>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>
    </div>
    <div class="drawer__footer">
      <button type="button" class="button button--ghost button--neutral" data-stisla-drawer-dismiss>Cancel</button>
      <button type="button" class="button button--primary" data-stisla-drawer-dismiss>Create task</button>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          In the default modal mode, focus is trapped inside the drawer while
          it's open. On open, focus lands on the first element marked{" "}
          <code>autofocus</code>, falling back to <code>.drawer__close</code>;
          on close, focus returns to the trigger that opened it. Non-modal
          drawers (the No backdrop variant) skip the focus trap so the rest of
          the page stays reachable.
        </p>
        <ul>
          <li>
            <kbd>Tab</kbd>: cycle focus forward through focusable controls
            (wraps to the first in modal mode)
          </li>
          <li>
            <kbd>Shift</kbd> + <kbd>Tab</kbd>: cycle focus backward (wraps to
            the last in modal mode)
          </li>
          <li>
            <kbd>Escape</kbd>: dismiss the drawer (unless the backdrop is
            static, see Static backdrop below)
          </li>
        </ul>
      </section>

      <section>
        <h2>Placements</h2>
        <p>
          Four modifiers anchor the panel to a viewport edge.{" "}
          <code>.drawer--start</code> slides in from the left,{" "}
          <code>.drawer--end</code> from the right, <code>.drawer--top</code>{" "}
          from above, <code>.drawer--bottom</code> from below. Start and end
          take a fixed width, top and bottom take a fixed height. Bare{" "}
          <code>.drawer</code> behaves as end.
        </p>
        <Demo
          layout="row"
          html={`
<button type="button" class="button button--outline button--neutral" data-stisla-drawer-trigger="drawerStart">Start</button>
<button type="button" class="button button--outline button--neutral" data-stisla-drawer-trigger="drawerEnd">End</button>
<button type="button" class="button button--outline button--neutral" data-stisla-drawer-trigger="drawerTop">Top</button>
<button type="button" class="button button--outline button--neutral" data-stisla-drawer-trigger="drawerBottom">Bottom</button>

<div class="drawer drawer--start" id="drawerStart" data-stisla-drawer>
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">Account</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body p-0">
      <ul class="list-group list-group--flush">
        <li class="flex flex-wrap list-group__item items-center gap-3">
          <span class="icon-box icon-box--primary"><i data-lucide="user"></i></span>
          <div class="flex-1"><div class="font-medium">Profile</div><div class="text-sm text-muted-foreground">Name, avatar, bio</div></div>
          <i data-lucide="chevron-right" width="18" class="text-muted-foreground"></i>
        </li>
        <li class="flex flex-wrap list-group__item items-center gap-3">
          <span class="icon-box icon-box--info"><i data-lucide="bell"></i></span>
          <div class="flex-1"><div class="font-medium">Notifications</div><div class="text-sm text-muted-foreground">Email, push, digest</div></div>
          <i data-lucide="chevron-right" width="18" class="text-muted-foreground"></i>
        </li>
        <li class="flex flex-wrap list-group__item items-center gap-3">
          <span class="icon-box icon-box--warning"><i data-lucide="credit-card"></i></span>
          <div class="flex-1"><div class="font-medium">Billing</div><div class="text-sm text-muted-foreground">Plan, invoices, payment method</div></div>
          <i data-lucide="chevron-right" width="18" class="text-muted-foreground"></i>
        </li>
        <li class="flex flex-wrap list-group__item items-center gap-3">
          <span class="icon-box"><i data-lucide="shield"></i></span>
          <div class="flex-1"><div class="font-medium">Security</div><div class="text-sm text-muted-foreground">Password, 2FA, sessions</div></div>
          <i data-lucide="chevron-right" width="18" class="text-muted-foreground"></i>
        </li>
      </ul>
    </div>
  </div>
</div>
<div class="drawer drawer--end" id="drawerEnd" data-stisla-drawer>
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">Notifications</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body">
      <div class="flex flex-wrap md:flex-nowrap gap-3 mb-4 pb-4 border-b border-[var(--color-border)]">
        <span class="icon-box icon-box--success icon-box--round shrink-0"><i data-lucide="check"></i></span>
        <div>
          <div class="font-medium">Deploy finished</div>
          <p class="text-muted-foreground m-0 mb-1 text-sm">Build #2147 shipped to production in 4m 12s.</p>
          <span class="text-sm text-muted-foreground">2 minutes ago</span>
        </div>
      </div>
      <div class="flex flex-wrap md:flex-nowrap gap-3 mb-4 pb-4 border-b border-[var(--color-border)]">
        <span class="icon-box icon-box--info icon-box--round shrink-0"><i data-lucide="message-square"></i></span>
        <div>
          <div class="font-medium">Amelia replied</div>
          <p class="text-muted-foreground m-0 mb-1 text-sm">Let's pair on the cart bug tomorrow morning.</p>
          <span class="text-sm text-muted-foreground">12 minutes ago</span>
        </div>
      </div>
      <div class="flex flex-wrap md:flex-nowrap gap-3">
        <span class="icon-box icon-box--warning icon-box--round shrink-0"><i data-lucide="triangle-alert"></i></span>
        <div>
          <div class="font-medium">Disk above 80%</div>
          <p class="text-muted-foreground m-0 mb-1 text-sm">db-primary-2 is at 84% used. Consider expanding the volume.</p>
          <span class="text-sm text-muted-foreground">35 minutes ago</span>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="drawer drawer--top" id="drawerTop" data-stisla-drawer style="--drawer-height: 16rem">
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">What's new in June</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body">
      <div class="grid md:grid-cols-3 gap-3">
        <div>
          <span class="badge badge--primary mb-2">New</span>
          <div class="font-medium mb-1">Bulk reassign</div>
          <p class="text-muted-foreground m-0 text-sm">Move many tasks to a new owner in one go from the board view.</p>
        </div>
        <div>
          <span class="badge badge--success mb-2">Improved</span>
          <div class="font-medium mb-1">Faster search</div>
          <p class="text-muted-foreground m-0 text-sm">Workspace search now returns results in under 100ms for most queries.</p>
        </div>
        <div>
          <span class="badge badge--warning mb-2">Fixed</span>
          <div class="font-medium mb-1">Recurring task DST</div>
          <p class="text-muted-foreground m-0 text-sm">Recurring tasks no longer drift by an hour around daylight saving.</p>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="drawer drawer--bottom" id="drawerBottom" data-stisla-drawer style="--drawer-height: 14rem">
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <div class="flex flex-wrap mx-auto w-full items-center max-w-[30rem]">
        <h2 class="drawer__title">Share this report</h2>
        <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
      </div>
    </div>
    <div class="drawer__body">
      <div class="mx-auto w-full max-w-[30rem]">
        <div class="input-group mb-4">
          <input type="text" class="input" value="https://app.example.com/r/q3-revenue" readonly />
          <button class="button button--outline button--neutral" type="button">Copy link</button>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="button button--outline button--neutral"><i data-lucide="mail"></i> Email</button>
          <button type="button" class="button button--outline button--neutral"><i data-lucide="message-circle"></i> Slack</button>
          <button type="button" class="button button--outline button--neutral"><i data-lucide="download"></i> Download PDF</button>
          <button type="button" class="button button--outline button--neutral"><i data-lucide="printer"></i> Print</button>
        </div>
      </div>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Floating</h2>
        <p>
          Add <code>.drawer--floating</code> to detach the panel from the
          viewport. It gains a gap on every side, rounded corners, and a full
          border so it reads as a raised card instead of a flush sheet. The
          modifier stacks onto any placement. Tune the breathing room with{" "}
          <code>--drawer-gap</code> and the corners with{" "}
          <code>--drawer-radius</code>.
        </p>
        <Demo
          layout="row"
          html={`
<button type="button" class="button button--outline button--neutral" data-stisla-drawer-trigger="drawerFloatStart">Start</button>
<button type="button" class="button button--outline button--neutral" data-stisla-drawer-trigger="drawerFloatEnd">End</button>
<button type="button" class="button button--outline button--neutral" data-stisla-drawer-trigger="drawerFloatBottom">Bottom</button>

<div class="drawer drawer--floating drawer--start" id="drawerFloatStart" data-stisla-drawer>
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">Invite people</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body">
      <p class="text-muted-foreground">Send an invite and they'll join the workspace right away.</p>
      <div class="field mb-4">
        <label for="inviteEmail" class="field__label">Email</label>
        <input type="email" class="input" id="inviteEmail" placeholder="teammate@example.com" />
      </div>
      <div class="field">
        <label for="inviteRole" class="field__label">Role</label>
        <select class="select" id="inviteRole">
          <option selected>Member</option>
          <option>Admin</option>
          <option>Viewer</option>
        </select>
      </div>
    </div>
    <div class="drawer__footer">
      <button type="button" class="button button--ghost button--neutral" data-stisla-drawer-dismiss>Cancel</button>
      <button type="button" class="button button--primary" data-stisla-drawer-dismiss>Send invite</button>
    </div>
  </div>
</div>
<div class="drawer drawer--floating" id="drawerFloatEnd" data-stisla-drawer>
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">Help &amp; resources</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body p-0">
      <ul class="list-group list-group--flush">
        <li class="flex flex-wrap list-group__item items-center gap-3">
          <span class="icon-box icon-box--primary"><i data-lucide="book-open"></i></span>
          <div class="flex-1"><div class="font-medium">Documentation</div><div class="text-sm text-muted-foreground">Guides and API reference</div></div>
          <i data-lucide="chevron-right" width="18" class="text-muted-foreground"></i>
        </li>
        <li class="flex flex-wrap list-group__item items-center gap-3">
          <span class="icon-box icon-box--info"><i data-lucide="message-circle"></i></span>
          <div class="flex-1"><div class="font-medium">Contact support</div><div class="text-sm text-muted-foreground">Replies within a day</div></div>
          <i data-lucide="chevron-right" width="18" class="text-muted-foreground"></i>
        </li>
        <li class="flex flex-wrap list-group__item items-center gap-3">
          <span class="icon-box icon-box--warning"><i data-lucide="keyboard"></i></span>
          <div class="flex-1"><div class="font-medium">Keyboard shortcuts</div><div class="text-sm text-muted-foreground">Work faster with hotkeys</div></div>
          <i data-lucide="chevron-right" width="18" class="text-muted-foreground"></i>
        </li>
      </ul>
    </div>
  </div>
</div>
<div class="drawer drawer--floating drawer--bottom" id="drawerFloatBottom" data-stisla-drawer style="--drawer-height: 14rem">
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">Cookie preferences</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body">
      <p class="text-muted-foreground m-0">We use cookies to keep you signed in, remember your preferences, and understand how the app is used.</p>
    </div>
    <div class="drawer__footer">
      <button type="button" class="button button--ghost button--neutral" data-stisla-drawer-dismiss>Reject all</button>
      <button type="button" class="button button--primary" data-stisla-drawer-dismiss>Accept all</button>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Sized</h2>
        <p>
          Override <code>--drawer-width</code> (start/end) or{" "}
          <code>--drawer-height</code> (top/bottom) inline on the root to retune
          a single instance. The default width is <code>22rem</code>; this one
          widens to <code>28rem</code> for a roomier form layout.
        </p>
        <Demo
          layout="stack"
          html={`
<button type="button" class="button button--primary" data-stisla-drawer-trigger="drawerSized">Edit profile</button>

<div class="drawer" id="drawerSized" data-stisla-drawer style="--drawer-width: 28rem">
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">Edit profile</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body">
      <div class="grid grid-cols-2 gap-3">
        <div class="field">
          <label for="profileFirst" class="field__label">First name</label>
          <input type="text" class="input" id="profileFirst" value="Nauval" />
        </div>
        <div class="field">
          <label for="profileLast" class="field__label">Last name</label>
          <input type="text" class="input" id="profileLast" value="Azhar" />
        </div>
        <div class="field col-span-2">
          <label for="profileBio" class="field__label">Bio</label>
          <textarea class="textarea" id="profileBio" rows="3">Designer and maintainer of Stisla.</textarea>
        </div>
        <div class="field col-span-2">
          <label for="profileEmail" class="field__label">Email</label>
          <input type="email" class="input" id="profileEmail" value="nauvalazhar2@gmail.com" />
        </div>
      </div>
    </div>
    <div class="drawer__footer">
      <button type="button" class="button button--ghost button--neutral" data-stisla-drawer-dismiss>Cancel</button>
      <button type="button" class="button button--primary" data-stisla-drawer-dismiss>Save changes</button>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Body scroll allowed</h2>
        <p>
          Set <code>data-stisla-drawer-scroll="true"</code> to let the page
          behind keep scrolling while the panel is open. Useful for activity
          feeds or reference panels that support the main task without
          interrupting it.
        </p>
        <Demo
          layout="stack"
          html={`
<button type="button" class="button button--primary" data-stisla-drawer-trigger="drawerActivity">Open activity</button>

<aside class="drawer" id="drawerActivity" data-stisla-drawer data-stisla-drawer-scroll="true" data-stisla-drawer-backdrop="false" aria-label="Activity">
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">Activity</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body">
      <ol class="m-0 p-0 list-none">
        <li class="flex flex-wrap items-center gap-3 mb-4">
          <div class="icon-box icon-box--primary icon-box--round shrink-0" style="--icon-box-size: 2rem"><i data-lucide="git-commit"></i></div>
          <div><div><span class="font-medium">Amelia</span> pushed 3 commits to <code>main</code></div><span class="text-sm text-muted-foreground">9:42 AM</span></div>
        </li>
        <li class="flex flex-wrap items-center gap-3 mb-4">
          <div class="icon-box icon-box--success icon-box--round shrink-0" style="--icon-box-size: 2rem"><i data-lucide="check"></i></div>
          <div><div><span class="font-medium">Jonas</span> completed Audit checkout copy</div><span class="text-sm text-muted-foreground">9:31 AM</span></div>
        </li>
        <li class="flex flex-wrap items-center gap-3 mb-4">
          <div class="icon-box icon-box--warning icon-box--round shrink-0" style="--icon-box-size: 2rem"><i data-lucide="user-plus"></i></div>
          <div><div><span class="font-medium">Lena</span> joined the workspace</div><span class="text-sm text-muted-foreground">Yesterday</span></div>
        </li>
        <li class="flex flex-wrap items-center gap-3">
          <div class="icon-box icon-box--danger icon-box--round shrink-0" style="--icon-box-size: 2rem"><i data-lucide="circle-alert"></i></div>
          <div><div>Build #2143 failed on <code>release/v2</code></div><span class="text-sm text-muted-foreground">Yesterday</span></div>
        </li>
      </ol>
    </div>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Static backdrop</h2>
        <p>
          Set <code>data-stisla-drawer-backdrop="static"</code> and{" "}
          <code>data-stisla-drawer-keyboard="false"</code> to force a deliberate
          dismiss. The backdrop click shakes the panel along its slide axis
          instead of closing. Explicit dismiss controls still close.
        </p>
        <Demo
          layout="stack"
          html={`
<button type="button" class="button button--primary" data-stisla-drawer-trigger="drawerSetup">Finish setup</button>

<div class="drawer" id="drawerSetup" data-stisla-drawer data-stisla-drawer-backdrop="static" data-stisla-drawer-keyboard="false">
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">Finish your profile</h2>
    </div>
    <div class="drawer__body">
      <p class="text-muted-foreground">A few details so teammates know who they're working with.</p>
      <div class="field mb-4">
        <label for="setupName" class="field__label">Full name</label>
        <input type="text" class="input" id="setupName" value="Nauval Azhar" />
      </div>
      <div class="field mb-4">
        <label for="setupRole" class="field__label">Role</label>
        <select class="select" id="setupRole">
          <option>Engineering</option>
          <option selected>Design</option>
          <option>Product</option>
          <option>Operations</option>
        </select>
      </div>
      <div class="field">
        <label for="setupTimezone" class="field__label">Timezone</label>
        <select class="select" id="setupTimezone">
          <option>UTC−05:00 New York</option>
          <option>UTC+00:00 London</option>
          <option selected>UTC+07:00 Jakarta</option>
          <option>UTC+09:00 Tokyo</option>
        </select>
      </div>
    </div>
    <div class="drawer__footer">
      <button type="button" class="button button--primary button--block" data-stisla-drawer-dismiss>Save and continue</button>
    </div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>No backdrop</h2>
        <p>
          Set <code>data-stisla-drawer-backdrop="false"</code> to drop the dim
          entirely so the panel sits alongside the main content. Pair with{" "}
          <code>data-stisla-drawer-scroll="true"</code> for filter panels and
          inspector strips the user wants to keep open while they read or click
          around.
        </p>
        <Demo
          layout="stack"
          html={`
<button type="button" class="button button--outline button--neutral" data-stisla-drawer-trigger="drawerFilters"><i data-lucide="filter"></i> Filters</button>

<aside class="drawer drawer--start" id="drawerFilters" data-stisla-drawer data-stisla-drawer-backdrop="false" data-stisla-drawer-scroll="true" aria-label="Filters">
  <div class="drawer__backdrop" data-stisla-drawer-dismiss></div>
  <div class="drawer__content">
    <div class="drawer__header">
      <h2 class="drawer__title">Filters</h2>
      <button type="button" class="drawer__close" data-stisla-drawer-dismiss aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="drawer__body">
      <div class="mb-6">
        <div class="font-medium mb-2">Status</div>
        <div class="field">
          <div class="field__item">
            <input class="checkbox" type="checkbox" id="fStatusOpen" checked />
            <label class="field__label" for="fStatusOpen">Open</label>
          </div>
          <div class="field__item">
            <input class="checkbox" type="checkbox" id="fStatusProgress" checked />
            <label class="field__label" for="fStatusProgress">In progress</label>
          </div>
          <div class="field__item">
            <input class="checkbox" type="checkbox" id="fStatusReview" />
            <label class="field__label" for="fStatusReview">In review</label>
          </div>
          <div class="field__item">
            <input class="checkbox" type="checkbox" id="fStatusDone" />
            <label class="field__label" for="fStatusDone">Done</label>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <div class="font-medium mb-2">Priority</div>
        <div class="field">
          <div class="field__item">
            <input class="checkbox" type="checkbox" id="fPriorityHigh" checked />
            <label class="field__label" for="fPriorityHigh">High</label>
          </div>
          <div class="field__item">
            <input class="checkbox" type="checkbox" id="fPriorityMed" />
            <label class="field__label" for="fPriorityMed">Medium</label>
          </div>
          <div class="field__item">
            <input class="checkbox" type="checkbox" id="fPriorityLow" />
            <label class="field__label" for="fPriorityLow">Low</label>
          </div>
        </div>
      </div>
      <div class="field">
        <label for="fAssignee" class="field__label font-medium">Assignee</label>
        <select class="select" id="fAssignee">
          <option selected>Anyone</option>
          <option>Me</option>
          <option>Amelia</option>
          <option>Jonas</option>
          <option>Priya</option>
        </select>
      </div>
    </div>
    <div class="drawer__footer">
      <button type="button" class="button button--ghost button--neutral" data-stisla-drawer-dismiss>Reset</button>
      <button type="button" class="button button--primary" data-stisla-drawer-dismiss>Apply filters</button>
    </div>
  </div>
</aside>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Four events fire on the <code>.drawer</code> root. The{" "}
          <code>opening</code> and <code>closing</code> events are cancelable.
        </p>
        <p>
          <code>stisla:drawer:opening</code> fires before the panel slides in.
          Call <code>preventDefault()</code> to abort.
        </p>
        <p>
          <code>stisla:drawer:opened</code> fires once the open transition lands
          and focus is in place.
        </p>
        <p>
          <code>stisla:drawer:closing</code> fires before the panel slides out.
          Call <code>preventDefault()</code> to keep it open.
        </p>
        <p>
          <code>stisla:drawer:closed</code> fires once the panel is fully hidden
          and (in modal mode) focus has returned to the trigger.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          Override these on the <code>.drawer</code> root (or globally) to
          retune a single instance.
        </p>

        <h3>Geometry</h3>
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
                <code>--drawer-width</code>
              </td>
              <td>
                Panel width for <code>--start</code> and <code>--end</code>{" "}
                (default).
              </td>
            </tr>
            <tr>
              <td>
                <code>--drawer-height</code>
              </td>
              <td>
                Panel height for <code>--top</code> and <code>--bottom</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>--drawer-padding-block</code>
              </td>
              <td>Top and bottom padding of the header and body.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-padding-inline</code>
              </td>
              <td>Left and right padding of the header and body.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-gap</code>
              </td>
              <td>
                Breathing room around the panel under <code>--floating</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>--drawer-z-index</code>
              </td>
              <td>Stack level. One tier below dialog.</td>
            </tr>
          </tbody>
        </table>

        <h3>Surface</h3>
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
                <code>--drawer-bg</code>
              </td>
              <td>Panel fill.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-color</code>
              </td>
              <td>Panel text color.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-border-width</code>
              </td>
              <td>
                Inner-edge border thickness; set <code>0</code> to drop it.
              </td>
            </tr>
            <tr>
              <td>
                <code>--drawer-border-color</code>
              </td>
              <td>Inner-edge border (only the side facing the viewport).</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-radius</code>
              </td>
              <td>
                Corner radius under <code>--floating</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>--drawer-shadow</code>
              </td>
              <td>Soft ambient shadow around the panel.</td>
            </tr>
          </tbody>
        </table>

        <h3>Backdrop</h3>
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
                <code>--drawer-backdrop-bg</code>
              </td>
              <td>Dim color over the page behind.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-backdrop-blur</code>
              </td>
              <td>Backdrop blur radius.</td>
            </tr>
          </tbody>
        </table>

        <h3>Title</h3>
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
                <code>--drawer-title-font-size</code>
              </td>
              <td>Pins the title size so any heading tag reads the same.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-title-font-weight</code>
              </td>
              <td>Title weight.</td>
            </tr>
          </tbody>
        </table>

        <h3>Close chip</h3>
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
                <code>--drawer-close-size</code>
              </td>
              <td>Width and height of the dismiss chip.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-close-color</code>
              </td>
              <td>Resting icon color.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-close-color-hover</code>
              </td>
              <td>Hover and focus icon color.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-close-bg-hover</code>
              </td>
              <td>Hover and focus chip background.</td>
            </tr>
          </tbody>
        </table>

        <h3>Footer</h3>
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
                <code>--drawer-footer-padding-block</code>
              </td>
              <td>Top and bottom padding for the footer band.</td>
            </tr>
            <tr>
              <td>
                <code>--drawer-footer-bg</code>
              </td>
              <td>
                Footer fill. Tints to the alt surface so the seam reads against
                the body.
              </td>
            </tr>
            <tr>
              <td>
                <code>--drawer-footer-border-color</code>
              </td>
              <td>Top border of the footer band.</td>
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
                <code>--drawer-transition-duration</code>
              </td>
              <td>
                Slide and backdrop fade duration. Zeroed under{" "}
                <code>prefers-reduced-motion: reduce</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
