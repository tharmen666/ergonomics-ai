import { create } from 'zustand';
import { useTenantStore } from './tenantStore';
import { 
    StatutoryComplianceMetadata, 
    StatutoryRetentionPeriod, 
    StatutoryRecordCategory,
    StatutoryComplianceClassification
} from '../types/statutory';
import { OMP_REFERRAL_STATUTORY_STRING } from '../data/industryPresets';

export type ComplianceStatus = 'COMPLIANT' | 'RISK_ALERT' | 'BREACH' | 'ESCALATED_UNRESOLVED' | 'OVERDUE_HIGH_RISK';
export type EscalationState = 'triggered' | 'routed_to_manager' | 'escalated_level_2' | 'resolved';

export interface EmployeeCase {
    id: string;
    companyId: string;
    employeeName: string;
    dept: string;
    score: number;
    status: ComplianceStatus;
    managerName: string;
    hazardTrigger: string;
    createdAt: string; // ISO string
    timeframeHours: number;
    escalationState: EscalationState;
    statutoryMetadata?: StatutoryComplianceMetadata;
}

export interface ComplianceLog {
    timestamp: string;
    score: number;
    threshold: number;
    reason?: string;
    retentionPeriod?: StatutoryRetentionPeriod;
    retentionCategory?: StatutoryRecordCategory;
    requiresOMPReferral?: boolean;
    ompReferralStatus?: string;
    isStatutoryBreach?: boolean;
}

export interface ComplianceState {
    status: ComplianceStatus;
    requiresEscalation: boolean;
    logs: ComplianceLog[];
    exceptions: string[];
    cases: EmployeeCase[];
    gear: {
        governance: number;
        efficiency: number;
        accountability: number;
        resilience: number;
    };
    demoMode: boolean;
    setDemoMode: (enabled: boolean) => void;
    addWorkspaceException: (exception: string) => void;
    logHazardEvent: (
        type: 'posture' | 'neck_strain' | 'break_interval' | 'physical_hazard' | 'statutory_compliance' | string, 
        description: string, 
        severity?: 'RISK_ALERT' | 'BREACH'
    ) => void;
    evaluateStatutoryPhysicalHazard: (
        hazardType: 'bulk_lift_25kg' | 'carcass_handling' | 'knife_boning' | 'cold_room_stress' | string,
        contextDetails: string,
        employeeName?: string,
        dept?: string
    ) => { triggered: boolean; caseRecord: EmployeeCase };
    logStatutoryLegalBreach: (
        breachType: 'missing_sec16_2' | 'missing_sec17_she_rep' | 'missing_reg6_assessment' | 'refusal_reg10_retention' | 'uncertified_machinery_dmr18',
        details: string,
        responsiblePerson?: string
    ) => EmployeeCase;
    logVerifiedBBSIntervention: (type: string, hazardResolved: string, durationSeconds: number) => void;
    logEmployeeTrainingRecord: (moduleName: string, employeeName: string, competencyVerified: boolean) => void;
    exportStatutoryDocToAuditLog: (docType: string, siteContext: string, previewText: string, reviewerName?: string, reviewerRole?: string) => void;
    resetCompliance: () => void;
    resolveCase: (id: string) => void;
    updateCaseEscalation: (id: string, state: EscalationState) => void;
    tickSimulatedTime: () => void;
    processTelemetry: (data: {
        pelvicSpineAngle: number;
        cervicalSpineTilt: number;
        shoulderElbowAngle: number;
        shoulderElevation: number;
        setupName: string;
    }) => { triggered: boolean; reason: string };
}

/** SLA (hours) for a physical HIGH RISK finding before it escalates. Shown in labels so the two never disagree. */
export const HIGH_RISK_SLA_HOURS = 72;
export const HIGH_RISK_TAG = `HIGH RISK (Priority Action Required within ${HIGH_RISK_SLA_HOURS} hours)`;

/**
 * Parse every weight mentioned in free text and return the largest single value in kg.
 * Handles SA comma decimals ("25,5 kg"), space/non-breaking-space thousands ("1 000 kg"),
 * and "2 x 15 kg" (per-lift weight is 15, never multiplied). Returns 0 when no weight is found.
 */
export const parseMaxWeightKg = (text: string): number => {
    const re = /(\d{1,3}(?:[ \u00a0]\d{3})+|\d+)(?:[.,](\d+))?\s*(?:kg|kgs|kilos?|kilograms?)\b/gi;
    let max = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        const whole = m[1].replace(/[ \u00a0]/g, '');
        const value = parseFloat(m[2] ? `${whole}.${m[2]}` : whole);
        if (Number.isFinite(value) && value > max) max = value;
    }
    return max;
};

