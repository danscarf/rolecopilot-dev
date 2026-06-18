import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3001',
    video: 'on',
    screenshot: 'on',
  },
  outputDir: './test-results',
});
