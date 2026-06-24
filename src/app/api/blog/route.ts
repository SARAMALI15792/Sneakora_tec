import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        createdAt: true,
      },
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  return NextResponse.json({
    posts: posts.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}