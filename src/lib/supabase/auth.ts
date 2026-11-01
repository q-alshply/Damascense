import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";

/**
 * Returns the signed-in admin user or null. A user is an admin only if their
 * id is present in `admin_users` (enforced again by RLS on every write).
 */
export const getAdminUser = cache(async () => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return row ? { id: user.id, email: user.email ?? "" } : null;
});

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
