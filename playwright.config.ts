import { defineConfig, devices } from '@playwright/test';
import { OrtoniReportConfig } from "ortoni-report";
import * as os from "os";
const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? "never" : "always",
  folderPath: "my-report",
  filename: "Ally Portal.html",
  title: "Ally Portal UI Test Report",
  showProject: false,
  projectName: "Ally Portal",
  testType: "E2E-Functional",
  authorName: os.userInfo().username,
  base64Image: false,

  // Branding
 // logo: "AndDone.png",
  headerText: "Ally Portal UI Automation Report",  // custom property
  //customCss: "custom.css",
logo: "./assets/AllyLogoDark.svg",


  // Enables clickable dashboard
  stdIO: true,

  meta: {
    "Test Cycle": "AN_ALMGMT_V12",
    Environment: process.env.NODE_ENV || "Local",
    version: "1",
    release: "V12",
    platform: os.type(),
  },
} as any;  // <-- bypass TypeScript type checking for headerText


  


export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Required for Ortoni to read test artifacts
  outputDir: "test-results",

  //  Existing HTML report + Allure added
  // reporter: [
    
  //  // ["ortoni-report", reportConfig],
  //  ['html']   
  //                   // existing
        
  // ],
  reporter: [
  ["ortoni-report", reportConfig],
  //['html', { outputFolder: 'playwright-report', open: 'never' }]
],

  use: {
    trace: 'on-first-retry',
    viewport: null,
    // optional but useful for Allure:
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Ally_chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },

    // Edge project kept commented as you had it
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',
    //     viewport: null,
    //     deviceScaleFactor: undefined,
    //     launchOptions: {
    //       args: ['--start-maximized'],
    //     },
    //   },
    // },
  ],
});
