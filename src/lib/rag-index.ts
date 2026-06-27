import prisma from "@/lib/db";
import { embedText } from "@/lib/embeddings";

export async function indexOrderInRag(orderId: string): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      console.warn(`[RAG Index] Order ${orderId} not found, skipping`);
      return;
    }

    const orderItems = order.items
      .map((item) => `${item.quantity}x ${item.product.name} ($${item.price})`)
      .join(", ");

    const chunkText = [
      `Order #${order.id}`,
      `Status: ${order.status}`,
      `Total: $${order.total}`,
      `Items: ${orderItems}`,
      `Ordered on: ${order.createdAt.toISOString()}`,
    ].join(". ");

    await prisma.vectorStore.deleteMany({
      where: { sourceType: "order", sourceId: orderId },
    });

    const embedding = await embedText(chunkText, "RETRIEVAL_DOCUMENT");

    await prisma.vectorStore.create({
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

    console.log(`[RAG Index] Order ${orderId} indexed successfully`);
  } catch (error) {
    console.error(`[RAG Index] Failed to index order ${orderId}:`, error);
  }
}
