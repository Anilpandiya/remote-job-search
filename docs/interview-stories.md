# Interview STAR Stories — Anil Kumar Pandiya

Grounded in resume facts: Preqin SE III (Pro/Cura, ESG NPM library, Cura MFE, React/TS/Redux/Saga/RxJS, Jest/RTL, GitLab/TeamCity/AWS); iBASEt Solumina (aerospace MES, Lockheed/Airbus); Capgemini GTE; Anthropic agent POC (Next.js + FastAPI + RLGym-style loops). Replace bracketed **[example — replace]** metrics with your real numbers before screens.

---

## 1. Ownership — ESG component library (internal NPM)

**Prompt fit:** “Tell me about a project you owned end-to-end.” / “How do you drive adoption?”

**Situation:** Preqin Pro and Preqin Cura needed consistent ESG-related UI across product teams. Local one-offs would have fragmented design and slowed cross-app feature work.

**Task:** Own the **ESG component library** as an **internal NPM package** so Pro and Cura teams could consume shared primitives/patterns instead of forking UI.

**Action:**
- Defined library vs. product-composite boundaries; versioned releases so consumers could upgrade without big-bang breaks.
- Built reusable ESG-oriented components with typed React/TypeScript APIs and documented usage for consuming teams.
- Published via internal NPM; partnered with design/backend on ESG features that depended on the kit.
- Supported adoption: migration guidance, PR review help, and pilot consumers before wider reuse.

**Result:** Library reused across Pro and Cura product teams for consistent UI and faster feature delivery. **[example — replace: N packages/teams on the library; duplicate UI PRs down ~X%].** You became the owner for shared ESG UI questions.

**Sound bite:** “I didn’t just build components—I owned publish, versioning, and adoption so the ESG library became the default path.”

---

## 2. Cross-team delivery — Preqin Cura micro-frontend

**Prompt fit:** “Describe a cross-team project.” / “How do you balance autonomy and consistency?”

**Situation:** **Preqin Cura** needed independent team shipping for portfolio/platform features while still sharing chrome, auth, and design-system primitives with the broader Preqin FE ecosystem.

**Task:** Deliver Cura on a **micro-frontend architecture** so squads could deploy independently without fracturing UX or auth.

**Action:**
- Aligned with shell/platform partners on contracts: routing, shared deps (React), auth/session handoff, error boundaries.
- Implemented remotes that lazy-load into the shell; kept Redux/Saga/RxJS state local to the remote where possible.
- Coordinated release with **GitLab CI / TeamCity / AWS** paths—feature flags, env promotion, rollback.
- Used the ESG/design-system NPM packages as the consistency layer across remotes.

**Result:** Cura teams could ship on independent cadence while sharing shell, auth, and design-system primitives. **[example — replace: first independent remote deploy; release coupling reduced from monolith train to on-demand].**

**Sound bite:** “We treated the shell contract like an API—versioned, tested, and owned—so MFE autonomy didn’t become UX chaos.”

---

## 3. Production incident — Pro/Cura dashboard after deploy

**Prompt fit:** “Tell me about a production incident.” / “How do you handle production support?”

**Situation:** After a frontend release on Preqin Pro or Cura, a high-traffic research/portfolio view misbehaved for a subset of institutional users (blank panels, stale data, or failed async loads)—support volume rose.

**Task:** Restore trust quickly, root-cause the FE/data-layer failure, and harden CI so the class of bug doesn’t recur.

**Action:**
- Triaged by severity: reproduced by role/flag/browser; checked recent commits, Saga/RxJS request cancelation, and API error rates.
- Mitigated first: rollback or kill-switch while users were impacted (AWS/release process).
- Root-caused the real failure mode from your incident (e.g. race after filter change, selector/schema mismatch, shared-dep mismatch in MFE).
- Added Jest/RTL coverage for the edge path; tightened the GitLab/TeamCity gate; wrote a short incident note for the team.

