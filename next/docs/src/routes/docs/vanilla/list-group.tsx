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
        <p className="lead">A stack of rows on a shared rounded surface.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Add <code>.list-group</code> to the wrapper and{" "}
          <code>.list-group__item</code> to each row. Any list element works (
          <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, or a{" "}
          <code>&lt;div&gt;</code>).
        </p>
        <Demo
          layout="stack"
          html={`
<ul class="list-group max-w-sm w-full">
  <li class="list-group__item">Frontend platform</li>
  <li class="list-group__item">Mobile apps</li>
  <li class="list-group__item">Data infrastructure</li>
  <li class="list-group__item">Customer success</li>
  <li class="list-group__item">Legal &amp; compliance</li>
</ul>`}
        />
      </section>

      <section>
        <h2>Active and disabled</h2>
        <p>
          Mark the selected row with <code>data-state="active"</code> (or{" "}
          <code>aria-current</code> on a link). Mark unreachable rows with{" "}
          <code>aria-disabled="true"</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<ul class="list-group max-w-sm w-full">
  <li class="list-group__item">Profile</li>
  <li class="list-group__item" data-state="active" aria-current="true">Billing</li>
  <li class="list-group__item">Notifications</li>
  <li class="list-group__item" aria-disabled="true">API keys (upgrade required)</li>
</ul>`}
        />
      </section>

      <section>
        <h2>Links and buttons</h2>
        <p>
          Swap <code>&lt;li&gt;</code> for <code>&lt;a&gt;</code> or{" "}
          <code>&lt;button&gt;</code> and the rows pick up hover + focus
          automatically (no opt-in class). A first-child{" "}
          <code>&lt;svg&gt;</code>/<code>&lt;i&gt;</code> pins as a leading
          icon.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="list-group max-w-sm w-full">
  <a href="#" class="list-group__item"><i data-lucide="layout-dashboard"></i>Dashboard</a>
  <a href="#" class="list-group__item"><i data-lucide="folder-kanban"></i>Projects</a>
  <a href="#" class="list-group__item" aria-current="page"><i data-lucide="users"></i>Team</a>
  <a href="#" class="list-group__item"><i data-lucide="settings"></i>Settings</a>
  <a href="#" class="list-group__item" aria-disabled="true"><i data-lucide="lock"></i>Audit log</a>
</div>`}
        />
      </section>

      <section>
        <h2>Flush</h2>
        <p>
          Add <code>.list-group--flush</code> to drop the outer border and
          radius — rows sit edge to edge with a divider between. Useful inside a
          parent that already owns a frame.
        </p>
        <Demo
          layout="stack"
          html={`
<ul class="list-group list-group--flush max-w-sm">
  <li class="list-group__item">Acme Corp</li>
  <li class="list-group__item">Nimbus Labs</li>
  <li class="list-group__item">Pinecone Studio</li>
  <li class="list-group__item">Westwind Holdings</li>
</ul>`}
        />
      </section>

      <section>
        <h2>Numbered</h2>
        <p>
          Drop <code>.list-group--numbered</code> on an <code>&lt;ol&gt;</code>.
          A CSS counter stamps the prefix and cascades through nested numbered
          lists.
        </p>
        <Demo
          layout="stack"
          html={`
<ol class="list-group list-group--numbered max-w-sm">
  <li class="list-group__item">Install the CLI</li>
  <li class="list-group__item">Authenticate with your account</li>
  <li class="list-group__item">Initialize a new project</li>
  <li class="list-group__item">Deploy to production</li>
</ol>`}
        />
      </section>

      <section>
        <h2>Horizontal</h2>
        <p>
          Use <code>.list-group--horizontal</code> to lay rows side by side; add
          a breakpoint suffix (<code>-sm</code> … <code>-2xl</code>) to switch
          to row layout above that width.
        </p>
        <Demo
          html={`
<ul class="list-group list-group--horizontal">
  <li class="list-group__item" data-state="active" aria-current="true">All</li>
  <li class="list-group__item">Open</li>
  <li class="list-group__item">In review</li>
  <li class="list-group__item">Merged</li>
  <li class="list-group__item">Closed</li>
</ul>`}
        />
      </section>

      <section>
        <h2>With badge</h2>
        <p>
          Push a count to the trailing edge with a label set to{" "}
          <code>flex-1</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<ul class="list-group max-w-sm w-full">
  <li class="list-group__item"><i data-lucide="inbox"></i><span class="flex-1">Inbox</span><span class="badge badge--primary">14</span></li>
  <li class="list-group__item"><i data-lucide="git-pull-request"></i><span class="flex-1">Pull requests</span><span class="badge badge--primary">3</span></li>
  <li class="list-group__item"><i data-lucide="at-sign"></i><span class="flex-1">Mentions</span><span class="badge badge--primary">2</span></li>
  <li class="list-group__item"><i data-lucide="file-text"></i><span class="flex-1">Drafts</span><span class="badge badge--soft">5</span></li>
  <li class="list-group__item"><i data-lucide="archive"></i><span class="flex-1">Archived</span><span class="badge badge--soft">128</span></li>
