import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the combobox (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/combobox.html). This component wraps the third-party Tom Select library (bundled
// into stisla.js), so the DOM + ARIA are Tom Select's (.ts-wrapper / .ts-control / .ts-dropdown).
// Per §9 the adapter's own a11y limitations are ACCEPTED third-party constraints, not Stisla bugs;
// this spec asserts the keyboard behavior works end to end.

test.describe("combobox — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/combobox.html");
  });

  test("opens the dropdown from the keyboard", async ({ page }) => {
    await page.locator(".ts-control input").focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator(".ts-dropdown")).toBeVisible();
  });

  test("Enter selects an option and updates the source select", async ({ page }) => {
    await page.locator(".ts-control input").focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator(".ts-dropdown")).toBeVisible();
    await page.keyboard.press("Enter");
    // The native <select> is the source of truth; a real option is now committed.
    await expect(page.locator("#combobox-framework")).not.toHaveValue("");
  });

  test("Escape closes the dropdown", async ({ page }) => {
    await page.locator(".ts-control input").focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator(".ts-dropdown")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".ts-dropdown")).toBeHidden();
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
