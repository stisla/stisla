import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the tooltip (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/tooltip.html). Contract: the trigger is keyboard-focusable; the tooltip shows on
// FOCUS (not just hover); Escape dismisses; the content is referenced by aria-describedby.
//
// The tooltip chip is created on first show and appended to <body> with role="tooltip" and
// data-state="open|closed"; the trigger gets aria-describedby pointing at the chip id while shown.
// (Grep once flagged this as a possible gap — it is not: focusin/Escape/aria-describedby are wired.)

test.describe("tooltip — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/tooltip.html");
  });

  test("shows on keyboard focus and links via aria-describedby", async ({ page }) => {
    const trigger = page.locator("#trigger");
    await trigger.focus();

    const tip = page.locator(".tooltip");
    await expect(tip).toHaveAttribute("data-state", "open");
    // aria-describedby points at the shown chip.
    const describedby = await trigger.getAttribute("aria-describedby");
    expect(describedby).toBeTruthy();
    await expect(page.locator(`#${describedby}`)).toHaveAttribute("role", "tooltip");
  });

  test("Escape dismisses and keeps focus on the trigger", async ({ page }) => {
    const trigger = page.locator("#trigger");
    await trigger.focus();
    await expect(page.locator(".tooltip")).toHaveAttribute("data-state", "open");

    await page.keyboard.press("Escape");
    await expect(page.locator(".tooltip")).toHaveAttribute("data-state", "closed");
    await expect(trigger).not.toHaveAttribute("aria-describedby", /.*/);
    await expect(trigger).toBeFocused();
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
