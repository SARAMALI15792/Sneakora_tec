import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { embedText, generateStream } from "@/lib/embeddings";
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

function keywordMatchScore(query: string, chunkText: string): number {
  const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const textLower = chunkText.toLowerCase();
  if (queryWords.length === 0) return 0;
  let score = 0;
  for (const word of queryWords) {
    if (textLower.includes(word)) {
      score += 1;
      const idx = textLower.indexOf(word);
      score += (1 - idx / textLower.length) * 0.3;
    }
  }
  return score / queryWords.length;
}

function expandQuery(query: string): string[] {
  const q = query.toLowerCase();
  const expansions: string[] = [query];
  const categoryMap: Record<string, string[]> = {
    men: ["men's", "male", "guy", "man"],
    women: ["women's", "female", "woman", "girl", "ladies"],
    kids: ["children", "child", "kid's", "youth", "little"],
    sports: ["athletic", "sport", "training", "workout", "gym"],
    casual: ["everyday", "lifestyle", "street", "walking"],
    running: ["run", "runner", "jog", "marathon", "track"],
    basketball: ["hoops", "bball", "court", "ball"],
    training: ["gym", "lift", "crossfit", "workout", "exercise"],
    lifestyle: ["fashion", "style", "everyday", "daily"],
  };
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((k) => q.includes(k))) {
      expansions.push(`category ${category} ${query}`);
      break;
    }
  }
  const dealWords = ["deal", "sale", "discount", "offer", "promo", "saving", "bargain"];
  if (dealWords.some((w) => q.includes(w))) {
    expansions.push(`deal promotion discount sale ${query}`);
  }
  const priceWords = ["cheap", "expensive", "budget", "affordable", "price", "cost", "under", "$$", "money"];
  if (priceWords.some((w) => q.includes(w))) {
    expansions.push(`price cost dollar budget ${query}`);
  }
  return expansions;
}

const SIZE_GUIDE_TEXT = `Sneakora Size Guide:
- US Men's: 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14
- US Women's: 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12
- UK: Men's US minus 0.5, Women's US minus 1.5
- EU: Men's US plus 33, Women's US plus 31
- CM: Men's 6=24cm, 7=25cm, 8=26cm, 9=27cm, 10=28cm, 11=29cm, 12=30cm
- If between sizes, size up for athletic fits, size down for casual wear
- Half sizes offer a snugger fit than full sizes
- Measure your foot length from heel to longest toe, add 0.5cm for wiggle room
- Sneakers tend to run true to size; always check product-specific reviews
- Most Sneakora products come in US sizing — use the conversion chart above for UK/EU/CM`;

function classifyQuery(query: string): string {
  const q = query.toLowerCase();
  const orderWords = ["order", "track", "delivery", "shipping", "shipped", "status", "where is", "arrive", "package"];
  const recWords = ["recommend", "suggestion", "what should", "match", "go with", "style", "suit", "best for"];
  const dealWords = ["deal", "sale", "discount", "offer", "promo", "coupon", "saving", "bargain", "cheap", "clearance"];
  const reviewWords = ["review", "rating", "feedback", "thoughts on", "how is", "worth", "quality"];
  const productWords = ["find", "looking for", "search", "have", "price", "cost", "color", "size", "fit", "brand", "category", "best seller", "popular", "sneaker", "shoe", "buy", "best", "sizing", "measurement", "us", "eu", "uk", "cm"];
  const contactWords = ["contact", "phone", "email", "call", "support", "help", "return", "refund", "exchange", "policy"];

  const orderScore = orderWords.filter((w) => q.includes(w)).length;
  const recScore = recWords.filter((w) => q.includes(w)).length;
  const dealScore = dealWords.filter((w) => q.includes(w)).length;
  const reviewScore = reviewWords.filter((w) => q.includes(w)).length;
  const productScore = productWords.filter((w) => q.includes(w)).length;
  const contactScore = contactWords.filter((w) => q.includes(w)).length;

  const scores = [
    { type: "order", score: orderScore },
    { type: "recommendation", score: recScore },
    { type: "deal", score: dealScore },
    { type: "review", score: reviewScore },
    { type: "product", score: productScore },
    { type: "contact", score: contactScore },
  ];
  scores.sort((a, b) => b.score - a.score);
  if (scores[0].score === 0) return "general";
  if (scores[0].score === scores[1].score) return "product";
  return scores[0].type;
}

