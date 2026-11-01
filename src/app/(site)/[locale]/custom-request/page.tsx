import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { CustomRequestForm } from "@/components/forms/CustomRequestForm";
import { getInquiryProductOptions } from "./actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "custom" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: { canonical: `/${locale}/custom-request` },
    robots: { index: true, follow: true },
  };
}

export default async function CustomRequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("custom");
  const products = await getInquiryProductOptions(locale);

  return (
    <div className="pb-32 pt-36">
      <PageHeader eyebrow={t("title")} title={t("title")} lead={t("intro")} />
      <div className="mx-auto mt-16 max-w-3xl px-gutter">
        <Suspense fallback={<div className="h-96" />}>
          <CustomRequestForm products={products} />
        </Suspense>
      </div>
    </div>
  );
}
