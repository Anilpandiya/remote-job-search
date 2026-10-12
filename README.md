# Portfolio demos — Senior FE + Agentic

Two shippable demos for Anil Kumar Pandiya’s remote Senior Frontend / Frontend+Agentic search:

| App | Path | Port | Purpose |
| --- | --- | --- | --- |
| **Meridian Insights** | [`apps/fe-flagship`](./apps/fe-flagship) | `43121` | FinTech insights dashboard: typed API layer, accessible UI, RTL tests |
| **Scout Loop** | [`apps/agentic-demo`](./apps/agentic-demo) | `43122` | Observe → plan → act → validate agent loop with mock LLM swap point |

## Quick start

```bash
# FE flagship
cd apps/fe-flagship
npm install
npm run dev
# http://127.0.0.1:43121

# Agentic demo (separate terminal)
cd apps/agentic-demo
npm install
npm run dev
# http://127.0.0.1:43122
```

## Verify

```bash
cd apps/fe-flagship && npm test && npm run build
cd apps/agentic-demo && npm test && npm run build
```

## Project write-ups

One-pagers for resume/portfolio live in the Project store (`docs/project-fe-flagship.md`, `docs/project-agentic-demo.md`).
