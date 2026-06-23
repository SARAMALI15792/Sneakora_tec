"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, LogOut, Package, Heart } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=running", label: "Running" },
];

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!session?.user) { setCartCount(0); return; }
    function refetch() {
      fetch("/api/cart")
        .then((r) => r.json())
        .then((d) => setCartCount(d.items?.length || 0))
        .catch(() => {});
    }
    refetch();
    window.addEventListener("cart-updated", refetch);
    return () => window.removeEventListener("cart-updated", refetch);
  }, [session]);

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    });
  }

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-7 w-7 items-center justify-center bg-foreground text-background text-xs font-bold">
              S
            </span>
            <span className="font-heading text-base font-bold tracking-wide">
              Sneakora
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex outline-none">
                  <Avatar className="size-8 cursor-pointer">
                    <AvatarFallback className="bg-muted text-xs font-medium">
                      {session.user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="text-sm font-medium">{session.user.name}</div>
                      <div className="text-xs text-muted-foreground">{session.user.email}</div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    <Package className="size-4" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                    <LogOut className="size-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/sign-in"
                className="hidden md:inline-flex h-8 items-center px-3 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/cart"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative"
            >
              <ShoppingCart className="size-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Open menu"
            >
              <Menu className="size-[18px]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/98 backdrop-blur-2xl flex flex-col px-6 py-6"
          style={{ transition: "opacity 300ms" }}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-heading text-base font-bold tracking-wide"
              onClick={() => setMobileOpen(false)}
            >
              Sneakora
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="mt-16 flex flex-col gap-1">
            {[
              ...navLinks,
              ...(session?.user
                ? [
                    { href: "/profile", label: "Profile" },
                    { href: "/orders", label: "Orders" },
                  ]
                : [{ href: "/sign-in", label: "Sign In" }]),
            ].map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-heading text-4xl font-bold py-3 border-b border-border/40 hover:text-accent transition-colors duration-200"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {link.label}
              </Link>
            ))}
            {session?.user && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-2 font-heading text-4xl font-bold py-3 text-destructive text-left hover:text-accent transition-colors duration-200"
              >
                Sign Out
              </button>
            )}
          </nav>

          <div className="mt-auto text-xs text-muted-foreground tracking-widest uppercase">
            Premium Footwear Since 2024
          </div>
        </div>
      )}
    </>
  );
}
