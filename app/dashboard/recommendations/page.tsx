import type { Metadata } from "next"

import { deliveredImpact, openImpact, promptById, recCategories, recommendations } from "@/lib/mock"
import {
  Card,
  CardHead,
  Crumbs,
  LinkButton,
  NoteCallout,
  PageHeader,
  SectionTitle,
  StatTile,
  formatNumber,
} from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import RecommendationBoard, { type RecRow } from "@/components/dashboard/recommendation-board"
import { StatusCount } from "@/components/dashboard/workflow"
import { series } from "@/components/dashboard/tokens"

export const metadata: Metadata = { title: "GEO recommendations" }

const categoryColor: Record<string, string> = {
  technical: series.s1,
  content: series.s2,
  citations: series.s3,
  brand: series.s4,
  "competitor-gap": series.s6,
}

const rows: RecRow[] = recommendations.map((rec) => {
  const volume = rec.affectedPrompts.reduce((sum, id) => sum + (promptById(id)?.monthlyVolume ?? 0), 0)
  return {
    id: rec.id,
    title: rec.title,
    category: rec.category,
    categoryLabel: recCategories.find((c) => c.id === rec.category)?.label ?? rec.category,
    priority: rec.priority,
    impact: rec.impact,
    effort: rec.effort,
    owner: rec.owner,
    problem: rec.problem,
    expectedBenefit: rec.expectedBenefit,
    promptVolume: volume,
    promptCount: rec.affectedPrompts.length,
  }
})

const allIds = recommendations.map((r) => r.id)

export default function RecommendationsPage() {
  const byCategory = recCategories.map((category) => {
    const items = recommendations.filter((r) => r.category === category.id)
    return {
      key: category.id,
      label: category.label,
      value: items.reduce((sum, r) => sum + r.impact, 0),
      valueLabel: `+${items.reduce((sum, r) => sum + r.impact, 0)} pts`,
      color: categoryColor[category.id],
      caption: `${items.length} recommendation${items.length === 1 ? "" : "s"} · ${category.blurb}`,
    }
  })

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "GEO recommendations" }]} />
        <PageHeader
          eyebrow="GEO recommendations"
          title="Analysis turned into a sequenced plan"
          description={`${recommendations.length} recommendations across five areas, worth +${openImpact} visibility points if all open items ship. ${deliveredImpact} points have already been delivered since April.`}
          actions={<LinkButton href="/dashboard/content">Content workspace</LinkButton>}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Open upside" value={`+${openImpact} pts`} caption="Modelled over 90 days if all open items ship" />
        <StatTile label="Delivered so far" value={`+${deliveredImpact} pts`} caption="From four completed recommendations" />
        <Card className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
            Waiting on you
          </div>
          <div className="mt-2 text-[30px] font-semibold leading-none text-[#37322F]">
            <StatusCount kind="recommendation" ids={allIds} status="needs-approval" />
          </div>
          <div className="mt-2 text-[12px] leading-[18px] text-[#605A57]">
            Recommendations needing an approval decision before work can start
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
            In flight
          </div>
          <div className="mt-2 text-[30px] font-semibold leading-none text-[#37322F]">
            <StatusCount kind="recommendation" ids={allIds} status="in-progress" />
          </div>
          <div className="mt-2 text-[12px] leading-[18px] text-[#605A57]">
            Being implemented now, plus{" "}
            <StatusCount kind="recommendation" ids={allIds} status="verification" /> awaiting verification
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead
            title="Modelled impact by area"
            subtitle="Where the available upside sits, summed across every recommendation in that area"
          />
          <div className="px-5 pb-5">
            <RankedBars rows={byCategory.sort((a, b) => b.value - a.value)} />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHead title="How to read this plan" />
          <div className="flex flex-col gap-3 px-5 pb-5">
            <NoteCallout tone="critical" title="Two decisions block the most value">
              Publishing a starting price and publishing alternatives pages together account for +20 of the +{openImpact}{" "}
              available points. Both are waiting on approval, not on effort.
            </NoteCallout>
            <NoteCallout tone="info" title="Sequencing matters">
              The alternatives pages depend on server-rendering the comparison tables first, and the CFO.com placement
              depends on the benchmark study. Dependencies are listed on each detail page.
            </NoteCallout>
            <NoteCallout tone="good" title="What already worked">
              Unblocking AI crawlers was worth 14 points and the integrations hub 7. Both were low-effort technical
              fixes — the pattern is that structure beats volume.
            </NoteCallout>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle
          title="The plan, grouped by workflow state"
          description="Approve, start, verify or pause any item. Changes are reflected across the dashboard."
        />
        <RecommendationBoard rows={rows} categories={recCategories.map((c) => ({ id: c.id, label: c.label }))} />
      </section>

      <Card className="p-5">
        <h2 className="text-[15px] font-semibold text-[#37322F]">What each area means</h2>
        <dl className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recCategories.map((category) => {
            const items = recommendations.filter((r) => r.category === category.id)
            const volume = items.reduce(
              (sum, r) => sum + r.affectedPrompts.reduce((s, id) => s + (promptById(id)?.monthlyVolume ?? 0), 0),
              0,
            )
            return (
              <div key={category.id} className="rounded-lg border border-[rgba(55,50,47,0.10)] p-4">
                <dt className="flex items-center gap-2 text-[13px] font-semibold text-[#37322F]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColor[category.id] }} aria-hidden />
                  {category.label}
                </dt>
                <dd className="mt-1.5 text-[12px] leading-[19px] text-[#605A57]">{category.blurb}</dd>
                <dd className="mt-2 text-[12px] text-[rgba(73,66,61,0.62)]">
                  {items.length} item{items.length === 1 ? "" : "s"} · {formatNumber(volume)} monthly searches touched
                </dd>
              </div>
            )
          })}
        </dl>
      </Card>
    </div>
  )
}
