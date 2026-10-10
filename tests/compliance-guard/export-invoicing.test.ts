import { describe, it, expect } from 'vitest';
import { generateComplianceManualPdf } from '@/lib/export/pdf-generator';
import { 
  validateSouthAfricanVatNumber, 
  createInvoice, 
  renderInvoiceHtml,
} from '@/lib/invoicing/invoice';
import { DocumentStateModel, transitionDocument } from '@/lib/compliance/document-state';
import { db } from '@/lib/db/repo';

import { generateComplianceManualDocx } from '@/lib/export/docx-generator';

describe('Statutory PDF & DOCX Generator (pdf-lib, docx)', () => {
  const rawDoc: DocumentStateModel = {
    id: 'doc_vitest_001',
    version: 1,
    status: 'under_review',
    contentHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    history: [],
  };

  const signed = transitionDocument(rawDoc, 'sign', {
    reviewerName: 'Professional Auditor',
    reviewerBody: 'SAIOSH',
    reviewerRegNo: 'SAIOSH-2026-9901',
    reviewedContentHash: rawDoc.contentHash,
  });

  it('generates a statutory compliance manual PDF starting with %PDF and without personal attribution', async () => {
    const result = await generateComplianceManualPdf(signed, {
      businessName: 'Vitest Test Franchise',
      category: 'Fast Food Franchise',
      docId: signed.id,
      content: {
        summary: 'Site safety manual content snapshot',
        statutoryCitations: ['OHSA_S8', 'OHSA_S17'],
        obligations: [{ citationId: 'OHSA_S17', provision: 'Section 17', requirement: 'Appoint H&S Reps', evidence: ['Appointment letter'] }],
      },
    });

    expect(result.pageCount).toBeGreaterThanOrEqual(2);
    expect(result.buffer.length).toBeGreaterThan(1000);
    expect(result.buffer.toString('utf-8', 0, 5)).toBe('%PDF-');
    // Ensure no hard-coded personal attribution or fake reviewer persona in the PDF
    const pdfText = result.buffer.toString('latin1');
    expect(pdfText).not.toContain('Rob (Chief OHS Guru)');
    expect(pdfText).not.toContain('Created by Desigan Tharmen');
    expect(pdfText).not.toContain('062 265 5708');
  });

  it('generates a statutory compliance manual DOCX starting with PK zip magic bytes', async () => {
    const docxBuffer = await generateComplianceManualDocx(signed, {
      businessName: 'Vitest Test Franchise',
      category: 'Fast Food Franchise',
    });

    expect(docxBuffer.length).toBeGreaterThan(1000);
    // DOCX is a zip file, magic bytes PK\x03\x04
    expect(docxBuffer.toString('utf-8', 0, 2)).toBe('PK');
  });

  it('throws an error if attempting to export an unsigned or unverified document', async () => {
    const draftDoc: DocumentStateModel = {
      id: 'doc_draft_002',
      version: 1,
      status: 'draft',
      contentHash: 'hash123',
      history: [],
    };

    await expect(
      generateComplianceManualPdf(draftDoc, {
        businessName: 'Draft Company',
        docId: draftDoc.id,
      })
    ).rejects.toThrow(/Document must be signed_verified or delivered to generate export/i);

    await expect(
      generateComplianceManualDocx(draftDoc, {
        businessName: 'Draft Company',
      })
    ).rejects.toThrow(/Document must be signed_verified or delivered to generate export/i);
  });
});

