import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the navbar (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/navbar.html). The responsive-fold toggle is a native <button> over a Collapsible.
// Contract: Enter/Space toggle the menu; aria-expanded flips on the toggle (immediately), data-state
// flips on the menu (open immediately; closed lags until the transition ends).

test.describe("navbar — keyboard", () => {
  // The responsive fold (and its hamburger toggle) only engages below the lg breakpoint; at a
  // desktop width the toggle is display:none. Use a mobile viewport so the toggle is operable.
  test.use({ viewport: { width: 480, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/navbar.html");
  });

  test("Enter toggles the responsive menu", async ({ page }) => {
    const toggle = page.locator("#navbar-toggle");
    const menu = page.locator("#navbar-menu");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveAttribute("data-state", "closed");

    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toHaveAttribute("data-state", "open");

    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
