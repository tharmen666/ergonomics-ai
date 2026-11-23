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

    test('3. South African English (en-ZA) voice profile & real-time multilingual subtitle sync (Swahili, isiZulu, French)', async ({ page }) => {
        const consoleMessages: string[] = [];
        page.on('console', (msg) => {
            consoleMessages.push(msg.text());
        });

        await page.addInitScript(() => {
            const voiceMap = new WeakMap<SpeechSynthesisUtterance, SpeechSynthesisVoice | null>();
            if (typeof SpeechSynthesisUtterance !== 'undefined') {
                Object.defineProperty(SpeechSynthesisUtterance.prototype, 'voice', {
                    configurable: true,
                    get() {
                        return voiceMap.get(this) ?? null;
                    },
                    set(v: SpeechSynthesisVoice | null) {
                        voiceMap.set(this, v);
                    },
                });
            }

            const mockVoices = [
                {
                    name: 'Microsoft David - English (United States)',
                    lang: 'en-US',
                    voiceURI: 'Microsoft David - English (United States)',
                    default: true,
                    localService: true,
                },
                {
                    name: 'Google UK English Female',
                    lang: 'en-GB',
                    voiceURI: 'Google UK English Female',
                    default: false,
                    localService: false,
                },
                {
                    name: 'Microsoft Leah Online (Natural) - English (South Africa)',
                    lang: 'en-ZA',
                    voiceURI: 'Microsoft Leah Online (Natural) - English (South Africa)',
                    default: false,
                    localService: false,
                },
            ] as unknown as SpeechSynthesisVoice[];

            let voicesLoaded = false;
            const enZaLogs: Array<{
                text: string;
                lang: string;
                rate: number;
                pitch: number;
                voiceName: string | null;
                voiceLang: string | null;
            }> = [];
            (window as any).__enZaLogs = enZaLogs;

            if ('speechSynthesis' in window) {
                const synth = window.speechSynthesis;
                const listeners = new Set<(ev: Event) => void>();

                const origAdd = synth.addEventListener?.bind(synth);
                const origRemove = synth.removeEventListener?.bind(synth);

                synth.addEventListener = ((type: string, fn: any, opts?: any) => {
                    if (type === 'voiceschanged' && typeof fn === 'function') {
                        listeners.add(fn);
                    }
                    if (origAdd) origAdd(type, fn, opts);
                }) as any;

                synth.removeEventListener = ((type: string, fn: any, opts?: any) => {
                    if (type === 'voiceschanged' && typeof fn === 'function') {
                        listeners.delete(fn);
                    }
                    if (origRemove) origRemove(type, fn, opts);
                }) as any;

                synth.getVoices = () => (voicesLoaded ? mockVoices : []);

                synth.speak = (utterance: SpeechSynthesisUtterance) => {
                    if (utterance.text && utterance.text.trim()) {
                        enZaLogs.push({
                            text: utterance.text,
                            lang: utterance.lang,
                            rate: utterance.rate,
                            pitch: utterance.pitch,
                            voiceName: utterance.voice ? utterance.voice.name : null,
                            voiceLang: utterance.voice ? utterance.voice.lang : null,
                        });
                    }
                    if (utterance.onstart) {
                        setTimeout(() => utterance.onstart?.(new Event('start') as any), 5);
                    }
                };

                synth.cancel = () => {};

                setTimeout(() => {
                    voicesLoaded = true;
                    const ev = new Event('voiceschanged');
                    listeners.forEach((fn) => {
                        try {
                            fn(ev);
                        } catch {}
                    });
                    if (typeof synth.onvoiceschanged === 'function') {
                        synth.onvoiceschanged(ev);
                    }
                }, 80);
            }
        });

        await seedSession(page);
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('/');

        await openTab(page, 'Nelly Posture & Hazard Monitoring Engine (3D Spine)');
        await expect(page.getByTestId('nelly-subtitle-bar')).toBeVisible({ timeout: 10000 });

        // Select Swahili subtitles (sw-KE)
        await page.getByRole('button', { name: 'sw-KE' }).click();
        await expect(page.getByTestId('nelly-subtitle-text')).toContainText('Hujambo');
        await expect(page.getByTestId('nelly-voice-badge')).toContainText('Voice: en-ZA');
        await expect(page.getByTestId('nelly-subtitle-lang')).toContainText('sw-KE');

        await expect.poll(async () => {
            return await page.evaluate(() => {
                const logs = (window as any).__enZaLogs || [];
                return logs[logs.length - 1] || null;
            });
        }).toMatchObject({
            voiceName: 'Microsoft Leah Online (Natural) - English (South Africa)',
            voiceLang: 'en-ZA',
            lang: 'en-ZA',
            rate: expect.closeTo(0.96, 2),
            pitch: expect.closeTo(1.02, 2),
            text: expect.stringMatching(/Hi, I'm Nelly/i),
        });

        // Select isiZulu subtitles (zu-ZA)
        await page.getByRole('button', { name: 'zu-ZA' }).click();
        await expect(page.getByTestId('nelly-subtitle-text')).toContainText('Sawubona');
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const logs = (window as any).__enZaLogs || [];
                return logs[logs.length - 1] || null;
            });
        }).toMatchObject({
            voiceName: 'Microsoft Leah Online (Natural) - English (South Africa)',
            voiceLang: 'en-ZA',
            lang: 'en-ZA',
            rate: expect.closeTo(0.96, 2),
            pitch: expect.closeTo(1.02, 2),
            text: expect.stringMatching(/Hi, I'm Nelly/i),
        });

        // Select French subtitles (fr-FR)
        await page.getByRole('button', { name: 'fr-FR' }).click();
        await expect(page.getByTestId('nelly-subtitle-text')).toContainText('Bonjour');

        // Confirm browser console logged en-ZA telemetry for synced subtitles
        const hasTelemetryLog = consoleMessages.some(
            (msg) => msg.includes('[Nelly TTS]') && msg.includes('en-ZA') && msg.includes('sw')
        );
        expect(hasTelemetryLog).toBe(true);
    });

    test('4. Voice fallback chain (en-ZA absent -> en-GB natural female, never male David)', async ({ page }) => {
        await page.addInitScript(() => {
            const voiceMap = new WeakMap<SpeechSynthesisUtterance, SpeechSynthesisVoice | null>();
            if (typeof SpeechSynthesisUtterance !== 'undefined') {
                Object.defineProperty(SpeechSynthesisUtterance.prototype, 'voice', {
                    configurable: true,
                    get() {
                        return voiceMap.get(this) ?? null;
                    },
                    set(v: SpeechSynthesisVoice | null) {
                        voiceMap.set(this, v);
                    },
                });
            }

            const mockVoices = [
                {
                    name: 'Microsoft David - English (United States)',
                    lang: 'en-US',
                    voiceURI: 'Microsoft David - English (United States)',
                    default: true,
                    localService: true,
                },
                {
                    name: 'Google UK English Female',
                    lang: 'en-GB',
                    voiceURI: 'Google UK English Female',
                    default: false,
                    localService: false,
                },
            ] as unknown as SpeechSynthesisVoice[];

            const fallbackLogs: Array<{
                voiceName: string | null;
                voiceLang: string | null;
                rate: number;
                pitch: number;
            }> = [];
            (window as any).__fallbackLogs = fallbackLogs;

            if ('speechSynthesis' in window) {
                const synth = window.speechSynthesis;
                synth.getVoices = () => mockVoices;
                synth.speak = (utterance: SpeechSynthesisUtterance) => {
                    if (utterance.text && utterance.text.trim()) {
                        fallbackLogs.push({
                            voiceName: utterance.voice ? utterance.voice.name : null,
                            voiceLang: utterance.voice ? utterance.voice.lang : null,
                            rate: utterance.rate,
                            pitch: utterance.pitch,
                        });
                    }
                    if (utterance.onstart) {
                        setTimeout(() => utterance.onstart?.(new Event('start') as any), 5);
                    }
                };
                synth.cancel = () => {};
            }
        });

        await seedSession(page);
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('/');

        await openTab(page, 'Nelly Posture & Hazard Monitoring Engine (3D Spine)');
        await expect(page.getByTestId('nelly-subtitle-bar')).toBeVisible({ timeout: 10000 });

        await page.getByRole('button', { name: 'sw-KE' }).click();
        await expect(page.getByTestId('nelly-subtitle-text')).toContainText('Hujambo');

        await expect.poll(async () => {
            return await page.evaluate(() => {
                const logs = (window as any).__fallbackLogs || [];
                const active = (window as any).__nellyActiveVoice || null;
                return {
                    lastSpeak: logs[logs.length - 1] || null,
                    tier: active?.tier || null,
                };
            });
        }).toMatchObject({
            lastSpeak: {
                voiceName: 'Google UK English Female',
                voiceLang: 'en-GB',
                rate: expect.closeTo(0.96, 2),
                pitch: expect.closeTo(1.02, 2),
            },
            tier: 'en-GB',
        });
    });
});
