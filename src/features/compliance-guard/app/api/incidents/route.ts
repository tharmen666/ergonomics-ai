import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/config/env";
import { getRepository } from "@/lib/db";
import { getLlm } from "@/lib/llm";
import { runIncidentToRca } from "@/lib/agents/pipelines/incident-to-rca";
import { errorResponse, requestContext } from "@/lib/api/http";
import type { ISODateString, SiteId } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const IntakeSchema = z.object({
  narrative: z.string().trim().min(10, "Please describe what happened (min 10 characters)").max(8000),
  siteId: z.string().min(1).default("site_demo"),
  channel: z.enum(["voice", "text", "whatsapp", "form"]).default("text"),
  occurredAt: z.string().datetime().optional(),
  locale: z.string().max(10).optional(),
});

/** POST /api/incidents — frictionless NMI/incident capture → full agent pipeline. */
export async function POST(req: Request) {
  const { tenantId, userId } = requestContext(req);
  const body = IntakeSchema.safeParse(await req.json().catch(() => ({})));
  if (!body.success) return errorResponse({ code: "VALIDATION", message: body.error.issues.map((i) => i.message).join("; ") });

  const result = await runIncidentToRca(
    {
      tenantId,
      siteId: body.data.siteId as SiteId,
      reportedBy: userId,
      channel: body.data.channel,
      narrative: body.data.narrative,
      occurredAt: body.data.occurredAt as ISODateString | undefined,
      locale: body.data.locale,
    },
    { repo: await getRepository(), llm: getLlm(), hitlThreshold: env().HITL_CONFIDENCE_THRESHOLD },
  );

  if (!result.ok) return errorResponse(result.error);
  return NextResponse.json(result.value, { status: 201 });
}

/** GET /api/incidents?hitl=1&limit=50 — feed for the safety officer's review queue. */
export async function GET(req: Request) {
  const { tenantId } = requestContext(req);
  const url = new URL(req.url);
  const repo = await getRepository();
  const incidents = await repo.listIncidents(tenantId, {
    hitlOnly: url.searchParams.get("hitl") === "1",
    limit: Math.min(Number(url.searchParams.get("limit") ?? 50), 200),
  });
  return NextResponse.json({ incidents });
}