/**
 * Deterministic Physical Hazard Evaluation Engine
 * 1. Physical Ergonomic & Thermal Hazard Risks -> HIGH RISK (priority action), never a legal BREACH.
 *    OMP referral is a *recommendation* under Regulation 8(1) of the Ergonomics Regulations, 2019.
 * 2. Statutory Legal Breaches are created ONLY through the explicit logStatutoryLegalBreach API.
 *    Free text can at most raise `suggestedStatutoryReview` for a human to confirm.
 */
export const detectPhysicalStatutoryHazard = (text: string): { 
    isPhysicalHighRisk: boolean; 
    isStatutoryBreach: false;
    suggestedStatutoryReview: boolean;
    hazardLabel: string;
    statutoryMetadata: StatutoryComplianceMetadata 
} => {
    const lower = text.toLowerCase();

    // Free text never creates a legal breach. It can only suggest a human review
    // (e.g. a note saying "no SHE rep appointed on night shift").
    const suggestedStatutoryReview = /\b(?:no|missing|absent|without|lack of|failed to appoint)\s+(?:a\s+)?(?:section\s*17|she|health\s*(?:&|and)\s*safety)\s*(?:rep|representative|designation|appointment)\b/i.test(lower);

    // Manual handling: HIGH RISK only for a parsed weight strictly greater than 25 kg.
    const parsedWeight = parseMaxWeightKg(lower);
    const isOver25kgManualHandling = parsedWeight > 25;

    const isCarcassHandling = lower.includes('carcass') || lower.includes('beef quarter') || lower.includes('hanging rail');
    const isKnifeDeboning = lower.includes('deboning') || lower.includes('knife boning') || lower.includes('meat cutting') || lower.includes('band saw');
    const isColdRoomStress = lower.includes('cold room') || lower.includes('cold-room') || lower.includes('freezer') || lower.includes('chiller') || lower.includes('thermal stress') || lower.includes('sub-zero') || lower.includes('cold stress');

    const isPhysicalHighRisk = isOver25kgManualHandling || isCarcassHandling || isKnifeDeboning || isColdRoomStress;

    let hazardLabel = 'Physical Ergonomic Risk Factor';
    let citation = 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6 & Reg 10(1)';
    let controls = 'Elimination -> Engineering -> Administrative -> PPE';

    if (isOver25kgManualHandling) {
        hazardLabel = `${HIGH_RISK_TAG}: Manual Handling > 25 kg`;
        citation = 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1); OHS Act Sec 8(2)(b)';
        controls = 'Elimination (pallet automation) -> Engineering (scissor lift / vacuum lifter; inspection logs retained 3 years under Regs 7 & 9) -> Administrative (2-person team lift > 25kg; employee training retained for tenure under Reg 3) -> PPE (steel-toe footwear)';
    } else if (isCarcassHandling) {
        hazardLabel = `${HIGH_RISK_TAG}: Heavy Carcass Handling`;
        citation = 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1); GSR 13H (Housekeeping & Non-Slip Drainage)';
        controls = 'Engineering (motorized monorail hoists; logs retained 3 years under Regs 7 & 9) -> Administrative (2-butcher team unhooking; training retained for tenure under Reg 3) -> PPE (waterproof boots, chainmail & butcher aprons)';
    } else if (isKnifeDeboning) {
        hazardLabel = `${HIGH_RISK_TAG}: Knife Deboning Force & Tendon Strain`;
        // TODO(legal-verify): confirm the applicable COIDA Schedule 3 disease item before citing it here.
        citation = 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1)';
        controls = 'Engineering (ergonomic non-slip knife handles, motorized hollow grinders) -> Administrative (task rotation per the Reg 6 assessment) -> PPE (chainmail cut-resistant gloves)';
    } else if (isColdRoomStress) {
        hazardLabel = `${HIGH_RISK_TAG}: Cold Room Thermal Stress`;
        citation = 'Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025) Regulation 9 (Cold Stress) (Repealing ERW 1987); Ergonomics Regulations, 2019 (GN R1589) Reg 8(1), Reg 8(2) & Reg 10(1); GSR 13J';
        // TODO(legal-verify): removed "max 45 min cold exposure under Reg 9" - no such limit found in GN 5952 Reg 9.
        controls = 'Engineering (heated door gaskets, emergency door push-bars complying with GSR 13J) -> Administrative (work-warming regime set by the physical agent exposure risk assessment; hot drink warm-up breaks) -> PPE (thermal freezer suits, insulated balaclavas)';
    }

    return {
        isPhysicalHighRisk,
        isStatutoryBreach: false,
        suggestedStatutoryReview,
        hazardLabel,
        statutoryMetadata: {
            retentionPeriod: 40,
            retentionCategory: isPhysicalHighRisk ? 'REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR' : 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
            retentionDescription: isPhysicalHighRisk
                ? 'Medical surveillance records retained 40 years under Ergonomics Regulations, 2019 Regulation 10(1)'
                : 'Ergonomic risk assessment records retained 40 years under Ergonomics Regulations, 2019 Regulation 10(1)',
            isStatutoryBreach: false,
            requiresOMPReferral: isPhysicalHighRisk,
            ompReferralStatus: isPhysicalHighRisk ? OMP_REFERRAL_STATUTORY_STRING : undefined,
            statutoryCitation: citation,
            hierarchyOfControlsMandate: controls,
            competentPersonRequirement: 'Appointed Risk Assessor & Registered Occupational Medicine Practitioner (OMP)',
            riskClassification: isPhysicalHighRisk ? 'HIGH_RISK_PRIORITY_ACTION' : 'RISK_ALERT',
            statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) & Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025)'
        }
    };
};

