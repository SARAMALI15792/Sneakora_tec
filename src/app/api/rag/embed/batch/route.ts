import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { embedText } from "@/lib/gemini";

interface BatchResult {
  sourceType: string;
  success: boolean;
  count: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sourceTypes = ["product", "blog"] } = body;

    const results: BatchResult[] = [];

    if (sourceTypes.includes("product")) {
      try {
        const products = await prisma.product.findMany();

        for (const product of products) {
          await prisma.vectorStore.deleteMany({
            where: { sourceType: "product", sourceId: product.id },
          });

          const chunkText = [
            product.name,
            product.description,
            `Category: ${product.category}`,
            `Price: $${product.price}`,
            `Sizes: ${product.sizes.join(", ")}`,
            `Colors: ${product.colors.join(", ")}`,
          ]
            .filter(Boolean)
            .join(". ");

          const embedding = await embedText(chunkText, "RETRIEVAL_DOCUMENT");

          await prisma.vectorStore.create({
            data: {
              sourceType: "product",
              sourceId: product.id,
              chunkText,
              embedding,
              metadata: {
                name: product.name,
                slug: product.slug,
                category: product.category,
                price: product.price.toString(),
              },
            },
          });
        }

        results.push({
          sourceType: "product",
          success: true,
          count: products.length,
        });
      } catch (error) {
        results.push({
          sourceType: "product",
          success: false,
          count: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (sourceTypes.includes("blog")) {
      try {
        const blogPosts = await prisma.blogPost.findMany({
          where: { published: true },
        });

        for (const blogPost of blogPosts) {
          await prisma.vectorStore.deleteMany({
            where: { sourceType: "blog", sourceId: blogPost.id },
          });

          const chunkText = [blogPost.title, blogPost.excerpt, blogPost.content]
            .filter(Boolean)
            .join(". ");

          const embedding = await embedText(chunkText, "RETRIEVAL_DOCUMENT");

          await prisma.vectorStore.create({
            data: {
              sourceType: "blog",
              sourceId: blogPost.id,
              chunkText,
              embedding,
              metadata: {
                title: blogPost.title,
                slug: blogPost.slug,
              },
            },
          });
        }

        results.push({
          sourceType: "blog",
          success: true,
          count: blogPosts.length,
        });
      } catch (error) {
        results.push({
          sourceType: "blog",
          success: false,
          count: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error in batch embedding:", error);
    return NextResponse.json(
      { error: "Failed to process batch embedding" },
      { status: 500 }
    );
  }
}