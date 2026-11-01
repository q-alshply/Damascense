import { saveCategory, deleteCategory } from "@/lib/admin/actions";
import { AdminForm } from "./AdminForm";
import { ImageField } from "./ImageField";
import { Label, field } from "./ui";
import type { CategoryRow } from "@/lib/supabase/types";

export function CategoryEditor({ category }: { category?: CategoryRow }) {
  return (
    <>
      <AdminForm
        action={saveCategory}
        submitLabel="Save category"
        hidden={category ? { id: category.id } : undefined}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            <Label>Name (EN)</Label>
            <input name="name_en" required defaultValue={category?.name_en} className={field} />
          </label>
          <label>
            <Label>Name (AR)</Label>
            <input name="name_ar" required dir="rtl" defaultValue={category?.name_ar} className={field} />
          </label>
          <label>
            <Label>Slug</Label>
            <input name="slug" defaultValue={category?.slug} placeholder="auto from name" className={field} />
          </label>
          <label>
            <Label>Sort order</Label>
            <input name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} className={field} />
          </label>
          <label className="sm:col-span-2">
            <Label>Description (EN)</Label>
            <textarea name="description_en" rows={3} defaultValue={category?.description_en ?? ""} className={field} />
          </label>
          <label className="sm:col-span-2">
            <Label>Description (AR)</Label>
            <textarea name="description_ar" rows={3} dir="rtl" defaultValue={category?.description_ar ?? ""} className={field} />
          </label>
          <div className="sm:col-span-2">
            <ImageField name="hero_image" label="Hero image" defaultValue={category?.hero_image} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_visible" defaultChecked={category?.is_visible ?? true} />
            Visible on site
          </label>
        </div>
      </AdminForm>

      {category && (
        <form action={deleteCategory} className="mt-8 border-t border-line pt-6">
          <input type="hidden" name="id" value={category.id} />
          <button className="border border-[#7d3b2e] px-4 py-2 text-xs uppercase tracking-[0.12em] text-[#e9b7ab] hover:bg-[#2a1713]">
            Delete category
          </button>
        </form>
      )}
    </>
  );
}
