import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategories } from "@/lib/queries/categories";
import { getProducts } from "@/lib/queries/products";
import { WorkArchive } from "@/components/portfolio/WorkArchive";
import { PageHeader } from "@/components/layout/PageHeader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { canonical: `/${locale}/work` },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="pb-32 pt-36">
      <PageHeader eyebrow="01 — Archive" title={t("title")} lead={t("intro")} />
      <div className="mx-auto mt-16 max-w-[1600px] px-gutter">
        {products.length === 0 ? (
          <p className="py-24 text-center text-ivory/50">{t("empty")}</p>
        ) : (
          <WorkArchive products={products} categories={categories} />
        )}
      </div>
    </div>
  );
}
