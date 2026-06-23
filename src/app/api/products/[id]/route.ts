import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function GET(
  _request: NextRequest,
  segmentData: { params: Params }
) {
  const { id } = await segmentData.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
