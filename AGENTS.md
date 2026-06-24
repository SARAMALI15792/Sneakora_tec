# Constitution of the Sneakora Project

*An authoritative reference governing all work performed on this full-stack e-commerce application.*

---

## Preamble

This document establishes the rules, principles, and procedures by which any agent shall operate when contributing to the Sneakora project. All agents are bound to follow the articles herein. No deviation shall be made without explicit instruction from the project owner.

---

## Article I — Workflow & Procedure

### Section 1.1 — Mandatory Execution Order

Every agent, before writing any code, shall adhere to the following sequence:

1. **Check Skills First.** Before writing any code, the agent shall load the matching skill via the `skill` tool. Skills reside in `.opencode/skills/` (project-local). If a skill covers the task at hand, its instructions shall be followed. Skill names and paths shall not be hardcoded — they shall be referenced dynamically by name. A complete catalog of installed skills is maintained in Article VIII.

2. **Research via Context7 MCP.** For any question concerning a framework, library, or language — including but not limited to Next.js, React, BetterAuth, Prisma, PostgreSQL, Tailwind CSS, and shadcn/ui — the agent shall call `context7_resolve-library-id` followed by `context7_query-docs` to obtain authoritative documentation and code examples. The MCP server is pre-configured in `opencode.json` with an active API key.

3. **Read Existing Code.** Before writing any new code, read the relevant existing files to match patterns, naming conventions, and architectural decisions.

4. **Implement Following Conventions.** All new code shall match the patterns established in this document and the target architecture defined in Article III.

5. **Verify Changes.** After implementation, verify the application works as expected. For Next.js, run `npm run dev` and check the application in the browser. For backend changes, restart the development server.

### Section 1.2 — Project Transformation Status

This project is in the process of being **completely rebuilt** from a vanilla HTML/CSS/JS + Express.js + MySQL stack into a modern production-ready e-commerce platform. The old codebase remains on disk for reference but **shall not be modified** — all new work targets the new architecture described below.

---

## Article II — Project Identity & Purpose

### Section 2.1 — Nature of the Application

Sneakora is a full-stack e-commerce store being rebuilt as a modern, production-ready platform. The new stack uses **Next.js 14+** (React with TypeScript) on the frontend, **BetterAuth** for authentication, **Prisma** as the ORM, **Neon** (serverless PostgreSQL) as the database, and is deployed on **Vercel**.

### Section 2.2 — Business Capabilities

The application targets a **full premium e-commerce suite** with the following capabilities:

| Category | Features |
|----------|----------|
| **Core Shopping** | Product catalog by category (Men, Women, Kids, Sports, Casual), product detail pages, search & filter, shopping cart, checkout |
| **User Features** | Registration, login, profile management, order history, wishlist, recently viewed |
| **Premium Features** | Reviews & ratings, size guide, coupon/discount system, live chat, blog |
| **Admin** | Product CRUD, order management, user management, analytics dashboard |
| **Engagement** | Newsletter signup, contact form, about us page, social media integration |

### Section 2.3 — Design Direction

The visual design follows a **Modern-Sporty** aesthetic — clean, energetic, bold typography, action-oriented design language inspired by leading sportswear brands (Nike, Adidas). Dark theme with neon accent colors, glassmorphism, micro-animations, and 3D elements.

---

## Article III — Architecture (Target)

### Section 3.1 — Frontend Layer

The frontend is built with **Next.js 14+** using the App Router, TypeScript, Tailwind CSS, and shadcn/ui components.

