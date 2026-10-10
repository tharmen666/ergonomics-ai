import { NextResponse } from 'next/server';
import { db } from '@/lib/db/repo';
import jwt from 'jsonwebtoken';
import { canDownload, DocumentStateModel } from '@/lib/compliance/document-state';
import { generateComplianceManualPdf } from '@/lib/export/pdf-generator';
import { generateComplianceManualDocx } from '@/lib/export/docx-generator';
import { getEnv } from '@/lib/env';

/**
 * Uniform 403 response helper.
 * STRICT NON-NEGOTIABLE RULE:
 * Every failure returns the identical response: 403 Forbidden with Cache-Control: no-store.
 * No distinct error messages are leaked ("unpaid", "not signed", "expired").
 */
function forbiddenResponse(): NextResponse {
  return new NextResponse('Forbidden', {
    status: 403,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ docId: string }> | { docId: string } }
) {
  const params = await Promise.resolve(context.params);
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return forbiddenResponse();
  }

  try {
    const tokenSecret = getEnv().DOWNLOAD_TOKEN_SECRET;

    // 1. Token validation: Pin algorithm to HS256, require exp, strictly reject alg: none
    let payload: any;
    try {
      payload = jwt.verify(token, tokenSecret, {
        algorithms: ['HS256'],
      });
    } catch {
      return forbiddenResponse();
    }

    if (!payload || typeof payload !== 'object') {
      return forbiddenResponse();
    }

    // Support both payload.doc and payload.docId for backward compatibility
    const tokenDocId = payload.doc || payload.docId;
    // 2. Check doc matches path
    if (tokenDocId !== params.docId) {
      return forbiddenResponse();
    }

    // 3. Format check: 'pdf', 'docx', or 'invoice'
    const requestedFmt = url.searchParams.get('format') || url.searchParams.get('fmt') || 'pdf';
    if (!['pdf', 'docx', 'invoice'].includes(requestedFmt)) {
      return forbiddenResponse();
    }
    if (payload.fmt && payload.fmt !== requestedFmt) {
      return forbiddenResponse();
    }

    // 4. Document loads from DB
    const docRecord = await db.documents.findById(params.docId);
    if (!docRecord) {
      return forbiddenResponse();
    }

    // Parse DocumentStateModel
    const docModel: DocumentStateModel = {
      id: docRecord.id,
      version: docRecord.version,
      status: docRecord.status,
      contentHash: docRecord.contentHash,
      reviewerName: docRecord.reviewerName,
      reviewerBody: docRecord.reviewerBody as any,
      reviewerRegNo: docRecord.reviewerRegNo,
      verifiedOn: docRecord.verifiedOn,
      seal: docRecord.seal,
      history: docRecord.history ? JSON.parse(docRecord.history) : [],
    };

    // 5. Order loads and matches
    const order = await db.orders.findByDocId(params.docId);
    if (!order) {
      return forbiddenResponse();
    }
    const tokenOrderId = payload.order || payload.orderId;
    if (tokenOrderId && tokenOrderId !== order.id && tokenOrderId !== order.ref) {
      return forbiddenResponse();
    }

    // 6. canDownload gate: status is signed_verified or delivered, order is paid, and verifySeal passes
    const isPaid = order.status === 'paid';
    if (!canDownload(docModel, isPaid)) {
      return forbiddenResponse();
    }

    // 7. Atomic download use-count check and consumption
    const jti = payload.jti || token;
    const maxUses = getEnv().MAX_DOWNLOAD_USES ?? 3;
    const usageResult = await db.downloads.consumeAtomicUse(jti, maxUses);
    if (!usageResult.allowed) {
      return forbiddenResponse();
    }

    // 8. Serve content generated from the signed content snapshot
    let snapshotContent: any = {};
    try {
      snapshotContent = JSON.parse(docRecord.content || '{}');
    } catch {
      snapshotContent = {};
    }

    let fileBuffer: Buffer;
    let contentType: string;
    let filename: string;

    if (requestedFmt === 'docx') {
      fileBuffer = await generateComplianceManualDocx(docModel, {
        businessName: order.clientName || 'Statutory OHS File',
        content: snapshotContent,
      });
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      filename = `SafetyFile_${params.docId}.docx`;
    } else {
      // Default to PDF
      const pdfResult = await generateComplianceManualPdf(docModel, {
        businessName: order.clientName || 'Statutory OHS File',
        docId: params.docId,
        content: snapshotContent,
      });
      fileBuffer = pdfResult.buffer;
      contentType = 'application/pdf';
      filename = `SafetyFile_${params.docId}.pdf`;
    }

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (_err) {
    return forbiddenResponse();
  }
}
