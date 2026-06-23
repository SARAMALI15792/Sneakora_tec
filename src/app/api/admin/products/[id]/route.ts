import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

type Params = Promise<{ id: string }>;

const productSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  compareAt: z.coerce.number().positive().optional().nullable(),
  category: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().optional(),
});

async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: new Headers({
      cookie: "",
    }),
  });
  if (!session || session.user.role !== "admin") {
    return false;
  }
  return true;
}

export async function PUT(
  request: NextRequest,
  segmentData: { params: Params }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await segmentData.params;
  const body = await request.json();
  const parsed = productSchema.safeParse(body);

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

  return NextResponse.json(product);
}

export async function DELETE(
  _request: NextRequest,
  segmentData: { params: Params }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await segmentData.params;

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
