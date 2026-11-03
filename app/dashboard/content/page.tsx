import Link from "next/link"
import type { Metadata } from "next"

import { contentBriefs, contentSummary, contentTypes, promptById } from "@/lib/mock"
import {
  Card,
  CardHead,
  Crumbs,
  EmptyState,
  LinkButton,
  NoteCallout,
  PageHeader,
  PriorityBadge,
  SectionTitle,
  StatTile,
  Tag,
  formatNumber,
} from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import { LiveStatus, StatusActions, StatusCount } from "@/components/dashboard/workflow"
import { series } from "@/components/dashboard/tokens"

export const metadata: Metadata = { title: "Content optimization" }

const typeColor: Record<string, string> = {
  comparison: series.s1,
  article: series.s2,
  "service-page": series.s3,
  faq: series.s4,
  "case-study": series.s5,
  "data-study": series.s6,
}

const allIds = contentBriefs.map((b) => b.id)

export default function ContentPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Content optimization" }]} />
        <PageHeader
          eyebrow="Content optimization"
          title="The pages that would earn you answers"
          description={`${contentSummary.opportunities} opportunities covering ${formatNumber(contentSummary.volume)} monthly searches. Each brief states the gap, the angle, the structure, and the facts the page must contain to be quotable.`}
          actions={<LinkButton href="/dashboard/recommendations">See the plan</LinkButton>}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Opportunities" value={`${contentSummary.opportunities}`} caption="Across six content types" />
        <StatTile label="Demand covered" value={formatNumber(contentSummary.volume)} caption="Monthly searches across target prompts" />
        <Card className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">In flight</div>
          <div className="mt-2 text-[30px] font-semibold leading-none text-[#37322F]">
            <StatusCount kind="brief" ids={allIds} status="in-progress" />
          </div>
          <div className="mt-2 text-[12px] leading-[18px] text-[#605A57]">
            Being written now, plus <StatusCount kind="brief" ids={allIds} status="verification" /> in verification
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">Shipped</div>
          <div className="mt-2 text-[30px] font-semibold leading-none text-[#37322F]">
            <StatusCount kind="brief" ids={allIds} status="completed" />
          </div>
          <div className="mt-2 text-[12px] leading-[18px] text-[#605A57]">
            Published and verified in a later crawl
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead title="Demand by content type" subtitle="Monthly searches represented by each group of briefs" />
          <div className="px-5 pb-5">
            <RankedBars
              rows={contentTypes
                .map((type) => {
                  const briefs = contentBriefs.filter((b) => b.type === type.id)
                  const volume = briefs.reduce((sum, b) => sum + b.promptVolume, 0)
                  return {
                    key: type.id,
                    label: type.label,
                    value: volume,
                    valueLabel: formatNumber(volume),
                    color: typeColor[type.id],
                    caption: `${briefs.length} brief${briefs.length === 1 ? "" : "s"} · ${type.blurb}`,
                  }
                })
                .sort((a, b) => b.value - a.value)}
            />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHead title="What makes a page citable" />
          <div className="flex flex-col gap-3 px-5 pb-5">
            <NoteCallout tone="good" title="The pattern that works here">
              Every page of yours that engines cite states a concrete, checkable fact in its first paragraph — the
              21-day benchmark, the field-level sync table, the SuiteApp listing.
            </NoteCallout>
            <NoteCallout tone="critical" title="The pattern that fails">
              Nine product pages open with a value proposition and reach the facts after 400 words. None of them are
              cited anywhere in the tracked set.
            </NoteCallout>
          </div>
        </Card>
      </section>

      {contentTypes.map((type) => {
        const briefs = contentBriefs.filter((b) => b.type === type.id)
        if (briefs.length === 0) return null
        return (
          <section key={type.id} className="flex flex-col gap-3">
            <SectionTitle title={type.label} description={type.blurb} />
            <ul className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {briefs.map((brief) => (
                <Card as="li" key={brief.id} className="flex flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={brief.priority} />
                    <LiveStatus kind="brief" id={brief.id} />
                    <span className="ml-auto text-[12px] font-semibold tabular-nums text-[#37322F]">
                      {formatNumber(brief.promptVolume)}/mo
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/content/${brief.id}`}
                    className="mt-2.5 text-[14px] font-semibold leading-5 text-[#37322F] hover:underline"
                  >
                    {brief.title}
                  </Link>
                  <div className="mt-1 font-mono text-[11px] text-[rgba(73,66,61,0.55)]">{brief.targetPath}</div>

                  <p className="mt-2.5 text-[13px] leading-[21px] text-[#605A57]">{brief.gap}</p>

                  <div className="mt-3 border-t border-[rgba(55,50,47,0.06)] pt-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                      Target prompts
                    </div>
                    <ul className="mt-1.5 flex flex-col gap-1">
                      {brief.targetPrompts.map((id) => {
                        const prompt = promptById(id)
                        return prompt ? (
                          <li key={id}>
                            <Link
                              href={`/dashboard/prompts/${id}`}
                              className="text-[12px] leading-[19px] text-[#49423D] hover:underline"
                            >
                              {prompt.question}
                            </Link>
                          </li>
                        ) : null
                      })}
                    </ul>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Tag>{brief.wordCount}</Tag>
                    <Tag>{brief.owner}</Tag>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <StatusActions kind="brief" id={brief.id} compact />
                    <Link
                      href={`/dashboard/content/${brief.id}`}
                      className="text-[12px] font-medium text-[#37322F] underline-offset-2 hover:underline"
                    >
                      Open brief →
                    </Link>
                  </div>
                </Card>
              ))}
            </ul>
          </section>
        )
      })}

      {contentBriefs.length === 0 && (
        <Card>
          <EmptyState title="No content opportunities yet" detail="Opportunities appear after the first full analysis run." />
        </Card>
      )}
    </div>
  )
}
