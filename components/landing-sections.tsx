import Link from "next/link"

import { Card } from "@/components/dashboard/kit"
import { series } from "@/components/dashboard/tokens"

/**
 * Marketing sections built from the dashboard's own primitives, so the landing
 * page and the product read as one surface. Server components — no client JS.
 */

/* --------------------------- engine coverage --------------------------- */

const ENGINES = [
  { name: "ChatGPT", color: series.s1 },
  { name: "Perplexity", color: series.s3 },
  { name: "Gemini", color: series.s2 },
  { name: "Claude", color: series.s4 },
  { name: "Copilot", color: series.s5 },
]

export function EngineCoverage() {
  return (
    <section className="self-stretch border-t border-[#E0DEDB] px-4 sm:px-6 md:px-10 lg:px-12 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[1100px] flex flex-col items-center gap-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(73,66,61,0.55)]">
          Your prompts, run against every answer engine
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2.5">
          {ENGINES.map((e) => (
            <li
              key={e.name}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(55,50,47,0.10)] bg-white px-4 py-2 shadow-[0px_1px_2px_rgba(55,50,47,0.05)]"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
              <span className="text-[13.5px] font-medium text-[#37322F]">{e.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* -------------------------------- the loop ------------------------------- */

const LOOP = [
  {
    n: "01",
    title: "Measure",
    body: "Your buyer questions run against every engine on a schedule. Each answer is stored word for word, with its citations.",
  },
  {
    n: "02",
    title: "Diagnose",
    body: "We find the prompts you're missing from, the sources cited instead of yours, and the pages on your site that caused it.",
  },
  {
    n: "03",
    title: "Recommend",
    body: "Each gap becomes a prioritised action with the evidence attached — the prompt, the answer, the page, the competing source.",
  },
  {
    n: "04",
    title: "Implement",
    body: "Work moves through approval, build and verification with an owner on every item. Nothing is published without your say-so.",
  },
  {
    n: "05",
    title: "Re-measure",
    body: "The next scan re-runs the same prompts, so you can point at the week a change landed and what it moved.",
  },
]

export function TheLoop() {
  return (
    <section className="self-stretch border-t border-[#E0DEDB] px-4 sm:px-6 md:px-10 lg:px-12 py-14 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="max-w-[640px]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(73,66,61,0.55)]">
            How it works
          </div>
          <h2 className="mt-2 text-[#37322F] text-[28px] sm:text-[34px] md:text-[40px] font-normal leading-[1.15] font-serif text-balance">
            One loop, run every week
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[#605A57] text-pretty">
            Nobody can make an AI recommend you. What you can do is make the evidence about you clearer than your
            competitors&apos;, then measure whether it worked.
          </p>
        </div>

        <ol className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LOOP.map((s) => (
            <Card as="li" key={s.n} className="p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-[12px] font-semibold tabular-nums text-[rgba(73,66,61,0.40)]">{s.n}</span>
                <h3 className="text-[15px] font-semibold text-[#37322F]">{s.title}</h3>
              </div>
              <p className="mt-2 text-[13.5px] leading-[22px] text-[#605A57]">{s.body}</p>
            </Card>
          ))}

          <li className="rounded-xl border border-dashed border-[rgba(55,50,47,0.22)] bg-[#FBFAF9] p-5 flex flex-col justify-center">
            <p className="text-[13.5px] leading-[22px] text-[#605A57]">
              A higher mention rate isn&apos;t a sale. We report mentions, citations and referral traffic separately,
              and never claim one caused the other.
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}

/* ----------------------------- what's inside ----------------------------- */

const SECTIONS = [
  { title: "Overview", body: "Score, movement, alerts and the next three things to do.", href: "/onboarding" },
  { title: "AI visibility", body: "Per-engine breakdown — where each one does and doesn't name you." },
  { title: "Prompt intelligence", body: "Every tracked question with each engine's answer in full." },
  { title: "Citation intelligence", body: "The sources engines quote, who they favour, and how to get into them." },
  { title: "Competitor analysis", body: "Share of voice, and the exact prompts rivals win outright." },
  { title: "Website audit", body: "The crawl, schema and content issues that keep you out of answers." },
  { title: "GEO recommendations", body: "Prioritised fixes with evidence, effort and expected gain." },
  { title: "Content optimization", body: "Briefs with outline, must-include facts and the pages to beat." },
  { title: "Progress & reports", body: "Monthly reports and a full timeline of what changed when." },
  { title: "Settings", body: "Profile, competitors, engines, cadence, notifications and team." },
]

export function PlatformSections() {
  return (
    <section className="self-stretch border-t border-[#E0DEDB] px-4 sm:px-6 md:px-10 lg:px-12 py-14 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[640px]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(73,66,61,0.55)]">
              What&apos;s inside
            </div>
            <h2 className="mt-2 text-[#37322F] text-[28px] sm:text-[34px] md:text-[40px] font-normal leading-[1.15] font-serif text-balance">
              Ten sections, one workspace
            </h2>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex h-10 items-center rounded-full border border-[rgba(55,50,47,0.18)] bg-white px-5 text-[13.5px] font-medium text-[#37322F] transition-colors hover:border-[rgba(55,50,47,0.35)]"
          >
            Open the workspace
          </Link>
        </div>

        <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-[rgba(55,50,47,0.10)] bg-[rgba(55,50,47,0.10)] sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <li key={s.title} className="bg-white p-5">
              <h3 className="text-[14.5px] font-semibold text-[#37322F]">{s.title}</h3>
              <p className="mt-1.5 text-[13px] leading-[21px] text-[#605A57]">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------- principles ------------------------------ */

const PROMISES = [
  {
    title: "Every number has a receipt",
    body: "Click any metric and you land on the prompt, the verbatim answer and the source that produced it.",
  },
  {
    title: "Nothing published without approval",
    body: "You own your site. Recommendations wait for a human, and the audit trail records who approved what.",
  },
  {
    title: "No invented proof",
    body: "We never write fake reviews, awards, client names or statistics into your content. Third-party coverage gets earned.",
  },
  {
    title: "Honest about uncertainty",
    body: "Answers vary by engine, model, region, wording and date. We timestamp everything and compare like with like.",
  },
]

export function Principles() {
  return (
    <section className="self-stretch border-t border-[#E0DEDB] px-4 sm:px-6 md:px-10 lg:px-12 py-14 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1100px] grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(73,66,61,0.55)]">
            How we work
          </div>
          <h2 className="mt-2 text-[#37322F] text-[28px] sm:text-[34px] md:text-[40px] font-normal leading-[1.15] font-serif text-balance">
            Built to be checked
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[#605A57] text-pretty">
            This is a category full of unverifiable scores. Ours are auditable on purpose.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {PROMISES.map((p) => (
            <Card as="li" key={p.title} className="p-5">
              <h3 className="text-[14.5px] font-semibold text-[#37322F]">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-[22px] text-[#605A57]">{p.body}</p>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  )
}
