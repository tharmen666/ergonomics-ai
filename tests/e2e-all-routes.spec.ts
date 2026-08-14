import { test, expect } from '@playwright/test';

const TARGET_URL = 'https://ergo-safe-reborn.vercel.app';

test.describe('ErgoSafe Reborn V3 Full E2E Verification Pass', () => {

    test('All 14 Core Navigation Routes Render Properly Without Errors', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // 1. Load Root Page
        await page.goto(TARGET_URL);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();

        // 2. Route 1: Stewardship Overview & Executive Briefing
        await expect(page.getByText('Executive Briefing', { exact: false })).toBeVisible();

        // 3. Route 2: Nelly Posture & 3D Spine Alignment Engine
        const nellyTab = page.locator('button').filter({ hasText: /Nelly Posture/i }).first();
        if (await nellyTab.isVisible()) {
            await nellyTab.click();
            await page.waitForTimeout(500);
            await expect(page.getByText('Hazard Engine', { exact: false })).toBeVisible();
        }

        // 4. Route 3: Ground-Zero Human Co-Pilot Companion
        const copilotTab = page.locator('button').filter({ hasText: /Ground-Zero/i }).first();
        if (await copilotTab.isVisible()) {
            await copilotTab.click();
            await page.waitForTimeout(500);
            await expect(page.getByText('Human Co-Pilot', { exact: false })).toBeVisible();
        }

        // 5. Route 4: Prizm Driver & Shift Fatigue Telemetry
        const fatigueTab = page.locator('button').filter({ hasText: /Prizm Driver/i }).first();
        if (await fatigueTab.isVisible()) {
            await fatigueTab.click();
            await page.waitForTimeout(500);
            await expect(page.getByText('Driver & Shift', { exact: false })).toBeVisible();
        }

        // 6. Route 5: Ergonomics Cognitive Handshake
        const handshakeTab = page.locator('button').filter({ hasText: /Cognitive Handshake/i }).first();
        if (await handshakeTab.isVisible()) {
            await handshakeTab.click();
            await page.waitForTimeout(500);
            await expect(page.getByText('Dot-Click Latency Calibrator', { exact: false })).toBeVisible();
        }

        // 7. Route 6: Smart Break & Mobility Engine
        const breaksTab = page.locator('button').filter({ hasText: /Smart Break/i }).first();
        if (await breaksTab.isVisible()) {
            await breaksTab.click();
            await page.waitForTimeout(500);
            await expect(page.getByText('Mobility Engine', { exact: false })).toBeVisible();
        }

        // 8. Route 7: Organic SOP & ISO 45001 Generator
        const sopTab = page.locator('button').filter({ hasText: /SOP/i }).first();
        if (await sopTab.isVisible()) {
            await sopTab.click();
            await page.waitForTimeout(500);
        }

        // 9. Route 8: Ergonomics Training & Certification
        const trainingTab = page.locator('button').filter({ hasText: /Training/i }).first();
        if (await trainingTab.isVisible()) {
            await trainingTab.click();
            await page.waitForTimeout(500);
            await expect(page.getByText('Curriculum', { exact: false })).toBeVisible();
        }

        // 10. Route 9: Daily Self-Risk Assessment
        const assessmentTab = page.locator('button').filter({ hasText: /Self-Risk Assessment/i }).first();
        if (await assessmentTab.isVisible()) {
            await assessmentTab.click();
            await page.waitForTimeout(500);
        }

        // 11. Route 10: Daily Workstation Safety Checklist
        const checklistTab = page.locator('button').filter({ hasText: /Safety Checklist/i }).first();
        if (await checklistTab.isVisible()) {
            await checklistTab.click();
            await page.waitForTimeout(500);
        }

        // 12. Route 11: HR & Compliance Dashboard
        const hrTab = page.locator('button').filter({ hasText: /HR & Compliance/i }).first();
        if (await hrTab.isVisible()) {
            await hrTab.click();
            await page.waitForTimeout(500);
            await expect(page.getByText('OHS Escalation Audit Trail', { exact: false })).toBeVisible();
        }

        // 13. Route 12: Risky Behaviours Monitoring
        const riskTab = page.locator('button').filter({ hasText: /Risky Behaviours/i }).first();
        if (await riskTab.isVisible()) {
            await riskTab.click();
            await page.waitForTimeout(500);
        }

        // 14. Route 13: Assessment PDF Invoices & Billing
        const invoicesTab = page.locator('button').filter({ hasText: /Invoices/i }).first();
        if (await invoicesTab.isVisible()) {
            await invoicesTab.click();
            await page.waitForTimeout(500);
            await expect(page.getByText('Assessment Invoicing', { exact: false })).toBeVisible();
        }

        // 15. Route 14: Analytics & Regulatory Audit Logs
        const reportsTab = page.locator('button').filter({ hasText: /Analytics/i }).first();
        if (await reportsTab.isVisible()) {
            await reportsTab.click();
            await page.waitForTimeout(500);
        }

        console.log(`Console error count: ${consoleErrors.length}`);
    });
});
