# Sneakora — End-to-End Implementation Plan

**Branch:** `feat/nextjs-rebuild`
**Stack:** Next.js 16 + TypeScript + Tailwind CSS + BetterAuth + Prisma + Neon PostgreSQL + Stripe + Gemini AI
**Methodology:** Research via Context7 MCP → Load relevant skill → Read existing code → Implement → Verify

---

## Phase 0 — Foundation (Current)

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 0.1 | Context7 MCP configured | ✅ | — |
| 0.2 | Branch `feat/nextjs-rebuild` created | ✅ | — |
| 0.3 | 29 skills installed in `.opencode/skills/` | ✅ | — |
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

## Phase 10 — AI RAG System, Email Verification, Premium Loaders & Stripe Gateway

### Phase 10 Overview

This phase adds four major systems to Sneakora:

| System | Description | Priority |
|--------|-------------|----------|
| **RAG Pipeline** | Full ingestion + retrieval pipeline using Gemini embeddings | P0 |
| **Email Verification** | Professional email verification via Better Auth + Resend + React Email | P0 |
| **Premium Loaders** | Animated status/loading UX for all critical flows | P1 |
| **Stripe Gateway** | Payment gateway setup documentation | P1 |

### Dependencies

- Phase 1 (Prisma + DB), Phase 4 (Auth), Phase 5 (Orders/Cart)
- Context7: Gemini API, Better Auth, Resend (all researched ✅)

---

## Phase 10A — RAG Ingestion Pipeline (Technical Design)

### Data Sources → Embeddings Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    INGESTION PIPELINE                        │
│                                                             │
│  Product create/update                                      │
│    → Extract text (name, desc, category, price, sizes)     │
│    → Chunk into 512-token segments with 64-token overlap   │
│    → Batch embed via Gemini embedding-2 API                │
│    → Store in Neon pgvector (via VectorStore model)        │
│                                                             │
│  Order created/updated                                      │
│    → Extract (order_id, items, status, total, date)         │
│    → Per-user indexing (user_id filter)                    │
│    → Embed + store in VectorStore                           │
│                                                             │
│  BlogPost published                                         │
│    → Extract (title, excerpt, content)                      │
│    → Chunk + embed + store                                  │
│                                                             │
│  Manual FAQ entries                                         │
│    → Pre-chunked Q&A pairs                                  │
│    → Embed + store                                          │
└─────────────────────────────────────────────────────────────┘
```

### VectorStore Prisma Model

Design the `VectorStore` model in Prisma to store embedded document chunks with vector embeddings for pgvector similarity search.

**Model fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `sourceType` | String | Content type: `"product"` \| `"order"` \| `"blog"` \| `"faq"` |
| `sourceId` | String | ID of the source entity (e.g., product CUID) |
| `userId` | String? | Null for global content; set for personalized per-user embeddings |
| `chunkText` | String | Raw text of the embedded chunk |
| `embedding` | Float[] | pgvector(768) — Gemini embedding-2 output dimension |
| `metadata` | Json | Chunking metadata: `{ chunkIndex, totalChunks, createdAt }` |
| `createdAt` | DateTime | Auto-set on creation |

**Indexes:**
- Composite index on `(sourceType, sourceId)` for targeted lookups
- Index on `userId` for personalized retrieval filtering

**Migration:** Add vector column + HNSW index after base migration

### Chunking Strategy

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `maxTokensPerChunk` | 512 tokens | Optimal for Gemini-embedding-2 |
| `maxOverlapTokens` | 64 tokens | Preserve context across chunks |
| Chunking approach | Sentence-boundary aware | Don't split mid-sentence |

### Embedding Model

- **Model:** `gemini-embedding-2` (768-dimension vectors)
- **Task type:** `RETRIEVAL_DOCUMENT` for ingestion, `RETRIEVAL_QUERY` for retrieval
- **API:** Gemini Batch Embeddings API (`client.batches.createEmbeddings`) for bulk ingestion

### Ingestion API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `POST /api/rag/embed/product` | POST | Triggered on product create/update; embed name, desc, category, price, sizes |
| `POST /api/rag/embed/order` | POST | Triggered on order create/update; embed per-user order summary |
| `POST /api/rag/embed/blog` | POST | Triggered on blog publish; embed title, excerpt, content |
| `POST /api/rag/embed/batch` | POST | Bulk embedding for initial data seed |
| `DELETE /api/rag/embed/[id]` | DELETE | Remove embedding when source entity is deleted |

### Neon pgvector Setup

- Enable `vector` extension on Neon database (one-time)
- Add `embedding vector(768)` column to VectorStore table
- Create HNSW index on embedding column for fast cosine similarity queries
- Use Neon connection pooler for serverless pgvector access

---

## Phase 10B — RAG Retrieval Pipeline (Technical Design)

### Retrieval Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   RETRIEVAL PIPELINE                         │
│                                                              │
│  1. User query arrives at /api/rag/query                    │
│  2. Embed query via Gemini (task: RETRIEVAL_QUERY)         │
│  3. Cosine similarity search in pgvector (top-k=10)        │
│  4. Filter by userId (for personalized content)             │
│  5. Re-rank results by recency + relevance score           │
│  6. Build prompt: system prompt + context + history + query│
│  7. Stream response via Gemini (model: gemini-2.0-flash)    │
│  8. Return streaming response to RAGWidget                  │
└──────────────────────────────────────────────────────────────┘
```

