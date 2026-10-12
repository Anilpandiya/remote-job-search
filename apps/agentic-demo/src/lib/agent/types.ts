export type AgentPhase = "observe" | "plan" | "act" | "validate" | "done";

export type ToolName = "search_knowledge" | "fetch_company_profile" | "score_fit";

export type ToolCall = {
  id: string;
  name: ToolName;
  args: Record<string, string>;
};

export type ToolResult = {
  callId: string;
  name: ToolName;
  ok: boolean;
  summary: string;
  data: Record<string, unknown>;
};

export type AgentStep = {
  phase: AgentPhase;
  title: string;
  detail: string;
  at: string;
};

export type AgentRunRequest = {
  goal: string;
  company?: string;
  role?: string;
};

export type AgentRunResponse = {
  runId: string;
  phases: AgentStep[];
  plan: ToolCall[];
  toolResults: ToolResult[];
  validation: {
    passed: boolean;
    checks: Array<{ id: string; label: string; passed: boolean; note: string }>;
  };
  answer: string;
  provider: "mock" | "openai";
};

export type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LlmProvider = {
  readonly name: "mock" | "openai";
  complete(messages: LlmMessage[]): Promise<string>;
};
