import { adminPageContent, notConfigured } from "@/lib/admin/data";
import { getFounders } from "@/lib/queries/content";
import { updateAboutContent, saveFounder } from "@/lib/admin/actions";
import { PageTitle, Label, field, Banner, Card } from "@/components/admin/ui";
import { AdminForm } from "@/components/admin/AdminForm";
import { ImageField } from "@/components/admin/ImageField";

export default async function AboutAdmin() {
  const c = await adminPageContent("about");
  const founders = await getFounders();
  const g = (k: string) => (c[k] as string | undefined) ?? "";

  return (
    <div className="max-w-2xl space-y-10">
      <PageTitle title="About page" />
      {notConfigured() && <Banner kind="info">Read-only — Supabase not configured.</Banner>}

      <AdminForm action={updateAboutContent} submitLabel="Save about content">
        <div className="grid gap-5">
          <label>
            <Label>About text (EN) — blank line separates paragraphs</Label>
            <textarea name="body_en" rows={6} defaultValue={g("body_en")} className={field} />
          </label>
          <label>
            <Label>About text (AR)</Label>
            <textarea name="body_ar" rows={6} dir="rtl" defaultValue={g("body_ar")} className={field} />
          </label>
          <label>
            <Label>Founded year</Label>
            <input name="founded_year" defaultValue={g("founded_year") || "2026"} className={field} />
          </label>
          <ImageField name="intro_image" label="Intro image" defaultValue={g("intro_image")} />
          <ImageField name="inspiration_image" label="Damascus inspiration image" defaultValue={g("inspiration_image")} />
        </div>
      </AdminForm>

      <div>
        <h2 className="mb-4 font-display text-2xl">Founders</h2>
        <div className="space-y-6">
          {founders.map((f) => (
            <Card key={f.id}>
              <AdminForm action={saveFounder} submitLabel="Save founder" hidden={{ id: f.id }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <Label>Name (EN)</Label>
                    <input name="name_en" defaultValue={f.name_en} className={field} />
                  </label>
                  <label>
                    <Label>Name (AR)</Label>
                    <input name="name_ar" dir="rtl" defaultValue={f.name_ar} className={field} />
                  </label>
                  <label>
                    <Label>Role (EN)</Label>
                    <input name="role_en" defaultValue={f.role_en} className={field} />
                  </label>
                  <label>
                    <Label>Role (AR)</Label>
                    <input name="role_ar" dir="rtl" defaultValue={f.role_ar} className={field} />
                  </label>
                  <label>
                    <Label>Sort order</Label>
                    <input name="sort_order" type="number" defaultValue={f.sort_order} className={field} />
                  </label>
                  <div className="sm:col-span-2">
                    <ImageField name="photo" label="Photo" defaultValue={f.photo} />
                  </div>
                </div>
              </AdminForm>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
