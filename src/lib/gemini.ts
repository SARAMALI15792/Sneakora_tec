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

export async function embedText(
  text: string,
  taskType: TaskType = "RETRIEVAL_DOCUMENT"
): Promise<number[]> {
  const response = await getClient().models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
    config: {
      taskType,
    },
  });

  return response.embeddings?.[0]?.values ?? [];
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
  const response = await getClient().models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      maxOutputTokens: config?.maxOutputTokens ?? 2048,
      temperature: config?.temperature ?? 0.7,
      topP: config?.topP ?? 0.95,
      topK: config?.topK ?? 40,
    },
  });

  for await (const chunk of response) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}