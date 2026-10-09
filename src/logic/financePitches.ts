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

export const REASONABLY_PRACTICABLE_OHS = {
    standardName: "Reasonably Practicable Standard",
    statuteReference: "OHS Act 85 of 1993, Section 8(1) & Section 37/38",
    // TODO(legal-verify): removed claim of '2026 Reasonably Practicable Legal Standard formalised by DEL'
    description: "Section 8 of the Occupational Health and Safety Act 85 of 1993 requires employers to provide and maintain, as far as is reasonably practicable, a safe working environment without risk to the health of employees. A structured ergonomic and fatigue monitoring system assists organizations in identifying and addressing workstation hazards.",
    // TODO(legal-verify): removed fabricated Section 38 fines of R5,000,000 or 10% of turnover and 2 years imprisonment
    finesFramework: "Section 38 prescribes penalties for non-compliance with the provisions of the OHS Act and its regulations."
} as const;

export const RIGHT_TO_DISCONNECT_FRAMEWORK = {
    concept: "Rest and Work-Life Boundary Framework",
    ccmaRisk: "Workplace Fatigue & Psychosocial Risk",
    // TODO(legal-verify): removed fabricated 'CCMA digital tethering claims spiking by 142% in 2026' statistic
    description: "Extended continuous screen-time and fatigue pose workplace wellness challenges. Ergo-Safe provides proactive fatigue check-ins and rest break intervals to support employee wellbeing aligned with voluntary ISO 45003:2021 guidance.",
    complianceCode: "Voluntary ISO 45003:2021 (Psychosocial Risk Management) and voluntary ISO 45001:2018 Clause 6.1.2."
} as const;

