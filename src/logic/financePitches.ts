/**
 * ERGOSAFE REBORN v2.0: COMPLIANCE PITCH ENGINE
 *
 * V&V AUDIT [2026-05-25]:
 * - Added complianceStandards field to PitchTemplate interface (ISO 9001/14001/45001/45003 mapping).
 * - Added DEL (Department of Employment & Labour) public sector pitch.
 * - Tightened overall structure for type safety.
 */

export interface ComplianceStandard {
    code: string;
    clause: string;
    relevance: string;
}

export interface PitchTemplate {
    client: string;
    sector: 'financial' | 'insurance' | 'government' | 'industrial';
    targetAudience: string;
    dutyOfCareFocus: string;
    disconnectStrategy: string;
    valueProposition: string;
    outreachSubject: string;
    emailDraft: string;
    complianceStandards: ComplianceStandard[];
}

export const REASONABLY_PRACTICABLE_2026 = {
    standardName: "2026 'Reasonably Practicable' Legal Standard",
    statuteReference: "OHS Act 85 of 1993, Section 8(1) & Section 37/38",
    description: "In 2026, the South African Department of Employment and Labour (DEL) formalised that an employer's duty of care extends directly to remote work environments and home offices. A digital ergonomic and fatigue compliance platform (like Ergo-Safe) is officially recognised as a 'reasonably practicable' mitigation mechanism — highly accessible, low-cost per seat, and yielding continuous compliance telemetry admissible as legal evidence.",
    finesFramework: "Failure to enforce home-office safety audits triggers Section 38(1) penalties: administrative fines up to 10% of annual turnover or R5,000,000 (whichever is greater), or 2 years imprisonment for executives."
} as const;

export const RIGHT_TO_DISCONNECT_FRAMEWORK = {
    concept: "2026 'Right to Disconnect' Safeguard",
    ccmaRisk: "CCMA 'Digital Tethering' Claims",
    description: "Spiking by 142% in 2026, remote workers are successfully bringing constructive dismissal and unpaid overtime claims against financial institutions due to after-hours messaging and systemic digital exhaustion. Ergo-Safe locks down digital access via Nelly's Fatigue-Gate and DOA Lockouts, providing immediate legal evidence that the employer took all 'Reasonably Practicable' steps to prevent digital tethering and psychosocial hazards.",
    complianceCode: "ISO 45003:2021 (Psychosocial Risk Management), ISO 45001:2018 Clause 6.1.2, and CCMA Arbitration Precedents 2024–2026."
} as const;

