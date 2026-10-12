import type { LlmMessage, LlmProvider } from "@/lib/agent/types";

/**
 * Swap point for a real LLM.
 *
 * - Default: deterministic mock planner (no API key required).
 * - Set `LLM_PROVIDER=openai` and `OPENAI_API_KEY` to call OpenAI chat completions.
 * - Or implement `LlmProvider` and register it in `getLlmProvider()`.
 */
export function getLlmProvider(): LlmProvider {
  const provider = (process.env.LLM_PROVIDER ?? "mock").toLowerCase();
  if (provider === "openai") {
    return createOpenAiProvider();
  }
  return createMockProvider();
}

function createMockProvider(): LlmProvider {
  return {
    name: "mock",
    async complete(messages: LlmMessage[]): Promise<string> {
      const user = messages.find((m) => m.role === "user")?.content ?? "";
      const companyMatch = /company:\s*(.+)/i.exec(user);
      const roleMatch = /role:\s*(.+)/i.exec(user);
      const company = companyMatch?.[1]?.trim() || "target company";
      const role = roleMatch?.[1]?.trim() || "Senior Frontend Engineer";

      return JSON.stringify({
        rationale: `Mock planner: gather public context for ${company}, then score fit for ${role}.`,
        tools: [
          {
            name: "search_knowledge",
            args: { query: `${company} ${role} frontend engineering` },
          },
          {
            name: "fetch_company_profile",
            args: { company },
          },
          {
            name: "score_fit",
            args: {
              company,
              role,
              candidate: "senior React/TypeScript FE with agentic product experience",
            },
          },
        ],
      });
    },
  };
}

function createOpenAiProvider(): LlmProvider {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "LLM_PROVIDER=openai requires OPENAI_API_KEY. Unset LLM_PROVIDER to use the mock.",
    );
  }

  return {
    name: "openai",
    async complete(messages: LlmMessage[]): Promise<string> {
      const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          messages,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI error ${response.status}: ${text}`);
      }

      const json = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("OpenAI response missing content");
      }
      return content;
    },
  };
}