describe('SARS Invoicing Engine & VAT Compliance', () => {
  it('validates South African 10-digit VAT numbers beginning with 4 as a format check', () => {
    expect(validateSouthAfricanVatNumber('4981234567').isValid).toBe(true);
    expect(validateSouthAfricanVatNumber('5981234567').isValid).toBe(false); // must start with 4
    expect(validateSouthAfricanVatNumber('49812').isValid).toBe(false); // must be 10 digits
    expect(validateSouthAfricanVatNumber(undefined).isValid).toBe(false);
  });

  it('guarantees gap-free sequential numbering through database transaction', async () => {
    const order1 = await db.orders.save({
      ref: 'ord_inv_test_1',
      docId: 'doc_inv_test_1',
      amountCents: 350000,
      email: 'client1@example.com',
    });
    const order2 = await db.orders.save({
      ref: 'ord_inv_test_2',
      docId: 'doc_inv_test_2',
      amountCents: 350000,
      email: 'client2@example.com',
    });

    const issueDate = new Date('2026-07-01T00:00:00Z');
    const first = await db.invoices.createSequentialInvoice({ orderId: order1.id, invoiceData: {}, issueDate });
    const second = await db.invoices.createSequentialInvoice({ orderId: order2.id, invoiceData: {}, issueDate });

    expect(first.number).toMatch(/^INV-2026-\d{6}$/);
    expect(second.number).toMatch(/^INV-2026-\d{6}$/);
    const seq1 = parseInt(first.number.split('-')[2], 10);
    const seq2 = parseInt(second.number.split('-')[2], 10);
    expect(seq2).toBe(seq1 + 1);
  });

  it('renders standard INVOICE with 0% VAT if supplier is unregistered', () => {
    const invoice = createInvoice({
      supplier: {
        vatNumber: undefined,
      },
      customer: {
        name: 'Wimpy Southgate Franchisee',
        physicalAddress: 'Southgate Mall, Johannesburg',
        email: 'test@southgate.co.za'
      },
      items: [
        {
          description: 'Statutory OHS Compliance Manual',
          quantity: 1,
          unitPriceCents: 350000
        }
      ]
    });

    expect(invoice.title).toBe('INVOICE');
    expect(invoice.isTaxInvoice).toBe(false);
    expect(invoice.vatCents).toBe(0);
    expect(invoice.totalCents).toBe(350000);
    expect(invoice.subtotalCents).toBe(350000);
  });

  it('renders TAX INVOICE with inclusive VAT (R3,500 total payable preserved, net = round(total / 1.15))', () => {
    const invoice = createInvoice({
      supplier: {
        vatNumber: '4991238491',
      },
      customer: {
        name: 'Astron Energy Fairlands',
        physicalAddress: 'Beyers Naude Dr, Johannesburg',
        email: 'test@astron.co.za'
      },
      items: [
        {
          description: 'Forecourt OHS File & Assessment',
          quantity: 1,
          unitPriceCents: 350000 // R3,500.00 total agreed
        }
      ]
    });

    expect(invoice.title).toBe('TAX INVOICE');
    expect(invoice.isTaxInvoice).toBe(true);
    // Inclusive VAT math: total payable remains R3,500.00 (350,000 cents)
    expect(invoice.totalCents).toBe(350000);
    // Net = round(350000 / 1.15) = 304348 cents (R3,043.48)
    expect(invoice.subtotalCents).toBe(304348);
    // VAT = 350000 - 304348 = 45652 cents (R456.52)
    expect(invoice.vatCents).toBe(45652);
  });

  it('renders HTML strictly from environment supplier details with no personal attribution strings', () => {
    const invoice = createInvoice({
      customer: {
        name: 'La Bakery Ormonde',
        physicalAddress: 'Ormonde, Johannesburg',
        email: 'test@labakery.co.za'
      },
      items: [
        {
          description: 'Bakery Safety Audit',
          quantity: 1,
          unitPriceCents: 250000
        }
      ]
    });

    const html = renderInvoiceHtml(invoice);
    // Must NOT contain personal attribution or phone numbers
    expect(html).not.toContain('Created by Desigan Tharmen');
    expect(html).not.toContain('062 265 5708');
    // Must contain official configured supplier details
    expect(html).toContain(invoice.supplier.name);
    expect(html).toContain(invoice.supplier.phone);
    expect(html).toContain(invoice.invoiceNumber);
  });
});