**Result:** Service restored within **[example — replace: ~30–90 minutes]**; no repeat after the guardrail. Stakeholders got a clear what / when / fix / prevent update.

**Sound bite:** “Mitigate first, then learn—rollback buys time for a real RCA on FinTech UIs.”

---

## 4. Conflict — Library rigor vs. product deadline

**Prompt fit:** “Tell me about a conflict with a peer or stakeholder.”

**Situation:** A PM pushed a one-off custom control for a time-sensitive ESG/platform release on Pro or Cura; folding it into the shared NPM library (or matching its API) threatened the date.

**Task:** Protect long-term consistency across Pro/Cura without blocking the delivery commitment.

**Action:**
- Separated “ship now” from “standardize forever”: thin product wrapper over library primitives for v1, with a tracked ticket to fold the pattern back into the ESG library.
- Framed cost in delivery risk (duplicate a11y bugs, divergent UX, future migration tax)—not dogma.
- Locked a three-way decision (PM, design, FE) with an owner and expiry for the exception.

**Result:** Deadline met with a controlled exception; debt closed in a later sprint. PM relationship stayed collaborative.

**Sound bite:** “I negotiate exceptions with an expiry date and an owner—not silent forks of the design system.”

---

## 5. Mentoring — Raising the React/TS + testing bar

**Prompt fit:** “How have you mentored others?” / “Leadership as an IC?”

**Situation:** Engineers joining Preqin FE work were uneven on TypeScript discipline, Redux-Saga/RxJS patterns, and Jest/RTL expectations for institutional data UIs.

**Task:** Level people up so they could own feature slices on Pro/Cura without you as the permanent implementer.

**Action:**
- Paired on hard spots: Saga races, RxJS cancelation (`switchMap`), empty/error/permission states, table-heavy views.
- Modeled a practical PR bar: types, a11y basics, tests for edge states; showed it in your own PRs.
- Gave stretch ownership: a well-scoped library component or Cura remote page with you as reviewer.

**Result:** Mentees shipped more independently; review cycles shortened. **[example — replace: 2 engineers progressed from assisted PRs to owning features in ~1–2 quarters].**

**Sound bite:** “Mentoring means transferring ownership—pairing until they open the PR without me driving.”

---

## 6. Performance — Heavy Pro/Cura data UI

**Prompt fit:** “Tell me about a performance win.”

**Situation:** A Preqin research or portfolio view with large tables/filters felt sluggish—expensive re-renders when Redux/Saga/RxJS updates landed.

**Task:** Improve responsiveness without a rewrite, keeping filter/sort UX intact for institutional users.

**Action:**
- Profiled (React Profiler / Performance): unnecessary re-renders, wide selectors, full-list DOM cost.
- Applied targeted fixes: memoized selectors, virtualization/windowing, debounced filters, Saga/RxJS cancelation of stale requests, leaner derived state.
- Validated on realistic dataset sizes before calling it done.

**Result:** **[example — replace: interaction latency ~800ms → ~200ms; fewer freeze tickets].** Pattern reused on sibling views.

**Sound bite:** “Measure first—usually selectors and list rendering, not ‘rewrite the stack.’”

---

## 7. Testing / CI — Jest/RTL + GitLab/TeamCity/AWS

**Prompt fit:** “How do you think about testing?” / “Describe CI/CD ownership.”

**Situation:** Fast delivery across Pro/Cura (and MFE remotes) meant regressions could escape without a consistent quality bar; pipelines needed to encode “done,” not just build artifacts.

**Task:** Own/drive testing and release hygiene teams would actually follow.

**Action:**
- Standardized **Jest / React Testing Library** for critical components, selectors, and Saga-adjacent logic; smoke/e2e for highest-risk paths.
- Wired lint/typecheck/test into **GitLab CI** and **TeamCity**; blocked merges on red checks; AWS-backed deploy/release discipline.
- Documented must-test states for FinTech UIs: empty, loading, error, entitlement-denied, large datasets.
- Fixed flakes instead of skipping them.

