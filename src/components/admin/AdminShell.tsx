"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/(admin)/admin/login/actions";
import { FloralMark } from "@/components/brand/FloralMark";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-ink-800 p-5">
        <div className="flex items-center gap-2">
          <FloralMark className="h-6 w-6 text-accent" aria-hidden />
          <span className="font-display text-lg">Damascense</span>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-ivory/10 text-ivory"
                    : "text-ivory/55 hover:bg-ivory/5 hover:text-ivory",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-line pt-4">
          <p className="truncate text-xs text-ivory/40">{email}</p>
          <form action={logout}>
            <button className="mt-2 text-xs uppercase tracking-[0.14em] text-ivory/60 hover:text-ivory">
              Sign out
            </button>
          </form>
          <Link
            href="/"
            target="_blank"
            className="mt-2 block text-xs uppercase tracking-[0.14em] text-ivory/40 hover:text-ivory"
          >
            View site ↗
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-8">{children}</main>
    </div>
  );
}
