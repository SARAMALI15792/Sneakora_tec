import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import Stripe from "stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  couponCode: z.string().optional(),
});

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_placeholder") return null;
  return new Stripe(key);
}

function calculateDiscount(coupon: { type: string; discount: number }, subtotal: number): number {
  if (coupon.type === "percentage") {
    return (subtotal * coupon.discount) / 100;
  }
  return Math.min(coupon.discount, subtotal);
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = checkoutSchema.safeParse(body);
    const couponCode = parsed.success ? parsed.data.couponCode : undefined;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    let total = subtotal;
    let appliedCouponId: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (!coupon) {
        return NextResponse.json({ error: "Coupon not found" }, { status: 400 });
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }

      const discount = calculateDiscount({ type: coupon.type, discount: Number(coupon.discount) }, subtotal);
      total = Math.max(0, subtotal - discount);
      appliedCouponId = coupon.id;

      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    console.log(`[Checkout] Creating order for user ${session.user.id}, cart has ${cartItems.length} items`);
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "pending",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });
    console.log(`[Checkout] Order ${order.id} created for user ${session.user.id}, status: ${order.status}`);

    const stripe = getStripe();

    if (stripe) {
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images: item.product.images.length > 0 ? [item.product.images[0]] : undefined,
          },
          unit_amount: Math.round(Number(item.product.price) * 100),
        },
        quantity: item.quantity,
      }));

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        ui_mode: "embedded_page",
        line_items: lineItems,
        customer_email: session.user.email,
        metadata: { orderId: order.id, couponId: appliedCouponId || "" },
        return_url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        ...(total < subtotal ? { discounts: [{ coupon: appliedCouponId || undefined }].filter(Boolean) } : {}),
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: checkoutSession.id },
      });

      return NextResponse.json({
        clientSecret: checkoutSession.client_secret,
        sessionId: checkoutSession.id,
        subtotal,
        total,
        couponApplied: !!appliedCouponId,
      });
    }

    // Dev mode: confirm order directly without payment
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "confirmed" },
    });

    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/order/success?order_id=${order.id}`,
      sessionId: null,
      devMode: true,
      subtotal,
      total,
      couponApplied: !!appliedCouponId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
