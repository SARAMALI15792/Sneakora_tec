# Sneakora_tec

A modern, full-stack e-commerce platform rebuilt from the ground up using Next.js 14+, TypeScript, and cutting-edge web technologies. This premium online shoe store features a complete redesign with sophisticated UI/UX, robust authentication, seamless shopping experience, and comprehensive admin capabilities.

![Sneakora_tec Preview](public/images/shoe_cyan.png)

> **Note**: Replace the above image with actual screenshots of your application

## ✨ Features

### 🛒 Core E-commerce Functionality
- **Product Catalog**: Browse shoes by category (Men, Women, Kids, Sports, Casual) with filtering and sorting
- **Product Details**: Rich product pages with multiple images, size/color selection, pricing, and descriptions
- **Shopping Cart**: Add/remove items, update quantities, persistent cart with localStorage
- **Checkout Flow**: Multi-step checkout with shipping, payment, and order confirmation
- **Order Management**: Order history, status tracking, and detailed order views

### 🔐 Authentication & Security
- **Multi-factor Authentication**: Email/password + Google & GitHub OAuth via BetterAuth
- **Session Management**: Secure server-side sessions with automatic refresh
- **Role-based Access**: Admin vs. user role protection for sensitive routes
- **Protected Routes**: Middleware guarding /profile, /orders, /admin, and /checkout

### 👤 User Experience
- **Profile Management**: Personal information, order history, and wishlist management
- **Wishlist System**: Save favorite items for later purchase
- **Product Reviews**: Rate and review purchased products with star ratings
- **Recently Viewed**: Track browsing history for personalized recommendations
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop devices

### ⚙️ Admin Panel
- **Product Management**: Complete CRUD operations for products with image upload
- **Order Management**: View, filter, and update order statuses
- **User Administration**: Manage user accounts and roles
- **Coupon System**: Create and manage discount codes with usage limits
- **Analytics Dashboard**: Sales metrics, top products, and customer insights

### 📝 Content & Engagement
- **Blog System**: Full-featured blog with categories, tags, and SEO optimization
- **Newsletter Subscription**: Email capture for marketing campaigns
- **Contact Form**: Spam-protected contact mechanism with admin notifications
- **About Us Page**: Company story and brand information

### 🛠️ Technical Excellence
- **Modern Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS v4, shadcn/ui
- **Performance Optimized**: Image optimization, lazy loading, and code splitting
- **Accessibility**: WCAG 2.1 compliant components and keyboard navigation
- **SEO Friendly**: Metadata management, sitemap generation, and clean URLs
- **Type Safety**: End-to-end TypeScript with strict mode enabled
- **Error Handling**: Custom error pages (404, 500) and graceful degradation
- **Testing Ready**: Structured for unit and integration testing

