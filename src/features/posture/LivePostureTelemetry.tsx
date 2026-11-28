import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePoseLandmarker, PostureMetrics } from './usePoseLandmarker';
import { useNellyStore } from '../../store/nellyStore';
import { speak } from '../../utils/speech';
import {
  getCameraConsentState,
  setCameraConsentState,
  revokeCameraConsent,
  CameraConsentRecord,
} from '../../utils/popiaCrypto';
import { CameraConsentGate, PopiaDataSubjectPanel } from '../../components/compliance/CameraConsentGate';
import { AITransparencyBadge } from '../../components/compliance/AITransparencyBadge';
import { 
  Camera, 
  CameraOff, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Sliders, 
  HeartHandshake,
  ClipboardCheck,
  FileCheck2
} from 'lucide-react';

const MULTILINGUAL_POSTURE_ALERTS: Record<string, { neck: string; slouch: string; combined: string }> = {
  en: {
    neck: "I notice forward head posture and cervical neck strain. Please tuck your chin and align your ears over your shoulders.",
    slouch: "I am detecting significant torso slouching. Please sit back into your lumbar support and open up your chest.",
    combined: "Your neck and spine are under excessive biomechanical load. Please sit upright, roll your shoulders back, and take a deep breath."
  },
  zu: {
    neck: "Nelly ubona ukugoba kwentamo. Sicela uqondise amahlombe akho uphakamise ikhanda.",
    slouch: "Nelly ubona ukugoba komhlane. Sicela uhlale uqonde esihlalweni sakho.",
    combined: "Umzimba wakho ungaphansi kwengcindezi. Sicela uhlale uqonde futhi uphefumule kakhulu."
  },
  xh: {
    neck: "Nelly ubona ukugoba kwentamo. Nceda uqondise amagxa akho uphakamise intloko.",
    slouch: "Nelly ubona ukugoba komqolo. Nceda uhlale ngokuthe ngqo.",
    combined: "Umqolo wakho usecingweni lweengozi. Nceda ulungise indlela ohleli ngayo."
  },
  st: {
    neck: "Nelly o hlokomela ho kobeha ha molala. Ka kopo otlolla mahetla a hao.",
    slouch: "Nelly o bona ho sekama ha mokokotlo. Ka kopo lula o otlolohile.",
    combined: "Mokokotlo le molala li tlas'a khatello. Ka kopo lula hantle 'me u heme ka botlalo."
  },
  sw: {
    neck: "Nelly anagundua shingo yako imeinama mbele. Tafadhali inua kichwa na unyooshe mabega.",
    slouch: "Mgongo wako umepinda vibaya. Tafadhali kaa wima kwenye kiti chako.",
    combined: "Mkao wako unaleta maumivu ya mgongo. Tafadhali unyooshe mgongo na upumzike kidogo."
  },
  de: {
    neck: "Ich bemerke eine starke Neigung des Nackens. Bitte richte deinen Kopf auf und ziehe das Kinn leicht an.",
    slouch: "Du sitzt zusammengesunken. Bitte nutze die Rückenlehne und richte den Oberkörper auf.",
    combined: "Deine Haltung belastet die Wirbelsäule stark. Bitte nimm eine aufrechte Sitzposition ein und atme tief durch."
  },
  zh: {
    neck: "检测到颈部过度前倾。请挺胸收下巴，使耳朵与肩膀保持对齐。",
    slouch: "检测到躯干驼背塌陷。请端正坐姿，贴合靠背以保护腰椎。",
    combined: "身体姿势负荷过高。请调整坐姿，放松双肩并做一次深呼吸。"
  },
  af: {
    neck: "Ek merk vooroorbuiging van die nek op. Trek asseblief jou ken in en bring jou ore in lyn met jou skouers.",
    slouch: "Jy sit tans vooroor geboë. Sit asseblief regop teen jou rugleuning.",
    combined: "Jou werwelkolom is onder spanning. Sit asseblief regop en rol jou skouers terug."
  }
};

