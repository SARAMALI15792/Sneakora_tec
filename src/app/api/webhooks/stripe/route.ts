import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const orderId = checkoutSession.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "confirmed",
          stripePaymentIntentId: checkoutSession.payment_intent as string,
        },
      });

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { userId: true },
      });

      if (order) {
        await prisma.cartItem.deleteMany({ where: { userId: order.userId } });
      }
    }
  }

  return NextResponse.json({ received: true });
}
