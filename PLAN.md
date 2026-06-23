# Sneakora — End-to-End Implementation Plan

**Branch:** `feat/nextjs-rebuild`
**Stack:** Next.js 15 + TypeScript + Tailwind CSS + BetterAuth + Prisma + Neon PostgreSQL + Stripe
**Methodology:** Research via Context7 MCP → Load relevant skill → Read existing code → Implement → Verify

---

## Phase 0 — Foundation (Current)

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 0.1 | Context7 MCP configured | ✅ | — |
| 0.2 | Branch `feat/nextjs-rebuild` created | ✅ | — |
| 0.3 | 24 skills installed in `.opencode/skills/` | ✅ | — |
| 0.4 | AGENTS.md / Constitution loaded | ✅ | — |

---

## Design System — Locked In

| Property | Choice |
|----------|--------|
| **Visual Direction** | Bold Energetic — vibrant colors, dynamic layouts, angular shapes, high-energy sportswear |
| **Accent Color** | Violet/Purple — premium, creative, unique |
| **Card Style** | Borderless with hover elevation (scale + shadow reveal) |
| **Animation Level** | High-Impact — parallax, 3D tilt on cards, scroll-triggered reveals, splash animations |
| **Typography** | Geist (Vercel/Next.js defaults) — clean, modern, professional |
| **Hero Style** | Full-bleed lifestyle image with overlaid text + CTA |
| **Product Images** | AI-generated gradient placeholders during dev |
| **Base Theme** | Dark mode with purple/violet neon accents |

---

## Phase 1 — Project Scaffolding & Configuration

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 1.1 | Research Next.js 15 create-next-app flags | ✅ | `next-best-practices` |
| 1.2 | Scaffold project with `create-next-app` | | `next-best-practices` |
| 1.3 | Install core dependencies (Prisma, BetterAuth, Stripe, Zod, shadcn, etc.) | | `shadcn` |
| 1.4 | Initialize shadcn/ui with `npx shadcn@latest init --defaults` | ✅ | `shadcn` |
| 1.5 | Research Prisma schema design for Neon PostgreSQL | ✅ | `supabase-postgres-best-practices` |
| 1.6 | Create `prisma/schema.prisma` with all models | ✅ | — |
| 1.7 | Research BetterAuth Prisma setup | ✅ | `better-auth-best-practices` |
| 1.8 | Create `lib/db.ts` (Prisma client singleton) | | — |
| 1.9 | Create `lib/auth.ts` (BetterAuth config with Prisma adapter) | | `create-auth-skill` |
| 1.10 | Create `app/api/auth/route.ts` (BetterAuth Next.js handler) | | `better-auth-best-practices` |
| 1.11 | Run `npx prisma migrate dev` to create tables | | — |
| 1.12 | Run `npx @better-auth/cli@latest generate` to add auth tables | | — |
| 1.13 | Create `.env.example` with all required variables | | — |
| 1.14 | Create `lib/utils.ts` with cn() utility | | — |
| 1.15 | Create folder structure per architecture spec | | — |
| 1.16 | Create `prisma/seed.ts` with initial product data | | — |
| 1.17 | Run `npx prisma db seed` | | — |

**Files produced:**
- `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/migrations/`
- `lib/db.ts`, `lib/auth.ts`, `lib/utils.ts`
- `app/api/auth/[[...all]]/route.ts`
- `.env.example`
- `components.json`

---

## Phase 2 — Design System & Layout

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 2.1 | Research shadcn/ui theme customization | ✅ | `shadcn`, `high-end-visual-design` |
| 2.2 | Configure Tailwind brand colors & design tokens | | `design-taste-frontend` |
| 2.3 | Set up `app/globals.css` with CSS variables + Tailwind layers | | `high-end-visual-design` |
| 2.4 | Add shadcn base components (Button, Card, Input, Badge, Avatar, Dialog, DropdownMenu, Sheet, Tabs, Separator, Skeleton, Toast, Tooltip, Label) | | `shadcn` |
| 2.5 | Research Google Fonts in next/font | | `next-best-practices` |
| 2.6 | Set up fonts in root layout | | — |
| 2.7 | Create `ThemeProvider` component (next-themes) | | — |
| 2.8 | Create `components/layout/Navbar.tsx` (logo, nav links, search, cart icon, user menu) | | — |
| 2.9 | Create `components/layout/Footer.tsx` | | — |
| 2.10 | Create `components/layout/StoreLayout.tsx` (layout wrapper) | | — |
| 2.11 | Create `app/layout.tsx` with providers + Navbar + Footer | | — |
| 2.12 | Create `app/page.tsx` (homepage skeleton with sections) | | — |

