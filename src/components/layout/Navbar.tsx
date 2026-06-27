"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, User, LogOut, Package, Heart } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 100,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 20,
    },
  },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 100,
    },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.3,
    },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      type: "spring" as const,
      damping: 15,
      stiffness: 100,
    },
  }),
};

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
    if (!session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- conditional guard pattern
      setCartCount(0);
      return;
    }
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
    document.cookie = "sneakora_recently_viewed=; path=/; max-age=0";
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    });
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        style={{ viewTransitionName: "site-header" }}
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Logo size="sm" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); window.location.assign(link.href); }}
                className="nav-link text-sm tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-4"
          >
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex outline-none">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Avatar className="size-8 cursor-pointer">
                      <AvatarFallback className="bg-muted text-xs font-medium">
                        {session.user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
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
                  <DropdownMenuItem onClick={() => router.push("/profile/orders")}>
                    <Package className="size-4" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                    <Heart className="size-4" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                    <LogOut className="size-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/sign-in"
                  className="hidden md:inline-flex h-8 items-center px-3 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all"
                >
                  Sign In
                </Link>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/cart"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative"
              >
                <ShoppingCart className="size-[18px]" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-accent-foreground"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Open menu"
            >
              <Menu className="size-[18px]" />
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-background/98 backdrop-blur-2xl flex flex-col px-6 py-6"
          >
            <div className="flex items-center justify-between">
              <motion.div variants={itemVariants}>
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                >
                  <Logo size="sm" />
                </Link>
              </motion.div>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </motion.button>
            </div>

            <motion.nav
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-16 flex flex-col gap-1"
            >
              {[
                ...navLinks,
                ...(session?.user
                  ? [
                      { href: "/profile", label: "Profile" },
                      { href: "/profile/orders", label: "Orders" },
                      { href: "/wishlist", label: "Wishlist" },
                    ]
                  : [{ href: "/sign-in", label: "Sign In" }]),
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  variants={mobileLinkVariants}
                  custom={i}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading text-4xl font-bold py-3 border-b border-border/40 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {session?.user && (
                <motion.div variants={mobileLinkVariants} custom={navLinks.length + 3}>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 font-heading text-4xl font-bold py-3 text-destructive text-left hover:text-accent transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </motion.nav>

            <motion.div
              variants={itemVariants}
              className="mt-auto text-xs text-muted-foreground tracking-widest uppercase"
            >
              Premium Footwear Since 2024
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
