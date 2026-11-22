/**
 * ErgoSafe Reborn V3 — Wetstock & Reconciliation Engine
 * Enforces tank-by-tank daily reconciliation, ATG vs. manual dip cross-checks,
 * water-finding paste verification, manifolded siphon balance tracking,
 * the 5 Mandatory Wetstock Triggers, the 4-Tier Etwatwa Forensic Protocol
 * (with VacuSonic NDT hard-locks for legacy steel lines), and East African
 * regulatory telemetry compliance (EWURA ATG, KRA eTIMS, URA EFRIS, Telebirr).
 */

export type JurisdictionCode = 'ZA' | 'TZ' | 'KE' | 'UG' | 'ET' | 'ISO';

export type FuelGrade = 'ULP_95' | 'ULP_93' | 'DIESEL_50PPM' | 'DIESEL_10PPM' | 'ILLUMINATING_PARAFFIN';

export type LineMaterial = 'LEGACY_STEEL' | 'DOUBLE_WALL_HDPE' | 'FIBERGLASS_FRP';

export interface TankDailyInput {
  tankId: string;
  siteId: string;
  dateIso: string;
  fuelGrade: FuelGrade;
  capacityLitres: number;
  lineMaterial: LineMaterial;
  openingStockLitres: number;
  deliveriesNetLitres: number;
  bolVolumeLitres: number;
  meteredSalesLitres: number;
  atgClosingLitres: number;
  manualDipClosingLitres: number;
  waterPasteLevelMm: number;
  manifoldPartnerTankId?: string;
  manifoldPartnerLevelMm?: number;
  currentTankLevelMm?: number;
  priorConsecutiveNegativeDays: number;
  rolling7DayVarianceLitres: number;
  rolling7DaySalesLitres: number;
  vacuSonicCertificateValid?: boolean;
}

export type WetstockTriggerCode =
  | 'TRIGGER_1_DAILY_LOSS_SPIKE'
  | 'TRIGGER_2_CONSECUTIVE_3DAY_TREND'
  | 'TRIGGER_3_ROLLING_CUMULATIVE_BREACH'
  | 'TRIGGER_4_DELIVERY_TRANSIT_SHORTAGE'
  | 'TRIGGER_5_WATER_OR_ATG_DIVERGENCE';

export interface WetstockTriggerAlert {
  code: WetstockTriggerCode;
  severity: 'WARNING' | 'CRITICAL' | 'HARD_LOCK';
  title: string;
  description: string;
  measuredValue: number;
  thresholdValue: number;
}

export type EtwatwaTierLevel = 1 | 2 | 3 | 4;

export interface EtwatwaForensicAction {
  tier: EtwatwaTierLevel;
  tierName: string;
  mandatorySteps: string[];
  vacuSonicHardLockActive: boolean;
  refillBlocked: boolean;
  pumpDispatchBlocked: boolean;
  clearanceRequirement: string;
}

export interface TankReconciliationResult {
  tankId: string;
  siteId: string;
  dateIso: string;
  bookClosingLitres: number;
  physicalClosingLitres: number;
  dailyVarianceLitres: number;
  dailyVariancePercent: number;
  deliveryVarianceLitres: number;
  deliveryVariancePercent: number;
  atgVsDipDeltaLitres: number;
  atgVsDipCompliant: boolean;
  waterLevelCompliant: boolean;
  siphonBalanceDeltaMm: number;
  siphonBalanced: boolean;
  triggers: WetstockTriggerAlert[];
  forensicProtocol: EtwatwaForensicAction | null;
  status: 'COMPLIANT' | 'INVESTIGATE' | 'CRITICAL_LOCKOUT';
}

export interface EastAfricaRegulatoryTelemetryInput {
  siteId: string;
  jurisdiction: JurisdictionCode;
  /** Tanzania EWURA Dec 2024 ATG Mandate */
  atgModelName?: string;
  atgTelemetryLastHeartbeatMinutesAgo?: number;
  /** Kenya KRA eTIMS Pump Integration */
  etimsConnectedPumpsCount?: number;
  totalOperatingPumpsCount?: number;
  etimsFeedGapMinutes?: number;
  /** Uganda URA EFRIS July 2025 Mandate */
  totalPumpTransactionsCount?: number;
  efrisValidatedReceiptsCount?: number;
  /** Ethiopia Telebirr / Bank Cashless Mandate */
  meteredSalesValueLocalCurrency?: number;
  digitalSettledValueLocalCurrency?: number;
}

