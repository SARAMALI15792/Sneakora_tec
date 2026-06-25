import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { embedText, generateStream } from "@/lib/gemini";
import { z } from "zod";

const querySchema = z.object({
  query: z.string().min(1).max(1000),
  userId: z.string().optional(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function buildSystemPrompt(): string {
  return `You are Sneakora AI assistant, a helpful shopping assistant for a premium sneaker e-commerce store.

Your role is to help customers find products, answer questions about orders, provide style recommendations, and assist with any shopping-related inquiries.

Guidelines:
- Be friendly, helpful, and knowledgeable about sneakers and streetwear
- Provide accurate product information when available
- If you don't know something, say so honestly
- Focus on helping users make informed purchasing decisions
- Never make up product information or prices
- Be concise but thorough in your responses

Context from the store will be provided below. Use it to answer user questions accurately.`;
}

function buildContextPrompt(chunks: Array<{ chunkText: string; metadata: Record<string, unknown> }>): string {
  if (chunks.length === 0) {
    return "No relevant context available from the store database.";
  }

  const contextSections = chunks.map((chunk, index) => {
    const sourceType = chunk.metadata?.sourceType as string;

    return `[Context ${index + 1}] (${sourceType}): ${chunk.chunkText}`;
  });

  return (
    "Relevant information from the store:\n\n" +
    contextSections.join("\n\n")
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = querySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { query, userId, conversationHistory = [] } = parsed.data;

    const queryEmbedding = await embedText(query, "RETRIEVAL_QUERY");

    const allVectors = await prisma.vectorStore.findMany({
      where: userId ? { userId } : undefined,
    });

    const scoredChunks = allVectors
      .map((v) => ({
        ...v,
        score: cosineSimilarity(queryEmbedding, v.embedding),
      }))
      .filter((v) => v.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const contextPrompt = buildContextPrompt(
      scoredChunks.map((v) => ({
        chunkText: v.chunkText,
        metadata: v.metadata as Record<string, unknown>,
      }))
    );

    const systemPrompt = buildSystemPrompt();

    let fullPrompt = `${systemPrompt}\n\n${contextPrompt}\n\n`;

    for (const message of conversationHistory) {
      fullPrompt += `${message.role === "user" ? "User" : "Assistant"}: ${message.content}\n`;
    }

    fullPrompt += `User: ${query}\nAssistant:`;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let assistantMessage = "";

          for await (const chunk of generateStream(fullPrompt)) {
            assistantMessage += chunk;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk, done: false })}\n\n`)
            );
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: "", done: true, fullResponse: assistantMessage })}\n\n`)
          );
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Failed to generate response", done: true })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in RAG query:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}