import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the autocomplete (RELEASE-READINESS.md §5). Isolated same-origin
// fixture (tests/fixtures/autocomplete.html), a self-contained (no Tom Select) combobox sourced
// from a <datalist>. Contract: role="combobox" input; typing filters + opens the listbox; the
// active option is virtual (aria-activedescendant + aria-selected); Enter selects; Escape closes.

test.describe("autocomplete — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/autocomplete.html");
  });

  test("typing opens the list and highlights the first option", async ({ page }) => {
    const input = page.locator("#basicAuto");
    await input.focus();
    await page.keyboard.type("sing");

    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".autocomplete__popup")).toBeVisible();
    const active = page.locator(".autocomplete__popup [data-highlighted]");
    await expect(active).toHaveText("Singapore");
    await expect(active).toHaveAttribute("aria-selected", "true");
    const activeId = await active.getAttribute("id");
    await expect(input).toHaveAttribute("aria-activedescendant", activeId!);
  });

  test("Enter selects the highlighted option", async ({ page }) => {
    const input = page.locator("#basicAuto");
    await input.focus();
    await page.keyboard.type("sing");
    await page.keyboard.press("Enter");

    await expect(input).toHaveValue("Singapore");
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".autocomplete__popup")).toBeHidden();
  });

  test("Escape closes and keeps the typed text", async ({ page }) => {
    const input = page.locator("#basicAuto");
    await input.focus();
    await page.keyboard.type("sing");
    await expect(page.locator(".autocomplete__popup")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".autocomplete__popup")).toBeHidden();
    await expect(input).toHaveValue("sing");
  });

  test("static a11y: no axe violations, closed and open", async ({ page }) => {
    await expectNoA11yViolations(page);
    // Open state: the listbox is named by autocomplete.js (mirrors the input label).
    await page.locator("#basicAuto").focus();
    await page.keyboard.type("sing");
    await expect(page.locator(".autocomplete__popup")).toBeVisible();
    await expectNoA11yViolations(page);
  });
});
