import { type NextRequest, NextResponse } from "next/server";
import { auth, getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

type Params = Promise<{ id: string }>;

const updateSchema = z.object({
  code: z.string().min(1).toUpperCase().optional(),
  discount: z.coerce.number().positive().optional(),
  type: z.enum(["percentage", "flat"]).optional(),
  maxUses: z.coerce.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
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
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...coupon,
    discount: Number(coupon.discount),
    expiresAt: coupon.expiresAt?.toISOString() || null,
  });
}

export async function PUT(
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
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.expiresAt !== undefined) {
    data.expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;
  }

  const coupon = await prisma.coupon.update({ where: { id }, data });

  return NextResponse.json({
    ...coupon,
    discount: Number(coupon.discount),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const session = await getSession(_request.headers);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}