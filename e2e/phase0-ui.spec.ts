import { test, expect } from '@playwright/test';
import { seedSession, openTab } from './support/ui';

test.describe('PHASE 0 UI: Consent & Emergency UI Verification', () => {

    test('0.3 Consent key is absent until the accept button is clicked', async ({ page }) => {
        await seedSession(page, { acceptPrivacy: false });
        await page.goto('/');

        // The notice appears after a short delay; it MUST appear (no silent skip)
        const acceptBtn = page.getByRole('button', { name: /ACCEPT PRIVACY HANDSHAKE/i });
        await expect(acceptBtn).toBeVisible({ timeout: 6000 });

        // Before clicking: no consent recorded, and the navbar does not claim it
        expect(await page.evaluate(() => localStorage.getItem('ergo_privacy_consent_verified'))).toBeNull();
        await expect(page.getByText('Privacy Notice Pending').first()).toBeAttached();

        await acceptBtn.click();
        await expect(acceptBtn).toBeHidden();
        expect(await page.evaluate(() => localStorage.getItem('ergo_privacy_consent_verified'))).toBe('true');
    });

    test('0.1 Emergency panel dials public emergency numbers, never the personal cellphone', async ({ page }) => {
        await seedSession(page);
        await page.goto('/');

        // Turn on Nelly, open her panel and report an injury -> emergency panel
        await page.getByRole('button', { name: /ACTIVATE WINGMAN/i }).click();
        await page.getByRole('button', { name: 'Nelly AI Avatar' }).click();
        const input = page.getByPlaceholder('Type symptom or query...');
        await expect(input).toBeVisible();
        await input.fill('There was an accident, worker has a severe injury');
        await input.press('Enter');

        await expect(page.getByText('Critical Escalation Active')).toBeVisible();
        await expect(page.locator('a[href="tel:112"]').first()).toBeVisible();
        await expect(page.locator('a[href="tel:10177"]')).toBeVisible();
        await expect(page.locator('a[href="tel:10111"]')).toBeVisible();

        const hrefs = await page.locator('a[href^="tel:"]').evaluateAll(els => els.map(e => e.getAttribute('href')));
        // The footer may show the business contact; the emergency panel must not
        const panelHrefs = await page.locator('text=Critical Escalation Active').locator('xpath=ancestor::div[2]').locator('a[href^="tel:"]').evaluateAll(els => els.map(e => e.getAttribute('href')));
        expect(hrefs.length).toBeGreaterThan(0);
        expect(panelHrefs.join(' ')).not.toContain('27622655708');
        expect(panelHrefs).toContain('tel:112');
    });

    test('0.2 A slow (fatigued) handshake run shows FAILED, not PASSED', async ({ page }) => {
        test.setTimeout(60000);
        await seedSession(page);
        await page.goto('/');
        await openTab(page, 'Ergonomics Cognitive Handshake');

        await page.getByRole('button', { name: 'RE-CALIBRATE HANDSHAKE' }).click();
        const target = page.getByRole('button', { name: 'Handshake target' });
        for (let i = 0; i < 5; i++) {
            await expect(target).toBeVisible();
            await page.waitForTimeout(1150); // > 1000 ms average reaction = fatigued
            await target.click();
        }

        await expect(page.getByText(/HANDSHAKE FAILED/)).toBeVisible();
        await expect(page.getByText('HANDSHAKE VERIFIED & PASSED')).toHaveCount(0);
    });
});
