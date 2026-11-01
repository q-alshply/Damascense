import type {
  CategoryRow,
  ProductImageRow,
  ProductRow,
} from "@/lib/supabase/types";

export type Category = CategoryRow;

export interface ProductImage extends ProductImageRow {
  /** Fully-qualified URL, resolved from storage or already absolute. */
  url: string;
}

export interface Product extends ProductRow {
  category: Pick<CategoryRow, "id" | "slug" | "name_en" | "name_ar">;
  images: ProductImage[];
  cover: ProductImage | null;
}
