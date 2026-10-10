import { describe, it, expect, beforeEach } from 'vitest';
import { 
  confirmPayment, 
  computeWebhookSignature, 
  PaymentNotification, 
  resetPaymentIdempotency 
} from '@/lib/payments/webhook';
import { db } from '@/lib/db/repo';
import { prisma } from '@/lib/db/prisma';

describe('Secure HMAC Webhook & Idempotent Order Processing', () => {
  const docId = 'doc_webhook_test_001';
  const orderRef = 'ord_webhook_test_001';
  const testSecret = 'compliance-guard-webhook-secret-32-chars-min';

  beforeEach(async () => {
    resetPaymentIdempotency();
    await prisma.downloadUse.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.order.deleteMany();
    await prisma.document.deleteMany();
    await prisma.invoiceCounter.deleteMany();

    // Seed test document and order
    await db.documents.save({
      id: docId,
      status: 'under_review',
      version: 1,
      contentHash: 'hash_webhook_test_123456789012345678901234567890',
      content: JSON.stringify({ summary: 'Webhook test file' }),
    });

    await db.orders.save({
      ref: orderRef,
      docId,
      status: 'pending',
      amountCents: 350000,
      email: 'client@example.com',
    });
  });

  it('successfully processes valid payment with authentic HMAC signature', async () => {
    const rawPayload: PaymentNotification = {
      gatewayPaymentId: 'pay_test_valid_001',
      orderId: orderRef,
      docId,
      amountCents: 350000,
      currency: 'ZAR',
      status: 'COMPLETE',
      customerName: 'Wimpy Southgate Franchisee',
      customerEmail: 'compliance@wimpy-southgate.co.za',
    };

    const signature = computeWebhookSignature(rawPayload, testSecret);
    const notification: PaymentNotification = {
      ...rawPayload,
      signature,
    };

    const result = await confirmPayment(notification, testSecret);

    expect(result.success).toBe(true);
    expect(result.isReplay).toBe(false);
    expect(result.invoiceNumber).toBeDefined();
    expect(result.downloadToken).toBeDefined();
    expect(result.downloadUrl).toContain(docId);

    // Order status must be updated to paid in DB
    const order = await db.orders.findByRef(orderRef);
    expect(order?.status).toBe('paid');
  });

  it('rejects webhook with invalid or tampered HMAC signature', async () => {
    const notification: PaymentNotification = {
      gatewayPaymentId: 'pay_test_bad_sig_002',
      orderId: orderRef,
      docId,
      amountCents: 350000,
      currency: 'ZAR',
      status: 'COMPLETE',
      signature: 'invalid_forged_hmac_signature_value',
    };

    const result = await confirmPayment(notification, testSecret);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid HMAC signature');
  });

  it('rejects payment if amount is less or more than expected order total', async () => {
    const rawPayload: PaymentNotification = {
      gatewayPaymentId: 'pay_test_wrong_amt_003',
      orderId: orderRef,
      docId,
      amountCents: 100000, // Should be 350000
      currency: 'ZAR',
      status: 'COMPLETE',
    };

    const signature = computeWebhookSignature(rawPayload, testSecret);
    const result = await confirmPayment({ ...rawPayload, signature }, testSecret);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Payment Amount Mismatch');
  });

  it('rejects notification if payment status is FAILED or PENDING', async () => {
    const rawPayload: PaymentNotification = {
      gatewayPaymentId: 'pay_test_failed_004',
      orderId: orderRef,
      docId,
      amountCents: 350000,
      currency: 'ZAR',
      status: 'FAILED',
    };

    const signature = computeWebhookSignature(rawPayload, testSecret);
    const result = await confirmPayment({ ...rawPayload, signature }, testSecret);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Status is 'FAILED'");
  });

  it('guarantees strict idempotency on replayed gateway payment notifications', async () => {
    const rawPayload: PaymentNotification = {
      gatewayPaymentId: 'pay_idempotent_replay_005',
      orderId: orderRef,
      docId,
      amountCents: 350000,
      currency: 'ZAR',
      status: 'COMPLETE',
    };

    const signature = computeWebhookSignature(rawPayload, testSecret);
    const notification = { ...rawPayload, signature };

    // 1st Arrival: Normal processing
    const firstResult = await confirmPayment(notification, testSecret);
    expect(firstResult.success).toBe(true);
    expect(firstResult.isReplay).toBe(false);
    const assignedInvoice = firstResult.invoiceNumber;
    const assignedToken = firstResult.downloadToken;

    // 2nd Arrival: Replay of identical gatewayPaymentId
    const secondResult = await confirmPayment(notification, testSecret);
    expect(secondResult.success).toBe(true);
    expect(secondResult.isReplay).toBe(true);
    expect(secondResult.invoiceNumber).toBe(assignedInvoice); // Same invoice!
    expect(secondResult.downloadToken).toBeDefined();

    // Verify only 1 invoice exists in the database
    const invoicesCount = await prisma.invoice.count();
    expect(invoicesCount).toBe(1);
  });
});
