import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  FileOutput, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  BookOpen,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { useComplianceStore } from '../../store/complianceStore';

interface StatutoryDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOCUMENT_TYPES = [
  { id: 'HIRA', title: 'HIRA Dossier', subtitle: 'Hazard Identification & Risk Assessment', icon: AlertTriangle },
  { id: 'SWP', title: 'Safe Work Procedure', subtitle: 'Standard Operating Protocol (OHS Sec 8)', icon: ShieldCheck },
  { id: 'Incident Root Cause', title: 'Incident Root Cause', subtitle: '5-Why Analysis & COIDA Remediation', icon: AlertCircle },
  { id: 'Toolbox Talk', title: 'Toolbox Talk', subtitle: 'Pre-Shift Safety & Ergonomic Briefing', icon: BookOpen }
];

export const StatutoryDocModal: React.FC<StatutoryDocModalProps> = ({ isOpen, onClose }) => {
  const { exportStatutoryDocToAuditLog } = useComplianceStore();

  const [taskType, setTaskType] = useState<string>('HIRA');
  const [siteContext, setSiteContext] = useState<string>('Logistics Facility - Durban Port Warehouse');
  const [hazards, setHazards] = useState<string>('Repetitive lumbar flexion (>30°), manual handling >25kg, desk monitor tilt strain');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [docMetadata, setDocMetadata] = useState<any>(null);
  
  const [copied, setCopied] = useState<boolean>(false);
  const [exported, setExported] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);
    setExported(false);

    try {
      const response = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType,
          siteContext,
          hazards
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.document) {
          setGeneratedDoc(data.document);
          setDocMetadata(data.metadata || null);
        } else {
          setGeneratedDoc(`### Error generating document\n${data.error || 'Unknown error occurred.'}`);
        }
      } else {
        setGeneratedDoc('### Server Error\nUnable to reach server-side statutory engine.');
      }
    } catch (err: any) {
      console.error('Error generating document:', err);
      setGeneratedDoc(`### Connection Error\nFailed to invoke compliance API: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyClipboard = () => {
    if (!generatedDoc) return;
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportAuditLog = () => {
    if (!generatedDoc) return;
    exportStatutoryDocToAuditLog(taskType, siteContext, generatedDoc);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleReset = () => {
    setGeneratedDoc(null);
    setCopied(false);
    setExported(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-ohs-navy border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-ohs-orange/20 via-ohs-navy to-ohs-blue/20 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-ohs-orange/20 border border-ohs-orange/40 rounded-2xl text-ohs-orange shadow-lg">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                    Autonomous Statutory OHS Engine
                  </h2>
                  <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    RSA OHS ACT 85 OF 1993
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  Zero-Hallucination Legal Compliance & Hierarchy of Controls Generator
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sans">
            {!generatedDoc ? (
              <>
                {/* Step 1: Select Document Type */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-ohs-orange tracking-wider flex items-center gap-1.5">
                    <FileCheck size={14} /> 1. Select Statutory Document Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DOCUMENT_TYPES.map((doc) => {
                      const IconComponent = doc.icon;
                      const isSelected = taskType === doc.id;
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => setTaskType(doc.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-ohs-orange/15 border-ohs-orange text-white shadow-lg shadow-ohs-orange/10'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-ohs-orange/20 text-ohs-orange' : 'bg-white/5 text-gray-400'}`}>
                            <IconComponent size={18} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white leading-tight">{doc.title}</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{doc.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Site & Context Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-ohs-orange tracking-wider flex items-center gap-1.5">
                      <Building2 size={14} /> 2. Site / Workplace Context
                    </label>
                    <input
                      type="text"
                      value={siteContext}
                      onChange={(e) => setSiteContext(e.target.value)}
                      placeholder="e.g. Durban Logistics Warehouse, Control Room 4, Desk WFH Setup..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-ohs-orange transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-ohs-orange tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={14} /> 3. Identified Hazards & Operational Risks
                    </label>
                    <textarea
                      rows={3}
                      value={hazards}
                      onChange={(e) => setHazards(e.target.value)}
                      placeholder="Describe posture hazards, mechanical risks, lifting weights, shift hours..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-ohs-orange transition-all placeholder:text-gray-600 resize-none"
                    />
                  </div>
                </div>

                {/* Legal Assurance Box */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-gray-400">
                  <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                  <span>
                    <strong className="text-white">Statutory Zero-Hallucination Directive:</strong> Output strictly grounded in OHS Act Section 8, Ergonomics Regs 2019, COIDA & ISO 45001.
                  </span>
                </div>
              </>
            ) : (
              /* Generated Document Review Mode */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase px-3 py-1 bg-ohs-orange/20 text-ohs-orange border border-ohs-orange/30 rounded-xl">
                      {taskType} Generated
                    </span>
                    {docMetadata && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                        {docMetadata.model}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    Configure New Document
                  </button>
                </div>

                <div className="p-4 sm:p-6 bg-black/60 border border-white/10 rounded-2xl font-mono text-xs sm:text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                  {generatedDoc}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            {!generatedDoc ? (
              <div className="w-full flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-6 py-3 rounded-xl bg-ohs-orange text-ohs-navy text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-ohs-orange/20 disabled:opacity-50 cursor-pointer min-h-[44px]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Synthesizing Statutory Doc...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Statutory Doc
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-400 font-medium">
                  {exported ? '✅ Successfully logged to Statutory Audit Ledger' : 'Ready for compliance export and audit compilation'}
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyClipboard}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      copied
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>

                  <button
                    onClick={handleExportAuditLog}
                    className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      exported
                        ? 'bg-emerald-500 text-ohs-navy'
                        : 'bg-ohs-orange text-ohs-navy hover:bg-amber-400 shadow-ohs-orange/20'
                    }`}
                  >
                    {exported ? <Check size={16} /> : <FileOutput size={16} />}
                    {exported ? 'Exported!' : 'Export to Audit Log'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
