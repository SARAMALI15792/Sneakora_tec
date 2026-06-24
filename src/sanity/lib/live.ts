import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "../env";

export const liveClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "previewDrafts",
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
  },
});

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<QueryResponse> {
  return liveClient.fetch<QueryResponse>(query, params, {
    next: { revalidate: 0, tags },
  });
}
