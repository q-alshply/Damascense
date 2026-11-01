import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { getCategories, getCategoryBySlug } from "@/lib/queries/categories";
import { getProducts } from "@/lib/queries/products";
import { loc } from "@/lib/utils";
import { AppImage } from "@/components/ui/AppImage";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryCTA } from "@/components/portfolio/CategoryCTA";

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: loc(cat, "name", locale),
    description: loc(cat, "description", locale),
    alternates: { canonical: `/${locale}/work/${category}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const products = await getProducts({ categorySlug: category });
  const t = await getTranslations("category");
  const l = await getLocale();

  return (
    <div className="pb-32 pt-36">
      <PageHeader
        eyebrow={loc(cat, "name", l)}
        title={loc(cat, "name", l)}
        lead={loc(cat, "description", l)}
      />

      {cat.hero_image && (
        <div className="mx-auto mt-16 max-w-[1600px] px-gutter">
          <AppImage
            src={cat.hero_image}
            alt=""
            sizes="100vw"
            priority
            className="aspect-[16/9] w-full"
          />
        </div>
      )}

      <div className="mx-auto mt-20 max-w-[1600px] px-gutter">
        <span className="eyebrow">{t("exploreGrid")}</span>
        <div className="mt-10">
          {products.length ? (
            <PortfolioGrid products={products} />
          ) : (
            <p className="py-16 text-ivory/50">—</p>
          )}
        </div>
      </div>

      <CategoryCTA />
    </div>
  );
}
