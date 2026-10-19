import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const STATUTORY_NOTICE_TEXT = 
  "Statutory Notice: Digital biomechanical screening under GN R1589 (Ergonomics Regulations 2019). Baseline scores and control hierarchies are screening indicators and must be reviewed and countersigned by an appointed Competent Person / Section 16.2 Appointee.";

interface StatutoryDisclaimerBannerProps {
  className?: string;
  variant?: 'banner' | 'card' | 'compact';
}

export const StatutoryDisclaimerBanner: React.FC<StatutoryDisclaimerBannerProps> = ({ 
  className = '',
  variant = 'banner' 
}) => {
  if (variant === 'compact') {
    return (
      <div className={`p-2.5 bg-amber-500/15 border border-amber-500/35 rounded-xl flex items-center gap-2 text-xs text-amber-200 font-sans ${className}`}>
        <ShieldAlert size={16} className="text-ohs-orange shrink-0" />
        <span className="leading-snug">{STATUTORY_NOTICE_TEXT}</span>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-ohs-navy/95 border-2 border-ohs-orange/50 rounded-2xl flex items-start gap-3.5 shadow-lg relative overflow-hidden ${className}`}>
      <div className="p-2 rounded-xl bg-ohs-orange/20 border border-ohs-orange/30 text-ohs-orange shrink-0 mt-0.5">
        <ShieldAlert size={20} />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-ohs-orange bg-ohs-orange/15 px-2 py-0.5 rounded-full border border-ohs-orange/30">
            GN R1589 MANDATE
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            OHS Act 85 of 1993
          </span>
        </div>
        <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed font-sans">
          {STATUTORY_NOTICE_TEXT}
        </p>
      </div>
    </div>
  );
};

export default StatutoryDisclaimerBanner;
