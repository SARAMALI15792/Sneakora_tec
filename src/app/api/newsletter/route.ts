import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const existing = await prisma.newsletter.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Already subscribed" },
      { status: 409 }
    );
  }

  await prisma.newsletter.create({ data: parsed.data });

  return NextResponse.json({ success: true }, { status: 201 });
}