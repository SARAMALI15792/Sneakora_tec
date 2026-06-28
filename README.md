# Sneakora

An e-commerce storefront for sneakers built with Next.js 14, TypeScript, and Stripe.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169e1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-f03e2f?style=flat-square&logo=sanity&logoColor=white)](https://sanity.io)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Auth | BetterAuth (email/password + Google + GitHub OAuth) |
| Database | Neon (serverless PostgreSQL) |
| ORM | Prisma |
| Payments | Stripe |
| CMS | Sanity |
| Email | Resend + React Email |
| Animations | Framer Motion, Three.js |
| Validation | Zod |
| Analytics/Charts | Recharts |
| Testing | Playwright (E2E) |

---

## Features

**Shopping**
- Product catalog with category, filter, and sort
- Product detail pages with image gallery
- Shopping cart with quantity management
- Wishlist and recently viewed products
- Coupon/discount code support at checkout

**Auth**
- Email/password sign-up with email verification
- Google and GitHub OAuth
- Role-based access: `user` and `admin`
- Protected routes via Next.js middleware

**Admin**
- Product CRUD with image uploads
- Order management and status updates
- User management and role assignment
- Coupon creation with expiry and usage limits
- Sales analytics dashboard

**Content**
- Blog system powered by Sanity CMS
- Newsletter subscriptions
- Contact form
- AI-assisted product search (RAG)

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign-in, sign-up, onboarding
│   ├── admin/           # Admin dashboard and management
│   ├── api/             # Route handlers
│   │   ├── auth/        # BetterAuth endpoints
│   │   ├── products/    # Product CRUD
│   │   ├── cart/        # Cart operations
│   │   ├── checkout/    # Stripe checkout
│   │   ├── orders/      # Order management
│   │   ├── reviews/     # Product reviews
│   │   ├── wishlist/    # Wishlist
│   │   ├── blog/        # Blog posts
│   │   ├── coupons/     # Coupon validation
│   │   ├── webhooks/    # Stripe webhooks
│   │   └── rag/         # AI search
│   ├── shop/            # Product catalog and detail pages
│   ├── cart/            # Cart page
│   ├── checkout/        # Checkout flow
│   ├── profile/         # User profile and order history
│   ├── wishlist/        # Wishlist page
│   ├── blog/            # Blog listing and post pages
│   ├── about/           # About page
│   └── contact/         # Contact form
├── components/          # UI components
├── emails/              # React Email templates
├── lib/                 # Auth, DB, and utility configs
└── hooks/               # Custom React hooks

prisma/
├── schema.prisma        # Database schema
├── seed.ts              # Seed data
└── migrations/          # Migration history

tests/
└── e2e/                 # Playwright E2E test suite
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Stripe](https://stripe.com) account
- A [Sanity](https://sanity.io) project
- A [Resend](https://resend.com) API key (for email)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Database
DATABASE_URL=""

# BetterAuth
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=""
NEXT_PUBLIC_SANITY_DATASET=""
SANITY_API_TOKEN=""

# Email
RESEND_API_KEY=""
```

### Setup

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema changes without migration |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run email:dev` | Preview email templates |
