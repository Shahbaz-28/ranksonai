"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

import { Card, PriorityBadge, StatusBadge, Tag } from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import { series, status } from "@/components/dashboard/tokens"
import Reveal from "@/components/reveal"

/**
 * Three real dashboard surfaces, rendered with the same primitives the product
 * uses. Tabs auto-advance and respond to clicks — nothing here is decorative.
 *
 * Figures come from the sample workspace shown throughout the demo dashboard,
 * and the panel says so.
 */

const TABS = [
  {
    id: "gap",
    eyebrow: "Step 1",
    title: "See where you're invisible",
    blurb: "Every buyer question, run against every engine, with the answer stored word for word.",
  },
  {
    id: "cause",
    eyebrow: "Step 2",
    title: "Find out who gets cited instead",
    blurb: "The sources engines actually pull from, ranked, and which brand each one helps.",
  },
  {
    id: "fix",
    eyebrow: "Step 3",
    title: "Ship the fix and re-measure",
    blurb: "Prioritised work with an owner, a status, and the prompts it should move.",
  },
] as const

const ENGINE_RESULTS = [
  { name: "ChatGPT", color: series.s1, appeared: false },
  { name: "Gemini", color: series.s2, appeared: false },
  { name: "Perplexity", color: series.s3, appeared: true, position: 4 },
]

const SOURCES = [
  { key: "g2", label: "g2.com", value: 188, color: series.s2, caption: "Favours Payline Ops" },
  { key: "capterra", label: "capterra.com", value: 171, color: series.s2, caption: "Favours Payline Ops" },
  { key: "payline", label: "paylineops.com", value: 164, color: series.s7, caption: "Competitor-owned" },
  { key: "reddit", label: "reddit.com", value: 142, color: series.s4, caption: "Mixed sentiment" },
  { key: "nexora", label: "nexorapay.com", value: 142, color: series.s7, caption: "Competitor-owned" },
  { key: "harbor", label: "harborflow.io", value: 86, color: series.s1, caption: "Your site", highlight: true },
]

const FIXES = [
  {
    title: "Publish a public pricing page",
    priority: "critical" as const,
    status: "needs-approval" as const,
    impact: "+18 visibility points",
    detail: "ChatGPT excludes quote-only vendors from ranked lists. 7 tracked prompts affected.",
  },
  {
    title: "Add Product schema to 6 service pages",
    priority: "high" as const,
    status: "in-progress" as const,
    impact: "+12 visibility points",
    detail: "Engines can't parse your plan tiers or supported ERPs without it.",
  },
  {
    title: "Build a comparison page vs Payline Ops",
    priority: "high" as const,
    status: "pending" as const,
    impact: "+9 visibility points",
    detail: "Their comparison page is cited on 4 prompts you lose outright.",
  },
]

