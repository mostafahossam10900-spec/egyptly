# Egyptly — project instructions

Start every session by reading, in order:
1. `docs/CHECKPOINT.md` — current state, blockers, exact next task.
2. `docs/BACKLOG.md` — five phases, ordered tasks.
3. `docs/REQUIREMENTS.md` — requirement IDs, sources, acceptance criteria.
4. `docs/DECISIONS.md` — confirmed decisions, reversible assumptions, open questions.
5. `docs/INTEGRATIONS.md` — services and setup status.

Run/test commands are in `README.md` (local Supabase via Docker: `npm run db:start`, `npm run env:local`, `npm run dev`; tests: `npm test`, `npm run test:integration`, `npm run test:e2e`).
Reference data lives in `reference-data/landmarks.mjs`; regenerate the seed with `npm run seed:build`.

Source documents: `الفكرة كاملة.md`, `Egyptly_Egypt_Landmarks_AR.md`, `Egyptly_Codex_Handoff/Egyptly_Codex_Handoff/START_HERE.md` and `docs/Egyptly_Action_Plan_AR.pdf` inside the handoff folder.

Rules:
- Treat مطلوب as required, اقتراح as a proposal, مفتوح as unresolved. Never turn proposals into business rules silently.
- Never invent landmark coordinates, prices, hours, travel times or image rights; unknown stays unknown.
- Never present demo data, AI plans, guides, prices or bookings as real/verified/confirmed.
- Secrets stay server-side; `.env.example` holds names only.
- No paid subscriptions, public deployment, payments or bookings without Mostafa's explicit approval.
- Reply to Mostafa in brief Egyptian Arabic. Update `docs/CHECKPOINT.md` after each slice.
