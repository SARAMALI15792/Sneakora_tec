import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_DEV = "Sneakora <onboarding@resend.dev>";

const TEST_RECIPIENT = process.env.RESEND_TEST_EMAIL || "saramsaima9914@gmail.com";

interface SendEmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
}

export async function sendEmail({ to, subject, react, from }: SendEmailParams) {
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping email send");
    return null;
  }

  const fromEmail = from || FROM_DEV;
  const isDevFrom = fromEmail === FROM_DEV || fromEmail.includes("@resend.dev");
  const actualTo = isDevFrom && to !== TEST_RECIPIENT ? TEST_RECIPIENT : to;

  if (actualTo !== to) {
    console.log(
      `[Email] Dev mode: redirecting email intended for ${to} to ${actualTo}`
    );
  }

  if (fromEmail.includes("@sneakora.com")) {
    console.warn(
      "[Email] Using unverified domain sneakora.com — emails may be rejected. Verify the domain in Resend dashboard, or use onboarding@resend.dev for testing."
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [actualTo],
      subject: isDevFrom && actualTo !== to ? `[DEV → ${to}] ${subject}` : subject,
      react,
    });

    if (error) {
      console.error("[Email] Failed to send email:", error);
      return { error };
    }

    console.log(`[Email] Sent email to ${actualTo}, messageId: ${data?.id}`);
    return data;
  } catch (err) {
    console.error("[Email] Unexpected error sending email:", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}