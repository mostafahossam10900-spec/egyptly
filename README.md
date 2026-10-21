# Egyptly

Tourists describe their Egypt trip and (in later phases) shape it with a verified human guide, assisted by AI.
**Current state: Phase 1** — foundation, tourist accounts, saved trip requests, English + Arabic. See `docs/CHECKPOINT.md`.

Stack: React 19 + Vite 8 + TypeScript + Tailwind 4 · React Router 8 · Supabase (Auth, Postgres, Row Level Security) · Vitest · Playwright.

## Run locally

Prerequisites: Node.js 22+ (24 LTS installed), Docker Desktop running.

```bash
npm install
npm run db:start      # local Supabase: Postgres, Auth, Mailpit inbox (first run downloads images)
npm run env:local     # writes .env.local from the local stack (public anon key only)
npm run dev           # http://localhost:5173
```

Local email (verification / password reset) is delivered to the **Mailpit** inbox at http://127.0.0.1:54324 — nothing leaves the machine.
Supabase Studio (database UI): http://127.0.0.1:54323.

Without `.env.local` the app runs in **demo mode**: a banner says so, accounts and saving are disabled, and landmarks are read from the bundled reference file.

## Data

- `reference-data/landmarks.mjs` — the 10 governorates → destinations → 283 landmarks transcribed from `Egyptly_Egypt_Landmarks_AR.md`.
- `npm run seed:build` regenerates `supabase/seed.sql` (idempotent upserts); `npm run db:reset` re-applies migrations + seed.
- Coordinates, hours, tickets, travel times and images are intentionally empty (unknown); every landmark is `unverified`.

## Tests

```bash
npm run typecheck
npm test                  # unit: validation, duration, reconciliation, ranking, reference data, i18n completeness
npm run test:integration  # database security against the local stack (ownership, roles, consistency)
npm run test:e2e          # Playwright (Edge) desktop + 375px mobile: signup → email → wizard → edit, reset, Arabic RTL
```

## Docs

`docs/CHECKPOINT.md` (state & next task) · `docs/BACKLOG.md` · `docs/REQUIREMENTS.md` · `docs/DECISIONS.md` · `docs/INTEGRATIONS.md`
