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

const MIN_RELEVANCE_SCORE = 0.20;

const DEPARTMENT_CONTACTS = `
- People Operations (employment status, leave, HR records): people-ops@nightshift.dev
- Payroll & Benefits (pay, health insurance, 401k): payroll@nightshift.dev
- IT & Security (equipment, accounts, security incidents): it-security@nightshift.dev
- Legal & Compliance (contracts, IP, open-source approval): legal@nightshift.dev
- Workplace Relations (harassment, discrimination, ethics): workplace-relations@nightshift.dev
- Finance (expenses, stipends, invoices): finance@nightshift.dev
- Facilities (office access, safety, shipping): facilities@nightshift.dev
- General / unsure which team: help@nightshift.dev
`.trim();

const tools = {
  searchKnowledgeBase: tool({
    description:
      "Search the internal knowledge base for relevant information. Always use this before answering any question that could relate to company policy, benefits, or internal process — never answer from memory.",
    inputSchema: z.object({
      query: z.string().describe("The search query to find relevant documents"),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 3, MIN_RELEVANCE_SCORE);

        if (results.length === 0) {
          return "NO_RESULTS: No sufficiently relevant information was found in the knowledge base for this query. Do not answer from general knowledge. Tell the user you don't have this information and direct them to the appropriate department contact.";
        }

        const formattedResults = results
          .map((r, i) => `[${i + 1}] ${r.content}`)
          .join("\n\n");

        return formattedResults;
      } catch (error) {
        console.error("Search Error:", error);
        return "SEARCH_ERROR: The knowledge base could not be searched right now. Do not answer from general knowledge. Tell the user there was a technical issue and direct them to the appropriate department contact.";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

const SYSTEM_INSTRUCTIONS = `You are the internal company assistant for Night Shift, Inc. You answer employee questions about company policy, benefits, and internal process using ONLY the internal knowledge base.

STRICT RULES — follow these exactly:

1. For any question that could relate to company policy, benefits, process, or internal systems, you MUST call searchKnowledgeBase before answering. Never answer such questions from memory or general knowledge, even if you are confident you know the answer.

2. Base your answer strictly on the content returned by searchKnowledgeBase. Do not add facts, numbers, policy details, or assumptions that are not explicitly present in the search results. If the search results only partially answer the question, answer only the part that is supported and say the rest is not covered.

3. If searchKnowledgeBase returns "NO_RESULTS" or "SEARCH_ERROR", or if the returned content does not actually answer the user's question, do NOT guess or improvise. Instead:
   - Tell the user plainly that you don't have that information in the knowledge base.
   - Direct them to the correct department using the directory below, based on the topic of their question.
   - Give the exact email address. Do not invent a different contact.

4. Small talk, greetings, or questions clearly unrelated to Night Shift (e.g. "what's 2+2") do not require a search — answer those directly and briefly.

5. Never fabricate a citation, policy number, dollar figure, or contact that did not come from the search results or the directory below.

6. Keep answers concise and specific to what was asked. Do not dump all retrieved content back to the user.

DEPARTMENT DIRECTORY (use for escalation when you cannot answer from the knowledge base):
${DEPARTMENT_CONTACTS}

Example of a correct response when the knowledge base has no answer:
"I don't have information about that in the knowledge base. For questions about [topic], please reach out to [Department] at [email]."`;

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();

  try {
    const result = streamText({
      model: openai("gpt-4o-mini"),
      instructions: SYSTEM_INSTRUCTIONS,
      messages: await convertToModelMessages(messages),
      tools,
      // Allow one retry with a reformulated query before answering —
      // useful when the first search phrasing misses.
      stopWhen: stepCountIs(3),
      temperature: 0.2, // less improvisation, more literal grounding
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
