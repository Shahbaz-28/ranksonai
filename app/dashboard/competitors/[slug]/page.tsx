import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { citedSources, competitorBySlug, platforms, promptById, rivals, us } from "@/lib/mock"
import {
  AppearanceBadge,
  Card,
  CardHead,
  Crumbs,
  DefList,
  Delta,
  EmptyState,
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

/** Only ids present in the dataset exist — anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return rivals.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const competitor = competitorBySlug(params.slug)
  return { title: competitor ? `${competitor.name} vs Harborflow` : "Competitor" }
}

export default function CompetitorDetailPage({ params }: { params: { slug: string } }) {
  const competitor = competitorBySlug(params.slug)
  if (!competitor || competitor.isUs) notFound()

  const winPrompts = competitor.winsOn.map((id) => promptById(id)).filter(Boolean)
  const winVolume = winPrompts.reduce((sum, prompt) => sum + (prompt?.monthlyVolume ?? 0), 0)
  const theirSources = citedSources.filter((s) => s.favours.includes(competitor.slug))

  const comparisons = [
    { label: "Share of voice", ours: `${us.shareOfVoice}%`, theirs: `${competitor.shareOfVoice}%`, lead: competitor.shareOfVoice > us.shareOfVoice },
    { label: "Visibility score", ours: `${us.visibilityScore}`, theirs: `${competitor.visibilityScore}`, lead: competitor.visibilityScore > us.visibilityScore },
    { label: "Mention rate", ours: `${us.mentionRate}%`, theirs: `${competitor.mentionRate}%`, lead: competitor.mentionRate > us.mentionRate },
    { label: "Citation rate", ours: `${us.citationRate}%`, theirs: `${competitor.citationRate}%`, lead: competitor.citationRate > us.citationRate },
    { label: "Avg position", ours: `#${us.avgPosition}`, theirs: `#${competitor.avgPosition}`, lead: competitor.avgPosition < us.avgPosition },
  ]

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Competitor analysis", href: "/dashboard/competitors" },
            { label: competitor.name },
          ]}
        />
        <PageHeader
          eyebrow="Competitor profile"
          title={competitor.name}
          description={competitor.positioning}
          actions={<LinkButton href="/dashboard/competitors">All competitors</LinkButton>}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{competitor.domain}</Tag>
          <Tag>{competitor.shareOfVoice}% share of voice</Tag>
          <Tag>Wins {competitor.winsOn.length} tracked prompts</Tag>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Their share of voice"
          value={`${competitor.shareOfVoice}%`}
          delta={competitor.shareDelta}
          deltaUnit="pts"
          caption={`Yours is ${us.shareOfVoice}%`}
        />
        <StatTile label="Their visibility score" value={`${competitor.visibilityScore}`} caption={`Yours is ${us.visibilityScore}`} />
        <StatTile label="Their mention rate" value={`${competitor.mentionRate}%`} caption={`Yours is ${us.mentionRate}%`} />
        <StatTile
          label="Demand on prompts they win"
          value={formatNumber(winVolume)}
          caption={`Across ${competitor.winsOn.length} tracked prompts`}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead title="Side by side" subtitle="Where they lead and where you do" />
          <TableWrap>
            <thead>
              <tr>
                <Th>Measure</Th>
                <Th align="right">Harborflow</Th>
                <Th align="right">{competitor.name}</Th>
                <Th align="right">Leader</Th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row) => (
                <tr key={row.label}>
                  <Td>{row.label}</Td>
                  <Td align="right" className={!row.lead ? "font-semibold text-[#37322F]" : undefined}>
                    {row.ours}
                  </Td>
                  <Td align="right" className={row.lead ? "font-semibold text-[#37322F]" : undefined}>
                    {row.theirs}
                  </Td>
                  <Td align="right">
                    {row.lead ? (
                      <span className="text-[12px] font-medium text-[#9c2626]">{competitor.name}</span>
                    ) : (
                      <span className="text-[12px] font-medium text-[#1f6b1f]">You</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHead title="Why they win" />
            <ul className="flex flex-col gap-2 px-5 pb-5">
              {competitor.strengths.map((strength) => (
                <li key={strength} className="flex gap-2 text-[13px] leading-5 text-[#49423D]">
                  <span className="text-[rgba(73,66,61,0.45)]" aria-hidden>
                    •
                  </span>
                  {strength}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHead title="Profile" />
            <div className="px-5 pb-5">
              <DefList
                items={[
                  { label: "Domain", value: competitor.domain },
                  { label: "Avg position", value: `#${competitor.avgPosition}` },
                  { label: "Citation rate", value: `${competitor.citationRate}%` },
                  { label: "Share trend", value: <Delta value={competitor.shareDelta} unit="pts" invert /> },
                ]}
              />
            </div>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="Mention rate by engine" subtitle="Them versus you on each engine" />
          <div className="px-5 pb-5">
            <RankedBars
              max={80}
              rows={platforms.flatMap((platform) => [
                {
                  key: `${platform.id}-them`,
                  label: `${platform.name} — ${competitor.name}`,
                  value: competitor.byPlatform[platform.id],
                  valueLabel: `${competitor.byPlatform[platform.id]}%`,
                  color: competitor.color,
                },
                {
                  key: `${platform.id}-us`,
                  label: `${platform.name} — you`,
                  value: us.byPlatform[platform.id],
                  valueLabel: `${us.byPlatform[platform.id]}%`,
                  color: us.color,
                  highlight: true,
                  href: `/dashboard/visibility/${platform.id}`,
                },
              ])}
            />
          </div>
        </Card>

        <Card>
          <CardHead
            title="Sources that cite them"
            subtitle="Open a source to see which prompts it feeds"
            action={
              <Link href="/dashboard/citations" className="font-medium text-[#37322F] hover:underline">
                All sources →
              </Link>
            }
          />
          <div className="px-5 pb-5">
            <RankedBars
              rows={competitor.topSources.map((source) => {
                const match = citedSources.find((s) => s.domain === source.domain)
                return {
                  key: source.domain,
                  label: source.domain,
                  value: source.citations,
                  color: match?.mentionsUs ? "#1baf7a" : "#eb6834",
                  caption: match?.mentionsUs ? "Also mentions you" : "Never mentions you",
                  href: match ? `/dashboard/citations/${match.slug}` : undefined,
                }
              })}
            />
            {theirSources.length > 0 && (
              <p className="mt-4 text-[12px] leading-[19px] text-[rgba(73,66,61,0.62)]">
                {theirSources.length} of the sources we track explicitly favour {competitor.name} in cited answers.
              </p>
            )}
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle
          title={`Prompts ${competitor.name} wins`}
          description="Buyer questions where this brand is recommended. The badge shows whether any engine named you at all in that answer."
        />
        {winPrompts.length ? (
          <Card>
            <TableWrap>
              <thead>
                <tr>
                  <Th>Buyer question</Th>
                  <Th>Stage</Th>
                  <Th>You</Th>
                  <Th>Why they win it</Th>
                  <Th align="right">Volume</Th>
                </tr>
              </thead>
              <tbody>
                {winPrompts.map((prompt) =>
                  prompt ? (
                    <tr key={prompt.id} className="transition-colors hover:bg-[rgba(55,50,47,0.015)]">
                      <Td>
                        <Link href={`/dashboard/prompts/${prompt.id}`} className="font-medium text-[#37322F] hover:underline">
                          {prompt.question}
                        </Link>
                      </Td>
                      <Td className="capitalize">{prompt.stage}</Td>
                      <Td>
                        <AppearanceBadge appeared={prompt.responses.some((r) => r.appeared)} />
                      </Td>
                      <Td>
                        <span className="block max-w-[420px] text-[12px] leading-[19px] text-[#605A57]">
                          {prompt.responses.find((r) => r.note)?.note ?? prompt.opportunity ?? "—"}
                        </span>
                      </Td>
                      <Td align="right">{formatNumber(prompt.monthlyVolume)}</Td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </TableWrap>
          </Card>
        ) : (
          <Card>
            <EmptyState
              title="No exclusive wins"
              detail={`${competitor.name} does not currently win any tracked prompt that you are absent from.`}
            />
          </Card>
        )}
      </section>

      <NoteCallout tone="info" title="How to contest this">
        The gap against {competitor.name} is concentrated in{" "}
        {competitor.slug === "payline-ops"
          ? "review volume and alternatives pages"
          : competitor.slug === "nexora-pay"
            ? "published trust documentation and analyst listings"
            : "published pricing and community presence"}
        . The matching recommendations are already in your plan — see{" "}
        <Link href="/dashboard/recommendations" className="font-medium text-[#37322F] underline">
          GEO recommendations
        </Link>
        .
      </NoteCallout>
    </div>
  )
}