export interface LivePostureTelemetryProps {
  autoStart?: boolean;
  onClose?: () => void;
  onNavigateToStatutory?: () => void;
}

type ManualNeckComfort = 'comfortable' | 'mild_tension' | 'high_strain';
type ManualLumbarSupport = 'full_support' | 'partial_support' | 'no_support';
type ManualMonitorHeight = 'eye_level' | 'slightly_low' | 'neck_bending';
type ManualBreakCompliance = 'every_30_45_min' | 'overdue_1_2_hr' | 'no_breaks_2_plus_hr';

export const LivePostureTelemetry: React.FC<LivePostureTelemetryProps> = ({
  autoStart = false,
  onNavigateToStatutory
}) => {
  const { language, setSpeaking, setMood, setGuidance } = useNellyStore();
  const [consentState, setConsentState] = useState<CameraConsentRecord>(() => getCameraConsentState());
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  // Skeleton-only by default: the camera feed is hidden and only the stick figure is drawn.
  const [showPreview, setShowPreview] = useState(false);
  const [activeIssueNotice, setActiveIssueNotice] = useState<string | null>(null);
  const hasAutoStartedRef = useRef(false);
  // Session log: one posture sample every 5 seconds while the camera is on. Numbers only, no images.
  const sessionSamplesRef = useRef<Array<Record<string, string | number | boolean>>>([]);
  const lastSampleAtRef = useRef(0);

  // Manual Ergonomic Assessment Mode state
  const [manualNeck, setManualNeck] = useState<ManualNeckComfort>('comfortable');
  const [manualLumbar, setManualLumbar] = useState<ManualLumbarSupport>('full_support');
  const [manualMonitor, setManualMonitor] = useState<ManualMonitorHeight>('eye_level');
  const [manualBreaks, setManualBreaks] = useState<ManualBreakCompliance>('every_30_45_min');
  const [manualLoggedNotice, setManualLoggedNotice] = useState<string | null>(null);

  // Trigger audio callback on sustained bad posture
  const handleSustainedBadPosture = useCallback(
    (currentMetrics: PostureMetrics, issueType: string) => {
      const langKey = language?.split('-')[0].toLowerCase() || 'en';
      const promptDict = MULTILINGUAL_POSTURE_ALERTS[langKey] || MULTILINGUAL_POSTURE_ALERTS.en;

      let alertText = promptDict.combined;
      let issueLabel = 'Excessive Biomechanical Load';

      if (issueType === 'neck-flexion') {
        alertText = promptDict.neck;
        issueLabel = `Tech-Neck Flexion (${currentMetrics.neckFlexionAngle}°)`;
      } else if (issueType === 'torso-slouch') {
        alertText = promptDict.slouch;
        issueLabel = `Torso Slouch (${currentMetrics.torsoSlouchAngle}°)`;
      }

      setActiveIssueNotice(issueLabel);
      setTimeout(() => setActiveIssueNotice(null), 8000);

      // PRIVACY: individual posture is coaching for the person only. It is NOT written to the
      // compliance ledger and creates no case for a manager. Employer reporting, if a client
      // pilot needs it, must be anonymous group numbers only (see README, Privacy & pilot model).

      // Voice prompt if unmuted
      if (!isVoiceMuted) {
        setSpeaking(true);
        setMood('concerned');
        setGuidance(alertText);
        speak(alertText, language || 'en-ZA', () => {
          setSpeaking(false);
        });
      }
    },
    [language, isVoiceMuted, setSpeaking, setMood, setGuidance]
  );

  const {
    videoRef,
    canvasRef,
    isLoading,
    initError,
    isCameraActive,
    cameraPermissionError,
    metrics,
    startCamera,
    stopCamera,
    calibrateNeutralPosture,
    resetCalibration
  } = usePoseLandmarker({
    alertThresholdSeconds: 5,
    onSustainedBadPosture: handleSustainedBadPosture,
    voiceCooldownSeconds: 25
  });

  // Listen for POPIA data wipe or consent revocation events
  useEffect(() => {
    const handleResetConsent = () => {
      stopCamera();
      hasAutoStartedRef.current = false;
      setConsentState(getCameraConsentState());
    };
    window.addEventListener('ERGOSAFE_LOCAL_DATA_WIPED', handleResetConsent);
    window.addEventListener('ERGOSAFE_CAMERA_CONSENT_CHANGED', handleResetConsent);
    return () => {
      window.removeEventListener('ERGOSAFE_LOCAL_DATA_WIPED', handleResetConsent);
      window.removeEventListener('ERGOSAFE_CAMERA_CONSENT_CHANGED', handleResetConsent);
    };
  }, [stopCamera]);

  // Auto-trigger webcam start when launched from 1-click button or modal ONLY when POPIA consent is accepted
  useEffect(() => {
    if (autoStart && consentState.accepted && !isCameraActive && !hasAutoStartedRef.current && !initError) {
      hasAutoStartedRef.current = true;
      startCamera();
    }
  }, [autoStart, consentState.accepted, isCameraActive, initError, startCamera]);

  // Record a posture sample every 5 seconds while the camera is active.
  useEffect(() => {
    if (!isCameraActive) return;
    const now = Date.now();
    if (now - lastSampleAtRef.current < 5000) return;
    lastSampleAtRef.current = now;
    sessionSamplesRef.current.push({
      time: new Date(now).toISOString(),
      postureScore: metrics.postureScore,
      postureStatus: metrics.postureStatus,
      neckFlexionDeg: metrics.neckFlexionAngle,
      torsoSlouchDeg: metrics.torsoSlouchAngle,
      shoulderTiltDeg: metrics.shoulderTiltAngle,
      sustainedBadPostureSec: metrics.sustainedBadPostureSeconds,
      landmarksDetected: metrics.landmarksDetected,
      calibrated: metrics.isCalibrated,
    });
  }, [metrics, isCameraActive]);

  // Save the samples as a CSV file on this computer. Nothing is uploaded.
  const saveSessionLog = () => {
    const rows = sessionSamplesRef.current;
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map((row) => headers.map((h) => String(row[h])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `ergosafe-posture-log-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleManualTestVoice = () => {
    const langKey = language?.split('-')[0].toLowerCase() || 'en';
    const promptDict = MULTILINGUAL_POSTURE_ALERTS[langKey] || MULTILINGUAL_POSTURE_ALERTS.en;
    const testText = promptDict.combined;

    setSpeaking(true);
    setMood('concerned');
    setGuidance(testText);
    speak(testText, language || 'en-ZA', () => {
      setSpeaking(false);
    });
  };

  const handleSubmitManualAssessment = () => {
    const issues: string[] = [];
    if (manualNeck !== 'comfortable') {
      issues.push(`Neck Comfort: ${manualNeck.replace(/_/g, ' ')}`);
    }
    if (manualLumbar !== 'full_support') {
      issues.push(`Lumbar Support: ${manualLumbar.replace(/_/g, ' ')}`);
    }
    if (manualMonitor !== 'eye_level') {
      issues.push(`Monitor Eye-Line: ${manualMonitor.replace(/_/g, ' ')}`);
    }
    if (manualBreaks !== 'every_30_45_min') {
      issues.push(`Break Compliance: ${manualBreaks.replace(/_/g, ' ')}`);
    }

    // PRIVACY: a self-check is for the person only. Nothing is logged, saved or sent.
    setManualLoggedNotice(
      issues.length === 0
        ? `Self-check done at ${new Date().toLocaleTimeString()}: your setup looks good. This stays on your screen only.`
        : `Self-check done at ${new Date().toLocaleTimeString()}: ${issues.length} area${issues.length > 1 ? 's' : ''} could be adjusted. This stays on your screen only, and nobody else can see it.`
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-red-400 border-red-500/40 bg-red-500/10';
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Zero-Surveillance Privacy Banner */}
      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 space-y-3 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  POPIA-Compliant Zero-Surveillance Edge Processing
                </h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  100% Client-Side
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Video frames are processed in volatile GPU memory and discarded instantly. Zero footage or biometric landmarks are recorded, stored, or transmitted over any network.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isVoiceMuted
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-white/10 text-emerald-300 border border-emerald-500/30 hover:bg-white/15'
              }`}
              title={isVoiceMuted ? 'Nelly audio alerts muted' : 'Nelly audio alerts active'}
            >
              {isVoiceMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isVoiceMuted ? 'Voice Muted' : 'Voice Active'}</span>
            </button>
          </div>
        </div>

        <AITransparencyBadge compact />
      </div>

      {/* Mode 1: Unset -> POPIA Section 18 Camera Consent Gate */}
      {consentState.mode === 'unset' && (
        <CameraConsentGate
          onAcceptCamera={() => {
            const next = setCameraConsentState('camera');
            setConsentState(next);
            hasAutoStartedRef.current = true;
            startCamera();
          }}
          onContinueManual={() => {
            stopCamera();
            setConsentState(setCameraConsentState('manual'));
          }}
        />
      )}

      {/* Mode 2: Manual Ergonomic Assessment Mode (No Camera) */}
      {consentState.mode === 'manual' && (
        <div
          data-testid="manual-ergonomic-mode"
          className="w-full max-w-full overflow-x-hidden rounded-3xl bg-[#0F172A] border-2 border-[#D97706] p-5 sm:p-6 text-white shadow-2xl space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#064E3B] border border-[#D97706] text-white shrink-0">
                <ClipboardCheck size={22} />
              </div>
              <div>
                <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#064E3B] border border-[#D97706]/70 text-white mb-1">
                  Camera-Free Workstation Check
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Manual Ergonomic Assessment Mode
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Voluntary self-assessment for ergonomic coaching &amp; H&amp;S support without camera access. Supports, and does not replace, an appointed Competent Person under SA Ergonomics Regulations (2019).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Neck Comfort */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-white">
                1. Neck Comfort
              </label>
              <select
                value={manualNeck}
                onChange={(e) => setManualNeck(e.target.value as ManualNeckComfort)}
                className="w-full rounded-xl bg-slate-800 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D97706]"
              >
                <option value="comfortable">Neutral / Comfortable (ears over shoulders)</option>
                <option value="mild_tension">Mild Neck Tension / Slight Forward Tilt</option>
                <option value="high_strain">Noticeable Cervical Strain / Looking Down</option>
              </select>
            </div>

            {/* Lumbar Support */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-white">
                2. Lumbar Support
              </label>
              <select
                value={manualLumbar}
                onChange={(e) => setManualLumbar(e.target.value as ManualLumbarSupport)}
                className="w-full rounded-xl bg-slate-800 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D97706]"
              >
                <option value="full_support">Lower Back Supported Against Backrest</option>
                <option value="partial_support">Partial Support / Leaning Forward Occasionally</option>
                <option value="no_support">No Lumbar Support / Slouched Seat Position</option>
              </select>
            </div>

            {/* Monitor Eye-Line Height */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-white">
                3. Monitor Eye-Line Height
              </label>
              <select
                value={manualMonitor}
                onChange={(e) => setManualMonitor(e.target.value as ManualMonitorHeight)}
                className="w-full rounded-xl bg-slate-800 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D97706]"
              >
                <option value="eye_level">Top Third of Screen at Eye Level</option>
                <option value="slightly_low">Slightly Low (Laptop / Desk Riser Needed)</option>
                <option value="neck_bending">Significantly Below Eye Line (Sustained Neck Flexion)</option>
              </select>
            </div>

            {/* Break Compliance */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-white">
                4. Break Compliance
              </label>
              <select
                value={manualBreaks}
                onChange={(e) => setManualBreaks(e.target.value as ManualBreakCompliance)}
                className="w-full rounded-xl bg-slate-800 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D97706]"
              >
                <option value="every_30_45_min">Micro-Breaks Taken Every 30–45 Minutes</option>
                <option value="overdue_1_2_hr">Break Overdue (1–2 Hours Continuous Sitting)</option>
                <option value="no_breaks_2_plus_hr">No Micro-Breaks for 2+ Hours</option>
              </select>
            </div>
          </div>

          {manualLoggedNotice && (
            <div className="rounded-xl bg-[#064E3B]/70 border border-[#D97706] px-4 py-3 text-xs text-white flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0 mt-0.5" />
              <span>{manualLoggedNotice}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSubmitManualAssessment}
              className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#065F46] border-2 border-[#D97706] text-white text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-lg"
            >
              <FileCheck2 size={15} />
              <span>Log Manual Ergonomic Screening</span>
            </button>

            <button
              type="button"
              onClick={() => {
                revokeCameraConsent();
                setConsentState(getCameraConsentState());
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/20 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
            >
              <Camera size={15} />
              <span>Opt In to Local Camera (View POPIA Consent)</span>
            </button>

            {onNavigateToStatutory && (
              <button
                type="button"
                onClick={onNavigateToStatutory}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-[#D97706]/60 text-amber-200 text-xs font-bold cursor-pointer transition-all"
              >
                Open Statutory Governance
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Consented Local Camera Mode */}
      {consentState.mode === 'camera' && consentState.accepted && (
      /* Main Grid: Live Video Viewport (2 cols) & Biomechanical Telemetry Gauges (1 col) */
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Webcam Canvas Viewport */}
        <div className="lg:col-span-2 bg-slate-950/70 border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4 relative overflow-hidden backdrop-blur-md shadow-2xl">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isCameraActive ? 'bg-emerald-400' : 'bg-gray-500'}`} />
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Live Biomechanical Video Stream
              </h3>
              {metrics.isCalibrated && (
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-500/30">
                  Calibrated Neutral
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <>
                  <button
                    onClick={calibrateNeutralPosture}
                    disabled={!metrics.landmarksDetected}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    title="Lock in your current posture as your ideal baseline"
                  >
                    <Sliders size={14} />
                    <span>Calibrate Neutral</span>
                  </button>

                  <button
                    onClick={stopCamera}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CameraOff size={14} />
                    <span>Pause</span>
                  </button>

                  <button
                    onClick={saveSessionLog}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Save session log (CSV)</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={startCamera}
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  <span>Start Live Webcam</span>
                </button>
              )}
            </div>
          </div>

          {/* Video Container with Overlaid Canvas */}
          <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-2xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center">
            {/* The Hidden/Mirrored Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${showPreview ? 'opacity-70' : 'opacity-0'}`}
            />

            {/* Overlaid Drawing Canvas */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none z-10"
            />

            {isCameraActive && (
              <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between gap-2 text-[10px] text-slate-300">
                <span className="px-2 py-1 rounded-lg bg-black/60 border border-white/10">
                  Skeleton only. No face is shown, saved or sent.
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="px-2 py-1 rounded-lg bg-black/60 border border-white/20 hover:bg-black/80 cursor-pointer"
                >
                  {showPreview ? 'Hide my camera view' : 'Show my camera view'}
                </button>
              </div>
            )}

            {/* Standby / Inactive Overlay */}
            {!isCameraActive && (
              <div className="relative z-20 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Camera size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">Camera Offline</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Click "Start Live Webcam" to initiate real-time local cervical & torso posture screening using MediaPipe Pose Landmarker.
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>Activate Local Camera</span>
                </button>
              </div>
            )}

            {/* Permission or Initialization Errors */}
            {cameraPermissionError && (
              <div className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <AlertTriangle size={36} className="text-amber-400" />
                <h4 className="text-sm font-black text-white">Camera Access Required</h4>
                <p className="text-xs text-amber-200/90 max-w-md">{cameraPermissionError}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20"
                >
                  Try Again
                </button>
              </div>
            )}

            {initError && (
              <div className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <AlertTriangle size={36} className="text-red-400" />
                <h4 className="text-sm font-black text-white">Pose Engine Error</h4>
                <p className="text-xs text-red-200/90 max-w-md">{initError}</p>
              </div>
            )}

            {/* Sustained Warning Countdown Banner */}
            {isCameraActive && metrics.sustainedBadPostureSeconds > 0 && (
              <div className="absolute top-4 left-4 right-4 z-20">
                <div className="bg-red-950/90 border border-red-500/60 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center justify-between gap-3 animate-pulse">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle size={18} className="text-red-400 shrink-0" />
                    <span className="text-xs font-black text-red-200 uppercase tracking-wider">
                      Sustained Postural Strain Detected ({metrics.sustainedBadPostureSeconds}s / 5s)
                    </span>
                  </div>
                  <div className="w-24 bg-red-900/50 rounded-full h-2 overflow-hidden border border-red-500/40 shrink-0">
                    <div
                      className="bg-red-400 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (metrics.sustainedBadPostureSeconds / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Active Alert Popover */}
            <AnimatePresence>
              {activeIssueNotice && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/95 border border-amber-500/60 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
                      <Volume2 size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                        Nelly Verbal Intervention Triggered
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        {activeIssueNotice}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveIssueNotice(null)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Prominent Quick Actions Toolbar for instant testing */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl shadow-lg">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Calibrate Neutral Button */}
              <button
                onClick={calibrateNeutralPosture}
                disabled={!isCameraActive || !metrics.landmarksDetected}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  metrics.isCalibrated
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 ring-2 ring-blue-400'
                    : isCameraActive && metrics.landmarksDetected
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/40 animate-pulse'
                    : 'bg-white/10 text-slate-400 border border-white/10 cursor-not-allowed opacity-60'
                }`}
                title={
                  !isCameraActive
                    ? 'Activate webcam first to calibrate neutral posture'
                    : !metrics.landmarksDetected
                    ? 'Align upper body in camera to calibrate baseline'
                    : 'Lock in current posture as your ideal ergonomic baseline'
                }
              >
                <Sliders size={15} />
                <span>{metrics.isCalibrated ? '✓ Baseline Calibrated' : '🎯 Calibrate Neutral'}</span>
              </button>

              {/* Preview Nelly Voice Guidance Button */}
              <button
                onClick={handleManualTestVoice}
                className="px-3.5 py-2 bg-gradient-to-r from-ohs-orange to-amber-500 hover:from-yellow-400 hover:to-orange-400 text-ohs-navy rounded-xl text-xs font-black transition-all shadow-md shadow-ohs-orange/20 flex items-center gap-2 cursor-pointer"
                title="Hear Nelly's real-time voice coaching prompt in active language"
              >
                <Volume2 size={15} />
                <span>🔊 Preview Nelly Voice ({language?.toUpperCase() || 'EN-ZA'})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <button
                  onClick={stopCamera}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CameraOff size={14} />
                  <span>Pause Camera</span>
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                  <span>Start Live Webcam</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Video Status Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Posture Status:</span>
              <span
                className={`font-black uppercase tracking-wider ${
                  metrics.postureStatus === 'optimal'
                    ? 'text-emerald-400'
                    : metrics.postureStatus === 'warning'
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {metrics.statusLabel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {metrics.isCalibrated ? (
                <button
                  onClick={resetCalibration}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reset Calibration</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 italic">
                  Tip: Sit upright and click "Calibrate Neutral" for tailored monitoring
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry Gauges & Nelly Companion Controls */}
        <div className="space-y-6">
          {/* Posture Score Metric Card */}
          <div className="bg-slate-950/70 border border-white/10 rounded-3xl p-5 space-y-4 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Real-Time Ergonomic Health Score
              </span>
              <span
                className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${getScoreColor(
                  metrics.postureScore
                )}`}
              >
                {metrics.postureStatus.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Circular Gauge */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      metrics.postureScore >= 80
                        ? 'text-emerald-400'
                        : metrics.postureScore >= 60
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }
                    strokeDasharray={`${metrics.postureScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-white">{metrics.postureScore}%</span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-tighter">Score</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-black text-white">
                  {metrics.postureScore >= 80
                    ? 'Spine Aligned (Neutral)'
                    : metrics.postureScore >= 60
                    ? 'Moderate Spinal Load'
                    : 'Critical Cervical Strain'}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Evaluates forward head angle, thoracic kyphosis, and shoulder imbalance.
                </p>
              </div>
            </div>

            {/* Individual Joint Meters */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              {/* Neck Flexion Angle */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <span>Neck Flexion (Tech-Neck)</span>
                  </span>
                  <span
                    className={`font-mono font-black ${
                      metrics.neckFlexionAngle > 22
                        ? 'text-red-400'
                        : metrics.neckFlexionAngle > 15
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {metrics.neckFlexionAngle}°
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      metrics.neckFlexionAngle > 22
                        ? 'bg-red-500'
                        : metrics.neckFlexionAngle > 15
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (metrics.neckFlexionAngle / 40) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
                  <span>0° (Neutral)</span>
                  <span>15° (Safe limit)</span>
                  <span>40° (Severe)</span>
                </div>
              </div>

              {/* Torso Slouch Angle */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-bold">Torso Slouch / Lean</span>
                  <span
                    className={`font-mono font-black ${
                      metrics.torsoSlouchAngle > 20
                        ? 'text-red-400'
                        : metrics.torsoSlouchAngle > 12
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {metrics.torsoSlouchAngle}°
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      metrics.torsoSlouchAngle > 20
                        ? 'bg-red-500'
                        : metrics.torsoSlouchAngle > 12
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (metrics.torsoSlouchAngle / 35) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
                  <span>0° (Vertical)</span>
                  <span>12° (Caution)</span>
                  <span>35° (Slouch)</span>
                </div>
              </div>

              {/* Lateral Shoulder Imbalance */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-bold">Shoulder Symmetry</span>
                  <span
                    className={`font-mono font-black ${
                      metrics.shoulderTiltAngle > 8 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {metrics.shoulderTiltAngle}° tilt
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      metrics.shoulderTiltAngle > 8 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (metrics.shoulderTiltAngle / 20) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Nelly Intervention Control Panel */}
          <div className="bg-slate-950/70 border border-white/10 rounded-3xl p-5 space-y-4 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-ohs-orange/20 text-ohs-orange rounded-xl border border-ohs-orange/30">
                <HeartHandshake size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Nelly Automated Co-Pilot
                </h4>
                <p className="text-[11px] text-slate-400">
                  Multilingual verbal coaching triggered after 5s of poor posture.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Trigger Threshold:</span>
                <span className="font-mono text-emerald-400 font-bold">5 Seconds Sustained</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Active Accent / Locale:</span>
                <span className="font-bold text-white uppercase tracking-wider">{language || 'en-ZA'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Compliance Logging:</span>
                <span className="text-emerald-400 font-bold">Automatic Ledger Sync</span>
              </div>
            </div>

            <button
              onClick={handleManualTestVoice}
              className="w-full py-3 bg-gradient-to-r from-ohs-orange to-amber-500 hover:from-yellow-400 hover:to-orange-400 text-ohs-navy rounded-xl text-xs font-black transition-all shadow-md shadow-ohs-orange/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 size={16} />
              <span>🔊 Preview Nelly Voice Guidance ({language?.toUpperCase() || 'EN-ZA'})</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* POPIA Data Subject Rights & 1-Click Local Data Wipe Panel */}
      <PopiaDataSubjectPanel
        compact
        onConsentRevoked={() => {
          stopCamera();
          hasAutoStartedRef.current = false;
          setConsentState(getCameraConsentState());
        }}
      />
    </div>
  );
};
