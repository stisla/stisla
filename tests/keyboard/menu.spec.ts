import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-1 keyboard contract for the menu (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/menu.html). Contract: trigger opens (native button → Enter/Space activate) ·
// ArrowDown/Up move a roving focus through role="menuitem" items · Home/End jump · Enter/Space
// activate · Escape closes and returns focus to the trigger.
//
// State signal: the vanilla menu sets data-state="open|closed" on .menu__popup[data-stisla-menu]
// and aria-expanded on the trigger. On open, focus lands on the popup container (tabindex="-1");
// the first ArrowDown moves DOM focus to the first item and marks it [data-highlighted]. Escape
// close is async (returns focus after the CSS transition), so the assertions poll.

test.describe("menu — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/menu.html");
  });

  test("opens on Enter; ArrowDown moves focus to the first item", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Actions" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const popup = page.locator("#menu-basic");
    await expect(popup).toHaveAttribute("data-state", "open");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("ArrowDown");
    const firstItem = page.getByRole("menuitem", { name: "Edit" });
    await expect(firstItem).toBeFocused();
    await expect(firstItem).toHaveAttribute("data-highlighted", "");
  });

  test("Arrow/Home/End rove the highlight through the items", async ({ page }) => {
    await page.getByRole("button", { name: "Actions" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#menu-basic")).toHaveAttribute("data-state", "open");

    await page.keyboard.press("ArrowDown"); // → Edit (first)
    await page.keyboard.press("ArrowDown"); // → Duplicate
    await expect(page.getByRole("menuitem", { name: "Duplicate" })).toBeFocused();

    await page.keyboard.press("End"); // → Delete (last)
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeFocused();

    await page.keyboard.press("Home"); // → Edit (first)
    await expect(page.getByRole("menuitem", { name: "Edit" })).toBeFocused();

    // Exactly one item is highlighted at a time.
    await expect(page.locator("#menu-basic [data-highlighted]")).toHaveCount(1);
  });

  test("Escape closes and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Actions" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#menu-basic")).toHaveAttribute("data-state", "open");

    await page.keyboard.press("Escape");
    await expect(page.locator("#menu-basic")).toHaveAttribute("data-state", "closed");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("static a11y: no axe violations, closed and open", async ({ page }) => {
    await expectNoA11yViolations(page);
    await page.getByRole("button", { name: "Actions" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#menu-basic")).toHaveAttribute("data-state", "open");
    await expectNoA11yViolations(page);
  });
});
