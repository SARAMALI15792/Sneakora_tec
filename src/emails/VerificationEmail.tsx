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

interface VerificationEmailProps {
  email: string;
  verificationUrl: string;
}

export default function VerificationEmail({
  email,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Verify your email address - Sneakora</Preview>
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
              <Text className="text-white text-xl font-semibold mb-2">
                Verify Your Email
              </Text>
              <Text className="text-zinc-400 mb-6">
                Thanks for signing up! Please verify your email address by
                clicking the button below.
              </Text>
              <Text className="text-zinc-500 text-sm mb-8">
                This link will expire in 1 hour.
              </Text>
              <Button
                href={verificationUrl}
                className="bg-violet-600 text-white font-semibold px-8 py-4 rounded-lg text-center no-underline w-full block hover:bg-violet-500 transition-colors"
              >
                Verify Email Address
              </Button>
            </Section>

            <Section className="bg-zinc-900 rounded-xl p-6 mb-6">
              <Text className="text-zinc-400 text-sm">
                If you didn&apos;t create an account with Sneakora, you can safely
                ignore this email.
              </Text>
            </Section>

            <Hr className="border-zinc-700 my-6" />

            <Section className="text-center">
              <Text className="text-zinc-500 text-xs">
                Sneakora, 123 Sport Street, New York, NY 10001
              </Text>
              <Text className="text-zinc-600 text-xs mt-2">
                This email was sent to {email}
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

VerificationEmail.PreviewProps = {
  email: "john@example.com",
  verificationUrl: "https://sneakora.com/verify?token=abc123",
} satisfies VerificationEmailProps;