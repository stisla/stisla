import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the sidebar (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/sidebar.html). Contract: the rail collapse/expand toggle is a native <button>,
// keyboard-operable; toggling flips data-collapsed (boolean presence) on the sidebar root and
// aria-expanded on the toggle.

test.describe("sidebar — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/sidebar.html");
  });

  test("Enter collapses and expands the rail", async ({ page }) => {
    const root = page.locator("#sidebar-root");
    const toggle = page.locator("#collapse-toggle");
    await expect(root).not.toHaveAttribute("data-collapsed", /.*/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(root).toHaveAttribute("data-collapsed", /.*/);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expect(root).not.toHaveAttribute("data-collapsed", /.*/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
