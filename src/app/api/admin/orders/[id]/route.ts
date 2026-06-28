import { type NextRequest, NextResponse } from "next/server";
import { auth, getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import OrderShippedEmail from "@/emails/OrderShippedEmail";
import OrderDeliveredEmail from "@/emails/OrderDeliveredEmail";
import OrderCancelledEmail from "@/emails/OrderCancelledEmail";
import { z } from "zod";

type Params = Promise<{ id: string }>;

const updateSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  cancelReason: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const session = await getSession(_request.headers);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, image: true } },
      items: {
        include: {
          product: { select: { name: true, images: true, slug: true, price: true } },
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...order,
    total: Number(order.total),
    cancelledAt: order.cancelledAt?.toISOString() || null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      product: { ...item.product, price: Number(item.product.price) },
    })),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const session = await getSession(request.headers);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const data: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.status === "cancelled") {
    data.cancelledAt = new Date();
    data.cancelReason = parsed.data.cancelReason || "Cancelled by admin";
  }

  const order = await prisma.order.update({ where: { id }, data });

  const orderWithUser = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  if (orderWithUser?.user) {
    if (parsed.data.status === "shipped") {
      const trackingNumber = parsed.data.trackingNumber || `SNK-${id.slice(0, 8)}`;
      const carrier = parsed.data.carrier || "Standard";
      const estimated = new Date();
      estimated.setDate(estimated.getDate() + 5);

      await sendEmail({
        to: orderWithUser.user.email,
        subject: `Your Order Has Shipped! - #${id} - Sneakora`,
        react: OrderShippedEmail({
          orderId: id,
          customerName: orderWithUser.user.name || "Customer",
          trackingNumber,
          carrier,
          trackingUrl: `https://sneakora.com/profile/orders/${id}`,
          estimatedDelivery: estimated.toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          }),
        }),
      });
    }

    if (parsed.data.status === "delivered") {
      await sendEmail({
        to: orderWithUser.user.email,
        subject: `Your Order Has Been Delivered! - #${id} - Sneakora`,
        react: OrderDeliveredEmail({
          orderId: id,
          customerName: orderWithUser.user.name || "Customer",
          deliveredDate: new Date().toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          }),
        }),
      });
    }

    if (parsed.data.status === "cancelled") {
      const refundDate = new Date();
      refundDate.setDate(refundDate.getDate() + 7);

      await sendEmail({
        to: orderWithUser.user.email,
        subject: `Order Cancelled - #${id} - Sneakora`,
        react: OrderCancelledEmail({
          orderId: id,
          customerName: orderWithUser.user.name || "Customer",
          refundAmount: Number(orderWithUser.total),
          refundDate: refundDate.toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          }),
          reason: parsed.data.cancelReason || "Cancelled by admin",
        }),
      });
    }
  }

  return NextResponse.json({
    ...order,
    total: Number(order.total),
  });
}