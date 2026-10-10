import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, Packer } from 'docx';
import { DocumentStateModel, verifySeal } from '@/lib/compliance/document-state';
import { getEnv } from '@/lib/env';

export interface DocxExportOptions {
  businessName: string;
  category?: string;
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

/**
 * Generates an official statutory DOCX compliance file using the `docx` package.
 * Strict guards:
 * - Throws immediately if document is not signed_verified or delivered.
 * - Throws immediately if reviewer credentials or seal are missing.
 * - Throws immediately if cryptographic seal verification fails.
 */
export async function generateComplianceManualDocx(
  docState: DocumentStateModel,
  options: DocxExportOptions
): Promise<Buffer> {
  // 1. Strict status check
  if (docState.status !== 'signed_verified' && docState.status !== 'delivered') {
    throw new Error(`Export Denied: Document must be signed_verified or delivered to generate export (current status: ${docState.status})`);
  }

  // 2. Strict reviewer credentials check
  if (!docState.reviewerName || !docState.reviewerBody || !docState.reviewerRegNo || !docState.verifiedOn || !docState.seal) {
    throw new Error('Export Denied: Complete reviewer credentials (name, body, regNo, verifiedOn, seal) are strictly required.');
  }

  // 3. Strict cryptographic seal verification
  if (!verifySeal(docState)) {
    throw new Error('Export Denied: Cryptographic seal verification failed.');
  }

  const supplier = getEnv().SUPPLIER_LEGAL_NAME;
  const issueDate = docState.verifiedOn.split('T')[0];

  const obligations = options.content?.obligations || [
    { citationId: 'OHSA_S8', provision: 'Section 8', requirement: 'General duties of employers to employees', evidence: ['Risk assessments', 'SOPs'] },
    { citationId: 'OHSA_S17', provision: 'Section 17', requirement: 'Health and safety representatives', evidence: ['Designation letters', 'Inspection records'] },
    { citationId: 'GSR_3', provision: 'Regulation 3', requirement: 'First aid designation and facilities', evidence: ['First aider certificates', 'First aid box checklist'] },
    { citationId: 'ERGO_2019', provision: 'Regulation 6', requirement: 'Ergonomic risk assessments and training', evidence: ['Ergonomics assessment', 'Staff training logs'] },
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'REPUBLIC OF SOUTH AFRICA',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: `STATUTORY OHS COMPLIANCE MANUAL: ${options.businessName.toUpperCase()}`,
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Document ID: ${docState.id} | Version: ${docState.version}\n`, bold: true }),
              new TextRun({ text: `Operational Category: ${options.category || 'General Commercial'}\n` }),
              new TextRun({ text: `Issuing Organization: ${supplier}\n` }),
              new TextRun({ text: `Verification Date: ${issueDate}\n` }),
            ],
          }),

          new Paragraph({
            text: 'Professional Review & Verification Block',
            heading: HeadingLevel.HEADING_1,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Reviewer Name', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph(docState.reviewerName)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Professional Body', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph(docState.reviewerBody)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Registration Number', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph(docState.reviewerRegNo)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cryptographic Seal', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph(docState.seal)] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: 'Executive Summary',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: options.content?.summary || 'Statutory OHS compliance manual establishing workplace safety standards under OHSA 85 of 1993.',
          }),

          new Paragraph({
            text: 'Statutory Obligations & Evidence Register',
            heading: HeadingLevel.HEADING_1,
          }),
          ...obligations.flatMap((obl) => [
            new Paragraph({
              children: [
                new TextRun({ text: `[${obl.citationId}] ${obl.provision}: `, bold: true }),
                new TextRun({ text: obl.requirement }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Evidence to hold: ${(obl.evidence || []).join('; ')}`, italics: true }),
              ],
            }),
          ]),

          new Paragraph({
            text: 'Consultant Action Items [CONSULTANT]',
            heading: HeadingLevel.HEADING_1,
          }),
          ...(options.content?.consultantActions || [
            '[CONSULTANT] Complete on-site baseline Hazard Identification and Risk Assessment (HIRA).',
            '[CONSULTANT] Confirm all statutory appointment letters on file.',
          ]).map((item) => new Paragraph({ text: `- ${item}` })),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
