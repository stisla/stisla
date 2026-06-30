import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/page")({
  component: PageDocs,
});

function PageDocs() {
  return (
    <>
      <header>
        <h1>Page</h1>
        <p className="lead">
          A layout primitive that owns the vertical rhythm inside the main
          column.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          The <code>.page</code> flow is a flex column whose gap spaces a{" "}
          <code>.page__header</code> and a series of <code>.page__section</code>{" "}
          siblings, so children carry no outer margin (the reboot already zeroes
          headings and paragraphs). The header pairs a{" "}
          <code>.page__headline</code> (title + description) with a trailing{" "}
          <code>.page__action</code>; sections repeat the shape at a tighter
          scale. Title and section-title carry opinionated cadences so you drop
          the recurring heading utility. A header with a title, a muted
          description, and an action, followed by a section with its own header.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="page w-full">
  <header class="page__header">
    <div class="page__headline">
      <h1 class="page__title">Reports</h1>
      <p class="page__description">Everything your team shipped this week.</p>
    </div>
    <div class="page__action">
      <button class="button button--neutral button--outline">Export</button>
      <button class="button button--primary">New report</button>
    </div>
  </header>
  <section class="page__section">
    <div class="page__section-header">
      <h2 class="page__section-title">Overview</h2>
      <div class="page__action">
        <button class="button button--neutral button--ghost button--sm">Filter</button>
      </div>
    </div>
    <div class="card"><div class="card__body">Section content sits here.</div></div>
  </section>
  <section class="page__section">
    <div class="page__section-header">
      <h2 class="page__section-title">Activity</h2>
      <p class="page__section-description">Recent changes across your reports.</p>
    </div>
    <div class="card"><div class="card__body">Another block of content.</div></div>
  </section>
</div>`}
        />
      </section>

      <section>
        <h2>The page wrapper</h2>
        <p>
          Drop a <code>.page</code> inside the main column.{" "}
          <code>.page__header</code> carries the title and primary actions and
          sits above <code>.page__body</code>, the flow that holds the sections.
          The header's bottom margin supplies the rhythm between them.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="page w-full">
  <header class="page__header">
    <div class="page__headline">
      <h1 class="page__title">Orders</h1>
      <p class="page__description">42 orders this month.</p>
    </div>
    <div class="page__action">
      <button type="button" class="button button--outline button--neutral"><i data-lucide="download"></i>Export</button>
      <button type="button" class="button button--primary"><i data-lucide="plus"></i>New order</button>
    </div>
  </header>
  <div class="page__body">
    <section class="page__section">
      <div class="card">
        <div class="card__header card__header--alt">
          <span>Recent</span>
          <a href="#" class="link ml-auto">View all</a>
        </div>
        <table class="table table--hover table--align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Customer</th>
              <th scope="col">Date</th>
              <th scope="col" class="text-right">Total</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><code>#10428</code></th>
              <td>Acme Corp</td>
              <td>Jun 18</td>
              <td class="text-right">$1,490.00</td>
              <td><span class="badge badge--soft badge--success"><i data-lucide="check"></i> Paid</span></td>
            </tr>
            <tr>
              <th scope="row"><code>#10427</code></th>
              <td>Riverway Ltd</td>
              <td>Jun 17</td>
              <td class="text-right">$580.00</td>
              <td><span class="badge badge--soft badge--info"><i data-lucide="truck"></i> Shipped</span></td>
            </tr>
            <tr>
              <th scope="row"><code>#10426</code></th>
              <td>Northwind</td>
              <td>Jun 17</td>
              <td class="text-right">$8,200.00</td>
              <td><span class="badge badge--soft badge--warning"><i data-lucide="clock"></i> Pending</span></td>
            </tr>
            <tr>
              <th scope="row"><code>#10425</code></th>
              <td>Globex</td>
              <td>Jun 16</td>
              <td class="text-right">$240.00</td>
              <td><span class="badge badge--soft badge--danger"><i data-lucide="alert-triangle"></i> Refunded</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Page header</h2>
        <p>
          <code>.page__header</code> is a flex row with a{" "}
          <code>.page__headline</code> group on the leading edge and a{" "}
          <code>.page__action</code> slot on the trailing edge. The heading
          group stacks a <code>.page__title</code> with an optional{" "}
          <code>.page__description</code>; the action slot takes any button row.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="page w-full">
  <header class="page__header">
    <div class="page__headline">
      <h1 class="page__title">Customers</h1>
      <p class="page__description">All accounts in this workspace.</p>
    </div>
    <div class="page__action">
      <button type="button" class="button button--outline button--neutral"><i data-lucide="download"></i>Export</button>
      <button type="button" class="button button--primary"><i data-lucide="plus"></i>Add customer</button>
    </div>
  </header>
</div>`}
        />

        <h3>Without actions</h3>
        <p>Drop the action slot. The title block sits alone.</p>
        <Demo
          layout="stack"
          html={`
<div class="page w-full">
  <header class="page__header">
    <div class="page__headline">
      <h1 class="page__title">Settings</h1>
      <p class="page__description">Manage your account, billing, and integrations.</p>
    </div>
  </header>
</div>`}
        />
      </section>

      <section>
        <h2>Sections</h2>
        <p>
          <code>.page__section</code> is a flex-column for each block inside the
          page. The <code>.page</code> parent supplies the gap between sections;
          each section supplies its own inner gap via{" "}
          <code>--page-section-inner-gap</code>. Pair{" "}
          <code>.page__section-title</code> with{" "}
          <code>.page__section-description</code> for muted helper copy beneath
          it, the section-scale counterpart to <code>.page__description</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="page w-full">
  <section class="page__section">
    <h2 class="page__section-title">Overview</h2>
    <p class="page__section-description">Headline stats and the period selector live here.</p>
  </section>
  <section class="page__section">
    <h2 class="page__section-title">Recent activity</h2>
    <p class="page__section-description">A timeline of the last events on this account.</p>
  </section>
  <section class="page__section">
    <h2 class="page__section-title">Quick actions</h2>
    <p class="page__section-description">Shortcuts to the most-used flows.</p>
  </section>
</div>`}
        />

        <h3>With section header + actions</h3>
        <p>
          For sections that need their own action row, wrap the title in{" "}
          <code>.page__section-header</code> and reuse{" "}
          <code>.page__action</code> as the slot. Same flex recipe at a tighter
          scale.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="page w-full">
  <section class="page__section">
    <header class="page__section-header">
      <h2 class="page__section-title">Active customers</h2>
      <div class="page__action">
        <button type="button" class="button button--outline button--neutral button--sm">Filter</button>
        <button type="button" class="button button--primary button--sm">Invite</button>
      </div>
    </header>
    <p class="text-muted-foreground">1,284 accounts.</p>
  </section>
</div>`}
        />
      </section>

      <section>
        <h2>Content width</h2>
        <p>
          <code>.page</code> is unopinionated about width. Wrap it (or set its
          own width on a parent) to clamp the content column.
        </p>
        <ul>
          <li>
            Full width (<code>.container-fluid</code> or no container) for
            dashboards, tables, anything dense.
          </li>
          <li>
            Breakpoint-clamped (<code>.container</code>) for marketing pages, or
            anything that should match the standard column widths.
          </li>
          <li>
            Custom max-width (40 to 60rem) for settings forms, articles,
            anything text-heavy where long lines hurt readability.
          </li>
        </ul>
        <Demo
          layout="stack"
          html={`
<!-- Full width -->
<main>
  <div class="page container-fluid">...</div>
</main>

<!-- Breakpoint-clamped -->
<main>
  <div class="page container">...</div>
</main>

<!-- Custom narrow column for reading -->
<main>
  <div class="page mx-auto max-w-3xl">...</div>
</main>`}
        />

        <h3>Nesting a container</h3>
        <p>
          Putting <code>.container</code> on the <code>.page</code> element
          itself, as above, keeps the sections as direct children, so the row
          gap still spaces them. When the container has to be a separate
          wrapper, it becomes the only child of <code>.page</code> and the
          sections inside it fall outside the gap. Move the flow into{" "}
          <code>.page__body</code>. It owns the same section rhythm, so a
          container can sit between the frame and the content without flattening
          the spacing.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="page w-full">
  <div class="container">
    <div class="page__body">
      <header class="page__header">...</header>
      <section class="page__section">...</section>
      <section class="page__section">...</section>
    </div>
  </div>
