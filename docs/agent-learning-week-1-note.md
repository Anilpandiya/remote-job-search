# Week 1 Learning Note — Agent Loop Fundamentals

**Date:** 2026-10-12 (Week of Oct 12)  
**Stage:** 1 — Agent loop fundamentals ([spine](./agent-learning-spine.md))  
**Goal this week:** Own the vocabulary and a whiteboardable loop so Variant B and screens stay honest while the demo scaffolds.

---

## Concepts (what to internalize)

### 1. The loop

```
observe → plan → act → validate → (repeat or stop)
```

| Step | Meaning in a product agent | FE implication |
| --- | --- | --- |
| Observe | User message + tool results + UI/app state | Show context the model “sees” (or a summary) |
| Plan | Choose next action or finish | Optional: show plan/steps before side effects |
| Act | Call a tool or return an answer | Tool cards in the transcript; pending states |
| Validate | Check schema, permissions, business rules | Errors, retries, human approval |

**Interview one-liner:** “The agent isn’t magic—it’s a loop that observes state, plans a step, acts through tools, and validates before the UI treats the result as truth.”

### 2. Tools

- Tools are **typed side doors**: name, JSON schema (inputs), deterministic or external effect, structured result.
- Prefer tools over stuffing everything into the prompt when the model must **do** something (fetch, write, search API).
- Bad tool design: huge free-text blobs, non-idempotent writes with no confirmation, silent failures.

### 3. Memory

| Kind | Typical use | Product risk |
| --- | --- | --- |
| Short-term | Current thread / turn history | Context window bloat; UI must truncate carefully |
| Long-term | User prefs, prior tasks, retrieved docs | Stale or wrong memory → wrong actions |
| Scratch / working | Plan steps mid-run | Must be visible or discardable on cancel |

For Week 1: treat **thread messages + last tool results** as short-term memory; defer vector memory until Stage 4.

### 4. Planning

- **Single-shot:** one model call → answer or one tool (simpler, easier to eval).
- **Multi-step:** model may chain tools; needs budgets (max steps), stop conditions, and clear UI for “still working.”
- Anthropic’s guidance: start with the simplest workflow that works; escalate to autonomous loops only when needed.

### 5. Evals (preview)

Even before a harness: write 3–5 **golden scenarios** (“user asks X → expect tool Y with args Z”). Stage 4 turns these into a runnable suite.

### 6. Human-in-the-loop (HITL)

Gate anything that: mutates production data, spends money, sends external messages, or can’t be undone easily. UI pattern: **pending approval → user confirms → execute tool → show result**.

---

## Exercises (do these this week)

### Exercise A — Whiteboard your loop (30 min)

Draw the loop for the Anthropic/RLGym-style POC or the new agentic demo:

1. What is observed each turn?
2. Which steps are model vs deterministic code?
3. Where does validation happen (schema, auth, business rules)?
4. Where would you put an approval gate?

**Done when:** you can redraw it from memory in under 3 minutes.

### Exercise B — Tool spec on paper (30 min)

Pick **one** tool the demo will have (e.g. `search_docs`, `run_eval_step`, `update_task`).

Write:

- Name + one-sentence purpose  
- Input JSON schema (3–6 fields max)  
- Success result shape  
- Failure modes (timeout, not found, invalid args)  
- Idempotent? yes/no — if no, how HITL helps  

**Done when:** a teammate could implement the handler from your spec alone.

### Exercise C — Failure modes list (20 min)

List **three** failure modes and the product response:

| Failure | User-visible behavior | Retry / HITL? |
| --- | --- | --- |
| Model returns invalid JSON | … | … |
| Tool times out | … | … |
| Model wants a destructive tool | … | … |

### Exercise D — Read + distill (45–60 min)

Read (at least skim with notes):

1. [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents)  
2. Tool-use docs for your stack ([Anthropic tool use](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview) or [OpenAI function calling](https://platform.openai.com/docs/guides/function-calling))

Capture **5 bullets** in your own words (paste below after reading):

1. …
2. …
3. …
4. …
5. …

Optional stretch: first unit of the [Hugging Face Agents Course](https://huggingface.co/learn/agents-course).

---

## What to commit on the agentic demo (Week 1)

Week 1 is mostly fundamentals—keep the commit **small but real** so the learning log and Variant B have evidence.

**Minimum commit (pick one path):**

1. **Scaffold:** app shell + README stub with architecture diagram placeholder + “agent loop” section describing observe → plan → act → validate.  
2. **Or extend POC:** one clearly named module/file for the loop (even if tools are mocked) + comment or types for `ToolCall` / `ToolResult`.

**Commit message pattern:**

```text
feat(agent): scaffold loop types and README architecture stub
```

**After commit:** paste SHA + one-line summary into [`agent-learning-log.md`](./agent-learning-log.md).

**Explicitly defer to Week 2+:** full streaming UX, production tracing vendor, RAG, multi-agent.

---

## Interview talking point gained (draft)

> “I’ve been shipping an agentic demo around a classic observe → plan → act → validate loop. Tools are schema-constrained; validation and human approval sit in front of side effects. This week I locked the vocabulary and scaffolded the loop so the UI can show plan, tool calls, and failures—not just a chat transcript.”

Tighten after Exercises A–C; reuse on Variant B project blurb.

---

## Definition of done — Week 1

- [ ] Exercises A–C complete (D distill bullets filled)
- [ ] Learning note reviewed (this file)
- [ ] Demo commit landed (scaffold or loop types)
- [ ] Log row updated in `agent-learning-log.md`
- [ ] Variant B: ready to add “tool-using agent loop” language once README stub exists

**Next week (Stage 2 kickoff):** implement one real (or faithfully mocked) tool with structured output + one retry path; see spine Stage 2 DoD.
