import type { Metadata } from "next"

import { auditCategories, auditIssues, auditScores, auditSummary, severityCounts } from "@/lib/mock"
import {
  Card,
  CardHead,
  Crumbs,
  LinkButton,
  PageHeader,
  ScoreRing,
  SectionTitle,
  SeverityBadge,
  StatTile,
  formatDate,
  formatNumber,
} from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import AuditExplorer, { type IssueRow } from "@/components/dashboard/audit-explorer"
import { series, severityStyles } from "@/components/dashboard/tokens"

export const metadata: Metadata = { title: "Website audit" }

const categoryLabel = (id: string) => auditCategories.find((c) => c.id === id)?.label ?? id

const rows: IssueRow[] = auditIssues.map((issue) => ({
  id: issue.id,
  title: issue.title,
  category: issue.category,
  categoryLabel: categoryLabel(issue.category),
  severity: issue.severity,
  page: issue.page,
  pagesAffected: issue.pagesAffected,
  effort: issue.effort,
  promptsAffected: issue.affectedPrompts.length,
  recommendationId: issue.recommendationId,
}))

/** Colour the category bars by score band so weak areas read immediately. */
const bandColor = (score: number) =>
  score >= 80 ? series.s3 : score >= 60 ? series.s1 : score >= 40 ? series.s4 : series.s2

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Website audit" }]} />
        <PageHeader
          eyebrow="Website audit"
          title="What stops engines from citing harborflow.io"
          description={`${formatNumber(auditSummary.pagesCrawled)} pages crawled on ${formatDate(auditSummary.lastRun)}; ${auditSummary.pagesWithIssues} carry at least one issue. Content gaps and missing information score lowest — both are about facts that are absent rather than pages that are broken.`}
          actions={<LinkButton href="/dashboard/recommendations" variant="primary">Turn issues into actions</LinkButton>}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-4 p-5">
          <ScoreRing value={auditSummary.score} caption={`Up ${auditSummary.scoreDelta} points since the first audit in April`} />
          <div className="flex flex-wrap justify-center gap-2">
            {severityCounts.map((entry) => (
              <span
                key={entry.severity}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[11px] font-medium"
                style={{
                  backgroundColor: severityStyles[entry.severity].bg,
                  color: severityStyles[entry.severity].text,
                }}
              >
                <span
                  className="h-[6px] w-[6px] rounded-full"
                  style={{ backgroundColor: severityStyles[entry.severity].dot }}
                  aria-hidden
                />
                {entry.count} {severityStyles[entry.severity].label.toLowerCase()}
              </span>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHead
            title="Score by audit area"
            subtitle="Nine areas scored 0–100. Anything under 50 is actively costing you answers."
          />
          <div className="px-5 pb-5">
            <RankedBars
              max={100}
              rows={auditCategories
                .map((category) => ({
                  key: category.id,
                  label: category.label,
                  value: auditScores[category.id],
                  color: bandColor(auditScores[category.id]),
                  caption: category.blurb,
                }))
                .sort((a, b) => a.value - b.value)}
            />
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Pages crawled" value={formatNumber(auditSummary.pagesCrawled)} caption="Weekly full crawl" />
        <StatTile label="Pages with issues" value={formatNumber(auditSummary.pagesWithIssues)} caption="29% of the site" />
        <StatTile label="Open issues" value={`${auditSummary.openIssues}`} caption="Across nine audit areas" />
        <StatTile label="Resolved" value={`${auditSummary.resolvedIssues}`} caption="Verified in a later crawl" />
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Issues by severity and priority"
          description="Each issue explains what it is, why it matters for AI answers, and the fix. Open one to move it through the workflow."
        />
        <AuditExplorer rows={rows} categories={auditCategories.map((c) => ({ id: c.id, label: c.label }))} />
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle title="What each audit area covers" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {auditCategories.map((category) => {
            const inCategory = auditIssues.filter((i) => i.category === category.id)
            const worst = inCategory.sort(
              (a, b) =>
                ["critical", "serious", "warning", "info"].indexOf(a.severity) -
                ["critical", "serious", "warning", "info"].indexOf(b.severity),
            )[0]
            return (
              <Card key={category.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[13px] font-semibold text-[#37322F]">{category.label}</h3>
                  <span className="text-[16px] font-semibold tabular-nums text-[#37322F]">
                    {auditScores[category.id]}
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] leading-[19px] text-[#605A57]">{category.blurb}</p>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[rgba(55,50,47,0.06)] pt-2.5">
                  <span className="text-[12px] text-[rgba(73,66,61,0.62)]">
                    {inCategory.length} issue{inCategory.length === 1 ? "" : "s"}
                  </span>
                  {worst && <SeverityBadge severity={worst.severity} />}
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
