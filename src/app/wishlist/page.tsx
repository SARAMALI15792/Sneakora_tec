"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

type WishlistItem = {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
  };
};

export default function WishlistPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    const res = await fetch("/api/wishlist");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    fetchWishlist();
  }, [session, fetchWishlist]);

  async function removeItem(id: string) {
    const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  async function addToCart(productId: string) {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
      const navEvent = new CustomEvent("cart-updated");
      window.dispatchEvent(navEvent);
    }
  }

  if (!session) {
    return (
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <Heart className="mx-auto size-12 text-muted-foreground/50" />
          <h1 className="font-heading mt-6 text-3xl font-bold">Sign in to view your wishlist</h1>
          <Link
            href="/sign-in"
            className="mt-6 inline-flex h-11 items-center px-6 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Skeleton className="mb-2 h-5 w-20" />
          <Skeleton className="h-9 w-48" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/5]" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <Heart className="mx-auto size-12 text-muted-foreground/50" />
          <h1 className="font-heading mt-6 text-3xl font-bold">Your wishlist is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Save your favorite sneakers for later.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-11 items-center px-6 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/profile"
          className="mb-8 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Profile
        </Link>

        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Saved Items
        </p>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight">
          Wishlist ({items.length})
        </h1>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <Link
                href={`/shop/${item.product.slug || item.product.id}`}
                className="block aspect-[4/5] overflow-hidden bg-muted"
              >
                {item.product.images[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-6xl opacity-10">👟</div>
                )}
              </Link>

              <button
                onClick={() => removeItem(item.id)}
                className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>

              <div className="mt-3 space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {item.product.category}
                </p>
                <Link
                  href={`/shop/${item.product.slug || item.product.id}`}
                  className="block text-sm font-semibold hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm font-bold">${item.product.price.toFixed(2)}</p>

                <button
                  onClick={() => addToCart(item.product.id)}
                  className="mt-2 flex w-full h-9 items-center justify-center gap-2 bg-foreground text-[10px] font-semibold uppercase tracking-widest text-background transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  <ShoppingBag className="size-3" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
