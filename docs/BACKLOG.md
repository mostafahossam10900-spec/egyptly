# Egyptly — Backlog

Order matters inside each phase. `→` = depends on.

## Phase 1 — Foundation, tourist accounts, saved trip requests
**Blocked on U-01 (existing code?) and a local Node.js + Git toolchain.**

| # | Task | Depends on |
|---|---|---|
| 1.0 | Inspect existing code if provided; classify features as tested-working / demo-only / missing / unverified; snapshot | U-01 |
| 1.1 | Toolchain: Node LTS, Git, project init (or open existing repo); first commit as checkpoint | 1.0 |
| 1.2 | App shell: routing, layout, theme tokens (navy/teal/terracotta/cream), header/nav with disabled "Guides — Phase 2" / "AI — Phase 3–4" | 1.1 |
| 1.3 | i18n: EN + AR catalogs, `dir` switch, Intl formatting, locale registry with 6 future locales marked "not available" | 1.2 |
| 1.4 | Backend wiring: env config, `.env.example`, explicit demo-mode banner when not configured | 1.1 |
| 1.5 | Schema migration: profiles (role), governorates, destinations, landmarks (type, parent, source_url, access_status, last_verified_at, unknown operational fields), interests, trips, trip_destinations, trip_interests, trip_landmarks | 1.4 |
| 1.6 | RLS / access policies: reference data read-only public; trips owner-only; trigger/constraint rejects landmarks outside trip destinations | 1.5 |
| 1.7 | Reference data: structured JSON transcribed from LMK + repeatable idempotent import script; count check | 1.5 |
| 1.8 | Auth: signup (Tourist/Guide choice), verify email, resend, login, logout, forgot/reset password, route guards | 1.4, 1.3 |
| 1.9 | Wizard steps 1–3 (destinations, 22 interests, landmarks with interest ordering + reconciliation notice) | 1.6, 1.7 |
| 1.10 | Wizard steps 4–6 (dates/duration explanation/travellers, trip type & companions, budget) with validation | 1.9 |
| 1.11 | Draft autosave + resume; step 7 review & save as "trip request" | 1.10 |
| 1.12 | Dashboard: saved trips list, open/edit, delete; empty/loading/error/retry | 1.11 |
| 1.13 | Tests: unit (validation, duration, reconciliation), DB policy test (user B ≠ user A), E2E wizard EN + AR, mobile + desktop | 1.12 |
| 1.14 | Update CHECKPOINT, INTEGRATIONS; Egyptian Arabic summary | 1.13 |

## Phase 2 — Guides, verification, matching, requests, messaging
| # | Task | Depends on |
|---|---|---|
| 2.1 | Collect guide acceptance criteria & documents from Mostafa (U-06) | — |
| 2.2 | Guide signup + profile (languages+level, regions, specialties, style, group size) | Phase 1, 2.1 |
| 2.3 | Private document storage (owner + admin only) | 2.2 |
| 2.4 | Admin role, verification queue, approve/reject with audit log | 2.3 |
| 2.5 | Admin landmark management (add/review/update, verification dates) | 2.4 |
| 2.6 | Guide availability calendar & price fields | 2.2 |
| 2.7 | Matching: hard filters (language, region, verified, available) + explained ranking; tests | 2.4, 2.6 |
| 2.8 | Tourist compares guides, sends request; guide accepts/declines | 2.7 |
| 2.9 | Messaging between tourist and guide (per request) | 2.8 |

## Phase 3 — AI itinerary planning
| # | Task | Depends on |
|---|---|---|
| 3.1 | Resolve U-02, U-03, U-04, U-05 | — |
| 3.2 | Deterministic checks library: days, time windows, budget arithmetic, estimate labels | 3.1 |
| 3.3 | AI provider + spend cap (approval needed) | 3.1 |
| 3.4 | Planner (understanding → plan → review loop, bounded) producing "draft plan" | 3.2, 3.3 |
| 3.5 | Revisions; tourist approval; guide confirmation/reshaping | 3.4, Phase 2 |

## Phase 4 — Chatbot, AI Tour Guide, languages
| # | Task | Depends on |
|---|---|---|
| 4.1 | Verified knowledge base + RAG index | Content sourcing |
| 4.2 | Chatbot (text + image) grounded on KB, admits uncertainty | 4.1 |
| 4.3 | AI Tour Guide; in-site routes only with verified maps/positions | 4.1, U-10 |
| 4.4 | IT, ES, DE, RU, UK, TR translations with human review | Phase 1 i18n |

## Phase 5 — Options, booking, payments, launch
| # | Task | Depends on |
|---|---|---|
| 5.1 | Options research with sourced, timestamped prices | Integrations |
| 5.2 | Booking state machine + supplier requests | 5.1, U-08 |
| 5.3 | Payments, refunds, commissions, idempotency, financial log (test mode first) | U-08 |
| 5.4 | Notifications, verified reviews | 5.2 |
| 5.5 | Backups, domain, hosting, monitoring, launch (approval required) | All |
