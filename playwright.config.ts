import { defineConfig, devices } from '@playwright/test'

// E2E runs against the Vite dev server wired to the LOCAL Supabase stack (see docs/CHECKPOINT.md).
// Uses the installed Microsoft Edge (channel msedge) so no browser download is needed on Windows ARM64.
export default defineConfig({
  testDir: 'e2e',
  // `CAPTURE=1 npx playwright test` runs only the screenshot helper instead of the test suite.
  testMatch: process.env.CAPTURE ? '**/*.capture.ts' : '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    channel: 'msedge',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Edge'], channel: 'msedge', viewport: { width: 1366, height: 900 } } },
    { name: 'mobile', use: { channel: 'msedge', viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
