"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Lock,
  ShoppingCart,
  Package,
  CreditCard,
  ShieldCheck,
  Truck,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

type CartItem = {
  id: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
  };
};

const springEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: springEase },
  },
};

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function CartPage() {
  const { data: session, isPending: authPending } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setFetchError(false);
    const res = await fetch("/api/cart");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    } else {
      setFetchError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authPending || !session) return;
    fetchCart();
  }, [session, authPending, fetchCart]);

  async function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      setRemoving(id);
      await new Promise((r) => setTimeout(r, 400));
      await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 0 }),
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
      setRemoving(null);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    await fetch(`/api/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
  }

  async function removeItem(id: string) {
    setRemoving(id);
    await new Promise((r) => setTimeout(r, 400));
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setRemoving(null);
  }

  async function handleCheckout() {
    setCheckingOut(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      window.location.href = data.url;
    } else {
      const err = await res.json();
      alert(err.error || "Checkout failed");
    }
    setCheckingOut(false);
  }

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  /* ────────── Unauthenticated ────────── */
  if (!session) {
    return (
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: springEase }}
          >
            <div className="mx-auto flex size-24 items-center justify-center rounded-[2rem] bg-muted/50 ring-1 ring-border/40">
              <ShoppingCart className="size-10 text-muted-foreground/40" />
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Cart</p>
            <h1 className="font-heading mt-3 text-4xl font-bold tracking-tight">Sign in to view your cart</h1>
            <Link
              href="/sign-in"
              className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-foreground px-8 text-xs font-semibold uppercase tracking-[0.15em] text-background transition-all duration-500 hover:opacity-90 active:scale-[0.97]"
            >
              Sign In
              <span className="flex size-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-3" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ────────── Auth/Cart Loading ────────── */
  if (authPending || loading) {
    return (
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Skeleton className="mb-8 h-4 w-20" />
          <div className="grid gap-14 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-5 p-5">
                  <Skeleton className="size-28 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="mt-4 h-10 w-32" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="hidden lg:block h-72 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  /* ────────── Empty / Error ────────── */
  if (items.length === 0) {
    if (fetchError) {
      return (
        <div className="pt-20">
          <div className="mx-auto max-w-7xl px-6 py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: springEase }}
            >
              <div className="mx-auto flex size-24 items-center justify-center rounded-[2rem] bg-destructive/10 ring-1 ring-destructive/20">
                <AlertCircle className="size-10 text-destructive/60" />
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Cart</p>
              <h1 className="font-heading mt-3 text-4xl font-bold tracking-tight">Could not load your cart</h1>
              <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
              <button
                onClick={() => { setLoading(true); setFetchError(false); fetchCart(); }}
                className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-foreground px-8 text-xs font-semibold uppercase tracking-[0.15em] text-background transition-all duration-500 hover:opacity-90 active:scale-[0.97]"
              >
                Retry
                <span className="flex size-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
                  <RotateCw className="size-3" />
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      );
    }
    return (
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: springEase }}
          >
            <div className="mx-auto flex size-24 items-center justify-center rounded-[2rem] bg-muted/50 ring-1 ring-border/40">
              <Package className="size-10 text-muted-foreground/40" />
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Cart</p>
            <h1 className="font-heading mt-3 text-4xl font-bold tracking-tight">Your cart is empty</h1>
            <p className="mt-2 text-sm text-muted-foreground">Add some sneakers to get started.</p>
            <Link
              href="/shop"
              className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-foreground px-8 text-xs font-semibold uppercase tracking-[0.15em] text-background transition-all duration-500 hover:opacity-90 active:scale-[0.97]"
            >
              Browse Shop
              <span className="flex size-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-3" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ────────── Main Cart ────────── */
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: springEase }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            Continue Shopping
          </Link>
        </motion.div>

        <div className="grid gap-14 lg:grid-cols-[1fr_400px]">
          {/* ── Items Column ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease: springEase }}
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Cart</p>
              <h1 className="font-heading mt-2 text-4xl font-bold tracking-tight">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </h1>
            </motion.div>

            <LayoutGroup>
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="mt-12 space-y-5"
              >
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const isRemoving = removing === item.id;
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        variants={fadeUp}
                        exit={{
                          opacity: 0,
                          x: -80,
                          scale: 0.95,
                          transition: { duration: 0.35, ease: springEase },
                        }}
                        className={`relative rounded-2xl border transition-all duration-500 ${
                          isRemoving
                            ? "border-destructive/20 bg-destructive/5 opacity-30 scale-[0.97]"
                            : "border-border/50 bg-card/40 hover:border-border/80"
                        }`}
                      >
                        {/* Double-Bezel shell */}
                        <div className="p-1.5">
                          <div className="rounded-[calc(1.5rem-0.375rem)] bg-background/60 p-0">
                            <div className="flex gap-6 p-5 sm:p-6">
                              {/* Image */}
                              <Link
                                href={`/shop/${item.product.id}`}
                                className="size-28 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/30"
                              >
                                {item.product.images[0] ? (
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-3xl opacity-10">👟</div>
                                )}
                              </Link>

                              {/* Details */}
                              <div className="flex flex-1 flex-col justify-between min-w-0">
                                <div>
                                  <div className="flex justify-between gap-3">
                                    <Link
                                      href={`/shop/${item.product.id}`}
                                      className="font-heading text-sm font-bold leading-snug hover:underline truncate"
                                    >
                                      {item.product.name}
                                    </Link>
                                    <motion.span
                                      key={`p-${item.id}-${item.quantity}`}
                                      initial={{ opacity: 0, y: -6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.25 }}
                                      className="text-sm font-bold shrink-0 tabular-nums"
                                    >
                                      {formatPrice(item.product.price * item.quantity)}
                                    </motion.span>
                                  </div>

                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.size && (
                                      <span className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-muted/40 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                                        <span className="size-1 rounded-full bg-muted-foreground/40" />
                                        {item.size}
                                      </span>
                                    )}
                                    {item.color && (
                                      <span className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-muted/40 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                                        <span className="size-1 rounded-full bg-muted-foreground/40" />
                                        {item.color}
                                      </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-muted/40 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                                      <span className="size-1 rounded-full bg-muted-foreground/40" />
                                      ${item.product.price.toFixed(2)} ea
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center gap-3">
                                  {/* Stepper */}
                                  <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 p-0.5">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-background/80 hover:text-foreground active:scale-90"
                                    >
                                      <Minus className="size-3" />
                                    </button>
                                    <motion.span
                                      key={`q-${item.id}-${item.quantity}`}
                                      initial={{ scale: 1.4 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 20, mass: 0.5 }}
                                      className="flex w-9 items-center justify-center text-xs font-semibold tabular-nums"
                                    >
                                      {item.quantity}
                                    </motion.span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-background/80 hover:text-foreground active:scale-90"
                                    >
                                      <Plus className="size-3" />
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground/60 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive active:scale-90"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Removing overlay shimmer */}
                        {isRemoving && (
                          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-destructive/5 to-transparent" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border/30 bg-muted/20 px-6 py-4 text-[10px] text-muted-foreground tracking-wider"
            >
              <span className="flex items-center gap-2">
                <Lock className="size-3" />
                Secure Checkout
              </span>
              <span className="flex items-center gap-2">
                <Truck className="size-3" />
                Free Shipping
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-3" />
                30-Day Returns
              </span>
            </motion.div>
          </div>

          {/* ── Summary Column ── */}
          <div className="lg:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: springEase }}
              className="sticky top-28"
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-1.5">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-background/60 p-6 sm:p-7">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                    Order Summary
                  </p>

                  <div className="mt-6 space-y-3.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <motion.span
                        key={`sub-${subtotal}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="font-medium tabular-nums"
                      >
                        {formatPrice(subtotal)}
                      </motion.span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="flex items-center gap-1.5 font-medium text-green-500">
                        <Truck className="size-3" />
                        Free
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-muted-foreground">Calculated at checkout</span>
                    </div>

                    <div className="border-t border-border/50 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold">Total</span>
                        <motion.span
                          key={`tot-${subtotal}`}
                          initial={{ scale: 1.08, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 18, mass: 0.8 }}
                          className="font-heading text-2xl font-bold tabular-nums"
                        >
                          {formatPrice(subtotal)}
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout button */}
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="group relative mt-7 flex w-full h-13 items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground text-xs font-semibold uppercase tracking-[0.15em] text-background transition-all duration-500 hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {checkingOut ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Checkout
                          <span className="flex size-7 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:translate-x-0.5 group-hover:scale-105">
                            <ArrowRight className="size-3.5" />
                          </span>
                        </>
                      )}
                    </span>
                    <span className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/8 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </button>

                  {/* Payment methods */}
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 tracking-widest">
                      <CreditCard className="size-3" />
                      Visa / MC / Amex
                    </div>
                    <span className="text-muted-foreground/20">|</span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 tracking-widest">
                      <Lock className="size-3" />
                      Secure
                    </div>
                  </div>

                  {/* Item count */}
                  <div className="mt-5 text-center text-[10px] text-muted-foreground/50 tracking-wider">
                    {items.length} item{items.length !== 1 ? "s" : ""} · {itemCount} unit{itemCount !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
