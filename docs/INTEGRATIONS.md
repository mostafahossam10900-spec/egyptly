# Egyptly — Integrations

Last updated: 2026-10-22.

## Local machine
| Tool | Status |
|---|---|
| Node.js 24.20.0 / npm 11.19 | Installed (winget) |
| Git 2.55 | Installed; local repo, **no remote** |
| Docker Desktop 4.91 (engine 29.8, arm64) | Running (stale socket fix applied, see CHECKPOINT) |
| Supabase CLI 2.121 | Project dev dependency (`npx supabase`) |
| Microsoft Edge | Used by Playwright (`channel: msedge`) |

## Services
| Service | Purpose | Phase | Status | Missing setup to go live |
|---|---|---|---|---|
| Supabase — **local** stack | Auth, Postgres, RLS, Mailpit inbox | 1 | **Configured & tested locally** | — |
| Supabase — hosted project | Real accounts/data on the internet | 1→ | **Not configured** | Create project (free tier OK) under the team's account → `supabase link` → `supabase db push --include-seed` → set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`; set Auth Site URL + redirect URLs; upload the two email templates (`supabase/templates`) in Auth settings; enable "Confirm email". |
| Email delivery (SMTP) | Verification & password reset to real inboxes | 1 | **Not configured** — local emails go to Mailpit only | SMTP provider account (e.g. Resend / Postmark / SES), a domain with SPF/DKIM verified, credentials set in Supabase Auth → SMTP. Supabase's built-in mailer is for testing only (rate-limited). |
| GitHub | Remote history / collaboration | 1 | Not configured | Repo URL + access; then `git remote add origin … && git push`. |
| Lovable demo | Visual identity reference only | — | Read-only reference (public URL) | Code not used. |
| Hosting + domain | Public site | 5 (or demo) | Not configured — **requires explicit approval** | Host choice (static hosting is enough for the SPA), domain, env vars. |
| Storage (private guide documents) | Guide verification | 2 | Disabled in local config | Enable `[storage]` in `supabase/config.toml`; private bucket + policies. |
| AI API | Planning, chat, images | 3–4 | Not configured | Provider account, billing, spend cap. |
| Maps / routes | Coordinates, travel times | 3+ | Not configured | Provider choice + cost test; verified data. |
| Booking suppliers | Prices, availability | 5 | Not configured | Partner agreements / API access. |
| Payment gateway | Charges, refunds | 5 | Not configured | Legal entity, currency, merchant account. |
