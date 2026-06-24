import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8).optional(),
});

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, currentPassword, newPassword } = parsed.data;

  try {
    // If password change is requested, verify current password first
    if (currentPassword && newPassword) {
      const isValid = await auth.api.verifyPassword({
        body: { password: currentPassword },
      });

      if (!isValid.status) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          error: "Password change is not supported in this profile endpoint. Please use the forgot password flow.",
          passwordChanged: false,
        },
        { status: 400 }
      );
    }

    // Update profile information
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // If email was changed, send verification email
    if (email && email !== session.user.email) {
      await auth.api.sendVerificationEmail({
        body: { email },
      });
    }

    return NextResponse.json(
      {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
        passwordChanged: !!newPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete user account
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { userId: session.user.id } }),
      prisma.wishlistItem.deleteMany({ where: { userId: session.user.id } }),
      prisma.review.deleteMany({ where: { userId: session.user.id } }),
      prisma.user.delete({ where: { id: session.user.id } }),
    ]);

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
