import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, X, Film, ShieldCheck, Clock } from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DEMO_VIDEO_SRC = '/demo/ergosafe-reborn-2min-demo.mp4';

export const DEMO_VIDEO_SCRIPT = [
  {
    time: "0:00 - 0:30",
    seconds: 0,
    title: "1. Statutory OHS Governance & Duty of Care",
    badge: "OHS Act 85 of 1993 & GN R1589",
    text: "South African employers face statutory obligations under Section 8(1) of the Occupational Health and Safety Act 85 of 1993 and the Ergonomics Regulations, 2019 (GN R1589). ErgoSafe Reborn V3 provides proactive ergonomic risk identification and structured workstation governance."
  },
  {
    time: "0:30 - 1:00",
    seconds: 30,
    title: "2. Privacy-First Edge AI Vision & Cognitive Handshake",
    badge: "100% On-Device MediaPipe & POPIA",
    text: "ErgoSafe deploys 100% client-side skeletal posture telemetry with zero cloud camera recording, paired with a pre-shift Cognitive Handshake to establish objective reaction-time baselines and protect workforce privacy under POPIA."
  },
  {
    time: "1:00 - 1:30",
    seconds: 60,
    title: "3. 3D Spine Telemetry, Nelly Voice Coach & Calculators",
    badge: "3D Spine & REBA / RULA / NIOSH / WBGT",
    text: "Interactive 3D spinal alignment telemetry visualizes cervical, thoracic, and lumbar loads in real time while Nelly delivers multilingual verbal posture guidance alongside deterministic REBA, RULA, NIOSH, and WBGT calculators."
  },
  {
    time: "1:30 - 2:00",
    seconds: 90,
    title: "4. Section 16.2 Competent Person Gate & 40-Year Ledger",
    badge: "Statutory Sign-Off & Audit Trail",
    text: "Every ergonomic assessment, HIRA draft, and escalation is gated by Section 16.2 Competent Person verification and archived according to Regulation 10(1) 40-year and employee-tenure retention schedules."
  }
];

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose }) => {
  const [activeScriptIdx, setActiveScriptIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleJumpToSection = (seconds: number, idx: number) => {
    setActiveScriptIdx(idx);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleDownloadMp4 = () => {
    const link = document.createElement('a');
    link.href = DEMO_VIDEO_SRC;
    link.download = 'ergosafe-reborn-2min-demo.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-label="ErgoSafe Reborn V3 2-Minute Executive Demo"
        className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0F172A] border-2 border-[#D97706] rounded-2xl sm:rounded-3xl max-w-5xl w-full p-3 sm:p-6 md:p-8 space-y-5 relative shadow-[0_0_80px_rgba(217,119,6,0.3)] my-auto max-h-[95vh] flex flex-col justify-between overflow-y-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 sm:p-3 bg-[#064E3B] border border-[#D97706] rounded-2xl text-white shrink-0">
                <Film size={24} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black text-[#D97706] uppercase tracking-[0.2em] block">
                  Executive 2-Minute Narrated Walkthrough (en-ZA)
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                  ErgoSafe Reborn V3 — Executive Demo
                </h2>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={handleDownloadMp4}
                className="bg-[#064E3B] hover:bg-[#065F46] border border-[#D97706] text-white px-3.5 py-2 rounded-xl font-black text-xs shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
                title="Download 2-Minute MP4 Video File"
              >
                <Download size={15} />
                <span>Download MP4</span>
              </button>
              <button
                onClick={handleClose}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 border border-white/15 transition-colors cursor-pointer"
                aria-label="Close Executive Demo Modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative w-full shrink-0 min-h-[200px] sm:min-h-[280px] rounded-2xl overflow-hidden bg-black border border-[#D97706]/40 shadow-2xl aspect-video max-h-[420px] flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              src={DEMO_VIDEO_SRC}
              controls
              playsInline
              preload="metadata"
              autoPlay
              poster="/assets/nelly-steward-final.png"
              title="ErgoSafe Reborn V3 2-Minute Narrated Executive Demo"
            />
          </div>

          {/* Teleprompter Script & Chapter Tabs */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-[#D97706]" />
                2-Minute Chapter Sync & Executive Script
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Click chapter to seek video</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO_VIDEO_SCRIPT.map((item, idx) => {
                const isActive = activeScriptIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleJumpToSection(item.seconds, idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                      isActive
                        ? 'bg-[#064E3B]/40 border-[#D97706] shadow-[0_0_20px_rgba(217,119,6,0.2)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs font-black font-mono text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded border border-[#D97706]/30">
                        [{item.time}]
                      </span>
                      <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white leading-tight">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                      "{item.text}"
                    </p>

                    <div className="pt-1 flex items-center gap-1 text-[10px] font-black text-[#D97706]">
                      <Play size={10} className="fill-[#D97706]" />
                      <span>JUMP TO {item.time.split(' - ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span className="truncate">ErgoSafe Reborn V3 • Narrated Executive Walkthrough (`en-ZA-LukeNeural`)</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                CLOSE PLAYER
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoVideoModal;
