import React, { useState } from 'react';
import { getClientApiToken } from '../utils/apiToken';
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
  AlertTriangle,
  Download,
  UserCheck,
  Award,
  Lock
} from 'lucide-react';
import { useComplianceStore } from '../store/complianceStore';

export interface StatutoryDocGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOCUMENT_TYPES = [
  { id: 'HIRA', title: 'HIRA Dossier', subtitle: 'Hazard Identification & Risk Assessment', icon: AlertTriangle },
  { id: 'SWP', title: 'Safe Work Procedure', subtitle: 'Standard Operating Protocol (OHS Sec 8)', icon: ShieldCheck },
  { id: 'Incident Root Cause', title: 'Incident Root Cause', subtitle: '5-Why Analysis & COIDA Remediation', icon: AlertCircle },
  { id: 'Toolbox Talk', title: 'Toolbox Talk', subtitle: 'Pre-Shift Safety & Ergonomic Briefing', icon: BookOpen }
];

export const STATUTORY_DISCLAIMER_BANNER = `> **STATUTORY COMPLIANCE NOTICE**: *AI-assisted draft compiled for operational guidance. In terms of the Occupational Health and Safety Act (Act 85 of 1993), this document is not a certified legal record until reviewed, adjusted for site-specific conditions, and signed off by a designated Competent Person.*`;

