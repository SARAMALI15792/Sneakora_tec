import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!ai) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
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

      const err = error as { status?: number; message?: string };
      const isRateLimit = err.status === 429;
      const isQuota = err.message?.includes("quota") ?? false;

      if (isRateLimit || isQuota) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
  throw new Error("Unreachable");
}

export async function embedText(
  text: string,
  taskType: TaskType = "RETRIEVAL_DOCUMENT"
): Promise<number[]> {
  return retryWithBackoff(async () => {
    const response = await getClient().models.embedContent({
      model: "gemini-embedding-2",
      contents: text,
      config: {
        taskType,
      },
    });
    return response.embeddings?.[0]?.values ?? [];
  });
}

export interface GenerationConfig {
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

export async function* generateStream(
  prompt: string,
  config?: GenerationConfig
): AsyncGenerator<string, void, unknown> {
  const response = await retryWithBackoff(async () => {
    return getClient().models.generateContentStream({
      model: "gemini-2.0-flash",
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
    if (chunk.text) {
      yield chunk.text;
    }
  }
}
