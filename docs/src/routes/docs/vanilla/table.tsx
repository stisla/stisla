import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/table")({
  component: TableDocs,
});

const AV = "https://i.pravatar.cc/64?img=";

function TableDocs() {
  return (
    <>
      <header>
        <h1>Table</h1>
        <p className="lead">A flat data grid for rows of structured records.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          Wrap your data in <code>.table</code>. The first and last column cells
          line up with the card body gutter so a table drops into a{" "}
          <code>.card</code> flush. (Trailing columns use the{" "}
          <code>text-end</code> utility.)
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table">
  <thead>
    <tr><th scope="col">Plan</th><th scope="col">Seats</th><th scope="col">Storage</th><th scope="col" class="text-end">Price</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Starter</th><td>3</td><td>10 GB</td><td class="text-end">$0/mo</td></tr>
    <tr><th scope="row">Team</th><td>15</td><td>100 GB</td><td class="text-end">$29/mo</td></tr>
    <tr><th scope="row">Business</th><td>50</td><td>1 TB</td><td class="text-end">$99/mo</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Row variants</h2>
        <p>
          Add <code>.table__row--{`{intent}`}</code> to a{" "}
          <code>&lt;tr&gt;</code> (primary, success, info, warning, danger) or{" "}
          <code>--neutral</code> for a quiet emphasis.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--align-middle">
  <thead>
    <tr><th scope="col">Job</th><th scope="col">Schedule</th><th scope="col">Last run</th></tr>
  </thead>
  <tbody>
    <tr><td>nightly-backup</td><td>Daily 02:00 UTC</td><td>4 hours ago</td></tr>
    <tr class="table__row--warning"><td>events-rollup</td><td>Hourly :00</td><td>Retrying (2 of 5)</td></tr>
    <tr class="table__row--danger"><td>webhook-replay</td><td>Every 15 min</td><td>Failed · 12 min ago</td></tr>
    <tr class="table__row--neutral"><td>metrics-aggregate</td><td>Every 5 min</td><td>2 min ago</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Striped rows</h2>
        <p>
          Add <code>.table--striped</code> to zebra-stripe every other row in
          the body.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--striped">
  <thead><tr><th scope="col">Region</th><th scope="col">Latency p50</th><th scope="col">Latency p99</th><th scope="col" class="text-end">Requests / min</th></tr></thead>
  <tbody>
    <tr><td>us-east-1</td><td>42 ms</td><td>180 ms</td><td class="text-end">12,840</td></tr>
    <tr><td>us-west-2</td><td>58 ms</td><td>220 ms</td><td class="text-end">9,210</td></tr>
    <tr><td>eu-west-1</td><td>61 ms</td><td>240 ms</td><td class="text-end">7,455</td></tr>
    <tr><td>ap-southeast-1</td><td>74 ms</td><td>310 ms</td><td class="text-end">3,902</td></tr>
    <tr><td>sa-east-1</td><td>110 ms</td><td>420 ms</td><td class="text-end">1,288</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Striped columns</h2>
        <p>
          Use <code>.table--striped-cols</code> when the table reads
          column-first.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--striped-cols">
  <thead>
    <tr><th scope="col">Quarter</th><th scope="col">Q1</th><th scope="col">Q2</th><th scope="col">Q3</th><th scope="col">Q4</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">New accounts</th><td>418</td><td>502</td><td>611</td><td>730</td></tr>
    <tr><th scope="row">Churned</th><td>62</td><td>71</td><td>54</td><td>48</td></tr>
    <tr><th scope="row">Net new ARR</th><td>$182k</td><td>$214k</td><td>$273k</td><td>$331k</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Hoverable and active row</h2>
        <p>
          <code>.table--hover</code> highlights the row under the cursor; flag a
          persistent selection with <code>data-state="active"</code> on the{" "}
          <code>&lt;tr&gt;</code> (highlight tier, like sidebar / list-group).
          Hover composes over stripes and variants without erasing them.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--hover">
  <thead><tr><th scope="col">Branch</th><th scope="col">Last commit</th><th scope="col" class="text-end">Behind / Ahead</th></tr></thead>
  <tbody>
    <tr><td>main</td><td>Bump axios to 1.7.4</td><td class="text-end">0 / 0</td></tr>
    <tr data-state="active"><td>feat/billing-v2</td><td>Add proration preview</td><td class="text-end">0 / 14</td></tr>
    <tr><td>fix/race-on-replay</td><td>Drain queue before close</td><td class="text-end">3 / 2</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Bordered</h2>
        <p>
          <code>.table--bordered</code> draws a border on every side of every
          cell.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--bordered">
  <thead><tr><th scope="col">Cluster</th><th scope="col">Nodes</th><th scope="col">CPU</th><th scope="col">Memory</th></tr></thead>
  <tbody>
    <tr><td>prod-edge</td><td>24</td><td>62%</td><td>71%</td></tr>
    <tr><td>prod-core</td><td>48</td><td>54%</td><td>68%</td></tr>
    <tr><td>staging</td><td>6</td><td>18%</td><td>22%</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Borderless</h2>
        <p>
          <code>.table--borderless</code> strips every row and cell border for a
          soft list look.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--borderless">
  <thead><tr><th scope="col">Project</th><th scope="col">Owner</th><th scope="col" class="text-end">Open issues</th></tr></thead>
  <tbody>
    <tr><td>billing-service</td><td>Maya Singh</td><td class="text-end">12</td></tr>
    <tr><td>auth-gateway</td><td>Mateo Reyes</td><td class="text-end">4</td></tr>
    <tr><td>events-pipeline</td><td>Sara Lin</td><td class="text-end">7</td></tr>
    <tr><td>web-dashboard</td><td>Theo Wright</td><td class="text-end">23</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Small</h2>
        <p>
          <code>.table--sm</code> shrinks inner cell padding for denser rows.
          The edge padding stays so the flush-in-card alignment holds.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--sm">
  <thead><tr><th scope="col">Key</th><th scope="col">Value</th><th scope="col">Last edited</th></tr></thead>
  <tbody>
    <tr><td><code>SMTP_HOST</code></td><td>smtp.postmark.io</td><td>Maya · 3 days ago</td></tr>
    <tr><td><code>SMTP_PORT</code></td><td>587</td><td>Maya · 3 days ago</td></tr>
    <tr><td><code>FEATURE_BILLING_V2</code></td><td>true</td><td>Mateo · 1 hour ago</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Vertical alignment</h2>
        <p>
          Cell content sits at the top by default. Add{" "}
          <code>.table--align-middle</code> when rows mix multi-line text with
          shorter values.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--align-middle">
  <thead>
    <tr><th scope="col">Document</th><th scope="col">Summary</th><th scope="col" class="text-end">Pages</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>Onboarding handbook</td>
      <td>Day-1 setup, IT accounts, payroll forms, and the company-wide reading list new hires work through in their first week.</td>
      <td class="text-end">42</td>
    </tr>
    <tr>
      <td>Security policy</td>
      <td>Device requirements, password rules, incident reporting, and the quarterly review schedule.</td>
      <td class="text-end">18</td>
    </tr>
    <tr>
      <td>Engineering RFCs</td>
      <td>Active proposals up for review this cycle. Each row links to the long-form doc.</td>
      <td class="text-end">7</td>
    </tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Header alt and sortable</h2>
        <p>
          <code>.table__head--alt</code> opts the header onto the alt surface.
          Wrap a header label in <code>.table__sort</code> (a{" "}
          <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>) for a sort
          control with a CSS-drawn caret; set <code>data-state="asc|desc"</code>{" "}
          on the active column and mirror it with <code>aria-sort</code> on the{" "}
          <code>&lt;th&gt;</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--hover">
  <thead class="table__head--alt">
    <tr>
      <th scope="col"><button type="button" class="table__sort">Customer</button></th>
      <th scope="col"><button type="button" class="table__sort">Plan</button></th>
      <th scope="col" class="text-end" aria-sort="descending"><button type="button" class="table__sort" data-state="desc">MRR</button></th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Northwind</td><td>Enterprise</td><td class="text-end">$8,200</td></tr>
    <tr><td>Acme Corp</td><td>Business</td><td class="text-end">$1,490</td></tr>
    <tr><td>Riverway Ltd</td><td>Team</td><td class="text-end">$580</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Caption and group divider</h2>
        <p>
          A <code>&lt;caption&gt;</code> reads like a footnote below the table.
          Add <code>.table__body--divider</code> to a <code>&lt;tbody&gt;</code>{" "}
          for a heavier rule above it.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table">
  <caption>Last refreshed at 09:42 UTC</caption>
  <thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col" class="text-end">Line total</th></tr></thead>
  <tbody class="table__body--divider">
    <tr><td>Pro seat license</td><td>15</td><td class="text-end">$435.00</td></tr>
    <tr><td>Storage add-on</td><td>2</td><td class="text-end">$40.00</td></tr>
    <tr><td>Priority support</td><td>1</td><td class="text-end">$199.00</td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>With status badges</h2>
        <p>
          Drop a <code>.badge</code> into a cell to flag state. Soft{" "}
          <code>.badge--soft</code> variants read cleaner inside a dense row
          than solid fills.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--hover table--align-middle">
  <thead class="table__head--alt">
    <tr><th scope="col">Invoice</th><th scope="col">Client</th><th scope="col">Amount</th><th scope="col">Due</th><th scope="col">Status</th></tr>
  </thead>
  <tbody>
    <tr><td><code>INV-1042</code></td><td>Acme Corp</td><td>$4,800.00</td><td>Jun 15</td><td><span class="badge badge--soft badge--info"><i data-lucide="send"></i> Sent</span></td></tr>
    <tr><td><code>INV-1041</code></td><td>Riverway Ltd</td><td>$1,250.00</td><td>Jun 10</td><td><span class="badge badge--soft badge--success"><i data-lucide="check"></i> Paid</span></td></tr>
    <tr><td><code>INV-1040</code></td><td>Northwind</td><td>$9,310.00</td><td>May 28</td><td><span class="badge badge--soft badge--danger"><i data-lucide="triangle-alert"></i> Overdue</span></td></tr>
    <tr><td><code>INV-1039</code></td><td>Globex</td><td>$2,140.00</td><td>Jun 22</td><td><span class="badge badge--soft badge--warning"><i data-lucide="clock"></i> Draft</span></td></tr>
    <tr><td><code>INV-1038</code></td><td>Initech</td><td>$680.00</td><td>Jun 30</td><td><span class="badge badge--soft">Scheduled</span></td></tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>With user avatars</h2>
        <p>
          Stack an <code>&lt;img&gt;</code> and a <code>&lt;div&gt;</code> in a
          flex cell to pair an avatar with a name and a secondary line. Pair
          with <code>.table--align-middle</code> so single-line cells center
          against the taller avatar rows.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--align-middle">
  <thead class="table__head--alt">
    <tr><th scope="col">Member</th><th scope="col">Role</th><th scope="col">Joined</th><th scope="col">Status</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <div class="flex flex-wrap items-center gap-2">
          <img src="${AV}12" alt="" width="32" height="32" class="rounded-full" />
          <div><div>Maya Singh</div><div class="text-muted-foreground">maya@acme.co</div></div>
        </div>
      </td>
      <td>Admin</td>
      <td>Jan 2024</td>
      <td><span class="badge badge--soft badge--success">Active</span></td>
    </tr>
    <tr>
      <td>
        <div class="flex flex-wrap items-center gap-2">
          <img src="${AV}13" alt="" width="32" height="32" class="rounded-full" />
          <div><div>Mateo Reyes</div><div class="text-muted-foreground">mateo@acme.co</div></div>
        </div>
      </td>
      <td>Editor</td>
      <td>Mar 2024</td>
      <td><span class="badge badge--soft badge--success">Active</span></td>
    </tr>
    <tr>
      <td>
        <div class="flex flex-wrap items-center gap-2">
          <img src="${AV}5" alt="" width="32" height="32" class="rounded-full" />
          <div><div>Sara Lin</div><div class="text-muted-foreground">sara@acme.co</div></div>
        </div>
      </td>
      <td>Viewer</td>
      <td>May 2024</td>
      <td><span class="badge badge--soft badge--warning">Invite pending</span></td>
    </tr>
    <tr>
      <td>
        <div class="flex flex-wrap items-center gap-2">
          <img src="${AV}33" alt="" width="32" height="32" class="rounded-full" />
          <div><div>Theo Wright</div><div class="text-muted-foreground">theo@acme.co</div></div>
        </div>
      </td>
      <td>Editor</td>
      <td>Jun 2023</td>
      <td><span class="badge badge--soft badge--danger">Suspended</span></td>
    </tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Row actions</h2>
        <p>
          Trailing buttons go in the last cell with <code>text-end</code>. Ghost
          icon buttons sit quiet until the row is hovered.
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--hover table--align-middle">
  <thead class="table__head--alt">
    <tr><th scope="col">API key</th><th scope="col">Scope</th><th scope="col" class="text-end">Actions</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>sk_live_•••••8a1c</code></td>
      <td><span class="badge badge--soft badge--primary">Live</span></td>
      <td class="text-end">
        <div class="flex flex-wrap items-center justify-end gap-1">
          <button type="button" class="button button--sm button--ghost button--neutral button--icon-only" aria-label="Copy"><i data-lucide="copy"></i></button>
          <button type="button" class="button button--sm button--ghost button--neutral button--icon-only" aria-label="Revoke"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
    <tr>
      <td><code>sk_test_•••••3f02</code></td>
      <td><span class="badge badge--soft">Test</span></td>
      <td class="text-end">
        <div class="flex flex-wrap items-center justify-end gap-1">
          <button type="button" class="button button--sm button--ghost button--neutral button--icon-only" aria-label="Copy"><i data-lucide="copy"></i></button>
          <button type="button" class="button button--sm button--ghost button--neutral button--icon-only" aria-label="Revoke"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  </tbody>
</table>`}
        />
      </section>

      <section>
        <h2>Selectable rows</h2>
        <p>
          Put a <code>.checkbox</code> in the first column. Flag selected rows
          with <code>data-state="active"</code>. (The bulk select-all wiring is
          the deferred JS layer; the checked + active states are shown
          statically.)
        </p>
        <Demo
          layout="stack"
          html={`
<table class="table table--hover table--align-middle">
  <thead class="table__head--alt">
    <tr>
      <th scope="col" class="w-4"><input class="checkbox" type="checkbox" aria-label="Select all" /></th>
      <th scope="col">Email</th><th scope="col">Source</th><th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><input class="checkbox" type="checkbox" aria-label="Select maya@acme.co" /></td><td>maya@acme.co</td><td>Landing page</td><td><span class="badge badge--soft badge--success">Confirmed</span></td></tr>
    <tr data-state="active"><td><input class="checkbox" type="checkbox" aria-label="Select mateo@acme.co" checked /></td><td>mateo@acme.co</td><td>Referral · Sara</td><td><span class="badge badge--soft badge--success">Confirmed</span></td></tr>
    <tr data-state="active"><td><input class="checkbox" type="checkbox" aria-label="Select sara@acme.co" checked /></td><td>sara@acme.co</td><td>Webinar · Q2</td><td><span class="badge badge--soft badge--warning">Pending</span></td></tr>
  </tbody>
</table>`}
        />
        <p>
          Pair with a header that surfaces the bulk count and actions once a row
          is checked. (The live count and select-all wiring is the deferred JS
          layer; the checked + active states are shown statically.)
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-full">
  <div class="card__header card__header--alt">
    <span><strong>2</strong> of 4 selected</span>
    <div class="flex flex-wrap items-center gap-2 ms-auto">
      <button type="button" class="button button--sm button--outline button--neutral"><i data-lucide="tag"></i> Add tag</button>
      <button type="button" class="button button--sm button--outline button--neutral"><i data-lucide="archive"></i> Archive</button>
      <button type="button" class="button button--sm button--danger"><i data-lucide="trash-2"></i> Delete</button>
    </div>
  </div>
  <table class="table table--hover table--align-middle">
    <thead>
      <tr>
        <th scope="col" class="w-4"><input class="checkbox" type="checkbox" aria-label="Select all messages" /></th>
        <th scope="col">From</th><th scope="col">Subject</th><th scope="col" class="text-end">Received</th>
      </tr>
    </thead>
    <tbody>
      <tr data-state="active"><td><input class="checkbox" type="checkbox" aria-label="Select message from Maya Singh" checked /></td><td>Maya Singh</td><td>Re: Q3 roadmap draft</td><td class="text-end">9:42 AM</td></tr>
      <tr data-state="active"><td><input class="checkbox" type="checkbox" aria-label="Select message from Mateo Reyes" checked /></td><td>Mateo Reyes</td><td>Auth migration status</td><td class="text-end">8:18 AM</td></tr>
      <tr><td><input class="checkbox" type="checkbox" aria-label="Select message from Sara Lin" /></td><td>Sara Lin</td><td>Pipeline retry logic</td><td class="text-end">Yesterday</td></tr>
      <tr><td><input class="checkbox" type="checkbox" aria-label="Select message from Theo Wright" /></td><td>Theo Wright</td><td>Vendor renewal · Jun 30</td><td class="text-end">Yesterday</td></tr>
    </tbody>
  </table>
</div>`}
        />
      </section>

      <section>
        <h2>Inside a card</h2>
        <p>
          Drop the table straight into a <code>.card</code> and it sits flush on
          its own: the corner cells round to the card and the doubled border
          falls away. Edge cells line up with the card header's gutter.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-full">
  <div class="card__header card__header--alt">
    Deployments
    <button type="button" class="button button--sm button--primary ms-auto">Deploy</button>
  </div>
  <table class="table table--hover table--align-middle">
    <thead>
      <tr><th scope="col">Service</th><th scope="col">Environment</th><th scope="col">Version</th><th scope="col">Status</th></tr>
    </thead>
    <tbody>
      <tr><td>api</td><td><span class="badge badge--soft">production</span></td><td><code>v2.14.0</code></td><td><span class="badge badge--soft badge--success"><i data-lucide="circle-check"></i> Healthy</span></td></tr>
      <tr><td>web</td><td><span class="badge badge--soft">production</span></td><td><code>v3.41.2</code></td><td><span class="badge badge--soft badge--warning"><i data-lucide="triangle-alert"></i> Degraded</span></td></tr>
      <tr><td>api</td><td><span class="badge badge--soft">staging</span></td><td><code>v2.15.0-rc1</code></td><td><span class="badge badge--soft badge--info"><span class="spinner spinner--sm" role="status" aria-hidden="true"></span> Deploying</span></td></tr>
    </tbody>
  </table>
</div>`}
        />
      </section>

      <section>
        <h2>Bordered, inside a card</h2>
        <p>
          A <code>.table--bordered</code> dropped straight into a{" "}
          <code>.card</code> drops its outer perimeter so it doesn't double the
          card border, and rounds the corner cells to the card. With no card
          header above, the top corners round too.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card w-full">
  <table class="table table--bordered">
    <thead>
      <tr><th scope="col">Region</th><th scope="col">Orders</th><th scope="col">Revenue</th></tr>
    </thead>
    <tbody>
      <tr><td>North</td><td>1,284</td><td>$48,200</td></tr>
      <tr><td>South</td><td>967</td><td>$31,540</td></tr>
      <tr><td>West</td><td>1,102</td><td>$40,910</td></tr>
    </tbody>
  </table>
</div>`}
        />
      </section>

      <section>
        <h2>Full dashboard table</h2>
        <p>
          Composes everything above. Alt-surface header, avatars in the first
          cell, badges for status, row actions trailing.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="card">
  <div class="card__header card__header--alt">
    Team members
    <span class="badge badge--soft ms-2">5 of 15 seats</span>
    <button type="button" class="button button--sm button--primary ms-auto"><i data-lucide="user-plus"></i> Invite</button>
  </div>
  <table class="table table--hover table--align-middle">
    <thead>
      <tr><th scope="col">Member</th><th scope="col">Role</th><th scope="col">Last active</th><th scope="col">Status</th><th scope="col" class="text-end">Actions</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><div class="flex flex-wrap items-center gap-2"><img src="${AV}68" alt="" width="32" height="32" class="rounded-full" /><div><div>Alex Park</div><div class="text-muted-foreground">alex@acme.co</div></div></div></td>
        <td><span class="badge badge--soft badge--primary">Owner</span></td>
        <td>just now</td>
        <td><span class="badge badge--soft badge--success">Active</span></td>
        <td class="text-end"><button type="button" class="button button--sm button--ghost button--neutral button--icon-only" aria-label="More"><i data-lucide="more-horizontal"></i></button></td>
      </tr>
      <tr>
        <td><div class="flex flex-wrap items-center gap-2"><img src="${AV}12" alt="" width="32" height="32" class="rounded-full" /><div><div>Maya Singh</div><div class="text-muted-foreground">maya@acme.co</div></div></div></td>
        <td><span class="badge badge--soft badge--info">Admin</span></td>
        <td>12 min ago</td>
        <td><span class="badge badge--soft badge--success">Active</span></td>
        <td class="text-end"><button type="button" class="button button--sm button--ghost button--neutral button--icon-only" aria-label="More"><i data-lucide="more-horizontal"></i></button></td>
      </tr>
      <tr>
        <td><div class="flex flex-wrap items-center gap-2"><img src="${AV}13" alt="" width="32" height="32" class="rounded-full" /><div><div>Mateo Reyes</div><div class="text-muted-foreground">mateo@acme.co</div></div></div></td>
        <td><span class="badge badge--soft">Editor</span></td>
        <td>2 hours ago</td>
        <td><span class="badge badge--soft badge--success">Active</span></td>
        <td class="text-end"><button type="button" class="button button--sm button--ghost button--neutral button--icon-only" aria-label="More"><i data-lucide="more-horizontal"></i></button></td>
      </tr>
      <tr>
        <td><div class="flex flex-wrap items-center gap-2"><img src="${AV}5" alt="" width="32" height="32" class="rounded-full" /><div><div>Sara Lin</div><div class="text-muted-foreground">sara@acme.co</div></div></div></td>
        <td><span class="badge badge--soft">Viewer</span></td>
        <td>never</td>
        <td><span class="badge badge--soft badge--warning">Invite pending</span></td>
        <td class="text-end"><button type="button" class="button button--sm button--ghost button--neutral button--icon-only" aria-label="More"><i data-lucide="more-horizontal"></i></button></td>
      </tr>
      <tr>
        <td><div class="flex flex-wrap items-center gap-2"><img src="${AV}33" alt="" width="32" height="32" class="rounded-full" /><div><div>Theo Wright</div><div class="text-muted-foreground">theo@acme.co</div></div></div></td>
        <td><span class="badge badge--soft">Editor</span></td>
        <td>1 week ago</td>
        <td><span class="badge badge--soft badge--danger">Suspended</span></td>
        <td class="text-end"><button type="button" class="button button--sm button--ghost button--neutral button--icon-only" aria-label="More"><i data-lucide="more-horizontal"></i></button></td>
      </tr>
    </tbody>
  </table>
