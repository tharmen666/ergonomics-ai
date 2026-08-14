import React from 'react';

export interface HandshakeCardHeaderProps {
  title: string;
  subtext?: string;
  actionButton?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const HandshakeCardHeader: React.FC<HandshakeCardHeaderProps> = ({
  title,
  subtext,
  actionButton,
  icon,
  className = '',
}) => {
  return (
    <div className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-ohs-navy/90 border border-white/15 rounded-2xl overflow-hidden backdrop-blur-xl relative z-10 shadow-2xl ${className}`}>
      <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
        {icon && <div className="shrink-0 mt-1 text-ohs-orange">{icon}</div>}
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="text-base sm:text-lg md:text-xl font-black text-white leading-snug break-words max-w-full uppercase tracking-tight">
            {title}
          </h3>
          {subtext && (
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed break-words max-w-full">
              {subtext}
            </p>
          )}
        </div>
      </div>
      {actionButton && (
        <div className="shrink-0 w-full sm:w-auto flex items-center justify-start sm:justify-end mt-2 sm:mt-0 relative z-20">
          {actionButton}
        </div>
      )}
    </div>
  );
};
