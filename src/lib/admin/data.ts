import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  FALLBACK_SETTINGS,
} from "@/lib/fallback/data";
import type {
  CategoryRow,
  InquiryRow,
  ProductImageRow,
  ProductRow,
  SiteSettingsRow,
} from "@/lib/supabase/types";

export const notConfigured = () => !isSupabaseConfigured;

export async function adminOverview() {
  if (notConfigured()) {
    return {
      published: FALLBACK_PRODUCTS.filter((p) => p.status === "published").length,
      draft: 0,
      featured: FALLBACK_PRODUCTS.filter((p) => p.featured).length,
      inquiries: 0,
      unread: 0,
      recentInquiries: [] as InquiryRow[],
      recentProducts: FALLBACK_PRODUCTS.slice(0, 5).map((p) => ({
        id: p.id,
        name_en: p.name_en,
        status: p.status,
        updated_at: new Date().toISOString(),
      })),
    };
  }
  const supabase = await createClient();
  const [products, inquiriesCount, unreadCount, recentInq, recentProd] =
    await Promise.all([
      supabase.from("products").select("status, featured"),
      supabase.from("inquiries").select("id", { count: "exact", head: true }),
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("products")
        .select("id, name_en, status, updated_at")
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);

  const rows = products.data ?? [];
  return {
    published: rows.filter((r) => r.status === "published").length,
    draft: rows.filter((r) => r.status === "draft").length,
    featured: rows.filter((r) => r.featured).length,
    inquiries: inquiriesCount.count ?? 0,
    unread: unreadCount.count ?? 0,
    recentInquiries: recentInq.data ?? [],
    recentProducts: recentProd.data ?? [],
  };
}

export async function adminListProducts(): Promise<
  (ProductRow & { category: Pick<CategoryRow, "name_en" | "slug"> | null })[]
> {
  if (notConfigured()) {
    return FALLBACK_PRODUCTS.map((p) => {
      const { cover: _c, gallery: _g, ...row } = p;
      void _c;
      void _g;
      const cat = FALLBACK_CATEGORIES.find((c) => c.id === p.category_id)!;
      return {
        ...(row as ProductRow),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: { name_en: cat.name_en, slug: cat.slug },
      };
    });
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(name_en, slug)")
    .order("sort_order");
  return (data ?? []) as never;
}

export async function adminGetProduct(id: string) {
  if (notConfigured()) {
    const p = FALLBACK_PRODUCTS.find((x) => x.id === id);
    if (!p) return null;
    const { cover, gallery, ...row } = p;
    return {
      product: { ...(row as ProductRow), created_at: "", updated_at: "" },
      images: [cover, ...gallery].map((path, i) => ({
        id: `${id}-${i}`,
        product_id: id,
        storage_path: path,
        alt_en: p.name_en,
        alt_ar: p.name_ar,
        sort_order: i,
        is_cover: i === 0,
        created_at: "",
      })) as ProductImageRow[],
    };
  }
  const supabase = await createClient();
  const [{ data: product }, { data: images }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("product_images")
      .select("*")
      .eq("product_id", id)
      .order("sort_order"),
  ]);
  if (!product) return null;
  return { product, images: images ?? [] };
}

export async function adminListCategories(): Promise<CategoryRow[]> {
  if (notConfigured()) return FALLBACK_CATEGORIES;
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function adminListInquiries(): Promise<InquiryRow[]> {
  if (notConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function adminGetInquiry(id: string) {
  if (notConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select("*, category:categories(name_en), product:products(name_en, slug)")
    .eq("id", id)
    .maybeSingle();
  return data as
    | (InquiryRow & {
        category: { name_en: string } | null;
        product: { name_en: string; slug: string } | null;
      })
    | null;
}

export async function adminSettings(): Promise<SiteSettingsRow> {
  if (notConfigured()) return FALLBACK_SETTINGS;
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data ?? FALLBACK_SETTINGS;
}

export async function adminPageContent(key: string): Promise<Record<string, unknown>> {
  if (notConfigured()) return {};
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("*")
    .eq("key", key)
    .maybeSingle();
  return (data?.data as Record<string, unknown>) ?? {};
}
