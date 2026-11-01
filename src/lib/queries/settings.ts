import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { FALLBACK_SETTINGS } from "@/lib/fallback/data";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export const getSiteSettings = cache(async (): Promise<SiteSettingsRow> => {
  if (!isSupabaseConfigured) return FALLBACK_SETTINGS;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    return data ?? FALLBACK_SETTINGS;
  } catch {
    return FALLBACK_SETTINGS;
  }
});
