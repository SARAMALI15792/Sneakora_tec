"use client";

import Link from "next/link";
import { Truck, RefreshCw, Shield, Sparkles, Repeat, Star, Gem, Award } from "lucide-react";

const ICON_MAP: Record<string, typeof Star> = {
  truck: Truck,
  rotate: RefreshCw,
  shield: Shield,
  sparkle: Sparkles,
  arrow: Repeat,
  star: Star,
  gem: Gem,
  award: Award,
};

const ITEMS = [
  { text: "Free Shipping over $100", icon: "truck" },
  { text: "30-Day Hassle-Free Returns", icon: "rotate" },
  { text: "100% Authentic Guarantee", icon: "shield" },
  { text: "New Spring 2026 Collection", icon: "sparkle" },
  { text: "Size Exchange within 14 Days", icon: "arrow" },
  { text: "Sneakora Insider — Join Free", icon: "star" },
  { text: "Limited Drops Every Friday", icon: "gem" },
  { text: "Premium Heritage Leather", icon: "award" },
];

export function Marquee() {
  const items = [...ITEMS, ...ITEMS];

  return (
    <div className="relative z-10 overflow-hidden border-t border-b border-[#2A2520]/50 bg-[#161311] py-2.5">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-[#161311] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-[#161311] to-transparent" />

{/* Scrolling ticker */}
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, i) => {
          const Icon = ICON_MAP[item.icon] || Star;
          return (
          <Link
            key={i}
            href="/shop"
            className="inline-flex shrink-0 items-center gap-2 px-8 text-[10px] uppercase tracking-[0.18em] text-[#7A6A57] hover:text-[#C9905A] transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <Icon className="size-3" strokeWidth={1.5} />
            {item.text}
            <span className="ml-4 text-[#C9905A]/20 select-none">|</span>
          </Link>
          );
        })}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marqueeScroll 45s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}