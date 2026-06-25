import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

  const fromEmail = from || "Sneakora <noreply@sneakora.com>";

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject,
    react,
  });

  if (error) {
    console.error("[Email] Failed to send email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log(`[Email] Sent email to ${to}, messageId: ${data?.id}`);
  return data;
}