// Initial seeded cases
const initialCases = (): EmployeeCase[] => {
    const now = new Date();
    const mikeCreated = new Date(now.getTime() - 22 * 1000).toISOString();
    const louisCreated = new Date(now.getTime() - 26 * 1000).toISOString();
    const sarahCreated = new Date(now.getTime() - 48 * 1000).toISOString();
    const harveyCreated = new Date(now.getTime() - 5 * 1000).toISOString();

    return [
        {
            id: 'case-1',
            companyId: 'COMP-001',
            employeeName: 'Sarah Jenkins',
            dept: 'Marketing',
            score: 98,
            status: 'COMPLIANT',
            managerName: 'Robert Zane',
            hazardTrigger: 'Ergonomic Desk Adjustment & Monitor Arm Calibration',
            createdAt: sarahCreated,
            timeframeHours: 72,
            escalationState: 'resolved',
            statutoryMetadata: {
                retentionPeriod: 3,
                retentionCategory: 'REG_7_9_EQUIPMENT_INSPECTION_LOG_3_YR',
                retentionDescription: 'Equipment maintenance and inspection log retained 3 years under Regulations 7 & 9',
                isStatutoryBreach: false,
                requiresOMPReferral: false,
                statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589) Reg 7 & 9',
                hierarchyOfControlsMandate: 'Engineering controls verified and signed off.',
                competentPersonRequirement: 'Internal Ergonomics Champion',
                riskClassification: 'COMPLIANT',
                statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
            }
        },
        {
            id: 'case-2',
            companyId: 'COMP-001',
            employeeName: 'Mike Ross',
            dept: 'Engineering',
            score: 65,
            status: 'RISK_ALERT',
            managerName: 'Harvey Specter',
            hazardTrigger: 'Kitchen Counter Workspace (typing on high surface, shoulder shrugging)',
            createdAt: mikeCreated,
            timeframeHours: 24,
            escalationState: 'routed_to_manager',
            statutoryMetadata: {
                retentionPeriod: 40,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                retentionDescription: 'Ergonomic risk assessment retained 40 years under Regulation 10(1)',
                isStatutoryBreach: false,
                requiresOMPReferral: false,
                statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6 & Reg 10(1)',
                hierarchyOfControlsMandate: 'Administrative adjustment to seated desk with footrest.',
                competentPersonRequirement: 'Designated Health & Safety Representative',
                riskClassification: 'RISK_ALERT',
                statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
            }
        },
        {
            id: 'case-3',
            companyId: 'COMP-002',
            employeeName: 'Louis Litt',
            dept: 'Finance',
            score: 30,
            status: 'RISK_ALERT', // Physical postural hazard: High Risk (Priority Action), NOT Statutory Breach
            managerName: 'Sheila Sazs',
            hazardTrigger: `[${HIGH_RISK_TAG}] Working from Bed (severe pelvic tilt >=120°, cervical forward tilt >=30°)`,
            createdAt: louisCreated,
            timeframeHours: 24,
            escalationState: 'escalated_level_2',
            statutoryMetadata: {
                retentionPeriod: 40,
                retentionCategory: 'REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR',
                retentionDescription: 'Medical surveillance records retained 40 years under Regulation 10(1)',
                isStatutoryBreach: false,
                requiresOMPReferral: true,
                ompReferralStatus: OMP_REFERRAL_STATUTORY_STRING,
                statutoryCitation: 'OHS Act 85 of 1993 Sec 8(2) & Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 8(1), Reg 8(2) & Reg 10(1)',
                hierarchyOfControlsMandate: 'Elimination of bed-working; OMP referral recommended under Regulation 8(1).',
                competentPersonRequirement: 'Registered Occupational Medicine Practitioner (OMP)',
                riskClassification: 'HIGH_RISK_PRIORITY_ACTION',
                statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
            }
        },
        {
            id: 'case-4',
            companyId: 'COMP-001',
            employeeName: 'Harvey Specter',
            dept: 'Legal',
            score: 88,
            status: 'RISK_ALERT',
            managerName: 'Jessica Pearson',
            hazardTrigger: 'Monitor Height mismatch & continuous cervical extension',
            createdAt: harveyCreated,
            timeframeHours: 72,
            escalationState: 'routed_to_manager',
            statutoryMetadata: {
                retentionPeriod: 40,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                retentionDescription: 'Ergonomic assessment retained 40 years under Regulation 10(1)',
                isStatutoryBreach: false,
                requiresOMPReferral: false,
                statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6',
                hierarchyOfControlsMandate: 'Engineering: monitor arm elevation adjustment.',
                competentPersonRequirement: 'OHS Risk Assessor',
                riskClassification: 'RISK_ALERT',
                statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
            }
        }
    ];
};

