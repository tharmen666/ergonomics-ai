import { test, expect } from '@playwright/test';
import { seedSession, openTab } from './support/ui';

test.describe('Round 2 UI', () => {
    test('A3: an unsafe manual risk assessment logs a risk alert, not a legal breach', async ({ page }) => {
        await seedSession(page);
        await page.goto('/');
        await openTab(page, 'Risky Behaviours Monitoring');

        // 4 questions: pick the worst (last) option each time, then Next / Submit
        for (let i = 0; i < 4; i++) {
            const options = page.locator('main div.md\\:grid-cols-2 > button');
            await expect(options.first()).toBeVisible();
            await options.last().click();
            await page.getByRole('button', { name: i === 3 ? /Submit/ : /Next/ }).click();
        }

        await expect(page.getByText('Ergonomic Risk Logged')).toBeVisible();
        await expect(page.getByText(/OHS Breach Registered|compliance breach has been flagged/i)).toHaveCount(0);
    });

    test('A6: 3D spine render loop runs while visible (no frozen "demand" loop)', async ({ page }) => {
        await seedSession(page);
        await page.goto('/');
        await openTab(page, 'Nelly Posture & Hazard Monitoring Engine (3D Spine)');
        const canvasWrap = page.getByTestId('spine-canvas').first();
        await expect(canvasWrap).toBeVisible({ timeout: 15000 });
        await expect(canvasWrap).toHaveAttribute('data-frameloop', 'always');
    });

    test('E1/E2: pinch-zoom allowed; no hardcoded build or "Live Production" badge', async ({ page }) => {
        await seedSession(page);
        await page.goto('/');
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).not.toMatch(/user-scalable=no|maximum-scale=1/);
        await expect(page.getByText('Build: a9407fe')).toHaveCount(0);
        await expect(page.getByText('Live Production')).toHaveCount(0);
    });

    test('B2/1.1: Reports page states storage honestly (no "Access Controlled" claim)', async ({ page }) => {
        await seedSession(page);
        await page.goto('/');
        await openTab(page, 'Analytics & Regulatory Audit Logs');
        await expect(page.getByText(/stored in this browser only/i)).toBeVisible();
        await expect(page.getByText(/Access Controlled/i)).toHaveCount(0);
    });

    test('Perf: first page load does not download three.js', async ({ page }) => {
        const scripts: string[] = [];
        page.on('request', r => { if (r.resourceType() === 'script') scripts.push(r.url()); });
        await seedSession(page);
        await page.goto('/');
        await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();
        await page.waitForLoadState('networkidle');
        expect(scripts.filter(u => /three|react-three-fiber|vendor-three/i.test(u))).toEqual([]);
    });
});
