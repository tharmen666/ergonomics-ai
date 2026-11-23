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
    locale: 'en-ZA' as const,
    rate: 0.96,
    pitch: 1.02,
    preferredZaVoices: [
        'microsoft leah online (natural) - english (south africa)',
        'microsoft leah online',
        'microsoft leah',
        'google english (south africa)',
        'google south africa english female',
        'leah',
        'ayanda',
    ],
    preferredGbVoices: [
        'microsoft libby online (natural)',
        'microsoft sonia online (natural)',
        'microsoft libby',
        'microsoft sonia',
        'google uk english female',
        'microsoft hazel',
        'microsoft susan',
        'serena',
        'kate',
        'martha',
    ],
    preferredFallbackFemaleVoices: [
        'microsoft jenny',
        'microsoft aria',
        'microsoft zira desktop',
        'microsoft zira',
        'google us english female',
        'samantha',
        'karen',
        'victoria',
        'moira',
        'tessa',
    ],
    maleVoiceRegex:
        /\b(david|mark|george|richard|male|guy|adam|alex|daniel|fred|james|jorge|rishi|tom|stefan|luke|ryan|christopher|eric|roger|steffan)\b/i,
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
    name: voice?.name || 'System en-ZA Default',
    lang: voice?.lang || NELLY_VOICE_PROFILE.locale,
    tier,
    targetLocale: NELLY_VOICE_PROFILE.locale,
    rate: NELLY_VOICE_PROFILE.rate,
    pitch: NELLY_VOICE_PROFILE.pitch,
});

/**
 * Resolves Nelly's English voice strictly following the South African English (en-ZA) profile:
 * Tier 1: en-ZA female voices (Microsoft Leah Online (Natural), Google English (South Africa), etc.)
 * Tier 2: en-GB natural female voices (Microsoft Libby/Sonia Online, Google UK English Female, etc.)
 * Tier 3: Default non-male female English voice fallback
 * Tier 4: First non-male or default system voice
 */
export function resolveNellyVoice(voices: SpeechSynthesisVoice[]): ResolvedNellyVoice {
    if (!voices || voices.length === 0) {
        return buildResolved(null, 'default');
    }

    const { preferredZaVoices, preferredGbVoices, preferredFallbackFemaleVoices, maleVoiceRegex } =
        NELLY_VOICE_PROFILE;

    // Tier 1: en-ZA female voices
    for (const pattern of preferredZaVoices) {
        const match = voices.find((v) => {
            const normLang = normalizeLang(v.lang);
            const lowerName = (v.name || '').toLowerCase();
            return (
                !maleVoiceRegex.test(v.name || '') &&
                lowerName.includes(pattern) &&
                (normLang.startsWith('en-za') ||
                    lowerName.includes('south africa') ||
                    lowerName.includes('leah'))
            );
        });
        if (match) return buildResolved(match, 'en-ZA');
    }

    const anyZaFemale = voices.find(
        (v) => normalizeLang(v.lang).startsWith('en-za') && !maleVoiceRegex.test(v.name || '')
    );
    if (anyZaFemale) return buildResolved(anyZaFemale, 'en-ZA');

    // Tier 2: en-GB natural female voices
    for (const pattern of preferredGbVoices) {
        const match = voices.find(
            (v) =>
                (v.name || '').toLowerCase().includes(pattern) &&
                !maleVoiceRegex.test(v.name || '')
        );
        if (match) return buildResolved(match, 'en-GB');
    }

    const gbNaturalFemale = voices.find(
        (v) =>
            normalizeLang(v.lang).startsWith('en-gb') &&
            /natural|online|google|neural|female/i.test(v.name || '') &&
            !maleVoiceRegex.test(v.name || '')
    );
    if (gbNaturalFemale) return buildResolved(gbNaturalFemale, 'en-GB');

    const anyGbNonMale = voices.find(
        (v) => normalizeLang(v.lang).startsWith('en-gb') && !maleVoiceRegex.test(v.name || '')
    );
    if (anyGbNonMale) return buildResolved(anyGbNonMale, 'en-GB');

    // Tier 3: Default female English fallback
    for (const pattern of preferredFallbackFemaleVoices) {
        const match = voices.find(
            (v) =>
                (v.name || '').toLowerCase().includes(pattern) &&
                !maleVoiceRegex.test(v.name || '')
        );
        if (match) return buildResolved(match, 'en-fallback');
    }

    const enFemaleRegexMatch = voices.find(
        (v) =>
            normalizeLang(v.lang).startsWith('en') &&
            /female|woman|natural|neural/i.test(v.name || '') &&
            !maleVoiceRegex.test(v.name || '')
    );
    if (enFemaleRegexMatch) return buildResolved(enFemaleRegexMatch, 'en-fallback');

    const anyEnNonMale = voices.find(
        (v) => normalizeLang(v.lang).startsWith('en') && !maleVoiceRegex.test(v.name || '')
    );
    if (anyEnNonMale) return buildResolved(anyEnNonMale, 'en-fallback');

    // Tier 4: Any non-male system voice
    const nonMaleAny = voices.find((v) => !maleVoiceRegex.test(v.name || ''));
    return buildResolved(nonMaleAny || voices[0] || null, 'default');
}

