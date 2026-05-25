export interface PitchTemplate {
    client: string;
    targetAudience: string;
    dutyOfCareFocus: string;
    disconnectStrategy: string;
    valueProposition: string;
    outreachSubject: string;
    emailDraft: string;
}

export const REASONABLY_PRACTICABLE_2026 = {
    standardName: "2026 'Reasonably Practicable' Legal Standard",
    statuteReference: "OHS Act 85 of 1993, Section 8(1) & Section 37/38",
    description: "In 2026, the South African Department of Employment and Labour has formalised that an employer's duty of care extends directly to remote work environments and home offices. A digital ergonomic and fatigue compliance platform (like Ergo-Safe) is officially recognized as a 'reasonably practicable' mitigation mechanism because it is highly accessible, low-cost per seat, and yields continuous compliance telemetry.",
    finesFramework: "Failure to enforce home-office safety audits triggers Section 38(1) penalties: administrative fines up to 10% of annual turnover or 2 years imprisonment for executives."
};

export const RIGHT_TO_DISCONNECT_FRAMEWORK = {
    concept: "2026 'Right to Disconnect' Safeguard",
    ccmaRisk: "CCMA 'Digital Tethering' Claims",
    description: "Spiking by 142% in 2026, remote workers are successfully suing financial institutions for constructive dismissal and unpaid overtime due to after-hours messaging and systemic digital exhaustion. Ergo-Safe locks down digital access via Melly's Fatigue-Gate and DOA Lockouts, providing immediate legal evidence that the employer took all 'Reasonably Practicable' steps to prevent digital tethering and psychosocial hazards.",
    complianceCode: "Complying with ISO 45003 (Psychosocial Risk Management) and CCMA precedents."
};

