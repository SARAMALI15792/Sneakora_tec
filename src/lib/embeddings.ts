import { GoogleGenAI, ApiError } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "[updated]" || !key.startsWith("A")) {
      throw new Error("GEMINI_API_KEY is not set to a valid key");
    }
    geminiClient = new GoogleGenAI({ apiKey: key });
  }
  return geminiClient;
}

export type TaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      if (attempt === maxRetries) throw error;

      if (error instanceof ApiError) {
        const isRateLimit = error.status === 429;
        const isQuota = error.message?.toLowerCase().includes("quota") ?? false;
        if (isRateLimit || isQuota) {
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
      }

      const err = error as { status?: number; message?: string };
      const isRateLimit = err.status === 429;
      const isQuota = err.message?.toLowerCase().includes("quota") ?? false;
      if (isRateLimit || isQuota) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      throw error;
    }
  }
  throw new Error("Unreachable");
}

const EMBEDDING_MODELS = ["gemini-embedding-2", "gemini-embedding-001"];

async function embedWithGemini(
  text: string,
  taskType: TaskType = "RETRIEVAL_DOCUMENT"
): Promise<number[]> {
  let lastError: unknown;

  for (const model of EMBEDDING_MODELS) {
    try {
      const response = await retryWithBackoff(async () => {
        const r = await getGemini().models.embedContent({
          model,
          contents: [text],
          config: { taskType, outputDimensionality: 768 },
        });
        return r;
      });
      const values = response.embeddings?.[0]?.values ?? [];
      if (values.length > 0) return values;
    } catch (err) {
      lastError = err;
      console.warn(`[embedText] Model ${model} failed, trying next:`, err);
    }
  }

  throw lastError;
}

export async function embedText(
  text: string,
  taskType: TaskType = "RETRIEVAL_DOCUMENT"
): Promise<number[]> {
  try {
    return await embedWithGemini(text, taskType);
  } catch (err) {
    console.warn("[embedText] Gemini embedding failed:", err);
    throw err;
  }
}

export interface GenerationConfig {
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

class GenerationError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly isRateLimit: boolean
  ) {
    super(message);
    this.name = "GenerationError";
  }
}

async function* generateStreamWithGemini(
  prompt: string,
  config?: GenerationConfig
): AsyncGenerator<string, void, unknown> {
  const response = await retryWithBackoff(async () => {
    return getGemini().models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: config?.maxOutputTokens ?? 2048,
        temperature: config?.temperature ?? 0.7,
        topP: config?.topP ?? 0.95,
        topK: config?.topK ?? 40,
      },
    });
  });

  for await (const chunk of response) {
    if (chunk.text) yield chunk.text;
  }
}

export async function* generateStream(
  prompt: string,
  config?: GenerationConfig
): AsyncGenerator<string, void, unknown> {
  try {
    yield* generateStreamWithGemini(prompt, config);
  } catch (err) {
    const isApiError = err instanceof ApiError;
    const status = isApiError ? err.status : (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Generation failed";
    const isRateLimit = status === 429 || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate limit");

    throw new GenerationError(message, status, isRateLimit);
  }
}
