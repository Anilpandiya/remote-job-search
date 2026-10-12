# Meridian Insights — FE flagship

**Repo path:** `apps/fe-flagship`  

**Stack:** Next.js App Router · TypeScript · Tailwind · Vitest + React Testing Library  
**Local:** `cd apps/fe-flagship && npm run dev` → http://127.0.0.1:43121

## Problem

Senior Frontend interviews and applications need a standalone product slice—not a todo app—that shows architecture ownership: typed boundaries, accessible interactive UI, test coverage, and honest loading/error paths. This demo mirrors FinTech insights work (multi-asset book review) without requiring private employer code.

## Architecture

- **Typed API layer** (`src/lib/api/client.ts`) — UI depends on `api.getPortfolioSnapshot()`, not raw `fetch`.
- **Route handler data** (`src/app/api/portfolio`) — swappable for a real BFF; shared domain types in `src/lib/types.ts`.
- **Accessible dashboard** — semantic table, filter `aria-pressed`, focus rings, loading/error/retry states.
- **Tests** — RTL covers asset-class filtering; unit tests cover format helpers.

## What senior ownership looks like

- Clear module boundaries so transport can change without rewriting presentation.
- Explicit empty/error/retry UX instead of silent failures.
- Accessibility treated as part of the feature, not a polish pass.
- Runnable docs: uncommon port, `npm test` / `npm run build` in the app README.

## Resume blurb

Built a deployable FinTech insights dashboard (Next.js/TS) with a typed API client, accessible holdings filters, and RTL coverage—demonstrating senior FE architecture and delivery ownership.
