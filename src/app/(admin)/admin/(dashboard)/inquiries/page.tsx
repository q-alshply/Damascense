import Link from "next/link";
import { adminListInquiries, notConfigured } from "@/lib/admin/data";
import { PageTitle, Banner, Card } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In progress",
  closed: "Closed",
  archived: "Archived",
};

export default async function InquiriesPage() {
  const rows = await adminListInquiries();

  return (
    <div>
      <PageTitle title="Inquiries">
        {rows.length} total
      </PageTitle>

      {notConfigured() && (
        <Banner kind="info">
          Inquiries are stored in Supabase. Configure it to receive and manage
          custom requests here.
        </Banner>
      )}

      {rows.length === 0 ? (
        <Card>
          <p className="text-sm text-ivory/40">No inquiries yet.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-ink-800 text-left text-xs uppercase tracking-[0.1em] text-ivory/45">
              <tr>
                <th className="p-3">Reference</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Country</th>
                <th className="p-3">Interest</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((i) => (
                <tr key={i.id} className="hover:bg-ivory/5">
                  <td className="p-3">
                    <Link
                      href={`/admin/inquiries/${i.id}`}
                      className="text-accent-soft hover:underline"
                    >
                      {i.reference_number}
                    </Link>
                  </td>
                  <td className="p-3 text-ivory/50">
                    {formatDate(i.created_at, "en")}
                  </td>
                  <td className="p-3">{i.name}</td>
                  <td className="p-3 text-ivory/60">{i.country}</td>
                  <td className="p-3 text-ivory/60">{i.interested_in}</td>
                  <td className="p-3">
                    <span className="border border-line px-2 py-0.5 text-xs">
                      {STATUS_LABEL[i.status] ?? i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
