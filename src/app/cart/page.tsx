"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
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

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = useCallback(async () => {
    const res = await fetch("/api/cart");
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
    fetchCart();
  }, [session, fetchCart]);

  async function updateQuantity(id: string, quantity: number) {
    const res = await fetch(`/api/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      if (quantity === 0) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
      }
    }
  }

  async function removeItem(id: string) {
    const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
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

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (!session) {
    return (
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Cart</p>
          <h1 className="font-heading mt-3 text-3xl font-bold">Sign in to view your cart</h1>
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
          <Skeleton className="mb-8 h-5 w-24" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="size-24 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
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
          <ShoppingBag className="mx-auto size-12 text-muted-foreground/50" />
          <h1 className="font-heading mt-6 text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add some sneakers to get started.
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
          href="/shop"
          className="mb-8 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Continue Shopping
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Shopping Cart
            </p>
            <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </h1>

            <div className="mt-8 divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 py-6">
                  <Link
                    href={`/shop/${item.productId}`}
                    className="size-24 shrink-0 overflow-hidden bg-muted"
                  >
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl opacity-10">
                        👟
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <Link
                          href={`/shop/${item.productId}`}
                          className="font-heading text-sm font-bold hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="flex size-8 items-center justify-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:border-l lg:border-border lg:pl-12">
            <div className="sticky top-28 space-y-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                Order Summary
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full h-12 bg-foreground text-xs font-semibold uppercase tracking-widest text-background transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {checkingOut ? "Redirecting..." : "Checkout"}
              </button>

              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground tracking-widest">
                <span className="size-1 rounded-full bg-accent" />
                Secure checkout powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
