import Link from "next/link"
import type { Metadata } from "next"

import {
  appearanceRate,
  appearsAnywhere,
  gapPrompts,
  platformById,
  prompts,
  stageDescriptions,
  stageLabels,
  stageSummary,
  totalTrackedPrompts,
} from "@/lib/mock"
import {
  Card,
  Crumbs,
  Meter,
  PageHeader,
  SectionTitle,
  StatTile,
  formatNumber,
} from "@/components/dashboard/kit"
import PromptExplorer, { type PromptRow } from "@/components/dashboard/prompt-explorer"
import { series } from "@/components/dashboard/tokens"

export const metadata: Metadata = { title: "Prompt intelligence" }

const stageColor: Record<string, string> = {
  discovery: series.s1,
  exploration: series.s2,
  comparison: series.s3,
  evaluation: series.s4,
  purchase: series.s6,
}

const rows: PromptRow[] = prompts.map((prompt) => {
  const positions = prompt.responses.filter((r) => r.position).map((r) => r.position as number)
  const competitors = Array.from(
    new Set(prompt.responses.flatMap((r) => r.brandsMentioned).filter((brand) => brand !== "Harborflow")),
  )
  return {
    id: prompt.id,
    question: prompt.question,
    stage: prompt.stage,
    stageLabel: stageLabels[prompt.stage],
    intent: prompt.intent,
    priority: prompt.priority,
    monthlyVolume: prompt.monthlyVolume,
    appeared: appearsAnywhere(prompt),
    appearanceRate: appearanceRate(prompt),
    bestPosition: positions.length ? Math.min(...positions) : null,
    competitors,
    citations: new Set(prompt.responses.flatMap((r) => r.citations)).size,
    topBrand: prompt.topBrand,
    platforms: prompt.responses.map((response) => {
      const platform = platformById(response.platform)!
      return { id: platform.id, name: platform.name, color: platform.color, appeared: response.appeared }
    }),
  }
})

export default function PromptsPage() {
  const gapVolume = gapPrompts.reduce((sum, p) => sum + p.monthlyVolume, 0)
  const totalVolume = prompts.reduce((sum, p) => sum + p.monthlyVolume, 0)

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Prompt intelligence" }]} />
        <PageHeader
          eyebrow="Prompt intelligence"
          title="The questions your buyers are actually asking AI"
          description={`${totalTrackedPrompts} prompts are monitored across five engines; 20 are sampled in full with their complete answers. ${gapPrompts.length} of those 20 never mention you — worth ${formatNumber(gapVolume)} monthly searches.`}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Prompts monitored" value={formatNumber(totalTrackedPrompts)} caption="Refreshed weekly per engine" />
        <StatTile label="Sampled in full" value={`${prompts.length}`} caption="Complete answers and citations captured" />
        <StatTile
          label="Prompts you appear in"
          value={`${prompts.length - gapPrompts.length} of ${prompts.length}`}
          delta={1}
          deltaUnit="prompt"
          caption="At least one engine names you"
        />
        <StatTile
          label="Demand you are absent from"
          value={formatNumber(gapVolume)}
          caption={`${Math.round((gapVolume / totalVolume) * 100)}% of tracked monthly searches`}
        />
      </section>

      {/* Funnel coverage */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Coverage by buyer stage"
          description="Where in the journey engines name you — and where they do not."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stageSummary.map((stage) => (
            <Card key={stage.stage} className="flex flex-col p-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stageColor[stage.stage] }} aria-hidden />
                <h3 className="text-[13px] font-semibold text-[#37322F]">{stage.label}</h3>
              </div>
              <div className="mt-3 text-[24px] font-semibold leading-none text-[#37322F]">
                {stage.covered}
                <span className="text-[14px] font-medium text-[rgba(73,66,61,0.55)]"> / {stage.total}</span>
              </div>
              <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">prompts where you appear</div>
              <div className="mt-3">
                <Meter value={stage.coverage} valueLabel={`${stage.coverage}%`} color={stageColor[stage.stage]} />
              </div>
              <p className="mt-3 text-[12px] leading-[18px] text-[#605A57]">{stageDescriptions[stage.stage]}</p>
              <div className="mt-3 border-t border-[rgba(55,50,47,0.06)] pt-2 text-[12px] text-[rgba(73,66,61,0.62)]">
                {formatNumber(stage.volume)} monthly searches
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Explorer */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Prompt explorer"
          description="Filter by stage, isolate the gaps, or search for a competitor name to see every prompt they win."
          action={
            <Link href="/dashboard/competitors" className="text-[13px] font-medium text-[#37322F] hover:underline">
              Competitor view →
            </Link>
          }
        />
        <PromptExplorer rows={rows} />
      </section>
    </div>
  )
}
