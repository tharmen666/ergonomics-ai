import type { Language } from './translations';

export type NellyVoiceTier = 'en-ZA' | 'en-GB' | 'en-fallback' | 'default';

export interface ResolvedNellyVoice {
    voice: SpeechSynthesisVoice | null;
    name: string;
    lang: string;
    tier: NellyVoiceTier;
    targetLocale: 'en-ZA';
    rate: number;
    pitch: number;
}

export interface RegionalSubtitleDefault {
    countryCode: string;
    defaultLanguage: Language;
    supportedFallbacks: Language[];
    regionName: string;
}

export const NELLY_VOICE_PROFILE = {
    voiceId: 'en-ZA-LukeNeural' as const,
    persona: 'male' as const,
    locale: 'en-ZA' as const,
    rate: 0.96,
    pitch: 1.0,
    preferredZaVoices: [
        'microsoft luke online (natural) - english (south africa)',
        'microsoft luke online',
        'microsoft luke',
        'luke',
        'google english (south africa)',
        'google south africa english male',
    ],
    preferredGbVoices: [
        'microsoft ryan online (natural)',
        'microsoft thomas online (natural)',
        'microsoft ryan',
        'microsoft thomas',
        'google uk english male',
        'microsoft george',
        'daniel',
        'arthur',
        'oliver',
    ],
    preferredFallbackMaleVoices: [
        'microsoft guy',
        'microsoft andrew',
        'microsoft christopher',
        'microsoft eric',
        'microsoft david',
        'google us english male',
        'alex',
        'fred',
        'james',
        'mark',
    ],
    femaleVoiceRegex:
        /\b(leah|leah online|zira|jenny|aria|susan|hazel|libby|sonia|samantha|karen|victoria|ayanda|female|woman|kate|serena|martha|moira|tessa)\b/i,
} as const;

export const REGIONAL_SUBTITLE_DEFAULTS: Record<string, RegionalSubtitleDefault> = {
    ZA: {
        countryCode: 'ZA',
        defaultLanguage: 'zu',
        supportedFallbacks: ['en', 'zu', 'xh', 'st', 'af'],
        regionName: 'Southern Africa (South Africa)',
    },
    KE: {
        countryCode: 'KE',
        defaultLanguage: 'sw',
        supportedFallbacks: ['en', 'sw'],
        regionName: 'East Africa (Kenya)',
    },
    TZ: {
        countryCode: 'TZ',
        defaultLanguage: 'sw',
        supportedFallbacks: ['en', 'sw'],
        regionName: 'East Africa (Tanzania)',
    },
    UG: {
        countryCode: 'UG',
        defaultLanguage: 'sw',
        supportedFallbacks: ['en', 'sw'],
        regionName: 'East Africa (Uganda)',
    },
    FR: {
        countryCode: 'FR',
        defaultLanguage: 'fr',
        supportedFallbacks: ['en', 'fr'],
        regionName: 'Francophone / Europe (France)',
    },
    DEFAULT: {
        countryCode: 'GLOBAL',
        defaultLanguage: 'en',
        supportedFallbacks: ['en', 'sw', 'zu', 'xh', 'st', 'af', 'fr'],
        regionName: 'Global / International',
    },
};

export function resolveDefaultSubtitleLanguage(geoCountryCode?: string): Language {
    if (!geoCountryCode) return REGIONAL_SUBTITLE_DEFAULTS.DEFAULT.defaultLanguage;
    const config =
        REGIONAL_SUBTITLE_DEFAULTS[geoCountryCode.toUpperCase()] || REGIONAL_SUBTITLE_DEFAULTS.DEFAULT;
    return config.defaultLanguage;
}

const normalizeLang = (lang?: string): string => (lang || '').toLowerCase().replace(/_/g, '-');

const buildResolved = (
    voice: SpeechSynthesisVoice | null,
    tier: NellyVoiceTier
): ResolvedNellyVoice => ({
    voice,
    name: voice?.name || 'en-ZA-LukeNeural (Default)',
    lang: voice?.lang || NELLY_VOICE_PROFILE.locale,
    tier,
    targetLocale: NELLY_VOICE_PROFILE.locale,
    rate: NELLY_VOICE_PROFILE.rate,
    pitch: NELLY_VOICE_PROFILE.pitch,
});

