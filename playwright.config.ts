import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end checks against the built static site (`out/`), served with
 * clean URLs like production (Render: /story → story.html).
 *
 * Set E2E_BASE_URL to test an already-running server (e.g. the nginx
 * preview on :8080); otherwise Playwright serves `out/` itself.
 */
const external = process.env.E2E_BASE_URL;
const PORT = 4173;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: external ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    // Measure final rendered states: the site disables its fades under
    // reduced motion, so axe never samples a half-faded element.
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: external
    ? undefined
    : {
        command: `pnpm exec serve out --listen ${PORT} --config ../tests/e2e/serve.json --no-clipboard`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
