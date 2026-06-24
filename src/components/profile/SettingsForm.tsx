"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserData = Pick<User, "id" | "name" | "email" | "image"> & {
  emailVerified: boolean;
};

export function SettingsForm({ user }: { user: UserData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");

      if (currentPassword && newPassword) {
        await authClient.signOut();
        router.push("/sign-in?passwordChanged=true");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={updateProfile} className="space-y-8">
      {/* Profile Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name || "User"} />
            ) : (
              <AvatarFallback className="text-lg font-bold">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-heading text-lg font-bold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {!user.emailVerified && (
              <p className="text-xs text-yellow-500">
                Email not verified. Check your inbox.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="space-y-6 border-t border-border pt-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Security
          </p>
          <h3 className="font-heading mt-2 text-xl font-bold">Change Password</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Leave password fields blank to keep your current password.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
            />
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border pt-8">
        <Button
          type="submit"
          disabled={isLoading || Boolean(newPassword && newPassword !== confirmPassword)}
          className="w-full md:w-auto"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>

        {currentPassword && newPassword && (
          <p className="mt-4 text-xs text-muted-foreground">
            Changing your password will sign you out of all devices.
          </p>
        )}
      </div>
    </form>
  );
}
