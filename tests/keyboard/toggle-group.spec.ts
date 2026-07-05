import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the toggle-group (RELEASE-READINESS.md §5). Isolated same-origin
// fixture (tests/fixtures/toggle-group.html) — single-select (role="radiogroup", members
// role="radio" + aria-checked). Contract: arrows rove focus AND auto-select (WAI-ARIA radio-group
// pattern); Home/End jump; roving tabindex keeps exactly one member tabbable.

test.describe("toggle-group — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/toggle-group.html");
  });

  test("ArrowRight roves focus and selects the next member", async ({ page }) => {
    const day = page.locator("#tg-day");
    const week = page.locator("#tg-week");
    await expect(day).toHaveAttribute("tabindex", "0");
    await day.focus();
    await page.keyboard.press("ArrowRight");

    await expect(week).toBeFocused();
    await expect(week).toHaveAttribute("aria-checked", "true");
    await expect(week).toHaveAttribute("tabindex", "0");
    await expect(day).toHaveAttribute("aria-checked", "false");
    await expect(day).toHaveAttribute("tabindex", "-1");
    await expect(page.locator('#tg .toggle[tabindex="0"]')).toHaveCount(1);
  });

  test("Home/End jump to the first and last member", async ({ page }) => {
    await page.locator("#tg-day").focus();
    await page.keyboard.press("End");
    await expect(page.locator("#tg-month")).toBeFocused();
    await expect(page.locator("#tg-month")).toHaveAttribute("aria-checked", "true");

    await page.keyboard.press("Home");
    await expect(page.locator("#tg-day")).toBeFocused();
    await expect(page.locator("#tg-day")).toHaveAttribute("aria-checked", "true");
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
