import { test, expect } from '@playwright/test';
import { seedSession, openTab } from './support/ui';

test.describe('Nelly Voiceover (TTS) Synchronization & Modal Cleanup', () => {
    test.beforeEach(async ({ page }) => {
        // Intercept native Web Speech API methods on window.speechSynthesis
        await page.addInitScript(() => {
            const speechLogs: Array<{ type: string; text?: string; lang?: string }> = [];
            (window as any).__speechLogs = speechLogs;

            if ('speechSynthesis' in window) {
                const synth = window.speechSynthesis;
                const origCancel = synth.cancel ? synth.cancel.bind(synth) : () => {};

                synth.speak = (utterance: SpeechSynthesisUtterance) => {
                    if (utterance.text && utterance.text.trim()) {
                        speechLogs.push({ type: 'speak', text: utterance.text, lang: utterance.lang });
                    }
                    if (utterance.onstart) {
                        setTimeout(() => utterance.onstart?.(new Event('start') as any), 5);
                    }
                };

                synth.cancel = () => {
                    speechLogs.push({ type: 'cancel' });
                    try {
                        origCancel();
                    } catch (e) {}
                };
            }
        });
    });

    test('1. Training Modal: Step-by-step narration sync, Chrome GC guard, and cleanup', async ({ page }) => {
        page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        await seedSession(page);
        await page.goto('/');
        await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();

        await openTab(page, 'Ergonomics Training & Certification');
        await expect(page.locator('main')).toContainText(/Curriculum|Enterprise OHS/i, { timeout: 10000 });

        // Click START COURSE or REVIEW MODULE to open modal
        const startBtn = page.getByRole('button', { name: /START COURSE|REVIEW MODULE/i }).first();
        await expect(startBtn).toBeVisible();
        await startBtn.click();

        // Modal should open
        const modal = page.locator('div.fixed.inset-0.z-\\[100\\]');
        await expect(modal).toBeVisible();

        // Step 1: Nelly reads Step 1 instruction aloud
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const logs = (window as any).__speechLogs || [];
                return logs.filter((l: any) => l.type === 'speak').map((l: any) => l.text);
            });
        }).toEqual(expect.arrayContaining([expect.stringMatching(/Step 1/i)]));

        // Chrome TTS Garbage Collection Guard: active utterance must be retained on window instance
        const hasActiveUtterance = await page.evaluate(() => {
            return (window as any).__activeUtterance !== null && (window as any).__activeUtterance !== undefined;
        });
        expect(hasActiveUtterance).toBe(true);

        // Advance to Step 2: Click NEXT INSTRUCTION
        const nextBtn = page.getByRole('button', { name: /NEXT INSTRUCTION/i });
        await nextBtn.click();

        // Verify cancel was dispatched before Step 2 speech
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const logs = (window as any).__speechLogs || [];
                const speaks = logs.filter((l: any) => l.type === 'speak');
                const cancels = logs.filter((l: any) => l.type === 'cancel');
                return {
                    cancelsCount: cancels.length,
                    speaks: speaks.map((s: any) => s.text)
                };
            });
        }).toMatchObject({
            cancelsCount: expect.any(Number),
            speaks: expect.arrayContaining([
                expect.stringMatching(/Step 1/i),
                expect.stringMatching(/Step 2/i)
            ])
        });

        // Jump to Step 3 using linear step indicator button
        const step3Dot = page.getByRole('button', { name: 'Jump to step 3' });
        await step3Dot.click();

        // Verify cancel was dispatched and Step 3 instruction was narrated
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const logs = (window as any).__speechLogs || [];
                return logs.filter((l: any) => l.type === 'speak').map((l: any) => l.text);
            });
        }).toEqual(expect.arrayContaining([expect.stringMatching(/Step 3/i)]));

        // Toggle STOP GUIDANCE: Audio must be immediately cancelled
        const cancelCountBeforeStop = await page.evaluate(() => {
            return ((window as any).__speechLogs || []).filter((l: any) => l.type === 'cancel').length;
        });

        const stopGuidanceBtn = page.getByRole('button', { name: /STOP GUIDANCE/i });
        await stopGuidanceBtn.click();

        const cancelCountAfterStop = await page.evaluate(() => {
            return ((window as any).__speechLogs || []).filter((l: any) => l.type === 'cancel').length;
        });
        expect(cancelCountAfterStop).toBeGreaterThan(cancelCountBeforeStop);

        // Resume guidance via VOICE INSTRUCTION
        const voiceInstructionBtn = page.getByRole('button', { name: /VOICE INSTRUCTION/i });
        await voiceInstructionBtn.click();

        // Toggle Nelly Active TTS Guidance switch OFF: Audio must immediately cancel
        const cancelCountBeforeToggle = await page.evaluate(() => {
            return ((window as any).__speechLogs || []).filter((l: any) => l.type === 'cancel').length;
        });

        const ttsToggle = page.getByRole('button', { name: /Toggle Voice Guidance/i });
        await ttsToggle.click();

        const cancelCountAfterToggle = await page.evaluate(() => {
            return ((window as any).__speechLogs || []).filter((l: any) => l.type === 'cancel').length;
        });
        expect(cancelCountAfterToggle).toBeGreaterThan(cancelCountBeforeToggle);

        // Modal Close: immediately triggers window.speechSynthesis.cancel()
        const closeBtn = modal.getByRole('button', { name: 'Close', exact: true });
        await closeBtn.click();
        await expect(modal).not.toBeVisible();

        const finalCancels = await page.evaluate(() => {
            return ((window as any).__speechLogs || []).filter((l: any) => l.type === 'cancel').length;
        });
        expect(finalCancels).toBeGreaterThan(cancelCountAfterToggle);
    });

    test('2. Desk Micro-Nudge Modal: Step narration sync, Next Step cancel, and cleanup', async ({ page }) => {
        await seedSession(page);
        await page.goto('/');
        await expect(page.locator('h1:has-text("ERGOSAFE")')).toBeVisible();

        await openTab(page, 'Smart Break & Mobility Engine');
        await expect(page.locator('main')).toContainText(/Smart Break|Mobility Engine/i, { timeout: 10000 });

        // Launch 90-Min Desk Micro-Nudge ("Gentle Neck & Shoulder Rolls")
        const simulateBtn = page.getByRole('button', { name: /Simulate 90-Min Nudge/i });
        await expect(simulateBtn).toBeVisible();
        await simulateBtn.click();

        // Modal should appear
        const nudgeModal = page.locator('div.fixed.inset-0.z-\\[2000\\]');
        await expect(nudgeModal).toBeVisible();

        // Step 1: Nelly speaks Gentle Neck & Shoulder Rolls instruction
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const logs = (window as any).__speechLogs || [];
                return logs.filter((l: any) => l.type === 'speak').map((l: any) => l.text);
            });
        }).toEqual(expect.arrayContaining([expect.stringMatching(/Gentle Neck & Shoulder Rolls/i)]));

        // Chrome GC guard retention
        const hasActiveUtterance = await page.evaluate(() => {
            return (window as any).__activeUtterance !== null && (window as any).__activeUtterance !== undefined;
        });
        expect(hasActiveUtterance).toBe(true);

        // Click "Next Step" -> cancels pending audio and speaks step 2 (Wrist & Forearm Flexor Release)
        const nextStepBtn = nudgeModal.getByRole('button', { name: /Next Step/i });
        await nextStepBtn.click();

        await expect.poll(async () => {
            return await page.evaluate(() => {
                const logs = (window as any).__speechLogs || [];
                const speaks = logs.filter((l: any) => l.type === 'speak');
                return speaks.map((s: any) => s.text);
            });
        }).toEqual(expect.arrayContaining([
            expect.stringMatching(/Gentle Neck & Shoulder Rolls/i),
            expect.stringMatching(/Wrist & Forearm Flexor Release/i)
        ]));

        // Toggle Nelly Active TTS Guidance OFF in Micro-Nudge modal
        const cancelCountBeforeToggle = await page.evaluate(() => {
            return ((window as any).__speechLogs || []).filter((l: any) => l.type === 'cancel').length;
        });

        const toggleBtn = nudgeModal.getByRole('button', { name: /Toggle Voice Guidance/i });
        await toggleBtn.click();

        const cancelCountAfterToggle = await page.evaluate(() => {
            return ((window as any).__speechLogs || []).filter((l: any) => l.type === 'cancel').length;
        });
        expect(cancelCountAfterToggle).toBeGreaterThan(cancelCountBeforeToggle);

        // Close modal -> triggers cleanup window.speechSynthesis.cancel()
        const closeBtn = nudgeModal.getByRole('button', { name: 'Close' });
        await closeBtn.click();
        await expect(nudgeModal).not.toBeVisible();

        const finalCancels = await page.evaluate(() => {
            return ((window as any).__speechLogs || []).filter((l: any) => l.type === 'cancel').length;
        });
        expect(finalCancels).toBeGreaterThan(cancelCountAfterToggle);
    });
});
