import { describe, it, expect } from 'vitest';
import { 
  DocumentStateModel, 
  transitionDocument, 
  verifySeal, 
  canDownload, 
  StateTransitionError 
} from '@/lib/compliance/document-state';

describe('Phase 4: Document State Machine & Cryptographic Seal Integrity', () => {
  const initialDoc: DocumentStateModel = {
    id: 'doc_statutory_001',
    version: 1,
    status: 'draft',
    contentHash: 'hash_abc1234567890def',
    history: [],
  };

  it('runs complete positive lifecycle: draft -> review -> sign -> deliver', () => {
    // 1. Submit for review
    const inReview = transitionDocument(initialDoc, 'submit_for_review', { actor: 'consultant' });
    expect(inReview.status).toBe('under_review');
    expect(inReview.history).toHaveLength(1);

    // 2. Sign
    const signed = transitionDocument(inReview, 'sign', {
      reviewerName: 'John Doe',
      reviewerBody: 'SAIOSH',
      reviewerRegNo: 'SAIOSH-2026-101',
      reviewedContentHash: inReview.contentHash,
      actor: 'John Doe',
    });
    expect(signed.status).toBe('signed_verified');
    expect(signed.seal).toBeDefined();
    expect(verifySeal(signed)).toBe(true);

    // 3. Deliver (when order is paid)
    const delivered = transitionDocument(signed, 'deliver', { orderPaid: true });
    expect(delivered.status).toBe('delivered');
    expect(canDownload(delivered, true)).toBe(true);
  });

  it('negative test: cannot download unsigned document even if order is paid', () => {
    const inReview = transitionDocument(initialDoc, 'submit_for_review');
    expect(canDownload(initialDoc, true)).toBe(false);
    expect(canDownload(inReview, true)).toBe(false);
  });

  it('negative test: cannot sign a stale content hash', () => {
    const inReview = transitionDocument(initialDoc, 'submit_for_review');

    expect(() => {
      transitionDocument(inReview, 'sign', {
        reviewerName: 'John Doe',
        reviewerBody: 'SAIOSH',
        reviewerRegNo: 'SAIOSH-2026-101',
        reviewedContentHash: 'outdated_stale_hash_value_xyz', // Stale!
      });
    }).toThrow(StateTransitionError);

    expect(() => {
      transitionDocument(inReview, 'sign', {
        reviewerName: 'John Doe',
        reviewerBody: 'SAIOSH',
        reviewerRegNo: 'SAIOSH-2026-101',
        reviewedContentHash: 'outdated_stale_hash_value_xyz',
      });
    }).toThrow(/Stale content hash rejected/);
  });

  it('negative test: cannot sign without professional registration number', () => {
    const inReview = transitionDocument(initialDoc, 'submit_for_review');

    expect(() => {
      transitionDocument(inReview, 'sign', {
        reviewerName: 'John Doe',
        reviewerBody: 'SAIOSH',
        reviewerRegNo: '', // Missing
      });
    }).toThrow(/registration number format/);
  });

  it('negative test: tampering with contentHash, reviewerName or body after signing invalidates seal', () => {
    const inReview = transitionDocument(initialDoc, 'submit_for_review');
    const signed = transitionDocument(inReview, 'sign', {
      reviewerName: 'John Doe',
      reviewerBody: 'SAIOSH',
      reviewerRegNo: 'SAIOSH-2026-101',
      reviewedContentHash: inReview.contentHash,
    });

    expect(verifySeal(signed)).toBe(true);

    // Tamper content hash
    const tamperedHash = { ...signed, contentHash: 'tampered_content_hash' };
    expect(verifySeal(tamperedHash)).toBe(false);
    expect(canDownload(tamperedHash, true)).toBe(false);

    // Tamper reviewer name
    const tamperedReviewer = { ...signed, reviewerName: 'Imposter Name' };
    expect(verifySeal(tamperedReviewer)).toBe(false);

    // Tamper reviewer body
    const tamperedBody = { ...signed, reviewerBody: 'OTHER' as const };
    expect(verifySeal(tamperedBody)).toBe(false);
  });

  it('negative test: delivery blocked when order is unpaid', () => {
    const inReview = transitionDocument(initialDoc, 'submit_for_review');
    const signed = transitionDocument(inReview, 'sign', {
      reviewerName: 'John Doe',
      reviewerBody: 'SAIOSH',
      reviewerRegNo: 'SAIOSH-2026-101',
    });

    expect(() => {
      transitionDocument(signed, 'deliver', { orderPaid: false }); // Unpaid!
    }).toThrow(/Delivery blocked: Client order has not been confirmed as paid/);

    expect(canDownload(signed, false)).toBe(false);
  });

  it('edit clears signature, credentials, seal, bumps version, and returns to draft', () => {
    const inReview = transitionDocument(initialDoc, 'submit_for_review');
    const signed = transitionDocument(inReview, 'sign', {
      reviewerName: 'John Doe',
      reviewerBody: 'SAIOSH',
      reviewerRegNo: 'SAIOSH-2026-101',
    });

    const edited = transitionDocument(signed, 'edit', {
      newContentHash: 'new_edited_hash_999',
      note: 'Updated emergency exit layout',
    });

    expect(edited.status).toBe('draft');
    expect(edited.version).toBe(2);
    expect(edited.contentHash).toBe('new_edited_hash_999');
    expect(edited.seal).toBeUndefined();
    expect(edited.reviewerName).toBeUndefined();
    expect(edited.reviewerRegNo).toBeUndefined();
    expect(edited.verifiedOn).toBeUndefined();
    expect(canDownload(edited, true)).toBe(false);
  });

  it('reject event requires notes of at least 10 characters', () => {
    const inReview = transitionDocument(initialDoc, 'submit_for_review');

    // Too short note (< 10 chars)
    expect(() => {
      transitionDocument(inReview, 'reject', { note: 'Fix this' });
    }).toThrow(/Rejection requires descriptive review notes of at least 10 characters/);

    // Valid note (>= 10 chars)
    const rejected = transitionDocument(inReview, 'reject', {
      note: 'Please upload the gas certificate for the kitchen LPG manifold.',
    });
    expect(rejected.status).toBe('draft');
    expect(rejected.history.slice(-1)[0].note).toContain('gas certificate');
  });
});
