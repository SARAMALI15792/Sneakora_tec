import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: new Headers({
      cookie: "",
    }),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/sign-in");
  }

  return session;
}