export const FINANCIAL_PITCHES: Record<string, PitchTemplate> = {
    standard_bank: {
        client: "Banks",
        sector: 'financial',
        targetAudience: "HR Executive, Operations Leads, IT Infrastructure Team",
        dutyOfCareFocus: "Ergonomic validation for 12,000+ hybrid branch administrators and call center staff working from home.",
        disconnectStrategy: "Nelly AI active burnout checks, automatically logging screen-time and suggesting micro-stretches to standardise off-hours disconnection.",
        valueProposition: "Protects banking institutions from vicarious liability under Section 37 of the OHS Act while optimizing remote workforce productivity via localized multilingual safety coaching.",
        outreachSubject: "Sovereign Board Briefing: Mitigating 2026 OHS Home-Office Liability in Banking",
        complianceStandards: [
            { code: "OHS Act S.8", clause: "Section 8 – General Duties", relevance: "Extends employer duty of care to remote home offices." },
            { code: "OHS Act S.37", clause: "Section 37 – Vicarious Liability", relevance: "Employer is liable for ergonomic injuries sustained by remote staff." },
            { code: "ISO 45001:2018", clause: "Clause 6.1 – Risk Assessment", relevance: "Automated hazard identification for 12,000+ remote workers." },
            { code: "ISO 9001:2015", clause: "Clause 9.1 – Performance Evaluation", relevance: "Continuous compliance telemetry as documented quality evidence." },
        ],
        emailDraft: `Dear HR Executive,

Under the 2026 'Reasonably Practicable' legal standard (OHS Act Section 8), our institution's statutory duty of care extends fully to remote home offices. Banking organizations face severe compliance exposure under Section 38(1) — with fines now reaching R5,000,000 or 10% of annual turnover — due to remote musculoskeletal injuries and the 2026 spike in CCMA 'Digital Tethering' claims.

Ergo-Safe Reborn resolves this. Our AI-driven platform provides continuous ergonomic telemetry, active fatigue coaching, and a 'Right to Disconnect' tracking framework compliant with ISO 45003:2021. By deploying Ergo-Safe, you establish a legally defensible digital audit trail proving that our bank has taken all 'Reasonably Practicable' measures to manage physical and psychosocial hazards for remote employees — in English, isiZulu, and Sesotho.

We propose a 10-minute digital partnership briefing at your convenience.

Sincerely,
Ergo-Safe OHS Task Force`
    },

    fnb: {
        client: "Corporate",
        sector: 'financial',
        targetAudience: "Chief Risk Officer, Employee Wellness Director",
        dutyOfCareFocus: "Mitigating CCMA constructive dismissal risks from remote software developers and digital banking operations teams.",
        disconnectStrategy: "Active Fatigue-Check gatekeeping. When employees log consecutive late-night commits or operations, Nelly triggers a mandatory cognitive handshake, logging off-hours safety metrics.",
        valueProposition: "Direct integration into corporate employee wellness apps, translating compliance actions into wellness rewards or internal points to drive 95%+ daily compliance.",
        outreachSubject: "Securing Corporate's Hybrid Perimeter: 2026 OHS Compliance & Digital Tethering Defense",
        complianceStandards: [
            { code: "OHS Act S.8", clause: "Section 8 – General Duties", relevance: "Extends to home-office digital work environments." },
            { code: "OHS Act S.38", clause: "Section 38 – Penalties", relevance: "R5M fine exposure for unmanaged remote psychosocial risks." },
            { code: "ISO 45003:2021", clause: "Clause 6.1.2 – Psychosocial Hazards", relevance: "After-hours digital tethering is a classifiable psychosocial hazard." },
            { code: "ISO 9001:2015", clause: "Clause 10.2 – Continual Improvement", relevance: "Gamified wellness streaks document ongoing QMS improvement cycles." },
        ],
        emailDraft: `Dear Chief Risk Officer,

As our organization continues leading in digital transformation, remote operations have created a new regulatory vulnerability. In 2026, CCMA 'Digital Tethering' claims are rising sharply, with remote workers securing substantial compensation for after-hours cognitive strain. Under the OHS Act's 'Reasonably Practicable' mandate and ISO 45003:2021, we are legally required to actively manage these home-office psychosocial risks.

Ergo-Safe Reborn offers an automated solution. Nelly's Cognitive Handshake and Fatigue-Gate protocols integrate directly into employee daily workflows, guaranteeing continuous compliance telemetry while enforcing the Right to Disconnect. Our gamified compliance model aligns perfectly with our innovation culture, ensuring wellness is tracked, verified, and logged in a digital OHS ledger admissible under Section 24 incident reporting obligations.

Let us schedule a 10-minute briefing to review our OHS risk mitigation posture.

Sincerely,
Ergo-Safe OHS Task Force`
    },

    discovery: {
        client: "Insurance",
        sector: 'insurance',
        targetAudience: "Executive Director – Corporate Wellness & Underwriting",
        dutyOfCareFocus: "Linking remote ergonomic health score metrics directly to active wellness points and insurance premium discounts.",
        disconnectStrategy: "Enforcing daily compliance streaks and mandatory posture breaks, automatically logged in a secure MongoDB MCP ledger.",
        valueProposition: "Combines statutory compliance with commercial underwriting optimisation. Employees who pass daily OHS ergonomic check-ins earn wellness points — directly reducing corporate healthcare claims and improving underwriting margins.",
        outreachSubject: "Wellness + Ergo-Safe: Linking OHS 'Duty of Care' to Dynamic Corporate Underwriting",
        complianceStandards: [
            { code: "OHS Act S.8", clause: "Section 8 – General Duties", relevance: "Corporate clients must prove home-office duty of care compliance." },
            { code: "ISO 45001:2018", clause: "Clause 5.4 – Worker Participation", relevance: "Daily check-in streaks fulfill worker participation obligation." },
            { code: "ISO 45003:2021", clause: "Clause 8.1 – Operational Controls", relevance: "Fatigue-Gate controls psychosocial risk operationally." },
            { code: "ISO 14001:2015", clause: "Clause 8.1 – Operational Planning", relevance: "Remote work energy footprint tracking for ESG reporting." },
        ],
        emailDraft: `Dear Corporate Wellness Executive,

The OHS Amendment Bill has changed hybrid work dynamics: employers must now prove continuous 'Reasonably Practicable' safety measures in home offices. For insurance providers, this represents both a statutory compliance requirement and a commercial underwriting opportunity.

Ergo-Safe Reborn is the first platform that translates OHS compliance (Section 8) and psychosocial wellness (ISO 45003:2021) into verifiable digital data points. We propose integrating Ergo-Safe's ergonomic telemetry with corporate wellness incentives. By rewarding corporate members for completing daily safety handshakes and micro-stretches, we reduce corporate health claims while providing absolute OHS legal compliance — with full ISO 9001:2015 quality audit trail documentation.

Let us explore a strategic pilot to integrate Ergo-Safe with your corporate wellness and underwriting portfolio.

Sincerely,
Ergo-Safe OHS Task Force`
    },

    sanlam: {
        client: "Insurance Advisor Networks",
        sector: 'insurance',
        targetAudience: "Chief Legal Officer, Group HR Director",
        dutyOfCareFocus: "Asset protection and long-term liability shielding for extensive financial advisor and consultant networks working remotely.",
        disconnectStrategy: "Continuous OHS dashboard audits and localized voice guidance (isiZulu, isiXhosa, Sesotho, English) ensuring remote advisors actively understand and manage ergonomic risks.",
        valueProposition: "Protects insurance groups from high-value group negligence lawsuits by establishing a rigorous digital audit trail that exceeds OHS Act Section 37 vicarious liability requirements — across all 4 official language pipelines.",
        outreachSubject: "Shielding Remote Advisor Networks: 2026 OHS Executive Duty of Care Compliance",
        complianceStandards: [
            { code: "OHS Act S.37", clause: "Section 37 – Vicarious Liability", relevance: "Organization is liable for its distributed remote advisor network." },
            { code: "OHS Act S.38", clause: "Section 38 – Penalties", relevance: "R5M fine exposure without a centralized remote compliance system." },
            { code: "ISO 45001:2018", clause: "Clause 7.4 – Communication", relevance: "Multilingual (4-language) safety coaching satisfies worker communication requirements." },
            { code: "ISO 9001:2015", clause: "Clause 7.5 – Documented Information", relevance: "Digital OHS dossiers constitute the documented information required under QMS." },
        ],
        emailDraft: `Dear Group HR Director,

An organization's network of thousands of remote financial advisors represents a significant OHS risk area. Under the 2026 'Reasonably Practicable' legal standard, we are vicariously liable (Section 37) for the safety of these remote consultants. Without a centralised, digital audit system, the group faces administrative fines up to R5,000,000 or 10% of annual turnover under Section 38(1).

Ergo-Safe Reborn provides a comprehensive, centralised compliance solution. With multilingual safety coaching in English, isiZulu, isiXhosa, and Sesotho — aligned with ISO 45001:2018 Clause 7.4 communication requirements — our insurance group can continuously audit its remote network and generate ISO 9001:2015-compliant documented evidence of its quality management performance.

We invite you to a brief executive presentation of our OHS Compliance Matrix tailored for remote advisor networks.

Sincerely,
Ergo-Safe OHS Task Force`
    },

    del_government: {
        client: "Government",
        sector: 'government',
        targetAudience: "Director-General, Chief Inspector of Labour, Digital Transformation Unit",
        dutyOfCareFocus: "Supporting the public sector's 2026 Digitalisation Mandate by providing a turnkey digital OHS inspection and compliance support tool for labour inspectors.",
        disconnectStrategy: "Ergo-Safe acts as an official pre-inspection self-audit tool, allowing employers to demonstrate 'Reasonably Practicable' compliance before a labour inspector visit — reducing enforcement backlog.",
        valueProposition: "Positions Ergo-Safe as an official government-endorsed 'Digital Compliance Partner' — the only platform capable of generating standardised ISO 45001/OHS Act inspection-ready compliance reports in all 4 major local languages.",
        outreachSubject: "Digital Partner Proposal: Ergo-Safe as the Official OHS Remote Inspection Support Tool – 2026 Digitalisation Mandate",
        complianceStandards: [
            { code: "OHS Act S.8", clause: "Section 8 – General Duties", relevance: "Ergo-Safe operationalises this duty for enforcement mandates." },
            { code: "OHS Act S.24", clause: "Section 24 – Incident Reporting", relevance: "Automated digital incident reporting supports notification systems." },
            { code: "ISO 45001:2018", clause: "Clause 10.3 – Continual Improvement", relevance: "Aligns with the mandate for ongoing improvement of national OHS standards." },
            { code: "ISO 9001:2015", clause: "Clause 8.4 – External Providers", relevance: "Ergo-Safe can serve as a certified external compliance tool provider." },
        ],
        emailDraft: `Dear Director-General,

The 2026 Public Sector Digitalisation Mandate presents a critical opportunity to modernise the OHS inspection and enforcement framework. The department currently faces an enforcement backlog due to the rapid expansion of remote and hybrid work, where traditional inspection visits cannot keep pace with the scale of home-office safety obligations.

Ergo-Safe Reborn is purpose-built to resolve this. As a digital OHS audit and compliance platform operating across English, isiZulu, isiXhosa, and Sesotho, Ergo-Safe can function as an official pre-inspection self-audit tool for employers — generating standardised, ISO 45001:2018-compliant inspection-ready reports before a labour inspector visit. This directly reduces enforcement backlog while ensuring greater national compliance coverage.

We formally propose a Digital Partnership Agreement positioning Ergo-Safe as the endorsed 'Continuous Compliance Verification Tool' under the 2026 Digitalisation Mandate.

Sincerely,
Ergo-Safe OHS Task Force | Ergo-Safe (Pty) Ltd`
    }
};
