import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const addSchema = z.object({
  productId: z.string(),
});

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  // Get recently viewed from cookies if not logged in
  const cookieName = "sneakora_recently_viewed";
  const cookie = request.cookies.get(cookieName);
  let recentlyViewed: string[] = [];
  if (cookie?.value) {
    try {
      recentlyViewed = JSON.parse(cookie.value);
      if (!Array.isArray(recentlyViewed)) recentlyViewed = [];
    } catch {
      recentlyViewed = [];
    }
  }

  if (!session) {
    // Return products from cookie only
    const products = await prisma.product.findMany({
      where: { id: { in: recentlyViewed } },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAt: true,
        images: true,
        category: true,
      },
      orderBy: [{ id: "desc" }],
      take: 10,
    });

    return NextResponse.json({
      items: products.map((p) => ({ ...p, price: Number(p.price), compareAt: p.compareAt ? Number(p.compareAt) : null })),
    });
  }

  // For logged-in users, check database first, then merge with cookie
  const dbItems = await prisma.recentlyViewed.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          compareAt: true,
          images: true,
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const dbProductIds = dbItems.map((item) => item.productId);
  const cookieProductIds = recentlyViewed.filter(
    (id: string) => !dbProductIds.includes(id)
  );

  const cookieProducts = await prisma.product.findMany({
    where: { id: { in: cookieProductIds } },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAt: true,
      images: true,
      category: true,
    },
  });

  const allProducts = [
    ...dbItems.map((item) => item.product),
    ...cookieProducts,
  ].slice(0, 10);

  return NextResponse.json({
    items: allProducts.map((p) => ({ ...p, price: Number(p.price), compareAt: p.compareAt ? Number(p.compareAt) : null })),
  });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  const body = await request.json();
  const parsed = addSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { productId } = parsed.data;

  // Check if product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Handle for logged-in users
  if (session) {
    const existing = await prisma.recentlyViewed.findFirst({
      where: { userId: session.user.id, productId },
    });

    if (existing) {
      await prisma.recentlyViewed.update({
        where: { id: existing.id },
        data: { createdAt: new Date() },
      });
    } else {
      await prisma.recentlyViewed.create({
        data: { userId: session.user.id, productId },
      });
    }
  }

  // Update cookie for all users
  const cookieName = "sneakora_recently_viewed";
  const cookie = request.cookies.get(cookieName);
  let recentlyViewed: string[] = [];
  if (cookie?.value) {
    try {
      recentlyViewed = JSON.parse(cookie.value);
      if (!Array.isArray(recentlyViewed)) recentlyViewed = [];
    } catch {
      recentlyViewed = [];
    }
  }

  // Remove if exists, then add to beginning
  const updated = [productId, ...recentlyViewed.filter((id: string) => id !== productId)].slice(0, 20);

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(cookieName, JSON.stringify(updated), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: false,
    sameSite: "lax",
  });

  return response;
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  // Clear cookie
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set("sneakora_recently_viewed", "", {
    path: "/",
    maxAge: 0,
  });

  // Clear database for logged-in users
  if (session) {
    await prisma.recentlyViewed.deleteMany({
      where: { userId: session.user.id },
    });
  }

  return response;
}
