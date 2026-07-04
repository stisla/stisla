import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the toggle (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/toggle.html). Contract: Space (and Enter) toggle the pressed state; aria-pressed
// flips both ways. The toggle is a native <button data-stisla-toggle aria-pressed>, so the browser
// synthesizes click from Space/Enter — the component only listens on click.

test.describe("toggle — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/toggle.html");
  });

  test("Space toggles aria-pressed both ways", async ({ page }) => {
    const toggle = page.locator("#toggle-basic");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.focus();
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  test("Enter also toggles", async ({ page }) => {
    const toggle = page.locator("#toggle-basic");
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
