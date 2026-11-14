# Visilm — Build Plan

Single source of truth for what this product is, how it is built, and what order to build it in.
Read this before changing architecture. Decisions in **§9** are settled — don't re-litigate them.

---

## 1. What this is

A GEO (Generative Engine Optimization) platform. It measures whether a business gets
mentioned and cited in AI-generated answers (ChatGPT, Gemini, Perplexity, Claude, Copilot),
diagnoses why it doesn't, and drives the fixes.

**The product is the loop, not the dashboard:**

```
measure → diagnose → recommend → implement → re-measure
```

A GEO tool cannot make an AI recommend a business. It improves the clarity, evidence and
credibility of information about that business, then measures whether visibility moved.
Never promise inclusion.

**Where the moat is:** measurement is becoming a commodity (Semrush/Ahrefs will ship it as a
free tab). The defensible half is audit → recommendation → content brief → verification.
Lean the product at the fix, not the score.

### Current state

- Marketing site: done (`app/page.tsx`, `/pricing`, `/about`, `/login`) — do not redesign
- SEO: done (`lib/seo.ts` is the single source for brand/domain/metadata)
- Dashboard UI: **done** — 10 sections, 113 prerendered pages, full onboarding journey
- Backend: **none yet.** Everything reads `lib/mock/` (tenant: Harborflow)

**`lib/mock/` is the schema spec.** Every page already consumes its shape, so each build sprint
is "swap one mock module for one real query." The UI does not change as the backend lands.

---

## 2. Tech stack

| Layer | Choice | Note |
|---|---|---|
| Frontend | Next.js 15 (App Router, RSC) + Tailwind v4 | Already built. Dashboard is 95% reads |
| Backend logic | Node / TypeScript inside Next.js server + Inngest | No separate API — RSC *is* the API |
| DB / auth / storage | **Supabase** (Postgres + Auth + Storage + RLS) | One vendor. RLS is the tenancy boundary |
| Job orchestration | **Inngest** | Durable steps, retries, concurrency caps, cron |
| Crawler | Playwright + Cheerio, in a container (Fly.io / Railway) | Playwright can't be serverless |
| LLM analysis | Claude (Haiku 5.5 for parsing, Opus 5.5 for briefs) | Parsing is ~$1.50/mo. Acquisition is the bill |
| AI answer collection | Provider APIs with web search / grounding | See §5 |
| Billing | Stripe + usage metering | Cost is per-prompt, so price must be too |
| Obs | Sentry + PostHog + a self-built scan-health page | |
| Hosting | Vercel (app) + Fly.io (crawler) + Inngest (jobs) | |

**Not using:** BullMQ+Redis (Inngest replaces it), pgvector (trigram dedup is enough),
Supabase Edge Functions for pipeline work (Deno timeouts, no durable retries),
`supabase-js` in the browser (server-side only).

---

## 3. Architecture

```
CONTROL PLANE — Next.js on Vercel
  Reads Postgres only. Never calls a provider. Never crawls.
        |
        v
DATA PLANE — Inngest
  cron → create scan_session → fan out 1 job per (prompt × provider)
        |
        +-- Website Intelligence ... Playwright container → business_pages → profile
        +-- Prompt Intelligence .... generate + score + dedupe buyer questions
        +-- AI Visibility .......... provider adapters → raw answers + citations
        +-- Citation Intelligence .. brand match, sentiment, source classification
        +-- GEO Optimization ....... gaps → recommendations → content briefs
        |
        v
DERIVED LAYER — on scan complete, recompute scores / SOV → visibility_snapshots
        |
        v
Supabase Postgres + Storage (raw answers, crawl snapshots)
```

### The five engines

1. **Website Intelligence** — sitemap + link discovery, render where needed, extract text /
   meta / schema / facts. Every fact stored with source URL, timestamp, confidence.
2. **Prompt Intelligence** — generate buyer questions from the profile, classify intent
   (discovery / exploration / comparison / evaluation / purchase), dedupe, score, let the user edit.
   Priority weights are tunable guesses, not science — label them as such in the UI.
3. **AI Visibility** — one adapter per provider behind a single interface. Record provider,
   model, search mode, region, language, timestamp, params. Store raw answers verbatim.
4. **Citation Intelligence** — deterministic brand matching first, LLM only for ambiguity.
   Keep provider-reported citations separate from URLs merely mentioned in the text.
   Classify sources: owned / competitor / directory / review / editorial.
