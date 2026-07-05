import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the accordion (RELEASE-READINESS.md §5). Isolated same-origin
// fixture (tests/fixtures/accordion.html) — multiple-open mode. Each header is a native <button>,
// so Enter/Space activation and focus come from the browser (no custom key handler). Contract:
// Enter/Space toggle aria-expanded on the header; multiple panels may be open at once.
//
// Note: aria-expanded flips immediately; the item's data-state="closed" lags until the CSS
// transition ends, so assert on aria-expanded (the immediate signal).

test.describe("accordion — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/accordion.html");
  });

  test("Enter toggles a header's aria-expanded both ways", async ({ page }) => {
    const t2 = page.locator("#acc-2-trigger");
    const start = await t2.getAttribute("aria-expanded");
    await t2.focus();
    await page.keyboard.press("Enter");
    await expect(t2).toHaveAttribute("aria-expanded", start === "true" ? "false" : "true");
    await page.keyboard.press("Enter");
    await expect(t2).toHaveAttribute("aria-expanded", start ?? "false");
  });

  test("Space also toggles", async ({ page }) => {
    const t3 = page.locator("#acc-3-trigger");
    const start = await t3.getAttribute("aria-expanded");
    await t3.focus();
    await page.keyboard.press("Space");
    await expect(t3).toHaveAttribute("aria-expanded", start === "true" ? "false" : "true");
  });

  test("multiple panels can be open at once", async ({ page }) => {
    // Open both #2 and #3; neither closes the other in multiple mode.
    for (const id of ["#acc-2-trigger", "#acc-3-trigger"]) {
      const t = page.locator(id);
      if ((await t.getAttribute("aria-expanded")) !== "true") {
        await t.focus();
        await page.keyboard.press("Enter");
      }
      await expect(t).toHaveAttribute("aria-expanded", "true");
    }
    await expect(page.locator("#acc-2-trigger")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#acc-3-trigger")).toHaveAttribute("aria-expanded", "true");
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
