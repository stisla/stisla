import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-1 keyboard contract for the select (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/select.html). Contract: opens on Enter/Space/ArrowDown · arrows move the active
// option (roving via aria-activedescendant + [data-highlighted]) · Enter selects and closes ·
// Escape closes without selecting · selected value reflected on the trigger + native <select>.
//
// State signal: NO data-state. Open = trigger[aria-expanded="true"] + .select__popup not [hidden].
// The JS builds the trigger/listbox from the native <select>; on open it pre-highlights the first
// enabled option (Indonesia). aria-activedescendant on the trigger tracks the active option id.

test.describe("select — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/select.html");
  });

  test("opens on ArrowDown and moves the active option", async ({ page }) => {
    const trigger = page.locator(".select__trigger");
    await trigger.focus();
    await page.keyboard.press("ArrowDown");

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".select__popup")).not.toHaveAttribute("hidden", /.*/);
    // On open the first enabled option is pre-highlighted.
    await expect(page.locator(".select__popup [data-highlighted]")).toHaveAttribute("data-value", "id");

    await page.keyboard.press("ArrowDown"); // → Malaysia
    await expect(page.locator(".select__popup [data-highlighted]")).toHaveAttribute("data-value", "my");
  });

  test("Enter selects the active option and closes", async ({ page }) => {
    const trigger = page.locator(".select__trigger");
    await trigger.focus();
    await page.keyboard.press("ArrowDown"); // open, Indonesia active
    await page.keyboard.press("ArrowDown"); // Malaysia active
    await page.keyboard.press("Enter");

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".select__popup")).toHaveAttribute("hidden", /.*/);
    await expect(page.locator('.select__popup [role="option"][aria-selected="true"]')).toHaveAttribute("data-value", "my");
    await expect(page.locator(".select__value")).toHaveText("Malaysia");
    // The native <select> is the source of truth.
    await expect(page.locator("#customSelect")).toHaveValue("my");
  });

  test("Escape closes without selecting", async ({ page }) => {
    const trigger = page.locator(".select__trigger");
    await trigger.focus();
    await page.keyboard.press("ArrowDown"); // open
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".select__popup")).toHaveAttribute("hidden", /.*/);
    // Nothing committed.
    await expect(page.locator("#customSelect")).toHaveValue("");
  });

  test("static a11y: no axe violations, closed and open", async ({ page }) => {
    await expectNoA11yViolations(page);
    await page.locator(".select__trigger").focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator(".select__trigger")).toHaveAttribute("aria-expanded", "true");
    await expectNoA11yViolations(page);
  });
});
