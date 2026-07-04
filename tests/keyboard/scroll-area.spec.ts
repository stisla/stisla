import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the scroll-area (RELEASE-READINESS.md §5). Isolated same-origin
// fixture (tests/fixtures/scroll-area.html). OverlayScrollbars wraps the content in a generated
// [data-overlayscrollbars-viewport] child — the real scrollable element.

test.describe("scroll-area — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/scroll-area.html");
  });

  const viewport = "#scroll-basic [data-overlayscrollbars-viewport]";

  test("the content overflows and can scroll", async ({ page }) => {
    const vp = page.locator(viewport);
    await expect(vp).toHaveCount(1);
    await vp.evaluate((el) => el.scrollBy(0, 200));
    expect(await vp.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  });

  // Regression guard for the scroll-area.js fix (RELEASE-READINESS.md §6.5): OverlayScrollbars ships
  // the viewport with tabindex="-1", so a keyboard-only user couldn't scroll it (axe:
  // scrollable-region-focusable, WCAG 2.1.1). scroll-area.js now makes the viewport focusable
  // (tabindex="0"), so it takes keyboard focus and scrolls. (A name is added only when the host
  // carries aria-label/labelledby; this Basic fixture has none, so no role/name is asserted here.)
  test("keyboard users can focus and scroll the region", async ({ page }) => {
    const vp = page.locator(viewport);
    await expect(vp).toHaveAttribute("tabindex", "0");
    await vp.focus();
    await expect(vp).toBeFocused();
    // ArrowDown scrolls the focused viewport (PageDown is unreliable in headless; the smooth-scroll
    // needs a few keystrokes to register). Poll so we don't race the scroll animation.
    for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowDown");
    await expect.poll(() => vp.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