### Query API: `POST /api/rag/query`

**Request body fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | User's natural language question |
| `userId` | string | No | If provided, filter retrieval to user's personalized content |
| `conversationHistory` | array | No | Prior turns for multi-turn context; each entry has `role` + `content` |

**Response:** Server-Sent Events (SSE) streaming — chunks of the Gemini response sent incrementally, culminating in a `done` event with source citations.

**SSE event types:**
- `chunk` — incremental text part of the assistant's response
- `done` — final event containing array of source citations (vector IDs, source type, text)
- `error` — if something fails mid-stream

### RAG Prompt Template

The system prompt instructs the AI to act as Sneakora's shopping assistant, scoped to answering based ONLY on retrieved context. If context doesn't contain enough info, the AI should say so and offer alternative help. The prompt receives three injected sections: retrieved context chunks (ranked by relevance), conversation history (for multi-turn), and the current user query.

### Query Routing (Intent Detection)

Before embedding the query, optionally run a lightweight classification to determine intent:
- **Order queries** → Filter retrieval to `sourceType = "order"` + matching `userId`
- **Product queries** → Search all product embeddings
- **General queries** → Search all content + FAQs across all source types

This routing can be rule-based (keyword matching) or handled by a fast Gemini classification call.

---

## Phase 10C — Professional Email Verification

### Overview

Using Better Auth's built-in email verification + Resend + React Email for professional branded verification emails.

### Flow

```
User signs up
  → Better Auth generates verification token
  → Our sendVerificationEmail function fires
  → Resend sends React Email template
  → User clicks link in email
  → Better Auth verifies token + marks email verified
  → Optional: beforeEmailVerification callback fires
  → User redirected to app (verified)
```

### Email Templates (React Email)

All templates live in `src/emails/` and are sent via Resend. Two categories:

**Account Emails** — triggered by auth events (Better Auth):

| File | Trigger | Purpose |
|------|---------|---------|
| `src/emails/VerificationEmail.tsx` | User signs up | Verification link to confirm account ownership |
| `src/emails/WelcomeEmail.tsx` | Email verified | Post-verification welcome + getting started |
| `src/emails/PasswordResetEmail.tsx` | User requests reset | Reset password link (expires in 15 min) |

**Order Emails** — triggered by order lifecycle events (webhook handlers):

| File | Trigger | Purpose |
|------|---------|---------|
| `src/emails/OrderConfirmation.tsx` | `checkout.session.completed` | Order placed, items, total, expected delivery |
| `src/emails/OrderShipped.tsx` | Admin marks shipped | Tracking number, carrier link, delivery estimate |
| `src/emails/OrderDelivered.tsx` | Delivery confirmed | Thank you, review prompt, return instructions |
| `src/emails/OrderCancelled.tsx` | Order cancelled | Refund notice, cancellation reason, support contact |

### VerificationEmail.tsx Template

