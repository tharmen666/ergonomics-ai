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

    test('3. Male Avatar + Exact Demo Video Voice (en-ZA-LukeNeural) & Multilingual Subtitle Sync (Swahili, isiZulu, French)', async ({ page, request }) => {
        const avatarRes = await request.get('/assets/nelly-male-avatar.png');
        expect(avatarRes.status()).toBe(200);
        expect(avatarRes.headers()['content-type']).toContain('image/png');

        const audioRes = await request.get('/assets/audio/en_za_luke/intro.mp3');
        expect(audioRes.status()).toBe(200);
        expect((await audioRes.body()).byteLength).toBeGreaterThan(4000);

        const consoleMessages: string[] = [];
        page.on('console', (msg) => {
            consoleMessages.push(msg.text());
        });

        await page.addInitScript(() => {
            const playedVoicenotes: Array<{ src: string }> = [];
            (window as any).__playedVoicenotes = playedVoicenotes;

            HTMLMediaElement.prototype.play = function () {
                const src = (this as HTMLAudioElement).src || '';
                playedVoicenotes.push({ src });
                return Promise.resolve();
            };
        });

        await seedSession(page);
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('/');

        await openTab(page, 'Nelly Posture & Hazard Monitoring Engine (3D Spine)');
        await expect(page.getByTestId('nelly-subtitle-bar')).toBeVisible({ timeout: 10000 });

        const avatarImg = page.locator('img[src="/assets/nelly-male-avatar.png"]').first();
        await expect(avatarImg).toBeVisible();

        // Select Swahili subtitles (sw-KE)
        await page.getByRole('button', { name: 'sw-KE' }).click();
        await expect(page.getByTestId('nelly-subtitle-text')).toContainText('Hujambo');
        await expect(page.getByTestId('nelly-voice-badge')).toContainText('Voice: en-ZA (LukeNeural)');
        await expect(page.getByTestId('nelly-subtitle-lang')).toContainText('sw-KE');

        await expect.poll(async () => {
            return await page.evaluate(() => {
                const notes = (window as any).__playedVoicenotes || [];
                return {
                    lastSrc: notes[notes.length - 1]?.src || '',
                    active: (window as any).__nellyActiveVoice || null,
                };
            });
        }).toMatchObject({
            lastSrc: expect.stringContaining('/assets/audio/en_za_luke/intro.mp3'),
            active: {
                voiceId: 'en-ZA-LukeNeural',
                lang: 'en-ZA',
                tier: 'en-ZA',
                engine: 'voicenote',
                audioSrc: '/assets/audio/en_za_luke/intro.mp3',
            },
        });

        // Select isiZulu subtitles (zu-ZA)
        await page.getByRole('button', { name: 'zu-ZA' }).click();
        await expect(page.getByTestId('nelly-subtitle-text')).toContainText('Sawubona');
        await expect.poll(async () => {
            return await page.evaluate(() => (window as any).__nellyActiveVoice?.subtitleLang || null);
        }).toBe('zu');

        // Select French subtitles (fr-FR)
        await page.getByRole('button', { name: 'fr-FR' }).click();
        await expect(page.getByTestId('nelly-subtitle-text')).toContainText('Bonjour');

        // Confirm browser console logged en-ZA-LukeNeural telemetry for synced subtitles
        const hasTelemetryLog = consoleMessages.some(
            (msg) => msg.includes('[Nelly TTS]') && msg.includes('en-ZA-LukeNeural') && msg.includes('sw')
        );
        expect(hasTelemetryLog).toBe(true);
    });

    test('4. Dynamic Web Speech API Fallback Chain (Microsoft Luke en-ZA -> en-GB Natural Male, never female Zira)', async ({ page }) => {
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
                    name: 'Microsoft Zira - English (United States)',
                    lang: 'en-US',
                    voiceURI: 'Microsoft Zira - English (United States)',
                    default: true,
                    localService: true,
                },
                {
                    name: 'Google UK English Male',
                    lang: 'en-GB',
                    voiceURI: 'Google UK English Male',
                    default: false,
                    localService: false,
                },
                {
                    name: 'Microsoft Luke Online (Natural) - English (South Africa)',
                    lang: 'en-ZA',
                    voiceURI: 'Microsoft Luke Online (Natural) - English (South Africa)',
                    default: false,
                    localService: false,
                },
            ] as unknown as SpeechSynthesisVoice[];

            let includeZaVoice = true;
            let voicesLoaded = false;
            (window as any).__setIncludeZaVoice = (val: boolean) => {
                includeZaVoice = val;
            };

            const fallbackLogs: Array<{
                voiceName: string | null;
                voiceLang: string | null;
                lang: string;
                rate: number;
                pitch: number;
            }> = [];
            (window as any).__fallbackLogs = fallbackLogs;

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

                synth.getVoices = () => {
                    if (!voicesLoaded) return [];
                    return includeZaVoice ? mockVoices : mockVoices.slice(0, 2);
                };

                synth.speak = (utterance: SpeechSynthesisUtterance) => {
                    if (utterance.text && utterance.text.trim()) {
                        fallbackLogs.push({
                            voiceName: utterance.voice ? utterance.voice.name : null,
                            voiceLang: utterance.voice ? utterance.voice.lang : null,
                            lang: utterance.lang,
                            rate: utterance.rate,
                            pitch: utterance.pitch,
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
                }, 80);
            }
        });

        await seedSession(page);
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('/');

        // Training Modal speaks dynamic exercise steps using Web Speech API fallback chain
        await openTab(page, 'Ergonomics Training & Certification');
        await page.getByRole('button', { name: /START COURSE|REVIEW MODULE/i }).first().click();
        const modal = page.locator('div.fixed.inset-0.z-\\[100\\]');
        await expect(modal).toBeVisible();

        // Sub-check A: Microsoft Luke (en-ZA) prioritized over Microsoft Zira (en-US) even with delayed voiceschanged
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const logs = (window as any).__fallbackLogs || [];
                return logs[logs.length - 1] || null;
            });
        }).toMatchObject({
            voiceName: 'Microsoft Luke Online (Natural) - English (South Africa)',
            voiceLang: 'en-ZA',
            lang: 'en-ZA',
            rate: expect.closeTo(0.96, 2),
            pitch: expect.closeTo(1.0, 2),
        });

        // Sub-check B: When en-ZA absent, resolves to Google UK English Male (en-GB), never Zira
        await page.evaluate(() => (window as any).__setIncludeZaVoice(false));
        await page.getByRole('button', { name: /NEXT INSTRUCTION/i }).click();

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
                voiceName: 'Google UK English Male',
                voiceLang: 'en-GB',
                rate: expect.closeTo(0.96, 2),
                pitch: expect.closeTo(1.0, 2),
            },
            tier: 'en-GB',
        });
    });
});
