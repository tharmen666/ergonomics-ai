import { db } from '@/lib/db/repo';
import { transitionDocument, DocumentStateModel } from './document-state';

export interface ConsultantSession {
  userId: string;
  role: 'consultant' | 'admin' | 'client';
}

export interface ConsultantProfile {
  name: string;
  professionalBody: 'SAIOSH' | 'SACPCMP' | 'OTHER';
  registrationNumber: string;
  verifiedActive: boolean;
}

/**
 * Authentication and Consultant Verification Stub.
 * STRICT SECURITY REQUIREMENT:
 * Must fail closed (denies everyone) unless a genuine authenticated consultant session
 * with a verified professional profile is wired into the system.
 */
export async function getAuthenticatedConsultant(
  request: Request
): Promise<{ session: ConsultantSession; profile: ConsultantProfile } | null> {
  // Check for authorization header or secure session cookie
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Fails closed: Denies all unauthenticated requests
    return null;
  }

  // NOTE FOR AUDITORS: Wire your production identity provider (e.g. NextAuth/Auth.js, Clerk, WorkOS) here.
  // Reviewer identity must come exclusively from the authenticated session and stored database profile,
  // NEVER trusted from untrusted client request bodies.
  return null;
}

/**
 * Signs a document as a verified human OHS consultant.
 * Rejects untrusted request bodies; reviewer credentials are pulled exclusively from stored profile.
 */
export async function signAsConsultant(params: {
  docId: string;
  session: ConsultantSession;
  profile: ConsultantProfile;
  reviewedContentHash: string;
}): Promise<DocumentStateModel> {
  if (params.session.role !== 'consultant') {
    throw new Error('Access Denied: User does not hold the required consultant role.');
  }

  if (!params.profile.verifiedActive || !params.profile.registrationNumber) {
    throw new Error('Access Denied: Inactive or unverified professional registration number.');
  }

  const docRecord = await db.documents.findById(params.docId);
  if (!docRecord) {
    throw new Error(`Document not found: ${params.docId}`);
  }

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

  const signed = transitionDocument(docModel, 'sign', {
    actor: params.session.userId,
    reviewerName: params.profile.name,
    reviewerBody: params.profile.professionalBody,
    reviewerRegNo: params.profile.registrationNumber,
    reviewedContentHash: params.reviewedContentHash,
  });

  await db.documents.save({
    id: signed.id,
    version: signed.version,
    status: signed.status,
    contentHash: signed.contentHash,
    reviewerName: signed.reviewerName,
    reviewerBody: signed.reviewerBody,
    reviewerRegNo: signed.reviewerRegNo,
    verifiedOn: signed.verifiedOn,
    seal: signed.seal,
    history: JSON.stringify(signed.history),
  });

  return signed;
}
