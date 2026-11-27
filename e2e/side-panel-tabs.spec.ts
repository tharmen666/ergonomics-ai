import { test, expect } from '@playwright/test';
import { seedSession, openTab } from './support/ui';

test.describe('Nelly Side Panel & CompanionHub Tabbed Navigation Audit', () => {
  test('1. Nelly Side Panel tabs (Advisor, Exercises, First Aid, Prompts, Voice & Lang, Compliance) render >50 chars, >200px height, 0 errors on Desktop (1280x800) & Mobile (360x640)', async ({ page }) => {
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

    // Desktop (1280x800) — Inline Nelly Side Panel
    await seedSession(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await openTab(page, 'Nelly Posture & Hazard Monitoring Engine (3D Spine)');
    const sidePanel = page.getByTestId('nelly-side-panel').first();
    await expect(sidePanel).toBeVisible({ timeout: 10000 });

    const tabButtons = sidePanel.getByTestId('nelly-panel-tabs').locator('button');
    const tabCount = await tabButtons.count();
    expect(tabCount).toBe(6);

    const panelBody = sidePanel.getByTestId('nelly-panel-body');

    for (let i = 0; i < tabCount; i++) {
      const btn = tabButtons.nth(i);
      await btn.scrollIntoViewIfNeeded();
      await btn.click();

      await expect(panelBody).toBeVisible();
      const text = (await panelBody.innerText()).trim();
      expect(text.length).toBeGreaterThan(50);

      const box = await panelBody.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThan(200);
    }

    // Verify interactive Prompt action + en-ZA-LukeNeural audio state
    await sidePanel.getByTestId('nelly-tab-prompts').click();
    await sidePanel.getByRole('button', { name: /Neck Pain & Cervical Stretch/i }).click();
    await expect(panelBody).toContainText(/Neck pain reported/i);
    await expect.poll(async () => {
      return await page.evaluate(() => (window as any).__nellyActiveVoice?.voiceId || null);
    }).toBe('en-ZA-LukeNeural');

    // Verify Voice & Language tab preserves Male Advisor Avatar + synced Swahili & isiZulu subtitles
    await sidePanel.getByTestId('nelly-tab-voice').click();
    await expect(panelBody.locator('img[src="/assets/nelly-male-avatar.png"]')).toBeVisible();
    await panelBody.getByRole('button', { name: /sw-KE/i }).click();
    await expect(panelBody).toContainText('Hujambo');
    await panelBody.getByRole('button', { name: /zu-ZA/i }).click();
    await expect(panelBody).toContainText('Sawubona');

    // Switch back to Advisor default tab and confirm zero collapse
    await sidePanel.getByTestId('nelly-tab-advisor').click();
    await expect(sidePanel.getByTestId('nelly-subtitle-bar')).toBeVisible();

    // Mobile (360x640) — Floating Wingman Side Panel
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    await openTab(page, 'Stewardship Overview');

    await page.getByRole('button', { name: 'Quick Actions Menu' }).first().click().catch(() => {});
    const activateWingmanBtn = page.getByRole('button', { name: /ACTIVATE WINGMAN/i }).first();
    await activateWingmanBtn.click();

    const floatingAvatar = page.getByRole('button', { name: 'Nelly AI Avatar' });
    await expect(floatingAvatar).toBeVisible();
    await floatingAvatar.click();

    const mobilePanel = page.getByTestId('nelly-side-panel').first();
    await expect(mobilePanel).toBeVisible();
    const mobileTabs = mobilePanel.getByTestId('nelly-panel-tabs').locator('button');
    const mobileBody = mobilePanel.getByTestId('nelly-panel-body');

    for (let i = 0; i < (await mobileTabs.count()); i++) {
      await mobileTabs.nth(i).click();
      const text = (await mobileBody.innerText()).trim();
      expect(text.length).toBeGreaterThan(50);
      const box = await mobileBody.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThan(200);
    }

    expect(errors).toEqual([]);
  });

  test('2. CompanionHub tabs (All Workspace, Setup & Voice, Live Dialogue, Quick OHS Prompts) render populated content with male avatar', async ({ page }) => {
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

    await openTab(page, 'Ground-Zero Human Co-Pilot Companion');
    const hub = page.getByTestId('companion-hub');
    await expect(hub).toBeVisible({ timeout: 10000 });
    await expect(hub.locator('img[src="/assets/nelly-male-avatar.png"]').first()).toBeVisible();

    const tabButtons = hub.getByTestId('companion-hub-tabs').locator('button');
    const tabCount = await tabButtons.count();
    expect(tabCount).toBe(4);

    const tabBody = hub.getByTestId('companion-tab-body');
    for (let i = 0; i < tabCount; i++) {
      await tabButtons.nth(i).click();
      await expect(tabBody).toBeVisible();
      const text = (await tabBody.innerText()).trim();
      expect(text.length).toBeGreaterThan(50);
      const box = await tabBody.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThan(200);
    }

    expect(errors).toEqual([]);
  });
});

