import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  HardHat,
  Lock,
  Plus,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  sha256Hex,
  STATUTORY_ASSESSMENTS_STORAGE_KEY,
} from '../../utils/popiaCrypto';
import { newId } from '../../utils/ids';
import { AITransparencyBadge } from '../../components/compliance/AITransparencyBadge';
import { StatutoryDisclaimerBanner } from '../../components/common/StatutoryDisclaimerBanner';

export type AssessmentMethod = 'RULA' | 'REBA' | 'NIOSH';
export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
export type ControlTier =
  | 'Elimination'
  | 'Substitution'
  | 'Engineering'
  | 'Administrative'
  | 'PPE';

export type EarlyReviewTrigger =
  | 'Work Method Change'
  | 'New Equipment / Tools'
  | 'Workstation Layout Change'
  | 'Ergonomic Incident / MSD Report'
  | 'OHP Medical Surveillance Referral';

export const EARLY_REVIEW_TRIGGERS: EarlyReviewTrigger[] = [
  'Work Method Change',
  'New Equipment / Tools',
  'Workstation Layout Change',
  'Ergonomic Incident / MSD Report',
  'OHP Medical Surveillance Referral',
];

export const CONTROL_TIERS: ControlTier[] = [
  'Elimination',
  'Substitution',
  'Engineering',
  'Administrative',
  'PPE',
];

export interface RulaInputs {
  upperArm: number; // 1-6
  lowerArm: number; // 1-3
  wrist: number; // 1-4
  neck: number; // 1-6
  trunk: number; // 1-6
  muscleLoad: number; // 0-4
}

export interface RebaInputs {
  trunk: number; // 1-5
  neck: number; // 1-3
  legs: number; // 1-4
  upperArm: number; // 1-6
  lowerArm: number; // 1-2
  wrist: number; // 1-3
  loadCoupling: number; // 0-5
}

export interface NioshInputs {
  loadWeightKg: number;
  horizontalDistanceCm: number;
  verticalLocationCm: number;
  travelDistanceCm: number;
  asymmetryDeg: number;
  frequencyMultiplier: number; // 0.1-1.0
  couplingMultiplier: number; // 0.9-1.0
}

export interface StatutoryControl {
  id: string;
  tier: ControlTier;
  description: string;
  addedAt: string;
}

export interface StatutoryTaskAssessment {
  id: string;
  taskName: string;
  department: string;
  assessmentDate: string; // YYYY-MM-DD
  reassessmentDueDate: string; // YYYY-MM-DD (+24 months)
  method: AssessmentMethod;
  rulaInputs?: RulaInputs;
  rebaInputs?: RebaInputs;
  nioshInputs?: NioshInputs;
  score: number; // RULA 1-7, REBA 1-15, NIOSH LI
  rwlKg?: number;
  riskBand: RiskBand;
  actionSummary: string;
  earlyReviewTriggers: EarlyReviewTrigger[];
  controls: StatutoryControl[];
  isControlled: boolean;
  controlledAt: string | null;
  consultationNotes: string;
  consultationDate: string;
  competentPersonName: string;
  competentPersonCredentials: string;
  competentPersonSignedAt: string | null;
  reg8MedicalReferral: boolean;
  createdAt: string;
}

export interface ArchiveState {
  sha256Digest: string;
  generatedAt: string;
  jsonContent: string;
  taskCount: number;
}

const RETENTION_TAGS = {
  fortyYears: {
    retentionPeriod: '40 Years',
    statutoryBasis:
      'GN R1589 Reg 6 Ergonomic Risk Assessments & Reg 8(2) Medical Surveillance Referrals',
  },
  threeYears: {
    retentionPeriod: '3 Years',
    statutoryBasis:
      'GN R1589 Reg 7 & Reg 9 Control Measures & Maintenance/Inspection Records',
  },
  durationOfEmployment: {
    retentionPeriod: 'Duration of Employment',
    statutoryBasis:
      'GN R1589 Reg 3 Employee Information & Training Records',
  },
} as const;

function getTodayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function clampNumber(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(max, Math.max(min, val));
}

export function addMonthsIsoDate(isoDate: string, months: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    return addMonthsIsoDate(getTodayIsoDate(), months);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const totalMonths = year * 12 + (month - 1) + months;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonth = (totalMonths % 12) + 1;
  const maxDayInMonth = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  const targetDay = Math.min(day, maxDayInMonth);

  return `${String(targetYear).padStart(4, '0')}-${String(targetMonth).padStart(2, '0')}-${String(
    targetDay
  ).padStart(2, '0')}`;
}

function getDaysRemaining(dueIsoDate: string): number {
  const todayStr = getTodayIsoDate();
  const parseUtc = (s: string): number => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return Date.now();
    return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  };
  const diffMs = parseUtc(dueIsoDate) - parseUtc(todayStr);
  return Math.ceil(diffMs / 86400000);
}

export function calculateRula(inputs: RulaInputs): {
  score: number;
  riskBand: RiskBand;
  actionSummary: string;
} {
  const upperArm = clampNumber(Math.round(inputs.upperArm), 1, 6);
  const lowerArm = clampNumber(Math.round(inputs.lowerArm), 1, 3);
  const wrist = clampNumber(Math.round(inputs.wrist), 1, 4);
  const neck = clampNumber(Math.round(inputs.neck), 1, 6);
  const trunk = clampNumber(Math.round(inputs.trunk), 1, 6);
  const muscleLoad = clampNumber(Math.round(inputs.muscleLoad), 0, 4);

  const raw =
    1 +
    Math.round(
      (upperArm - 1) * 0.32 +
        (lowerArm - 1) * 0.35 +
        (wrist - 1) * 0.32 +
        (neck - 1) * 0.32 +
        (trunk - 1) * 0.36 +
        muscleLoad * 0.42
    );
  const score = clampNumber(raw, 1, 7);

  if (score <= 2) {
    return {
      score,
      riskBand: 'LOW',
      actionSummary: 'Acceptable posture if not maintained or repeated for long periods.',
    };
  }
  if (score <= 4) {
    return {
      score,
      riskBand: 'MEDIUM',
      actionSummary: 'Further investigation needed; changes may be required.',
    };
  }
  if (score <= 6) {
    return {
      score,
      riskBand: 'HIGH',
      actionSummary: 'Investigate and implement workstation/task changes soon.',
    };
  }
  return {
    score,
    riskBand: 'VERY_HIGH',
    actionSummary: 'Implement corrective ergonomic changes immediately.',
  };
}

