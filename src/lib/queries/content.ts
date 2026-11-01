import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { FALLBACK_FOUNDERS, FALLBACK_PAGE_CONTENT } from "@/lib/fallback/data";
import type { FounderRow } from "@/lib/supabase/types";

export const getPageContent = cache(
  async (key: string): Promise<Record<string, unknown>> => {
    const fallback = FALLBACK_PAGE_CONTENT[key] ?? {};
    if (!isSupabaseConfigured) return fallback;
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("page_content")
        .select("data")
        .eq("key", key)
        .maybeSingle();
      return { ...fallback, ...((data?.data as Record<string, unknown>) ?? {}) };
    } catch {
      return fallback;
    }
  },
);

export const getFounders = cache(async (): Promise<FounderRow[]> => {
  if (!isSupabaseConfigured) return FALLBACK_FOUNDERS;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("founders")
      .select("*")
      .order("sort_order", { ascending: true });
    return data && data.length ? data : FALLBACK_FOUNDERS;
  } catch {
    return FALLBACK_FOUNDERS;
  }
});
