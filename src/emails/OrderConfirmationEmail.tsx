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

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  estimatedDelivery: string;
}

export default function OrderConfirmationEmail({
  orderId,
  customerName,
  items,
  total,
  estimatedDelivery,
}: OrderConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Preview>Order Confirmed - #{orderId} - Sneakora</Preview>
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
                Order Confirmed!
              </Text>
              <Text className="text-violet-400 font-semibold mb-4">
                Thank you, {customerName}
              </Text>
              <Text className="text-zinc-400 text-sm mb-1">
                Order #{orderId}
              </Text>
              <Text className="text-zinc-500 text-sm mb-6">
                Estimated delivery: {estimatedDelivery}
              </Text>
            </Section>

            <Section className="bg-zinc-900 rounded-xl p-6 mb-6">
              <Text className="text-white font-semibold mb-4">Order Summary</Text>
              {items.map((item, index) => (
                <Section
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-zinc-700 last:border-0"
                >
                  <Section>
                    <Text className="text-white text-sm">{item.name}</Text>
                    <Text className="text-zinc-500 text-xs">
                      Qty: {item.quantity}
                    </Text>
                  </Section>
                  <Text className="text-white text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </Section>
              ))}
              <Section className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-700">
                <Text className="text-white font-semibold">Total</Text>
                <Text className="text-violet-400 font-bold text-lg">
                  ${total.toFixed(2)}
                </Text>
              </Section>
            </Section>

            <Button
              href={`https://sneakora.com/profile/orders/${orderId}`}
              className="bg-violet-600 text-white font-semibold px-8 py-4 rounded-lg text-center no-underline w-full block hover:bg-violet-500 transition-colors"
            >
              View Order Details
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

OrderConfirmationEmail.PreviewProps = {
  orderId: "ORD-2024-001234",
  customerName: "John Doe",
  items: [
    { name: "Air Max 90", quantity: 1, price: 149.99 },
    { name: "Running Socks", quantity: 2, price: 19.99 },
  ],
  total: 189.97,
  estimatedDelivery: "March 15-17, 2024",
} satisfies OrderConfirmationEmailProps;