A React Email component styled with the Sneakora dark/violet brand theme. Uses Tailwind CSS via `@react-email/components`. Accepts props: `firstName` (optional, defaults to "there") and `verifyUrl` (the email verification link from Better Auth).

**Template sections:**
- **Brand header** — "SNEAKORA" logo heading in bold white
- **Main card** — Dark zinc-900 card with rounded corners and subtle border
- **Heading** — "Hey {firstName}, verify your email" in white
- **Body text** — Explanation copy in zinc-400
- **CTA button** — Violet-600 button with `verifyUrl` href, centered
- **Footer disclaimer** — 1-hour expiry notice + unsubscribe copy in zinc-500
- **Copyright** — © 2026 Sneakora in zinc-600, centered

### Order Email System

Order emails are transactional emails sent via Resend, triggered by Stripe webhook events and order state changes in the database. Each order email is tied to the user's order record.

**Email trigger map:**

| Webhook / Event | Email Sent | Template |
|-----------------|-----------|----------|
| `checkout.session.completed` | Order placed | `OrderConfirmation` |
| Order marked "shipped" by admin | Package dispatched | `OrderShipped` |
| Delivery confirmation API | Package arrived | `OrderDelivered` |
| Admin cancels order / refund issued | Order cancelled | `OrderCancelled` |

**OrderConfirmation.tsx — sections:**
- Brand header with "Order Confirmed" badge in violet
- Order number (`#ORD-xxxxx`) prominently displayed
- Itemized product list: image thumbnail, name, size, color, quantity, price
- Order summary: subtotal, shipping, tax, total
- Estimated delivery date range
- Shipping address
- CTA button: "View Order Details" → app/profile/orders/[id]
- Footer with support contact

**OrderShipped.tsx — sections:**
- Brand header with "On the Way" badge in violet
- Order number and tracking number (clickable link to carrier)
- Carrier name (FedEx, UPS, DHL — based on order metadata)
- Estimated delivery window
- Product thumbnails (smaller, horizontal scroll on mobile)
- CTA: "Track My Package" → carrier tracking URL

**OrderDelivered.tsx — sections:**
- Brand header with "Delivered" checkmark
- Order number and delivery timestamp
- List of delivered items
- Prompt to leave a review (links to product pages)
- Return policy reminder (30-day window)
- CTA: "Buy Again" → homepage

**OrderCancelled.tsx — sections:**
- Brand header with "Order Cancelled" in muted red
- Order number
- Reason for cancellation (passed from admin)
- Refund amount and expected refund timeline (3-5 business days)
- Support contact if they have questions

**Email config pattern** (same Resend client used across all):

```typescript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "Sneakora <orders@sneakora.com>",  // Separate sender for order emails
  to: user.email,
  subject: "Your Sneakora order #ORD-12345 is confirmed",
  react: OrderConfirmation({ order, items, user }),
});
```

**Note:** Order emails use `orders@sneakora.com` as sender (separate from `noreply@sneakora.com` used for auth emails) to improve deliverability and allow users to reply.

### Better Auth Email Config

Configure Better Auth's `emailVerification` options in `src/lib/auth.ts`:

| Option | Value | Purpose |
|--------|-------|---------|
| `sendVerificationEmail` | async function | Fires on verification request; calls Resend with React Email template |
| `sendOnSignUp` | `true` | Automatically send verification email on user registration |
| `autoSignInAfterVerification` | `false` | User must manually sign in after clicking the link |
| `expiresIn` | `3600` | Verification token expires after 1 hour |
| `beforeEmailVerification` | callback (optional) | Custom logic before marking email verified (e.g., update user profile) |

### Additional Email Verification Checks (AI-Enhanced)

Beyond Better Auth's built-in verification, the `/api/verify-email` endpoint performs AI-powered pre-check validation:

**Response shape:**
| Field | Type | Description |
|-------|------|-------------|
| `valid` | boolean | Whether email passes all checks |
| `score` | number (0-100) | Overall email quality score |
| `reasons` | string[] | List of specific issues found |
| `suggestions` | string[] | Recommendations to fix issues |

