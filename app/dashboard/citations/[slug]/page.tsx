import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { citedSources, competitorBySlug, platformById, promptById, sourceBySlug } from "@/lib/mock"
import {
  AppearanceBadge,
  Card,
  CardHead,
  Crumbs,
  DefList,
  Delta,
  EmptyState,
  LinkButton,
  Meter,
  NoteCallout,
  PageHeader,
  PlatformChip,
  SectionTitle,
  StatTile,
  TableWrap,
  Tag,
  Td,
  Th,
  formatNumber,
} from "@/components/dashboard/kit"
import { series } from "@/components/dashboard/tokens"

/** Only ids present in the dataset exist — anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return citedSources.map((s) => ({ slug: s.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const source = sourceBySlug(params.slug)
  return { title: source ? `${source.label} citations` : "Source" }
}

const typeLabels: Record<string, string> = {
  owned: "Vendor-owned site",
  review: "Review platform",
  publication: "Trade publication",
  community: "Community",
  directory: "Directory",
  social: "Social",
}

export default function SourceDetailPage({ params }: { params: { slug: string } }) {
  const source = sourceBySlug(params.slug)
  if (!source) notFound()

  const linkedPrompts = source.prompts.map((id) => promptById(id)).filter(Boolean)
  const promptVolume = linkedPrompts.reduce((sum, prompt) => sum + (prompt?.monthlyVolume ?? 0), 0)
  const isOurs = source.domain === "harborflow.io"

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Citation intelligence", href: "/dashboard/citations" },
            { label: source.label },
          ]}
        />
        <PageHeader
          eyebrow={typeLabels[source.type]}
          title={source.label}
          description={source.summary}
          actions={<LinkButton href="/dashboard/citations">All sources</LinkButton>}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{source.domain}</Tag>
          <Tag>Authority {source.authority}/100</Tag>
          <AppearanceBadge appeared={source.mentionsUs} />
          {isOurs && <Tag tone="accent">Your own domain</Tag>}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Citations"
          value={formatNumber(source.citations)}
          delta={source.citationsDelta}
          deltaUnit="vs Oct"
          caption="In sampled answers"
        />
        <StatTile label="Share of all citations" value={`${source.share}%`} caption="Of 1,083 citations total" />
        <StatTile label="Prompts it feeds" value={`${source.prompts.length}`} caption={`${formatNumber(promptVolume)} monthly searches`} />
        <StatTile label="Engines using it" value={`${source.platforms.length}`} caption="Of 5 tracked engines" />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead
            title="Prompts that cite this source"
            subtitle="Whether you appear in the answer each one produced"
          />
          <TableWrap>
            <thead>
              <tr>
                <Th>Prompt</Th>
                <Th>Stage</Th>
                <Th>You appear</Th>
                <Th align="right">Volume</Th>
              </tr>
            </thead>
            <tbody>
              {linkedPrompts.map((prompt) =>
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
                    <Td align="right">{formatNumber(prompt.monthlyVolume)}</Td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </TableWrap>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHead title="Engines drawing on it" />
            <div className="px-5 pb-5">
              <ul className="flex flex-wrap gap-2">
                {source.platforms.map((id) => {
                  const platform = platformById(id)!
                  return (
                    <li key={id}>
                      <Link href={`/dashboard/visibility/${id}`}>
                        <PlatformChip name={platform.name} color={platform.color} />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Card>

          <Card>
            <CardHead title="Who this source favours" />
            <div className="px-5 pb-5">
              {source.favours.length ? (
                <ul className="flex flex-col gap-3">
                  {source.favours.map((slug) => {
                    const competitor = competitorBySlug(slug)
                    if (!competitor) return null
                    return (
                      <li key={slug}>
                        <Link
                          href={competitor.isUs ? "/dashboard/competitors" : `/dashboard/competitors/${slug}`}
                          className="block"
                        >
                          <Meter
                            label={competitor.name}
                            value={competitor.shareOfVoice}
                            max={35}
                            valueLabel={`${competitor.shareOfVoice}% SOV`}
                            color={competitor.color}
                          />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-[13px] leading-5 text-[#605A57]">
                  Vendor-neutral. Inclusion here comes from contributed expertise rather than placement.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <CardHead title="Source profile" />
            <div className="px-5 pb-5">
              <DefList
                items={[
                  { label: "Domain", value: source.domain },
                  { label: "Type", value: typeLabels[source.type] },
                  { label: "Authority", value: `${source.authority}/100` },
                  { label: "Mentions you", value: source.mentionsUs ? "Yes" : "No" },
                  {
                    label: "Trend",
                    value: <Delta value={source.citationsDelta} unit="citations" />,
                  },
                ]}
              />
            </div>
          </Card>
        </div>
      </section>

      {source.action && (
        <section className="flex flex-col gap-3">
          <SectionTitle title="What to do about it" />
          <NoteCallout tone={source.mentionsUs ? "info" : "critical"} title="Recommended approach">
            {source.action}
          </NoteCallout>
        </section>
      )}

      {linkedPrompts.length === 0 && (
        <Card>
          <EmptyState
            title="No prompts cite this source yet"
            detail="It appeared in the domain sweep but has not been cited in a sampled answer during the current period."
          />
        </Card>
      )}
    </div>
  )
}
