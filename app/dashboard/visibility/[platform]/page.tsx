import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import type { PromptResponse, TrackedPrompt } from "@/lib/mock/prompts"
import {
  citationRateTrend,
  citedSources,
  mentionRateTrend,
  platformById,
  platforms,
  prompts,
  stageLabels,
  visibilityTrend,
} from "@/lib/mock"
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
  Quote,
  ScoreRing,
  SectionTitle,
  StatTile,
  Tag,
  formatDateTime,
} from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import { TrendLines } from "@/components/dashboard/charts"

/** Only ids present in the dataset exist — anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return platforms.map((p) => ({ platform: p.id }))
}

export function generateMetadata({ params }: { params: { platform: string } }): Metadata {
  const platform = platformById(params.platform)
  return { title: platform ? `${platform.name} visibility` : "Platform" }
}

export default function PlatformPage({ params }: { params: { platform: string } }) {
  const platform = platformById(params.platform)
  if (!platform) notFound()

  const key = platform.id as "chatgpt" | "gemini" | "perplexity"
  const isPrimary = platform.primary

  type Row = { prompt: TrackedPrompt; response: PromptResponse }
  const responses: Row[] = prompts.flatMap((prompt) => {
    const response = prompt.responses.find((r) => r.platform === platform.id)
    return response ? [{ prompt, response }] : []
  })

  const won = responses.filter((r) => r.response.appeared)
  const lost = responses.filter((r) => !r.response.appeared)
  const sources = citedSources.filter((s) => s.platforms.includes(platform.id))

  const specs = [{ key, name: platform.name, color: platform.color }]

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "AI visibility", href: "/dashboard/visibility" },
            { label: platform.name },
          ]}
        />
        <PageHeader
          eyebrow={platform.vendor}
          title={`${platform.name} visibility`}
          description={platform.behaviour}
          actions={
            <>
              <LinkButton href="/dashboard/prompts">All prompts</LinkButton>
              <LinkButton href="/dashboard/citations">Citation sources</LinkButton>
            </>
          }
        />
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-4 p-5 lg:col-span-1">
          <ScoreRing value={platform.score} color={platform.color} caption={`${platform.scoreDelta > 0 ? "Up" : "Down"} ${Math.abs(platform.scoreDelta)} points versus October`} />
          <DefList
            items={[
              { label: "Mention rate", value: `${platform.mentionRate}%` },
              { label: "Recommended", value: `${platform.recommendationRate}%` },
              { label: "Cites our site", value: `${platform.citationRate}%` },
              { label: "Avg position", value: platform.avgPosition ? `#${platform.avgPosition}` : "—" },
              { label: "Responses sampled", value: `${platform.responsesSampled}` },
            ]}
          />
        </Card>

        <Card className="lg:col-span-2">
          <CardHead
            title={isPrimary ? "Visibility, mentions and citations" : "Visibility trend"}
            subtitle={
              isPrimary
                ? "This engine's three core rates since tracking began"
                : "Sampled at lower frequency, so the series is smoothed"
            }
          />
          <div className="px-5 pb-5">
            {isPrimary ? (
              <div className="flex flex-col gap-5">
                <TrendLines data={visibilityTrend} specs={specs} domain={[0, 80]} height={170} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 text-[12px] font-medium text-[#605A57]">Mention rate</div>
                    <TrendLines data={mentionRateTrend} specs={specs} suffix="%" domain={[0, 50]} height={120} />
                  </div>
                  <div>
                    <div className="mb-1 text-[12px] font-medium text-[#605A57]">Citation rate</div>
                    <TrendLines data={citationRateTrend} specs={specs} suffix="%" domain={[0, 40]} height={120} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Meter label="Visibility score" value={platform.score} valueLabel={`${platform.score}`} color={platform.color} />
                <Meter label="Mention rate" value={platform.mentionRate} valueLabel={`${platform.mentionRate}%`} color={platform.color} />
                <Meter label="Citation rate" value={platform.citationRate} valueLabel={`${platform.citationRate}%`} color={platform.color} />
                <NoteCallout tone="info" title="Lower sampling frequency">
                  {platform.name} is sampled across {platform.promptsTracked} prompts rather than the full 240, so
                  month-to-month movement here is noisier than on the primary engines.
                </NoteCallout>
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Prompts won here" value={`${won.length}`} caption={`Of ${responses.length} sampled on this engine`} />
        <StatTile label="Prompts lost here" value={`${lost.length}`} caption="No mention anywhere in the answer" />
        <StatTile label="Sources cited" value={`${sources.length}`} caption="Distinct domains this engine draws on" />
      </section>

      {/* Answers */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title={`Answers ${platform.name} produced`}
          description="The excerpt is what the engine actually returned. Open the prompt for every engine's answer side by side."
        />
        <ul className="flex flex-col gap-3">
          {responses.map(({ prompt, response }) => (
            <Card as="li" key={prompt.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <AppearanceBadge appeared={response.appeared} />
                <Tag>{stageLabels[prompt.stage]}</Tag>
                {response.position && <Tag tone="accent">Position {response.position}</Tag>}
                <span className="ml-auto text-[11px] text-[rgba(73,66,61,0.45)]">{formatDateTime(response.checkedAt)}</span>
              </div>

              <Link
                href={`/dashboard/prompts/${prompt.id}`}
                className="mt-2.5 block text-[14px] font-semibold text-[#37322F] hover:underline"
              >
                {prompt.question}
              </Link>

              <div className="mt-3">
                <Quote
                  source={
                    response.citations.length ? (
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[rgba(73,66,61,0.55)]">Cited:</span>
                        {response.citations.map((domain) => (
                          <span key={domain} className="rounded bg-[rgba(55,50,47,0.05)] px-1.5 py-[1px] font-mono text-[11px]">
                            {domain}
                          </span>
                        ))}
                      </span>
                    ) : undefined
                  }
                >
                  {response.answer}
                </Quote>
              </div>

              {response.note && (
                <div className="mt-3">
                  <NoteCallout tone={response.appeared ? "good" : "critical"} title="Analyst note">
                    {response.note}
                  </NoteCallout>
                </div>
              )}

              {response.brandsMentioned.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[12px] text-[rgba(73,66,61,0.55)]">Brands named in order:</span>
                  {response.brandsMentioned.map((brand, index) => (
                    <Tag key={brand} tone={brand === "Harborflow" ? "accent" : "neutral"}>
                      {index + 1}. {brand}
                    </Tag>
                  ))}
                </div>
              )}
            </Card>
          ))}
          {responses.length === 0 && (
            <Card>
              <EmptyState
                title="No sampled answers yet"
                detail="This engine has not been sampled in the current run. Answers appear here after the next crawl."
              />
            </Card>
          )}
        </ul>
      </section>

      {/* Sources this engine trusts */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title={`Sources ${platform.name} draws on`}
          description="Ranked by citations in this engine's answers across the tracked prompt set."
          action={
            <Link href="/dashboard/citations" className="text-[13px] font-medium text-[#37322F] hover:underline">
              Citation intelligence →
            </Link>
          }
        />
        <Card className="p-5">
          <RankedBars
            rows={sources
              .sort((a, b) => b.citations - a.citations)
              .map((source) => ({
                key: source.slug,
                label: source.label,
                value: source.citations,
                color: source.favours.includes("harborflow") ? "#2a78d6" : source.mentionsUs ? "#1baf7a" : "#eb6834",
                caption: source.mentionsUs ? "Mentions you in cited answers" : "Never mentions you",
                href: `/dashboard/citations/${source.slug}`,
                highlight: source.domain === "harborflow.io",
              }))}
          />
          <p className="mt-4 text-[12px] leading-[19px] text-[rgba(73,66,61,0.62)]">
            Blue is your own domain, green is a third-party source that mentions you, orange is a source that never
            does.
          </p>
        </Card>
      </section>
    </div>
  )
}
