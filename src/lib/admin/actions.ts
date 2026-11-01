"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { slugify } from "@/lib/utils";

export type ActionState = { ok?: boolean; error?: string; message?: string };

const GUARD_MSG =
  "Supabase is not configured. Add credentials to .env.local and run the migration.";

async function client() {
  await requireAdmin();
  if (!isSupabaseConfigured) throw new Error(GUARD_MSG);
  return createClient();
}

function bust() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const b = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const n = (fd: FormData, k: string) => Number(fd.get(k) ?? 0) || 0;
const nullable = (v: string) => (v === "" ? null : v);

// ─────────────────────────── Settings ───────────────────────────
export async function updateSettings(
  _p: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const supabase = await client();
    const { error } = await supabase
      .from("site_settings")
      .update({
        brand_name: s(fd, "brand_name"),
        email: s(fd, "email"),
        city: s(fd, "city"),
        country: s(fd, "country"),
        instagram_url: nullable(s(fd, "instagram_url")),
        facebook_url: nullable(s(fd, "facebook_url")),
        tiktok_url: nullable(s(fd, "tiktok_url")),
        whatsapp_business: nullable(s(fd, "whatsapp_business")),
        seo_title_en: nullable(s(fd, "seo_title_en")),
        seo_title_ar: nullable(s(fd, "seo_title_ar")),
        seo_description_en: nullable(s(fd, "seo_description_en")),
        seo_description_ar: nullable(s(fd, "seo_description_ar")),
      })
      .eq("id", true);
    if (error) return { error: error.message };
    bust();
    return { ok: true, message: "Settings saved." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ─────────────────────────── Categories ─────────────────────────
export async function saveCategory(
  _p: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const supabase = await client();
    const id = s(fd, "id");
    const payload = {
      slug: slugify(s(fd, "slug") || s(fd, "name_en")),
      name_en: s(fd, "name_en"),
      name_ar: s(fd, "name_ar"),
      description_en: nullable(s(fd, "description_en")),
      description_ar: nullable(s(fd, "description_ar")),
      hero_image: nullable(s(fd, "hero_image")),
      sort_order: n(fd, "sort_order"),
      is_visible: b(fd, "is_visible"),
    };
    const { error } = id
      ? await supabase.from("categories").update(payload).eq("id", id)
      : await supabase.from("categories").insert(payload);
    if (error) return { error: error.message };
    bust();
    return { ok: true, message: "Category saved." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteCategory(fd: FormData) {
  const supabase = await client();
  await supabase.from("categories").delete().eq("id", s(fd, "id"));
  bust();
  redirect("/admin/categories");
}

// ─────────────────────────── Products ───────────────────────────
function productPayload(fd: FormData) {
  return {
    category_id: s(fd, "category_id"),
    slug: slugify(s(fd, "slug") || s(fd, "name_en")),
    name_en: s(fd, "name_en"),
    name_ar: s(fd, "name_ar"),
    description_en: nullable(s(fd, "description_en")),
    description_ar: nullable(s(fd, "description_ar")),
    materials_en: nullable(s(fd, "materials_en")),
    materials_ar: nullable(s(fd, "materials_ar")),
    dimensions: nullable(s(fd, "dimensions")),
    finish_en: nullable(s(fd, "finish_en")),
    finish_ar: nullable(s(fd, "finish_ar")),
    custom_dimensions: b(fd, "custom_dimensions"),
    custom_colors: b(fd, "custom_colors"),
    featured: b(fd, "featured"),
    status: (s(fd, "status") || "draft") as "draft" | "published" | "hidden",
    sort_order: n(fd, "sort_order"),
    seo_title_en: nullable(s(fd, "seo_title_en")),
    seo_title_ar: nullable(s(fd, "seo_title_ar")),
    seo_description_en: nullable(s(fd, "seo_description_en")),
    seo_description_ar: nullable(s(fd, "seo_description_ar")),
  };
}

export async function createProduct(
  _p: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("products")
      .insert(productPayload(fd))
      .select("id")
      .single();
    if (error || !data) return { error: error?.message ?? "Insert failed." };
    bust();
    redirect(`/admin/products/${data.id}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { error: (e as Error).message };
  }
}

export async function updateProduct(
  _p: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const supabase = await client();
    const { error } = await supabase
      .from("products")
      .update(productPayload(fd))
      .eq("id", s(fd, "id"));
    if (error) return { error: error.message };
    bust();
    return { ok: true, message: "Product saved." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function quickProductUpdate(fd: FormData) {
  const supabase = await client();
  const id = s(fd, "id");
  const patch: Partial<
    Pick<import("@/lib/supabase/types").ProductRow, "status" | "featured" | "sort_order">
  > = {};
  if (fd.has("status")) patch.status = s(fd, "status") as never;
  if (fd.has("featured")) patch.featured = b(fd, "featured");
  if (fd.has("sort_order")) patch.sort_order = n(fd, "sort_order");
  await supabase.from("products").update(patch).eq("id", id);
  bust();
}

export async function duplicateProduct(fd: FormData) {
  const supabase = await client();
  const id = s(fd, "id");
  const { data: src } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (!src) return;
  const {
    id: _i,
    created_at: _c,
    updated_at: _u,
    ...rest
  } = src as Record<string, unknown>;
  void _i;
  void _c;
  void _u;
  const { data: copy } = await supabase
    .from("products")
    .insert({
      ...(rest as Record<string, never>),
      slug: `${src.slug}-copy-${Date.now().toString(36)}`,
      name_en: `${src.name_en} (copy)`,
      status: "draft",
      featured: false,
    })
    .select("id")
    .single();
  bust();
  if (copy) redirect(`/admin/products/${copy.id}`);
}

export async function deleteProduct(fd: FormData) {
  const supabase = await client();
  await supabase.from("products").delete().eq("id", s(fd, "id"));
  bust();
  redirect("/admin/products");
}

// ───────────────────── Product images ──────────────────────────
export async function uploadProductImages(
  _p: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const supabase = await client();
    const productId = s(fd, "product_id");
    const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (!files.length) return { error: "No files selected." };

    const { data: existing } = await supabase
      .from("product_images")
      .select("id, sort_order")
      .eq("product_id", productId);
    let order = (existing ?? []).reduce((m, r) => Math.max(m, r.sort_order + 1), 0);
    const hasCover = (existing ?? []).length > 0;

    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type))
        continue;
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${productId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, Buffer.from(await file.arrayBuffer()), {
          contentType: file.type,
        });
      if (upErr) return { error: upErr.message };
      await supabase.from("product_images").insert({
        product_id: productId,
        storage_path: path,
        sort_order: order,
        is_cover: !hasCover && order === 0,
      });
      order++;
    }
    revalidatePath(`/admin/products/${productId}`);
    bust();
    return { ok: true, message: "Images uploaded." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function setCoverImage(fd: FormData) {
  const supabase = await client();
  const productId = s(fd, "product_id");
  const imageId = s(fd, "image_id");
  await supabase
    .from("product_images")
    .update({ is_cover: false })
    .eq("product_id", productId);
  await supabase.from("product_images").update({ is_cover: true }).eq("id", imageId);
  revalidatePath(`/admin/products/${productId}`);
  bust();
}

export async function deleteProductImage(fd: FormData) {
  const supabase = await client();
  const id = s(fd, "image_id");
  const productId = s(fd, "product_id");
  const { data: img } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("id", id)
    .single();
  if (img?.storage_path && !img.storage_path.startsWith("http")) {
    await supabase.storage.from("product-images").remove([img.storage_path]);
  }
  await supabase.from("product_images").delete().eq("id", id);
  revalidatePath(`/admin/products/${productId}`);
  bust();
}

export async function reorderProductImages(productId: string, ids: string[]) {
  await requireAdmin();
  if (!isSupabaseConfigured) return;
  const supabase = await createClient();
  await Promise.all(
    ids.map((id, i) =>
      supabase.from("product_images").update({ sort_order: i }).eq("id", id),
    ),
  );
  revalidatePath(`/admin/products/${productId}`);
  bust();
}

export async function updateImageAlt(fd: FormData) {
  const supabase = await client();
  await supabase
    .from("product_images")
    .update({ alt_en: nullable(s(fd, "alt_en")), alt_ar: nullable(s(fd, "alt_ar")) })
    .eq("id", s(fd, "image_id"));
  revalidatePath(`/admin/products/${s(fd, "product_id")}`);
}

// ─────────────────────────── Inquiries ──────────────────────────
export async function updateInquiry(
  _p: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const supabase = await client();
    const { error } = await supabase
      .from("inquiries")
      .update({
        status: s(fd, "status") as never,
        internal_note: nullable(s(fd, "internal_note")),
      })
      .eq("id", s(fd, "id"));
    if (error) return { error: error.message };
    revalidatePath("/admin/inquiries");
    return { ok: true, message: "Inquiry updated." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ─────────────────────────── Page content ───────────────────────
export async function savePageContent(
  key: string,
  data: Record<string, unknown>,
) {
  const supabase = await client();
  await supabase
    .from("page_content")
    .upsert({ key, data }, { onConflict: "key" });
  bust();
}

export async function updateHomepage(
  _p: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await savePageContent("home", {
      hero_image: nullable(s(fd, "hero_image")),
      hero_title_en: nullable(s(fd, "hero_title_en")),
      hero_title_ar: nullable(s(fd, "hero_title_ar")),
      hero_support_en: nullable(s(fd, "hero_support_en")),
      hero_support_ar: nullable(s(fd, "hero_support_ar")),
      custom_body_en: nullable(s(fd, "custom_body_en")),
      custom_body_ar: nullable(s(fd, "custom_body_ar")),
    });
    return { ok: true, message: "Homepage saved." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function updateAboutContent(
  _p: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await savePageContent("about", {
      intro_image: nullable(s(fd, "intro_image")),
      inspiration_image: nullable(s(fd, "inspiration_image")),
      body_en: nullable(s(fd, "body_en")),
      body_ar: nullable(s(fd, "body_ar")),
      founded_year: nullable(s(fd, "founded_year")),
    });
    return { ok: true, message: "About page saved." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function saveFounder(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const supabase = await client();
    const id = s(fd, "id");
    const payload = {
      name_en: s(fd, "name_en"),
      name_ar: s(fd, "name_ar"),
      role_en: s(fd, "role_en"),
      role_ar: s(fd, "role_ar"),
      photo: nullable(s(fd, "photo")),
      sort_order: n(fd, "sort_order"),
    };
    const { error } = id
      ? await supabase.from("founders").update(payload).eq("id", id)
      : await supabase.from("founders").insert(payload);
    if (error) return { error: error.message };
    bust();
    return { ok: true, message: "Founder saved." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ─────────────────────────── Media ──────────────────────────────
export async function uploadMedia(
  _p: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const supabase = await client();
    const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("site-media")
        .upload(path, Buffer.from(await file.arrayBuffer()), {
          contentType: file.type,
        });
      if (error) return { error: error.message };
      await supabase.from("media").insert({
        storage_path: path,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
      });
    }
    revalidatePath("/admin/media");
    return { ok: true, message: "Uploaded." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteMedia(fd: FormData) {
  const supabase = await client();
  const id = s(fd, "id");
  const { data: m } = await supabase
    .from("media")
    .select("storage_path")
    .eq("id", id)
    .single();
  if (m?.storage_path)
    await supabase.storage.from("site-media").remove([m.storage_path]);
  await supabase.from("media").delete().eq("id", id);
  revalidatePath("/admin/media");
}
