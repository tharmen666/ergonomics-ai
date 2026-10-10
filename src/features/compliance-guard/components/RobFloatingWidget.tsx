"use client";

import React, { useState } from "react";
import { RobAvatar } from "./RobAvatar";

interface RobFloatingWidgetProps {
  onOpenRob: () => void;
}

export function RobFloatingWidget({ onOpenRob }: RobFloatingWidgetProps) {
  const [showBubble, setShowBubble] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {/* Speech Bubble Tooltip */}
      {showBubble && (
        <div className="relative max-w-xs rounded-2xl border border-brand-500/40 bg-surface-strong/95 p-3.5 text-xs text-ink shadow-2xl backdrop-blur-md animate-bounce-subtle">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-white text-[10px] hover:bg-slate-700"
            title="Dismiss bubble"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-brand-600 dark:text-brand-400 font-mono text-[11px]">
              ROB — OHS AI ASSISTANT
            </span>
            <span className="chip text-[9px] bg-emerald-500/10 text-emerald-500 font-bold border-emerald-500/20 py-0.5 px-1.5">
              ONLINE
            </span>
          </div>

          <p className="text-xs text-ink/90 leading-relaxed">
            Need an instant <strong className="text-brand-600 dark:text-brand-400">OHS Safety File</strong> for your business (e.g. <span className="underline decoration-brand-500">Wimpy Southgate</span>, Engen, Pharmacy)?
          </p>

          <button
            type="button"
            onClick={onOpenRob}
            className="mt-2 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Ask Rob to Generate Now →</span>
          </button>
        </div>
      )}

      {/* Floating Gentleman Avatar Button */}
      <button
        type="button"
        onClick={onOpenRob}
        className="group relative flex items-center gap-3 rounded-full bg-slate-900/90 p-1.5 pl-3 border border-brand-500/50 shadow-2xl shadow-brand-500/30 transition-transform hover:scale-105 active:scale-95"
        aria-label="Open Rob OHS Generator"
      >
        <span className="hidden sm:inline-block font-mono text-xs font-semibold text-white group-hover:text-amber-400 transition">
          Talk to Rob
        </span>
        <RobAvatar size="md" />
      </button>
    </div>
  );
}
