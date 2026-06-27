"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Lock,
  Truck,
  RefreshCw,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/brand/Logo";
import { SneakerSlideshow } from "@/components/shared/SneakerSlideshow";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const TRUST_BADGES = [
  { icon: Lock, label: "256-bit SSL secure" },
  { icon: Truck, label: "Free shipping over $100" },
  { icon: RefreshCw, label: "30-day easy returns" },
];

function PaymentForm({
  onBack,
}: {
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: {
            type: "tabs",
            defaultCollapsed: false,
          },
        }}
      />

      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border/50 px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
        >
          <ChevronLeft className="size-4" />
          Back to cart
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || loading}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Lock className="size-4" />
          )}
          {loading ? "Processing..." : "Pay now"}
        </button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground/60">
        Your payment is secured with 256-bit SSL encryption.
        We never store your card details.
      </p>
    </form>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<{
    subtotal: number;
    total: number;
    couponApplied: boolean;
  } | null>(null);

  useEffect(() => {
    if (canceled === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Payment was canceled. Please try again.");
    }
  }, [canceled]);

  useEffect(() => {
    const initCheckout = async () => {
      try {
        const res = await fetch("/api/checkout", { method: "POST" });
        const data = await res.json();

        if (data.devMode) {
          window.location.href = data.url;
          return;
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setOrderData({
            subtotal: data.subtotal,
            total: data.total,
            couponApplied: data.couponApplied,
          });
        } else {
          setError(data.error || "Failed to initialize checkout");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Checkout failed");
      } finally {
        setLoading(false);
      }
    };
    initCheckout();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[100dvh] md:grid-cols-2">
        <div className="hidden md:block bg-muted/30" />
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[100dvh] flex-col md:grid md:grid-cols-2">
        <div className="relative h-48 w-full overflow-hidden bg-zinc-950 md:hidden">
          <SneakerSlideshow />
        </div>
        <div className="relative hidden overflow-hidden bg-zinc-950 md:block">
          <SneakerSlideshow />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent z-10" />
          <div className="absolute bottom-10 left-10 right-10 z-10">
            <div className="text-white">
              <Logo size="lg" />
            </div>
            <p className="mt-3 text-sm text-zinc-400">
              Premium sneakers for every step.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-500/10">
              <ShoppingBag className="size-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => router.push("/cart")}
              className="mt-6 inline-flex h-11 items-center px-6 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col md:grid md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-zinc-950 md:block">
        <SneakerSlideshow />

        <div className="absolute inset-0 flex flex-col justify-between p-10 z-10">
          <div>
            <div className="text-white/90">
              <Logo size="sm" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wider text-white/80 backdrop-blur-sm">
              PREMIUM SNEAKERS
            </div>
            <h2 className="font-heading text-4xl font-bold leading-tight text-white">
              Step into
              <br />
              style.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
              Your order is just a few taps away.
              Secure checkout powered by Stripe.
            </p>

            <div className="space-y-3 pt-4">
              {TRUST_BADGES.map((badge) => (
                <div key={badge.label} className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/20">
                    <badge.icon className="size-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-zinc-300">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-center overflow-y-auto p-5 pt-6 md:p-12 md:pt-24">
        <div className="w-full max-w-md">
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-zinc-950 md:hidden">
            <SneakerSlideshow />
          </div>

          <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 md:hidden">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <badge.icon className="size-3.5" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>

          <div className="mb-6 md:mb-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Secure checkout
            </p>
            <h1 className="font-heading mt-2 text-2xl font-bold tracking-tight">
              Complete payment
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your card details to complete the order.
            </p>
          </div>

          {orderData && (
            <div className="mb-6 space-y-3 rounded-xl border border-border/50 bg-card/50 p-4 md:p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              {orderData.couponApplied && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-600">Discount</span>
                  <span className="font-medium text-emerald-600">Applied</span>
                </div>
              )}
              <div className="border-t border-border/50 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold">${orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <ProgressBar value={75} showLabel={false} size="sm" />

          <div className="mt-6">
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#7c3aed",
                      colorBackground: "transparent",
                      colorText: "currentColor",
                      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                      fontSizeBase: "14px",
                      borderRadius: "12px",
                    },
                  },
                }}
              >
                <PaymentForm
                  onBack={() => router.push("/cart")}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
