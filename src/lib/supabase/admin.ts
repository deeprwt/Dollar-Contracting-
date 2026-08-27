import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS. Only ever instantiate on the server.
// Use for: storage writes from public form submissions, admin reads, etc.
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
