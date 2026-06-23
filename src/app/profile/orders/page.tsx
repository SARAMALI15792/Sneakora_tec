import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Package, ChevronRight } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
  confirmed: "text-blue-500 border-blue-500/30 bg-blue-500/10",
  shipped: "text-accent border-accent/30 bg-accent/10",
  delivered: "text-green-500 border-green-500/30 bg-green-500/10",
  cancelled: "text-destructive border-destructive/30 bg-destructive/10",
};

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center pt-20">
        <p className="text-sm text-muted-foreground">Please sign in.</p>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: { select: { name: true, images: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/profile"
          className="mb-8 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronRight className="size-3 rotate-180" />
          Back to Profile
        </Link>

        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Account
        </p>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight">
          Order History
        </h1>

        {orders.length === 0 ? (
          <div className="mt-16 text-center">
            <Package className="mx-auto size-12 text-muted-foreground/50" />
            <h2 className="font-heading mt-4 text-xl font-bold">No orders yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Place your first order to see it here.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex h-11 items-center px-6 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/profile/orders/${order.id}`}
                className="block rounded-xl border border-border transition-all duration-300 hover:border-accent/30 hover:shadow-sm"
              >
                <div className="flex items-center gap-5 px-5 py-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="size-12 overflow-hidden rounded-lg border-2 border-background bg-muted"
                      >
                        {item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-lg opacity-10">👟</div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex size-12 items-center justify-center rounded-lg border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} &middot;{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold">${Number(order.total).toFixed(2)}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-[9px] uppercase tracking-widest font-semibold border ${
                        statusStyles[order.status] || "text-muted-foreground border-border bg-muted"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
