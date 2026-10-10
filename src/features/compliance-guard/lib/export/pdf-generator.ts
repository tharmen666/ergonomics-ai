import { PDFDocument, rgb, StandardFonts, PDFPage, degrees } from 'pdf-lib';
import { DocumentStateModel, verifySeal } from '@/lib/compliance/document-state';
import { getEnv } from '@/lib/env';

export interface ComplianceManualOptions {
  businessName: string;
  category?: string;
  docId?: string;
  issueDate?: string;
  location?: string;
  content?: {
    summary?: string;
    statutoryCitations?: string[];
    obligations?: Array<{
      citationId: string;
      provision: string;
      requirement: string;
      evidence?: string[];
    }>;
    consultantActions?: string[];
  };
}

export interface GeneratedPdfResult {
  pdfBytes: Uint8Array;
  buffer: Buffer;
  pageCount: number;
  issueDate: string;
  seal: string;
}

/**
 * Strips characters outside of WinAnsi (standard ISO-8859-1) to prevent pdf-lib encoding crashes.
 */
function sanitizeWinAnsi(text: string): string {
  return text.replace(/[^\x20-\x7E\r\n\t]/g, ' ');
}

/**
 * Renders an official, legally compliant statutory OHS compliance manual.
 * STRICT ENFORCEMENT:
 * - Throws immediately unless document is signed_verified or delivered.
 * - Throws immediately if reviewer credentials, registration number, or verification date are missing.
 * - Throws immediately if HMAC seal fails verifySeal(docState).
 * - Never uses fake fallback reviewer names ('Rob', 'Chief OHS Guru', fake reg numbers).
 * - No personal attribution or unauthorized contact numbers.
 */
