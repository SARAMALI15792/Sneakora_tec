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

const couponSchema = z.object({
  code: z.string().min(1).transform((v) => v.toUpperCase()).optional(),
  discount: z.coerce.number().positive().optional(),
  type: z.enum(["percentage", "flat"]).optional(),
  maxUses: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export async function PUT(
  request: NextRequest,
  segmentData: { params: Params }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await segmentData.params;
  const body = await request.json();
  const parsed = couponSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  const data = { ...parsed.data };
  if (data.expiresAt !== undefined) {
    (data as Record<string, unknown>).expiresAt = data.expiresAt
      ? new Date(data.expiresAt)
      : null;
  }

  const coupon = await prisma.coupon.update({
    where: { id },
    data,
  });

  return NextResponse.json(coupon);
}

export async function DELETE(
  _request: NextRequest,
  segmentData: { params: Params }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await segmentData.params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
