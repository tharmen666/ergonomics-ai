import crypto from 'crypto';
import { getEnv } from '@/lib/env';

export type DocumentStatus = 'draft' | 'under_review' | 'signed_verified' | 'delivered';
export type ReviewerBody = 'SAIOSH' | 'SACPCMP' | 'OTHER';

export interface AuditEvent {
  timestamp: string;
  actor: string;
  from: DocumentStatus;
  to: DocumentStatus;
  note?: string;
}

export interface DocumentStateModel {
  id: string;
  version: number;
  status: DocumentStatus;
  contentHash: string;
  reviewerName?: string;
  reviewerBody?: ReviewerBody;
  reviewerRegNo?: string;
  verifiedOn?: string;
  seal?: string;
  history: AuditEvent[];
}

export class StateTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StateTransitionError';
  }
}

/**
 * Computes deterministic HMAC-SHA256 seal over:
 * [contentHash, reviewerName, reviewerBody, reviewerRegNo, verifiedOn]
 */
export function computeSeal(
  contentHash: string,
  reviewerName: string,
  reviewerBody: string,
  reviewerRegNo: string,
  verifiedOn: string,
  secretOverride?: string
): string {
  const secret = secretOverride ?? getEnv().DOC_SEAL_SECRET;
  const payload = [contentHash, reviewerName, reviewerBody, reviewerRegNo, verifiedOn].join(':');
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Alias for backward compatibility.
 */
export function generateHmacSeal(
  contentHash: string,
  timestamp: string,
  regNo: string,
  secretOverride?: string
): string {
  return computeSeal(contentHash, 'Reviewer', 'SAIOSH', regNo, timestamp, secretOverride);
}

/**
 * Verifies that the document's seal matches its contentHash and reviewer credentials
 * using constant-time comparison to prevent timing attacks.
 */
export function verifySeal(doc: DocumentStateModel, secretOverride?: string): boolean {
  if (!doc.seal || !doc.reviewerName || !doc.reviewerBody || !doc.reviewerRegNo || !doc.verifiedOn) {
    return false;
  }

  try {
    const expected = computeSeal(
      doc.contentHash,
      doc.reviewerName,
      doc.reviewerBody,
      doc.reviewerRegNo,
      doc.verifiedOn,
      secretOverride
    );

    const sealBuf = Buffer.from(doc.seal, 'utf-8');
    const expectedBuf = Buffer.from(expected, 'utf-8');

    if (sealBuf.length !== expectedBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(sealBuf, expectedBuf);
  } catch {
    return false;
  }
}

/**
 * Single gate determining whether a document is legally authorized for client download.
 * Requires: status is signed_verified or delivered, order is paid, and verifySeal passes.
 */
export function canDownload(doc: DocumentStateModel, orderPaid: boolean, secretOverride?: string): boolean {
  if (!orderPaid) return false;
  if (doc.status !== 'signed_verified' && doc.status !== 'delivered') return false;
  return verifySeal(doc, secretOverride);
}

export interface TransitionPayload {
  actor?: string;
  note?: string;
  reviewerName?: string;
  reviewerBody?: ReviewerBody;
  reviewerRegNo?: string;
  reviewedContentHash?: string;
  newContentHash?: string;
  orderPaid?: boolean;
}

/**
 * Pure transition function for the statutory document lifecycle.
 * Appends immutable audit events and throws StateTransitionError on any guard violation.
 */
export function transitionDocument(
  current: DocumentStateModel,
  action: 'submit_for_review' | 'reject' | 'sign' | 'deliver' | 'edit',
  payload?: TransitionPayload
): DocumentStateModel {
  const timestamp = new Date().toISOString();
  const actor = payload?.actor || 'system';
  const history = current.history ? [...current.history] : [];

  // EVENT: EDIT (Any state can be edited; clears signature, bumps version, reverts to draft)
  if (action === 'edit') {
    const next: DocumentStateModel = {
      ...current,
      version: current.version + 1,
      status: 'draft',
      contentHash: payload?.newContentHash || current.contentHash,
      reviewerName: undefined,
      reviewerBody: undefined,
      reviewerRegNo: undefined,
      verifiedOn: undefined,
      seal: undefined,
      history: [
        ...history,
        {
          timestamp,
          actor,
          from: current.status,
          to: 'draft',
          note: payload?.note || 'Document content edited: cleared previous signature, bumped version to draft.',
        },
      ],
    };
    return next;
  }

  // EVENT: SUBMIT FOR REVIEW (draft -> under_review)
  if (action === 'submit_for_review') {
    if (current.status !== 'draft') {
      throw new StateTransitionError(`Cannot submit for review from status '${current.status}'. Must be 'draft'.`);
    }
    return {
      ...current,
      status: 'under_review',
      history: [
        ...history,
        {
          timestamp,
          actor,
          from: 'draft',
          to: 'under_review',
          note: payload?.note || 'Submitted for professional consultant review.',
        },
      ],
    };
  }

  // EVENT: REJECT (under_review -> draft, requires notes of 10+ characters)
  if (action === 'reject') {
    if (current.status !== 'under_review') {
      throw new StateTransitionError(`Cannot reject document from status '${current.status}'. Must be 'under_review'.`);
    }
    const note = payload?.note?.trim() || '';
    if (note.length < 10) {
      throw new StateTransitionError('Rejection requires descriptive review notes of at least 10 characters explaining required changes.');
    }
    return {
      ...current,
      status: 'draft',
      history: [
        ...history,
        {
          timestamp,
          actor,
          from: 'under_review',
          to: 'draft',
          note,
        },
      ],
    };
  }

  // EVENT: SIGN (under_review -> signed_verified)
  if (action === 'sign') {
    if (current.status !== 'under_review') {
      throw new StateTransitionError(`Cannot sign document from status '${current.status}'. Document must be in 'under_review'.`);
    }

    if (!payload?.reviewerName || !payload.reviewerName.trim()) {
      throw new StateTransitionError('Signing requires a valid reviewer name.');
    }
    if (!payload?.reviewerBody || !['SAIOSH', 'SACPCMP', 'OTHER'].includes(payload.reviewerBody)) {
      throw new StateTransitionError('Signing requires a recognized professional body (SAIOSH, SACPCMP, or OTHER).');
    }
    if (!payload?.reviewerRegNo || payload.reviewerRegNo.trim().length < 3) {
      throw new StateTransitionError('Signing requires a valid professional registration number format.');
    }

    // Stale review guard: reviewedContentHash must strictly match active contentHash
    if (payload.reviewedContentHash && payload.reviewedContentHash !== current.contentHash) {
      throw new StateTransitionError(
        `Stale content hash rejected: Reviewer evaluated hash '${payload.reviewedContentHash}', but active document hash is '${current.contentHash}'.`
      );
    }

    const verifiedOn = timestamp;
    const seal = computeSeal(
      current.contentHash,
      payload.reviewerName,
      payload.reviewerBody,
      payload.reviewerRegNo,
      verifiedOn
    );

    return {
      ...current,
      status: 'signed_verified',
      reviewerName: payload.reviewerName,
      reviewerBody: payload.reviewerBody,
      reviewerRegNo: payload.reviewerRegNo,
      verifiedOn,
      seal,
      history: [
        ...history,
        {
          timestamp,
          actor,
          from: 'under_review',
          to: 'signed_verified',
          note: `Signed and verified by ${payload.reviewerName} (${payload.reviewerBody}: ${payload.reviewerRegNo}).`,
        },
      ],
    };
  }

  // EVENT: DELIVER (signed_verified -> delivered, requires orderPaid and valid seal)
  if (action === 'deliver') {
    if (current.status !== 'signed_verified') {
      throw new StateTransitionError(`Cannot deliver document from status '${current.status}'. Must be 'signed_verified'.`);
    }
    if (payload?.orderPaid !== true) {
      throw new StateTransitionError('Delivery blocked: Client order has not been confirmed as paid.');
    }
    if (!verifySeal(current)) {
      throw new StateTransitionError('Delivery blocked: Cryptographic seal verification failed or seal has been tampered.');
    }

    return {
      ...current,
      status: 'delivered',
      history: [
        ...history,
        {
          timestamp,
          actor,
          from: 'signed_verified',
          to: 'delivered',
          note: payload?.note || 'Document formally released and delivered to client.',
        },
      ],
    };
  }

  throw new StateTransitionError(`Unknown or illegal state action '${action}' from status '${current.status}'.`);
}
