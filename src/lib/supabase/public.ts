import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Anonymous, cookie-free client for public content (RLS "public reads"
 * policies). Safe to use in statically generated pages and during ISR —
 * unlike the cookie-based server client, it never opts a route into dynamic
 * rendering.
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
