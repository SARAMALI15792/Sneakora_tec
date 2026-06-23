import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Package, Heart, Settings, ChevronRight } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center pt-20">
        <p className="text-sm text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }

  const [orderCount, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.wishlistItem.count({ where: { userId: session.user.id } }),
  ]);

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const memberSince = new Date(session.user.createdAt);
  const joinedDate = memberSince.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Account
        </p>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight">
          Profile
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted text-lg font-bold">
                {initials}
              </div>
              <div>
                <p className="font-heading text-lg font-bold">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Member since {joinedDate}
            </p>

            <nav className="space-y-1">
              <Link
                href="/profile"
                className="flex items-center justify-between rounded-lg bg-accent/10 px-4 py-3 text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Settings className="size-4" />
                  Profile
                </span>
                <ChevronRight className="size-3 text-muted-foreground" />
              </Link>
              <Link
                href="/profile/orders"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-3">
                  <Package className="size-4" />
                  Orders
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-xs">{orderCount}</span>
                  <ChevronRight className="size-3" />
                </span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-3">
                  <Heart className="size-4" />
                  Wishlist
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-xs">{wishlistCount}</span>
                  <ChevronRight className="size-3" />
                </span>
              </Link>
            </nav>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                Account Details
              </p>
              <div className="mt-4 divide-y divide-border rounded-xl border border-border">
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-xs text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{session.user.name}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{session.user.email}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-xs text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium">{joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href="/profile/orders"
                className="inline-flex h-11 items-center gap-2 px-5 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all"
              >
                <Package className="size-4" />
                View Orders
              </Link>
              <Link
                href="/wishlist"
                className="inline-flex h-11 items-center gap-2 px-5 text-xs font-semibold uppercase tracking-widest border border-border hover:bg-muted transition-all"
              >
                <Heart className="size-4" />
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
