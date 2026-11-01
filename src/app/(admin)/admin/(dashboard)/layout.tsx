import { requireAdmin } from "@/lib/supabase/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return <AdminShell email={user.email}>{children}</AdminShell>;
}
