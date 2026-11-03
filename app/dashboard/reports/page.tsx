import Link from "next/link"
import type { Metadata } from "next"

import {
  activity,
  auditIssues,
  citationGrowth,
  contentBriefs,
  deliveredImpact,
  monthlyReports,
  openImpact,
  recommendations,
  shareOfVoiceTrend,
  visibilityTrend,
} from "@/lib/mock"
import {
  Card,
  CardHead,
  Crumbs,
  Delta,
  LinkButton,
  PageHeader,
  SectionTitle,
  StatTile,
  TableWrap,
  Tag,
  Td,
  Th,
  formatDate,
  formatNumber,
} from "@/components/dashboard/kit"
import { GrowthArea, TrendLines } from "@/components/dashboard/charts"
import { LiveStatus, StatusCount } from "@/components/dashboard/workflow"
import { series, status as statusColors } from "@/components/dashboard/tokens"

export const metadata: Metadata = { title: "Progress & reports" }

const kindStyles: Record<string, { color: string; label: string }> = {
  shipped: { color: statusColors.good, label: "Shipped" },
  approved: { color: series.s1, label: "Approved" },
  started: { color: series.s6, label: "Started" },
  detected: { color: statusColors.warning, label: "Detected" },
  crawl: { color: "#898781", label: "Crawl" },
  gain: { color: statusColors.good, label: "Gain" },
  loss: { color: statusColors.critical, label: "Loss" },
}

const recIds = recommendations.map((r) => r.id)
const briefIds = contentBriefs.map((b) => b.id)

