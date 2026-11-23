import React from 'react';
import { Bot } from 'lucide-react';

interface AITransparencyBadgeProps {
  compact?: boolean;
  className?: string;
}

export const AI_TRANSPARENCY_DISCLOSURE_TEXT =
  'EU AI Act (Art. 50) Transparency: Outputs and synthetic voice guidance (Nelly / TTS) are AI-assisted ergonomic coaching only and require Section 16.2 Competent Person sign-off for statutory adoption under SA Ergonomics Regulations (2019).';

export const AITransparencyBadge: React.FC<AITransparencyBadgeProps> = ({
  compact = false,
  className = '',
}) => {
  if (compact) {
    return (
      <div
        data-testid="ai-transparency-badge"
        className={`flex items-start gap-2 rounded-xl bg-[#0F172A]/90 border border-[#D97706]/40 px-2.5 py-2 text-[10px] text-slate-200 leading-snug ${className}`}
      >
        <Bot size={13} className="text-[#D97706] shrink-0 mt-0.5" />
        <span>
          <strong className="text-[#D97706] font-black uppercase tracking-wider mr-1">
            AI Notice (EU AI Act Art. 50):
          </strong>
          AI-assisted ergonomic guidance &amp; synthetic voice only — requires Competent Person sign-off for statutory adoption.
        </span>
      </div>
    );
  }

  return (
    <div
      data-testid="ai-transparency-badge"
      className={`flex items-start gap-3 rounded-2xl bg-[#0F172A] border border-[#D97706]/50 p-3.5 text-xs text-slate-200 leading-relaxed shadow-md ${className}`}
    >
      <div className="p-2 rounded-xl bg-[#064E3B] border border-[#D97706]/60 text-white shrink-0">
        <Bot size={16} />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706]">
            EU AI Act Article 50 Disclosure (Active Aug 2026)
          </span>
        </div>
        <p className="text-slate-300 text-[11px]">{AI_TRANSPARENCY_DISCLOSURE_TEXT}</p>
      </div>
    </div>
  );
};

export default AITransparencyBadge;

