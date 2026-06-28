import { Html, Head, Preview, Body, Container, Section, Text, Button, Hr, Link } from "react-email";
import {
  bodyStyle,
  containerStyle,
  headerSection,
  logoText,
  taglineText,
  contentSection,
  buttonSecondary,
  footerSection,
  footerText,
  hrStyle,
  colors,
} from "./shared";

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
      <Head />
      <Preview>Your Order Has Been Delivered! - #{orderId} - Sneakora</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSection}>
            <Text style={logoText}>SNEAKORA</Text>
            <Text style={taglineText}>Premium Footwear</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontSize: "22px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              Delivered!
            </Text>
            <Text style={{ color: colors.brand, fontWeight: 600, margin: "0 0 16px 0" }}>
              Hi, {customerName}
            </Text>
            <Text style={{ color: colors.textMuted, margin: "0", lineHeight: "24px", fontSize: "14px" }}>
              Your order #{orderId} has been delivered on {deliveredDate}.
            </Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontWeight: 600, margin: "0 0 8px 0" }}>
              We hope you love your new gear!
            </Text>
            <Text style={{ color: colors.textMuted, margin: "0", lineHeight: "22px", fontSize: "14px" }}>
              If you have any questions about your purchase or need to make a return, our support team is here to help.
            </Text>
          </Section>

          <Section style={{ ...contentSection, paddingTop: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tr>
                <td style={{ width: "50%", paddingRight: "8px" }}>
                  <Button href="https://sneakora.com/shop" style={buttonSecondary}>
                    Shop Again
                  </Button>
                </td>
                <td style={{ width: "50%", paddingLeft: "8px" }}>
                  <Button href={`https://sneakora.com/profile/orders/${orderId}`} style={buttonSecondary}>
                    View Order
                  </Button>
                </td>
              </tr>
            </table>
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

OrderDeliveredEmail.PreviewProps = {
  orderId: "ORD-2024-001234",
  customerName: "John Doe",
  deliveredDate: "March 16, 2024",
} satisfies OrderDeliveredEmailProps;
