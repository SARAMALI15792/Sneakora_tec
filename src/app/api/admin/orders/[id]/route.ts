import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

type Params = Promise<{ id: string }>;

async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: new Headers({
      cookie: "",
    }),
  });
  if (!session || session.user.role !== "admin") return false;
  return true;
}

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

export async function PATCH(
  request: NextRequest,
  segmentData: { params: Params }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await segmentData.params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "cancelled" || order.status === "delivered") {
    return NextResponse.json(
      { error: "Cannot change status of a cancelled or delivered order" },
      { status: 400 }
    );
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: parsed.data.status,
      ...(parsed.data.status === "cancelled"
        ? { cancelledAt: new Date(), cancelReason: "Admin cancelled" }
        : {}),
    },
  });

  return NextResponse.json(updated);
}
