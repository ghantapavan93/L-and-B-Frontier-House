import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests run against the REAL PRODUCTION BUILD, never the dev server.
 *
 * That matters here more than usual: the properties under test — static prerendering,
 * `private, no-store` on authorised routes, byte-identical public output, the production
 * session-secret guard — only exist in a production build. A dev-server pass would prove
 * none of them.
 */

const PORT = 3210
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: 0,
  workers: 1,
  reporter: process.env['CI'] ? [['list']] : [['list']],
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      // Anti-aliasing and system-font fallbacks vary by a pixel or two between runs.
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: BASE_URL,
    /*
      Never reuse a server between runs.

      The fixture adapter holds draft and submitted orders in the server process, so a reused
      process carries state from the previous run: order history grows, and the visual
      baselines for the passport and order history drift. A fresh process per run is the only
      way these suites are deterministic. `00-visual-regression.spec.ts` is named to sort
      first for the same reason — it captures the pristine state.
    */
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      NODE_ENV: 'production',
      LB_SESSION_SECRET: 'browser-test-secret',
      LB_SITE_URL: BASE_URL,
    },
  },
})
