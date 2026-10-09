/**
 * ErgoSafe Reborn V3 - Industry Presets & Deterministic Statutory Guardrails
 * Strictly Grounded in South African Legislation:
 * - Occupational Health and Safety Act 85 of 1993 (Sections 8, 16.2, 17, 37, 38)
 * - Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019):
 *     * Regulation 3: Employee information and training (Retained for duration of employment)
 *     * Regulation 6: Ergonomic Risk Assessment (Retained for 40 years)
 *     * Regulation 8(1): Referral to Occupational Medicine Practitioner (OMP)
 *     * Regulation 8(2): Medical surveillance records (Retained for 40 years)
 *     * Regulations 7 & 9: Maintenance & inspection of control measures (Retained for 3 years)
 *     * Regulation 10(1): Comprehensive 3-tier record retention schedule
 * - Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025):
 *     * Formally repeals the Environmental Regulations for Workplaces 1987
 *     * Regulation 9: Cold stress
 * - General Safety Regulations: GSR 13H (Housekeeping) & GSR 13J (Emergency Exits/Egress)
 */

import { IndustryPresetProfile } from '../types/statutory';

export const OMP_REFERRAL_STATUTORY_STRING = 
  "Assessment indicates ergonomic risk to health: Referral to Occupational Medicine Practitioner (OMP) recommended under Regulation 8(1)";

export const wholesaleCashCarryPreset: IndustryPresetProfile = {
  presetId: 'preset-za-wholesale-cash-carry-01',
  industryName: 'Wholesale Cash & Carry',
  subSector: 'FMCG Bulk Warehousing & Cash & Carry Distribution',
  facilityType: 'High-Volume Wholesale Cash & Carry Depot Floor',
  regulatoryFramework: [
    'Occupational Health and Safety Act 85 of 1993 (Sections 8, 16.2, 37)',
    'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) - Reg 3, 6, 8(1), 8(2), 10(1)',
    'Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025) (Repealing ERW 1987)',
    'General Safety Regulations - GSR 13H (Housekeeping) & GSR 13J (Emergency Egress)',
    'COIDA Act 130 of 1993'
  ],
  shiftConstraints: {
    maxSingleManualLiftKg: 25,
    siteWarmupBreakMinutes: 10
  },
  retentionPolicies: {
    reg6RiskAssessmentsYears: 40,
    reg8_2MedicalSurveillanceYears: 40,
    reg7And9EquipmentInspectionYears: 3,
    reg3EmployeeTraining: 'TENURE',
    gsr13FacilitiesYears: 3
  },
  primaryPhysicalHazards: [
    {
      hazardId: 'WCC-HZ-001',
      name: 'Manual Handling > 25 kg (Cash & Carry Bulk Bags / Heavy Cartons)',
      category: 'PHYSICAL_MMH_OVER_25KG',
      weightOrMagnitude: '> 25 kg to 50 kg (Maize meal sacks, sugar, flour, bulk oil)',
      classification: 'HIGH_RISK_PRIORITY_ACTION',
      requiresOMPReferral: true,
      retentionPeriod: 40,
      statutoryReference: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1); OHS Act Sec 8(2)(b)',
      housekeepingReference: 'GSR 13H',
      requiredControls: {
        eliminationOrSubstitution: 'Automate pallet depalletization; enforce supplier sack weight ceilings <= 20kg where feasible.',
        engineering: 'Provide pneumatic vacuum bag lifters, hydraulic scissor-lift positioners, and spring-loaded self-leveling trolleys (maintenance logs retained 3 years under Regs 7 & 9).',
        administrative: 'Mandatory 2-person team lift protocol for any lift > 25 kg; rotational task switching every 2 hours; provide employee training (retained for employee tenure under Reg 3).',
        ppe: 'Metatarsal steel-toe safety boots (GSR 2), non-slip high-grip gloves.'
      }
    },
    {
      hazardId: 'WCC-HZ-002',
      name: 'High-Bay Pallet Racking Reaching (>1.8m) & Egress Aisle Housekeeping',
      category: 'BIOMECHANICAL_POSTURE_DEVIATION',
      classification: 'HIGH_RISK_PRIORITY_ACTION',
      requiresOMPReferral: false,
      retentionPeriod: 40,
      statutoryReference: 'Ergonomics Regulations, 2019 (GN R1589) Reg 6 & 10(1); GSR 13H (Housekeeping) & GSR 13J (Emergency Exits/Egress)',
      housekeepingReference: 'GSR 13H',
      egressReference: 'GSR 13J',
      requiredControls: {
        eliminationOrSubstitution: 'Golden-zone slotting: keep high-velocity stock between knee and chest level.',
        engineering: 'Order-picking electric reach trucks, certified mobile safety ladders with dual handrails.',
        administrative: 'Enforce GSR 13H housekeeping to keep aisles clear of wrapping plastic; verify GSR 13J outward-opening emergency exits remain unobstructed.',
        ppe: 'High-visibility safety vests, industrial hard hats.'
      }
    },
    {
      hazardId: 'WCC-HZ-003',
      name: 'Customer & Operator Manual Pallet Jack Pulling (>500kg Rolling Gross Weight)',
      category: 'PHYSICAL_MMH_OVER_25KG',
      weightOrMagnitude: '> 500 kg gross rolling load across retail floor and dispatch',
      classification: 'HIGH_RISK_PRIORITY_ACTION',
      requiresOMPReferral: true,
      retentionPeriod: 40,
      statutoryReference: 'Ergonomics Regulations, 2019 (GN R1589) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1); OHS Act Sec 8(2)',
      requiredControls: {
        eliminationOrSubstitution: 'Phase out customer-facing manual pallet jacks in favor of powered electric pallet jacks (EPJs).',
        engineering: 'Scheduled polyurethane wheel bearing maintenance and floor expansion joint leveling (inspection logs kept 3 years under Regs 7 & 9).',
        administrative: 'Strict operating standard mandating forward pushing rather than awkward backward pulling; designated customer transfer bays.',
        ppe: 'Steel-toe puncture-resistant boots.'
      }
    },
    {
      hazardId: 'WCC-HZ-004',
      name: 'Loading Yard Traffic, Forklift Segregation & Bulk Stack Display',
      category: 'BIOMECHANICAL_POSTURE_DEVIATION',
      classification: 'HIGH_RISK_PRIORITY_ACTION',
      requiresOMPReferral: false,
      retentionPeriod: 40,
      statutoryReference: 'OHS Act Section 8; General Safety Regulations GSR 13H; Driven Machinery Regulations DMR 18',
      housekeepingReference: 'GSR 13H',
      egressReference: 'GSR 13J',
      requiredControls: {
        eliminationOrSubstitution: 'Enforce physical pedestrian walkways segregated from reach trucks and counterbalance forklifts.',
        engineering: 'Floor painted demarking 2.25 m² clear staging zones (GSR 13H), impact-absorbing safety bollards, blue spot LED reverse warning beacons.',
        administrative: 'Certified competency verification for all DMR 18 driven machinery operators; maximum stack height controls on bulk display pyramids.',
        ppe: 'Class 3 high-visibility safety reflective bibs, steel-toe boots.'
      }
    }
  ]
};

