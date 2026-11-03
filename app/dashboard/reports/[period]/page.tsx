import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { competitorBySlug, monthlyReports, reportByPeriod } from "@/lib/mock"
import {
  Card,
  CardHead,
  Crumbs,
  Delta,
  LinkButton,
  NoteCallout,
  PageHeader,
  SectionTitle,
  Tag,
  formatDate,
} from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"

/** Only ids present in the dataset exist — anything else is a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return monthlyReports.map((r) => ({ period: r.period }))
}

export function generateMetadata({ params }: { params: { period: string } }): Metadata {
  const report = reportByPeriod(params.period)
  return { title: report ? `${report.label} report` : "Report" }
}

export default function ReportDetailPage({ params }: { params: { period: string } }) {
  const report = reportByPeriod(params.period)
  if (!report) notFound()

  const index = monthlyReports.findIndex((r) => r.period === report.period)
  const previous = monthlyReports[index + 1]
  const next = monthlyReports[index - 1]

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Progress & reports", href: "/dashboard/reports" },
            { label: report.label },
          ]}
        />
        <PageHeader
          eyebrow="Monthly performance report"
          title={report.label}
          description={report.summary}
          actions={
            <>
              {previous && <LinkButton href={`/dashboard/reports/${previous.period}`}>← {previous.label}</LinkButton>}
              {next && <LinkButton href={`/dashboard/reports/${next.period}`}>{next.label} →</LinkButton>}
            </>
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <Tag>Published {formatDate(report.publishedAt)}</Tag>
          <Tag>Compared against {previous ? previous.label : "the previous period"}</Tag>
        </div>
      </div>

      {/* Metrics */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {report.metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[rgba(73,66,61,0.55)]">
              {metric.label}
            </div>
            <div className="mt-2 text-[22px] font-semibold leading-none text-[#37322F]">{metric.value}</div>
            <div className="mt-1.5">
              <Delta value={metric.delta} unit={metric.unit} />
            </div>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="What shipped this period" />
          <div className="px-5 pb-5">
            {report.shipped.length ? (
              <ul className="flex flex-col divide-y divide-[rgba(55,50,47,0.06)]">
                {report.shipped.map((item) => (
                  <li key={item.title} className="flex items-start justify-between gap-3 py-2.5 first:pt-0">
                    <Link href={item.href} className="text-[13px] font-medium text-[#37322F] hover:underline">
                      {item.title}
                    </Link>
                    {typeof item.points === "number" && <Delta value={item.points} unit="pts" />}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] leading-6 text-[#605A57]">
                Nothing new was published this period. The movement came from previously shipped pages maturing in each
                engine's index.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <CardHead title="What moved against you" />
          <div className="px-5 pb-5">
            <ul className="flex flex-col gap-2.5">
              {report.risks.map((risk) => (
                <li key={risk} className="flex gap-2.5 text-[13px] leading-5 text-[#49423D]">
                  <span className="mt-[2px] text-[#9c2626]" aria-hidden>
                    !
                  </span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle title="Competitor movement" description="Share-of-voice change over the period." />
        <Card className="p-5">
          <RankedBars
            max={4}
            rows={report.competitorMovement.map((movement) => {
              const competitor = competitorBySlug(movement.slug)
              return {
                key: movement.slug,
                label: movement.brand,
                value: Math.abs(movement.change),
                valueLabel: `${movement.change > 0 ? "+" : ""}${movement.change} pts`,
                color: competitor?.color ?? "#898781",
                caption: movement.note,
                href: `/dashboard/competitors/${movement.slug}`,
              }
            })}
          />
          <p className="mt-4 text-[12px] leading-[19px] text-[rgba(73,66,61,0.62)]">
            Bars show the size of the change; the label carries its direction. A rising competitor share is movement
            against you.
          </p>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle title="Plan for the next period" />
        <Card className="p-5">
          <ol className="flex flex-col gap-3">
            {report.nextPeriod.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(55,50,47,0.06)] text-[11px] font-semibold text-[#605A57]">
                  {index + 1}
                </span>
                <span className="text-[13px] leading-5 text-[#49423D]">{item}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 border-t border-[rgba(55,50,47,0.06)] pt-4">
            <NoteCallout tone="info" title="Continuous monitoring">
              The next crawl runs automatically and every tracked prompt is re-sampled weekly. New opportunities appear
              in{" "}
              <Link href="/dashboard/recommendations" className="font-medium underline">
                GEO recommendations
              </Link>{" "}
              as soon as the analysis finds them.
            </NoteCallout>
          </div>
        </Card>
      </section>
    </div>
  )
}
