import { BASE_URL } from '@_config/env.config';
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export const STORAGE_STATE = path.join(__dirname, 'tmp/session.json');
export const RESPONSE_TIMEOUT = 10_000;

export default defineConfig({
  globalSetup: require.resolve('@_config/global.setup'),
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 0,
  workers: undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    actionTimeout: 0,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'health-check',
      testMatch: '*.health.ts',
    },
    {
      name: 'setup',
      testMatch: '*.setup.ts',
      dependencies: ['health-check'],
    },
    {
      name: 'chromium-logged',
      grep: /@logged/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
    },
    {
      name: 'chromium-non-logged',
      grepInvert: /@logged/,
      testDir: 'tests/ui',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['health-check'],
    },
    {
      name: 'api',
      testDir: 'tests/api',
      dependencies: ['health-check'],
    },
  ],
});
