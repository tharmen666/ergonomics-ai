import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  X, 
  Download, 
  FileCheck, 
  Lock, 
  Calendar, 
  Award, 
  Building2, 
  Printer, 
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';
import { StatutoryDisclaimerBanner } from '../common/StatutoryDisclaimerBanner';
import { useComplianceStore } from '../../store/complianceStore';

export interface CompetentPersonSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  reportType: string;
  assessmentData: Record<string, any>;
  onExportSuccess?: (signOffData: {
    competentPersonName: string;
    legalDesignation: string;
    assessmentDate: string;
  }) => void;
}

export const CompetentPersonSignOffModal: React.FC<CompetentPersonSignOffModalProps> = ({
  isOpen,
  onClose,
  reportTitle,
  reportType,
  assessmentData,
  onExportSuccess
}) => {
  const { exportStatutoryDocToAuditLog } = useComplianceStore();

  const [competentPersonName, setCompetentPersonName] = useState('');
  const [legalDesignation, setLegalDesignation] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSignedConfirmed, setIsSignedConfirmed] = useState(false);
  const [isExported, setIsExported] = useState(false);

  const isValid = 
    competentPersonName.trim().length >= 2 &&
    legalDesignation.trim().length >= 2 &&
    assessmentDate.trim().length > 0 &&
    isSignedConfirmed;

  if (!isOpen) return null;

  const handleExportPDF = () => {
    if (!isValid) return;

    // Generate formal printable dossier window
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GN R1589 Statutory Ergonomics Assessment - ${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #111; line-height: 1.5; }
          .header { border-bottom: 2px solid #000; padding-bottom: 16px; margin-bottom: 20px; }
          .badge { display: inline-block; padding: 4px 8px; background: #eee; font-weight: bold; font-size: 11px; }
          .statutory-notice { background: #fff8e1; border: 2px solid #ffb300; padding: 12px; margin: 16px 0; font-size: 12px; }
          .data-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          .data-table th, .data-table td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
          .data-table th { background: #f5f5f5; }
          .signoff-box { border: 2px solid #10b981; padding: 16px; margin-top: 24px; background: #f0fdf4; }
          .signature-line { margin-top: 40px; border-top: 1px solid #333; width: 250px; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>STATUTORY ERGONOMIC RISK ASSESSMENT DOSSIER</h2>
          <p><strong>Standard:</strong> Ergonomics Regulations, 2019 (GN R1589) & OHS Act 85 of 1993 Section 8</p>
          <span class="badge">REGULATION 6 SCREENING DOSSIER</span>
          <span class="badge">RETENTION: 40 YEARS UNDER REGULATION 10(1)</span>
        </div>

        <div class="statutory-notice">
          <strong>STATUTORY NOTICE:</strong> Digital biomechanical screening under GN R1589 (Ergonomics Regulations 2019). Baseline scores and control hierarchies are screening indicators and must be reviewed and countersigned by an appointed Competent Person / Section 16.2 Appointee.
        </div>

        <h3>Assessment Scope: ${reportTitle}</h3>
        <p><strong>Evaluation Framework:</strong> ${reportType}</p>
        <p><strong>Date Evaluated:</strong> ${assessmentDate}</p>

        <h4>Biomechanical Parameters & Findings:</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th>Evaluation Metric</th>
              <th>Recorded Value / Factor</th>
              <th>Statutory Action Category</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(assessmentData).map(([k, v]) => `
              <tr>
                <td><strong>${k}</strong></td>
                <td>${typeof v === 'object' ? JSON.stringify(v) : v}</td>
                <td>GN R1589 Aligned</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="signoff-box">
          <h4>COMPETENT PERSON COUNTERSIGNATURE (REGULATION 6)</h4>
          <p>I confirm that I am an appointed Competent Person / Section 16.2 Appointee in terms of the Occupational Health and Safety Act 85 of 1993 and Ergonomics Regulations 2019. I have reviewed and verified this assessment and prescribed the necessary hierarchy of controls.</p>
          <p><strong>Competent Person Name:</strong> ${competentPersonName}</p>
          <p><strong>Legal Designation:</strong> ${legalDesignation}</p>
          <p><strong>Sign-Off Date:</strong> ${assessmentDate}</p>
          <p><strong>Countersignature Status:</strong> Formally Verified & Countersigned (Digital Timestamp: ${new Date().toISOString()})</p>
          <div class="signature-line">Competent Person / Section 16.2 Signature</div>
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(printContent);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 500);
    }

    // Save to Statutory Compliance Store
    exportStatutoryDocToAuditLog(
      reportType,
      reportTitle,
      `GN R1589 Assessment countersigned by ${competentPersonName} (${legalDesignation}) on ${assessmentDate}. Findings: ${JSON.stringify(assessmentData)}`,
      competentPersonName,
      legalDesignation
    );

    setIsExported(true);
    if (onExportSuccess) {
      onExportSuccess({
        competentPersonName,
        legalDesignation,
        assessmentDate
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 font-sans text-white overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-slate-900 border-2 border-ohs-orange/40 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-ohs-orange bg-ohs-orange/15 px-2.5 py-0.5 rounded-full border border-ohs-orange/30">
              Statutory Sign-Off Gate
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              GN R1589 / Section 16.2
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <UserCheck className="text-ohs-orange shrink-0" size={26} />
            Competent Person Countersignature
          </h2>
          <p className="text-xs text-gray-400">
            Exporting formal assessment dossier: <strong className="text-white">{reportTitle}</strong> ({reportType})
          </p>
        </div>

        {/* Mandatory Statutory Notice */}
        <StatutoryDisclaimerBanner />

        {/* Sign-Off Inputs (All Required) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-300 uppercase tracking-wider block">
                Competent Person Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={competentPersonName}
                onChange={(e) => setCompetentPersonName(e.target.value)}
                placeholder="e.g. Sipho Sithole (Pr.Eng / CIH)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-ohs-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-300 uppercase tracking-wider block">
                Legal Designation <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={legalDesignation}
                onChange={(e) => setLegalDesignation(e.target.value)}
                placeholder="e.g. Section 16.2 Appointee / SHE Rep"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-ohs-orange"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-gray-300 uppercase tracking-wider block">
              Assessment Date <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-ohs-orange"
              />
            </div>
          </div>

          {/* Signed Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-3 bg-ohs-navy/80 border border-ohs-orange/30 rounded-xl cursor-pointer hover:border-ohs-orange transition-colors">
            <input
              type="checkbox"
              checked={isSignedConfirmed}
              onChange={(e) => setIsSignedConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-white/5 text-ohs-orange focus:ring-ohs-orange cursor-pointer"
            />
            <span className="text-xs text-gray-200 leading-relaxed font-medium">
              I formally declare that I am an appointed <strong>Competent Person / Section 16.2 Appointee</strong> in terms of OHS Act 85 of 1993 and GN R1589. I have reviewed these screening indicators, verified task conditions, and authorize this statutory export.
            </span>
          </label>
        </div>

        {/* Validation Warning */}
        {!isValid && (
          <p className="text-xs text-amber-400/90 font-bold flex items-center gap-1.5">
            <Lock size={14} className="shrink-0" />
            PDF Export and Statutory Logging are locked until all 4 fields are completed.
          </p>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/15 text-gray-300 rounded-xl text-xs font-bold transition-all"
          >
            Cancel
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportPDF}
              disabled={!isValid}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                isValid
                  ? 'bg-ohs-orange hover:bg-yellow-400 text-ohs-navy shadow-ohs-orange/20 cursor-pointer'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {isExported ? <CheckCircle2 size={16} /> : <Download size={16} />}
              {isExported ? 'Dossier Exported!' : 'Export GN R1589 PDF Report'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompetentPersonSignOffModal;
