import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  CreditCard,
  Hexagon,
  Home,
  Inbox,
  Settings,
  Users,
} from "lucide-react";
import { Sidebar } from "@stisla/react";

export const Route = createFileRoute("/docs/react/sidebar")({
  component: SidebarReactDocs,
});

/* React demo for Sidebar — rendered INLINE (not in an iframe). This is the framework-output
 * proof for the slice gate: the same sidebar.css + the same @stisla/style config that drive the
 * vanilla page also drive this compound React API, emitting identical BEM classes + --sidebar-*
 * vars. No styling logic lives in the wrappers. */
function SidebarReactDocs() {
  return (
    <>
      <header>
        <h1>Sidebar (React)</h1>
        <p className="lead">
          The same component as the vanilla page, via the <code>@stisla/react</code> compound API.
          The wrappers are thin: they resolve to the identical BEM classes and CSS vars, so the
          styling is shared.
        </p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          <code>&lt;Sidebar&gt;</code> with <code>Sidebar.Content</code> / <code>.Menu</code> /{" "}
          <code>.Group</code> / <code>.List</code> / <code>.Item</code> / <code>.Button</code>. The{" "}
          <code>href</code> renders an <code>&lt;a&gt;</code>; omit it for a <code>&lt;button&gt;</code>.
        </p>
        <div className="not-prose" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Sidebar style={{ width: "16rem" }}>
            <Sidebar.Header>
              <Sidebar.Brand href="#">
                <Hexagon />
                <span>Stisla</span>
              </Sidebar.Brand>
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Menu>
                <Sidebar.Group>
                  <Sidebar.List>
                    <Sidebar.Item>
                      <Sidebar.Button href="#" aria-current="page">
                        <Home />
                        Dashboard
                      </Sidebar.Button>
                    </Sidebar.Item>
                    <Sidebar.Item>
                      <Sidebar.Button href="#">
                        <BarChart3 />
                        Analytics
                      </Sidebar.Button>
                    </Sidebar.Item>
                    <Sidebar.Item>
                      <Sidebar.Button href="#">
                        <Inbox />
                        Inbox
                      </Sidebar.Button>
                    </Sidebar.Item>
                  </Sidebar.List>
                </Sidebar.Group>
              </Sidebar.Menu>
            </Sidebar.Content>
          </Sidebar>
        </div>
      </section>

      <section>
        <h2>Knob inheritance via <code>tune</code> (root vs per-item)</h2>
        <p>
          A <code>tune</code> on the root sets <code>--sidebar-*</code> vars that the cascade
          distributes to every item. A <code>tune</code> on a single <code>Sidebar.Item</code>{" "}
          overrides just that subtree, closer in the cascade. This is a CSS feature;
          the wrapper only writes the vars.
        </p>
        <div className="not-prose" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Sidebar
            size="lg"
            style={{ width: "16rem" }}
            tune={{
              buttonBgActive: "--color-primary",
              buttonColorActive: "--color-primary-foreground",
            }}
          >
            <Sidebar.Content>
              <Sidebar.Menu>
                <Sidebar.Group>
                  <Sidebar.GroupTitle>Navigation</Sidebar.GroupTitle>
                  <Sidebar.List>
                    <Sidebar.Item>
                      <Sidebar.Button href="#" aria-current="page">
                        <Home />
                        Dashboard (root tune)
                      </Sidebar.Button>
                    </Sidebar.Item>
                    {/* Per-item override: this row's active chip uses success, not the root's primary. */}
                    <Sidebar.Item
                      tune={{
                        buttonBgActive: "--color-success",
                        buttonColorActive: "--color-success-foreground",
                      }}
                    >
                      <Sidebar.Button href="#" data-state="active">
                        <Users />
                        Customers (own tune)
                      </Sidebar.Button>
                    </Sidebar.Item>
                    <Sidebar.Item>
                      <Sidebar.Button href="#">
                        <CreditCard />
                        Billing
                      </Sidebar.Button>
                    </Sidebar.Item>
                  </Sidebar.List>
                </Sidebar.Group>
              </Sidebar.Menu>
            </Sidebar.Content>
          </Sidebar>
        </div>
      </section>

      <section>
        <h2>Collapsed (rail)</h2>
        <p>
          The <code>collapsed</code> prop sets the <code>[data-collapsed]</code> attribute (a state,
          not a class). Click-to-toggle and the width animation are the separate{" "}
          <code>@stisla/vanilla</code> behavior layer.
        </p>
        <div className="not-prose" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Sidebar
            collapsed
            style={{
              border: "var(--st-border-width) solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              ["--sidebar-bg" as string]: "var(--color-surface)",
            }}
          >
            <Sidebar.Header>
              <Sidebar.Brand href="#" aria-label="Stisla">
                <Hexagon />
                <span>Stisla</span>
              </Sidebar.Brand>
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Menu>
                <Sidebar.Group>
                  <Sidebar.List>
                    <Sidebar.Item>
                      <Sidebar.Button href="#" aria-current="page">
                        <Home />
                        <span>Dashboard</span>
                      </Sidebar.Button>
                    </Sidebar.Item>
                    <Sidebar.Item>
                      <Sidebar.Button href="#">
                        <Inbox />
                        <span>Inbox</span>
                      </Sidebar.Button>
                    </Sidebar.Item>
                    <Sidebar.Item>
                      <Sidebar.Button href="#">
                        <Settings />
                        <span>Settings</span>
                      </Sidebar.Button>
                    </Sidebar.Item>
                  </Sidebar.List>
                </Sidebar.Group>
              </Sidebar.Menu>
            </Sidebar.Content>
          </Sidebar>
        </div>
      </section>
    </>
  );
}
