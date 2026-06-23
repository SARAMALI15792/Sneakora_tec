import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { OrderDetailClient } from "@/components/order/OrderDetailClient";

type Params = Promise<{ id: string }>;

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

  return (
    <OrderDetailClient
      order={{
        ...order,
        total: Number(order.total),
        createdAt: order.createdAt.toISOString(),
        cancelledAt: order.cancelledAt?.toISOString() ?? null,
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          product: {
            ...item.product,
            slug: item.product.slug,
          },
        })),
      }}
    />
  );
}
