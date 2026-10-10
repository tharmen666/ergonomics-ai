import { getEnv } from '@/lib/env';

/**
 * South African Invoicing Engine adhering to SARS (South African Revenue Service)
 * Section 20 VAT Act statutory regulations.
 *
 * Rules:
 * 1. Supplier details come exclusively from configuration (getEnv().SUPPLIER_*).
 *    No hardcoded personal attribution, marketing lines, or personal contact info.
 * 2. Title is "TAX INVOICE" only when supplier has a valid VAT number, otherwise "INVOICE".
 * 3. Inclusive VAT: When supplier is VAT-registered and PRICE_INCLUDES_VAT is true (default),
 *    total payable is preserved (e.g. R3,500.00 total: Net = round(total / 1.15), VAT = total - net).
 *    Never silently add 15% on top of an agreed total (e.g., turning R3,500 into R4,025).
 * 4. SARS 5-year retention requirement: retainUntil stored as metadata.
 * 5. High-value warning: If tax invoice exceeds R5,000 and customer VAT/address is missing.
 */

export interface SupplierDetails {
  name: string;
  tradingName?: string;
  companyRegistrationNumber?: string;
  physicalAddress: string;
  postalAddress?: string;
  phone: string;
  email: string;
  vatNumber?: string;
}

export interface CustomerDetails {
  name: string;
  companyName?: string;
  companyRegistrationNumber?: string;
  physicalAddress?: string;
  phone?: string;
  email: string;
  vatNumber?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  statutoryCategory?: string;
}

export interface PaymentDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
  reference: string;
}

export interface InvoiceModel {
  invoiceNumber: string;
  sequenceNumber?: number;
  title: 'TAX INVOICE' | 'INVOICE';
  isTaxInvoice: boolean;
  issueDate: string;
  dueDate: string;
  supplier: SupplierDetails;
  customer: CustomerDetails;
  items: InvoiceLineItem[];
  subtotalCents: number; // Net before VAT
  vatRate: number;      // 0.15 if registered, 0 if unregistered
  vatCents: number;
  totalCents: number;   // Total payable
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  paymentDetails?: PaymentDetails;
  notes?: string;
  warnings?: string[];
  metadata: {
    retainUntil: string; // 5 years statutory SARS retention date
    priceIncludesVat: boolean;
    vatNumberValidationFormatOnly: boolean;
  };
}

export interface CreateInvoiceParams {
  invoiceNumber?: string;
  sequenceNumber?: number;
  supplier?: Partial<SupplierDetails>;
  customer: CustomerDetails;
  items: Array<{
    description: string;
    quantity: number;
    unitPriceCents: number;
    statutoryCategory?: string;
  }>;
  issueDate?: string;
  dueDays?: number;
  paymentDetails?: Partial<PaymentDetails>;
  notes?: string;
}

/**
 * Validates South African 10-digit VAT registration number format.
 * NOTE: This is a format check only (10 digits starting with 4);
 * it does not verify active status with SARS.
 */
export function validateSouthAfricanVatNumber(vatNumber?: string | null): {
  isValid: boolean;
  sanitized?: string;
  reason?: string;
} {
  if (!vatNumber || typeof vatNumber !== 'string') {
    return { isValid: false, reason: 'Supplier does not have a VAT registration number on file.' };
  }

  const cleaned = vatNumber.replace(/[\s\-_]/g, '');

  if (!/^\d{10}$/.test(cleaned)) {
    return { isValid: false, reason: 'VAT number must contain exactly 10 digits (format check only).' };
  }

  if (!cleaned.startsWith('4')) {
    return { isValid: false, reason: 'South African VAT registration numbers begin with 4 (format check only).' };
  }

  return { isValid: true, sanitized: cleaned };
}

/**
 * Returns supplier details loaded strictly from validated environment configuration.
 * Never includes hardcoded personal attribution.
 */
export function getSupplierFromEnv(): SupplierDetails {
  const env = getEnv();
  return {
    name: env.SUPPLIER_LEGAL_NAME,
    physicalAddress: env.SUPPLIER_ADDRESS,
    email: env.SUPPLIER_EMAIL,
    phone: env.SUPPLIER_PHONE,
    vatNumber: env.SUPPLIER_VAT_NUMBER,
  };
}

