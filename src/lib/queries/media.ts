import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Resolve a stored path to a public URL. Absolute URLs pass through. */
export function publicImageUrl(
  path: string | null | undefined,
  bucket = "product-images",
): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!isSupabaseConfigured) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${bucket}/${path.replace(/^\//, "")}`;
}
