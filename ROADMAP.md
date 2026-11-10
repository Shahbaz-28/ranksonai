# Visilm — Build Roadmap

What to build, in order, and what to deliberately not build yet.
Architecture decisions live in `PLAN.md` — this file is only sequence.

**How to use:** finish a phase's gate before starting the next. Tick boxes as you go.
Each phase names the `lib/mock/` module it replaces, so progress is always visible in the UI.

---

## Step 0 — Validate before you build (1 week, ~$10)

Do not write backend code yet. The dashboard already looks like a real product — use it.

- [ ] Fix pricing tiers in `components/pricing-section.tsx` ($49 / $199 / $499 — see `PLAN.md` §5)
- [ ] Write a throwaway script: 25 prompts → Perplexity + ChatGPT → JSON
- [ ] Run it for **5 real companies** in one niche
- [ ] Paste each result into `lib/mock/`, screenshot the dashboard, send as a report
- [ ] Ask for money — even $200 one-off

**Gate:** at least 2 of 5 reply asking *"how do I fix that?"*
If nobody does, the problem is the product, and no amount of backend fixes it.

---

## Phase 1 — Foundation (no features, just ground)

**Goal:** a real tenant can log in and see an empty but correct dashboard.

- [ ] Supabase project. Schema from `PLAN.md` §6, migrations in `supabase/migrations/`
- [ ] RLS policy on **every** table, keyed to tenant
- [ ] One data-access module (`lib/db/`) — the only place tenant scoping is written
- [ ] Supabase Auth replacing the mock login. Keep `/login` UI as-is
- [ ] `plan_limits` row created on signup
- [ ] Inngest connected, one hello-world job running on cron

**Gate:** two accounts exist and provably cannot read each other's rows.
Dashboard renders with empty states (already built — this is why they exist).

---

## Phase 2 — Website Intelligence (first real data)

**Goal:** onboarding stops being a form and starts being a crawl.

- [ ] Playwright + Cheerio crawler in a container on Fly.io
- [ ] Sitemap + internal-link discovery, respect robots.txt, concurrency cap
- [ ] Extract per page: text, title, meta, headings, links, schema
- [ ] Persist to `business_pages`; raw HTML snapshot to Supabase Storage
- [ ] LLM pass (Haiku 5.5) → normalized business profile, each fact with source URL
- [ ] Wire `/onboarding/analysis` to real job status instead of the timer

**Replaces:** `lib/mock/business.ts`

**Gate:** enter a real domain, watch the five analysis stages fill from actual job events,
and see a correct profile on `/onboarding/report`.

---

## Phase 3 — First provider, end to end ⭐ THE MILESTONE

**Goal:** one real scan produces real answers on real prompts. This is the product.

- [ ] Prompt generation from the profile (Opus 5.5) → `prompts`, intent-classified
- [ ] Prompt review UI — reuse the existing prompt explorer, add edit/remove
- [ ] `AIProvider` interface + **Perplexity adapter** (cheapest, best citations)
- [ ] Inngest: `scan_session` → fan out one durable step per (prompt × provider)
- [ ] **Pre-flight budget gate** before fan-out: plan limit, remaining budget, kill switch
- [ ] **Idempotency key** on `(session_id, prompt_id, provider, model)`
- [ ] Persist append-only `ai_runs` + raw answer archived to Storage
- [ ] Deterministic brand matching → `brand_mentions`; citations → `citations`

**Replaces:** `lib/mock/prompts.ts`, `lib/mock/citations.ts`

**Gate:** start a scan, it costs under $1, and `/dashboard/prompts/[id]` shows verbatim
answers with real citations. **Stop and check data quality here before expanding.**

---

## Phase 4 — Second provider + comparison

**Goal:** the dashboard's core numbers become real.

