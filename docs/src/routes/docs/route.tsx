import { useState } from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ChevronDown, SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";
import { Toc, useToc } from "~/toc";

/* Layout for every /docs/* page. Ported from the legacy docs shell
 * (src/site/layouts/base.njk): a full-width sticky navbar over a
 * sidebar | main grid, with the content sitting in a rounded card.
 *
 * The nav uses the framework `.sidebar` component classes directly (not the
 * React Sidebar wrapper yet) — site chrome (.site-*) is in src/styles/.
 * Doc pages author content only (ARCHITECTURE: docs supply content, layout supplies chrome). */
export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

/* Grouped nav model, mirroring the legacy docs sidebar (src/site/partials/
 * _site-sidebar.njk): a titleless spec bucket, then Get Started, then the
 * component families (Forms / Components / Overlays), buckets alphabetical.
 *
 * `base` is the route prefix the slugs hang off: the agnostic system pages
 * (Introduction / Why / Specification / Architecture / Customization /
 * Contributing) live at /docs/<slug>; every implementation-scoped page lives
 * under /docs/vanilla/<slug> — Get Started (Installation / JavaScript /
 * Optimization) and the component families alike — so a future framework
 * switcher (Vanilla / React / …) can swap the whole /docs/<impl>/ subtree.
 * Only pages that exist as routes are listed (Foundation, Extras, and
 * native-select aren't ported yet; app-shell was dropped). */
type NavItem = { slug: string; title: string };
type NavGroup = { title?: string; base: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    base: "/docs",
    items: [
      { slug: "introduction", title: "Introduction" },
      { slug: "why-stisla", title: "Why Stisla" },
      { slug: "specification", title: "Specification" },
      { slug: "architecture", title: "Architecture" },
      { slug: "contributing", title: "Contributing" },
    ],
  },
  {
    title: "Get Started",
    base: "/docs/vanilla",
    items: [
      { slug: "installation", title: "Installation" },
      { slug: "javascript", title: "JavaScript" },
      { slug: "optimization", title: "Optimization" },
      { slug: "utilities", title: "Utilities" },
    ],
  },
  {
    title: "Customization",
    base: "/docs",
    items: [
      { slug: "theming", title: "Theming" },
      { slug: "styling", title: "Styling" },
      { slug: "composition", title: "Composition" },
    ],
  },
  {
    title: "Forms",
    base: "/docs/vanilla",
    items: [
      { slug: "autocomplete", title: "Autocomplete" },
      { slug: "checkbox", title: "Checkbox" },
      { slug: "combobox", title: "Combobox" },
      { slug: "field", title: "Field" },
      { slug: "input", title: "Input" },
      { slug: "input-group", title: "Input group" },
      { slug: "radio", title: "Radio" },
      { slug: "select", title: "Select" },
      { slug: "slider", title: "Slider" },
      { slug: "switch", title: "Switch" },
      { slug: "textarea", title: "Textarea" },
    ],
  },
  {
    title: "Components",
    base: "/docs/vanilla",
    items: [
      { slug: "accordion", title: "Accordion" },
      { slug: "alert", title: "Alert" },
      { slug: "avatar", title: "Avatar" },
      { slug: "avatar-group", title: "Avatar group" },
      { slug: "badge", title: "Badge" },
      { slug: "breadcrumb", title: "Breadcrumb" },
      { slug: "button", title: "Button" },
      { slug: "button-group", title: "Button group" },
      { slug: "card", title: "Card" },
      { slug: "carousel", title: "Carousel" },
      { slug: "collapsible", title: "Collapsible" },
      { slug: "empty-state", title: "Empty state" },
      { slug: "icon-box", title: "Icon box" },
      { slug: "illustration", title: "Illustration" },
      { slug: "indicator", title: "Indicator" },
      { slug: "media", title: "Media" },
      { slug: "kbd", title: "Kbd" },
      { slug: "link", title: "Link" },
      { slug: "list-group", title: "List group" },
      { slug: "meter", title: "Meter" },
      { slug: "navbar", title: "Navbar" },
      { slug: "page", title: "Page" },
      { slug: "pagination", title: "Pagination" },
      { slug: "placeholders", title: "Placeholders" },
      { slug: "progress", title: "Progress" },
      { slug: "scroll-area", title: "Scroll area" },
      { slug: "separator", title: "Separator" },
      { slug: "sidebar", title: "Sidebar" },
      { slug: "spinner", title: "Spinner" },
      { slug: "table", title: "Table" },
      { slug: "tabs", title: "Tabs" },
      { slug: "timeline", title: "Timeline" },
      { slug: "toggle", title: "Toggle" },
      { slug: "toggle-group", title: "Toggle group" },
    ],
  },
  {
    title: "Overlays",
    base: "/docs/vanilla",
    items: [
      { slug: "dialog", title: "Dialog" },
      { slug: "drawer", title: "Drawer" },
      { slug: "menu", title: "Menu" },
      { slug: "popover", title: "Popover" },
      { slug: "toast", title: "Toast" },
      { slug: "tooltip", title: "Tooltip" },
    ],
  },
];