**Validation checks performed:**
1. **Format validation** — Regex check for valid email structure
2. **Disposable email detection** — Block known temporary/disposable email domains
3. **MX record lookup** — Verify the domain has mail exchange records
4. **SMTP simulation** — Soft check that mail exchanger accepts connections
5. **AI pattern analysis** — Gemini analyzes name patterns and formatting for suspicious signals

---

## Phase 10D — Premium Loaders

### Loader Architecture

All loaders use framer-motion for animations and match the dark/violet brand theme.

| Component | Type | Animation |
|-----------|------|-----------|
| `PremiumLoader` | Spinner | Rotating ring + glow pulse |
| `StatusLoader` | Step tracker | Sequential checkmark reveals |
| `ProgressBar` | Progress | Gradient fill with shimmer |
| `SkeletonLoader` | Shimmer | Pulse-based content placeholders |
| `SpinnerOverlay` | Full-screen | Blur backdrop + centered spinner |

### StatusLoader Steps (Checkout Flow)

```
Step 1: [✓] Cart validated          → Complete immediately
Step 2: [⟳] Checking inventory...    → Animated spinner
Step 3: [ ] Processing payment...   → Pending (dimmed)
Step 4: [ ] Confirming order...     → Pending
Step 5: [ ] Sending email...        → Pending
```

### Files to Create

- `src/components/shared/PremiumLoader.tsx`
- `src/components/shared/StatusLoader.tsx`
- `src/components/shared/ProgressBar.tsx`
- `src/components/shared/SkeletonCard.tsx`
- `src/components/shared/SpinnerOverlay.tsx`

---

## Phase 10E — Stripe Gateway Configuration (Complete)

### Step 1: Get API Keys

1. Go to **https://dashboard.stripe.com/apikeys**
2. Toggle to **Test mode** (for development)
3. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Click "Secret key" → Copy → `STRIPE_SECRET_KEY`

### Step 2: Install & Configure Webhooks

**Install Stripe CLI:**
- macOS: `brew install stripe/stripe-cli/stripe`
- Linux: Use official Stripe CLI install script or apt package

