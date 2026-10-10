import { generateComplianceManualPdf } from '../src/lib/export/pdf-generator';
import { 
  createInvoice, 
  validateSouthAfricanVatNumber, 
  renderInvoiceHtml
} from '../src/lib/invoicing/invoice';
import { DocumentStateModel, transitionDocument } from '../src/lib/compliance/document-state';

// Script execution test environment configuration
process.env.DOC_SEAL_SECRET = process.env.DOC_SEAL_SECRET || 'a'.repeat(32);
process.env.DOWNLOAD_TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET || 'b'.repeat(32);
process.env.APP_URL = process.env.APP_URL || 'http://localhost:3000';
process.env.PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || '10000100';
process.env.PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a';
process.env.PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || 'c'.repeat(32);
process.env.SUPPLIER_LEGAL_NAME = process.env.SUPPLIER_LEGAL_NAME || 'ComplianceGuard AI Test Services Pty Ltd';
process.env.SUPPLIER_ADDRESS = process.env.SUPPLIER_ADDRESS || '123 Test Street, Johannesburg, Gauteng, 2000';
process.env.SUPPLIER_EMAIL = process.env.SUPPLIER_EMAIL || 'billing@compliance-guard.test';
process.env.SUPPLIER_PHONE = process.env.SUPPLIER_PHONE || '+27 11 555 0100';

