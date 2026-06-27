import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { embedText } from "@/lib/gemini";
import { z } from "zod";

const embedProductSchema = z.object({
  productId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = embedProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { productId } = parsed.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.vectorStore.deleteMany({
      where: {
        sourceType: "product",
        sourceId: productId,
      },
    });

    const chunkText = [
      product.name,
      product.description,
      `Category: ${product.category}`,
      `Price: $${product.price}`,
      `Sizes: ${product.sizes.join(", ")}`,
      `Colors: ${product.colors.join(", ")}`,
      product.stock > 0 ? "In stock" : "Out of stock",
    ]
      .filter(Boolean)
      .join(". ");

    const embedding = await embedText(chunkText, "RETRIEVAL_DOCUMENT");

    const vectorStore = await prisma.vectorStore.create({
      data: {
        sourceType: "product",
        sourceId: productId,
        chunkText,
        embedding,
        metadata: {
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: product.price.toString(),
          images: product.images,
        },
      },
    });

    return NextResponse.json({ success: true, id: vectorStore.id });
  } catch (error) {
    console.error("Error embedding product:", error);
    return NextResponse.json(
      { error: "Failed to embed product" },
      { status: 500 }
    );
  }
}