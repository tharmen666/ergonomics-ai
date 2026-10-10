import { describe, it, expect, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { GET } from '@/app/api/downloads/[docId]/route';
import { db } from '@/lib/db/repo';
import { prisma } from '@/lib/db/prisma';
import { transitionDocument, DocumentStateModel } from '@/lib/compliance/document-state';
import { getEnv } from '@/lib/env';

describe('Secure Document Download Route API & Cryptographic Seal Verification', () => {
  const docId = 'doc_test_download_001';
  let tokenSecret: string;

  beforeEach(async () => {
    tokenSecret = getEnv().DOWNLOAD_TOKEN_SECRET;
    await prisma.downloadUse.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.order.deleteMany();
    await prisma.document.deleteMany();
  });

  it('rejects requests without token with uniform 403 Forbidden', async () => {
    const req = new Request(`http://localhost:3000/api/downloads/${docId}`);
    const res = await GET(req, { params: Promise.resolve({ docId }) });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe('Forbidden');
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('rejects requests with forged/tampered token with uniform 403 Forbidden', async () => {
    const forgedToken = jwt.sign({ doc: docId, exp: Math.floor(Date.now() / 1000) + 900 }, 'invalid-forged-secret-key');
    const req = new Request(`http://localhost:3000/api/downloads/${docId}?token=${forgedToken}`);
    const res = await GET(req, { params: Promise.resolve({ docId }) });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe('Forbidden');
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('rejects requests with expired token with uniform 403 Forbidden', async () => {
    const expiredToken = jwt.sign(
      { doc: docId, exp: Math.floor(Date.now() / 1000) - 3600 },
      tokenSecret
    );
    const req = new Request(`http://localhost:3000/api/downloads/${docId}?token=${expiredToken}`);
    const res = await GET(req, { params: Promise.resolve({ docId }) });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe('Forbidden');
  });

  it('rejects requests with token for a different docId with uniform 403 Forbidden', async () => {
    const mismatchedToken = jwt.sign(
      { doc: 'doc_other_site_999', exp: Math.floor(Date.now() / 1000) + 900 },
      tokenSecret
    );
    const req = new Request(`http://localhost:3000/api/downloads/${docId}?token=${mismatchedToken}`);
    const res = await GET(req, { params: Promise.resolve({ docId }) });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe('Forbidden');
  });

  it('rejects tokens signed with alg: none with uniform 403 Forbidden', async () => {
    // Construct unsigned JWT (alg: none)
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ doc: docId, exp: Math.floor(Date.now() / 1000) + 900 })).toString('base64url');
    const algNoneToken = `${header}.${payload}.`;

    const req = new Request(`http://localhost:3000/api/downloads/${docId}?token=${algNoneToken}`);
    const res = await GET(req, { params: Promise.resolve({ docId }) });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe('Forbidden');
  });

  it('rejects download with uniform 403 Forbidden if cryptographic seal is tampered', async () => {
    const tamperedDocId = 'doc_tampered_seal_999';

    // Seed document with a corrupt/tampered seal
    await db.documents.save({
      id: tamperedDocId,
      status: 'signed_verified',
      version: 1,
      contentHash: 'genuine_content_hash_123',
      reviewerName: 'Professional Auditor',
      reviewerBody: 'SAIOSH',
      reviewerRegNo: 'SAIOSH-2026-8831',
      verifiedOn: '2026-10-06T12:00:00.000Z',
      seal: 'corrupted_or_forged_seal_value_abc', // Invalid seal!
      content: JSON.stringify({ summary: 'Test content' }),
    });

    // Also seed paid order
    await db.orders.save({
      ref: `ord_${tamperedDocId}`,
      docId: tamperedDocId,
      status: 'paid',
      amountCents: 350000,
      email: 'client@example.com',
    });

    const validToken = jwt.sign(
      { doc: tamperedDocId, exp: Math.floor(Date.now() / 1000) + 900 },
      tokenSecret
    );

    const req = new Request(`http://localhost:3000/api/downloads/${tamperedDocId}?token=${validToken}`);
    const res = await GET(req, { params: Promise.resolve({ docId: tamperedDocId }) });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe('Forbidden');
  });

  it('rejects download with uniform 403 Forbidden if order is unpaid', async () => {
    const unpaidDocId = 'doc_unpaid_order_001';

    const rawDoc: DocumentStateModel = {
      id: unpaidDocId,
      version: 1,
      status: 'under_review',
      contentHash: 'hash_unpaid_1234567890123456789012345678901234567890',
      history: [],
    };
    const signed = transitionDocument(rawDoc, 'sign', {
      reviewerName: 'Professional Auditor',
      reviewerBody: 'SAIOSH',
      reviewerRegNo: 'SAIOSH-2026-9901',
      reviewedContentHash: rawDoc.contentHash,
    });

    await db.documents.save({
      id: signed.id,
      status: signed.status,
      version: signed.version,
      contentHash: signed.contentHash,
      reviewerName: signed.reviewerName,
      reviewerBody: signed.reviewerBody,
      reviewerRegNo: signed.reviewerRegNo,
      verifiedOn: signed.verifiedOn,
      seal: signed.seal,
      content: JSON.stringify({ summary: 'Valid content' }),
    });

    // Seed UNPAID order
    await db.orders.save({
      ref: `ord_${unpaidDocId}`,
      docId: unpaidDocId,
      status: 'pending', // Unpaid!
      amountCents: 350000,
      email: 'client@example.com',
    });

    const token = jwt.sign(
      { doc: unpaidDocId, exp: Math.floor(Date.now() / 1000) + 900 },
      tokenSecret
    );

    const req = new Request(`http://localhost:3000/api/downloads/${unpaidDocId}?token=${token}`);
    const res = await GET(req, { params: Promise.resolve({ docId: unpaidDocId }) });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toBe('Forbidden');
  });

  it('serves valid PDF stream for authorized paid document up to max uses, then locks out', async () => {
    const validDocId = 'doc_auth_download_001';
    const rawDoc: DocumentStateModel = {
      id: validDocId,
      version: 1,
      status: 'under_review',
      contentHash: 'hash_auth_1234567890123456789012345678901234567890',
      history: [],
    };
    const signed = transitionDocument(rawDoc, 'sign', {
      reviewerName: 'Professional Auditor',
      reviewerBody: 'SAIOSH',
      reviewerRegNo: 'SAIOSH-2026-9901',
      reviewedContentHash: rawDoc.contentHash,
    });

    await db.documents.save({
      id: signed.id,
      status: signed.status,
      version: signed.version,
      contentHash: signed.contentHash,
      reviewerName: signed.reviewerName,
      reviewerBody: signed.reviewerBody,
      reviewerRegNo: signed.reviewerRegNo,
      verifiedOn: signed.verifiedOn,
      seal: signed.seal,
      content: JSON.stringify({ summary: 'Valid verified safety file' }),
    });

    const order = await db.orders.save({
      ref: `ord_${validDocId}`,
      docId: validDocId,
      status: 'paid',
      amountCents: 350000,
      email: 'client@example.com',
    });

    const jti = 'jti_test_download_token_123';
    const validToken = jwt.sign(
      {
        jti,
        doc: validDocId,
        order: order.id,
        fmt: 'pdf',
        exp: Math.floor(Date.now() / 1000) + 900,
      },
      tokenSecret
    );

    // Max uses configured in vitest is 5
    for (let i = 1; i <= 5; i++) {
      const req = new Request(`http://localhost:3000/api/downloads/${validDocId}?token=${validToken}`);
      const res = await GET(req, { params: Promise.resolve({ docId: validDocId }) });
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('application/pdf');
      expect(res.headers.get('content-disposition')).toContain(`SafetyFile_${validDocId}.pdf`);
      expect(res.headers.get('cache-control')).toBe('no-store');
      expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    }

    // 6th attempt must fail with 403 Forbidden
    const lockedReq = new Request(`http://localhost:3000/api/downloads/${validDocId}?token=${validToken}`);
    const lockedRes = await GET(lockedReq, { params: Promise.resolve({ docId: validDocId }) });
    expect(lockedRes.status).toBe(403);
    const lockedText = await lockedRes.text();
    expect(lockedText).toBe('Forbidden');
  });
});
