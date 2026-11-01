/** True when real Supabase credentials are present. */
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

export const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
