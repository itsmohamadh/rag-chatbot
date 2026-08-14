import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import { sanitizeText } from "./chunking";

export async function generateEmbedding(text: string) {
  const input = sanitizeText(text);

  const { embedding } = await embed({
    model: openai.embeddingModel("text-embedding-3-small"),
    value: input,
  });

  return embedding;
}

export async function generateEmbeddings(texts: string[]) {
  const inputs = texts.map((text) => sanitizeText(text));

  const { embeddings } = await embedMany({
    model: openai.embeddingModel("text-embedding-3-small"),
    values: inputs,
  });

  return embeddings;
}
