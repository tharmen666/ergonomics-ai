export type RegulationKind = 'act' | 'regulation' | 'standard' | 'guideline';

export interface RegulationEntry {
  readonly id: string;
  readonly instrument: string;
  readonly provision: string;
  readonly title: string;
  readonly kind: RegulationKind;
  readonly appliesTo: readonly string[] | 'all';
  readonly summary: string;
  readonly scopeNote: string;
  readonly status: 'verified' | 'unverified';
  readonly verifiedBy?: string;
  readonly verifiedOn?: string;
}

const REGISTRY_ENTRIES = {
  OHSA_S8: {
    id: 'OHSA_S8',
    instrument: 'Occupational Health and Safety Act 85 of 1993',
    provision: 'Section 8',
    title: 'General duties of employers to their employees',
    kind: 'act',
    appliesTo: 'all',
    summary: 'Duty of every employer to provide and maintain a safe working environment without risk to the health of employees.',
    scopeNote: 'General employer duty foundation; confirms statutory basis for baseline hazard identification and training.',
    status: 'unverified',
  },
  OHSA_S16_2: {
    id: 'OHSA_S16_2',
    instrument: 'Occupational Health and Safety Act 85 of 1993',
    provision: 'Section 16(2)',
    title: 'Delegation to competent operational assignee',
    kind: 'act',
    appliesTo: 'all',
    summary: 'Permits employer to designate in writing competent managers to assist in ensuring compliance with the Act.',
    scopeNote: 'CONFIRM: Written designation scope and operational authority delegated by the Chief Executive Officer.',
    status: 'unverified',
  },
  OHSA_S17: {
    id: 'OHSA_S17',
    instrument: 'Occupational Health and Safety Act 85 of 1993',
    provision: 'Section 17',
    title: 'Health and safety representatives',
    kind: 'act',
    appliesTo: 'all',
    summary: 'Requirement to designate health and safety representatives for workplaces with more than 20 employees.',
    scopeNote: 'CONFIRM: H&S rep ratios (engine uses 1:100 shops/offices, 1:50 other, threshold >20 employees).',
    status: 'unverified',
  },
  OHSA_S24: {
    id: 'OHSA_S24',
    instrument: 'Occupational Health and Safety Act 85 of 1993',
    provision: 'Section 24',
    title: 'Report to inspector regarding certain incidents',
    kind: 'act',
    appliesTo: 'all',
    summary: 'Mandatory statutory reporting to an inspector within prescribed timeline where an incident causes death, loss of limb, or unconsciousness.',
    scopeNote: 'CONFIRM: Statutory notification period (24 hours for severe incidents and fatalities) and formal notification forms.',
    status: 'unverified',
  },
  GSR_3: {
    id: 'GSR_3',
    instrument: 'General Safety Regulations',
    provision: 'Regulation 3',
    title: 'First aid',
    kind: 'regulation',
    appliesTo: 'all',
    summary: 'Duty to provide first aid facilities and designated certified first aiders where more than 10 persons are employed.',
    scopeNote: 'CONFIRM: First-aider ratio and threshold (engine uses >10 employees, 1:50, valid accredited certificate).',
    status: 'unverified',
  },
  GSR_2: {
    id: 'GSR_2',
    instrument: 'General Safety Regulations',
    provision: 'Regulation 2',
    title: 'Stacking and storage',
    kind: 'regulation',
    appliesTo: 'all',
    summary: 'Safety requirements for the stacking and storage of articles and materials.',
    scopeNote: 'CONFIRM: Exact regulation number for stacking and storage (base stability, height tiering, and aisle clearance).',
    status: 'unverified',
  },
  ERGO_2019: {
    id: 'ERGO_2019',
    instrument: 'Ergonomics Regulations 2019',
    provision: 'Regulation 6',
    title: 'Ergonomic risk assessment',
    kind: 'regulation',
    appliesTo: 'all',
    summary: 'Mandatory assessment of ergonomic physical and cognitive hazards, training of exposed employees, and ergonomic controls.',
    scopeNote: 'CONFIRM: Mandatory review cycle for ergonomic risk assessment and employee training records.',
    status: 'unverified',
  },
  EIR_2009_R7: {
    id: 'EIR_2009_R7',
    instrument: 'Electrical Installation Regulations 2009',
    provision: 'Regulation 7',
    title: 'Certificate of compliance',
    kind: 'regulation',
    appliesTo: 'all',
    summary: 'Requirement for every user or lessor of an electrical installation to hold a valid Certificate of Compliance (CoC).',
    scopeNote: 'CONFIRM: Regulation number 7 under EIR 2009 and SANS 10142-1 compliance by registered electrical contractor.',
    status: 'unverified',
  },
  SANS_10087_1: {
    id: 'SANS_10087_1',
    instrument: 'SANS 10087-1',
    provision: 'Part 1',
    title: 'The handling and storage of LPG in domestic, commercial and industrial installations',
    kind: 'standard',
    appliesTo: 'all',
    summary: 'Standard governing the handling and storage of liquefied petroleum gas (LPG) installations.',
    scopeNote: 'Gas installation and Gas CoC apply to commercial LPG equipment; Pressure Equipment Regulations (PER) do not apply to non-pressure fryers.',
    status: 'unverified',
  },
  PER_2009: {
    id: 'PER_2009',
    instrument: 'Pressure Equipment Regulations 2009',
    provision: 'Regulation 3 & 4',
    title: 'Pressure equipment design, verification and certification',
    kind: 'regulation',
    appliesTo: 'all',
    summary: 'Statutory duties for the design, manufacture, inspection, and testing of pressure vessels, boilers, and pressurized gas systems.',
    scopeNote: 'CONFIRM: Cite only where genuine pressure equipment (>50 kPa gauge pressure vessel / steam generator) is declared; never for commercial fryers.',
    status: 'unverified',
  },
  SANS_10089_3: {
    id: 'SANS_10089_3',
    instrument: 'SANS 10089-3',
    provision: 'Part 3',
    title: 'The petroleum industry - Part 3: Underground storage systems',
    kind: 'standard',
    appliesTo: ['forecourt'],
    summary: 'Standard for the installation, modification, and decommissioning of underground storage systems at petroleum retail service stations.',
    scopeNote: 'CONFIRM: Title and scope for service-station underground storage (UST), dip monitoring, leak detection, and interstitial testing.',
    status: 'unverified',
  },
  SANS_10089_2: {
    id: 'SANS_10089_2',
    instrument: 'SANS 10089-2',
    provision: 'Part 2',
    title: 'The petroleum industry - Part 2: Electrical installations',
    kind: 'standard',
    appliesTo: ['forecourt'],
    summary: 'Electrical installations and hazardous zone classifications for petroleum distribution facilities and forecourts.',
    scopeNote: 'CONFIRM: Hazardous area zoning classifications (Zone 0, 1, 2) and explosive atmosphere equipment certification.',
    status: 'unverified',
  },
  MHI_2022: {
    id: 'MHI_2022',
    instrument: 'Major Hazard Installation Regulations 2022',
    provision: 'Regulation 3',
    title: 'Major hazard installation notification and risk assessment',
    kind: 'regulation',
    appliesTo: ['forecourt', 'wholesale', 'other'],
    summary: 'Statutory notification, quantitative risk assessment, and emergency planning obligations for installations exceeding hazardous substance thresholds.',
    scopeNote: 'CONFIRM: Cite only where the user confirmed the threshold is exceeded; never a default for forecourts.',
    status: 'unverified',
  },
  R638: {
    id: 'R638',
    instrument: 'Foodstuffs, Cosmetics and Disinfectants Act 54 of 1972',
    provision: 'Regulation R638 (2018)',
    title: 'Regulations governing general hygiene requirements for food premises and the transport of food',
    kind: 'regulation',
    appliesTo: ['fast_food', 'coffee_bakery', 'general_retail', 'wholesale'],
    summary: 'Hygiene standards, pest prevention, washing facilities, food temperature controls, and structural maintenance for food handling premises.',
    scopeNote: 'Parent instrument is the Foodstuffs, Cosmetics and Disinfectants Act 54 of 1972 (not the Health Act). Governs hygiene standards and foodhandler training.',
    status: 'unverified',
  },
  COA: {
    id: 'COA',
    instrument: 'Municipal Health Services By-laws / Regulation R638',
    provision: 'Regulation 3',
    title: 'Certificate of Acceptability for food premises',
    kind: 'regulation',
    appliesTo: ['fast_food', 'coffee_bakery', 'general_retail', 'wholesale'],
    summary: 'Requirement for every food premises to hold a valid municipal Certificate of Acceptability (COA) issued by an Environmental Health Practitioner.',
    scopeNote: 'CONFIRM: Separate municipal COA requirement distinct from general R638 hygiene requirements; issued by local municipality.',
    status: 'unverified',
  },
  HBAR_2022: {
    id: 'HBAR_2022',
    instrument: 'Hazardous Biological Agents Regulations 2022',
    provision: 'Regulations 6 & 14',
    title: 'Hazardous biological agents risk assessment and disposal',
    kind: 'regulation',
    appliesTo: ['pharmacy'],
    summary: 'Risk assessment, containment measures, medical surveillance, and sharps disposal for workplaces exposed to biological agents.',
    scopeNote: 'CONFIRM: Sharps disposal, needle-stick injury protocols, and bio-waste manifest tracking only. Cold chain is governed under GPP.',
    status: 'unverified',
  },
  GPP: {
    id: 'GPP',
    instrument: 'Pharmacy Act 53 of 1974',
    provision: 'Good Pharmacy Practice Standards',
    title: 'Rules relating to Good Pharmacy Practice in South Africa',
    kind: 'standard',
    appliesTo: ['pharmacy'],
    summary: 'Professional minimum standards for pharmacy premises, scheduled medicine storage, security, and dispensary cold-chain maintenance.',
    scopeNote: 'CONFIRM: South African Pharmacy Council (SAPC) mandatory cold chain temperature logging (2°C - 8°C twice daily) and dispensary security.',
    status: 'unverified',
  },
  POPIA_S19: {
    id: 'POPIA_S19',
    instrument: 'Protection of Personal Information Act 4 of 2013',
    provision: 'Section 19',
    title: 'Security measures on integrity and confidentiality of personal information',
    kind: 'act',
    appliesTo: 'all',
    summary: 'Statutory obligation to secure personal information by taking appropriate, reasonable technical and organizational measures.',
    scopeNote: 'CONFIRM: General data protection safeguards across employee records, customer info, and physical file storage.',
    status: 'unverified',
  },
  POPIA_S26: {
    id: 'POPIA_S26',
    instrument: 'Protection of Personal Information Act 4 of 2013',
    provision: 'Section 26',
    title: 'Prohibition on processing of special personal information (Health Data)',
    kind: 'act',
    appliesTo: ['pharmacy', 'all'],
    summary: 'Strict prohibition on processing special personal information concerning health, biometrics, or medical conditions unless authorized by law.',
    scopeNote: 'CONFIRM: Employee medical fitness records, sick notes, and patient pharmacy dispensing data handling duties.',
    status: 'unverified',
  },
  DMR_18: {
    id: 'DMR_18',
    instrument: 'Driven Machinery Regulations 2015',
    provision: 'Regulation 18',
    title: 'Lifting machines and lifting tackle',
    kind: 'regulation',
    appliesTo: 'all',
    summary: 'Operational and safety requirements for lifting machines, forklifts, and tackle, including operator licensing and load-testing.',
    scopeNote: 'CONFIRM: Operator competency certificate validity (2 years), 6-monthly lifting tackle inspection, and annual thorough examination.',
    status: 'unverified',
  },
} as const satisfies Record<string, RegulationEntry>;