/**
 * Creates a compliant InvoiceModel following SARS Section 20 statutory rules.
 */
export function createInvoice(params: CreateInvoiceParams): InvoiceModel {
  const envSupplier = getSupplierFromEnv();
  const supplier: SupplierDetails = {
    ...envSupplier,
    ...params.supplier,
  };

  const vatCheck = validateSouthAfricanVatNumber(supplier.vatNumber);
  const isTaxInvoice = vatCheck.isValid;
  const title: 'TAX INVOICE' | 'INVOICE' = isTaxInvoice ? 'TAX INVOICE' : 'INVOICE';
  const vatRate = isTaxInvoice ? 0.15 : 0;

  const env = getEnv();
  const priceIncludesVat = env.PRICE_INCLUDES_VAT !== 'false' && env.PRICE_INCLUDES_VAT !== '0';

  // Compute nominal gross item totals
  const items: InvoiceLineItem[] = params.items.map((item) => {
    const total = Math.round(item.quantity * item.unitPriceCents);
    return {
      description: item.description,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      totalCents: total,
      statutoryCategory: item.statutoryCategory,
    };
  });

  const nominalTotalCents = items.reduce((sum, item) => sum + item.totalCents, 0);

  let totalCents: number;
  let subtotalCents: number;
  let vatCents: number;

  if (!isTaxInvoice) {
    // Unregistered: 0% VAT
    subtotalCents = nominalTotalCents;
    vatCents = 0;
    totalCents = nominalTotalCents;
  } else if (priceIncludesVat) {
    // Registered, inclusive pricing: Total payable remains nominal, VAT backed out
    totalCents = nominalTotalCents;
    subtotalCents = Math.round(totalCents / 1.15);
    vatCents = totalCents - subtotalCents;
  } else {
    // Registered, exclusive pricing
    subtotalCents = nominalTotalCents;
    vatCents = Math.round(subtotalCents * 0.15);
    totalCents = subtotalCents + vatCents;
  }

  const now = params.issueDate ? new Date(params.issueDate) : new Date();
  const issueDate = now.toISOString().split('T')[0];
  const dueDays = params.dueDays ?? 7;
  const due = new Date(now.getTime() + dueDays * 24 * 60 * 60 * 1000);
  const dueDate = due.toISOString().split('T')[0];

  // SARS 5-year document retention requirement
  const retainUntilDate = new Date(now);
  retainUntilDate.setFullYear(retainUntilDate.getFullYear() + 5);
  const retainUntil = retainUntilDate.toISOString().split('T')[0];

  const warnings: string[] = [];
  // SARS Section 20(4) requirement: Tax invoices exceeding R5,000 must include customer VAT number and address
  if (isTaxInvoice && totalCents > 500000) {
    if (!params.customer.vatNumber) {
      warnings.push('SARS Compliance Warning: Tax invoices exceeding R5,000 require recipient VAT registration number.');
    }
    if (!params.customer.physicalAddress) {
      warnings.push('SARS Compliance Warning: Tax invoices exceeding R5,000 require recipient physical address.');
    }
  }

  const invoiceNumber = params.invoiceNumber ?? `INV-${now.getFullYear()}-000001`;

  return {
    invoiceNumber,
    sequenceNumber: params.sequenceNumber,
    title,
    isTaxInvoice,
    issueDate,
    dueDate,
    supplier: {
      ...supplier,
      vatNumber: vatCheck.isValid ? vatCheck.sanitized : undefined,
    },
    customer: params.customer,
    items,
    subtotalCents,
    vatRate,
    vatCents,
    totalCents,
    status: 'issued',
    paymentDetails: params.paymentDetails ? {
      bankName: params.paymentDetails.bankName || 'Direct Electronic Funds Transfer',
      accountHolder: params.paymentDetails.accountHolder || supplier.name,
      accountNumber: params.paymentDetails.accountNumber || '',
      branchCode: params.paymentDetails.branchCode || '',
      accountType: params.paymentDetails.accountType || 'Current / Cheque',
      reference: invoiceNumber,
      ...params.paymentDetails,
    } : undefined,
    notes: params.notes,
    warnings: warnings.length > 0 ? warnings : undefined,
    metadata: {
      retainUntil,
      priceIncludesVat,
      vatNumberValidationFormatOnly: true,
    },
  };
}

