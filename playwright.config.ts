import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3001',
    video: 'on',
    screenshot: 'on',
    viewport: { width: 1400, height: 900 },
    launchOptions: {
      slowMo: 800,
    },
  },
  outputDir: './test-results',
});
