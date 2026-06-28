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

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  estimatedDelivery: string;
}

function ItemRow({ item }: { item: OrderItem }) {
  return (
    <tr>
      <td style={{ padding: "12px 0", borderBottom: `1px solid ${colors.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tr>
            <td style={{ width: "60px", verticalAlign: "top" }}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  width="48"
                  height="48"
                  style={{ borderRadius: "8px", display: "block" }}
                />
              ) : null}
            </td>
            <td style={{ paddingLeft: "12px", verticalAlign: "top" }}>
              <Text style={{ color: colors.text, fontSize: "14px", fontWeight: 600, margin: "0 0 4px 0" }}>
                {item.name}
              </Text>
              <Text style={{ color: colors.textDim, fontSize: "12px", margin: "0" }}>Qty: {item.quantity}</Text>
            </td>
            <td style={{ textAlign: "right", verticalAlign: "top" }}>
              <Text style={{ color: colors.text, fontSize: "14px", fontWeight: 600, margin: "0" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  );
}

export default function OrderConfirmationEmail({
  orderId,
  customerName,
  items,
  total,
  estimatedDelivery,
}: OrderConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Order Confirmed - #{orderId} - Sneakora</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSection}>
            <Text style={logoText}>SNEAKORA</Text>
            <Text style={taglineText}>Premium Footwear</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontSize: "22px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              Order Confirmed!
            </Text>
            <Text style={{ color: colors.brand, fontWeight: 600, margin: "0 0 16px 0" }}>
              Thank you, {customerName}
            </Text>
            <Text style={{ color: colors.textDim, fontSize: "14px", margin: "0 0 4px 0" }}>
              Order #{orderId}
            </Text>
            <Text style={{ color: colors.textDim, fontSize: "14px", margin: "0" }}>
              Estimated delivery: {estimatedDelivery}
            </Text>
          </Section>

          <Section style={contentSection}>
            <Text style={{ color: colors.text, fontWeight: 600, margin: "0 0 16px 0" }}>Order Summary</Text>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              {items.map((item, index) => (
                <ItemRow key={index} item={item} />
              ))}
              <tr>
                <td style={{ paddingTop: "16px", borderTop: `1px solid ${colors.border}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tr>
                      <td>
                        <Text style={{ color: colors.text, fontWeight: 600, margin: "0", fontSize: "16px" }}>
                          Total
                        </Text>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Text style={{ color: colors.brand, fontWeight: "bold", margin: "0", fontSize: "18px" }}>
                          ${total.toFixed(2)}
                        </Text>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </Section>

          <Section style={{ ...contentSection, paddingTop: "0" }}>
            <Button href={`https://sneakora.com/profile/orders/${orderId}`} style={buttonStyle}>
              View Order Details
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

OrderConfirmationEmail.PreviewProps = {
  orderId: "ORD-2024-001234",
  customerName: "John Doe",
  items: [
    { name: "Air Max 90", quantity: 1, price: 149.99 },
    { name: "Running Socks", quantity: 2, price: 19.99 },
  ],
  total: 189.97,
  estimatedDelivery: "March 15-17, 2024",
} satisfies OrderConfirmationEmailProps;
