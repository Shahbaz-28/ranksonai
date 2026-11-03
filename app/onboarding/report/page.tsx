"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  auditScores,
  auditSummary,
  business,
  competitors,
  gapPrompts,
  platforms,
  prompts,
  recommendations,
  us,
} from "@/lib/mock"
import { Card, CardHead, NoteCallout, ScoreRing, SectionTitle, StatTile, Tag, formatNumber } from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import { useDashboard } from "@/components/dashboard/dashboard-state"

const topActions = [...recommendations].sort((a, b) => b.impact - a.impact).slice(0, 3)

export default function OnboardingReportPage() {
  const { profile } = useDashboard()
  const companyName = profile?.company || business.name
  const companyDomain = profile?.domain || business.domain
  const industry = profile?.industry || business.industry
  const location = profile?.location || business.hq
  const services = profile?.services?.length ? profile.services : business.services.map((s) => s.name)
  const rivals = profile?.competitors?.length ? profile.competitors : competitors.filter((c) => !c.isUs).map((c) => c.name)
  const gapVolume = gapPrompts.reduce((sum, prompt) => sum + prompt.monthlyVolume, 0)

  return (
    <div className="flex flex-col gap-7">
      <div className="max-w-[680px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(73,66,61,0.55)]">
          Step 3 of 3 · Initial GEO report
        </div>
        <h1 className="mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[#37322F] sm:text-[32px]">
          {companyName} is recommended in 38% of buyer questions
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-[#605A57]">
          This is your starting position across ChatGPT, Gemini, Perplexity, Claude and Copilot. Two blockers account
          for most of what is missing, and both are fixable without new product work.
        </p>
      </div>

      {/* Profile as engines see it */}
      <Card>
        <CardHead
          title="Your business, as the engines can see it"
          subtitle="Extracted from the crawl — this is what an AI model has to work with"
        />
        <div className="grid grid-cols-1 gap-5 px-5 pb-5 md:grid-cols-2">
          <dl className="flex flex-col gap-3">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                Company
              </dt>
              <dd className="mt-0.5 text-[14px] font-semibold text-[#37322F]">{companyName}</dd>
              <dd className="font-mono text-[12px] text-[rgba(73,66,61,0.62)]">{companyDomain}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                Category
              </dt>
              <dd className="mt-0.5 text-[13px] text-[#49423D]">{industry}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                Location
              </dt>
              <dd className="mt-0.5 text-[13px] text-[#49423D]">{location}</dd>
            </div>
          </dl>
          <dl className="flex flex-col gap-3">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                Services identified
              </dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {services.map((service) => (
                  <Tag key={service}>{service}</Tag>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                Competitors detected
              </dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {rivals.map((rival) => (
                  <Tag key={rival}>{rival}</Tag>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-[rgba(55,50,47,0.08)] px-5 py-4">
          <NoteCallout tone="critical" title="One problem found immediately">
            Your site describes the company four different ways — "AP automation", "invoice-to-pay", "spend management"
            and "finance operations platform" — and as "Procurement software" on one review profile. Engines cluster
            vendors by category phrase, so this dilutes every category answer.
          </NoteCallout>
        </div>
      </Card>

      {/* Starting position */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-4 p-5">
          <ScoreRing value={61} caption="Starting AI visibility score across five engines" />
          <div className="text-center text-[12px] text-[rgba(73,66,61,0.62)]">
            GEO readiness of the website scores {auditSummary.score}/100 separately
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          <StatTile label="Brand mention rate" value="38%" caption={`${prompts.length - gapPrompts.length} of ${prompts.length} sampled prompts name you`} />
          <StatTile label="Citation rate" value="25%" caption="Answers citing your own domain" />
          <StatTile label="Share of voice" value={`${us.shareOfVoice}%`} caption={`Rank 4 of ${competitors.length} brands`} />
          <StatTile label="Demand you are absent from" value={formatNumber(gapVolume)} caption="Monthly searches in gap prompts" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="Starting position by engine" subtitle="Visibility score out of 100" />
          <div className="px-5 pb-5">
            <RankedBars
              max={100}
              rows={platforms.map((platform) => ({
                key: platform.id,
                label: platform.name,
                value: platform.score,
                color: platform.color,
                caption: `${platform.mentionRate}% mention rate`,
              }))}
            />
          </div>
        </Card>
        <Card>
          <CardHead title="GEO readiness by area" subtitle="Weakest areas first — these are what the plan addresses" />
          <div className="px-5 pb-5">
            <RankedBars
              max={100}
              rows={Object.entries(auditScores)
                .map(([key, value]) => ({
                  key,
                  label: key.charAt(0).toUpperCase() + key.slice(1),
                  value,
                  color: value >= 80 ? "#1baf7a" : value >= 60 ? "#2a78d6" : value >= 40 ? "#eda100" : "#eb6834",
                }))
                .sort((a, b) => a.value - b.value)
                .slice(0, 6)}
            />
          </div>
        </Card>
      </section>

      {/* First actions */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Where to start"
          description="The three highest-impact actions from the first analysis, with modelled visibility gain."
        />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {topActions.map((rec) => (
            <Card as="li" key={rec.id} className="flex flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <Tag tone="accent">+{rec.impact} pts</Tag>
                <span className="text-[11px] text-[rgba(73,66,61,0.55)] capitalize">{rec.effort} effort</span>
              </div>
              <h3 className="mt-2.5 text-[14px] font-semibold leading-5 text-[#37322F]">{rec.title}</h3>
              <p className="mt-2 flex-1 text-[13px] leading-[21px] text-[#605A57]">{rec.problem}</p>
              <Link
                href={`/dashboard/recommendations/${rec.id}`}
                className="mt-3 text-[13px] font-medium text-[#37322F] underline-offset-2 hover:underline"
              >
                Open recommendation →
              </Link>
            </Card>
          ))}
        </ul>
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="max-w-[560px]">
          <h2 className="text-[16px] font-semibold text-[#37322F]">Your workspace is ready</h2>
          <p className="mt-1.5 text-[13px] leading-6 text-[#605A57]">
            Every prompt, answer, citation, competitor and recommendation behind this report is in the dashboard.
            Tracking continues weekly from here.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#37322F] px-5 text-[13px] font-medium text-white transition-colors hover:bg-[#2A2520]"
        >
          Go to the dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  )
}