export interface RegulatoryTelemetryEvaluation {
  siteId: string;
  jurisdiction: JurisdictionCode;
  regulator: string;
  isCompliant: boolean;
  liveFeedStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE_BREACH';
  unvalidatedTransactionsCount: number;
  estimatedStatutoryPenaltyLocalCurrency: number;
  penaltyCurrency: 'ZAR' | 'TZS' | 'KES' | 'UGX' | 'ETB';
  findings: string[];
  remediationActions: string[];
}

export const APPROVED_EWURA_ATG_MODELS: readonly string[] = [
  'VEEDER_ROOT_TLS_450PLUS',
  'VEEDER_ROOT_TLS4B',
  'OPW_FMS_SITE_SENTINEL_INTEGRA',
  'FRANKLIN_FUELING_EVO_550',
  'FAFNIR_VISY_QUICK',
  'START_ITALIANA_XMT_SI',
];

export const URA_EFRIS_MIN_PENALTY_UGX = 6_000_000;

/**
 * Evaluates a single tank's daily wetstock reconciliation, cross-checks ATG vs. manual dip,
 * verifies water-finding paste limits, checks manifolded siphon balance, evaluates all
 * 5 Mandatory Wetstock Triggers, and escalates into the 4-Tier Etwatwa Forensic Protocol.
 */
