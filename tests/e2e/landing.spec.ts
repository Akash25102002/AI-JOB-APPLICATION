import { test, expect } from "@playwright/test";

test.describe("JobPilot AI End-to-End Tests", () => {
  test("should load landing page and navigate to dashboard overview", async ({ page }) => {
    // Navigate to local next.js instance URL
    await page.goto("/");

    // Verify Title header brand text is present
    const brand = page.locator("text=JobPilot.AI");
    await expect(brand).toBeVisible();

    // Verify the simulated Agent Execution Console starts correctly
    const simulateButton = page.locator("button:has-text('Execute AI Agent')");
    await expect(simulateButton).toBeVisible();

    // Click navigation trigger to Dashboard
    const startTrialLink = page.locator("a:has-text('Start Free Trial')");
    await expect(startTrialLink).toBeVisible();
    await startTrialLink.click();

    // Verify redirect occurred and dashboard cards exist
    await page.waitForURL("**/dashboard");
    const overviewHeader = page.locator("text=System Command Center");
    await expect(overviewHeader).toBeVisible();
  });
});
