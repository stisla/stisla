import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import appCss from "../styles/index.css?url";
import { ThemeProvider, THEME_COOKIE } from "~/theme";
import { SiteFooter } from "~/site-footer";

/* Resolve the persisted theme on BOTH sides: on the server from the request cookie (so SSR
 * renders the right [data-theme] before anything paints — no flash), on the client from
 * document.cookie (so a client-side navigation re-running the loader stays in sync). */
const readTheme = createIsomorphicFn()
  .server((): "light" | "dark" =>
    getCookie(THEME_COOKIE) === "dark" ? "dark" : "light",
  )
  .client((): "light" | "dark" =>
    new RegExp(`(?:^|;\\s*)${THEME_COOKIE}=dark`).test(document.cookie)
      ? "dark"
      : "light",
  );

export const Route = createRootRoute({
  loader: () => ({ theme: readTheme() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Stisla — Docs" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      /* Logomark favicon, ported from the legacy docs (src/site/layouts/base.njk). Inline SVG
         data-URI so there's no asset to ship; the @media query flips fill/stroke for dark mode. */
      {
        rel: "icon",
        type: "image/svg+xml",
        href: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><style>.t{fill:%230a0a0a}.m{stroke:%23fafafa}@media (prefers-color-scheme: dark){.t{fill:%23fafafa}.m{stroke:%230a0a0a}}</style><rect class="t" width="512" height="512" rx="112"/><path class="m" d="M 392 144 H 200 A 56 56 0 0 0 200 256 H 312 A 56 56 0 0 1 312 368 H 120" fill="none" stroke-width="76" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      },
      /* Inter — the design system's intended UI font. --font-sans prefers it, falling back to
         system-ui. Loaded from a CDN (same no-build pattern as the lucide icons). */
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
      /* Landing-page face: JetBrains Mono sets the section eyebrows, clause numbers,
         and all code. The display voice is Inter itself, set heavy and tight. */
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = Route.useLoaderData();
  return (
    <html
      lang="en"
      className={theme === "dark" ? "dark" : undefined}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider initialTheme={theme}>
          {children}
          <SiteFooter />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
