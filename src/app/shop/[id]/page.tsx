import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/db";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ReviewForm } from "@/components/product/ReviewForm";

type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
    },
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

        <div className="mx-auto mt-20 max-w-2xl">
          <div className="border-t border-border pt-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Customer Reviews
            </p>
            <h2 className="font-heading mt-2 text-2xl font-bold">
              {product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}
            </h2>

            {product.reviews.length > 0 && (
              <div className="mt-8 space-y-8">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {review.user.name || "Anonymous"}
                      </span>
                      <span className="inline-flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} viewBox="0 0 20 20" className="size-3.5" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1}>
                            <path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.7.9 5.24L10 13.2l-4.7 2.44.9-5.24-3.8-3.7 5.21-.86L10 1z" />
                          </svg>
                        ))}
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
            )}

            <div className="mt-10 border-t border-border pt-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-4">
                Write a Review
              </p>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
