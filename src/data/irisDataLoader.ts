/**
 * IRIS CORE DATA LOADER
 * 
 * High-performance data loading and caching for Iris safety content
 * Supports both JSON and TypeScript imports
 * Optimized for frontend, mobile, and compliance dashboard integration
 */

import irisData from "./irisCore.json";
import type {
  IrisCoreDatabase,
  SOPTrack,
  FAQCard,
  LocaleCode,
  BilingualContent,
} from "./irisSchema";

class IrisCoreDataManager {
  private database: IrisCoreDatabase;
  private sopIndex: Map<string, SOPTrack> = new Map();
  private faqIndex: Map<number, FAQCard> = new Map();
  private cacheTimestamp: number = 0;

  constructor() {
    this.database = irisData as IrisCoreDatabase;
    this.buildIndices();
    this.cacheTimestamp = Date.now();
  }

  /**
   * Build lookup indices for O(1) access
   */
  private buildIndices(): void {
    // Emergency SOPs
    this.database.sideA_EmergencySOPs.forEach((sop) => {
      this.sopIndex.set(sop.id, sop);
    });

    // Service SOPs
    this.database.sideB_ServiceRoutines.forEach((sop) => {
      this.sopIndex.set(sop.id, sop);
    });

    // FAQ Deck
    this.database.astronTransitionDeck.forEach((card) => {
      this.faqIndex.set(card.cardNumber, card);
    });
  }

  /**
   * Get a single SOP by ID
   */
  getSOP(id: string): SOPTrack | null {
    return this.sopIndex.get(id) || null;
  }

  /**
   * Get a single FAQ card by number
   */
  getFAQCard(cardNumber: number): FAQCard | null {
    return this.faqIndex.get(cardNumber) || null;
  }

  /**
   * Get all emergency SOPs
   */
  getEmergencySOPs(): SOPTrack[] {
    return [...this.database.sideA_EmergencySOPs];
  }

  /**
   * Get all service routine SOPs
   */
  getServiceSOPs(): SOPTrack[] {
    return [...this.database.sideB_ServiceRoutines];
  }

  /**
   * Get all SOPs combined
   */
  getAllSOPs(): SOPTrack[] {
    return [...this.database.sideA_EmergencySOPs, ...this.database.sideB_ServiceRoutines];
  }

  /**
   * Get entire FAQ deck (5-card Astron Energy transition deck)
   */
  getFAQDeck(): FAQCard[] {
    return [...this.database.astronTransitionDeck];
  }

  /**
   * Get Iris personality profile
   */
  getIrisPersonality() {
    return this.database.irisPersonality;
  }

  /**
   * Get localized text from bilingual content
   */
  getLocalizedText(content: BilingualContent, locale: LocaleCode = "en"): string {
    return content[locale] || content.en;
  }

  /**
   * Get all content in a specific language
   */
  getAllContentByLocale(locale: LocaleCode) {
    return {
      emergencySOPs: this.database.sideA_EmergencySOPs.map((sop) => ({
        ...sop,
        trackTitle: this.getLocalizedText(sop.trackTitle, locale),
        irisVoiceIntro: this.getLocalizedText(sop.irisVoiceIntro, locale),
        irisClosingDirective: this.getLocalizedText(sop.irisClosingDirective, locale),
      })),
      serviceSOPs: this.database.sideB_ServiceRoutines.map((sop) => ({
        ...sop,
        trackTitle: this.getLocalizedText(sop.trackTitle, locale),
        irisVoiceIntro: this.getLocalizedText(sop.irisVoiceIntro, locale),
        irisClosingDirective: this.getLocalizedText(sop.irisClosingDirective, locale),
      })),
      faqDeck: this.database.astronTransitionDeck.map((card) => ({
        ...card,
        question: this.getLocalizedText(card.question, locale),
        answer: this.getLocalizedText(card.answer, locale),
        irisProtocolTip: this.getLocalizedText(card.irisProtocolTip, locale),
      })),
    };
  }

  /**
   * Search SOPs by keyword
   */
  searchSOPs(keyword: string, locale: LocaleCode = "en"): SOPTrack[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.getAllSOPs().filter((sop) => {
      const title = this.getLocalizedText(sop.trackTitle, locale).toLowerCase();
      const intro = this.getLocalizedText(sop.irisVoiceIntro, locale).toLowerCase();
      return title.includes(lowerKeyword) || intro.includes(lowerKeyword);
    });
  }

  /**
   * Get SOPs by priority level
   */
  getSOPsByPriority(priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"): SOPTrack[] {
    return this.getAllSOPs().filter((sop) => sop.priority === priority);
  }

  /**
   * Get metadata and version info
   */
  getMetadata() {
    return this.database.metadata;
  }

  /**
   * Check if database is ready for frontend
   */
  isReadyForFrontend(): boolean {
    return (
      this.database.metadata.status === "LOCKED_FOR_FRONTEND" &&
      this.database.frontendIntegration.readyForDevelopment === true
    );
  }

  /**
   * Export database for offline use (JSON)
   */
  exportAsJSON(): string {
    return JSON.stringify(this.database, null, 2);
  }

  /**
   * Get cache metadata for performance monitoring
   */
  getCacheInfo() {
    return {
      timestamp: this.cacheTimestamp,
      totalSOPs: this.sopIndex.size,
      totalFAQCards: this.faqIndex.size,
      version: this.database.metadata.version,
      status: this.database.metadata.status,
    };
  }
}

/**
 * Singleton instance - shared across all components
 */
let instance: IrisCoreDataManager | null = null;

export function getIrisCoreDataManager(): IrisCoreDataManager {
  if (!instance) {
    instance = new IrisCoreDataManager();
  }
  return instance;
}

/**
 * Convenience exports for direct access
 */
export function getSOPById(id: string): SOPTrack | null {
  return getIrisCoreDataManager().getSOP(id);
}

export function getFAQCardByNumber(cardNumber: number): FAQCard | null {
  return getIrisCoreDataManager().getFAQCard(cardNumber);
}

export function getAllSOPs(): SOPTrack[] {
  return getIrisCoreDataManager().getAllSOPs();
}

export function getFAQDeck(): FAQCard[] {
  return getIrisCoreDataManager().getFAQDeck();
}

export function getLocalizedIrisContent(locale: LocaleCode) {
  return getIrisCoreDataManager().getAllContentByLocale(locale);
}

export default getIrisCoreDataManager;