export default function ReportsPage() {
  const completedWork = [
    ...recommendations.filter((r) => r.completedAt).map((r) => ({ kind: "Recommendation", item: r.title, href: `/dashboard/recommendations/${r.id}`, date: r.completedAt!, points: r.impact, id: r.id, type: "recommendation" as const })),
    ...contentBriefs
      .filter((b) => b.completedAt)
      .map((b) => ({ kind: "Content", item: b.title, href: `/dashboard/content/${b.id}`, date: b.completedAt!, points: undefined, id: b.id, type: "brief" as const })),
    ...auditIssues
      .filter((i) => i.status === "completed")
      .map((i) => ({ kind: "Audit fix", item: i.title, href: `/dashboard/audit/${i.id}`, date: i.detectedAt, points: undefined, id: i.id, type: "issue" as const })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Progress & reports" }]} />
        <PageHeader
          eyebrow="Progress & reports"
          title="What has changed since you started"
          description="Seven months of tracking, four completed recommendations and 30 points of visibility. This is the record of what shipped, what it moved, and what is still open."
          actions={<LinkButton href="/dashboard/reports/2026-10" variant="primary">Read October report</LinkButton>}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Visibility delivered" value={`+30 pts`} caption="From 31 at baseline to 61 today" />
        <StatTile label="Impact shipped" value={`+${deliveredImpact} pts`} caption="Attributed to completed recommendations" />
        <StatTile label="Still open" value={`+${openImpact} pts`} caption="Modelled upside in the current plan" />
        <StatTile
          label="Citations earned"
          value={formatNumber(citationGrowth[citationGrowth.length - 1].ourCitations)}
          delta={7}
          deltaUnit="vs Oct"
          caption="Answers citing harborflow.io"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="Visibility improvement" subtitle="Blended score and per-engine detail since April 2026" />
          <div className="px-5 pb-5">
            <TrendLines
              data={visibilityTrend}
              specs={[
                { key: "overall", name: "Blended", color: series.s1 },
                { key: "perplexity", name: "Perplexity", color: series.s3 },
                { key: "gemini", name: "Gemini", color: series.s2 },
              ]}
              domain={[0, 80]}
            />
          </div>
        </Card>
        <Card>
          <CardHead title="Citation growth" subtitle="Total citations sampled, and the share that is yours" />
          <div className="px-5 pb-5">
            <GrowthArea
              data={citationGrowth}
              specs={[
                { key: "citations", name: "All citations", color: series.s1 },
                { key: "ourCitations", name: "Citing you", color: series.s3 },
              ]}
            />
          </div>
        </Card>
      </section>

      <Card>
        <CardHead title="Competitor movement" subtitle="Share of voice, you and the three closest rivals" />
        <div className="px-5 pb-5">
          <TrendLines
            data={shareOfVoiceTrend}
            specs={[
              { key: "harborflow", name: "Harborflow", color: "#2a78d6" },
              { key: "paylineOps", name: "Payline Ops", color: "#eb6834" },
              { key: "nexoraPay", name: "Nexora Pay", color: "#1baf7a" },
              { key: "settlewise", name: "Settlewise", color: "#eda100" },
            ]}
            suffix="%"
            domain={[0, 40]}
          />
        </div>
      </Card>

      {/* Monthly reports */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Monthly performance reports"
          description="Each report compares the period against the one before it."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {monthlyReports.map((report) => (
            <Card as="article" key={report.period} className="flex flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-semibold text-[#37322F]">{report.label}</h3>
                <Tag>Published {formatDate(report.publishedAt)}</Tag>
              </div>
              <p className="mt-2.5 line-clamp-4 text-[13px] leading-[21px] text-[#605A57]">{report.summary}</p>
              <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-[rgba(55,50,47,0.06)] pt-3">
                {report.metrics.slice(0, 4).map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-[11px] text-[rgba(73,66,61,0.55)]">{metric.label}</dt>
                    <dd className="mt-0.5 flex items-baseline gap-1.5">
                      <span className="text-[14px] font-semibold text-[#37322F]">{metric.value}</span>
                      <Delta value={metric.delta} />
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                href={`/dashboard/reports/${report.period}`}
                className="mt-4 text-[13px] font-medium text-[#37322F] underline-offset-2 hover:underline"
              >
                Read the full report →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Completed work + pending */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead title="Completed improvements" subtitle="Everything shipped and verified since tracking began" />
          <TableWrap>
            <thead>
              <tr>
                <Th>Change</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th align="right">Points</Th>
              </tr>
            </thead>
            <tbody>
              {completedWork.map((entry) => (
                <tr key={`${entry.type}-${entry.id}`} className="transition-colors hover:bg-[rgba(55,50,47,0.015)]">
                  <Td>
                    <Link href={entry.href} className="font-medium text-[#37322F] hover:underline">
                      {entry.item}
                    </Link>
                    <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">{formatDate(entry.date)}</div>
                  </Td>
                  <Td>{entry.kind}</Td>
                  <Td>
                    <LiveStatus kind={entry.type} id={entry.id} />
                  </Td>
                  <Td align="right">{entry.points ? `+${entry.points}` : "—"}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>

        <Card className="lg:col-span-2">
          <CardHead title="Still outstanding" subtitle="What the next period has to work through" />
          <div className="flex flex-col gap-4 px-5 pb-5">
            {[
              { label: "Recommendations awaiting approval", kind: "recommendation" as const, ids: recIds, status: "needs-approval" as const },
              { label: "Recommendations in progress", kind: "recommendation" as const, ids: recIds, status: "in-progress" as const },
              { label: "Recommendations in backlog", kind: "recommendation" as const, ids: recIds, status: "pending" as const },
              { label: "Content briefs not started", kind: "brief" as const, ids: briefIds, status: "pending" as const },
              { label: "Audit issues still open", kind: "issue" as const, ids: auditIssues.map((i) => i.id), status: "pending" as const },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 border-b border-[rgba(55,50,47,0.06)] pb-3 last:border-0 last:pb-0">
                <span className="text-[13px] text-[#49423D]">{row.label}</span>
                <span className="text-[16px] font-semibold tabular-nums text-[#37322F]">
                  <StatusCount kind={row.kind} ids={row.ids} status={row.status} />
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Activity timeline */}
      <section className="flex flex-col gap-3">
        <SectionTitle title="Activity timeline" description="Every change, detection and crawl, newest first." />
        <Card>
          <ol className="divide-y divide-[rgba(55,50,47,0.06)]">
            {activity.map((entry) => {
              const style = kindStyles[entry.kind]
              return (
                <li key={entry.id} className="flex gap-4 px-5 py-4">
                  <div className="flex w-[84px] shrink-0 flex-col">
                    <span className="text-[12px] font-medium text-[#37322F]">{formatDate(entry.date)}</span>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-[11px]" style={{ color: style.color }}>
                      <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: style.color }} aria-hidden />
                      {style.label}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {entry.href ? (
                        <Link href={entry.href} className="text-[13px] font-semibold text-[#37322F] hover:underline">
                          {entry.title}
                        </Link>
                      ) : (
                        <span className="text-[13px] font-semibold text-[#37322F]">{entry.title}</span>
                      )}
                      {typeof entry.points === "number" && <Delta value={entry.points} unit="pts" />}
                    </div>
                    <p className="mt-1 text-[13px] leading-[21px] text-[#605A57]">{entry.detail}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Card>
      </section>
    </div>
  )
}
