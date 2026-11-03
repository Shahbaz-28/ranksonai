import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import {
  auditIssueById,
  contentBriefs,
  promptById,
  recCategories,
  recommendationById,
  recommendations,
} from "@/lib/mock"
import {
  AppearanceBadge,
  Card,
  CardHead,
  Crumbs,
  DefList,
  EffortBadge,
  LinkButton,
  NoteCallout,
  PageHeader,
  PriorityBadge,
  Quote,
  SectionTitle,
  SeverityBadge,
  StatTile,
  Tag,
  formatDate,
  formatNumber,
} from "@/components/dashboard/kit"
import { LiveStatus, StatusActions, WorkflowStepper } from "@/components/dashboard/workflow"

/** Only ids present in the dataset exist — anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return recommendations.map((r) => ({ id: r.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const rec = recommendationById(params.id)
  return { title: rec ? rec.title : "Recommendation" }
}

export default function RecommendationDetailPage({ params }: { params: { id: string } }) {
  const rec = recommendationById(params.id)
  if (!rec) notFound()

  const category = recCategories.find((c) => c.id === rec.category)
  const issue = rec.auditIssueId ? auditIssueById(rec.auditIssueId) : undefined
  const prompts = rec.affectedPrompts.map((id) => promptById(id)).filter(Boolean)
  const volume = prompts.reduce((sum, prompt) => sum + (prompt?.monthlyVolume ?? 0), 0)
  const briefs = contentBriefs.filter((b) => b.recommendationId === rec.id)

  /** Evidence straight from the engines: notes captured on the affected prompts. */
  const evidence = prompts
    .flatMap((prompt) =>
      (prompt?.responses ?? [])
        .filter((response) => response.note)
        .map((response) => ({ promptId: prompt!.id, question: prompt!.question, response })),
    )
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "GEO recommendations", href: "/dashboard/recommendations" },
            { label: rec.id },
          ]}
        />
        <PageHeader
          eyebrow={category?.label}
          title={rec.title}
          description={rec.action}
          actions={
            <>
              <LinkButton href="/dashboard/recommendations">Back to plan</LinkButton>
              {briefs[0] && (
                <LinkButton href={`/dashboard/content/${briefs[0].id}`} variant="primary">
                  Open content brief
                </LinkButton>
              )}
            </>
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={rec.priority} />
          <LiveStatus kind="recommendation" id={rec.id} />
          <EffortBadge effort={rec.effort} />
          <Tag>+{rec.impact} pts modelled</Tag>
          <Tag>Owner: {rec.owner}</Tag>
        </div>
      </div>

      {/* Workflow */}
      <Card className="p-5">
        <SectionTitle
          title="Implementation workflow"
          description="Approve, start, verify or pause. The state shown here is what the rest of the dashboard reads."
        />
        <div className="mt-4">
          <WorkflowStepper kind="recommendation" id={rec.id} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(55,50,47,0.06)] pt-4">
          <StatusActions kind="recommendation" id={rec.id} />
          <div className="text-[12px] text-[rgba(73,66,61,0.62)]">
            {rec.startedAt && <>Started {formatDate(rec.startedAt)}. </>}
            {rec.completedAt && <>Completed {formatDate(rec.completedAt)}.</>}
            {!rec.startedAt && !rec.completedAt && <>Not started yet.</>}
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Modelled impact" value={`+${rec.impact} pts`} caption="Visibility score over 90 days" />
        <StatTile label="Prompts affected" value={`${prompts.length}`} caption={`${formatNumber(volume)} monthly searches`} />
        <StatTile label="Effort" value={rec.effort === "low" ? "Low" : rec.effort === "medium" ? "Medium" : "High"} caption={`Owned by ${rec.owner}`} />
        <StatTile label="Linked content" value={`${briefs.length}`} caption={briefs.length ? "Briefs ready in the content workspace" : "No brief required"} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHead title="Problem identified" />
            <div className="px-5 pb-5">
              <p className="text-[13px] leading-6 text-[#49423D]">{rec.problem}</p>
            </div>
          </Card>

          <Card>
            <CardHead title="Why it matters" />
            <div className="px-5 pb-5">
              <p className="text-[13px] leading-6 text-[#49423D]">{rec.whyItMatters}</p>
            </div>
          </Card>

          <Card>
            <CardHead title="Expected benefit" />
            <div className="px-5 pb-5">
              <p className="text-[13px] leading-6 text-[#49423D]">{rec.expectedBenefit}</p>
            </div>
          </Card>

          <Card>
            <CardHead title="Recommended action" subtitle="Steps in the order they should happen" />
            <div className="px-5 pb-5">
              <p className="text-[13px] leading-6 text-[#49423D]">{rec.action}</p>
              <ol className="mt-4 flex flex-col gap-2.5">
                {rec.steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(55,50,47,0.06)] text-[11px] font-semibold text-[#605A57]">
                      {index + 1}
                    </span>
                    <span className="text-[13px] leading-5 text-[#49423D]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Card>

          {rec.result && (
            <NoteCallout tone="good" title="Measured result">
              {rec.result}
            </NoteCallout>
          )}

          {evidence.length > 0 && (
            <Card>
              <CardHead
                title="Evidence from the engines"
                subtitle="Analyst notes captured on the affected prompts during the last run"
              />
              <div className="flex flex-col gap-3 px-5 pb-5">
                {evidence.map((entry) => (
                  <div key={`${entry.promptId}-${entry.response.platform}`}>
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/prompts/${entry.promptId}`}
                        className="text-[12px] font-medium text-[#37322F] hover:underline"
                      >
                        {entry.question}
                      </Link>
                      <AppearanceBadge appeared={entry.response.appeared} />
                    </div>
                    <Quote source={`${entry.response.platform} · analyst note`}>{entry.response.note}</Quote>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHead title="Recommendation detail" />
            <div className="px-5 pb-5">
              <DefList
                items={[
                  { label: "Id", value: rec.id },
                  { label: "Area", value: category?.label ?? rec.category },
                  { label: "Priority", value: <PriorityBadge priority={rec.priority} /> },
                  { label: "Impact", value: `+${rec.impact} pts` },
                  { label: "Effort", value: <EffortBadge effort={rec.effort} /> },
                  { label: "Owner", value: rec.owner },
                  { label: "Started", value: rec.startedAt ? formatDate(rec.startedAt) : "—" },
                  { label: "Completed", value: rec.completedAt ? formatDate(rec.completedAt) : "—" },
                ]}
              />
            </div>
          </Card>

          {issue && (
            <Card>
              <CardHead title="Audit issue behind this" />
              <div className="px-5 pb-5">
                <Link href={`/dashboard/audit/${issue.id}`} className="text-[13px] font-medium text-[#37322F] hover:underline">
                  {issue.title}
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={issue.severity} />
                  <LiveStatus kind="issue" id={issue.id} />
                </div>
                <p className="mt-2 font-mono text-[11px] text-[rgba(73,66,61,0.55)]">{issue.page}</p>
              </div>
            </Card>
          )}

          {prompts.length > 0 && (
            <Card>
              <CardHead title="Prompts this unlocks" />
              <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
                {prompts.map((prompt) =>
                  prompt ? (
                    <li key={prompt.id} className="px-5 py-3">
                      <Link
                        href={`/dashboard/prompts/${prompt.id}`}
                        className="text-[13px] font-medium text-[#37322F] hover:underline"
                      >
                        {prompt.question}
                      </Link>
                      <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">
                        {formatNumber(prompt.monthlyVolume)} searches/mo · {prompt.topBrand} currently wins it
                      </div>
                    </li>
                  ) : null,
                )}
              </ul>
            </Card>
          )}

          {briefs.length > 0 && (
            <Card>
              <CardHead title="Content briefs" />
              <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
                {briefs.map((brief) => (
                  <li key={brief.id} className="px-5 py-3">
                    <Link
                      href={`/dashboard/content/${brief.id}`}
                      className="text-[13px] font-medium text-[#37322F] hover:underline"
                    >
                      {brief.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <LiveStatus kind="brief" id={brief.id} />
                      <span className="font-mono text-[11px] text-[rgba(73,66,61,0.55)]">{brief.targetPath}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