export function calculateReba(inputs: RebaInputs): {
  score: number;
  riskBand: RiskBand;
  actionSummary: string;
} {
  const trunk = clampNumber(Math.round(inputs.trunk), 1, 5);
  const neck = clampNumber(Math.round(inputs.neck), 1, 3);
  const legs = clampNumber(Math.round(inputs.legs), 1, 4);
  const upperArm = clampNumber(Math.round(inputs.upperArm), 1, 6);
  const lowerArm = clampNumber(Math.round(inputs.lowerArm), 1, 2);
  const wrist = clampNumber(Math.round(inputs.wrist), 1, 3);
  const loadCoupling = clampNumber(Math.round(inputs.loadCoupling), 0, 5);

  const raw =
    1 +
    Math.round(
      (trunk - 1) * 0.8 +
        (neck - 1) * 0.8 +
        (legs - 1) * 0.75 +
        (upperArm - 1) * 0.65 +
        (lowerArm - 1) * 0.7 +
        (wrist - 1) * 0.7 +
        loadCoupling * 0.85
    );
  const score = clampNumber(raw, 1, 15);

  if (score === 1) {
    return {
      score,
      riskBand: 'LOW',
      actionSummary: 'Negligible risk; no immediate intervention required.',
    };
  }
  if (score <= 3) {
    return {
      score,
      riskBand: 'LOW',
      actionSummary: 'Low risk; periodic monitoring recommended.',
    };
  }
  if (score <= 7) {
    return {
      score,
      riskBand: 'MEDIUM',
      actionSummary: 'Medium risk; further ergonomic investigation and control planning needed.',
    };
  }
  if (score <= 10) {
    return {
      score,
      riskBand: 'HIGH',
      actionSummary: 'High risk; investigate and implement engineering/job controls soon.',
    };
  }
  return {
    score,
    riskBand: 'VERY_HIGH',
    actionSummary: 'Very high risk; implement corrective controls immediately.',
  };
}

export function calculateNiosh(inputs: NioshInputs): {
  hm: number;
  vm: number;
  dm: number;
  am: number;
  fm: number;
  cm: number;
  rwlKg: number;
  li: number;
  riskBand: RiskBand;
  actionSummary: string;
} {
  const loadWeightKg = Math.max(0.1, Number.isFinite(inputs.loadWeightKg) ? inputs.loadWeightKg : 0.1);
  const h = Math.max(25, Number.isFinite(inputs.horizontalDistanceCm) ? inputs.horizontalDistanceCm : 25);
  const v = Math.max(0, Number.isFinite(inputs.verticalLocationCm) ? inputs.verticalLocationCm : 75);
  const d = Math.max(25, Number.isFinite(inputs.travelDistanceCm) ? inputs.travelDistanceCm : 25);
  const a = clampNumber(Number.isFinite(inputs.asymmetryDeg) ? inputs.asymmetryDeg : 0, 0, 135);
  const fm = clampNumber(inputs.frequencyMultiplier, 0.1, 1.0);
  const cm = clampNumber(inputs.couplingMultiplier, 0.9, 1.0);

  const hm = Math.min(1, 25 / h);
  const vm = Math.max(0, 1 - 0.003 * Math.abs(v - 75));
  const dm = Math.min(1, 0.82 + 4.5 / d);
  const am = Math.max(0, 1 - 0.0032 * a);

  const rwlKg = Math.max(0.1, 23 * hm * vm * dm * am * fm * cm);
  const li = loadWeightKg / rwlKg;

  let riskBand: RiskBand = 'LOW';
  let actionSummary = 'LI <= 1.0: Nominal manual handling load within recommended weight limit.';
  if (li > 3.0) {
    riskBand = 'VERY_HIGH';
    actionSummary = 'LI > 3.0: Severe biomechanical overload — redesign lifting task immediately.';
  } else if (li > 2.0) {
    riskBand = 'HIGH';
    actionSummary = '2.0 < LI <= 3.0: High manual handling strain — implement lift assists soon.';
  } else if (li > 1.0) {
    riskBand = 'MEDIUM';
    actionSummary = '1.0 < LI <= 2.0: Elevated lifting index — investigate load & posture geometry.';
  }

  return {
    hm: Number(hm.toFixed(3)),
    vm: Number(vm.toFixed(3)),
    dm: Number(dm.toFixed(3)),
    am: Number(am.toFixed(3)),
    fm: Number(fm.toFixed(3)),
    cm: Number(cm.toFixed(3)),
    rwlKg: Number(rwlKg.toFixed(2)),
    li: Number(li.toFixed(2)),
    riskBand,
    actionSummary,
  };
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObjectKeys(record[key]);
        return acc;
      }, {});
  }
  return value;
}

function createSeedTasks(): StatutoryTaskAssessment[] {
  const today = getTodayIsoDate();
  const nioshSeedInputs: NioshInputs = {
    loadWeightKg: 18,
    horizontalDistanceCm: 45,
    verticalLocationCm: 40,
    travelDistanceCm: 75,
    asymmetryDeg: 30,
    frequencyMultiplier: 0.85,
    couplingMultiplier: 0.95,
  };
  const nioshRes = calculateNiosh(nioshSeedInputs);

  const rulaSeedInputs: RulaInputs = {
    upperArm: 3,
    lowerArm: 2,
    wrist: 2,
    neck: 3,
    trunk: 3,
    muscleLoad: 1,
  };
  const rulaRes = calculateRula(rulaSeedInputs);

  return [
    {
      id: 'ergosafe-seed-palletising-01',
      taskName: 'Palletising & Case Pick — Dispatch Bay A',
      department: 'ErgoSafe Logistics & Dispatch',
      assessmentDate: today,
      reassessmentDueDate: addMonthsIsoDate(today, 24),
      method: 'NIOSH',
      nioshInputs: nioshSeedInputs,
      score: nioshRes.li,
      rwlKg: nioshRes.rwlKg,
      riskBand: nioshRes.riskBand,
      actionSummary: nioshRes.actionSummary,
      earlyReviewTriggers: [],
      controls: [],
      isControlled: false,
      controlledAt: null,
      consultationNotes:
        'H&S representative walk-through completed at Dispatch Bay A; scissor-lift pallet leveller requested by floor crew.',
      consultationDate: today,
      competentPersonName: 'Thabo Mokoena (Pr.Eng / Ergonomics Specialist)',
      competentPersonCredentials: 'SAIOH / ECSA Reg #ES-2026-041',
      competentPersonSignedAt: null,
      reg8MedicalReferral: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ergosafe-seed-deburring-02',
      taskName: 'Precision Component Deburring & Inspection Bench',
      department: 'ErgoSafe Fabrication Cell 2',
      assessmentDate: today,
      reassessmentDueDate: addMonthsIsoDate(today, 24),
      method: 'RULA',
      rulaInputs: rulaSeedInputs,
      score: rulaRes.score,
      riskBand: rulaRes.riskBand,
      actionSummary: rulaRes.actionSummary,
      earlyReviewTriggers: [],
      controls: [
        {
          id: 'ergosafe-seed-ctrl-01',
          tier: 'Administrative',
          description:
            'Scheduled 90-minute task rotation and micro-pause stretching protocol.',
          addedAt: new Date().toISOString(),
        },
      ],
      isControlled: false,
      controlledAt: null,
      consultationNotes:
        'Bench technicians consulted during toolbox briefing; requested angled work-holding jig to reduce neck flexion.',
      consultationDate: today,
      competentPersonName: 'Naledi Khumalo (OHS & Ergonomics Practitioner)',
      competentPersonCredentials: 'SACPCMP / CHSO-4419',
      competentPersonSignedAt: null,
      reg8MedicalReferral: false,
      createdAt: new Date().toISOString(),
    },
  ];
}