</ul>`}
        />
      </section>

      <section>
        <h2>Contextual variants</h2>
        <p>
          Tint a row with <code>.list-group__item--{`{intent}`}</code> for
          status messaging (a 10% soft fill), or{" "}
          <code>.list-group__item--neutral</code> for a quiet fill.
        </p>
        <Demo
          layout="stack"
          html={`
<ul class="list-group max-w-md">
  <li class="list-group__item list-group__item--primary">New version v3.2 is ready to deploy</li>
  <li class="list-group__item list-group__item--success">Nightly database backup completed</li>
  <li class="list-group__item list-group__item--info">Maintenance window scheduled for Friday 02:00 UTC</li>
  <li class="list-group__item list-group__item--warning">API requests approaching the hourly limit</li>
  <li class="list-group__item list-group__item--danger">Payment processor returned a 503, retrying</li>
  <li class="list-group__item list-group__item--neutral">Cron job last ran 2 hours ago</li>
</ul>`}
        />
      </section>

      <section>
        <h2>In a card</h2>
        <p>
          Dropped as a direct child of a <code>.card</code>, the list-group
          sheds its own outer chrome and the card owns the frame — no{" "}
          <code>--flush</code> needed. Rows compose freely (here a two-line
          label + a trailing switch / select / button).
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card card--block max-w-xl">
  <div class="card__header">Notifications</div>
  <ul class="list-group">
    <li class="list-group__item gap-3">
      <div class="flex-1">
        <label class="field__label font-medium" for="lgEmail">Email digest</label>
        <small class="text-muted-foreground block">A weekly summary of activity across your projects.</small>
      </div>
      <input class="switch switch--lg shrink-0" type="checkbox" id="lgEmail" checked aria-label="Email digest">
    </li>
    <li class="list-group__item gap-3">
      <div class="flex-1">
        <label class="field__label font-medium" for="lgPush">Push notifications</label>
        <small class="text-muted-foreground block">Get a ping on this device when someone mentions you.</small>
      </div>
      <input class="switch switch--lg shrink-0" type="checkbox" id="lgPush" aria-label="Push notifications">
    </li>
    <li class="list-group__item gap-3">
      <div class="flex-1">
        <label class="field__label font-medium" for="lgLang">Language</label>
        <small class="text-muted-foreground block">Used across the app and outgoing emails.</small>
      </div>
      <select class="select select--sm shrink-0 max-w-40" id="lgLang">
        <option selected>English</option><option>Bahasa Indonesia</option><option>日本語</option>
      </select>
    </li>
    <li class="list-group__item gap-3">
      <div class="flex-1">
        <label class="field__label font-medium" for="lgHandle">Public handle</label>
        <small class="text-muted-foreground block">Shown on your profile and in mentions.</small>
      </div>
      <input type="text" class="input input--sm shrink-0 max-w-40" id="lgHandle" value="nauval">
    </li>
    <li class="list-group__item gap-3">
      <div class="flex-1">
        <span class="font-medium block">Delete workspace</span>
        <small class="text-muted-foreground block">Permanently removes everything. Cannot be undone.</small>
      </div>
      <button type="button" class="button button--outline button--danger button--sm shrink-0">Delete</button>
    </li>
  </ul>
</div>`}
        />
      </section>

      <section>
        <h2>Custom content</h2>
        <p>
          A row can hold whatever you need: a title, a subhead, a timestamp.
          Override <code>align-items</code> and <code>flex-direction</code> on
          the row when content stacks vertically.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="list-group max-w-lg">
  <a href="#" class="list-group__item flex flex-col items-stretch gap-1" aria-current="page">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span class="font-semibold">Mariam Saidova opened a pull request</span>
      <small>just now</small>
    </div>
    <p>Refactor the checkout flow into smaller routes so the bundle splits cleanly on Stripe success / cancel.</p>
    <small>#1248 · billing · 6 files changed</small>
  </a>
  <a href="#" class="list-group__item flex flex-col items-stretch gap-1">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span class="font-semibold">Production deploy succeeded</span>
      <small class="text-muted-foreground">14 minutes ago</small>
    </div>
    <p>Release v3.1.7 rolled out to the EU and US regions. Edge cache warmed in 38 seconds.</p>
    <small class="text-muted-foreground">@nauval · deploys</small>
  </a>
  <a href="#" class="list-group__item flex flex-col items-stretch gap-1">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span class="font-semibold">Hideo Tanaka left a review on #1241</span>
      <small class="text-muted-foreground">1 hour ago</small>
    </div>
    <p>Two small comments on the new useReducedMotion hook, otherwise looks good to merge.</p>
    <small class="text-muted-foreground">design system · 2 comments</small>
  </a>
