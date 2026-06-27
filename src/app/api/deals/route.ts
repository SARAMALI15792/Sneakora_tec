import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const now = new Date();

  const deals = await prisma.deal.findMany({
    where: {
      active: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] },
      ],
    },
    orderBy: { sortOrder: "asc" },
    take: 20,
  });

  return NextResponse.json({ deals });
}
