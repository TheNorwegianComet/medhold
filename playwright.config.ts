import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:4173',
    // The remote environment pre-installs Chromium at a fixed path that may
    // not match this Playwright version's pinned revision.
    launchOptions: process.env.CI ? {} : { executablePath: '/opt/pw-browsers/chromium' },
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