/**
 * Resolves Nelly's English voice strictly matching the demo video male narrator (en-ZA-LukeNeural):
 * Tier 1: en-ZA male voices (Microsoft Luke Online (Natural) - English (South Africa), etc.)
 * Tier 2: en-GB natural male voices (Microsoft Ryan/Thomas Online, Google UK English Male, George, Daniel)
 * Tier 3: Default English male fallback (Microsoft Guy, Andrew, David, Google US English Male)
 * Tier 4: First non-female or default system voice
 */
export function resolveNellyVoice(voices: SpeechSynthesisVoice[]): ResolvedNellyVoice {
    if (!voices || voices.length === 0) {
        return buildResolved(null, 'default');
    }

    const { preferredZaVoices, preferredGbVoices, preferredFallbackMaleVoices, femaleVoiceRegex } =
        NELLY_VOICE_PROFILE;

    // Tier 1: en-ZA male voices (and any en-ZA voice before leaving South African English)
    for (const pattern of preferredZaVoices) {
        const match = voices.find((v) => {
            const normLang = normalizeLang(v.lang);
            const lowerName = (v.name || '').toLowerCase();
            return (
                !femaleVoiceRegex.test(v.name || '') &&
                lowerName.includes(pattern) &&
                (normLang.startsWith('en-za') ||
                    lowerName.includes('south africa') ||
                    lowerName.includes('luke'))
            );
        });
        if (match) return buildResolved(match, 'en-ZA');
    }

    const anyZaNonFemale = voices.find(
        (v) => normalizeLang(v.lang).startsWith('en-za') && !femaleVoiceRegex.test(v.name || '')
    );
    if (anyZaNonFemale) return buildResolved(anyZaNonFemale, 'en-ZA');

    const anyZaVoice = voices.find((v) => normalizeLang(v.lang).startsWith('en-za'));
    if (anyZaVoice) return buildResolved(anyZaVoice, 'en-ZA');

    // Tier 2: en-GB natural male voices
    for (const pattern of preferredGbVoices) {
        const match = voices.find(
            (v) =>
                (v.name || '').toLowerCase().includes(pattern) &&
                !femaleVoiceRegex.test(v.name || '')
        );
        if (match) return buildResolved(match, 'en-GB');
    }

    const gbNaturalMale = voices.find(
        (v) =>
            normalizeLang(v.lang).startsWith('en-gb') &&
            /natural|online|google|neural|male/i.test(v.name || '') &&
            !femaleVoiceRegex.test(v.name || '')
    );
    if (gbNaturalMale) return buildResolved(gbNaturalMale, 'en-GB');

    const anyGbNonFemale = voices.find(
        (v) => normalizeLang(v.lang).startsWith('en-gb') && !femaleVoiceRegex.test(v.name || '')
    );
    if (anyGbNonFemale) return buildResolved(anyGbNonFemale, 'en-GB');

    // Tier 3: Default English male fallback
    for (const pattern of preferredFallbackMaleVoices) {
        const match = voices.find(
            (v) =>
                (v.name || '').toLowerCase().includes(pattern) &&
                !femaleVoiceRegex.test(v.name || '')
        );
        if (match) return buildResolved(match, 'en-fallback');
    }

    const enMaleRegexMatch = voices.find(
        (v) =>
            normalizeLang(v.lang).startsWith('en') &&
            /\bmale\b|man|natural|neural/i.test(v.name || '') &&
            !femaleVoiceRegex.test(v.name || '')
    );
    if (enMaleRegexMatch) return buildResolved(enMaleRegexMatch, 'en-fallback');

    const anyEnNonFemale = voices.find(
        (v) => normalizeLang(v.lang).startsWith('en') && !femaleVoiceRegex.test(v.name || '')
    );
    if (anyEnNonFemale) return buildResolved(anyEnNonFemale, 'en-fallback');

    const anyEnVoice = voices.find((v) => normalizeLang(v.lang).startsWith('en'));
    if (anyEnVoice) return buildResolved(anyEnVoice, 'en-fallback');

    // Tier 4: Any non-female system voice
    const nonFemaleAny = voices.find((v) => !femaleVoiceRegex.test(v.name || ''));
    return buildResolved(nonFemaleAny || voices[0] || null, 'default');
}