5. **GEO Optimization** — combine prompt gaps + citation gaps + audit + competitor evidence
   into prioritized, evidence-linked recommendations and content briefs.

---

## 4. Orchestration

```
customer starts scan (or weekly cron fires)
  → pre-flight gate: plan limit? budget remaining? kill switch off?   ← MUST come first
  → create scan_session
  → queue crawl jobs → business_pages → normalized profile
  → select active prompts
  → fan out: one durable Inngest step per (prompt × provider)
  → each step: idempotency key → adapter call → archive raw to Storage → persist ai_run
  → analysis pass: brand mentions, citations, sentiment
  → recompute visibility_snapshots
  → generate/refresh recommendations
  → dashboard reads the new rows
```

### Five non-negotiables

1. **Never scan inside an HTTP request.** Dashboard enqueues and polls; workers do the work.
2. **`ai_runs` is append-only.** Every scan is an immutable snapshot with the verbatim answer.
   Never update in place — trends, diffs and "you lost ChatGPT on Oct 14" are impossible to
   reconstruct later, and that history is the thing people pay for.
3. **Idempotency key on `(session_id, prompt_id, provider, model)`.** A retry must never
   double-call a paid API.
4. **Budget gate before fan-out, not a usage log after it.** A runaway daily scan is a
   four-figure mistake.
5. **One `AIProvider` interface, N implementations.** You will swap API for scraper.

```ts
interface AIProvider {
  name: string
  search(input: { prompt: string; location?: string }): Promise<{
    answer: string
    citations: string[]
    metadata?: Record<string, unknown>
  }>
}
```

### The fidelity caveat

A provider API with web search is **not** what a user sees in chatgpt.com or Copilot.
Different retrieval, different citations. Either accept API-as-proxy (cheap, stable, legal) or
scrape consumer UIs (accurate, fragile, against their ToS, needs residential proxies).
Say which one you're doing in the UI. Never imply the other.

---

## 5. Cost model

Per tenant, 240 prompts × 5 providers, **weekly** = 4,800 collections/month.

| Provider | Route | Per call |
|---|---|---|
| ChatGPT | OpenAI Responses + `web_search` ($10/1k) | ~$0.018 |
| Gemini | Gemini 3 + Search grounding ($14/1k, 5k free/mo) | ~$0.018 |
| Perplexity | Search API ($5/1k, $1/1k fast) | ~$0.008 |
| Claude | Messages + `web_search` ($10/1k) + Haiku tokens | ~$0.011 |
| Copilot | no public API → SERP/scrape vendor | ~$0.005–0.025 |

- **~$80 per tenant per month at weekly cadence. ~$500 at daily.**
- Fixed platform cost: **~$150/mo** (Vercel, Supabase, Inngest, Fly, Sentry, Stripe)
- Rule of thumb: **$150 fixed + ~$80 per customer per month**
- Analysis is nearly free (~$1.50/mo of Haiku). Acquisition is the entire bill.

**Pricing must follow cost.** Three dials drive the bill — prompts x engines x cadence — so those
are the three dials the tiers sell. Priced per workspace, never per seat: seats cost us nothing.

Shipped 2026-11-11 in `components/pricing-section.tsx`, `app/pricing/page.tsx` and `lib/seo.ts`.
Costed at $0.014 per collection (conservative blend) and 4.33 weeks/month.

| Tier | Prompts | Engines | Cadence | Collections/mo | Our cost | Price | Margin |
|---|---|---|---|---|---|---|---|
| Starter | 50 | 3 | weekly | 650 | ~$9 | $49 | 81% |
| Professional | 150 | 5 | weekly | 3,250 | ~$46 | $199 | 77% |
| Enterprise | 400 | 5 | weekly + daily on 25 | 12,400 | ~$174 | $499 | 65% |

Annual billing is -20% ($39 / $159 / $399 per month). Breakeven on the ~$150/mo fixed platform
cost is **4 Professional customers**.

**Two traps this replaces, both of which were live on the site:**
- *Daily scans on everything.* 240 prompts x 5 engines daily is ~$500/mo of API — the entire
  $499 tier revenue. Daily is sold only on a **capped priority subset**, never on the full set.
- *Per-seat pricing.* Cost scales with collections, not logins. A 10-seat team on the old
  $20/seat Professional would have paid $200 while consuming ~$1,170.

**No tier may promise "unlimited prompts" or "hourly monitoring".** Both are unbounded spend
against fixed revenue. `plan_limits` is the enforcement point and the budget gate reads it.

