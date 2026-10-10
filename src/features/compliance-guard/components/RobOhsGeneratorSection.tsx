"use client";

import React, { useState, useEffect } from "react";
import { RobAvatar } from "./RobAvatar";
import { classifyBusinessAndGenerateFile } from "@/lib/ohs-generator/ohs-templates";
import { generateUniversalOhsFile, UNIVERSAL_SECTOR_CATALOG } from "@/lib/ohs-generator/universal-engine";

export function RobOhsGeneratorSection() {
  const [inputText, setInputText] = useState("Wimpy Southgate Mall");
  const [businessName, setBusinessName] = useState("Wimpy Southgate Mall");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [generatedFile, setGeneratedFile] = useState<any | null>(null);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyStep, setAssemblyStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [activeFileTab, setActiveFileTab] = useState<"overview" | "appointments" | "hira" | "sops" | "checklists" | "invoice">("overview");
  
  // Payment states
  const [isPaid, setIsPaid] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Initial generation on load
  useEffect(() => {
    const initial = generateUniversalOhsFile("Wimpy Southgate Mall", "Wimpy Southgate Mall");
    setGeneratedFile(initial);
  }, []);

  // Text-To-Speech with Rob's gentleman voice
  const speakAsRob = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 0.92;
    utterance.lang = "en-GB";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } else {
      const greeting = `Good day! I am Rob, your OHS AI assistant. Tell me about your business operations in any sector, like Wimpy Southgate, Roman's Pizza, Astron Energy, or Amampondo Pharmacy, and I will assemble your statutory South African OHS compliance pack!`;
      speakAsRob(greeting);
    }
  };

  // Mic speech recognition
  const handleMicListen = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your business name.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-ZA";

      recognition.onstart = () => setIsListeningMic(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setBusinessName(transcript);
        setIsListeningMic(false);
        handleGenerate(transcript);
      };
      recognition.onerror = () => setIsListeningMic(false);
      recognition.onend = () => setIsListeningMic(false);

      recognition.start();
    } catch {
      setIsListeningMic(false);
    }
  };

  const handleGenerate = (customQuery?: string) => {
    const query = customQuery || inputText;
    if (!query.trim()) return;

    setIsAssembling(true);
    setIsPaid(false);
    setAssemblyStep(1);

    setTimeout(() => setAssemblyStep(2), 350);
    setTimeout(() => setAssemblyStep(3), 750);
    setTimeout(() => setAssemblyStep(4), 1150);
    setTimeout(() => {
      // Use Universal Synthesizer
      const file = generateUniversalOhsFile(query, businessName || query);
      setGeneratedFile(file);
      setIsAssembling(false);
      setAssemblyStep(0);

      speakAsRob(`Your complete OHS Safety File for ${file.businessName} is ready! It includes all statutory appointment letters, Baseline HIRA, and safe operating procedures.`);
    }, 1500);
  };

  const handlePresetClick = (preset: string) => {
    setInputText(preset);
    setBusinessName(preset);
    handleGenerate(preset);
  };

  const handleSimulatePayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setIsPaid(true);
      speakAsRob(`Payment received. Your statutory OHS Safety file for ${generatedFile?.businessName} is now unlocked.`);
    }, 1100);
  };

  // Download complete statutory safety file
  const handleDownloadSafetyFile = () => {
    if (!generatedFile) return;

    const sector = generatedFile.sector;
    const fileContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>STATUTORY OHS SAFETY FILE - ${generatedFile.businessName}</title>
<style>
  @page { size: A4 portrait; margin: 15mm 15mm 15mm 15mm; }
  @media print {
    .no-print { display: none !important; }
    .page-break { page-break-after: always; break-after: page; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111; background: #fff; margin: 0; padding: 20px; font-size: 11px; line-height: 1.45; }
  .sheet { max-width: 210mm; margin: 0 auto 30px auto; padding: 25px; border: 1px solid #d1d5db; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  .header { text-align: center; border-bottom: 3px solid #b91c1c; padding-bottom: 12px; margin-bottom: 20px; }
  .header h1 { margin: 0; font-size: 20px; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.5px; }
  .header h2 { margin: 4px 0 0 0; font-size: 12px; color: #374151; font-weight: normal; }
  h3 { color: #0b1c2e; font-size: 13px; margin: 16px 0 8px 0; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 16px 0; font-size: 10px; }
  th { background: #0b1c2e; color: #fff; font-weight: 600; padding: 7px 8px; border: 1px solid #1f2937; text-align: left; }
  td { padding: 6px 8px; border: 1px solid #d1d5db; vertical-align: top; }
  tr:nth-child(even) td { background: #f9fafb; }
  .tag { display: inline-block; padding: 3px 8px; background: #fee2e2; color: #991b1b; font-weight: 700; border-radius: 4px; font-size: 9px; margin-bottom: 8px; }
  .badge-shield { display: inline-block; padding: 4px 10px; background: #ecfdf5; color: #065f46; font-weight: 700; border: 1px solid #a7f3d0; border-radius: 4px; font-size: 10px; }
  .sign-box { border: 1px solid #d1d5db; background: #f9fafb; padding: 12px; margin-top: 25px; display: flex; justify-content: space-between; font-size: 10px; }
  .btn-print { position: fixed; top: 15px; right: 15px; background: #b91c1c; color: #fff; padding: 10px 20px; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
</style>
</head>
<body>

<button class="btn-print no-print" onclick="window.print()">🖨️ Print / Save Lever-Arch PDF</button>

<!-- ────────────────── PAGE 1: COVER & MANDATE ────────────────── -->
<div class="sheet">
  <div class="header">
    <div class="tag">REPUBLIC OF SOUTH AFRICA • STATUTORY COMPLIANCE FILE</div>
    <h1>${generatedFile.businessName}</h1>
    <h2>Occupational Health and Safety Act (Act 85 of 1993) Statutory Compliance Master File</h2>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <div class="badge-shield">🛡️ 100% AUDIT-SHIELDED • DEPARTMENT OF EMPLOYMENT & LABOUR READY</div>
    <p style="margin-top: 15px; font-size: 12px; color: #4b5563;">
      <strong>File Reference:</strong> ${generatedFile.fileId} &nbsp;|&nbsp; 
      <strong>Compilation Date:</strong> ${generatedFile.creationDate} &nbsp;|&nbsp; 
      <strong>Annual Review Date:</strong> 1 Year from Issue
    </p>
  </div>

  <h3>1. Company & Facility Scope</h3>
  <table>
    <tr><th style="width: 25%;">Trading Name</th><td><strong>${generatedFile.businessName}</strong></td></tr>
    <tr><th>Sector / Operations</th><td>${generatedFile.industry}</td></tr>
    <tr><th>Legislative Framework</th><td>${sector.applicableActs.join(" • ")}</td></tr>
    <tr><th>Lead Safety Consultant</th><td><strong>${generatedFile.consultant.name}</strong> (Practice: ${generatedFile.consultant.practiceAddress})</td></tr>
    <tr><th>Consultant Contact</th><td>Direct Tel: <strong>${generatedFile.consultant.phone}</strong> &nbsp;|&nbsp; Email: ${generatedFile.consultant.email}</td></tr>
    <tr><th>Professional Accreditation</th><td>${generatedFile.consultant.accreditation}</td></tr>
  </table>

  <h3>2. Master OHS Policy Statement (OHS Act Section 7 & 8)</h3>
  <p>
    Management is firmly committed to ensuring the health, safety, and physical well-being of all employees, contractors, and visitors. 
    It is our statutory duty of care to identify workplace hazards, enforce mandatory Personal Protective Equipment (PPE), 
    maintain certified electrical and gas installations, and implement continuous risk mitigation in strict adherence to the Occupational Health and Safety Act 85 of 1993.
  </p>

  <div class="sign-box">
    <div>
      <strong>Appointed Section 16(2) Executive:</strong> ___________________________<br/>
      <strong>Signature:</strong> ___________________________<br/>
      <strong>Date:</strong> ___________________________
    </div>
    <div>
      <strong>Certified Lead OHS Consultant:</strong> <strong>${generatedFile.consultant.name}</strong><br/>
      <strong>Direct Phone:</strong> ${generatedFile.consultant.phone}<br/>
      <strong>Stamp / Seal:</strong> [CERTIFIED COMPLIANT]
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- ────────────────── PAGE 2: STATUTORY APPOINTMENTS ────────────────── -->
<div class="sheet">
  <div class="header">
    <h1>${generatedFile.businessName}</h1>
    <h2>Statutory Legal Appointments in Terms of OHS Act 85 of 1993</h2>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 28%;">Appointment Designation</th>
        <th style="width: 18%;">Legal Clause</th>
        <th style="width: 14%;">Certified Ratio</th>
        <th style="width: 40%;">Core Responsibilities & Powers</th>
      </tr>
    </thead>
    <tbody>
      ${sector.statutoryAppointments.map((app: any) => `
        <tr>
          <td><strong>${app.title}</strong></td>
          <td style="font-family: monospace; color: #b91c1c;">${app.section}</td>
          <td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 3px; font-size: 9px;">${app.certifiedRatio}</span></td>
          <td>${app.responsibilities}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- ────────────────── PAGE 3: BASELINE HIRA RISK ASSESSMENT ────────────────── -->
<div class="sheet">
  <div class="header">
    <h1>${generatedFile.businessName}</h1>
    <h2>Baseline Hazard Identification & Risk Assessment (HIRA)</h2>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Activity / Machine</th>
        <th style="width: 30%;">Inherent Operational Hazard</th>
        <th style="width: 10%;">Risk</th>
        <th style="width: 38%;">Mandatory Controls & Mitigation</th>
      </tr>
    </thead>
    <tbody>
      ${sector.primaryHazards.map((h: any) => `
        <tr>
          <td><strong>${h.activity}</strong></td>
          <td>${h.hazard}</td>
          <td><strong style="color: ${h.riskLevel === 'High' ? '#b91c1c' : '#d97706'};">${h.riskLevel}</strong></td>
          <td>${h.mitigation}<br/><small style="color: #6b7280; font-family: monospace;">[${h.isoClause}]</small></td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- ────────────────── PAGE 4: SAFE OPERATING PROCEDURES ────────────────── -->
<div class="sheet">
  <div class="header">
    <h1>${generatedFile.businessName}</h1>
    <h2>Mandatory Safe Operating Procedures (SOPs)</h2>
  </div>

  ${sector.sops.map((sop: any) => `
    <div style="margin-bottom: 22px;">
      <h3 style="color: #b91c1c; border-bottom: 1px solid #d1d5db; padding-bottom: 3px;">
        ${sop.code}: ${sop.title}
      </h3>
      <p style="font-style: italic; color: #4b5563; margin: 4px 0;">${sop.purpose}</p>
      <p style="margin: 4px 0;"><strong>Mandatory PPE:</strong> ${sop.ppeRequired.join(" • ")}</p>
      <ol style="margin: 4px 0 8px 18px; padding: 0;">
        ${sop.steps.map((st: string) => `<li style="margin-bottom: 2px;">${st}</li>`).join("")}
      </ol>
    </div>
  `).join("")}
</div>

<div class="page-break"></div>

<!-- ────────────────── PAGE 5: STATUTORY LOGS & INVOICE ────────────────── -->
<div class="sheet">
  <div class="header">
    <h1>${generatedFile.businessName}</h1>
    <h2>Statutory Inspection Registers & Official Tax Invoice</h2>
  </div>

  <h3>1. Inspection Registers Included in Physical Binder</h3>
  <ul>
    ${sector.checklists.map((chk: string) => `<li><strong>${chk}</strong> — Mandatory regular execution</li>`).join("")}
  </ul>

  <h3>2. Official Tax Invoice</h3>
  <table>
    <tr><th>Consultant</th><td><strong>${generatedFile.consultant.name}</strong> (${generatedFile.consultant.title})</td></tr>
    <tr><th>Address & Contact</th><td>${generatedFile.consultant.practiceAddress} &nbsp;|&nbsp; Tel: <strong>${generatedFile.consultant.phone}</strong></td></tr>
    <tr><th>Billed Client</th><td>${generatedFile.businessName} &nbsp;(${generatedFile.industry})</td></tr>
    <tr><th>Invoice Number</th><td>INV-${generatedFile.fileId.replace("OHS-", "")} &nbsp;|&nbsp; Date: ${generatedFile.creationDate}</td></tr>
    <tr><th>Scope of Work</th><td>Complete Statutory OHS Safety File Compilation, Baseline HIRA & DEL Audit Shield</td></tr>
    <tr><th>Total Amount</th><td><strong style="font-size: 14px; color: #047857;">R3 500,00 ZAR</strong> (Paid in Full / COD Certified)</td></tr>
  </table>

  <div style="margin-top: 35px; border-top: 2px solid #0b1c2e; padding-top: 10px; font-size: 10px; color: #6b7280; text-align: center;">
    Compiled by ComplianceGuard AI (ErgoSMS Engine) • Statutory OHS Compliance Platform.
  </div>
</div>

</body>
</html>`;

    const blob = new Blob([fileContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `STATUTORY_OHS_FILE_${generatedFile.businessName.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download official text invoice
  const handleDownloadInvoice = () => {
    if (!generatedFile) return;

    const invoiceContent = `================================================================================
TAX INVOICE — OHS COMPLIANCE CONSULTING
================================================================================
Consultant:      ${generatedFile.consultant.name}
Title:           ${generatedFile.consultant.title}
Address:         ${generatedFile.consultant.practiceAddress}
Contact Phone:   ${generatedFile.consultant.phone}
Email:           ${generatedFile.consultant.email}
Accreditation:   ${generatedFile.consultant.accreditation}
--------------------------------------------------------------------------------
Invoice No:      INV-${generatedFile.fileId.replace("OHS-", "")}
Date:            ${generatedFile.creationDate}
Terms:           COD / Paid in Full

BILL TO:
Client:          ${generatedFile.businessName}
Industry:        ${generatedFile.industry}
Category:        ${generatedFile.category}
--------------------------------------------------------------------------------
SKU   DESCRIPTION                                                      TOTAL (ZAR)
--------------------------------------------------------------------------------
1     Complete Statutory OHS Safety File Compilation                   R3 500,00
      - Baseline HIRA (Hazard Identification & Risk Assessment)
      - Statutory Appointments (§16.2, §17 Reps, First Aid GSR 3)
      - Safe Operating Procedures (SOPs) & Checklists
      - Department of Employment & Labour (DEL) Audit Shield
--------------------------------------------------------------------------------
Subtotal:                                                              R3 500,00
VAT (0% Direct Consulting):                                            R0,00
TOTAL PAID:                                                            R3 500,00
BALANCE DUE:                                                           R0,00
================================================================================
Payment Status: PAID IN FULL & VERIFIED
Consultant Signature: [Pending Human Reviewer Verification]
================================================================================`;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `INVOICE_${generatedFile.businessName.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ────────────────── TOP ROB HERO BANNER ────────────────── */}
      <div className="glass p-5 sm:p-7 border-l-4 border-l-brand-500 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="shrink-0">
              <RobAvatar
                size="lg"
                isSpeaking={isSpeaking}
                onClick={handleSpeechToggle}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-xs font-semibold border-brand-500/20">
                  ROB — OHS AI Assistant
                </span>
                <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold border-emerald-500/20">
                  ● Multi-Sector Engine Online
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-ink mt-1">
                Universal OHS Safety File Generator &amp; Cleanup Engine
              </h1>

              <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
                Describe <strong className="text-ink">any business or operation</strong> in South Africa (e.g. food franchises, pharmacies, filling stations, wholesale, manufacturing, or commercial offices). Rob automatically normalizes the operational risks and generates a completed statutory OHS safety file ready to pay and download!
              </p>

              {/* AI Disclosure Label */}
              <div className="mt-2.5 p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-[11px] text-amber-700 dark:text-amber-300 font-mono">
                <strong>AI Disclosure:</strong> ROB is an AI assistant, not a human consultant. Answers are limited to the cited provisions and are not legal advice.
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSpeechToggle}
              className={`btn flex-1 sm:flex-none text-xs py-2.5 px-4 flex items-center justify-center gap-2 ${
                isSpeaking ? "bg-amber-500 text-slate-950 font-bold" : "btn-secondary"
              }`}
            >
              <span>{isSpeaking ? "Mute Rob" : "🔊 Listen to Rob"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────── INPUT SECTION: DESCRIBE BUSINESS ────────────────── */}
      <div className="glass p-5 sm:p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted font-mono mb-1.5">
            Describe Any Business Operations, Trade Name or Branch
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setBusinessName(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="e.g. Wimpy Southgate, Roman's Pizza Ormonde, Astron Energy Fairlands, Amampondo Pharmacy, Century Crown Wholesale, JAD Doors..."
                className="w-full rounded-xl border border-line bg-surface-strong px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleMicListen}
                title="Speak using microphone"
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted hover:text-ink transition ${
                  isListeningMic ? "bg-red-500/20 text-red-500 animate-pulse" : "hover:bg-line/50"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={isAssembling}
              className="btn-primary text-xs py-3 px-6 shrink-0 flex items-center justify-center gap-2 font-semibold shadow-md shadow-brand-500/20"
            >
              {isAssembling ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing File...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate OHS Safety File</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Industry Presets */}
        <div className="pt-2">
          <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-2">
            1-Click South African Industry Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Wimpy Southgate Mall", emoji: "🍔", cat: "Food" },
              { label: "Mochachos Ormonde", emoji: "🍗", cat: "Food" },
              { label: "Roman's Pizza Ormonde", emoji: "🍕", cat: "Food" },
              { label: "Simply Asia Greenside", emoji: "🍜", cat: "Food" },
              { label: "Astron Energy Fairlands", emoji: "⛽", cat: "Fuel" },
              { label: "BP Randfontein Service Station", emoji: "⛽", cat: "Fuel" },
              { label: "Amampondo Community Pharmacy", emoji: "💊", cat: "Pharmacy" },
              { label: "Century Crown Wholesale", emoji: "📦", cat: "Wholesale" },
              { label: "JAD Doors & Manufacturing", emoji: "⚙️", cat: "Factory" },
              { label: "Securi-Tek Armed Guarding", emoji: "🛡️", cat: "Security" },
              { label: "La Bakery & Confectionery", emoji: "🥖", cat: "Bakery" },
              { label: "Corporate Head Office", emoji: "🏢", cat: "Office" },
            ].map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePresetClick(preset.label)}
                className="chip border-line bg-surface hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-400 text-xs py-1.5 px-3 transition flex items-center gap-1.5"
              >
                <span>{preset.emoji}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Assembly In-Flight Sequence */}
        {isAssembling && (
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
              <span>ROB IS CLEANING UP DATA &amp; COMPILING GENERIC STATUTORY FILE...</span>
            </div>
            <div className="space-y-1.5 text-xs text-muted font-mono">
              <div className={`flex items-center gap-2 ${assemblyStep >= 1 ? "text-ink font-medium" : "opacity-40"}`}>
                <span>{assemblyStep >= 1 ? "✓" : "○"}</span>
                <span>Normalizing physical operational scope, machine risks &amp; floor layout...</span>
              </div>
              <div className={`flex items-center gap-2 ${assemblyStep >= 2 ? "text-ink font-medium" : "opacity-40"}`}>
                <span>{assemblyStep >= 2 ? "✓" : "○"}</span>
                <span>Drafting statutory legal appointments (§16.2, §17 H&amp;S Reps, GSR 3 First Aid)...</span>
              </div>
              <div className={`flex items-center gap-2 ${assemblyStep >= 3 ? "text-ink font-medium" : "opacity-40"}`}>
                <span>{assemblyStep >= 3 ? "✓" : "○"}</span>
                <span>Synthesizing Baseline HIRA risk matrix &amp; Safe Operating Procedures (SOPs)...</span>
              </div>
              <div className={`flex items-center gap-2 ${assemblyStep >= 4 ? "text-emerald-500 font-bold" : "opacity-40"}`}>
                <span>{assemblyStep >= 4 ? "✓" : "○"}</span>
                <span>Locking 100% Department of Labour (DEL) Audit Shield compliance!</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ────────────────── GENERATED SAFETY FILE DISPLAY & CHECKOUT ────────────────── */}
      {generatedFile && !isAssembling && (
        <div className="glass p-5 sm:p-7 space-y-6">
          {/* File Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-line">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                  {generatedFile.fileId}
                </span>
                <span className="text-muted">•</span>
                <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold">
                  DEL AUDIT SHIELD: {generatedFile.statutoryAuditShieldScore}%
                </span>
                <span className="chip border-line bg-surface-strong font-mono text-[10px]">
                  {generatedFile.creationDate}
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mt-1">
                {generatedFile.businessName}
              </h2>

              <p className="text-xs text-muted font-mono mt-0.5">
                {generatedFile.industry} • Sector: {generatedFile.category}
              </p>
            </div>

            {/* Price Fee & Instant Unlock Call-To-Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-surface-strong/70 p-3.5 rounded-xl border border-line">
              <div>
                <span className="text-[10px] font-mono uppercase text-muted tracking-wider block">
                  Statutory Consulting Fee
                </span>
                <div className="font-display text-2xl font-bold text-ink">
                  R{generatedFile.totalPayableZAR.toLocaleString()}
                  <span className="text-xs font-normal text-muted ml-1">ZAR</span>
                </div>
              </div>

              {!isPaid ? (
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={paymentProcessing}
                  className="btn-primary text-xs py-2.5 px-4 font-semibold shadow-md shadow-brand-500/25 flex items-center gap-2 whitespace-nowrap"
                >
                  {paymentProcessing ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying EFT...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Pay Fee &amp; Download File</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="chip bg-emerald-500 text-white font-mono text-xs font-bold py-1 px-2.5">
                    ✓ UNLOCKED &amp; PAID
                  </span>
                  <button
                    type="button"
                    onClick={handleDownloadSafetyFile}
                    className="btn-primary text-xs py-2 px-3 font-semibold flex items-center gap-1.5"
                  >
                    <span>Download File</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Sub-Tabs for File Contents */}
          <div className="flex flex-wrap gap-2 border-b border-line pb-3">
            {[
              { id: "overview", label: "Legal Profile" },
              { id: "appointments", label: "Statutory Appointments" },
              { id: "hira", label: "Baseline HIRA" },
              { id: "sops", label: "Safe Operating Procedures (SOPs)" },
              { id: "checklists", label: "Registers & Checklists" },
              { id: "invoice", label: "Consultant Invoice" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFileTab(tab.id as any)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeFileTab === tab.id
                    ? "bg-brand-500 text-white shadow-xs"
                    : "text-muted hover:text-ink hover:bg-surface-strong"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ────────────────── SUB-TAB: OVERVIEW ────────────────── */}
          {activeFileTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-line bg-surface p-4 space-y-3">
                  <div className="text-xs font-mono font-semibold uppercase text-brand-600 dark:text-brand-400">
                    Applicable South African Legislation
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted font-mono">
                    {generatedFile.sector.applicableActs.map((leg: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{leg}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-line bg-surface p-4 space-y-3">
                  <div className="text-xs font-mono font-semibold uppercase text-brand-600 dark:text-brand-400">
                    Certified Lead Consultant Accreditation
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-line/60 pb-1.5">
                      <span className="text-muted">Lead Consultant:</span>
                      <span className="font-semibold text-ink">{generatedFile.consultant.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-line/60 pb-1.5">
                      <span className="text-muted">Direct Contact:</span>
                      <a href="tel:0622655708" className="font-mono font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                        {generatedFile.consultant.phone}
                      </a>
                    </div>
                    <div className="flex justify-between border-b border-line/60 pb-1.5">
                      <span className="text-muted">Email:</span>
                      <span className="font-mono text-ink">{generatedFile.consultant.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-line/60 pb-1.5">
                      <span className="text-muted">Practice Address:</span>
                      <span className="text-ink">{generatedFile.consultant.practiceAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Accreditation:</span>
                      <span className="font-semibold text-emerald-500">{generatedFile.consultant.accreditation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Quick Actions */}
              <div className="rounded-xl border border-line bg-surface-strong/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-muted">
                  <strong className="text-ink">Red Lever-Arch Binder Ready:</strong> Formatted to Department of Employment &amp; Labour (DEL) inspectorate standards.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadSafetyFile}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                  >
                    <span>Download File HTML</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadInvoice}
                    className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
                  >
                    <span>Download Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── SUB-TAB: APPOINTMENTS ────────────────── */}
          {activeFileTab === "appointments" && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-strong text-muted uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Appointment Title</th>
                      <th className="py-3 px-4">Statutory Section</th>
                      <th className="py-3 px-4">Certified Ratio</th>
                      <th className="py-3 px-4">Mandate &amp; Responsibilities</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {generatedFile.sector.statutoryAppointments.map((app: any, i: number) => (
                      <tr key={i} className="hover:bg-surface/50">
                        <td className="py-3 px-4 font-semibold text-ink">{app.title}</td>
                        <td className="py-3 px-4 font-mono text-brand-600 dark:text-brand-400">{app.section}</td>
                        <td className="py-3 px-4">
                          <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                            {app.certifiedRatio}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted">{app.responsibilities}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ────────────────── SUB-TAB: BASELINE HIRA ────────────────── */}
          {activeFileTab === "hira" && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-strong text-muted uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Operational Activity</th>
                      <th className="py-3 px-4">Identified Hazard &amp; Severity</th>
                      <th className="py-3 px-4">Risk Level</th>
                      <th className="py-3 px-4">Hierarchy of Controls &amp; Mitigation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {generatedFile.sector.primaryHazards.map((h: any, i: number) => (
                      <tr key={i} className="hover:bg-surface/50">
                        <td className="py-3 px-4 font-medium text-ink">{h.activity}</td>
                        <td className="py-3 px-4 text-muted">{h.hazard}</td>
                        <td className="py-3 px-4">
                          <span className={`chip font-mono text-[10px] font-bold ${
                            h.riskLevel === "High" ? "bg-red-500/10 text-red-500 border-red-500/30" : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          }`}>
                            {h.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-ink font-mono text-[11px]">{h.mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ────────────────── SUB-TAB: SOPS ────────────────── */}
          {activeFileTab === "sops" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {generatedFile.sector.sops.map((sop: any, i: number) => (
                  <div key={i} className="rounded-xl border border-line bg-surface p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-2">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-brand-600 dark:text-brand-400">
                          {sop.code}
                        </span>
                        <h4 className="font-display text-sm font-bold text-ink">{sop.title}</h4>
                      </div>
                      <span className="chip border-line bg-surface-strong text-[10px] font-mono">
                        Standard Operating Procedure
                      </span>
                    </div>

                    <p className="text-xs text-muted italic">{sop.purpose}</p>

                    <div>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1">
                        Mandatory PPE:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sop.ppeRequired.map((ppe: string, idx: number) => (
                          <span key={idx} className="chip border-line bg-surface-strong/70 text-[10px]">
                            {ppe}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1">
                        Sequential Safety Instructions:
                      </span>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-ink/90 font-mono">
                        {sop.steps.map((step: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ────────────────── SUB-TAB: CHECKLISTS ────────────────── */}
          {activeFileTab === "checklists" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
                  <div className="text-xs font-mono font-semibold uppercase text-brand-600 dark:text-brand-400">
                    Statutory Inspection Registers Included
                  </div>
                  <ul className="space-y-2 text-xs text-muted font-mono">
                    {generatedFile.sector.checklists.map((chk: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span className="text-ink">{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
                  <div className="text-xs font-mono font-semibold uppercase text-brand-600 dark:text-brand-400">
                    Accredited Staff Training Modules
                  </div>
                  <ul className="space-y-2 text-xs text-muted font-mono">
                    {generatedFile.sector.trainingModules.map((tm: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-brand-500 font-bold">●</span>
                        <span className="text-ink">{tm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── SUB-TAB: INVOICE ────────────────── */}
          {activeFileTab === "invoice" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-line bg-surface-strong/60 p-5 space-y-4 font-mono text-xs max-w-2xl mx-auto">
                <div className="flex justify-between items-start border-b border-line pb-3">
                  <div>
                    <div className="font-bold text-sm text-ink">{generatedFile.consultant.name}</div>
                    <div className="text-muted">{generatedFile.consultant.title}</div>
                    <div className="text-muted">{generatedFile.consultant.practiceAddress}</div>
                    <div className="text-brand-600 dark:text-brand-400 font-bold pt-1">
                      Tel: {generatedFile.consultant.phone}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="chip bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20 font-bold">
                      TAX INVOICE
                    </div>
                    <div className="text-muted pt-1">Inv Date: {generatedFile.creationDate}</div>
                    <div className="text-muted">Ref: {generatedFile.fileId}</div>
                  </div>
                </div>

                <div className="border-b border-line pb-3">
                  <div className="text-[10px] uppercase text-muted">Bill To:</div>
                  <div className="font-bold text-ink">{generatedFile.businessName}</div>
                  <div className="text-muted">{generatedFile.industry}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-bold border-b border-line pb-1 text-ink">
                    <span>Description</span>
                    <span>Total (ZAR)</span>
                  </div>
                  <div className="flex justify-between text-ink">
                    <span>Statutory OHS Safety File Compilation &amp; DEL Shield</span>
                    <span>R3 500,00</span>
                  </div>
                  <div className="flex justify-between text-muted text-[11px] pt-1 border-t border-line">
                    <span>VAT (0% Direct Consulting):</span>
                    <span>R0,00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t-2 border-line">
                    <span>TOTAL PAYABLE:</span>
                    <span className="text-brand-600 dark:text-brand-400">R3 500,00</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className={`chip text-xs font-bold ${isPaid ? "bg-emerald-500 text-white" : "bg-amber-500/10 text-amber-500 border-amber-500/30"}`}>
                    {isPaid ? "✓ PAID IN FULL" : "STATUS: UNPAID (COD)"}
                  </span>

                  <div className="flex items-center gap-2">
                    {!isPaid ? (
                      <button
                        type="button"
                        onClick={handleSimulatePayment}
                        className="btn-primary text-xs py-2 px-4 font-semibold"
                      >
                        Pay R3,500 Now
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDownloadInvoice}
                        className="btn-secondary text-xs py-2 px-3"
                      >
                        Download Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── BOTTOM DOWNLOAD CTA BAR ────────────────── */}
          <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted text-center sm:text-left">
              Statutory documents require on-site validation by a registered OHS practitioner before DEL audit submission.
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadSafetyFile}
                className="btn-primary text-xs py-2.5 px-4 font-semibold flex items-center gap-2 shadow-md shadow-brand-500/20"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Lever-Arch OHS File (.HTML)</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="btn-secondary text-xs py-2.5 px-4 font-semibold flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
