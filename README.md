# Meridian — Specialty Coffee (Coming Soon)

Editorial dark/light coming-soon site for a specialty coffee brand. Three pages (Home, About, Thanks) + API route for waitlist signups wired to Supabase + Resend welcome emails.

## Stack

- Astro 5 (server output)
- `@astrojs/vercel` adapter
- Tailwind v4 (via `@tailwindcss/vite`)
- Supabase (waitlist + Harbor content table)
- Resend (welcome email via REST)

## Routes

- `/` — hero, brand-pillar story, two email capture forms (hero + footer CTA)
- `/about` — long-form brand story, ~900 words, trust-building
- `/thanks` — post-signup confirmation, share buttons
- `POST /api/waitlist` — accepts form-encoded or JSON `{email, source}`; writes to `meridian_waitlist` in Supabase, fires a Resend welcome email, redirects to `/thanks`

## Env vars

See `.env.example`. In Vercel:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `PUBLIC_SITE_URL`

## Supabase schema

Two tables, both RLS-enabled:

- `meridian_waitlist` — stores emails from the form. Anon can INSERT (signup) but cannot SELECT (protects the list).
- `meridian_content` — Harbor content table (slug, title, body, published_at, tags, SEO fields). Anon can SELECT rows where `published_at IS NOT NULL`. Pre-provisioned for the Harbor Writer article pipeline; unused by this site today.

## SEO

- `<SEOHead>` component with OG + Twitter meta, canonical, JSON-LD
- `@astrojs/sitemap` integration generates `sitemap-index.xml`
- `/robots.txt` (dynamic) points at the sitemap, disallows `/api/`
- Schemas: `Organization`, `WebSite`, `AboutPage`, `BreadcrumbList`, `WebPage`
- Homepage + thanks page are `noindex` until launch; About indexable

## Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env  # fill in real values
npm run dev
```

## Next steps (manual)

- Point a custom domain at the Vercel project once you have one
- Swap `onboarding@resend.dev` for your own verified domain in `src/lib/email.ts` once ready
- Toggle `noindex={true}` off the homepage/thanks page when you launch
