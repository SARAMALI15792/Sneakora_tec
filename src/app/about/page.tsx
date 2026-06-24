import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Truck, RefreshCw, HeadphonesIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Sneakora",
  description: "Premium sneakers for every step. Streetwear culture meets performance.",
};

const values = [
  { icon: Shield, title: "Authenticity Guaranteed", description: "Every pair is verified authentic. We source directly from brands and authorized distributors." },
  { icon: Truck, title: "Fast & Free Shipping", description: "Free shipping on all orders over $100. Most orders arrive within 3-5 business days." },
  { icon: RefreshCw, title: "30-Day Returns", description: "Not the right fit? Return any unworn sneakers within 30 days for a full refund." },
  { icon: HeadphonesIcon, title: "Premium Support", description: "Our sneaker experts are available 24/7 to help you find the perfect pair." },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-foreground/5" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium mb-4">
            About Sneakora
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            More Than Just
            <span className="block text-accent">Sneakers</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We&apos;re on a mission to bring the world&apos;s most premium sneakers to your doorstep.
            Curated collections, authenticated pairs, and a community that lives and breathes sneaker culture.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
              Our Story
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Born from a passion for sneaker culture.
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Sneakora started in 2020 when our founders realized finding authentic, premium sneakers online
                was harder than it should be. Too many fakes, too little curation, and a shopping experience
                that didn&apos;t match the excitement of sneaker culture.
              </p>
              <p>
                Today, we partner with top brands and independent designers to bring you collections that
                push boundaries. From court to street, from retro classics to futuristic silhouettes —
                every pair tells a story.
              </p>
              <p>
                We&apos;re building more than a store. We&apos;re building a community of collectors, athletes,
                artists, and everyone who believes the right pair of sneakers can change everything.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-accent/20 via-accent/5 to-foreground/10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl font-bold tracking-tight text-accent">2020</div>
                <div className="mt-2 text-sm text-muted-foreground">Founded in NYC</div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-xs text-muted-foreground">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-xs text-muted-foreground">Products</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-xs text-muted-foreground">Brands</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">4.9</div>
                    <div className="text-xs text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-24 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
              Why Sneakora
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Built different. On purpose.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="p-6 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow">
                <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <value.icon className="size-5 text-accent" />
                </div>
                <h3 className="font-semibold text-sm">{value.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to find your perfect pair?</h2>
          <p className="mt-4 text-muted-foreground">Explore our curated collections and join thousands of satisfied customers.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 mt-8 h-12 px-8 rounded-full bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Shop Now
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}