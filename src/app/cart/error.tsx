"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Cart error:", error);
  }, [error]);

  return (
    <div className="pt-20 min-h-[60dvh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto flex size-16 items-center justify-center rounded-[1.5rem] bg-destructive/10 ring-1 ring-destructive/20">
          <AlertTriangle className="size-7 text-destructive" />
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Cart Error
        </p>
        <h1 className="font-heading mt-3 text-2xl font-bold">
          Couldn&apos;t load your cart
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="text-xs font-semibold uppercase tracking-widest hover:underline"
          >
            Try Again
          </button>
          <span className="text-muted-foreground">|</span>
          <Link href="/shop" className="text-xs font-semibold uppercase tracking-widest hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}