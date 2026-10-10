import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedConsultant, signAsConsultant } from '@/lib/compliance/consultant-service';
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rate-limiter';

const SignRequestSchema = z.object({
  reviewedContentHash: z.string().min(1, 'reviewedContentHash is required'),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ docId: string }> | { docId: string } }
) {
  const params = await Promise.resolve(context.params);

  // 1. Rate Limiting
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(`sign:${clientId}`, { windowMs: 60 * 1000, max: 10 });
  if (!rateLimit.allowed) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // 2. Authentication and Role Verification (Fails closed)
  const auth = await getAuthenticatedConsultant(request);
  if (!auth) {
    return NextResponse.json(
      {
        error: 'Unauthorized: Consultant authentication required. Reviewer credentials are not accepted from untrusted request bodies.',
        code: 'AUTH_REQUIRED',
      },
      { status: 401 }
    );
  }

  try {
    const json = await request.json();
    const parsed = SignRequestSchema.parse(json);

    const signedDoc = await signAsConsultant({
      docId: params.docId,
      session: auth.session,
      profile: auth.profile,
      reviewedContentHash: parsed.reviewedContentHash,
    });

    return NextResponse.json({
      success: true,
      docId: signedDoc.id,
      status: signedDoc.status,
      verifiedOn: signedDoc.verifiedOn,
      seal: signedDoc.seal,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Signing failed' },
      { status: 400 }
    );
  }
}