function loadTasksFromStorage(): StatutoryTaskAssessment[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createSeedTasks();
  }
  try {
    const raw = window.localStorage.getItem(STATUTORY_ASSESSMENTS_STORAGE_KEY);
    if (!raw) {
      return createSeedTasks();
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as StatutoryTaskAssessment[];
    }
    if (Array.isArray(parsed) && parsed.length === 0) {
      return [];
    }
    return createSeedTasks();
  } catch {
    return createSeedTasks();
  }
}

function riskBandBadgeClasses(band: RiskBand): string {
  switch (band) {
    case 'LOW':
      return 'bg-[#064E3B] text-white border-[#10B981]/50';
    case 'MEDIUM':
      return 'bg-[#D97706]/25 text-[#FCD34D] border-[#D97706]';
    case 'HIGH':
      return 'bg-orange-900/60 text-orange-200 border-orange-500';
    case 'VERY_HIGH':
      return 'bg-red-900/70 text-red-100 border-red-500';
  }
}

export const StatutoryErgonomicsModule: React.FC = () => {
  const [tasks, setTasks] = useState<StatutoryTaskAssessment[]>(() => loadTasksFromStorage());
  const [selectedTaskId, setSelectedTaskId] = useState<string>(() => {
    const initial = loadTasksFromStorage();
    return initial[0]?.id ?? '';
  });

  // Skip auto-persisting immediately after ERGOSAFE_LOCAL_DATA_WIPED so localStorage stays wiped
  const skipPersistRef = useRef<boolean>(false);

  // Calculator form state
  const [taskName, setTaskName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [assessmentDate, setAssessmentDate] = useState<string>(() => getTodayIsoDate());
  const [method, setMethod] = useState<AssessmentMethod>('RULA');

  const [rulaInputs, setRulaInputs] = useState<RulaInputs>({
    upperArm: 2,
    lowerArm: 2,
    wrist: 2,
    neck: 2,
    trunk: 2,
    muscleLoad: 1,
  });

  const [rebaInputs, setRebaInputs] = useState<RebaInputs>({
    trunk: 2,
    neck: 2,
    legs: 2,
    upperArm: 3,
    lowerArm: 1,
    wrist: 2,
    loadCoupling: 1,
  });

  const [nioshInputs, setNioshInputs] = useState<NioshInputs>({
    loadWeightKg: 15,
    horizontalDistanceCm: 40,
    verticalLocationCm: 55,
    travelDistanceCm: 60,
    asymmetryDeg: 15,
    frequencyMultiplier: 0.85,
    couplingMultiplier: 0.95,
  });

  // Active task control addition state
  const [controlTier, setControlTier] = useState<ControlTier>('Engineering');
  const [controlDescription, setControlDescription] = useState<string>('');

  // Archive exporter state
  const [archiveState, setArchiveState] = useState<ArchiveState | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState<boolean>(false);

  // Persist tasks to localStorage
  useEffect(() => {
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(STATUTORY_ASSESSMENTS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore storage quota errors
    }
  }, [tasks]);

  // Listen to ERGOSAFE_LOCAL_DATA_WIPED
  useEffect(() => {
    const handleWipe = () => {
      skipPersistRef.current = true;
      const seeded = createSeedTasks();
      setTasks(seeded);
      setSelectedTaskId(seeded[0]?.id ?? '');
      setTaskName('');
      setDepartment('');
      setAssessmentDate(getTodayIsoDate());
      setControlDescription('');
      setArchiveState(null);
      setArchiveError(null);
    };

    window.addEventListener('ERGOSAFE_LOCAL_DATA_WIPED', handleWipe);
    return () => {
      window.removeEventListener('ERGOSAFE_LOCAL_DATA_WIPED', handleWipe);
    };
  }, []);

  const livePreview = useMemo(() => {
    if (method === 'RULA') {
      const res = calculateRula(rulaInputs);
      return {
        label: 'RULA Grand Score (1–7)',
        valueDisplay: `${res.score} / 7`,
        score: res.score,
        riskBand: res.riskBand,
        actionSummary: res.actionSummary,
        nioshDetails: null,
      };
    }
    if (method === 'REBA') {
      const res = calculateReba(rebaInputs);
      return {
        label: 'REBA Grand Score (1–15)',
        valueDisplay: `${res.score} / 15`,
        score: res.score,
        riskBand: res.riskBand,
        actionSummary: res.actionSummary,
        nioshDetails: null,
      };
    }
    const res = calculateNiosh(nioshInputs);
    return {
      label: 'NIOSH Lifting Index (LI)',
      valueDisplay: `${res.li.toFixed(2)} (RWL ${res.rwlKg.toFixed(2)} kg)`,
      score: res.li,
      riskBand: res.riskBand,
      actionSummary: res.actionSummary,
      nioshDetails: res,
    };
  }, [method, rulaInputs, rebaInputs, nioshInputs]);

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? tasks[0] ?? null,
    [tasks, selectedTaskId]
  );

  const updateActiveTask = (
    updater: (prev: StatutoryTaskAssessment) => StatutoryTaskAssessment
  ) => {
    if (!activeTask) return;
    setTasks((prev) =>
      prev.map((task) => (task.id === activeTask.id ? updater(task) : task))
    );
  };

  const handleRecordTaskAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedName =
      taskName.trim() || `${method} Workstation Task (${getTodayIsoDate()})`;
    const resolvedDept = department.trim() || 'ErgoSafe Operations';
    const resolvedDate = /^\d{4}-\d{2}-\d{2}$/.test(assessmentDate)
      ? assessmentDate
      : getTodayIsoDate();

    const newTask: StatutoryTaskAssessment = {
      id: newId('stat-task'),
      taskName: resolvedName,
      department: resolvedDept,
      assessmentDate: resolvedDate,
      reassessmentDueDate: addMonthsIsoDate(resolvedDate, 24),
      method,
      rulaInputs: method === 'RULA' ? { ...rulaInputs } : undefined,
      rebaInputs: method === 'REBA' ? { ...rebaInputs } : undefined,
      nioshInputs: method === 'NIOSH' ? { ...nioshInputs } : undefined,
      score: livePreview.score,
      rwlKg: livePreview.nioshDetails?.rwlKg,
      riskBand: livePreview.riskBand,
      actionSummary: livePreview.actionSummary,
      earlyReviewTriggers: [],
      controls: [],
      isControlled: false,
      controlledAt: null,
      consultationNotes: '',
      consultationDate: resolvedDate,
      competentPersonName: '',
      competentPersonCredentials: '',
      competentPersonSignedAt: null,
      reg8MedicalReferral: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
    setTaskName('');
    setDepartment('');
    setArchiveState(null);
  };

  const handleToggleEarlyReviewTrigger = (trigger: EarlyReviewTrigger) => {
    updateActiveTask((task) => {
      const exists = task.earlyReviewTriggers.includes(trigger);
      return {
        ...task,
        earlyReviewTriggers: exists
          ? task.earlyReviewTriggers.filter((t) => t !== trigger)
          : [...task.earlyReviewTriggers, trigger],
      };
    });
  };

  const handleAddControl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    const desc = controlDescription.trim();
    if (!desc) return;

    const newControl: StatutoryControl = {
      id: newId('ctrl'),
      tier: controlTier,
      description: desc,
      addedAt: new Date().toISOString(),
    };

    updateActiveTask((task) => ({
      ...task,
      controls: [...task.controls, newControl],
    }));
    setControlDescription('');
    setArchiveState(null);
  };

  const handleRemoveControl = (controlId: string) => {
    updateActiveTask((task) => {
      const remaining = task.controls.filter((c) => c.id !== controlId);
      const requiresGate = task.riskBand !== 'LOW';
      const stillControlled =
        requiresGate && remaining.length === 0 ? false : task.isControlled;
      return {
        ...task,
        controls: remaining,
        isControlled: stillControlled,
        controlledAt: stillControlled ? task.controlledAt : null,
      };
    });
    setArchiveState(null);
  };

  const handleMarkControlled = () => {
    if (!activeTask) return;
    if (activeTask.riskBand !== 'LOW' && activeTask.controls.length === 0) {
      return;
    }
    updateActiveTask((task) => ({
      ...task,
      isControlled: !task.isControlled,
      controlledAt: !task.isControlled ? new Date().toISOString() : null,
    }));
    setArchiveState(null);
  };

  const handleCompetentPersonSignOff = () => {
    if (!activeTask) return;
    if (!activeTask.competentPersonName.trim()) return;
    updateActiveTask((task) => ({
      ...task,
      competentPersonSignedAt: new Date().toISOString(),
    }));
    setArchiveState(null);
  };

  const handleGenerateArchive = async () => {
    setArchiveError(null);
    setIsHashing(true);
    try {
      const generatedAt = new Date().toISOString();
      const canonicalPayload = {
        schemaVersion: 'ergosafe-gn-r1589-archive-v1',
        statutoryFramework: [
          'SA OHS Act 85 of 1993 — Ergonomics Regulations (GN R1589, 2019)',
          'ISO 45001:2018 Clauses 5.4 & 8.1.2',
          'POPIA Act 4 of 2013 (Special Personal Information Safeguards)',
        ],
        retentionSchedule: {
          ergonomicRiskAssessmentsAndMedicalReferrals: RETENTION_TAGS.fortyYears,
          controlMeasuresAndInspectionRecords: RETENTION_TAGS.threeYears,
          employeeInformationAndTrainingRecords: RETENTION_TAGS.durationOfEmployment,
        },
        assessments: tasks.map((task) => ({
          ...task,
          retentionClassification: {
            assessmentAndReferralRecord: RETENTION_TAGS.fortyYears.retentionPeriod,
            controlMeasuresRecord: RETENTION_TAGS.threeYears.retentionPeriod,
            consultationAndTrainingLinkage:
              RETENTION_TAGS.durationOfEmployment.retentionPeriod,
          },
          popiaNotice: task.reg8MedicalReferral
            ? 'CONTAINS REG 8(2) SPECIAL PERSONAL INFORMATION — DO NOT DISCLOSE WITHOUT EXPLICIT WRITTEN EMPLOYEE CONSENT'
            : 'No medical referral flagged',
        })),
      };

      const canonicalJson = JSON.stringify(sortObjectKeys(canonicalPayload));
      const digest = await sha256Hex(canonicalJson);

      const portableDossier = {
        ...canonicalPayload,
        integritySeal: {
          algorithm: 'SHA-256',
          sha256Digest: digest,
          sealedAt: generatedAt,
          canonicalSerialization: 'sorted-keys-utf8-json',
        },
      };

      setArchiveState({
        sha256Digest: digest,
        generatedAt,
        jsonContent: JSON.stringify(portableDossier, null, 2),
        taskCount: tasks.length,
      });
    } catch (err) {
      setArchiveError(
        err instanceof Error ? err.message : 'Failed to generate SHA-256 archive.'
      );
    } finally {
      setIsHashing(false);
    }
  };

  const handleDownloadArchive = () => {
    if (!archiveState) return;
    const blob = new Blob([archiveState.jsonContent], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ergosafe-gn-r1589-dossier-${getTodayIsoDate()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintArchive = () => {
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
  };

  const activeTaskRequiresControlGate =
    activeTask !== null && activeTask.riskBand !== 'LOW';
  const activeTaskGateBlocked =
    activeTaskRequiresControlGate && activeTask.controls.length === 0;
  const activeTaskPpeOrAdminOnly =
    activeTask !== null &&
    activeTask.controls.length > 0 &&
    activeTask.controls.every(
      (c) => c.tier === 'Administrative' || c.tier === 'PPE'
    );

  return (
    <section
      aria-label="Statutory Ergonomics Compliance Module"
      className="w-full max-w-full overflow-x-hidden min-w-0 break-words space-y-5 text-white"
    >
      {/* Header & Statutory Disclosures */}
      <div className="bg-[#0F172A] border border-[#D97706]/50 rounded-2xl p-4 sm:p-6 shadow-xl min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#064E3B] border border-[#D97706]/60 text-[11px] font-bold uppercase tracking-wider text-white mb-2">
              <ShieldCheck size={14} className="text-[#D97706] shrink-0" />
              <span>SA GN R1589 &amp; ISO 45001 Workbench</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
              Statutory Ergonomic Risk Register &amp; Control Gate
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Task-level RULA, REBA &amp; NIOSH evaluation, 24-month Regulation 6 reassessment clock,
              Hierarchy of Controls enforcement, and SHA-256 retention-tagged archive sealing.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs bg-slate-900/90 border border-[#D97706]/40 rounded-xl px-3 py-2">
            <ClipboardCheck size={16} className="text-[#D97706] shrink-0" />
            <span>
              <strong className="text-white">{tasks.length}</strong>{' '}
              <span className="text-slate-300">Recorded Tasks</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 min-w-0">
          <StatutoryDisclaimerBanner variant="compact" />
          <AITransparencyBadge compact />
        </div>
      </div>

      {/* Section 1: Task-Level Calculator & Recorder */}
      <div className="bg-[#0F172A] border border-[#D97706]/40 rounded-2xl p-4 sm:p-6 shadow-xl min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <HardHat size={18} className="text-[#D97706] shrink-0" />
            <span>1. Task-Level Biomechanical Risk Calculator &amp; Recorder</span>
          </h3>

          {/* Method Tabs */}
          <div
            role="tablist"
            aria-label="Assessment Method"
            className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-700 self-start"
          >
            {(['RULA', 'REBA', 'NIOSH'] as AssessmentMethod[]).map((tab) => {
              const active = method === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMethod(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[#064E3B] text-white border border-[#D97706]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleRecordTaskAssessment} className="space-y-4 min-w-0">
          {/* Task Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
            <div className="min-w-0">
              <label
                htmlFor="stat-task-name"
                className="block text-xs font-semibold text-slate-200 mb-1"
              >
                Task Name
              </label>
              <input
                id="stat-task-name"
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Drum Decanting & Labelling"
                className="w-full min-w-0 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#D97706] focus:outline-none px-3 py-2 text-sm text-white placeholder-slate-500"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="stat-department"
                className="block text-xs font-semibold text-slate-200 mb-1"
              >
                Department / Workstation
              </label>
              <input
                id="stat-department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. ErgoSafe Packaging Line 3"
                className="w-full min-w-0 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#D97706] focus:outline-none px-3 py-2 text-sm text-white placeholder-slate-500"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="stat-assessment-date"
                className="block text-xs font-semibold text-slate-200 mb-1"
              >
                Assessment Date
              </label>
              <input
                id="stat-assessment-date"
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full min-w-0 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#D97706] focus:outline-none px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          {/* Method-Specific Inputs */}
          {method === 'RULA' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 min-w-0 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              {[
                { key: 'upperArm', label: 'Upper Arm (1–6)', min: 1, max: 6 },
                { key: 'lowerArm', label: 'Lower Arm (1–3)', min: 1, max: 3 },
                { key: 'wrist', label: 'Wrist (1–4)', min: 1, max: 4 },
                { key: 'neck', label: 'Neck (1–6)', min: 1, max: 6 },
                { key: 'trunk', label: 'Trunk (1–6)', min: 1, max: 6 },
                { key: 'muscleLoad', label: 'Muscle / Load (0–4)', min: 0, max: 4 },
              ].map((field) => {
                const k = field.key as keyof RulaInputs;
                return (
                  <div key={field.key} className="min-w-0">
                    <label
                      htmlFor={`rula-${field.key}`}
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`rula-${field.key}`}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={1}
                      value={rulaInputs[k]}
                      onChange={(e) =>
                        setRulaInputs((prev) => ({
                          ...prev,
                          [k]: clampNumber(Number(e.target.value), field.min, field.max),
                        }))
                      }
                      className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-sm text-white"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {method === 'REBA' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 min-w-0 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              {[
                { key: 'trunk', label: 'Trunk (1–5)', min: 1, max: 5 },
                { key: 'neck', label: 'Neck (1–3)', min: 1, max: 3 },
                { key: 'legs', label: 'Legs (1–4)', min: 1, max: 4 },
                { key: 'upperArm', label: 'Upper Arm (1–6)', min: 1, max: 6 },
                { key: 'lowerArm', label: 'Lower Arm (1–2)', min: 1, max: 2 },
                { key: 'wrist', label: 'Wrist (1–3)', min: 1, max: 3 },
                { key: 'loadCoupling', label: 'Load / Coupling (0–5)', min: 0, max: 5 },
              ].map((field) => {
                const k = field.key as keyof RebaInputs;
                return (
                  <div key={field.key} className="min-w-0">
                    <label
                      htmlFor={`reba-${field.key}`}
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`reba-${field.key}`}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={1}
                      value={rebaInputs[k]}
                      onChange={(e) =>
                        setRebaInputs((prev) => ({
                          ...prev,
                          [k]: clampNumber(Number(e.target.value), field.min, field.max),
                        }))
                      }
                      className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-sm text-white"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {method === 'NIOSH' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 min-w-0 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <div className="min-w-0">
                <label
                  htmlFor="niosh-load"
                  className="block text-[11px] font-semibold text-slate-300 mb-1"
                >
                  Load Weight (kg)
                </label>
                <input
                  id="niosh-load"
                  type="number"
                  min={0.5}
                  max={100}
                  step={0.5}
                  value={nioshInputs.loadWeightKg}
                  onChange={(e) =>
                    setNioshInputs((p) => ({
                      ...p,
                      loadWeightKg: Number(e.target.value) || 0.5,
                    }))
                  }
                  className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-sm text-white"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="niosh-h"
                  className="block text-[11px] font-semibold text-slate-300 mb-1"
                >
                  H Dist (cm ≥25)
                </label>
                <input
                  id="niosh-h"
                  type="number"
                  min={25}
                  max={150}
                  step={1}
                  value={nioshInputs.horizontalDistanceCm}
                  onChange={(e) =>
                    setNioshInputs((p) => ({
                      ...p,
                      horizontalDistanceCm: Number(e.target.value) || 25,
                    }))
                  }
                  className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-sm text-white"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="niosh-v"
                  className="block text-[11px] font-semibold text-slate-300 mb-1"
                >
                  Vertical V (cm)
                </label>
                <input
                  id="niosh-v"
                  type="number"
                  min={0}
                  max={200}
                  step={1}
                  value={nioshInputs.verticalLocationCm}
                  onChange={(e) =>
                    setNioshInputs((p) => ({
                      ...p,
                      verticalLocationCm: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-sm text-white"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="niosh-d"
                  className="block text-[11px] font-semibold text-slate-300 mb-1"
                >
                  Travel D (cm ≥25)
                </label>
                <input
                  id="niosh-d"
                  type="number"
                  min={25}
                  max={200}
                  step={1}
                  value={nioshInputs.travelDistanceCm}
                  onChange={(e) =>
                    setNioshInputs((p) => ({
                      ...p,
                      travelDistanceCm: Number(e.target.value) || 25,
                    }))
                  }
                  className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-sm text-white"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="niosh-a"
                  className="block text-[11px] font-semibold text-slate-300 mb-1"
                >
                  Asymmetry A (deg)
                </label>
                <input
                  id="niosh-a"
                  type="number"
                  min={0}
                  max={135}
                  step={1}
                  value={nioshInputs.asymmetryDeg}
                  onChange={(e) =>
                    setNioshInputs((p) => ({
                      ...p,
                      asymmetryDeg: clampNumber(Number(e.target.value), 0, 135),
                    }))
                  }
                  className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-sm text-white"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="niosh-fm"
                  className="block text-[11px] font-semibold text-slate-300 mb-1"
                >
                  Freq FM (0.1–1.0)
                </label>
                <input
                  id="niosh-fm"
                  type="number"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={nioshInputs.frequencyMultiplier}
                  onChange={(e) =>
                    setNioshInputs((p) => ({
                      ...p,
                      frequencyMultiplier: clampNumber(Number(e.target.value), 0.1, 1.0),
                    }))
                  }
                  className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-sm text-white"
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="niosh-cm"
                  className="block text-[11px] font-semibold text-slate-300 mb-1"
                >
                  Coupling CM (0.9–1.0)
                </label>
                <input
                  id="niosh-cm"
                  type="number"
                  min={0.9}
                  max={1.0}
                  step={0.05}
                  value={nioshInputs.couplingMultiplier}
                  onChange={(e) =>
                    setNioshInputs((p) => ({
                      ...p,
                      couplingMultiplier: clampNumber(Number(e.target.value), 0.9, 1.0),
                    }))
                  }
                  className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-sm text-white"
                />
              </div>
            </div>
          )}

          {/* Live Calculation Preview + Record CTA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl bg-slate-950/80 border border-[#D97706]/50 p-3.5 min-w-0">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  {livePreview.label}:
                </span>
                <span className="text-base font-bold text-white">
                  {livePreview.valueDisplay}
                </span>
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${riskBandBadgeClasses(
                    livePreview.riskBand
                  )}`}
                >
                  {livePreview.riskBand}
                </span>
              </div>
              <p className="text-xs text-slate-300">{livePreview.actionSummary}</p>
              {livePreview.nioshDetails && (
                <p className="text-[11px] font-mono text-slate-400 break-words">
                  HM={livePreview.nioshDetails.hm} · VM={livePreview.nioshDetails.vm} · DM=
                  {livePreview.nioshDetails.dm} · AM={livePreview.nioshDetails.am} · FM=
                  {livePreview.nioshDetails.fm} · CM={livePreview.nioshDetails.cm}
                </p>
              )}
            </div>

            <button
              type="submit"
              data-testid="record-task-assessment-btn"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#065F46] border border-[#D97706] text-white text-sm font-bold transition-colors shadow-md"
            >
              <Plus size={16} />
              <span>Record Task Assessment</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2 & 3 & 4: Task Register + Active Task Compliance Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">
        {/* Left: Statutory Task Register */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-[#D97706]/40 rounded-2xl p-4 sm:p-5 shadow-xl min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white">
              Recorded Task Register
            </h3>
            <span className="text-[11px] text-slate-300 font-semibold">
              GN R1589 Reg 6
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 text-xs text-slate-300">
              No statutory ergonomic assessments recorded. Use the calculator above to record a task.
            </div>
          ) : (
            <div className="space-y-2.5 min-w-0">
              {tasks.map((task) => {
                const isSelected = activeTask?.id === task.id;
                const daysLeft = getDaysRemaining(task.reassessmentDueDate);
                const earlyReviewRequired = task.earlyReviewTriggers.length > 0;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`w-full text-left rounded-xl p-3.5 border transition-all min-w-0 break-words ${
                      isSelected
                        ? 'bg-[#064E3B]/35 border-[#D97706] shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-[#D97706]/50'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                      <span className="text-sm font-bold text-white break-words">
                        {task.taskName}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${riskBandBadgeClasses(
                          task.riskBand
                        )}`}
                      >
                        {task.method} · {task.riskBand}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 mb-2">
                      {task.department} · Score:{' '}
                      <strong className="text-white">
                        {task.method === 'NIOSH'
                          ? `LI ${task.score.toFixed(2)}`
                          : task.method === 'RULA'
                          ? `${task.score}/7`
                          : `${task.score}/15`}
                      </strong>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        <CalendarClock size={12} className="text-[#D97706] shrink-0" />
                        Due {task.reassessmentDueDate} ({daysLeft}d left)
                      </span>
                      {task.isControlled && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#064E3B] text-white border border-emerald-500/50 font-bold">
                          <CheckCircle2 size={11} /> Controlled
                        </span>
                      )}
                    </div>

                    {earlyReviewRequired && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-[#D97706] text-[#FCD34D] text-[11px] font-black uppercase tracking-wide">
                        <AlertTriangle size={12} className="shrink-0" />
                        <span>EARLY REVIEW REQUIRED (GN R1589 Reg 6)</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Active Task Compliance Workbench */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-[#D97706]/40 rounded-2xl p-4 sm:p-5 shadow-xl min-w-0 space-y-5">
          {!activeTask ? (
            <div className="text-sm text-slate-300 py-8 text-center">
              Select or record a task assessment to manage Reg 6 triggers, controls, consultation, and sign-off.
            </div>
          ) : (
            <>
              {/* Active Task Summary Header */}
              <div className="border-b border-slate-800 pb-4 space-y-2 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white break-words">
                      {activeTask.taskName}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {activeTask.department} · Assessed {activeTask.assessmentDate} ·{' '}
                      {activeTask.method} Score:{' '}
                      <strong className="text-white">
                        {activeTask.method === 'NIOSH'
                          ? `LI ${activeTask.score.toFixed(2)}${
                              activeTask.rwlKg ? ` (RWL ${activeTask.rwlKg} kg)` : ''
                            }`
                          : activeTask.method === 'RULA'
                          ? `${activeTask.score} / 7`
                          : `${activeTask.score} / 15`}
                      </strong>
                    </p>
                  </div>

                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full border ${riskBandBadgeClasses(
                      activeTask.riskBand
                    )}`}
                  >
                    {activeTask.riskBand}
                  </span>
                </div>

                {/* Reg 6 Clock */}
                <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2">
                  <span className="inline-flex items-center gap-1.5 text-slate-200">
                    <CalendarClock size={14} className="text-[#D97706] shrink-0" />
                    <strong>Reg 6 24-Month Reassessment Due:</strong>{' '}
                    <span className="text-white font-mono">
                      {activeTask.reassessmentDueDate}
                    </span>
                  </span>
                  <span className="text-[#FCD34D] font-semibold">
                    ({getDaysRemaining(activeTask.reassessmentDueDate)} days remaining)
                  </span>
                </div>

                {activeTask.earlyReviewTriggers.length > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-500/20 border border-[#D97706] px-3 py-2 text-xs font-black text-[#FCD34D]">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>EARLY REVIEW REQUIRED (GN R1589 Reg 6)</span>
                  </div>
                )}
              </div>

              {/* 2. Review-on-Change Triggers */}
              <div className="space-y-2.5 min-w-0">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CalendarClock size={15} className="text-[#D97706] shrink-0" />
                  <span>2. Mandatory Reg 6 Review-on-Change Triggers</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                  {EARLY_REVIEW_TRIGGERS.map((trigger) => {
                    const checked = activeTask.earlyReviewTriggers.includes(trigger);
                    return (
                      <label
                        key={trigger}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs cursor-pointer transition-colors ${
                          checked
                            ? 'bg-amber-500/15 border-[#D97706] text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleEarlyReviewTrigger(trigger)}
                          className="accent-[#D97706] h-4 w-4 shrink-0"
                        />
                        <span className="break-words">{trigger}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Hierarchy of Controls Gate */}
              <div className="space-y-3 border-t border-slate-800 pt-4 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={15} className="text-[#D97706] shrink-0" />
                    <span>3. Reg 7 &amp; ISO 45001 Clause 8.1.2 Hierarchy of Controls</span>
                  </h4>
                  <span className="text-[11px] text-slate-300">
                    {activeTask.controls.length} control(s) logged
                  </span>
                </div>

                <form
                  onSubmit={handleAddControl}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 min-w-0"
                >
                  <select
                    aria-label="Control Hierarchy Tier"
                    value={controlTier}
                    onChange={(e) => setControlTier(e.target.value as ControlTier)}
                    className="sm:col-span-4 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#D97706] focus:outline-none px-3 py-2 text-xs text-white"
                  >
                    {CONTROL_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    aria-label="Control Description"
                    value={controlDescription}
                    onChange={(e) => setControlDescription(e.target.value)}
                    placeholder="Describe statutory control measure..."
                    className="sm:col-span-5 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#D97706] focus:outline-none px-3 py-2 text-xs text-white placeholder-slate-500 min-w-0"
                  />
                  <button
                    type="submit"
                    data-testid="add-control-btn"
                    className="sm:col-span-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#064E3B] hover:bg-[#065F46] border border-[#D97706]/70 px-3 py-2 text-xs font-bold text-white transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Control</span>
                  </button>
                </form>

                {/* Logged Controls List */}
                {activeTask.controls.length > 0 && (
                  <ul className="space-y-1.5 min-w-0">
                    {activeTask.controls.map((ctrl) => (
                      <li
                        key={ctrl.id}
                        className="flex items-start justify-between gap-2 rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="inline-block font-bold text-[#FCD34D] mr-2">
                            [{ctrl.tier}]
                          </span>
                          <span className="text-slate-200 break-words">
                            {ctrl.description}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveControl(ctrl.id)}
                          aria-label={`Remove ${ctrl.tier} control`}
                          className="text-slate-400 hover:text-red-400 shrink-0 p-0.5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Training / PPE-Only Statutory Warning */}
                {activeTaskPpeOrAdminOnly && (
                  <div
                    data-testid="ppe-only-warning"
                    className="rounded-xl bg-amber-500/15 border border-[#D97706] p-3 text-xs text-[#FDE68A] flex items-start gap-2.5"
                  >
                    <AlertTriangle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Statutory Warning (GN R1589 Reg 7 &amp; ISO 45001 Clause 8.1.2): Only
                      Administrative/PPE controls logged. Higher-order Elimination, Substitution,
                      or Engineering controls must be prioritized before relying on training or PPE.
                    </p>
                  </div>
                )}

                {/* Hard Gate Control Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-950/80 border border-slate-800 p-3">
                  <div className="text-xs text-slate-300">
                    {activeTaskGateBlocked ? (
                      <span className="text-amber-300 font-semibold">
                        Hierarchy of Controls Gate: Log at least one statutory control before
                        marking controlled.
                      </span>
                    ) : activeTask.isControlled ? (
                      <span className="text-emerald-300 font-semibold">
                        Hazard marked controlled
                        {activeTask.controlledAt
                          ? ` (${activeTask.controlledAt.slice(0, 10)})`
                          : ''}
                        .
                      </span>
                    ) : (
                      <span>
                        Control gate satisfied — ready to mark hazard controlled.
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    data-testid="mark-controlled-btn"
                    disabled={activeTaskGateBlocked}
                    onClick={handleMarkControlled}
                    className={`shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition-colors ${
                      activeTaskGateBlocked
                        ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed opacity-70'
                        : activeTask.isControlled
                        ? 'bg-emerald-900/70 hover:bg-emerald-900 border-emerald-400 text-white'
                        : 'bg-[#064E3B] hover:bg-[#065F46] border-[#D97706] text-white'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>
                      {activeTask.isControlled
                        ? 'Hazard Controlled (Click to Reopen)'
                        : 'Mark Hazard Controlled'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 4. Consultation, Competent Person Sign-Off & Reg 8(2) Referral */}
              <div className="space-y-3 border-t border-slate-800 pt-4 min-w-0">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users size={15} className="text-[#D97706] shrink-0" />
                  <span>
                    4. ISO 45001 Clause 5.4 Consultation, Reg 6 Sign-Off &amp; Reg 8(2) Referral
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
                  <div className="sm:col-span-2 min-w-0">
                    <label
                      htmlFor="stat-consultation-notes"
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      Worker / H&amp;S Committee Consultation Notes (ISO 45001 Cl. 5.4)
                    </label>
                    <textarea
                      id="stat-consultation-notes"
                      rows={2}
                      value={activeTask.consultationNotes}
                      onChange={(e) =>
                        updateActiveTask((t) => ({
                          ...t,
                          consultationNotes: e.target.value,
                        }))
                      }
                      placeholder="Record worker & H&S representative feedback..."
                      className="w-full min-w-0 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#D97706] focus:outline-none px-3 py-2 text-xs text-white placeholder-slate-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <label
                      htmlFor="stat-consultation-date"
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      Consultation Date
                    </label>
                    <input
                      id="stat-consultation-date"
                      type="date"
                      value={activeTask.consultationDate}
                      onChange={(e) =>
                        updateActiveTask((t) => ({
                          ...t,
                          consultationDate: e.target.value,
                        }))
                      }
                      className="w-full min-w-0 rounded-xl bg-slate-950 border border-slate-700 focus:border-[#D97706] focus:outline-none px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Competent Person Sign-Off */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end min-w-0 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                  <div className="sm:col-span-5 min-w-0">
                    <label
                      htmlFor="stat-cp-name"
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      Appointed Competent Person (Reg 6)
                    </label>
                    <input
                      id="stat-cp-name"
                      type="text"
                      value={activeTask.competentPersonName}
                      onChange={(e) =>
                        updateActiveTask((t) => ({
                          ...t,
                          competentPersonName: e.target.value,
                        }))
                      }
                      placeholder="Full name of Competent Person"
                      className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-xs text-white placeholder-slate-500"
                    />
                  </div>
                  <div className="sm:col-span-4 min-w-0">
                    <label
                      htmlFor="stat-cp-creds"
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      Registration / Credentials
                    </label>
                    <input
                      id="stat-cp-creds"
                      type="text"
                      value={activeTask.competentPersonCredentials}
                      onChange={(e) =>
                        updateActiveTask((t) => ({
                          ...t,
                          competentPersonCredentials: e.target.value,
                        }))
                      }
                      placeholder="e.g. SAIOH / SACPCMP Reg #"
                      className="w-full min-w-0 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#D97706] focus:outline-none px-2.5 py-1.5 text-xs text-white placeholder-slate-500"
                    />
                  </div>
                  <div className="sm:col-span-3 min-w-0">
                    <button
                      type="button"
                      disabled={!activeTask.competentPersonName.trim()}
                      onClick={handleCompetentPersonSignOff}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#064E3B] hover:bg-[#065F46] disabled:bg-slate-800 disabled:text-slate-500 border border-[#D97706]/70 px-3 py-1.5 text-xs font-bold text-white transition-colors"
                    >
                      <UserCheck size={14} />
                      <span>Sign Off</span>
                    </button>
                  </div>
                  {activeTask.competentPersonSignedAt && (
                    <div className="sm:col-span-12 text-[11px] text-emerald-300 font-semibold">
                      Countersigned by {activeTask.competentPersonName} (
                      {activeTask.competentPersonCredentials || 'Credentials recorded'}) at{' '}
                      <span className="font-mono">{activeTask.competentPersonSignedAt}</span>
                    </div>
                  )}
                </div>

                {/* Reg 8(2) Medical Surveillance Referral */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-[#D97706]/50 px-3 py-2.5 text-xs font-semibold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      data-testid="reg8-referral-toggle"
                      checked={activeTask.reg8MedicalReferral}
                      onChange={(e) =>
                        updateActiveTask((t) => ({
                          ...t,
                          reg8MedicalReferral: e.target.checked,
                        }))
                      }
                      className="accent-[#D97706] h-4 w-4 shrink-0"
                    />
                    <span>
                      GN R1589 Reg 8(2) Occupational Health Practitioner Medical Surveillance
                      Referral Required
                    </span>
                  </label>

                  {activeTask.reg8MedicalReferral && (
                    <div
                      data-testid="reg8-consent-warning"
                      className="rounded-xl bg-red-950/60 border-2 border-[#D97706] p-3 text-xs text-amber-100 flex items-start gap-2.5"
                    >
                      <Lock size={16} className="text-[#D97706] shrink-0 mt-0.5" />
                      <p className="font-medium leading-relaxed">
                        POPIA Special Personal Information &amp; GN R1589 Reg 8(2) Warning:
                        Medical surveillance referrals contain confidential health data and must
                        NOT be disclosed to third parties without explicit written employee consent.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section 5: Reg 10 Retention-Tagged SHA-256 Archive Exporter */}
      <div className="bg-[#0F172A] border border-[#D97706]/50 rounded-2xl p-4 sm:p-6 shadow-xl min-w-0 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileCheck2 size={18} className="text-[#D97706] shrink-0" />
              <span>5. Reg 10 Retention-Tagged SHA-256 Archive Exporter</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Seals the statutory register with Web Crypto SHA-256 integrity hashing and GN R1589
              Regulation 10 retention tags.
            </p>
          </div>

          <button
            type="button"
            data-testid="generate-archive-btn"
            disabled={isHashing}
            onClick={handleGenerateArchive}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] hover:bg-[#065F46] border border-[#D97706] px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition-colors shadow-md"
          >
            <Lock size={15} />
            <span>{isHashing ? 'Sealing...' : 'Generate SHA-256 Sealed Archive'}</span>
          </button>
        </div>

        {/* Retention Schedule Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 min-w-0">
          {Object.values(RETENTION_TAGS).map((tag) => (
            <div
              key={tag.retentionPeriod}
              className="rounded-xl bg-slate-950/70 border border-[#D97706]/35 p-3 min-w-0"
            >
              <div className="text-xs font-black text-[#FCD34D] uppercase tracking-wider mb-1">
                {tag.retentionPeriod}
              </div>
              <div className="text-xs text-slate-300 leading-snug">
                {tag.statutoryBasis}
              </div>
            </div>
          ))}
        </div>

        {archiveError && (
          <div className="rounded-xl bg-red-950/60 border border-red-500 p-3 text-xs text-red-200">
            {archiveError}
          </div>
        )}

        {archiveState && (
          <div className="rounded-xl bg-slate-950/90 border border-[#D97706] p-4 space-y-3 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-emerald-300">
                SHA-256 Sealed Dossier Ready ({archiveState.taskCount} tasks)
              </span>
              <span className="text-slate-400 font-mono">{archiveState.generatedAt}</span>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Canonical SHA-256 Digest (64-char hex)
              </div>
              <div
                data-testid="sha256-archive-digest"
                className="font-mono text-xs text-[#FCD34D] bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 break-all"
              >
                {archiveState.sha256Digest}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadArchive}
                className="inline-flex items-center gap-2 rounded-xl bg-[#064E3B] hover:bg-[#065F46] border border-[#D97706]/70 px-3.5 py-2 text-xs font-bold text-white transition-colors"
              >
                <Download size={14} />
                <span>Download SHA-256 JSON Dossier</span>
              </button>

              <button
                type="button"
                onClick={handlePrintArchive}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#D97706]/60 px-3.5 py-2 text-xs font-bold text-white transition-colors"
              >
                <Printer size={14} />
                <span>Print Audit Dossier</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatutoryErgonomicsModule;
