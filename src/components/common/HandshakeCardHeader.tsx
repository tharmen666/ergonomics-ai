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
    <div className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-ohs-navy/80 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md ${className}`}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {icon && <div className="shrink-0 mt-1 text-ohs-orange">{icon}</div>}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed break-words max-w-full">
            {title}
          </h3>
          {subtext && (
            <p className="text-sm text-gray-300 leading-normal break-words">
              {subtext}
            </p>
          )}
        </div>
      </div>
      {actionButton && (
        <div className="shrink-0 w-full sm:w-auto">
          {actionButton}
        </div>
      )}
    </div>
  );
};
