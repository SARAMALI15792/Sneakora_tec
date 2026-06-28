import { Html, Head, Preview, Body, Container, Section, Text, Button, Hr, Link } from "react-email";
import {
  bodyStyle,
  containerStyle,
  headerSection,
  logoText,
  taglineText,
  contentSection,
  buttonStyle,
  footerSection,
  footerText,
  hrStyle,
  colors,
} from "./shared";

interface VerificationEmailProps {
  email: string;
  verificationUrl: string;
}

export default function VerificationEmail({ email, verificationUrl }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Verify your email address - Sneakora</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSection}>
            <Text style={logoText}>SNEAKORA</Text>
            <Text style={taglineText}>Premium Footwear</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontSize: "20px", fontWeight: 600, margin: "0 0 12px 0" }}>
              Verify Your Email
            </Text>
            <Text style={{ color: colors.textMuted, margin: "0 0 16px 0", lineHeight: "24px" }}>
              Thanks for signing up! Please verify your email address by clicking the button below.
            </Text>
            <Text style={{ color: colors.textDim, fontSize: "14px", margin: "0 0 28px 0" }}>
              This link will expire in 1 hour.
            </Text>
            <Button href={verificationUrl} style={buttonStyle}>
              Verify Email Address
            </Button>
          </Section>

          <Section style={{ ...contentSection, paddingTop: "0" }}>
            <Text style={{ color: colors.textDim, fontSize: "14px", margin: "0", lineHeight: "20px" }}>
              If you didn&apos;t create an account with Sneakora, you can safely ignore this email.
            </Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerSection}>
            <Text style={footerText}>Sneakora, 123 Sport Street, New York, NY 10001</Text>
            <Text style={{ ...footerText, color: colors.textDimmer }}>This email was sent to {email}</Text>
            <Link href="#" style={{ color: colors.textDim, fontSize: "12px", textDecoration: "underline" }}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

VerificationEmail.PreviewProps = {
  email: "john@example.com",
  verificationUrl: "https://sneakora.com/verify?token=abc123",
} satisfies VerificationEmailProps;