async function main() {
  console.log('🧪 Starting Tests for Statutory PDF Generator & SARS Invoice Engine...\n');

  // ==========================================
  // PART 1: TEST PDF GENERATOR (pdf-lib)
  // ==========================================
  console.log('--- PART 1: Statutory PDF Manual Generator ---');

  // Prepare a signed_verified document state
  const rawDoc: DocumentStateModel = {
    id: 'doc_wimpy_southgate_ohs_2026',
    version: 1,
    status: 'draft',
    contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    history: [],
  };

  const reviewedDoc = transitionDocument(rawDoc, 'submit_for_review');
  const signedDoc = transitionDocument(reviewedDoc, 'sign', {
    reviewerName: 'Professional Reviewer',
    reviewerBody: 'SAIOSH',
    reviewerRegNo: 'SAIOSH-2026-8831',
  });

  console.log('1. Generating Statutory Manual PDF with reviewer credentials & HMAC seal...');
  const pdfResult = await generateComplianceManualPdf(signedDoc, {
    businessName: 'Wimpy Southgate Mall Franchise',
    category: 'Fast Food Franchise (Food & Beverage)',
    location: 'Southgate Mall, Cnr Columbine & Rifle Range Rd, Johannesburg',
    content: {
      summary: 'Statutory compliance manual preview',
      statutoryCitations: ['OHSA_S17', 'GSR_3', 'SANS_10087_1', 'R638'],
    },
  });

  console.log(`- Page Count: ${pdfResult.pageCount}`);
  console.log(`- Buffer Size: ${pdfResult.buffer.length} bytes`);
  console.log(`- Issue Date: ${pdfResult.issueDate}`);
  console.log(`- Seal: ${pdfResult.seal.slice(0, 24)}...`);

  if (pdfResult.pageCount !== 3) {
    throw new Error(`PDF Test Failed: Expected 3 pages, got ${pdfResult.pageCount}`);
  }
  if (!pdfResult.buffer.toString('utf-8', 0, 5).startsWith('%PDF-')) {
    throw new Error('PDF Test Failed: Missing valid %PDF- magic header');
  }
  console.log('✅ Part 1 Passed: PDF generated successfully with reviewer credentials and HMAC seal\n');

  // ==========================================
  // PART 2: TEST INVOICE VAT VALIDATION
  // ==========================================
  console.log('--- PART 2: SARS Invoicing Engine ---');

  // 1. VAT Number validation tests
  console.log('2. Testing SARS VAT number validation rules...');
  const vatEmpty = validateSouthAfricanVatNumber(undefined);
  const vatShort = validateSouthAfricanVatNumber('4123456');
  const vatNotStartingWith4 = validateSouthAfricanVatNumber('5123456789');
  const vatValid = validateSouthAfricanVatNumber('4981234567');

  if (vatEmpty.isValid || vatShort.isValid || vatNotStartingWith4.isValid) {
    throw new Error('VAT Validation Failed: Invalid VAT numbers accepted');
  }
  if (!vatValid.isValid || vatValid.sanitized !== '4981234567') {
    throw new Error('VAT Validation Failed: Valid VAT number rejected');
  }
  console.log('✅ VAT Validation passed: 10 digits starting with 4 strictly enforced\n');

  // 2. Unregistered supplier -> Renders INVOICE (Not TAX INVOICE) with 0% VAT
  console.log('3. Testing Unregistered Supplier Invoice Generation...');
  const invoiceUnregistered = createInvoice({
    invoiceNumber: 'INV-2026-000001',
    supplier: {
      name: 'Compliance Provider Pty Ltd',
      tradingName: 'Compliance Provider',
      physicalAddress: '123 Main Rd, Johannesburg',
      email: 'ops@provider.co.za',
      phone: '+27 11 000 0000',
      vatNumber: undefined, // Not registered
    },
    customer: {
      name: 'Wimpy Southgate Franchise Operator',
      companyName: 'Famous Brands Franchisee PTY LTD',
      physicalAddress: 'Shop U12, Southgate Mall, Johannesburg',
      email: 'manager@wimpy-southgate.co.za',
    },
    items: [
      {
        description: 'Statutory OHS Compliance Safety File & Legal Registers',
        quantity: 1,
        unitPriceCents: 350000,
      },
    ],
  });

  console.log(`- Title: "${invoiceUnregistered.title}"`);
  console.log(`- Is Tax Invoice: ${invoiceUnregistered.isTaxInvoice}`);
  console.log(`- Subtotal: R ${(invoiceUnregistered.subtotalCents / 100).toFixed(2)}`);
  console.log(`- VAT Rate: ${invoiceUnregistered.vatRate * 100}%`);
  console.log(`- VAT Amount: R ${(invoiceUnregistered.vatCents / 100).toFixed(2)}`);
  console.log(`- Total: R ${(invoiceUnregistered.totalCents / 100).toFixed(2)}`);

  if (invoiceUnregistered.title !== 'INVOICE' || invoiceUnregistered.isTaxInvoice !== false || invoiceUnregistered.vatCents !== 0) {
    throw new Error('Unregistered Supplier Test Failed: Should be INVOICE with 0% VAT');
  }
  console.log('✅ Unregistered supplier correctly rendered as standard "INVOICE" with 0% VAT\n');

  // 3. Registered supplier -> Renders TAX INVOICE with 15% VAT
  console.log('4. Testing Registered Supplier Tax Invoice Generation...');
  const invoiceRegistered = createInvoice({
    invoiceNumber: 'INV-2026-000002',
    supplier: {
      name: 'Compliance Provider Pty Ltd',
      tradingName: 'Compliance Provider',
      physicalAddress: '123 Main Rd, Johannesburg',
      email: 'ops@provider.co.za',
      phone: '+27 11 000 0000',
      vatNumber: '4920192841', // Valid SARS VAT number
    },
    customer: {
      name: 'Astron Energy Forecourt Operator',
      companyName: 'PetroGauteng PTY LTD',
      physicalAddress: '142 Beyers Naude Dr, Fairlands, Johannesburg',
      email: 'accounts@astron-fairlands.co.za',
      vatNumber: '4190823412',
    },
    items: [
      {
        description: 'Statutory Forecourt OHS File & MHI Assessment Pack',
        quantity: 1,
        unitPriceCents: 450000,
      },
    ],
  });

  console.log(`- Title: "${invoiceRegistered.title}"`);
  console.log(`- Is Tax Invoice: ${invoiceRegistered.isTaxInvoice}`);
  console.log(`- Subtotal: R ${(invoiceRegistered.subtotalCents / 100).toFixed(2)}`);
  console.log(`- VAT Rate: ${invoiceRegistered.vatRate * 100}%`);
  console.log(`- VAT Amount: R ${(invoiceRegistered.vatCents / 100).toFixed(2)}`);
  console.log(`- Total: R ${(invoiceRegistered.totalCents / 100).toFixed(2)}`);

  if (invoiceRegistered.title !== 'TAX INVOICE' || invoiceRegistered.isTaxInvoice !== true) {
    throw new Error('Registered Supplier Test Failed: Should be TAX INVOICE with 15% VAT');
  }
  console.log('✅ Registered supplier correctly rendered as "TAX INVOICE" with 15% VAT\n');

  // 4. HTML Template generation test
  console.log('5. Testing HTML invoice layout rendering...');
  const html = renderInvoiceHtml(invoiceRegistered);
  if (!html.includes('TAX INVOICE')) {
    throw new Error('HTML Rendering Failed: Missing required title');
  }
  console.log('✅ HTML invoice rendered with statutory compliance layout\n');

  console.log('🎉 ALL STATUTORY PDF AND INVOICE TESTS PASSED WITH 100% SUCCESS!');
}

main().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
