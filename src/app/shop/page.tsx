import { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Shop — Sneakora",
  description: "Browse our collection of premium sneakers.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

function buildUrl(sp: Record<string, string | undefined>, key: string, value: string): string {
  const params = new URLSearchParams();
  if (sp.category) params.set("category", sp.category);
  if (sp.search) params.set("search", sp.search);
  if (sp.sort) params.set("sort", sp.sort);
  if (value) params.set(key, value);
  else params.delete(key);
  params.set("page", "1");
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const category = sp.category || undefined;
  const search = sp.search || undefined;
  const sort = sp.sort || "newest";
  const page = Number(sp.page) || 1;
  const limit = 12;

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" as const } },
      { description: { contains: search, mode: "insensitive" as const } },
    ];
  }

  interface OrderBy {
    createdAt?: "asc" | "desc";
    price?: "asc" | "desc";
    name?: "asc" | "desc";
  }
  let orderBy: OrderBy = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const categoryLabel = category ? category.charAt(0).toUpperCase() + category.slice(1) : "All";

  return (
    <div className="pt-20">
      {/* Header band */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Collection
          </p>
          <div className="mt-3 flex items-end justify-between">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              {categoryLabel}
            </h1>
            <p className="text-xs text-muted-foreground">
              {total} product{total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <ProductFilters searchParams={sp as Record<string, string | undefined>} />
          </aside>

          {/* Mobile category chips */}
          <div className="mb-6 flex flex-wrap gap-1.5 lg:hidden">
            {["men", "women", "kids", "running", "basketball", "casual", "training", "lifestyle"].map((cat) => {
              const active = category === cat;
              return (
                <a
                  key={cat}
                  href={buildUrl(sp, "category", active ? "" : cat)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors ${
                    active
                      ? "bg-foreground text-background"
                      : "border border-border text-muted-foreground hover:border-accent/50"
                  }`}
                >
                  {cat}
                </a>
              );
            })}
          </div>

          <div>
            <Suspense
              fallback={
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[4/5]" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              }
            >
              <ProductGrid products={products} />
            </Suspense>

            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const params = new URLSearchParams();
                  if (sp.category) params.set("category", sp.category);
                  if (sp.search) params.set("search", sp.search);
                  if (sp.sort) params.set("sort", sp.sort);
                  params.set("page", String(p));
                  const isActive = p === page;
                  return (
                    <a
                      key={p}
                      href={`/shop?${params.toString()}`}
                      className={`inline-flex h-9 min-w-9 items-center justify-center px-3 text-xs transition-colors ${
                        isActive
                          ? "bg-foreground text-background font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
