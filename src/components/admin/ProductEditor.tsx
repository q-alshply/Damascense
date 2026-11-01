import { createProduct, updateProduct } from "@/lib/admin/actions";
import { AdminForm } from "./AdminForm";
import { Label, field } from "./ui";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";

const CHECK = (name: string, label: string, checked?: boolean) => (
  <label className="flex items-center gap-2 text-sm">
    <input type="checkbox" name={name} defaultChecked={checked} />
    {label}
  </label>
);

export function ProductEditor({
  product,
  categories,
}: {
  product?: ProductRow;
  categories: CategoryRow[];
}) {
  const P = product;
  return (
    <AdminForm
      action={P ? updateProduct : createProduct}
      submitLabel={P ? "Save product" : "Create product"}
      hidden={P ? { id: P.id } : undefined}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <Label>Name (EN) *</Label>
          <input name="name_en" required defaultValue={P?.name_en} className={field} />
        </label>
        <label>
          <Label>Name (AR) *</Label>
          <input name="name_ar" required dir="rtl" defaultValue={P?.name_ar} className={field} />
        </label>
        <label>
          <Label>Slug</Label>
          <input name="slug" defaultValue={P?.slug} placeholder="auto from name" className={field} />
        </label>
        <label>
          <Label>Category *</Label>
          <select name="category_id" required defaultValue={P?.category_id ?? ""} className={field}>
            <option value="" disabled>
              Select…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en}
              </option>
            ))}
          </select>
        </label>
        <label>
          <Label>Status</Label>
          <select name="status" defaultValue={P?.status ?? "draft"} className={field}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        <label>
          <Label>Sort order</Label>
          <input name="sort_order" type="number" defaultValue={P?.sort_order ?? 0} className={field} />
        </label>

        <label className="sm:col-span-2">
          <Label>Description (EN)</Label>
          <textarea name="description_en" rows={3} defaultValue={P?.description_en ?? ""} className={field} />
        </label>
        <label className="sm:col-span-2">
          <Label>Description (AR)</Label>
          <textarea name="description_ar" rows={3} dir="rtl" defaultValue={P?.description_ar ?? ""} className={field} />
        </label>

        <label>
          <Label>Materials (EN)</Label>
          <input name="materials_en" defaultValue={P?.materials_en ?? ""} className={field} />
        </label>
        <label>
          <Label>Materials (AR)</Label>
          <input name="materials_ar" dir="rtl" defaultValue={P?.materials_ar ?? ""} className={field} />
        </label>
        <label>
          <Label>Dimensions</Label>
          <input name="dimensions" placeholder="150 × 90 cm" defaultValue={P?.dimensions ?? ""} className={field} />
        </label>
        <div />
        <label>
          <Label>Colour / finish (EN)</Label>
          <input name="finish_en" defaultValue={P?.finish_en ?? ""} className={field} />
        </label>
        <label>
          <Label>Colour / finish (AR)</Label>
          <input name="finish_ar" dir="rtl" defaultValue={P?.finish_ar ?? ""} className={field} />
        </label>

        <div className="flex flex-wrap gap-6 sm:col-span-2">
          {CHECK("custom_dimensions", "Custom dimensions available", P?.custom_dimensions ?? true)}
          {CHECK("custom_colors", "Custom colours available", P?.custom_colors ?? true)}
          {CHECK("featured", "Featured", P?.featured ?? false)}
        </div>

        <div className="sm:col-span-2 border-t border-line pt-4">
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-ivory/45">SEO</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <Label>SEO title (EN)</Label>
              <input name="seo_title_en" defaultValue={P?.seo_title_en ?? ""} className={field} />
            </label>
            <label>
              <Label>SEO title (AR)</Label>
              <input name="seo_title_ar" dir="rtl" defaultValue={P?.seo_title_ar ?? ""} className={field} />
            </label>
            <label>
              <Label>SEO description (EN)</Label>
              <textarea name="seo_description_en" rows={2} defaultValue={P?.seo_description_en ?? ""} className={field} />
            </label>
            <label>
              <Label>SEO description (AR)</Label>
              <textarea name="seo_description_ar" rows={2} dir="rtl" defaultValue={P?.seo_description_ar ?? ""} className={field} />
            </label>
          </div>
        </div>
      </div>
    </AdminForm>
  );
}
