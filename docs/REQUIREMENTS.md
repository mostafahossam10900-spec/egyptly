# Egyptly — Requirements

Sources (keys used below):
- **IDEA** = `الفكرة كاملة.md` (product vision; its own legend: مطلوب = required, اقتراح = proposal, مفتوح = open).
- **LMK** = `Egyptly_Egypt_Landmarks_AR.md` (10 governorates, landmarks, sources, usage limits).
- **PLAN** = `Egyptly_Action_Plan_AR.pdf` (12-step execution plan; tools are *proposals*).
- **START** = `Egyptly_Codex_Handoff/START_HERE.md` (handoff rules).
- **P1** = Phase 1 brief from Mostafa (2026-10-22 session) — approved scope for Phase 1.

Status values: `required` (explicitly approved) · `proposal` (needs discussion; not a business rule) · `open` (unresolved — see DECISIONS.md).
Implementation status lives in CHECKPOINT.md, not here.

---

## Phase 1 — Foundation, tourist accounts, saved trip requirements

### Foundation / UX
| ID | Requirement | Source | Status | Acceptance criteria |
|---|---|---|---|---|
| F-01 | Keep and improve the Egyptly visual identity (navy / teal / terracotta / cream, as in the infographic & demo) | P1, IDEA §9 | required | Palette and typography applied consistently; no rebrand. |
| F-02 | Responsive mobile + desktop experience | P1, IDEA §3 | required | All Phase 1 screens usable at 375px and ≥1280px without horizontal scroll. |
| F-03 | Screens: Home, auth, tourist dashboard, trip creation, saved trips, trip review/edit | P1 | required | Each route reachable from navigation and works end-to-end. |
| F-04 | Navigation placeholders for Guides and AI that are clearly labelled "coming in a later phase" and are not functional | P1 | required | No placeholder implies a working service; labels say "Coming soon / Phase N". |
| F-05 | Accessible forms; loading, empty, error, retry states | P1 | required | Labels tied to inputs; errors announced (aria-live); keyboard reachable; every async view has loading/empty/error+retry. |

### Accounts & permissions
| ID | Requirement | Source | Status | Acceptance criteria |
|---|---|---|---|---|
| A-01 | Signup choice Tourist / Tour Guide at top of signup | IDEA §2, P1 | required | Both shown; choosing Guide explains guide onboarding arrives in Phase 2 and does not create a guide account. |
| A-02 | Tourist signup with first name, last name, email, password | IDEA §3 | required | Validated fields; duplicate-email state handled. |
| A-03 | Email verification ("It's me" link) before account is usable | IDEA §3 | required | Unverified user cannot reach dashboard; verification link activates account. |
| A-04 | Time-limited link, resend verification, states: email in use / expired link / send failure | IDEA §3 | proposal (adopted for P1 by P1 brief: resend required) | Resend works; expired link shows recovery path. |
| A-05 | Login, logout, password reset | P1 | required | Reset email → new password → login works. |
| A-06 | Never store plaintext passwords; use established auth service | IDEA §3, P1 | required | Passwords only handled by the auth provider (hashed). |
| A-07 | Trip ownership enforced on server/DB (RLS or equivalent), not only UI | P1, PLAN step 5 | required | Automated test: user B cannot read/update/delete user A's trip via the API. |
| A-08 | Authentication separate from authorization (roles: tourist now; guide/admin later) | P1, PLAN step 5 | required | Role stored in profile table; policies check role/ownership independently of login state. |

### Destinations & landmarks
| ID | Requirement | Source | Status | Acceptance criteria |
|---|---|---|---|---|
| D-01 | Import the 10 governorates with nested areas and landmarks from LMK | P1, LMK | required | Repeatable import script; counts match LMK. |
| D-02 | Distinguish tourist destinations (e.g. Hurghada, Dahab, Siwa, North Coast) from administrative governorates | IDEA §4أ, LMK | required | Data model has `governorate` and `destination/area` levels; UI cards are destinations. |
| D-03 | Preserve parent-site relationships (e.g. Tutankhamun tomb → Valley of the Kings) | LMK | required | `parent_landmark_id` populated for LMK sub-site sections; sub-sites not shown as independent visits by default. |
| D-04 | Ordering must not be presented as an official tourism ranking | LMK | required | No "top/most visited" wording. |
| D-05 | Store source URLs and verification status per record | LMK | required | `source_url`, `access_status` (default `unverified`), `last_verified_at` (null). |
| D-06 | No invented coordinates, prices, hours, travel times, image rights | LMK, P1 | required | Those fields null/"unknown" and shown as unknown. |
| D-07 | Landmark type classification (archaeological, museum, religious, reserve, beach, diving, heritage area, modern landmark …) | LMK | required | Every landmark has a type. |
| D-08 | Licensed imagery when available, otherwise honest placeholders | P1, IDEA §4أ | required | No unlicensed photos; placeholder clearly decorative. |

