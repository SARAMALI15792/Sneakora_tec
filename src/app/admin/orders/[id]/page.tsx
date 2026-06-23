import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/db";
import { OrderDetail } from "@/components/admin/OrderDetail";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { name: true, images: true, price: true } } },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Order #{order.id.slice(0, 8)}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Order details and management
        </p>
      </div>
      <OrderDetail
        order={{
          id: order.id,
          total: Number(order.total),
          status: order.status,
          createdAt: order.createdAt.toISOString(),
          cancelledAt: order.cancelledAt?.toISOString() ?? null,
          cancelReason: order.cancelReason,
          user: { name: order.user.name ?? "", email: order.user.email },
          items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: Number(item.price),
            product: {
              name: item.product.name,
              price: Number(item.product.price),
              images: item.product.images,
            },
          })),
        }}
      />
    </div>
  );
}
