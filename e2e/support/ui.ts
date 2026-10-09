import { Page, expect } from '@playwright/test';

/** Log in as the demo admin and (optionally) pre-accept the privacy notice. */
export async function seedSession(page: Page, opts: { acceptPrivacy?: boolean } = { acceptPrivacy: true }) {
    await page.addInitScript((acceptPrivacy: boolean) => {
        window.localStorage.setItem('tenant-billing-telemetry-storage', JSON.stringify({
            state: {
                companyId: null,
                userId: 'admin',
                isAdmin: true,
                logs: [],
                usage: {}
            },
            version: 0
        }));
        if (acceptPrivacy) {
            window.localStorage.setItem('popiHandshakeAccepted', 'true');
            window.localStorage.setItem('ergo_privacy_consent_verified', 'true');
        }
    }, opts.acceptPrivacy ?? true);
}

/** Open the sidebar if it is collapsed, then click a nav item. Fails if the item is missing. */
export async function openTab(page: Page, label: string) {
    // The collapsed sidebar is translated off-screen (still "visible" to Playwright), so check the class
    const sidebar = page.locator('div.fixed.left-0.top-0').first();
    if (await sidebar.evaluate((el) => el.classList.contains('-translate-x-full'))) {
        await page.getByRole('button', { name: 'Toggle Sidebar' }).first().click();
        await expect(sidebar).not.toHaveClass(/-translate-x-full/);
    }
    const btn = page.getByRole('button', { name: label, exact: true });
    await expect(btn).toBeVisible();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
}
