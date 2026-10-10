import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { requestContext } from "@/lib/api/http";

export const runtime = "nodejs";

/** GET /api/documents — controlled document register. */
export async function GET(req: Request) {
  const { tenantId } = requestContext(req);
  const documents = await (await getRepository()).listDocuments(tenantId, 100);
  return NextResponse.json({ documents });
}
