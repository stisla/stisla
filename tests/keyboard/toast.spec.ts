import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the toast (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/toast.html) using the declarative [data-stisla-toast-trigger] path with a static
// toast. Contract: the toast is a live region (role="status" + aria-live); it can be shown from the
// keyboard and dismissed from the keyboard via its close <button>.
//
// open() flips data-state inside a requestAnimationFrame, so the assertions poll.

test.describe("toast — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/toast.html");
  });

  test("is a polite live region", async ({ page }) => {
    const toast = page.locator("#toast-basic");
    await expect(toast).toHaveAttribute("role", "status");
    await expect(toast).toHaveAttribute("aria-live", "polite");
  });

  test("trigger shows the toast and the close button dismisses it", async ({ page }) => {
    const toast = page.locator("#toast-basic");
    await page.locator("#show-toast").focus();
    await page.keyboard.press("Enter");
    await expect(toast).toHaveAttribute("data-state", "open");
    await expect(toast).toHaveAttribute("aria-hidden", "false");

    await page.locator("#toast-close").focus();
    await page.keyboard.press("Enter");
    await expect(toast).toHaveAttribute("data-state", "closed");
    await expect(toast).toHaveAttribute("aria-hidden", "true");
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
