import { NextResponse } from "next/server";
import { env } from "@/lib/config/env";
import { getRepository } from "@/lib/db";
import type { TenantId } from "@/lib/types";

export const runtime = "nodejs";

/**
 * GET /api/maintenance/purge — 3-year rolling-window enforcement.
 * Schedule via vercel.json cron. Protected by CRON_SECRET (Vercel injects the bearer automatically).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const tenants = (process.env.PURGE_TENANTS ?? "tenant_demo").split(",").map((t) => t.trim()) as TenantId[];
  const repo = await getRepository();
  const months = env().RETENTION_MONTHS;
  const purged = Object.fromEntries(
    await Promise.all(tenants.map(async (t) => [t, await repo.purgeOutsideWindow(t, months)] as const)),
  );
  return NextResponse.json({ retentionMonths: months, purged });
}
