import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Camera,
  ClipboardCheck,
  Database,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Lock,
  EyeOff,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import {
  getCameraConsentState,
  revokeCameraConsent,
  listLocalDataEntries,
  wipeAllLocalSessionData,
  CAMERA_CONSENT_STORAGE_KEY,
  StoredDataEntry,
  CameraConsentRecord,
} from '../../utils/popiaCrypto';
import { AITransparencyBadge } from './AITransparencyBadge';
import { useAgentLog } from '../../store/agentLogStore';
import { useComplianceStore } from '../../store/complianceStore';

export interface CameraConsentGateProps {
  onAcceptCamera: () => void;
  onContinueManual: () => void;
}

export const CameraConsentGate: React.FC<CameraConsentGateProps> = ({
  onAcceptCamera,
  onContinueManual,
}) => {
  return (
    <div
      data-testid="popia-camera-consent-gate"
      className="w-full max-w-full overflow-x-hidden rounded-3xl bg-[#0F172A] border-2 border-[#D97706] p-5 sm:p-6 text-white shadow-2xl space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#064E3B] border border-[#D97706] text-white shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#064E3B] border border-[#D97706]/70 text-white mb-1">
              POPIA Section 18 Informed Consent
            </span>
            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
              Local Camera Privacy &amp; Ergonomic Coaching Gate
            </h3>
          </div>
        </div>
      </div>

      <AITransparencyBadge compact />

      {/* 4 Mandatory Disclosures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 flex items-start gap-3">
          <Lock size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              1. 100% Client-Side Skeletal Processing
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              100% client-side in-browser skeletal processing runs in volatile memory — zero raw video frames are ever transmitted or stored.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 flex items-start gap-3">
          <EyeOff size={18} className="text-[#D97706] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              2. Zero Biometrics &amp; Zero Emotion AI
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Zero facial recognition, zero biometric identification templates (avoiding POPIA Section 26 biometric databases), and zero emotion inference (EU AI Act Art. 5).
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 flex items-start gap-3">
          <ClipboardCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              3. Ergonomic Coaching &amp; H&amp;S Support Only
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Ergonomic coaching &amp; H&amp;S support only — strictly excluded from disciplinary action, performance scoring, or productivity surveillance.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 flex items-start gap-3">
          <UserCheck size={18} className="text-[#D97706] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              4. Supports Appointed Competent Person
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Supports, and does not replace, an appointed Competent Person under SA Ergonomics Regulations (2019).
            </p>
          </div>
        </div>
      </div>

      {/* Explicit Consent Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onAcceptCamera}
          className="px-5 py-3 rounded-xl bg-[#064E3B] hover:bg-[#065F46] border-2 border-[#D97706] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <Camera size={16} />
          <span>Accept &amp; Enable Local Camera</span>
        </button>

        <button
          type="button"
          onClick={onContinueManual}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ClipboardCheck size={16} />
          <span>Continue Without Camera (Manual Ergonomic Assessment Mode)</span>
        </button>
      </div>
    </div>
  );
};

export interface PopiaDataSubjectPanelProps {
  compact?: boolean;
  onWiped?: () => void;
  onConsentRevoked?: () => void;
}

export const PopiaDataSubjectPanel: React.FC<PopiaDataSubjectPanelProps> = ({
  compact = false,
  onWiped,
  onConsentRevoked,
}) => {
  const [entries, setEntries] = useState<StoredDataEntry[]>(() => listLocalDataEntries());
  const [consent, setConsent] = useState<CameraConsentRecord>(() => getCameraConsentState());
  const [wipeConfirmation, setWipeConfirmation] = useState<string | null>(null);

  const refreshState = useCallback(() => {
    setEntries(listLocalDataEntries());
    setConsent(getCameraConsentState());
  }, []);

  useEffect(() => {
    const handleWiped = () => {
      refreshState();
    };
    window.addEventListener('ERGOSAFE_LOCAL_DATA_WIPED', handleWiped);
    window.addEventListener('ERGOSAFE_CAMERA_CONSENT_CHANGED', handleWiped);
    return () => {
      window.removeEventListener('ERGOSAFE_LOCAL_DATA_WIPED', handleWiped);
      window.removeEventListener('ERGOSAFE_CAMERA_CONSENT_CHANGED', handleWiped);
    };
  }, [refreshState]);

  const handleRevokeConsent = () => {
    revokeCameraConsent();
    refreshState();
    try {
      window.dispatchEvent(new CustomEvent('ERGOSAFE_CAMERA_CONSENT_CHANGED'));
    } catch {
      // Ignore event dispatch errors
    }
    onConsentRevoked?.();
  };

  const handleWipeAll = () => {
    const result = wipeAllLocalSessionData({ preserveAuth: true });

    try {
      const agentState = useAgentLog.getState() as unknown as { clearLogs?: () => void };
      if (typeof agentState.clearLogs === 'function') {
        agentState.clearLogs();
      } else {
        useAgentLog.setState({ logs: [], isLowConfidence: false });
      }
    } catch {
      // Safe fallback if store unavailable
    }

    try {
      useComplianceStore.setState({ logs: [], exceptions: [] });
    } catch {
      // Safe fallback if store unavailable
    }

    const remainingEntries = listLocalDataEntries();
    const remainingTelemetryOrConsent = remainingEntries.filter(
      (entry) => entry.key !== 'tenant-billing-telemetry-storage'
    ).length;

    setEntries(remainingEntries);
    setConsent(getCameraConsentState());
    setWipeConfirmation(
      `Wiped ${result.clearedCount} local entries at ${new Date(result.wipedAt).toLocaleTimeString()} (${result.wipedAt}). ${remainingTelemetryOrConsent} telemetry/consent entries remaining.`
    );
    onWiped?.();
  };

  const totalBytes = entries.reduce((sum, item) => sum + item.bytes, 0);
  const telemetryConsentCount = entries.filter(
    (entry) => entry.key !== 'tenant-billing-telemetry-storage'
  ).length;

  return (
    <div
      data-testid="popia-data-subject-panel"
      className={`w-full max-w-full overflow-x-hidden rounded-3xl bg-[#0F172A] border-2 border-[#D97706] text-white shadow-xl ${
        compact ? 'p-4 space-y-3' : 'p-5 sm:p-6 space-y-4'
      }`}
    >
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#064E3B] border border-[#D97706]/80 text-white shrink-0">
            <Database size={18} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              POPIA Data Subject Rights &amp; Local Storage Transparency
            </h4>
            <p className="text-[11px] text-slate-300">
              Inspect stored browser keys, revoke camera consent, or wipe local session telemetry in 1 click.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={refreshState}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            data-testid="wipe-local-data-btn"
            onClick={handleWipeAll}
            className="px-3.5 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#065F46] border-2 border-[#D97706] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Trash2 size={13} />
            <span>Permanently Wipe Local Session Data</span>
          </button>
        </div>
      </div>

      {/* Consent Status & Storage Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900/90 border border-white/10 px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-300 font-semibold">POPIA Camera Consent:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider text-[10px] border ${
              consent.accepted
                ? 'bg-[#064E3B] text-white border-[#D97706]'
                : consent.mode === 'manual'
                ? 'bg-slate-800 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-white/20'
            }`}
          >
            {consent.accepted
              ? `Accepted (${consent.version})`
              : consent.mode === 'manual'
              ? 'Manual Mode (Camera Disabled)'
              : 'Unset (Consent Required)'}
          </span>
          {consent.accepted && (
            <button
              type="button"
              onClick={handleRevokeConsent}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-[#D97706]/60 text-amber-200 text-[11px] font-bold cursor-pointer transition-all"
            >
              Revoke Camera Consent
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span>
            Telemetry/Consent Keys: <strong className="text-white">{telemetryConsentCount}</strong>
          </span>
          <span>
            Total Stored: <strong className="text-white">{entries.length}</strong> ({totalBytes} bytes)
          </span>
        </div>
      </div>

      {/* Wipe Confirmation Banner */}
      {wipeConfirmation && (
        <div className="rounded-xl bg-[#064E3B]/70 border border-[#D97706] px-3.5 py-2.5 text-xs text-white flex items-start gap-2">
          <CheckCircle2 size={16} className="text-emerald-300 shrink-0 mt-0.5" />
          <span>{wipeConfirmation}</span>
        </div>
      )}

      {/* Stored Keys Table / List */}
      {entries.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-3.5 text-xs text-slate-300 flex items-center gap-2">
          <AlertCircle size={15} className="text-emerald-400 shrink-0" />
          <span>0 entries in localStorage or sessionStorage. Local browser storage is clean.</span>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {entries.map((entry) => (
            <div
              key={`${entry.storage}:${entry.key}`}
              className="rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-amber-300 border border-white/10">
                    {entry.storage}
                  </span>
                  <span className="font-mono font-bold text-white break-all">{entry.key}</span>
                  {entry.key === CAMERA_CONSENT_STORAGE_KEY && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#064E3B] text-white border border-[#D97706]/60">
                      POPIA S18 Consent
                    </span>
                  )}
                </div>
                <p className="text-slate-400 font-mono truncate mt-0.5">
                  {entry.preview || '(empty)'}
                </p>
              </div>
              <span className="font-mono text-slate-300 shrink-0">{entry.bytes} B</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CameraConsentGate;