```
frontend/
├── app/                           # Next.js App Router pages
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Homepage
│   ├── shop/
│   │   ├── page.tsx               # Catalog / category listing
│   │   └── [id]/page.tsx          # Product detail page
│   ├── cart/page.tsx              # Shopping cart
│   ├── checkout/page.tsx          # Checkout flow
│   ├── profile/
│   │   ├── page.tsx               # User profile
│   │   └── orders/page.tsx        # Order history
│   ├── wishlist/page.tsx          # User wishlist
│   ├── admin/
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── products/page.tsx      # Product management
│   │   └── orders/page.tsx        # Order management
│   ├── blog/
│   │   ├── page.tsx               # Blog listing
│   │   └── [slug]/page.tsx        # Blog post
│   ├── about/page.tsx             # About us
│   ├── contact/page.tsx           # Contact form
│   └── api/                       # API routes (Next.js route handlers)
├── components/
│   ├── ui/                        # shadcn/ui base components
│   ├── layout/                    # Navbar, Footer, Sidebar
│   ├── product/                   # ProductCard, ProductGallery, ProductInfo
│   ├── cart/                      # CartItem, CartSummary
│   ├── auth/                      # LoginForm, RegisterForm, OAuthButtons
│   └── shared/                    # Loader, Toast, Modal, Pagination
├── lib/
│   ├── db.ts                      # Prisma client
│   ├── auth.ts                    # BetterAuth configuration
│   └── utils.ts                   # Utility functions
├── hooks/                         # Custom React hooks
├── styles/                        # Global styles (Tailwind layers)
└── public/
    └── images/                    # Static assets
```

### Section 3.2 — Backend Layer

The backend uses **Next.js Route Handlers** (API routes within the Next.js app) for all server-side logic. Prisma serves as the ORM connecting to Neon PostgreSQL.

| Layer | Technology |
|-------|-----------|
| **API Framework** | Next.js Route Handlers (`app/api/`) |
| **Authentication** | BetterAuth (Email/Password + Google + GitHub OAuth) |
| **ORM** | Prisma |
| **Database** | Neon (serverless PostgreSQL) |
| **Validation** | Zod (schema validation) |
| **File Upload** | UploadThing or Vercel Blob |
| **Email** | Resend or Nodemailer |
| **Payments** | Stripe |

### Section 3.3 — Database Schema (Neon PostgreSQL via Prisma)

The database schema is defined in Prisma and auto-deployed to Neon on migration.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("user")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts  Account[]
  sessions  Session[]
  orders    Order[]
  cartItems CartItem[]
  reviews   Review[]
  wishlist  WishlistItem[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  price       Decimal  @db.Decimal(10, 2)
  compareAt   Decimal? @db.Decimal(10, 2)
  category    String
  images      String[] // Array of image URLs
  sizes       String[] // Available sizes
  colors      String[] // Available colors
  stock       Int      @default(0)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  orderItems  OrderItem[]
  cartItems   CartItem[]
  reviews     Review[]
  wishlist    WishlistItem[]
}

model Order {
  id        String   @id @default(cuid())
  userId    String
  total     Decimal  @db.Decimal(10, 2)
  status    String   @default("pending") // pending, confirmed, shipped, delivered, cancelled
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user  User        @relation(fields: [userId], references: [id])
  items OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int     @default(1)
  price     Decimal @db.Decimal(10, 2)

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}

model CartItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  quantity  Int      @default(1)
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  productId String
  rating    Int      // 1-5
  title     String?
  content   String?
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}

model Coupon {
  id         String   @id @default(cuid())
  code       String   @unique
  discount   Decimal  @db.Decimal(5, 2) // Percentage or flat amount
  type       String   // "percentage" | "flat"
  maxUses    Int?
  usedCount  Int      @default(0)
  expiresAt  DateTime?
  createdAt  DateTime @default(now())
}

