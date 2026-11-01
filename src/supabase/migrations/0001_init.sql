-- Damascense Studio — initial schema
-- Postgres / Supabase. Run in Supabase SQL editor or via `supabase db push`.

-- ─────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────
do $$ begin
  create type product_status as enum ('draft', 'published', 'hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inquiry_status as enum ('new', 'contacted', 'in_progress', 'closed', 'archived');
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────
-- Helper: updated_at trigger
-- ─────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ─────────────────────────────────────────────────────────────
-- Admin allow-list — only these auth users may write via RLS
-- ─────────────────────────────────────────────────────────────
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

-- ─────────────────────────────────────────────────────────────
-- Categories
-- ─────────────────────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  hero_image text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists categories_sort_idx on categories (sort_order);
create trigger categories_updated before update on categories
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Products
-- ─────────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  materials_en text,
  materials_ar text,
  dimensions text,
  finish_en text,
  finish_ar text,
  custom_dimensions boolean not null default true,
  custom_colors boolean not null default true,
  featured boolean not null default false,
  status product_status not null default 'draft',
  sort_order integer not null default 0,
  seo_title_en text,
  seo_title_ar text,
  seo_description_en text,
  seo_description_ar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on products (category_id);
create index if not exists products_status_idx on products (status);
create index if not exists products_featured_idx on products (featured) where featured;
create index if not exists products_sort_idx on products (sort_order);
create trigger products_updated before update on products
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Product images
-- ─────────────────────────────────────────────────────────────
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  alt_en text,
  alt_ar text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists product_images_product_idx on product_images (product_id, sort_order);

-- ─────────────────────────────────────────────────────────────
-- Inquiries (custom requests)
-- ─────────────────────────────────────────────────────────────
create sequence if not exists inquiry_ref_seq start 1001;

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique default ('DMS-' || to_char(now(),'YYYY') || '-' || lpad(nextval('inquiry_ref_seq')::text, 5, '0')),
  created_at timestamptz not null default now(),
  name text not null,
  country text not null,
  email text not null,
  whatsapp text not null,
  interested_in text not null,
  category_id uuid references categories(id) on delete set null,
  product_id uuid references products(id) on delete set null,
  dimensions text,
  preferred_finish text,
  message text not null,
  reference_image text,
  status inquiry_status not null default 'new',
  internal_note text
);
create index if not exists inquiries_status_idx on inquiries (status);
create index if not exists inquiries_created_idx on inquiries (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Site settings (single row)
-- ─────────────────────────────────────────────────────────────
create table if not exists site_settings (
  id boolean primary key default true check (id),
  brand_name text not null default 'Damascense Studio',
  email text not null default 'damascense@gmail.com',
  city text not null default 'Damascus',
  country text not null default 'Syria',
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  whatsapp_business text,
  seo_title_en text default 'Damascense Studio — Contemporary Damascene Decor',
  seo_title_ar text default 'Damascense Studio — قطع ديكور معاصرة مستوحاة من دمشق',
  seo_description_en text default 'Decorative mirrors, clocks and wooden objects inspired by Damascene visual heritage. Custom dimensions and finishes. Damascus, Syria.',
  seo_description_ar text default 'مرايا وساعات وقطع خشبية ديكورية مستوحاة من الإرث البصري الدمشقي، بقياسات وتشطيبات حسب الطلب. دمشق، سوريا.',
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated before update on site_settings
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Page content — keyed content slots (homepage, about, ...)
-- ─────────────────────────────────────────────────────────────
create table if not exists page_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger page_content_updated before update on page_content
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Founders
-- ─────────────────────────────────────────────────────────────
create table if not exists founders (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  role_en text not null,
  role_ar text not null,
  photo text,
  sort_order integer not null default 0
);

-- ─────────────────────────────────────────────────────────────
-- Media library
-- ─────────────────────────────────────────────────────────────
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table categories       enable row level security;
alter table products         enable row level security;
alter table product_images   enable row level security;
alter table inquiries        enable row level security;
alter table site_settings    enable row level security;
alter table page_content     enable row level security;
alter table founders         enable row level security;
alter table media            enable row level security;
alter table admin_users      enable row level security;

-- Public read of published/visible content
create policy "public reads visible categories" on categories
  for select using (is_visible or is_admin());

create policy "public reads published products" on products
  for select using (status = 'published' or is_admin());

create policy "public reads images of readable products" on product_images
  for select using (
    exists (select 1 from products p where p.id = product_id and (p.status = 'published' or is_admin()))
  );

create policy "public reads settings" on site_settings for select using (true);
create policy "public reads page content" on page_content for select using (true);
create policy "public reads founders" on founders for select using (true);

-- Anyone (anon) may submit an inquiry, but not read them
create policy "anyone can submit an inquiry" on inquiries
  for insert with check (true);

-- Admin full access
create policy "admin all categories"     on categories     for all using (is_admin()) with check (is_admin());
create policy "admin all products"       on products       for all using (is_admin()) with check (is_admin());
create policy "admin all product_images" on product_images for all using (is_admin()) with check (is_admin());
create policy "admin all inquiries"      on inquiries      for all using (is_admin()) with check (is_admin());
create policy "admin update settings"    on site_settings  for update using (is_admin()) with check (is_admin());
create policy "admin all page_content"   on page_content   for all using (is_admin()) with check (is_admin());
create policy "admin all founders"       on founders       for all using (is_admin()) with check (is_admin());
create policy "admin all media"          on media          for all using (is_admin()) with check (is_admin());
create policy "admin reads admin_users"  on admin_users    for select using (is_admin());

-- ─────────────────────────────────────────────────────────────
-- Storage buckets
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('inquiry-uploads', 'inquiry-uploads', false)
  on conflict (id) do nothing;

-- Public read for public buckets
create policy "public read product-images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "public read site-media" on storage.objects
  for select using (bucket_id = 'site-media');

-- Admin writes to public buckets
create policy "admin write product-images" on storage.objects
  for all using (bucket_id = 'product-images' and is_admin())
  with check (bucket_id = 'product-images' and is_admin());
create policy "admin write site-media" on storage.objects
  for all using (bucket_id = 'site-media' and is_admin())
  with check (bucket_id = 'site-media' and is_admin());

-- inquiry-uploads: only admins read; inserts happen server-side with the service role
create policy "admin read inquiry-uploads" on storage.objects
  for select using (bucket_id = 'inquiry-uploads' and is_admin());
