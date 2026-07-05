import { defineConfig, devices } from "@playwright/test";

// Release-readiness test harness — see RELEASE-READINESS.md.
// Drives a11y (axe) + keyboard specs against ISOLATED same-origin fixtures under tests/fixtures/
// (the Bootstrap model — not the docs site). Cross-browser projects are the Stable gate;
// `test:rc` runs Chromium only.
//
// The webServer is a tiny static server (scripts/serve-fixtures.mjs) over the repo root, so a
// fixture can link the BUILT bundles (/packages/*/dist) same-origin. Bound to IPv4 127.0.0.1 so
// Playwright's healthcheck address family matches (vite's IPv6-only localhost bit us once — see
// git history). Prereq: `pnpm build:packages` (fixtures reference dist/, which is gitignored).
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:5273",
    trace: "on-first-retry",
  },
  webServer: {
    command: "node scripts/serve-fixtures.mjs",
    url: "http://127.0.0.1:5273/tests/fixtures/dialog.html",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } }, // WebKit = Safari proxy
  ],
});