export const FINANCIAL_PITCHES: Record<string, PitchTemplate> = {
    standard_bank: {
        client: "Standard Bank of South Africa",
        targetAudience: "HR Executive, Operations Leads, IT Infrastructure Team",
        dutyOfCareFocus: "Ergonomic validation for 12,000+ hybrid branch administrators and call center staff working from home.",
        disconnectStrategy: "Melly AI active burnout checks, automatically logging screen-time and suggesting micro-stretches to standardise off-hours disconnection.",
        valueProposition: "Protects Standard Bank from vicarious liability under Section 37 of the OHS Act while optimizing remote workforce productivity via localized isiZulu and Sesotho safety coaching.",
        outreachSubject: "Sovereign Board Briefing: Mitigating 2026 OHS Home-Office Liability at Standard Bank",
        emailDraft: `Dear Standard Bank HR Executive,

Under the 2026 'Reasonably Practicable' legal standard (OHS Act Section 8), Standard Bank's statutory duty of care extends fully to remote home offices. Standard Bank faces severe compliance exposure under Section 38(1) due to remote musculoskeletal injuries and the 2026 spike in CCMA 'Digital Tethering' claims.

Ergo-Safe Reborn resolves this. Our AI-driven platform provides continuous ergonomic telemetry, active fatigue coaching, and a 'Right to Disconnect' tracking framework. By deploying Ergo-Safe, you establish a bulletproof legal defense proving that the bank has taken all 'Reasonably Practicable' measures to manage physical and psychosocial hazards (ISO 45003) for remote employees.

We propose a digital partnership briefing to demonstrate how Standard Bank can protect its hybrid workforce and avoid annual revenue fines.

Sincerely,
Ergo-Safe OHS Task Force`
    },
    fnb: {
        client: "First National Bank (FNB)",
        targetAudience: "Chief Risk Officer, Employee Wellness Director",
        dutyOfCareFocus: "Mitigating CCMA constructive dismissal risks from remote software developers and digital banking operations teams.",
        disconnectStrategy: "Active Fatigue-Check gatekeeping. When employees log consecutive late-night commits or operations, Melly triggers a mandatory cognitive handshake, logging off-hours safety metrics.",
        valueProposition: "Direct integration into FNB's employee wellness apps, translating compliance actions into FNB 'eBucks' or internal wellness rewards to drive 95%+ daily compliance.",
        outreachSubject: "Securing FNB's Hybrid Perimeter: 2026 OHS Compliance & Digital Tethering Defense",
        emailDraft: `Dear FNB Chief Risk Officer,

As FNB continues leading digital banking, remote operations have created a new regulatory vulnerability. In 2026, CCMA 'Digital Tethering' claims are rising, with remote workers securing substantial compensation for after-hours cognitive strain. Under the OHS Act's 'Reasonably Practicable' mandate, FNB is legally required to actively manage these home-office psychosocial risks.

Ergo-Safe Reborn offers an automated solution. By integrating Melly’s Cognitive Handshake and Fatigue-Gate protocols directly into your employees' daily workflows, FNB guarantees continuous compliance telemetry while enforcing the Right to Disconnect. 

Our gamified compliance model aligns perfectly with FNB’s innovation culture, ensuring employee wellness is tracked, verified, and logged in a digital OHS ledger. Let us schedule a 10-minute briefing to review FNB's OHS risk mitigation.

Sincerely,
Ergo-Safe OHS Task Force`
    },
    discovery: {
        client: "Discovery Group (Vitality)",
        targetAudience: "Executive Director - Vitality & Corporate Wellness",
        dutyOfCareFocus: "Linking remote ergonomic health score metrics directly to active Vitality wellness points and insurance premium discounts.",
        disconnectStrategy: "Enforcing daily compliance streaks and mandatory posture breaks, automatically logged in a secure MongoDB MCP ledger.",
        valueProposition: "Combines statutory compliance with commercial underwriting optimization. Employees who pass the daily OHS ergonomic check-ins earn wellness points, proving direct reduction in corporate healthcare claims.",
        outreachSubject: "Vitality + Ergo-Safe: Linking OHS 'Duty of Care' to Dynamic Corporate Underwriting",
        emailDraft: `Dear Discovery Corporate Wellness Executive,

The OHS Amendment Bill has changed hybrid work dynamics: employers must now prove continuous 'Reasonably Practicable' safety measures in home offices. For Discovery, this represents both a compliance requirement and an insurance optimization opportunity.

Ergo-Safe Reborn is the first platform that translates statutory OHS compliance (Section 8) and psychosocial wellness (ISO 45003) into verifiable digital data points. We propose integrating Ergo-Safe's ergonomic telemetry with Discovery Vitality. By rewarding corporate members for completing daily safety handshakes and micro-stretches, we reduce corporate health claims while securing absolute OHS legal compliance.

Let’s explore a strategic pilot to integrate Ergo-Safe with Discovery’s corporate health portfolio.

Sincerely,
Ergo-Safe OHS Task Force`
    },
    sanlam: {
        client: "Sanlam Group",
        targetAudience: "Chief Legal Officer, Group HR Director",
        dutyOfCareFocus: "Asset protection and long-term liability shielding for Sanlam's extensive financial advisor and consultant network working remotely.",
        disconnectStrategy: "Continuous OHS dashboard audits and localized voice guidance (isiZulu, isiXhosa, Sesotho, English) ensuring remote advisors understand active ergonomic risks.",
        valueProposition: "Protects Sanlam from high-value group negligence lawsuits by establishing a rigorous digital audit trail that exceeds the OHS Act's Section 37 vicarious liability requirements.",
        outreachSubject: "Shielding Sanlam's Remote Network: 2026 OHS Executive Duty of Care Compliance",
        emailDraft: `Dear Sanlam Group HR Director,

Sanlam's network of thousands of remote financial advisors represents a major OHS risk area. Under the 2026 'Reasonably Practicable' legal standard, Sanlam is vicariously liable (Section 37) for the safety of these remote consultants. Without a centralized, digital system to audit and coach remote ergonomics, the group faces severe administrative fines under Section 38(1).

Ergo-Safe Reborn provides a comprehensive, centralized compliance solution. With our multilingual safety coaching (available in English, isiZulu, isiXhosa, and Sesotho) and automated OHS reporting, Sanlam can continuously audit its remote network. This guarantees a legally defensible audit trail of 'Reasonably Practicable' compliance.

We invite you to a brief executive presentation of our OHS Compliance Matrix tailored for Sanlam.

Sincerely,
Ergo-Safe OHS Task Force`
    }
};
