import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await prisma.contactMessage.create({ data: parsed.data });

  return NextResponse.json({ success: true }, { status: 201 });
}