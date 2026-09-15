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

  it("brands the system prompt with Sustainable AI Advisor and dynamic knowledge indexing", () => {
    const prompt = buildSystemPrompt(null, "general climate inquiry");
    expect(prompt).toContain("Sustainable AI Advisor");
    expect(prompt).toContain("Dynamic Knowledge Indexing");
  });

  it("grounds responses in published articles when queried", async () => {
    const response = await queryAIProvider([
      { role: "user", content: "what are the historical climate baseline figures for Nepal" },
    ]);

    expect(response.text).toBeTruthy();
    expect(response.text).toContain("Historical Baseline");
    expect(response.text).toContain("12.66 °C");
  });

  it("politely declines general / off-topic questions unrelated to the Sustainability Lab or climate", async () => {
    const offTopicQueries = [
      "Who won the FIFA World Cup in 2022?",
      "Write python code to invert a binary tree",
      "Can you give me a recipe for chocolate cake?",
      "What is the capital city of France?",
    ];

    for (const query of offTopicQueries) {
      const response = await queryAIProvider([{ role: "user", content: query }]);
      expect(response.text).toContain("Out of Scope • Sustainable AI Advisor");
      expect(response.text).toContain("specialized exclusively in environmental intelligence");
      expect(response.status).toContain("Domain relevance enforced");
    }
  });

  it("answers domain-specific questions about environmental risks and engineering", async () => {
    const response = await queryAIProvider([
      { role: "user", content: "what are the flood and GLOF mitigation engineering options" },
    ]);

    expect(response.text).toBeTruthy();
    expect(response.text).not.toContain("Out of Scope");
    expect(response.text).toContain("Himalayan Watershed");
  });
});