export function reconcileTankDaily(input: TankDailyInput): TankReconciliationResult {
  const bookClosingLitres =
    Math.round((input.openingStockLitres + input.deliveriesNetLitres - input.meteredSalesLitres) * 100) / 100;

  // Authoritative physical closing stock uses manual dip when ATG drifts, otherwise ATG
  const atgVsDipDeltaLitres = Math.round(Math.abs(input.atgClosingLitres - input.manualDipClosingLitres) * 100) / 100;
  const maxAllowedDipDelta = Math.max(50, input.capacityLitres * 0.0025);
  const atgVsDipCompliant = atgVsDipDeltaLitres <= maxAllowedDipDelta;

  const physicalClosingLitres = input.atgClosingLitres;
  const dailyVarianceLitres = Math.round((physicalClosingLitres - bookClosingLitres) * 100) / 100;
  const throughputBase = Math.max(input.meteredSalesLitres, 1);
  const dailyVariancePercent = Math.round((dailyVarianceLitres / throughputBase) * 10000) / 100;

  // Delivery transit variance check (Received vs. Bill of Lading)
  const deliveryVarianceLitres = Math.round((input.deliveriesNetLitres - input.bolVolumeLitres) * 100) / 100;
  const deliveryVariancePercent =
    input.bolVolumeLitres > 0
      ? Math.round((deliveryVarianceLitres / input.bolVolumeLitres) * 10000) / 100
      : 0;

  // Water-finding paste check (15mm ceiling for ULP grades, 25mm ceiling for Diesel/Paraffin)
  const maxWaterMm = input.fuelGrade.startsWith('ULP') ? 15 : 25;
  const waterLevelCompliant = input.waterPasteLevelMm <= maxWaterMm;

  // Manifolded siphon balance check (max 50mm height differential between linked tanks)
  const siphonBalanceDeltaMm =
    input.manifoldPartnerTankId &&
    input.currentTankLevelMm !== undefined &&
    input.manifoldPartnerLevelMm !== undefined
      ? Math.abs(input.currentTankLevelMm - input.manifoldPartnerLevelMm)
      : 0;
  const siphonBalanced = siphonBalanceDeltaMm <= 50;

  const triggers: WetstockTriggerAlert[] = [];

  // TRIGGER 1: Single-day unexplained loss > 0.5% of sales or > 200 Litres
  const lossLitres = dailyVarianceLitres < 0 ? Math.abs(dailyVarianceLitres) : 0;
  const singleDayThreshold = Math.max(200, input.meteredSalesLitres * 0.005);
  if (lossLitres > singleDayThreshold) {
    triggers.push({
      code: 'TRIGGER_1_DAILY_LOSS_SPIKE',
      severity: lossLitres > singleDayThreshold * 2 ? 'HARD_LOCK' : 'CRITICAL',
      title: 'Trigger 1: Single-Day Unexplained Wetstock Loss Spike',
      description: `Unexplained daily loss of ${lossLitres}L (${Math.abs(dailyVariancePercent)}%) exceeds statutory tolerance of ${Math.round(singleDayThreshold)}L.`,
      measuredValue: lossLitres,
      thresholdValue: Math.round(singleDayThreshold),
    });
  }

  // TRIGGER 2: Consecutive 3-Day Negative Variance Trend
  const totalNegativeDays = dailyVarianceLitres < 0 ? input.priorConsecutiveNegativeDays + 1 : 0;
  if (totalNegativeDays >= 3) {
    triggers.push({
      code: 'TRIGGER_2_CONSECUTIVE_3DAY_TREND',
      severity: totalNegativeDays >= 5 ? 'HARD_LOCK' : 'CRITICAL',
      title: 'Trigger 2: Consecutive Multi-Day Negative Variance Trend',
      description: `Tank ${input.tankId} has recorded ${totalNegativeDays} consecutive days of negative stock variance, indicating continuous line weepage, meter over-dispensing, or systematic pilferage.`,
      measuredValue: totalNegativeDays,
      thresholdValue: 3,
    });
  }

  // TRIGGER 3: Rolling 7-Day Cumulative Variance Breach (> 0.35% of rolling sales)
  const cumulativeVariance = input.rolling7DayVarianceLitres + dailyVarianceLitres;
  const cumulativeSales = Math.max(input.rolling7DaySalesLitres + input.meteredSalesLitres, 1);
  const cumulativeLossPct =
    cumulativeVariance < 0 ? Math.abs((cumulativeVariance / cumulativeSales) * 100) : 0;
  if (cumulativeLossPct > 0.35) {
    triggers.push({
      code: 'TRIGGER_3_ROLLING_CUMULATIVE_BREACH',
      severity: cumulativeLossPct > 0.7 ? 'HARD_LOCK' : 'WARNING',
      title: 'Trigger 3: Rolling 7-Day Cumulative Variance Breach',
      description: `Rolling 7-day loss of ${Math.round(Math.abs(cumulativeVariance))}L (${cumulativeLossPct.toFixed(2)}%) exceeds the 0.35% statutory tolerance threshold.`,
      measuredValue: Number(cumulativeLossPct.toFixed(2)),
      thresholdValue: 0.35,
    });
  }

  // TRIGGER 4: Delivery Transit Shortage (> 0.2% of BOL volume)
  if (input.bolVolumeLitres > 0 && deliveryVarianceLitres < -(input.bolVolumeLitres * 0.002)) {
    triggers.push({
      code: 'TRIGGER_4_DELIVERY_TRANSIT_SHORTAGE',
      severity: 'CRITICAL',
      title: 'Trigger 4: Bulk Tanker Delivery Shortage Beyond 0.2% Tolerance',
      description: `Bulk drop shortage of ${Math.abs(deliveryVarianceLitres)}L (${Math.abs(deliveryVariancePercent)}%) detected against BOL volume of ${input.bolVolumeLitres}L.`,
      measuredValue: Math.abs(deliveryVarianceLitres),
      thresholdValue: Math.round(input.bolVolumeLitres * 0.002),
    });
  }

  // TRIGGER 5: Water Ingress or ATG vs. Manual Dip Divergence OR Siphon Imbalance
  if (!waterLevelCompliant || !atgVsDipCompliant || !siphonBalanced) {
    const reasons: string[] = [];
    if (!waterLevelCompliant) {
      reasons.push(`Water paste level ${input.waterPasteLevelMm}mm exceeds ${maxWaterMm}mm limit`);
    }
    if (!atgVsDipCompliant) {
      reasons.push(`ATG vs Manual Dip delta ${atgVsDipDeltaLitres}L exceeds ${Math.round(maxAllowedDipDelta)}L`);
    }
    if (!siphonBalanced) {
      reasons.push(`Manifold siphon imbalance of ${siphonBalanceDeltaMm}mm exceeds 50mm limit`);
    }
    triggers.push({
      code: 'TRIGGER_5_WATER_OR_ATG_DIVERGENCE',
      severity: !waterLevelCompliant ? 'HARD_LOCK' : 'CRITICAL',
      title: 'Trigger 5: Water Ingress, ATG Calibration Drift, or Siphon Imbalance',
      description: reasons.join('; '),
      measuredValue: !waterLevelCompliant ? input.waterPasteLevelMm : atgVsDipDeltaLitres,
      thresholdValue: !waterLevelCompliant ? maxWaterMm : Math.round(maxAllowedDipDelta),
    });
  }

  const forensicProtocol = determineEtwatwaForensicProtocol(input, triggers);

  const status: TankReconciliationResult['status'] =
    forensicProtocol?.vacuSonicHardLockActive || triggers.some((t) => t.severity === 'HARD_LOCK')
      ? 'CRITICAL_LOCKOUT'
      : triggers.length > 0
        ? 'INVESTIGATE'
        : 'COMPLIANT';

  return {
    tankId: input.tankId,
    siteId: input.siteId,
    dateIso: input.dateIso,
    bookClosingLitres,
    physicalClosingLitres,
    dailyVarianceLitres,
    dailyVariancePercent,
    deliveryVarianceLitres,
    deliveryVariancePercent,
    atgVsDipDeltaLitres,
    atgVsDipCompliant,
    waterLevelCompliant,
    siphonBalanceDeltaMm,
    siphonBalanced,
    triggers,
    forensicProtocol,
    status,
  };
}

