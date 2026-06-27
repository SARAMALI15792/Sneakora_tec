import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { embedText } from "@/lib/gemini";
import { z } from "zod";

const embedBlogSchema = z.object({
  blogPostId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = embedBlogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { blogPostId } = parsed.data;

    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    await prisma.vectorStore.deleteMany({
      where: {
        sourceType: "blog",
        sourceId: blogPostId,
      },
    });

    const chunkText = [
      blogPost.title,
      blogPost.excerpt,
      blogPost.content.substring(0, 5000),
    ]
      .filter(Boolean)
      .join(". ");

    const embedding = await embedText(chunkText, "RETRIEVAL_DOCUMENT");

    const vectorStore = await prisma.vectorStore.create({
      data: {
        sourceType: "blog",
        sourceId: blogPostId,
        chunkText,
        embedding,
        metadata: {
          title: blogPost.title,
          slug: blogPost.slug,
          excerpt: blogPost.excerpt,
          published: blogPost.published,
        },
      },
    });

    return NextResponse.json({ success: true, id: vectorStore.id });
  } catch (error) {
    console.error("Error embedding blog post:", error);
    return NextResponse.json(
      { error: "Failed to embed blog post" },
      { status: 500 }
    );
  }
}