export const retailButcheryPreset: IndustryPresetProfile = {
  presetId: 'preset-za-retail-butchery-01',
  industryName: 'Retail Butchery & Meat Processing',
  subSector: 'Retail Meat Processing, Butchery Wholesale & Cold Chain Handling',
  facilityType: 'Retail Butchery Deboning Block, Bandsaw Stations & Walk-in Cold Rooms',
  regulatoryFramework: [
    'Occupational Health and Safety Act 85 of 1993 (Sections 8, 16.2, 37, 38)',
    'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) - Reg 3, 6, 8(1), 8(2), 9, 10(1)',
    'Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025) - Regulation 9 (Cold Stress) (Repealing ERW 1987)',
    'General Safety Regulations - GSR 13H (Housekeeping & Non-Slip Drainage) & GSR 13J (Emergency Exits with Outward-Opening Doors)',
    'Driven Machinery Regulations (DMR 18) & General Machinery Regulations (GMR 2)',
    'COIDA Act 130 of 1993 (Schedule 3 Occupational Diseases)'
  ],
  shiftConstraints: {
    // TODO(legal-verify): removed 45-min "Reg 9 limit" - not found in GN 5952 Reg 9. Set per the exposure risk assessment.
    coldExposureWorkWarmingMinutes: null,
    maxSingleManualLiftKg: 25,
    siteWarmupBreakMinutes: 15
  },
  retentionPolicies: {
    reg6RiskAssessmentsYears: 40,
    reg8_2MedicalSurveillanceYears: 40,
    reg7And9EquipmentInspectionYears: 3,
    reg3EmployeeTraining: 'TENURE',
    gsr13FacilitiesYears: 3
  },
  primaryPhysicalHazards: [
    {
      hazardId: 'RB-HZ-001',
      name: 'Heavy Carcass Handling & Hanging Rail Unhooking (60kg - 140kg)',
      category: 'PHYSICAL_CARCASS_HANDLING',
      weightOrMagnitude: '60 kg to 140 kg (Beef hindquarters, pork sides, mutton carcasses)',
      classification: 'HIGH_RISK_PRIORITY_ACTION',
      requiresOMPReferral: true,
      retentionPeriod: 40,
      statutoryReference: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1); OHS Act Sec 8(2)(d)',
      housekeepingReference: 'GSR 13H',
      requiredControls: {
        eliminationOrSubstitution: 'Request pre-broken primal cuts from abattoir to minimize manual carcass weight.',
        engineering: 'Motorized monorail carcass hoists, hydraulic height-adjustable drop tables, counterbalanced gambrels (inspection logs retained 3 years under Reg 9).',
        administrative: 'Mandatory 2-butcher team lift for unhooking; OMP referral recommended under Regulation 8(1); employee instruction (retained for tenure under Reg 3).',
        ppe: 'Heavy-duty non-slip waterproof gumboots with steel midsole (GSR 13H compliance), PVC butcher aprons.'
      }
    },
    {
      hazardId: 'RB-HZ-002',
      name: 'Knife Deboning Force & Repetitive Tendon Strain (>30 cuts/min)',
      category: 'PHYSICAL_KNIFE_DEBONING',
      weightOrMagnitude: 'High-frequency pinching, wrist deviation and forceful tendon deboning',
      classification: 'HIGH_RISK_PRIORITY_ACTION',
      requiresOMPReferral: true,
      retentionPeriod: 40,
      statutoryReference: 'Ergonomics Regulations, 2019 (GN R1589) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1); COIDA Schedule 3 (Carpal Tunnel & Tenosynovitis)',
      requiredControls: {
        eliminationOrSubstitution: 'Mechanical portioning band saws with safety pushers and emergency magnetic brakes.',
        engineering: 'Ergonomically contoured textured non-slip knife handles, motorized hollow-ground knife sharpeners maintained daily.',
        administrative: 'Rotational 30-minute task switching between deboning, counter retail, and packaging; mandatory micro-pause stretching.',
        ppe: 'Stainless steel chainmail cut-resistant gloves on non-knife hand, Kevlar forearm arm-guards.'
      }
    },
    {
      hazardId: 'RB-HZ-003',
      name: 'Cold Room Thermal Stress (Evaluated under Regulation 9 of Physical Agents Regulations, 2024)',
      category: 'PHYSICAL_COLD_ROOM_STRESS_REG_9',
      coldStressCriteria: 'Evaluated under Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025) Regulation 9: Thermal exposure thresholds, air velocity chilling, and cold-induced vasodilatation monitoring',
      classification: 'HIGH_RISK_PRIORITY_ACTION',
      requiresOMPReferral: true,
      retentionPeriod: 40,
      statutoryReference: 'Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025) Regulation 9 (Cold Stress) (Repealing ERW 1987); Ergonomics Regulations, 2019 (GN R1589) Reg 8(1), Reg 8(2) & Reg 10(1)',
      egressReference: 'GSR 13J',
      housekeepingReference: 'GSR 13H',
      requiredControls: {
        eliminationOrSubstitution: 'Automate product staging with gravity roller conveyors through thermal air-lock flaps.',
        engineering: 'Strip air curtains, heated door gaskets, internal emergency door release push-to-release safety bars with luminous alarm beacons complying with GSR 13J (outward-opening doors).',
        administrative: 'Work-warming regime (continuous cold occupancy and warm-room breaks) set by the physical agent exposure risk assessment under the Physical Agents Regulations, 2024; hot drinks during warm-up; OMP referral recommended under Regulation 8(1) for Raynaud\'s and hypothermia screening.',
        ppe: 'Sub-zero freezer jackets, thermal insulated balaclavas, thermal slip-resistant boots (GSR 13H non-slip).'
      }
    },
    {
      hazardId: 'RB-HZ-004',
      name: 'Bandsaw, Mincer & Slicer Machinery Safety & Lock-Out/Tag-Out (LOTO)',
      category: 'STATUTORY_LEGAL_NON_COMPLIANCE',
      classification: 'HIGH_RISK_PRIORITY_ACTION',
      requiresOMPReferral: false,
      retentionPeriod: 3,
      statutoryReference: 'Driven Machinery Regulations DMR 18; General Machinery Regulations GMR 2; OHS Act Sec 8(2)(b)',
      requiredControls: {
        eliminationOrSubstitution: 'Interlocked guard systems preventing motor engagement when bandsaw doors or slicer chutes are open.',
        engineering: 'Emergency kick-stop brake switches, meat pusher sliding guides (zero bare-hand feeding into blades), LOTO padlocks on main isolators.',
        administrative: 'Certified machine competency training under Reg 3 (retained for employee tenure); daily pre-start interlock checklists (retained 3 years under Reg 9).',
        ppe: 'Close-fitting cut-resistant protective garments (no loose clothing/apron ties near rotating spindles).'
      }
    }
  ]
};

export const ALL_INDUSTRY_PRESETS: Record<string, IndustryPresetProfile> = {
  'wholesale-cash-carry': wholesaleCashCarryPreset,
  'retail-butchery': retailButcheryPreset
};

export const getPresetById = (id: string): IndustryPresetProfile => {
  return ALL_INDUSTRY_PRESETS[id] || wholesaleCashCarryPreset;
};
