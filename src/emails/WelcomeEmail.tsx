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

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to Sneakora - Your Account is Verified</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSection}>
            <Text style={logoText}>SNEAKORA</Text>
            <Text style={taglineText}>Premium Footwear</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontSize: "24px", fontWeight: "bold", margin: "0 0 12px 0" }}>
              Welcome, {name}!
            </Text>
            <Text style={{ color: colors.textMuted, margin: "0 0 16px 0", lineHeight: "24px" }}>
              Your email has been verified and your account is now active.
            </Text>
            <Text style={{ color: colors.textMuted, margin: "0 0 24px 0", lineHeight: "24px" }}>
              Get ready to explore our premium collection of sneakers and athletic footwear. From street style to
              performance gear, we have everything you need to elevate your game.
            </Text>
            <Button href="https://sneakora.com/shop" style={buttonStyle}>
              Start Shopping
            </Button>
          </Section>

          <Section style={{ ...contentSection, paddingTop: "0" }}>
            <Text style={{ color: colors.brand, fontWeight: 600, margin: "0 0 8px 0" }}>
              What&apos;s Next?
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: "14px", margin: "0", lineHeight: "20px" }}>
              Browse our latest arrivals, check your size guide, and sign up for exclusive deals.
            </Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerSection}>
            <Text style={footerText}>Sneakora, 123 Sport Street, New York, NY 10001</Text>
            <Link href="#" style={{ color: colors.textDim, fontSize: "12px", textDecoration: "underline" }}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  name: "John",
} satisfies WelcomeEmailProps;
