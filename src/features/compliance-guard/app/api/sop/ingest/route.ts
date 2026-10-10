import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/config/env";
import { getRepository } from "@/lib/db";
import { getLlm } from "@/lib/llm";
import { ingestDocument } from "@/lib/ingestion/sop-ingest-handler";
import { errorResponse, requestContext } from "@/lib/api/http";
import type { IngestChannel, IngestSourceKind, SiteId } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const KINDS = ["sop", "policy", "work_instruction", "risk_assessment", "incident_log", "audit_report", "training_record"] as const;

/** JSON body for API sync (SharePoint/Drive connectors, client ERPs). */
const ApiSyncSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().default("application/octet-stream"),
  contentBase64: z.string().min(1),
  declaredKind: z.enum(KINDS).optional(),
  siteId: z.string().optional(),
  externalRef: z.string().max(255).optional(),
  channel: z.enum(["api_sync", "sharepoint", "google_drive", "email_drop"]).default("api_sync"),
});

/**
 * POST /api/sop/ingest
 *  - multipart/form-data: file, declaredKind?, siteId?, externalRef?
 *  - application/json:    ApiSyncSchema (base64 content)
 */
export async function POST(req: Request) {
  const { tenantId, userId } = requestContext(req);
  const e = env();

  let payload: {
    fileName: string; mimeType: string; bytes: Uint8Array; channel: IngestChannel;
    declaredKind?: IngestSourceKind; siteId?: string; externalRef?: string;
  };

  try {
    if ((req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) return errorResponse({ code: "VALIDATION", message: "Missing 'file' field" });
      const kind = form.get("declaredKind")?.toString();
      payload = {
        fileName: file.name,
        mimeType: file.type,
        bytes: new Uint8Array(await file.arrayBuffer()),
        channel: "upload",
        declaredKind: (KINDS as readonly string[]).includes(kind ?? "") ? (kind as IngestSourceKind) : undefined,
        siteId: form.get("siteId")?.toString() || undefined,
        externalRef: form.get("externalRef")?.toString() || undefined,
      };
    } else {
      const parsed = ApiSyncSchema.safeParse(await req.json());
      if (!parsed.success) return errorResponse({ code: "VALIDATION", message: parsed.error.issues.map((i) => i.message).join("; ") });
      payload = { ...parsed.data, bytes: new Uint8Array(Buffer.from(parsed.data.contentBase64, "base64")) };
    }
  } catch {
    return errorResponse({ code: "VALIDATION", message: "Malformed request body" });
  }

  const [repo, llm] = [await getRepository(), getLlm()];
  const result = await ingestDocument(
    {
      tenantId, uploadedBy: userId, channel: payload.channel, fileName: payload.fileName,
      mimeType: payload.mimeType, bytes: payload.bytes, declaredKind: payload.declaredKind,
      siteId: payload.siteId as SiteId | undefined, externalRef: payload.externalRef,
    },
    {
      repo, llm, hitlThreshold: e.HITL_CONFIDENCE_THRESHOLD, retentionMonths: e.RETENTION_MONTHS,
      maxBytes: e.MAX_UPLOAD_MB * 1_048_576,
    },
  );

  if (!result.ok) return errorResponse(result.error);
  return NextResponse.json(result.value, { status: result.value.deduplicated ? 200 : 201 });
}
