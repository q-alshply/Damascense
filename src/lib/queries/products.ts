import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  fallbackImagesFor,
} from "@/lib/fallback/data";
import { publicImageUrl } from "./media";
import type { Product, ProductImage } from "./types";
import type { ProductImageRow, ProductRow } from "@/lib/supabase/types";

const SELECT = `
  *,
  category:categories!inner ( id, slug, name_en, name_ar ),
  images:product_images ( * )
`;

type Raw = ProductRow & {
  category: Product["category"];
  images: ProductImageRow[];
};

function shape(raw: Raw): Product {
  const images: ProductImage[] = [...raw.images]
    .sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order)
    .map((i) => ({ ...i, url: publicImageUrl(i.storage_path) ?? "" }));
  const cover = images.find((i) => i.is_cover) ?? images[0] ?? null;
  return { ...raw, category: raw.category, images, cover };
}

function fallbackProduct(slug?: string, id?: string): Product[] {
  return FALLBACK_PRODUCTS.filter(
    (p) => (!slug || p.slug === slug) && (!id || p.id === id),
  ).map((p) => {
    const cat = FALLBACK_CATEGORIES.find((c) => c.id === p.category_id)!;
    const images: ProductImage[] = fallbackImagesFor(p.id).map((i) => ({
      ...i,
      url: i.storage_path,
    }));
    const { cover: _c, gallery: _g, ...row } = p;
    void _c;
    void _g;
    return {
      ...(row as ProductRow),
      category: {
        id: cat.id,
        slug: cat.slug,
        name_en: cat.name_en,
        name_ar: cat.name_ar,
      },
      images,
      cover: images[0] ?? null,
    };
  });
}

export interface ProductQuery {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  excludeId?: string;
}

export const getProducts = cache(
  async (q: ProductQuery = {}): Promise<Product[]> => {
    if (!isSupabaseConfigured) {
      let list = fallbackProduct();
      if (q.categorySlug)
        list = list.filter((p) => p.category.slug === q.categorySlug);
      if (q.featured) list = list.filter((p) => p.featured);
      if (q.excludeId) list = list.filter((p) => p.id !== q.excludeId);
      list.sort((a, b) => a.sort_order - b.sort_order);
      return q.limit ? list.slice(0, q.limit) : list;
    }
    try {
      const supabase = createPublicClient();
      let query = supabase
        .from("products")
        .select(SELECT)
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      if (q.categorySlug) query = query.eq("category.slug", q.categorySlug);
      if (q.featured) query = query.eq("featured", true);
      if (q.excludeId) query = query.neq("id", q.excludeId);
      if (q.limit) query = query.limit(q.limit);
      const { data, error } = await query;
      if (error || !data) return [];
      return (data as unknown as Raw[]).map(shape);
    } catch {
      return [];
    }
  },
);

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    if (!isSupabaseConfigured) return fallbackProduct(slug)[0] ?? null;
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("products")
        .select(SELECT)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      return data ? shape(data as unknown as Raw) : null;
    } catch {
      return null;
    }
  },
);

export const getAllPublishedSlugs = cache(async () => {
  const list = await getProducts();
  return list.map((p) => ({ slug: p.slug, categorySlug: p.category.slug }));
});