model BlogPost {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  excerpt   String?
  image     String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Section 3.4 — Data Flow

```
Browser (Next.js Client Component)
  → Server Action / Route Handler
    → BetterAuth (session validation)
      → Prisma (type-safe query)
        → Neon PostgreSQL
          → Response (JSON / RSC payload)
            → UI update (React re-render)
```

---

## Article IV — API Routes (Next.js Route Handlers)

All API routes follow the Next.js App Router convention at `app/api/`:

| Method | Path | Purpose | Auth Required |
|--------|------|---------|---------------|
| POST | `/api/auth/*` | All BetterAuth endpoints | Varies |
| GET | `/api/products` | List products (with filters, pagination) | No |
| GET | `/api/products/[id]` | Get single product | No |
| POST | `/api/products` | Admin: create product | Admin |
| PUT | `/api/products/[id]` | Admin: update product | Admin |
| DELETE | `/api/products/[id]` | Admin: delete product | Admin |
| GET | `/api/cart` | Get current user's cart | Yes |
| POST | `/api/cart` | Add item to cart | Yes |
| PATCH | `/api/cart/[id]` | Update cart item quantity | Yes |
| DELETE | `/api/cart/[id]` | Remove cart item | Yes |
| POST | `/api/checkout` | Create order from cart | Yes |
| GET | `/api/orders` | Get user's order history | Yes |
| GET | `/api/orders/[id]` | Get order detail | Yes |
| GET | `/api/reviews/product/[id]` | Get product reviews | No |
| POST | `/api/reviews` | Submit a review | Yes |
| GET | `/api/wishlist` | Get user's wishlist | Yes |
| POST | `/api/wishlist` | Add to wishlist | Yes |
| DELETE | `/api/wishlist/[id]` | Remove from wishlist | Yes |
| POST | `/api/coupons/validate` | Validate a coupon code | Yes |
| POST | `/api/contact` | Submit contact form | No |
| GET | `/api/blog` | List blog posts | No |
| GET | `/api/blog/[slug]` | Get blog post | No |
| POST | `/api/newsletter` | Subscribe to newsletter | No |

---

## Article V — Security Posture

### Section 5.1 — Security Architecture (New Stack)

| Concern | Implementation |
|---------|---------------|
| **Authentication** | BetterAuth with email/password + Google + GitHub OAuth |
| **Session Management** | BetterAuth handles sessions (database sessions or JWTs) |
| **Role-Based Access** | Middleware checks `user.role` on admin routes and pages |
| **Input Validation** | Zod schemas validate all API request bodies |
| **SQL Injection** | Prevented by Prisma's parameterized queries |
| **XSS** | Prevented by React's automatic escaping |
| **CORS** | Configured via Next.js/ middleware |
| **Environment Variables** | All secrets in `.env.local`, never committed |
| **Rate Limiting** | Implemented on auth and API routes |
| **HTTPS** | Handled by Vercel (automatic) |

### Section 5.2 — Environment Variables

The following environment variables are required and **shall never be hardcoded or committed**:

```env
# Database
DATABASE_URL="postgresql://..."

# BetterAuth
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
STRIPE_WEBHOOK_SECRET="..."

# Email (Resend)
RESEND_API_KEY="..."

# Storage (Vercel Blob or UploadThing)
BLOB_READ_WRITE_TOKEN="..."
```

---

## Article VI — Implementation Conventions

### Section 6.1 — Frontend Rules

- All pages use the **Next.js App Router** (`app/` directory).
- All components use **TypeScript** with strict mode.
- **Server Components** are the default; Client Components (`"use client"`) are used only when interactivity, state, or hooks are needed.
- **Tailwind CSS** is used for all styling. Inline styles are forbidden.
- **shadcn/ui** components are the base component library. Custom components extend shadcn.
- All data fetching uses **Server Actions** or Route Handlers — no direct database access from Client Components.
- SEO metadata is set via Next.js `export const metadata = { ... }` in each page.
- Error boundaries are implemented at the page and layout level. Loading states use `loading.tsx`.

### Section 6.2 — Backend Rules

- Route Handlers live in `app/api/[route]/route.ts` following Next.js conventions.
- All route handlers use the pattern:
  ```typescript
  export async function GET(request: NextRequest) { ... }
  export async function POST(request: NextRequest) { ... }
  ```
- Prisma is accessed via a singleton client in `lib/db.ts`:
  ```typescript
  import { PrismaClient } from '@prisma/client'
  const prisma = new PrismaClient()
  export default prisma
  ```
- Zod schemas validate all request inputs before processing.
- Error responses follow: `NextResponse.json({ error: message }, { status: code })`.
- Database transactions are used for multi-step operations (e.g., checkout).

### Section 6.3 — Database Rules

- All schema changes are made via Prisma migrations: `npx prisma migrate dev`.
- Database is seeded with initial product data via `prisma/seed.ts`.
- The seed script uses product data migrated from `data/products.json`.
- Connection pooling is handled by Neon (serverless) — no manual pool configuration needed.

---

## Article VII — Key Operational Notes

### Section 7.1 — Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js development server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Create/apply database migrations |
| `npx prisma db seed` | Seed database with initial data |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npx skills find <query>` | Search skills.sh for new skills |
| `npx skills add <repo>` | Install skills from a repository |

### Section 7.2 — Critical Gotchas

1. **The old codebase is reference only.** The files `server.js`, `backend/`, `data/`, and old `.html` pages remain on disk for reference but shall not be modified. All new work targets the Next.js architecture.
2. **Neon connection string.** The `DATABASE_URL` must use the pooled connection string from Neon dashboard (ends with `?pgbouncer=true` or uses the `-pooler` hostname).
3. **BetterAuth configuration.** BetterAuth requires both `BETTER_AUTH_SECRET` (a random string) and `BETTER_AUTH_URL` to be set. OAuth providers (Google, GitHub) need their own client ID and secret from their developer consoles.
4. **Prisma must be installed.** `npx prisma generate` must be run after every schema change and before first use.
5. **Server restart.** Next.js dev server hot-reloads for most changes. Prisma schema changes require a restart.
6. **shadcn/ui init.** `npx shadcn@latest init` must be run before using any shadcn components.
7. **Node.js version.** Requires Node.js 18+ (preferably 20 LTS). Check with `node --version`.

---

## Article VIII — Skills & Research Integration

### Section 8.1 — Installation Source

Skills are installed from the [skills.sh](https://skills.sh) ecosystem via the `npx skills` CLI (`npm install -g skills`). The primary repositories used:

| Repository | Source |
|-----------|--------|
| `vercel-labs/agent-skills` | Vercel official skill pack |
| `anthropics/skills` | Anthropic official skill pack |

### Section 8.2 — Installed Skills Catalog

The following skills are installed in `.opencode/skills/` and available for use:

| Skill Name | Source | When to Use |
|-----------|--------|-------------|
| `better-auth-best-practices` | skills.sh | Setting up BetterAuth, configuring OAuth providers, managing sessions |
| `brandkit` | skills.sh | Applying brand colors, typography, and visual identity |
| `create-auth-skill` | skills.sh | Scaffolding authentication flows with BetterAuth |
| `deploy-to-vercel` | vercel-labs | Deploying the application to Vercel |
| `design-taste-frontend` | skills.sh | Making design decisions, improving UI aesthetic |
| `email-and-password-best-practices` | skills.sh | Implementing email/password auth with proper security |
| `emil-design-eng` | skills.sh | Design engineering, high-quality UI implementation |
| `find-skills` | skills.sh | Searching for additional skills |
| `frontend-design` | anthropics | Guidance for distinctive, intentional visual design |
| `high-end-visual-design` | skills.sh | Premium visual design, micro-animations, polish |
| `improve-codebase-architecture` | skills.sh | Refactoring and improving project structure |
| `next-best-practices` | skills.sh | Next.js specific patterns and optimizations |
| `organization-best-practices` | skills.sh | Multi-tenant organization support |
| `rag-implementation` | skills.sh | Building RAG systems — vector DBs, embeddings, retrieval, reranking, LangGraph |
| `rag-eval` | skills.sh | Iterating and testing RAG pipelines with structured evals, gold-sets, cost tracking |
| `react-email` | skills.sh | React Email rendering — JSON specs to HTML/text emails via @react-email/components |
| `email-service-integration` | skills.sh | Email provider integration — SMTP, SendGrid, Mailgun, templates, validation |
| `email-smtp-send` | skills.sh | SMTP sending with attachments, IMAP sent-sync, machine-readable JSON output |
| `redesign-existing-projects` | skills.sh | Transforming existing codebases into modern stacks |
| `shadcn` | skills.sh | Using shadcn/ui components, customization |
| `supabase-postgres-best-practices` | skills.sh | PostgreSQL best practices (also applies to Neon) |
| `two-factor-authentication-best-practices` | skills.sh | Implementing 2FA |
| `ui-ux-pro-max` | skills.sh | Advanced UI/UX patterns and interactions |
| `vercel-composition-patterns` | vercel-labs | React composition patterns that scale |
| `vercel-optimize` | vercel-labs | Vercel cost and performance optimization |
| `vercel-react-best-practices` | vercel-labs | React and Next.js performance optimization |
| `web-design-guidelines` | vercel-labs | UI code review for Web Interface Guidelines compliance |
| `webapp-testing` | anthropics | Testing local web applications with Playwright |
| `writing-guidelines` | vercel-labs | Reviewing docs/prose for writing guidelines |

### Section 8.3 — Mandatory Task Workflow

For any task, the agent shall execute the following sequence:
1. **Scan installed skills** (listed in Section 8.2). If one matches the task, load it via the `skill` tool.
2. **For framework or library questions**, use the Context7 MCP — call `context7_resolve-library-id` followed by `context7_query-docs`.
3. **Read existing code** to match patterns before writing any new code.
4. **Verify changes** by restarting the server and checking the application in the browser.

---

## Article IX — Configuration & Dependencies

### Section 9.1 — Project Configuration Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (NOT committed) |
| `.env.example` | Template for required environment variables (committed) |
| `next.config.ts` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `components.json` | shadcn/ui configuration |
| `prisma/schema.prisma` | Database schema |
| `tsconfig.json` | TypeScript configuration |
| `opencode.json` | OpenCode configuration (Context7 MCP) |
| `skills-lock.json` | Lockfile for installed skills |

### Section 9.2 — Dependencies

| Package | Purpose |
|---------|---------|
| `next@14` | React framework |
| `react@18` / `react-dom@18` | UI library |
| `typescript` | Type safety |
| `tailwindcss` | Utility CSS framework |
| `@radix-ui/*` | Headless UI primitives (via shadcn) |
| `shadcn/ui` | Component library |
| `better-auth` | Authentication |
| `@prisma/client` + `prisma` | ORM and database |
| `@neondatabase/serverless` | Neon serverless driver |
| `zod` | Schema validation |
| `stripe` | Payment processing |
| `resend` | Email service |
| `@uploadthing/react` / `@vercel/blob` | File storage |
| `lucide-react` | Icons |
| `clsx` + `tailwind-merge` | Class name utilities |
| `framer-motion` | Animations |

### Section 9.3 — Old Codebase (Reference Only)

The following files and directories from the original application remain on disk for reference but **shall not be modified**:

- `server.js` — Old Express.js backend
- `backend/` — Old database and product utilities
- `data/` — Old JSON product data and SQLite database
- `css/` — Old stylesheets (including `styles.css.backup`)
- `js/` — Old client-side scripts
- `images/` — Old static images
- `index.html`, `category.html`, `product.html`, `cart.html`, `profile.html`, `admin.html`, `contact.html` — Old HTML pages
- `procedure.md` — Old development procedure documentation

---

*This constitution is a living document. It shall be updated as the project evolves. All agents are bound by its provisions until amended by the project owner.*
