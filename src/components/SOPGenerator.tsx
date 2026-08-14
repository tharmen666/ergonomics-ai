import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Sparkles, Shield, CheckCircle, Copy, Printer, Download, 
  Wrench, AlertTriangle, UserCheck, RefreshCw, FileCheck, Layers 
} from 'lucide-react';

interface SOPData {
  sopNumber: string;
  title: string;
  department: string;
  author: string;
  date: string;
  isoReference: string;
  purpose: string;
  scope: string;
  hazards: { category: string; description: string; riskLevel: 'Low' | 'Medium' | 'High' }[];
  ppe: string[];
  controls: string[];
  steps: { stepNo: number; instruction: string; complianceNote: string }[];
  section37Agreement: string;
}

const PRESET_ROUTINES = [
  {
    label: "Remote Developer & Desk Workstation Routine",
    text: "I sit at my home desk typing for 8 hours using dual 27-inch monitors. I tilt my neck forward to read text, sit in an unadjustable chair, and type without wrist rests."
  },
  {
    label: "Warehouse Logistics & Heavy Box Lifting Routine",
    text: "I manually lift 15kg to 25kg delivery boxes from ground pallets to high storage racks 40 times per shift. I bend at the waist repeatedly without back support."
  },
  {
    label: "Forecourt Driver & Fleet Vehicle Pre-Trip Checks",
    text: "I conduct a 15-minute visual walkaround inspect of fuel lines, tire pressure, and brake fluid before starting an 8-hour driving shift across provincial routes."
  }
];

