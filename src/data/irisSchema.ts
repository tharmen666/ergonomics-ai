/**
 * IRIS CORE SCHEMA - TypeScript Type Definitions
 * 
 * Authoritative schema for all Safety Lanyard and FAQ content
 * Ensures type safety across frontend, mobile, and compliance systems
 * Language support: English (en) + isiZulu (zu)
 */

export interface BilingualContent {
  en: string;
  zu: string;
}

export interface BilingualRationale {
  en: string;
  zu: string;
}

export interface SOPStep {
  stepNumber: number;
  instruction: BilingualContent;
  rationale?: BilingualRationale;
  safetyGear?: string[];
  duration?: string;
  notes?: string;
  salesOpportunity?: string;
  paymentMethods?: string[];
  loyaltyPrompt?: string;
}

export interface SOPTrack {
  id: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  trackTitle: BilingualContent;
  hazardLevel?: "EXTREME" | "HIGH" | "MEDIUM" | "LOW";
  timeLimit?: string;
  performanceMetrics?: {
    targetTimePerVehicle?: string;
    customerSatisfactionWeight?: number;
    safetyCompliance?: string;
  };
  irisVoiceIntro: BilingualContent;
  steps: SOPStep[];
  irisClosingDirective: BilingualContent;
}

export interface FAQCard {
  cardNumber: number;
  question: BilingualContent;
  answer: BilingualContent;
  irisProtocolTip: BilingualContent;
  customerConcernLevel?: "LOW" | "MEDIUM" | "HIGH";
  upsellopportunity?: boolean;
  recoveryOpportunity?: boolean;
}

export interface IrisPersonalityProfile {
  callSign: "Iris";
  roleTitle: string;
  communicationStyle: BilingualContent;
  coreValues: BilingualContent;
}

export interface FrontendIntegration {
  screenCompatibility: string[];
  apiEndpoints: {
    getSOP: string;
    getFAQCard: string;
    getAllSOPs: string;
    getIrisVoice: string;
  };
  readyForDevelopment: boolean;
  lastUpdated: string;
}

export interface IrisCoreDatabase {
  metadata: {
    version: string;
    system: string;
    persona: string;
    targetVertical: string;
    localization: string[];
    buildDate: string;
    status: "LOCKED_FOR_FRONTEND" | "IN_DEVELOPMENT" | "DEPRECATED";
  };
  irisPersonality: IrisPersonalityProfile;
  sideA_EmergencySOPs: SOPTrack[];
  sideB_ServiceRoutines: SOPTrack[];
  astronTransitionDeck: FAQCard[];
  frontendIntegration: FrontendIntegration;
}

/**
 * Type guards and utility types
 */

export type LocaleCode = "en" | "zu";

export interface LocalizedContent {
  locale: LocaleCode;
  content: string;
}

export type SOPCategory = "Emergency" | "Service";

export interface SOPIndex {
  [id: string]: SOPTrack;
}

export interface FAQIndex {
  [cardNumber: number]: FAQCard;
}

/**
 * Runtime validation helpers
 */

export function isValidLocale(locale: unknown): locale is LocaleCode {
  return locale === "en" || locale === "zu";
}

export function getLocalizedText(
  bilingualContent: BilingualContent,
  locale: LocaleCode
): string {
  return bilingualContent[locale] || bilingualContent.en;
}

export function validateSOPTrack(sop: unknown): sop is SOPTrack {
  if (typeof sop !== "object" || !sop) return false;
  const track = sop as Record<string, unknown>;
  return (
    typeof track.id === "string" &&
    typeof track.trackTitle === "object" &&
    Array.isArray(track.steps)
  );
}

export function validateFAQCard(card: unknown): card is FAQCard {
  if (typeof card !== "object" || !card) return false;
  const faq = card as Record<string, unknown>;
  return (
    typeof faq.cardNumber === "number" &&
    typeof faq.question === "object" &&
    typeof faq.answer === "object"
  );
}