export const useComplianceStore = create<ComplianceState>((set, get) => {
    
    const fireEvent = (name: string, detail: any) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(name, { detail }));
        }
    };

    // Global status: BREACH only when a case is a genuine statutory breach that is still open.
    const summariseStatus = (cases: EmployeeCase[]): { status: ComplianceStatus; requiresEscalation: boolean } => {
        const open = cases.filter(c => c.escalationState !== 'resolved');
        const hasBreach = open.some(c => c.status === 'BREACH');
        const hasRisk = open.some(c => c.status === 'RISK_ALERT' || c.status === 'OVERDUE_HIGH_RISK' || c.status === 'ESCALATED_UNRESOLVED');
        return {
            status: hasBreach ? 'BREACH' : (hasRisk ? 'RISK_ALERT' : 'COMPLIANT'),
            requiresEscalation: open.some(c => c.escalationState === 'routed_to_manager' || c.escalationState === 'escalated_level_2')
        };
    };

    const calculateGEARMetrics = (cases: EmployeeCase[]) => {
        const activeTrackingCases = cases.filter(c => c.escalationState === 'routed_to_manager' || c.escalationState === 'escalated_level_2');
        const level2Count = cases.filter(c => c.escalationState === 'escalated_level_2').length;

        const governance = Math.max(40, 100 - (activeTrackingCases.length * 10) - (level2Count * 15));
        const efficiency = Math.max(50, 100 - (level2Count * 20));
        const accountability = 98;
        const resolvedCount = cases.filter(c => c.escalationState === 'resolved').length;
        const resilience = Math.max(30, Math.min(100, 85 - (level2Count * 25) + (resolvedCount * 5)));

        return { governance, efficiency, accountability, resilience };
    };

    // NOTE: the store no longer listens to its own NON_COMPLIANCE_TRIGGER event.
    // Every action writes its own log entry; the event is only for other listeners.

    const initialCasesList = initialCases();

    return {
        status: 'RISK_ALERT',
        requiresEscalation: true,
        logs: [],
        exceptions: [],
        cases: initialCasesList,
        gear: calculateGEARMetrics(initialCasesList),
        demoMode: false,
        setDemoMode: (enabled) => set({ demoMode: enabled }),
        addWorkspaceException: (exception) => {
            useTenantStore.getState().recordUsage();
            set((state) => {
            const newExs = [...state.exceptions, exception];
            
            const newCase: EmployeeCase = {
                id: `case-${Date.now()}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: 'Self (Remote User)',
                dept: 'Engineering',
                score: 70,
                status: 'RISK_ALERT',
                managerName: 'Harvey Specter',
                hazardTrigger: `Workspace Exception: ${exception}`,
                createdAt: new Date().toISOString(),
                timeframeHours: 24,
                escalationState: 'routed_to_manager',
                statutoryMetadata: {
                    retentionPeriod: 40,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                    retentionDescription: 'Workspace exception risk record retained 40 years',
                    isStatutoryBreach: false,
                    requiresOMPReferral: false,
                    statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6 & 10(1)',
                    hierarchyOfControlsMandate: 'Employee exception self-audit log.',
                    competentPersonRequirement: 'OHS Coordinator',
                    riskClassification: 'RISK_ALERT',
                    statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
                }
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);

            return {
                exceptions: newExs,
                cases: newCases,
                gear: newGear,
                status: 'RISK_ALERT',
                requiresEscalation: true,
                logs: [
                    {
                        timestamp: new Date().toISOString(),
                        score: 18,
                        threshold: 15,
                        reason: `Workspace Exception Flagged: ${exception}`,
                        retentionPeriod: 40,
                        retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR'
                    },
                    ...state.logs
                ]
            };
            });
        },

        logHazardEvent: (type, description, severity = 'RISK_ALERT') => {
            const state = get();
            const evalResult = detectPhysicalStatutoryHazard(description + ' ' + type);
            
            const finalStatus: ComplianceStatus = evalResult.isStatutoryBreach 
                ? 'BREACH' 
                : 'RISK_ALERT';
            
            const finalScore = evalResult.isStatutoryBreach ? 15 : (evalResult.isPhysicalHighRisk ? 30 : 68);
            
            const formattedTrigger = evalResult.isStatutoryBreach
                ? `[STATUTORY BREACH] ${description}`
                : (evalResult.isPhysicalHighRisk 
                    ? `[${HIGH_RISK_TAG}] ${description}`
                    : `[Nelly Engine ${type.toUpperCase()}] ${description}`);

            const newCase: EmployeeCase = {
                id: `case-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: 'Self (ErgoSafe Telemetry)',
                dept: evalResult.isPhysicalHighRisk ? 'Operations & Processing' : 'Workstation Ergonomics',
                score: finalScore,
                status: finalStatus,
                managerName: 'Harvey Specter',
                hazardTrigger: formattedTrigger,
                createdAt: new Date().toISOString(),
                timeframeHours: evalResult.isStatutoryBreach ? 24 : 72,
                escalationState: 'routed_to_manager',
                statutoryMetadata: evalResult.statutoryMetadata
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);
            const newLog: ComplianceLog = {
                timestamp: new Date().toISOString(),
                score: finalScore,
                threshold: 80,
                reason: formattedTrigger,
                retentionPeriod: evalResult.statutoryMetadata.retentionPeriod,
                retentionCategory: evalResult.statutoryMetadata.retentionCategory,
                requiresOMPReferral: evalResult.statutoryMetadata.requiresOMPReferral,
                ompReferralStatus: evalResult.statutoryMetadata.ompReferralStatus,
                isStatutoryBreach: evalResult.isStatutoryBreach
            };

            // Pure state update without side-effects inside set
            set({
                cases: newCases,
                gear: newGear,
                status: evalResult.isStatutoryBreach ? 'BREACH' : state.status,
                requiresEscalation: true,
                logs: [newLog, ...state.logs]
            });

            // Side effects executed cleanly outside set updater
            useTenantStore.getState().recordUsage();
            fireEvent('NON_COMPLIANCE_TRIGGER', {
                score: newLog.score,
                threshold: newLog.threshold,
                timestamp: newLog.timestamp,
                reason: newLog.reason
            });
        },

        evaluateStatutoryPhysicalHazard: (hazardType, contextDetails, employeeName = 'Floor Operator', dept = 'Processing & Logistics') => {
            const evalResult = detectPhysicalStatutoryHazard(`${hazardType} ${contextDetails}`);
            
            // Physical risk thresholds are HIGH RISK (priority action), never a statutory BREACH
            const formattedTrigger = evalResult.isPhysicalHighRisk
                ? `[${evalResult.hazardLabel}] ${contextDetails}`
                : `[${HIGH_RISK_TAG}] ${evalResult.hazardLabel}: ${contextDetails}`;

            const caseRecord: EmployeeCase = {
                id: `statutory-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName,
                dept,
                score: 30, // High Risk score
                status: 'RISK_ALERT', // Physical hazard is classified as RISK_ALERT / High Risk, NOT statutory BREACH
                managerName: 'Harvey Specter (OHS Sec 16.2 Appointee)',
                hazardTrigger: formattedTrigger,
                createdAt: new Date().toISOString(),
                timeframeHours: HIGH_RISK_SLA_HOURS,
                escalationState: 'routed_to_manager',
                statutoryMetadata: evalResult.statutoryMetadata
            };

            const state = get();
            const newCases = [caseRecord, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);
            const newLog: ComplianceLog = {
                timestamp: new Date().toISOString(),
                score: 30,
                threshold: 80,
                reason: formattedTrigger,
                retentionPeriod: 40,
                retentionCategory: 'REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR',
                requiresOMPReferral: true,
                ompReferralStatus: OMP_REFERRAL_STATUTORY_STRING,
                isStatutoryBreach: false
            };

            set({
                cases: newCases,
                gear: newGear,
                requiresEscalation: true,
                logs: [newLog, ...state.logs]
            });

            fireEvent('NON_COMPLIANCE_TRIGGER', {
                score: 30,
                threshold: 80,
                timestamp: newLog.timestamp,
                reason: newLog.reason
            });

            return { triggered: true, caseRecord };
        },

        logStatutoryLegalBreach: (breachType, details, responsiblePerson = 'Appointed Section 16(2) Manager') => {
            let label = 'STATUTORY BREACH: ';
            let citation = 'OHS Act 85 of 1993';

            if (breachType === 'missing_sec16_2') {
                label += 'Absence of Section 16(2) Health & Safety Delegation of Authority';
                citation = 'OHS Act 85 of 1993 Section 16(2)';
            } else if (breachType === 'missing_sec17_she_rep') {
                label += 'Absence of Section 17 Health & Safety Representative Designation';
                citation = 'OHS Act 85 of 1993 Section 17';
            } else if (breachType === 'missing_reg6_assessment') {
                label += 'Failure to Conduct / Maintain Regulation 6 Ergonomic Risk Assessment';
                citation = 'Ergonomics Regulations, 2019 (GN R1589) Regulation 6';
            } else if (breachType === 'refusal_reg10_retention') {
                label += 'Refusal to Maintain Statutory Records per Regulation 10(1)';
                citation = 'Ergonomics Regulations, 2019 (GN R1589) Regulation 10(1)';
            } else if (breachType === 'uncertified_machinery_dmr18') {
                label += 'Operating Driven Machinery Without Certified Competency / Missing Guards';
                citation = 'Driven Machinery Regulations 18 & General Machinery Regulations 2';
            }

            const caseRecord: EmployeeCase = {
                id: `breach-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: responsiblePerson,
                dept: 'Executive Compliance & Legal',
                score: 15,
                status: 'BREACH', // Genuine Statutory Legal Non-Compliance
                managerName: 'Managing Director / CEO (Section 16.1)',
                hazardTrigger: `[STATUTORY BREACH] ${label}: ${details}`,
                createdAt: new Date().toISOString(),
                timeframeHours: 24,
                escalationState: 'routed_to_manager',
                statutoryMetadata: {
                    retentionPeriod: 40,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                    retentionDescription: 'Statutory non-compliance ledger retained 40 years under Regulation 10(1)',
                    isStatutoryBreach: true,
                    requiresOMPReferral: false,
                    statutoryCitation: citation,
                    hierarchyOfControlsMandate: 'Immediate legal remediation mandatory under Section 38 penalty liability.',
                    competentPersonRequirement: 'Appointed Sec 16.1 / 16.2 Executive',
                    riskClassification: 'STATUTORY_BREACH',
                    statutoryNotice: 'Statutory legal breach under South African OHS legislation'
                }
            };

            const state = get();
            const newCases = [caseRecord, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);
            const newLog: ComplianceLog = {
                timestamp: new Date().toISOString(),
                score: 15,
                threshold: 80,
                reason: `[STATUTORY BREACH] ${label}: ${details}`,
                retentionPeriod: 40,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                isStatutoryBreach: true
            };

            set({
                cases: newCases,
                gear: newGear,
                status: 'BREACH',
                requiresEscalation: true,
                logs: [newLog, ...state.logs]
            });

            fireEvent('NON_COMPLIANCE_TRIGGER', {
                score: 15,
                threshold: 80,
                timestamp: newLog.timestamp,
                reason: newLog.reason
            });

            return caseRecord;
        },

        logEmployeeTrainingRecord: (moduleName, employeeName, competencyVerified) => {
            useTenantStore.getState().recordUsage();
            set((state) => {
            const timestamp = new Date().toISOString();

            const newCase: EmployeeCase = {
                id: `train-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName,
                dept: 'Ergonomics Training & Competency',
                score: competencyVerified ? 100 : 75,
                status: 'COMPLIANT',
                managerName: 'Designated Ergonomics Trainer',
                hazardTrigger: `Regulation 3 Training Completed: [${moduleName}]. Competency verified: ${competencyVerified}. Retained for duration of employment.`,
                createdAt: timestamp,
                timeframeHours: 72,
                escalationState: 'resolved',
                statutoryMetadata: {
                    retentionPeriod: 'TENURE', // Duration of employment under Regulation 10(1)
                    retentionCategory: 'REG_3_EMPLOYEE_TRAINING_RECORD_TENURE',
                    retentionDescription: 'Employee training record retained for duration of employment under Regulation 10(1)',
                    isStatutoryBreach: false,
                    requiresOMPReferral: false,
                    statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589) Regulation 3 & Regulation 10(1)',
                    hierarchyOfControlsMandate: 'Administrative training & competency verification.',
                    competentPersonRequirement: 'Certified Ergonomics Training Facilitator',
                    riskClassification: 'COMPLIANT',
                    statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
                }
            };

            const newLog: ComplianceLog = {
                timestamp,
                score: 100,
                threshold: 80,
                reason: `Training Record Archived: ${moduleName} for ${employeeName} [Retained for Duration of Employment]`,
                retentionPeriod: 'TENURE',
                retentionCategory: 'REG_3_EMPLOYEE_TRAINING_RECORD_TENURE'
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);

            return {
                cases: newCases,
                gear: newGear,
                logs: [newLog, ...state.logs]
            };
            });
        },

        logVerifiedBBSIntervention: (type, hazardResolved, durationSeconds) => {
            useTenantStore.getState().recordUsage();
            set((state) => {
            const timestamp = new Date().toISOString();
            const userId = useTenantStore.getState().userId || 'EMP-7749';

            const newCase: EmployeeCase = {
                id: `bbs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: `Self (${userId})`,
                dept: 'Behavior-Based Safety (BBS)',
                score: 98,
                status: 'COMPLIANT',
                managerName: 'Harvey Specter',
                hazardTrigger: `Verified BBS Micro-Intervention: Resolved [${hazardResolved}] via ${durationSeconds}s ${type}`,
                createdAt: timestamp,
                timeframeHours: 72,
                escalationState: 'resolved',
                statutoryMetadata: {
                    retentionPeriod: 40,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                    retentionDescription: 'Intervention log retained 40 years as ergonomic record',
                    isStatutoryBreach: false,
                    requiresOMPReferral: false,
                    statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6',
                    hierarchyOfControlsMandate: 'Administrative behavioral micro-break corrective action verified.',
                    competentPersonRequirement: 'Internal Ergonomics Auditor',
                    riskClassification: 'COMPLIANT',
                    statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
                }
            };

            const newLog: ComplianceLog = {
                timestamp,
                score: 98,
                threshold: 80,
                reason: `Verified BBS Micro-Intervention: Completed ${type} (${durationSeconds}s) for [${hazardResolved}]`,
                retentionPeriod: 40,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR'
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);

            return {
                cases: newCases,
                gear: newGear,
                logs: [newLog, ...state.logs]
            };
            });
        },

        exportStatutoryDocToAuditLog: (docType, siteContext, previewText, reviewerName = 'Competent Person (Appointed Sec 16.2)', reviewerRole = 'Statutory Risk Assessor') => set((state) => {
            const timestamp = new Date().toISOString();
            const id = `statutory-doc-${Date.now()}`;
            
            // 40-year retention under Ergonomics Regulations Regulation 10(1)
            const retentionPeriod: StatutoryRetentionPeriod = 40;

            const newCase: EmployeeCase = {
                id,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: `Document Compilation: ${docType}`,
                dept: 'Statutory OHS Assurance',
                score: 100,
                status: 'COMPLIANT',
                managerName: reviewerName,
                hazardTrigger: `Statutory Dossier Exported: ${docType} for [${siteContext}]. Signed off by ${reviewerRole}. Grounded in OHS Act 85/1993, Ergonomics Regulations, 2019 (GN R1589) & Physical Agents Regulations, 2024 (GN 5952). Mandatory 40-Year Retention locked.`,
                createdAt: timestamp,
                timeframeHours: 72,
                escalationState: 'resolved',
                statutoryMetadata: {
                    retentionPeriod,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                    retentionDescription: 'Risk assessment records retained 40 years under Regulation 10(1)',
                    isStatutoryBreach: false,
                    requiresOMPReferral: docType.includes('HIRA') || docType.includes('Cold'),
                    ompReferralStatus: docType.includes('HIRA') ? OMP_REFERRAL_STATUTORY_STRING : undefined,
                    statutoryCitation: 'OHS Act 85 of 1993 Section 8, Ergonomics Regulations, 2019 (GN R1589) Reg 6 & 10(1), Physical Agents Regulations, 2024 (GN 5952)',
                    hierarchyOfControlsMandate: 'Elimination -> Substitution -> Engineering -> Administrative -> PPE',
                    competentPersonRequirement: reviewerRole,
                    riskClassification: 'COMPLIANT',
                    statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
                }
            };

            const newLog: ComplianceLog = {
                timestamp,
                score: 100,
                threshold: 80,
                reason: `Statutory Archive Created: ${docType} (${siteContext}) [40-Year Statutory Retention Enforced under Reg 10(1)]`,
                retentionPeriod,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR'
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);

            return {
                cases: newCases,
                gear: newGear,
                logs: [newLog, ...state.logs]
            };
        }),

        resetCompliance: () => set((state) => {
            const resolvedCases = state.cases.map(c => ({
                ...c,
                status: 'COMPLIANT' as const,
                score: 98,
                escalationState: 'resolved' as const
            }));
            return {
                status: 'COMPLIANT',
                requiresEscalation: false,
                cases: resolvedCases,
                exceptions: [],
                gear: calculateGEARMetrics(resolvedCases)
            };
        }),

        resolveCase: (id) => {
            const state = get();
            const updatedCases = state.cases.map(c => 
                c.id === id ? { ...c, status: 'COMPLIANT' as const, score: 98, escalationState: 'resolved' as const } : c
            );
            set({
                cases: updatedCases,
                ...summariseStatus(updatedCases),
                gear: calculateGEARMetrics(updatedCases)
            });
            fireEvent('OHS_TRACKING_UPDATE', { id, newStatus: 'resolved' });
        },

        updateCaseEscalation: (id, escalationState) => {
            const state = get();
            const updatedCases = state.cases.map(c => {
                if (c.id === id) {
                    const isLegalBreach = c.statutoryMetadata?.isStatutoryBreach === true;
                    let status = c.status;
                    if (escalationState === 'escalated_level_2') {
                        status = isLegalBreach ? ('BREACH' as const) : (c.status === 'RISK_ALERT' ? ('OVERDUE_HIGH_RISK' as const) : c.status);
                    } else if (escalationState === 'resolved') {
                        status = 'COMPLIANT' as const;
                    }
                    return { ...c, escalationState, status };
                }
                return c;
            });
            set({
                cases: updatedCases,
                ...summariseStatus(updatedCases),
                gear: calculateGEARMetrics(updatedCases)
            });

            fireEvent('OHS_TRACKING_UPDATE', { id, newStatus: escalationState });
        },

        tickSimulatedTime: () => {
            const state = get();
            const now = Date.now();
            const escalated: EmployeeCase[] = [];

            const updatedCases = state.cases.map((c) => {
                if (c.escalationState !== 'routed_to_manager') return c;
                const createdTime = new Date(c.createdAt).getTime();
                // Real elapsed hours; the accelerated clock (1 s = 1 h) runs ONLY when demoMode is explicitly on
                const elapsedHours = state.demoMode 
                    ? (now - createdTime) / 1000 
                    : (now - createdTime) / 3600000;
                if (elapsedHours <= c.timeframeHours) return c;

                const isLegalBreach = c.statutoryMetadata?.isStatutoryBreach === true;
                const next: EmployeeCase = {
                    ...c,
                    status: isLegalBreach ? 'BREACH' : (c.status === 'RISK_ALERT' ? 'OVERDUE_HIGH_RISK' : c.status),
                    escalationState: 'escalated_level_2'
                };
                escalated.push(next);
                return next;
            });

            if (escalated.length === 0) return;

            set({
                cases: updatedCases,
                ...summariseStatus(updatedCases),
                gear: calculateGEARMetrics(updatedCases)
            });

            for (const c of escalated) {
                fireEvent('OHS_TRACKING_UPDATE', { 
                    id: c.id, 
                    employeeName: c.employeeName, 
                    newStatus: 'escalated_level_2',
                    reason: `Timeframe Escalation: Manager ${c.managerName} did not resolve within ${c.timeframeHours} hours.` 
                });
            }
        },

        processTelemetry: (data) => {
            useTenantStore.getState().recordUsage();
            const { pelvicSpineAngle, cervicalSpineTilt, shoulderElbowAngle, shoulderElevation, setupName } = data;
            
            let triggered = false;
            let reason = '';

            if (setupName === 'Bed' && pelvicSpineAngle >= 120 && cervicalSpineTilt >= 30) {
                triggered = true;
                reason = `Unsafe Bed Workspace (MediaPipe 3D): Pelvic-to-Spine angle is ${pelvicSpineAngle}° (>=120°) with cervical spine forward tilt of ${cervicalSpineTilt}° (>=30°).`;
            } else if (setupName === 'Kitchen Counter' && shoulderElbowAngle < 90 && shoulderElevation >= 15) {
                triggered = true;
                reason = `Unsafe Kitchen Counter (MediaPipe 3D): Shoulder-to-Elbow acute angle is ${shoulderElbowAngle}° (<90°) with elevated shoulder shrugging of ${shoulderElevation}px (>=15px).`;
            } else if (setupName === 'Couch' && (pelvicSpineAngle >= 115 || cervicalSpineTilt >= 25)) {
                triggered = true;
                reason = `Unsafe Couch Workspace (MediaPipe 3D): Poor spinal alignment (Pelvic-to-Spine: ${pelvicSpineAngle}°, Cervical Tilt: ${cervicalSpineTilt}°).`;
            }

            if (triggered) {
                const evalResult = detectPhysicalStatutoryHazard(reason);
                const newCase: EmployeeCase = {
                    id: `case-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    companyId: useTenantStore.getState().companyId || 'COMP-001',
                    employeeName: 'Self (Remote User)',
                    dept: 'Engineering',
                    score: 30, // High Risk score
                    status: 'RISK_ALERT', // Physical postural hazard: High Risk (Priority Action), NOT statutory BREACH
                    managerName: setupName === 'Bed' ? 'Sheila Sazs' : 'Harvey Specter',
                    hazardTrigger: `[${HIGH_RISK_TAG}] ${reason}`,
                    createdAt: new Date().toISOString(),
                    timeframeHours: 72,
                    escalationState: 'routed_to_manager',
                    statutoryMetadata: evalResult.statutoryMetadata
                };

                const newLog: ComplianceLog = {
                    timestamp: new Date().toISOString(),
                    score: 20,
                    threshold: 15,
                    reason,
                    retentionPeriod: 40,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR'
                };
                const state = get();
                const newCases = [newCase, ...state.cases];
                set({
                    cases: newCases,
                    gear: calculateGEARMetrics(newCases),
                    requiresEscalation: true,
                    logs: [newLog, ...state.logs]
                });

                fireEvent('NON_COMPLIANCE_TRIGGER', {
                    score: newLog.score,
                    threshold: newLog.threshold,
                    timestamp: newLog.timestamp,
                    reason
                });
            }

            return { triggered, reason };
        }
    };
});

/** Snapshot of the store as first created. Tests reset with setState(initialComplianceState, true). */
export const initialComplianceState: ComplianceState = useComplianceStore.getState();
