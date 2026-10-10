import { NextResponse } from 'next/server';
import { confirmPayment, PaymentNotification } from '@/lib/payments/webhook';

export async function POST(request: Request) {
  try {
    const body: PaymentNotification = await request.json();

    // Check signature from header or body
    const headerSig = request.headers.get('x-webhook-signature');
    if (headerSig && !body.signature) {
      body.signature = headerSig;
    }

    const result = await confirmPayment(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment confirmation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        invoiceNumber: result.invoiceNumber,
        downloadUrl: result.downloadUrl,
        isReplay: result.isReplay,
      },
      { status: 200 }
    );
  } catch (_err) {
    return NextResponse.json(
      { error: 'Bad Request: Malformed webhook notification' },
      { status: 400 }
    );
  }
}
