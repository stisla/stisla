import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { Button } from "@stisla/react";
import { ThemeProvider, useTheme } from "~/theme";

/* Layout for every /docs/* page: nav sidebar + theme toggle + the prose content area.
 * Doc pages author content only (ARCHITECTURE: docs = content, not chrome). */
export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

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

function DocsLayout() {
  return (
    <ThemeProvider>
      <div className="docs-shell">
        <aside className="docs-nav">
          <div className="docs-nav-brand">
            <span>Stisla</span>
            <ThemeToggle />
          </div>
          <nav>
            <p className="nav-group">Vanilla</p>
            <Link
              to="/docs/vanilla/alert"
              activeProps={{ className: "active" }}
            >
              Alert
            </Link>
            <Link
              to="/docs/vanilla/button"
              activeProps={{ className: "active" }}
            >
              Button
            </Link>
          </nav>
        </aside>
        <main className="page prose dark:prose-invert max-w-none">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
