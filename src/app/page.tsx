import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero3D } from "@/components/hero/Hero3D";

const categories = [
  { name: "Men", sub: "New arrivals", href: "/shop?category=men" },
  { name: "Women", sub: "Latest drops", href: "/shop?category=women" },
  { name: "Running", sub: "Performance", href: "/shop?category=running" },
  { name: "Basketball", sub: "Court ready", href: "/shop?category=basketball" },
  { name: "Casual", sub: "Everyday wear", href: "/shop?category=casual" },
  { name: "Training", sub: "Built to move", href: "/shop?category=training" },
  { name: "Kids", sub: "Little legends", href: "/shop?category=kids" },
  { name: "Lifestyle", sub: "Street culture", href: "/shop?category=lifestyle" },
];

const features = [
  { label: "01", title: "Free Shipping", body: "On all orders over $100. Delivered in 3–5 days." },
  { label: "02", title: "Authenticity Guaranteed", body: "Every pair verified. Money-back promise." },
  { label: "03", title: "Easy Returns", body: "30-day hassle-free returns, no questions asked." },
  { label: "04", title: "Size Exchange", body: "Wrong fit? Free exchange within 14 days." },
];

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] flex flex-col">
        {/* Content sits below fixed navbar (h-16) */}
        <div className="flex-1 mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-2 gap-0 px-6 pt-32 pb-12 lg:pt-28 lg:pb-8">

          {/* ── Left: typography ─────────────────────────────── */}
          <div className="flex flex-col justify-center py-16 lg:py-0 lg:pr-12 order-2 lg:order-1">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
              New Collection — 2026
            </p>

            <h1 className="font-heading mt-5 text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-tight">
              Step Into
              <br />
              <em className="not-italic text-accent">The Future</em>
            </h1>

            <p className="mt-7 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Premium footwear engineered for the uncompromising.
              Heritage craft meets modern performance.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex h-11 items-center gap-3 bg-foreground pl-6 pr-4 text-xs font-semibold uppercase tracking-widest text-background transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
              >
                Shop Now
                <span className="inline-flex size-7 items-center justify-center bg-background/10 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-3" />
                </span>
              </Link>
              <Link
                href="/shop?category=running"
                className="inline-flex h-11 items-center border border-border px-6 text-xs font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-muted active:scale-[0.98]"
              >
                Explore
              </Link>
            </div>

            {/* Stats strip */}
            <div className="mt-14 flex gap-10 border-t border-border/50 pt-8">
              {[["10k+", "Happy customers"], ["200+", "Styles in stock"], ["100%", "Authentic pairs"]].map(
                ([stat, desc]) => (
                  <div key={stat}>
                    <p className="font-heading text-2xl font-bold">{stat}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{desc}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ── Right: canvas ────────────────────────────────── */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            {/* Outer bezel */}
            <div className="relative w-full h-[40vw] max-h-[360px] min-h-[200px] lg:h-[440px] overflow-hidden">
              <Hero3D />
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Categories</p>
              <h2 className="font-heading mt-3 text-4xl font-bold tracking-tight lg:text-5xl">
                Shop by Sport
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              View All <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex h-48 flex-col justify-end bg-background p-6 transition-colors duration-300 hover:bg-muted"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-300 group-hover:text-accent">
                  {cat.sub}
                </p>
                <h3 className="font-heading mt-1.5 text-2xl font-bold tracking-tight">
                  {cat.name}
                </h3>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Browse →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              The Sneakora Standard
            </p>
            <h2 className="font-heading mt-3 text-4xl font-bold tracking-tight lg:text-5xl">
              Built Different
            </h2>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="group bg-background p-8 transition-colors duration-300 hover:bg-muted"
              >
                <p className="font-heading text-5xl font-bold text-border transition-colors duration-300 group-hover:text-accent/30">
                  {f.label}
                </p>
                <h3 className="font-heading mt-6 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden bg-foreground px-10 py-20 sm:px-16 lg:px-24">
            {/* Background texture number */}
            <p
              className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 font-heading text-[12rem] font-bold leading-none text-background/5 select-none hidden lg:block"
              aria-hidden
            >
              S
            </p>

            <div className="relative max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.4em] text-background/50">
                Join the Movement
              </p>
              <h2 className="font-heading mt-4 text-4xl font-bold tracking-tight text-background lg:text-5xl">
                Ready to Level Up?
              </h2>
              <p className="mt-4 text-sm text-background/60">
                Join thousands who shop smarter with Sneakora.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="group inline-flex h-11 items-center gap-3 bg-background pl-6 pr-4 text-xs font-semibold uppercase tracking-widest text-foreground transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                >
                  Shop Now
                  <span className="inline-flex size-7 items-center justify-center bg-foreground/10 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="size-3" />
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-11 items-center border border-background/20 px-6 text-xs font-semibold uppercase tracking-widest text-background transition-all duration-300 hover:bg-background/10 active:scale-[0.98]"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
