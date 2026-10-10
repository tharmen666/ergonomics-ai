import { NextResponse } from 'next/server';
import { confirmPayment, PaymentNotification } from '@/lib/payments/webhook';

/**
 * PayFast ITN (Instant Transaction Notification) Webhook Endpoint
 * 
 * Strict behavior:
 * - Reads raw body
 * - Verifies HMAC signature with timingSafeEqual
 * - Requires status 'COMPLETE'
 * - Verifies integer cent amounts match expected order total
 * - Replay returns 200 OK with no duplicate side effects
 * - Any validation failure returns 400 and changes nothing in database
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let notification: PaymentNotification;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const rawText = await request.text();
      const params = new URLSearchParams(rawText);
      const data: Record<string, string> = {};
      params.forEach((value, key) => {
        data[key] = value;
      });

      // PayFast ITN standard parameter mapping:
      // pf_payment_id -> gatewayPaymentId
      // m_payment_id -> orderId / ref
      // custom_str1 -> docId
      // amount_gross -> amount in Rands -> convert to integer cents
      const grossFloat = parseFloat(data.amount_gross || '0');
      const amountCents = Math.round(grossFloat * 100);

      notification = {
        gatewayPaymentId: data.pf_payment_id || data.gatewayPaymentId || '',
        orderId: data.m_payment_id || data.orderId || '',
        docId: data.custom_str1 || data.docId || '',
        amountCents,
        currency: 'ZAR',
        status: (data.payment_status === 'COMPLETE' || data.status === 'COMPLETE') ? 'COMPLETE' : 'FAILED',
        signature: data.signature,
        customerName: data.name_first ? `${data.name_first} ${data.name_last || ''}`.trim() : undefined,
        customerEmail: data.email_address,
      };
    } else {
      const body = await request.json();
      notification = body;
      const headerSig = request.headers.get('x-webhook-signature');
      if (headerSig && !notification.signature) {
        notification.signature = headerSig;
      }
    }

    const result = await confirmPayment(notification);

    if (!result.success) {
      return new NextResponse(result.error || 'Payment confirmation failed', {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    return NextResponse.json(
      {
        success: true,
        invoiceNumber: result.invoiceNumber,
        downloadUrl: result.downloadUrl,
        isReplay: result.isReplay,
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  } catch (_err) {
    return new NextResponse('Bad Request: Malformed notification payload', {
      status: 400,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
