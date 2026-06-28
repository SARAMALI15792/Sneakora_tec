import { Resend } from "resend";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const gmailUser = process.env.GMAIL_SMTP_USER || "";
const gmailPass = process.env.GMAIL_SMTP_PASS || "";
const hasGmail = !!(gmailUser && gmailPass);

let gmailTransporter: nodemailer.Transporter | null = null;
if (hasGmail) {
  gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });
}

const RESEND_DEV_FROM = "Sneakora <onboarding@resend.dev>";
const TEST_RECIPIENT = process.env.RESEND_TEST_EMAIL || "saramsaima9914@gmail.com";
const SENDER_NAME = process.env.GMAIL_SENDER_NAME || "Sneakora";

interface SendEmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
}

function getDeliveryMethod() {
  if (hasGmail) {
    return "gmail";
  }
  if (resend) {
    return "resend-sandbox";
  }
  return null;
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {
  const method = getDeliveryMethod();

  if (!method) {
    console.warn(
      "[Email] No email transport configured. Set GMAIL_SMTP_PASS or RESEND_API_KEY in .env.local"
    );
    return null;
  }

  const html = await render(react);

  if (method === "gmail" && gmailTransporter) {
    return sendViaGmail({ to, subject, html });
  }

  if (method === "resend-sandbox" && resend) {
    return sendViaResendSandbox({ to, subject, react });
  }

  return null;
}

async function sendViaGmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await gmailTransporter!.sendMail({
      from: `"${SENDER_NAME}" <${gmailUser}>`,
      to,
      subject,
      html,
    });

    console.log(`[Email] Sent via Gmail to ${to}, messageId: ${info.messageId}`);
    return { id: info.messageId };
  } catch (err) {
    console.error("[Email] Gmail send failed:", err);
    return { error: err instanceof Error ? err.message : "Gmail send failed" };
  }
}

async function sendViaResendSandbox({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  const actualTo = to !== TEST_RECIPIENT ? TEST_RECIPIENT : to;
  const isRedirected = actualTo !== to;

  if (isRedirected) {
    console.log(
      `[Email] Dev mode: redirecting email intended for ${to} to ${actualTo}`
    );
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: RESEND_DEV_FROM,
      to: [actualTo],
      subject: isRedirected ? `[DEV → ${to}] ${subject}` : subject,
      react,
    });

    if (error) {
      console.error("[Email] Resend sandbox send failed:", error);
      return { error };
    }

    console.log(`[Email] Sent via Resend to ${actualTo}, messageId: ${data?.id}`);
    return data;
  } catch (err) {
    console.error("[Email] Resend sandbox error:", err);
    return { error: err instanceof Error ? err.message : "Resend send failed" };
  }
}