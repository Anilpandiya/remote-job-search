# Meridian Insights (FE flagship)

Senior Frontend portfolio demo: a FinTech-style portfolio insights dashboard with a typed API layer, accessible interactive UI, and RTL tests.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Vitest + React Testing Library

## Architecture

```
src/
  app/api/portfolio     → JSON route handler (swap for real BFF)
  lib/api/client.ts     → typed fetch surface used by UI
  lib/types.ts          → shared domain types
  components/           → accessible dashboard primitives
```

UI components call `api.getPortfolioSnapshot()` only. Transport can move from the local route handler to an external API without rewriting presentation code.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43121](http://127.0.0.1:43121).

```bash
npm test
npm run build
```

## What this demonstrates

- Explicit loading / error / retry states
- Keyboard-friendly filters and semantic table markup
- Testable presentation (filter behavior covered in RTL)
- Senior ownership patterns: typed boundaries, empty/error paths, deployable slice
