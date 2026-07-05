import { createFileRoute, Link } from "@tanstack/react-router";
import { getTemplate } from "~/data/templates";
import { TemplateDetail } from "~/template-detail";

/* Resolve the `$name` param to a template in the registry and hand it to the
 * shared shell. An unknown slug renders a quiet not-found rather than crashing. */
export const Route = createFileRoute("/templates/_tdetail/$name")({
  component: RouteComponent,
});

function RouteComponent() {
  const { name } = Route.useParams();
  const template = getTemplate(name);

  if (!template) {
    return (
      <main className="tpl tpl-missing">
        <h1 className="lp-h2">Template not found</h1>
        <p className="lp-lead">
          There&rsquo;s no template called <code>{name}</code>.
        </p>
        <Link
          to="/templates/$name"
          params={{ name: "meridian" }}
          className="button button--primary"
        >
          View Meridian
        </Link>
      </main>
    );
  }

  return <TemplateDetail meta={template} />;
}
