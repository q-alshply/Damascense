import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { uploadMedia, deleteMedia } from "@/lib/admin/actions";
import { publicImageUrl } from "@/lib/queries/media";
import { PageTitle, Card, Banner } from "@/components/admin/ui";
import { AdminForm } from "@/components/admin/AdminForm";
import { CopyButton } from "@/components/admin/CopyButton";
import type { MediaRow } from "@/lib/supabase/types";

export default async function MediaPage() {
  let rows: MediaRow[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    rows = data ?? [];
  }

  return (
    <div>
      <PageTitle title="Media">Central library. Product images are managed per product.</PageTitle>
      {!isSupabaseConfigured && (
        <Banner kind="info">Configure Supabase to upload and store media.</Banner>
      )}

      <Card className="mb-8">
        <AdminForm action={uploadMedia} submitLabel="Upload files">
          <input
            type="file"
            name="files"
            multiple
            accept="image/*"
            className="text-sm text-ivory/60 file:me-3 file:border file:border-line file:bg-transparent file:px-3 file:py-1.5 file:text-xs file:uppercase file:text-ivory"
          />
        </AdminForm>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((m) => {
          const url = publicImageUrl(m.storage_path, "site-media") ?? "";
          return (
            <div key={m.id} className="border border-line p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={m.file_name} className="h-32 w-full object-cover" />
              <p className="mt-1 truncate text-xs text-ivory/50">{m.file_name}</p>
              <div className="mt-1 flex items-center justify-between">
                <CopyButton value={url} label="Copy URL" />
                <form action={deleteMedia}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="text-xs text-[#d98b7a] hover:underline">delete</button>
                </form>
              </div>
            </div>
          );
        })}
        {rows.length === 0 && isSupabaseConfigured && (
          <p className="text-sm text-ivory/40">No media uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
