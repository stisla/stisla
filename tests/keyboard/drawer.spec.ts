import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-1 keyboard contract for the drawer (RELEASE-READINESS.md §5) — the modal-drawer sibling of
// the dialog. Runs against an ISOLATED, same-origin fixture (tests/fixtures/drawer.html).
// Contract: trigger opens on Enter · focus moves to [autofocus] inside .drawer__content · focus
// trapped · Escape closes · focus returns to the opener.
//
// State signal: the vanilla drawer sets data-state="open|closed" on .drawer[data-stisla-drawer]
// (drawer.js). Close is async — data-state flips to "closed" and focus returns to the opener only
// after the panel's CSS transition finishes (waitForTransition), so the assertions below poll.

test.describe("drawer — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/drawer.html");
  });

  test("opens on Enter and moves focus to the autofocus target", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Open drawer" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const drawer = page.locator("#drawerBasic");
    await expect(drawer).toHaveAttribute("data-state", "open");
    // [autofocus] is the title input — focus must land there, not stay on the trigger.
    await expect(page.locator("#taskTitle")).toBeFocused();
  });

  test("Escape closes and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Open drawer" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#drawerBasic")).toHaveAttribute("data-state", "open");

    await page.keyboard.press("Escape");
    await expect(page.locator("#drawerBasic")).toHaveAttribute("data-state", "closed");
    await expect(trigger).toBeFocused();
  });

  test("focus is trapped inside the panel (Tab never escapes)", async ({ page, browserName }) => {
    // WebKit only: Playwright's WebKit honors the macOS "Full Keyboard Access" setting (OFF by
    // default), so Tab visits only form fields and momentarily lands on <body> between stops — the
    // native tab order isn't representative and the per-Tab assertion false-fails. The trap still
    // ultimately contains focus. WebKit focus-trap is covered by the human real-Safari pass
    // (RELEASE-READINESS.md §6.3). Chromium + Firefox run the strict contract.
    test.skip(browserName === "webkit", "WebKit Full-Keyboard-Access default; see §6.3 Safari pass");
    await page.getByRole("button", { name: "Open drawer" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#drawerBasic")).toHaveAttribute("data-state", "open");

    // Tab through more controls than the drawer contains; focus must stay within the panel.
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const insideDrawer = await page.evaluate(() => {
        const drawer = document.getElementById("drawerBasic");
        return !!drawer && drawer.contains(document.activeElement);
      });
      expect(insideDrawer, `Tab #${i + 1} escaped the drawer`).toBe(true);
    }
  });

  test("static a11y: no axe violations, closed and open", async ({ page }) => {
    await expectNoA11yViolations(page);
    await page.getByRole("button", { name: "Open drawer" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#drawerBasic")).toHaveAttribute("data-state", "open");
    await expectNoA11yViolations(page);
  });
});
