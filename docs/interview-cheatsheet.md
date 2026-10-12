# Interview Cheat Sheet — Anil Kumar Pandiya

Quick-reference for screens: Preqin stack decisions, Anthropic POC talking points, coding cadence, mock cadence. Pair with `interview-stories.md` and `fe-design-drills.md`.

---

## 1. Preqin stack decisions (why / when / tradeoff)

Use these as crisp answers when asked “why that choice?”

| Decision | Default stance | Why it fit Preqin-scale FE | Tradeoff / when you’d switch |
| --- | --- | --- | --- |
| **React + TypeScript** | Strong typing at UI/API boundary | FinTech UIs change often; types catch contract drift across MFEs | Extra ceremony on tiny prototypes—still worth it in shared libs |
| **Micro-frontends (Cura)** | Shell + remotes for team autonomy | **Preqin Cura** teams ship independently while sharing shell, auth, design-system primitives | Shared-dep upgrades and UX consistency cost; need NPM library + version matrix |
| **ESG component library (internal NPM)** | Shared ESG UI as versioned internal package | Stops visual/a11y forks across **Preqin Pro** and **Preqin Cura** | Over-centralizing product composites creates bottlenecks—keep composites thin |
| **Redux + Redux-Saga + RxJS** | Redux for app state; Saga for side effects; RxJS for stream cancelation/debounce | Pro/Cura async flows against REST/Mongo-backed services; `switchMap`-style latest-wins | Prefer React Query-style server cache for CRUD-heavy apps with less custom orchestration |
| **Jest / RTL + GitLab / TeamCity / AWS** | lint + `tsc` + unit + critical e2e as merge gates; AWS-backed release | MFE/package independence needs encoded definition of done | Keep e2e thin (top paths) to avoid flake debt |
| **Server-driven tables** | Pagination/sort/filter on API | Market/research datasets too large for full client load | Tiny admin lists can stay client-side |
| **Feature flags / canary** | Decouple deploy from release | Safer FinTech rollouts, instant kill-switch | Flag debt—expiry owners required |
| **URL as filter state** | Shareable dashboard views | Research users share links; back button works | Very large filter objects may need saved-view IDs server-side |

**One-liner architecture:** “Cura shell owns chrome/auth/routing; remotes own features; ESG NPM library owns consistency; GitLab/TeamCity/AWS owns the release bar.”

---

## 2. Anthropic agent POC — decisions & talking points

**Stack:** Next.js (agent product UI) + Python/FastAPI (orchestration/tools) + RLGym-style loop (**observe → plan → act → validate**).

| Decision | Stance | Talking point |
| --- | --- | --- |
| **Next.js for UI** | App Router / React server where it helps; client for live run timeline | Product surface needs routing, auth-ready layout, streaming UX—not a notebook |
| **FastAPI backend** | Tool execution + session/run state off the browser | Keeps secrets/tools server-side; clearer policy enforcement |
| **Explicit loop** | Separate plan / tool_call / validate steps in the model | Debuggable demos; maps cleanly to timeline UI and evals |
| **Structured tool results** | JSON contracts, typed errors | UI can render success/failure without parsing prose |
| **HITL for side effects** | Approval gate on write/destructive tools | Safety > autonomy in early POCs and enterprise sales |
| **Scope cut for demos** | One golden path + honest error states | Credibility beats a flaky multi-tool circus |

### Agentic screen talking points (memorize)

1. **The loop**  
   “User goal → model plans → selects tools → executes → validates against goal → iterates or stops. FE makes each step visible.”

2. **Tradeoffs**  
   - Autonomy vs. approval latency  
   - More tools vs. higher failure surface / prompt confusion  
   - Streaming tokens vs. waiting for structured steps  
   - Chat UI vs. workflow timeline for long runs  

3. **Evals**  
   - Golden traces (fixture tools + expected tool sequences)  
   - Offline scoring: task success, unnecessary tools, latency/cost  
   - Online: thumbs + reason codes tied to `traceId`  
   - “We don’t ship prompt changes without a small regression set.”

