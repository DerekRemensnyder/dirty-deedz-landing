import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** Browser client — lazy so the build doesn't crash without env vars */
let _browser: SupabaseClient | null = null;
export function supabase() {
  if (!_browser) {
    _browser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _browser;
}

/** Server client — uses service role key, only in API routes / server actions */
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
