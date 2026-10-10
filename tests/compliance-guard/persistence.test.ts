import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/lib/db/repo';
import { prisma } from '@/lib/db/prisma';

describe('Phase 5: Real Persistence and Atomic Transactions', () => {
  beforeEach(async () => {
    // Clear test tables in reverse foreign key order
    await prisma.downloadUse.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.order.deleteMany();
    await prisma.document.deleteMany();
    await prisma.invoiceCounter.deleteMany();
  });

  it('generates consecutive, gap-free invoice numbers format INV-YYYY-NNNNNN with year from issue date', async () => {
    const order1 = await db.orders.save({
      ref: 'ord_seq_001',
      docId: 'doc_seq_001',
      amountCents: 350000,
      email: 'client1@example.com',
    });
    const order2 = await db.orders.save({
      ref: 'ord_seq_002',
      docId: 'doc_seq_002',
      amountCents: 350000,
      email: 'client2@example.com',
    });

    const specificDate = new Date('2026-06-15T10:00:00Z');
    const inv1 = await db.invoices.createSequentialInvoice({
      orderId: order1.id,
      invoiceData: { test: 1 },
      issueDate: specificDate,
    });
    const inv2 = await db.invoices.createSequentialInvoice({
      orderId: order2.id,
      invoiceData: { test: 2 },
      issueDate: specificDate,
    });

    expect(inv1.number).toBe('INV-2026-000001');
    expect(inv2.number).toBe('INV-2026-000002');
  });

  it('concurrent invoice creations receive distinct consecutive numbers', async () => {
    // Create 5 orders concurrently
    const orders = await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        db.orders.save({
          ref: `ord_concurrent_${i}`,
          docId: `doc_concurrent_${i}`,
          amountCents: 350000,
          email: `client_${i}@example.com`,
        })
      )
    );

    const issueDate = new Date('2026-01-01T00:00:00Z');
    // Concurrently create 5 invoices
    const invoices = await Promise.all(
      orders.map((o) =>
        db.invoices.createSequentialInvoice({
          orderId: o.id,
          invoiceData: { orderRef: o.ref },
          issueDate,
        })
      )
    );

    const numbers = invoices.map((inv) => inv.number).sort();
    expect(numbers).toEqual([
      'INV-2026-000001',
      'INV-2026-000002',
      'INV-2026-000003',
      'INV-2026-000004',
      'INV-2026-000005',
    ]);
  });

  it('a rolled-back transaction leaves no gap in invoice numbering', async () => {
    const orderGood1 = await db.orders.save({
      ref: 'ord_rollback_good1',
      docId: 'doc_rollback_good1',
      amountCents: 350000,
      email: 'good1@example.com',
    });
    const orderFail = await db.orders.save({
      ref: 'ord_rollback_fail',
      docId: 'doc_rollback_fail',
      amountCents: 350000,
      email: 'fail@example.com',
    });
    const orderGood2 = await db.orders.save({
      ref: 'ord_rollback_good2',
      docId: 'doc_rollback_good2',
      amountCents: 350000,
      email: 'good2@example.com',
    });

    const year = 2026;
    const issueDate = new Date('2026-05-01T00:00:00Z');

    // 1. First invoice created successfully
    const inv1 = await db.invoices.createSequentialInvoice({
      orderId: orderGood1.id,
      invoiceData: {},
      issueDate,
    });
    expect(inv1.number).toBe('INV-2026-000001');

    // 2. Second transaction increments counter but fails before commit, triggering rollback
    await expect(
      prisma.$transaction(async (tx) => {
        const counter = await tx.invoiceCounter.upsert({
          where: { year },
          create: { year, lastNumber: 1 },
          update: { lastNumber: { increment: 1 } },
        });
        const num = `INV-${year}-${String(counter.lastNumber).padStart(6, '0')}`;
        await tx.invoice.create({
          data: {
            number: num,
            orderId: orderFail.id,
            data: '{}',
            issuedAt: issueDate,
          },
        });
        // Intentionally throw inside transaction to trigger rollback
        throw new Error('Simulated payment/invoice transaction failure');
      })
    ).rejects.toThrow('Simulated payment/invoice transaction failure');

    // 3. Third transaction creates invoice: counter must NOT have advanced permanently, so number must be INV-2026-000002
    const inv3 = await db.invoices.createSequentialInvoice({
      orderId: orderGood2.id,
      invoiceData: {},
      issueDate,
    });
    expect(inv3.number).toBe('INV-2026-000002');
  });

  it('replaying a payment is idempotent and creates no second invoice', async () => {
    const order = await db.orders.save({
      ref: 'ord_idempotent_001',
      docId: 'doc_idempotent_001',
      amountCents: 350000,
      email: 'idem@example.com',
    });

    // First confirmation
    const firstAttempt = await db.orders.confirmPayment({
      orderRef: order.ref,
      gatewayPaymentId: 'payfast_txn_998877',
      amountCents: 350000,
      invoiceData: { client: 'ACME' },
    });

    expect(firstAttempt.status).toBe('processed');
    expect(firstAttempt.invoice).toBeDefined();
    expect(firstAttempt.invoice?.number).toMatch(/^INV-\d{4}-000001$/);

    // Replay confirmation with exact same gateway payment ID
    const replayAttempt = await db.orders.confirmPayment({
      orderRef: order.ref,
      gatewayPaymentId: 'payfast_txn_998877',
      amountCents: 350000,
      invoiceData: { client: 'ACME' },
    });

    expect(replayAttempt.status).toBe('already_processed');
    expect(replayAttempt.invoice?.id).toBe(firstAttempt.invoice?.id);

    // Verify only one invoice exists for this order in the database
    const invoicesCount = await prisma.invoice.count({ where: { orderId: order.id } });
    expect(invoicesCount).toBe(1);
  });

  it('concurrent downloads cannot exceed the max use cap', async () => {
    const jti = 'jti_cap_test_123';
    const maxUses = 3;

    // Concurrently trigger 10 download requests
    const attempts = await Promise.all(
      Array.from({ length: 10 }, () => db.downloads.consumeAtomicUse(jti, maxUses))
    );

    const allowedCount = attempts.filter((res) => res.allowed).length;
    const rejectedCount = attempts.filter((res) => !res.allowed).length;

    expect(allowedCount).toBe(maxUses);
    expect(rejectedCount).toBe(7);

    // Final recorded usage must be exactly maxUses
    const finalUsage = await db.downloads.getUsage(jti);
    expect(finalUsage).toBe(maxUses);
  });
});
