import Link from "next/link";
import prisma from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { OrderAnimation } from "@/components/order/OrderAnimation";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

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