</div>`}
        />
      </section>

      <section>
        <h2>Contacts</h2>
        <p>
          Compose a chat-style contact row from an avatar, a two-line label, and
          a trailing timestamp + unread counter. Each row is an{" "}
          <code>&lt;a&gt;</code> so the whole strip is clickable.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="list-group max-w-lg">
  <a href="#" class="list-group__item gap-3" aria-current="page">
    <img class="shrink-0 rounded-full" src="https://i.pravatar.cc/80?img=12" alt="" width="40" height="40">
    <div class="flex-1 min-w-0">
      <div class="font-medium">Mariam Saidova</div>
      <div class="text-muted-foreground text-sm truncate">Sure, I'll push the branch in a few minutes. Just running the tests one more time…</div>
    </div>
    <div class="flex flex-col items-end gap-1 shrink-0">
      <small>12:04</small>
      <span class="badge badge--primary">3</span>
    </div>
  </a>
  <a href="#" class="list-group__item gap-3">
    <img class="shrink-0 rounded-full" src="https://i.pravatar.cc/80?img=33" alt="" width="40" height="40">
    <div class="flex-1 min-w-0">
      <div class="font-medium">Hideo Tanaka</div>
      <div class="text-muted-foreground text-sm truncate">Design review notes are in the Figma comments. Let me know what you think.</div>
    </div>
    <div class="flex flex-col items-end gap-1 shrink-0">
      <small class="text-muted-foreground">11:47</small>
      <span class="badge badge--primary">1</span>
    </div>
  </a>
  <a href="#" class="list-group__item gap-3">
    <img class="shrink-0 rounded-full" src="https://i.pravatar.cc/80?img=47" alt="" width="40" height="40">
    <div class="flex-1 min-w-0">
      <div class="font-medium">Priya Ramanathan</div>
      <div class="text-muted-foreground text-sm truncate">Coffee tomorrow? 9am at the usual place.</div>
    </div>
    <small class="text-muted-foreground shrink-0">Yesterday</small>
  </a>
  <a href="#" class="list-group__item gap-3">
    <img class="shrink-0 rounded-full" src="https://i.pravatar.cc/80?img=58" alt="" width="40" height="40">
    <div class="flex-1 min-w-0">
      <div class="font-medium">Tomás Reyes</div>
      <div class="text-muted-foreground text-sm truncate">You: sounds good, let's do it.</div>
    </div>
    <small class="text-muted-foreground shrink-0">Mon</small>
  </a>
</div>`}
        />
      </section>

      <section>
        <h2>Payment methods</h2>
        <p>
          Stack saved methods as rows with a label, helper text, and a
          default-toggle on each. The switch promotes one card so the trailing
          edge stays uncluttered.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="list-group max-w-xl w-full">
  <div class="list-group__item gap-3">
    <div class="flex-1">
      <div class="font-medium">Visa ending in 4242</div>
      <small class="text-muted-foreground">Expires 08 / 2028</small>
    </div>
    <input class="switch switch--lg shrink-0" type="checkbox" id="payDefault1" checked aria-label="Default for billing">
  </div>
  <div class="list-group__item gap-3">
    <div class="flex-1">
      <div class="font-medium">Mastercard ending in 0119</div>
      <small class="text-muted-foreground">Expires 03 / 2027</small>
    </div>
    <input class="switch switch--lg shrink-0" type="checkbox" id="payDefault2" aria-label="Default for billing">
  </div>
  <div class="list-group__item gap-3">
    <div class="flex-1">
      <div class="font-medium">Bank transfer · BCA</div>
      <small class="text-muted-foreground">Account ····3084</small>
    </div>
    <input class="switch switch--lg shrink-0" type="checkbox" id="payDefault3" aria-label="Default for billing">
  </div>
  <div class="list-group__item gap-3">
    <div class="flex-1">
      <div class="font-medium">Wallet credit</div>
      <small class="text-muted-foreground">$128.40 available</small>
    </div>
    <input class="switch switch--lg shrink-0" type="checkbox" id="payDefault4" aria-label="Use wallet first">
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.list-group</code>. Override on the root
          or any wrapper.
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
                <code>--list-group-radius</code>
              </td>
              <td>Outer corner radius</td>
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
                <code>--list-group-item-gap</code>
              </td>
              <td>Gap between leading icon, label, and trailing slot</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-icon-size</code>
              </td>
              <td>Pinned size for a first-child icon</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-bg</code>
              </td>
              <td>Frame background</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-color</code>
              </td>
              <td>Row text color</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-border-color</code> /{" "}
                <code>-border-width</code>
              </td>
              <td>Outer frame border color / thickness</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-divider-color</code>
              </td>
              <td>Rule between adjacent rows</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-bg-hover</code> /{" "}
                <code>-color-hover</code>
              </td>
              <td>Hover fill / text on interactive rows</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-bg-active</code> /{" "}
                <code>-color-active</code>
              </td>
              <td>Selected-row fill / text</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-item-color-disabled</code>
              </td>
              <td>Disabled-row text color</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-ring</code>
              </td>
              <td>Focus halo color on interactive rows</td>
            </tr>
            <tr>
              <td>
                <code>--list-group-transition-duration</code>
              </td>
              <td>Hover / selection state change</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
