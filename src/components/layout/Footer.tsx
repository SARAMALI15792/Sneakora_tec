import Link from "next/link";

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
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="font-heading text-xl font-bold tracking-wide">
              Sneakora
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium sneakers for every step. Heritage craft meets modern performance.
            </p>
            <p className="pt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
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
