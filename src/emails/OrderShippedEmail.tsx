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
  const infoCell = {
    padding: "12px 16px",
    backgroundColor: colors.bg,
    borderRadius: "8px",
  };

  return (
    <Html lang="en">
      <Head />
      <Preview>Your Order Has Shipped! - #{orderId} - Sneakora</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSection}>
            <Text style={logoText}>SNEAKORA</Text>
            <Text style={taglineText}>Premium Footwear</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontSize: "22px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              Your Order is On Its Way!
            </Text>
            <Text style={{ color: colors.brand, fontWeight: 600, margin: "0 0 16px 0" }}>
              Hi, {customerName}
            </Text>
            <Text style={{ color: colors.textMuted, margin: "0", lineHeight: "24px", fontSize: "14px" }}>
              Great news! Your order #{orderId} has been shipped and is on its way to you.
            </Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontWeight: 600, margin: "0 0 16px 0" }}>Tracking Information</Text>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tr>
                <td style={infoCell}>
                  <Text style={{ color: colors.textDim, fontSize: "12px", margin: "0 0 4px 0" }}>Carrier</Text>
                  <Text style={{ color: colors.text, fontWeight: 600, margin: "0" }}>{carrier}</Text>
                </td>
              </tr>
            </table>

            <div style={{ height: "8px" }} />

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tr>
                <td style={infoCell}>
                  <Text style={{ color: colors.textDim, fontSize: "12px", margin: "0 0 4px 0" }}>Tracking Number</Text>
                  <Text style={{ color: colors.text, fontWeight: 600, margin: "0", fontFamily: "monospace" }}>
                    {trackingNumber}
                  </Text>
                </td>
              </tr>
            </table>

            <div style={{ height: "8px" }} />

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tr>
                <td style={infoCell}>
                  <Text style={{ color: colors.textDim, fontSize: "12px", margin: "0 0 4px 0" }}>
                    Estimated Delivery
                  </Text>
                  <Text style={{ color: colors.brand, fontWeight: 600, margin: "0" }}>
                    {estimatedDelivery}
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          <Section style={{ ...contentSection, paddingTop: "0" }}>
            <Button href={trackingUrl} style={buttonStyle}>
              Track Your Package
            </Button>
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

OrderShippedEmail.PreviewProps = {
  orderId: "ORD-2024-001234",
  customerName: "John Doe",
  trackingNumber: "1Z999AA10123456784",
  carrier: "UPS",
  trackingUrl: "https://ups.com/track/1Z999AA10123456784",
  estimatedDelivery: "March 18-20, 2024",
} satisfies OrderShippedEmailProps;