export const StatutoryDocGeneratorModal: React.FC<StatutoryDocGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { exportStatutoryDocToAuditLog } = useComplianceStore();

  const [taskType, setTaskType] = useState<string>('HIRA');
  const [siteContext, setSiteContext] = useState<string>('Logistics Facility - Durban Port Warehouse');
  const [hazards, setHazards] = useState<string>('Repetitive lumbar flexion (>30°), manual handling >25kg, desk monitor tilt strain');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [docMetadata, setDocMetadata] = useState<any>(null);

  // Competent Person Sign-Off Gate State
  const [isReviewed, setIsReviewed] = useState<boolean>(false);
  const [competentPersonName, setCompetentPersonName] = useState<string>('');
  const [competentPersonRole, setCompetentPersonRole] = useState<string>('');
  
  const [copied, setCopied] = useState<boolean>(false);
  const [exported, setExported] = useState<boolean>(false);

  const isSignOffValid = isReviewed && competentPersonName.trim().length > 2 && competentPersonRole.trim().length > 2;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);
    setExported(false);
    setIsReviewed(false);

    try {
      const token = getClientApiToken();
      const response = await fetch('/api/compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskType,
          siteContext,
          hazards
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.document) {
          const content = data.fallback
            ? `> ⚠️ **Offline template — not AI-generated**\n\n${data.document}`
            : data.document;
          setGeneratedDoc(content);
          setDocMetadata(data.metadata || null);
        } else {
          setGeneratedDoc(`### Error generating document\n${data.error || 'Unknown error occurred.'}`);
        }
      } else {
        const errData = await response.json().catch(() => null);
        setGeneratedDoc(`### Server Error\n${errData?.error || 'Unable to reach server-side statutory engine.'}`);
      }
    } catch (err: any) {
      console.error('Error generating document:', err);
      setGeneratedDoc(`### Connection Error\nFailed to invoke compliance API: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFullFormattedDocument = () => {
    if (!generatedDoc) return '';
    
    const signOffTimestamp = new Date().toISOString();
    const signOffBlock = `

---

### STATUTORY VERIFICATION & COMPETENT PERSON SIGN-OFF RECORD
- **Reviewed & Approved By:** ${competentPersonName || '[PENDING REVIEW]'}
- **Statutory Capacity:** ${competentPersonRole || '[PENDING ROLE ASSIGNMENT]'}
- **Verification Timestamp:** ${signOffTimestamp}
- **Mandatory Compliance Status:** VERIFIED & ADAPTED TO SITE-SPECIFIC CONDITIONS

${STATUTORY_DISCLAIMER_BANNER}`;

    // If disclaimer not already present, prepend top disclaimer
    const hasTopDisclaimer = generatedDoc.includes('STATUTORY COMPLIANCE NOTICE');
    const topDisclaimer = hasTopDisclaimer ? '' : `${STATUTORY_DISCLAIMER_BANNER}\n\n`;

    return `${topDisclaimer}${generatedDoc}${signOffBlock}`;
  };

  const handleCopyClipboard = () => {
    const fullText = getFullFormattedDocument();
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportAuditLog = () => {
    if (!generatedDoc || !isSignOffValid) return;
    const fullText = getFullFormattedDocument();
    exportStatutoryDocToAuditLog(
      taskType, 
      siteContext, 
      fullText, 
      competentPersonName.trim(), 
      competentPersonRole.trim()
    );
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleExportPDF = () => {
    if (!generatedDoc || !isSignOffValid) return;
    const fullText = getFullFormattedDocument();

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups to export PDF.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ErgoSafe Statutory Document - ${taskType}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }
          .banner { background-color: #fef3c7; border-left: 6px solid #d97706; padding: 15px; margin-bottom: 25px; border-radius: 4px; font-size: 13px; color: #92400e; }
          .title { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0; }
          .signoff { background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 6px; margin-top: 30px; font-size: 13px; }
          .footer { margin-top: 40px; font-size: 11px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          pre { font-family: inherit; white-space: pre-wrap; word-wrap: break-word; }
        </style>
      </head>
      <body>
        <div class="banner">
          <strong>STATUTORY COMPLIANCE NOTICE:</strong> AI-assisted draft compiled for operational guidance. In terms of the Occupational Health and Safety Act (Act 85 of 1993), this document is not a certified legal record until reviewed, adjusted for site-specific conditions, and signed off by a designated Competent Person.
        </div>
        <h1 class="title">REPUBLIC OF SOUTH AFRICA - STATUTORY OHS DOSSIER</h1>
        <p><strong>Document Type:</strong> ${taskType} | <strong>Site Context:</strong> ${siteContext}</p>
        <hr/>
        <pre>${generatedDoc}</pre>
        <div class="signoff">
          <h3>STATUTORY VERIFICATION & COMPETENT PERSON SIGN-OFF RECORD</h3>
          <p><strong>Reviewed & Approved By:</strong> ${competentPersonName}</p>
          <p><strong>Statutory Capacity:</strong> ${competentPersonRole}</p>
          <p><strong>Verification Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Verification Status:</strong> VERIFIED & ADAPTED TO SITE-SPECIFIC CONDITIONS</p>
        </div>
        <div class="footer">
          ErgoSafe Reborn V3 — Human-in-the-Loop Statutory OHS Generator | OHS Act 85 of 1993
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleReset = () => {
    setGeneratedDoc(null);
    setCopied(false);
    setExported(false);
    setIsReviewed(false);
    setCompetentPersonName('');
    setCompetentPersonRole('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
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
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                    Statutory OHS Document Generator
                  </h2>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  Deterministic Generation with Human-in-the-Loop Competent Person Verification
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

          {/* Standards Taxonomy Banner (Requirement 3: Explicit Separation) */}
          <div className="px-4 sm:px-6 py-2.5 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Mandatory SA Statutory Frameworks:</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">OHS Act 85 of 1993</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">Ergonomics Regs 2019 (GN R1589)</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">Physical Agents Regs 2024 (GN 5952)</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">GSR (13H/13J)</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">COIDA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Voluntary Best-Practice:</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold">ISO 45001:2018</span>
            </div>
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

                {/* Legal Safeguard Box */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                  <ShieldCheck size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Deterministic Generation with Human-in-the-Loop Sign-Off:</strong>
                    <span>
                      The generator utilizes temperature 0.0 to produce consistent, structured drafts from standardized prompts. All generated outputs require verification and sign-off by a designated statutory Competent Person before adoption.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* Generated Document Review Mode */
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase px-3 py-1 bg-ohs-orange/20 text-ohs-orange border border-ohs-orange/30 rounded-xl">
                      {taskType} Draft
                    </span>
                    {docMetadata && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                        Temp 0.0 Deterministic Draft
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

                {/* Top Statutory Banner Preview */}
                <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs text-amber-200 font-sans italic">
                  <strong>STATUTORY COMPLIANCE NOTICE:</strong> AI-assisted draft compiled for operational guidance. In terms of the Occupational Health and Safety Act (Act 85 of 1993), this document is not a certified legal record until reviewed, adjusted for site-specific conditions, and signed off by a designated Competent Person.
                </div>

                {/* Document Preview Box */}
                <div className="p-4 sm:p-6 bg-black/60 border border-white/10 rounded-2xl font-mono text-xs sm:text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[40vh]">
                  {generatedDoc}
                </div>

                {/* Requirement 1: UI Approval Component - Competent Person Sign-Off Gate */}
                <div className="p-4 sm:p-5 bg-ohs-navy/90 border-2 border-ohs-orange/40 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 text-ohs-orange border-b border-white/10 pb-2">
                    <UserCheck size={18} />
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                      Statutory Competent Person Verification & Sign-Off Gate
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isReviewed}
                        onChange={(e) => setIsReviewed(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-gray-600 bg-white/5 text-ohs-orange focus:ring-ohs-orange focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-xs text-gray-200 font-medium leading-normal group-hover:text-white transition-colors">
                        I confirm that I am a designated Competent Person (in terms of OHS Act General Administrative Regulations / Ergonomics Regulation 1) and have reviewed, verified, and adapted these draft hazard controls to site-specific conditions.
                      </span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                          Competent Person Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={competentPersonName}
                          onChange={(e) => setCompetentPersonName(e.target.value)}
                          placeholder="e.g., Appointed Sec 16.2 / Ergonomics Facilitator"
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-ohs-orange placeholder:text-gray-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                          Designation / Statutory Role <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={competentPersonRole}
                          onChange={(e) => setCompetentPersonRole(e.target.value)}
                          placeholder="e.g., SHE Representative, Risk Assessor"
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-ohs-orange placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  {!isSignOffValid && (
                    <p className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1.5 pt-1">
                      <Lock size={13} />
                      Export PDF and Audit Ledger actions are locked until Competent Person verification is completed.
                    </p>
                  )}
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
                  {exported 
                    ? '✅ Successfully logged to Statutory Audit Ledger' 
                    : isSignOffValid 
                      ? '✅ Competent Person verified — Ready for export' 
                      : '🔒 Sign-off required to enable exports'}
                </span>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyClipboard}
                    className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      copied
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>

                  <button
                    onClick={handleExportPDF}
                    disabled={!isSignOffValid}
                    title={!isSignOffValid ? 'Requires Competent Person sign-off' : 'Export signed PDF document'}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                      !isSignOffValid
                        ? 'bg-gray-700 text-gray-400 border border-gray-600 opacity-60 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20 cursor-pointer'
                    }`}
                  >
                    <Download size={16} />
                    Export PDF
                  </button>

                  <button
                    onClick={handleExportAuditLog}
                    disabled={!isSignOffValid}
                    title={!isSignOffValid ? 'Requires Competent Person sign-off' : 'Save signed document to audit dossier'}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                      !isSignOffValid
                        ? 'bg-gray-700 text-gray-400 border border-gray-600 opacity-60 cursor-not-allowed'
                        : exported
                          ? 'bg-emerald-500 text-ohs-navy'
                          : 'bg-ohs-orange text-ohs-navy hover:bg-amber-400 shadow-ohs-orange/20 cursor-pointer'
                    }`}
                  >
                    {exported ? <Check size={16} /> : <FileOutput size={16} />}
                    {exported ? 'Saved!' : 'Save to Audit Dossier'}
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
