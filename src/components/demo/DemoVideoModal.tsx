import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, X, Film, ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DEMO_VIDEO_SCRIPT = [
  {
    time: "0:00 - 0:20",
    seconds: 0,
    title: "1. The Regulatory Reality & Financial Risk",
    badge: "OHSA 85 of 1993 & COIDA",
    text: "South African employers face statutory strict liability under Section 8(1) of the Occupational Health and Safety Act 85 of 1993, the Ergonomics Regulations (2019), and COIDA frameworks. Unmitigated remote work and workstation ergonomics expose corporate boards to CCMA constructive dismissal claims and severe non-compliance fines up to 10% of annual turnover."
  },
  {
    time: "0:20 - 0:45",
    seconds: 20,
    title: "2. Introducing ErgoSafe & Staff Buy-In",
    badge: "Cognitive Handshake & Privacy-First",
    text: "ErgoSafe Reborn introduces a Privacy-First 'Human-in-the-Loop' architecture. By deploying a mandatory 30-second Pre-Login Cognitive Sync to establish reaction baselines, employees experience zero invasive camera surveillance—transforming cold regulatory box-ticking into a high-performance gamified safety streak culture."
  },
  {
    time: "0:45 - 1:10",
    seconds: 45,
    title: "3. 3D Spine Telemetry & Interactive AI Coach",
    badge: "3D Spine Telemetry & Prizm Engine",
    text: "Powered by Three.js biomechanical posture mapping, Nelly—our Google Cloud Agent Builder digital wingman—monitors C1-C7 cervical tilt and L1-L5 lumbar strain in real time. Deeply integrated with Prizm Driver Fatigue score (/api/v1/fatigue-score), workers receive automated Tier-2 micro-stretch interventions before fatigue turns into acute injury."
  },
  {
    time: "1:10 - 1:30",
    seconds: 70,
    title: "4. Audit-Ready Compliance & Closing",
    badge: "Section 37/38 MongoDB Dossier",
    text: "Every daily safety scan, postural calibration, and fatigue resolution is autonomously embedded into the MongoDB MCP Server compliance ledger. Google Cloud Agent Builder queries this zero-knowledge dossier in real time—generating legal Section 37/38 audit trails that protect leadership while eliminating corporate liability."
  }
];

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose }) => {
  const [activeScriptIdx, setActiveScriptIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    link.href = '/assets/ErgoSafe_Reborn_30s_1080p_Narrated_Demo updated.mp4';
    link.download = 'ErgoSafe_Reborn_30s_1080p_Narrated_Demo updated.mp4';
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
        className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-slate-900 border-2 border-ohs-orange/50 rounded-3xl max-w-5xl w-full p-4 sm:p-8 space-y-6 relative shadow-[0_0_100px_rgba(249,168,37,0.3)] my-auto max-h-[95vh] flex flex-col justify-between overflow-y-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-ohs-orange/10 border border-ohs-orange/30 rounded-2xl text-ohs-orange">
                <Film size={26} />
              </div>
              <div>
                <span className="text-[10px] font-black text-ohs-orange uppercase tracking-[0.2em]">
                  Executive 90-Second Walkthrough
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  ErgoSafe Reborn V3 Demo Video & Script
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadMp4}
                className="bg-gradient-to-r from-ohs-orange to-yellow-400 text-ohs-navy px-4 py-2.5 rounded-xl font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                title="Download Standalone MP4 Video File"
              >
                <Download size={16} />
                <span>💾 Download MP4 Demo Video</span>
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl aspect-video max-h-[380px] flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              src="/assets/ErgoSafe_Reborn_30s_1080p_Narrated_Demo updated.mp4"
              controls
              autoPlay
              muted
              preload="auto"
              playsInline
              poster="/assets/nelly-steward-final.png"
              title="ErgoSafe Reborn 30s 1080p Narrated Demo"
            />
          </div>

          {/* Teleprompter Script Accordion & Chapter Tabs */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-ohs-orange" />
                90-Second Teleprompter Script & Chapter Sync
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Click section to jump video</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO_VIDEO_SCRIPT.map((item, idx) => {
                const isActive = activeScriptIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleJumpToSection(item.seconds, idx)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-2 ${
                      isActive
                        ? 'bg-ohs-navy/90 border-ohs-orange shadow-[0_0_20px_rgba(249,168,37,0.25)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black font-mono text-ohs-orange bg-ohs-orange/10 px-2 py-0.5 rounded border border-ohs-orange/20">
                        [{item.time}]
                      </span>
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white leading-tight">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                      "{item.text}"
                    </p>

                    <div className="pt-2 flex items-center gap-1 text-[10px] font-black text-ohs-orange">
                      <Play size={10} className="fill-ohs-orange" />
                      <span>JUMP TO {item.time.split(' - ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Standalone Asset: <code className="text-white bg-black/60 px-2 py-0.5 rounded border border-white/10 font-mono text-[11px]">C:\Users\Desigan Tharmen\Desktop\ErgoSafe_Reborn_V3_Demo.mp4</code></span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadMp4}
                className="w-full sm:w-auto bg-ohs-orange text-ohs-navy px-6 py-2.5 rounded-xl font-black text-xs shadow-lg hover:bg-yellow-400 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={16} />
                <span>SAVE MP4 DEMO VIDEO</span>
              </button>
              <button
                onClick={onClose}
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
