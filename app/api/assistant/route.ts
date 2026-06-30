import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai-assistant/system-prompt";
import { getLocalAssistantReply } from "@/lib/ai-assistant/local-assistant";
import { countRecentFallbacks } from "@/lib/ai-assistant/fallback-responses";

export const runtime = "nodejs";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type RequestBody = {
  message: string;
  history?: ChatMessage[];
};

type AssistantResponse = {
  reply: string;
  suggestions: { label: string; productSlug: string }[];
  source: "openai" | "local";
};

function isValidHistory(history: unknown): history is ChatMessage[] {
  if (!Array.isArray(history)) return false;
  return history.every(
    (m) =>
      typeof m === "object" &&
      m !== null &&
      (m as ChatMessage).role &&
      ["user", "assistant"].includes((m as ChatMessage).role) &&
      typeof (m as ChatMessage).content === "string"
  );
}

/**
 * Calls the OpenAI Responses API with the system prompt + conversation
 * history. Returns the plain-text reply, or throws on any failure so the
 * caller can fall back to the local assistant.
 */
async function getOpenAIReply(message: string, history: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("No OpenAI API key configured");
  }

  const input = [
    ...history.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      instructions: buildSystemPrompt(),
      input,
      max_output_tokens: 600,
    }),
    // Guard against a hanging upstream call blocking the chat indefinitely.
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  // The Responses API returns an `output` array of items; find the first
  // message item and concatenate its text content parts.
  const outputItems = Array.isArray(data?.output) ? data.output : [];
  const messageItem = outputItems.find((item: { type?: string }) => item?.type === "message");
  const textParts = Array.isArray(messageItem?.content) ? messageItem.content : [];
  const text = textParts
    .filter((part: { type?: string }) => part?.type === "output_text")
    .map((part: { text?: string }) => part?.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Empty response from OpenAI");
  }

  return text;
}

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  const history = isValidHistory(body.history) ? body.history.slice(-12) : [];

  // Try OpenAI first if a key is configured; never let a failure crash the
  // request — always degrade gracefully to the local assistant.
  if (process.env.OPENAI_API_KEY) {
    try {
      const reply = await getOpenAIReply(message, history);
      const payload: AssistantResponse = {
        reply,
        suggestions: [],
        source: "openai",
      };
      return NextResponse.json(payload);
    } catch (error) {
      console.error("[assistant] OpenAI call failed, falling back to local assistant:", error);
    }
  }

  const local = getLocalAssistantReply(message, history, countRecentFallbacks(history));
  const payload: AssistantResponse = {
    reply: local.reply,
    suggestions: local.suggestions,
    source: "local",
  };
  return NextResponse.json(payload);
}
