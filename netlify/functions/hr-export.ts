// netlify/functions/hr-export.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,              // ✅ secret
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ✅ secret
);
