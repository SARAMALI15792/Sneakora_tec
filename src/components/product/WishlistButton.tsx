"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function WishlistButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: session } = await authClient.getSession();
      if (!session) return;
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          setIsWishlisted(data.items?.some((i: { productId: string }) => i.productId === productId) ?? false);
        }
      } catch {}
    }
    check();
  }, [productId]);

  async function toggle() {
    const { data: session } = await authClient.getSession();
    if (!session) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        }
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex h-12 w-12 items-center justify-center border transition-all duration-300 active:scale-[0.98] ${
        isWishlisted
          ? "bg-accent/10 border-accent/30 text-accent"
          : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
      }`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`size-4 ${isWishlisted ? "fill-accent" : ""}`} />
    </button>
  );
}
