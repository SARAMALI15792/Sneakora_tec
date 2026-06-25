import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";
import OrderShippedEmail from "@/emails/OrderShippedEmail";
import OrderDeliveredEmail from "@/emails/OrderDeliveredEmail";
import OrderCancelledEmail from "@/emails/OrderCancelledEmail";
import { getStripeClient } from "@/lib/stripe";

function getStripe() {
  return getStripeClient() ?? new Stripe(process.env.STRIPE_SECRET_KEY!);
}

interface OrderWithUser {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  } | null;
  items: {
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
}

async function getOrderWithUser(orderId: string): Promise<OrderWithUser | null> {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  }) as Promise<OrderWithUser | null>;
}

async function sendOrderConfirmation(order: OrderWithUser) {
  if (!order.user) return;

  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const result = await sendEmail({
    to: order.user.email,
    subject: `Order Confirmed - #${order.id} - Sneakora`,
    react: OrderConfirmationEmail({
      orderId: order.id,
      customerName: order.user.name || "Customer",
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      total: Number(order.total),
      estimatedDelivery: estimatedDelivery.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }),
  });

  if (result && "error" in result) {
    console.warn(`[Webhook] Order confirmation email failed for ${order.id}:`, result.error);
  }
}

async function sendOrderShipped(order: OrderWithUser, trackingNumber: string, carrier: string) {
  if (!order.user) return;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const result = await sendEmail({
    to: order.user.email,
    subject: `Your Order Has Shipped! - #${order.id} - Sneakora`,
    react: OrderShippedEmail({
      orderId: order.id,
      customerName: order.user.name || "Customer",
      trackingNumber,
      carrier,
      trackingUrl: `https://track.${carrier.toLowerCase()}.com/${trackingNumber}`,
      estimatedDelivery: estimatedDelivery.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }),
  });

  if (result && "error" in result) {
    console.warn(`[Webhook] Order shipped email failed for ${order.id}:`, result.error);
  }
}

async function sendOrderDelivered(order: OrderWithUser) {
  if (!order.user) return;

  const result = await sendEmail({
    to: order.user.email,
    subject: `Your Order Has Been Delivered! - #${order.id} - Sneakora`,
    react: OrderDeliveredEmail({
      orderId: order.id,
      customerName: order.user.name || "Customer",
      deliveredDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }),
  });

  if (result && "error" in result) {
    console.warn(`[Webhook] Order delivered email failed for ${order.id}:`, result.error);
  }
}

async function sendOrderCancelled(order: OrderWithUser, reason?: string) {
  if (!order.user) return;

  const refundDate = new Date();
  refundDate.setDate(refundDate.getDate() + 7);

  const result = await sendEmail({
    to: order.user.email,
    subject: `Order Cancelled - #${order.id} - Sneakora`,
    react: OrderCancelledEmail({
      orderId: order.id,
      customerName: order.user.name || "Customer",
      refundAmount: Number(order.total),
      refundDate: refundDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      reason,
    }),
  });

  if (result && "error" in result) {
    console.warn(`[Webhook] Order cancelled email failed for ${order.id}:`, result.error);
  }
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
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[Webhook] Received event type: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const orderId = checkoutSession.metadata?.orderId;

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

          const order = await getOrderWithUser(orderId);
          if (order) {
            await prisma.cartItem.deleteMany({ where: { userId: order.userId } });
            console.log(`[Webhook] Cart cleared for user ${order.userId}`);
            await sendOrderConfirmation(order);
            console.log(`[Webhook] Order confirmation email sent for order ${orderId}`);
          }
        } catch (err) {
          console.error(`[Webhook] Failed to update order ${orderId}:`, err);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      } else {
        console.warn("[Webhook] No orderId in checkout session metadata");
      }
      break;
    }

    case "shipping_rate.added_to_session": {
      const shippingRate = event.data.object as Stripe.ShippingRate;
      console.log(`[Webhook] Shipping rate added: ${shippingRate.id}`);
      break;
    }

    case "order.payment_succeeded": {
      const orderPayment = event.data.object as Stripe.Order;
      console.log(`[Webhook] Order payment succeeded: ${orderPayment.id}`);
      break;
    }

    case "order.payment_failed": {
      const orderPayment = event.data.object as Stripe.Order;
      console.log(`[Webhook] Order payment failed: ${orderPayment.id}`);
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] PaymentIntent ${paymentIntent.id} succeeded for amount ${paymentIntent.amount}`);

      if (paymentIntent.metadata?.orderId) {
        try {
          const updated = await prisma.order.update({
            where: { id: paymentIntent.metadata.orderId },
            data: { status: "confirmed" },
          });
          console.log(`[Webhook] Order ${paymentIntent.metadata.orderId} status updated to: ${updated.status}`);

          const order = await getOrderWithUser(paymentIntent.metadata.orderId);
          if (order) {
            await prisma.cartItem.deleteMany({ where: { userId: order.userId } });
            console.log(`[Webhook] Cart cleared for user ${order.userId}`);
            await sendOrderConfirmation(order);
            console.log(`[Webhook] Order confirmation email sent for order ${paymentIntent.metadata.orderId}`);
          }
        } catch (err) {
          console.error(`[Webhook] Failed to update order ${paymentIntent.metadata.orderId}:`, err);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] PaymentIntent ${paymentIntent.id} failed: ${paymentIntent.last_payment_error?.message}`);

      if (paymentIntent.metadata?.orderId) {
        try {
          const updated = await prisma.order.update({
            where: { id: paymentIntent.metadata.orderId },
            data: { status: "failed" },
          });
          console.log(`[Webhook] Order ${paymentIntent.metadata.orderId} status updated to: ${updated.status}`);

          const order = await getOrderWithUser(paymentIntent.metadata.orderId);
          if (order) {
            console.log(`[Webhook] Payment failed for order ${order.id}, user notified`);
          }
        } catch (err) {
          console.error(`[Webhook] Failed to update order ${paymentIntent.metadata.orderId}:`, err);
          return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }
      }
      break;
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}