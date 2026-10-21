# Egyptly — Decisions

## Confirmed decisions
| # | Decision | Source |
|---|---|---|
| C-01 | 22 interests exactly as listed in REQUIREMENTS W-02. | IDEA §4ب |
| C-02 | Day trip & Layover belong to "trip type / time available"; Family belongs to "travelling with". | IDEA §4ب |
| C-03 | Signup offers Tourist / Tour Guide at the top. | IDEA §2 |
| C-04 | Tourist signup = first name, last name, email, password + email confirmation. | IDEA §3 |
| C-05 | Arabic is RTL, all other languages LTR. Target languages: EN, AR, IT, ES, DE, RU, UK, TR. | IDEA §3 |
| C-06 | Scope of landmark data = the 10 governorates in LMK; it is a scope list, not a verified operational DB. | LMK |
| C-07 | Phase 1 = foundation + tourist accounts + saved trip requests; EN + AR complete. Final Phase 1 screen is a trip *request* summary. | P1 brief |
| C-08 | No paid subscriptions, public deployment, booking or payment without explicit approval. | P1, START |
| C-09 | No existing code is available → build a new implementation (2026-10-22, Mostafa pointed to the Lovable demo only). | Mostafa, chat |
| C-10 | Visual identity comes from the Lovable demo (pixel-perfect-canvas-6149.lovable.app): sand background `oklch(97.7% .012 85)`, navy primary/foreground `oklch(27% .05 258)` / `oklch(25% .045 255)`, gold `oklch(72% .11 80)` + gold-soft `oklch(90% .06 85)`, card `oklch(99.5% .005 85)`, border `oklch(90% .02 85)`, radius .75rem; headings Cormorant Garamond, body Karla; pill gold-gradient CTA, pill chips (selected = gold-soft), uppercase letter-spaced field labels, "Egyptly" wordmark with gold "ly"; disclaimer that sample data is fictional. | Mostafa, chat |

## Reversible assumptions (made by the implementer — change freely)
| # | Assumption | Why |
|---|---|---|
| R-01 | Wizard destination cards = tourist destinations/areas from LMK headings (e.g. "Hurghada", "Dahab", "Islamic Cairo"), grouped under their governorate. | IDEA asks to separate destinations from governorates; LMK headings are the only structured source. |
| R-02 | Duration display: nights = departure − arrival; calendar days = nights + 1; "full visit days" excludes arrival/departure days unless the tourist ticks them as available. | Makes the open question visible instead of deciding it. |
| R-03 | Budget currencies offered: USD, EUR, GBP, EGP. Basis: per person / whole group. Categories: flights, accommodation, local transport, entry tickets, food, guide fee, activities. | IDEA §4د lists these categories; currencies are a UI default. |
| R-04 | Trip type options: Multi-day trip, Day trip, Layover. Companions: Solo, Couple, Family, Friends, Group/organization. | Minimal set covering IDEA items. |
| R-05 | Landmark ordering by interest uses a documented landmark-type → interest mapping; no durations shown. | IDEA proposal for "reason shown"; durations are unknown. |
| R-06 | Sub-sites (e.g. tombs inside Valley of the Kings) are selectable but displayed nested under their parent. | LMK says sub-sites are not independent visits automatically. |
| R-07 | Images: honest illustrated/gradient placeholders with landmark name; no stock photos until rights are confirmed. | D-08. |
| R-08 | English landmark names are implementer drafts flagged `name_en_reviewed = false`. | LMK: "English name after review". |

## Unresolved questions (do not decide silently)
| # | Question | Blocks |
|---|---|---|
| ~~U-01~~ | ~~Existing code?~~ → resolved by C-09 (new build). | — |
| U-02 | Does the departure day (and arrival day) count as a visit day? | Phase 3 planning (P1 shows it explicitly) |
| U-03 | Budget: currency default, per-person vs group default, which categories count. | Phase 3 checks |
| U-04 | Guide selection timing vs AI draft plan; one guide per trip or per destination. | Phase 2/3 |
| U-05 | AI Tour Guide role: standalone alternative, companion to human guide, or both. | Phase 3/4, pricing |
| U-06 | Guide acceptance criteria, documents, who approves, validity period (Mostafa to send). | Phase 2 |
| U-07 | Launch destinations & languages for the demo; Meska delivery date, grading criteria, team roles, what must be live. | Scope of demo |
| U-08 | Commission, payee, cancellation/refund policy, booking integrations. | Phase 5 |
| U-09 | Image sources and rights for destination cards. | Real imagery |
| U-10 | Chatbot and AI Tour Guide: one interface with two levels or two interfaces. | Phase 4 |
