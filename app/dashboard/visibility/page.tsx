import Link from "next/link"
import type { Metadata } from "next"

import { citationRateTrend, mentionRateTrend, platforms, primaryPlatforms, prompts, visibilityTrend } from "@/lib/mock"
import {
  AppearanceBadge,
  Card,
  CardHead,
  Crumbs,
  Delta,
  Meter,
  PageHeader,
  PlatformChip,
  SectionTitle,
  StatTile,
  TableWrap,
  Td,
  Th,
  formatDateTime,
} from "@/components/dashboard/kit"
import { RankedBars } from "@/components/dashboard/bars"
import { TrendLines } from "@/components/dashboard/charts"
import { series } from "@/components/dashboard/tokens"

export const metadata: Metadata = { title: "AI visibility" }

const trendSpecs = [
  { key: "chatgpt", name: "ChatGPT", color: series.s1 },
  { key: "gemini", name: "Gemini", color: series.s2 },
  { key: "perplexity", name: "Perplexity", color: series.s3 },
]

/** Every sampled response, newest first, for the response inspector. */
const allResponses = prompts
  .flatMap((prompt) =>
    prompt.responses.map((response) => ({
      prompt,
      response,
      platform: platforms.find((p) => p.id === response.platform)!,
    })),
  )
  .sort((a, b) => b.response.checkedAt.localeCompare(a.response.checkedAt))