export async function generateComplianceManualPdf(
  docState: DocumentStateModel,
  options: ComplianceManualOptions
): Promise<GeneratedPdfResult> {
  // 1. Strict status check
  if (docState.status !== 'signed_verified' && docState.status !== 'delivered') {
    throw new Error(`Export Denied: Document must be signed_verified or delivered to generate export (current status: ${docState.status})`);
  }

  // 2. Strict reviewer credentials check (no fallback values allowed)
  if (!docState.reviewerName || !docState.reviewerBody || !docState.reviewerRegNo || !docState.verifiedOn || !docState.seal) {
    throw new Error('Export Denied: Complete reviewer credentials (name, professional body, registration number, verification date, and seal) are strictly required.');
  }

  // 3. Strict cryptographic seal verification
  if (!verifySeal(docState)) {
    throw new Error('Export Denied: Cryptographic seal verification failed. The document snapshot or reviewer credentials have been tampered with.');
  }

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const navy = rgb(0.08, 0.16, 0.32);
  const darkGray = rgb(0.15, 0.15, 0.15);
  const mediumGray = rgb(0.45, 0.45, 0.45);
  const lightBg = rgb(0.96, 0.97, 0.99);
  const borderGray = rgb(0.8, 0.82, 0.85);

  const supplier = getEnv().SUPPLIER_LEGAL_NAME;
  const issueDate = docState.verifiedOn;
  const reviewerName = docState.reviewerName;
  const reviewerBody = docState.reviewerBody;
  const reviewerRegNo = docState.reviewerRegNo;
  const hmacSeal = docState.seal;

  const totalPagesEstimate = 3;

  const addHeaderAndFooter = (page: PDFPage, pageNum: number) => {
    const { width } = page.getSize();
    // Header line
    page.drawLine({
      start: { x: 40, y: 790 },
      end: { x: width - 40, y: 790 },
      thickness: 0.75,
      color: borderGray,
    });
    page.drawText('STATUTORY OCCUPATIONAL HEALTH & SAFETY COMPLIANCE MANUAL', {
      x: 40,
      y: 795,
      size: 7.5,
      font: fontBold,
      color: navy,
    });
    page.drawText(`DOC: ${docState.id} | v${docState.version}`, {
      x: width - 40 - fontRegular.widthOfTextAtSize(`DOC: ${docState.id} | v${docState.version}`, 7.5),
      y: 795,
      size: 7.5,
      font: fontRegular,
      color: mediumGray,
    });

    // Footer line
    page.drawLine({
      start: { x: 40, y: 45 },
      end: { x: width - 40, y: 45 },
      thickness: 0.75,
      color: borderGray,
    });
    page.drawText(`${supplier} | Verified: ${issueDate.split('T')[0]}`, {
      x: 40,
      y: 32,
      size: 7.5,
      font: fontRegular,
      color: mediumGray,
    });
    const pageText = `Page ${pageNum}`;
    page.drawText(pageText, {
      x: width - 40 - fontRegular.widthOfTextAtSize(pageText, 7.5),
      y: 32,
      size: 7.5,
      font: fontRegular,
      color: mediumGray,
    });
  };

  // -------------------------------------------------------------
  // PAGE 1: COVER & VERIFICATION / SIGN-OFF BLOCK
  // -------------------------------------------------------------
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
  addHeaderAndFooter(page1, 1);

  // Title block
  page1.drawRectangle({
    x: 40,
    y: 660,
    width: 515.28,
    height: 105,
    color: lightBg,
    borderColor: borderGray,
    borderWidth: 1,
  });

  page1.drawText('REPUBLIC OF SOUTH AFRICA', {
    x: 60,
    y: 742,
    size: 10,
    font: fontBold,
    color: mediumGray,
  });
  page1.drawText(sanitizeWinAnsi(options.businessName.toUpperCase()), {
    x: 60,
    y: 715,
    size: 18,
    font: fontBold,
    color: navy,
  });
  page1.drawText(`STATUTORY OHS COMPLIANCE MANUAL & LEGAL REGISTER`, {
    x: 60,
    y: 695,
    size: 11,
    font: fontBold,
    color: darkGray,
  });
  page1.drawText(`Operational Category: ${sanitizeWinAnsi(options.category || 'General Commercial')}`, {
    x: 60,
    y: 675,
    size: 9,
    font: fontRegular,
    color: mediumGray,
  });

  // Verification Block
  let y = 620;
  page1.drawText('STATUTORY REVIEW & PROFESSIONAL VERIFICATION', {
    x: 40,
    y,
    size: 12,
    font: fontBold,
    color: navy,
  });
  y -= 20;

  const verifBoxHeight = 110;
  page1.drawRectangle({
    x: 40,
    y: y - verifBoxHeight + 15,
    width: 515.28,
    height: verifBoxHeight,
    color: rgb(0.98, 0.99, 1),
    borderColor: navy,
    borderWidth: 1,
  });

  page1.drawText(`Lead Competent Reviewer:`, { x: 55, y: y - 5, size: 9, font: fontBold, color: darkGray });
  page1.drawText(sanitizeWinAnsi(reviewerName), { x: 220, y: y - 5, size: 9, font: fontRegular, color: darkGray });

  page1.drawText(`Professional Body:`, { x: 55, y: y - 25, size: 9, font: fontBold, color: darkGray });
  page1.drawText(sanitizeWinAnsi(reviewerBody), { x: 220, y: y - 25, size: 9, font: fontRegular, color: darkGray });

  page1.drawText(`Registration Number:`, { x: 55, y: y - 45, size: 9, font: fontBold, color: darkGray });
  page1.drawText(sanitizeWinAnsi(reviewerRegNo), { x: 220, y: y - 45, size: 9, font: fontRegular, color: darkGray });

  page1.drawText(`Verification Date:`, { x: 55, y: y - 65, size: 9, font: fontBold, color: darkGray });
  page1.drawText(sanitizeWinAnsi(issueDate), { x: 220, y: y - 65, size: 9, font: fontRegular, color: darkGray });

  page1.drawText(`Cryptographic HMAC Seal:`, { x: 55, y: y - 85, size: 8, font: fontBold, color: darkGray });
  page1.drawText(sanitizeWinAnsi(hmacSeal), { x: 55, y: y - 97, size: 7, font: fontMono, color: navy });

  y -= (verifBoxHeight + 25);

  // Document Summary
  page1.drawText('EXECUTIVE SUMMARY & STATUTORY PURPOSE', {
    x: 40,
    y,
    size: 11,
    font: fontBold,
    color: navy,
  });
  y -= 18;

  const summaryText = sanitizeWinAnsi(options.content?.summary ||
    'This statutory compliance file establishes baseline occupational health and safety protocols under the Occupational Health and Safety Act 85 of 1993.');
  page1.drawText(summaryText, {
    x: 40,
    y,
    size: 9,
    font: fontRegular,
    color: darkGray,
    lineHeight: 14,
    maxWidth: 515.28,
  });

  // -------------------------------------------------------------
  // PAGE 2: STATUTORY OBLIGATIONS & EVIDENCE REGISTER
  // -------------------------------------------------------------
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  addHeaderAndFooter(page2, 2);

  y = 750;
  page2.drawText('STATUTORY OBLIGATIONS & EVIDENCE REGISTER', {
    x: 40,
    y,
    size: 12,
    font: fontBold,
    color: navy,
  });
  y -= 15;
  page2.drawText('Mandatory statutory provisions applicable to the declared site profile:', {
    x: 40,
    y,
    size: 8.5,
    font: fontRegular,
    color: mediumGray,
  });
  y -= 25;

  const obligations = options.content?.obligations || [
    { citationId: 'OHSA_S8', provision: 'Section 8', requirement: 'General duties of employers to employees', evidence: ['Risk assessments', 'SOPs'] },
    { citationId: 'OHSA_S17', provision: 'Section 17', requirement: 'Health and safety representatives', evidence: ['Designation letters', 'Inspection records'] },
    { citationId: 'GSR_3', provision: 'Regulation 3', requirement: 'First aid designation and facilities', evidence: ['Certified first aider certificate', 'First aid box checklist'] },
    { citationId: 'ERGO_2019', provision: 'Regulation 6', requirement: 'Ergonomic risk assessments and training', evidence: ['Ergonomics assessment', 'Staff training logs'] },
  ];

  for (const obl of obligations) {
    if (y < 120) break;
    page2.drawRectangle({
      x: 40,
      y: y - 55,
      width: 515.28,
      height: 60,
      color: rgb(0.99, 0.99, 0.99),
      borderColor: borderGray,
      borderWidth: 0.5,
    });

    page2.drawText(`[${sanitizeWinAnsi(obl.citationId)}] ${sanitizeWinAnsi(obl.provision)}`, {
      x: 50,
      y: y - 12,
      size: 9,
      font: fontBold,
      color: navy,
    });

    page2.drawText(`Requirement: ${sanitizeWinAnsi(obl.requirement)}`, {
      x: 50,
      y: y - 27,
      size: 8.5,
      font: fontRegular,
      color: darkGray,
    });

    if (obl.evidence && obl.evidence.length > 0) {
      page2.drawText(`Evidence to hold: ${sanitizeWinAnsi(obl.evidence.join('; '))}`, {
        x: 50,
        y: y - 42,
        size: 8,
        font: fontRegular,
        color: mediumGray,
      });
    }

    y -= 70;
  }

  // -------------------------------------------------------------
  // PAGE 3: [CONSULTANT] ACTION ITEMS & SIGN-OFF
  // -------------------------------------------------------------
  const page3 = pdfDoc.addPage([595.28, 841.89]);
  addHeaderAndFooter(page3, 3);

  y = 750;
  page3.drawText('SITE-SPECIFIC CONSULTANT ACTION ITEMS & HIRA CONFIRMATION', {
    x: 40,
    y,
    size: 11,
    font: fontBold,
    color: navy,
  });
  y -= 15;
  page3.drawText('The following items require on-site validation by the competent consultant:', {
    x: 40,
    y,
    size: 8.5,
    font: fontRegular,
    color: mediumGray,
  });
  y -= 25;

  const consultantActions = options.content?.consultantActions || [
    '[CONSULTANT] Complete on-site baseline Hazard Identification and Risk Assessment (HIRA).',
    '[CONSULTANT] Verify fire marshal planning allocations against local municipal fire bylaws.',
    '[CONSULTANT] Confirm statutory appointment figures against current physical shifts.',
    '[CONSULTANT] Inspect physical installations and confirm genuine CoC certificates on file.',
  ];

  for (const action of consultantActions) {
    page2.drawText(sanitizeWinAnsi(`- ${action}`), {
      x: 50,
      y,
      size: 8.5,
      font: fontRegular,
      color: darkGray,
      maxWidth: 495,
      lineHeight: 12,
    });
    y -= 28;
  }

  y -= 20;
  page3.drawText('STATUTORY DECLARATION & SIGNATURE', {
    x: 40,
    y,
    size: 10,
    font: fontBold,
    color: navy,
  });
  y -= 20;

  page3.drawRectangle({
    x: 40,
    y: y - 100,
    width: 515.28,
    height: 100,
    color: lightBg,
    borderColor: borderGray,
    borderWidth: 1,
  });

  page3.drawText(`I hereby verify that the statutory assessments herein reflect the reviewed site data.`, {
    x: 55,
    y: y - 20,
    size: 8.5,
    font: fontRegular,
    color: darkGray,
  });

  page3.drawText(`Verified By: ${sanitizeWinAnsi(reviewerName)} (${sanitizeWinAnsi(reviewerRegNo)})`, {
    x: 55,
    y: y - 45,
    size: 8.5,
    font: fontBold,
    color: darkGray,
  });

  page3.drawText(`Professional Body: ${sanitizeWinAnsi(reviewerBody)} | Date: ${sanitizeWinAnsi(issueDate.split('T')[0])}`, {
    x: 55,
    y: y - 65,
    size: 8.5,
    font: fontRegular,
    color: mediumGray,
  });

  page3.drawText(`Seal Verification Status: CRYPTOGRAPHICALLY VERIFIED & AUDITABLE`, {
    x: 55,
    y: y - 85,
    size: 8,
    font: fontBold,
    color: rgb(0.1, 0.5, 0.2),
  });

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  return {
    pdfBytes,
    buffer,
    pageCount: pdfDoc.getPageCount(),
    issueDate,
    seal: hmacSeal,
  };
}

/**
 * Renders an unreviewed DRAFT preview PDF with prominent diagonal watermark.
 * Contains no reviewer credentials or HMAC seal.
 * Strictly forbidden from being accessible on the download route.
 */
export async function renderDraftPreviewPdf(options: {
  businessName: string;
  category?: string;
  docId: string;
}): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // Watermark
  page.drawText('DRAFT - NOT REVIEWED', {
    x: 100,
    y: height / 2,
    size: 36,
    font: fontBold,
    color: rgb(0.85, 0.85, 0.85),
    rotate: degrees(45),
  });

  page.drawText('UNVERIFIED PREVIEW DRAFT', {
    x: 40,
    y: 780,
    size: 16,
    font: fontBold,
    color: rgb(0.7, 0.2, 0.2),
  });

  page.drawText(`Document ID: ${options.docId}`, {
    x: 40,
    y: 755,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(`Business: ${options.businessName}`, {
    x: 40,
    y: 735,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText('This preview is an unverified draft and does not constitute a valid statutory OHS compliance file.', {
    x: 40,
    y: 700,
    size: 9,
    font: fontRegular,
    color: rgb(0.5, 0.1, 0.1),
  });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