**Result:** Higher confidence for independent MFE/package releases; fewer escaped UI defects. **[example — replace: CI gate on N packages; escape rate down ~X% over a quarter].**

**Sound bite:** “CI ownership means the pipeline encodes definition of done—not just green builds.”

---

## 8. Agentic POC collaboration — Anthropic + RLGym-style loop

**Prompt fit:** “Tell me about AI/agent work.” / “Describe an ambiguous POC.”

**Situation:** You built an **Anthropic-facing agent POC**: **Next.js** UI + **Python/FastAPI** with **RLGym-style** observe → plan → act → validate loops—demo pressure, research-adjacent stakeholders, ambiguous scope.

**Task:** Make the agent a usable product surface: visible loop, structured tool calls, HITL validation, honest failure states.

**Action:**
- Owned/co-owned FE: step timeline, streaming/status UX, approval gates for sensitive tools.
- Partnered on contracts with FastAPI: structured tool results, error codes, session/run state.
- Cut scope for demos: one golden path + clear empty/error; captured traces for later eval thinking.
- Named tradeoffs: autonomy vs. approval, tool count vs. reliability, latency vs. transparency.

**Result:** Credible Anthropic-facing demo; concrete agent-UX lessons (transparency, retries, safety) for Variant B interviews.

**Sound bite:** “Agentic FE makes the loop legible—plan, tools, outcomes, and when a human must step in.”

---

## 9. Aerospace / Solumina (iBASEt) — Domain rigor

**Prompt fit:** “Tell me about a prior role.” / “Complex domains?”

**Situation:** As **Senior Member of Technical Staff** at **iBASEt**, you built **Solumina** MES UI (web + Unit Info mobile) for aerospace & defense clients including **Lockheed Martin** and **Airbus**—process-heavy workflows where wrong state is costly.

**Task:** Deliver reliable React UI with Redux-Saga API integration, plus shared NPM packages, under domain/SME scrutiny.

**Action:**
- Modeled manufacturing workflow states explicitly (not only happy path); conservative confirmations where needed.
- Published versioned shared NPM component packages across Solumina surfaces.
- Performance tuning, defect fixing, and deployment support for large enterprise client environments.

**Result:** Production UI for regulated manufacturing clients; habits you still use in FinTech (permissions, state machines, empty/error rigor).

**Sound bite:** “Aerospace taught me UI state machines are safety features—FinTech just changes what ‘wrong’ costs.”

---

## 10. Stretch — Influencing platform investment without title

**Prompt fit:** “Leadership without authority.” / “How do you influence?”

**Situation:** FE platform debt (shared NPM upgrades, inconsistent Saga/RxJS patterns, MFE shared-dep drift) slowed Preqin feature work while roadmap stayed feature-heavy.

**Task:** Get buy-in for a focused investment without eng-manager title.

**Action:**
- Quantified pain: cycle time on shared upgrades, bug themes, duplicate UI across Pro/Cura.
- Proposed a small sequenced RFC (library vNext or one remote migration) with effort/risk and a measurable exit.
- Piloted with a willing squad; demoed before/after to leads.

**Result:** **[example — replace: secured a sprint slice; migrated one consumer; unblocked others].** Established senior-IC influence via evidence.

**Sound bite:** “I influence with a pilot and numbers—not a slide that says ‘we should rewrite.’”

---

## Quick map: story → common prompts

| Theme | Story # |
| --- | --- |
| Ownership | 1, 7, 10 |
| Conflict | 4 |
| Production incident | 3 |
| Mentoring | 5 |
| Cross-team delivery | 2, 8 |
| Performance | 6 |
| Testing / CI | 7 |
| Agentic POC | 8 |
| Domain / prior career | 9 (Solumina); Capgemini GTE as backup for multi-region delivery |

**Practice tip:** Keep each story ~2 minutes spoken. If short on time, lead with Result in one sentence, then expand Action. Fill every **[example — replace]** before a real screen.