function buildSystemPrompt(query: string): string {
  const queryType = classifyQuery(query);

  const typeInstructions: Record<string, string> = {
    order: `The user is asking about an order. Focus on:
- Order status, items, and delivery timeline
- If order data is not in context, ask for their order ID or email
- Be precise and concise about dates and statuses`,
    recommendation: `The user wants a recommendation. Focus on:
- Match products to their stated preferences (style, use, budget, gender)
- Explain WHY each recommendation fits their needs
- Compare 2-3 options briefly if you have multiple good matches
- Mention key differentiators (price, features, style, category)
- If no preferences given, recommend popular/featured products`,
    product: `The user is searching for products or asking about sizing. Focus on:
- Name, price, available sizes/colors from context
- If context has relevant products, list them with key details
- Be specific — mention exact product names and prices
- If the context includes a size guide, present it clearly with conversion info (US/UK/EU/CM) and sizing tips
- For "find my size" — ask their usual US size or foot measurement, then recommend from available sizes
- Filter by category (men/women/kids/sports/casual/running/basketball/training/lifestyle) when mentioned`,
    deal: `The user is asking about deals, sales, or discounts. Focus on:
- List active deals with discount amounts and badges
- Mention if deals have expiration dates
- Highlight the best savings first
- If they have a coupon code, check if it's valid
- Do not invent deals — only present what's in context`,
    review: `The user is asking about reviews or ratings. Focus on:
- Share product ratings and review excerpts from context
- Highlight what customers liked or disliked
- Mention overall rating out of 5`,
    contact: `The user needs support or contact info. Focus on:
- Provide the contact email, phone, and address from context
- Mention availability hours
- Guide them to the right channel for their issue
- For returns/exchanges, direct them to contact customer support`,
    general: `The user has a general question. Focus on:
- Answer directly using available context
- If context doesn't cover it, say so honestly
- Keep it brief unless they ask for details`,
  };

  return `You are Sneakora AI — a sharp, efficient shopping assistant for a premium sneaker e-commerce store.

Detected query type: ${queryType}

${typeInstructions[queryType] || typeInstructions.general}

Core rules:
- Answer directly and professionally. Skip greetings, small talk, and fluff.
- Use provided context (products, orders, blog, deals, reviews, size guide). If context is empty, say "I don't have information on that yet" — do not guess.
- Keep responses tight. 2-4 sentences unless the user asks for details.
- For product questions: state name, price, key details. Use $ for prices.
- For order questions: state status, items, total.
- For deal questions: state badge name, discount percentage/amount, and expiry if available.
- For review questions: state the overall rating and key feedback points.
- For size questions: present the size guide with conversion info and ask clarifying questions.
- Never invent product names, prices, order data, deals, or coupons.
- Format prices with $ and use bullet points only when listing multiple items.
- When recommending, give 2-3 specific product names with prices and why they match.

Context will follow below. Use it exclusively. If the context does not answer the user's question, say so plainly.`;
}

function buildContextPrompt(
  chunks: Array<{ chunkText: string; metadata: Record<string, unknown>; score: number }>
): string {
  if (chunks.length === 0) {
    return "No relevant context available from the store database.";
  }
  const contextSections = chunks.map((chunk, index) => {
    const sourceType = chunk.metadata?.sourceType as string;
    return `[Context ${index + 1}] (${sourceType}): ${chunk.chunkText}`;
  });
  return "Relevant information from the store:\n\n" + contextSections.join("\n\n");
}

