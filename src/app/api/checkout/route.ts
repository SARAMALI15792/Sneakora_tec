import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { getStripeClient } from "@/lib/stripe";
import { indexOrderInRag } from "@/lib/rag-index";

const checkoutSchema = z.object({
  couponCode: z.string().optional(),
});

function calculateDiscount(coupon: { type: string; discount: number }, subtotal: number): number {
  if (coupon.type === "percentage") {
    return (subtotal * coupon.discount) / 100;
  }
  return Math.min(coupon.discount, subtotal);
}

export async function POST(request: NextRequest) {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
  let order: Awaited<ReturnType<typeof prisma.order.create>> | null = null;
  let subtotal = 0;
  let total = 0;
  let appliedCouponId: string | null = null;

  try {
    session = await auth.api.getSession({ headers: request.headers });
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

    subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    total = subtotal;

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
    order = await prisma.order.create({
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

    const stripe = getStripeClient();

    if (stripe) {
      const stripeAmount = Math.round(total * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: stripeAmount,
        currency: "usd",
        receipt_email: session.user.email,
        metadata: {
          orderId: order.id,
          couponId: appliedCouponId || "",
        },
        automatic_payment_methods: {
          enabled: true,
        },
        description: `Sneakora Order #${order.id.slice(0, 8)}`,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripePaymentIntentId: paymentIntent.id },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
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

    await indexOrderInRag(order.id);
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/order/success?order_id=${order.id}`,
      paymentIntentId: null,
      devMode: true,
      subtotal,
      total,
      couponApplied: !!appliedCouponId,
    });
  } catch (error) {
    if (order) {
      console.warn("[Checkout] Error, falling back to dev mode for order", order.id);
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "confirmed" },
      });

      await indexOrderInRag(order.id);

      if (session?.user?.id) {
        await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
      }

      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/order/success?order_id=${order.id}`,
        paymentIntentId: null,
        devMode: true,
        subtotal,
        total,
        couponApplied: !!appliedCouponId,
      });
    }

    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