</div>`}
        />
      </section>

      <section>
        <h2>Responsive</h2>
        <p>
          Wrap the table in <code>.table-responsive</code> when it might
          overflow narrow viewports — the wrapper scrolls horizontally; the
          table stays unchanged. For breakpoint-scoped scrolling, use{" "}
          <code>.table-responsive-{`{sm|md|lg|xl|2xl}`}</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="table-responsive">
  <table class="table">
    <thead class="table__head--alt">
      <tr><th scope="col">Customer</th><th scope="col">Plan</th><th scope="col">Seats</th><th scope="col">MRR</th><th scope="col">Started</th><th scope="col">Renews</th><th scope="col">Owner</th><th scope="col">Status</th></tr>
    </thead>
    <tbody>
      <tr><td>Acme Corp</td><td>Business</td><td>48</td><td>$1,490</td><td>Feb 02, 2024</td><td>Aug 12</td><td>Maya Singh</td><td><span class="badge badge--soft badge--success">Active</span></td></tr>
      <tr><td>Northwind</td><td>Enterprise</td><td>112</td><td>$8,200</td><td>Aug 30, 2022</td><td>Oct 22</td><td>Alex Park</td><td><span class="badge badge--soft badge--success">Active</span></td></tr>
      <tr><td>Globex</td><td>Team</td><td>9</td><td>$580</td><td>Jun 01, 2024</td><td>—</td><td>Sara Lin</td><td><span class="badge badge--soft badge--warning">Trialing</span></td></tr>
    </tbody>
  </table>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.table</code>. Override on the table, a
          parent scope, or <code>:root</code>. The cell paint chain reads{" "}
          <code>--table-bg-state</code> (hover/active) over{" "}
          <code>--table-bg-type</code> (variant/striped) over{" "}
          <code>--table-bg</code>, so hover lights a striped row without erasing
          the stripe.
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
                <code>--table-cell-padding-block</code>
              </td>
              <td>Vertical cell padding</td>
            </tr>
            <tr>
              <td>
                <code>--table-cell-padding-inline</code>
              </td>
              <td>Horizontal cell padding</td>
            </tr>
            <tr>
              <td>
                <code>--table-cell-padding-sm</code>
              </td>
              <td>
                Cell padding under <code>.table--sm</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--table-edge-padding</code>
              </td>
              <td>First/last column inset (lines up with the card gutter)</td>
            </tr>
            <tr>
              <td>
                <code>--table-group-divider-width</code>
              </td>
              <td>
                Rule above <code>.table__body--divider</code>
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Head and surface</h3>
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
                <code>--table-head-font-size</code> / <code>-font-weight</code>{" "}
                / <code>-color</code>
              </td>
              <td>Header label size / weight / color</td>
            </tr>
            <tr>
              <td>
                <code>--table-head-bg-alt</code>
              </td>
              <td>
                Fill applied by <code>.table__head--alt</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--table-color</code>
              </td>
              <td>Body text color</td>
            </tr>
            <tr>
              <td>
                <code>--table-bg</code>
              </td>
              <td>Cell background (rest layer)</td>
            </tr>
            <tr>
              <td>
                <code>--table-border-color</code>
              </td>
              <td>Row and cell border color</td>
            </tr>
          </tbody>
        </table>

        <h3>Row states</h3>
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
                <code>--table-striped-bg</code> / <code>-color</code>
              </td>
              <td>Odd-row / even-column tint + text</td>
            </tr>
            <tr>
              <td>
                <code>--table-bg-hover</code> / <code>-color-hover</code>
              </td>
              <td>
                Row hover fill / text under <code>.table--hover</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>--table-bg-active</code> / <code>-color-active</code>
              </td>
              <td>
                Selected-row fill / text for <code>data-state="active"</code>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
