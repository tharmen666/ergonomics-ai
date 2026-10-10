import { prisma } from './prisma';
import { DocumentStatus } from '@/lib/compliance/document-state';
import { getEnv } from '@/lib/env';

export interface StoredDocument {
  id: string;
  status: DocumentStatus;
  version: number;
  contentHash: string;
  content: string; // JSON string of document content snapshot
  intake: string;  // JSON string of intake
  reviewerName?: string;
  reviewerBody?: string;
  reviewerRegNo?: string;
  verifiedOn?: string;
  seal?: string;
  history?: string; // JSON array of audit events
  createdAt: string;
  updatedAt: string;
}

export interface StoredOrder {
  id: string;
  ref: string;
  gatewayPaymentId?: string;
  amountCents: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  docId: string;
  email: string;
  clientName?: string;
  clientAddress?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredInvoice {
  id: string;
  number: string;
  orderId: string;
  data: string; // JSON string
  issuedAt: string;
  createdAt: string;
}

export const db = {
  prisma,

  documents: {
    async findById(docId: string): Promise<StoredDocument | null> {
      const doc = await prisma.document.findUnique({
        where: { id: docId },
      });
      if (!doc) return null;
      return {
        id: doc.id,
        status: doc.status as DocumentStatus,
        version: doc.version,
        contentHash: doc.contentHash,
        content: doc.content,
        intake: doc.intake,
        reviewerName: doc.reviewerName ?? undefined,
        reviewerBody: doc.reviewerBody ?? undefined,
        reviewerRegNo: doc.reviewerRegNo ?? undefined,
        verifiedOn: doc.verifiedOn ?? undefined,
        seal: doc.seal ?? undefined,
        history: doc.history,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      };
    },

    async save(doc: Partial<StoredDocument> & { id: string; contentHash: string }): Promise<StoredDocument> {
      const saved = await prisma.document.upsert({
        where: { id: doc.id },
        create: {
          id: doc.id,
          status: doc.status ?? 'draft',
          version: doc.version ?? 1,
          contentHash: doc.contentHash,
          content: doc.content ?? '{}',
          intake: doc.intake ?? '{}',
          reviewerName: doc.reviewerName,
          reviewerBody: doc.reviewerBody,
          reviewerRegNo: doc.reviewerRegNo,
          verifiedOn: doc.verifiedOn,
          seal: doc.seal,
          history: doc.history ?? '[]',
        },
        update: {
          status: doc.status,
          version: doc.version,
          contentHash: doc.contentHash,
          content: doc.content,
          intake: doc.intake,
          reviewerName: doc.reviewerName,
          reviewerBody: doc.reviewerBody,
          reviewerRegNo: doc.reviewerRegNo,
          verifiedOn: doc.verifiedOn,
          seal: doc.seal,
          history: doc.history,
        },
      });

      return {
        id: saved.id,
        status: saved.status as DocumentStatus,
        version: saved.version,
        contentHash: saved.contentHash,
        content: saved.content,
        intake: saved.intake,
        reviewerName: saved.reviewerName ?? undefined,
        reviewerBody: saved.reviewerBody ?? undefined,
        reviewerRegNo: saved.reviewerRegNo ?? undefined,
        verifiedOn: saved.verifiedOn ?? undefined,
        seal: saved.seal ?? undefined,
        history: saved.history,
        createdAt: saved.createdAt.toISOString(),
        updatedAt: saved.updatedAt.toISOString(),
      };
    },

    async updateStatus(docId: string, status: DocumentStatus): Promise<StoredDocument | null> {
      try {
        const updated = await prisma.document.update({
          where: { id: docId },
          data: { status },
        });
        return {
          id: updated.id,
          status: updated.status as DocumentStatus,
          version: updated.version,
          contentHash: updated.contentHash,
          content: updated.content,
          intake: updated.intake,
          reviewerName: updated.reviewerName ?? undefined,
          reviewerBody: updated.reviewerBody ?? undefined,
          reviewerRegNo: updated.reviewerRegNo ?? undefined,
          verifiedOn: updated.verifiedOn ?? undefined,
          seal: updated.seal ?? undefined,
          history: updated.history,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        };
      } catch {
        return null;
      }
    },
  },

  orders: {
    async findById(orderId: string): Promise<StoredOrder | null> {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!order) return null;
      return {
        id: order.id,
        ref: order.ref,
        gatewayPaymentId: order.gatewayPaymentId ?? undefined,
        amountCents: order.amountCents,
        status: order.status as StoredOrder['status'],
        docId: order.docId,
        email: order.email,
        clientName: order.clientName ?? undefined,
        clientAddress: order.clientAddress ?? undefined,
        paidAt: order.paidAt?.toISOString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    },

    async findByRef(ref: string): Promise<StoredOrder | null> {
      const order = await prisma.order.findUnique({
        where: { ref },
      });
      if (!order) return null;
      return {
        id: order.id,
        ref: order.ref,
        gatewayPaymentId: order.gatewayPaymentId ?? undefined,
        amountCents: order.amountCents,
        status: order.status as StoredOrder['status'],
        docId: order.docId,
        email: order.email,
        clientName: order.clientName ?? undefined,
        clientAddress: order.clientAddress ?? undefined,
        paidAt: order.paidAt?.toISOString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    },

    async findByDocId(docId: string): Promise<StoredOrder | null> {
      const order = await prisma.order.findFirst({
        where: { docId },
      });
      if (!order) return null;
      return {
        id: order.id,
        ref: order.ref,
        gatewayPaymentId: order.gatewayPaymentId ?? undefined,
        amountCents: order.amountCents,
        status: order.status as StoredOrder['status'],
        docId: order.docId,
        email: order.email,
        clientName: order.clientName ?? undefined,
        clientAddress: order.clientAddress ?? undefined,
        paidAt: order.paidAt?.toISOString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    },

    async save(order: {
      id?: string;
      ref: string;
      docId: string;
      amountCents: number;
      status?: 'pending' | 'paid' | 'failed' | 'refunded';
      email: string;
      gatewayPaymentId?: string;
      clientName?: string;
      clientAddress?: string;
      paidAt?: Date;
    }): Promise<StoredOrder> {
      const saved = await prisma.order.upsert({
        where: { ref: order.ref },
        create: {
          id: order.id,
          ref: order.ref,
          docId: order.docId,
          amountCents: order.amountCents,
          status: order.status ?? 'pending',
          email: order.email,
          gatewayPaymentId: order.gatewayPaymentId,
          clientName: order.clientName,
          clientAddress: order.clientAddress,
          paidAt: order.paidAt,
        },
        update: {
          amountCents: order.amountCents,
          status: order.status,
          email: order.email,
          gatewayPaymentId: order.gatewayPaymentId,
          clientName: order.clientName,
          clientAddress: order.clientAddress,
          paidAt: order.paidAt,
        },
      });

      return {
        id: saved.id,
        ref: saved.ref,
        gatewayPaymentId: saved.gatewayPaymentId ?? undefined,
        amountCents: saved.amountCents,
        status: saved.status as StoredOrder['status'],
        docId: saved.docId,
        email: saved.email,
        clientName: saved.clientName ?? undefined,
        clientAddress: saved.clientAddress ?? undefined,
        paidAt: saved.paidAt?.toISOString(),
        createdAt: saved.createdAt.toISOString(),
        updatedAt: saved.updatedAt.toISOString(),
      };
    },

    /**
     * Idempotent payment confirmation by gatewayPaymentId.
     * Replay returns 'already_processed' without creating a second invoice or duplicating updates.
     */
    async confirmPayment(params: {
      orderRef: string;
      gatewayPaymentId: string;
      amountCents: number;
      invoiceData?: Record<string, unknown>;
    }): Promise<{
      status: 'processed' | 'already_processed';
      order: StoredOrder;
      invoice?: StoredInvoice;
    }> {
      // 1. Check if this gatewayPaymentId was already recorded
      const existingPayment = await prisma.order.findUnique({
        where: { gatewayPaymentId: params.gatewayPaymentId },
        include: { invoice: true },
      });
      if (existingPayment) {
        return {
          status: 'already_processed',
          order: {
            id: existingPayment.id,
            ref: existingPayment.ref,
            gatewayPaymentId: existingPayment.gatewayPaymentId ?? undefined,
            amountCents: existingPayment.amountCents,
            status: existingPayment.status as StoredOrder['status'],
            docId: existingPayment.docId,
            email: existingPayment.email,
            clientName: existingPayment.clientName ?? undefined,
            clientAddress: existingPayment.clientAddress ?? undefined,
            paidAt: existingPayment.paidAt?.toISOString(),
            createdAt: existingPayment.createdAt.toISOString(),
            updatedAt: existingPayment.updatedAt.toISOString(),
          },
          invoice: existingPayment.invoice
            ? {
                id: existingPayment.invoice.id,
                number: existingPayment.invoice.number,
                orderId: existingPayment.invoice.orderId,
                data: existingPayment.invoice.data,
                issuedAt: existingPayment.invoice.issuedAt.toISOString(),
                createdAt: existingPayment.invoice.createdAt.toISOString(),
              }
            : undefined,
        };
      }

      // 2. Process inside a single atomic transaction
      return await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { ref: params.orderRef },
          include: { invoice: true },
        });

        if (!order) {
          throw new Error(`Order not found for reference: ${params.orderRef}`);
        }

        if (order.status === 'paid' && order.gatewayPaymentId === params.gatewayPaymentId) {
          return {
            status: 'already_processed' as const,
            order: {
              id: order.id,
              ref: order.ref,
              gatewayPaymentId: order.gatewayPaymentId ?? undefined,
              amountCents: order.amountCents,
              status: order.status as StoredOrder['status'],
              docId: order.docId,
              email: order.email,
              clientName: order.clientName ?? undefined,
              clientAddress: order.clientAddress ?? undefined,
              paidAt: order.paidAt?.toISOString(),
              createdAt: order.createdAt.toISOString(),
              updatedAt: order.updatedAt.toISOString(),
            },
            invoice: order.invoice
              ? {
                  id: order.invoice.id,
                  number: order.invoice.number,
                  orderId: order.invoice.orderId,
                  data: order.invoice.data,
                  issuedAt: order.invoice.issuedAt.toISOString(),
                  createdAt: order.invoice.createdAt.toISOString(),
                }
              : undefined,
          };
        }

        const paidAt = new Date();
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'paid',
            gatewayPaymentId: params.gatewayPaymentId,
            paidAt,
          },
        });

