import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { EllipsisVerticalIcon, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@stisla/react";
import { useTheme } from "~/theme";

/* Shared site chrome — the full-width sticky navbar that sits above every page
 * (landing, docs, illustration gallery). The bar's flex row IS the framework
 * `.navbar` component: brand, section links, GitHub, and theme toggle, with the
 * component's own `.navbar__toggle` folding the menu into a dropdown below md.
 * The site only owns the sticky/blur/height shell and the max-width centering
 * (see `.site-navbar*` in styles/navbar.css). React drives `data-state` directly rather
 * than the @stisla/vanilla runtime, mirroring how the docs sidebar is toggled.
 *
 * `onMenu` is passed only by layouts that own a sidebar (docs) — it wires the
 * separate leading hamburger that opens the docs nav drawer; landing and gallery
 * omit it and that trigger never renders. */

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

/* Primary section nav. `match` is the path prefix that lights the link as the
 * active section (so every /docs/* page keeps "Docs" highlighted). Blocks and
 * Templates are placeholders until those sections land — disabled, marked Soon. */
type NavLink = { label: string; to?: string; match?: string; soon?: boolean };

const LINKS: NavLink[] = [
  { label: "Docs", to: "/docs/introduction", match: "/docs" },
  { label: "Illustrations", to: "/illustrations", match: "/illustrations" },
  { label: "Blocks", soon: true },
  { label: "Templates", soon: true },
];

export function SiteNavbar({ onMenu }: { onMenu?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-navbar">
      <nav
        className="navbar site-navbar__inner flex-nowrap"
        aria-label="Primary"
      >
        {onMenu && (
          <Button
            className="md:hidden"
            tone="neutral"
            shape="ghost"
            size="sm"
            iconOnly
            aria-label="Open docs menu"
            aria-controls="site-sidebar"
            onClick={onMenu}
          >
            <Menu />
          </Button>
        )}

        <div className="w-4/12">
          <Link to="/" className="navbar__brand site-navbar__brand">
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

          {/* The navbar's own collapse toggle — folds the section menu below md.
            Shown only below the collapse breakpoint (styles/navbar.css). */}
        </div>

        <div
          id="site-navbar-menu"
          className="navbar__menu lg:w-4/12"
          data-state={menuOpen ? "open" : "closed"}
        >
          <ul className="navbar__nav mx-auto justify-center">
            {LINKS.map((link) =>
              link.soon ? (
                <li key={link.label}>
                  <span className="navbar__button" aria-disabled="true">
                    {link.label}{" "}
                  </span>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="navbar__button"
                    data-state={
                      link.match && pathname.startsWith(link.match)
                        ? "active"
                        : undefined
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="site-navbar__action lg:w-4/12 justify-end ms-auto">
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
        <button
          type="button"
          className="navbar__toggle ms-0"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="site-navbar-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <EllipsisVerticalIcon />
        </button>
      </nav>
    </header>
  );
}
