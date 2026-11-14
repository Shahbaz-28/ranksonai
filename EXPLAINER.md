# What Visilm Is — in plain English

For anyone who has never heard of GEO. No jargon, no code.

---

## 1. The problem

Buyers used to google "best invoicing software," scroll a list of blue links, and click a few.

Now a lot of them just ask ChatGPT, Gemini, Perplexity or Copilot — and the AI answers in a paragraph:

> "The platforms most often recommended are **Payline Ops**, **Nexora Pay** and **Settlewise**."

Three companies get named. Everyone else is invisible. There's no page 2 to be on.

So the question every business now has is simple:

> **When someone asks AI about my industry, does my name come up?**

Most companies have no idea. That's the gap.

---

## 2. What GEO means

**GEO = Generative Engine Optimization.**

It's SEO for AI answers instead of Google results.

- **SEO** = get your page ranking in a list of links
- **GEO** = get your company *named and cited* inside the answer the AI writes

Same instinct, different target.

---

## 3. What Visilm actually does

Five steps, repeated every week.

### Step 1 — Read your website

We crawl your site and build a profile of your business: what you sell, who you sell to, where you operate, what proof you have.

### Step 2 — Work out what your buyers ask

From that profile we generate the real questions a buyer would type — "best AP automation for mid-market," "does X integrate with NetSuite," "X vs Y pricing." You review the list and edit it.

### Step 3 — Ask the AI engines those questions

We send every question to ChatGPT, Perplexity, Gemini, Claude and Copilot, and save the answer **word for word**, along with the websites each one cited.

### Step 4 — Analyse what came back

For every answer we record:

- Were you mentioned? Were you recommended?
- Which competitors were named instead?
- Which websites did the AI quote as its sources?
- Was your own site cited, or someone else's?

### Step 5 — Tell you what to fix, then check if it worked

We turn the gaps into a prioritised to-do list, you make the changes, and next week's scan shows whether anything moved.

---

## 4. What you actually get

A dashboard with ten sections. The things you'll look at most:

| What you see | What it tells you |
|---|---|
| **Visibility score** | One number, 0–100: how often AI engines name you |
| **Prompt list** | Every buyer question, with each engine's full answer — readable |
| **Gap list** | The questions where you're invisible and a competitor isn't |
| **Cited sources** | The websites AI quotes about your industry, ranked |
| **Share of voice** | Your slice of all brand mentions vs each competitor |
| **To-do list** | Prioritised fixes, each with the evidence and the expected gain |
| **Content briefs** | Outlines for pages you're missing, with facts to include |
| **Weekly/monthly reports** | What changed, and when |

---

## 5. A real example

**Harborflow** sells accounts-payable software. Their scan found:

1. **They're invisible on 11 of 20 buyer questions.** Competitors named instead.
2. **ChatGPT said why, out loud:** *"Vendors that quote only on request could not be ranked here."*
3. **The cause:** Harborflow has no public pricing page. The AI couldn't rank them, so it skipped them.
4. **The fix:** publish pricing. Estimated gain: 18 visibility points across 7 questions.
5. **The check:** next week's scan re-runs the same 20 questions and shows whether it worked.

That's the whole product in one story: **a specific gap, a stated reason, a concrete fix, and proof afterwards.**

---

## 6. Where the value really is

Plenty of tools will sell you a visibility score. A score alone is just anxiety.

The value is the chain:

> you're missing here → **because of this** → fix this → it moved

Everything in the product exists to make that chain checkable. Click any number and you land on the actual question, the actual answer, and the actual source that produced it. Nothing is a black box.

---

## 7. What it honestly cannot do

Worth saying plainly, because the industry oversells this:

- **It cannot make an AI recommend you.** Nobody can. We improve the evidence about you and measure what happens.
- **Being mentioned more is not the same as more sales.** We report mentions, citations and website traffic separately, and never claim one caused the other.
- **Answers change.** The same question can get different answers by engine, country, wording and day. So we timestamp everything and always compare like with like.
- **We never invent proof.** No fake reviews, awards, client names or statistics — ever. Coverage has to be earned.

---

## 8. Who it's for

Businesses where buyers research before they buy and a recommendation carries weight — B2B software, agencies, professional services, healthcare, finance.

Usually the person who owns the problem is a founder, a head of marketing, or the agency they hired.

---

---

# Part 2 — How it works under the hood

Slightly more technical, still plain. For architecture decisions see `PLAN.md`; for build order see `ROADMAP.md`.

---

## 9. The one rule that shapes everything

**A scan is slow, expensive and unreliable — so it never runs inside a web request.**

One customer scan = 240 questions × 5 engines = **1,200 calls to paid external APIs**. That takes hours, some calls fail, and each one costs real money.

So the system splits in two:

| Half | Job | Runs on |
|---|---|---|
| **The website** | Shows you data. Reads the database. Never calls an AI engine. | Next.js on Vercel |
| **The workers** | Do the slow work. Crawl, call engines, analyse, save. | Inngest (background jobs) |

