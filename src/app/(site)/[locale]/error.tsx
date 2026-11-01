"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-gutter py-32 text-center">
      <div>
        <h1 className="font-display text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ivory/55">{t("body")}</p>
        <button
          onClick={reset}
          className="mt-8 border border-ivory/25 px-7 py-4 text-xs uppercase tracking-[0.16em] hover:bg-ivory/5"
        >
          {t("retry")}
        </button>
      </div>
    </div>
  );
}
