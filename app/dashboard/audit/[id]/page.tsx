import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { auditCategories, auditIssueById, auditIssues, promptById, recommendationById } from "@/lib/mock"
import {
  Card,
  CardHead,
  Crumbs,
  DefList,
  EffortBadge,
  LinkButton,
  NoteCallout,
  PageHeader,
  SectionTitle,
  SeverityBadge,
  Tag,
  formatDate,
  formatNumber,
} from "@/components/dashboard/kit"
import { LiveStatus, StatusActions, WorkflowStepper } from "@/components/dashboard/workflow"

/** Only ids present in the dataset exist — anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return auditIssues.map((i) => ({ id: i.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const issue = auditIssueById(params.id)
  return { title: issue ? issue.title : "Audit issue" }
}

export default function AuditIssuePage({ params }: { params: { id: string } }) {
  const issue = auditIssueById(params.id)
  if (!issue) notFound()

  const category = auditCategories.find((c) => c.id === issue.category)
  const recommendation = issue.recommendationId ? recommendationById(issue.recommendationId) : undefined
  const prompts = issue.affectedPrompts.map((id) => promptById(id)).filter(Boolean)
  const promptVolume = prompts.reduce((sum, prompt) => sum + (prompt?.monthlyVolume ?? 0), 0)

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Website audit", href: "/dashboard/audit" },
            { label: issue.id },
          ]}
        />
        <PageHeader
          eyebrow={category?.label}
          title={issue.title}
          description={issue.explanation}
          actions={
            <>
              <LinkButton href="/dashboard/audit">Back to audit</LinkButton>
              {recommendation && (
                <LinkButton href={`/dashboard/recommendations/${recommendation.id}`} variant="primary">
                  Open recommendation
                </LinkButton>
              )}
            </>
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={issue.severity} />
          <LiveStatus kind="issue" id={issue.id} />
          <EffortBadge effort={issue.effort} />
          <Tag>Detected {formatDate(issue.detectedAt)}</Tag>
        </div>
      </div>

      <Card className="p-5">
        <SectionTitle title="Implementation status" description="Move this issue through the workflow as work progresses." />
        <div className="mt-4">
          <WorkflowStepper kind="issue" id={issue.id} />
        </div>
        <div className="mt-4 border-t border-[rgba(55,50,47,0.06)] pt-4">
          <StatusActions kind="issue" id={issue.id} />
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHead title="Why it matters for AI answers" />
            <div className="px-5 pb-5">
              <p className="text-[13px] leading-6 text-[#49423D]">{issue.whyItMatters}</p>
            </div>
          </Card>

          <Card>
            <CardHead title="Suggested solution" subtitle="What to change, specifically" />
            <div className="px-5 pb-5">
              <p className="text-[13px] leading-6 text-[#49423D]">{issue.fix}</p>
              {recommendation && (
                <div className="mt-4">
                  <NoteCallout tone="info" title="Planned as">
                    <Link href={`/dashboard/recommendations/${recommendation.id}`} className="font-medium underline">
                      {recommendation.title}
                    </Link>{" "}
                    — modelled at +{recommendation.impact} visibility points, owned by {recommendation.owner}.
                  </NoteCallout>
                </div>
              )}
            </div>
          </Card>

          {prompts.length > 0 && (
            <Card>
              <CardHead
                title="Prompts this issue holds back"
                subtitle={`${formatNumber(promptVolume)} monthly searches affected`}
              />
              <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
                {prompts.map((prompt) =>
                  prompt ? (
                    <li key={prompt.id} className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/prompts/${prompt.id}`}
                        className="text-[13px] font-medium text-[#37322F] hover:underline"
                      >
                        {prompt.question}
                      </Link>
                      <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">
                        {formatNumber(prompt.monthlyVolume)} monthly searches · usually won by {prompt.topBrand}
                      </div>
                    </li>
                  ) : null,
                )}
              </ul>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHead title="Issue detail" />
            <div className="px-5 pb-5">
              <DefList
                items={[
                  { label: "Issue id", value: issue.id },
                  { label: "Category", value: category?.label ?? issue.category },
                  { label: "Severity", value: <SeverityBadge severity={issue.severity} /> },
                  { label: "Affected page", value: <span className="font-mono text-[12px]">{issue.page}</span> },
                  { label: "Pages affected", value: formatNumber(issue.pagesAffected) },
                  { label: "Effort", value: <EffortBadge effort={issue.effort} /> },
                  { label: "Detected", value: formatDate(issue.detectedAt) },
                ]}
              />
            </div>
          </Card>

          <Card>
            <CardHead title="Other issues in this area" />
            <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
              {auditIssues
                .filter((i) => i.category === issue.category && i.id !== issue.id)
                .map((other) => (
                  <li key={other.id} className="px-5 py-3">
                    <Link href={`/dashboard/audit/${other.id}`} className="text-[13px] font-medium text-[#37322F] hover:underline">
                      {other.title}
                    </Link>
                    <div className="mt-1">
                      <SeverityBadge severity={other.severity} />
                    </div>
                  </li>
                ))}
              {auditIssues.filter((i) => i.category === issue.category && i.id !== issue.id).length === 0 && (
                <li className="px-5 py-4 text-[13px] text-[#605A57]">
                  This is the only open issue in {category?.label.toLowerCase()}.
                </li>
              )}
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}
