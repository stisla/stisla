import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteNavbar } from "~/site-navbar";
import { SiteFooter } from "~/site-footer";

/* Chrome shared by every template detail page: the sticky site navbar, the page
 * body (an Outlet the `$name` route fills), and the footer. Pathless (`_tdetail`),
 * so it wraps `/templates/$name` without adding a URL segment. Template-specific
 * rendering lives in `TemplateDetail`, driven by the registry. */
export const Route = createFileRoute("/templates/_tdetail")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
