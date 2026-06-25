import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/card")({
  component: CardDocs,
});

function CardDocs() {
  return (
    <>
      <header>
        <h1>Card</h1>
        <p className="lead">TODO: one short line — what it is, nothing more.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>TODO.</p>
        <Demo layout="stack" html={`<div class="card">TODO</div>`} />
      </section>

      {/* TODO: one <section> per variant/state from src/site/pages/card.njk.
          State = attributes / ARIA, never is-* (PORTING.md).
          End with <h2>Customization</h2> tabling the --card-* knobs (see button.tsx). */}
    </>
  );
}
