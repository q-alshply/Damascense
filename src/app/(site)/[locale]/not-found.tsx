import { getTranslations } from "next-intl/server";
import { CTALink } from "@/components/ui/CTALink";
import { FloralMark } from "@/components/brand/FloralMark";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="grid min-h-[70vh] place-items-center px-gutter py-32 text-center">
      <div>
        <FloralMark outline className="mx-auto h-16 w-16 text-accent/60" aria-hidden />
        <p className="mt-8 font-display text-7xl">404</p>
        <h1 className="mt-4 font-display text-2xl">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ivory/55">{t("body")}</p>
        <div className="mt-8 flex justify-center">
          <CTALink href="/" variant="outline">
            {t("cta")}
          </CTALink>
        </div>
      </div>
    </div>
  );
}