export const FINANCIAL_PITCHES: Record<string, PitchTemplate> = {
    standard_bank: {
        client: "Banks",
        sector: 'financial',
        targetAudience: "HR Executive, Operations Leads, IT Infrastructure Team",
        dutyOfCareFocus: "Ergonomic risk identification and proactive coaching for hybrid and office workstations.",
        disconnectStrategy: "Nelly AI active wellness checks, logging break intervals and suggesting micro-stretches.",
        // TODO(legal-verify): removed Section 37 liability protection claim; Section 37 addresses employee/mandatary acts and omissions
        valueProposition: "Supports employer Section 8 general duties while improving workforce wellbeing via localised multilingual coaching.",
        outreachSubject: "Workplace Health & Ergonomics: Supporting OHS Act Compliance in Banking",
        complianceStandards: [
            { code: "OHS Act S.8", clause: "Section 8 – General Duties", relevance: "Duty to provide a safe and healthy working environment." },
            { code: "OHS Act S.37", clause: "Section 37 – Acts or Omissions", relevance: "Mandatary arrangements and employee compliance oversight." },
            { code: "ISO 45001:2018", clause: "Clause 6.1 – Risk Assessment (Voluntary)", relevance: "Hazard identification and risk evaluation best practice." },
            { code: "ISO 9001:2015", clause: "Clause 9.1 – Performance Evaluation (Voluntary)", relevance: "Continuous performance and wellness monitoring evidence." },
        ],
        // TODO(legal-verify): removed fabricated fine figures and CCMA stats from email draft
        emailDraft: `Dear HR Executive,

Under Section 8 of the Occupational Health and Safety Act 85 of 1993, employers bear a general duty to provide and maintain, as far as is reasonably practicable, a working environment that is safe and without risk to health. Addressing musculoskeletal and ergonomic strain across hybrid and corporate environments is an essential part of that mandate.

Ergo-Safe Reborn assists in operationalizing this duty. Our platform provides structured ergonomic self-assessments, active fatigue coaching, and rest break scheduling aligned with voluntary ISO 45003:2021 guidelines.

We propose a brief 10-minute briefing to demonstrate how Ergo-Safe supports employee wellness and statutory OHS governance.

Sincerely,
Ergo-Safe OHS Team`
    },

    fnb: {
        client: "Corporate",
        sector: 'financial',
        targetAudience: "Chief Risk Officer, Employee Wellness Director",
        dutyOfCareFocus: "Mitigating workstation strain and cognitive fatigue for intensive software and operations teams.",
        disconnectStrategy: "Fatigue-Check protocols encouraging proactive cognitive breaks and ergonomic resets.",
        valueProposition: "Interactive wellness tools that promote daily posture habits and timely micro-breaks.",
        outreachSubject: "Supporting Workstation Safety & Employee Ergonomic Health",
        complianceStandards: [
            { code: "OHS Act S.8", clause: "Section 8 – General Duties", relevance: "General duty to maintain a safe working environment." },
            { code: "OHS Act S.38", clause: "Section 38 – Offences & Penalties", relevance: "Statutory adherence to health and safety requirements." },
            { code: "ISO 45003:2021", clause: "Clause 6.1.2 – Psychosocial Hazards (Voluntary)", relevance: "Management of workplace cognitive and physical strain." },
            { code: "ISO 9001:2015", clause: "Clause 10.2 – Continual Improvement (Voluntary)", relevance: "Ongoing workplace wellbeing enhancement." },
        ],
        // TODO(legal-verify): removed fabricated CCMA claims and legal mandate phrasing
        emailDraft: `Dear Chief Risk Officer,

Modern computer-intensive operations require continuous attention to physical ergonomics and cognitive fatigue. Under Section 8 of the OHS Act 85 of 1993, employers are responsible for providing safe systems of work as far as reasonably practicable.

Ergo-Safe Reborn offers an interactive approach. Nelly's Cognitive Handshake and guided break protocols integrate into daily routines, helping workers identify strain before it develops into chronic musculoskeletal disorders.

We would welcome an opportunity to share a 10-minute demonstration of our ergonomic risk monitoring capabilities.

Sincerely,
Ergo-Safe OHS Team`
    },

    corporateWellness: {
        client: "Corporate Wellness & Health Insurance",
        sector: 'insurance',
        targetAudience: "Executive Director – Corporate Wellness & Underwriting",
        dutyOfCareFocus: "Promoting proactive ergonomics and workplace wellbeing across corporate client workforces.",
        disconnectStrategy: "Structured daily compliance streaks and scheduled micro-breaks.",
        valueProposition: "Encourages positive health behaviors and ergonomic awareness, supporting long-term risk mitigation.",
        outreachSubject: "Workplace Ergonomics & Preventive Wellness Collaboration",
        complianceStandards: [
            { code: "OHS Act S.8", clause: "Section 8 – General Duties", relevance: "Workplace health and safety governance." },
            { code: "ISO 45001:2018", clause: "Clause 5.4 – Worker Participation (Voluntary)", relevance: "Worker engagement in safety habits." },
            { code: "ISO 45003:2021", clause: "Clause 8.1 – Operational Controls (Voluntary)", relevance: "Fatigue and stress mitigation." },
            { code: "ISO 14001:2015", clause: "Clause 8.1 – Operational Planning (Voluntary)", relevance: "Organizational planning and resource management." },
        ],
        // TODO(legal-verify): removed fabricated 'OHS Amendment Bill' claims and 'absolute legal compliance' marketing
        emailDraft: `Dear Corporate Wellness Executive,

Proactive ergonomic management is key to preventing workplace musculoskeletal injuries. Under the OHS Act 85 of 1993, maintaining healthy working practices is both a statutory responsibility and a sound corporate strategy.

Ergo-Safe Reborn provides interactive workstation assessment tools and guided micro-stretches that encourage daily health routines. By supporting preventative ergonomic habits, organizations can foster healthier, more resilient teams.

Let us explore how Ergo-Safe can complement your corporate wellness and prevention initiatives.

Sincerely,
Ergo-Safe OHS Team`
    },

    sanlam: {
        client: "Insurance Advisor Networks",
        sector: 'insurance',
        targetAudience: "Chief Legal Officer, Group HR Director",
        dutyOfCareFocus: "Ergonomic wellbeing and hazard awareness for distributed consultant and advisor networks.",
        disconnectStrategy: "Accessible dashboard audits and localized multilingual guidance (isiZulu, isiXhosa, Sesotho, English).",
        // TODO(legal-verify): removed Section 37 liability shield claim
        valueProposition: "Provides distributed teams with consistent ergonomic guidance and documentation in terms of Section 8 and Section 37(2) arrangements.",
        outreachSubject: "Supporting Remote & Distributed Team Ergonomics",
        complianceStandards: [
            { code: "OHS Act S.37", clause: "Section 37 – Acts or Omissions", relevance: "Framework for employee and mandatary safety oversight." },
            { code: "OHS Act S.38", clause: "Section 38 – Offences & Penalties", relevance: "Compliance governance across distributed workplaces." },
            { code: "ISO 45001:2018", clause: "Clause 7.4 – Communication (Voluntary)", relevance: "Multilingual communication of health and safety practices." },
            { code: "ISO 9001:2015", clause: "Clause 7.5 – Documented Information (Voluntary)", relevance: "Maintained records of health and safety training." },
        ],
        // TODO(legal-verify): removed fabricated fine figures and vicarious liability claims
        emailDraft: `Dear Group HR Director,

Distributed and remote consultants require accessible, consistent health and safety guidance to prevent repetitive strain and fatigue. Under the OHS Act 85 of 1993, organizations must take reasonably practicable steps to ensure safe work systems.

Ergo-Safe Reborn provides a centralized digital solution. With multilingual guidance in English, isiZulu, isiXhosa, and Sesotho, your network can regularly review workstation ergonomics and adopt healthy posture routines.

We would be pleased to provide a concise executive overview of our platform.

Sincerely,
Ergo-Safe OHS Team`
    },

    del_government: {
        client: "Government",
        sector: 'government',
        targetAudience: "Director-General, Chief Inspector of Labour, Digital Transformation Unit",
        // TODO(legal-verify): removed fabricated '2026 Public Sector Digitalisation Mandate'
        dutyOfCareFocus: "Providing structured digital tools to assist employers with ergonomic hazard identification and pre-inspection readiness.",
        disconnectStrategy: "Self-audit tools enabling workplaces to evaluate ergonomic risk factors and maintain statutory records under Ergonomics Regulations 2019.",
        valueProposition: "Standardized self-assessment tools aligned with South African OHS statutory requirements in official South African languages.",
        outreachSubject: "Digital OHS Self-Assessment & Statutory Record Management Proposal",
        complianceStandards: [
            { code: "OHS Act S.8", clause: "Section 8 – General Duties", relevance: "Assisting employers in hazard identification and control." },
            { code: "OHS Act S.24", clause: "Section 24 – Incident Reporting", relevance: "Support for timely statutory incident logging." },
            { code: "ISO 45001:2018", clause: "Clause 10.3 – Continual Improvement (Voluntary)", relevance: "Voluntary benchmark for ongoing health and safety management." },
            { code: "ISO 9001:2015", clause: "Clause 8.4 – External Providers (Voluntary)", relevance: "Operational support tools." },
        ],
        // TODO(legal-verify): removed unverified claims of government endorsement and 2026 Digitalisation Mandate
        emailDraft: `Dear Director-General,

Supporting employers in conducting comprehensive ergonomic risk assessments is vital to preventing work-related musculoskeletal disorders under the Ergonomics Regulations, 2019 (GN R1589).

Ergo-Safe Reborn is designed to facilitate this process. Operating across English, isiZulu, isiXhosa, and Sesotho, the platform enables employers to systematically evaluate ergonomic risks and organize inspection-ready statutory documentation.

We welcome the opportunity to present our digital self-assessment framework to the Department.

Sincerely,
Ergo-Safe OHS Task Force | Ergo-Safe (Pty) Ltd`
    }
};
