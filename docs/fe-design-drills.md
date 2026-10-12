# FE System Design Drills — Anil Kumar Pandiya

Five prompts you can rehearse out loud (30–45 min each). Outlines mirror Preqin-scale FinTech FE + agentic POC instincts. Practice structure: **clarify → constraints → architecture → deep dives → tradeoffs → failure modes**.

---

## Drill 1 — Design a design system / component library

### Prompt
Design a shared React/TypeScript component library for a multi-product FinTech company (like Preqin Pro + adjacent apps). Multiple MFE teams must consume it. How do you structure, version, document, and roll it out?

### Clarify first
- Consumers: web only? dark theme? SSR/Next vs CSR MFE host?
- Scope: primitives only vs. charts/data-grid composites?
- Design partnership: tokens from Figma? who owns a11y bar?
- Distribution: monorepo package, private npm, Module Federation shared?

### Outline to rehearse

1. **Layering**
   - Foundations: tokens (color, space, type), themes, icons.
   - Primitives: Button, Input, Select, Modal, Tooltip.
   - Patterns: FilterBar, DataTable shell, FormField (composites that encode FinTech UX).
   - Rule: products compose; library avoids product copy.

2. **API design**
   - Typed props, variant enums, `asChild`/slot patterns sparingly.
   - Accessibility: keyboard, focus trap, ARIA; storybook a11y addon as gate.
   - Controlled vs uncontrolled consistency; no leaking internal store.

3. **Tooling**
   - Storybook (or equivalent) as contract + visual QA.
   - Unit tests (RTL) for behavior; visual regression optional later.
   - Lint + `tsc` in CI; changeset/semver for releases.

4. **Versioning & adoption**
   - Semver; codemods or migration notes for majors.
   - Peer deps on React; align versions with MFE shell shared deps.
   - Pilot 1–2 apps → measure adoption → deprecate local forks.

5. **Governance**
   - Contribution RFC for new components; “exception with expiry” for one-offs.
   - Design + FE office hours; ownership rota for bugs.

### Tradeoffs to name
- Monorepo speed vs. independent publish cadence.
- Headless (Radix-style) + styled vs. opinionated styled kit.
- Rich DataTable in library vs. product-owned (often product-owned past a point).

### Failure modes
- Library becomes a junk drawer; breaking majors without migration path; a11y bolted on late.

### Tie to your experience
Preqin **ESG component library** as internal NPM, Pro/Cura consumers, design partnership, publish/versioning path.

---

## Drill 2 — Micro-frontend shell / host architecture

### Prompt
Design the host shell for a FinTech platform where squads ship independent remotes (portfolio, news, contacts, etc.). Cover routing, auth, shared state, dependency sharing, and deploy isolation.

### Clarify first
- Team topology and release independence needs.
- Auth: SSO cookie vs. bearer; org/user context.
- Perf budget for first paint; SEO needs (often low for logged-in Pro apps).
- Failure isolation: one remote crash must not white-screen shell.

### Outline to rehearse

1. **Shell responsibilities**
   - Chrome: nav, search, user menu, notifications.
   - Auth session bootstrap; route → remote map.
   - Global error boundary + remote-level boundaries.
   - Telemetry hooks (page views, web vitals).

2. **Integration model**
   - Module Federation / native federation / import maps—pick one and justify.
   - Shared singletons: `react`, `react-dom`, router, auth client.
   - Version matrix CI to catch incompatible remotes.

3. **Routing**
   - Shell owns top-level routes; remotes own nested routes.
   - Deep links + browser back; loading fallbacks per remote.
   - Feature flags at route level for canaries.

4. **Cross-remote communication**
   - Prefer URL + server state over global event buses.
   - Thin shared context: user, entitlements, theme—typed, versioned.
   - Avoid Redux mega-store across remotes; local state per remote (RxJS/Redux inside remote OK).

5. **Deploy & rollback**
   - Independent remote artifacts; shell pins or ranges compatible remotes.
   - Canary by user cohort; instant rollback of remote URL/version.
   - Contract tests: shell renders remote stub with mock shared context.

### Tradeoffs to name
- Independence vs. UX consistency (design system helps).
- Shared deps reduce bundle size but couple upgrade trains.
- iframe isolation (strong sandbox, weak UX/perf) vs. federation.

### Failure modes
- Duplicate React instances; auth race on remote mount; cascading deploy breaks.

### Tie to your experience
**Preqin Cura** MFE delivery, shell/auth contracts, GitLab/TeamCity/AWS release path, ESG NPM library as consistency layer.

---

## Drill 3 — Dashboard data layer (FinTech)

### Prompt
Design the frontend data layer for a research/analytics dashboard: large tables, multi-filter facets, saved views, entitlements, and frequent API evolution. Users expect snappy filter→table updates.

### Clarify first
- Data size: hundreds vs. hundreds of thousands of rows?
- Freshness: request/response vs. polling vs. push?
- Permissions: field-level or export-level entitlements?
- Offline? (usually no for FinTech Pro).

### Outline to rehearse

1. **API boundary**
   - Typed client (OpenAPI/zod/tRPC-style); normalize errors.
   - Query keys: `['funds', filters, sort, page]` (TanStack Query mental model even if you used Redux/RxJS).
   - Server-driven pagination/sort/filter for large sets; client filter only for small cached sets.

2. **State split**
   - **Server state:** cache, stale-while-revalidate, retries, dedupe.
   - **UI state:** column visibility, panel open, selection—local/URL.
   - **URL as source of truth** for shareable filtered views.

3. **Derived data**
   - Memoized selectors; avoid storing derived arrays in Redux.
   - Redux-Saga / RxJS (your stack): filter debounce → `switchMap` / take-latest Saga pattern; cancel stale.