/**
 * Determines the required tier of the 4-Tier Etwatwa Forensic Protocol.
 * Legacy steel underground lines with severe/multi-day losses or missing VacuSonic NDT
 * certification immediately trigger a Tier 4 VacuSonic Hard-Lock.
 */
export function determineEtwatwaForensicProtocol(
  input: TankDailyInput,
  triggers: readonly WetstockTriggerAlert[],
): EtwatwaForensicAction | null {
  if (triggers.length === 0) {
    return null;
  }

  const hasHardLockTrigger = triggers.some((t) => t.severity === 'HARD_LOCK');
  const hasMultiDayTrend = triggers.some((t) => t.code === 'TRIGGER_2_CONSECUTIVE_3DAY_TREND');
  const hasCumulativeBreach = triggers.some((t) => t.code === 'TRIGGER_3_ROLLING_CUMULATIVE_BREACH');

  // Tier 4: Legacy steel line with severe/chronic loss or unverified VacuSonic NDT status
  if (
    (input.lineMaterial === 'LEGACY_STEEL' && (hasHardLockTrigger || hasMultiDayTrend) && !input.vacuSonicCertificateValid) ||
    (hasHardLockTrigger && hasMultiDayTrend)
  ) {
    return {
      tier: 4,
      tierName: 'Tier 4 — Etwatwa Forensic Protocol: VacuSonic Non-Destructive Testing (NDT) Hard-Lock',
      mandatorySteps: [
        'IMMEDIATE HARD-LOCK: Cease all dispensing and block bulk tanker refills on affected tank.',
        'Isolate underground legacy steel suction/pressure lines and manifolded siphon bridges.',
        'Conduct accredited VacuSonic acoustic/vacuum Non-Destructive Testing (NDT) across tank shell and piping.',
        'Perform soil-vapour & observation well hydrocarbon contamination check under NEMA / SANS 10089.',
      ],
      vacuSonicHardLockActive: true,
      refillBlocked: true,
      pumpDispatchBlocked: true,
      clearanceRequirement:
        'Requires accredited VacuSonic NDT Pass Certificate + Competent Person statutory sign-off.',
    };
  }

  // Tier 3: Line Isolation & Hydrostatic / Sump Inspection
  if (hasHardLockTrigger || (hasMultiDayTrend && hasCumulativeBreach)) {
    return {
      tier: 3,
      tierName: 'Tier 3 — Etwatwa Forensic Protocol: Line Isolation & Sump Integrity Audit',
      mandatorySteps: [
        'Inspect submersible turbine pump (STP) sumps and under-dispenser containment (UDC) pans for weeping fuel.',
        'Test mechanical/electronic line leak detectors and check valves for pressure decay.',
        'Isolate manifolded siphon line and verify independent tank holding levels over a 4-hour quiet window.',
      ],
      vacuSonicHardLockActive: false,
      refillBlocked: true,
      pumpDispatchBlocked: false,
      clearanceRequirement: 'Requires engineering pressure-hold test log and Regional Operations Manager sign-off.',
    };
  }

  // Tier 2: Mechanical, Seraphin Calibration & Dip Verification
  if (triggers.length >= 2 || hasMultiDayTrend) {
    return {
      tier: 2,
      tierName: 'Tier 2 — Etwatwa Forensic Protocol: 20L Seraphin Meter Calibration & Dip Audit',
      mandatorySteps: [
        'Conduct physical 20L Seraphin test-measure calibration across all nozzles linked to the tank.',
        'Inspect dispenser meter assize seals and air-eliminator vents for tampering or vapour bypass.',
        'Re-dip tank manually with calibrated brass dipstick and fresh water-finding paste.',
      ],
      vacuSonicHardLockActive: false,
      refillBlocked: false,
      pumpDispatchBlocked: false,
      clearanceRequirement: 'Requires 20L calibration test sheet uploaded and verified by Site Supervisor.',
    };
  }

  // Tier 1: Administrative, Cut-Off & Delivery Paperwork Audit
  return {
    tier: 1,
    tierName: 'Tier 1 — Etwatwa Forensic Protocol: Shift Cut-Off & Delivery Paperwork Reconciliation',
    mandatorySteps: [
      'Cross-check POS shift close timestamp against ATG dip timestamp to eliminate drive-off/cut-off skew.',
      'Verify tanker delivery bill-of-lading (BOL), before/after dip tickets, and temperature compensation.',
      'Confirm no unrecorded pump test draws or manual totalizer rollovers occurred during shift.',
    ],
    vacuSonicHardLockActive: false,
    refillBlocked: false,
    pumpDispatchBlocked: false,
    clearanceRequirement: 'Requires shift supervisor reconciliation sign-off note within 24 hours.',
  };
}

