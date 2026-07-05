import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

// Static a11y scan against the CURRENT page (a same-origin fixture — no sandboxed iframe, so
// axe injects cleanly). WCAG 2.0/2.1 A + AA. Triage real violations by fixing the component or
// the fixture markup; disable a rule only with `disableRules([...])` AND a comment saying why.
export async function expectNoA11yViolations(
  page: Page,
  { include, disableRules = [] }: { include?: string; disableRules?: string[] } = {},
) {
  let builder = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
  ]);
  if (include) builder = builder.include(include);
  if (disableRules.length) builder = builder.disableRules(disableRules);
  const { violations } = await builder.analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}
