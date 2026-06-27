import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

type Params = Promise<{ id: string }>;

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  badge: z.string().optional(),
  discount: z.coerce.number().positive().optional(),
  type: z.enum(["percentage", "flat"]).optional(),
  image: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  productIds: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  startsAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const session = await getSession(_request.headers);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  return NextResponse.json(deal);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const session = await getSession(request.headers);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.startsAt !== undefined) {
    data.startsAt = parsed.data.startsAt ? new Date(parsed.data.startsAt) : null;
  }
  if (parsed.data.expiresAt !== undefined) {
    data.expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;
  }

  const deal = await prisma.deal.update({ where: { id }, data });
  return NextResponse.json(deal);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const session = await getSession(_request.headers);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.deal.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
