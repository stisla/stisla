import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the collapsible (RELEASE-READINESS.md §5). Isolated same-origin
// fixture (tests/fixtures/collapsible.html). The trigger is a native <button>; Enter/Space toggle.
// Contract: aria-expanded flips on the trigger; data-state flips on the region (open immediately;
// closed lags until the CSS transition ends — assert on aria-expanded for the immediate signal).

test.describe("collapsible — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/collapsible.html");
  });

  test("Enter toggles the region open and closed", async ({ page }) => {
    const trigger = page.locator("#collapsible-basic-trigger");
    const region = page.locator("#collapsible-basic");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(region).toHaveAttribute("data-state", "open");

    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Space also toggles", async ({ page }) => {
    const trigger = page.locator("#collapsible-basic-trigger");
    await trigger.focus();
    await page.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
