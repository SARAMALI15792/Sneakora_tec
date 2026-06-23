import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

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
  code: z.string().min(1).transform((v) => v.toUpperCase()),
  discount: z.coerce.number().positive(),
  type: z.enum(["percentage", "flat"]),
  maxUses: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = couponSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const coupon = await prisma.coupon.create({
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt
        ? new Date(parsed.data.expiresAt)
        : null,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(coupons);
}
