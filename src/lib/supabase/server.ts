import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Anon-key client with no cookie access, for reading public data (published
// job postings) from Server Components.
//
// The cookie-reading client below calls `cookies()`, which opts the whole route
// into dynamic rendering — that is why the career pages used to be
// `force-dynamic` and served `Cache-Control: no-store`. Nothing about a public
// job listing depends on the viewer, so reading it without cookies lets those
// routes prerender and revalidate instead, which is far friendlier to crawlers.
export function createSupabasePublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

// Use in Server Components, Server Actions, and Route Handlers.
// Reads the user's session from cookies and refreshes it on demand.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          try {
            toSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component where setting cookies isn't allowed.
            // The proxy at the root refreshes sessions, so this is safe to ignore.
          }
        },
      },
    },
  );
}
