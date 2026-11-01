import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getCategories } from "@/lib/queries/categories";
import { getProducts } from "@/lib/queries/products";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const staticPaths = ["", "/work", "/about", "/custom-request"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${BASE}/${locale}${p}`,
        changeFrequency: "monthly",
        priority: p === "" ? 1 : 0.7,
      });
    }
    for (const c of categories) {
      entries.push({
        url: `${BASE}/${locale}/work/${c.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const pr of products) {
      entries.push({
        url: `${BASE}/${locale}/work/${pr.category.slug}/${pr.slug}`,
        lastModified: pr.updated_at,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
