"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { loc, cn } from "@/lib/utils";
import type { Category } from "@/lib/queries/types";
import type { Product } from "@/lib/queries/types";

const SHAPES = ["portrait", "landscape", "tall", "square"] as const;

export function WorkArchive({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}) {
  const t = useTranslations("work");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [active, setActive] = useState<string>(initialCategory ?? "all");

  const filtered = useMemo(
    () =>
      active === "all"
        ? products
        : products.filter((p) => p.category.slug === active),
    [active, products],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("categoryLabel")}
        className="flex flex-wrap gap-x-8 gap-y-3 border-b border-line pb-6"
      >
        {[{ slug: "all", label: tc("allCategories") }, ...categories.map((c) => ({
          slug: c.slug,
          label: loc(c, "name", locale),
        }))].map((f) => (
          <button
            key={f.slug}
            role="tab"
            aria-selected={active === f.slug}
            onClick={() => setActive(f.slug)}
            className={cn(
              "text-xs uppercase tracking-[0.16em] transition-colors",
              active === f.slug ? "text-ivory" : "text-ivory/40 hover:text-ivory/80",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-ivory/50">{t("filterEmpty")}</p>
      ) : (
        <div
          key={active}
          className="mt-14 grid animate-[fade-in_0.5s_ease] grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className={cn(i % 5 === 0 && "sm:col-span-2 lg:col-span-2")}
            >
              <ProductCard
                product={p}
                shape={SHAPES[i % SHAPES.length]}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
