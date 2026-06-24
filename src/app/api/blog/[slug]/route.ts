import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

type Params = Promise<{ slug: string }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  });
}