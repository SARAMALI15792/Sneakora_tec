import Link from "next/link";
import { ArrowRight, Shield, RefreshCw, Undo2, Award } from "lucide-react";
import { HeroCarousel } from "@/components/hero/HeroCarousel";
import { Marquee } from "@/components/hero/Marquee";
import { FeaturedSection } from "@/components/product/FeaturedSection";

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <HeroCarousel />
        </div>

        {/* Left editorial typography */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 pl-6 md:pl-12 hidden lg:block">
          <div className="[writing-mode:vertical-rl] transform rotate-180">
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#8A7A67] mb-4">
              Sneakora — Est. 2026
            </p>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#8A7A67]">
              Heritage Collection
            </p>
          </div>
          {/* Vertical line */}
          <div className="absolute left-[4.5rem] top-0 bottom-0 w-px bg-[#C9905A]/20" />
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1C1917] to-transparent z-20" />
      </section>

      {/* ── MARQUEE TICKER ───────────────────────────────────── */}
      <Marquee />

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <FeaturedSection />

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#F5F0E6]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#8A7A67] font-medium">
                Collections
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[#1C1917] lg:text-5xl">
                Shop by Style
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#8A7A67] hover:text-[#1C1917] transition-colors duration-200 border-b border-transparent hover:border-[#1C1917] pb-0.5"
            >
              View All <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid gap-px bg-[#2A2520]/20 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Running", sub: "Performance", href: "/shop?category=running", img: "photo-1579338559194-a162d19bf842", color: "#C9905A" },
              { name: "Basketball", sub: "Court Ready", href: "/shop?category=basketball", img: "photo-1542291026-7eec264c27ff", color: "#8A7A67" },
              { name: "Casual", sub: "Everyday Wear", href: "/shop?category=casual", img: "photo-1600269452121-4f2416e55c28", color: "#C9905A" },
              { name: "Lifestyle", sub: "Street Culture", href: "/shop?category=lifestyle", img: "photo-1595950653106-6c9ebd614d3a", color: "#8A7A67" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative h-56 overflow-hidden"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/${cat.img}?w=600&q=80&auto=format)`,
                    filter: "sepia(40%) saturate(80%)",
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#1C1917]/50 group-hover:bg-[#1C1917]/40 transition-colors duration-300" />
                {/* Vintage corner accent */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#C9905A]/50" />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9905A]/80 transition-colors group-hover:text-[#C9905A]">
                    {cat.sub}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#F5F0E6] mt-1 tracking-tight">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL SPLIT ─────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#1C1917]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Image with vintage treatment */}
            <div className="relative overflow-hidden aspect-[3/4] lg:aspect-auto">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80&auto=format)`,
                  filter: "sepia(30%) saturate(90%)",
                }}
              />
              {/* Vintage overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/60 to-transparent" />
              {/* Photo corner marks */}
              <div className="absolute top-6 left-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9905A]/60">
                  Vol. 1 — 2026
                </span>
              </div>
              <div className="absolute bottom-6 right-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9905A]/60">
                  Heritage Series
                </span>
              </div>
            </div>

            {/* Right: Text */}
            <div className="flex flex-col justify-center p-10 lg:p-16 bg-[#F5F0E6]">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#8A7A67] mb-3">
                Our Story
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1C1917] leading-tight">
                Crafted for Those Who Know the Difference
              </h2>
              <div className="mt-2 w-16 h-0.5 bg-[#C9905A]" />
              <p className="mt-8 text-sm leading-relaxed text-[#1C1917]/70 max-w-md">
                Every pair in our collection tells a story. We obsess over the details — the curve of the midsole, the feel of the upper, the history stitched into each design. This isn't just footwear. It's a statement of who you are.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#1C1917]/70 max-w-md">
                From vintage-inspired silhouettes to cutting-edge performance tech, Sneakora bridges the gap between heritage craftsmanship and modern innovation. Walk a mile in a pair — you'll understand.
              </p>
              <div className="mt-10 flex gap-4">
                <Link
                  href="/about"
                  className="group inline-flex h-11 items-center gap-3 bg-[#1C1917] text-[#F5F0E6] pl-6 pr-4 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#2A2520] active:scale-[0.98] transition-all duration-300"
                >
                  Our Story
                  <span className="inline-flex size-7 items-center justify-center bg-[#F5F0E6]/10 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="size-3" />
                  </span>
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center border border-[#1C1917]/20 px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1C1917] hover:border-[#1C1917]/50 transition-all duration-300"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#F5F0E6] border-t border-[#2A2520]/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#8A7A67] font-medium">
              The Sneakora Standard
            </p>
            <h2 className="font-serif mt-3 text-4xl font-bold text-[#1C1917] lg:text-5xl">
              Why We Stand Apart
            </h2>
          </div>

          <div className="grid gap-px bg-[#2A2520]/20 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "Authenticity First",
                body: "Every pair is verified. If it doesn't pass our 12-point inspection, it doesn't ship. No exceptions.",
              },
              {
                icon: RefreshCw,
                title: "Free Exchanges",
                body: "Wrong size? Wrong color? We'll swap it at no cost within 14 days of delivery.",
              },
              {
                icon: Undo2,
                title: "30-Day Returns",
                body: "Not the right fit? Send it back — no forms, no questions, no restocking fees.",
              },
              {
                icon: Award,
                title: "Heritage Craft",
                body: "We partner with the same factories that serve the world's top athletic brands. Quality isn't a promise — it's a process.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
              <div
                key={f.title}
                className="bg-[#F5F0E6] p-8 hover:bg-[#EDE8DF] transition-colors duration-300 group"
              >
                <div className="size-10 mb-5 flex items-center justify-center text-[#C9905A] group-hover:scale-110 transition-transform duration-300">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1C1917]/60">{f.body}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#1C1917] overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden bg-[#F5F0E6] px-10 py-20 sm:px-16 lg:px-24">
            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "96px 96px",
              }}
            />

            {/* Large decorative "S" */}
            <span
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 font-serif text-[8rem] md:text-[12rem] font-bold text-[#C9905A]/[0.06] select-none pointer-events-none leading-none"
            >
              S
            </span>

            <div className="relative max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#8A7A67]">
                Ready to Step Up?
              </p>
              <h2 className="font-serif mt-4 text-4xl font-bold text-[#1C1917] lg:text-5xl leading-tight">
                Your Next Favorite Pair<br />Is Waiting
              </h2>
              <p className="mt-4 text-sm text-[#1C1917]/60 max-w-sm">
                Browse our full collection. New drops every week, curated for those who don't settle.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="group inline-flex h-11 items-center gap-3 bg-[#1C1917] text-[#F5F0E6] pl-6 pr-4 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#2A2520] active:scale-[0.98] transition-all duration-300"
                >
                  Shop Now
                  <span className="inline-flex size-7 items-center justify-center bg-[#F5F0E6]/10 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="size-3" />
                  </span>
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex h-11 items-center border border-[#1C1917]/20 px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1C1917] hover:border-[#1C1917]/50 transition-all duration-300"
                >
                  Read the Journal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}