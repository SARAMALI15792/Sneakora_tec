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

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Preview>Welcome to Sneakora - Your Account is Verified</Preview>
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
              <Text className="text-white text-2xl font-bold mb-4">
                Welcome, {name}!
              </Text>
              <Text className="text-zinc-400 mb-4">
                Your email has been verified and your account is now active.
              </Text>
              <Text className="text-zinc-400 mb-6">
                Get ready to explore our premium collection of sneakers and
                athletic footwear. From street style to performance gear, we
                have everything you need to elevate your game.
              </Text>
              <Button
                href="https://sneakora.com/shop"
                className="bg-violet-600 text-white font-semibold px-8 py-4 rounded-lg text-center no-underline w-full block hover:bg-violet-500 transition-colors"
              >
                Start Shopping
              </Button>
            </Section>

            <Section className="bg-zinc-900 rounded-xl p-6 mb-6">
              <Text className="text-violet-400 font-semibold mb-2">
                What&apos;s Next?
              </Text>
              <Text className="text-zinc-400 text-sm">
                Browse our latest arrivals, check your size guide, and sign up
                for exclusive deals.
              </Text>
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

WelcomeEmail.PreviewProps = {
  name: "John",
} satisfies WelcomeEmailProps;