4. **Safety**  
   - Tool allowlists by role  
   - Confirmations + arg preview for side effects  
   - Redaction in timeline logs  
   - Server-side policy; never trust the client to “hide” a tool  

5. **Tool-calling UI**  
   - Timeline of steps (not a single spinner)  
   - Expandable tool args/results  
   - Approve / edit / deny  
   - Retry, cancel, resume after refresh  
   - Distinct states: planning, running tool, awaiting approval, failed, done  

**Bridge to Senior FE roles:** “Same skills as complex dashboards—state machines, streaming, empty/error, entitlements—applied to agent runs.”

---

## 3. Coding practice cadence (3–4× / week)

Aim for **45–75 minutes**, timed. Rotate topics; log date + weak spots.

| Day pattern | Focus | Concrete drills |
| --- | --- | --- |
| **A — Hooks & async** | `useEffect` pitfalls, abort/cancel, race conditions | Search box: debounce + ignore stale responses |
| **B — State & data** | Normalized state, selectors, React Query-like cache mental model | Filterable paginated list with loading/error/empty |
| **C — Lists & perf** | Virtualization, memo boundaries, expensive renders | 10k-row table mental model; windowed render |
| **D — Forms & a11y** | Controlled forms, validation, keyboard | Multi-field form with errors announced accessibly |
| **E — TypeScript** | Discriminated unions, narrowing, generics on components | `Result<T,E>` / tool-call union types |
| **F — Mini system** | Compose A–E | Tiny dashboard slice or agent timeline widget |

**Weekly minimum:** 3 sessions (e.g. Mon/Wed/Fri). Add a 4th when an onsite loop is scheduled.

**Sources (pick one and stick):** Frontend-focused timed challenges, TypeScript exercises, or rebuild a small Preqin-like filter→table from scratch without copy-paste.

**Definition of done for a session:** working solution + 3-bullet postmortem (bug, better API, what to drill next).

---

## 4. Mock cadence

| Cadence | Format | Prep |
| --- | --- | --- |
| **1× / week** | Either **FE system design** (use a drill from `fe-design-drills.md`) **or** **behavioral** (2–3 STAR stories timed) | 10 min outline beforehand; 30–40 min mock; 10 min feedback notes |
| **Increase** | When onsite loops start: 2× / week (one design + one behavioral) | Record yourself if no partner |

**Rotation suggestion**

- Week 1: Behavioral (ownership + conflict)  
- Week 2: Design — component library  
- Week 3: Behavioral (incident + mentoring)  
- Week 4: Design — MFE shell  
- Week 5: Design — dashboard data layer  
- Week 6: Behavioral (agentic POC) + skim real-time / agent UI drills  

**Feedback rubric:** structure clarity, tradeoffs named, metrics/results, time control, questions asked to interviewer.

---

## 5. 60-second self-intro (customize)

> “I’m a frontend engineer with 9+ years—Software Engineer III at Preqin on Pro and Cura. I own React/TypeScript delivery, an ESG component library as internal NPM, Cura’s micro-frontend architecture, and testing/CI with Jest/RTL plus GitLab/TeamCity/AWS. Earlier I shipped Solumina MES UI at iBASEt for aerospace clients. I’ve also built an Anthropic-facing agent POC with Next.js and FastAPI—making the agent loop and tool calls usable and safe. I’m looking for a remote Senior Frontend role where I can own platform-quality UI—and where agentic product work is a plus.”

---

## 6. Day-of screen checklist

- [ ] 2 STAR stories warmed (ownership + incident or conflict)  
- [ ] 1 design drill sketch reviewed (boxes + tradeoffs)  
- [ ] POC loop + safety + evals talking points  
- [ ] 1–2 real metrics filled in (replace **[example — replace]** in stories)  
- [ ] Questions for them: FE platform ownership, design system maturity, how they evaluate AI features  

---

## File map

| Artifact | Path |
| --- | --- |
| STAR stories | `docs/interview-stories.md` |
| FE design drills | `docs/fe-design-drills.md` |
| This cheat sheet | `docs/interview-cheatsheet.md` |
