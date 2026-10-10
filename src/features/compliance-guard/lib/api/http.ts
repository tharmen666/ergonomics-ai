import "server-only";
import { NextResponse } from "next/server";
import type { AppError, TenantId, UserId } from "@/lib/types";

const STATUS: Record<AppError["code"], number> = {
  VALIDATION: 400, UNSUPPORTED_FORMAT: 415, PAYLOAD_TOO_LARGE: 413, DUPLICATE: 409,
  NOT_FOUND: 404, LLM_FAILURE: 502, AGENT_FAILURE: 500, INTERNAL: 500,
};

export const errorResponse = (e: AppError) =>
  NextResponse.json({ error: { code: e.code, message: e.message } }, { status: STATUS[e.code] });

export interface RequestContext {
  tenantId: TenantId;
  userId: UserId;
}

/**
 * Resolve tenant & user. Replace with your auth provider (Clerk / Auth.js / Supabase Auth)
 * — the session's org ID becomes tenantId. Headers are accepted for service-to-service API sync.
 */
export function requestContext(req: Request): RequestContext {
  return {
    tenantId: (req.headers.get("x-tenant-id") ?? "tenant_demo") as TenantId,
    userId: (req.headers.get("x-user-id") ?? "user_demo") as UserId,
  };
}
