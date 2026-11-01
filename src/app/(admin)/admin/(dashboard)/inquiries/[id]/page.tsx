import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { adminGetInquiry } from "@/lib/admin/data";
import { updateInquiry } from "@/lib/admin/actions";
import { PageTitle, Card, Label, field } from "@/components/admin/ui";
import { AdminForm } from "@/components/admin/AdminForm";
import { CopyButton } from "@/components/admin/CopyButton";
import { formatDate } from "@/lib/utils";

const STATUSES = ["new", "contacted", "in_progress", "closed", "archived"];

export default async function InquiryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inq = await adminGetInquiry(id);
  if (!inq) notFound();

  let imageUrl: string | null = null;
  if (inq.reference_image && isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.storage
      .from("inquiry-uploads")
      .createSignedUrl(inq.reference_image, 60 * 30);
    imageUrl = data?.signedUrl ?? null;
  }

  const rows: [string, string | null | undefined][] = [
    ["Reference", inq.reference_number],
    ["Received", formatDate(inq.created_at, "en")],
    ["Country", inq.country],
    ["Interested in", inq.interested_in],
    ["Related product", inq.product?.name_en],
    ["Dimensions", inq.dimensions],
    ["Preferred finish", inq.preferred_finish],
  ];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/inquiries" className="text-xs text-ivory/50 hover:text-ivory">
        ← All inquiries
      </Link>
      <PageTitle title={inq.name} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <dl className="space-y-2 text-sm">
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-ivory/45">{k}</dt>
                  <dd className="text-end">{v}</dd>
                </div>
              ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
            <CopyButton value={inq.email} label={`Copy email`} />
            <CopyButton value={inq.whatsapp} label={`Copy WhatsApp`} />
            <a
              href={`mailto:${inq.email}`}
              className="border border-line px-3 py-1.5 text-xs uppercase tracking-[0.12em] hover:bg-ivory/5"
            >
              Email ↗
            </a>
          </div>
        </Card>

        <Card>
          <Label>Message</Label>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ivory/80">
            {inq.message}
          </p>
          {inq.reference_image && (
            <div className="mt-4">
              <Label>Reference image</Label>
              {imageUrl ? (
                <a href={imageUrl} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Reference" className="max-h-64 border border-line" />
                </a>
              ) : (
                <p className="text-xs text-ivory/40">{inq.reference_image}</p>
              )}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <AdminForm
          action={updateInquiry}
          submitLabel="Update inquiry"
          hidden={{ id: inq.id }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <Label>Status</Label>
              <select name="status" defaultValue={inq.status} className={field}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <Label>Internal note (never shown publicly)</Label>
            <textarea
              name="internal_note"
              rows={4}
              defaultValue={inq.internal_note ?? ""}
              className={field}
            />
          </label>
        </AdminForm>
      </Card>
    </div>
  );
}