async function dbFallbackSearch(
  query: string,
  userId?: string
): Promise<Array<{ chunkText: string; metadata: Record<string, unknown>; score: number }>> {
  const queryType = classifyQuery(query);
  const q = query.toLowerCase();

  if (queryType === "order" && userId) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return orders.map((order) => {
      const items = order.items
        .map((i) => `${i.quantity}x ${i.product.name} ($${i.price})`)
        .join(", ");
      return {
        chunkText: `Order #${order.id}. Status: ${order.status}. Total: $${order.total}. Items: ${items}. Created: ${order.createdAt.toISOString()}`,
        metadata: { sourceType: "order", orderId: order.id, status: order.status },
        score: 0.7,
      };
    });
  }

  if (queryType === "deal") {
    const deals = await prisma.deal.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      take: 5,
    });
    if (deals.length === 0) {
      return [{
        chunkText: "There are currently no active deals or promotions. Check back soon!",
        metadata: { sourceType: "deal" },
        score: 0.5,
      }];
    }
    return deals.map((deal) => {
      const discountText = deal.type === "percentage" ? `${deal.discount}% off` : `$${deal.discount} off`;
      return {
        chunkText: `${deal.badge}: ${deal.title}. ${discountText}. ${deal.description || ""}. ${deal.expiresAt ? `Expires: ${deal.expiresAt.toISOString()}` : "No expiration date"}`,
        metadata: { sourceType: "deal", title: deal.title, badge: deal.badge, discount: deal.discount.toString() },
        score: 0.8,
      };
    });
  }

  if (queryType === "review") {
    const productsWithReviews = await prisma.product.findMany({
      where: {
        reviews: { some: {} },
      },
      include: {
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      take: 3,
    });
    return productsWithReviews.flatMap((product) =>
      product.reviews.map((review) => ({
        chunkText: `Review for ${product.name}. Rating: ${review.rating}/5. ${review.title ? `"${review.title}." ` : ""}${review.content || ""}. Reviewed by ${review.user.name}.`,
        metadata: { sourceType: "review", productName: product.name, rating: review.rating },
        score: 0.6,
      }))
    );
  }

  if (queryType === "product" || queryType === "recommendation") {
    const sizeKeywords = ["size", "sizing", "fit", "measure", "cm", "us", "eu", "uk", "half size", "heel", "foot"];
    const isSizeQuery = sizeKeywords.some((w) => q.includes(w));
    if (isSizeQuery) {
      return [{
        chunkText: SIZE_GUIDE_TEXT,
        metadata: { sourceType: "size_guide" },
        score: 1.0,
      }];
    }

    const stopWords = ["help", "find", "looking", "tell", "give", "show", "what", "have", "with", "for", "the", "and", "can", "you", "some", "any", "all", "about", "like", "that", "this", "are", "not", "but", "from", "they"];
    const queryWords = q.split(/\s+/).filter((w) => w.length > 2 && !stopWords.includes(w));
    const searchTerms = queryWords.length > 0 ? queryWords : [q];

    const nameMatch = await prisma.product.findMany({
      where: {
        AND: searchTerms.slice(0, 3).map((word) => ({
          OR: [
            { name: { contains: word, mode: "insensitive" } },
            { description: { contains: word, mode: "insensitive" } },
            { category: { contains: word, mode: "insensitive" } },
          ],
        })),
      },
      take: 8,
    });

    const results = nameMatch.length >= 2
      ? nameMatch
      : await prisma.product.findMany({
          where: { featured: true },
          take: 8,
        });

    if (results.length === 0) {
      return [{
        chunkText: SIZE_GUIDE_TEXT,
        metadata: { sourceType: "size_guide" },
        score: 1.0,
      }];
    }

    return results.map((p) => ({
      chunkText: `${p.name}. ${p.description || ""}. Category: ${p.category}. Price: $${p.price}${p.compareAt ? ` (was $${p.compareAt})` : ""}. Sizes: ${p.sizes.join(", ")}. Colors: ${p.colors.join(", ")}. ${p.stock > 0 ? "In stock" : "Out of stock"}.`,
      metadata: {
        sourceType: "product",
        productId: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price.toString(),
      },
      score: 0.6,
    }));
  }

  if (queryType === "general") {
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 3,
    });
    if (blogPosts.length > 0) {
      return blogPosts.map((b) => ({
        chunkText: `${b.title}. ${b.excerpt || ""}`,
        metadata: { sourceType: "blog", slug: b.slug, title: b.title },
        score: 0.5,
      }));
    }
    const deals = await prisma.deal.findMany({
      where: { active: true },
      take: 3,
    });
    if (deals.length > 0) {
      return deals.map((deal) => {
        const discountText = deal.type === "percentage" ? `${deal.discount}% off` : `$${deal.discount} off`;
        return {
          chunkText: `${deal.badge}: ${deal.title}. ${discountText}. ${deal.description || ""}`,
          metadata: { sourceType: "deal", title: deal.title },
          score: 0.4,
        };
      });
    }
  }

  return [];
}

function sendPhase(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  phase: string,
  label: string
) {
  controller.enqueue(
    encoder.encode(`data: ${JSON.stringify({ type: "phase", phase, label })}\n\n`)
  );
}

