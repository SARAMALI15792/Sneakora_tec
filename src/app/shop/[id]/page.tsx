import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/db";
import { ProductDetails } from "@/components/product/ProductDetails";

type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center pt-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          404
        </p>
        <h1 className="font-heading mt-3 text-3xl font-bold">Product not found</h1>
        <Link
          href="/shop"
          className="mt-6 text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const serialized = {
    ...product,
    price: Number(product.price),
    compareAt: product.compareAt ? Number(product.compareAt) : null,
    reviews: product.reviews.map((r) => ({
      ...r,
      user: { name: r.user.name, image: r.user.image },
    })),
  };

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back to shop
        </Link>

        <ProductDetails product={serialized} />

        {product.reviews.length > 0 && (
          <div className="mx-auto mt-20 max-w-2xl">
            <div className="border-t border-border pt-10">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                Customer Reviews
              </p>
              <h2 className="font-heading mt-2 text-2xl font-bold">
                {product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}
              </h2>

              <div className="mt-8 space-y-8">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {review.user.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-accent">
                        {"★".repeat(review.rating)}
                        <span className="text-muted-foreground">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </span>
                    </div>
                    {review.title && (
                      <p className="mt-2 font-heading text-base font-bold">{review.title}</p>
                    )}
                    {review.content && (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {review.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
