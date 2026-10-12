import { describe, expect, it } from "vitest";
import { runAgentLoop } from "@/lib/agent/loop";

describe("runAgentLoop", () => {
  it("walks observe → plan → act → validate → done", async () => {
    const result = await runAgentLoop({
      goal: "Prepare a fit brief for a remote senior frontend role",
      company: "Example AI",
      role: "Senior Frontend Engineer, Agentic Products",
    });

    expect(result.phases.map((p) => p.phase)).toEqual([
      "observe",
      "plan",
      "act",
      "validate",
      "done",
    ]);
    expect(result.plan.length).toBeGreaterThan(0);
    expect(result.toolResults.every((r) => r.ok)).toBe(true);
    expect(result.validation.passed).toBe(true);
    expect(result.answer).toContain("Briefing");
    expect(result.provider).toBe("mock");
  });

  it("rejects empty goals", async () => {
    await expect(runAgentLoop({ goal: "   " })).rejects.toThrow(/required/i);
  });
});
