const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  timeout: 60000,

  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    screenshot: 'on',
    video: 'on',
    trace: 'on',
    actionTimeout: 30000,
    navigationTimeout: 30000,
    launchOptions: {
      slowMo: 1500,
    },
  },

  workers: 1,

  reporter: [
    ['list'],
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
  ],

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
};

module.exports = config;


