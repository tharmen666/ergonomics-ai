"use client";

import React from "react";
import Image from "next/image";

export interface RobAvatarProps {
  isSpeaking?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

export function RobAvatar({
  isSpeaking = false,
  size = "md",
  className = "",
  onClick,
}: RobAvatarProps) {
  const sizeMap = {
    sm: "w-11 h-11",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const imageDimensionMap = {
    sm: 44,
    md: 64,
    lg: 96,
    xl: 128,
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className} ${
        onClick ? "cursor-pointer group" : ""
      }`}
    >
      {/* Outer Executive Glow Aura */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500 via-cyan-400 to-emerald-400 blur-md transition-all duration-700 ${
          isSpeaking
            ? "opacity-90 scale-125 animate-pulse"
            : "opacity-40 group-hover:opacity-75 group-hover:scale-105"
        }`}
      />

      {/* Golden OHS Compliance Ring */}
      <div
        className={`relative w-full h-full rounded-full p-1 bg-gradient-to-b from-amber-400/80 via-brand-500 to-slate-900 shadow-xl overflow-hidden flex items-center justify-center border-2 ${
          isSpeaking ? "border-amber-300 ring-4 ring-brand-500/30" : "border-brand-500/60"
        }`}
      >
        {/* Real Rob Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900">
          <Image
            src="/images/rob-avatar.jpg"
            alt="Rob - OHS AI Assistant"
            width={imageDimensionMap[size]}
            height={imageDimensionMap[size]}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            priority
          />

          {/* Animated Speaking Waveform Overlay */}
          {isSpeaking && (
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center gap-0.5 px-1">
              <span className="w-1 bg-amber-400 h-3 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 bg-cyan-400 h-4 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 bg-emerald-400 h-2 animate-bounce [animation-delay:-0.4s]" />
              <span className="w-1 bg-brand-400 h-4 animate-bounce" />
            </div>
          )}
        </div>
      </div>

      {/* Online Status / Hardhat Badge */}
      <div
        className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500 text-white shadow-md ${
          size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4.5 h-4.5" : "w-6 h-6"
        }`}
        title="Rob is Online & Ready"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
      </div>
    </div>
  );
}
