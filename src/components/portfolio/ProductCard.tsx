import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppImage } from "@/components/ui/AppImage";
import { loc } from "@/lib/utils";
import type { Product } from "@/lib/queries/types";

const RATIO: Record<string, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  tall: "aspect-[2/3]",
};

export function ProductCard({
  product,
  shape = "portrait",
  sizes = "(max-width:768px) 100vw, 33vw",
  priority = false,
}: {
  product: Product;
  shape?: keyof typeof RATIO;
  sizes?: string;
  priority?: boolean;
}) {
  const locale = useLocale();
  const name = loc(product, "name", locale);
  const category = loc(product.category, "name", locale);

  return (
    <Link
      href={`/work/${product.category.slug}/${product.slug}`}
      data-cursor="view"
      className="group block"
    >
      <div className="relative overflow-hidden">
        <AppImage
          src={product.cover?.url}
          alt={product.cover?.alt_en ?? name}
          sizes={sizes}
          priority={priority}
          className={RATIO[shape]}
          imgClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl text-ivory transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
          {name}
        </h3>
        <span className="shrink-0 text-[0.65rem] uppercase tracking-[0.18em] text-ivory/45">
          {category}
        </span>
      </div>
    </Link>
  );
}
