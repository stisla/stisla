import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the carousel (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/carousel.html), autoplay off for determinism. Contract: prev/next are native
// <button>s (Enter/Space/click advance); the root has tabindex="0" and ArrowLeft/Right + Home/End
// navigate when it is focused. The active slide is tracked by the active indicator dot
// (aria-current="true"). Slides carry no per-slide active attribute, so assert on the dot.

test.describe("carousel — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/carousel.html");
  });

  test("Next control advances the active slide", async ({ page }) => {
    await expect(page.locator("#carousel-dot-1")).toHaveAttribute("aria-current", "true");
    await page.locator("#carousel-next").click();
    await expect(page.locator("#carousel-dot-2")).toHaveAttribute("aria-current", "true");
    await expect(page.locator("#carousel-dot-1")).not.toHaveAttribute("aria-current", "true");
  });

  test("Arrow keys navigate when the carousel is focused", async ({ page }) => {
    await page.locator("#carousel-basic").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#carousel-dot-2")).toHaveAttribute("aria-current", "true");

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#carousel-dot-1")).toHaveAttribute("aria-current", "true");

    await page.keyboard.press("End");
    await expect(page.locator("#carousel-dot-3")).toHaveAttribute("aria-current", "true");

    await page.keyboard.press("Home");
    await expect(page.locator("#carousel-dot-1")).toHaveAttribute("aria-current", "true");
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
