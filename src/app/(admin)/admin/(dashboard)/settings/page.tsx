import { adminSettings, notConfigured } from "@/lib/admin/data";
import { updateSettings } from "@/lib/admin/actions";
import { PageTitle, Label, field, Banner } from "@/components/admin/ui";
import { AdminForm } from "@/components/admin/AdminForm";

export default async function SettingsPage() {
  const st = await adminSettings();
  const T = (
    name: string,
    label: string,
    defaultValue?: string | null,
    textarea = false,
  ) => (
    <label className="block">
      <Label>{label}</Label>
      {textarea ? (
        <textarea name={name} rows={2} defaultValue={defaultValue ?? ""} className={field} />
      ) : (
        <input name={name} defaultValue={defaultValue ?? ""} className={field} />
      )}
    </label>
  );

  return (
    <div className="max-w-2xl">
      <PageTitle title="Settings" />
      {notConfigured() && <Banner kind="info">Read-only — Supabase not configured.</Banner>}
      <AdminForm action={updateSettings} submitLabel="Save settings">
        <div className="grid gap-5 sm:grid-cols-2">
          {T("brand_name", "Brand name", st.brand_name)}
          {T("email", "Email", st.email)}
          {T("city", "City", st.city)}
          {T("country", "Country", st.country)}
          {T("instagram_url", "Instagram URL", st.instagram_url)}
          {T("facebook_url", "Facebook URL", st.facebook_url)}
          {T("tiktok_url", "TikTok URL", st.tiktok_url)}
          {T("whatsapp_business", "WhatsApp business number", st.whatsapp_business)}
        </div>
        <div className="border-t border-line pt-5">
          <p className="mb-4 text-xs uppercase tracking-[0.14em] text-ivory/45">
            SEO defaults
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {T("seo_title_en", "SEO title (EN)", st.seo_title_en)}
            {T("seo_title_ar", "SEO title (AR)", st.seo_title_ar)}
            {T("seo_description_en", "SEO description (EN)", st.seo_description_en, true)}
            {T("seo_description_ar", "SEO description (AR)", st.seo_description_ar, true)}
          </div>
        </div>
      </AdminForm>
    </div>
  );
}
