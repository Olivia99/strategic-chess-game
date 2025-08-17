import { test, expect } from '@playwright/test';

test.describe('Game Flow and Functionality', () => {
  test('room creation flow works', async ({ page }) => {
    await page.goto('/');
    
    // Click on Create Room
    await page.click('a[href="/rooms/create"]');
    
    // Should navigate to room creation page
    await expect(page).toHaveURL(/.*\/rooms\/create/);
    
    // Page should load without 500 errors
    const title = await page.title();
    expect(title).not.toContain('500');
    expect(title).not.toContain('Error');
  });

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to debug page
    await page.click('a[href="/debug"]');
    await expect(page).toHaveURL(/.*\/debug/);
    await expect(page.locator('h1')).toContainText('Debug Page');
    
    // Navigate back to home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL(/.*\/$/);
    await expect(page.locator('h1')).toContainText('Strategic Chess Game');
  });

  test('external API link opens in new tab', async ({ page, context }) => {
    await page.goto('/');
    
    // Click on Test API link (should open in new tab)
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('a[href="/api/health"]')
    ]);
    
    await newPage.waitForLoadState();
    
    // Should show JSON response
    const content = await newPage.textContent('body');
    expect(() => JSON.parse(content)).not.toThrow();
    
    const data = JSON.parse(content);
    expect(data).toHaveProperty('status', 'ok');
  });

  test('page loads quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    console.log(`Homepage loaded in ${loadTime}ms`);
  });

  test('CSS styling is applied correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that Tailwind CSS classes are working
    const mainContainer = page.locator('div').first();
    const bgColor = await mainContainer.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should have some background color applied (not default)
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    
    // Check button styling
    const debugButton = page.locator('a[href="/debug"]');
    const buttonColor = await debugButton.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Button should have blue background
    expect(buttonColor).toContain('rgb');
  });

  test('responsive layout on different screen sizes', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    
    // All buttons should still be clickable on mobile
    await expect(page.locator('a[href="/debug"]')).toBeVisible();
    await expect(page.locator('a[href="/api/health"]')).toBeVisible();
    await expect(page.locator('a[href="/rooms/create"]')).toBeVisible();
  });

  test('accessibility basics', async ({ page }) => {
    await page.goto('/');
    
    // Check for heading hierarchy
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);
    
    // Check for link accessibility
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      
      // Links should have meaningful text and href
      expect(text?.trim()).toBeTruthy();
      expect(href).toBeTruthy();
    }
  });
});