import { test, expect } from '@playwright/test';
import { seedSession, openTab } from './support/ui';

// Every route MUST be present and render. No `if (isVisible)` guards: a missing nav item fails the test.
const routes = [
    { name: 'Stewardship Overview', expected: /SAFETY COMMAND CENTRE/i },
    { name: 'Nelly Posture & Hazard Monitoring Engine (3D Spine)', expected: /Hazard Engine|Nelly Posture/i },
    { name: 'Ground-Zero Human Co-Pilot Companion', expected: /Human Co-Pilot|Companion/i },
    { name: 'Prizm Driver & Shift Fatigue Telemetry', expected: /Driver & Shift|Prizm/i },
    { name: 'Ergonomics Cognitive Handshake', expected: /Dot-Click Latency Calibrator/i },
    { name: 'Smart Break & Mobility Engine', expected: /Smart Break|Mobility Engine/i },
    { name: 'Organic SOP & ISO 45001 Generator', expected: /Organic SOP|ISO 45001/i },
    { name: 'Ergonomics Training & Certification', expected: /Curriculum|Enterprise OHS/i },
    { name: 'Daily Self-Risk Assessment (WFH / Desk)', expected: /Self-Risk|Assessment/i },
    { name: 'Daily Workstation Safety Checklist', expected: /Checklist/i },
    { name: 'HR & Compliance Dashboard', expected: /OHS Compliance & Escalation Audit Trail/i },
    { name: 'Risky Behaviours Monitoring', expected: /Risk & Incident Management/i },
    { name: 'Assessment PDF Invoices & Billing', expected: /Ergonomics Assessment Invoicing/i },
    { name: 'Analytics & Regulatory Audit Logs', expected: /Analytics & Regulatory Audit Logs/i },
];

test.describe('ErgoSafe Reborn V3 14-Route Core Verification Pass', () => {
    test('All 14 core navigation routes exist, render, and log 0 console errors', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });
        page.on('pageerror', err => consoleErrors.push(err.message));

        await seedSession(page);
        await page.goto('/');
        await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();

        let visited = 0;
        for (const route of routes) {
            await openTab(page, route.name);
            await expect(page.locator('main')).toContainText(route.expected, { timeout: 10000 });
            visited++;
        }

        expect(visited).toBe(routes.length);
        expect(consoleErrors).toEqual([]);
    });
});
