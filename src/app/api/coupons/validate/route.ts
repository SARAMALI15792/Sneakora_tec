import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";

const validateSchema = z.object({
  code: z.string().min(1).toUpperCase(),
  cartTotal: z.coerce.number().positive(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = validateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", valid: false },
      { status: 400 }
    );
  }

  const { code, cartTotal } = parsed.data;

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) {
    return NextResponse.json(
      { error: "Coupon not found", valid: false },
      { status: 404 }
    );
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json(
      { error: "Coupon has expired", valid: false },
      { status: 400 }
    );
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json(
      { error: "Coupon has reached its maximum usage", valid: false },
      { status: 400 }
    );
  }

  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = (cartTotal * Number(coupon.discount)) / 100;
  } else {
    discountAmount = Number(coupon.discount);
  }

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return NextResponse.json({
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      discount: Number(coupon.discount),
    },
    discountAmount,
    finalTotal,
  });
}