export default function VisibilityPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Crumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "AI visibility" }]} />
        <PageHeader
          eyebrow="AI visibility"
          title="How each engine answers for your category"
          description="Perplexity is your strongest engine and Copilot your weakest. Open an engine to read the individual answers it produced and see exactly where your brand was named or skipped."
        />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Blended visibility" value="61" delta={4} deltaUnit="pts" caption="Across 5 engines" />
        <StatTile label="Engines where you rank top 3" value="3 of 5" delta={1} deltaUnit="engine" caption="ChatGPT, Perplexity, Gemini" />
        <StatTile label="Avg position when listed" value="3.4" delta={-0.4} deltaUnit="places" caption="Lower is better" />
        <StatTile label="Responses sampled" value="330" delta={42} deltaUnit="responses" caption="Rolling 30 days" />
      </section>

      <Card>
        <CardHead
          title="Visibility by engine over time"
          subtitle="Primary engines, April – November 2026. Claude and Copilot are sampled at lower frequency."
        />
        <div className="px-5 pb-5">
          <TrendLines data={visibilityTrend} specs={trendSpecs} domain={[0, 80]} />
        </div>
      </Card>

      {/* Per-platform cards */}
      <section className="flex flex-col gap-3">
        <SectionTitle title="Platform performance" description="Open any engine for its answers, sources and prompt-level detail." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platforms.map((platform) => (
            <Card as="article" key={platform.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: platform.color }} aria-hidden />
                    <h3 className="text-[15px] font-semibold text-[#37322F]">{platform.name}</h3>
                    {!platform.primary && (
                      <span className="rounded-full bg-[rgba(55,50,47,0.06)] px-1.5 py-[1px] text-[10px] font-medium text-[rgba(73,66,61,0.62)]">
                        Low frequency
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[12px] text-[rgba(73,66,61,0.62)]">{platform.vendor}</div>
                </div>
                <div className="text-right">
                  <div className="text-[26px] font-semibold leading-none text-[#37322F]">{platform.score}</div>
                  <Delta value={platform.scoreDelta} unit="pts" className="mt-1" />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Meter
                  label="Brand mentions"
                  value={platform.mentionRate}
                  valueLabel={`${platform.mentionRate}%`}
                  color={platform.color}
                />
                <Meter
                  label="Recommended outright"
                  value={platform.recommendationRate}
                  valueLabel={`${platform.recommendationRate}%`}
                  color={platform.color}
                />
                <Meter
                  label="Cites harborflow.io"
                  value={platform.citationRate}
                  valueLabel={`${platform.citationRate}%`}
                  color={platform.color}
                />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[rgba(55,50,47,0.06)] pt-3 text-[12px]">
                <div>
                  <dt className="text-[rgba(73,66,61,0.55)]">Avg position</dt>
                  <dd className="font-semibold text-[#37322F]">{platform.avgPosition ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-[rgba(73,66,61,0.55)]">Top source</dt>
                  <dd className="font-semibold text-[#37322F]">{platform.topSource}</dd>
                </div>
              </dl>

              <p className="mt-3 text-[12px] leading-[19px] text-[#605A57]">{platform.behaviour}</p>

              <Link
                href={`/dashboard/visibility/${platform.id}`}
                className="mt-4 text-[13px] font-medium text-[#37322F] underline-offset-2 hover:underline"
              >
                Inspect {platform.name} answers →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Mention + citation trends */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="Brand mention rate" subtitle="Share of tracked prompts naming Harborflow" />
          <div className="px-5 pb-5">
            <TrendLines data={mentionRateTrend} specs={trendSpecs} suffix="%" domain={[0, 50]} height={200} />
          </div>
        </Card>
        <Card>
          <CardHead title="Citation rate" subtitle="Share of answers citing harborflow.io as a source" />
          <div className="px-5 pb-5">
            <TrendLines data={citationRateTrend} specs={trendSpecs} suffix="%" domain={[0, 40]} height={200} />
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHead title="Recommendation frequency" subtitle="How often an engine actively recommends you, not just mentions you" />
          <div className="px-5 pb-5">
            <RankedBars
              max={100}
              rows={platforms.map((p) => ({
                key: p.id,
                label: p.name,
                value: p.recommendationRate,
                valueLabel: `${p.recommendationRate}%`,
                color: p.color,
                caption: `${p.mentionRate}% mention rate — the gap is where you are named but not endorsed`,
                href: `/dashboard/visibility/${p.id}`,
              }))}
            />
          </div>
        </Card>
        <Card>
          <CardHead title="Position in listed answers" subtitle="Average rank when the engine returns a vendor list" />
          <div className="px-5 pb-5">
            <RankedBars
              max={6}
              rows={primaryPlatforms.map((p) => ({
                key: p.id,
                label: p.name,
                value: 6 - (p.avgPosition ?? 6),
                valueLabel: `#${p.avgPosition}`,
                color: p.color,
                caption: `Based on ${p.responsesSampled} sampled answers`,
                href: `/dashboard/visibility/${p.id}`,
              }))}
            />
            <p className="mt-4 text-[12px] leading-[19px] text-[rgba(73,66,61,0.62)]">
              Bars show distance from position 6, so a longer bar is a better rank. Perplexity lists you highest at 2.8.
            </p>
          </div>
        </Card>
      </section>

      {/* Response inspector */}
      <section className="flex flex-col gap-3">
        <SectionTitle
          title="Response inspector"
          description="Every sampled answer from the last run. Open a row to read the full answer and its citations."
          action={
            <Link href="/dashboard/prompts" className="text-[13px] font-medium text-[#37322F] hover:underline">
              Group by prompt →
            </Link>
          }
        />
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Engine</Th>
                <Th>Prompt</Th>
                <Th>Result</Th>
                <Th align="right">Position</Th>
                <Th align="right">Checked</Th>
              </tr>
            </thead>
            <tbody>
              {allResponses.slice(0, 14).map(({ prompt, response, platform }) => (
                <tr key={`${prompt.id}-${response.platform}`} className="transition-colors hover:bg-[rgba(55,50,47,0.015)]">
                  <Td>
                    <PlatformChip name={platform.name} color={platform.color} />
                  </Td>
                  <Td>
                    <Link href={`/dashboard/prompts/${prompt.id}`} className="font-medium text-[#37322F] hover:underline">
                      {prompt.question}
                    </Link>
                    <div className="mt-1 line-clamp-2 max-w-[520px] text-[12px] leading-[18px] text-[rgba(73,66,61,0.62)]">
                      {response.answer}
                    </div>
                  </Td>
                  <Td>
                    <AppearanceBadge appeared={response.appeared} />
                  </Td>
                  <Td align="right">{response.position ? `#${response.position}` : "—"}</Td>
                  <Td align="right" className="whitespace-nowrap">
                    {formatDateTime(response.checkedAt)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <div className="px-5 py-3 text-[12px] text-[rgba(73,66,61,0.62)]">
            Showing 14 of {allResponses.length} sampled responses from the 1 November run.
          </div>
        </Card>
      </section>
    </div>
  )
}
