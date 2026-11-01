import { getTranslations } from "next-intl/server";
import { CTALink } from "@/components/ui/CTALink";
import { FloralMark } from "@/components/brand/FloralMark";

export async function InquiryCTA() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <section className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <FloralMark
        aria-hidden
        outline
        className="pointer-events-none absolute -end-16 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 text-ivory/[0.04]"
      />
      <div className="mx-auto max-w-[1600px] px-gutter">
        <h2 className="max-w-3xl font-display text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.05]">
          {t("inquiryTitle")}
        </h2>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/65">
          {t("inquiryBody")}
        </p>
        <div className="mt-10">
          <CTALink href="/custom-request" variant="solid">
            {tc("startCustomRequest")}
          </CTALink>
        </div>
      </div>
    </section>
  );
}
