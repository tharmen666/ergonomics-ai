import React from 'react';
import {
  ShieldAlert,
  Cpu,
  UserCheck,
  Clock,
  Target,
  Ban,
  CheckCircle2,
  Scale,
} from 'lucide-react';
import { AITransparencyBadge } from './AITransparencyBadge';

interface AIGovernanceCardProps {
  className?: string;
}

const GOVERNANCE_PILLARS = [
  {
    id: 'intended-purpose',
    title: 'Intended Purpose',
    badge: 'Assistive Ergonomic Tooling',
    icon: Target,
    accentClass: 'text-emerald-300 border-emerald-500/40 bg-[#064E3B]/60',
    description:
      'Workplace ergonomic posture coaching, biomechanical screening (RULA / REBA / NIOSH / WBGT), and South African OHS Act (85 of 1993) / Ergonomics Regulations (GN R1589, 2019) / voluntary ISO 45001 workflow support.',
  },
  {
    id: 'prohibited-uses',
    title: 'Prohibited Uses (EU AI Act Art. 5 & POPIA s26)',
    badge: 'Hard Boundary — Zero Surveillance',
    icon: Ban,
    accentClass: 'text-amber-300 border-[#D97706]/50 bg-[#D97706]/10',
    description:
      'Strictly zero emotion recognition or affect inference, zero facial recognition or biometric identification templates, and zero disciplinary, HR performance, or worker productivity scoring.',
  },
  {
    id: 'client-side-architecture',
    title: 'Client-Side Architecture',
    badge: 'Zero Raw Video Upload',
    icon: Cpu,
    accentClass: 'text-emerald-300 border-emerald-500/40 bg-[#064E3B]/60',
    description:
      'In-browser MediaPipe WASM/WebGL skeletal geometry math and browser-native Web Speech synthesis. Raw camera frames stay strictly in volatile browser memory — zero raw video frames are uploaded or persisted.',
  },
  {
    id: 'human-in-the-loop',
    title: 'Human-in-the-Loop Controls',
    badge: 'Competent Person Gate',
    icon: UserCheck,
    accentClass: 'text-amber-300 border-[#D97706]/50 bg-[#D97706]/10',
    description:
      'Voluntary POPIA Section 18 camera opt-in with full Manual Fallback assessment mode, mandatory OHS Act Section 16.2 Competent Person sign-off on statutory artefacts, and Regulation 7 Hierarchy of Controls enforcement.',
  },
];

export const AIGovernanceCard: React.FC<AIGovernanceCardProps> = ({ className = '' }) => {
  return (
    <section
      data-testid="ai-governance-card"
      aria-labelledby="ai-governance-heading"
      className={`w-full max-w-full overflow-x-hidden min-w-0 break-words rounded-2xl bg-[#0F172A] border border-[#D97706]/40 p-4 sm:p-6 text-white shadow-2xl space-y-5 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-white/10 pb-4 min-w-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-[#064E3B] border border-[#D97706]/60 text-white shrink-0">
            <Scale size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706]">
                Inspectable AI Governance Model Card
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#064E3B] border border-emerald-400/40 text-emerald-200">
                Engineering Controls Active
              </span>
            </div>
            <h3
              id="ai-governance-heading"
              className="text-base sm:text-lg font-black tracking-tight text-white break-words"
            >
              ErgoSafe Biomechanical &amp; Statutory AI Governance
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 break-words">
              Transparent system boundaries, POPIA data-minimization architecture, and EU AI Act readiness engineering.
            </p>
          </div>
        </div>
      </div>

      {/* Live Art. 50 Transparency Notice */}
      <AITransparencyBadge />

      {/* Four Core Governance Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 min-w-0">
        {GOVERNANCE_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="rounded-xl bg-slate-900/90 border border-white/10 p-4 space-y-2 min-w-0 break-words hover:border-[#D97706]/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon size={16} className="text-[#D97706] shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-white break-words">
                    {pillar.title}
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pillar.accentClass}`}
                >
                  {pillar.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed break-words">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* EU AI Act Timeline Readiness */}
      <div className="rounded-xl bg-[#064E3B]/30 border border-[#D97706]/40 p-4 space-y-3 min-w-0 break-words">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Clock size={16} className="text-[#D97706] shrink-0" />
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              EU AI Act Timeline Readiness
            </h4>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F172A] border border-[#D97706]/50 text-[#D97706]">
            Readiness Engineering (Not Third-Party Certified)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs min-w-0">
          <div className="rounded-lg bg-[#0F172A]/80 border border-white/10 p-3 space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Article 50 Transparency Disclosure</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed break-words">
              Active August 2026: Live in-UI disclosures on synthetic speech (Nelly TTS) and AI-drafted SOPs, ensuring users know when outputs are AI-assisted.
            </p>
          </div>

          <div className="rounded-lg bg-[#0F172A]/80 border border-white/10 p-3 space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-[#D97706]">
              <ShieldAlert size={14} className="shrink-0" />
              <span>Annex III High-Risk Documentation Readiness</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed break-words">
              Engineered ahead of the 2 December 2027 deadline: Technical documentation, human oversight gates, and deterministic audit trails structured for readiness review — not a third-party conformity certificate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIGovernanceCard;