/**
 * Format currency amount in ZAR.
 */
export function formatZar(cents: number): string {
  const rands = (cents / 100).toFixed(2);
  return `R ${Number(rands).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Renders HTML view of statutory invoice strictly from configuration.
 * Contains no personal attribution or unauthorized marketing text.
 */
export function renderInvoiceHtml(invoice: InvoiceModel): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${invoice.title} - ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #1f2937; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
    .title { font-size: 24px; font-weight: bold; color: #111827; }
    .meta-box { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th { text-align: left; background: #f3f4f6; padding: 10px; border-bottom: 1px solid #d1d5db; }
    td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
    .totals { margin-top: 24px; width: 300px; margin-left: auto; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
    .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #111827; padding-top: 8px; }
    .warnings { margin-top: 20px; padding: 12px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; font-size: 13px; color: #92400e; }
    .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">${invoice.title}</div>
      <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
      <div><strong>Issue Date:</strong> ${invoice.issueDate}</div>
      <div><strong>Due Date:</strong> ${invoice.dueDate}</div>
    </div>
    <div style="text-align: right;">
      <div><strong>${invoice.supplier.name}</strong></div>
      <div>${invoice.supplier.physicalAddress}</div>
      <div>Email: ${invoice.supplier.email} | Tel: ${invoice.supplier.phone}</div>
      ${invoice.supplier.vatNumber ? `<div><strong>VAT Reg No:</strong> ${invoice.supplier.vatNumber}</div>` : '<div><em>Not VAT Registered</em></div>'}
    </div>
  </div>

  <div class="meta-box">
    <div>
      <strong>BILLED TO:</strong><br>
      ${invoice.customer.name}<br>
      ${invoice.customer.physicalAddress ? `${invoice.customer.physicalAddress}<br>` : ''}
      Email: ${invoice.customer.email}<br>
      ${invoice.customer.vatNumber ? `VAT No: ${invoice.customer.vatNumber}<br>` : ''}
    </div>
    ${invoice.paymentDetails ? `
    <div>
      <strong>PAYMENT DETAILS:</strong><br>
      Bank: ${invoice.paymentDetails.bankName}<br>
      Account Holder: ${invoice.paymentDetails.accountHolder}<br>
      Account Number: ${invoice.paymentDetails.accountNumber}<br>
      Branch Code: ${invoice.paymentDetails.branchCode}<br>
      Reference: ${invoice.paymentDetails.reference}
    </div>` : '<div></div>'}
  </div>

  ${invoice.warnings ? `
  <div class="warnings">
    ${invoice.warnings.map(w => `<div>${w}</div>`).join('')}
  </div>` : ''}

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map(item => `
      <tr>
        <td>${item.description}${item.statutoryCategory ? ` <small>(${item.statutoryCategory})</small>` : ''}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${formatZar(item.unitPriceCents)}</td>
        <td style="text-align: right;">${formatZar(item.totalCents)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal (Net):</span>
      <span>${formatZar(invoice.subtotalCents)}</span>
    </div>
    ${invoice.isTaxInvoice ? `
    <div class="totals-row">
      <span>VAT (15%):</span>
      <span>${formatZar(invoice.vatCents)}</span>
    </div>` : `
    <div class="totals-row">
      <span>VAT (0%):</span>
      <span>R 0.00</span>
    </div>`}
    <div class="totals-row grand-total">
      <span>Total Payable:</span>
      <span>${formatZar(invoice.totalCents)}</span>
    </div>
  </div>

  <div class="footer">
    <div>Statutory Record Retention: Store securely until ${invoice.metadata.retainUntil} in accordance with SARS statutory recordkeeping requirements.</div>
  </div>
</body>
</html>`;
}