export default function ProductTour() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const paused = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (paused.current) return
      setProgress((p) => {
        if (p >= 100) {
          setActive((c) => (c + 1) % TABS.length)
          return 0
        }
        return p + 1.25
      })
    }, 100)
    return () => clearInterval(id)
  }, [])

  function select(i: number) {
    setActive(i)
    setProgress(0)
  }

  return (
    <section
      className="self-stretch border-t border-[#E0DEDB] px-4 sm:px-6 md:px-10 lg:px-12 py-14 sm:py-16 md:py-20"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <Reveal className="mx-auto w-full max-w-[1100px]">
        <div className="max-w-[680px]">
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[rgba(73,66,61,0.5)]">
            Inside the product
          </div>
          <h2 className="mt-3 text-[#37322F] text-[32px] sm:text-[40px] md:text-[48px] font-normal leading-[1.1] tracking-[-0.01em] font-serif text-balance">
            Not a score. A paper trail.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[17px] leading-[1.65] text-[#605A57] text-pretty">
            Every number traces back to a prompt, an answer and a source you can read yourself.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-0 border border-[rgba(55,50,47,0.10)] rounded-xl overflow-hidden bg-white shadow-[0px_1px_3px_rgba(55,50,47,0.06)]">
          {TABS.map((tab, i) => {
            const isActive = i === active
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => select(i)}
                aria-pressed={isActive}
                className={`relative text-left px-5 py-4 transition-colors border-b md:border-b-0 md:border-r last:border-r-0 border-[rgba(55,50,47,0.10)] ${
                  isActive ? "bg-white" : "bg-[#FBFAF9] hover:bg-white"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-[2px] w-full bg-[rgba(55,50,47,0.08)]">
                    <span
                      className="block h-full bg-[#37322F] transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </span>
                )}
                <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.45)]">
                  {tab.eyebrow}
                </span>
                <span
                  className={`mt-1 block text-[14px] font-semibold leading-5 ${
                    isActive ? "text-[#37322F]" : "text-[#605A57]"
                  }`}
                >
                  {tab.title}
                </span>
                <span className="mt-1 block text-[12.5px] leading-[19px] text-[rgba(73,66,61,0.62)]">{tab.blurb}</span>
              </button>
            )
          })}
        </div>

        {/* Panel */}
        <div className="mt-5 rounded-xl border border-[rgba(55,50,47,0.10)] bg-[#F7F5F3] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[rgba(73,66,61,0.45)]">
              Sample workspace · Harborflow
            </span>
            <Link href="/onboarding" className="text-[12.5px] font-medium text-[#37322F] hover:underline">
              Run this on your site →
            </Link>
          </div>

          {active === 0 && <GapPanel />}
          {active === 1 && <CausePanel />}
          {active === 2 && <FixPanel />}
        </div>
      </Reveal>
    </section>
  )
}

function GapPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
      <Card className="p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
          Tracked prompt
        </div>
        <p className="mt-2 text-[15px] font-medium leading-6 text-[#37322F]">
          “Best accounts payable automation software for mid-market companies”
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {ENGINE_RESULTS.map((e) => (
            <span
              key={e.name}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium"
              style={{
                borderColor: e.appeared ? "rgba(12,163,12,0.30)" : "rgba(208,59,59,0.25)",
                backgroundColor: e.appeared ? "rgba(12,163,12,0.08)" : "rgba(208,59,59,0.06)",
                color: e.appeared ? status.goodText : status.criticalText,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: e.color }} />
              {e.name}
              <span className="opacity-70">{e.appeared ? `#${e.position}` : "not mentioned"}</span>
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-[rgba(55,50,47,0.10)] bg-[#FBFAF9] p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.45)]">
            ChatGPT answer · 2 Nov 2026
          </div>
          <p className="mt-2 text-[13.5px] leading-6 text-[#49423D]">
            “For mid-market AP automation, the platforms most often recommended are{" "}
            <mark className="bg-[rgba(235,104,52,0.16)] px-0.5 text-[#37322F]">Payline Ops</mark>,{" "}
            <mark className="bg-[rgba(235,104,52,0.16)] px-0.5 text-[#37322F]">Nexora Pay</mark> and{" "}
            <mark className="bg-[rgba(235,104,52,0.16)] px-0.5 text-[#37322F]">Settlewise</mark> — each publishes
            transparent per-invoice pricing and documented ERP integrations.{" "}
            <span className="text-[#37322F] font-medium">
              Vendors that quote only on request could not be ranked here.
            </span>
            ”
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
            Why you were left out
          </div>
          <p className="mt-2 text-[13.5px] leading-6 text-[#49423D]">
            The answer says it outright: no public pricing, no ranking. That single missing page costs you{" "}
            <strong className="font-semibold text-[#37322F]">7 of 20</strong> sampled prompts.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Tag>Missing pricing page</Tag>
            <Tag>No Product schema</Tag>
            <Tag>Thin ERP docs</Tag>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-baseline justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
              Prompts you never appear on
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[34px] font-semibold leading-none text-[#37322F]">11</span>
            <span className="text-[13px] text-[#605A57]">of 20 sampled</span>
          </div>
          <p className="mt-2 text-[12.5px] leading-[19px] text-[rgba(73,66,61,0.62)]">
            Each one names a competitor in your place.
          </p>
        </Card>
      </div>
    </div>
  )
}

function CausePanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
      <Card className="p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
          Most-cited sources across your category
        </div>
        <p className="mt-1 text-[12.5px] text-[rgba(73,66,61,0.62)]">Citations counted over 240 tracked prompts</p>
        <div className="mt-4">
          <RankedBars rows={SOURCES} showRank />
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
            The pattern
          </div>
          <p className="mt-2 text-[13.5px] leading-6 text-[#49423D]">
            Two review directories outrank every vendor site. Your G2 profile is{" "}
            <strong className="font-semibold text-[#37322F]">incomplete</strong>, so the engines quote the competitor
            entries beside it instead.
          </p>
        </Card>

        <Card className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
            Share of voice
          </div>
          <div className="mt-3 flex flex-col gap-2.5">
            {[
              { name: "Payline Ops", v: 31.5, c: series.s2 },
              { name: "Nexora Pay", v: 23.8, c: series.s4 },
              { name: "Settlewise", v: 17.1, c: series.s6 },
              { name: "You", v: 14.2, c: series.s1, me: true },
            ].map((r) => (
              <div key={r.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className={`text-[13px] ${r.me ? "font-semibold text-[#37322F]" : "font-medium text-[#49423D]"}`}
                  >
                    {r.name}
                  </span>
                  <span className="text-[13px] font-semibold tabular-nums text-[#37322F]">{r.v}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[rgba(55,50,47,0.07)]">
                  <div className="h-full rounded-full" style={{ width: `${r.v * 2.8}%`, backgroundColor: r.c }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function FixPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
      <div className="flex flex-col gap-3">
        {FIXES.map((f) => (
          <Card key={f.title} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-[14.5px] font-semibold leading-5 text-[#37322F]">{f.title}</h3>
              <PriorityBadge priority={f.priority} />
            </div>
            <p className="mt-2 text-[13px] leading-[21px] text-[#605A57]">{f.detail}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={f.status} />
              <span
                className="rounded-full px-2 py-[3px] text-[11.5px] font-semibold"
                style={{ backgroundColor: "rgba(12,163,12,0.10)", color: status.goodText }}
              >
                {f.impact}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
            Open opportunity
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[34px] font-semibold leading-none text-[#37322F]">+90</span>
            <span className="text-[13px] text-[#605A57]">visibility points</span>
          </div>
          <p className="mt-2 text-[12.5px] leading-[19px] text-[rgba(73,66,61,0.62)]">
            Across 16 open recommendations, scored by the prompts each one unlocks.
          </p>
        </Card>

        <Card className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
            Then it re-runs
          </div>
          <ol className="mt-3 flex flex-col gap-2.5">
            {["Fix shipped", "Site re-crawled", "Prompts re-run", "Movement attributed"].map((s, i) => (
              <li key={s} className="flex items-center gap-2.5">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold"
                  style={{ backgroundColor: "rgba(42,120,214,0.10)", color: "#1d5ba6" }}
                >
                  {i + 1}
                </span>
                <span className="text-[13px] text-[#49423D]">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[12.5px] leading-[19px] text-[rgba(73,66,61,0.62)]">
            Every scan is kept, so you can point at the week a change landed.
          </p>
        </Card>
      </div>
    </div>
  )
}
