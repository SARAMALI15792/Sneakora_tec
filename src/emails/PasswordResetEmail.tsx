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

interface PasswordResetEmailProps {
  email: string;
  resetUrl: string;
}

export default function PasswordResetEmail({ email, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset Your Password - Sneakora</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSection}>
            <Text style={logoText}>SNEAKORA</Text>
            <Text style={taglineText}>Premium Footwear</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontSize: "20px", fontWeight: 600, margin: "0 0 12px 0" }}>
              Reset Your Password
            </Text>
            <Text style={{ color: colors.textMuted, margin: "0 0 16px 0", lineHeight: "24px" }}>
              We received a request to reset your password. Click the button below to create a new password.
            </Text>
            <Text style={{ color: colors.textDim, fontSize: "14px", margin: "0 0 28px 0" }}>
              This link will expire in 30 minutes.
            </Text>
            <Button href={resetUrl} style={buttonStyle}>
              Reset Password
            </Button>
          </Section>

          <Section style={{ ...contentSection, paddingTop: "0" }}>
            <Text style={{ color: colors.textDim, fontSize: "14px", margin: "0", lineHeight: "20px" }}>
              If you didn&apos;t request a password reset, please ignore this email. Your account is secure.
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

PasswordResetEmail.PreviewProps = {
  email: "john@example.com",
  resetUrl: "https://sneakora.com/reset-password?token=xyz789",
} satisfies PasswordResetEmailProps;
