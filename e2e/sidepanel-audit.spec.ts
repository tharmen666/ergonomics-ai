import { test, expect, Page } from '@playwright/test';
import { seedSession, openTab } from './support/ui';

const DESKTOP_SIDEBAR_LABELS = [
  'Stewardship Overview',
  'Nelly Posture & Hazard Monitoring Engine (3D Spine)',
  'Statutory Risk & Governance (GN R1589)',
  'Ergonomics Training & Certification',
  'Smart Break & Mobility Engine',
  'Prizm Fatigue & Shift Checks',
  'Trust & Enterprise Licensing',
  'GN R1589 Statutory Assessment Workspaces',
  'Biomechanical Calculators (REBA/RULA/NIOSH/WBGT)',
  'Ergonomics Cognitive Handshake',
  'Ground-Zero Human Co-Pilot Companion',
  'Organic SOP & ISO 45001 Generator',
  'Daily Workstation Safety Checklist',
  'HR & Compliance Dashboard',
  'Risky Behaviours Monitoring',
  'Assessment PDF Invoices & Billing',
  'Analytics & Regulatory Audit Logs',
  'Master Admin Portal',
];

async function assertContentPopulated(page: Page, locator = page.getByTestId('active-tab-content')) {
  await expect(locator).toBeVisible({ timeout: 10000 });
  await expect.poll(async () => {
    const text = (await locator.innerText()).trim();
    return text.includes('Loading Module...') ? 0 : text.length;
  }, { timeout: 10000 }).toBeGreaterThan(50);

  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThan(200);
}

test.describe('Side Panel & Drawer Blank-State Audit (All Tabs & Sub-Views)', () => {
  test('1. Desktop (1280x800): Every sidebar navigation tab renders non-blank content (>50 chars, >200px height, 0 errors)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`CONSOLE_ERROR: ${msg.text()}`);
      }
    });

    await seedSession(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const sidebarDrawer = page.getByTestId('sidebar-drawer');
    await expect(sidebarDrawer).toBeVisible();
    const sidebarBox = await sidebarDrawer.boundingBox();
    expect(sidebarBox).not.toBeNull();
    expect(sidebarBox!.height).toBeGreaterThan(200);

    const navButtons = page.getByTestId('sidebar-nav').locator('button');
    const buttonCount = await navButtons.count();
    expect(buttonCount).toBe(DESKTOP_SIDEBAR_LABELS.length);

    for (const label of DESKTOP_SIDEBAR_LABELS) {
      await openTab(page, label);
      await assertContentPopulated(page);
    }

    expect(errors).toEqual([]);
  });

  test('2. Mobile (360x640): Slide-over sidebar drawer scrolls and switches tabs with zero blank screens or collapsed height', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`CONSOLE_ERROR: ${msg.text()}`);
      }
    });

    await seedSession(page);
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');

    const mobileTabs = [
      'Stewardship Overview',
      'Nelly Posture & Hazard Monitoring Engine (3D Spine)',
      'GN R1589 Statutory Assessment Workspaces',
      'Biomechanical Calculators (REBA/RULA/NIOSH/WBGT)',
      'Ground-Zero Human Co-Pilot Companion',
      'HR & Compliance Dashboard',
      'Analytics & Regulatory Audit Logs',
    ];

    for (const label of mobileTabs) {
      await openTab(page, label);
      await assertContentPopulated(page);
    }

    expect(errors).toEqual([]);
  });

  test('3. Nested sub-views, Inline/Floating Nelly Side Panels & HR Slide-Over Drawer all render live content with male advisor & LukeNeural voice', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`CONSOLE_ERROR: ${msg.text()}`);
      }
    });

    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = function () {
        return Promise.resolve();
      };
    });

    await seedSession(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // A. Assessment workspaces & all 4 Biomechanical Calculators
    await openTab(page, 'GN R1589 Statutory Assessment Workspaces');
    await assertContentPopulated(page);

    for (const wsTitle of [
      'Working From Home (WFH)',
      'Stacking, Packing, Loading & Lifting',
      'Office Ergonomics',
    ]) {
      await page.getByRole('button', { name: new RegExp(wsTitle.replace(/[()]/g, '\\$&'), 'i') }).first().click();
      await assertContentPopulated(page);
    }

    await page.getByRole('button', { name: /Biomechanical Calculators/i }).first().click();
    await assertContentPopulated(page);
    for (const calcLabel of ['REBA', 'RULA', 'NIOSH MMH', 'WBGT Thermal']) {
      await page.getByRole('button', { name: new RegExp(`^${calcLabel}`, 'i') }).first().click();
      await assertContentPopulated(page);
    }

    await page.getByRole('button', { name: /3D Spine Telemetry/i }).first().click();
    await assertContentPopulated(page);

    await page.getByRole('button', { name: /WFH Desk Checklist/i }).first().click();
    await assertContentPopulated(page);

    // B. Nelly Posture Engine inline side panel + male avatar + LukeNeural badge
    await openTab(page, 'Nelly Posture & Hazard Monitoring Engine (3D Spine)');
    const nellyPanel = page.getByTestId('nelly-side-panel').first();
    await assertContentPopulated(page, nellyPanel);
    await expect(nellyPanel.locator('img[src="/assets/nelly-male-avatar.png"]')).toBeVisible();
    await expect(nellyPanel.getByTestId('nelly-voice-badge')).toContainText('en-ZA');

    // Toggle Webcam Telemetry mode and back to 3D Spine Simulation
    await page.getByRole('button', { name: /Live AI Webcam Telemetry/i }).click();
    await assertContentPopulated(page);
    await page.getByRole('button', { name: /3D Spine Simulation/i }).click();
    await assertContentPopulated(page);

    // C. Activate floating Wingman side panel & verify persistence across tab switches
    await page.getByRole('button', { name: /ACTIVATE WINGMAN/i }).first().click();
    const avatarTrigger = page.getByRole('button', { name: 'Nelly AI Avatar' });
    await expect(avatarTrigger).toBeVisible();
    await avatarTrigger.click();

    await expect(page.getByTestId('nelly-side-panel')).toHaveCount(2);
    await openTab(page, 'Ground-Zero Human Co-Pilot Companion');
    await assertContentPopulated(page);
    const floatingNelly = page.getByTestId('nelly-side-panel').first();
    await assertContentPopulated(page, floatingNelly);
    await expect(floatingNelly.locator('img[src="/assets/nelly-male-avatar.png"]')).toBeVisible();
    await floatingNelly.getByRole('button', { name: 'Close', exact: true }).click();

    // D. HR Compliance Slide-Over Escalation Drawer
    await openTab(page, 'HR & Compliance Dashboard');
    await assertContentPopulated(page);
    const firstCaseRow = page.locator('div.divide-y > div').first();
    await expect(firstCaseRow).toBeVisible();
    await firstCaseRow.click();

    const hrDrawer = page.getByTestId('hr-escalation-drawer');
    await assertContentPopulated(page, hrDrawer);
    await hrDrawer.getByRole('button', { name: /Dismiss Panel/i }).click();
    await expect(hrDrawer).not.toBeVisible();

    expect(errors).toEqual([]);
  });
});

