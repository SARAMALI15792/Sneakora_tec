import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ArrowLeft, Package } from "lucide-react";

type Params = Promise<{ id: string }>;

const statusStyles: Record<string, string> = {
  pending: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
  confirmed: "text-blue-500 border-blue-500/30 bg-blue-500/10",
  shipped: "text-accent border-accent/30 bg-accent/10",
  delivered: "text-green-500 border-green-500/30 bg-green-500/10",
  cancelled: "text-destructive border-destructive/30 bg-destructive/10",
};

export default async function OrderDetailPage({ params }: { params: Params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id } = await params;

  if (!session) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center pt-20">
        <p className="text-sm text-muted-foreground">Please sign in.</p>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { name: true, images: true, slug: true } },
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const total = Number(order.total);

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/profile/orders"
          className="mb-8 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          All Orders
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Order Details
            </p>
            <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight">
              #{order.id.slice(0, 8)}
            </h1>
          </div>
          <span
            className={`px-3 py-1 text-[9px] uppercase tracking-widest font-semibold border ${
              statusStyles[order.status] || "text-muted-foreground border-border bg-muted"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <div className="mt-10 divide-y divide-border rounded-xl border border-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <Link
                href={`/shop/${item.product.slug || item.productId}`}
                className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
              >
                {item.product.images[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl opacity-10">
                    👟
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.product.slug || item.productId}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold shrink-0">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/profile/orders"
            className="inline-flex h-11 items-center px-5 text-xs font-semibold uppercase tracking-widest border border-border hover:bg-muted transition-all"
          >
            Back to Orders
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-11 items-center px-5 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
