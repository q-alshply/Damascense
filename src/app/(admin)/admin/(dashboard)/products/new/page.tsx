import { adminListCategories } from "@/lib/admin/data";
import { PageTitle, Banner } from "@/components/admin/ui";
import { ProductEditor } from "@/components/admin/ProductEditor";

export default async function NewProductPage() {
  const categories = await adminListCategories();
  return (
    <div className="max-w-3xl">
      <PageTitle title="New product" />
      <Banner kind="info">
        Save the product first, then add images on the edit screen.
      </Banner>
      <ProductEditor categories={categories} />
    </div>
  );
}
