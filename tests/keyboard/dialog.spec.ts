import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-1 keyboard contract for the dialog (RELEASE-READINESS.md §5). Runs against an ISOLATED,
// same-origin fixture (tests/fixtures/dialog.html) — the Bootstrap model, not the docs site.
// Contract (documented on /docs/vanilla/dialog): open on Enter · focus moves to [autofocus] ·
// focus trapped · Escape closes · focus returns to the opener.
//
// State signal: the vanilla dialog sets data-state="open|closed" on .dialog[data-stisla-dialog]
// and returns focus to the element that was active when it opened (dialog.js).

test.describe("dialog — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/dialog.html");
  });

  test("opens on Enter and moves focus to the autofocus target", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Invite a teammate" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.locator("#dlg-basic");
    await expect(dialog).toHaveAttribute("data-state", "open");
    // [autofocus] is the email input — focus must land there, not stay on the trigger.
    await expect(page.locator("#dlg-basic-email")).toBeFocused();
  });

  test("Escape closes and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Invite a teammate" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#dlg-basic")).toHaveAttribute("data-state", "open");

    await page.keyboard.press("Escape");
    await expect(page.locator("#dlg-basic")).toHaveAttribute("data-state", "closed");
    await expect(trigger).toBeFocused();
  });

  test("focus is trapped inside the panel (Tab never escapes)", async ({ page }) => {
    await page.getByRole("button", { name: "Invite a teammate" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#dlg-basic")).toHaveAttribute("data-state", "open");

    // Tab through more controls than the dialog contains; focus must stay within the dialog.
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const insideDialog = await page.evaluate(() => {
        const dialog = document.getElementById("dlg-basic");
        return !!dialog && dialog.contains(document.activeElement);
      });
      expect(insideDialog, `Tab #${i + 1} escaped the dialog`).toBe(true);
    }
  });

  // Green since 2026-07-03: the intent-palette contrast fix (option a — fill/-text token split,
  // RELEASE-READINESS.md §6.5) darkened the primary fill, so the dialog's primary buttons now pass.
  test("static a11y: no axe violations, closed and open", async ({ page }) => {
    await expectNoA11yViolations(page);
    await page.getByRole("button", { name: "Invite a teammate" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#dlg-basic")).toHaveAttribute("data-state", "open");
    await expectNoA11yViolations(page);
  });
});
