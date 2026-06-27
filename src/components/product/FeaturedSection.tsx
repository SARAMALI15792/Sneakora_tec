"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface FeaturedShoe {
  name: string;
  price: string;
  originalPrice?: string;
  slug: string;
  category: string;
  image: string;
  badge?: string;
}

async function getFeaturedProducts(): Promise<FeaturedShoe[]> {
  try {
    const res = await fetch(`/api/products?featured=true&limit=4`);
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return data.products.map((p: {
      name: string;
      slug: string;
      category: string;
      images: string[];
      price: string;
      compareAt?: string;
    }) => ({
      name: p.name,
      slug: p.slug,
      category: p.category,
      image: p.images?.[0] || "",
      price: `$${Number(p.price).toFixed(2)}`,
      originalPrice: p.compareAt ? `$${Number(p.compareAt).toFixed(2)}` : undefined,
      badge: p.compareAt ? "Sale" : undefined,
    }));
  } catch {
    return FALLBACK;
  }
}

const FALLBACK: FeaturedShoe[] = [
  {
    name: "Air Pulse Max",
    price: "$189",
    originalPrice: "$229",
    slug: "air-pulse-max",
    category: "men",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80&auto=format",
    badge: "Sale",
  },
  {
    name: "Quantum Runner",
    price: "$159",
    slug: "quantum-runner",
    category: "sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format",
  },
  {
    name: "Street Vibe Pro",
    price: "$134",
    originalPrice: "$159",
    slug: "street-vibe-pro",
    category: "casual",
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80&auto=format",
    badge: "Sale",
  },
  {
    name: "Lift Core High",
    price: "$149",
    originalPrice: "$179",
    slug: "lift-core-high",
    category: "women",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80&auto=format",
    badge: "Sale",
  },
];

export function FeaturedSection() {
  const [products, setProducts] = useState<FeaturedShoe[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts().then((p) => {
      setProducts(p.length > 0 ? p : FALLBACK);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-[#1C1917]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#8A7A67] font-medium">
              Handpicked Selection
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[#F5F0E6] lg:text-5xl">
              This Season&apos;s Picks
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#8A7A67] hover:text-[#C9905A] transition-colors duration-200 border-b border-transparent hover:border-[#C9905A] pb-0.5"
          >
            View All <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((shoe, i) => (
            <Link
              key={shoe.slug}
              href={`/shop/${shoe.slug}`}
              className="group block"
            >
              {/* Image container */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-[#2A2520]/30 mb-4">
                <Image
                  src={shoe.image}
                  alt={shoe.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "sepia(20%) saturate(95%)" }}
                />
                {/* Badge */}
                {shoe.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-block bg-[#C9905A] text-[#1C1917] text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      {shoe.badge}
                    </span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1C1917]/0 group-hover:bg-[#1C1917]/20 transition-colors duration-300" />
              </div>

              {/* Info */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8A7A67] mb-1">
                  {shoe.category}
                </p>
                <h3 className="font-serif text-base font-bold text-[#F5F0E6] group-hover:text-[#C9905A] transition-colors duration-300 leading-tight">
                  {shoe.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-[#F5F0E6]">
                    {shoe.price}
                  </span>
                  {shoe.originalPrice && (
                    <span className="font-mono text-xs text-[#8A7A67] line-through">
                      {shoe.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#8A7A67] border-b border-[#8A7A67]/30 pb-0.5 hover:border-[#C9905A] hover:text-[#C9905A] transition-colors"
          >
            View All Products <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}