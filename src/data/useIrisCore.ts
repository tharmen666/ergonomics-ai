/**
 * IRIS REACT HOOKS
 * 
 * React integration layer for Iris Core data
 * Provides hooks for component-level access with caching and localization
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getIrisCoreDataManager,
  getSOPById,
  getFAQCardByNumber,
  getAllSOPs,
  getFAQDeck,
} from "./irisDataLoader";
import type {
  SOPTrack,
  FAQCard,
  LocaleCode,
  IrisCoreDatabase,
} from "./irisSchema";

/**
 * Hook: Get a single SOP by ID
 */
export function useSOPById(sopId: string) {
  const [sop, setSop] = useState<SOPTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = getSOPById(sopId);
      setSop(data);
      setError(data ? null : `SOP not found: ${sopId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [sopId]);

  return { sop, loading, error };
}

/**
 * Hook: Get a single FAQ card by number
 */
export function useFAQCard(cardNumber: number) {
  const [card, setCard] = useState<FAQCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = getFAQCardByNumber(cardNumber);
      setCard(data);
      setError(data ? null : `FAQ card not found: ${cardNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [cardNumber]);

  return { card, loading, error };
}

/**
 * Hook: Get all SOPs
 */
export function useAllSOPs() {
  const [sops, setSops] = useState<SOPTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = getAllSOPs();
      setSops(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { sops, loading };
}

/**
 * Hook: Get FAQ deck (5 cards)
 */
export function useFAQDeck() {
  const [deck, setDeck] = useState<FAQCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = getFAQDeck();
      setDeck(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deck, loading };
}

/**
 * Hook: Get SOPs by priority level
 */
export function useSOPsByPriority(priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW") {
  const { sops } = useAllSOPs();

  return useMemo(() => {
    return sops.filter((sop) => sop.priority === priority);
  }, [sops, priority]);
}

/**
 * Hook: Search SOPs
 */
export function useSearchSOPs(
  keyword: string,
  locale: LocaleCode = "en"
) {
  const { sops } = useAllSOPs();

  return useMemo(() => {
    if (!keyword) return sops;
    const lowerKeyword = keyword.toLowerCase();
    return sops.filter((sop) => {
      const title = sop.trackTitle[locale].toLowerCase();
      const intro = sop.irisVoiceIntro[locale].toLowerCase();
      return title.includes(lowerKeyword) || intro.includes(lowerKeyword);
    });
  }, [sops, keyword, locale]);
}

/**
 * Hook: Get localized content for all SOPs and FAQs
 */
export function useLocalizedIrisContent(locale: LocaleCode = "en") {
  const [content, setContent] = useState({
    emergencySOPs: [] as SOPTrack[],
    serviceSOPs: [] as SOPTrack[],
    faqDeck: [] as FAQCard[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const iris = getIrisCoreDataManager();
      const data = iris.getAllContentByLocale(locale);
      setContent(data);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  return { content, loading };
}

/**
 * Hook: Get Iris personality and communication style
 */
export function useIrisPersonality() {
  const iris = getIrisCoreDataManager();
  return iris.getIrisPersonality();
}

/**
 * Hook: Get database metadata
 */
export function useIrisMetadata() {
  const iris = getIrisCoreDataManager();
  return iris.getMetadata();
}

/**
 * Hook: Check if database is ready for frontend
 */
export function useIrisReady() {
  const [isReady, setIsReady] = useState(false);
  const [cacheInfo, setCacheInfo] = useState({
    timestamp: 0,
    totalSOPs: 0,
    totalFAQCards: 0,
    version: "",
    status: "",
  });

  useEffect(() => {
    const iris = getIrisCoreDataManager();
    setIsReady(iris.isReadyForFrontend());
    setCacheInfo(iris.getCacheInfo());
  }, []);

  return { isReady, cacheInfo };
}

/**
 * Hook: Get single SOP with localization
 */
export function useLocalizedSOP(sopId: string, locale: LocaleCode = "en") {
  const { sop, loading, error } = useSOPById(sopId);

  const localizedSop = useMemo(() => {
    if (!sop) return null;
    return {
      ...sop,
      trackTitle: sop.trackTitle[locale],
      irisVoiceIntro: sop.irisVoiceIntro[locale],
      irisClosingDirective: sop.irisClosingDirective[locale],
    };
  }, [sop, locale]);

  return { sop: localizedSop, loading, error };
}

/**
 * Hook: Get single FAQ card with localization
 */
export function useLocalizedFAQCard(
  cardNumber: number,
  locale: LocaleCode = "en"
) {
  const { card, loading, error } = useFAQCard(cardNumber);

  const localizedCard = useMemo(() => {
    if (!card) return null;
    return {
      ...card,
      question: card.question[locale],
      answer: card.answer[locale],
      irisProtocolTip: card.irisProtocolTip[locale],
    };
  }, [card, locale]);

  return { card: localizedCard, loading, error };
}

/**
 * Hook: Get entire FAQ deck with localization
 */
export function useLocalizedFAQDeck(locale: LocaleCode = "en") {
  const { deck, loading } = useFAQDeck();

  const localizedDeck = useMemo(() => {
    return deck.map((card) => ({
      ...card,
      question: card.question[locale],
      answer: card.answer[locale],
      irisProtocolTip: card.irisProtocolTip[locale],
    }));
  }, [deck, locale]);

  return { deck: localizedDeck, loading };
}

/**
 * Hook: Emergency SOPs only (CRITICAL priority)
 */
export function useCriticalSOPs() {
  return useSOPsByPriority("CRITICAL");
}

/**
 * Hook: Locale preference with storage
 */
export function useLocalePreference(
  defaultLocale: LocaleCode = "en"
): [LocaleCode, (locale: LocaleCode) => void] {
  const [locale, setLocaleState] = useState<LocaleCode>(
    (localStorage.getItem("irisLocale") as LocaleCode) || defaultLocale
  );

  const setLocale = useCallback((newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    localStorage.setItem("irisLocale", newLocale);
  }, []);

  return [locale, setLocale];
}

/**
 * Hook: Bulk operations - get all emergency + service SOPs with localization
 */
export function useAllLocalizedSOPs(locale: LocaleCode = "en") {
  const { content, loading } = useLocalizedIrisContent(locale);

  const allSOPs = useMemo(() => {
    return [...content.emergencySOPs, ...content.serviceSOPs];
  }, [content]);

  return { allSOPs, loading };
}

export default {
  useSOPById,
  useFAQCard,
  useAllSOPs,
  useFAQDeck,
  useSOPsByPriority,
  useSearchSOPs,
  useLocalizedIrisContent,
  useIrisPersonality,
  useIrisMetadata,
  useIrisReady,
  useLocalizedSOP,
  useLocalizedFAQCard,
  useLocalizedFAQDeck,
  useCriticalSOPs,
  useLocalePreference,
  useAllLocalizedSOPs,
};
