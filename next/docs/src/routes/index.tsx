import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "var(--font-sans)",
        background: "var(--color-background)",
        color: "var(--color-foreground)",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, margin: 0 }}>
        Stisla — Docs
      </h1>
      <p style={{ color: "var(--color-muted-foreground)" }}>
        Scaffold OK. Component pages will live under <code>/docs/vanilla/*</code>.
      </p>
    </main>
  );
}
