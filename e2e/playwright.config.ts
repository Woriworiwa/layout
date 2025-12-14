import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4300';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src/tests' }),

  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: '../dist/.playwright/e2e/html' }],
    ['json', { outputFile: '../dist/.playwright/e2e/results.json' }],
    ['list']
  ],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  webServer: {
    command: process.env['CI']
      ? 'npx serve dist/browser -p 4200'
      : 'npx nx run layout:serve',
    url: process.env['CI'] ? 'http://localhost:4200' : 'http://localhost:4300',
    reuseExistingServer: !process.env['CI'],
    cwd: workspaceRoot,
    timeout: 120 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
