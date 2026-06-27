import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Tailwind,
  Hr,
  Link,
} from "react-email";

interface OrderCancelledEmailProps {
  orderId: string;
  customerName: string;
  refundAmount: number;
  refundDate: string;
  reason?: string;
}

export default function OrderCancelledEmail({
  orderId,
  customerName,
  refundAmount,
  refundDate,
  reason,
}: OrderCancelledEmailProps) {
  return (
    <Html lang="en">
      <Preview>Order Cancelled - #{orderId} - Sneakora</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#7c3aed",
                dark: "#18181b",
              },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-zinc-900 font-sans">
          <Container className="mx-auto max-w-xl bg-zinc-800 p-8 rounded-2xl my-10">
            <Section className="text-center mb-8">
              <Text className="text-3xl font-bold text-white tracking-tight">
                SNEAKORA
              </Text>
              <Text className="text-violet-400 text-sm uppercase tracking-widest">
                Premium Footwear
              </Text>
            </Section>

            <Section className="bg-zinc-900 rounded-xl p-6 mb-6">
              <Text className="text-white text-2xl font-bold mb-2">
                Order Cancelled
              </Text>
              <Text className="text-violet-400 font-semibold mb-4">
                Hi, {customerName}
              </Text>
              <Text className="text-zinc-400 text-sm">
                Your order #{orderId} has been cancelled.
                {reason && (
                  <span className="block mt-2 text-zinc-500">
                    Reason: {reason}
                  </span>
                )}
              </Text>
            </Section>

            <Section className="bg-zinc-900 rounded-xl p-6 mb-6">
              <Text className="text-white font-semibold mb-4">Refund Details</Text>
              <Section className="bg-zinc-800 rounded-lg p-4 mb-4">
                <Text className="text-zinc-400 text-xs mb-1">Refund Amount</Text>
                <Text className="text-violet-400 font-bold text-xl">
                  ${refundAmount.toFixed(2)}
                </Text>
              </Section>
              <Section className="bg-zinc-800 rounded-lg p-4">
                <Text className="text-zinc-400 text-xs mb-1">
                  Estimated Refund Date
                </Text>
                <Text className="text-white font-semibold">{refundDate}</Text>
              </Section>
              <Text className="text-zinc-500 text-xs mt-4">
                The refund will be processed to your original payment method.
                Depending on your bank, it may take 5-10 business days to
                appear.
              </Text>
            </Section>

            <Button
              href="https://sneakora.com/shop"
              className="bg-violet-600 text-white font-semibold px-8 py-4 rounded-lg text-center no-underline w-full block hover:bg-violet-500 transition-colors"
            >
              Continue Shopping
            </Button>

            <Hr className="border-zinc-700 my-6" />

            <Section className="text-center">
              <Text className="text-zinc-500 text-xs">
                Sneakora, 123 Sport Street, New York, NY 10001
              </Text>
              <Link
                href="#"
                className="text-violet-500 text-xs no-underline mt-2 block"
              >
                Unsubscribe
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

OrderCancelledEmail.PreviewProps = {
  orderId: "ORD-2024-001234",
  customerName: "John Doe",
  refundAmount: 189.97,
  refundDate: "March 20-25, 2024",
  reason: "Item out of stock",
} satisfies OrderCancelledEmailProps;