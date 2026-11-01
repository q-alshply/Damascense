import { adminPageContent, notConfigured } from "@/lib/admin/data";
import { updateHomepage } from "@/lib/admin/actions";
import { PageTitle, Label, field, Banner } from "@/components/admin/ui";
import { AdminForm } from "@/components/admin/AdminForm";
import { ImageField } from "@/components/admin/ImageField";

export default async function HomepageAdmin() {
  const c = await adminPageContent("home");
  const g = (k: string) => (c[k] as string | undefined) ?? "";

  return (
    <div className="max-w-2xl">
      <PageTitle title="Homepage">
        Controlled content slots — editorial copy and the hero image. Layout is
        fixed by design.
      </PageTitle>
      {notConfigured() && <Banner kind="info">Read-only — Supabase not configured.</Banner>}

      <AdminForm action={updateHomepage} submitLabel="Save homepage">
        <ImageField name="hero_image" label="Hero image" defaultValue={g("hero_image")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            <Label>Hero title (EN)</Label>
            <textarea name="hero_title_en" rows={2} defaultValue={g("hero_title_en")} className={field} />
          </label>
          <label>
            <Label>Hero title (AR)</Label>
            <textarea name="hero_title_ar" rows={2} dir="rtl" defaultValue={g("hero_title_ar")} className={field} />
          </label>
          <label>
            <Label>Hero support (EN)</Label>
            <textarea name="hero_support_en" rows={2} defaultValue={g("hero_support_en")} className={field} />
          </label>
          <label>
            <Label>Hero support (AR)</Label>
            <textarea name="hero_support_ar" rows={2} dir="rtl" defaultValue={g("hero_support_ar")} className={field} />
          </label>
          <label>
            <Label>Custom-made body (EN)</Label>
            <textarea name="custom_body_en" rows={3} defaultValue={g("custom_body_en")} className={field} />
          </label>
          <label>
            <Label>Custom-made body (AR)</Label>
            <textarea name="custom_body_ar" rows={3} dir="rtl" defaultValue={g("custom_body_ar")} className={field} />
          </label>
        </div>
        <p className="text-xs text-ivory/40">
          Leave a field empty to use the built-in default translation.
        </p>
      </AdminForm>
    </div>
  );
}
