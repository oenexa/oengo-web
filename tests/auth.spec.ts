import { test, expect } from '@playwright/test';

test('has title and can navigate to login', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Oengo/i);

  // Click the login link.
  await page.getByRole('link', { name: 'Login' }).click();

  // Expects the URL to contain login.
  await expect(page).toHaveURL(/.*login/);
});

test('user can fill in registration form', async ({ page }) => {
  await page.goto('/register');
  
  // Fill the form
  await page.fill('input[type="text"]', 'E2E Test User');
  await page.fill('input[type="email"]', 'e2e@example.com');
  await page.fill('input[type="password"]', 'SecurePass123!');
  await page.selectOption('select', 'CUSTOMER');
  
  // Submit the registration
  // We won't actually click submit in the base test to avoid polluting the DB unless it's a sandbox
  // await page.getByRole('button', { name: 'Register' }).click();
  
  await expect(page.locator('button:has-text("Register")')).toBeVisible();
});