/**
 * Evaluates East African & Regional live regulatory telemetry compliance:
 * - Tanzania (EWURA Dec 2024 Automatic Tank Gauging Guidelines)
 * - Kenya (KRA eTIMS Fuel System & EPRA)
 * - Uganda (URA EFRIS July 2025 Electronic Receipt Mandate — min UGX 6,000,000 penalty)
 * - Ethiopia (Telebirr & Bank Cashless Forecourt Mandate)
 * - South Africa (SANS 10089 / OHS Act 85 of 1993)
 */
export function evaluateRegulatoryTelemetry(
  input: EastAfricaRegulatoryTelemetryInput,
): RegulatoryTelemetryEvaluation {
  const findings: string[] = [];
  const remediationActions: string[] = [];
  let isCompliant = true;
  let liveFeedStatus: RegulatoryTelemetryEvaluation['liveFeedStatus'] = 'ONLINE';
  let unvalidatedTransactionsCount = 0;
  let estimatedStatutoryPenaltyLocalCurrency = 0;

  switch (input.jurisdiction) {
    case 'TZ': {
      const modelApproved = input.atgModelName
        ? APPROVED_EWURA_ATG_MODELS.includes(input.atgModelName.toUpperCase())
        : false;
      const heartbeatGap = input.atgTelemetryLastHeartbeatMinutesAgo ?? 999;

      if (!modelApproved) {
        isCompliant = false;
        findings.push(
          `ATG model "${input.atgModelName || 'UNSPECIFIED'}" is not on the EWURA December 2024 approved Automatic Tank Gauging hardware registry.`,
        );
        remediationActions.push(
          'Install an EWURA type-approved ATG controller and register tank probe serials.',
        );
      }

      if (heartbeatGap > 15) {
        isCompliant = false;
        liveFeedStatus = heartbeatGap > 60 ? 'OFFLINE_BREACH' : 'DEGRADED';
        findings.push(
          `EWURA real-time tank receipt/storage/sales telemetry feed gap of ${heartbeatGap} minutes exceeds the 15-minute live reporting window.`,
        );
        remediationActions.push(
          'Restore ATG-to-EWURA telemetry link immediately and buffer offline tank delivery/inventory logs.',
        );
      }

      return {
        siteId: input.siteId,
        jurisdiction: 'TZ',
        regulator: 'EWURA (Energy and Water Utilities Regulatory Authority) & TRA',
        isCompliant,
        liveFeedStatus,
        unvalidatedTransactionsCount: 0,
        estimatedStatutoryPenaltyLocalCurrency: isCompliant ? 0 : 5_000_000,
        penaltyCurrency: 'TZS',
        findings,
        remediationActions,
      };
    }

    case 'KE': {
      const totalPumps = input.totalOperatingPumpsCount ?? 0;
      const connectedPumps = input.etimsConnectedPumpsCount ?? 0;
      const feedGap = input.etimsFeedGapMinutes ?? 0;

      if (totalPumps === 0 || connectedPumps < totalPumps) {
        isCompliant = false;
        liveFeedStatus = connectedPumps === 0 ? 'OFFLINE_BREACH' : 'DEGRADED';
        findings.push(
          `Only ${connectedPumps} of ${totalPumps} forecourt pumps are integrated with the KRA eTIMS real-time fuel invoicing system.`,
        );
        remediationActions.push(
          'Complete forecourt controller integration with KRA eTIMS trader device for all active nozzles.',
        );
      }

      if (feedGap > 15) {
        isCompliant = false;
        liveFeedStatus = feedGap > 60 ? 'OFFLINE_BREACH' : 'DEGRADED';
        findings.push(
          `KRA eTIMS fiscal transmission gap of ${feedGap} minutes detected; live pump-to-tax feed interrupted.`,
        );
        remediationActions.push(
          'Verify forecourt PTS controller network link and flush queued eTIMS invoice payloads.',
        );
      }

      return {
        siteId: input.siteId,
        jurisdiction: 'KE',
        regulator: 'KRA (eTIMS Fuel System) & EPRA (Petroleum Act 2019)',
        isCompliant,
        liveFeedStatus,
        unvalidatedTransactionsCount: Math.max(0, totalPumps - connectedPumps),
        estimatedStatutoryPenaltyLocalCurrency: isCompliant ? 0 : 1_000_000,
        penaltyCurrency: 'KES',
        findings,
        remediationActions,
      };
    }

    case 'UG': {
      const totalSales = input.totalPumpTransactionsCount ?? 0;
      const validatedReceipts = input.efrisValidatedReceiptsCount ?? 0;
      unvalidatedTransactionsCount = Math.max(0, totalSales - validatedReceipts);

      if (unvalidatedTransactionsCount > 0) {
        isCompliant = false;
        liveFeedStatus = validatedReceipts === 0 ? 'OFFLINE_BREACH' : 'DEGRADED';
        estimatedStatutoryPenaltyLocalCurrency =
          unvalidatedTransactionsCount * URA_EFRIS_MIN_PENALTY_UGX;
        findings.push(
          `${unvalidatedTransactionsCount} fuel retail sale(s) lacked a URA EFRIS validated electronic receipt (mandatory since 1 July 2025).`,
        );
        remediationActions.push(
          'Enforce automated pump-to-EFRIS fiscal receipt lock so no transaction closes without an EFRIS validation code.',
        );
      }

      return {
        siteId: input.siteId,
        jurisdiction: 'UG',
        regulator: 'URA (EFRIS Fuel Retail Mandate) & Ministry of Energy',
        isCompliant,
        liveFeedStatus,
        unvalidatedTransactionsCount,
        estimatedStatutoryPenaltyLocalCurrency,
        penaltyCurrency: 'UGX',
        findings,
        remediationActions,
      };
    }

    case 'ET': {
      const metered = input.meteredSalesValueLocalCurrency ?? 0;
      const digital = input.digitalSettledValueLocalCurrency ?? 0;
      const cashLeakage = Math.round((metered - digital) * 100) / 100;

      if (cashLeakage > Math.max(50, metered * 0.002)) {
        isCompliant = false;
        liveFeedStatus = 'DEGRADED';
        findings.push(
          `Unreconciled gap of ETB ${cashLeakage.toLocaleString()} between pump meter sales and Telebirr/bank digital settlements under Ethiopia's mandatory cashless forecourt directive.`,
        );
        remediationActions.push(
          'Reconcile Telebirr merchant settlement batch against pump totalizer shift close and block unauthorized cash sales.',
        );
      }

      return {
        siteId: input.siteId,
        jurisdiction: 'ET',
        regulator: 'Ministry of Trade & Regional Integration (Telebirr/Bank Cashless Mandate)',
        isCompliant,
        liveFeedStatus,
        unvalidatedTransactionsCount: cashLeakage > 0 ? 1 : 0,
        estimatedStatutoryPenaltyLocalCurrency: isCompliant ? 0 : Math.round(cashLeakage),
        penaltyCurrency: 'ETB',
        findings,
        remediationActions,
      };
    }

    default: {
      return {
        siteId: input.siteId,
        jurisdiction: input.jurisdiction,
        regulator: 'South Africa DMRE / SANS 10089 / OHS Act 85 of 1993',
        isCompliant: true,
        liveFeedStatus: 'ONLINE',
        unvalidatedTransactionsCount: 0,
        estimatedStatutoryPenaltyLocalCurrency: 0,
        penaltyCurrency: 'ZAR',
        findings: [],
        remediationActions: [],
      };
    }
  }
}

