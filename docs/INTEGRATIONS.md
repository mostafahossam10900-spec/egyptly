# Egyptly — Integrations

Last inspected: 2026-10-22. Nothing below is configured yet; the handoff contains no code or credentials.

## Local machine
| Tool | Status | Needed for |
|---|---|---|
| Node.js / npm | **Not installed** (not on PATH, not in standard locations) | Any web implementation |
| Git | **Not installed** | Versioning / checkpoints |
| Docker Desktop | Installed, daemon **not running** | Optional: local Supabase (`supabase start`) |
| Supabase CLI | Not installed | Migrations / local stack |

## Services
| Service | Purpose | Phase | Status | Missing setup |
|---|---|---|---|---|
| Existing Lovable project (pixel-perfect-canvas-6149.lovable.app) | Current demo UI | 1 | **Unverified** — only a public demo URL; no code access | Code export / GitHub repo access |
| GitHub | Code history | 1 | Not configured | Repo URL + access, or permission to `git init` locally |
| Backend (Supabase proposed by PLAN, or existing Lovable backend) | Auth, DB, RLS, storage | 1 | Not configured | Decision (U-01) + project URL & anon key (server-side service key never in client) |
| Email delivery (SMTP / provider) | Verification & reset emails | 1 | Not configured | Provider account + verified sending domain. Supabase's built-in mailer is rate-limited and for testing only. |
| AI API | Planning, chat, image understanding | 3–4 | Not configured | Provider account, billing, spend cap |
| pgvector / RAG | Knowledge base | 4 | Not configured | Verified content |
| Maps / Routes API | Coordinates, travel times | 3+ | Not configured | Provider choice, cost test |
| Booking suppliers | Prices, availability, requests | 5 | Not configured | Partner agreements / API access |
| Payment gateway | Charges, refunds | 5 | Not configured | Legal entity, currency, merchant account |
| Hosting / domain / monitoring | Launch | 5 | Not configured | Explicit approval required |
