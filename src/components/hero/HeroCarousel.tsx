"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    name: "Air Pulse Max",
    tagline: "Feel the stride. Own the street.",
    price: "$189",
    original: "$229",
    slug: "air-pulse-max",
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1400&q=85&auto=format",
    category: "Performance Running",
  },
  {
    name: "Quantum Runner",
    tagline: "Born on the track. Built for life.",
    price: "$159",
    original: null,
    slug: "quantum-runner",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=85&auto=format",
    category: "Everyday Training",
  },
  {
    name: "Street Vibe Pro",
    tagline: "Where culture meets comfort.",
    price: "$134",
    original: "$159",
    slug: "street-vibe-pro",
    image:
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1400&q=85&auto=format",
    category: "Casual Lifestyle",
  },
  {
    name: "Apex Pro Running",
    tagline: "Precision engineered. Maximum return.",
    price: "$219",
    original: "$259",
    slug: "apex-pro-running",
    image:
      "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=1400&q=85&auto=format",
    category: "Competition Gear",
  },
  {
    name: "Lift Core High",
    tagline: "Classic height, modern soul.",
    price: "$149",
    original: "$179",
    slug: "lift-core-high",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1400&q=85&auto=format",
    category: "Heritage Collection",
  },
  {
    name: "Elevate Luxe",
    tagline: "Premium materials, unparalleled craft.",
    price: "$249",
    original: "$299",
    slug: "elevate-luxe",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1400&q=85&auto=format",
    category: "Luxury Edition",
  },
  {
    name: "Speed Demon Elite",
    tagline: "A limit is a starting line.",
    price: "$259",
    original: "$299",
    slug: "speed-demon-elite",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1400&q=85&auto=format",
    category: "Performance Elite",
  },
  {
    name: "Court Master Low",
    tagline: "Command the court in style.",
    price: "$179",
    original: null,
    slug: "court-master-low",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1400&q=85&auto=format",
    category: "Court Sports",
  },
];

export function HeroCarousel() {
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDeal, setShowDeal] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.plugins().autoplay?.play();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowDeal(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  if (!mounted) {
    return (
      <div className="relative w-full h-full bg-[#1C1917] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-24 h-px bg-[#C9905A]/30" />
          <div className="w-3 h-3 rounded-full bg-[#C9905A]/40" />
          <div className="w-24 h-px bg-[#C9905A]/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#1C1917] overflow-hidden group/carousel">
      {/* Viewport */}
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.slug}
              className="relative min-w-0 flex-[0_0_100%] h-full overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  filter: "sepia(30%) saturate(80%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/30 to-[#1C1917]/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/70 via-transparent to-[#1C1917]/40" />

              <div className="relative z-10 flex h-full items-end pb-20 md:pb-24 lg:pb-32">
                <div className="px-6 md:px-12 lg:px-16">
                  <motion.p
                    key={`${slide.slug}-cat`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-[10px] uppercase tracking-[0.4em] text-[#C9905A] font-medium mb-2"
                  >
                    {slide.category}
                  </motion.p>
                  <motion.h2
                    key={`${slide.slug}-name`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F0E6] leading-tight tracking-tight"
                  >
                    {slide.name}
                  </motion.h2>
                  <motion.p
                    key={`${slide.slug}-tag`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-2 text-sm md:text-base text-[#F5F0E6]/70 max-w-md leading-relaxed"
                  >
                    {slide.tagline}
                  </motion.p>
                  <motion.div
                    key={`${slide.slug}-cta`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-6 flex items-center gap-4"
                  >
                    <Link
                      href={`/shop/${slide.slug}`}
                      className="group inline-flex h-11 items-center gap-3 bg-[#C9905A] text-[#F5F0E6] pl-6 pr-4 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#B8824A] active:scale-[0.98] transition-all duration-300"
                    >
                      Shop Now
                      <span className="inline-flex size-7 items-center justify-center bg-[#F5F0E6]/15 group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="size-3" />
                      </span>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg md:text-xl text-[#F5F0E6] font-semibold">
                        {slide.price}
                      </span>
                      {slide.original && (
                        <span className="font-mono text-sm text-[#F5F0E6]/40 line-through">
                          {slide.original}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        {showDeal && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pointer-events-auto bg-[#C9905A]/95 text-[#1C1917] py-2 px-4 text-center">
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase font-semibold">
                Spring Drop — Up to 40% Off Select Styles — Free Shipping Over $100
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-10 md:size-12 rounded-full bg-[#1C1917]/60 backdrop-blur-md border border-[#C9905A]/20 flex items-center justify-center text-[#F5F0E6]/60 hover:text-[#C9905A] hover:bg-[#1C1917]/80 hover:border-[#C9905A]/40 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
      >
        <ChevronLeft className="size-4 md:size-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-10 md:size-12 rounded-full bg-[#1C1917]/60 backdrop-blur-md border border-[#C9905A]/20 flex items-center justify-center text-[#F5F0E6]/60 hover:text-[#C9905A] hover:bg-[#1C1917]/80 hover:border-[#C9905A]/40 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
      >
        <ChevronRight className="size-4 md:size-5" />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${
              i === selectedIndex
                ? "w-8 h-[3px] bg-[#C9905A]"
                : "w-[3px] h-[3px] bg-[#F5F0E6]/30 hover:bg-[#C9905A]/50"
            }`}
          />
        ))}
      </div>

      {/* Featured style — bottom left */}
      <div className="absolute bottom-8 left-8 z-20 hidden lg:block">
        <div className="bg-[#1C1917]/80 backdrop-blur-md border border-[#C9905A]/20 rounded-xl px-5 py-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9905A] mb-1">
            Featured Style
          </p>
          <p className="font-sans text-lg text-[#F5F0E6] leading-tight font-medium">
            {SLIDES[selectedIndex].name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm text-[#F5F0E6] font-semibold">
              {SLIDES[selectedIndex].price}
            </span>
            {SLIDES[selectedIndex].original && (
              <span className="font-mono text-xs text-[#F5F0E6]/40 line-through">
                {SLIDES[selectedIndex].original}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CTA — bottom right */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:flex flex-col gap-2 items-end">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-3 h-11 bg-[#C9905A] text-[#F5F0E6] pl-6 pr-4 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#B8824A] active:scale-[0.98] transition-all duration-300"
        >
          Shop Collection
          <span className="inline-flex size-7 items-center justify-center bg-[#F5F0E6]/15 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="size-3" />
          </span>
        </Link>
        <p className="text-[10px] text-[#C9905A]/60 tracking-wide">
          {SLIDES.length} styles featured
        </p>
      </div>
    </div>
  );
}
