import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { briefById, contentBriefs, contentTypes, promptById, recommendationById } from "@/lib/mock"
import {
  AppearanceBadge,
  Card,
  CardHead,
  Crumbs,
  DefList,
  LinkButton,
  NoteCallout,
  PageHeader,
  PriorityBadge,
  SectionTitle,
  StatTile,
  Tag,
  formatDate,
  formatNumber,
} from "@/components/dashboard/kit"
import { LiveStatus, StatusActions, WorkflowStepper } from "@/components/dashboard/workflow"

/** Only ids present in the dataset exist — anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return contentBriefs.map((b) => ({ id: b.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const brief = briefById(params.id)
  return { title: brief ? brief.title : "Content brief" }
}

export default function ContentBriefPage({ params }: { params: { id: string } }) {
  const brief = briefById(params.id)
  if (!brief) notFound()

  const type = contentTypes.find((t) => t.id === brief.type)
  const prompts = brief.targetPrompts.map((id) => promptById(id)).filter(Boolean)
  const recommendation = brief.recommendationId ? recommendationById(brief.recommendationId) : undefined

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Content optimization", href: "/dashboard/content" },
            { label: brief.id },
          ]}
        />
        <PageHeader
          eyebrow={type?.label}
          title={brief.title}
          description={brief.angle}
          actions={
            <>
              <LinkButton href="/dashboard/content">Back to workspace</LinkButton>
              {recommendation && (
                <LinkButton href={`/dashboard/recommendations/${recommendation.id}`} variant="primary">
                  Parent recommendation
                </LinkButton>
              )}
            </>
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={brief.priority} />
          <LiveStatus kind="brief" id={brief.id} />
          <Tag>{brief.targetPath}</Tag>
          <Tag>{brief.wordCount} words</Tag>
          <Tag>{brief.owner}</Tag>
        </div>
      </div>

      <Card className="p-5">
        <SectionTitle title="Production status" description="Move the brief from idea to published and verified." />
        <div className="mt-4">
          <WorkflowStepper kind="brief" id={brief.id} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(55,50,47,0.06)] pt-4">
          <StatusActions kind="brief" id={brief.id} />
          <div className="text-[12px] text-[rgba(73,66,61,0.62)]">
            {brief.startedAt && <>Drafting started {formatDate(brief.startedAt)}. </>}
            {brief.completedAt && <>Published {formatDate(brief.completedAt)}.</>}
            {!brief.startedAt && !brief.completedAt && <>Not started — the brief is ready to hand to a writer.</>}
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Demand targeted" value={formatNumber(brief.promptVolume)} caption="Monthly searches across target prompts" />
        <StatTile label="Target prompts" value={`${brief.targetPrompts.length}`} caption="Prompts this page is written to win" />
        <StatTile label="Competing pages" value={`${brief.competingPages.length}`} caption="Currently cited for those prompts" />
        <StatTile label="Length" value={brief.wordCount} caption={`Owned by ${brief.owner}`} />
      </section>

      {brief.result && (
        <NoteCallout tone="good" title="Measured result">
          {brief.result}
        </NoteCallout>
      )}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHead title="The gap" subtitle="Why this page needs to exist" />
            <div className="px-5 pb-5">
              <p className="text-[13px] leading-6 text-[#49423D]">{brief.gap}</p>
            </div>
          </Card>

          <Card>
            <CardHead title="Angle" subtitle="How to treat the subject so engines can quote it" />
            <div className="px-5 pb-5">
              <p className="text-[13px] leading-6 text-[#49423D]">{brief.angle}</p>
            </div>
          </Card>

          <Card>
            <CardHead title="Suggested structure" subtitle="Sections in order, with what each one needs to contain" />
            <ol className="divide-y divide-[rgba(55,50,47,0.06)]">
              {brief.outline.map((section, index) => (
                <li key={section.heading} className="flex gap-3 px-5 py-3.5">
                  <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(55,50,47,0.06)] text-[11px] font-semibold text-[#605A57]">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-[13px] font-semibold text-[#37322F]">{section.heading}</div>
                    <div className="mt-0.5 text-[13px] leading-5 text-[#605A57]">{section.detail}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <CardHead title="Must include to be citable" subtitle="Without these the page will not be quoted" />
            <ul className="flex flex-col gap-2 px-5 pb-5">
              {brief.mustInclude.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13px] leading-5 text-[#49423D]">
                  <span className="mt-[2px] text-[#1f6b1f]" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHead title="Brief detail" />
            <div className="px-5 pb-5">
              <DefList
                items={[
                  { label: "Id", value: brief.id },
                  { label: "Type", value: type?.label ?? brief.type },
                  { label: "Target path", value: <span className="font-mono text-[12px]">{brief.targetPath}</span> },
                  { label: "Owner", value: brief.owner },
                  { label: "Length", value: brief.wordCount },
                  { label: "Started", value: brief.startedAt ? formatDate(brief.startedAt) : "—" },
                  { label: "Published", value: brief.completedAt ? formatDate(brief.completedAt) : "—" },
                ]}
              />
            </div>
          </Card>

          <Card>
            <CardHead title="Audience" />
            <div className="px-5 pb-5">
              <p className="text-[13px] leading-6 text-[#49423D]">{brief.audience}</p>
            </div>
          </Card>

          <Card>
            <CardHead title="Target prompts" subtitle="What this page is written to win" />
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
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <AppearanceBadge appeared={prompt.responses.some((r) => r.appeared)} />
                      <span className="text-[12px] text-[rgba(73,66,61,0.62)]">
                        {formatNumber(prompt.monthlyVolume)}/mo
                      </span>
                    </div>
                  </li>
                ) : null,
              )}
            </ul>
          </Card>

          {brief.competingPages.length > 0 && (
            <Card>
              <CardHead title="Pages you are competing with" subtitle="Currently cited for these prompts" />
              <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
                {brief.competingPages.map((page) => (
                  <li key={page.url} className="px-5 py-3">
                    <div className="text-[13px] font-medium text-[#37322F]">{page.brand}</div>
                    <div className="mt-0.5 break-all font-mono text-[11px] text-[rgba(73,66,61,0.55)]">{page.url}</div>
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
