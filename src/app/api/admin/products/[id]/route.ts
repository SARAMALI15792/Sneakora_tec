import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

type Params = Promise<{ id: string }>;

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  compareAt: z.coerce.number().positive().nullable().optional(),
  category: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  featured: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const session = await auth.api.getSession({ headers: _request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...product,
    price: Number(product.price),
    compareAt: product.compareAt ? Number(product.compareAt) : null,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const session = await auth.api.getSession({ headers: request.headers });
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

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({
    ...product,
    price: Number(product.price),
    compareAt: product.compareAt ? Number(product.compareAt) : null,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const session = await auth.api.getSession({ headers: _request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}