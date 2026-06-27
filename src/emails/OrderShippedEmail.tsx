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

interface OrderShippedEmailProps {
  orderId: string;
  customerName: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
  estimatedDelivery: string;
}

export default function OrderShippedEmail({
  orderId,
  customerName,
  trackingNumber,
  carrier,
  trackingUrl,
  estimatedDelivery,
}: OrderShippedEmailProps) {
  return (
    <Html lang="en">
      <Preview>Your Order Has Shipped! - #{orderId} - Sneakora</Preview>
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
                Your Order is On Its Way!
              </Text>
              <Text className="text-violet-400 font-semibold mb-4">
                Hi, {customerName}
              </Text>
              <Text className="text-zinc-400 text-sm">
                Great news! Your order #{orderId} has been shipped and is on
                its way to you.
              </Text>
            </Section>

            <Section className="bg-zinc-900 rounded-xl p-6 mb-6">
              <Text className="text-white font-semibold mb-4">
                Tracking Information
              </Text>
              <Section className="bg-zinc-800 rounded-lg p-4 mb-4">
                <Text className="text-zinc-400 text-xs mb-1">Carrier</Text>
                <Text className="text-white font-semibold">{carrier}</Text>
              </Section>
              <Section className="bg-zinc-800 rounded-lg p-4 mb-4">
                <Text className="text-zinc-400 text-xs mb-1">
                  Tracking Number
                </Text>
                <Text className="text-white font-mono font-semibold">
                  {trackingNumber}
                </Text>
              </Section>
              <Section className="bg-zinc-800 rounded-lg p-4">
                <Text className="text-zinc-400 text-xs mb-1">
                  Estimated Delivery
                </Text>
                <Text className="text-violet-400 font-semibold">
                  {estimatedDelivery}
                </Text>
              </Section>
            </Section>

            <Button
              href={trackingUrl}
              className="bg-violet-600 text-white font-semibold px-8 py-4 rounded-lg text-center no-underline w-full block hover:bg-violet-500 transition-colors"
            >
              Track Your Package
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

OrderShippedEmail.PreviewProps = {
  orderId: "ORD-2024-001234",
  customerName: "John Doe",
  trackingNumber: "1Z999AA10123456784",
  carrier: "UPS",
  trackingUrl: "https://ups.com/track/1Z999AA10123456784",
  estimatedDelivery: "March 18-20, 2024",
} satisfies OrderShippedEmailProps;