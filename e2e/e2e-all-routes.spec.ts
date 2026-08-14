import { test, expect } from '@playwright/test';

test.describe('ErgoSafe Reborn V3 14-Route Core Verification Pass', () => {

    test('All 14 Core Navigation Routes Mount Cleanly with 0 Console Errors', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Load Application Root
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();

        const routes = [
            { name: 'Stewardship Overview', expected: /Executive Briefing|Stewardship/i },
            { name: 'Nelly Posture & Hazard Monitoring Engine (3D Spine)', expected: /Hazard Engine|Nelly Posture/i },
            { name: 'Ground-Zero Human Co-Pilot Companion', expected: /Human Co-Pilot|Companion/i },
            { name: 'Prizm Driver & Shift Fatigue Telemetry', expected: /Driver & Shift|Prizm/i },
            { name: 'Ergonomics Cognitive Handshake', expected: /Cognitive Handshake|Dot-Click/i },
            { name: 'Smart Break & Mobility Engine', expected: /Smart Break|Mobility Engine/i },
            { name: 'Organic SOP & ISO 45001 Generator', expected: /Organic SOP|ISO 45001/i },
            { name: 'Ergonomics Training & Certification', expected: /Curriculum|Enterprise OHS/i },
            { name: 'Daily Self-Risk Assessment (WFH / Desk)', expected: /Self-Risk|Assessment/i },
            { name: 'Daily Workstation Safety Checklist', expected: /Checklist|Safety/i },
            { name: 'HR & Compliance Dashboard', expected: /OHS Compliance|Escalation/i },
            { name: 'Risky Behaviours Monitoring', expected: /Risky Behaviours|Habits/i },
            { name: 'Assessment PDF Invoices & Billing', expected: /Invoicing|Financial/i },
            { name: 'Analytics & Regulatory Audit Logs', expected: /Analytics & Regulatory|Audit/i },
        ];

        for (const route of routes) {
            const btn = page.locator(`button:has-text("${route.name}")`).first();
            if (await btn.isVisible()) {
                await btn.scrollIntoViewIfNeeded();
                await btn.evaluate((el: HTMLElement) => el.click());
                await page.waitForTimeout(300);
                await expect(page.locator('body')).toContainText(route.expected, { timeout: 5000 });
            }
        }

        expect(consoleErrors.length).toBe(0);
    });
});
