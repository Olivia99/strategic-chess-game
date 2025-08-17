import { test, expect } from '@playwright/test';

test.describe('Deployment and Basic Functionality', () => {
  test('homepage loads without 500 errors', async ({ page }) => {
    await page.goto('/');
    
    // Should not have 500 error
    await expect(page).not.toHaveTitle(/500/);
    
    // Check for expected content
    await expect(page.locator('h1')).toContainText('Strategic Chess Game');
    
    // Verify basic navigation elements are present
    await expect(page.locator('a[href="/debug"]')).toBeVisible();
    await expect(page.locator('a[href="/api/health"]')).toBeVisible();
    await expect(page.locator('a[href="/rooms/create"]')).toBeVisible();
  });

  test('debug page loads and shows environment info', async ({ page }) => {
    await page.goto('/debug');
    
    // Check title and main content
    await expect(page.locator('h1')).toContainText('Debug Page');
    await expect(page.locator('text=React Router Working')).toBeVisible();
    await expect(page.locator('text=Environment Check')).toBeVisible();
    
    // Verify test links are present
    await expect(page.locator('a[href="/api/health"]')).toBeVisible();
    await expect(page.locator('a[href="/api/heroes"]')).toBeVisible();
  });

  test('health API returns 200 status', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/health')),
      page.goto('/api/health')
    ]);
    
    expect(response.status()).toBe(200);
    
    const healthData = await response.json();
    expect(healthData).toHaveProperty('status', 'ok');
    expect(healthData).toHaveProperty('timestamp');
    expect(healthData).toHaveProperty('environment');
    expect(healthData).toHaveProperty('database');
  });

  test('heroes API loads without errors', async ({ page }) => {
    await page.goto('/api/heroes');
    
    // Should return JSON response with heroes data
    const content = await page.textContent('body');
    expect(() => JSON.parse(content)).not.toThrow();
    
    const heroesData = JSON.parse(content);
    expect(Array.isArray(heroesData)).toBe(true);
    expect(heroesData.length).toBeGreaterThan(0);
    
    // Verify hero structure
    if (heroesData.length > 0) {
      const hero = heroesData[0];
      expect(hero).toHaveProperty('id');
      expect(hero).toHaveProperty('name');
      expect(hero).toHaveProperty('passive_abilities');
      expect(hero).toHaveProperty('active_abilities');
    }
  });

  test('rooms create page loads', async ({ page }) => {
    await page.goto('/rooms/create');
    
    // Should not return 500 error
    const title = await page.title();
    expect(title).not.toContain('500');
    
    // Basic page structure should be present
    await expect(page.locator('body')).toBeVisible();
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Homepage should still load correctly on mobile
    await expect(page.locator('h1')).toContainText('Strategic Chess Game');
    await expect(page.locator('a[href="/debug"]')).toBeVisible();
  });
});