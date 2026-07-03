import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// THE authoritative contrast test (RELEASE-READINESS.md §6.5). axe measures the actually-rendered
// pixels in Chromium via the reference axe-core engine — the number to trust when hand testers and
// online tools disagree (they run APCA, feed different hexes, or assume different thresholds).
//
// Renders the real intent-using components (solid + soft badges, buttons, tinted alerts with links)
// from the SHIPPED tokens, in BOTH themes, and asserts zero color-contrast violations. Covers the
// fill/-text token split from option (a).

async function scan(page: import("@playwright/test").Page, label: string) {
  const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  const rows: string[] = [];
  for (const bucket of [results.passes, results.violations]) {
    for (const rule of bucket) {
      for (const node of rule.nodes) {
        const d = node.any?.[0]?.data as
          | { contrastRatio?: number; fgColor?: string; bgColor?: string }
          | undefined;
        if (d?.contrastRatio != null) {
          const pass = d.contrastRatio >= 4.5 ? "PASS" : "FAIL";
          rows.push(`${pass}  ${d.contrastRatio.toFixed(2)}:1  ${String(node.target?.[0] ?? "?").padEnd(48)} ${d.fgColor} on ${d.bgColor}`);
        }
      }
    }
  }
  console.log(`\n— axe browser-measured contrast (${label}) —\n${rows.sort().join("\n")}\n`);
  return results.violations;
}

test.describe("intent color contrast (a11y)", () => {
  test("all intent components meet WCAG AA (4.5:1) — light", async ({ page }) => {
    await page.goto("/tests/fixtures/intents.html");
    const violations = await scan(page, "light");
    expect(violations, JSON.stringify(violations.map((v) => v.nodes.map((n) => n.target)), null, 2)).toEqual([]);
  });

  test("all intent components meet WCAG AA (4.5:1) — dark", async ({ page }) => {
    await page.goto("/tests/fixtures/intents.html");
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
    const violations = await scan(page, "dark");
    expect(violations, JSON.stringify(violations.map((v) => v.nodes.map((n) => n.target)), null, 2)).toEqual([]);
  });
});