</div>`}
        />
        <p>
          <code>.page__body</code> reads the same{" "}
          <code>--page-section-gap</code> as <code>.page</code>, so a gap
          override set on the page still reaches the nested sections. Reach for
          it only when a container nests inside the page; the plain{" "}
          <code>.page</code> already flows its own direct children.
        </p>
      </section>

      <section>
        <h2>Putting it together</h2>
        <p>
          Page header, sections, and a section with its own header, all inside
          one <code>.page</code> that supplies the rhythm.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="page w-full">
  <header class="page__header">
    <div class="page__headline">
      <h1 class="page__title">Customers</h1>
      <p class="page__description">All accounts in this workspace.</p>
    </div>
    <div class="page__action">
      <button type="button" class="button button--outline button--neutral"><i data-lucide="download"></i>Export</button>
      <button type="button" class="button button--primary"><i data-lucide="plus"></i>Add customer</button>
    </div>
  </header>
  <section class="page__section">
    <header class="page__section-header">
      <h2 class="page__section-title">Active</h2>
      <div class="page__action">
        <button type="button" class="button button--outline button--neutral button--sm">Filter</button>
      </div>
    </header>
    <p class="text-muted-foreground">1,284 customers.</p>
  </section>
  <section class="page__section">
    <h2 class="page__section-title">Inactive</h2>
    <p class="text-muted-foreground">312 customers.</p>
  </section>
</div>`}
        />
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune the flow and the heading cadences. Override on
          the root or any wrapper.
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
                <code>--page-section-gap</code>
              </td>
              <td>
                Gap between the header and each section (cascades to{" "}
                <code>.page__body</code>)
              </td>
            </tr>
            <tr>
              <td>
                <code>--page-header-gap</code>
              </td>
              <td>Gap between the headline and the actions</td>
            </tr>
            <tr>
              <td>
                <code>--page-heading-gap</code>
              </td>
              <td>Gap between a title and its description</td>
            </tr>
            <tr>
              <td>
                <code>--page-action-gap</code>
              </td>
              <td>Gap between action buttons</td>
            </tr>
            <tr>
              <td>
                <code>--page-section-inner-gap</code>
              </td>
              <td>Gap between a section header and its content</td>
            </tr>
            <tr>
              <td>
                <code>--page-section-header-gap</code>
              </td>
              <td>Gap inside a section header</td>
            </tr>
            <tr>
              <td>
                <code>--page-title-font-size</code> /{" "}
                <code>-title-font-weight</code>
              </td>
              <td>Page title type</td>
            </tr>
            <tr>
              <td>
                <code>--page-description-font-size</code> /{" "}
                <code>-description-color</code>
              </td>
              <td>Page description type</td>
            </tr>
            <tr>
              <td>
                <code>--page-section-title-font-size</code> /{" "}
                <code>-section-title-font-weight</code>
              </td>
              <td>Section title type</td>
            </tr>
            <tr>
              <td>
                <code>--page-section-description-font-size</code> /{" "}
                <code>-section-description-color</code>
              </td>
              <td>Section description type</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
