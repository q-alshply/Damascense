import Link from "next/link";
import { adminListCategories, notConfigured } from "@/lib/admin/data";
import { PageTitle, Card, Banner } from "@/components/admin/ui";

export default async function CategoriesPage() {
  const cats = await adminListCategories();
  return (
    <div className="max-w-3xl">
      <PageTitle
        title="Categories"
        action={
          <Link
            href="/admin/categories/new"
            className="bg-ivory px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink"
          >
            New category
          </Link>
        }
      />
      {notConfigured() && <Banner kind="info">Read-only — Supabase not configured.</Banner>}
      <div className="space-y-3">
        {cats.map((c) => (
          <Card key={c.id} className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg">{c.name_en}</p>
              <p className="text-xs text-ivory/45">
                /{c.slug} · order {c.sort_order} · {c.is_visible ? "visible" : "hidden"}
              </p>
            </div>
            <Link
              href={`/admin/categories/${c.id}`}
              className="text-xs uppercase tracking-[0.12em] text-accent-soft hover:underline"
            >
              Edit
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
