import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { embedText } from "@/lib/gemini";
import { z } from "zod";

const embedOrderSchema = z.object({
  orderId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = embedOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.vectorStore.deleteMany({
      where: {
        sourceType: "order",
        sourceId: orderId,
      },
    });

    const orderItems = order.items
      .map(
        (item) =>
          `${item.quantity}x ${item.product.name} ($${item.price})`
      )
      .join(", ");

    const chunkText = [
      `Order #${order.id}`,
      `Status: ${order.status}`,
      `Total: $${order.total}`,
      `Items: ${orderItems}`,
      `Ordered on: ${order.createdAt.toISOString()}`,
    ].join(". ");

    const embedding = await embedText(chunkText, "RETRIEVAL_DOCUMENT");

    const vectorStore = await prisma.vectorStore.create({
      data: {
        sourceType: "order",
        sourceId: orderId,
        userId: order.userId,
        chunkText,
        embedding,
        metadata: {
          orderId: order.id,
          status: order.status,
          total: order.total.toString(),
          itemCount: order.items.length,
          userName: order.user.name,
          userEmail: order.user.email,
        },
      },
    });

    return NextResponse.json({ success: true, id: vectorStore.id });
  } catch (error) {
    console.error("Error embedding order:", error);
    return NextResponse.json(
      { error: "Failed to embed order" },
      { status: 500 }
    );
  }
}