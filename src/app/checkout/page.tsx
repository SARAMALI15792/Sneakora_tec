"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Skeleton } from "@/components/ui/skeleton";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    if (sessionId) {
      const res = await fetch(`/api/checkout?session_id=${sessionId}`, { method: "POST" });
      const data = await res.json();
      if (data.clientSecret) return data.clientSecret;
      throw new Error(data.error || "Failed to get client secret");
    }
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.clientSecret) return data.clientSecret;
    throw new Error(data.error || "Failed to get client secret");
  }, [sessionId]);

  if (!stripePromise) {
    return (
      <div className="flex min-h-dvh items-center justify-center pt-20">
        <p className="text-sm text-muted-foreground">Checkout unavailable</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-20">
      <div className="py-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Checkout
        </p>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight">
          Complete your order
        </h1>

        <div className="mt-8">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-6 pt-20">
          <div className="py-10 space-y-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
