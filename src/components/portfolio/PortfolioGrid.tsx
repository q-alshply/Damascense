import { ProductCard } from "./ProductCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import type { Product } from "@/lib/queries/types";
import { cn } from "@/lib/utils";

/** Editorial asymmetric rhythm — avoids a flat 3-col e-commerce grid. */
const PLAN = [
  { col: "md:col-span-7", shape: "landscape" as const, offset: "" },
  { col: "md:col-span-5", shape: "portrait" as const, offset: "md:mt-24" },
  { col: "md:col-span-5", shape: "tall" as const, offset: "" },
  { col: "md:col-span-7", shape: "landscape" as const, offset: "md:mt-16" },
];

export function PortfolioGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-12", className)}>
      {products.map((p, i) => {
        const plan = PLAN[i % PLAN.length];
        return (
          <ScrollReveal
            key={p.id}
            as="div"
            className={cn(plan.col, plan.offset)}
          >
            <div data-reveal>
              <ProductCard
                product={p}
                shape={plan.shape}
                sizes="(max-width:768px) 100vw, 55vw"
                priority={i < 2}
              />
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
