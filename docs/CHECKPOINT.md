# Egyptly — Checkpoint

**Date:** 2026-10-22 · **Phase:** 1 complete (local) · **Git:** public GitHub repo (code only)

## Repository
- The public GitHub repo holds **code and docs only**. The source documents (`الفكرة كاملة.md`, `Egyptly_Egypt_Landmarks_AR.md`, the infographic PNG, `Egyptly_Codex_Handoff/` incl. the action-plan PDF) are git-ignored and stay local.
- They were removed from all of `main`'s history before the first push. The original history is kept in the local-only branch `backup/full-history-before-public` — never push it.

## What works (verified by automated tests against the local stack)
| Area | Status | Evidence |
|---|---|---|
| App shell, Egyptly identity (from Lovable demo), responsive layout | Tested-working | E2E desktop 1366px + mobile 375px, no horizontal scroll |
| Tourist / Tour Guide signup choice (guide = "Phase 2" notice, no account created) | Tested-working | E2E (Arabic) |
| Tourist signup (first/last name, email, password), password policy | Tested-working | E2E |
| Email verification with “It’s me” button, resend, expired/used link recovery | Tested-working **locally** (Mailpit) | E2E reads the real email from Mailpit |
| Unconfirmed users cannot log in | Tested-working | E2E |
| Login, logout, password reset by email | Tested-working **locally** | E2E |
| Authorization separate from authentication (profiles.role, tourist-only trip creation, no self-promotion) | Tested-working | DB integration tests |
| Trip ownership enforced by Postgres RLS (read/update/delete/insert/RPC) | Tested-working | DB integration tests + E2E (other user gets "not found") |
| Reference data: 10 governorates, 27 destinations, 283 landmarks (= 283 bullets in source), parent sites, sources, unverified status, unknown operational fields | Tested-working | unit + DB tests |
| 7-step wizard, 22 approved interests, interest-ordered landmarks with reasons, nested sub-sites | Tested-working | E2E |
| Date/traveller/budget validation (client + DB constraints), duration explanation, arrival/departure availability | Tested-working | unit + DB + E2E |
| Destination removal reconciles landmarks visibly (notice + Undo) and in the DB (composite FK cascade) | Tested-working | unit + DB + E2E |
| Save progress, resume after re-login, edit submitted request (returns to draft until saved again) | Tested-working | E2E |
| Dashboard: list, continue/edit, view summary, delete; loading/empty/error+retry states | Tested-working (delete: manual only) | E2E (list/empty), error state seen in a real failure |
| English + Arabic (RTL), 6 more locales registered as "coming in Phase 4" | Tested-working | unit (key/placeholder parity) + E2E |
| Demo mode (no backend configured) | Manually verified in browser | Banner shown, auth disabled |
| Guides / AI pages | Placeholders only — clearly labelled "Soon / Phase 2–4" | — |

## Not done / not claimed
- **No hosted backend.** Everything runs on the local Supabase stack. Live email delivery to real inboxes is **not configured** (needs SMTP provider + domain) → see INTEGRATIONS.md.
- No guide accounts, matching, AI plans, prices, payments or bookings exist.
- English landmark names are drafts (`name_en_reviewed = false`); no landmark is verified for access/opening.
- Images are illustrated placeholders (rights unknown).
- Delete-trip has no automated test (window.confirm dialog); verified only by code review.

## Test results (last full run 2026-10-22)
- `npm run build` (tsc + vite): pass (chunk-size warning only)
- `npm test`: 23/23 pass
- `npm run test:integration`: 15/15 pass
- `npm run test:e2e`: 12/12 pass (6 flows × desktop + mobile, Microsoft Edge)
- `npm run lint` (oxlint): 0 errors, style warnings only (setState-in-effect for loading resets, fast-refresh exports)

## Environment notes
- Installed this session: Node.js 24.20.0 LTS, Git 2.55 (winget, official packages).
- Docker Desktop had crashed on start because of stale socket files; `%LOCALAPPDATA%\Docker\run` was renamed to `run.stale-20261022` (kept, not deleted) and Docker started normally.
- The project lives in OneDrive; `node_modules` syncing can be slow. Consider excluding it or moving the repo outside OneDrive.

## Blockers for "live" (not for local Phase 1)
1. Hosted Supabase project (free tier is enough to start) — needs Mostafa's account + approval.
2. Email provider + verified sending domain for production verification/reset emails.
3. Decision on hosting/domain (not deployed; requires explicit approval).

## Exact next task
**Phase 2, task 2.1:** get the guide acceptance criteria and required documents from Mostafa (DECISIONS U-06). In parallel and unblocked: **2.4/2.5** — admin role + admin landmark management screen (add/review/update landmarks, set verification status and source per landmark), since the schema already supports it.
