import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { embedText } from "@/lib/embeddings";

interface BatchResult {
  sourceType: string;
  success: boolean;
  count: number;
  error?: string;
}

function chunkText(text: string, maxLen = 3000): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = "";
  for (const sentence of sentences) {
    if ((current + " " + sentence).length > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += (current ? " " : "") + sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sourceTypes = ["product", "blog", "deal", "review"] } = body;

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
            product.compareAt ? `Original price: $${product.compareAt}` : null,
            `Sizes available: ${product.sizes.join(", ")}`,
            `Colors available: ${product.colors.join(", ")}`,
            product.stock > 0 ? `Stock: ${product.stock} units available` : "Currently out of stock",
            product.featured ? "Featured product" : null,
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
                compareAt: product.compareAt?.toString() || null,
                stock: product.stock,
                featured: product.featured,
                inStock: product.stock > 0,
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

          const mainChunk = [
            blogPost.title,
            blogPost.excerpt,
            blogPost.content.substring(0, 8000),
          ].filter(Boolean).join(". ");

          const chunks = chunkText(mainChunk, 3000);

          for (let i = 0; i < chunks.length; i++) {
            const embedding = await embedText(chunks[i], "RETRIEVAL_DOCUMENT");
            await prisma.vectorStore.create({
              data: {
                sourceType: "blog",
                sourceId: `${blogPost.id}-${i}`,
                chunkText: chunks[i],
                embedding,
                metadata: {
                  title: blogPost.title,
                  slug: blogPost.slug,
                  excerpt: blogPost.excerpt,
                  chunkIndex: i,
                  totalChunks: chunks.length,
                },
              },
            });
          }
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

    if (sourceTypes.includes("deal")) {
      try {
        const deals = await prisma.deal.findMany({
          where: { active: true },
        });

        for (const deal of deals) {
          await prisma.vectorStore.deleteMany({
            where: { sourceType: "deal", sourceId: deal.id },
          });

          const discountText = deal.type === "percentage"
            ? `${deal.discount}% off`
            : `$${deal.discount} off`;

          const chunkText = [
            `Deal: ${deal.title}`,
            deal.description,
            `Badge: ${deal.badge}`,
            `Discount: ${discountText}`,
            deal.category ? `Category: ${deal.category}` : null,
            deal.startsAt ? `Valid from: ${deal.startsAt.toISOString()}` : null,
            deal.expiresAt ? `Expires: ${deal.expiresAt.toISOString()}` : null,
          ].filter(Boolean).join(". ");

          const embedding = await embedText(chunkText, "RETRIEVAL_DOCUMENT");

          await prisma.vectorStore.create({
            data: {
              sourceType: "deal",
              sourceId: deal.id,
              chunkText,
              embedding,
              metadata: {
                title: deal.title,
                slug: deal.slug,
                badge: deal.badge,
                discount: deal.discount.toString(),
                type: deal.type,
                category: deal.category || null,
                active: deal.active,
              },
            },
          });
        }

        results.push({
          sourceType: "deal",
          success: true,
          count: deals.length,
        });
      } catch (error) {
        results.push({
          sourceType: "deal",
          success: false,
          count: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (sourceTypes.includes("review")) {
      try {
        const reviews = await prisma.review.findMany({
          include: {
            product: { select: { name: true } },
            user: { select: { name: true } },
          },
          take: 500,
        });

        for (const review of reviews) {
          const existing = await prisma.vectorStore.findFirst({
            where: { sourceType: "review", sourceId: review.id },
          });
          if (existing) continue;

          const chunkText = [
            `Review for ${review.product.name}`,
            review.title ? `"${review.title}"` : null,
            `Rating: ${review.rating}/5`,
            review.content,
            `By: ${review.user.name}`,
          ].filter(Boolean).join(". ");

          const embedding = await embedText(chunkText, "RETRIEVAL_DOCUMENT");

          await prisma.vectorStore.create({
            data: {
              sourceType: "review",
              sourceId: review.id,
              userId: review.userId,
              chunkText,
              embedding,
              metadata: {
                productName: review.product.name,
                rating: review.rating,
                userName: review.user.name,
              },
            },
          });
        }

        results.push({
          sourceType: "review",
          success: true,
          count: reviews.length,
        });
      } catch (error) {
        results.push({
          sourceType: "review",
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