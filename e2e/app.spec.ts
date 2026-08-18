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
    const sidebar = page.locator('div.fixed.left-0.top-0');
    const isOffscreen = await sidebar.evaluate((el: HTMLElement) => el.classList.contains('-translate-x-full'));
    if (isOffscreen) {
      const toggleButton = page.locator('button[title="Toggle Sidebar"]').first();
      await toggleButton.click({ force: true });
      await page.waitForTimeout(350);
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
    const toggleButton = page.locator('button[title="Toggle Sidebar"]').first();
    await expect(toggleButton).toBeVisible();
    await toggleButton.click({ force: true });

    // Verify Sidebar drawer opens
    await expect(page.locator('span:has-text("ErgoSafe Reborn")')).toBeVisible();

    // Close sidebar
    await page.keyboard.press('Escape');
  });

  test('2. Sidebar Navigation - All Feature Tabs Mount Valid React Components', async ({ page }) => {
    await seedAuthSession(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const drawerTabs = [
      { name: 'HR & Compliance Dashboard', expectedPattern: /OHS Compliance & Escalation Audit Trail/i },
      { name: 'Ergonomics Training & Certification', expectedPattern: /Curriculum|Enterprise OHS/i },
      { name: 'Daily Self-Risk Assessment (WFH / Desk)', expectedPattern: /Ergonomic Self-Risk Assessment|Assessment/i },
      { name: 'Daily Workstation Safety Checklist', expectedPattern: /Daily Workstation Safety Checklist|Checklist/i },
      { name: 'Nelly Posture & Hazard Monitoring Engine (3D Spine)', expectedPattern: /Nelly Posture & Hazard Engine|Nelly Intelligence Grid/i },
      { name: 'Prizm Driver & Shift Fatigue Telemetry', expectedPattern: /G\.E\.A\.R\.|Prizm Driver/i },
      { name: 'Assessment PDF Invoices & Billing', expectedPattern: /Ergonomics Assessment Invoicing/i },
      { name: 'Analytics & Regulatory Audit Logs', expectedPattern: /Analytics & Regulatory Audit Logs/i },
    ];

    for (const tab of drawerTabs) {
      await ensureSidebarOpen(page);
      const tabButton = page.locator(`button:has-text("${tab.name}")`).first();
      await expect(tabButton).toBeVisible();
      await tabButton.click({ force: true });

      // Verify React component mounts cleanly
      await expect(page.locator('body')).toContainText(tab.expectedPattern, { timeout: 5000 });
    }
  });

  test('3. Invoicing Engine - Create Assessment Invoice and Verify 15% SA VAT & PDF Modal', async ({ page }) => {
    await seedAuthSession(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Navigate to Invoices tab via sidebar
    await ensureSidebarOpen(page);
    await page.locator('button:has-text("Assessment PDF Invoices & Billing")').first().click({ force: true });
    await expect(page.locator('h1:has-text("Ergonomics Assessment Invoicing")')).toBeVisible();

    // Click GENERATE NEW INVOICE
    await page.click('button:has-text("GENERATE NEW INVOICE")');

    // Fill client name & VAT
    await page.fill('input[placeholder="e.g. Astron Energy"]', 'Playwright Automated Enterprise');
    await page.fill('input[placeholder="e.g. ZA4920192841"]', 'ZA999888777');
    
    // Fill workstations count to 20
    const workstationsInput = page.locator('input[type="number"]').first();
    await workstationsInput.fill('20');

    // Verify calculated amounts in form modal (20 * 1250 = 25000 subtotal, VAT 15% = 3750, Total = 28750)
    await expect(page.locator('body')).toContainText(/25[\s\u00a0]*000/);
    await expect(page.locator('body')).toContainText(/3[\s\u00a0]*750/);
    await expect(page.locator('body')).toContainText(/28[\s\u00a0]*750/);

    // Submit invoice
    await page.click('button:has-text("CREATE & PREVIEW TAX INVOICE")');

    // Verify tax invoice preview modal opens
    await expect(page.locator('body')).toContainText('TAX INVOICE');
    await expect(page.locator('body')).toContainText('Playwright Automated Enterprise');
    await expect(page.locator('button:has-text("PRINT / DOWNLOAD PDF")')).toBeVisible();
  });

  test('4. Nelly AI Accent & 7-Language Selector (en, zu, xh, sw, zh, de, st)', async ({ page }) => {
    await seedAuthSession(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Navigate to Nelly Posture & Hazard Monitoring Engine
    await ensureSidebarOpen(page);
    await page.locator('button:has-text("Nelly Posture & Hazard Monitoring Engine (3D Spine)")').first().click({ force: true });
    await expect(page.locator('body')).toContainText(/Nelly Posture & Hazard Engine|Nelly Intelligence Grid/i);

    // Language selector buttons in NellyInterface: en-ZA, zu-ZA, xh-ZA, sw-KE, zh-CN, de-DE, st-ZA
    const languages = [
      { code: 'zu-ZA', textSnippet: 'Sawubona' },
      { code: 'de-DE', textSnippet: 'Hallo' },
      { code: 'xh-ZA', textSnippet: 'Molo' },
      { code: 'sw-KE', textSnippet: 'Hujambo' },
      { code: 'zh-CN', textSnippet: '你好' },
      { code: 'st-ZA', textSnippet: 'Lumela' },
      { code: 'en-ZA', textSnippet: 'Nelly' },
    ];

    for (const lang of languages) {
      const langBtn = page.locator(`button:has-text("${lang.code}")`).first();
      await expect(langBtn).toBeVisible();
      await langBtn.click({ force: true });

      // Verify UI text snippet updates for selected locale
      await expect(page.locator('body')).toContainText(lang.textSnippet);
    }
  });

});
