"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  category: string;
};

function colorToHex(color: string): string {
  const map: Record<string, string> = {
    black: "#1a1a1a", white: "#f5f5f5", violet: "#8b5cf6", navy: "#1e3a5f",
    grey: "#6b7280", gray: "#6b7280", cream: "#f5f0e1", tan: "#d2b48c",
    "rose gold": "#e8bfb6", olive: "#556b2f", brown: "#8b4513", blue: "#3b82f6",
    "blue/neon": "#0066ff", "neon green": "#39ff14", "hot pink": "#ff1493",
    orange: "#ff8c00", red: "#ef4444", green: "#22c55e", "black/white": "#333",
    "black/gold": "#1a1a2e", "white/cream": "#faf5e8", "blue/green": "#2d8a4e",
    "pink/purple": "#c084fc", "black/neon": "#111", "blue/orange": "#2563eb",
    "pink/white": "#f9a8d4", "black/green": "#111",
  };
  return map[color.toLowerCase()] || "#888";
}

export function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const price = Number(product.price);
  const compareAt = product.compareAt ? Number(product.compareAt) : null;
  const images = product.images?.length ? product.images : [];
  const onSale = compareAt && compareAt > price;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === "Escape") setLightboxOpen(false);
    if (e.key === "ArrowLeft" && images.length > 1)
      setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1));
    if (e.key === "ArrowRight" && images.length > 1)
      setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [lightboxOpen, images.length]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-3">
          <button
            onClick={() => setLightboxOpen(true)}
            className="group relative aspect-[4/5] w-full overflow-hidden bg-muted text-left"
          >
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-8xl opacity-10">👟</span>
              </div>
            )}
          </button>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square w-16 overflow-hidden transition-all ${
                    selectedImage === i
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              {product.category}
            </p>
            <h1 className="font-heading mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">${price.toFixed(2)}</span>
            {onSale && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  ${compareAt.toFixed(2)}
                </span>
                <span className="bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground">
                  -{Math.round((1 - price / compareAt) * 100)}%
                </span>
              </>
            )}
          </div>

          <div className="h-px bg-border" />

          {product.description && (
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {/* Sizes */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">
                Size
              </h3>
              {selectedSize && <span className="text-xs text-foreground">{selectedSize}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 min-w-11 px-3 text-sm transition-all duration-200 ${
                    selectedSize === size
                      ? "bg-foreground text-background font-semibold"
                      : "border border-border hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">
                Color
              </h3>
              {selectedColor && <span className="text-xs text-foreground">{selectedColor}</span>}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`flex h-10 items-center gap-2 px-3 transition-all duration-200 ${
                    selectedColor === color
                      ? "bg-foreground text-background"
                      : "border border-border hover:border-foreground"
                  }`}
                >
                  <span
                    className="size-3 rounded-full ring-1 ring-border"
                    style={{ backgroundColor: colorToHex(color) }}
                  />
                  <span className="text-xs">{color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-xs">
            <span className={`size-1.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              disabled={adding}
              className="group inline-flex h-12 flex-1 items-center justify-center gap-3 bg-foreground text-xs font-semibold uppercase tracking-widest text-background transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              onClick={async () => {
                if (!selectedSize || !selectedColor) {
                  toast.error("Please select a size and color");
                  return;
                }
                setAdding(true);
                try {
                  const { data: session } = await authClient.getSession();
                  if (!session) {
                    router.push("/sign-in");
                    return;
                  }
                  const res = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      productId: product.id,
                      size: selectedSize,
                      color: selectedColor,
                    }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    toast.success("Added to cart");
                    const navEvent = new CustomEvent("cart-updated");
                    window.dispatchEvent(navEvent);
                  } else {
                    toast.error(data.error || "Failed to add");
                  }
                } catch (err) {
                  console.error("Add to cart error:", err);
                  toast.error("Something went wrong");
                }
                setAdding(false);
              }}
            >
              <ShoppingBag className="size-4" />
              {adding ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="inline-flex h-12 w-12 items-center justify-center border border-border transition-all duration-300 hover:bg-muted active:scale-[0.98]"
              onClick={() => {}}
            >
              <Heart className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 z-10 flex size-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1))}
                className="absolute left-6 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-8" />
              </button>
              <button
                onClick={() => setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1))}
                className="absolute right-6 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronRight className="size-8" />
              </button>
            </>
          )}

          <div className="relative max-h-[85vh] max-w-[85vw]">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="max-h-[85vh] max-w-[85vw] object-contain"
            />
          </div>

          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground tracking-widest">
            {selectedImage + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
