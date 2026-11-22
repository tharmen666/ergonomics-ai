// lib/safetyFileEngine.ts
/**
 * LogiGuard Sentinel & OHS Forecourt Haven - Generic OHS Safety File & Risk Assessment Generator
 * Author: Desigan Tharmen / Brilliant Group One
 * Purpose: Generates brand-neutral, customizable OHS Safety Files, Risk Assessment templates,
 *          and statutory site checklists ready for site-specific input and printing.
 */

export interface SiteDetails {
  siteName: string;
  physicalAddress: string;
  managerName: string;
  safetyRepresentative: string;
  effectiveDate: string;
}

export interface RiskAssessmentItem {
  hazardCategory: string;
  hazardDescription: string;
  initialLikelihood: number; // 1-5
  initialSeverity: number;   // 1-5
  controlMeasures: string;
  residualRiskRating: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MasterSafetyFileSection {
  sectionNumber: number;
  title: string;
  content: string;
}

export interface MasterSafetyFile {
  header: {
    title: string;
    standardCompliance: string;
    siteName: string;
    address: string;
    siteManager: string;
    safetyRep: string;
    dateGenerated: string;
  };
  sections: MasterSafetyFileSection[];
}

function normalizeGovernanceText(value: string): string {
  if (!value) return '';
  return value
    .replace(/\bRoof\s*King(?:\s*\(Pty\)\s*Ltd)?\b/gi, 'BRILLIANT GROUP ONE')
    .replace(/\bVEDAN\b/gi, 'VESHAN')
    .trim();
}

export class SafetyFileEngine {
  /**
   * Generates a generic, brand-neutral OHS Safety File structure with customizable site details.
   */
  public static generateMasterSafetyFile(details: SiteDetails): MasterSafetyFile {
    const cleanSite = normalizeGovernanceText(details.siteName);
    const cleanAddress = normalizeGovernanceText(details.physicalAddress);
    const cleanManager = normalizeGovernanceText(details.managerName);
    const cleanSafetyRep = normalizeGovernanceText(details.safetyRepresentative);

    return {
      header: {
        title: "OCCUPATIONAL HEALTH & SAFETY MASTER FILE",
        standardCompliance: "Complying with OHS Act 85 of 1993 and Regional Safety Regulations",
        siteName: cleanSite || "[ENTER SITE / FACILITY NAME]",
        address: cleanAddress || "[ENTER PHYSICAL ADDRESS]",
        siteManager: cleanManager || "[ENTER APPOINTED 16.1 / 16.2 MANAGER]",
        safetyRep: cleanSafetyRep || "[ENTER ELECTED SAFETY REP]",
        dateGenerated: details.effectiveDate || new Date().toISOString().split('T')[0]
      },
      sections: [
        {
          sectionNumber: 1,
          title: "Health & Safety Policy Statement",
          content: "Management is committed to providing and maintaining a safe and healthy working environment for all employees, contractors, and visitors..."
        },
        {
          sectionNumber: 2,
          title: "Legal Appointments & Organizational Structure",
          content: "Mandatory statutory appointments including Section 16.2 Assignees, Health & Safety Representatives, Incident Investigators, and First Aiders."
        },
        {
          sectionNumber: 3,
          title: "Baseline Risk Assessments & Safe Operating Procedures",
          content: "Comprehensive hazard identification and control measures for forecourt operations, fuel offloading, retail shop, and hazardous substance storage."
        },
        {
          sectionNumber: 4,
          title: "Incident Reporting & Investigation Register",
          content: "Standardized protocols for recording near-misses, first-aid injuries, and reportable incidents under General Administrative Regulation 9."
        },
        {
          sectionNumber: 5,
          title: "Emergency Preparedness & Evacuation Procedures",
          content: "9-Step Emergency Evacuation, 8-Step Spill Response, and P.A.S.S. Firefighting protocols."
        },
        {
          sectionNumber: 6,
          title: "Statutory Inspection Checklists",
          content: "Daily, weekly, and monthly audit schedules for fire extinguishers, spill kits, earthing bonds, and electrical compliance."
        }
      ]
    };
  }

  /**
   * Standard Risk Assessment templates for petroleum retail and hospitality environments.
   */
  public static getStandardRiskAssessmentTemplates(): RiskAssessmentItem[] {
    return [
      {
        hazardCategory: "Petroleum & Flammable Liquids",
        hazardDescription: "Uncontrolled hydrocarbon vapor release or spill during tanker offloading.",
        initialLikelihood: 3,
        initialSeverity: 4,
        controlMeasures: "Mandatory pre-drop checklist, wheel chocking, static earthing bond connection, and locked spill kit verification.",
        residualRiskRating: "LOW"
      },
      {
        hazardCategory: "Physical Hazards",
        hazardDescription: "Slips, trips, and falls due to wet floors, oil drips, or walkway obstructions.",
        initialLikelihood: 4,
        initialSeverity: 2,
        controlMeasures: "Regular housekeeping, immediate clean-up of spills, 'Wet Floor' signage deployed, and non-slip footwear compliance.",
        residualRiskRating: "LOW"
      },
      {
        hazardCategory: "Electrical Safety",
        hazardDescription: "Electric shock or arc flash from damaged extension leads, plugs, or distribution boards near wet zones.",
        initialLikelihood: 2,
        initialSeverity: 4,
        controlMeasures: "Socket outlets kept >1m from running water, regular PAT testing, and restricted access to DB rooms.",
        residualRiskRating: "MEDIUM"
      },
      {
        hazardCategory: "Security & Cash Handling",
        hazardDescription: "Armed robbery or cash-in-transit security threats during night shifts.",
        initialLikelihood: 3,
        initialSeverity: 5,
        controlMeasures: "Drop safes installed, silent panic alarms connected to armed response, limited cash on hand, and CCTV monitoring.",
        residualRiskRating: "MEDIUM"
      }
    ];
  }
}

