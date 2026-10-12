import { randomUUID } from "node:crypto";
import { getLlmProvider } from "@/lib/agent/llm";
import { executeTool } from "@/lib/agent/tools";
import type {
  AgentRunRequest,
  AgentRunResponse,
  AgentStep,
  ToolCall,
  ToolName,
} from "@/lib/agent/types";

type PlannedTool = {
  name: ToolName;
  args: Record<string, string>;
};

function step(phase: AgentStep["phase"], title: string, detail: string): AgentStep {
  return { phase, title, detail, at: new Date().toISOString() };
}

function parsePlan(raw: string): { rationale: string; tools: PlannedTool[] } {
  try {
    const parsed = JSON.parse(raw) as {
      rationale?: string;
      tools?: Array<{ name?: string; args?: Record<string, string> }>;
    };
    const tools = (parsed.tools ?? [])
      .filter(
        (t): t is PlannedTool =>
          t.name === "search_knowledge" ||
          t.name === "fetch_company_profile" ||
          t.name === "score_fit",
      )
      .map((t) => ({ name: t.name, args: t.args ?? {} }));

    return {
      rationale: parsed.rationale ?? "Planner returned tools without rationale.",
      tools,
    };
  } catch {
    return {
      rationale: "Planner output was not valid JSON; falling back to default tools.",
      tools: [
        {
          name: "search_knowledge",
          args: { query: "senior frontend engineer remote" },
        },
        {
          name: "score_fit",
          args: {
            role: "Senior Frontend Engineer",
            candidate: "senior React/TypeScript FE",
          },
        },
      ],
    };
  }
}

/**
 * End-to-end agent loop: observe → plan → act → validate.
 * Deterministic enough for demos; LLM and tools are swappable.
 */
export async function runAgentLoop(
  input: AgentRunRequest,
): Promise<AgentRunResponse> {
  const runId = randomUUID();
  const phases: AgentStep[] = [];
  const goal = input.goal.trim();
  const company = input.company?.trim() || "Acme AI";
  const role = input.role?.trim() || "Senior Frontend Engineer";

  if (!goal) {
    throw new Error("Goal is required");
  }

  // OBSERVE
  phases.push(
    step(
      "observe",
      "Observe",
      `Captured goal, company (${company}), and role (${role}).`,
    ),
  );

  // PLAN
  const llm = getLlmProvider();
  const planRaw = await llm.complete([
    {
      role: "system",
      content:
        'Return JSON {"rationale": string, "tools":[{"name":"search_knowledge"|"fetch_company_profile"|"score_fit","args":{}}]}',
    },
    {
      role: "user",
      content: `goal: ${goal}\ncompany: ${company}\nrole: ${role}`,
    },
  ]);
  const planned = parsePlan(planRaw);
  const plan: ToolCall[] = planned.tools.map((tool, index) => ({
    id: `call_${index + 1}`,
    name: tool.name,
    args: tool.args,
  }));

  phases.push(
    step(
      "plan",
      "Plan",
      `${planned.rationale} Selected ${plan.length} tool(s) via ${llm.name} provider.`,
    ),
  );

  // ACT
  const toolResults = [];
  for (const call of plan) {
    const result = await executeTool(call);
    toolResults.push(result);
  }
  phases.push(
    step(
      "act",
      "Act",
      `Executed ${toolResults.length} tool call(s); ${toolResults.filter((r) => r.ok).length} succeeded.`,
    ),
  );

  // VALIDATE
  const scoreResult = toolResults.find((r) => r.name === "score_fit" && r.ok);
  const score =
    typeof scoreResult?.data.score === "number" ? scoreResult.data.score : null;
  const checks = [
    {
      id: "has-goal",
      label: "Goal present",
      passed: goal.length >= 8,
      note: goal.length >= 8 ? "Goal is specific enough to act on." : "Goal too short.",
    },
    {
      id: "tools-ok",
      label: "Tools succeeded",
      passed: toolResults.length > 0 && toolResults.every((r) => r.ok),
      note:
        toolResults.length === 0
          ? "No tools ran."
          : toolResults.every((r) => r.ok)
            ? "All tool calls returned ok."
            : "One or more tools failed.",
    },
    {
      id: "fit-score",
      label: "Fit score available",
      passed: score !== null && score >= 70,
      note:
        score === null
          ? "score_fit did not return a score."
          : `Fit score ${score}/100 ${score >= 70 ? "meets" : "misses"} threshold.`,
    },
  ];
  const passed = checks.every((c) => c.passed);
  phases.push(
    step(
      "validate",
      "Validate",
      passed
        ? "Validation passed; composing final briefing."
        : "Validation found gaps; briefing includes remediation notes.",
    ),
  );

  const strengths =
    (scoreResult?.data.strengths as string[] | undefined)?.join("; ") ??
    "See tool traces.";
  const risks =
    (scoreResult?.data.risks as string[] | undefined)?.join("; ") ??
    "Re-run with a sharper goal.";

  const answer = [
    `## Briefing for ${role} @ ${company}`,
    "",
    `**Goal:** ${goal}`,
    `**Provider:** ${llm.name}`,
    `**Fit score:** ${score ?? "n/a"}`,
    "",
    `**Strengths:** ${strengths}`,
    `**Watch-outs:** ${risks}`,
    "",
    passed
      ? "Ready to tailor Variant A/B bullets and apply."
      : "Tighten the goal or re-run after fixing failed checks.",
  ].join("\n");

  phases.push(step("done", "Done", "Agent loop complete."));

  return {
    runId,
    phases,
    plan,
    toolResults,
    validation: { passed, checks },
    answer,
    provider: llm.name,
  };
}
