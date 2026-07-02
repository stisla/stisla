import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__credit">
          Designed by{" "}
          <a
            href="https://twitter.com/mhdnauvalazhar"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nauval
          </a>
        </p>
        <nav className="site-footer__links" aria-label="Footer">
          <Link to="/docs/introduction">Docs</Link>
          <Link to="/illustrations">Illustrations</Link>
          <a
            href="https://github.com/stisla/stisla"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
