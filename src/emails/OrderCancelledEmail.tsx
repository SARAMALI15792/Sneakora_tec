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

interface OrderCancelledEmailProps {
  orderId: string;
  customerName: string;
  refundAmount: number;
  refundDate: string;
  reason?: string;
}

export default function OrderCancelledEmail({
  orderId,
  customerName,
  refundAmount,
  refundDate,
  reason,
}: OrderCancelledEmailProps) {
  const infoCell = {
    padding: "12px 16px",
    backgroundColor: colors.bg,
    borderRadius: "8px",
  };

  return (
    <Html lang="en">
      <Head />
      <Preview>Order Cancelled - #{orderId} - Sneakora</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSection}>
            <Text style={logoText}>SNEAKORA</Text>
            <Text style={taglineText}>Premium Footwear</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontSize: "22px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              Order Cancelled
            </Text>
            <Text style={{ color: colors.brand, fontWeight: 600, margin: "0 0 16px 0" }}>
              Hi, {customerName}
            </Text>
            <Text style={{ color: colors.textMuted, margin: "0", lineHeight: "24px", fontSize: "14px" }}>
              Your order #{orderId} has been cancelled.
              {reason ? (
                <span>
                  <br />
                  <span style={{ color: colors.textDim }}>Reason: {reason}</span>
                </span>
              ) : null}
            </Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontWeight: 600, margin: "0 0 16px 0" }}>Refund Details</Text>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tr>
                <td style={infoCell}>
                  <Text style={{ color: colors.textDim, fontSize: "12px", margin: "0 0 4px 0" }}>Refund Amount</Text>
                  <Text style={{ color: colors.brand, fontWeight: "bold", fontSize: "20px", margin: "0" }}>
                    ${refundAmount.toFixed(2)}
                  </Text>
                </td>
              </tr>
            </table>

            <div style={{ height: "8px" }} />

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tr>
                <td style={infoCell}>
                  <Text style={{ color: colors.textDim, fontSize: "12px", margin: "0 0 4px 0" }}>
                    Estimated Refund Date
                  </Text>
                  <Text style={{ color: colors.text, fontWeight: 600, margin: "0" }}>{refundDate}</Text>
                </td>
              </tr>
            </table>

            <Text style={{ color: colors.textDimmer, fontSize: "12px", marginTop: "16px", lineHeight: "18px" }}>
              The refund will be processed to your original payment method. Depending on your bank, it may take 5-10
              business days to appear.
            </Text>
          </Section>

          <Section style={{ ...contentSection, paddingTop: "0" }}>
            <Button href="https://sneakora.com/shop" style={buttonStyle}>
              Continue Shopping
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

OrderCancelledEmail.PreviewProps = {
  orderId: "ORD-2024-001234",
  customerName: "John Doe",
  refundAmount: 189.97,
  refundDate: "March 20-25, 2024",
  reason: "Item out of stock",
} satisfies OrderCancelledEmailProps;
