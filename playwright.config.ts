import { defineConfig, devices } from '@playwright/test';
import dotenv from "dotenv";
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined,
  reporter: [
    ["html"],
    ["allure-playwright"]
  ],
  use: {
    baseURL: process.env.BASE_URL,
    permissions: ['clipboard-read', 'clipboard-write'],
    actionTimeout: 10000
  },
  timeout: 180000,

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});
