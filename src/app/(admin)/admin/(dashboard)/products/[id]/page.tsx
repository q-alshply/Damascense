import { notFound } from "next/navigation";
import Link from "next/link";
import { adminGetProduct, adminListCategories, notConfigured } from "@/lib/admin/data";
import { PageTitle, Banner } from "@/components/admin/ui";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { ProductImages } from "@/components/admin/ProductImages";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [data, categories] = await Promise.all([
    adminGetProduct(id),
    adminListCategories(),
  ]);
  if (!data) notFound();

  return (
    <div className="max-w-3xl space-y-8">
      <PageTitle
        title={data.product.name_en}
        action={
          <Link
            href={`/en/work/${categories.find((c) => c.id === data.product.category_id)?.slug}/${data.product.slug}`}
            target="_blank"
            className="text-xs uppercase tracking-[0.12em] text-ivory/50 hover:text-ivory"
          >
            View ↗
          </Link>
        }
      />
      {notConfigured() && <Banner kind="info">Read-only — Supabase not configured.</Banner>}
      <ProductEditor product={data.product} categories={categories} />
      <ProductImages productId={id} images={data.images} />
    </div>
  );
}