        // Atomically create invoice for the order if it doesn't already have one
        let invoiceRecord = order.invoice;
        if (!invoiceRecord) {
          const year = paidAt.getFullYear();
          const counter = await tx.invoiceCounter.upsert({
            where: { year },
            create: { year, lastNumber: 1 },
            update: { lastNumber: { increment: 1 } },
          });

          const formattedNumber = `INV-${year}-${String(counter.lastNumber).padStart(6, '0')}`;
          invoiceRecord = await tx.invoice.create({
            data: {
              number: formattedNumber,
              orderId: updatedOrder.id,
              data: JSON.stringify(params.invoiceData ?? {}),
              issuedAt: paidAt,
            },
          });
        }

        return {
          status: 'processed' as const,
          order: {
            id: updatedOrder.id,
            ref: updatedOrder.ref,
            gatewayPaymentId: updatedOrder.gatewayPaymentId ?? undefined,
            amountCents: updatedOrder.amountCents,
            status: updatedOrder.status as StoredOrder['status'],
            docId: updatedOrder.docId,
            email: updatedOrder.email,
            clientName: updatedOrder.clientName ?? undefined,
            clientAddress: updatedOrder.clientAddress ?? undefined,
            paidAt: updatedOrder.paidAt?.toISOString(),
            createdAt: updatedOrder.createdAt.toISOString(),
            updatedAt: updatedOrder.updatedAt.toISOString(),
          },
          invoice: {
            id: invoiceRecord.id,
            number: invoiceRecord.number,
            orderId: invoiceRecord.orderId,
            data: invoiceRecord.data,
            issuedAt: invoiceRecord.issuedAt.toISOString(),
            createdAt: invoiceRecord.createdAt.toISOString(),
          },
        };
      });
    },
  },

  invoices: {
    /**
     * Atomically increments the year's invoice counter and creates the invoice inside a single transaction.
     * Ensures sequential, gap-free numbering: INV-YYYY-NNNNNN
     * Rolled-back transactions leave NO gap.
     */
    async createSequentialInvoice(params: {
      orderId: string;
      invoiceData: Record<string, unknown>;
      issueDate?: Date;
    }): Promise<StoredInvoice> {
      const issueDate = params.issueDate ?? new Date();
      const year = issueDate.getFullYear();

      return await prisma.$transaction(async (tx) => {
        const counter = await tx.invoiceCounter.upsert({
          where: { year },
          create: { year, lastNumber: 1 },
          update: { lastNumber: { increment: 1 } },
        });

        const invoiceNumber = `INV-${year}-${String(counter.lastNumber).padStart(6, '0')}`;

        const invoice = await tx.invoice.create({
          data: {
            number: invoiceNumber,
            orderId: params.orderId,
            data: JSON.stringify(params.invoiceData),
            issuedAt: issueDate,
          },
        });

        return {
          id: invoice.id,
          number: invoice.number,
          orderId: invoice.orderId,
          data: invoice.data,
          issuedAt: invoice.issuedAt.toISOString(),
          createdAt: invoice.createdAt.toISOString(),
        };
      });
    },

    async findByOrderId(orderId: string): Promise<StoredInvoice | null> {
      const inv = await prisma.invoice.findUnique({
        where: { orderId },
      });
      if (!inv) return null;
      return {
        id: inv.id,
        number: inv.number,
        orderId: inv.orderId,
        data: inv.data,
        issuedAt: inv.issuedAt.toISOString(),
        createdAt: inv.createdAt.toISOString(),
      };
    },

    async findByNumber(number: string): Promise<StoredInvoice | null> {
      const inv = await prisma.invoice.findUnique({
        where: { number },
      });
      if (!inv) return null;
      return {
        id: inv.id,
        number: inv.number,
        orderId: inv.orderId,
        data: inv.data,
        issuedAt: inv.issuedAt.toISOString(),
        createdAt: inv.createdAt.toISOString(),
      };
    },
  },

  downloads: {
    /**
     * Atomic conditional consumption of a download use:
     * UPDATE DownloadUse SET uses = uses + 1 WHERE jti = ? AND uses < max
     * Returns true if increment succeeded, false if capped.
     */
    async consumeAtomicUse(jti: string, customMax?: number): Promise<{ allowed: boolean; uses: number }> {
      const maxUses = customMax ?? getEnv().MAX_DOWNLOAD_USES ?? 3;

      // Ensure row exists atomically without resetting existing count
      await prisma.$executeRaw`
        INSERT OR IGNORE INTO DownloadUse (jti, uses, createdAt, updatedAt)
        VALUES (${jti}, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;

      // Atomic conditional update: strictly allows increment only if uses < maxUses
      const rowsAffected = await prisma.$executeRaw`
        UPDATE DownloadUse 
        SET uses = uses + 1, updatedAt = CURRENT_TIMESTAMP
        WHERE jti = ${jti} AND uses < ${maxUses}
      `;

      const record = await prisma.downloadUse.findUnique({ where: { jti } });
      const currentUses = record?.uses ?? 0;

      return {
        allowed: rowsAffected > 0,
        uses: currentUses,
      };
    },

    async getUsage(jti: string): Promise<number> {
      const record = await prisma.downloadUse.findUnique({ where: { jti } });
      return record?.uses ?? 0;
    },

    async reset(jti: string): Promise<void> {
      await prisma.downloadUse.deleteMany({ where: { jti } });
    },
  },
};
