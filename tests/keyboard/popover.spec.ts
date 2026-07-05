import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-1 keyboard contract for the popover (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/popover.html). Contract: opens from the keyboard (native button → Enter/Space) ·
// focus moves INTO the content (first tabbable) · Escape closes and returns focus to the trigger ·
// outside click dismisses.
//
// State signal: the vanilla popover sets data-state="open|closed" on .popover[data-stisla-popover]
// and aria-expanded on the trigger. On open the surface is portaled to <body> (still #pop-test);
// data-state flips to "open" inside a requestAnimationFrame, so the assertions poll.

test.describe("popover — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/popover.html");
  });

  test("opens on Enter and moves focus into the content", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Invite teammate" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const popover = page.locator("#pop-test");
    await expect(popover).toHaveAttribute("data-state", "open");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Focus moves to the first tabbable inside the surface — the email input.
    await expect(page.locator("#pop-email")).toBeFocused();
  });

  test("Escape closes and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Invite teammate" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#pop-test")).toHaveAttribute("data-state", "open");

    await page.keyboard.press("Escape");
    await expect(page.locator("#pop-test")).toHaveAttribute("data-state", "closed");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("outside click dismisses the popover", async ({ page }) => {
    await page.getByRole("button", { name: "Invite teammate" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#pop-test")).toHaveAttribute("data-state", "open");

    // Click a neutral control outside the surface; default autoClose="outside" closes it.
    await page.locator("#before").click();
    await expect(page.locator("#pop-test")).toHaveAttribute("data-state", "closed");
  });

  test("static a11y: no axe violations, closed and open", async ({ page }) => {
    await expectNoA11yViolations(page);
    await page.getByRole("button", { name: "Invite teammate" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#pop-test")).toHaveAttribute("data-state", "open");
    // data-state="open" is set at the START of the fade-in; wait for the surface to settle at full
    // opacity before axe measures pixels, or it reads mid-transition (washed-out) contrast.
    await expect(page.locator("#pop-test")).toHaveCSS("opacity", "1");
    await expectNoA11yViolations(page);
  });
});
