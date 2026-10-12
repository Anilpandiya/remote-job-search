# AI Agent Learning Spine

Ordered track for Anil’s remote Senior FE + Agentic search. Goal: speak and demo like someone shipping agentic product surfaces—not only consuming Copilot. Weekly output: one learning note + one demo commit that can be cited on **Variant B** and in screens.

**Feeds:** resume Variant B (Frontend + Agentic), agentic demo README, agentic interview screens (~30% of weekly apply mix).

---

## Stage map

| Stage | Focus | Typical duration | Primary artifact |
| --- | --- | --- | --- |
| 1 | Agent loop fundamentals | Week 1 | Notes + vocabulary you can whiteboard |
| 2 | Hands-on demo (tools, structure, retries, tracing) | Weeks 2–3 | Commits on agentic demo |
| 3 | Product FE for agents | Weeks 3–4 | Streaming/approval/thread UI in demo |
| 4 | Light depth (RAG vs tools, evals) | Week 5+ | Eval harness sketch + interview depth |

Stages overlap slightly: start Stage 2 as soon as Stage 1 concepts are clear enough to implement; Stage 3 builds on the same demo.

---

## Stage 1 — Agent loop fundamentals

**Concepts:** observe → plan → act → validate; tools vs free-form text; short-term vs long-term memory; planning (single-shot vs multi-step); evals (offline + online); human-in-the-loop (HITL) approval and interrupt.

### Resources (real, well-known)