## 🚀 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing for JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notification system
- **[Lucide Icons](https://lucide.dev/)** - Beautifully crafted SVG icons

### Backend & Infrastructure
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless functions
- **[BetterAuth](https://better-auth.com/)** - Full-stack authentication framework
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database ORM
- **[Neon PostgreSQL](https://neon.tech/)** - Serverless PostgreSQL database
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Development & Deployment
- **[Vercel](https://vercel.com/)** - Optimized hosting for Next.js
- **[ESLint](https://eslint.org/)** - Code quality and consistency
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for linting
- **[Lint-Staged](https://github.com/okonet/lint-staged)** - Run linters on staged files

## 📁 Project Structure

```
sneakora_tec/
├── .app/                     # Next.js App Router pages
│   ├── (auth)/               # Authentication routes (login, signup)
│   ├── admin/                # Admin dashboard and management
│   ├── api/                  # API routes (REST endpoints)
│   ├── blog/                 # Blog listing and individual posts
│   ├── cart/                 # Shopping cart functionality
│   ├── checkout/             # Checkout flow and order confirmation
│   ├── contact/              # Contact form and information
│   ├── onboarding/           # User onboarding flow
│   ├── order/                # Order history and details
│   ├── profile/              # User profile and settings
│   ├── shop/                 # Product catalog and listings
│   ├── studio/               # Sanity CMS studio integration
│   └── wishlist/             # Wishlist management
├── components/               # Reusable UI components
│   ├── admin/                # Admin-specific components
│   ├── layout/               # Navigation, footer, sidebar
│   ├── product/              # Product cards, details, filters
│   ├── cart/                 # Cart items and summary
│   ├── order/                # Order status and history components
│   ├── profile/              # Profile settings and forms
│   ├── shared/               # Cross-component utilities
│   └── ui/                   # shadcn/ui wrapper components
├── lib/                      # Utility functions and configurations
│   ├── auth.ts               # BetterAuth configuration
│   ├── db.ts                 # Prisma client instance
│   ├── navigate.ts           # Navigation utilities
│   ├── product-images.ts     # Product image constants
│   └── utils.ts              # Helper functions
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma         # Database models and relationships
│   └── seed.ts               # Database seeding script
├── public/                   # Static assets
│   └── images/               # Product images, logos, icons
├── .env.example              # Environment variables template
├── components.json           # shadcn/ui configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- Git
- Neon PostgreSQL account (free tier available)
- GitHub and Google Developer accounts (for OAuth)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sneakora_tec.git
   cd sneakora_tec
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your actual values:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

   # BetterAuth
   BETTER_AUTH_SECRET="your-32-character-random-string"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

   # OAuth Providers (optional but recommended)
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   AUTH_GITHUB_ID="your-github-client-id"
   AUTH_GITHUB_SECRET="your-github-client-secret"

   # Stripe (for payments)
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."

   # Email (Resend or SMTP)
   RESEND_API_KEY="re_..."  # or SMTP credentials

   # File Upload (UploadThing or Vercel Blob)
   BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"  # or UploadThing tokens
   ```

4. **Initialize the database**
   ```bash
   # Push schema to Neon
   npx prisma db push
   
   # Seed with sample data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Visit `http://localhost:3000` to see the application running

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Configure environment variables in Vercel dashboard
4. Vercel will automatically build and deploy your application

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run end-to-end tests (if configured)
npm run test:e2e
```

### Linting & Formatting
```bash
# Check for linting errors
npm run lint

# Automatically fix formatting issues
npm run format
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Product Endpoints
- `GET /api/products` - Get all products (with filtering/pagination)
- `GET /api/products/[id]` - Get single product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/[id]` - Update cart item quantity
- `DELETE /api/cart/[id]` - Remove item from cart

### Order Endpoints
- `GET /api/orders` - Get user's order history
- `GET /api/orders/[id]` - Get specific order details
- `POST /api/orders` - Create new order (checkout)

### User Endpoints
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Admin Endpoints (Require admin role)
- `GET /api/admin/products` - List all products
- `GET /api/admin/orders` - List all orders
- `POST /api/admin/coupons` - Create coupon
- `GET /api/admin/stats` - Get dashboard statistics

## 🤝 Contributing

We welcome contributions to make Sneakora_tec better! Please follow these guidelines:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows our coding standards:
- TypeScript strict mode
- ESLint and Prettier configurations
- Meaningful commit messages
- Comprehensive testing for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Acknowledgments

- **Next.js Team** - For the incredible React framework
- **Vercel** - For hosting and deployment excellence
- **Tailwind Labs** - For the utility-first CSS approach
- **[shadcn/ui](https://ui.shadcn.com/)** - For beautiful, accessible components
- **BetterAuth Team** - For the authentication solution
- **Prisma Team** - For the type-safe ORM
- **Neon Tech** - For serverless PostgreSQL
- **Open Source Community** - For countless tools and libraries

## 📞 Support

For support, questions, or feedback:
- **Issues**: [GitHub Issues](https://github.com/your-username/sneakora_tec/issues)
- **Email**: support@sneakora_tec.com
- **Documentation**: [Docs Site](https://docs.sneakora_tec.com)

---

Built with ❤️ by the Sneakora_tec Team

*Transforming the sneaker shopping experience, one step at a time.*
