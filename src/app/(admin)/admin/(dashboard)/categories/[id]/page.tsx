import { notFound } from "next/navigation";
import { adminListCategories } from "@/lib/admin/data";
import { PageTitle } from "@/components/admin/ui";
import { CategoryEditor } from "@/components/admin/CategoryEditor";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = (await adminListCategories()).find((c) => c.id === id);
  if (!category) notFound();

  return (
    <div className="max-w-3xl">
      <PageTitle title={category.name_en} />
      <CategoryEditor category={category} />
    </div>
  );
}
