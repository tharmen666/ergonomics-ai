import { NextResponse } from 'next/server';
import { siteIntakeSchema, evaluateSiteCompliance } from '@/lib/compliance';
import { db } from '@/lib/db/repo';
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rate-limiter';
import crypto from 'crypto';

const MAX_BODY_BYTES = 64 * 1024; // 64 KB max

export async function POST(request: Request) {
  // 1. Rate Limiting Pass
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(`intake:${clientId}`, { windowMs: 60 * 1000, max: 20 });
  if (!rateLimit.allowed) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(rateLimit.retryAfterSecs),
        'Cache-Control': 'no-store',
      },
    });
  }

  // 2. Request Body Size Capping
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_BODY_BYTES) {
    return new NextResponse('Payload Too Large', { status: 413 });
  }

  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return new NextResponse('Payload Too Large', { status: 413 });
    }

    const json = JSON.parse(rawBody);
    // 3. Strict Zod Schema Validation
    const intake = siteIntakeSchema.parse(json);

    // 4. Evaluate site compliance
    const evaluation = evaluateSiteCompliance(intake);

    const docId = `doc_${crypto.randomBytes(12).toString('hex')}`;
    const orderRef = `ord_${crypto.randomBytes(12).toString('hex')}`;
    const contentPayload = {
      summary: `Statutory OHS Manual for ${intake.branchName}`,
      statutoryCitations: evaluation.citationsUsed,
      obligations: evaluation.obligations,
      intake,
    };
    const contentString = JSON.stringify(contentPayload);
    const contentHash = crypto.createHash('sha256').update(contentString).digest('hex');

    // 5. Persist Draft Document
    await db.documents.save({
      id: docId,
      status: 'draft',
      version: 1,
      contentHash,
      content: contentString,
      intake: JSON.stringify(intake),
    });

    // 6. Persist Associated Order
    await db.orders.save({
      ref: orderRef,
      docId,
      amountCents: 350000,
      email: json.email || 'client@example.com',
      clientName: intake.employerName,
      clientAddress: intake.address,
    });

    return NextResponse.json({
      success: true,
      docId,
      orderRef,
      evaluation: {
        s17RepsRequired: evaluation.s17RepsRequired,
        firstAidersRequired: evaluation.firstAidersRequired,
        fireMarshalsRecommended: evaluation.fireMarshalsRecommended,
        citationsUsed: evaluation.citationsUsed,
      },
    });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid intake request data', details: err.errors?.map((e: any) => e.message) },
        { status: 400 }
      );
    }
    return new NextResponse('Bad Request', { status: 400 });
  }
}
