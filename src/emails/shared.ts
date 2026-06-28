export const colors = {
  brand: "#7c3aed",
  brandLight: "#a78bfa",
  brandDark: "#5b21b6",
  bg: "#f4f4f5",
  surface: "#ffffff",
  border: "#e4e4e7",
  borderLight: "#f4f4f5",
  text: "#18181b",
  textMuted: "#52525b",
  textDim: "#71717a",
  textDimmer: "#a1a1aa",
  success: "#10b981",
  error: "#ef4444",
};

export const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0",
  backgroundColor: colors.surface,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

export const bodyStyle = {
  backgroundColor: colors.bg,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: "0",
  margin: "0",
};

export const headerSection = {
  textAlign: "center" as const,
  padding: "40px 48px 0",
};

export const logoText = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: colors.text,
  letterSpacing: "-0.02em",
  margin: "0 0 2px 0",
};

export const taglineText = {
  color: colors.brand,
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  margin: "0",
};

export const contentSection = {
  padding: "32px 48px",
};

export const cardStyle = {
  backgroundColor: colors.surface,
  borderRadius: "0",
  marginBottom: "0",
};

export const dividerStyle = {
  height: "1px",
  backgroundColor: colors.borderLight,
  margin: "0 48px",
};

export const buttonStyle = {
  backgroundColor: colors.brand,
  color: "#ffffff",
  fontWeight: 600,
  padding: "14px 32px",
  borderRadius: "8px",
  textAlign: "center" as const,
  textDecoration: "none",
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  fontSize: "15px",
  lineHeight: "24px",
};

export const buttonSecondary = {
  ...buttonStyle,
  backgroundColor: colors.brandLight,
};

export const footerSection = {
  textAlign: "center" as const,
  padding: "24px 48px 40px",
};

export const footerText = {
  color: colors.textDim,
  fontSize: "12px",
  margin: "4px 0",
  lineHeight: "18px",
};

export const hrStyle = {
  border: "none",
  borderTop: `1px solid ${colors.border}`,
  margin: "0 48px",
};
