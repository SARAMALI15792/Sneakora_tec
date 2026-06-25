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

interface PasswordResetEmailProps {
  email: string;
  resetUrl: string;
}

export default function PasswordResetEmail({
  email,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset Your Password - Sneakora</Preview>
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
                Reset Your Password
              </Text>
              <Text className="text-zinc-400 mb-4">
                We received a request to reset your password. Click the button
                below to create a new password.
              </Text>
              <Text className="text-zinc-500 text-sm mb-8">
                This link will expire in 30 minutes.
              </Text>
              <Button
                href={resetUrl}
                className="bg-violet-600 text-white font-semibold px-8 py-4 rounded-lg text-center no-underline w-full block hover:bg-violet-500 transition-colors"
              >
                Reset Password
              </Button>
            </Section>

            <Section className="bg-zinc-900 rounded-xl p-6 mb-6">
              <Text className="text-zinc-400 text-sm">
                If you didn&apos;t request a password reset, please ignore this
                email. Your account is secure.
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

PasswordResetEmail.PreviewProps = {
  email: "john@example.com",
  resetUrl: "https://sneakora.com/reset-password?token=xyz789",
} satisfies PasswordResetEmailProps;