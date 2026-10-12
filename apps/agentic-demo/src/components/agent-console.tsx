"use client";

import { useState } from "react";
import type { AgentRunResponse } from "@/lib/agent/types";

type UiState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "error"; message: string }
  | { status: "ready"; data: AgentRunResponse };

const phaseAccent: Record<string, string> = {
  observe: "border-sky-300 bg-sky-50 text-sky-950",
  plan: "border-amber-300 bg-amber-50 text-amber-950",
  act: "border-violet-300 bg-violet-50 text-violet-950",
  validate: "border-emerald-300 bg-emerald-50 text-emerald-950",
  done: "border-slate-300 bg-slate-50 text-slate-800",
};

export function AgentConsole() {
  const [goal, setGoal] = useState(
    "Assess fit for a remote senior FE role with agentic product surfaces",
  );
  const [company, setCompany] = useState("Cursor");
  const [role, setRole] = useState("Senior Frontend Engineer");
  const [state, setState] = useState<UiState>({ status: "idle" });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState({ status: "running" });
    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, company, role }),
      });
      const json = (await response.json()) as AgentRunResponse & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(json.error ?? "Agent run failed");
      }
      setState({ status: "ready", data: json });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6"
        aria-labelledby="run-heading"
      >
        <h2
          id="run-heading"
          className="font-display text-xl font-semibold text-slate-950"
        >
          Run the agent loop
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Observe → plan → act → validate. Tools and the LLM provider are mocked
          by default; swap via env vars (see README).
        </p>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-800">Goal</span>
            <textarea
              required
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-800">Company</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="min-h-10 rounded-md border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-800">Role</span>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="min-h-10 rounded-md border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={state.status === "running"}
          className="mt-5 min-h-11 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          {state.status === "running" ? "Running loop…" : "Start agent"}
        </button>
      </form>

      {state.status === "error" ? (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
          <p className="font-semibold">Agent run failed</p>
          <p className="mt-1 text-sm">{state.message}</p>
        </div>
      ) : null}

      {state.status === "running" ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-6 text-slate-600"
        >
          Observing context and executing tools…
        </div>
      ) : null}

      {state.status === "ready" ? (
        <div className="space-y-6">
          <section aria-labelledby="trace-heading">
            <h2
              id="trace-heading"
              className="font-display text-lg font-semibold text-slate-950"
            >
              Phase trace
            </h2>
            <ol className="mt-3 space-y-2">
              {state.data.phases.map((phase, index) => (
                <li
                  key={`${phase.phase}-${index}`}
                  className={`rounded-lg border px-3 py-3 text-sm ${phaseAccent[phase.phase] ?? phaseAccent.done}`}
                >
                  <div className="font-semibold uppercase tracking-wide">
                    {phase.title}
                  </div>
                  <p className="mt-1 opacity-90">{phase.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="tools-heading" className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 id="tools-heading" className="font-semibold text-slate-900">
                Tool plan
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {state.data.plan.map((call) => (
                  <li key={call.id} className="rounded-md bg-slate-50 px-3 py-2">
                    <div className="font-medium">{call.name}</div>
                    <pre className="mt-1 overflow-x-auto text-xs text-slate-600">
                      {JSON.stringify(call.args, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">Validation</h3>
              <p className="mt-1 text-sm text-slate-600">
                Provider: <code>{state.data.provider}</code> ·{" "}
                {state.data.validation.passed ? "Passed" : "Needs attention"}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {state.data.validation.checks.map((check) => (
                  <li
                    key={check.id}
                    className={`rounded-md px-3 py-2 ${
                      check.passed
                        ? "bg-emerald-50 text-emerald-950"
                        : "bg-amber-50 text-amber-950"
                    }`}
                  >
                    <span className="font-medium">
                      {check.passed ? "Pass" : "Fail"} · {check.label}
                    </span>
                    <div className="opacity-90">{check.note}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            aria-labelledby="answer-heading"
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h3 id="answer-heading" className="font-semibold text-slate-900">
              Final briefing
            </h3>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
              {state.data.answer}
            </pre>
          </section>
        </div>
      ) : null}
    </div>
  );
}
