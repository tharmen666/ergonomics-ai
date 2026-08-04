import { test, expect } from '@playwright/test';

test.describe('ErgoSafe Reborn V3 End-to-End Suite', () => {

  async function seedAuthSession(page: any) {
    await page.addInitScript(() => {
      window.localStorage.setItem('tenant-billing-telemetry-storage', JSON.stringify({
        state: {
          companyId: null,
          userId: 'admin',
          isAdmin: true,
          companies: [
            { id: 'COMP-001', name: 'Sovereign Health Ltd', activeSeats: 12 },
            { id: 'COMP-002', name: 'Vanguard Logistics', activeSeats: 45 },
            { id: 'COMP-003', name: 'Apex Financials', activeSeats: 8 }
          ],
          logs: [],
          usage: {}
        },
        version: 0
      }));
    });
  }

  async function ensureSidebarOpen(page: any) {
    const isSidebarVisible = await page.locator('span:has-text("Core System Modules")').isVisible();
    if (!isSidebarVisible) {
      await page.click('button[title="Toggle Sidebar"]');
      await page.waitForTimeout(300);
    }
  }

  test('1. Viewport Responsiveness - Mobile (375x667) and Desktop (1280x800)', async ({ page }) => {
    await seedAuthSession(page);

    // Desktop Viewport Test
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();

    // Mobile Viewport Test
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();
    
    // Toggle Sidebar button on mobile
    const toggleButton = page.locator('button[title="Toggle Sidebar"]');
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    // Verify Sidebar drawer opens
    await expect(page.locator('span:has-text("ErgoSafe Reborn")')).toBeVisible();

    // Close sidebar
    const closeSidebarButton = page.locator('button[aria-label="Close Sidebar"]');
    await closeSidebarButton.click();
  });

  test('2. Sidebar Navigation - All Feature Tabs Mount Valid React Components', async ({ page }) => {
    await seedAuthSession(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const drawerTabs = [
      { name: 'HR & Compliance Dashboard', expectedText: 'Overall Compliance Status' },
      { name: 'Ergonomics Training & Certification', expectedText: 'Professional Curriculum' },
      { name: 'Daily Self-Risk Assessment', expectedText: 'Ergonomic Risk Evaluation' },
      { name: 'Daily Workstation Safety Checklist', expectedText: 'Daily Safety Check' },
      { name: 'Nelly Posture & Hazard Monitoring Engine', expectedText: 'Nelly Posture & Hazard Engine' },
      { name: 'Shandray\'s Prizm Driver & Shift Fatigue Telemetry', expectedText: 'G.E.A.R. SYSTEM DASHBOARD' },
      { name: 'Assessment PDF Invoices & Billing', expectedText: 'Ergonomics Assessment Invoicing' },
      { name: 'Analytics & Regulatory Audit Logs', expectedText: 'Executive Regulatory Audit Dossier' },
    ];

    for (const tab of drawerTabs) {
      await ensureSidebarOpen(page);
      const tabButton = page.locator(`button:has-text("${tab.name}")`);
      await expect(tabButton).toBeVisible();
      await tabButton.click();

      // Verify React component mounts cleanly
      await expect(page.locator(`text=${tab.expectedText}`).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('3. Invoicing Engine - Create Assessment Invoice and Verify 15% SA VAT & PDF Modal', async ({ page }) => {
    await seedAuthSession(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Navigate to Invoices tab via sidebar
    await ensureSidebarOpen(page);
    await page.click('button:has-text("Assessment PDF Invoices & Billing")');
    await expect(page.locator('h1:has-text("Ergonomics Assessment Invoicing")')).toBeVisible();

    // Click GENERATE NEW INVOICE
    await page.click('button:has-text("GENERATE NEW INVOICE")');

    // Fill client name & VAT
    await page.fill('input[placeholder="e.g. Astron Energy"]', 'Playwright Automated Enterprise');
    await page.fill('input[placeholder="e.g. ZA4920192841"]', 'ZA999888777');
    
    // Fill workstations count to 20
    const workstationsInput = page.locator('input[type="number"]').first();
    await workstationsInput.fill('20');

    // Verify calculated VAT (20 * 1250 = 25000 subtotal, VAT 15% = 3750, Total = 28750)
    await expect(page.locator('text=R 25,000.00')).toBeVisible();
    await expect(page.locator('text=R 3,750.00')).toBeVisible();
    await expect(page.locator('text=R 28,750.00')).toBeVisible();

    // Submit invoice
    await page.click('button:has-text("CREATE & PREVIEW TAX INVOICE")');

    // Verify tax invoice preview modal opens
    await expect(page.locator('h3:has-text("TAX INVOICE")')).toBeVisible();
    await expect(page.locator('text=Playwright Automated Enterprise')).toBeVisible();
    await expect(page.locator('button:has-text("PRINT / DOWNLOAD PDF")')).toBeVisible();
  });

  test('4. Nelly AI Accent & 7-Language Selector (en, zu, xh, sw, zh, de, st)', async ({ page }) => {
    await seedAuthSession(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Navigate to Nelly Posture & Hazard Monitoring Engine
    await ensureSidebarOpen(page);
    await page.click('button:has-text("Nelly Posture & Hazard Monitoring Engine")');
    await expect(page.locator('h1:has-text("Nelly Posture & Hazard Engine")')).toBeVisible();

    // Language selector buttons in NellyInterface: en-ZA, zu-ZA, xh-ZA, sw-KE, zh-CN, de-DE, st-ZA
    const languages = [
      { code: 'zu-ZA', textSnippet: 'Sawubona' },
      { code: 'de-DE', textSnippet: 'Hallo, ich bin Nelly' },
      { code: 'xh-ZA', textSnippet: 'Molo' },
      { code: 'sw-KE', textSnippet: 'Hujambo' },
      { code: 'zh-CN', textSnippet: '你好' },
      { code: 'st-ZA', textSnippet: 'Lumela' },
      { code: 'en-ZA', textSnippet: 'Hi, I\'m Nelly' },
    ];

    for (const lang of languages) {
      const langBtn = page.locator(`button:has-text("${lang.code}")`);
      await expect(langBtn).toBeVisible();
      await langBtn.click();

      // Verify UI text snippet updates for selected locale
      await expect(page.locator(`text="${lang.textSnippet}"`).first()).toBeVisible();
    }
  });

});
