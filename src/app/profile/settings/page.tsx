import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { SettingsForm } from "@/components/profile/SettingsForm";

export const metadata = {
  title: "Profile Settings — Sneakora",
  description: "Update your account information and preferences",
};

export default async function ProfileSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Account
        </p>
        <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight">
          Profile Settings
        </h1>

        <div className="mt-10">
          <SettingsForm user={user} />
        </div>
      </div>
    </div>
  );
}
