import { useState } from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@stisla/react";
import { ThemeProvider, useTheme } from "~/theme";
import { Toc, useToc } from "~/toc";

/* Layout for every /docs/* page. Ported from the legacy docs shell
 * (src/site/layouts/base.njk): a full-width sticky navbar over a
 * sidebar | main grid, with the content sitting in a rounded card.
 *
 * The nav uses the framework `.sidebar` component classes directly (not the
 * React Sidebar wrapper yet) — site chrome (.site-*) is in styles.css.
 * Doc pages author content only (ARCHITECTURE: docs = content, not chrome). */
export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

/* Grouped nav model, mirroring the legacy docs sidebar (src/site/partials/
 * _site-sidebar.njk): a titleless spec bucket, then Get Started, then the
 * component families (Forms / Components / Overlays), buckets alphabetical.
 *
 * `base` is the route prefix the slugs hang off: guide/prose pages live at
 * /docs/<slug>, vanilla component pages at /docs/vanilla/<slug>. Only pages
 * that exist as routes are listed (Foundation, Extras, and native-select
 * aren't ported yet; app-shell was dropped). */
type NavItem = { slug: string; title: string };
type NavGroup = { title?: string; base: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    base: "/docs",
    items: [
      { slug: "introduction", title: "Introduction" },
      { slug: "why-stisla", title: "Why Stisla" },
      { slug: "specification", title: "Specification" },
      { slug: "contributing", title: "Contributing" },
    ],
  },
  {
    title: "Get Started",
    base: "/docs",
    items: [
      { slug: "installation", title: "Installation" },
      { slug: "javascript", title: "JavaScript" },
      { slug: "architecture", title: "Architecture" },
      { slug: "customization", title: "Customization" },
      { slug: "optimization", title: "Optimization" },
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

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      tone="neutral"
      shape="ghost"
      size="sm"
      iconOnly
      aria-label="Toggle color theme"
      onClick={toggle}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

function SiteNavbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="site-navbar">
      <div className="site-navbar__inner">
        <Button
          className="site-navbar__trigger"
          tone="neutral"
          shape="ghost"
          size="sm"
          iconOnly
          aria-label="Open menu"
          aria-controls="site-sidebar"
          onClick={onMenu}
        >
          <Menu />
        </Button>

        <Link to="/" className="site-navbar__brand">
          <svg
            className="site-navbar__brand-mark"
            viewBox="0 0 512 512"
            aria-hidden="true"
            focusable="false"
          >
            <rect
              className="site-navbar__brand-tile"
              width="512"
              height="512"
              rx="112"
            />
            <path
              className="site-navbar__brand-s"
              d="M 392 144 H 200 A 56 56 0 0 0 200 256 H 312 A 56 56 0 0 1 312 368 H 120"
              fill="none"
              strokeWidth="76"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Stisla</span>
        </Link>

        <div className="site-navbar__spacer" />

        <div className="site-navbar__action">
          <a
            className="button button--ghost button--neutral button--sm button--icon-only"
            href="https://github.com/stisla/stisla"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

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

function DocsLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { entries, activeId } = useToc();

  return (
    <ThemeProvider>
      <SiteNavbar onMenu={() => setNavOpen(true)} />

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
            <div className="main-container prose dark:prose-invert max-w-none prose-sm prose-headings:font-medium prose-h2:text-lg">
              <Outlet />
            </div>
          </article>
        </main>

        {entries.length > 0 && (
          <aside className="site-rail">
            <Toc entries={entries} activeId={activeId} title />
          </aside>
        )}
      </div>
    </ThemeProvider>
  );
}
