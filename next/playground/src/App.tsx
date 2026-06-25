import { useState, type ReactNode } from "react";
import { Button } from "@stisla/react";
import { DemoFrame } from "./demo/DemoFrame";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground">{label}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

// a tiny inline icon so icon-only / loading demos have something to show
const Star = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="m12 2 3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z" />
  </svg>
);

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <div
      data-theme={dark ? "dark" : undefined}
      className="min-h-screen p-8"
      style={{ background: "var(--st-background)", color: "var(--st-foreground)" }}
    >
      <div className="flex flex-col gap-8" style={{ maxWidth: "56rem" }}>
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stisla — Button</h1>
          <Button tone="neutral" shape="outline" size="sm" onClick={() => setDark((d) => !d)}>
            {dark ? "☾ dark" : "☀ light"}
          </Button>
        </header>

        <Row label="Vanilla demo — real HTML + @stisla/css in a sandboxed iframe">
          <div style={{ width: "100%" }}>
            <DemoFrame
              theme={dark ? "dark" : "light"}
              html={`
<button class="button button--primary">Primary</button>
<button class="button button--danger">Danger</button>
<button class="button button--neutral">Neutral</button>
<button class="button button--tertiary">Tertiary</button>
<button class="button button--primary button--outline">Outline</button>
<button class="button button--neutral button--ghost">Ghost</button>
<button class="button button--primary button--lg">Large</button>
<button class="button button--primary" style="--button-tone: var(--st-warning)">tune tone</button>
`}
            />
          </div>
        </Row>

        <Row label="Tones (filled)">
          <Button tone="primary">Primary</Button>
          <Button tone="danger">Danger</Button>
          <Button tone="neutral">Neutral</Button>
          <Button tone="tertiary">Tertiary</Button>
        </Row>

        <Row label="Sizes (base = md)">
          <Button tone="primary" size="sm">sm</Button>
          <Button tone="primary">md</Button>
          <Button tone="primary" size="lg">lg</Button>
          <Button tone="primary" size="xl">xl</Button>
        </Row>

        <Row label="Shapes — outline">
          <Button tone="primary" shape="outline">Primary</Button>
          <Button tone="danger" shape="outline">Danger</Button>
          <Button tone="neutral" shape="outline">Neutral</Button>
        </Row>

        <Row label="Shapes — ghost / soft">
          <Button tone="primary" shape="ghost">Ghost</Button>
          <Button tone="neutral" shape="ghost">Ghost neutral</Button>
          <Button tone="primary" shape="soft">Soft</Button>
          <Button tone="danger" shape="soft">Soft danger</Button>
        </Row>

        <Row label="Icon-only / round / loading">
          <Button tone="primary" iconOnly aria-label="Favorite"><Star /></Button>
          <Button tone="primary" iconOnly iconRound aria-label="Favorite"><Star /></Button>
          <Button tone="neutral" shape="outline" iconOnly aria-label="Favorite"><Star /></Button>
          <Button tone="primary" loading>Saving</Button>
        </Row>

        <Row label="States">
          <Button tone="primary" disabled>Disabled</Button>
          <Button tone="primary" block>Block (full width)</Button>
        </Row>

        <Row label="tune — knobs (CSS vars)">
          {/* token reference: --st-radius-lg */}
          <Button tone="primary" tune={{ radius: "--st-radius-lg" }}>radius → lg token</Button>
          {/* literal arbitrary value — deliberately off-palette */}
          <Button tone="primary" tune={{ tone: "oklch(0.62 0.2 320)" }}>arbitrary tone</Button>
          {/* arbitrary radius literal */}
          <Button tone="neutral" tune={{ radius: "9999px" }}>pill via tune</Button>
        </Row>

        <Row label="Utility override (className beats component by @layer order)">
          {/* bg-danger is a utility → should win over the primary component background */}
          <Button tone="primary" className="bg-danger">primary + bg-danger</Button>
          {/* arbitrary margin/padding utilities compose freely */}
          <Button tone="primary" className="rounded-none px-10">utility geometry</Button>
        </Row>
      </div>
    </div>
  );
}