**Forward webhooks locally:**
1. Run `stripe login` to authenticate
2. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Copy the webhook signing secret (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`

### Step 3: Environment Variables

Add to `.env.local`:
- `STRIPE_SECRET_KEY` — from dashboard.stripe.com/apikeys
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from same page (pk_test_ or pk_live_)
- `STRIPE_WEBHOOK_SECRET` — from Stripe CLI `stripe listen` output, or from Dashboard → Webhooks

### Step 4: Configure Webhook Endpoint in Stripe Dashboard

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed` — Order creation trigger
   - `payment_intent.succeeded` — Payment success
   - `payment_intent.failed` — Payment failure handling
5. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

### Step 5: Switch to Live Mode

1. Replace test keys (`pk_test_`, `sk_test_`) with live keys from Dashboard
2. Replace `whsec_` test webhook secret with live one
3. Update `NEXT_PUBLIC_BETTER_AUTH_URL` to production URL

### Webhook Handler

The `app/api/webhooks/stripe/route.ts` handles incoming Stripe events:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create order record in DB, clear cart |
| `payment_intent.succeeded` | Update order status to "paid" |
| `payment_intent.failed` | Update order status to "failed", notify user |

Uses `stripe.webhooks.constructEvent()` to verify signature against `STRIPE_WEBHOOK_SECRET`. Returns 200 on success, 400 on signature verification failure.

---

## Phase 10 Implementation Tasks

| Step | Task | Context7 | Skill |
|------|------|----------|-------|
| 10.1 | Research Gemini AI SDK for Next.js + RAG | ✅ | `rag-implementation` |
| 10.2 | Research Gemini File Search / embeddings | ✅ | `rag-implementation` |
| 10.3 | Install `@google/generative-ai` + `ai` packages | | `rag-implementation` |
| 10.4 | Create `src/lib/gemini.ts` (Gemini client config) | | `rag-implementation` |
| 10.5 | Create `prisma/schema.prisma` (add VectorStore model + pgvector) | | `supabase-postgres-best-practices` |
| 10.6 | Run migration for pgvector setup on Neon | | `supabase-postgres-best-practices` |
| 10.7 | Create `app/api/rag/embed/product/route.ts` | | `rag-implementation` |
| 10.8 | Create `app/api/rag/embed/order/route.ts` | | `rag-implementation` |
| 10.9 | Create `app/api/rag/embed/blog/route.ts` | | `rag-implementation` |
| 10.10 | Create `app/api/rag/embed/batch/route.ts` (bulk seed) | | `rag-implementation` |
| 10.11 | Create `app/api/rag/query/route.ts` (streaming RAG) | | `rag-implementation` |
| 10.12 | Create `components/rag/RAGProvider.tsx` | | `vercel-react-best-practices` |
| 10.13 | Create `components/rag/RAGWidget.tsx` (floating chat) | | `high-end-visual-design` |
| 10.14 | Create `components/rag/RAGMessage.tsx` | | `vercel-react-best-practices` |
| 10.15 | Create `components/rag/RAGTypingIndicator.tsx` | | `high-end-visual-design` |
| 10.16 | Create `components/rag/QuickActions.tsx` | | — |
| 10.17 | Integrate RAGWidget into `src/app/layout.tsx` | | `vercel-react-best-practices` |
| 10.18 | Install `react-email` + `@react-email/components` | | `react-email` |
| 10.19 | Create `src/emails/VerificationEmail.tsx` | | `react-email` |
| 10.20 | Create `src/emails/WelcomeEmail.tsx` | | `react-email` |
| 10.21 | Create `src/emails/PasswordResetEmail.tsx` | | `react-email` |
| 10.22 | Create `src/emails/OrderConfirmation.tsx` | | `react-email` |
| 10.23 | Create `src/emails/OrderShipped.tsx` | | `react-email` |
| 10.24 | Create `src/emails/OrderDelivered.tsx` | | `react-email` |
| 10.25 | Create `src/emails/OrderCancelled.tsx` | | `react-email` |
| 10.26 | Update `src/lib/auth.ts` with Better Auth email config | ✅ | `email-and-password-best-practices` |
| 10.27 | Create `app/api/verify-email/route.ts` (AI validation) | | `email-service-integration` |
| 10.28 | Update webhook handler to send order emails on state changes | | `email-service-integration` |
| 10.29 | Create `components/shared/PremiumLoader.tsx` | | `high-end-visual-design` |
| 10.30 | Create `components/shared/StatusLoader.tsx` | | `high-end-visual-design` |
| 10.31 | Create `components/shared/ProgressBar.tsx` | | `high-end-visual-design` |
| 10.32 | Create `components/shared/SkeletonCard.tsx` | | `high-end-visual-design` |
| 10.33 | Create `components/shared/SpinnerOverlay.tsx` | | `high-end-visual-design` |
| 10.34 | Integrate StatusLoader into checkout flow | | `vercel-react-best-practices` |
| 10.35 | Integrate loaders into auth forms | | `vercel-react-best-practices` |
| 10.36 | Document Stripe key setup in `.env.example` | ✅ | — |
| 10.37 | Create `app/api/webhooks/stripe/route.ts` | | `email-service-integration` |

**Files to produce (Phase 10):**
- `src/lib/gemini.ts`
- `src/emails/VerificationEmail.tsx`, `WelcomeEmail.tsx`, `PasswordResetEmail.tsx`
- `src/emails/OrderConfirmation.tsx`, `OrderShipped.tsx`, `OrderDelivered.tsx`, `OrderCancelled.tsx`
- `prisma/schema.prisma` (updated: VectorStore model, pgvector)
- `app/api/rag/embed/product/route.ts`
- `app/api/rag/embed/order/route.ts`
- `app/api/rag/embed/blog/route.ts`
- `app/api/rag/embed/batch/route.ts`
- `app/api/rag/query/route.ts`
- `app/api/verify-email/route.ts`
- `app/api/webhooks/stripe/route.ts`
- `components/rag/RAGProvider.tsx`, `RAGWidget.tsx`, `RAGMessage.tsx`, `RAGTypingIndicator.tsx`, `QuickActions.tsx`
- `components/shared/PremiumLoader.tsx`, `StatusLoader.tsx`, `ProgressBar.tsx`, `SkeletonCard.tsx`, `SpinnerOverlay.tsx`

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
Phase 9 → Phase 10
```
