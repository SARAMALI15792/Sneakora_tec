import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  badge: z.string().default("Sale"),
  discount: z.coerce.number().positive(),
  type: z.enum(["percentage", "flat"]).default("percentage"),
  image: z.string().optional(),
  category: z.string().optional(),
  productIds: z.array(z.string()).default([]),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSession(request.headers);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deals = await prisma.deal.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ deals });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request.headers);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.deal.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A deal with this slug already exists" },
      { status: 409 }
    );
  }

  const deal = await prisma.deal.create({
    data: {
      ...parsed.data,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  return NextResponse.json(deal, { status: 201 });
}
