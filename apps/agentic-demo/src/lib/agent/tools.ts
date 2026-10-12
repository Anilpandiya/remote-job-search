import type { ToolCall, ToolName, ToolResult } from "@/lib/agent/types";

type ToolHandler = (args: Record<string, string>) => Promise<ToolResult["data"]>;

const catalog: Record<ToolName, { description: string; run: ToolHandler }> = {
  search_knowledge: {
    description: "Search a mock knowledge index for role/company signals.",
    async run(args) {
      const query = args.query ?? "";
      return {
        query,
        hits: [
          {
            title: "Frontend platform hiring themes",
            snippet:
              "Teams emphasize typed design systems, accessible dashboards, and ownership of release quality.",
          },
          {
            title: "Agentic product UI patterns",
            snippet:
              "Streaming traces, approval gates, and tool-result validation are common interview and product topics.",
          },
        ],
      };
    },
  },
  fetch_company_profile: {
    description: "Fetch a mock company profile used for fit scoring.",
    async run(args) {
      const company = args.company ?? "Unknown Co";
      return {
        company,
        segment: "AI-native developer tools / FinTech product",
        stackHints: ["React", "TypeScript", "design systems", "agent UX"],
        remote: true,
        notes:
          "Demo profile only — replace with CRM/ATS or public filings connector in production.",
      };
    },
  },
  score_fit: {
    description: "Score candidate fit from gathered context.",
    async run(args) {
      const role = (args.role ?? "").toLowerCase();
      const base = role.includes("agent") || role.includes("ai") ? 86 : 81;
      return {
        score: base,
        strengths: [
          "Senior React/TypeScript delivery",
          "Design-system and accessibility fluency",
          "Agent loop product surface experience",
        ],
        risks: [
          "Tailor narrative to JD keywords before applying",
          "Confirm remote policy and interview loop depth",
        ],
      };
    },
  },
};

export function listTools() {
  return Object.entries(catalog).map(([name, meta]) => ({
    name,
    description: meta.description,
  }));
}

export async function executeTool(call: ToolCall): Promise<ToolResult> {
  const tool = catalog[call.name];
  if (!tool) {
    return {
      callId: call.id,
      name: call.name,
      ok: false,
      summary: `Unknown tool: ${call.name}`,
      data: {},
    };
  }

  try {
    const data = await tool.run(call.args);
    return {
      callId: call.id,
      name: call.name,
      ok: true,
      summary: `${call.name} completed`,
      data,
    };
  } catch (error) {
    return {
      callId: call.id,
      name: call.name,
      ok: false,
      summary: error instanceof Error ? error.message : "Tool failed",
      data: {},
    };
  }
}