### Trip wizard
| ID | Requirement | Source | Status | Acceptance criteria |
|---|---|---|---|---|
| W-01 | Step 1: choose one or more destinations | IDEA §4أ | required | Multi-select; ≥1 required. |
| W-02 | Step 2: exactly the 22 approved interests (list below) | IDEA §4ب | required | Exactly these 22, EN + AR labels from IDEA table. |
| W-03 | Step 3: select/remove/add landmarks within chosen destinations | IDEA §4ج | required | Only landmarks of chosen destinations selectable. |
| W-04 | Landmark ordering influenced by interests; show reason it appears | IDEA §4ج | required (ordering) / proposal (reason, approx. time) | Interest→type mapping documented as an assumption; no invented durations. |
| W-05 | Step 4: arrival/departure dates, available times when relevant, traveler count | IDEA §4د, P1 | required | Departure ≥ arrival; no past arrival; count integer ≥1. |
| W-06 | Duration calculation explained; arrival/departure-day visit availability explicit | P1, IDEA §4د (open) | required | UI shows formula and user's choice whether arrival/departure days count. |
| W-07 | Step 5: trip type/time available (incl. Day trip, Layover) and companions (incl. Family) | IDEA §4ب, §4د | required | Day trip / Layover only under trip type; Family only under companions. |
| W-08 | Step 6: budget amount, currency, per-person vs group, included cost categories | IDEA §4د, P1 | required | Amount > 0; currency required; basis required; ≥1 category. |
| W-09 | Step 7: review & save trip request | P1 | required | Summary screen; labelled "trip request", not itinerary/booking. |
| W-10 | Save progress, resume, edit | P1, PLAN step 6 | required | Draft persists after refresh and re-login. |
| W-11 | Removing a destination visibly reconciles its landmarks | P1 | required | Notice lists removed landmarks; saved data has no orphan landmarks (also enforced server-side). |

Approved interests (22): Adventure; Architecture; Art & culture; Bird watching; Boat; City highlights; Classes & workshops; Food & drink; History; Museums; Nature & wildlife; Night; Off the beaten path; Photography; Religious sites; Shopping; Beaches & relaxation; Diving & snorkeling; Desert safari & camping; Nile cruises & felucca; Ancient Egypt & archaeology; Wellness & spa.

### Languages
| ID | Requirement | Source | Status | Acceptance criteria |
|---|---|---|---|---|
| L-01 | Complete English + Arabic UI, validation, navigation; RTL/LTR switch | P1, IDEA §3 | required | No untranslated strings in EN/AR; `dir` switches; layout mirrors. |
| L-02 | Architecture ready for Italian, Spanish, German, Russian, Ukrainian, Turkish (Phase 4) | IDEA §3, P1 | required | Message catalogs keyed per locale; unavailable locales not presented as complete. |
| L-03 | Dates/numbers/currency formatted per locale | IDEA §3 | required | Uses Intl formatting. |

### Data & integration
| ID | Requirement | Source | Status | Acceptance criteria |
|---|---|---|---|---|
| I-01 | One backend; no duplicate backends | P1, PLAN step 3 | required | — |
| I-02 | Versioned migrations, access policies, repeatable reference import | P1 | required | Fresh DB → migrate → seed reproduces state. |
| I-03 | Secrets server-side; `.env.example` with names only | P1, START | required | No secrets in repo. |
| I-04 | Explicit dev/demo mode when credentials missing; never report simulated email/persistence as live | P1 | required | Banner in demo mode; docs state which mode was tested. |
| I-05 | No paid subscriptions or public deploy without explicit authorization | P1, START | required | — |

---

## Phase 2 — Guides, verification, availability, matching, requests, messaging (tracked, NOT implemented)
| ID | Requirement | Source | Status |
|---|---|---|---|
| G-01 | Guide signup, profile, upload private documents | IDEA §7 | required (fields = proposal; acceptance criteria/docs = open, Mostafa to send) |
| G-02 | Admin-only guide verification; no "Verified" badge without real check | IDEA §7, PLAN 5 | required |
| G-03 | Guide availability and prices | PLAN 5 | required (pricing model open) |
| G-04 | Matching: hard filters language + region (+ verification, availability), then explained ranking | IDEA §7 | required (ranking = proposal) |
| G-05 | Tourist compares guides, sends request; messaging; edit plan with guide | IDEA §7, PLAN 8 | required |
| G-06 | Admin panel to add/review/update landmarks without code changes | PLAN 4 | required |

## Phase 3 — AI itinerary planning (tracked)
| ID | Requirement | Source | Status |
|---|---|---|---|
| P-01 | Day-by-day plan from trip request (Understanding/Planner/Reviewer/Manager roles; not necessarily separate models) | IDEA §5 | required (architecture = proposal) |
| P-02 | Deterministic budget/time checks in code; estimates labelled | IDEA §5, PLAN 7 | required |
| P-03 | Bounded revision loop; alternatives on conflict | IDEA §5 | proposal |
| P-04 | Tourist approval; guide confirmation/reshaping | IDEA §4هـ | required (timing open) |

## Phase 4 — Chatbot, AI Tour Guide, languages (tracked)
| ID | Requirement | Source | Status |
|---|---|---|---|
| T-01 | Knowledge-grounded chatbot (quick answers, image questions) | IDEA §6 | required (single vs two UIs open) |
| T-02 | AI Tour Guide: explain photo of landmark/artifact; museum guidance only with verified map/position/orientation | IDEA §6 | required |
| T-03 | Admit uncertainty | IDEA §5 | required |
| T-04 | Eight languages: EN, AR, IT, ES, DE, RU, UK, TR (FR/PL/ZH = proposals only) | IDEA §3 | required |

## Phase 5 — Options, booking, payments, launch (tracked)
| ID | Requirement | Source | Status |
|---|---|---|---|
| B-01 | Hotels/restaurants/events research with source & timestamp; estimated vs bookable price separated | IDEA §5 | required (integrations open) |
| B-02 | Booking states: proposed → approved by tourist → request sent → confirmed/failed | IDEA §5 | required |
| B-03 | Booking.com vs Egyptly comparison only with real data/integration | IDEA §5 | required |
| B-04 | Payments, refunds, cancellation, commissions, duplicate-request prevention, financial log | PLAN 10 | required (model open) |
| B-05 | Notifications, verified reviews after real trips | IDEA §7, PLAN | required |
| B-06 | Launch: backups, domain, monitoring, cost tracking | PLAN 12 | required |
