import Link from "next/link"
import type { Metadata } from "next"

import {
  citedSources,
  competitors,
  gapPrompts,
  ourRank,
  platforms,
  prompts,
  rivals,
  shareOfVoiceTrend,
  us,
} from "@/lib/mock"
import {
  Card,
  CardHead,
  Crumbs,
  Delta,
  LinkButton,
  NoteCallout,
  PageHeader,
  SectionTitle,
  StatTile,
  TableWrap,
  Tag,
  Td,
  Th,
  formatNumber,
} from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import { TrendLines } from "@/components/dashboard/charts"

export const metadata: Metadata = { title: "Competitor analysis" }

const trendSpecs = [
  { key: "harborflow", name: "Harborflow", color: "#2a78d6" },
  { key: "paylineOps", name: "Payline Ops", color: "#eb6834" },
  { key: "nexoraPay", name: "Nexora Pay", color: "#1baf7a" },
  { key: "settlewise", name: "Settlewise", color: "#eda100" },
]

export default function CompetitorsPage() {
  /** Prompts a rival wins outright while we are absent. */
  const gapRows = gapPrompts.map((prompt) => {
    const brands = Array.from(new Set(prompt.responses.flatMap((r) => r.brandsMentioned)))
    return { prompt, brands }
  })

  const competitorSources = citedSources
    .filter((s) => s.favours.some((slug) => slug !== "harborflow"))
    .sort((a, b) => b.citations - a.citations)

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Competitor analysis" }]} />
        <PageHeader
          eyebrow="Competitor analysis"
          title={`You hold ${us.shareOfVoice}% share of voice — rank ${ourRank} of ${competitors.length}`}
          description="Payline Ops is named in roughly twice as many answers as you. The gap is not capability: it is review volume, published pricing and competitor-authored comparison pages."
          actions={<LinkButton href="/dashboard/prompts">Prompt-level view</LinkButton>}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Your share of voice"
          value={`${us.shareOfVoice}%`}
          delta={us.shareDelta}
          deltaUnit="pts"
          caption={`Rank ${ourRank} of ${competitors.length} tracked brands`}
        />
        <StatTile label="Leader" value="31.5%" delta={-1.2} deltaUnit="pts" caption="Payline Ops, slowly eroding" />
        <StatTile label="Gap to leader" value="17.3 pts" delta={-4.8} deltaUnit="pts" caption="Narrowed since April" />
        <StatTile
          label="Prompts lost to rivals"
          value={`${gapPrompts.length} of ${prompts.length}`}
          caption={`${formatNumber(gapPrompts.reduce((s, p) => s + p.monthlyVolume, 0))} monthly searches`}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead title="Share of voice over time" subtitle="You and the three closest rivals, April – November 2026" />
          <div className="px-5 pb-5">
            <TrendLines data={shareOfVoiceTrend} specs={trendSpecs} suffix="%" domain={[0, 40]} />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHead title="Current standings" subtitle="Share of the 240 tracked prompts" />
          <div className="px-5 pb-5">
            <RankedBars
              showRank
              max={35}
              rows={[...competitors]
                .sort((a, b) => b.shareOfVoice - a.shareOfVoice)
                .map((c) => ({
                  key: c.slug,
                  label: c.name,
                  value: c.shareOfVoice,
                  valueLabel: `${c.shareOfVoice}%`,
                  color: c.color,
                  delta: c.shareDelta,
                  deltaUnit: "pts",
                  href: c.isUs ? undefined : `/dashboard/competitors/${c.slug}`,
                  highlight: c.isUs,
                }))}
            />
          </div>
        </Card>
      </section>

      {/* Full comparison */}
      <section className="flex flex-col gap-3">
        <SectionTitle title="Head-to-head metrics" description="Every tracked brand on the same five measures." />
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Brand</Th>
                <Th align="right">Share of voice</Th>
                <Th align="right">Visibility</Th>
                <Th align="right">Mention rate</Th>
                <Th align="right">Citation rate</Th>
                <Th align="right">Avg position</Th>
              </tr>
            </thead>
            <tbody>
              {[...competitors]
                .sort((a, b) => b.shareOfVoice - a.shareOfVoice)
                .map((competitor) => (
                  <tr
                    key={competitor.slug}
                    className={competitor.isUs ? "bg-[rgba(42,120,214,0.04)]" : "transition-colors hover:bg-[rgba(55,50,47,0.015)]"}
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: competitor.color }}
                          aria-hidden
                        />
                        {competitor.isUs ? (
                          <span className="font-semibold text-[#37322F]">{competitor.name}</span>
                        ) : (
                          <Link
                            href={`/dashboard/competitors/${competitor.slug}`}
                            className="font-medium text-[#37322F] hover:underline"
                          >
                            {competitor.name}
                          </Link>
                        )}
                        {competitor.isUs && <Tag tone="accent">You</Tag>}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-[rgba(73,66,61,0.55)]">{competitor.domain}</div>
                    </Td>
                    <Td align="right">
                      <div className="flex items-center justify-end gap-2">
                        {competitor.shareOfVoice}%
                        <Delta value={competitor.shareDelta} invert={!competitor.isUs} />
                      </div>
                    </Td>
                    <Td align="right">{competitor.visibilityScore}</Td>
                    <Td align="right">{competitor.mentionRate}%</Td>
                    <Td align="right">{competitor.citationRate}%</Td>
                    <Td align="right">#{competitor.avgPosition}</Td>
                  </tr>
                ))}
            </tbody>
          </TableWrap>
        </Card>
      </section>

      {/* Platform-by-platform */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Mention rate by engine"
          description="Each engine favours a different brand. Copilot is where you trail furthest."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platforms.map((platform) => (
            <Card key={platform.id} className="p-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: platform.color }} aria-hidden />
                <Link href={`/dashboard/visibility/${platform.id}`} className="text-[14px] font-semibold text-[#37322F] hover:underline">
                  {platform.name}
                </Link>
              </div>
              <div className="mt-4">
                <RankedBars
                  max={80}
                  rows={[...competitors]
                    .sort((a, b) => b.byPlatform[platform.id] - a.byPlatform[platform.id])
                    .map((c) => ({
                      key: c.slug,
                      label: c.name,
                      value: c.byPlatform[platform.id],
                      valueLabel: `${c.byPlatform[platform.id]}%`,
                      color: c.color,
                      href: c.isUs ? undefined : `/dashboard/competitors/${c.slug}`,
                      highlight: c.isUs,
                    }))}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Gap prompts */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Prompts competitors win and you do not appear in"
          description="Every one of these is a buyer question where an engine recommends someone else and never names you."
        />
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Buyer question</Th>
                <Th>Stage</Th>
                <Th>Brands named instead</Th>
                <Th align="right">Volume</Th>
              </tr>
            </thead>
            <tbody>
              {gapRows.map(({ prompt, brands }) => (
                <tr key={prompt.id} className="transition-colors hover:bg-[rgba(55,50,47,0.015)]">
                  <Td>
                    <Link href={`/dashboard/prompts/${prompt.id}`} className="font-medium text-[#37322F] hover:underline">
                      {prompt.question}
                    </Link>
                    {prompt.opportunity && (
                      <div className="mt-1 max-w-[460px] text-[12px] leading-[18px] text-[rgba(73,66,61,0.62)]">
                        {prompt.opportunity}
                      </div>
                    )}
                  </Td>
                  <Td className="capitalize">{prompt.stage}</Td>
                  <Td>
                    <div className="flex max-w-[240px] flex-wrap gap-1">
                      {brands.map((brand) => {
                        const match = competitors.find((c) => c.name === brand)
                        return match && !match.isUs ? (
                          <Link
                            key={brand}
                            href={`/dashboard/competitors/${match.slug}`}
                            className="rounded bg-[rgba(55,50,47,0.05)] px-1.5 py-[2px] text-[11px] text-[#605A57] hover:bg-[rgba(55,50,47,0.09)]"
                          >
                            {brand}
                          </Link>
                        ) : (
                          <span
                            key={brand}
                            className="rounded bg-[rgba(55,50,47,0.05)] px-1.5 py-[2px] text-[11px] text-[#605A57]"
                          >
                            {brand}
                          </span>
                        )
                      })}
                    </div>
                  </Td>
                  <Td align="right">{formatNumber(prompt.monthlyVolume)}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      </section>

      {/* Competitor sources */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead
            title="Sources feeding competitor citations"
            subtitle="Ranked by citations, with the brands each one favours"
          />
          <div className="px-5 pb-5">
            <RankedBars
              rows={competitorSources.map((source) => ({
                key: source.slug,
                label: source.label,
                value: source.citations,
                color: source.mentionsUs ? "#1baf7a" : "#eb6834",
                caption: `Favours ${source.favours.map((f) => f.replace(/-/g, " ")).join(", ")}`,
                href: `/dashboard/citations/${source.slug}`,
              }))}
            />
          </div>
        </Card>

        <Card>
          <CardHead title="What the leaders do that you do not" subtitle="Patterns common to the top two brands" />
          <div className="flex flex-col gap-3 px-5 pb-5">
            {rivals.slice(0, 3).map((rival) => (
              <div key={rival.slug} className="rounded-lg border border-[rgba(55,50,47,0.10)] p-4">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/dashboard/competitors/${rival.slug}`}
                    className="text-[13px] font-semibold text-[#37322F] hover:underline"
                  >
                    {rival.name}
                  </Link>
                  <span className="text-[12px] font-semibold tabular-nums text-[#37322F]">{rival.shareOfVoice}%</span>
                </div>
                <ul className="mt-2 flex flex-col gap-1">
                  {rival.strengths.map((strength) => (
                    <li key={strength} className="flex gap-2 text-[12px] leading-[19px] text-[#605A57]">
                      <span className="text-[rgba(73,66,61,0.45)]" aria-hidden>
                        •
                      </span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <NoteCallout tone="info" title="The shared pattern">
              Both leaders publish pricing, publish a benchmark study, and publish comparison pages that name rivals.
              All three are recommendations already in your plan.
            </NoteCallout>
          </div>
        </Card>
      </section>
    </div>
  )
}
