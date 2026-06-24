"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

const footerLinks = {
  Shop: [
    { href: "/shop?category=men", label: "Men" },
    { href: "/shop?category=women", label: "Women" },
    { href: "/shop?category=running", label: "Running" },
    { href: "/shop?category=casual", label: "Casual" },
  ],
  Support: [
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Journal" },
  ],
  Connect: [
    { href: "https://instagram.com", label: "Instagram" },
    { href: "https://twitter.com", label: "Twitter" },
    { href: "https://tiktok.com", label: "TikTok" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 409) {
          toast.error("You're already subscribed!");
        } else {
          throw new Error(data.error);
        }
      } else {
        setSubscribed(true);
        toast.success("Subscribed!", { description: "Welcome to the Sneakora community." });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + Newsletter */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Link href="/" className="font-heading text-xl font-bold tracking-wide">
                Sneakora
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Premium sneakers for every step. Heritage craft meets modern performance.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">
                Newsletter
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <Check className="size-4" />
                  Subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-10 px-3 text-xs bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-10 px-4 rounded-lg bg-foreground text-background text-[10px] font-semibold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center"
                  >
                    {loading ? <Loader2 className="size-3 animate-spin" /> : "Join"}
                  </button>
                </form>
              )}
              <p className="text-[10px] text-muted-foreground/60">
                Get 10% off your first order. No spam, just drops.
              </p>
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Est. 2024
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            © {new Date().getFullYear()} Sneakora. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Designed in-house
          </p>
        </div>
      </div>
    </footer>
  );
}