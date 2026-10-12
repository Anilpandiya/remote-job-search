import { NextResponse } from "next/server";
import { runAgentLoop } from "@/lib/agent/loop";
import type { AgentRunRequest } from "@/lib/agent/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AgentRunRequest>;
    const result = await runAgentLoop({
      goal: body.goal ?? "",
      company: body.company,
      role: body.role,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Agent run failed";
    const status = message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: message, code: "agent_error" }, { status });
  }
}