export const SOPGenerator: React.FC = () => {
  const [userInput, setUserInput] = useState<string>(PRESET_ROUTINES[0].text);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [generatedSOP, setGeneratedSOP] = useState<SOPData>({
    sopNumber: "SOP-ISO45001-2026-0892",
    title: "Ergonomic Desk & Workstation Operation",
    department: "Distributed Workforce / Remote Operations",
    author: "Nelly Organic SOP Engine",
    date: new Date().toLocaleDateString('en-ZA'),
    isoReference: "ISO 45001:2018 Clause 8.1 / OHSA Act 85 Sec 8 & 37",
    purpose: "Establishes a standardized safe operating method for remote computer desk operations to mitigate repetitive strain injuries (RSI) and cervical spine degeneration.",
    scope: "Applies to all full-time and hybrid workers operating computer workstations.",
    hazards: [
      { category: "Ergonomic Strain", description: "Forward head posture causing cervical spinal torque up to 27kg force.", riskLevel: "High" },
      { category: "Repetitive Strain (RSI)", description: "Unsupported wrist extension leading to median nerve compression.", riskLevel: "Medium" },
      { category: "Visual & Cognitive Fatigue", description: "Continuous 3-hour glare exposure causing eye fatigue and focus degradation.", riskLevel: "Medium" }
    ],
    ppe: [
      "Ergonomic Lumbar Cushion Support",
      "Wrist Palm Rest (Gel/Memory Foam)",
      "Blue-Light Filter Lenses / Glare Guard"
    ],
    controls: [
      "Enforce mandatory 90-minute Smart Break & Micro-Stretch Nudges.",
      "Position top 1/3 of monitor at horizontal eye-level line.",
      "Maintain neutral 90-degree elbow and knee flex angles."
    ],
    steps: [
      { stepNo: 1, instruction: "Perform Pre-Login Cognitive & Ergonomic Handshake via ErgoSafe Reborn.", complianceNote: "OHS Sec 8 Compliance" },
      { stepNo: 2, instruction: "Adjust chair height until feet rest flat on floor with thigh parallel to floor.", complianceNote: "ISO 45001 Clause 6.1" },
      { stepNo: 3, instruction: "Position keyboard 10-15cm from desk edge to allow forearm support.", complianceNote: "Ergonomic Standard 2026" },
      { stepNo: 4, instruction: "Engage 3-minute guided stretch upon receiving 90-minute automated system nudge.", complianceNote: "Fatigue Mitigation Policy" }
    ],
    section37Agreement: "The employee acknowledges receipt of safe operating controls and agrees to follow prescribed micro-break protocols. Employer fulfills Section 37 duty of care."
  });

  const handleGenerateSOP = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Auto-parse conversational text into SOP structure
      const isLifting = userInput.toLowerCase().includes('lift') || userInput.toLowerCase().includes('box') || userInput.toLowerCase().includes('warehouse');
      const isFleet = userInput.toLowerCase().includes('fleet') || userInput.toLowerCase().includes('driv') || userInput.toLowerCase().includes('vehicle');

      if (isLifting) {
        setGeneratedSOP({
          sopNumber: `SOP-ISO45001-${Math.floor(1000 + Math.random() * 9000)}`,
          title: "Manual Material Handling & Rack Stacking Procedure",
          department: "Warehouse & Logistics Division",
          author: "Nelly Organic SOP Engine",
          date: new Date().toLocaleDateString('en-ZA'),
          isoReference: "ISO 45001:2018 Clause 8.1.2 / OHSA Act 85 Sec 8",
          purpose: "Defines ergonomic lifting mechanics to eliminate lumbar disc herniations and lower back injuries during manual material handling.",
          scope: "Mandatory for all warehouse staff handling loads exceeding 5kg.",
          hazards: [
            { category: "Lumbar Disc Compression", description: "Bending at waist with load exceeds 3400N spinal shear force threshold.", riskLevel: "High" },
            { category: "Pinch & Impact Risks", description: "Manual box placement near high rack edges.", riskLevel: "Medium" }
          ],
          ppe: [
            "ISO-Certified Steel-Toe Safety Boots",
            "High-Grip Anti-Slip Gloves",
            "Ergonomic Back Support Belt (Optional)"
          ],
          controls: [
            "Use squat-lift technique (bend knees, keep back straight, lift with legs).",
            "Enforce two-person team lifts for loads exceeding 20kg.",
            "Clear walkway debris prior to load transfer."
          ],
          steps: [
            { stepNo: 1, instruction: "Inspect box weight label and assess load stability before touch.", complianceNote: "Pre-Task Risk Audit" },
            { stepNo: 2, instruction: "Position feet shoulder-width apart, bend knees to 90 degrees.", complianceNote: "Biomechanical Safety" },
            { stepNo: 3, instruction: "Hold load close to chest center of gravity, avoiding torso twisting.", complianceNote: "ISO 45001 Lifting Code" },
            { stepNo: 4, instruction: "Log completion and rest 2 minutes after 10 continuous heavy lifts.", complianceNote: "Fatigue Gate Protocol" }
          ],
          section37Agreement: "Certified Section 37 agreement verified: Worker trained in biomechanical squat-lift mechanics."
        });
      } else if (isFleet) {
        setGeneratedSOP({
          sopNumber: `SOP-ISO45001-${Math.floor(1000 + Math.random() * 9000)}`,
          title: "Commercial Fleet Pre-Trip Inspection & Fatigue Handshake",
          department: "Fleet Operations & Transport Logistics",
          author: "Nelly Organic SOP Engine",
          date: new Date().toLocaleDateString('en-ZA'),
          isoReference: "ISO 45001 / National Road Traffic Act / OHSA Sec 38",
          purpose: "Ensures vehicle roadworthiness and driver alertness prior to dispatch.",
          scope: "Applies to all commercial drivers and logistics personnel.",
          hazards: [
            { category: "Driver Fatigue Impairment", description: "Shift duration > 4 hours increases reaction latency by 35%.", riskLevel: "High" },
            { category: "Mechanical Failure", description: "Unchecked tire inflation or brake fluid degradation during transit.", riskLevel: "High" }
          ],
          ppe: [
            "High-Visibility Reflective Vest",
            "High-Traction Work Boots",
            "Ergonomic Seat Lumbar Support Cushion"
          ],
          controls: [
            "Mandatory 15-minute vehicle walkaround checklist before key ignition.",
            "Enforce 10-minute walk break every 4 hours of continuous driving.",
            "Complete driver fatigue telemetry sync."
          ],
          steps: [
            { stepNo: 1, instruction: "Conduct visual walkaround checking tires, lights, and brake lines.", complianceNote: "Pre-Dispatch Inspection" },
            { stepNo: 2, instruction: "Complete ErgoSafe Driver Telemetry & Cognitive Baseline Handshake.", complianceNote: "Impairment Guard" },
            { stepNo: 3, instruction: "Adjust seat back angle to 100-110 degrees and mirror line of sight.", complianceNote: "Ergonomic Alignment" },
            { stepNo: 4, instruction: "Pull over safely for 10-minute stretch break upon 4-hour prompt.", complianceNote: "Road Safety Mandate" }
          ],
          section37Agreement: "Section 37 & Section 38 compliance logged: Driver authorized for shift with zero fatigue flag."
        });
      } else {
        // Standard Desk Routine
        setGeneratedSOP({
          sopNumber: `SOP-ISO45001-${Math.floor(1000 + Math.random() * 9000)}`,
          title: "Ergonomic Desk & Workstation Operation",
          department: "Distributed Workforces / Remote Operations",
          author: "Nelly Organic SOP Engine",
          date: new Date().toLocaleDateString('en-ZA'),
          isoReference: "ISO 45001:2018 Clause 8.1 / OHSA Act 85 Sec 8 & 37",
          purpose: "Establishes a standardized safe operating method for remote computer desk operations.",
          scope: "Applies to all full-time and hybrid workers operating computer workstations.",
          hazards: [
            { category: "Ergonomic Strain", description: "Forward head posture causing cervical spinal torque up to 27kg force.", riskLevel: "High" },
            { category: "Repetitive Strain (RSI)", description: "Unsupported wrist extension leading to median nerve compression.", riskLevel: "Medium" }
          ],
          ppe: [
            "Ergonomic Lumbar Cushion Support",
            "Wrist Palm Rest (Gel/Memory Foam)"
          ],
          controls: [
            "Enforce mandatory 90-minute Smart Break & Micro-Stretch Nudges.",
            "Position top 1/3 of monitor at horizontal eye-level line."
          ],
          steps: [
            { stepNo: 1, instruction: "Perform Pre-Login Cognitive & Ergonomic Handshake via ErgoSafe Reborn.", complianceNote: "OHS Sec 8 Compliance" },
            { stepNo: 2, instruction: "Adjust chair height until feet rest flat on floor.", complianceNote: "ISO 45001 Clause 6.1" },
            { stepNo: 3, instruction: "Engage 3-minute guided stretch upon receiving 90-minute automated system nudge.", complianceNote: "Fatigue Protocol" }
          ],
          section37Agreement: "The employee acknowledges receipt of safe operating controls. Employer fulfills Section 37 duty of care."
        });
      }
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = () => {
    const textToCopy = `=== ${generatedSOP.sopNumber}: ${generatedSOP.title} ===
Reference: ${generatedSOP.isoReference}
Date: ${generatedSOP.date}

PURPOSE:
${generatedSOP.purpose}

HAZARDS IDENTIFIED:
${generatedSOP.hazards.map(h => `- [${h.riskLevel} Risk] ${h.category}: ${h.description}`).join('\n')}

SAFE OPERATING STEPS:
${generatedSOP.steps.map(s => `${s.stepNo}. ${s.instruction} (${s.complianceNote})`).join('\n')}

SECTION 37 COMPLIANCE:
${generatedSOP.section37Agreement}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-ohs-navy via-slate-900 to-ohs-navy p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400">
                <FileText size={24} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                Organic SOP & <span className="text-purple-400">ISO 45001 Generator</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              Talk through or describe your daily worker routines in casual everyday language. Our real-time engine auto-formats it into an audit-ready ISO 45001 & OHS Act 85 Standard Operating Procedure!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1.5 rounded-xl">
              Audit-Ready Standard
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Conversational Input Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" /> Describe Daily Work Routine
              </h3>
              <span className="text-[10px] font-black bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                Zero-Prompt Input
              </span>
            </div>

            {/* Presets */}
            <div>
              <label className="text-xs text-gray-300 font-semibold mb-2 block">Quick Routine Presets</label>
              <div className="space-y-2">
                {PRESET_ROUTINES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserInput(preset.text)}
                    className="w-full text-left p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-400/40 text-xs text-gray-200 transition-all cursor-pointer"
                  >
                    <p className="font-bold text-purple-300">{preset.label}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{preset.text}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div>
              <label className="text-xs text-gray-300 font-semibold mb-1.5 block">Worker Routine Description</label>
              <textarea
                rows={5}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Explain what you do during your shift in simple words..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors scrollbar-thin"
              />
            </div>

            <button
              onClick={handleGenerateSOP}
              disabled={isGenerating || !userInput.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <><RefreshCw size={16} className="animate-spin" /> Formatting ISO 45001 SOP...</>
              ) : (
                <><Sparkles size={16} /> Auto-Generate Audit SOP</>
              )}
            </button>
          </div>
        </div>

        {/* Right: Live Formatted SOP Document Preview */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Header Action Bar */}
          <div className="bg-slate-950/80 border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck size={18} className="text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                ISO 45001 / OHS Act 85 Audit SOP Document
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Copy SOP Text"
              >
                <Copy size={14} /> {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-xs font-bold text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Print or Export PDF"
              >
                <Printer size={14} /> Print / Export PDF
              </button>
            </div>
          </div>

          {/* SOP Content Sheet */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[600px] scrollbar-thin text-slate-100">
            {/* Document Control Header */}
            <div className="border border-purple-500/30 bg-purple-500/5 rounded-xl p-4 space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-purple-500/20 pb-2">
                <span className="text-xs font-mono font-bold text-purple-300">{generatedSOP.sopNumber}</span>
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Status: Approved & Encrypted
                </span>
              </div>
              <h1 className="text-lg font-black text-white">{generatedSOP.title}</h1>
              <div className="grid grid-cols-2 text-[11px] text-gray-400 gap-1 pt-1">
                <p><span className="font-semibold text-gray-300">Department:</span> {generatedSOP.department}</p>
                <p><span className="font-semibold text-gray-300">Effective Date:</span> {generatedSOP.date}</p>
                <p className="col-span-2"><span className="font-semibold text-gray-300">Statutory Ref:</span> {generatedSOP.isoReference}</p>
              </div>
            </div>

            {/* Purpose & Scope */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">1. Purpose & Operational Scope</h4>
              <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                {generatedSOP.purpose}
              </p>
            </div>

            {/* Hazards Identification */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">2. Hazard Identification & Risk Assessment (HIRA)</h4>
              <div className="space-y-2">
                {generatedSOP.hazards.map((h, i) => (
                  <div key={i} className="flex items-start justify-between bg-white/5 p-3 rounded-xl border border-white/5 gap-3">
                    <div>
                      <span className="text-xs font-bold text-white block">{h.category}</span>
                      <p className="text-[11px] text-gray-300 mt-0.5">{h.description}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      h.riskLevel === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {h.riskLevel} Risk
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PPE & Control Measures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">3. Mandatory Controls / PPE</h4>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {generatedSOP.ppe.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">4. Administrative Mitigations</h4>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {generatedSOP.controls.map((c, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <Shield size={14} className="text-cyan-400 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step-by-Step Safe Working Procedures */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">5. Safe Operating Procedure Steps</h4>
              <div className="space-y-2">
                {generatedSOP.steps.map(step => (
                  <div key={step.stepNo} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step.stepNo}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-100 font-medium">{step.instruction}</p>
                      <span className="text-[10px] text-purple-400 font-mono block mt-1">
                        Compliance Checkpoint: {step.complianceNote}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Compliance Footer */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <UserCheck size={16} /> Section 37/38 Vicarious Liability Audit Sign-off
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                {generatedSOP.section37Agreement}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOPGenerator;
