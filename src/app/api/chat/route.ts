import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  InferUITools,
  stepCountIs,
  streamText,
  tool,
  toUIMessageStream,
  UIDataTypes,
  UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import z from "zod";
import { searchDocuments } from "@/modules/chat/actions/search";

const tools = {
  searchKnowledgeBase: tool({
    description: "Search the knowledge base for relevant information",
    inputSchema: z.object({
      query: z.string().describe("The search query to find relevant documents"),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 3, 0.5);

        if (results.length == 0) {
          return " No relevant information found in the knowledge base";
        }

        const formattedResults = results
          .map((r, i) => `[${i + 1}] ${r.content}`)
          .join("\n\n");

        return formattedResults;
      } catch (error) {
        console.error("Search Error:", error);
        return "Error searching the knowledge base";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();

  try {
    const result = streamText({
      model: openai("gpt-4o-mini"),
      instructions:
        "you're a helpful assistant with access to a knowledge base. When users ask questions, search the knowledge base for relevant information. Always search before answering if the question might relate to uploaded documents. Base your answers on the search results when available. Give concise answers that correctly answer what the user is asking for. Do not flood them with all the information from the search results.",
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });

    result.usage.then((usage) =>
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      }),
    );

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("Error Streaming Text:", error);
    return new Response("Failed to stream text", { status: 500 });
  }
}
