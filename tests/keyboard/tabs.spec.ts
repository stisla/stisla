import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-1 keyboard contract for tabs (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/tabs.html). Contract: ArrowLeft/ArrowRight rove between tabs · Home/End jump ·
// active tab carries aria-selected="true" + tabindex="0", the rest tabindex="-1" · each panel is
// associated via aria-controls/aria-labelledby.
//
// Default activation mode is "automatic" — activation follows focus, so an arrow key both moves
// focus AND flips the selection (no Enter/Space needed). The JS marks state via data-state +
// aria-selected on triggers and data-state on panels.

test.describe("tabs — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/tabs.html");
  });

  test("ArrowRight roves focus and activates the next tab", async ({ page }) => {
    const overview = page.getByRole("tab", { name: "Overview" });
    const activity = page.getByRole("tab", { name: "Activity" });
    await overview.focus();
    await page.keyboard.press("ArrowRight");

    await expect(activity).toBeFocused();
    await expect(activity).toHaveAttribute("aria-selected", "true");
    await expect(overview).toHaveAttribute("aria-selected", "false");
    // Panel selection follows.
    await expect(page.locator('#tabs-fixture .tabs__panel[data-value="activity"]')).toHaveAttribute("data-state", "active");
    await expect(page.locator('#tabs-fixture .tabs__panel[data-value="overview"]')).toHaveAttribute("data-state", "inactive");
  });

  test("roving tabindex: exactly one tab is tabbable at a time", async ({ page }) => {
    const overview = page.getByRole("tab", { name: "Overview" });
    await expect(overview).toHaveAttribute("tabindex", "0");
    await expect(page.locator('#tabs-fixture .tabs__trigger[tabindex="0"]')).toHaveCount(1);

    await overview.focus();
    await page.keyboard.press("ArrowRight");

    await expect(page.getByRole("tab", { name: "Activity" })).toHaveAttribute("tabindex", "0");
    await expect(overview).toHaveAttribute("tabindex", "-1");
    await expect(page.locator('#tabs-fixture .tabs__trigger[tabindex="0"]')).toHaveCount(1);
  });

  test("Home/End jump to the first and last tab", async ({ page }) => {
    await page.getByRole("tab", { name: "Overview" }).focus();

    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: "Settings" })).toBeFocused();
    await expect(page.getByRole("tab", { name: "Settings" })).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Home");
    await expect(page.getByRole("tab", { name: "Overview" })).toBeFocused();
    await expect(page.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
  });

  test("each tab is wired to its panel (aria-controls/labelledby)", async ({ page }) => {
    const overview = page.getByRole("tab", { name: "Overview" });
    const panel = page.locator('#tabs-fixture .tabs__panel[data-value="overview"]');

    const controls = await overview.getAttribute("aria-controls");
    const panelId = await panel.getAttribute("id");
    expect(controls).toBe(panelId);

    const labelledby = await panel.getAttribute("aria-labelledby");
    const triggerId = await overview.getAttribute("id");
    expect(labelledby).toBe(triggerId);
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
