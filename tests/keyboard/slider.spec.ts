import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the slider (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/slider.html; min=0 max=100 step=1 start=40). Contract: the thumb (role="slider",
// tabindex=0) takes arrow keys — ArrowRight/Up increment by step, ArrowLeft/Down decrement,
// Home→min, End→max — and aria-valuenow tracks the value. The thumb also carries an accessible name
// mirrored from the host's <label> by slider.js (see the a11y test).

test.describe("slider — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/slider.html");
  });

  test("arrow keys change the value by step", async ({ page }) => {
    const thumb = page.locator("#basicSliderThumb");
    await expect(thumb).toHaveAttribute("aria-valuenow", "40");
    await thumb.focus();

    await page.keyboard.press("ArrowRight");
    await expect(thumb).toHaveAttribute("aria-valuenow", "41");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(thumb).toHaveAttribute("aria-valuenow", "39");
  });

  test("Home and End jump to min and max", async ({ page }) => {
    const thumb = page.locator("#basicSliderThumb");
    await thumb.focus();
    await page.keyboard.press("Home");
    await expect(thumb).toHaveAttribute("aria-valuenow", "0");
    await page.keyboard.press("End");
    await expect(thumb).toHaveAttribute("aria-valuenow", "100");
  });

  test("static a11y: the thumb is named (no axe violations)", async ({ page }) => {
    // Regression guard for the slider.js fix: role="slider" is an ARIA input field; without a name
    // axe flags aria-input-field-name. slider.js mirrors the host <label> onto the thumb.
    await expect(page.locator("#basicSliderThumb")).toHaveAttribute("aria-labelledby", /.+/);
    await expectNoA11yViolations(page);
  });
});
