import { getTranslations } from "next-intl/server";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { CTALink } from "@/components/ui/CTALink";
import type { Product } from "@/lib/queries/types";

export async function SelectedWorks({ products }: { products: Product[] }) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  if (!products.length) return null;

  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">{t("selectedWorksEyebrow")}</span>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,4vw,3.25rem)] leading-tight">
              {t("selectedWorksTitle")}
            </h2>
          </div>
          <CTALink href="/work" variant="ghost">
            {tc("viewProject")}
          </CTALink>
        </div>
        <div className="mt-16">
          <PortfolioGrid products={products.slice(0, 4)} />
        </div>
      </div>
    </section>
  );
}
