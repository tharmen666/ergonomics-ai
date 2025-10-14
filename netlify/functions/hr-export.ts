import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,            // safe to reuse
  process.env.SUPABASE_SERVICE_ROLE_KEY!     // SECRET (functions scope)
);

export const handler: Handler = async () => {
  try {
    const { data, error } = await supabase
      .from("assessments")
      .select("id,user_email,score,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: data })
    };
  } catch (e: any) {
    return { statusCode: 500, body: e.message };
  }
};
