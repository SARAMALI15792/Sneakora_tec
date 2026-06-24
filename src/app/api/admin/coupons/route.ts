import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  code: z.string().min(1).toUpperCase(),
  discount: z.coerce.number().positive(),
  type: z.enum(["percentage", "flat"]),
  maxUses: z.coerce.number().int().positive().optional(),
  expiresAt: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = coupons.map((c) => ({
    ...c,
    discount: Number(c.discount),
    expiresAt: c.expiresAt?.toISOString() || null,
    createdAt: c.createdAt.toISOString(),
  }));

  return NextResponse.json({ coupons: serialized });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.coupon.findUnique({
    where: { code: parsed.data.code },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A coupon with this code already exists" },
      { status: 409 }
    );
  }

  const coupon = await prisma.coupon.create({
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  return NextResponse.json(
    { ...coupon, discount: Number(coupon.discount) },
    { status: 201 }
  );
}