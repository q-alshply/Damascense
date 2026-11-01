import { getTranslations } from "next-intl/server";
import { CTALink } from "@/components/ui/CTALink";

export async function CategoryCTA() {
  const t = await getTranslations("category");
  const tc = await getTranslations("common");
  return (
    <section className="mx-auto mt-28 max-w-[1600px] border-t border-line px-gutter pt-16">
      <h2 className="max-w-2xl font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight">
        {t("ctaTitle")}
      </h2>
      <p className="mt-4 max-w-lg text-sm text-ivory/60">{t("ctaBody")}</p>
      <div className="mt-8">
        <CTALink href="/custom-request" variant="outline">
          {tc("requestCustom")}
        </CTALink>
      </div>
    </section>
  );
}
