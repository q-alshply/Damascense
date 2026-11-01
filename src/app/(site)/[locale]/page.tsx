import { setRequestLocale } from "next-intl/server";
import { getCategories } from "@/lib/queries/categories";
import { getProducts } from "@/lib/queries/products";
import { getPageContent } from "@/lib/queries/content";
import { IMAGES } from "@/lib/fallback/data";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { CustomMade } from "@/components/home/CustomMade";
import { BrandStory } from "@/components/home/BrandStory";
import { CraftSection } from "@/components/home/CraftSection";
import { InquiryCTA } from "@/components/home/InquiryCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, featured, home, about] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 6 }),
    getPageContent("home"),
    getPageContent("about"),
  ]);

  const heroImage = (home.hero_image as string) || IMAGES.heroMirror;
  const storyImage = (about.intro_image as string) || IMAGES.workshop;
  const ar = locale === "ar";
  const pick = (en: string, arKey: string) =>
    (ar ? (home[arKey] as string) : (home[en] as string)) || undefined;

  return (
    <>
      <Hero
        image={heroImage}
        title={pick("hero_title_en", "hero_title_ar")}
        support={pick("hero_support_en", "hero_support_ar")}
      />
      <FeaturedCategories categories={categories} />
      <SelectedWorks products={featured} />
      <CustomMade body={pick("custom_body_en", "custom_body_ar")} />
      <BrandStory image={storyImage} />
      <CraftSection />
      <InquiryCTA />
    </>
  );
}
