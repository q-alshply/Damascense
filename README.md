# Damascense Studio

Bilingual (English / Arabic, RTL-aware) luxury portfolio website and CMS for
**Damascense Studio** — a Damascus design studio making decorative mirrors,
clocks and wooden crafts inspired by Damascene visual heritage.

Not an e-commerce site: no cart, checkout or prices. Visitors explore the
portfolio and submit **custom-order inquiries** with their WhatsApp number; the
team follows up manually.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll, `prefers-reduced-motion` aware |
| i18n | next-intl v4 — `/en`, `/ar`, localized metadata, independent content per language |
| Backend | Supabase — Postgres, Auth, Storage, Row Level Security |
| Forms | React Hook Form + Zod |
| Email | Resend |

## Running before Supabase exists

The site **builds and runs with no backend**. The query layer
(`src/lib/queries/*`) falls back to seed data in `src/lib/fallback/data.ts`
whenever Supabase credentials are absent, and `/admin` shows that data
read-only. This lets you develop the front end immediately.

```bash
npm install
cp .env.example .env.local     # NEXT_PUBLIC_SITE_URL is enough to start
npm run dev                     # http://localhost:3000  → redirects to /en
```

## Full setup with Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → run, in order:
   - `supabase/migrations/0001_init.sql` (schema, RLS, storage buckets)
   - `supabase/seed.sql` (categories, 12 sample products, founders, content)
3. **Authentication → Users → Add user** — create your admin account
   (set a password, confirm the email).
4. Edit `supabase/migrations/0002_admin.sql`, put your email in, run it.
5. Fill `.env.local`:

   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...        # server only — never shipped to the client
   RESEND_API_KEY=re_...
   INQUIRY_TO_EMAIL=damascense@gmail.com
   INQUIRY_FROM_EMAIL=Damascense Studio <notifications@your-verified-domain.com>
   ```

6. `npm run dev`, sign in at `/admin/login`.

If `RESEND_API_KEY` is missing, inquiries are still saved to the database and
shown in the dashboard — only the notification email is skipped.

## Structure

```
src/
  app/
    (site)/[locale]/      public site — home, work, work/[category]/[slug],
                          about, custom-request, 404 / error / loading
    (admin)/admin/        CMS — login + (dashboard) route group (auth-guarded)
    sitemap.ts robots.ts
  components/
    animations/  brand/  navigation/  layout/  portfolio/  home/  forms/
    ui/  admin/
  i18n/                   next-intl routing, navigation, request config
  lib/
    supabase/  queries/  admin/  validation/  email/  fallback/
messages/                 en.json, ar.json  (all UI copy; CMS holds page content)
supabase/migrations/      0001_init.sql, 0002_admin.sql
supabase/seed.sql
```

## Admin dashboard (`/admin`)

Not linked anywhere on the public site; routes are guarded server-side in
middleware **and** in the dashboard layout (`requireAdmin()` checks the
`admin_users` allow-list, re-enforced by RLS on every write).

Overview · Products (CRUD, duplicate, publish/draft/hide, feature, reorder,
multi-image upload with cover + reorder + alt text) · Categories · Homepage
(controlled content slots) · About (copy, founders, images) · Inquiries
(status workflow, internal notes, signed reference-image links, copy
email/WhatsApp) · Media · Settings (brand, contact, socials, SEO defaults).

## Motion

- First visit plays a ~1.6s loader (floral mark draw + logo reveal), suppressed
  for the rest of the session via `sessionStorage`.
- Hero parallax, cinematic category sections, restrained card reveals.
- `prefers-reduced-motion`: Lenis disabled, parallax/pinning skipped, opacity
  only.
- Custom cursor on `pointer: fine` devices only.

## Replacing placeholder imagery

All sample images are Unsplash URLs. Swap them from `/admin`:
Products → per-product image manager · Categories → hero image · Homepage /
About → image fields. No code changes needed.

## Deploy

Deploy on Vercel (or any Node host). Set every variable from `.env.example` in
the host's environment. `npm run build` must pass — it does.
