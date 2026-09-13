import { NextResponse } from "next/server";
import { getActiveAIConfig, queryAIProvider, type ChatMessage } from "@/lib/ai/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getActiveAIConfig();
  return NextResponse.json({
    provider: config.provider,
    model: config.model,
    isConfigured: config.isConfigured,
    statusMessage: config.statusMessage,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, context, prompt } = body;

    let chatMessages: ChatMessage[] = [];

    if (Array.isArray(messages) && messages.length > 0) {
      chatMessages = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || ""),
      }));
    } else if (prompt) {
      chatMessages = [{ role: "user", content: String(prompt) }];
    } else {
      chatMessages = [
        {
          role: "user",
          content: "Synthesize key environmental risks and recommended actions for this section.",
        },
      ];
    }

    const response = await queryAIProvider(chatMessages, context);

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[/api/ai error]:", err);
    return NextResponse.json(
      {
        text: "Error communicating with AI engine. Using local fallback synthesis.",
        provider: "simulation",
        model: "fallback",
        status: err.message,
      },
      { status: 500 }
    );
  }
}
