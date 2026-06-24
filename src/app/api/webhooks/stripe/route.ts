import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("[Webhook] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[Webhook] Received event type: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const orderId = checkoutSession.metadata?.orderId;
    console.log(`[Webhook] Checkout completed, orderId from metadata: ${orderId}, payment_status: ${checkoutSession.payment_status}`);

    if (orderId) {
      try {
        const updated = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "confirmed",
            stripePaymentIntentId: checkoutSession.payment_intent as string,
          },
        });
        console.log(`[Webhook] Order ${orderId} status updated to: ${updated.status}`);

        const order = await prisma.order.findUnique({
          where: { id: orderId },
          select: { userId: true },
        });

        if (order) {
          await prisma.cartItem.deleteMany({ where: { userId: order.userId } });
          console.log(`[Webhook] Cart cleared for user ${order.userId}`);
        }
      } catch (err) {
        console.error(`[Webhook] Failed to update order ${orderId}:`, err);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    } else {
      console.warn("[Webhook] No orderId in checkout session metadata");
    }
  } else {
    console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