**Files produced:**
- `tailwind.config.ts` (updated)
- `app/globals.css` (updated)
- `components/theme-provider.tsx`
- `components/layout/Navbar.tsx`, `Footer.tsx`, `StoreLayout.tsx`
- `app/layout.tsx`, `app/page.tsx`
- Various `components/ui/*.tsx` (shadcn)

---

## Phase 3 — Product Catalog

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 3.1 | Research Next.js Route Handlers for API | ✅ | `next-best-practices` |
| 3.2 | Create `app/api/products/route.ts` (GET list with filters, pagination) | | — |
| 3.3 | Create `app/api/products/[id]/route.ts` (GET single product) | | — |
| 3.4 | Research product image management with next/image | | `next-best-practices` |
| 3.5 | Create `components/product/ProductCard.tsx` | | — |
| 3.6 | Create `components/product/ProductGrid.tsx` | | — |
| 3.7 | Create `components/product/ProductGallery.tsx` | | — |
| 3.8 | Create `components/product/ProductInfo.tsx` (price, sizes, colors, add to cart) | | — |
| 3.9 | Create `components/product/ProductFilters.tsx` (category, price range, size) | | — |
| 3.10 | Create `components/product/Pagination.tsx` | | — |
| 3.11 | Create `app/shop/page.tsx` (catalog with filters + grid) | | — |
| 3.12 | Create `app/shop/[id]/page.tsx` (product detail page) | | — |
| 3.13 | Add metadata/SEO to product pages | | `next-best-practices` |
| 3.14 | Add search API route and search UI | | — |

**Files produced:**
- `app/api/products/route.ts`, `app/api/products/[id]/route.ts`
- `app/api/products/search/route.ts`
- `components/product/*.tsx` (5-7 files)
- `app/shop/page.tsx`, `app/shop/[id]/page.tsx`
- `app/shop/loading.tsx`

---

## Phase 4 — Authentication UI

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 4.1 | Research BetterAuth client methods for React | ✅ | `create-auth-skill` |
| 4.2 | Create `lib/auth-client.ts` (BetterAuth React client) | | `better-auth-best-practices` |
| 4.3 | Create `components/auth/LoginForm.tsx` (email/password + OAuth buttons) | | `email-and-password-best-practices` |
| 4.4 | Create `components/auth/RegisterForm.tsx` | | — |
| 4.5 | Create `components/auth/OAuthButtons.tsx` (Google + GitHub) | | — |
| 4.6 | Create `app/(auth)/login/page.tsx` | | — |
| 4.7 | Create `app/(auth)/register/page.tsx` | | — |
| 4.8 | Create `middleware.ts` for route protection | | `next-best-practices` |
| 4.9 | Update Navbar with user session display | | — |
| 4.10 | Add auth error/loading states | | — |

**Files produced:**
- `lib/auth-client.ts`
- `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`
- `app/(auth)/layout.tsx`
- `components/auth/*.tsx` (3 files)
- `middleware.ts`

---

## Phase 5 — Cart & Checkout

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 5.1 | Research Stripe Checkout integration in Next.js | | — |
| 5.2 | Create `app/api/cart/route.ts` (GET, POST) | | — |
| 5.3 | Create `app/api/cart/[id]/route.ts` (PATCH, DELETE) | | — |
| 5.4 | Create `components/cart/CartItem.tsx` | | — |
| 5.5 | Create `components/cart/CartSummary.tsx` | | — |
| 5.6 | Create `app/cart/page.tsx` | | — |
| 5.7 | Create `app/api/checkout/route.ts` (create Stripe session → order) | | — |
| 5.8 | Create `app/api/webhooks/stripe/route.ts` (handle payment events) | | — |
| 5.9 | Create `app/api/orders/route.ts` (GET user orders) | | — |
| 5.10 | Create `app/api/orders/[id]/route.ts` (GET order detail) | | — |
| 5.11 | Create `app/checkout/page.tsx` (Stripe Checkout redirect) | | — |
| 5.12 | Create `app/checkout/success/page.tsx` | | — |
| 5.13 | Create `app/profile/orders/page.tsx` | | — |
| 5.14 | Create `app/profile/orders/[id]/page.tsx` | | — |

**Files produced:**
- `app/api/cart/route.ts`, `app/api/cart/[id]/route.ts`
- `app/api/checkout/route.ts`
- `app/api/webhooks/stripe/route.ts`
- `app/api/orders/route.ts`, `app/api/orders/[id]/route.ts`
- `components/cart/*.tsx` (2 files)
- `app/cart/page.tsx`, `app/checkout/page.tsx`, `app/checkout/success/page.tsx`
- `app/profile/orders/page.tsx`, `app/profile/orders/[id]/page.tsx`

---

