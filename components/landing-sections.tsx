import Link from "next/link"

import { Card } from "@/components/dashboard/kit"
import Reveal from "@/components/reveal"
import CountUp from "@/components/count-up"
import NeuralField from "@/components/neural-field"

/**
 * Marketing sections built from the dashboard's own primitives, so the landing
 * page and the product read as one surface. The loop section runs dark — one
 * high-contrast beat so the page has a spine instead of five identical blocks.
 */

/* ------------------------------- proof bar ------------------------------- */

/**
 * Proof by specificity rather than borrowed credibility: what the product
 * actually does, in numbers we can stand behind. No logos we haven't earned,
 * no ratings we don't have.
 */
const FACTS = [
  { n: 240, suffix: "", label: "prompts per workspace", sub: "across five buying stages" },
  { n: 5, suffix: "", label: "answer engines", sub: "every scan, every week" },
  { n: 100, suffix: "%", label: "answers kept verbatim", sub: "re-readable months later" },
  { n: 0, suffix: "", label: "numbers without evidence", sub: "each one links to its source" },
]

export function ProofBar() {
  return (
    <section className="self-stretch border-t border-[#E0DEDB] px-4 sm:px-6 md:px-10 lg:px-12 py-12 sm:py-14">
      <Reveal className="mx-auto w-full max-w-[1100px]">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-4">
          {FACTS.map((f) => (
            <li key={f.label} className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <CountUp
                value={f.n}
                suffix={f.suffix}
                className="text-[34px] font-semibold leading-none tracking-[-0.02em] text-[#37322F] tabular-nums sm:text-[40px]"
              />
              <span className="mt-2 text-[14.5px] font-medium text-[#37322F]">{f.label}</span>
              <span className="mt-1 text-[13px] leading-5 text-[rgba(73,66,61,0.6)]">{f.sub}</span>
            </li>
          ))}
        </ul>
      </Reveal>
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
    <section className="relative self-stretch overflow-hidden bg-[#262120] px-4 sm:px-6 md:px-10 lg:px-12 py-16 sm:py-20 md:py-24">
      <NeuralField
        tone="dark"
        className="pointer-events-none absolute inset-0 h-full w-full"
        mask="radial-gradient(64% 70% at 72% 40%, #000 0%, #000 38%, transparent 76%)"
      />
      <Reveal className="relative z-10 mx-auto w-full max-w-[1100px]">
        <div className="max-w-[680px]">
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[rgba(247,245,243,0.45)]">
            How it works
          </div>
          <h2 className="mt-3 text-[#F7F5F3] text-[32px] sm:text-[40px] md:text-[48px] font-normal leading-[1.1] tracking-[-0.01em] font-serif text-balance">
            One loop, run every week
          </h2>
          <p className="mt-4 text-[16px] sm:text-[17px] leading-[1.65] text-[rgba(247,245,243,0.68)] text-pretty">
            Nobody can make an AI recommend you. What you can do is make the evidence about you clearer than your
            competitors&apos;, then measure whether it worked.
          </p>
        </div>

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LOOP.map((s) => (
            <li
              key={s.n}
              className="h-full rounded-xl border border-[rgba(247,245,243,0.12)] bg-[rgba(247,245,243,0.04)] p-6 transition-colors hover:bg-[rgba(247,245,243,0.07)]"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[12.5px] font-semibold tabular-nums text-[rgba(247,245,243,0.40)]">{s.n}</span>
                <h3 className="text-[17px] font-semibold text-[#F7F5F3]">{s.title}</h3>
              </div>
              <p className="mt-2.5 text-[14.5px] leading-[24px] text-[rgba(247,245,243,0.66)]">{s.body}</p>
            </li>
          ))}

          <li className="h-full rounded-xl border border-dashed border-[rgba(247,245,243,0.22)] p-6 flex flex-col justify-center">
            <p className="text-[14.5px] leading-[24px] text-[rgba(247,245,243,0.60)]">
              A higher mention rate isn&apos;t a sale. We report mentions, citations and referral traffic separately,
              and never claim one caused the other.
            </p>
          </li>
        </ol>
      </Reveal>
    </section>
  )
}

/* ----------------------------- what's inside ----------------------------- */

const SECTIONS = [
  { title: "Overview", body: "Score, movement, alerts and the next three things to do." },
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
    <section className="self-stretch border-t border-[#E0DEDB] px-4 sm:px-6 md:px-10 lg:px-12 py-16 sm:py-20 md:py-24">
      <Reveal className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[680px]">
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[rgba(73,66,61,0.5)]">
              What&apos;s inside
            </div>
            <h2 className="mt-3 text-[#37322F] text-[32px] sm:text-[40px] md:text-[48px] font-normal leading-[1.1] tracking-[-0.01em] font-serif text-balance">
              Ten sections, one workspace
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-full border border-[rgba(55,50,47,0.18)] bg-white px-6 text-[14.5px] font-medium text-[#37322F] transition-colors hover:border-[rgba(55,50,47,0.35)]"
          >
            Open the workspace
          </Link>
        </div>

        <ul className="mt-11 grid gap-px overflow-hidden rounded-xl border border-[rgba(55,50,47,0.10)] bg-[rgba(55,50,47,0.10)] shadow-[0px_1px_3px_rgba(55,50,47,0.06)] sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <li key={s.title} className="bg-white p-6 transition-colors hover:bg-[#FCFBFA]">
              <h3 className="text-[16px] font-semibold text-[#37322F]">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-[22px] text-[#605A57]">{s.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
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
    <section className="self-stretch border-t border-[#E0DEDB] px-4 sm:px-6 md:px-10 lg:px-12 py-16 sm:py-20 md:py-24">
      <Reveal className="mx-auto w-full max-w-[1100px] grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[rgba(73,66,61,0.5)]">
            How we work
          </div>
          <h2 className="mt-3 text-[#37322F] text-[32px] sm:text-[40px] md:text-[48px] font-normal leading-[1.1] tracking-[-0.01em] font-serif text-balance">
            Built to be checked
          </h2>
          <p className="mt-4 text-[16px] sm:text-[17px] leading-[1.65] text-[#605A57] text-pretty">
            This is a category full of unverifiable scores. Ours are auditable on purpose.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {PROMISES.map((p) => (
            <Card as="li" key={p.title} className="p-6">
              <h3 className="text-[16px] font-semibold text-[#37322F]">{p.title}</h3>
              <p className="mt-2.5 text-[14.5px] leading-[24px] text-[#605A57]">{p.body}</p>
            </Card>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
