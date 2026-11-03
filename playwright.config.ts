import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import {
  resolveHomologationBaseURL,
  resolveLocalBaseURL,
  resolveNewfrontBaseURL,
} from './config/environments';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const newfrontURL = resolveNewfrontBaseURL();
const dockerURL = resolveLocalBaseURL();
const homologationURL = resolveHomologationBaseURL();

const chrome = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1440, height: 900 },
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['junit', { outputFile: 'test-results/e2e-junit.xml' }],
  ],
  use: {
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    serviceWorkers: 'block',
  },
  projects: [
    {
      name: 'vbconnection-docker',
      use: {
        ...chrome,
        baseURL: dockerURL,
      },
    },
    {
      name: 'vbconnection-newfront',
      use: {
        ...chrome,
        baseURL: newfrontURL,
      },
    },
    {
      name: 'vbconnection-hmg',
      use: {
        ...chrome,
        baseURL: homologationURL,
      },
    },
  ],
});