- [ ] **ChatGPT adapter** (OpenAI Responses + `web_search`)
- [ ] Citation URL/domain normalization, source classification (owned/competitor/directory/review/editorial)
- [ ] LLM classifier for ambiguous mentions + sentiment, with `classifier_version` stored
- [ ] Competitor brand matching across the same runs
- [ ] Compute visibility score, mention rate, citation rate, share of voice on scan completion
- [ ] Write `visibility_snapshots`

**Replaces:** `lib/mock/platforms.ts`, `lib/mock/competitors.ts`, `lib/mock/overview.ts`

**Gate:** overview KPIs, per-engine pages and competitor SOV all read from real runs,
with no change to dashboard component code.

---

## Phase 5 — The fix engine (where the moat is)

**Goal:** stop being a scoreboard. This is the half competitors don't build well.

- [ ] Technical audit from crawl data: titles, canonicals, internal links, schema validity
- [ ] PageSpeed Insights API (free) for performance/mobile
- [ ] Entity-consistency check across key pages
- [ ] Gap analysis: prompts where you're absent × citation gaps × audit issues → `recommendations`
- [ ] Every recommendation links to its evidence (prompt, run, citation, page)
- [ ] Content briefs (Opus 5.5) grounded **only** in verified crawled facts
- [ ] Wire the existing workflow states to DB: pending → approval → in-progress → verification → completed

**Replaces:** `lib/mock/audit.ts`, `lib/mock/recommendations.ts`, `lib/mock/content.ts`

**Gate:** a recommendation can be approved, worked, and verified — and its linked prompt
visibly re-measures on the next scan.

---

## Phase 6 — Make it continuous

**Goal:** it runs without you.

- [ ] Weekly cron per tenant, cadence from `plan_limits`
- [ ] Monthly report generation from snapshots
- [ ] Activity timeline from real events
- [ ] Spend dashboard off `provider_usage` + alert at 80% of budget
- [ ] Scan-health page: failures, retries, per-provider latency
- [ ] Sentry + PostHog

**Replaces:** `lib/mock/reports.ts`

**Gate:** a second week of data draws a real trend line and a report generates untouched.

---

## Phase 7 — Sell it self-serve

- [ ] Stripe checkout + the three tiers
- [ ] Usage metering against `plan_limits`; block or upsell at the cap
- [ ] Settings tabs wired to real writes (profile, competitors, engines, notifications)
- [ ] Team invites
- [ ] Transactional email (Resend): scan complete, report ready, budget warning

**Gate:** a stranger signs up, pays, onboards and gets a scan with you asleep.

---

## Parking lot — deliberately later

| Deferred | Why | Revisit when |
|---|---|---|
| Gemini, Claude, Copilot adapters | Each adds ~$18/tenant/mo; two prove the product | Customers ask by name |
| Daily cadence | ~$500/tenant/mo | Scale tier has buyers |
| Consumer-UI scraping | Fragile, ToS risk, proxy cost | API fidelity becomes the top complaint |
| CMS / GitHub write-back | Big surface, needs trust | Customers ask you to ship fixes for them |
| pgvector semantic dedup | Trigram is enough at 240 prompts | Thousands of prompts per tenant |
| AI referral analytics (GA4/CRM) | Needs their integrations | Customers ask to prove ROI |
| BullMQ + self-hosted workers | Inngest is fine | ~500 tenants |
| White-label / agency multi-client | Different product shape | An agency asks and pays |

---

## Rules of order

1. **Validate before Phase 1.** Five hand-run reports cost $10 and teach more than a month of code.
2. **One provider fully working beats five half-wired.** Phase 3 is the only phase that must be perfect.
3. **Never skip the budget gate.** It is three hours of work and prevents a four-figure invoice.
4. **Never break append-only `ai_runs`.** Lost history can't be rebuilt — and it's what people pay for.
5. **Don't touch the dashboard components.** If a phase needs UI changes, the mock shape was wrong — fix the query, not the page.
6. **Phase 5 is the product, not phase 4.** Anyone can show a score. Shipping the fix is the business.