| Resource | Why |
| --- | --- |
| [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents) | Canonical patterns: workflows vs agents, tool use, orchestration |
| [OpenAI — Agents / function calling guide](https://platform.openai.com/docs/guides/function-calling) | Tool schemas, structured calls, practical API shape |
| [LangChain — Agents conceptual guide](https://python.langchain.com/docs/concepts/agents/) | Shared vocabulary (tools, agent executor, memory)—use for ideas, not dogma |
| [Hugging Face Agents Course](https://huggingface.co/learn/agents-course) | Free structured course; Unit 1–2 for loop + tools |
| [Lilian Weng — LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) | Classic survey: planning, memory, tools |

### Weekly schedule (Week 1)

| Day | Block (~45–60 min) |
| --- | --- |
| Mon | Read Anthropic “Building effective agents”; sketch your POC/demo loop on paper |
| Tue | Tools + structured outputs (OpenAI function-calling or Anthropic tool use docs) |
| Wed | Memory + planning: short notes on what state the UI must show |
| Thu | Evals + HITL: list 3 failure modes and where a human should approve |
| Fri | Learning note + interview talking point; plan Week 2 demo commit |

### Definition of done

- [ ] Can explain observe → plan → act → validate without slides
- [ ] Can name tools, memory, planning, evals, HITL and give one product example each
- [ ] Week-1 learning note committed under `docs/` (see `agent-learning-week-1-note.md`)
- [ ] One interview line ready: “In the agent POC, the loop was X; the risky step was Y, so we gated Z”

### Variant B / interview tie-in

Use Stage 1 language in Variant B project bullets (“tool-using agent loop,” “human approval,” “validated tool results”). In screens, lead with the loop diagram before model brand names.

---

## Stage 2 — Hands-on: build/extend agentic demo

**Concepts:** structured outputs (JSON / Zod / schema), retries and backoff, idempotent tools, tracing (spans, prompt/version tags), fail-closed vs fail-open.

### Resources

| Resource | Why |
| --- | --- |
| [Vercel AI SDK — Agents / tools](https://sdk.vercel.ai/docs/ai-sdk-core/agents) | FE-adjacent TypeScript agent patterns |
| [Vercel AI SDK — Generating structured data](https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data) | Schema-first outputs for UI and tools |
| [OpenTelemetry — Tracing concepts](https://opentelemetry.io/docs/concepts/signals/traces/) | Vendor-neutral tracing vocabulary |
| [LangSmith / Langfuse docs](https://docs.smith.langchain.com/) (or [Langfuse](https://langfuse.com/docs)) | Practical trace UI for LLM calls—pick one |
| Your agentic demo README + architecture diagram | Source of truth for resume claims |

### Weekly schedule (Weeks 2–3)

| Week | Focus |
| --- | --- |
| 2 | Scaffold or extend demo: one tool, structured result, happy path + one retry |
| 3 | Add tracing (request id + tool spans); document failure modes in README |

Daily: 30–45 min code on demo; Fri: learning note + cite commit SHA in log.

### Definition of done

- [ ] End-to-end path: UI → agent loop → ≥1 real tool → validated result back to UI
- [ ] Structured output (schema) on at least one step; invalid output retries or surfaces error
- [ ] Minimal tracing: correlate user turn → model call → tool call
- [ ] README section: architecture diagram + “how to run” + one known limitation
- [ ] Variant B can cite a concrete commit/feature (not only “built a POC”)

### Variant B / interview tie-in

Bullet pattern: “Built tool-using agent loop with structured outputs, retries, and request tracing (Next.js + …).” Be ready to whiteboard where retries live and why tools are idempotent.

---

## Stage 3 — Product FE for agents

**Concepts:** streaming tokens/events; approval gates before side effects; thread/session state UI; optimistic vs confirmed tool results; error recovery and partial failure UX.

### Resources

| Resource | Why |
| --- | --- |
| [Vercel AI SDK — Streaming](https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol) / [useChat](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot) | Streaming chat UX patterns in React |
| [Anthropic — Tool use + human-in-the-loop patterns](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview) | Approval before destructive tools |
| [OpenAI — Realtime / Assistants streaming concepts](https://platform.openai.com/docs/guides/streaming-responses) | Event-stream mental model |
| Product refs (study UX, don’t clone): Cursor chat, ChatGPT canvas, Linear AI, Vercel v0 | What “agent FE” feels like in production |

### Weekly schedule (Weeks 3–4)

| Day theme | Work |
| --- | --- |
| Stream | Token/event stream in UI; loading + stop generation |
| Approve | Gate a tool that mutates state; show pending → approved → executed |
| Thread | Persist thread list + resume; show tool call cards in transcript |
| Recover | Timeout, tool error, and “retry from last good state” paths |
| Fri | Note + screenshot for portfolio / Variant B evidence |

### Definition of done

- [ ] Streaming response visible in the demo UI
- [ ] At least one approval gate before a side-effecting tool
- [ ] Thread or session UI that survives refresh (local or server)
- [ ] Explicit empty / loading / error / partial-failure states
- [ ] 30–60s walkthrough you can narrate in an interview

### Variant B / interview tie-in

This stage is the FE differentiator: “I own the agent product surface—streaming, approvals, thread state—not only the prompt.” Pair with FE design drills (real-time FE, dashboard data layer).

---

## Stage 4 — Light depth: RAG vs tools, eval harness basics

**Concepts:** when to retrieve vs when to call tools; grounding vs action; golden-set evals; rubric vs exact match; regression on prompts/tools; enough depth for interviews, not a research pivot.

### Resources

| Resource | Why |
| --- | --- |
| [LlamaIndex — Understanding agents vs RAG](https://docs.llamaindex.ai/en/stable/understanding/agent/) | Clear RAG + tools framing |
| [OpenAI — Evals](https://platform.openai.com/docs/guides/evals) | Practical eval concepts |
| [Anthropic — Reduce hallucinations / citations patterns](https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) | Grounding and verification mindset |
| [Promptfoo](https://www.promptfoo.dev/docs/intro/) or [DeepEval](https://docs.confident-ai.com/) | Lightweight harness to run a tiny suite |
| [Eugene Yan — Patterns for Building LLM-based Systems](https://eugeneyan.com/writing/llm-patterns/) | Industry patterns survey |

### Weekly schedule (Week 5+)

| Focus | Output |
| --- | --- |
| RAG vs tools decision table for your demo domain | 1 page in learning note |
| 5–10 golden prompts + expected tool or answer shape | `evals/` or markdown fixtures |
| One CI or script command that scores the suite | Documented in README |
| Interview drill: tradeoffs whiteboard (15 min) | Add to interview prep |

### Definition of done

- [ ] Can argue RAG vs tools for 2–3 product scenarios without hand-waving
- [ ] Tiny eval harness: ≥5 cases, runnable locally, one metric you care about
- [ ] Known failure modes listed (stale retrieval, wrong tool, schema drift)
- [ ] Variant B / FAQ: one honest limitation + what you’d ship next

### Variant B / interview tie-in

Screens often ask “how do you know it works?”—point at the harness and a failed case you fixed. Keep claims proportional: light depth, not “built an eval platform.”

---

## Cadence (ongoing)

Every week until Variant B + demo are “honest” for AI-role applies:

1. **Learn** — follow the current stage resources (3–5 focused hours).
2. **Note** — one weekly note in `docs/` (copy structure from week-1 note).
3. **Commit** — one demo commit you can cite (feature, not chore-only).
4. **Log** — row in [`agent-learning-log.md`](./agent-learning-log.md): date, focus, commit, interview talking point.
5. **Feed materials** — update Variant B bullets / project blurb when a DoD checkbox lands.

### Resume Variant B checklist (from this track)

- [ ] Loop language in project bullets (tools, validate, HITL)
- [ ] Concrete demo features: structured outputs, retries, tracing
- [ ] FE product signals: streaming, approval gates, thread UI
- [ ] Eval / quality sentence if Stage 4 done
- [ ] Link or path to demo README + walkthrough

### Stop / scale rule

Unlock volume **Variant B / AI-role applies** once Stage 2 DoD is met and README exists. Keep Stages 3–4 improving the demo while the 30% AI apply mix runs—do not block Senior FE (Variant A) apps on this track.
