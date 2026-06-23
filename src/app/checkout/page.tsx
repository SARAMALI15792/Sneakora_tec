"use client";

import { Suspense, useState, useEffect } from "react";
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

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) return;
    fetch("/api/checkout", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else if (data.url) window.location.href = data.url;
      })
      .catch(console.error);
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
          {clientSecret ? (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          )}
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
