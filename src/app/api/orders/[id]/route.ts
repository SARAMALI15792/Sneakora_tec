import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, images: true, slug: true, price: true },
          },
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  });
}

const cancelSchema = z.object({
  reason: z.string().min(1, "Cancellation reason is required").max(500),
});

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "shipped" || order.status === "delivered") {
    return NextResponse.json(
      { error: "Cannot cancel an order that has already been shipped or delivered" },
      { status: 400 }
    );
  }

  if (order.status === "cancelled") {
    return NextResponse.json(
      { error: "Order has already been cancelled" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Cancellation reason is required", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: "cancelled",
      cancelledAt: new Date(),
      cancelReason: parsed.data.reason,
    },
  });

  return NextResponse.json({
    ...updated,
    total: Number(updated.total),
  });
}
