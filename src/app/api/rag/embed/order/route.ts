import { type NextRequest, NextResponse } from "next/server";
import { indexOrderInRag } from "@/lib/rag-index";
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
    await indexOrderInRag(orderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error embedding order:", error);
    return NextResponse.json(
      { error: "Failed to embed order" },
      { status: 500 }
    );
  }
}