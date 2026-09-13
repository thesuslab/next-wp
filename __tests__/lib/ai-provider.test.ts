import { describe, it, expect } from "vitest";
import {
  queryAIProvider,
  buildSystemPrompt,
  getActiveAIConfig,
} from "@/lib/ai/provider";

describe("AI Intelligence Provider & Grounding", () => {
  it("builds a comprehensive system prompt embedding KĀRVA Shop and anti-truncation rules", () => {
    const prompt = buildSystemPrompt(null, "what can you do for me");

    expect(prompt).toContain("The Sustainability Lab");
    expect(prompt).toContain("Maharajgunj");
    expect(prompt).toContain("https://shop.sustainabilitylab.xyz/");
    expect(prompt).toContain("No Broken Tables");
    expect(prompt).toContain("Never Cut Off");
    expect(prompt).not.toContain("<br>");
  });

  it("responds with a polished, complete breakdown for 'what can you do for me' including KĀRVA Shop", async () => {
    const response = await queryAIProvider([
      { role: "user", content: "what can you do for me" },
    ]);

    expect(response.text).toBeTruthy();
    expect(response.text).toContain("How The Sustainability Lab Can Support You");
    expect(response.text).toContain("Intelligence & Open Knowledge Hub");
    expect(response.text).toContain("KĀRVA — The Sustainability Lab Shop");
    expect(response.text).toContain("https://shop.sustainabilitylab.xyz/");
    expect(response.text).not.toContain("<br>");
    expect(response.text).not.toContain("<br/>");
    // Ensure no unclosed markdown tables
    expect(response.text).not.toMatch(/\|\s*•/);
  });

  it("responds with KĀRVA Shop details and link when asked about karva or materials", async () => {
    const response = await queryAIProvider([
      { role: "user", content: "tell me about KĀRVA shop and materials" },
    ]);

    expect(response.text).toBeTruthy();
    expect(response.text).toContain("KĀRVA — The Sustainability Lab Shop");
    expect(response.text).toContain("https://shop.sustainabilitylab.xyz/");
    expect(response.text).toContain("Shorea Robusta");
  });
});
