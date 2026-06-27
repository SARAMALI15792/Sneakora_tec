import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import prisma from "./db";
import { sendEmail } from "./email";
import VerificationEmail from "@/emails/VerificationEmail";
import WelcomeEmail from "@/emails/WelcomeEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      const result = await sendEmail({
        to: user.email,
        subject: "Reset Your Password - Sneakora",
        react: PasswordResetEmail({
          email: user.email,
          resetUrl: url,
        }),
      });
      if (result && "error" in result) {
        console.warn("[Auth] Password reset email not sent:", result.error);
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const result = await sendEmail({
        to: user.email,
        subject: "Verify Your Email - Sneakora",
        react: VerificationEmail({
          email: user.email,
          verificationUrl: url,
        }),
      });
      if (result && "error" in result) {
        console.warn("[Auth] Verification email not sent:", result.error);
      }
    },
    sendOnSignUp: true,
    expiresIn: 3600,
    autoSignInAfterVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  socialProviders: {
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? {
          google: {
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          },
        }
      : {}),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? {
          github: {
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          },
        }
      : {}),
  },
  trustedOrigins: ["http://localhost:3000", "http://192.168.1.6:3000"],
  plugins: [
    admin({
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],
  advanced: {
    databaseHooks: {
      user: {
        create: {
          before: async (_user) => {
            return {};
          },
          after: async (user) => {
            if (user.email) {
              const result = await sendEmail({
                to: user.email,
                subject: "Welcome to Sneakora!",
                react: WelcomeEmail({ name: user.name || "Sneakora Fan" }),
              });
              if (result && "error" in result) {
                console.warn("[Auth] Welcome email not sent:", result.error);
              }
            }
            return {};
          },
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

export async function isAdmin(headers: Headers): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers });
    return session?.user?.role === "admin";
  } catch {
    return false;
  }
}