The website never waits. You click "Start scan," it creates a job and returns instantly. Workers grind through it in the background and the page updates as results land.

---

## 10. What happens when a scan runs

Step by step, with the actual calls:

```
1. Cron fires (or you click "Start scan")
      ↓
2. BUDGET CHECK  ← before anything costs money
      Is this customer within their plan limit?
      Is there budget left this month?
      Is the kill switch off?
      If no → stop here. Nothing is spent.
      ↓
3. Create a scan_session row  (one row = one weekly run)
      ↓
4. CRAWL  → a Playwright container visits your site
      reads sitemap.xml, follows internal links
      extracts text, titles, headings, schema from each page
      saves to business_pages + raw HTML to file storage
      ↓
5. Fan out: 1,200 separate background jobs
      one per (question × engine)
      ↓
6. Each job:
      a. check idempotency key — has this exact call already run?
         if yes → skip (never pay twice for a retry)
      b. call the engine's API
      c. save the raw answer to file storage
      d. insert one row into ai_runs
      ↓
7. ANALYSE each answer:
      - find brand names (plain text matching first)
      - if ambiguous → ask a cheap LLM to judge
      - pull out the cited URLs, classify each domain
      - write brand_mentions + citations rows
      ↓
8. AGGREGATE:
      compute visibility score, mention rate, share of voice
      write one visibility_snapshots row
      ↓
9. GENERATE recommendations from the gaps
      ↓
10. Dashboard now shows the new numbers
```

---

## 11. Which APIs get called, and what they cost

Every engine is wrapped in the **same interface**, so swapping one out changes one file:

```ts
interface AIProvider {
  name: string
  search(input: { prompt: string }): Promise<{
    answer: string          // the full text, saved verbatim
    citations: string[]     // the URLs it quoted
  }>
}
```

| Engine | What we call | Cost per question |
|---|---|---|
| ChatGPT | OpenAI Responses API + web search tool | ~$0.018 |
| Gemini | Gemini API + Google Search grounding | ~$0.018 |
| Perplexity | Perplexity Search API | ~$0.008 |
| Claude | Anthropic Messages API + web search tool | ~$0.011 |
| Copilot | no public API — needs a scraping vendor | ~$0.005–0.025 |

Plus two cheap internal uses of AI:

- **Generating the question list** once per customer (Claude Opus)
- **Judging ambiguous mentions and sentiment** (Claude Haiku — about **$1.50/month** for all 4,800 answers)

**The headline cost fact:** collecting answers is ~98% of the bill. Analysing them is almost free.

**Per customer: ~$80/month** at weekly scans. ~$500/month if you scan daily.

> **Important honesty note:** an engine's *API* with web search is not identical to what a person sees in the ChatGPT or Copilot *app*. Different retrieval, sometimes different citations. The UI says which one we used. We never imply otherwise.

---

## 12. Where the data lives

Supabase (PostgreSQL). The tables that matter:

| Table | Holds | Note |
|---|---|---|
| `businesses` | one row per customer | |
| `business_pages` | every page we crawled | |
| `prompts` | the buyer questions we track | |
| `scan_sessions` | one row per weekly run | |
| `scan_jobs` | one row per queued call | carries the **idempotency key** |
| **`ai_runs`** | **one row per answer, saved word for word** | **append-only — never updated** |
| `brand_mentions` | who was named in each answer | |
| `citations` | which URLs each answer quoted | |
| `audit_issues` | problems found on your site | |
| `recommendations` | the to-do list | |
| `visibility_snapshots` | the weekly numbers | what the charts read |
| `provider_usage` | what we spent, per engine | |
| `plan_limits` | each customer's caps and budget | checked in step 2 |

### Why `ai_runs` is append-only

We **never overwrite an answer**. Every scan writes new rows.

That's what makes it possible to say *"ChatGPT started recommending you on 14 October."* If we updated rows in place, that history would be gone forever and couldn't be rebuilt at any price. The history **is** the product.

### Keeping customers separate

Supabase enforces it at the database level (Row Level Security): a logged-in user physically cannot read another company's rows, even if the app has a bug.

One catch the team has to respect: **background jobs run with an admin key that bypasses that protection.** So all job-side database access goes through a single module that adds the customer filter — never written by hand inside a job.

---

## 13. Three rules that prevent expensive mistakes

1. **Budget gate before fan-out.** Check the limit *before* queuing 1,200 paid calls, not after. A runaway daily scan is a four-figure invoice.
2. **Idempotency key on every job.** A retry must never re-call a paid API. Key = `(session + question + engine + model)`.
3. **Archive the raw answer.** Store the original response in file storage, not just our parsed version. When the analysis logic improves, we re-read the archive instead of re-buying the data.

---

## 14. The shortest version

```
Website  →  reads database only, instantly
Workers  →  crawl, call engines, analyse, save
Database →  append-only history of every answer ever collected
Money    →  spent in step 6, gated in step 2
```

---

## In one sentence

**Visilm tells you whether AI recommends your business, explains exactly why it doesn't, and tracks whether your fixes worked.**
