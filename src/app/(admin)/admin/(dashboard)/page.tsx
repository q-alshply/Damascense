import Link from "next/link";
import { adminOverview, notConfigured } from "@/lib/admin/data";
import { PageTitle, Card, Stat, Banner } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export default async function OverviewPage() {
  const o = await adminOverview();

  return (
    <div>
      <PageTitle title="Overview" />

      {notConfigured() && (
        <Banner kind="info">
          Supabase is not configured yet — showing seed data in read-only mode.
          Add credentials to <code>.env.local</code> and run the migration to
          enable editing.
        </Banner>
      )}

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Published" value={o.published} />
        <Stat label="Drafts" value={o.draft} />
        <Stat label="Featured" value={o.featured} />
        <Stat label="Inquiries" value={o.inquiries} />
        <Stat label="Unread" value={o.unread} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm uppercase tracking-[0.14em] text-ivory/45">
            Recent inquiries
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {o.recentInquiries.length === 0 && (
              <li className="py-3 text-sm text-ivory/40">No inquiries yet.</li>
            )}
            {o.recentInquiries.map((i) => (
              <li key={i.id} className="py-3 text-sm">
                <Link
                  href={`/admin/inquiries/${i.id}`}
                  className="flex justify-between hover:text-accent-soft"
                >
                  <span>
                    {i.name} · <span className="text-ivory/45">{i.reference_number}</span>
                  </span>
                  <span className="text-ivory/40">
                    {formatDate(i.created_at, "en")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-sm uppercase tracking-[0.14em] text-ivory/45">
            Recently edited products
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {o.recentProducts.map((p) => (
              <li key={p.id} className="py-3 text-sm">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="flex justify-between hover:text-accent-soft"
                >
                  <span>{p.name_en}</span>
                  <span className="text-ivory/40">{p.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
