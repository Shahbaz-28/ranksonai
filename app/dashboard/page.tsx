import Link from "next/link"

import {
  alerts,
  business,
  competitors,
  exclusionCauses,
  gapPrompts,
  kpis,
  ourRank,
  platforms,
  platformById,
  prompts,
  recentMentions,
  recommendations,
  us,
  visibilityTrend,
} from "@/lib/mock"
import {
  AppearanceBadge,
  Card,
  CardHead,
  Crumbs,
  Delta,
  LinkButton,
  PageHeader,
  PlatformChip,
  PriorityBadge,
  ScoreRing,
  SectionTitle,
  SeverityBadge,
  StatTile,
  TableWrap,
  Td,
  Th,
  formatDate,
  formatDateTime,
  formatNumber,
} from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import { TrendLines } from "@/components/dashboard/charts"
import { LiveStatus } from "@/components/dashboard/workflow"
import { series, severityStyles } from "@/components/dashboard/tokens"

const trendSpecs = [
  { key: "chatgpt", name: "ChatGPT", color: series.s1 },
  { key: "gemini", name: "Gemini", color: series.s2 },
  { key: "perplexity", name: "Perplexity", color: series.s3 },
]

export default function OverviewPage() {
  const nextActions = [...recommendations]
    .filter((r) => r.status !== "completed")
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 4)

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Overview" }]} />
        <PageHeader
          eyebrow="GEO performance"
          title={`${business.name} is mentioned in 38% of tracked buyer questions`}
          description={
            <>
              Across 240 buyer prompts and 5 AI engines. Visibility is up 4 points this month, but the three
              highest-intent pricing prompts still exclude you — see the issues below. Last crawl{" "}
              {formatDate(business.lastCrawl)}, next {formatDate(business.nextCrawl)}.
            </>
          }
          actions={
            <>
              <LinkButton href="/dashboard/recommendations" variant="primary">
                Review 4 actions
              </LinkButton>
              <LinkButton href="/dashboard/reports/2026-10">October report</LinkButton>
            </>
          }
        />
      </div>

      {/* KPI row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatTile
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            deltaUnit={kpi.deltaUnit}
            caption={kpi.caption}
            href={kpi.href}
          />
        ))}
      </section>

      {/* Trend + score */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead
            title="Visibility trend by engine"
            subtitle="Blended visibility score per engine, April – November 2026"
            action={
              <Link href="/dashboard/visibility" className="font-medium text-[#37322F] hover:underline">
                All engines →
              </Link>
            }
          />
          <div className="px-5 pb-5">
            <TrendLines data={visibilityTrend} specs={trendSpecs} suffix="" domain={[0, 80]} />
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHead title="Overall AI visibility" subtitle="Weighted across engines, prompts and citations" />
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 pb-5">
            <ScoreRing value={61} caption="Up from 31 at baseline in April 2026" />
            <dl className="w-full divide-y divide-[rgba(55,50,47,0.06)] text-[13px]">
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#605A57]">Best engine</dt>
                <dd className="font-medium text-[#37322F]">Perplexity · 67</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#605A57]">Weakest engine</dt>
                <dd className="font-medium text-[#37322F]">Copilot · 49</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#605A57]">Prompts won</dt>
                <dd className="font-medium text-[#37322F]">
                  {prompts.length - gapPrompts.length} of {prompts.length} sampled
                </dd>
              </div>
            </dl>
          </div>
        </Card>
      </section>

      {/* Platform + competitor comparison */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead
            title="Performance by AI platform"
            subtitle="Visibility score out of 100, with change versus October"
            action={
              <Link href="/dashboard/visibility" className="font-medium text-[#37322F] hover:underline">
                Detail →
              </Link>
            }
          />
          <div className="px-5 pb-5">
            <RankedBars
              rows={platforms.map((p) => ({
                key: p.id,
                label: p.name,
                value: p.score,
                color: p.color,
                delta: p.scoreDelta,
                deltaUnit: "pts",
                caption: `${p.mentionRate}% mention rate · ${p.citationRate}% citation rate`,
                href: `/dashboard/visibility/${p.id}`,
                highlight: false,
              }))}
              max={100}
            />
          </div>
        </Card>

        <Card>
          <CardHead
            title="Share of voice"
            subtitle={`Rank ${ourRank} of ${competitors.length} tracked brands across 240 prompts`}
            action={
              <Link href="/dashboard/competitors" className="font-medium text-[#37322F] hover:underline">
                Compare →
              </Link>
            }
          />
          <div className="px-5 pb-5">
            <RankedBars
              showRank
              rows={[...competitors]
                .sort((a, b) => b.shareOfVoice - a.shareOfVoice)
                .map((c) => ({
                  key: c.slug,
                  label: c.name,
                  value: c.shareOfVoice,
                  valueLabel: `${c.shareOfVoice}%`,
                  color: c.color,
                  delta: c.shareDelta,
                  deltaUnit: "pts",
                  href: c.isUs ? "/dashboard/competitors" : `/dashboard/competitors/${c.slug}`,
                  highlight: c.isUs,
                }))}
              max={35}
            />
          </div>
        </Card>
      </section>

      {/* Issues */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Issues requiring attention"
          description="Ranked by the buyer demand they block, not by severity alone."
          action={
            <Link href="/dashboard/audit" className="text-[13px] font-medium text-[#37322F] hover:underline">
              Full audit →
            </Link>
          }
        />
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {alerts.map((alert) => (
            <Card as="li" key={alert.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-start gap-3">
                <span
                  className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: severityStyles[alert.severity].dot }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  <h3 className="mt-2 text-[14px] font-semibold leading-5 text-[#37322F]">{alert.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-[21px] text-[#605A57]">{alert.detail}</p>
                </div>
              </div>
              <Link
                href={alert.href}
                className="mt-auto text-[13px] font-medium text-[#37322F] underline-offset-2 hover:underline"
              >
                {alert.cta} →
              </Link>
            </Card>
          ))}
        </ul>
      </section>

      {/* Next actions */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Recommended next actions"
          description="The four highest-impact items still open, with their current workflow state."
          action={
            <Link href="/dashboard/recommendations" className="text-[13px] font-medium text-[#37322F] hover:underline">
              All {recommendations.length} recommendations →
            </Link>
          }
        />
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Recommendation</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th align="right">Modelled impact</Th>
                <Th align="right">Owner</Th>
              </tr>
            </thead>
            <tbody>
              {nextActions.map((rec) => (
                <tr key={rec.id} className="transition-colors hover:bg-[rgba(55,50,47,0.015)]">
                  <Td>
                    <Link href={`/dashboard/recommendations/${rec.id}`} className="font-medium text-[#37322F] hover:underline">
                      {rec.title}
                    </Link>
                    <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">
                      {rec.affectedPrompts.length} prompt{rec.affectedPrompts.length === 1 ? "" : "s"} affected ·{" "}
                      {rec.category.replace("-", " ")}
                    </div>
                  </Td>
                  <Td>
                    <PriorityBadge priority={rec.priority} />
                  </Td>
                  <Td>
                    <LiveStatus kind="recommendation" id={rec.id} />
                  </Td>
                  <Td align="right">+{rec.impact} pts</Td>
                  <Td align="right">{rec.owner}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      </section>

      {/* Recent mentions + exclusion causes */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead
            title="Recent AI mentions"
            subtitle="Latest sampled answers, newest first"
            action={
              <Link href="/dashboard/prompts" className="font-medium text-[#37322F] hover:underline">
                All prompts →
              </Link>
            }
          />
          <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
            {recentMentions.map((mention) => {
              const platform = platformById(mention.platform)!
              return (
                <li key={mention.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <PlatformChip name={platform.name} color={platform.color} />
                    <AppearanceBadge appeared={mention.appeared} />
                    {mention.position && (
                      <span className="text-[11px] font-medium text-[rgba(73,66,61,0.62)]">
                        Position {mention.position}
                      </span>
                    )}
                    <span className="ml-auto text-[11px] text-[rgba(73,66,61,0.45)]">
                      {formatDateTime(mention.checkedAt)}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/prompts/${mention.promptId}`}
                    className="mt-2 block text-[13px] font-medium text-[#37322F] hover:underline"
                  >
                    {mention.question}
                  </Link>
                  <p className="mt-1.5 border-l-2 border-[rgba(55,50,47,0.12)] pl-3 text-[13px] leading-[21px] text-[#605A57]">
                    {mention.excerpt}
                  </p>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <CardHead
            title="Why you are being left out"
            subtitle={`${gapPrompts.length} of 20 sampled prompts never mention you`}
          />
          <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
            {exclusionCauses.map((cause) => (
              <li key={cause.cause} className="px-5 py-3.5">
                <Link href={cause.href} className="group block">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[13px] font-medium text-[#37322F] group-hover:underline">{cause.cause}</span>
                    <SeverityBadge severity={cause.severity} />
                  </div>
                  <div className="mt-1 text-[12px] text-[rgba(73,66,61,0.62)]">
                    {cause.prompts} prompt{cause.prompts === 1 ? "" : "s"} · {formatNumber(cause.volume)} monthly searches
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Baseline comparison */}
      <section>
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#37322F]">Since tracking began in April 2026</h3>
              <p className="mt-1 text-[13px] text-[#605A57]">
                Seven months of work: crawler access restored, integration pages rebuilt, two marketplace listings
                completed.
              </p>
            </div>
            <dl className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { label: "Visibility", from: "31", to: "61", delta: 30 },
                { label: "Mention rate", from: "17%", to: "38%", delta: 21 },
                { label: "Citation rate", from: "8%", to: "25%", delta: 17 },
                { label: "Share of voice", from: "10.6%", to: `${us.shareOfVoice}%`, delta: 3.6 },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(73,66,61,0.55)]">
                    {item.label}
                  </dt>
                  <dd className="mt-1 flex items-baseline gap-2">
                    <span className="text-[13px] text-[rgba(73,66,61,0.55)] line-through">{item.from}</span>
                    <span className="text-[18px] font-semibold text-[#37322F]">{item.to}</span>
                    <Delta value={item.delta} unit="pts" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>
      </section>
    </div>
  )
}
