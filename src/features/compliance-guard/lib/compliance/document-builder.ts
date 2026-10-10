import crypto from 'crypto';
import { SiteIntake } from './site-intake-schema';
import { evaluateSiteCompliance, CalculatedSafetyRequirements } from './evaluate-site-compliance';
import { renderCitations } from '../regulations';

export interface DocumentSnapshot {
  id: string;
  version: number;
  intake: SiteIntake;
  requirements: CalculatedSafetyRequirements;
  sections: Array<{
    title: string;
    body: string;
    evidenceToHold?: string[];
  }>;
  consultantPlaceholders: string[];
  renderedLegalText: string;
  createdAt: string;
}

/**
 * Compiles a structured, reproducible statutory manual snapshot.
 * Renders citations exclusively through renderCitations.
 * Incorporates [CONSULTANT] placeholders for human auditor review.
 */
export function buildDocumentSnapshot(docId: string, intake: SiteIntake, version: number = 1): DocumentSnapshot {
  const requirements = evaluateSiteCompliance(intake);
  const createdAt = new Date().toISOString();

  const sections: Array<{ title: string; body: string; evidenceToHold?: string[] }> = [
    {
      title: '1. Executive Health and Safety Statutory Commitment',
      body: `This statutory manual establishes the baseline health and safety framework for ${intake.employerName} (${intake.branchName}) in compliance with [REG:OHSA_S8] and [REG:OHSA_S16_2].\n\n[CONSULTANT] Confirm written Section 16(2) appointee designation letter and executive health and safety policy signature.`,
      evidenceToHold: [
        'Signed Section 16(2) managerial designation letter',
        'Company occupational health and safety policy displayed on premises',
      ],
    },
    {
      title: '2. Statutory Appointments and Safety Representatives',
      body: `In terms of [REG:OHSA_S17], this facility designates ${requirements.s17RepsRequired} Health and Safety Representative(s) based on an employee headcount of ${intake.headcount} (${intake.isShopOrOffice ? 'Shop/Office 1:100 ratio' : 'Standard 1:50 ratio'}). In terms of [REG:GSR_3], ${requirements.firstAidersRequired} certified First Aider(s) are designated. Fire marshals (${requirements.fireMarshalsRecommended}) are designated per planning default (non-statutory).\n\n[CONSULTANT] Verify valid accredited Level 1/2 first aid certificates and formal Section 17 appointment letters.`,
      evidenceToHold: [
        'Signed Section 17 appointment letters and monthly inspection registers',
        'Valid first aid training certificates and monthly first aid box inspection checklists',
      ],
    },
    {
      title: '3. Hazard Identification, Risk Assessment and Ergonomics',
      body: `Workplace ergonomic physical hazards are evaluated in compliance with [REG:ERGO_2019].\n\n[CONSULTANT] Conduct site-specific Hazard Identification and Risk Assessment (HIRA) on premises and record all site-specific machinery and physical hazards.`,
      evidenceToHold: [
        'Site-specific baseline HIRA document signed by competent person',
        'Ergonomics employee training records',
      ],
    },
    {
      title: '4. Operational and Technical Safety Compliance',
      body: requirements.obligations
        .filter(o => !['OHSA_S8', 'OHSA_S16_2', 'OHSA_S17', 'GSR_3', 'ERGO_2019', 'OHSA_S24'].includes(o.regId))
        .map(o => `Subject: ${o.title}\nGoverned by: ${o.token}\nStatutory Scope: ${o.summary}`)
        .join('\n\n') || 'General commercial operational safety controls apply.',
      evidenceToHold: Array.from(new Set(requirements.obligations.flatMap(o => o.evidenceToHold))),
    },
    {
      title: '5. Incident Reporting and Section 24 Protocol',
      body: `All statutory reportable incidents resulting in fatalities, serious physical injury, or unconsciousness must be formally reported under [REG:OHSA_S24].\n\n[CONSULTANT] Confirm Section 24 incident register and Department of Employment and Labour contact details posted on safety notice board.`,
      evidenceToHold: [
        'Department of Employment and Labour Section 24 incident reporting procedure',
        'Annexure 1 / Wcl.2 incident investigation records',
      ],
    },
  ];

  // Render complete textual content via renderCitations
  const rawText = sections.map(s => `${s.title}\n${s.body}`).join('\n\n');
  const renderedLegalText = renderCitations(rawText);

  return {
    id: docId,
    version,
    intake,
    requirements,
    sections,
    consultantPlaceholders: requirements.consultantReviewItems,
    renderedLegalText,
    createdAt,
  };
}

/**
 * Computes deterministic SHA-256 hash of document snapshot for state machine and sealing.
 */
export function computeSnapshotContentHash(snapshot: DocumentSnapshot): string {
  const contentToHash = JSON.stringify({
    id: snapshot.id,
    version: snapshot.version,
    employerName: snapshot.intake.employerName,
    branchName: snapshot.intake.branchName,
    headcount: snapshot.intake.headcount,
    isShopOrOffice: snapshot.intake.isShopOrOffice,
    renderedLegalText: snapshot.renderedLegalText,
  });
  return crypto.createHash('sha256').update(contentToHash).digest('hex');
}
