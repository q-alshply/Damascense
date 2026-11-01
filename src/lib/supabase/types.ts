/**
 * Hand-maintained database types mirroring supabase/migrations.
 * Regenerate with `supabase gen types typescript` once the project is linked.
 */

export type ProductStatus = "draft" | "published" | "hidden";
export type InquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "closed"
  | "archived";

export type CategoryRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  hero_image: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductRow = {
  id: string;
  category_id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  materials_en: string | null;
  materials_ar: string | null;
  dimensions: string | null;
  finish_en: string | null;
  finish_ar: string | null;
  custom_dimensions: boolean;
  custom_colors: boolean;
  featured: boolean;
  status: ProductStatus;
  sort_order: number;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductImageRow = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_en: string | null;
  alt_ar: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

export type InquiryRow = {
  id: string;
  reference_number: string;
  created_at: string;
  name: string;
  country: string;
  email: string;
  whatsapp: string;
  interested_in: string;
  category_id: string | null;
  product_id: string | null;
  dimensions: string | null;
  preferred_finish: string | null;
  message: string;
  reference_image: string | null;
  status: InquiryStatus;
  internal_note: string | null;
}

export type SiteSettingsRow = {
  id: boolean;
  brand_name: string;
  email: string;
  city: string;
  country: string;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  whatsapp_business: string | null;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
  updated_at: string;
}

export type PageContentRow = {
  key: string;
  data: Record<string, unknown>;
  updated_at: string;
}

export type FounderRow = {
  id: string;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  photo: string | null;
  sort_order: number;
}

export type MediaRow = {
  id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

type TableShape<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      categories: TableShape<CategoryRow>;
      products: TableShape<ProductRow>;
      product_images: TableShape<ProductImageRow>;
      inquiries: TableShape<InquiryRow>;
      site_settings: TableShape<SiteSettingsRow>;
      page_content: TableShape<PageContentRow>;
      founders: TableShape<FounderRow>;
      media: TableShape<MediaRow>;
      admin_users: TableShape<{
        user_id: string;
        email: string;
        created_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      product_status: ProductStatus;
      inquiry_status: InquiryStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
