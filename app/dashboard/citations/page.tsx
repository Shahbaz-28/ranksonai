import Link from "next/link"
import type { Metadata } from "next"

import {
  citationGrowth,
  citationMix,
  citationOpportunities,
  citationTotals,
  citedSources,
  competitorOwnedSources,
  ownedSources,
  thirdPartySources,
} from "@/lib/mock"
import {
  Card,
  CardHead,
  Crumbs,
  Delta,
  EffortBadge,
  LinkButton,
  NoteCallout,
  PageHeader,
  PriorityBadge,
  SectionTitle,
  StatTile,
  TableWrap,
  Tag,
  Td,
  Th,
  formatNumber,
} from "@/components/dashboard/kit"
import { RankedBars, StackBar } from "@/components/dashboard/bars"
import { GrowthArea } from "@/components/dashboard/charts"
import { series } from "@/components/dashboard/tokens"

export const metadata: Metadata = { title: "Citation intelligence" }

const typeLabels: Record<string, string> = {
  owned: "Owned site",
  review: "Review platform",
  publication: "Trade publication",
  community: "Community",
  directory: "Directory",
  social: "Social",
}

export default function CitationsPage() {
  const ranked = [...citedSources].sort((a, b) => b.citations - a.citations)
  const neverMentionUs = citedSources.filter((s) => !s.mentionsUs)

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Citation intelligence" }]} />
        <PageHeader
          eyebrow="Citation intelligence"
          title="Where AI engines get their information about your category"
          description={`${formatNumber(citationTotals.totalCitations)} citations across ${citationTotals.sampledResponses} sampled answers, drawn from ${citationTotals.uniqueDomains} domains. Your own site accounts for ${citationTotals.ourShare}% of them.`}
          actions={<LinkButton href="/dashboard/competitors">Competitor sources</LinkButton>}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Citations of your site"
          value={formatNumber(citationTotals.ourCitations)}
          delta={31}
          deltaUnit="vs Oct"
          caption="harborflow.io across sampled answers"
        />
        <StatTile
          label="Your citation share"
          value={`${citationTotals.ourShare}%`}
          delta={citationTotals.ourShareDelta}
          deltaUnit="pts"
          caption="Of all citations in the category"
        />
        <StatTile label="Domains cited" value={formatNumber(citationTotals.uniqueDomains)} caption="142 distinct sources seen" />
        <StatTile
          label="Sources that never mention you"
          value={`${neverMentionUs.length}`}
          caption="Of the 14 highest-volume domains"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead title="Citation growth" subtitle="Total citations in sampled answers, and the share that is yours" />
          <div className="px-5 pb-5">
            <GrowthArea
              data={citationGrowth}
              specs={[
                { key: "citations", name: "All citations", color: series.s1 },
                { key: "ourCitations", name: "Citing harborflow.io", color: series.s3 },
              ]}
            />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHead title="Where citations come from" subtitle="Share of all citations by source type" />
          <div className="px-5 pb-5">
            <StackBar
              segments={citationMix.map((entry) => ({
                key: entry.type,
                label: entry.type,
                value: entry.value,
                color: entry.color,
              }))}
            />
            <p className="mt-4 text-[12px] leading-[19px] text-[rgba(73,66,61,0.62)]">
              A quarter of every answer in this category is built on competitor-owned pages. That is the share a
              neutral comparison page of your own would contest.
            </p>
          </div>
        </Card>
      </section>

      {/* Most cited sources */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Most frequently cited sources"
          description="Open a domain to see which prompts it feeds, which engines use it and who it favours."
        />
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Source</Th>
                <Th>Type</Th>
                <Th>Mentions you</Th>
                <Th>Favours</Th>
                <Th align="right">Citations</Th>
                <Th align="right">Share</Th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((source) => (
                <tr key={source.slug} className="transition-colors hover:bg-[rgba(55,50,47,0.015)]">
                  <Td>
                    <Link
                      href={`/dashboard/citations/${source.slug}`}
                      className="font-medium text-[#37322F] hover:underline"
                    >
                      {source.label}
                    </Link>
                    <div className="mt-0.5 font-mono text-[11px] text-[rgba(73,66,61,0.55)]">{source.domain}</div>
                  </Td>
                  <Td>{typeLabels[source.type]}</Td>
                  <Td>
                    {source.mentionsUs ? (
                      <Tag tone="accent">Yes</Tag>
                    ) : (
                      <span className="text-[12px] text-[#9c2626]">No</span>
                    )}
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {source.favours.length ? (
                        source.favours.map((slug) => (
                          <Link
                            key={slug}
                            href={slug === "harborflow" ? "/dashboard/competitors" : `/dashboard/competitors/${slug}`}
                            className="rounded bg-[rgba(55,50,47,0.05)] px-1.5 py-[2px] text-[11px] text-[#605A57] hover:bg-[rgba(55,50,47,0.09)]"
                          >
                            {slug.replace(/-/g, " ")}
                          </Link>
                        ))
                      ) : (
                        <span className="text-[12px] text-[rgba(73,66,61,0.45)]">Neutral</span>
                      )}
                    </div>
                  </Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-2">
                      {formatNumber(source.citations)}
                      <Delta value={source.citationsDelta} />
                    </div>
                  </Td>
                  <Td align="right">{source.share}%</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      </section>

      {/* Owned vs competitor-owned */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead
            title="Your pages versus theirs"
            subtitle="Citations earned by vendor-owned content in this category"
          />
          <div className="px-5 pb-5">
            <RankedBars
              rows={[...ownedSources, ...competitorOwnedSources]
                .sort((a, b) => b.citations - a.citations)
                .map((source) => ({
                  key: source.slug,
                  label: source.label,
                  value: source.citations,
                  color: source.favours.includes("harborflow") ? series.s1 : series.s2,
                  caption: `${source.prompts.length} prompts · ${source.share}% of all citations`,
                  href: `/dashboard/citations/${source.slug}`,
                  highlight: source.favours.includes("harborflow"),
                }))}
            />
            <div className="mt-4">
              <NoteCallout tone="info" title="Read this as">
                Competitor-owned pages earn 424 citations between them against your 86. Engines treat vendor content as
                neutral when nothing more authoritative exists, which is why their benchmark study is quoted as a
                category fact.
              </NoteCallout>
            </div>
          </div>
        </Card>

        <Card>
          <CardHead title="Third-party sources" subtitle="Review platforms, publications, communities and directories" />
          <div className="px-5 pb-5">
            <RankedBars
              rows={[...thirdPartySources]
                .sort((a, b) => b.citations - a.citations)
                .map((source) => ({
                  key: source.slug,
                  label: source.label,
                  value: source.citations,
                  color: source.mentionsUs ? series.s3 : series.s4,
                  caption: source.mentionsUs ? "Mentions you in cited answers" : "Never mentions you",
                  href: `/dashboard/citations/${source.slug}`,
                }))}
            />
            <p className="mt-4 text-[12px] leading-[19px] text-[rgba(73,66,61,0.62)]">
              Green sources already mention you; amber ones do not. Amber with high citation counts is where the
              opportunities below come from.
            </p>
          </div>
        </Card>
      </section>

      {/* Opportunities */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Citation opportunities"
          description="Sources engines already trust where you are absent or under-represented."
          action={
            <Link href="/dashboard/recommendations" className="text-[13px] font-medium text-[#37322F] hover:underline">
              See the full plan →
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {citationOpportunities.map((opportunity) => (
            <Card as="article" key={opportunity.id} className="flex flex-col p-5">
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={opportunity.priority} />
                <EffortBadge effort={opportunity.effort} />
              </div>
              <h3 className="mt-2.5 text-[14px] font-semibold leading-5 text-[#37322F]">{opportunity.label}</h3>
              <div className="mt-0.5 font-mono text-[11px] text-[rgba(73,66,61,0.55)]">{opportunity.domain}</div>
              <p className="mt-2.5 text-[13px] leading-[21px] text-[#605A57]">{opportunity.rationale}</p>

              <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-[rgba(55,50,47,0.06)] pt-3 text-[12px]">
                <div>
                  <dt className="text-[rgba(73,66,61,0.55)]">Est. citations / mo</dt>
                  <dd className="font-semibold text-[#37322F]">+{opportunity.estimatedCitations}</dd>
                </div>
                <div>
                  <dt className="text-[rgba(73,66,61,0.55)]">Competitors present</dt>
                  <dd className="font-semibold text-[#37322F]">{opportunity.competitorsPresent.length}</dd>
                </div>
              </dl>

              <div className="mt-3 rounded-lg bg-[#FBFAF9] p-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
                  First step
                </div>
                <p className="mt-1 text-[12px] leading-[19px] text-[#49423D]">{opportunity.firstStep}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
