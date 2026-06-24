"use client";

import { useEffect, useState, useRef } from "react";
import { Trash2, AlertCircle, RotateCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product/ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  images: string[];
  category: string;
  colors?: string[];
  stock?: number;
  featured?: boolean;
};

export function RecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchRecentlyViewed = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(false);
    try {
      const res = await fetch("/api/recently-viewed", { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        if (!controller.signal.aborted) {
          setItems(data.items);
        }
      } else {
        if (!controller.signal.aborted) setError(true);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (!controller.signal.aborted) {
        setError(true);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valid async init with abort controller
    fetchRecentlyViewed();
    return () => abortRef.current?.abort();
  }, []);

  async function clearHistory() {
    abortRef.current?.abort();
    try {
      const res = await fetch("/api/recently-viewed", { method: "DELETE" });
      if (res.ok) {
        setItems([]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/5]" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-3">
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" />
          Could not load recently viewed
        </div>
        <button
          onClick={() => { setLoading(true); fetchRecentlyViewed(); }}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCw className="size-3" />
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Recently Viewed
          </p>
          <h2 className="font-heading mt-1 text-xl font-bold">Your Browsing History</h2>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <Trash2 className="size-3" />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="compact"
            showWishlist={false}
          />
        ))}
      </div>
    </div>
  );
}
