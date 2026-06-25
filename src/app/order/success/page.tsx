import Link from "next/link";
import prisma from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";
import { OrderAnimation } from "@/components/order/OrderAnimation";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

async function sendConfirmationEmail(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
    });

    if (!order?.user?.email) return;

    const estimatedDelivery = new Date(order.createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const result = await sendEmail({
      to: order.user.email,
      subject: `Order Confirmed — #${order.id} — Sneakora`,
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
      console.error(`[OrderSuccess] Failed to send confirmation email for order ${orderId}:`, result.error);
    } else {
      console.log(`[OrderSuccess] Confirmation email sent for order ${orderId}`);
    }
  } catch (err) {
    console.error(`[OrderSuccess] Error sending confirmation email for order ${orderId}:`, err);
  }
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sessionId = sp.session_id;
  const orderId = sp.order_id;
  const paymentIntentId = sp.payment_intent;

  let order = null;

  if (paymentIntentId) {
    console.log(`[OrderSuccess] Looking up order by paymentIntentId: ${paymentIntentId}`);
    try {
      const stripe = getStripeClient();
      if (stripe) {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        const metaOrderId = pi.metadata?.orderId;
        if (metaOrderId) {
          order = await prisma.order.findUnique({
            where: { id: metaOrderId },
            include: {
              items: {
                include: { product: { select: { name: true, images: true } } },
              },
            },
          });

          if (order) {
            if (order.status === "pending") {
              await prisma.order.update({
                where: { id: order.id },
                data: { status: "confirmed" },
              });
              order.status = "confirmed";
              console.log(`[OrderSuccess] Order ${order.id} status updated to confirmed`);
            }

            if (order.userId) {
              await prisma.cartItem.deleteMany({ where: { userId: order.userId } });
              console.log(`[OrderSuccess] Cart cleared for user ${order.userId}`);
            }

            await sendConfirmationEmail(order.id);
          }
        }
      }
    } catch (err) {
      console.error(`[OrderSuccess] Failed to lookup paymentIntent:`, err);
    }
  }

  if (!order && sessionId) {
    console.log(`[OrderSuccess] Looking up order by stripeSessionId: ${sessionId}`);
    order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
    });
  } else if (!order && orderId) {
    console.log(`[OrderSuccess] Looking up order by id: ${orderId}`);
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
    });
  }

  if (!order) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center pt-20">
        <div className="mx-auto max-w-md px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Order
          </p>
          <h1 className="font-heading mt-3 text-3xl font-bold">Order confirmed</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Thank you for your purchase! You will receive a confirmation email shortly.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-11 items-center px-6 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return <OrderAnimation order={{
    ...order,
    total: Number(order.total),
    items: order.items.map(i => ({ ...i, price: Number(i.price) })),
  }} />;
}