4. **Entitlements & empty states**
   - Gate columns/actions from permission claims; distinct UI for “no access” vs. “no data.”
   - Skeleton + error retry with correlation id for support.

5. **Performance**
   - Virtualized table; stable row ids; avoid re-render of whole grid on hover.
   - Prefetch adjacent pages; defer secondary widgets (charts) until primary table settles.

6. **Evolution**
   - Feature-flag new fields; tolerant readers; versioned DTO adapters on the FE edge.

### Tradeoffs to name
- Redux vs. React Query vs. RxJS-heavy: pick by team literacy and async complexity.
- Client mega-fetch vs. chatty server: FinTech tables usually server-driven.
- Saved views in FE localStorage vs. backend (backend wins for multi-device).

### Failure modes
- Race: slow response overwrites newer filter; unbounded cache memory; entitlement leaks in UI.

### Tie to your experience
Pro/Cura dashboards, Redux/Saga/RxJS, performance work on heavy grids, Jest/RTL for empty/error/permission states.

---

## Drill 4 — Real-time frontend

### Prompt
Design a real-time FE for live updates: e.g. market/news ticks, collaboration presence, or job/agent run progress. Cover transport, reconnection, backpressure, and UI consistency with REST snapshots.

### Clarify first
- Latency SLO? volume (msgs/sec)? ordering guarantees?
- Multi-tab? mobile battery constraints?
- Auth on socket? who fans out events (FE directly to bus vs. BFF)?

### Outline to rehearse

1. **Transport choice**
   - WebSocket for bi-directional / high frequency.
   - SSE for server→client streams (simpler auth through HTTP).
   - Short polling as fallback/degraded mode.

2. **Connection lifecycle**
   - Connect after auth; exponential backoff + jitter; visible “live / reconnecting / offline” indicator.
   - Heartbeats; resume with `lastEventId` or snapshot-then-subscribe.

3. **State merge**
   - Initial REST snapshot → apply ordered deltas.
   - Idempotent event ids; buffer during reconnect; invalidate and resnapshot if gap detected.
   - Separate “live buffer” from render store; batch UI updates (rAF / 100–250ms) under high volume.

4. **Backpressure & perf**
   - Drop or coalesce noisy events (e.g. keep latest price per id).
   - Virtualize lists of live rows; pause updates when tab hidden (`document.visibilityState`).

5. **Security**
   - Scope channels by entitlement; never trust client-side filter alone for secrets.
   - Rotate tokens; reconnect on 401.

6. **Testing**
   - Fake clock + event fixtures; chaos: reorder, dupes, disconnect mid-flight.

### Tradeoffs to name
- Push complexity vs. polling simplicity (start polling if SLO allows).
- Client merge logic vs. BFF that emits UI-ready patches.
- Global socket vs. per-feature connections.

### Failure modes
- Duplicate rows on resume; UI storm from per-message setState; silent stale “live” badge.

### Tie to your experience
RxJS stream discipline, dashboard freshness, agent POC step streaming as a related pattern.

---

## Drill 5 — Agentic tool-calling product UI (bonus depth)

### Prompt
Design the frontend for an agent that can call tools (search, code, CRM, internal APIs). Users need to see the loop, approve sensitive actions, recover from failures, and evaluate quality over time. (Maps to your Anthropic / RLGym-style POC + Next.js + FastAPI.)

### Clarify first
- Autonomy level: auto vs. approval gates?
- Sync vs. long-running jobs (seconds vs. minutes)?
- Single user thread vs. shared workspace?
- Compliance: what must be logged/auditable?

### Outline to rehearse

1. **Core objects**
   - Thread / run / step / tool_call / tool_result / final_answer.
   - Explicit run state machine: `queued → planning → tool_exec → awaiting_approval → completed | failed | cancelled`.

2. **UX surfaces**
   - Composer + context chips (files, entities).
   - Timeline: plan summary, each tool call expandable (args, latency, status).
   - Streaming tokens with interrupt/cancel.
   - Approval modal for side-effecting tools (show diff/args, allow edit/deny).

3. **FE ↔ API contract**
   - SSE/WebSocket events for step updates; REST for thread CRUD and resume.
   - Idempotent `clientRunId`; FastAPI owns tool execution sandbox.
   - Structured errors: `tool_timeout`, `policy_blocked`, `model_overloaded`.

4. **Safety & trust**
   - Human-in-the-loop for write tools; allowlist tools by role.
   - Redact secrets in timeline; confirm destructive ops.
   - “What will happen” preview before approve.

5. **Evals feedback loop**
   - Thumbs + reason codes on answers; store trace id for offline eval.
   - Golden-path fixtures for CI (mock model/tools); latency/cost dashboards later.

6. **Resilience**
   - Retry failed tools with user-visible attempt count; partial progress preserved.
   - Rehydrate thread after refresh; never lose in-flight approval state.

### Tradeoffs to name
- Full autonomy (fast, risky) vs. step approval (slow, safe).
- Show raw tool JSON (power users) vs. humanized summaries (majority).
- Chat metaphor vs. workflow/canvas for multi-step agents.

### Failure modes
- Black-box spinner with no tool visibility; approval UI that blocks forever; unreadable traces when demos fail.

### Tie to your experience
Anthropic-facing POC, Next.js + FastAPI, RLGym-style observe→plan→act→validate, stakeholder demos under ambiguity.

---

## Rehearsal checklist (use every drill)

1. Restate requirements + non-goals (2 min).
2. Draw boxes: client, BFF/API, data stores, external services.
3. Walk happy path, then permissions, then failure/reconnect.
4. Call out 2–3 tradeoffs with your recommendation.
5. End with metrics: latency, error rate, adoption, eval score—as relevant.
6. Map one story from `interview-stories.md` so design and behavioral reinforce each other.