---

## 6. Data model (Supabase, RLS on every table)

| Table | Key fields |
|---|---|
| `businesses` | tenant profile: name, website, industry, location, aliases |
| `business_pages` | url, extracted text/meta/schema, crawled_at |
| `competitors` | name, domain, relationship |
| `prompts` | question, intent_stage, priority, active, business_id |
| `scan_sessions` | one scheduled or manual run |
| `scan_jobs` | **idempotency_key**, status, attempts, cost_estimate |
| `ai_runs` | **append-only**: prompt, provider, model, raw answer, citations, metadata, run_at |
| `brand_mentions` | run_id, brand, mentioned, recommended, position, sentiment, **classifier_version** |
| `citations` | run_id, url, domain, source_type, provider_reported (bool) |
| `audit_issues` | severity, category, page, explanation, fix, recommendation_id |
| `recommendations` | type, title, problem, evidence, priority, status |
| `content_drafts` | brief/draft, target prompts, approval + publish status |
| `visibility_snapshots` | aggregated metrics by provider and period |
| `provider_usage` | calls, units, cost, errors, rate limits |
| `plan_limits` | per-tenant prompt cap, provider set, cadence, monthly budget |

**RLS trap:** user-facing reads use the anon key and RLS enforces tenancy. Pipeline writes use
the **service role key, which bypasses RLS entirely** — so tenant scoping for jobs lives in one
data-access module, never inline in a job handler.

---

## 7. Build order

Sprints 2–3 are the product. Before is plumbing, after is polish.

| # | Build | Done when |
|---|---|---|
| **0** | Fix pricing tiers. Supabase project, schema above, RLS everywhere | Two accounts cannot see each other's rows |
| **1** | Playwright crawler container → `business_pages` → normalized profile | A real site crawls and its profile renders in the existing onboarding UI |
| **2** | Perplexity adapter. Inngest fan-out, idempotency, budget gate. 25 prompts | One scan completes under $1 and `/dashboard/prompts/[id]` shows real answers |
| **3** | ChatGPT adapter. Brand matching + citation normalization | Visibility and SOV computed from real runs; dashboard code unchanged |
| **4** | Technical audit: crawl data + PageSpeed API + schema validation → recommendations | Audit pages show real issues with real fixes |
| **5** | Weekly cron, snapshots, monthly reports, spend dashboard | A second week of data draws a real trend line |

**Validate before building:** run 5 real companies by hand first — a script hitting 2 APIs,
results pasted into `lib/mock/`, dashboard sent as a report. Costs ~$10 and answers whether
anyone pays, which 6 sprints of backend will not.

---

## 8. Principles

- **Separate measurement from optimization.** Visibility engine observes; optimization engine proposes.
- **Preserve evidence.** Every metric traces to a prompt, response, citation or crawled page.
- **Treat each provider as a different product.** Normalize common fields, keep their metadata.
- **Deterministic first, LLM second.** A classifier's opinion is not ground truth; version it.
- **Human approval before publishing.** The customer owns their site.
- **Never invent** reviews, awards, client names, stats or case studies.
- **Measure business outcomes separately.** Mentions ≠ traffic ≠ leads ≠ revenue.
- **Be honest about uncertainty.** GEO outcomes are probabilistic. Don't ship a single number as a ranking.

---

## 9. Settled decisions

| Question | Answer |
|---|---|
| Node or Supabase? | Both. Supabase = data/auth/storage. Node = all logic. Not opposites |
| Queue? | Inngest, not BullMQ+Redis. Revisit only past ~500 tenants |
| Separate backend service? | No. RSC is the API. One Next.js app + Inngest + a crawler container |
| Where do scans run? | Inngest. Never Vercel request handlers, never Supabase Edge Functions |
| Vector search? | Not in MVP |
| How many providers at launch? | Two: Perplexity, then ChatGPT |
| Microservices / Kafka? | No. One app handles 500 tenants |
| Reversibility | Supabase is just Postgres; Inngest is just jobs. Both swappable in a day. Don't agonize |

---

## 10. Reference

- Source research: `GEO_ReSO_Technical_Reference_Guide.docx` (this plan supersedes it where they differ)
- Mock data / schema spec: `lib/mock/`
- Brand + SEO config: `lib/seo.ts`
- Known gap: `app/page.tsx:123` references `/mask-group-pattern.svg`, missing from `public/`
