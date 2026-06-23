import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | { toString(): string };
  compareAt: number | { toString(): string } | null;
  images: string[];
  category: string;
  colors: string[];
  stock: number;
  featured: boolean;
};

export function ProductCard({ product }: { product: Product }) {
  const price =
    typeof product.price === "object" ? Number(product.price) : product.price;
  const compareAt =
    product.compareAt && typeof product.compareAt === "object"
      ? Number(product.compareAt)
      : product.compareAt;
  const imageUrl = product.images?.[0];
  const onSale = compareAt && compareAt > price;

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-5xl opacity-15">👟</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="bg-background/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-foreground backdrop-blur-sm">
              Featured
            </span>
          )}
          {onSale && (
            <span className="bg-accent px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-accent-foreground">
              -{Math.round((1 - price / compareAt) * 100)}%
            </span>
          )}
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-3 right-3 flex size-9 items-center justify-center bg-background text-foreground opacity-0 translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-100 group-hover:translate-y-0">
          <ArrowUpRight className="size-4" />
        </div>
      </div>

      {/* Info */}
      <div className="mt-3.5">
        <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
          {product.category}
        </p>
        <h3 className="font-heading mt-1 text-[15px] font-bold leading-snug transition-colors duration-200 group-hover:text-accent">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm font-bold">${price.toFixed(2)}</span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              ${compareAt.toFixed(2)}
            </span>
          )}
        </div>

        {/* Colors */}
        <div className="mt-2 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color}
              className="size-2.5 rounded-full ring-1 ring-border"
              style={{ backgroundColor: colorToHex(color) }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-muted-foreground">
              +{product.colors.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function colorToHex(color: string): string {
  const map: Record<string, string> = {
    black: "#1a1a1a",
    white: "#f5f5f5",
    violet: "#8b5cf6",
    navy: "#1e3a5f",
    grey: "#6b7280",
    gray: "#6b7280",
    cream: "#f5f0e1",
    tan: "#d2b48c",
    "rose gold": "#e8bfb6",
    olive: "#556b2f",
    brown: "#8b4513",
    blue: "#3b82f6",
    "blue/neon": "#0066ff",
    "neon green": "#39ff14",
    "hot pink": "#ff1493",
    orange: "#ff8c00",
    red: "#ef4444",
    green: "#22c55e",
    "black/white": "#333333",
    "black/gold": "#1a1a2e",
    "white/cream": "#faf5e8",
    "blue/green": "#2d8a4e",
    "pink/purple": "#c084fc",
    "black/neon": "#111111",
    "blue/orange": "#2563eb",
    "pink/white": "#f9a8d4",
    "black/green": "#111111",
  };
  return map[color.toLowerCase()] || "#888888";
}
