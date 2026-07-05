import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "../helpers/axe";

// Tier-2 keyboard contract for the carousel (RELEASE-READINESS.md §5). Isolated same-origin fixture
// (tests/fixtures/carousel.html), autoplay off for determinism. Contract: prev/next are native
// <button>s (Enter/Space/click advance); the root has tabindex="0" and ArrowLeft/Right + Home/End
// navigate when it is focused. The active slide is tracked by the active indicator dot
// (aria-current="true"). Slides carry no per-slide active attribute, so assert on the dot.

test.describe("carousel — keyboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/carousel.html");
  });

  test("Next control advances the active slide", async ({ page }) => {
    await expect(page.locator("#carousel-dot-1")).toHaveAttribute("aria-current", "true");
    await page.locator("#carousel-next").click();
    await expect(page.locator("#carousel-dot-2")).toHaveAttribute("aria-current", "true");
    await expect(page.locator("#carousel-dot-1")).not.toHaveAttribute("aria-current", "true");
  });

  test("Arrow keys navigate when the carousel is focused", async ({ page }) => {
    await page.locator("#carousel-basic").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#carousel-dot-2")).toHaveAttribute("aria-current", "true");

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#carousel-dot-1")).toHaveAttribute("aria-current", "true");

    await page.keyboard.press("End");
    await expect(page.locator("#carousel-dot-3")).toHaveAttribute("aria-current", "true");

    await page.keyboard.press("Home");
    await expect(page.locator("#carousel-dot-1")).toHaveAttribute("aria-current", "true");
  });

  test("static a11y: no axe violations", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});

// Screen-reader affordances (RELEASE-READINESS.md §6.5, advisory items now fixed):
//   1. Off-screen slides are removed from the a11y tree (aria-hidden) AND the tab order (inert),
//      so a reader only reaches the visible slide and can't Tab into hidden content.
//   2. A visually-hidden polite live region names the active slide on change — but stays silent
//      during autoplay (this fixture has autoplay off, so every change announces).
test.describe("carousel — screen reader", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/fixtures/carousel.html");
  });

  test("off-screen slides are aria-hidden + inert; the visible one is exposed", async ({ page }) => {
    const s1 = page.locator("#carousel-slide-1");
    const s2 = page.locator("#carousel-slide-2");

    // On load slide 1 is in view; 2 and 3 are hidden from AT and out of the tab order.
    await expect(s1).not.toHaveAttribute("aria-hidden", "true");
    await expect(s1).not.toHaveAttribute("inert", "");
    await expect(s2).toHaveAttribute("aria-hidden", "true");
    await expect(s2).toHaveAttribute("inert", "");

    // Visibility tracks the active slide after advancing.
    await page.locator("#carousel-next").click();
    await expect(s2).not.toHaveAttribute("aria-hidden", "true");
    await expect(s2).not.toHaveAttribute("inert", "");
    await expect(s1).toHaveAttribute("aria-hidden", "true");
    await expect(s1).toHaveAttribute("inert", "");
  });

  test("polite live region names the current slide on change, silent on load", async ({ page }) => {
    const live = page.locator("[data-stisla-carousel-live]");
    await expect(live).toHaveAttribute("aria-live", "polite");
    await expect(live).toBeEmpty(); // no announcement on initial render

    await page.locator("#carousel-next").click();
    await expect(live).toHaveText("Slide 2 of 3");

    await page.locator("#carousel-prev").click();
    await expect(live).toHaveText("Slide 1 of 3");
  });
});

// Embla animates the track transform in JS, so a CSS `prefers-reduced-motion` query can't flatten
// the slide the way it does for the pure-CSS components. carousel.js reads the query and, on change,
// re-inits Embla with duration 0 (instant jump) and stops the autoplay timer. These specs lock in
// both the initial read (constructed under reduced motion) and the live OS toggle (the reported bug:
// the carousel used to cache the value once and needed a reload). We read the effective Embla
// `duration` and the cached `_reducedMotion` flag via the instance exposed on window.Stisla.get().
test.describe("carousel — reduced motion", () => {
  const duration = (page) =>
    page.evaluate(
      () =>
        (window as any).Stisla.get(document.getElementById("carousel-basic"))._normalizeEmblaOpts()
          .duration,
    );
  const isReduced = (page) =>
    page.evaluate(
      () => (window as any).Stisla.get(document.getElementById("carousel-basic"))._reducedMotion,
    );

  test("constructed under reduced motion: slides jump instantly", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/tests/fixtures/carousel.html");

    expect(await isReduced(page)).toBe(true);
    expect(await duration(page)).toBe(0);

    // Behavioural proof: the track reaches its settled transform within a frame — no easing between
    // the early sample and the fully-settled one (they'd differ while an animation is in flight).
    const { early, late } = await page.evaluate(async () => {
      const el = document.getElementById("carousel-basic");
      const track = el.querySelector(".carousel__track") as HTMLElement;
      (window as any).Stisla.get(el)._embla.scrollNext();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const early = getComputedStyle(track).transform;
      await new Promise((r) => setTimeout(r, 300));
      const late = getComputedStyle(track).transform;
      return { early, late };
    });
    expect(early).toBe(late);
    await expect(page.locator("#carousel-dot-2")).toHaveAttribute("aria-current", "true");
  });

  // Playwright's emulateMedia updates matchMedia().matches but only Firefox emits the MQL 'change'
  // event (chromium/webkit don't — a documented CDP limitation; a real OS toggle does fire it). So we
  // pair emulateMedia (the setting changed) with an explicit MediaQueryListEvent on the carousel's OWN
  // query object — which also proves the listener is bound to it — to drive the change path everywhere.
  const toggleReducedMotion = (page, reduce) =>
    page.evaluate((matches) => {
      const inst = (window as any).Stisla.get(document.getElementById("carousel-basic"));
      inst._reducedMotionMql.dispatchEvent(
        new MediaQueryListEvent("change", { matches, media: "(prefers-reduced-motion: reduce)" }),
      );
    }, reduce);

  test("reacts to a live reduced-motion toggle without reload", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/tests/fixtures/carousel.html");

    expect(await isReduced(page)).toBe(false);
    expect(await duration(page)).toBe(25);

    // Toggle ON — the change listener flips the cached flag and re-inits Embla to the instant jump.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await toggleReducedMotion(page, true);
    expect(await isReduced(page)).toBe(true);
    expect(await duration(page)).toBe(0);

    // Toggle back OFF — easing returns, no reload.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await toggleReducedMotion(page, false);
    expect(await isReduced(page)).toBe(false);
    expect(await duration(page)).toBe(25);
  });
});