function sendError(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  message: string
) {
  controller.enqueue(
    encoder.encode(
      `data: ${JSON.stringify({ type: "error", text: message, done: true })}\n\n`
    )
  );
  controller.close();
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
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          sendPhase(controller, encoder, "analyzing", "Analyzing your request...");

          // Generate query embedding
          let queryEmbedding: number[];
          try {
            queryEmbedding = await embedText(query, "RETRIEVAL_QUERY");
            if (!queryEmbedding || queryEmbedding.length === 0) {
              queryEmbedding = new Array(768).fill(0);
            }
          } catch {
            queryEmbedding = new Array(768).fill(0);
          }

          // Generate expanded queries for better recall
          const expandedQueries = expandQuery(query);

          sendPhase(controller, encoder, "searching", "Searching products and inventory...");

          // Fetch vector store candidates — include ALL sourceTypes
          const candidateVectors = await prisma.vectorStore.findMany({
            where: userId
              ? {
                  OR: [
                    { sourceType: { in: ["product", "blog", "deal", "review", "size_guide"] } },
                    { sourceType: "order", userId },
                  ],
                }
              : {
                  sourceType: { in: ["product", "blog", "deal", "review", "size_guide"] },
                },
            select: {
              id: true,
              sourceType: true,
              sourceId: true,
              chunkText: true,
              metadata: true,
            },
            take: 500,
          });

          sendPhase(controller, encoder, "matching", "Finding the best matches...");

          // Keyword score using original + expanded queries
          const keywordScored = candidateVectors
            .map((v) => {
              let maxKwScore = keywordMatchScore(query, v.chunkText);
              for (const eq of expandedQueries) {
                const score = keywordMatchScore(eq, v.chunkText);
                if (score > maxKwScore) maxKwScore = score;
              }
              return { ...v, kwScore: maxKwScore };
            })
            .filter((v) => v.kwScore > 0.02)
            .sort((a, b) => b.kwScore - a.kwScore)
            .slice(0, 30);

          // Fetch top 30 embeddings for semantic scoring
          const topIds = keywordScored.map((v) => v.id);
          const embeddingRecords = topIds.length > 0
            ? await prisma.vectorStore.findMany({
                where: { id: { in: topIds } },
                select: { id: true, embedding: true },
              })
            : [];

          const embeddingMap = new Map(embeddingRecords.map((r) => [r.id, r.embedding]));

          // Final scoring — hybrid semantic + keyword (RRF-style)
          const scoredChunks = keywordScored
            .map((v) => {
              const embedding = embeddingMap.get(v.id) ?? [];
              const hasValidEmbedding = queryEmbedding.some((n) => n !== 0) && embedding.length > 0;
              const embeddingScore = hasValidEmbedding
                ? cosineSimilarity(queryEmbedding, embedding)
                : 0;
              const semanticWeight = embeddingScore > 0.2 ? embeddingScore : 0;
              const hybridScore = semanticWeight * 0.6 + v.kwScore * 0.4;
              return { ...v, score: hybridScore, embeddingScore };
            })
            .filter((v) => v.score > 0.05)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

          let finalChunks = scoredChunks.map((v) => ({
            chunkText: v.chunkText,
            metadata: v.metadata as Record<string, unknown>,
            score: v.score,
          }));

          // Fallback if vector store returns too few results
          if (finalChunks.length < 2) {
            const fallback = await dbFallbackSearch(query, userId);
            if (fallback.length > 0) {
              finalChunks = fallback.slice(0, 8);
            }
          }

          // Attach size guide if relevant
          const sizeKeywords = ["size", "sizing", "fit", "measure", "cm", "us", "eu", "uk", "half size", "heel", "foot"];
          const isSizeQuery = sizeKeywords.some((w) => query.toLowerCase().includes(w));
          if (isSizeQuery && !finalChunks.some((c) => c.metadata?.sourceType === "size_guide")) {
            finalChunks.unshift({
              chunkText: SIZE_GUIDE_TEXT,
              metadata: { sourceType: "size_guide" },
              score: 1.0,
            });
          }

          const contextPrompt = buildContextPrompt(finalChunks);
          const systemPrompt = buildSystemPrompt(query);
          let fullPrompt = `${systemPrompt}\n\n${contextPrompt}\n\n`;

          if (conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-6);
            for (const message of recentHistory) {
              fullPrompt += `${message.role === "user" ? "User" : "Assistant"}: ${message.content}\n`;
            }
          }

          fullPrompt += `User: ${query}\nAssistant:`;

          sendPhase(controller, encoder, "generating", "Crafting your response...");

          let assistantMessage = "";

          try {
            for await (const chunk of generateStream(fullPrompt)) {
              assistantMessage += chunk;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: chunk, done: false })}\n\n`
                )
              );
            }
          } catch (genError: unknown) {
            const err = genError as { status?: number; message?: string };
            if (err.status === 429 || err.message?.includes("quota")) {
              sendError(
                controller,
                encoder,
                "The AI service is temporarily overloaded. Please try again in a moment."
              );
              return;
            }
            throw genError;
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                text: "",
                done: true,
                fullResponse: assistantMessage,
              })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          sendError(
            controller,
            encoder,
            "I encountered an error while processing your request. Please try again."
          );
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
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 });
  }
}
