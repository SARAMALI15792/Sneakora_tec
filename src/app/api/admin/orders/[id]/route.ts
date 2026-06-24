import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

type Params = Promise<{ id: string }>;

const updateSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const session = await auth.api.getSession({ headers: _request.headers });
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
  const session = await auth.api.getSession({ headers: request.headers });
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
    data.cancelReason = "Cancelled by admin";
  }

  const order = await prisma.order.update({ where: { id }, data });

  return NextResponse.json({
    ...order,
    total: Number(order.total),
  });
}