// Deep freeze to guarantee immutability
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.keys(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}

export const REGISTRY = deepFreeze(REGISTRY_ENTRIES);
export type RegId = keyof typeof REGISTRY;
export const REGULATIONS_REGISTRY = REGISTRY;

/**
 * Validates that an entry has genuine human reviewer credentials before it can be deemed verified.
 * Never mark any regulation verified without genuine reviewer credentials.
 */
export function isEntryGenuinelyVerified(entry: RegulationEntry): boolean {
  return (
    entry.status === 'verified' &&
    typeof entry.verifiedBy === 'string' &&
    entry.verifiedBy.trim().length > 0 &&
    typeof entry.verifiedOn === 'string' &&
    entry.verifiedOn.trim().length > 0
  );
}

export interface RenderCitationsOptions {
  requireVerified?: boolean;
}

/**
 * Resolves [REG:<ID>] citation tokens in generated text.
 * Unknown IDs throw. In release mode (REQUIRE_VERIFIED_CITATIONS=1), unverified IDs throw.
 */
export function renderCitations(input: string | string[], options?: RenderCitationsOptions): string {
  const requireVerified = options?.requireVerified ?? (process.env.REQUIRE_VERIFIED_CITATIONS === '1');
  const text = Array.isArray(input)
    ? input.map((id) => (id.startsWith('[REG:') ? id : `[REG:${id}]`)).join(', ')
    : input;
  const tokenRegex = /\[REG:([A-Za-z0-9_]+)\]/g;

  return text.replace(tokenRegex, (match, regId) => {
    if (!(regId in REGISTRY)) {
      throw new Error(`Unknown regulation token: [REG:${regId}]`);
    }

    const entry = (REGISTRY as Record<string, RegulationEntry>)[regId];
    if (requireVerified && !isEntryGenuinelyVerified(entry)) {
      throw new Error(`Unverified citation in release mode: Unverified regulation token in release mode: [REG:${regId}] (${entry.scopeNote})`);
    }

    return `[${entry.id}] ${entry.instrument} ${entry.provision} (${entry.title})`;
  });
}

/**
 * Formats a single citation token as legal text.
 */
export function formatCitation(regId: RegId, options?: RenderCitationsOptions): string {
  return renderCitations(`[REG:${regId}]`, options);
}
