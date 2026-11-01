import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { FALLBACK_CATEGORIES } from "@/lib/fallback/data";
import type { Category } from "./types";

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured) return FALLBACK_CATEGORIES;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    return data && data.length ? data : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    const all = await getCategories();
    return all.find((c) => c.slug === slug) ?? null;
  },
);
