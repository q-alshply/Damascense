import { PageTitle } from "@/components/admin/ui";
import { CategoryEditor } from "@/components/admin/CategoryEditor";

export default function NewCategoryPage() {
  return (
    <div className="max-w-3xl">
      <PageTitle title="New category" />
      <CategoryEditor />
    </div>
  );
}
