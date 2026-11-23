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
    const sidebar = page.locator('div.fixed.left-0.top-0').first();
    await expect(sidebar).toBeAttached();
    const isOffscreen = await sidebar.evaluate((el: HTMLElement) => el.classList.contains('-translate-x-full'));
    if (isOffscreen) {
      const toggleButton = page.getByRole('button', { name: 'Toggle Sidebar' }).first();
      await toggleButton.click();
      await expect(sidebar).not.toHaveClass(/-translate-x-full/);
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
      { name: 'GN R1589 Statutory Assessment Workspaces', expectedPattern: /Statutory Assessment Workspaces|Ergonomic Self-Risk Assessment|Assessment/i },
      { name: 'Daily Workstation Safety Checklist', expectedPattern: /Daily Workstation Safety Checklist|Checklist/i },
      { name: 'Nelly Posture & Hazard Monitoring Engine (3D Spine)', expectedPattern: /Nelly Posture & Hazard Engine|Nelly Intelligence Grid/i },
      { name: 'Biomechanical Calculators (REBA/RULA/NIOSH/WBGT)', expectedPattern: /Biomechanical Calculators|REBA|RULA/i },
      { name: 'Assessment PDF Invoices & Billing', expectedPattern: /Ergonomics Assessment Invoicing/i },
      { name: 'Analytics & Regulatory Audit Logs', expectedPattern: /Analytics & Regulatory Audit Logs/i },
    ];

    for (const tab of drawerTabs) {
      await ensureSidebarOpen(page);
      const tabButton = page.locator(`button:has-text("${tab.name}")`).first();
      await expect(tabButton).toBeVisible();
      await tabButton.scrollIntoViewIfNeeded();
      await tabButton.evaluate((el: HTMLElement) => el.click());

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
    const invoiceBtn = page.locator('button:has-text("Assessment PDF Invoices & Billing")').first();
    await invoiceBtn.scrollIntoViewIfNeeded();
    await invoiceBtn.evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('h1:has-text("Ergonomics Assessment Invoicing")')).toBeVisible();

    // Click GENERATE NEW INVOICE
    await page.click('button:has-text("GENERATE NEW INVOICE")');

    // Fill client name & VAT
    await page.fill('input[placeholder="e.g. ErgoSafe Enterprise"]', 'Playwright Automated Enterprise');
    await page.fill('input[placeholder="e.g. ZA4920192841"]', 'ZA999888777');
    
    // Fill workstations count to 20
    const workstationsInput = page.locator('input[type="number"]').first();
    await workstationsInput.fill('20');

    // Verify calculated amounts in form modal (accepts "25 000" (en-ZA) and "25,000" (en-US) grouping) (20 * 1250 = 25000 subtotal, VAT 15% = 3750, Total = 28750)
    await expect(page.locator('body')).toContainText(/25[\s\u00a0,]*000/);
    await expect(page.locator('body')).toContainText(/3[\s\u00a0,]*750/);
    await expect(page.locator('body')).toContainText(/28[\s\u00a0,]*750/);

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
    const nellyBtn = page.locator('button:has-text("Nelly Posture & Hazard Monitoring Engine (3D Spine)")').first();
    await nellyBtn.scrollIntoViewIfNeeded();
    await nellyBtn.evaluate((el: HTMLElement) => el.click());
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
      await langBtn.scrollIntoViewIfNeeded();
      await langBtn.evaluate((el: HTMLElement) => el.click());

      // Verify UI text snippet updates for selected locale
      await expect(page.locator('body')).toContainText(lang.textSnippet);
    }
  });

  test('5. 2-Min Executive Demo Modal, HTTP 206 Byte-Range Streaming & 375px Mobile Viewport', async ({ page, request }) => {
    await seedAuthSession(page);

    // Verify HTTP 206 byte-range streaming on /demo/ergosafe-reborn-2min-demo.mp4
    const rangeRes = await request.get('/demo/ergosafe-reborn-2min-demo.mp4', {
      headers: { Range: 'bytes=0-1023' }
    });
    expect(rangeRes.status()).toBe(206);
    expect(rangeRes.headers()['accept-ranges']).toBe('bytes');
    expect(rangeRes.headers()['content-type']).toContain('video/mp4');

    // Mobile 375px viewport modal launch & Escape close
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const demoBtn = page.locator('button:has-text("Watch 2-Min Executive Demo"):visible').first();
    await expect(demoBtn).toBeVisible();
    await demoBtn.click();

    const modalDialog = page.locator('[role="dialog"][aria-label*="2-Minute Executive Demo"]');
    await expect(modalDialog).toBeVisible();
    const videoEl = modalDialog.locator('video[src="/demo/ergosafe-reborn-2min-demo.mp4"]');
    await expect(videoEl).toBeVisible();
    await expect(videoEl).toHaveAttribute('preload', 'metadata');

    await page.keyboard.press('Escape');
    await expect(modalDialog).toBeHidden();
  });

  async function seedPrivacyAcceptedSession(page: any) {
    await seedAuthSession(page);
    await page.addInitScript(() => {
      window.localStorage.setItem('popiHandshakeAccepted', 'true');
      window.localStorage.setItem('ergo_privacy_consent_verified', 'true');
    });
  }

  test('6. Desktop (1440x900) & Mobile (375x667) Zero Console/Page Errors and Zero Horizontal Overflow', async ({ page }) => {
    test.setTimeout(60000);
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    await seedPrivacyAcceptedSession(page);

    const routes = [
      { label: 'Stewardship Overview', expectPattern: /STATUTORY SAFETY COMMAND CENTRE/i },
      { label: 'Trust & Enterprise Licensing', expectPattern: /Enterprise Trust Center|Run Live Verification Diagnostics/i },
      { label: 'Statutory Risk & Governance (GN R1589)', expectPattern: /Statutory Ergonomic Risk Register/i },
      { label: 'GN R1589 Statutory Assessment Workspaces', expectPattern: /STATUTORY ERGONOMIC ASSESSMENT SUITE/i },
      { label: 'Nelly Posture & Hazard Monitoring Engine (3D Spine)', expectPattern: /Nelly Posture & Hazard Engine/i },
    ];

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 375, height: 667 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();
      for (const route of routes) {
        await ensureSidebarOpen(page);
        const btn = page.locator('div.fixed.left-0.top-0').getByRole('button', { name: route.label, exact: true });
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        await expect(page.locator('main')).toContainText(route.expectPattern, { timeout: 10000 });

        if (viewport.width === 375) {
          const overflow = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          }));
          expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth + 2);
        }
      }
    }

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test('7. POPIA Section 18 Camera Consent Gate Blocks getUserMedia Until Accepted & Supports Manual Fallback', async ({ page }) => {
    await seedPrivacyAcceptedSession(page);
    await page.addInitScript(() => {
      (window as any).__getUserMediaCalls = 0;
      const mockStream = {
        getTracks: () => [{ stop: () => {} }],
      };
      Object.defineProperty(navigator, 'mediaDevices', {
        configurable: true,
        value: {
          getUserMedia: async () => {
            (window as any).__getUserMediaCalls += 1;
            return mockStream;
          },
        },
      });
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Open Live Monitor modal (autoStart=true, must STILL be blocked by POPIA Consent Gate)
    await page.locator('button:has-text("LIVE MONITOR")').first().click();
    const consentGate = page.getByTestId('popia-camera-consent-gate');
    await expect(consentGate).toBeVisible({ timeout: 10000 });
    await expect(consentGate).toContainText(/zero facial recognition/i);
    await expect(consentGate).toContainText(/Competent Person/i);

    // Camera must NOT have been called prior to explicit consent
    expect(await page.evaluate(() => (window as any).__getUserMediaCalls)).toBe(0);

    // Continue Without Camera -> Manual Ergonomic Assessment Mode
    await page.getByRole('button', { name: /Continue Without Camera \(Manual Ergonomic Assessment Mode\)/i }).click();
    await expect(page.getByTestId('manual-ergonomic-mode')).toBeVisible();
    expect(await page.evaluate(() => (window as any).__getUserMediaCalls)).toBe(0);

    // Switch back to Consent Gate and Accept Camera
    await page.getByRole('button', { name: /Opt In to Local Camera/i }).click();
    await expect(consentGate).toBeVisible();
    await page.getByRole('button', { name: /Accept & Enable Local Camera/i }).click();

    const storedConsent = await page.evaluate(() => {
      const raw = window.localStorage.getItem('ergosafe_popia_s18_camera_consent');
      return raw ? JSON.parse(raw) : null;
    });
    expect(storedConsent?.accepted).toBe(true);
    expect(storedConsent?.mode).toBe('camera');
    await expect.poll(async () => page.evaluate(() => (window as any).__getUserMediaCalls)).toBeGreaterThanOrEqual(1);
  });

  test('8. Enterprise Trust Center Diagnostics, Honest Procurement Matrix & POPIA Data Subject Wipe', async ({ page }) => {
    await seedPrivacyAcceptedSession(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();

    await ensureSidebarOpen(page);
    await page.locator('div.fixed.left-0.top-0').getByRole('button', { name: 'Trust & Enterprise Licensing', exact: true }).click();
    await expect(page.getByTestId('run-diagnostics-btn')).toBeVisible({ timeout: 10000 });

    // No fake certification claims
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/SOC 2 Certified|ISO 27001 Certified|100% Legally Compliant/i);
    expect(bodyText).toContain('Available in Enterprise Licensing Tier');

    // Run 5 live verification diagnostics
    await page.getByTestId('run-diagnostics-btn').click();
    for (let i = 0; i < 5; i++) {
      const card = page.getByTestId(`diagnostic-result-${i}`);
      await expect(card).toBeVisible({ timeout: 10000 });
      await expect(card).toContainText('PASS');
    }

    // Verify AI Governance Card is visible
    await expect(page.getByTestId('ai-governance-card')).toBeVisible();

    // Verify POPIA Data Subject Panel inspect & wipe
    const dataPanel = page.getByTestId('popia-data-subject-panel');
    await expect(dataPanel).toBeVisible();
    await page.evaluate(() => {
      window.localStorage.setItem('ergosafe_test_sample_key', 'sample-ergonomic-record');
    });
    await page.getByTestId('wipe-local-data-btn').click();
    expect(await page.evaluate(() => window.localStorage.getItem('ergosafe_test_sample_key'))).toBeNull();
  });

  test('9. Statutory Ergonomics Workflow: Hierarchy Gate, PPE Warning, Reg 8(2) Consent & SHA-256 Archive', async ({ page }) => {
    await seedPrivacyAcceptedSession(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();

    await ensureSidebarOpen(page);
    await page.locator('div.fixed.left-0.top-0').getByRole('button', { name: 'Statutory Risk & Governance (GN R1589)', exact: true }).click();
    await expect(page.getByTestId('record-task-assessment-btn')).toBeVisible({ timeout: 10000 });

    // Record a new high-risk RULA task (max out sliders/inputs or submit default/high task)
    await page.getByLabel(/Task Name/i).fill('Cold Room Case Stacking Audit');
    await page.getByLabel(/Department/i).fill('Logistics Dispatch');
    await page.getByTestId('record-task-assessment-btn').click();

    // Verify 24-month reassessment due date is rendered and "Mark Hazard Controlled" is blocked when 0 controls exist
    await expect(page.locator('body')).toContainText(/24-Month/i);
    const markControlledBtn = page.getByTestId('mark-controlled-btn');
    await expect(markControlledBtn).toBeDisabled();

    // Add PPE-only control -> verify Training/PPE-only warning appears
    await page.getByLabel('Control Hierarchy Tier').selectOption('PPE');
    await page.getByLabel('Control Description').fill('Thermal grip gloves issued');
    await page.getByTestId('add-control-btn').click();
    await expect(page.getByTestId('ppe-only-warning')).toBeVisible();

    // Add higher-order Engineering control -> warning clears & Mark Hazard Controlled works
    await page.getByLabel('Control Hierarchy Tier').selectOption('Engineering');
    await page.getByLabel('Control Description').fill('Install hydraulic scissor-lift palletizer');
    await page.getByTestId('add-control-btn').click();
    await expect(page.getByTestId('ppe-only-warning')).toBeHidden();
    await expect(markControlledBtn).toBeEnabled();
    await markControlledBtn.click();

    // Toggle Reg 8(2) Medical Surveillance Referral -> written consent warning appears
    await page.getByTestId('reg8-referral-toggle').check();
    await expect(page.getByTestId('reg8-consent-warning')).toBeVisible();

    // Generate SHA-256 Sealed Archive -> 64-char hex digest & retention tiers
    await page.getByTestId('generate-archive-btn').click();
    const digestEl = page.getByTestId('sha256-archive-digest');
    await expect(digestEl).toBeVisible();
    const digestText = (await digestEl.innerText()).trim();
    expect(digestText).toMatch(/[a-f0-9]{64}/i);
    await expect(page.locator('body')).toContainText('40 Years');
    await expect(page.locator('body')).toContainText('3 Years');
    await expect(page.locator('body')).toContainText('Duration of Employment');
  });

  test('10. Frictionless Direct Landing (No Login Wall), Docked Desktop Sidebar & Workspace Switcher on 1366x768 & 1920x1080', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('popiHandshakeAccepted', 'true');
      window.localStorage.setItem('ergo_privacy_consent_verified', 'true');
    });

    for (const viewport of [
      { width: 1366, height: 768 },
      { width: 1920, height: 1080 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      // Immediately lands inside live Command Workspace without blocking login wall
      await expect(page.getByText(/Demo login \(no real authentication\)/i)).toHaveCount(0);
      await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();
      await expect(page.locator('main')).toContainText('STATUTORY SAFETY COMMAND CENTRE');

      // Docked desktop sidebar is immediately visible with all core modules
      const sidebar = page.locator('div.fixed.left-0.top-0').first();
      await expect(sidebar).not.toHaveClass(/-translate-x-full/);
      await expect(sidebar).toContainText('Sovereign Health Ltd');

      const coreSidebarLabels = [
        'Nelly Posture & Hazard Monitoring Engine (3D Spine)',
        'Ergonomics Training & Certification',
        'Smart Break & Mobility Engine',
        'Statutory Risk & Governance (GN R1589)',
        'Prizm Fatigue & Shift Checks',
        'Trust & Enterprise Licensing',
      ];
      for (const label of coreSidebarLabels) {
        await expect(sidebar.getByRole('button', { name: label, exact: true })).toBeVisible();
      }

      // Header Watch 2-Min Executive Demo & Workspace Switcher are visible and not clipped
      const demoBtn = page.locator('header button:has-text("Watch 2-Min Executive Demo"):visible').first();
      const switcherBtn = page.getByTestId('workspace-switcher-btn');
      await expect(demoBtn).toBeVisible();
      await expect(switcherBtn).toBeVisible();

      const demoBox = await demoBtn.boundingBox();
      const switcherBox = await switcherBtn.boundingBox();
      expect(demoBox).not.toBeNull();
      expect(switcherBox).not.toBeNull();
      expect(demoBox!.x + demoBox!.width).toBeLessThanOrEqual(viewport.width);
      expect(switcherBox!.x + switcherBox!.width).toBeLessThanOrEqual(viewport.width);
      expect(demoBox!.y).toBeGreaterThanOrEqual(0);
      expect(switcherBox!.y).toBeGreaterThanOrEqual(0);

      // 1-Click Core Command Grid is visible
      await expect(page.getByTestId('core-command-grid')).toBeVisible();

      // Workspace Switcher modal opens & closes cleanly via Escape
      await switcherBtn.click();
      const switcherDialog = page.locator('[role="dialog"][aria-label="Workspace Switcher"]');
      await expect(switcherDialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(switcherDialog).toBeHidden();
    }
  });

});
