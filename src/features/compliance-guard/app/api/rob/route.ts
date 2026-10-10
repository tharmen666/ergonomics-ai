import { NextResponse } from 'next/server';
import { z } from 'zod';
import { queryGroundedRob } from '@/lib/rob/grounded';
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rate-limiter';

const RobQuerySchema = z.object({
  question: z.string().min(1, 'Question cannot be empty').max(500, 'Question too long'),
});

const MAX_BODY_BYTES = 16 * 1024; // 16 KB max

export async function POST(request: Request) {
  // 1. Rate Limiting
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(`rob:${clientId}`, { windowMs: 60 * 1000, max: 30 });
  if (!rateLimit.allowed) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(rateLimit.retryAfterSecs),
        'Cache-Control': 'no-store',
      },
    });
  }

  // 2. Body Size Cap
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
    const parsed = RobQuerySchema.parse(json);

    const robResponse = queryGroundedRob(parsed.question);

    return NextResponse.json({
      answer: robResponse.answer,
      citationsUsed: robResponse.citationsUsed,
      disclosure: 'ROB is an AI assistant, not a human consultant. Answers are limited to the cited provisions and are not legal advice.',
    });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid query format', details: err.errors?.map((e: any) => e.message) },
        { status: 400 }
      );
    }
    return new NextResponse('Bad Request', { status: 400 });
  }
}
