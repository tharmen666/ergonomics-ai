/**
 * ErgoSafe Reborn V3 - Statutory OHS & Ergonomics Regulatory Schema
 * Authoritative South African Statutory Grounding:
 * - Occupational Health and Safety Act 85 of 1993 (Sections 8, 16.2, 17, 37, 38)
 * - Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019):
 *     * Regulation 3: Information, instruction and training
 *     * Regulation 6: Ergonomic Risk Assessment
 *     * Regulation 7: Risk control
 *     * Regulation 8(1): Health assessment & OMP referral criteria
 *     * Regulation 8(2): Medical surveillance records
 *     * Regulation 9: Maintenance of control measures
 *     * Regulation 10(1): Retention of records:
 *         - 40 YEARS: Regulation 6 assessments & Regulation 8(2) medical surveillance
 *         - 3 YEARS: Regulation 7 (risk control) & Regulation 9 (maintenance of control measures) records
 *         - DURATION OF EMPLOYMENT: Regulation 3 employee information, instruction & training
 * - Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025):
 *     * Formally repeals Environmental Regulations for Workplaces 1987
 *     * Regulation 9: Cold stress
 *     * Lighting & Illumination standards
 * - General Safety Regulations (GSR):
 *     * GSR 13H: Housekeeping, aisle clearance & non-slip drainage
 *     * GSR 13J: Emergency Exits & Escape Routes (outward-opening doors, clear egress)
 * - Driven Machinery Regulations (DMR 18) & General Machinery Regulations (GMR 2)
 * - COIDA Act 130 of 1993 (Schedule 3 Occupational Diseases)
 */

export const PHYSICAL_AGENTS_REGS_2024_CITATION = 
  'Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025)';

export const ERGONOMICS_REGS_2019_CITATION = 
  'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)';

export const REPEALED_ENVIRONMENTAL_REGS_1987 = 
  'Environmental Regulations for Workplaces 1987 (Repealed by Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025))';

export const OMP_REFERRAL_STATUTORY_STRING = 
  'Assessment indicates ergonomic risk to health: Referral to Occupational Medicine Practitioner (OMP) recommended under Regulation 8(1)';

export type StatutoryRetentionPeriod = 40 | 3 | 'TENURE';

export type StatutoryRecordCategory =
  | 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR'
  | 'REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR'
  | 'REG_7_9_EQUIPMENT_INSPECTION_LOG_3_YR'
  | 'REG_3_EMPLOYEE_TRAINING_RECORD_TENURE'
  | 'GSR_13_FACILITY_SAFETY_REGISTER_3_YR';

export type StatutoryHazardClassification = 
  | 'PHYSICAL_MMH_OVER_25KG'
  | 'PHYSICAL_CARCASS_HANDLING'
  | 'PHYSICAL_KNIFE_DEBONING'
  | 'PHYSICAL_COLD_ROOM_STRESS_REG_9'
  | 'BIOMECHANICAL_POSTURE_DEVIATION'
  | 'STATUTORY_LEGAL_NON_COMPLIANCE'
  | 'FATIGUE_DRIVER_HOURS';

export type StatutoryComplianceClassification = 
  | 'COMPLIANT'
  | 'RISK_ALERT'
  | 'HIGH_RISK_PRIORITY_ACTION' // Physical hazards (MMH > 25kg, carcass, knife force, cold)
  | 'STATUTORY_BREACH';         // Strictly for legal violations (Sec 16.2, Sec 17, missing Reg 6, uncertified machinery)

export interface StatutoryComplianceMetadata {
  retentionPeriod: StatutoryRetentionPeriod;
  retentionCategory: StatutoryRecordCategory;
  retentionDescription: string;
  isStatutoryBreach: boolean; // True ONLY for actual legal infractions
  requiresOMPReferral: boolean;
  ompReferralStatus?: string;
  statutoryCitation: string;
  hierarchyOfControlsMandate: string;
  competentPersonRequirement: string;
  riskClassification: StatutoryComplianceClassification;
  statutoryNotice: string;
}

export interface IndustryHazardPreset {
  hazardId: string;
  name: string;
  category: StatutoryHazardClassification;
  weightOrMagnitude?: string;
  coldStressCriteria?: string;
  classification: StatutoryComplianceClassification;
  requiresOMPReferral: boolean;
  retentionPeriod: StatutoryRetentionPeriod;
  statutoryReference: string;
  housekeepingReference?: 'GSR 13H';
  egressReference?: 'GSR 13J';
  requiredControls: {
    eliminationOrSubstitution: string;
    engineering: string;
    administrative: string;
    ppe: string;
  };
}

export interface IndustryPresetProfile {
  presetId: string;
  industryName: string;
  subSector: string;
  facilityType: string;
  regulatoryFramework: string[];
  primaryPhysicalHazards: IndustryHazardPreset[];
  retentionPolicies: {
    reg6RiskAssessmentsYears: 40;
    reg8_2MedicalSurveillanceYears: 40;
    reg7And9EquipmentInspectionYears: 3;
    reg3EmployeeTraining: 'TENURE';
    gsr13FacilitiesYears: 3;
  };
  shiftConstraints: {
    /** Site-configured work-warming interval (minutes). Set by the physical agent exposure risk
     *  assessment - NOT a limit prescribed by Reg 9 of GN 5952. null = not yet configured. */
    coldExposureWorkWarmingMinutes?: number | null;
    maxSingleManualLiftKg: 25;
    /** Site policy, not a statutory minimum. */
    siteWarmupBreakMinutes?: number;
  };
}
