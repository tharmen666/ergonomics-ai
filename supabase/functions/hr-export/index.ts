// Deno runtime (Supabase Edge Functions)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const url = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!; // secret

const supabase = createClient(url, serviceRoleKey);

Deno.serve(async (req) => {
  try {
    // Simple optional window filters: ?from=2025-10-01&to=2025-10-31
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let q = supabase
      .from("assessments")
      .select("id,user_email,score,created_at")
      .order("created_at", { ascending: false });

    if (from) q = q.gte("created_at", from);
    if (to) q = q.lte("created_at", to);

    const { data, error } = await q;
    if (error) throw error;

    return new Response(JSON.stringify({ rows: data ?? [] }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      status: 200,
    });
  } catch (e) {
    return new Response(String((e as any)?.message || e), { status: 500 });
  }
});
