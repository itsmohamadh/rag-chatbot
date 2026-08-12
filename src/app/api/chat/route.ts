import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  try {
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      instructions:
        'When providing instructions, avoid suggesting assistance or asking if I can help in any way. Just state the specific information or task you want me to address. For example, instead of saying "How can I assist you?" or "What do you want me to do?", simply give clear directives or ask direct questions without prompting any further engagement.',
      messages: await convertToModelMessages(messages),
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
