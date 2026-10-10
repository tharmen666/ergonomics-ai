import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db/repo';
import { getEnv } from '@/lib/env';
import { transitionDocument, DocumentStateModel } from '@/lib/compliance/document-state';

export interface PaymentNotification {
  gatewayPaymentId: string;
  orderId: string;
  docId: string;
  amountCents: number;
  currency: string;
  status: 'COMPLETE' | 'FAILED' | 'PENDING' | 'CANCELLED';
  signature?: string;
  customerName?: string;
  customerEmail?: string;
  timestamp?: string;
}

export interface PaymentConfirmationResult {
  success: boolean;
  gatewayPaymentId: string;
  orderId: string;
  docId: string;
  invoiceNumber?: string;
  downloadToken?: string;
  downloadUrl?: string;
  processedAt: string;
  isReplay: boolean;
  error?: string;
}

/**
 * Computes deterministic HMAC-SHA256 signature over string or structured notification payload.
 */
export function computeWebhookSignature(payload: string | Record<string, any>, secret?: string): string {
  const hmacSecret = secret ?? getEnv().PAYFAST_PASSPHRASE;
  const normalizedString = typeof payload === 'string'
    ? payload
    : Object.keys(payload)
        .filter(k => k !== 'signature')
        .sort()
        .map(k => `${k}=${payload[k]}`)
        .join('&');

  return crypto.createHmac('sha256', hmacSecret).update(normalizedString).digest('hex');
}

/**
 * Validates HMAC signature using constant-time comparison to mitigate timing attacks.
 */
export function verifyWebhookSignature(
  payload: string | Record<string, any>,
  providedSignature: string,
  secret?: string
): boolean {
  if (!providedSignature) return false;
  try {
    const hmacSecret = secret ?? getEnv().PAYFAST_PASSPHRASE;
    const expected = computeWebhookSignature(payload, hmacSecret);
    const expectedBuf = Buffer.from(expected, 'utf-8');
    const providedBuf = Buffer.from(providedSignature, 'utf-8');

    if (expectedBuf.length !== providedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}

/**
 * Confirms payment with cryptographic signature verification,
 * strict idempotency via database unique constraint on gatewayPaymentId,
 * atomic invoice creation, and automatic delivery if already signed.
 */
export async function confirmPayment(
  notification: PaymentNotification,
  secret?: string
): Promise<PaymentConfirmationResult> {
  const processedAt = new Date().toISOString();

  // 1. Verify HMAC Signature with constant-time equality
  const signature = notification.signature;
  if (!signature || !verifyWebhookSignature(notification, signature, secret)) {
    return {
      success: false,
      gatewayPaymentId: notification.gatewayPaymentId,
      orderId: notification.orderId,
      docId: notification.docId,
      processedAt,
      isReplay: false,
      error: 'Access Denied: Invalid HMAC signature',
    };
  }

  // 2. Status Verification (Must be strictly COMPLETE)
  if (notification.status !== 'COMPLETE') {
    return {
      success: false,
      gatewayPaymentId: notification.gatewayPaymentId,
      orderId: notification.orderId,
      docId: notification.docId,
      processedAt,
      isReplay: false,
      error: `Payment Rejected: Status is '${notification.status}', expected 'COMPLETE'`,
    };
  }

  // 3. Check Order and Document in DB
  let order = await db.orders.findByRef(notification.orderId);
  if (!order) {
    order = await db.orders.findByDocId(notification.docId);
  }

  if (order && order.amountCents !== notification.amountCents) {
    return {
      success: false,
      gatewayPaymentId: notification.gatewayPaymentId,
      orderId: notification.orderId,
      docId: notification.docId,
      processedAt,
      isReplay: false,
      error: `Payment Amount Mismatch: Expected ${order.amountCents} cents, received ${notification.amountCents} cents`,
    };
  }

  // 4. Atomic Idempotent Confirmation via DB Repo
  const confirmResult = await db.orders.confirmPayment({
    orderRef: order?.ref ?? notification.orderId,
    gatewayPaymentId: notification.gatewayPaymentId,
    amountCents: notification.amountCents,
    invoiceData: {
      customerName: notification.customerName || order?.clientName,
      customerEmail: notification.customerEmail || order?.email,
      docId: notification.docId,
      amountCents: notification.amountCents,
    },
  });

  const isReplay = confirmResult.status === 'already_processed';
  const invoiceNumber = confirmResult.invoice?.number;

  // 5. Generate signed, short-lived download token (15 mins)
  // Claims: { jti, doc, order, fmt, exp }
  const jti = `jti_${crypto.randomBytes(16).toString('hex')}`;
  const nowUnix = Math.floor(Date.now() / 1000);
  const expUnix = nowUnix + 15 * 60; // 15 minutes

  const tokenPayload = {
    jti,
    doc: notification.docId,
    order: confirmResult.order.id,
    fmt: 'pdf',
    exp: expUnix,
  };

  const downloadToken = jwt.sign(tokenPayload, getEnv().DOWNLOAD_TOKEN_SECRET, {
    algorithm: 'HS256',
  });

  // 6. If document is already signed, deliver it
  const doc = await db.documents.findById(notification.docId);
  if (doc && doc.status === 'signed_verified') {
    const docModel: DocumentStateModel = {
      id: doc.id,
      version: doc.version,
      status: doc.status,
      contentHash: doc.contentHash,
      reviewerName: doc.reviewerName,
      reviewerBody: doc.reviewerBody as any,
      reviewerRegNo: doc.reviewerRegNo,
      verifiedOn: doc.verifiedOn,
      seal: doc.seal,
      history: doc.history ? JSON.parse(doc.history) : [],
    };
    const delivered = transitionDocument(docModel, 'deliver', { orderPaid: true });
    await db.documents.save({
      id: delivered.id,
      contentHash: delivered.contentHash,
      status: delivered.status,
      history: JSON.stringify(delivered.history),
    });
  }

  return {
    success: true,
    gatewayPaymentId: notification.gatewayPaymentId,
    orderId: notification.orderId,
    docId: notification.docId,
    invoiceNumber,
    downloadToken,
    downloadUrl: `/api/downloads/${notification.docId}?token=${downloadToken}`,
    processedAt,
    isReplay,
  };
}

export function resetPaymentIdempotency(): void {
  // DB-backed persistence does not use in-memory state.
}
