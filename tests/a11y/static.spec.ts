import { test } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Static-only a11y gate (RELEASE-READINESS.md §3). Every non-interactive component gets a faithful
// same-origin fixture (tests/fixtures/<name>.html, lifted from docs/src/routes/docs/vanilla/<name>)
// and one axe scan — no keyboard contract to assert. Data-driven: one test per component so the
// report names the failing component. Interactive components (dialog, drawer, menu, select, tabs,
// popover) have their own axe test inside their keyboard spec and are NOT listed here.
const STATIC_COMPONENTS = [
  "alert",
  "avatar",
  "avatar-group",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "card",
  "checkbox",
  "field",
  "icon-box",
  "illustration",
  "indicator",
  "input",
  "input-group",
  "kbd",
  "link",
  "list-group",
  "media",
  "meter",
  "page",
  "pagination",
  "placeholders",
  "progress",
  "radio",
  "separator",
  "spinner",
  "switch",
  "table",
  "textarea",
  "timeline",
];

test.describe("static components — a11y (axe)", () => {
  for (const name of STATIC_COMPONENTS) {
    test(`${name} has no axe violations`, async ({ page }) => {
      await page.goto(`/tests/fixtures/${name}.html`);
      await expectNoA11yViolations(page);
    });
  }
});
