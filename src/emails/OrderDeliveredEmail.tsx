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

interface OrderDeliveredEmailProps {
  orderId: string;
  customerName: string;
  deliveredDate: string;
}

export default function OrderDeliveredEmail({
  orderId,
  customerName,
  deliveredDate,
}: OrderDeliveredEmailProps) {
  return (
    <Html lang="en">
      <Preview>Your Order Has Been Delivered! - #{orderId} - Sneakora</Preview>
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
                Delivered!
              </Text>
              <Text className="text-violet-400 font-semibold mb-4">
                Hi, {customerName}
              </Text>
              <Text className="text-zinc-400 text-sm">
                Your order #{orderId} has been delivered on {deliveredDate}.
              </Text>
            </Section>

            <Section className="bg-zinc-900 rounded-xl p-6 mb-6">
              <Text className="text-white font-semibold mb-2">
                We hope you love your new gear!
              </Text>
              <Text className="text-zinc-400 text-sm mb-4">
                If you have any questions about your purchase or need to make a
                return, our support team is here to help.
              </Text>
            </Section>

            <Section className="grid grid-cols-2 gap-4 mb-6">
              <Button
                href="https://sneakora.com/shop"
                className="bg-violet-600 text-white font-semibold px-4 py-3 rounded-lg text-center no-underline hover:bg-violet-500 transition-colors text-sm"
              >
                Shop Again
              </Button>
              <Button
                href={`https://sneakora.com/profile/orders/${orderId}`}
                className="bg-zinc-700 text-white font-semibold px-4 py-3 rounded-lg text-center no-underline hover:bg-zinc-600 transition-colors text-sm"
              >
                View Order
              </Button>
            </Section>

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

OrderDeliveredEmail.PreviewProps = {
  orderId: "ORD-2024-001234",
  customerName: "John Doe",
  deliveredDate: "March 16, 2024",
} satisfies OrderDeliveredEmailProps;