function DocsSidebar({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="sidebar sidebar--sm" aria-label="Docs">
      <div className="sidebar__content">
        <div className="sidebar__menu">
          {NAV.map((group) => (
            <div
              className="sidebar__group"
              key={group.base + (group.title ?? "")}
            >
              {group.title && (
                <span className="sidebar__group-title">{group.title}</span>
              )}
              <ul className="sidebar__list">
                {group.items.map((item) => (
                  <li className="sidebar__item" key={item.slug}>
                    <Link
                      to={`${group.base}/${item.slug}`}
                      className="sidebar__button"
                      activeProps={{ "aria-current": "page" }}
                      onClick={onNavigate}
                    >
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* Mobile ToC — collapsible strip between the navbar and the content card, shown
 * below lg where the right rail is hidden. Collapsed by default. */
function MobileToc({
  entries,
  activeId,
}: {
  entries: ReturnType<typeof useToc>["entries"];
  activeId: string | null;
}) {
  const [open, setOpen] = useState(false);
  if (entries.length === 0) return null;
  return (
    <div className="site-toc-mobile">
      <button
        type="button"
        className="site-toc-mobile__trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>On this page</span>
        <ChevronDown className="site-toc-mobile__chevron" />
      </button>
      {open && (
        <div className="site-toc-mobile__inner">
          <Toc
            entries={entries}
            activeId={activeId}
            onNavigate={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

/* Placeholder shown in the right rail before the runtime scan settles (and in the
 * SSR HTML). Reserving the rail track + filling it with this keeps the main column
 * width stable — the ToC fades in without the layout jumping. */
function TocSkeleton() {
  return (
    <div className="site-toc-skeleton" aria-hidden="true">
      <span className="site-toc-skeleton__title" />
      <span className="site-toc-skeleton__bar" />
      <span className="site-toc-skeleton__bar" />
      <span className="site-toc-skeleton__bar site-toc-skeleton__bar--sub" />
      <span className="site-toc-skeleton__bar" />
      <span className="site-toc-skeleton__bar site-toc-skeleton__bar--sub" />
    </div>
  );
}

function DocsLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { entries, activeId, scanned } = useToc();

  return (
    <>
      <button
        className="button button--sm button--round button--neutral fixed bottom-4 right-4 z-9999 lg:hidden"
        onClick={() => setNavOpen(!navOpen)}
      >
        {navOpen ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
        Sidebar
      </button>
      <div className="site-layout">
        <aside
          id="site-sidebar"
          className="site-sidebar"
          data-state={navOpen ? "open" : "closed"}
        >
          <DocsSidebar onNavigate={() => setNavOpen(false)} />
        </aside>

        <div
          className="site-backdrop"
          hidden={!navOpen}
          onClick={() => setNavOpen(false)}
        />

        <main className="site-main">
          <MobileToc entries={entries} activeId={activeId} />
          <article className="content-card">
            <div className="main-container prose dark:prose-invert max-w-none prose-sm prose-headings:font-medium prose-h2:text-lg prose-h3:text-base">
              <Outlet />
            </div>
          </article>
        </main>

        {/* Always rendered so the rail track is reserved from SSR on — its
            contents settle (skeleton → ToC) without shifting the main column. */}
        <aside className="site-rail">
          {scanned ? (
            entries.length > 0 && (
              <Toc entries={entries} activeId={activeId} title />
            )
          ) : (
            <TocSkeleton />
          )}

          <Partner />
        </aside>
      </div>
    </>
  );
}

function Partner() {
  return (
    <div aria-label="Partners">
      <p className="text-xs text-muted-foreground font-semibold mb-2">
        Partners
      </p>
      <a
        href="https://enterprise.kredibel.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="rounded-md border border-border mb-3"
          src="https://enterprise.kredibel.com/synapses-illustration.png"
          alt=""
          loading="lazy"
        />
        <div className="text-sm font-semibold">Kredibel for Enterprise</div>
        <span className="text-xs text-muted-foreground">
          Identity verification, AML screening, and real-time fraud detection in
          one API.
        </span>
      </a>
    </div>
  );
}
