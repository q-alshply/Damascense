import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPublishedSlugs, getProductBySlug, getProducts } from "@/lib/queries/products";
import { getSiteSettings } from "@/lib/queries/settings";
import { loc, whatsappLink } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { CTALink } from "@/components/ui/CTALink";
import { ProductGallery } from "@/components/portfolio/ProductGallery";
import { ProductCard } from "@/components/portfolio/ProductCard";

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((s) => ({ category: s.categorySlug, slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const title = loc(p, "seo_title", locale) || loc(p, "name", locale);
  const description =
    loc(p, "seo_description", locale) || loc(p, "description", locale);
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/work/${p.category.slug}/${p.slug}` },
    openGraph: {
      title,
      description,
      images: p.cover?.url ? [{ url: p.cover.url }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const l = await getLocale();
  const t = await getTranslations("product");
  const tc = await getTranslations("common");
  const settings = await getSiteSettings();
  const related = (
    await getProducts({ categorySlug: product.category.slug, excludeId: product.id, limit: 3 })
  ).filter(Boolean);

  const name = loc(product, "name", l);
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/${l}/work/${product.category.slug}/${product.slug}`;
  const askHref = whatsappLink(
    settings.whatsapp_business,
    t("whatsappPrefill", { name, url: pageUrl }),
  );
  const details = [
    product.materials_en && { label: t("materials"), value: loc(product, "materials", l) },
    product.dimensions && { label: t("dimensions"), value: product.dimensions },
    product.finish_en && { label: t("finish"), value: loc(product, "finish", l) },
  ].filter(Boolean) as { label: string; value: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: loc(product, "description", l),
    image: product.images.map((i) => i.url),
    category: loc(product.category, "name", l),
    brand: { "@type": "Brand", name: settings.brand_name },
  };

  return (
    <article className="pb-32 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-[1600px] px-gutter">
        <nav className="text-xs uppercase tracking-[0.16em] text-ivory/45">
          <Link href="/work" className="hover:text-ivory">
            {tc("viewProject")}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/work/${product.category.slug}`} className="hover:text-ivory">
            {loc(product.category, "name", l)}
          </Link>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <ProductGallery images={product.images} name={name} />

          <div className="lg:sticky lg:top-28 lg:h-fit">
            <span className="eyebrow">{loc(product.category, "name", l)}</span>
            <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-tight">
              {name}
            </h1>
            {product.description_en && (
              <p className="mt-6 text-sm leading-relaxed text-ivory/70">
                {loc(product, "description", l)}
              </p>
            )}

            {details.length > 0 && (
              <dl className="mt-10 divide-y divide-line border-y border-line">
                {details.map((d) => (
                  <div key={d.label} className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-ivory/45">{d.label}</dt>
                    <dd className="text-end text-ivory/85">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <ul className="mt-6 space-y-1 text-xs uppercase tracking-[0.14em] text-accent-soft">
              {product.custom_dimensions && <li>· {t("customDimensions")}</li>}
              {product.custom_colors && <li>· {t("customColors")}</li>}
            </ul>

            <div className="mt-10">
              <CTALink
                href={`/custom-request?product=${product.slug}`}
                variant="solid"
              >
                {tc("customizeThisPiece")}
              </CTALink>
              {askHref && (
                <a
                  href={askHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block text-xs uppercase tracking-[0.16em] text-ivory/70 underline-offset-4 hover:text-ivory hover:underline"
                >
                  {t("askWhatsapp")}
                </a>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-32 border-t border-line pt-16">
            <span className="eyebrow">{t("relatedEyebrow")}</span>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} shape="portrait" />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
