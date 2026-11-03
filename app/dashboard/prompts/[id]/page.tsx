import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import {
  appearanceRate,
  competitors,
  contentBriefs,
  citedSources,
  platformById,
  promptById,
  prompts,
  recommendations,
  stageDescriptions,
  stageLabels,
} from "@/lib/mock"
import {
  AppearanceBadge,
  Card,
  CardHead,
  Crumbs,
  DefList,
  EmptyState,
  LinkButton,
  NoteCallout,
  PageHeader,
  PriorityBadge,
  Quote,
  SectionTitle,
  StatTile,
  Tag,
  formatDateTime,
  formatNumber,
} from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import { LiveStatus } from "@/components/dashboard/workflow"

/** Only ids present in the dataset exist — anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return prompts.map((p) => ({ id: p.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const prompt = promptById(params.id)
  return { title: prompt ? prompt.question : "Prompt" }
}

export default function PromptDetailPage({ params }: { params: { id: string } }) {
  const prompt = promptById(params.id)
  if (!prompt) notFound()

  const rate = appearanceRate(prompt)
  const positions = prompt.responses.filter((r) => r.position).map((r) => r.position as number)
  const citationDomains = Array.from(new Set(prompt.responses.flatMap((r) => r.citations)))

  /** How often each brand is named across this prompt's answers. */
  const brandCounts = new Map<string, number>()
  for (const response of prompt.responses) {
    for (const brand of response.brandsMentioned) {
      brandCounts.set(brand, (brandCounts.get(brand) ?? 0) + 1)
    }
  }
  const brandRows = Array.from(brandCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([brand, count]) => {
      const match = competitors.find((c) => c.name === brand)
      return {
        key: brand,
        label: brand,
        value: count,
        valueLabel: `${count} of ${prompt.responses.length} answers`,
        color: match?.color ?? "#898781",
        href: match && !match.isUs ? `/dashboard/competitors/${match.slug}` : undefined,
        highlight: brand === "Harborflow",
      }
    })

  const linkedRecs = recommendations.filter((r) => r.affectedPrompts.includes(prompt.id))
  const linkedBriefs = contentBriefs.filter((b) => b.targetPrompts.includes(prompt.id))

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Prompt intelligence", href: "/dashboard/prompts" },
            { label: prompt.id },
          ]}
        />
        <PageHeader
          eyebrow={`${stageLabels[prompt.stage]} · ${prompt.intent}`}
          title={prompt.question}
          description={stageDescriptions[prompt.stage]}
          actions={
            <>
              <LinkButton href="/dashboard/prompts">Back to prompts</LinkButton>
              {linkedRecs[0] && (
                <LinkButton href={`/dashboard/recommendations/${linkedRecs[0].id}`} variant="primary">
                  Open linked action
                </LinkButton>
              )}
            </>
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={prompt.priority} />
          <AppearanceBadge appeared={rate > 0} />
          <Tag>{formatNumber(prompt.monthlyVolume)} monthly searches</Tag>
          <Tag>Usually won by {prompt.topBrand}</Tag>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Engines mentioning you" value={`${rate}%`} caption={`${prompt.responses.filter((r) => r.appeared).length} of ${prompt.responses.length} sampled engines`} />
        <StatTile label="Best position" value={positions.length ? `#${Math.min(...positions)}` : "—"} caption={positions.length ? "When the answer was a list" : "Never listed in this answer"} />
        <StatTile label="Brands named" value={`${brandCounts.size}`} caption="Across all sampled answers" />
        <StatTile label="Sources cited" value={`${citationDomains.length}`} caption="Distinct domains referenced" />
      </section>

      {prompt.opportunity && (
        <NoteCallout tone={rate > 0 ? "info" : "critical"} title={rate > 0 ? "Opportunity" : "Why you are absent"}>
          {prompt.opportunity}
        </NoteCallout>
      )}

      {/* Answers per engine */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="What each engine answered"
          description="Captured verbatim during the 1 November run, with the sources each engine cited."
        />
        <div className="flex flex-col gap-3">
          {prompt.responses.map((response) => {
            const platform = platformById(response.platform)!
            return (
              <Card as="article" key={response.platform} className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: platform.color }} aria-hidden />
                    <Link
                      href={`/dashboard/visibility/${platform.id}`}
                      className="text-[14px] font-semibold text-[#37322F] hover:underline"
                    >
                      {platform.name}
                    </Link>
                  </span>
                  <AppearanceBadge appeared={response.appeared} />
                  {response.position && <Tag tone="accent">Position {response.position}</Tag>}
                  <span className="ml-auto text-[11px] text-[rgba(73,66,61,0.45)]">
                    {formatDateTime(response.checkedAt)}
                  </span>
                </div>

                <div className="mt-3">
                  <Quote>{response.answer}</Quote>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                      Brands named, in order
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {response.brandsMentioned.length ? (
                        response.brandsMentioned.map((brand, index) => (
                          <Tag key={brand} tone={brand === "Harborflow" ? "accent" : "neutral"}>
                            {index + 1}. {brand}
                          </Tag>
                        ))
                      ) : (
                        <span className="text-[12px] text-[rgba(73,66,61,0.55)]">No vendor named in this answer</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                      Citations
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {response.citations.map((domain) => {
                        const source = citedSources.find((s) => s.domain === domain)
                        return source ? (
                          <Link
                            key={domain}
                            href={`/dashboard/citations/${source.slug}`}
                            className="rounded bg-[rgba(55,50,47,0.05)] px-1.5 py-[2px] font-mono text-[11px] text-[#37322F] hover:bg-[rgba(55,50,47,0.09)]"
                          >
                            {domain}
                          </Link>
                        ) : (
                          <span
                            key={domain}
                            className="rounded bg-[rgba(55,50,47,0.05)] px-1.5 py-[2px] font-mono text-[11px] text-[#605A57]"
                          >
                            {domain}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {response.note && (
                  <div className="mt-3">
                    <NoteCallout tone={response.appeared ? "good" : "critical"} title="Analyst note">
                      {response.note}
                    </NoteCallout>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* Brand share + linked work */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="Who gets named on this prompt" subtitle="Count of answers naming each brand" />
          <div className="px-5 pb-5">
            {brandRows.length ? (
              <RankedBars rows={brandRows} max={prompt.responses.length} />
            ) : (
              <EmptyState
                title="No vendors named"
                detail="Every sampled answer stayed definitional. The citation that supports the explanation is what wins the follow-up question."
              />
            )}
          </div>
        </Card>

        <Card>
          <CardHead title="Work linked to this prompt" subtitle="Recommendations and content briefs that target it" />
          <div className="px-5 pb-5">
            {linkedRecs.length === 0 && linkedBriefs.length === 0 ? (
              <EmptyState
                title="No linked work yet"
                detail="This prompt is being monitored but no recommendation targets it. It will appear here once the next analysis run proposes one."
              />
            ) : (
              <ul className="flex flex-col divide-y divide-[rgba(55,50,47,0.06)]">
                {linkedRecs.map((rec) => (
                  <li key={rec.id} className="py-3 first:pt-0">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/dashboard/recommendations/${rec.id}`}
                        className="text-[13px] font-medium text-[#37322F] hover:underline"
                      >
                        {rec.title}
                      </Link>
                      <LiveStatus kind="recommendation" id={rec.id} />
                    </div>
                    <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">
                      Recommendation · +{rec.impact} pts modelled · {rec.owner}
                    </div>
                  </li>
                ))}
                {linkedBriefs.map((brief) => (
                  <li key={brief.id} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/dashboard/content/${brief.id}`}
                        className="text-[13px] font-medium text-[#37322F] hover:underline"
                      >
                        {brief.title}
                      </Link>
                      <LiveStatus kind="brief" id={brief.id} />
                    </div>
                    <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">
                      Content brief · {brief.targetPath}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </section>

      <Card>
        <CardHead title="Prompt metadata" />
        <div className="px-5 pb-5">
          <DefList
            items={[
              { label: "Prompt id", value: prompt.id },
              { label: "Buyer stage", value: stageLabels[prompt.stage] },
              { label: "Search intent", value: <span className="capitalize">{prompt.intent}</span> },
              { label: "Monthly volume", value: formatNumber(prompt.monthlyVolume) },
              { label: "Engines sampled", value: prompt.responses.map((r) => platformById(r.platform)!.name).join(", ") },
              { label: "Last run", value: formatDateTime(prompt.responses[0].checkedAt) },
            ]}
          />
        </div>
      </Card>
    </div>
  )
}
