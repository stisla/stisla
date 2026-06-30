import { createFileRoute, Link } from "@tanstack/react-router";
import { Blocks, Heart, Layers } from "lucide-react";
import { SiteNavbar } from "~/site-navbar";

/* Landing page. Ported from the legacy docs home (src/site/pages/index.njk):
 * a centred hero over a three-up features grid, no sidebar or rail. Reuses the
 * shared site navbar (no `onMenu` — there is no sidebar to open here). */
export const Route = createFileRoute("/")({
  component: Home,
});

const FEATURES = [
  {
    icon: Layers,
    title: "A spec, with code",
    body: "Framework-agnostic by design. The vanilla CSS port is the first implementation. React and Vue ports come later, all against the same spec.",
  },
  {
    icon: Blocks,
    title: "Components for real apps",
    body: "Buttons, forms, dialogs, popovers, tables, navigation, and more. The components you actually reach for when building user interfaces.",
  },
  {
    icon: Heart,
    title: "Open source",
    body: "MIT-licensed and developed in the open on GitHub. Issues, ideas, and contributions are welcome.",
  },
];

function Home() {
  return (
    <>
      <SiteNavbar />

      <div className="site-layout site-layout--landing">
        <main className="site-main site-main--landing">
          <section className="site-hero">
            <h1 className="site-hero__title">
              Themeable component library
              <br />
              for user interfaces
            </h1>
            <p className="site-hero__lead">
              Stisla is built to live wherever you do. The same design system,
              fitting right into whatever framework you reach for.
            </p>
            <div className="site-hero__actions">
              <Link to="/docs/introduction" className="button button--primary">
                Get started
              </Link>
              <Link
                to="/docs/theming"
                className="button button--ghost button--neutral"
              >
                Customization
              </Link>
            </div>
          </section>

          <section className="site-features" aria-label="What's in Stisla">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <article className="site-feature" key={title}>
                <div className="site-feature__inner">
                  <span className="site-feature__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h2 className="site-feature__title">{title}</h2>
                  <p className="site-feature__body">{body}</p>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