## Phase 6 — User Features

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 6.1 | Create wishlist API routes | | — |
| 6.2 | Create `app/api/wishlist/route.ts` (GET, POST) | | — |
| 6.3 | Create `app/api/wishlist/[id]/route.ts` (DELETE) | | — |
| 6.4 | Create wishlist toggle button on ProductCard | | — |
| 6.5 | Create `app/wishlist/page.tsx` | | — |
| 6.6 | Create review API routes | | — |
| 6.7 | Create `app/api/reviews/product/[id]/route.ts` (GET) | | — |
| 6.8 | Create `app/api/reviews/route.ts` (POST) | | — |
| 6.9 | Create `components/product/ReviewList.tsx` | | — |
| 6.10 | Create `components/product/ReviewForm.tsx` | | — |
| 6.11 | Create profile settings page | | — |
| 6.12 | Add recently viewed functionality | | — |

**Files produced:**
- `app/api/wishlist/route.ts`, `app/api/wishlist/[id]/route.ts`
- `app/api/reviews/product/[id]/route.ts`, `app/api/reviews/route.ts`
- `app/wishlist/page.tsx`
- `app/profile/page.tsx` (settings)
- `components/product/ReviewList.tsx`, `ReviewForm.tsx`

---

## Phase 7 — Admin Dashboard

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 7.1 | Create admin middleware/guard (role: "admin") | | — |
| 7.2 | Create admin layout with sidebar | | — |
| 7.3 | Create `app/admin/page.tsx` (dashboard with stats) | | — |
| 7.4 | Create product management CRUD pages | | — |
| 7.5 | Create `app/admin/products/page.tsx` (list) | | — |
| 7.6 | Create `app/admin/products/new/page.tsx` (create) | | — |
| 7.7 | Create `app/admin/products/[id]/page.tsx` (edit) | | — |
| 7.8 | Create `app/admin/orders/page.tsx` (order management) | | — |
| 7.9 | Create `app/admin/orders/[id]/page.tsx` (order detail) | | — |
| 7.10 | Create coupon management CRUD | | — |
| 7.11 | Create analytics dashboard with charts | | — |

**Files produced:**
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/products/*.tsx`
- `app/admin/orders/*.tsx`
- `app/admin/coupons/*.tsx`
- `components/admin/*.tsx`

---

## Phase 8 — Engagement & Content

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 8.1 | Create blog API routes (GET list, GET by slug) | | — |
| 8.2 | Create `app/blog/page.tsx` (blog listing) | | — |
| 8.3 | Create `app/blog/[slug]/page.tsx` (blog post) | | — |
| 8.4 | Create contact form API route | | — |
| 8.5 | Create `app/contact/page.tsx` | | — |
| 8.6 | Create newsletter API route | | — |
| 8.7 | Create `app/about/page.tsx` | | — |
| 8.8 | Create coupon validation API route | | — |
| 8.9 | Add newsletter signup to Footer | | — |

**Files produced:**
- `app/api/blog/route.ts`, `app/api/blog/[slug]/route.ts`
- `app/api/contact/route.ts`
- `app/api/newsletter/route.ts`
- `app/api/coupons/validate/route.ts`
- `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- `app/contact/page.tsx`, `app/about/page.tsx`

---

## Phase 9 — Polish, Testing & Deploy

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 9.1 | Add error boundaries (`error.tsx` at all route levels) | | `next-best-practices` |
| 9.2 | Add loading states (`loading.tsx`) | | — |
| 9.3 | Add 404 pages (`not-found.tsx`) | | — |
| 9.4 | Add SEO metadata to all pages | | `next-best-practices` |
| 9.5 | Add OG images for social sharing | | — |
| 9.6 | Add framer-motion micro-animations | | `high-end-visual-design` |
| 9.7 | Research image optimization with next/image | ✅ | `next-best-practices` |
| 9.8 | Run `npm run lint` and fix | | — |
| 9.9 | Run `npm run build` and fix | | — |
| 9.10 | Research Vercel deployment | | `deploy-to-vercel` |
| 9.11 | Deploy to Vercel with environment variables | | `deploy-to-vercel` |

**Files produced:**
- `app/**/error.tsx`, `app/**/loading.tsx`, `app/**/not-found.tsx`
- Various animation additions
- Vercel configuration

---

## Execution Rules

1. **Before every phase:** Research the key libraries via Context7 MCP
2. **Before every task:** Load the matching skill from `.opencode/skills/`
3. **Before writing code:** Read existing files for patterns
4. **After each phase:** Verify the app works with `npm run dev`

## Phase Execution Order

```
Phase 0 (done) → Phase 1 → Phase 2 → Phase 3 → Phase 4
                                                     ↓
Phase 8 ← Phase 7 ← Phase 6 ← Phase 5 ← Phase 4
     ↓
Phase 9
```
